CREATE TABLE IF NOT EXISTS slon.r_tags_v2
(
    `EventDate`  Date,
    `HourDate`   UInt8,
    `MinuteDate` UInt8,
    `SecondDate` UInt8,
    `web_id`     UInt32,
    `user_id`    UInt32,
    `project_id` UInt16,
    `r_audience` String,
    `r_source`   String,
    `r_medium`   String,
    `r_campaign` String,
    `event_id`   Array(UInt16)
) ENGINE = MergeTree(EventDate, (web_id, user_id), 8192);