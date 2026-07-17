export interface Employee {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  basicSalary: number;
  status: string;
  group: string;
  description: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: keyof Employee | '';
  direction: SortDirection;
}
