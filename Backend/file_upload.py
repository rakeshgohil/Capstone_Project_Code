import os
import secrets
import string
import pyodbc
from werkzeug.utils import secure_filename
from secretsharing import PlaintextToHexSecretSharer
from config import Config


class FileUpload:
    def __init__(self):
        self.databases = [Config.DB1, Config.DB2, Config.DB3, Config.DB4, Config.DB5]  # List of databases
        connection_string = f'DRIVER={{SQL Server}};SERVER={Config.SERVER};DATABASE={Config.DATABASE};UID={Config.USERNAME};PWD={Config.PASSWORD}'
        self.conn = pyodbc.connect(connection_string)
        self.cursor = self.conn.cursor()
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)

    def save_file_and_generate_secret(self, file, userids, userid):
        """Handle file saving, secret sharing, and storing information in SQL."""
		# Save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)
        try:            
            characters = string.ascii_letters + string.digits + string.punctuation
            secret = ''.join(secrets.choice(characters) for _ in range(64))
            print(filename, file_path, userid, secret)
            # Insert file info into the Files table

            self.cursor.execute('''
                EXEC sp_SaveFile @FileName=?, @FilePath=?, @UserId=?, @Secret=?
            ''', (filename, file_path, userid, secret))
            self.conn.commit()
				
			# Get the FileID of the uploaded file
            file_id = self.cursor.execute('SELECT @@IDENTITY').fetchone()[0]

            self.save_file_secret(file_id, userids, secret)

			# # Generate a random secret (for demo purposes, we use the filename as the secret)
            # secret = filename

			# # Split the secret into 5 parts, requiring 3 parts to reconstruct it
            # shares = PlaintextToHexSecretSharer.split_secret(secret, 5, 3)

			# # Store the secret parts in the FileSecrets table
            # for i in range(5):
            #     self.cursor.execute('''
			# 		INSERT INTO FileSecrets (FileID, UserId, SecretPart) 
			# 		VALUES (?, ?, ?);
			# 	''', (file_id, userids[i].strip(), shares[i]))
            # self.conn.commit()

            return {"message": "File uploaded and shared successfully!"}, 200
			
        except pyodbc.Error as e:
            print(str(e))
            return {"error": str(e)}, 500

    def save_file_secret(self, fileid, userids, secret):
        
        """Handle secret sharing, and storing information in SQL."""
        # Generate a random secret (for demo purposes, we use the filename as the secret)
        try:
            # Split the secret into 5 parts, requiring 3 parts to reconstruct it
            total_shares = 5  # Total number of shares
            threshold = 3     # Minimum number of shares required to reconstruct the secret

            # Split the secret into 5 shares, requiring 3 parts to reconstruct
            shares = PlaintextToHexSecretSharer.split_secret(secret, threshold, total_shares)

            # Store the secret parts in the FileSecrets table
            for i in range(5):
                print(f'share {i}')
                connection_string = f'DRIVER={{SQL Server}};SERVER={Config.SERVER};DATABASE={self.databases[i]};UID={Config.USERNAME};PWD={Config.PASSWORD}'
                print(connection_string)
                self.conn = pyodbc.connect(connection_string)
                self.cursor = self.conn.cursor()

                self.cursor.execute('''
                    INSERT INTO FileSecrets (FileID, UserId, SecretPart) 
                    VALUES (?, ?, ?);
                ''', (fileid, userids[i].strip(), shares[i]))
                self.conn.commit()            
            return {"message": "File secrets are created successfully!"}, 200			
        except pyodbc.Error as e:
            return {"error": str(e)}, 500
