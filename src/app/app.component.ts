import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Customer Lead Management';
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is authenticated on page refresh
    const isAuth = this.authService.isAuthenticated();
    this.isAuthenticated = isAuth;
    console.log('Initial auth status:', this.isAuthenticated);
    
    // Listen for authentication changes
    this.authService.authStatus$.subscribe((status: boolean) => {
      this.isAuthenticated = status;
      console.log('Auth status changed:', this.isAuthenticated);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
