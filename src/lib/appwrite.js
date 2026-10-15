import { Client, Account, Databases, Storage } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const appwriteConfig = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID ?? "",
  productsCollectionId: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID ?? "",
  ordersCollectionId: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID ?? "",
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID ?? "",
};

export const isAppwriteConfigured = Boolean(endpoint && projectId);

const client = new Client();
if (isAppwriteConfigured) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
