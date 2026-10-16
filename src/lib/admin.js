import { ID, Query } from "appwrite";
import { databases, appwriteConfig, isAppwriteConfigured } from "./appwrite";

const db   = appwriteConfig.databaseId;
const prod = appwriteConfig.productsCollectionId;
const ord  = appwriteConfig.ordersCollectionId;

function check(colId) {
  if (!isAppwriteConfigured || !db || !colId)
    throw new Error("Appwrite is not fully configured. Check your .env file.");
}

function sanitizeProduct(raw) {
  return {
    name:      String(raw.name ?? "").trim(),
    brand:     String(raw.brand ?? "").trim(),
    category:  raw.category === "pant" ? "pant" : "shirt",
    price:     Number(raw.price) || 0,
    salePrice: raw.salePrice !== "" && raw.salePrice != null
                 ? Number(raw.salePrice)
                 : null,
    image:     String(raw.image ?? "").trim() || null,
    sizes:     Array.isArray(raw.sizes) ? raw.sizes : [],
    rating:    Math.min(5, Math.max(0, Number(raw.rating) || 4.8)),
    featured:  Boolean(raw.featured),
  };
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function adminListProducts() {
  check(prod);
  const res = await databases.listDocuments(db, prod, [
    Query.limit(200),
    Query.orderDesc("$createdAt"),
  ]);
  return res.documents;
}

export async function adminCreateProduct(data) {
  check(prod);
  return databases.createDocument(db, prod, ID.unique(), sanitizeProduct(data));
}

export async function adminUpdateProduct(id, data) {
  check(prod);
  return databases.updateDocument(db, prod, id, sanitizeProduct(data));
}

export async function adminDeleteProduct(id) {
  check(prod);
  return databases.deleteDocument(db, prod, id);
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function adminListOrders() {
  check(ord);
  const res = await databases.listDocuments(db, ord, [
    Query.limit(200),
    Query.orderDesc("$createdAt"),
  ]);
  return res.documents;
}

export async function adminUpdateOrderStatus(id, status) {
  check(ord);
  return databases.updateDocument(db, ord, id, { status });
}
