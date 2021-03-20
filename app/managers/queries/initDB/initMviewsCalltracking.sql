CREATE TABLE IF NOT EXISTS mviews.calltracking
(
    `EventDate`               Date,
    `date_time`               DateTime,
    `web_id`                  UInt32,
    `user_id`                 UInt32,
    `event_id`                Array(UInt16),
    `calltracking_product_id` Array(UInt8),
    `owner_id`                Array(UInt32),
    `proposal_id`             Array(UInt32),
    `call_status`             UInt8
) ENGINE = MergeTree(EventDate, (web_id, user_id), 8192);