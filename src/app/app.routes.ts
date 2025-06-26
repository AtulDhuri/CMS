import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { EnquiryFormComponent } from './enquiry-form/enquiry-form.component';
import { PendingCustomersComponent } from './pending-customers/pending-customers.component';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { CustomersComponent } from './customers/customers.component';

export const routes: Routes = [
  { path: '', component: LoginFormComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { path: 'dashboard', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'enquiry', component: EnquiryFormComponent, canActivate: [AuthGuard] },
  { path: 'pending-customers', component: PendingCustomersComponent, canActivate: [AuthGuard] },
  { path: 'customer-details/:mobile', component: CustomerDetailsComponent, canActivate: [AuthGuard] },
  { path: 'customer-details', component: CustomerDetailsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

console.log('Routes loaded:', routes);
