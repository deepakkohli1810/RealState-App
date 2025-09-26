import { createContext, useContext } from "react";
import { ReactNode } from "react";
import { useAppwrite } from "./Useappwrite";
import { getCurrentUser } from "./appwrite";

interface User {
  $id: string;
  name?: string;      // Made optional
  email: string;
  avatar: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>; 
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Fixed: Pass function reference, not call
  const { data: user, loading, refetch } = useAppwrite({
    fn: getCurrentUser
  });

  const isLoggedIn = !!user;

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        refetchUser: refetch // ✅ Properly mapped
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

// Optional: Remove default export unless explicitly needed
// export default GlobalContext;