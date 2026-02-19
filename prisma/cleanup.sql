DELETE FROM "Service"
WHERE id IN (
    SELECT id
    FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY title ORDER BY id) as row_num
        FROM "Service"
    ) t
    WHERE t.row_num > 1
);
