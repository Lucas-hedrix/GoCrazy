import { Query } from "appwrite";
import { storage, appwriteConfig, isAppwriteConfigured } from "./appwrite";

let bucketFiles = null;

// "Stage-Worn Tour Tee.JPG" and "stage_worn_tour_tee" resolve to the same key.
const norm = (s) =>
  String(s ?? "")
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .trim();

export async function getBucketFiles(force = false) {
  if (!isAppwriteConfigured || !appwriteConfig.bucketId) return [];
  if (bucketFiles && !force) return bucketFiles;
  try {
    const all = [];
    let offset = 0;
    for (;;) {
      const res = await storage.listFiles(appwriteConfig.bucketId, [
        Query.limit(100),
        Query.offset(offset),
      ]);
      all.push(...res.files);
      if (res.files.length === 0 || all.length >= res.total) break;
      offset += res.files.length;
    }
    bucketFiles = all.map((f) => ({
      id: f.$id,
      name: f.name,
      key: norm(f.name),
      url: String(storage.getFileView(appwriteConfig.bucketId, f.$id)),
    }));
  } catch {
    // Bucket missing or not publicly readable — images stay as placeholders.
    bucketFiles = [];
  }
  return bucketFiles;
}

// Product docs can reference images as: a full URL, a bucket file ID,
// a bucket file name, or be left empty to auto-match the product name.
export async function resolveImages(products) {
  const mightNeedBucket = products.some(
    (p) => !p.image || !/^https?:\/\//i.test(p.image)
  );
  if (!mightNeedBucket) return products;

  const files = await getBucketFiles();
  if (!files.length) return products;

  const byId = new Map(files.map((f) => [f.id, f.url]));
  const byKey = new Map(files.map((f) => [f.key, f.url]));

  return products.map((p) => {
    let url = null;
    if (p.image) {
      if (/^https?:\/\//i.test(p.image)) return p;
      url = byId.get(p.image) ?? byKey.get(norm(p.image));
    } else {
      url = byKey.get(norm(p.name));
    }
    return url ? { ...p, image: url } : p;
  });
}
