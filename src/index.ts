import axios from 'axios';
import 'dotenv/config';
import { prisma } from './database';
import { Channel } from './structures/Channel';

axios.defaults.baseURL = 'https://gql.twitch.tv';
axios.defaults.headers.post['Client-ID'] = process.env.CLIENT_ID;

async function main() {
	const channel = await Channel.fromUsername('atrioc');

	await channel.save();

	const last = await prisma.video.findMany({
		where: {
			authorId: channel.userId,
		},
		orderBy: {
			createdAt: 'desc',
		},
		take: 1,
	});

	const skipUntil = last.at(-1)?.id;
	let skip = skipUntil !== undefined;

	for await (const video of channel.videos()) {
		if (skip) {
			if (video.videoId === skipUntil) {
				skip = false;
			} else {
				continue;
			}
		}

		await video.save();
		await video.saveComments();
	}
}

main();
