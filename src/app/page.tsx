"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getRoversUrl, ROVERS_IMAGES } from "./constants";
import { useGlobalContext } from "./context/store";
import { Rover } from "./interfaces/Rover";
import { Grid, Typography, CssBaseline, Container } from "@mui/material";

export default function Home() {
  const router = useRouter();

  const { setSelectedRover } = useGlobalContext();
  const roversInitialValue: Array<Rover> = [];
  const [rovers, setRovers] = useState(roversInitialValue);

  const onClickHandler = (rover: Rover) => {
    setSelectedRover(rover);
    router.replace(`/${rover.name}`);
  };

  useEffect(() => {
    if (!rovers.length) {
      axios.get(getRoversUrl).then((res) => setRovers(res.data.rovers));
    }
  }, [rovers.length]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container
        maxWidth={false}
        id="home"
        className="bg-mars-space h-screen pt-8 flex flex-col"
      >
        <Typography
          variant="h2"
          mt={4}
          pl="18%"
          color="whitesmoke"
          fontFamily="Play"
        >
          Lets explore Mars!!
        </Typography>

        {rovers.length ? (
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            className="bg-slate-100 w-1/3 p-6 -mt-16 self-end justify-around rounded-2xl opacity-60"
          >
            <Grid xs={12} textAlign="center" fontFamily="Play" mb={2}>
              <span className="text-2xl font-semibold">
                click on a rover to view its photos
              </span>
            </Grid>
            {Object.values(rovers).map((rover: Rover) => {
              const roverName = rover.name.toLowerCase();
              const exampleImageUrl = ROVERS_IMAGES[roverName];

              return (
                <Grid sm={12} md={6} key={rover.id}>
                  <div
                    onClick={() => onClickHandler(rover)}
                    key={rover.id}
                    className="m-3 flex flex-col items-center hover:bg-slate-400 cursor-pointer"
                  >
                    <img src={exampleImageUrl} className="w-64 h-80" />

                    <span className="mt-2 w-50 font-semibold text-lg">
                      {rover.name.toUpperCase()}: {rover.status}
                    </span>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        ) : null}
      </Container>
    </React.Fragment>
  );
}
