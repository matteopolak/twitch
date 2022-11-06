-- Does not take into account BTTV and FFZ emotes, only Twitch emotes
SELECT "comments"."text", COUNT(*) AS count FROM (
	SELECT "CommentFragment"."text"
		FROM "CommentFragment"
		WHERE "CommentFragment"."emote" IS NOT NULL
		GROUP BY "CommentFragment"."text", "CommentFragment"."commentId"
) "comments"
	GROUP BY "comments"."text"
	ORDER BY COUNT(*) DESC;
