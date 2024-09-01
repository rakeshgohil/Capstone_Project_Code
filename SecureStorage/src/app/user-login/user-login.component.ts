import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  user = {
    username: '',
    password: ''
  };

  formSubmitted = false;
  errorMessage: string = '';
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  loginUser() {
    this.formSubmitted = true;

    if (this.user.username && this.user.password) {
      this.http.post(`${this.apiUrl}/login`, this.user)
        .pipe(
          catchError(error => {
            console.error('Error during login:', error);
            this.errorMessage = 'Login failed. Please check your credentials.';
            return throwError(() => new Error(this.errorMessage));
          })
        )
        .subscribe(response => {
          console.log('Login successful:', response);
          this.errorMessage = '';
          this.router.navigate(['/home']);
        });
    }
  }
}
