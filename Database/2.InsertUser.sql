USE SecureStorageDB;
GO

CREATE OR ALTER PROCEDURE sp_CreateUser
    @FirstName NVARCHAR(100),
    @Lastname NVARCHAR(100),
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
    
    INSERT INTO Users (FirstName, LastName, Username, PasswordHash, Email)
    VALUES (@FirstName, @LastName, @Username, @PasswordHash, @Email);
END
