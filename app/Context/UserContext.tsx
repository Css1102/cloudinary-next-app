import { useContext,createContext,useState,useEffect } from "react";
import { useUser } from "@clerk/nextjs";


type userData={
clerkId:string,
firstName:String,
lastName:String,
  deleteMap: Map<string, boolean>;
  markDeleted: (id: string) => void;
}

const UserContext=createContext<userData | null>(null)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userData, setUserData] = useState<userData | null>(null);
  const [deleteMap] = useState<Map<string, boolean>>(new Map());

  const markDeleted = (id: string) => {
    deleteMap.set(id, true);
  };  
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setUserData({
        clerkId: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        deleteMap,
        markDeleted,
      });    }
  }, [isLoaded, isSignedIn, user,deleteMap]);

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);