"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AppContextValue = {
  sessionToken: string;
  setSessionToken: (token: string) => void;
};

const AppContextProvider = createContext<AppContextValue>({
  sessionToken: "",
  setSessionToken: () => {},
});

export const useAppContextProvider = () => {
  return useContext(AppContextProvider);
};

export default function AppContext({
  children,
  initialSessionToken,
}: {
  children: ReactNode;
  initialSessionToken: string;
}) {
  const [sessionToken, setSessionToken] = useState(initialSessionToken);

  // Keep client state in sync when the cookie-derived prop changes after navigation
  useEffect(() => {
    setSessionToken(initialSessionToken);
  }, [initialSessionToken]);
  return (
    <AppContextProvider.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AppContextProvider.Provider>
  );
}
