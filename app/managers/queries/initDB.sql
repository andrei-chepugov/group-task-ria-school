CREATE DATABASE IF NOT EXISTS slon;

CREATE DATABASE IF NOT EXISTS mviews;

CREATE TABLE IF NOT EXISTS slon.r_tags_v2 (
  `EventDate` Date,
  `HourDate` UInt8,
  `MinuteDate` UInt8,
  `SecondDate` UInt8,
  `web_id` UInt32,
  `user_id` UInt32,
  `project_id` UInt16,
  `r_audience` String,
  `r_source` String,
  `r_medium` String,
  `r_campaign` String,
  `event_id` Array(UInt16)
) ENGINE = MergeTree(EventDate, (web_id, user_id), 8192);


CREATE TABLE IF NOT EXISTS mviews.calltracking (
  `EventDate` Date,
  `date_time` DateTime,
  `web_id` UInt32,
  `user_id` UInt32,
  `event_id` Array(UInt16),
  `calltracking_product_id` Array(UInt8),
  `owner_id` Array(UInt32),
  `proposal_id` Array(UInt32),
  `call_status` UInt8
) ENGINE = MergeTree(EventDate, (web_id, user_id), 8192);


CREATE TABLE IF NOT EXISTS slon.facts (
  `EventDate` Date,
  `HourDate` UInt8,
  `MinuteDate` UInt8,
  `SecondDate` UInt8,
  `project_id` UInt16,
  `web_id` UInt32,
  `user_id` UInt32,
  `event_id` Array(UInt16),
  `owner_id` Array(UInt32),
  `proposal_id` Array(UInt32),
  `conversion_value` UInt16,
  `marka_id` Array(UInt32)
) ENGINE = MergeTree(EventDate, (web_id, user_id), 8192);

