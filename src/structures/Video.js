"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../database");
const time_1 = require("../util/time");
class Video {
    data;
    videoId;
    constructor(data) {
        this.data = data;
        this.videoId = parseInt(data.id);
    }
    async *commentsBatch() {
        const payload = {
            operationName: 'VideoCommentsByOffsetOrCursor',
            variables: {
                videoID: this.data.id,
                contentOffsetSeconds: 0,
                cursor: undefined,
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: 'b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a',
                },
            },
        };
        let hasNext = true;
        while (hasNext) {
            const { data } = await axios_1.default.post('/gql', payload);
            if (data.data.video === null)
                break;
            yield data;
            hasNext = data.data.video.comments.pageInfo.hasNextPage;
            if (hasNext) {
                payload.variables.contentOffsetSeconds = undefined;
                payload.variables.cursor =
                    data.data.video.comments.edges.at(-1)?.cursor;
            }
        }
    }
    async *comments() {
        for await (const data of this.commentsBatch()) {
            yield* data.data.video.comments.edges;
        }
    }
    async save() {
        await database_1.prisma.video.upsert({
            where: { id: this.videoId },
            update: {},
            create: {
                id: this.videoId,
                authorId: parseInt(this.data.owner.id),
                createdAt: this.data.publishedAt,
            },
        });
    }
    async saveComments(verbose = true) {
        for await (const content of this.commentsBatch()) {
            const comments = [];
            const fragments = [];
            const users = new Map();
            const last = content.data.video.comments.edges.at(-1);
            const time = last?.node.contentOffsetSeconds ?? 0;
            for (const comment of content.data.video.comments.edges) {
                if (comment.node.commenter === null)
                    continue;
                const userId = parseInt(comment.node.commenter.id);
                comments.push({
                    id: comment.node.id,
                    userId,
                    videoId: this.videoId,
                    createdAt: comment.node.createdAt,
                });
                fragments.push(...comment.node.message.fragments.map((f, i) => ({
                    commentId: comment.node.id,
                    text: f.text,
                    emote: f.emote?.emoteID ?? null,
                    index: i,
                })));
                if (!users.has(userId)) {
                    users.set(userId, {
                        id: userId,
                        username: comment.node.commenter.displayName,
                    });
                }
            }
            await database_1.prisma.user.createMany({
                data: [...users.values()],
                skipDuplicates: true,
            });
            await database_1.prisma.comment.createMany({
                data: comments,
                skipDuplicates: true,
            });
            await database_1.prisma.commentFragment.createMany({
                data: fragments,
                skipDuplicates: true,
            });
            if (verbose) {
                console.info(`[${(0, time_1.formatSeconds)(time)} / ${(0, time_1.formatSeconds)(this.data.lengthSeconds)}] [${this.videoId}] Added ${users.size} users, ${comments.length} comments, ${fragments.length} fragments`);
            }
        }
    }
}
exports.Video = Video;
