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
  photos: Array<any>;
  setPhotos: Dispatch<SetStateAction<Array<any>>>;
}

const GlobalContext = createContext<ContextProps>({
  selectedRover: null,
  setSelectedRover: (): Rover | null => null,
  photos: [],
  setPhotos: (): Array<any> => [],
});

export const GlobalContextProvider = ({ children }) => {
  const [selectedRover, setSelectedRover] = useState<null | Rover>(null);
  const [photos, setPhotos] = useState<Array<any>>([]);

  return (
    <GlobalContext.Provider
      value={{
        selectedRover,
        setSelectedRover,
        photos,
        setPhotos,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
