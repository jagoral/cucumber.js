import { feature, scenario } from "@jagoral/vitest-cucumber";
import { expect } from "vitest";
import { TodoList } from "../src/todo";

feature("Async Todo List Management", () => {
  scenario("Add a new todo item")
    .given("I have an empty todo list", () => {
      const todoList = new TodoList();
      return { todoList };
    })
    .when(
      "I add a todo item with the title 'Do homework'",
      async ({ todoList }) => {
        const todo = await todoList.addTodoAsync("Do homework");
        return { lastTodo: todo };
      },
    )
    .then("the todo list should have 1 item", ({ todoList }) => {
      expect(todoList.getTodos().length).toBe(1);
    });
});
