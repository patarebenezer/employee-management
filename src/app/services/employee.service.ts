import { Injectable } from '@angular/core';
import { Employee } from '@models/employee.model';

export const GROUP_OPTIONS: string[] = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Customer Support',
  'Product Management',
  'Legal',
  'Operations',
  'Quality Assurance',
];

export const STATUS_OPTIONS: string[] = [
  'Active',
  'Inactive',
  'Probation',
  'Resigned',
];

const FIRST_NAMES = [
  'Andi',
  'Budi',
  'Citra',
  'Dewi',
  'Eka',
  'Fajar',
  'Gita',
  'Hadi',
  'Indra',
  'Joko',
  'Kartika',
  'Lestari',
  'Made',
  'Nadia',
  'Oki',
  'Putri',
  'Rangga',
  'Sari',
  'Taufik',
  'Umi',
  'Vina',
  'Wahyu',
  'Yudi',
  'Zahra',
  'Agus',
  'Bayu',
  'Chandra',
  'Diana',
  'Erik',
  'Fitri',
];

const LAST_NAMES = [
  'Pratama',
  'Wijaya',
  'Santoso',
  'Kusuma',
  'Saputra',
  'Hidayat',
  'Setiawan',
  'Halim',
  'Nugroho',
  'Suryanto',
  'Firmansyah',
  'Ramadhan',
  'Utami',
  'Wardani',
  'Susanto',
  'Gunawan',
  'Permata',
  'Handayani',
  'Cahyono',
  'Iskandar',
];

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private employees: Employee[] = [];

  constructor() {
    this.employees = this.generateDummyEmployees(100);
  }

  private generateDummyEmployees(count: number): Employee[] {
    const list: Employee[] = [];
    for (let i = 1; i <= count; i++) {
      const first = FIRST_NAMES[i % FIRST_NAMES.length];
      const last = LAST_NAMES[i % LAST_NAMES.length];
      const group = GROUP_OPTIONS[i % GROUP_OPTIONS.length];
      const status = STATUS_OPTIONS[i % STATUS_OPTIONS.length];
      const year = 1970 + (i % 35);
      const month = (i % 12) + 1;
      const day = (i % 27) + 1;
      const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const descYear = 2020 + (i % 5);
      const description = `${descYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T09:00`;

      list.push({
        id: i,
        username: `${first.toLowerCase()}.${last.toLowerCase()}${i}`,
        firstName: first,
        lastName: last,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@company.com`,
        birthDate,
        basicSalary: 4000000 + ((i * 137) % 46) * 100000,
        status,
        group,
        description,
      });
    }
    return list;
  }

  getAll(): Employee[] {
    return this.employees;
  }

  getById(id: number): Employee | undefined {
    return this.employees.find((e) => e.id === id);
  }

  add(employee: Omit<Employee, 'id'>): Employee {
    const nextId = this.employees.length
      ? Math.max(...this.employees.map((e) => e.id)) + 1
      : 1;
    const newEmployee: Employee = { ...employee, id: nextId };
    // Newest employee shown first
    this.employees = [newEmployee, ...this.employees];
    return newEmployee;
  }

  /** Dummy delete: removes the row from the in-memory list only (per assessment spec, action is a dummy). */
  delete(id: number): void {
    this.employees = this.employees.filter((e) => e.id !== id);
  }
}
