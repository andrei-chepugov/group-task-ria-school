CREATE TABLE IF NOT EXISTS slon.facts
(
    `EventDate`        Date,
    `HourDate`         UInt8,
    `MinuteDate`       UInt8,
    `SecondDate`       UInt8,
    `project_id`       UInt16,
    `web_id`           UInt32,
    `user_id`          UInt32,
    `event_id`         Array(UInt16),
    `owner_id`         Array(UInt32),
    `proposal_id`      Array(UInt32),
    `conversion_value` UInt16,
    `marka_id`         Array(UInt32)
) ENGINE = MergeTree(EventDate, (web_id, user_id), 8192);