import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userData:any = null;
  errorMessage = '';

  constructor(private authService: AuthService,private  http: HttpClient) {}

  ngOnInit() {
    this.http.get(environment.apiUrl+ '/home').subscribe({
        next: (response: any) => {
          this.userData = response.user;
        },
          error:(err: any) => {
            console.error('Error getting home data',err);
            this.errorMessage = 'Could not load home Page';
          },
    });
  }

  onLogout(){
    this.authService.logout();
  }
}



