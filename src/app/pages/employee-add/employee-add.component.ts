import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  EmployeeService,
  GROUP_OPTIONS,
  STATUS_OPTIONS,
} from '@services/employee.service';
import { ToastService } from '@services/toast.service';
import { SearchableSelectComponent } from '@components/searchable-select/searchable-select.component';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableSelectComponent],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss',
})
export class EmployeeAddComponent {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  groupOptions = GROUP_OPTIONS;
  statusOptions = STATUS_OPTIONS;
  today = new Date().toISOString().split('T')[0];

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: [
      '',
      [Validators.required, this.notInFutureValidator.bind(this)],
    ],
    basicSalary: [
      null as number | null,
      [Validators.required, Validators.min(1)],
    ],
    status: ['', [Validators.required]],
    group: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  private notInFutureValidator(control: { value: string }) {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return selected > now ? { futureDate: true } : null;
  }

  get f() {
    return this.form.controls;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.show(
        'Please complete all required fields correctly.',
        'error',
      );
      return;
    }

    const raw = this.form.getRawValue();
    this.employeeService.add({
      username: raw.username,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      birthDate: raw.birthDate,
      basicSalary: Number(raw.basicSalary),
      status: raw.status,
      group: raw.group,
      description: raw.description,
    });

    this.toastService.show(
      `Employee "${raw.firstName} ${raw.lastName}" added successfully.`,
      'success',
    );
    this.router.navigate(['/employees']);
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
