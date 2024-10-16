import { AddPost, Posts } from "../../types/types";
import { BaseService } from "./BaseService.server";

export class PostServices extends BaseService {
  constructor() {
    super();
    this.addPost = this.addPost.bind(this);
    this.getUserPost = this.getUserPost.bind(this);
    this.getPostsOfUser = this.getPostsOfUser.bind(this);
    this.editPost = this.editPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  async addPost(post: AddPost, refreshToken: string): Promise<Posts> {
    return await this.createItem("Post", post, refreshToken);
  }

  async getUserPost(userId: string, postId: string): Promise<Posts> {
    return await this.readItem("Post", postId, userId);
  }

  async getPostsOfUser(userId: string): Promise<Posts[]> {
    return await this.readAllItemsOfUser("Post", userId);
  }

  async editPost(postId: string, post: Partial<Posts>, accessToken: string): Promise<Posts> {
    return await this.updatePostItem("Post", postId, post, accessToken);
  }

  async deletePost(postId: string, accessToken: string) {
    return await this.deletePostItem("Post", postId, accessToken);
  }

  async uploadImage(image: FormData) {
    return await this.uploadFile(image);
  }

  async getAllPosts() {
    return await this.readAllPosts("Post");
  }

  async getPost(postId: string) {
    return await this.readPost("Post", postId);
  }
}