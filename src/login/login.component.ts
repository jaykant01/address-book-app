import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = {email: '', password: ''};
  errorMessage: string= '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.errorMessage = '';
    const { email, password } = this.loginData;
    this.authService.login(email, password).subscribe({
      next: response => {
        const token = response.token;
        localStorage.setItem('token', token);

        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.errors?.message || 'Login failed.';
      }
    })
  }

}
