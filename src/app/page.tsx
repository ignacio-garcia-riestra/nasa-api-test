"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRoversUrl, ROVERS_IMAGES } from "./constants";
import { Rover } from "./interfaces/Rover";

export default function Home() {
  const router = useRouter();

  const roversInitialValue: Array<Rover> = [];
  const [rovers, setRovers] = useState(roversInitialValue);

  const onClickHandler = (rover: Rover) => {
    localStorage.setItem("rover", JSON.stringify(rover));
    router.push(`/${rover.name}`);
  };

  const getRovers = async () => {
    const res = await axios.get(getRoversUrl);
    return res.data.rovers;
  };

  useEffect(() => {
    if (!rovers.length) {
      getRovers().then((res) => setRovers(res));
    } else {
      localStorage.removeItem("rover");
    }
  }, [rovers.length]);

  return (
    <div>
      <h1>NASA - API - TEST</h1>

      {rovers.length ? (
        <div className="flex flex-row">
          {Object.values(rovers).map((rover: Rover) => {
            const roverName = rover.name.toLowerCase();
            const exampleImageUrl = ROVERS_IMAGES[roverName];

            return (
              <div key={rover.id} className="flex flex-col">
                <img src={exampleImageUrl} className="w-72 h-96" />

                <button
                  className="btn btn-primary m-2 p-3 w-50"
                  onClick={() => onClickHandler(rover)}
                >
                  {rover.name.toUpperCase()}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
