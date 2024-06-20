import { feature, scenarioOutline } from "@jagoral/vitest-cucumber";
import { expect } from "vitest";
import { TodoList } from "../src/todo";

feature("Todo List Management", () => {
  scenarioOutline("Update todo item title")
    .given("I have a todo list with an item titled 'Initial Title'", () => {
      const todoList = new TodoList();
      const todo = todoList.addTodo("Initial Title");
      return { todoList, lastTodo: todo };
    })
    .when(
      "I update the todo item's title to '{{newTitle}}'",
      ({ lastTodo, todoList, variables }) => {
        todoList.updateTodoTitle(lastTodo.id, variables.newTitle);
      },
    )
    .then(
      "the todo item should have the title '{{newTitle}}'",
      ({ todoList, lastTodo, variables }) => {
        const todo = todoList
          .getTodos()
          .find((item) => item.id === lastTodo.id);
        expect(todo?.title).toBe(variables.newTitle);
      },
    )
    .examples([
      { newTitle: "Updated Title 1" },
      { newTitle: "Updated Title 2" },
      { newTitle: "Another New Title" },
    ]);
});
