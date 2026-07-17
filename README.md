# Employee Management — Frontend Technical Assessment

A responsive Employee Management mini project built with **Angular 18** (standalone components), created for
the "Technical Assessment Backoffice - Frontend" test.

## Features

- **Login Page** — functional login using hard-coded credentials, with client-side validation and
  navigation to the Employee List on success.
- **Employee List Page**
  - 100 dummy employee records generated in-memory on app start.
  - Client-side **paging** with a configurable page size (5 / 10 / 20 / 50 rows).
  - Column **sorting** (click any column header to toggle ascending/descending).
  - **Searching** by two parameters combined with an **AND** rule: name/username AND group.
  - "Add Employee" button navigating to the Add Employee page.
  - Row-level **Edit** (yellow) and **Delete** (red) action buttons that trigger color-coded toast
    notifications (per the assessment spec, these are dummy actions — Delete additionally removes the
    row from the in-memory list for visual feedback, Edit does not mutate data).
  - Responsive layout: table on desktop, stacked cards on small screens.
- **Add Employee Page**
  - Form covering every `Employee` attribute from the spec; all fields are mandatory and the Save button
    is blocked until the form is valid.
  - Birth date uses a native date picker constrained to not exceed today.
  - Email format validation.
  - Basic salary restricted to numeric input.
  - Group is a searchable dropdown pre-filled with 10 dummy group names.
  - Save persists the new employee (shown at the top of the list) and Cancel returns to the list
    without saving.
- **Employee Detail Page**
  - Displays a single employee's data with formatted output (e.g. `basicSalary` shown as
    `Rp. xx.xxx,xx`).
  - "OK" button returns to the Employee List, and the previous search/sort/page state is preserved
    (kept in an in-memory `ListStateService`, not the URL).

## Tech Stack

- Angular 18 (standalone components, functional router guards, new `@if` / `@for` control flow)
- TypeScript, SCSS
- No backend / HTTP calls — all data (employees, groups) is generated and stored in memory via
  Angular services (`EmployeeService`), so a page refresh resets data to the original 100 dummy rows.

## Project Structure

```
src/app/
  models/              Employee interface & shared types
  services/            EmployeeService (dummy data + CRUD), AuthService, ToastService, ListStateService
  guards/               authGuard (route protection)
  components/           Reusable UI: ToastComponent, SearchableSelectComponent
  pages/
    login/               Login Page
    employee-list/       Employee List Page
    employee-add/        Add Employee Page
    employee-detail/     Employee Detail Page
```

## Login Credentials

Since the spec allows hard-coded login data:

```
Username: admin
Password: admin123
```

## Environment

- Node.js **18.x, 20.x, or 22.x** (Angular CLI 18 requirement)
- npm **9+**
- Angular CLI 18 (installed as a local devDependency — no global install required)

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   (equivalent to `ng serve`)
3. Open your browser at:
   ```
   http://localhost:4200
   ```
4. Log in with the credentials above.

## Build for Production

```bash
npm run build
```

Build artifacts are output to `dist/employee-management/`.

## Notes

- All data is dummy/in-memory per the assessment spec — there is no backend API.
- The `description` field is implemented as a `datetime-local` input to match the attribute type
  (`datetime`) given in the spec's Employee data schema.
