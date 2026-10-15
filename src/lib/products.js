import { Query } from "appwrite";
import { databases, appwriteConfig, isAppwriteConfigured } from "./appwrite";

// Shown while the Appwrite project isn't wired up yet (or if it fails) so the
// storefront never renders empty.
export const DEMO_PRODUCTS = [
  { id: "demo-1", name: "Stage-Worn Tour Tee", brand: "Artist Archive", category: "shirt", price: 89.99, salePrice: 59.99, image: null, sizes: ["S", "M", "L", "XL"], rating: 4.9, featured: true },
  { id: "demo-2", name: "Washed Black Denim", brand: "Rental Exclusive", category: "pant", price: 129.99, salePrice: null, image: null, sizes: ["28", "30", "32", "34", "36"], rating: 4.8, featured: true },
  { id: "demo-3", name: "Carpenter Cargo Pants", brand: "Second Spin", category: "pant", price: 109.99, salePrice: 84.99, image: null, sizes: ["28", "30", "32", "34"], rating: 4.7, featured: true },
  { id: "demo-4", name: "Oversized Graphic Tee", brand: "Rental Exclusive", category: "shirt", price: 74.99, salePrice: null, image: null, sizes: ["M", "L", "XL"], rating: 4.8, featured: true },
  { id: "demo-5", name: "Silk Stage Shirt", brand: "Artist Archive", category: "shirt", price: 119.99, salePrice: 89.99, image: null, sizes: ["S", "M", "L"], rating: 4.9, featured: true },
  { id: "demo-6", name: "Double-Knee Work Pants", brand: "Second Spin", category: "pant", price: 99.99, salePrice: null, image: null, sizes: ["30", "32", "34", "36"], rating: 4.7, featured: true },
  { id: "demo-7", name: "Flannel Overshirt", brand: "Rental Exclusive", category: "shirt", price: 94.99, salePrice: 69.99, image: null, sizes: ["M", "L", "XL"], rating: 4.6, featured: false },
  { id: "demo-8", name: "Pleated Wide-Leg Pants", brand: "Artist Archive", category: "pant", price: 114.99, salePrice: null, image: null, sizes: ["28", "30", "32", "34"], rating: 4.8, featured: false },
];

function normalize(doc) {
  const sizes = Array.isArray(doc.sizes)
    ? doc.sizes
    : typeof doc.sizes === "string"
      ? doc.sizes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["S", "M", "L", "XL"];

  return {
    id: doc.$id,
    name: doc.name ?? "Untitled Piece",
    brand: doc.brand ?? "",
    category: (doc.category ?? "shirt").toLowerCase(),
    price: Number(doc.price ?? 0),
    salePrice: doc.salePrice == null || doc.salePrice === "" ? null : Number(doc.salePrice),
    image: doc.image || null,
    sizes: sizes.length ? sizes : ["M"],
    rating: Number(doc.rating ?? 4.8),
    featured: Boolean(doc.featured),
  };
}

export async function getProducts({ category = "all", featured = false, search = "" } = {}) {
  let items;

  if (isAppwriteConfigured && appwriteConfig.databaseId && appwriteConfig.productsCollectionId) {
    try {
      const queries = [];
      if (featured) queries.push(Query.equal("featured", true));
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.productsCollectionId,
        queries
      );
      items = res.documents.map(normalize);
    } catch (err) {
      console.warn("Appwrite fetch failed, falling back to demo products:", err?.message);
      items = DEMO_PRODUCTS;
    }
  } else {
    items = DEMO_PRODUCTS;
  }

  let out = items;
  if (featured) out = out.filter((p) => p.featured);
  if (category !== "all") out = out.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    out = out.filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(q));
  }
  return out;
}
