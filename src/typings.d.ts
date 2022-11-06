export interface Edge<T> {
	cursor: string;
	node: T;
}

export interface GqlResponse<T> {
	data: T;
	extensions: RawExtension;
}

export interface EdgeContainer<T> {
	edges: Edge<T>[];
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		__typename: 'PageInfo';
	};
}

export interface RawCommentNode {
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

export type RawComment = EdgeContainer<RawCommentNode>;

export interface RawVideoContent {
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

export interface RawVideoNode {
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

export interface RawExtension {
	durationMilliseconds: number;
	operationName: 'VideoCommentsByOffsetOrCursor';
	requestID: string;
}

export interface RawTrackedUser {
	id: string;
	videos: null | EdgeContainer<RawVideoNode>;
	__typename: 'User';
}

export interface RawUser {
	id: string;
	login: string;
	bannerImageURL: string;
	displayName: string;
	displayBadges: {
		id: string;
		setID: string;
		version: string;
		title: string;
		image1x: string;
		image2x: string;
		image4x: string;
		clickAction: null;
		clickURL: null;
		description: string;
		__typename: 'Badge';
	}[];
	profileImageURL: string;
	createdAt: string;
	relationship: null;
	__typename: 'User';
}

export interface RawChannel {
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
