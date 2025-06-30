import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnquiryFormService, CustomerEnquiry } from './enquiry-form.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-enquiry-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './enquiry-form.component.html',
  styleUrl: './enquiry-form.component.scss'
})
export class EnquiryFormComponent implements OnInit {
  enquiryForm!: FormGroup;
  submitted = false;
  isLoading = false;

  // Income source options
  incomeSources = [
    { value: 'salary', label: 'Salary' },
    { value: 'business', label: 'Business' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'pension', label: 'Pension' },
    { value: 'investment', label: 'Investment' }
  ];

  // Reference options
  referenceOptions = [
    { value: 'social_media', label: 'Social Media' },
    { value: 'friend', label: 'Friend' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'website', label: 'Website' },
    { value: 'agent', label: 'Agent' }
  ];

  // Property interest options
  propertyInterests = [
    { value: 'studio-apt', label: 'Studio Apt', checked: false },
    { value: '1-bhk', label: '1 BHK', checked: false },
    { value: '2-bhk', label: '2 BHK', checked: false },
    { value: '3-bhk', label: '3 BHK', checked: false },
    { value: 'jodi-flat', label: 'JodiFlat', checked: false }
  ];

  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiryFormService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupReferenceValidation();
  }

  initForm(): void {
    this.enquiryForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      incomeSource: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.min(10000), Validators.max(10000000)]],
      budget: ['', [Validators.required, Validators.min(100000), Validators.max(100000000)]],
      reference: ['', Validators.required],
      referencePerson: [''],
      remarks: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      attendedBy: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(10), Validators.pattern('^[0-9]+$')]],
      propertyInterests: this.fb.group({
        'studio-apt': [false],
        '1-bhk': [false],
        '2-bhk': [false],
        '3-bhk': [false],
        'jodi-flat': [false]
      }, { validators: this.atLeastOneSelected })
    });

    // Initialize property interests array to match form controls
    this.propertyInterests.forEach(interest => {
      interest.checked = false;
    });
  }

  setupReferenceValidation(): void {
    // Watch for changes in reference field
    this.enquiryForm.get('reference')?.valueChanges.subscribe(value => {
      const referencePersonControl = this.enquiryForm.get('referencePerson');
      
      if (value === 'friend' || value === 'agent' || value === 'other') {
        referencePersonControl?.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      } else {
        referencePersonControl?.clearValidators();
        referencePersonControl?.setValue('');
      }
      
      referencePersonControl?.updateValueAndValidity();
    });
  }

  // Custom validator to ensure at least one property interest is selected
  atLeastOneSelected(group: FormGroup): {[key: string]: any} | null {
    const selected = Object.values(group.value).some(value => value === true);
    return selected ? null : { atLeastOneRequired: true };
  }

  // Getter methods for easy access to form controls
  get f() {
    return this.enquiryForm.controls;
  }

  get propertyInterestsGroup() {
    return this.enquiryForm.get('propertyInterests') as FormGroup;
  }

  // Check if reference person field should be shown
  shouldShowReferencePerson(): boolean {
    const referenceValue = this.enquiryForm.get('reference')?.value;
    return referenceValue === 'friend' || referenceValue === 'agent' || referenceValue === 'other';
  }

  // Handle checkbox changes
  onInterestChange(event: any, interest: string): void {
    const checked = event.target.checked;
    this.propertyInterestsGroup.patchValue({ [interest]: checked });
    // Trigger validation update
    this.propertyInterestsGroup.updateValueAndValidity();
  }

  // Check if at least one property interest is selected
  isAtLeastOneInterestSelected(): boolean {
    const interests = this.propertyInterestsGroup.value;
    return Object.values(interests).some(value => value === true);
  }

  // Format number with commas for display
  formatNumber(value: string): string {
    if (!value) return '';
    const num = parseInt(value.replace(/,/g, ''), 10);
    return num.toLocaleString('en-IN');
  }

  // Handle input formatting for numbers
  onNumberInput(event: any, fieldName: string): void {
    const input = event.target;
    let value = input.value.replace(/[^\d]/g, '');
    
    if (value) {
      const num = parseInt(value, 10);
      input.value = num.toLocaleString('en-IN');
      // Update form control with numeric value
      this.enquiryForm.get(fieldName)?.setValue(num);
    } else {
      // Set empty string instead of null for validation
      this.enquiryForm.get(fieldName)?.setValue('');
    }
  }

  // Handle blur event for number inputs to ensure proper validation
  onNumberBlur(event: any, fieldName: string): void {
    const input = event.target;
    const value = input.value.replace(/[^\d]/g, '');
    
    if (value) {
      const num = parseInt(value, 10);
      input.value = num.toLocaleString('en-IN');
      this.enquiryForm.get(fieldName)?.setValue(num);
    } else {
      this.enquiryForm.get(fieldName)?.setValue('');
    }
  }

  // Map form data to API payload format
  private mapFormDataToApiPayload(): CustomerEnquiry {
    const formValue = this.enquiryForm.value;
    
    // Map property interests to the expected format with proper null handling
    const propertyInterestsMap: { [key: string]: boolean } = {};
    
    // Ensure propertyInterests exists and has proper values
    if (formValue.propertyInterests) {
      Object.keys(formValue.propertyInterests).forEach(key => {
        // Ensure boolean values - convert null/undefined to false
        propertyInterestsMap[key] = Boolean(formValue.propertyInterests[key]);
      });
    } else {
      // If propertyInterests is null/undefined, set all to false
      this.propertyInterests.forEach(interest => {
        propertyInterestsMap[interest.value] = false;
      });
    }

    // Create remarks array with the required format
    const remarksArray = [{
      remark: formValue.remarks,
      attendedBy: formValue.attendedBy,
      visitDate: new Date().toISOString(),
      rating: Number(formValue.rating)
    }];

    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      mobile: formValue.mobile,
      address: formValue.address,
      age: formValue.age,
      incomeSource: formValue.incomeSource,
      income: formValue.monthlyIncome, // Map monthlyIncome to income
      budget: formValue.budget,
      reference: formValue.reference,
      referencePerson: formValue.referencePerson || undefined,
      propertyInterests: propertyInterestsMap,
      remarks: remarksArray
    };
  }

  onSubmit(): void {
    this.submitted = true;

    // Log form validation status for debugging
    console.log('Form valid:', this.enquiryForm.valid);
    console.log('Form errors:', this.enquiryForm.errors);
    console.log('Form value:', this.enquiryForm.value);
    
    // Check individual field errors
    Object.keys(this.enquiryForm.controls).forEach(key => {
      const control = this.enquiryForm.get(key);
      if (control?.errors) {
        console.log(`${key} errors:`, control.errors);
      }
    });

    if (this.enquiryForm.valid) {
      this.isLoading = true;
      
      const customerData = this.mapFormDataToApiPayload();
      
      console.log('Submitting customer enquiry:', customerData);
      
      this.enquiryService.submitCustomerEnquiry(customerData)
        .pipe(
          catchError((error) => {
            console.error('Error submitting enquiry:', error);
        //    alert('Error submitting enquiry. Please try again.');
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((response) => {
          if (response) {
            console.log('Enquiry submitted successfully:', response);
         //   alert('Enquiry form submitted successfully!');
            this.resetForm();
          }
        });
    } else {
      console.log('Form has validation errors');
      // Show specific validation errors to user
      this.showValidationErrors();
    }
  }

  // Show specific validation errors to user
  private showValidationErrors(): void {
    const errors: string[] = [];
    
    Object.keys(this.enquiryForm.controls).forEach(key => {
      const control = this.enquiryForm.get(key);
      if (control?.errors) {
        if (control.errors['required']) {
          errors.push(`${key} is required`);
        } else if (control.errors['minlength']) {
          errors.push(`${key} must be at least ${control.errors['minlength'].requiredLength} characters`);
        } else if (control.errors['maxlength']) {
          errors.push(`${key} cannot exceed ${control.errors['maxlength'].requiredLength} characters`);
        } else if (control.errors['min']) {
          errors.push(`${key} must be at least ${control.errors['min'].min}`);
        } else if (control.errors['max']) {
          errors.push(`${key} cannot exceed ${control.errors['max'].max}`);
        }
      }
    });

    // Check property interests validation
    if (this.propertyInterestsGroup.errors?.['atLeastOneRequired']) {
      errors.push('Please select at least one property type');
    }

    if (errors.length > 0) {
     // alert('Please fix the following errors:\n' + errors.join('\n'));
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.isLoading = false;
    this.enquiryForm.reset();
    
    // Reset property interests array
    this.propertyInterests.forEach(interest => {
      interest.checked = false;
    });
    
    // Ensure property interests form group is properly reset
    const propertyInterestsGroup = this.enquiryForm.get('propertyInterests') as FormGroup;
    if (propertyInterestsGroup) {
      propertyInterestsGroup.patchValue({
        'studio-apt': false,
        '1-bhk': false,
        '2-bhk': false,
        '3-bhk': false,
        'jodi-flat': false
      });
      propertyInterestsGroup.updateValueAndValidity();
    }
  }
}
