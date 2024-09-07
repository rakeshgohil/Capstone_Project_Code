USE SecureStorageDB
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT FOREIGN KEY REFERENCES Files(FileID),    
    UserID INT FOREIGN KEY REFERENCES Users(UserID),  
    SecretPart NVARCHAR(255),  -- The secret part
    AssignedAt DATETIME DEFAULT GETDATE()
);

USE SecureStorageDB2
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT,    
    UserID INT,  -- Email of the user who gets the secret part
    SecretPart NVARCHAR(255),  -- The secret part
    AssignedAt DATETIME DEFAULT GETDATE()
);

USE SecureStorageDB3
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT,    
    UserID INT,  -- Email of the user who gets the secret part
    SecretPart NVARCHAR(255),  -- The secret part
    AssignedAt DATETIME DEFAULT GETDATE()
);

USE SecureStorageDB4
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT,    
    UserID INT,  -- Email of the user who gets the secret part
    SecretPart NVARCHAR(255),  -- The secret part
    AssignedAt DATETIME DEFAULT GETDATE()
);

USE SecureStorageDB5
GO

CREATE TABLE FileSecrets (
    SecretID INT IDENTITY(1,1) PRIMARY KEY,
    FileID INT,    
    UserID INT,  -- Email of the user who gets the secret part
    SecretPart NVARCHAR(255),  -- The secret part
    AssignedAt DATETIME DEFAULT GETDATE()
);
