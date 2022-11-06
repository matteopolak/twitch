SELECT word, COUNT(*)
	FROM "CommentFragment", UNNEST(STRING_TO_ARRAY("CommentFragment"."text", ' ')) word
	WHERE word != ''
	GROUP BY word
	ORDER BY COUNT(*) DESC;
