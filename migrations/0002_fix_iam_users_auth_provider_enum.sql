-- Migration 0002: Fix iam_users_authprovider_enum for passwordless refactor
--
-- Context: After switching auth to GOOGLE + EMAIL OTP, existing rows or enum types
-- in production PostgreSQL still contain legacy values (e.g. 'LOCAL'), causing
-- TypeORM synchronize to fail on boot with:
--   QueryFailedError: invalid input value for enum iam_users_authprovider_enum: "EMAIL"

-- 1. Remove default constraint on column first
ALTER TABLE iam_users ALTER COLUMN "authProvider" DROP DEFAULT;

-- 2. Temporarily alter the column type to varchar
ALTER TABLE iam_users ALTER COLUMN "authProvider" TYPE varchar USING "authProvider"::varchar;

-- 3. Update legacy values ('LOCAL', etc.) to 'EMAIL'
UPDATE iam_users SET "authProvider" = 'EMAIL' WHERE "authProvider" NOT IN ('GOOGLE', 'EMAIL');

-- 4. Re-create PostgreSQL enum type
DROP TYPE IF EXISTS iam_users_authprovider_enum;
CREATE TYPE iam_users_authprovider_enum AS ENUM ('GOOGLE', 'EMAIL');

-- 5. Restore column enum type and default
ALTER TABLE iam_users 
  ALTER COLUMN "authProvider" TYPE iam_users_authprovider_enum 
  USING "authProvider"::iam_users_authprovider_enum;

ALTER TABLE iam_users 
  ALTER COLUMN "authProvider" SET DEFAULT 'EMAIL'::iam_users_authprovider_enum;
