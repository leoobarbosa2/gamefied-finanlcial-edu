-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bonusSessions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bonusSessionsDate" VARCHAR(10);
