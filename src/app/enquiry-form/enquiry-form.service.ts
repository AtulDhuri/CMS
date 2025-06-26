import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CustomerEnquiry {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: string;
  age: number;
  incomeSource: string;
  income: number;
  budget: number;
  reference: string;
  referencePerson?: string;
  propertyInterests: {
    [key: string]: boolean;
  };
  status?: string;
  submittedAt?: string;
  remarks: {
    remark: string;
    attendedBy: string;
    visitDate: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class EnquiryFormService {
  private apiUrl = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Submit customer enquiry data to the API
   * @param customerData - The customer enquiry data
   * @returns Observable of the API response
   */
  submitCustomerEnquiry(customerData: CustomerEnquiry): Observable<any> {
    return this.http.post(this.apiUrl, customerData);
  }

  /**
   * Get all customer enquiries (if needed for future use)
   * @returns Observable of customer enquiries array
   */
  getCustomerEnquiries(): Observable<CustomerEnquiry[]> {
    return this.http.get<CustomerEnquiry[]>(this.apiUrl);
  }

  /**
   * Get a specific customer enquiry by ID (if needed for future use)
   * @param id - Customer enquiry ID
   * @returns Observable of customer enquiry
   */
  getCustomerEnquiryById(id: string): Observable<CustomerEnquiry> {
    return this.http.get<CustomerEnquiry>(`${this.apiUrl}/${id}`);
  }

  getPendingCustomers(): Observable<CustomerEnquiry[]> {
    return this.http.get<CustomerEnquiry[]>(`${this.apiUrl}/customers/pending`).pipe(
      shareReplay(1)
    );
  }

  getCustomerById(id: string): Observable<CustomerEnquiry> {
    return this.http.get<CustomerEnquiry>(`${this.apiUrl}/customers/${id}`);
  }

  getCustomerByMobile(mobileNumber: string): Observable<CustomerEnquiry> {
    return this.http.get<CustomerEnquiry>(`${this.apiUrl}/mobile/${mobileNumber}`);
  }

  updateCustomer(id: string, payload: any) {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }
} 