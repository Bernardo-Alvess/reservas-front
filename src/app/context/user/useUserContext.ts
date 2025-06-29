import { useContext } from "react";
import { UserContext } from "./userContext";

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}
