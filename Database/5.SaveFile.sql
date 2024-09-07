USE SecureStorageDB;
GO

CREATE OR ALTER PROCEDURE sp_SaveFile
    @FileName NVARCHAR(255),
    @FilePath NVARCHAR(255),
    @UserId INT,
	@Secret NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Files ([FileName], FilePath, UploadedBy, [Secret])
    VALUES (@FileName, @FilePath, @UserId, @Secret);
END
