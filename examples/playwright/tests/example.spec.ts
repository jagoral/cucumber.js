import { gherkinTest } from "@jagoral/playwright-cucumber";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

test.describe.configure({ mode: "parallel" });

test.beforeEach(async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc");
});

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
] as const;

const { Scenario, Feature } = gherkinTest(test);

Feature("New Todo", () => {
  Scenario("Adding a todo item", async ({ page, And, When, Then }) => {
    const input = page.getByPlaceholder("What needs to be done?");

    await When("I create a new todo item", async () => {
      await input.fill(TODO_ITEMS[0]);
      await input.press("Enter");
    });

    await Then("I should see the new todo item in the list", async () => {
      await expect(page.getByTestId("todo-title")).toHaveText([TODO_ITEMS[0]]);
    });

    await And("input field should be cleared", async () => {
      await expect(input).toBeEmpty();
    });

    await And("filter panel should be visible", async () => {
      await expect(page.locator(".filters")).toBeVisible();
    });
  });

  Scenario("Adding multiple todo items", async ({ page, And, When, Then }) => {
    const input = page.getByPlaceholder("What needs to be done?");

    await When("I create multiple new todo items", async () => {
      await createDefaultTodos(page);
    });

    await Then("todo count should be updated", async () => {
      await expect(page.getByTestId("todo-count")).toHaveText("3 items left");
    });

    await And("input field should be cleared", async () => {
      await expect(input).toBeEmpty();
    });
  });
});

Feature("Mark all as completed", () => {
  Scenario(
    "should allow me to mark all items as completed",
    async ({ page, And, When, Then }) => {
      await When("I have multiple todo items", async () => {
        await createDefaultTodos(page);
      });

      await And("I mark all items as completed", async () => {
        await page.getByLabel("Mark all as complete").check();
      });

      await Then("all items should be marked as completed", async () => {
        await expect(page.getByTestId("todo-item")).toHaveClass([
          "completed",
          "completed",
          "completed",
        ]);
      });

      await And("todo count should be updated", async () => {
        await expect(page.getByTestId("todo-count")).toHaveText("0 items left");
      });
    },
  );
});

async function createDefaultTodos(page: Page) {
  // create a new todo locator
  const newTodo = page.getByPlaceholder("What needs to be done?");

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press("Enter");
  }
}
