/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Customer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "client" (
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
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");
