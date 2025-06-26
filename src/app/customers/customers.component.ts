import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EnquiryFormService, CustomerEnquiry } from '../enquiry-form/enquiry-form.service';
import { EnquiryFormComponent } from "../enquiry-form/enquiry-form.component";
import { AppModule } from "../app.module";
import { CustomerDetailsComponent } from "../customer-details/customer-details.component";

@Component({
 // imports: [CommonModule, ReactiveFormsModule, EnquiryFormComponent, AppModule]
  imports: [CommonModule, ReactiveFormsModule, EnquiryFormComponent, CustomerDetailsComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit{
  mode: 'add' | 'search' = 'add';

  // Add New Customer (Enquiry) Form
  enquiryForm!: FormGroup;
  submitted = false;
  isLoading = false;
  addSuccessMsg = '';
  addErrorMsg = '';

  // Search Existing Customer
  searchForm: FormGroup;
  searchSubmitted = false;
  searchLoading = false;
  searchErrorMsg = '';
  foundCustomer: CustomerEnquiry | null = null;

  // For search/edit
  customerForm: FormGroup;
  newRemark = this.fb.control('', [Validators.required, Validators.minLength(5)]);
  newAttendedBy = this.fb.control('', [Validators.required, Validators.minLength(2)]);
  isUpdating = false;

  // Options (reuse from enquiry form)
  incomeSources = [
    { value: 'salary', label: 'Salary' },
    { value: 'business', label: 'Business' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'pension', label: 'Pension' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' }
  ];
  referenceOptions = [
    { value: 'social_media', label: 'Social Media' },
    { value: 'friend', label: 'Friend' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'website', label: 'Website' },
    { value: 'agent', label: 'Agent' },
    { value: 'other', label: 'Other' }
  ];
  propertyInterests = [
    { value: 'studio-apt', label: 'Studio Apt' },
    { value: '1-bhk', label: '1 BHK' },
    { value: '2-bhk', label: '2 BHK' },
    { value: '3-bhk', label: '3 BHK' },
    { value: 'jodi-flat', label: 'JodiFlat' }
  ];

  constructor(private fb: FormBuilder, private enquiryService: EnquiryFormService) {
    this.searchForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      incomeSource: ['', Validators.required],
      income: ['', [Validators.required, Validators.min(10000), Validators.max(10000000)]],
      budget: ['', [Validators.required, Validators.min(100000), Validators.max(100000000)]],
      reference: ['', Validators.required],
      referencePerson: [''],
      propertyInterests: this.fb.group({
        'studio-apt': [false],
        '1-bhk': [false],
        '2-bhk': [false],
        '3-bhk': [false],
        'jodi-flat': [false]
      }),
      remarks: [''],
      attendedBy: [''],
      status: [''],
      submittedAt: ['']
    });
  }

  ngOnInit(): void {
    this.initEnquiryForm();
    this.setupReferenceValidation();
  }

  // --- Enquiry Form Logic ---
  initEnquiryForm(): void {
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
      propertyInterests: this.fb.group({
        'studio-apt': [false],
        '1-bhk': [false],
        '2-bhk': [false],
        '3-bhk': [false],
        'jodi-flat': [false]
      }, { validators: this.atLeastOneSelected })
    });
  }

  setupReferenceValidation(): void {
    this.enquiryForm.get('reference')?.valueChanges.subscribe(value => {
      const referencePersonControl = this.enquiryForm.get('referencePerson');
      if (value === 'friend' || value === 'agent') {
        referencePersonControl?.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      } else {
        referencePersonControl?.clearValidators();
        referencePersonControl?.setValue('');
      }
      referencePersonControl?.updateValueAndValidity();
    });
  }

  atLeastOneSelected(group: FormGroup): {[key: string]: any} | null {
    const selected = Object.values(group.value).some(value => value === true);
    return selected ? null : { atLeastOneRequired: true };
  }

  get f() { return this.enquiryForm.controls; }
  get propertyInterestsGroup() { return this.enquiryForm.get('propertyInterests') as FormGroup; }
  get searchF() { return this.searchForm.controls; }

  shouldShowReferencePerson(): boolean {
    const referenceValue = this.enquiryForm.get('reference')?.value;
    return referenceValue === 'friend' || referenceValue === 'agent';
  }

  onInterestChange(event: any, interest: string): void {
    const checked = event.target.checked;
    this.propertyInterestsGroup.patchValue({ [interest]: checked });
    this.propertyInterestsGroup.updateValueAndValidity();
  }

  // --- Add New Customer ---
  onAddSubmit(): void {
    this.submitted = true;
    this.addErrorMsg = '';
    this.addSuccessMsg = '';
    if (this.enquiryForm.valid) {
      this.isLoading = true;
      const customerData = this.mapFormDataToApiPayload();
      this.enquiryService.submitCustomerEnquiry(customerData).subscribe({
        next: () => {
          this.isLoading = false;
          this.addSuccessMsg = 'Customer enquiry submitted successfully!';
          this.enquiryForm.reset();
          this.submitted = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.addErrorMsg = error.error?.message || 'Submission failed. Please try again.';
        }
      });
    }
  }

  // --- Search Existing Customer ---
  onSearchSubmit(): void {
    this.searchSubmitted = true;
    this.searchErrorMsg = '';
    this.foundCustomer = null;
    if (this.searchForm.valid) {
      this.searchLoading = true;
      const mobile = this.searchForm.value.mobileNumber;
      this.enquiryService.getCustomerByMobile(mobile).subscribe({
        next: (res: any) => {
          this.searchLoading = false;
          this.foundCustomer = res?.data || null;
          if (!this.foundCustomer) {
            this.searchErrorMsg = 'No customer found with this mobile number.';
          } else {
            this.populateCustomerForm(this.foundCustomer);
          }
        },
        error: (error) => {
          this.searchLoading = false;
          this.searchErrorMsg = error.error?.message || 'Search failed. Please try again.';
        }
      });
    }
  }

  populateCustomerForm(customer: CustomerEnquiry): void {
    this.customerForm.patchValue({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      mobile: customer.mobile,
      address: customer.address,
      age: customer.age,
      incomeSource: customer.incomeSource,
      income: customer.income,
      budget: customer.budget,
      reference: customer.reference,
      referencePerson: customer.referencePerson || '',
      status: customer.status || '',
      submittedAt: customer.submittedAt || ''
    });
    // Set property interests
    if (customer.propertyInterests) {
      const propertyInterestsGroup = this.customerForm.get('propertyInterests') as FormGroup;
      Object.keys(customer.propertyInterests).forEach(key => {
        if (propertyInterestsGroup.get(key)) {
          propertyInterestsGroup.get(key)?.setValue(customer.propertyInterests[key]);
        }
      });
    }
    // Set remarks and attendedBy from the first remark entry
    if (customer.remarks && customer.remarks.length > 0) {
      const firstRemark = customer.remarks[0];
      this.customerForm.patchValue({
        remarks: firstRemark.remark,
        attendedBy: firstRemark.attendedBy
      });
    }
    this.customerForm.get('remarks')?.enable();
    this.customerForm.get('attendedBy')?.enable();
  }

  updateCustomer(): void {
    if (this.newRemark.invalid || this.newAttendedBy.invalid) return;
    if (!this.foundCustomer?.id) {
      this.searchErrorMsg = 'Customer ID is missing.';
      return;
    }
    this.isUpdating = true;
    const updatedRemarks = [
      ...((this.foundCustomer?.remarks as any[]) || []),
      {
        remark: this.newRemark.value,
        attendedBy: this.newAttendedBy.value,
        visitDate: new Date().toISOString()
      }
    ];
    const formValue = this.customerForm.getRawValue();
    let referencePersonValue = null;
    if (formValue.reference === 'friend' || formValue.reference === 'agent') {
      referencePersonValue = formValue.referencePerson;
    }
    const payload: any = {
      id: this.foundCustomer.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      address: formValue.address,
      age: formValue.age,
      incomeSource: formValue.incomeSource,
      income: formValue.income,
      budget: formValue.budget,
      reference: formValue.reference,
      referencePerson: referencePersonValue,
      propertyInterests: formValue.propertyInterests,
      status: formValue.status,
      submittedAt: formValue.submittedAt,
      remarks: updatedRemarks
    };
    this.enquiryService.updateCustomer(this.foundCustomer.id, payload).subscribe({
      next: (res: any) => {
        this.isUpdating = false;
        this.newRemark.reset();
        this.newAttendedBy.reset();
        this.onSearchSubmit(); // Refresh details
      },
      error: (err: any) => {
        this.isUpdating = false;
        this.searchErrorMsg = err?.error?.message || 'Update failed';
      }
    });
  }

  // --- Utility ---
  private mapFormDataToApiPayload(): CustomerEnquiry {
    const formValue = this.enquiryForm.value;
    const propertyInterestsMap: { [key: string]: boolean } = {};
    if (formValue.propertyInterests) {
      Object.keys(formValue.propertyInterests).forEach(key => {
        propertyInterestsMap[key] = Boolean(formValue.propertyInterests[key]);
      });
    } else {
      this.propertyInterests.forEach(interest => {
        propertyInterestsMap[interest.value] = false;
      });
    }
    const remarksArray = [{
      remark: formValue.remarks,
      attendedBy: formValue.attendedBy,
      visitDate: new Date().toISOString()
    }];
    return {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      mobile: formValue.mobile,
      address: formValue.address,
      age: formValue.age,
      incomeSource: formValue.incomeSource,
      income: formValue.monthlyIncome,
      budget: formValue.budget,
      reference: formValue.reference,
      referencePerson: formValue.referencePerson || undefined,
      propertyInterests: propertyInterestsMap,
      remarks: remarksArray
    };
  }
}
