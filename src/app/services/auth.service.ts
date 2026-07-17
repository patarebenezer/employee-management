import { Injectable } from '@angular/core';

const AUTH_KEY = 'emp_mgmt_auth';

// Hard-coded credentials, as permitted by the assessment spec.
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(username: string, password: string): boolean {
    const isValid = username === VALID_USERNAME && password === VALID_PASSWORD;
    if (isValid) {
      sessionStorage.setItem(AUTH_KEY, 'true');
    }
    return isValid;
  }

  logout(): void {
    sessionStorage.removeItem(AUTH_KEY);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }
}
