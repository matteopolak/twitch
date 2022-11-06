import axios from 'axios';
import 'dotenv/config';
import { Channel } from './structures/Channel';

axios.defaults.baseURL = 'https://gql.twitch.tv';
axios.defaults.headers.post['Client-ID'] = process.env.CLIENT_ID;

async function main() {
	const channel = await Channel.fromUsername('atrioc');

	await channel.save();

	let skip = true;

	for await (const video of channel.videos()) {
		if (video.videoId === 1603227070) {
			skip = false;
		} else if (skip) continue;

		await video.save();
		await video.saveComments();
	}
}

main();
