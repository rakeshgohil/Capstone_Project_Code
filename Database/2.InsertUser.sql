USE SecureStorageDB;
GO

CREATE OR ALTER PROCEDURE sp_CreateUser
    @Username NVARCHAR(255),
    @PasswordHash VARBINARY(64),
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username OR Email = @Email)
    BEGIN
        THROW 50001, 'Username or Email already exists', 1;
    END
    
    INSERT INTO Users (Username, PasswordHash, Email)
    VALUES (@Username, @PasswordHash, @Email);
END
