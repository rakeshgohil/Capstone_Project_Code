import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;
  users: any[] = []; // To store users from backend
  selectedUserIds: number[] = []; // Store selected users' IDs
  uploadMessage: string = '';
  apiUrl = environment.apiUrl;
  username: string | null = '';
  
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    
    this.username = localStorage.getItem('username');


    // If userid is null or empty, navigate to the login page
    if (!this.username) {
      this.router.navigate(['/login']);
    }

    this.loadUsers(); // Load users on component initialization
  }

  // Fetch the list of all users from the backend
  loadUsers() {
    this.http.get<any[]>(`${this.apiUrl}/users`).subscribe(
      response => {
        this.users = response; // Populate the users array
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Handle form submission and file upload
  uploadFile() {
    if (!this.selectedFile || this.selectedUserIds.length !== 4) {
      this.uploadMessage = 'Please select a file and exactly 4 users.';
      return;
    }

    const combinedUserIds = [localStorage.getItem('userid'), this.selectedUserIds].join(',');

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('userids', combinedUserIds); // Send selected user IDs + logged on userid
    formData.append('userid', localStorage.getItem('userid')?.toString() ?? '');

    this.http.post(`${this.apiUrl}/upload`, formData).subscribe({
      next: () => {
        this.uploadMessage = 'File uploaded and shared successfully!';
      },
      error: () => {
        this.uploadMessage = 'Error uploading file. Please try again.';
      },
      complete: () => {
        console.log('File upload request complete');
      }
    });    
  }

  // Handle user selection (limit to exactly 5)
  onUserSelect(userId: number, event: any) {
    if (event.target.checked) {
      if (this.selectedUserIds.length < 5) {
        this.selectedUserIds.push(userId); // Add user ID to selected list
      } else {
        event.target.checked = false; // Deselect the checkbox if 5 users are already selected
      }
    } else {
      const index = this.selectedUserIds.indexOf(userId);
      if (index > -1) {
        this.selectedUserIds.splice(index, 1); // Remove user ID from selected list
      }
    }
  }
}
