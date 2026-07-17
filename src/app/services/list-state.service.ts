import { Injectable } from '@angular/core';
import { SortDirection } from '../models/employee.model';

export interface EmployeeListState {
  nameSearch: string;
  groupSearch: string;
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: SortDirection;
}

const DEFAULT_STATE: EmployeeListState = {
  nameSearch: '',
  groupSearch: '',
  page: 1,
  pageSize: 10,
  sortField: '',
  sortDirection: 'asc'
};

/**
 * Holds the Employee List page's search/paging/sorting state in memory so that
 * navigating away (e.g. to Employee Detail) and back preserves the previous search.
 */
@Injectable({ providedIn: 'root' })
export class ListStateService {
  private state: EmployeeListState = { ...DEFAULT_STATE };

  getState(): EmployeeListState {
    return { ...this.state };
  }

  setState(partial: Partial<EmployeeListState>): void {
    this.state = { ...this.state, ...partial };
  }

  reset(): void {
    this.state = { ...DEFAULT_STATE };
  }
}
