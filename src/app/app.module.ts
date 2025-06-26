import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';

@NgModule({
  imports: [BrowserModule, CommonModule, ReactiveFormsModule, CustomerDetailsComponent],
  exports: [CustomerDetailsComponent]
})
export class AppModule {} 