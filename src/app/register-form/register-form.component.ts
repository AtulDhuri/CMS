import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;
  errorMsg = '';
  successMsg = '';
  roles = ['admin', 'user', 'salesperson'];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role: ['salesperson', Validators.required]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = '';

    if (this.registerForm.valid) {
      this.isLoading = true;
      const payload = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
        mobile: this.registerForm.value.mobile,
        role: this.registerForm.value.role
      };

      this.auth.register(payload).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMsg = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMsg = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
} 