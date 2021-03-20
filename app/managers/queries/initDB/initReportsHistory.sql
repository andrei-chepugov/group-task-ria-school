CREATE TABLE IF NOT EXISTS reports.history
(
    `id`         UUID default generateUUIDv4(),
    `created_at` Date default now(),
    `request`    String
) ENGINE = MergeTree(created_at, id, 8192);