import { Permission, Role } from "appwrite";
import { appwriteConfig } from "./appwrite";

export const CRYPTO_WALLETS = [
  {
    coin: "SOL",
    name: "Solana",
    network: "Solana",
    address: "5BosrhYdoHqwuNhWzYLd9x6fxD6ezwAay8oknrTbWFHA",
  },
  {
    coin: "ETH",
    name: "Ethereum",
    network: "ERC-20",
    address: "0x703B57F29bC312c172e9DbeF1E324C809D6c3b13",
  },
  {
    coin: "BTC",
    name: "Bitcoin",
    network: "Bitcoin",
    address: "bc1qf3qzz2kxldarwn3wyg4ysjz6u9c47x349q5888",
  },
];

export function evidenceFileUrl(fileId) {
  if (!fileId || !appwriteConfig.evidenceBucketId) return null;
  return `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${appwriteConfig.evidenceBucketId}/files/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
}

export const ADMIN_IDS = (import.meta.env.VITE_ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

export const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? "";
export const isPaystackConfigured = Boolean(paystackPublicKey);

let paystackPromise = null;

export function loadPaystack() {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop);
  if (!paystackPromise) {
    paystackPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => resolve(window.PaystackPop);
      script.onerror = () => {
        paystackPromise = null;
        reject(new Error("Couldn't load Paystack. Check your connection and try again."));
      };
      document.head.appendChild(script);
    });
  }
  return paystackPromise;
}

// Buyer can always see their order; every admin ID in VITE_ADMIN_USER_IDS can
// read + update (approve/reject crypto payments) each order.
export function orderPermissions(userId) {
  const perms = [Permission.read(Role.user(userId))];
  for (const adminId of ADMIN_IDS) {
    perms.push(Permission.read(Role.user(adminId)), Permission.update(Role.user(adminId)));
  }
  return perms;
}

export function evidencePermissions(userId) {
  const perms = [Permission.read(Role.user(userId))];
  for (const adminId of ADMIN_IDS) {
    perms.push(Permission.read(Role.user(adminId)));
  }
  return perms;
}
