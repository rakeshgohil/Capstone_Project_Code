import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-file-download',
  templateUrl: './file-download.component.html',
  styleUrls: ['./file-download.component.css']
})
export class FileDownloadComponent implements OnInit {
  files: any[] = [];  // Store files linked to the logged-in user
  shares: string[] = ['', '', ''];  // Store the 3 shares entered by the user
  selectedFile: any = null;  // Store the selected file for download
  loggedInUserId: string | null = '';  // Store the logged-in user's ID
  apiUrl = environment.apiUrl;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loggedInUserId = localStorage.getItem('userid');  // Get the logged-in user ID from localStorage
    this.loadFiles();
  }

  // Load files associated with the logged-in user
  loadFiles() {
    this.http.get<any[]>(`${this.apiUrl}/user-files/${this.loggedInUserId}`).subscribe(
      response => {
        this.files = response;
        console.log(response);
      },
      error => {
        console.error('Error fetching files:', error);
      }
    );
  }

  // Handle file selection for download
  // Handle file selection for download
onFileSelect(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const selectedIndex = selectElement.selectedIndex-1;
  console.log(selectedIndex);
  // Ensure selectedIndex is valid before accessing files array
  if (selectedIndex >= 0 && selectedIndex < this.files.length) {
    this.selectedFile = this.files[selectedIndex];
    this.errorMessage = '';
  }
}


  // Submit the shares and validate before downloading
  submitShares() {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first.';
      return;
    }

    if (this.shares.some(share => share.trim() === '')) {
      this.errorMessage = 'Please enter all three shares.';
      return;
    }

    const payload = {
      fileId: this.selectedFile.FileID,
      shares: this.shares
    };

    this.http.post(`${this.apiUrl}/validate-shares`, payload).subscribe({
      next: (response: any) => {
        if (response.valid) {
          this.downloadFile(this.selectedFile);
        } else {
          this.errorMessage = 'Invalid shares. Unable to reconstruct the file secret.';
        }
      },
      error: (error) => {
        console.error('Error validating shares:', error);
        this.errorMessage = 'Error validating shares. Please try again.';
      }
    });
  }

  // Download the file if shares are valid
  downloadFile(file: any) {
    const downloadUrl = `${this.apiUrl}/download/${this.selectedFile.FileID}`;
    window.location.href = downloadUrl;
  }
}
