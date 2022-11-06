import axios from 'axios';
import 'dotenv/config';
import { prisma } from './database';
import { Channel } from './structures/Channel';

axios.defaults.baseURL = 'https://gql.twitch.tv';
axios.defaults.headers.post['Client-ID'] = process.env.CLIENT_ID;

async function main() {
	const channel = await Channel.fromUsername('atrioc');

	await channel.save();

	const end = await prisma.video.findMany({
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
