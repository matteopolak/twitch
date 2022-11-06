import axios from 'axios';
import { prisma } from '../database';
import { Video } from './Video';

export class Channel {
	private data: RawChannel;
	private userId: number;

	constructor(data: RawChannel) {
		this.data = data;
		this.userId = parseInt(this.data.id);
	}

	public static async fromUsername(username: string) {
		const { data } = await axios.post<GqlResponse<{ user: RawChannel }>>(
			'/gql',
			{
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
						sha256Hash:
							'3fbf508886ff5e008cb94047acc752aad7428c07b6055995604de16c4b01160a',
					},
				},
			}
		);

		return new Channel(data.data.user);
	}

	public async *videos() {
		const payload = {
			operationName: 'FilterableVideoTower_Videos',
			variables: {
				limit: 30,
				channelOwnerLogin: this.data.login,
				broadcastType: 'ARCHIVE',
				videoSort: 'TIME',
				cursor: undefined as undefined | string,
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash:
						'a937f1d22e269e39a03b509f65a7490f9fc247d7f83d6ac1421523e3b68042cb',
				},
			},
		};

		let hasNext = true;

		while (hasNext) {
			const { data } = await axios.post<GqlResponse<{ user: RawUser }>>(
				'/gql',
				payload
			);

			const videos = data.data.user.videos.edges;

			for (const video of videos) {
				yield new Video(video.node);
			}

			if ((hasNext = data.data.user.videos.pageInfo.hasNextPage)) {
				payload.variables.cursor = data.data.user.videos.edges.at(-1)?.cursor;
			}
		}
	}

	public async save() {
		await prisma.user.upsert({
			where: { id: this.userId },
			update: {
				username: this.data.login,
			},
			create: {
				id: this.userId,
				username: this.data.login,
			},
		});
	}
}
