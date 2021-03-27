CREATE TABLE IF NOT EXISTS reports.transferred
(
    `id_user`    String,
    `id_report`  UUID,
    `created_at` Date DEFAULT now()
) ENGINE = MergeTree(created_at, id_report, 8192)
