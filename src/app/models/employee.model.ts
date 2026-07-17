export interface Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string; // ISO date string (yyyy-MM-dd)
  basicSalary: number;
  status: string;
  group: string;
  description: string; // ISO datetime string, per spec attribute type "datetime"
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: keyof Employee | '';
  direction: SortDirection;
}
