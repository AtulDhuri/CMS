import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  popupForm: FormGroup;
  isVisible = true;

  constructor(private fb: FormBuilder) {
    this.popupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.popupForm.valid) {
      console.log('Form submitted:', this.popupForm.value);
      // Here you can add your submission logic
    //  alert('Thank you for your submission!');
      this.isVisible = false;
    } else {
      this.markFormGroupTouched();
    }
  }

  closePopup() {
    this.isVisible = false;
  }

  private markFormGroupTouched() {
    Object.keys(this.popupForm.controls).forEach(key => {
      const control = this.popupForm.get(key);
      control?.markAsTouched();
    });
  }

  get nameError() {
    const nameControl = this.popupForm.get('name');
    if (nameControl?.touched && nameControl?.errors) {
      if (nameControl.errors['required']) return 'Name is required';
      if (nameControl.errors['minlength']) return 'Name must be at least 2 characters';
    }
    return '';
  }

  get emailError() {
    const emailControl = this.popupForm.get('email');
    if (emailControl?.touched && emailControl?.errors) {
      if (emailControl.errors['required']) return 'Email is required';
      if (emailControl.errors['email']) return 'Please enter a valid email';
    }
    return '';
  }
} 