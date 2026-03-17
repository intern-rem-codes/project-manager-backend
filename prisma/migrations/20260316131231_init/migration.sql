/*
  Warnings:

  - Added the required column `base64` to the `FileMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FileMetadata" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "project_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "base64" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "download_url" TEXT NOT NULL
);
INSERT INTO "new_FileMetadata" ("download_url", "file_name", "file_path", "file_size", "file_type", "id", "project_id", "updated_at", "uploaded_by") SELECT "download_url", "file_name", "file_path", "file_size", "file_type", "id", "project_id", "updated_at", "uploaded_by" FROM "FileMetadata";
DROP TABLE "FileMetadata";
ALTER TABLE "new_FileMetadata" RENAME TO "FileMetadata";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
