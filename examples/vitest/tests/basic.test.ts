import { feature, scenario } from "@jagoral/vitest-cucumber";
import { expect } from "vitest";
import { TodoList } from "../src/todo";

feature("Todo List Management", () => {
  scenario("Add a new todo item")
    .given("I have an empty todo list", () => {
      const todoList = new TodoList();
      return { todoList };
    })
    .when("I add a todo item with the title 'Do homework'", ({ todoList }) => {
      const todo = todoList.addTodo("Do homework");
      return { lastTodo: todo };
    })
    .then("the todo list should have 1 item", ({ todoList }) => {
      expect(todoList.getTodos().length).toBe(1);
    })
    .and(
      "the item should have the title 'Do homework'",
      ({ todoList, lastTodo }) => {
        const todo = todoList
          .getTodos()
          .find((item) => item.id === lastTodo.id);
        expect(todo?.title).toBe("Do homework");
      },
    )
    .and("the item should not be completed", (state) => {
      const todo = state.todoList
        .getTodos()
        .find((item) => item.id === state.lastTodo.id);
      expect(todo?.completed).toBe(false);
    });

  scenario("Complete a todo item")
    .given("I have a todo list with a single item 'Do homework'", () => {
      const todoList = new TodoList();
      const todo = todoList.addTodo("Do homework");
      return { todoList, lastTodo: todo };
    })
    .when("I complete the todo item with id 1", ({ todoList }) => {
      todoList.completeTodo(1);
      return {};
    })
    .then(
      "the item should be marked as completed",
      ({ todoList, lastTodo }) => {
        const todo = todoList
          .getTodos()
          .find((item) => item.id === lastTodo.id);
        expect(todo?.completed).toBe(true);
      },
    );

  scenario("Remove a todo item")
    .given("I have a todo list with a single item 'Do homework'", () => {
      const todoList = new TodoList();
      const todo = todoList.addTodo("Do homework");
      return { todoList, lastTodo: todo };
    })
    .when("I remove the todo item with id 1", ({ todoList }) => {
      todoList.removeTodo(1);
      return {};
    })
    .then("the todo list should be empty", ({ todoList }) => {
      expect(todoList.getTodos().length).toBe(0);
    });
});
