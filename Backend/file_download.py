import pyodbc
from secretsharing import PlaintextToHexSecretSharer
from config import Config


class FileDownload:
    def __init__(self):
        self.databases = [Config.DB1, Config.DB2, Config.DB3, Config.DB4, Config.DB5]  # List of databases
        connection_string = f'DRIVER={{SQL Server}};SERVER={Config.SERVER};DATABASE={Config.DATABASE};UID={Config.USERNAME};PWD={Config.PASSWORD}'
        self.conn = pyodbc.connect(connection_string)
        self.cursor = self.conn.cursor()

    # Fetch files associated with the given user_id
    def get_user_files(self, user_id):
        try:

            fileIds =[]
            files =[]
            for i in range(5):
                connection_string = f'DRIVER={{SQL Server}};SERVER={Config.SERVER};DATABASE={self.databases[i]};UID={Config.USERNAME};PWD={Config.PASSWORD}'
                print(connection_string)
                self.conn = pyodbc.connect(connection_string)
                self.cursor = self.conn.cursor()

                query = '''
                    SELECT FileID FROM FileSecrets WHERE UserID = ?
                '''
                self.cursor.execute(query, user_id)
                result = self.cursor.fetchall()
                print(result)
                # Append the results to the files list
                for row in result:
                    fileIds.append(row[0])
                    
            if fileIds:
                placeholders = ','.join(['?'] * len(fileIds))
                connection_string = f'DRIVER={{SQL Server}};SERVER={Config.SERVER};DATABASE={Config.DATABASE};UID={Config.USERNAME};PWD={Config.PASSWORD}'
                print(connection_string)
                self.conn = pyodbc.connect(connection_string)
                self.cursor = self.conn.cursor()
                
                query = f'''
                    SELECT FileID, FileName FROM Files WHERE FileID IN ({placeholders})
                '''

                self.cursor.execute(query, fileIds)
                result = self.cursor.fetchall()    
                for row in result:
                    files.append({"Fileid": row[0], "FileName": row[1]})        

            print(files)
            return files        
        			
        except pyodbc.Error as e:
            print(str(e))
            return {"error": str(e)}, 500
        
    # Validate the shares and reconstruct the secret
    def validate_shares(self, fileId, shares):
        # Fetch the file's original secret from the database
        original_secret = self.get_file_secret(fileId)

        # Reconstruct the secret from the provided shares
        try:
            reconstructed_secret = PlaintextToHexSecretSharer.recover_secret(shares)
            print(reconstructed_secret, original_secret)
            return reconstructed_secret == original_secret
        except Exception as e:
            print(f"Error during share reconstruction: {e}")
            return False
        
    # Fetch the file secret from the database
    def get_file_secret(self, file_id):
        query = '''
            SELECT Secret FROM Files WHERE FileID = ?
        '''
        self.cursor.execute(query, file_id)
        result = self.cursor.fetchone()
        return result[0] if result else None

    # Fetch the file path based on the file_id
    def get_file_path(self, file_id):
        query = '''
            SELECT FilePath FROM Files WHERE FileID = ?
        '''
        self.cursor.execute(query, file_id)
        result = self.cursor.fetchone()
        if result:
            return result[0]  # Return the file path
        else:
            raise Exception("File not found")
        