export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export class TodoList {
  private todos: TodoItem[] = [];
  private nextId = 1;

  addTodo(title: string): TodoItem {
    const todo: TodoItem = { id: this.nextId++, title, completed: false };
    this.todos.push(todo);
    return todo;
  }

  addTodoAsync(title: string): Promise<TodoItem> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.addTodo(title));
      }, 100);
    });
  }

  getTodos(): TodoItem[] {
    return this.todos;
  }

  completeTodo(id: number): boolean {
    const todo = this.todos.find((item) => item.id === id);
    if (todo) {
      todo.completed = true;
      return true;
    }
    return false;
  }

  removeTodo(id: number): boolean {
    const index = this.todos.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }

  updateTodoTitle(id: number, newTitle: string): boolean {
    const todo = this.todos.find((item) => item.id === id);
    if (todo) {
      todo.title = newTitle;
      return true;
    }
    return false;
  }
}
