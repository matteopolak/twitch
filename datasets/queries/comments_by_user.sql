SELECT "comments"."content" FROM (
	SELECT
		"CommentFragment"."commentId", COUNT(*), STRING_AGG(
			"CommentFragment"."text",
			'' ORDER BY "CommentFragment"."index" ASC
		) AS "content"
	FROM "CommentFragment"
	WHERE "CommentFragment"."text" LIKE '%youtube.com%'
	GROUP BY "CommentFragment"."commentId"
) "comments" LEFT JOIN "Comment"
	ON "Comment"."id" = "comments"."commentId"
	WHERE "Comment"."userId" = 29473285;
