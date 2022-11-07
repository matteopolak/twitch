import { Prisma } from '@prisma/client';
import axios from 'axios';
import { prisma } from '../database';
import { RawVideoNode, GqlResponse, RawVideoContent } from '../typings';
import { formatSeconds } from '../util/time';

export class Video {
	public data: RawVideoNode;
	public videoId: bigint;

	constructor(data: RawVideoNode) {
		this.data = data;
		this.videoId = BigInt(data.id);
	}

	public async *commentsBatch() {
		const payload = {
			operationName: 'VideoCommentsByOffsetOrCursor',
			variables: {
				videoID: this.data.id,
				contentOffsetSeconds: 0 as undefined | number,
				cursor: undefined as undefined | string,
			},
			extensions: {
				persistedQuery: {
					version: 1,
					sha256Hash:
						'b70a3591ff0f4e0313d126c6a1502d79a1c02baebb288227c582044aa76adf6a',
				},
			},
		};

		let hasNext = true;

		while (hasNext) {
			const { data } = await axios.post<
				GqlResponse<{ video: RawVideoContent }>
			>('/gql', payload);

			if (data.data.video === null) break;

			yield data;

			hasNext = data.data.video.comments.pageInfo.hasNextPage;

			if (hasNext) {
				payload.variables.contentOffsetSeconds = undefined;
				payload.variables.cursor =
					data.data.video.comments.edges.at(-1)?.cursor;
			}
		}
	}

	public async *comments() {
		for await (const data of this.commentsBatch()) {
			yield* data.data.video.comments.edges;
		}
	}

	public async save() {
		await prisma.video.upsert({
			where: { id: this.videoId },
			update: {},
			create: {
				id: this.videoId,
				authorId: parseInt(this.data.owner.id),
				createdAt: this.data.publishedAt,
			},
		});
	}

	public async saveComments(verbose = true) {
		for await (const content of this.commentsBatch()) {
			const comments: Prisma.CommentCreateManyInput[] = [];
			const fragments: Prisma.CommentFragmentCreateManyInput[] = [];
			const users: Map<number, Prisma.UserCreateManyInput> = new Map();

			const last = content.data.video.comments.edges.at(-1);
			const time = last?.node.contentOffsetSeconds ?? 0;

			for (const comment of content.data.video.comments.edges) {
				if (comment.node.commenter === null) continue;

				const userId = parseInt(comment.node.commenter.id);

				comments.push({
					id: comment.node.id,
					userId,
					videoId: this.videoId,
					createdAt: comment.node.createdAt,
				});

				fragments.push(
					...comment.node.message.fragments.map((f, i) => ({
						commentId: comment.node.id,
						text: f.text,
						emote: f.emote?.emoteID ?? null,
						index: i,
					}))
				);

				if (!users.has(userId)) {
					users.set(userId, {
						id: userId,
						username: comment.node.commenter.displayName,
					});
				}
			}

			await prisma.user.createMany({
				data: [...users.values()],
				skipDuplicates: true,
			});

			await prisma.comment.createMany({
				data: comments,
				skipDuplicates: true,
			});

			await prisma.commentFragment.createMany({
				data: fragments,
				skipDuplicates: true,
			});

			if (verbose) {
				console.info(
					`[${formatSeconds(time)} / ${formatSeconds(
						this.data.lengthSeconds
					)}] [${this.videoId}] Added ${users.size} users, ${
						comments.length
					} comments, ${fragments.length} fragments`
				);
			}
		}
	}
}
