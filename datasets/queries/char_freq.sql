SELECT LOWER("char"), COUNT(*)
	FROM "CommentFragment", UNNEST(REGEXP_SPLIT_TO_ARRAY("CommentFragment"."text", '')) "char"
	WHERE "char" != ''
	GROUP BY LOWER("char")
	ORDER BY COUNT(*) DESC;
