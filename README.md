# QAMind Playwright Automation

Playwright + TypeScript automation code built as a learning-focused QA automation project. The repository covers two practice application domains:

- Ecommerce practice app: `https://practice.qabrains.com/ecommerce`
- Local practice app: `http://localhost:5000`

The project is designed to practice code architecture, Page Object Model, component objects, fixtures, data-driven tests, API-assisted setup/teardown, and multi-role browser scenarios.

## Project Intent

This repository is not only a collection of automated tests. It is also a code design exercise.

The main goal is to demonstrate how a QA automation project can evolve from simple Playwright tests into a more organized structure with reusable objects, environment separation, API support, and readable test flows.

## Project Structure

```text
.
|-- API/                     # API clients for local app setup/teardown
|-- components/              # Reusable page components
|   |-- local_components/    # Components for local practice app
|-- constant/                # Route constants
|-- fixtures/                # Playwright fixture registration
|-- models/                  # Shared test data models
|-- pages/                   # Page Object Models
|   |-- local_page/          # Local practice app page objects
|-- steps/                   # Reusable business-level workflow/assertion steps
|-- test_data/               # JSON data and test files
|-- tests/
|   |-- DDT/                 # Data-driven tests
|   |-- e2e/                 # Ecommerce regression tests
|   |-- local/               # Local practice app tests
|   |-- step_show_case/      # Tests demonstrating reusable step helpers
|-- utils/                   # Shared helpers
|-- playwright.config.ts     # Playwright projects and environment config
```

## Environment Design

The code separates application paths from environment domains.

- `constant/routes.ts` stores relative paths such as `/login` and `/ecommerce/cart`.
- `playwright.config.ts` assigns a `baseURL` per Playwright project.
- `.env.prod` stores ecommerce environment values.
- `.env.local` stores local app values.

This keeps page objects independent from the execution environment.

Example `.env.prod`:

```env
ECOMMERCE_BASE_URL=https://practice.qabrains.com
ECOMMERCE_EMAIL=your-email
ECOMMERCE_PASSWORD=your-password
```

Example `.env.local`:

```env
LOCAL_BASE_URL=http://localhost:5000
LOCAL_ADMIN_EMAIL=admin@test.com
LOCAL_ADMIN_PASSWORD=123456
LOCAL_AUTHOR_EMAIL=author@test.com
LOCAL_AUTHOR_PASSWORD=123456
LOCAL_USER_EMAIL=user@test.com
LOCAL_USER_PASSWORD=123456
```


## Playwright Projects

The test suite is split into Playwright projects:

- `ecommerce`: runs ecommerce E2E, DDT, and step showcase tests.
- `local`: runs tests against the local practice app.

This allows different base URLs, test groups, and execution commands for each domain.

## Install

```bash
npm install
npx playwright install
```

## Run Tests

Ecommerce tests:

```bash
npm run test:ecommerce
```

Ecommerce tests in Playwright UI mode:

```bash
npm run test:ecommerce:ui
```

Local app tests:

```bash
npm run test:local
```

Local app tests in Playwright UI mode:

```bash
npm run test:local:ui
```

Run all tests:

```bash
npm run test:all
```

Note: local tests require the local application to be running at `LOCAL_BASE_URL`.

## Current Coverage

Ecommerce app:

- Login validation
- Product sorting
- Product detail navigation
- Favorite product flows
- Cart add/remove/update flows
- Checkout information and overview flows
- Data-driven login and cart scenarios

Local practice app:

- Multi-role course workflow: author, admin, reader
- Course create, edit, approve, reject, and delete flows
- API-assisted course setup and cleanup
- Date picker
- Table filtering, sorting, searching, and pagination
- Help center iframe interaction
- Modal, toast, dropdown, file upload, download, and new tab scenarios

## code Patterns

The project currently uses:

- Page Object Model for page-level behavior
- Component objects for repeated UI structures
- Playwright fixtures for dependency injection
- Test data models for product and course objects
- API clients for setup and teardown support
- Reusable step helpers for higher-level workflows
- Playwright projects for multi-domain execution

### Page Objects

Page objects hold page-specific locators and common page interactions. They are used to keep tests readable and avoid repeating low-level selector logic across test files.

### Component Objects

Component objects are used for repeated UI blocks such as product cards, cart product cards, headers, and course rows.

### Fixtures

The code uses Playwright fixtures to inject page objects and helpers into tests.

### Step Helpers

The `steps/` folder contains reusable workflow or assertion steps for higher-level test readability.

### API Support

The `API/` layer is used for setup and teardown in local app scenarios.

## Locator Strategy

The project uses CSS & Xpath selectors heavily because knowledge can be reuse in other framework not just playwright:

- CSS selectors are portable across multiple automation tools, not only Playwright.
- For this practice project, CSS was often the most available option.
- In a production codebase, the preferred approach would be to collaborate with developers to add stable test IDs for critical workflows and use role-based locators where possible.

## CI

The repository includes a GitHub Actions workflow that installs dependencies, installs Chromium, runs Playwright tests, and uploads the HTML report.

The ecommerce suite is the better candidate for CI because it targets a hosted practice site. The local suite requires the local application to be started as part of the pipeline before those tests can run reliably.

## Known Improvement Areas

This is a learning-focused code, not an enterprise-grade code yet. Current improvement targets:

- Split the single fixture registry into ecommerce and local fixture files
- Replace old `EMAIL` and `PASSWORD` variables with domain-specific names
- Add cleaner API setup/teardown helpers
- Improve CI so local tests start their dependent application automatically

## Notes

This project is intentionally used to practice automation code decisions, tradeoffs, and refactoring. The goal is not only to automate test scenarios, but also to demonstrate growth in maintainability, readability, test isolation, and scalable test design.
