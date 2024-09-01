import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  user = {
    username: '',
    password: '',
    email: ''
  };

  formSubmitted = false;
  userRegistered = false;
    
  errorMessage: string = '';
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerUser() {
    this.formSubmitted = true;
    // Perform password validation
    if (this.isPasswordValid(this.user.password)) {      
      this.errorMessage = '';
      if (this.user.username && this.user.password && this.user.email) {
        this.http.post(`${this.apiUrl}/register`, this.user)
          .pipe(
            catchError(error => {
              console.error('Error registering user:', error);
              this.errorMessage = 'Error registering user. Please try again.';
              return throwError(() => new Error(this.errorMessage));
            })
          )
          .subscribe(response => {            
            this.formSubmitted = false;
            this.userRegistered = true;
            console.log('User registered successfully:', response);
            this.errorMessage = 'User registered successfully.';
            this.user = { username: '', password: '', email: '' };
          });
      }
    }
  }

  isPasswordValid(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasSpecialCharacter && hasMinLength;
  }
}
