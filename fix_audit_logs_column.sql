-- Fix audit_logs.auditable_id column type
-- Run this on production MySQL database

-- Change auditable_id from BIGINT to VARCHAR to support hashid strings
ALTER TABLE audit_logs MODIFY COLUMN auditable_id VARCHAR(255);

-- Verify the change
DESCRIBE audit_logs;
