import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  submitted = false;
  isLoading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Optionally redirect or fetch user details
     //   alert('Login successful!');
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Login failed';
      }
    });
  }
} 