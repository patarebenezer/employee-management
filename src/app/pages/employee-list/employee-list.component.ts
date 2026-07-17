import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee, SortDirection } from '@models/employee.model';
import { EmployeeService, GROUP_OPTIONS } from '@services/employee.service';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@services/toast.service';
import { ListStateService } from '@services/list-state.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private listState = inject(ListStateService);
  private router = inject(Router);

  groupOptions = GROUP_OPTIONS;
  pageSizeOptions = [5, 10, 20, 50];

  allEmployees: Employee[] = [];

  nameSearch = '';
  groupSearch = '';
  page = 1;
  pageSize = 10;
  sortField: keyof Employee | '' = '';
  sortDirection: SortDirection = 'asc';

  columns: { field: keyof Employee; label: string }[] = [
    { field: 'username', label: 'Username' },
    { field: 'firstName', label: 'First Name' },
    { field: 'lastName', label: 'Last Name' },
    { field: 'email', label: 'Email' },
    { field: 'group', label: 'Group' },
    { field: 'status', label: 'Status' },
    { field: 'basicSalary', label: 'Basic Salary' },
  ];

  ngOnInit(): void {
    this.allEmployees = this.employeeService.getAll();

    const saved = this.listState.getState();
    this.nameSearch = saved.nameSearch;
    this.groupSearch = saved.groupSearch;
    this.page = saved.page;
    this.pageSize = saved.pageSize;
    this.sortField = (saved.sortField as keyof Employee | '') || '';
    this.sortDirection = saved.sortDirection;
  }

  private persistState(): void {
    this.listState.setState({
      nameSearch: this.nameSearch,
      groupSearch: this.groupSearch,
      page: this.page,
      pageSize: this.pageSize,
      sortField: this.sortField as string,
      sortDirection: this.sortDirection,
    });
  }

  get filteredEmployees(): Employee[] {
    const name = this.nameSearch.trim().toLowerCase();
    const group = this.groupSearch.trim().toLowerCase();

    // AND rule: an employee must match ALL provided search parameters.
    let result = this.allEmployees.filter((e) => {
      const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchesName =
        !name ||
        fullName.includes(name) ||
        e.username.toLowerCase().includes(name);
      const matchesGroup = !group || e.group.toLowerCase().includes(group);
      return matchesName && matchesGroup;
    });

    if (this.sortField) {
      const field = this.sortField;
      const dir = this.sortDirection === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => {
        const av = a[field];
        const bv = b[field];
        if (typeof av === 'number' && typeof bv === 'number') {
          return (av - bv) * dir;
        }
        return String(av).localeCompare(String(bv)) * dir;
      });
    }

    return result;
  }

  get totalItems(): number {
    return this.filteredEmployees.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pagedEmployees(): Employee[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearchChange(): void {
    this.page = 1;
    this.persistState();
  }

  onPageSizeChange(): void {
    this.page = 1;
    this.persistState();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.persistState();
  }

  sortBy(field: keyof Employee): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.persistState();
  }

  sortIcon(field: keyof Employee): string {
    if (this.sortField !== field) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  goToAdd(): void {
    this.persistState();
    this.router.navigate(['/employees/add']);
  }

  goToDetail(employee: Employee): void {
    this.persistState();
    this.router.navigate(['/employees', employee.id]);
  }

  onEdit(employee: Employee, event: Event): void {
    event.stopPropagation();
    this.toastService.show(
      `Edit action triggered for ${employee.firstName} ${employee.lastName}`,
      'edit',
    );
  }

  onDelete(employee: Employee, event: Event): void {
    event.stopPropagation();
    this.employeeService.delete(employee.id);
    this.allEmployees = this.employeeService.getAll();
    if (this.page > this.totalPages) {
      this.page = this.totalPages;
      this.persistState();
    }
    this.toastService.show(
      `Delete action triggered for ${employee.firstName} ${employee.lastName}`,
      'delete',
    );
  }

  formatCurrency(value: number): string {
    return (
      'Rp. ' +
      value.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
