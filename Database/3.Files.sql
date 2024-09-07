USE SecureStorageDB
GO

CREATE TABLE Files (
    FileID INT IDENTITY(1,1) PRIMARY KEY,
    FileName NVARCHAR(255),
    FilePath NVARCHAR(255),
    UploadedBy INT FOREIGN KEY REFERENCES Users(UserID),  -- User who uploaded the file
    UploadedAt DATETIME DEFAULT GETDATE()
);

ALTER TABLE Files ADD [Secret] NVARCHAR(255)