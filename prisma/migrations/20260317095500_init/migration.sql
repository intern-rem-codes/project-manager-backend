/*
  Warnings:

  - You are about to drop the `client` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "client";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" DATETIME,
    "street" TEXT,
    "city" TEXT,
    "postalCode" TEXT,
    "country" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
