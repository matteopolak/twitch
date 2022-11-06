SELECT SUM("comments"."count") AS count, "Comment"."userId" FROM (
	SELECT
		"CommentFragment"."commentId", COUNT(*) AS count
	FROM "CommentFragment"
	WHERE "CommentFragment"."text" LIKE '%youtube.com%'
	GROUP BY "CommentFragment"."commentId"
) "comments" LEFT JOIN "Comment"
	ON "Comment"."id" = "comments"."commentId"
	GROUP BY "Comment"."userId"
	ORDER BY SUM("comments"."count") DESC
	LIMIT 10
