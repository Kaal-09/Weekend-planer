import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuthStore = () => useContext(AuthContext);