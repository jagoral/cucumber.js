# Cucumber syntax for `vitest` and `playwright`

This repository contains two powerful extensions for integrating Cucumber-like syntax with [Playwright](https://playwright.dev/) and [vitest](https://vitest.dev/), enhancing your testing workflow with behavior-driven development (BDD) capabilities.

## Packages

- [`@jagoral/playwright-cucumber`](./packages/playwright-cucumber/): Extends Playwright with Cucumber-like fixtures which can be used to write your tests in a BDD style.
- [`@jagoral/vitest-cucumber`](./packages/vitest-cucumber/): Adds Cucumber-like syntax to Vitest for structured, readable, and maintainable BDD tests.


## Philosophy

The core philosophy behind `@jagoral/vitest-cucumber` and `@jagoral/playwright-cucumber` is to harness the advantages of Behavior-Driven Development (BDD) while maintaining the simplicity and efficiency of test writing. These packages offer a streamlined, type-safe API to seamlessly incorporate Cucumber-like syntax into your Vitest and Playwright testing workflows, emphasizing the most frequently used BDD features.

- ❌ **No Feature Files, Just Type-Safe API**: Remove the need for separate feature files. Scenarios are defined directly in code, keeping them closer to their implementation and reducing maintenance overhead.
  
- 📚 **Readability and Documentation**: Utilize `Given-When-Then` syntax to create well-structured and self-documenting tests that are easy to read and understand, enhancing both technical and non-technical stakeholder engagement.

- 📈 **Low Learning Curve**: Designed to be intuitive, the API minimizes complexity and provides a user-friendly experience, allowing quick adoption with minimal effort.

- 🔄 **Interoperability and Flexibility**: Blend BDD-style tests with Playwright's or Vitest test definitions, enabling a flexible and incremental approach allowing you to enhance test coverage progressively.