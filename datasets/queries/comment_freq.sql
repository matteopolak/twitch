SELECT "comments"."content", COUNT(*) AS count FROM (
	SELECT
		STRING_AGG(
			"CommentFragment"."text",
			'' ORDER BY "CommentFragment"."index" ASC
		) AS "content",
		"CommentFragment"."commentId"
	FROM "CommentFragment"
	WHERE "CommentFragment"."text" != ''
	GROUP BY "CommentFragment"."commentId"
) "comments"
	GROUP BY "comments"."content"
	ORDER BY COUNT(*) DESC
