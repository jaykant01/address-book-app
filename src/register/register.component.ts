import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {CommonModule, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule, CommonModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  signupData = {email: '', password: ''};
  successMessage= '';
  errorMessage= '';

  constructor(private authService: AuthService, private router: Router ) { }

  onSignup() {
    this.successMessage = '';
    this.errorMessage = '';

    const {email, password} = this.signupData;
    this.authService.signUp(email, password).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Please login';

        this.signupData = {email:'', password:''};
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Sign up failed try again';
      }
    });
  }
}
