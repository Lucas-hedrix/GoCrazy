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

// Client requests may only grant permissions to the session user itself, so
// orders/evidence are created with owner-only access. The "grant-admin-access"
// Appwrite Function listens for new docs/files and adds admin read (and update
// on orders) server-side via an API key.
export function orderPermissions(userId) {
  return [Permission.read(Role.user(userId))];
}

export function evidencePermissions(userId) {
  return [Permission.read(Role.user(userId))];
}
