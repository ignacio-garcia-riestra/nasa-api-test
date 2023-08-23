"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { rootUrl } from "../constants";

export default function Rover() {
  const rover = JSON.parse(localStorage.getItem("rover") || "");
  const photosInitialState: Array<object> = [];
  const [photos, setPhotos] = useState(photosInitialState);

  const fetchLastDayPhotos = async () => {
    await axios
      .get(
        `${rootUrl}/${rover.name}/photos?earth_date=${rover.max_date}&api_key=DEMO_KEY`
      )
      .then((res) => setPhotos(res.data.photos));
  };

  const fetchLastWeekPhotos = async () => {
    const lastWeekPhotos: Array<object> = [];
    let date = rover.max_date;
    let count = 1;
    while (count <= 7) {
      await axios
        .get(
          `${rootUrl}/${rover.name}/photos?earth_date=${date}&api_key=DEMO_KEY`
        )
        .then((res) => lastWeekPhotos.push(...res.data.photos));
      date = new Date(Date.parse(date) - 1000 * 60 * 60 * 24)
        .toISOString()
        .substring(0, 10);
      count++;
    }
    setPhotos(lastWeekPhotos);
  };

  useEffect(() => {
    if (rover.status === "active") {
      fetchLastDayPhotos();
    }
    if (rover.status === "complete") {
      fetchLastWeekPhotos();
    }
  }, [photos.length]);

  return <div>{rover ? <h1>{rover.name.toUpperCase()}</h1> : null}</div>;
}
