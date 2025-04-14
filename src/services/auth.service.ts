import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  signUp(email: string, password: string) {
    const body = {email, password};
    return this.http.post(`${environment.apiUrl}/signUp`, body);
  }

  login(email: string, password: string) {
    const body = {email, password};
    return this.http.post<{token: string}>(`${environment.apiUrl}/login`, body);
  }

    isLoggedIn(){
      return !! localStorage.getItem('token');
    }

    logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    }

    getToken(){
    return localStorage.getItem('token');
    }
}
