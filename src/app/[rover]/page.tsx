"use client";
import React, { useState } from "react";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useGlobalContext } from "../context/store";
import { useRouter } from "next/navigation";
import { rootUrl } from "../constants";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  ImageListItemBar,
  CssBaseline,
  Container,
  IconButton,
  Typography,
  ImageList,
  ImageListItem,
} from "@mui/material";

export default function Rover() {
  const router = useRouter();

  const { selectedRover, setSelectedRover } = useGlobalContext();
  const [selectedCamera, setSelectedCamera] = useState<any>(null);

  const fetchLast25Photos = async () => {
    const last25Photos: Array<object> = [];
    let date = selectedRover?.max_date;
    while (last25Photos.length < 25) {
      await axios
        .get(
          `${rootUrl}/${selectedRover?.name}/photos?earth_date=${date}&api_key=lEScrZ86q27X40UCFBgd9tv193Ne2ybhvHIAfkIw`
        )
        .then((res) =>
          last25Photos.push(...res.data.photos.slice(-25 + last25Photos.length))
        );
      if (date)
        date = new Date(Date.parse(date) - 1000 * 60 * 60 * 24)
          .toISOString()
          .substring(0, 10);
    }
    return last25Photos;
  };

  const getRelevantCameras = () => {
    const relevantCameras: Array<any> = [];
    photos.forEach((photo: any) => {
      if (!relevantCameras.some((cam: any) => cam.id === photo.camera.id)) {
        relevantCameras.push(photo.camera);
      }
    });
    return relevantCameras;
  };

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["photos"],
    async ({ pageParam = 1 }) => {
      const photosToShow =
        selectedRover?.status === "complete"
          ? await fetchLast25Photos()
          : await axios
              .get(
                `${rootUrl}/${selectedRover?.name}/photos?earth_date=${selectedRover?.max_date}&page=${pageParam}&api_key=lEScrZ86q27X40UCFBgd9tv193Ne2ybhvHIAfkIw`
              )
              .then((res) => res.data.photos);

      return photosToShow;
    },
    {
      getNextPageParam: (_, pages) => {
        if (!pages.at(-1)?.length || selectedRover?.status === "complete") {
          return false;
        }
        return pages.length + 1;
      },
    }
  );

  const photos =
    data?.pages.reduce((prevPhotos, page) => prevPhotos.concat(page), []) ?? [];

  return (
    <React.Fragment>
      <CssBaseline />

      <div className="bg-slate-200 fixed h-32 w-full font-semibold text-slate-800 opacity-70 z-50 flex flex-row justify-around">
        <div className="ml-20 flex flex-col w-4/5">
          <Typography variant="h4" my="auto" align="center" fontFamily="Play">
            Latest photos from {selectedRover?.name} mars-rover
          </Typography>
          {selectedRover ? (
            <div className="self-center pb-2 text-lg">
              {getRelevantCameras().map((cam) => {
                return (
                  <button
                    className="mr-4"
                    onClick={() => setSelectedCamera(cam)}
                  >
                    {cam.name}
                  </button>
                );
              })}
              <button onClick={() => setSelectedCamera(null)}>
                All cameras
              </button>
            </div>
          ) : null}
        </div>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => {
            data?.pageParams.splice(0);
            data?.pages.splice(0);
            setSelectedRover(null);
            router.replace(`/`);
          }}
        >
          Home
        </IconButton>
      </div>

      <Container
        maxWidth={false}
        id="rover"
        className="bg-mars-space min-h-screen h-full pt-8 flex flex-col"
      >
        {data ? (
          <InfiniteScroll
            className="mt-32 px-10"
            dataLength={photos.length}
            hasMore={hasNextPage || isLoading}
            next={() => fetchNextPage()}
            loader={"Loading more photos..."}
          >
            {data?.pages.map((page, index) => (
              <ImageList key={index} cols={5} gap={16} className="mt-12">
                {page.map(
                  (photo: any) =>
                    (!selectedCamera ||
                      selectedCamera.id === photo.camera.id) && (
                      <ImageListItem key={photo.id}>
                        <img
                          className="min-h-[120px] opacity-95"
                          src={photo.img_src}
                          alt={`${photo.rover.name} mars-rover photo`}
                          loading="lazy"
                        />
                        <ImageListItemBar
                          title={`Camera: ${photo.camera.full_name}`}
                          subtitle={`Date: ${photo.earth_date}`}
                        />
                      </ImageListItem>
                    )
                )}
              </ImageList>
            ))}

            {!hasNextPage && !isLoading && (
              <h3 className="mt-4 mb-8 text-white text-center text-2xl font-semibold">
                No more photos to load
              </h3>
            )}
          </InfiniteScroll>
        ) : (
          <></>
        )}
      </Container>
    </React.Fragment>
  );
}
