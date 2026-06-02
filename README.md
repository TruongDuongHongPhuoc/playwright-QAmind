# QA Brains E-Commerce Automation Framework

Tested website: https://practice.qabrains.com/ecommerce/login
Manual test case: https://docs.google.com/spreadsheets/d/1ezeTaCJ7G47nhbJtWm3Mne2L7QPOiWwZruWwdgX3aRc/edit?usp=sharing
Test script can be found in Folder test > E2E
Test report HTML: 

## Introduction

This project is a UI Automation Framework developed using Playwright and TypeScript for the QA Brains E-Commerce Practice Website.

The project was created to practice automation testing while learning how to design a maintainable automation framework. Besides automating regression scenarios, the project focuses on framework structure, code organization, readability, maintainability, reusability, and refactoring practices.

The automated scripts are built by translating regression test scenarios into Playwright TypeScript test scripts.

---

# Project Structure

```text
project
├── components
├── constant
├── fixtures
├── models
├── pages
├── tests
|   └── E2E
├── utils
└── playwright.config.ts
```

## Components

Contains reusable UI components shared across multiple pages.

Examples:

* Product Card
* Cart Product Card
* Header Component

Purpose:

* Reduce duplicated locators
* Improve maintainability
* Improve reusability
* Centralize common UI behaviors

---

## Constants

Contains shared static data.

Examples:

* Routes

Purpose:

* Avoid magic strings
* Simplify maintenance

---

## Fixtures

Contains Playwright fixtures.

Purpose:

* Manage dependency injection
* Align object creation with Playwright worker lifecycle
* Reduce repetitive page initialization
* Simplify future refactoring

---

## Models

Contains business objects used throughout the framework.

Examples:

* Product

Purpose:

* Store application data
* Verify data consistency between workflows
* Improve readability of assertions
* Reduce repetitive validation logic

## Pages

Contains Page Object Models (POM).

Responsibilities:

* Store page locators
* Handle page interactions
* Encapsulate page-specific behavior

---

## Tests > E2E

Contains automated test scripts.

Current suites:

* Login
* Product Order
* Favorite
* Cart
* Checkout

---

## Utils

Contains reusable helper functions.

Examples:

* Data manipulation
* Object updates
* Shared utility functions

Purpose:

* Promote reuse
* Reduce duplicated logic
* Keep Page Objects focused on page responsibilities

---

# Locator Strategy

The framework primarily uses CSS selectors whenever possible.

Reason:

* Better runtime performance
* Better readability
* Easier maintenance

XPath is only used when:

* Stable CSS signatures are unavailable or too complex 
* Complex parent-child relationships are required
* Relationship-based element identification provides a more reliable solution

---

# Framework Practices

The framework applies:

* Playwright Fixtures
* Page Object Model (POM)
* Reusable Components
* Data Models
* Utility Helpers

These practices help improve:

* Readability
* Maintainability
* Reusability
* Scalability
* Debuggability

Abstractions are introduced only when they provide clear benefits. Additional layers that increase complexity without improving maintainability or readability are avoided.

---

# Test Coverage

Current automated coverage includes:

## Authentication

* Valid Login
* Invalid Login
* Input Validation

## Product

* Product Sorting
* Product Detail Navigation

## Favorites

* Add Favorite
* Remove Favorite

## Cart

* Add Product
* Remove Product
* Update Quantity
* Cart Persistence

## Checkout

* Checkout Information
* Checkout Overview
* Order Completion

---

# Future Improvements

Planned enhancements for future phases:
* Better practicle website
* Data Driven Testing (DDT)
* Behavior Driven Development (BDD)
* API Integration
* CI/CD Integration
* Enhanced Reporting
* Cross Browser Execution

---

# Summary

This project focuses on building a maintainable Playwright automation framework while practicing automation engineering principles such as framework design, code organization, refactoring, and long-term maintainability.

The goal is not only to automate tests but also to understand the trade-offs behind automation framework design decisions.
