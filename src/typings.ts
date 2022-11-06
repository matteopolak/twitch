interface Edge<T> {
	cursor: string;
	node: T;
}

interface RawCommentNode {
	id: string;
	commenter: null | {
		id: string;
		login: string;
		displayName: string;
		__typename: 'User';
	};
	contentOffsetSeconds: number;
	createdAt: string;
	message: {
		fragments: {
			emote: null | {
				id: string;
				emoteID: string;
				from: number;
				__typename: 'EmbeddedEmote';
			};
			text: string;
			__typename: 'VideoCommentMessageFragment';
		}[];
		userBadges: {
			id: string;
			setID: string;
			version: string;
			__typename: 'Badge';
		}[];
		userColor: null | string;
		__typename: 'VideoCommentMessage';
	};
	__typename: 'VideoComment';
}

interface RawComment {
	edges: Edge<RawCommentNode>[];
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		__typename: 'PageInfo';
	};
	__typename: 'VideoCommentConnection';
}

interface RawVideoContent {
	id: string;
	creator: {
		id: string;
		channel: {
			id: string;
			__typename: 'Channel';
		};
		__typename: 'User';
	};
	comments: RawComment;
	__typename: 'Video';
}

interface RawVideoNode {
	animatedPreviewURL: string;
	game: {
		boxArtURL: string;
		id: string;
		displayName: string;
		name: string;
		__typename: 'Game';
	};
	id: string;
	lengthSeconds: number;
	owner: {
		displayName: string;
		id: string;
		login: string;
		profileImageURL: string;
		primaryColorHex: string;
		__typename: 'User';
	};
	previewThumbnailURL: string;
	publishedAt: string;
	self: {
		isRestricted: boolean;
		viewingHistory: null;
		__typename: 'VideoSelfEdge';
	};
	title: string;
	viewCount: number;
	resourceRestriction: null;
	contentTags: {
		id: string;
		isLanguageTag: boolean;
		localizedName: string;
		tagName: string;
		__typename: 'Tag';
	}[];
	__typename: 'Video';
}

interface RawExtension {
	durationMilliseconds: number;
	operationName: 'VideoCommentsByOffsetOrCursor';
	requestID: string;
}

interface GqlResponse<T> {
	data: T;
	extensions: RawExtension;
}

interface RawUser {
	id: string;
	videos: {
		edges: Edge<RawVideoNode>[];
		pageInfo: {
			hasNextPage: boolean;
			__typename: 'PageInfo';
		};
		__typename: 'VideoConnection';
	};
	__typename: 'User';
}

interface RawChannel {
	id: string;
	login: string;
	isPartner: boolean;
	subscriptionProducts: {
		id: string;
		hasAdFree: boolean;
		__typename: 'SubscriptionProduct';
	}[];
	stream: null;
	hosting: null;
	self: null;
	broadcastSettings: {
		id: string;
		game: {
			id: string;
			name: string;
			__typename: 'Game';
		};
		__typename: 'BroadcastSettings';
	};
	__typename: 'User';
}
