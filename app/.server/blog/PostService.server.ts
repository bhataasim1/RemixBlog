
import { AddPost, Posts } from "../../types/types";
import { BaseService } from "./BaseService.server";

export class TodosService extends BaseService {
  constructor() {
    super();
    this.addTodo = this.addTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.getTodosOfUser = this.getTodosOfUser.bind(this);
  }

  async addTodo(todo: AddPost): Promise<Posts> {
    return await this.createItem("Posts", todo);
  }

  async getUserTodo(userId: string, todoId: string): Promise<Posts> {
    return await this.readItem("Posts", todoId, userId);
  }

  async getTodosOfUser(userId: string): Promise<Posts[]> {
    return await this.readAllItems("Posts", userId);
  }

  async editTodo(todoId: string, todo: Partial<Posts>) {
    return await this.updateTodoItem("Posts", todoId, todo);
  }

  async deleteTodo(todoId: string) {
    return await this.deleteTodoItem("Posts", todoId);
  }
}