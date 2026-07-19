-- Migration 0001: Remove the unused `password` column from iam_users
-- Context: Auth was switched to passwordless (Google + email OTP), so the
-- column is no longer written or read by the application.
--
-- This script is idempotent and safe to re-run. It only applies on
-- environments where TypeORM `synchronize` is disabled (e.g. production),
-- since `synchronize: true` already drops the column automatically.
--
-- How to run (example):
--   psql "$DATABASE_URL" -f backend/migrations/0001_drop_iam_users_password.sql
-- or with your migration tool of choice.

ALTER TABLE iam_users DROP COLUMN IF EXISTS password;

-- The PasswordResetTokenEntity was removed during the passwordless refactor,
-- leaving this table orphaned. Drop it to fully remove password-related data.
DROP TABLE IF EXISTS iam_password_reset_tokens;
