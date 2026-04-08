import { useContext } from "react";
import { LocationContext } from "./LocationContext";

export const useLocationStore = () => useContext(LocationContext)