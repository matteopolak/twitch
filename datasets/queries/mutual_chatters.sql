SELECT "words"."word", "words"."count"
	FROM (
		SELECT "word", COUNT(*) AS "count"
		FROM "CommentFragment",
		UNNEST(STRING_TO_ARRAY("CommentFragment"."text", ' ')) word
			WHERE word != ''
			GROUP BY word
		) "words"
	WHERE "words"."count" = 2
	ORDER BY "words"."count" DESC