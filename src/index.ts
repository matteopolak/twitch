import axios from 'axios';
import 'dotenv/config';
import { Channel } from './structures/Channel';

axios.defaults.baseURL = 'https://gql.twitch.tv';
axios.defaults.headers.post['Client-ID'] = process.env.CLIENT_ID;

async function main() {
	const channels = [
		await Channel.fromUsername('atrioc'),
		await Channel.fromUsername('linkus7'),
		await Channel.fromUsername('aspecticor'),
	];

	for (const channel of channels) {
		await channel.saveVideosAndComments();
	}
}

main();
