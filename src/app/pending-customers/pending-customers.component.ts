import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnquiryFormService, CustomerEnquiry } from '../enquiry-form/enquiry-form.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-customers.component.html',
  styleUrl: './pending-customers.component.scss'
})
export class PendingCustomersComponent implements OnInit {
  pendingCustomers$: Observable<CustomerEnquiry[]> | undefined;
  isLoading = false;
  errorMsg = '';

  constructor(private enquiryService: EnquiryFormService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPendingCustomers();
  }

  fetchPendingCustomers(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.pendingCustomers$ = this.enquiryService.getCustomerEnquiries().pipe(
      map(customers => {
        // Handle array or object with data property
        const arr = Array.isArray(customers)
          ? customers
          : (Array.isArray((customers as any).data) ? (customers as any).data : []);
        return arr.filter((c: any) => c.status === 'pending');
      }),
      shareReplay(1)
    );
    this.pendingCustomers$.subscribe({
      next: () => this.isLoading = false,
      error: err => {
        this.isLoading = false;
        this.errorMsg = err?.message || 'Failed to load records';
      }
    });
  }

  getInterests(interests: { [key: string]: boolean }): string {
    return Object.entries(interests)
      .filter(([_, v]) => v)
      .map(([k]) => k.replace(/-/g, ' ').toUpperCase())
      .join(', ') || '-';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN');
  }

  viewCustomerDetails(customer: CustomerEnquiry): void {
    // Assuming customer has an id field, if not, you might need to use a different identifier
    this.router.navigate(['/customer-details', customer.mobile || customer.mobile]);
  }
} 