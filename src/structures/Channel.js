"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../database");
const Video_1 = require("./Video");
class Channel {
    user;
    data;
    userId;
    constructor(user, data) {
        this.user = user;
        this.data = data;
        this.userId = parseInt(this.data.id);
    }
    static async fromUsername(username) {
        const { data } = await axios_1.default.post('/gql', {
            operationName: 'PlayerTrackingContextQuery',
            variables: {
                channel: username,
                isLive: true,
                hasCollection: false,
                collectionID: '',
                videoID: '',
                hasVideo: false,
                slug: '',
                hasClip: false,
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '3fbf508886ff5e008cb94047acc752aad7428c07b6055995604de16c4b01160a',
                },
            },
        });
        const { data: user } = await axios_1.default.post('/gql', {
            operationName: 'ViewerCard',
            variables: {
                channelID: data.data.user.id,
                channelLogin: data.data.user.login,
                hasChannelID: true,
                giftRecipientLogin: data.data.user.login,
                isViewerBadgeCollectionEnabled: false,
                withStandardGifting: false,
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '20e51233313878f971daa32dfc039b2e2183822e62c13f47c48448d5d5e4f5e9',
                },
            },
        });
        return new Channel(user.data.targetUser, data.data.user);
    }
    async *videos() {
        const payload = {
            operationName: 'FilterableVideoTower_Videos',
            variables: {
                limit: 30,
                channelOwnerLogin: this.user.login,
                broadcastType: 'ARCHIVE',
                videoSort: 'TIME',
                cursor: undefined,
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: 'a937f1d22e269e39a03b509f65a7490f9fc247d7f83d6ac1421523e3b68042cb',
                },
            },
        };
        let hasNext = true;
        while (hasNext) {
            const { data } = await axios_1.default.post('/gql', payload);
            if (data.data.user.videos === null)
                continue;
            const videos = data.data.user.videos.edges;
            for (const video of videos) {
                yield new Video_1.Video(video.node);
            }
            if ((hasNext = data.data.user.videos.pageInfo.hasNextPage)) {
                payload.variables.cursor = data.data.user.videos.edges.at(-1)?.cursor;
            }
        }
    }
    async save() {
        await database_1.prisma.user.upsert({
            where: { id: this.userId },
            update: {
                username: this.user.login,
            },
            create: {
                id: this.userId,
                username: this.user.login,
                createdAt: this.user.createdAt,
            },
        });
    }
}
exports.Channel = Channel;
