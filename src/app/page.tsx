"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRoversUrl, rootUrl, ROVERS_IMAGES } from "./constants";
import { useGlobalContext } from "./context/store";
import { Rover } from "./interfaces/Rover";

export default function Home() {
  const router = useRouter();

  const { setSelectedRover, setPhotos } = useGlobalContext();
  const roversInitialValue: Array<Rover> = [];
  const [rovers, setRovers] = useState(roversInitialValue);

  const fetchLastDayPhotos = async (rover: Rover) => {
    await axios
      .get(
        `${rootUrl}/${rover.name}/photos?earth_date=${rover.max_date}&api_key=lEScrZ86q27X40UCFBgd9tv193Ne2ybhvHIAfkIw`
      )
      .then((res) => setPhotos(res.data.photos));
  };

  const fetchLastWeekPhotos = async (rover: Rover) => {
    const lastWeekPhotos: Array<object> = [];
    let date = rover.max_date;
    let count = 1;
    while (count <= 7) {
      await axios
        .get(
          `${rootUrl}/${rover.name}/photos?earth_date=${date}&api_key=lEScrZ86q27X40UCFBgd9tv193Ne2ybhvHIAfkIw`
        )
        .then((res) => lastWeekPhotos.push(...res.data.photos));
      if (date)
        date = new Date(Date.parse(date) - 1000 * 60 * 60 * 24)
          .toISOString()
          .substring(0, 10);
      count++;
    }
    setPhotos(lastWeekPhotos);
  };

  const onClickHandler = (rover: Rover) => {
    setSelectedRover(rover);
    if (rover.status === "active") {
      fetchLastDayPhotos(rover).then(() => router.replace(`/${rover.name}`));
    }
    if (rover.status === "complete") {
      fetchLastWeekPhotos(rover).then(() => router.replace(`/${rover.name}`));
    }
  };

  const getRovers = async () => {
    const res = await axios.get(getRoversUrl);
    return res.data.rovers;
  };

  useEffect(() => {
    if (!rovers.length) {
      getRovers().then((res) => setRovers(res));
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
