import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnquiryFormService, CustomerEnquiry } from '../enquiry-form/enquiry-form.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CustomerDetailsComponent implements OnInit {
  customerForm: FormGroup;
  searchForm: FormGroup;
  customer: CustomerEnquiry | null = null;
  isLoading = false;
  errorMsg = '';
  customerId: string = '';
  showSearchForm = true;
  newRemark = this.fb.control('', [Validators.required, Validators.minLength(5)]);
  newAttendedBy = this.fb.control('', [Validators.required, Validators.minLength(2)]);
  isUpdating = false;

  incomeSources = [
    'Salaried',
    'Business Owner',
    'Self Employed',
    'Freelancer',
    'Retired',
    'Student',
    'Other'
  ];

  referenceOptions = [
    'Advertisement',
    'Social Media',
    'Friend/Family',
    'Website',
    'Person',
    'Employee',
    'Other'
  ];

  propertyInterests = [
    { id: 'studio-apt', label: 'Studio Apartment' },
    { id: '1-bhk', label: '1 BHK' },
    { id: '2-bhk', label: '2 BHK' },
    { id: '3-bhk', label: '3 BHK' },
    { id: 'jodi-flat', label: 'Jodi Flat' }
  ];

  constructor(
    private fb: FormBuilder,
    private enquiryService: EnquiryFormService,
    private route: ActivatedRoute,
    private router: Router
  ) {
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

    this.searchForm = this.fb.group({
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.customerId = params['id'];
      if (this.customerId) {
        this.showSearchForm = false;
        this.fetchCustomerDetails();
      }
    });

    this.route.paramMap.subscribe(params => {
      const mobile = params.get('mobile');
      if (mobile) {
        this.searchForm.get('mobileNumber')?.setValue(mobile);
        this.searchByMobile();
      }
    });

    // Watch for reference field changes to show/hide referencePerson
    this.customerForm.get('reference')?.valueChanges.subscribe(value => {
      const referencePersonControl = this.customerForm.get('referencePerson');
      if (value === 'Person' || value === 'Employee') {
        referencePersonControl?.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(100)]);
      } else {
        referencePersonControl?.clearValidators();
      }
      referencePersonControl?.updateValueAndValidity();
    });
  }

  searchByMobile(): void {
    if (this.searchForm.valid) {
      const mobileNumber = this.searchForm.get('mobileNumber')?.value;
      this.fetchCustomerByMobile(mobileNumber);
    }
  }

  fetchCustomerByMobile(mobileNumber: string): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.enquiryService.getCustomerByMobile(mobileNumber).subscribe({
      next: (customer: any) => {
        this.customer = customer?.data;
        this.populateForm(customer?.data);
        this.isLoading = false;
        this.showSearchForm = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMsg = error.error?.message || 'No customer found with this mobile number';
      }
    });
  }

  fetchCustomerDetails(): void {
    this.isLoading = true;
    this.errorMsg = '';

    this.enquiryService.getCustomerById(this.customerId).subscribe({
      next: (customer: any) => {
        this.customer = customer?.data;
        this.populateForm(customer?.data);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMsg = error.error?.message || 'Failed to fetch customer details';
      }
    });
  }

  populateForm(customer: CustomerEnquiry | null): void {
    if (customer) {
      // Set basic form values
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
    }
  }

  resetSearch(): void {
    this.customer = null;
    this.errorMsg = '';
    this.showSearchForm = true;
    this.searchForm.reset();
    this.router.navigate(['/customer-details']);
  }

  get f() {
    return this.customerForm.controls;
  }

  get searchF() {
    return this.searchForm.controls;
  }

  get propertyInterestsGroup() {
    return this.customerForm.get('propertyInterests') as FormGroup;
  }

  shouldShowReferencePerson(): boolean {
    const reference = this.customerForm.get('reference')?.value;
    return reference === 'Person' || reference === 'Employee';
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined) value = 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN');
  }

  goBack(): void {
    this.router.navigate(['/pending-customers']);
  }

  editCustomer(): void {
    this.router.navigate(['/pending-customers']);
  }

  updateCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    if (!this.customer?.id) {
      this.errorMsg = 'Customer ID is missing.';
      return;
    }

    if ((this.newRemark.value || this.newAttendedBy.value) && (this.newRemark.invalid || this.newAttendedBy.invalid)) {
        this.newRemark.markAsTouched();
        this.newAttendedBy.markAsTouched();
        return;
    }

    this.isUpdating = true;
    
    const formValue = this.customerForm.getRawValue();

    const updatedRemarks = this.customer?.remarks ? [...(this.customer.remarks as any[])] : [];

    if (this.newRemark.value && this.newAttendedBy.value) {
      updatedRemarks.push({
        remark: this.newRemark.value,
        attendedBy: this.newAttendedBy.value,
        visitDate: new Date().toISOString()
      });
    }
    
    const payload: Partial<CustomerEnquiry> = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      mobile: formValue.mobile,
      address: formValue.address,
      age: formValue.age,
      incomeSource: formValue.incomeSource,
      income: formValue.income,
      budget: formValue.budget,
      reference: formValue.reference,
      referencePerson: formValue.referencePerson,
      propertyInterests: formValue.propertyInterests,
      status: formValue.status,
      remarks: updatedRemarks
    };

    this.enquiryService.updateCustomer(this.customer.id, payload).subscribe({
      next: () => {
        this.isUpdating = false;
        this.newRemark.reset();
        this.newAttendedBy.reset();
        if (this.customer?.mobile) {
          this.fetchCustomerByMobile(this.customer.mobile); // Refresh details
        }
      },
      error: (err) => {
        this.isUpdating = false;
        this.errorMsg = err?.error?.message || 'Update failed';
      }
    });
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
} 