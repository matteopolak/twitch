"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
require("dotenv/config");
const database_1 = require("./database");
const Channel_1 = require("./structures/Channel");
axios_1.default.defaults.baseURL = 'https://gql.twitch.tv';
axios_1.default.defaults.headers.post['Client-ID'] = process.env.CLIENT_ID;
async function main() {
    const channel = await Channel_1.Channel.fromUsername('atrioc');
    await channel.save();
    const end = await database_1.prisma.video.findMany({
        where: {
            authorId: channel.userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 1,
    });
    const continueUntil = end.at(-1)?.id;
    const videos = channel.videos();
    for await (const video of videos) {
        if (continueUntil !== undefined && video.videoId === continueUntil) {
            break;
        }
        await video.save();
        await video.saveComments();
    }
}
main();
