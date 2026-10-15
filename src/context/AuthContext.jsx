import { createContext, useContext, useEffect, useState } from "react";
import { ID } from "appwrite";
import { account, isAppwriteConfigured } from "../lib/appwrite";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAppwriteConfigured) {
      setReady(true);
      return;
    }
    account
      .get()
      .then(setUser)
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    if (!isAppwriteConfigured) throw new Error("Appwrite isn't configured yet. Add your keys to .env and restart.");
    await account.createEmailPasswordSession(email, password);
    setUser(await account.get());
  };

  const register = async (name, email, password) => {
    if (!isAppwriteConfigured) throw new Error("Appwrite isn't configured yet. Add your keys to .env and restart.");
    await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);
    setUser(await account.get());
  };

  const logout = async () => {
    if (!isAppwriteConfigured) return;
    await account.deleteSession("current");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
