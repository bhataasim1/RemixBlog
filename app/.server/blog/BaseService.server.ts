import { authentication, createDirectus, createItem, deleteItem, readItem, readItems, rest, updateItem, uploadFiles } from "@directus/sdk";
import { AddPost, Collection, Posts } from "../../types/types";


type Schema = {
  Post: Posts[];
}

export class BaseService {
  protected readonly directusClient;

  constructor() {
    this.directusClient = createDirectus<Schema>(process.env.DIRECTUS_URL!)
      .with(rest())
      .with(authentication("json"));
  }

  protected async createItem(collection: Collection, item: AddPost): Promise<Posts> {
    try {
      return await this.directusClient.request(
        createItem(collection, {
          ...item,
          createdAt: new Date()
        })
      )
    } catch (error) {
      // console.log(error);
      throw new Error("Failed to create item");
    }
  }

  protected async readItem(collection: Collection, itemId: string, userId: string): Promise<Posts> {
    try {
      return await this.directusClient.request(
        readItem(collection, itemId, {
          filter: {
            userId: {
              _eq: userId
            }
          }
        })
      );
    } catch (error) {
      throw new Error("Failed to read item");
    }
  }

  protected async readAllItemsOfUser(collection: Collection, userId: string): Promise<Posts[]> {
    try {
      return await this.directusClient.request(
        readItems(collection, {
          filter: {
            userId: {
              _eq: userId
            }
          }
        })
      );
    } catch (error) {
      throw new Error("Failed to read items");
    }
  }

  protected async updatePostItem(collection: Collection, itemId: string, item: Partial<Posts>) {
    try {
      return await this.directusClient.request(
        updateItem(collection, itemId, item)
      );
    } catch (error) {
      throw new Error("Failed to update item");
    }
  }

  protected async deletePostItem(collection: Collection, itemId: string) {
    try {
      return await this.directusClient.request(
        deleteItem(collection, itemId)
      );
    } catch (error) {
      throw new Error("Failed to delete item");
    }
  }

  protected async uploadFile(file: FormData) {
    try {
      return await this.directusClient.request(uploadFiles(file));
    } catch (error) {
      // console.log(error);
      throw new Error("Failed to upload file");
    }
  }

  protected async readAllPosts(collection: Collection): Promise<Posts[]> {
    try {
      return await this.directusClient.request(
        readItems(collection)
      );
    } catch (error) {
      throw new Error("Failed to read items");
    }
  }

  protected async readPost(collection: Collection, postId: string): Promise<Posts> {
    try {
      return await this.directusClient.request(
        readItem(collection, postId)
      );
    } catch (error) {
      throw new Error("Failed to read item");
    }
  }
}