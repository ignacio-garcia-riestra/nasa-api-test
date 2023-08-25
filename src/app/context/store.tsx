"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { Rover } from "../interfaces/Rover";

interface ContextProps {
  selectedRover: Rover | null;
  setSelectedRover: Dispatch<SetStateAction<Rover | null>>;
}

const GlobalContext = createContext<ContextProps>({
  selectedRover: null,
  setSelectedRover: (): Rover | null => null,
});

export const GlobalContextProvider = ({ children }) => {
  const [selectedRover, setSelectedRover] = useState<null | Rover>(null);

  return (
    <GlobalContext.Provider
      value={{
        selectedRover,
        setSelectedRover,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
