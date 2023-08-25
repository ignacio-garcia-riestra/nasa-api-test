"use client";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useGlobalContext } from "../context/store";
import { useRouter } from "next/navigation";
import axios from "axios";
import { rootUrl } from "../constants";

export default function Rover() {
  const router = useRouter();

  const { selectedRover, setSelectedRover } = useGlobalContext();

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
    <div className="bg-blue-200 min-h-screen flex flex-col items-center">
      <button
        onClick={() => {
          data?.pageParams.splice(0);
          data?.pages.splice(0);
          setSelectedRover(null);
          router.replace(`/`);
        }}
      >
        Back to home
      </button>
      {selectedRover ? (
        <h1 className="text-2xl font-semibold my-12">
          {selectedRover?.name.toUpperCase()}
        </h1>
      ) : null}

      {data ? (
        <InfiniteScroll
          className="w-4/5"
          dataLength={photos.length}
          hasMore={hasNextPage || isLoading}
          next={() => fetchNextPage()}
          loader={"Loading more photos..."}
        >
          {data?.pages.map((page, index) => (

            <ImageList key={index} cols={5} gap={16} className="my-12">
              {page.map((photo: any) => (
                <ImageListItem key={photo.id}>
                  <img
                    className="min-h-[120px]"
                    src={photo.img_src}
                    alt={`${photo.rover.name} mars-rover photo`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Camera: ${photo.camera.full_name}`}
                    subtitle={`Date: ${photo.earth_date}`}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ))}

          {!hasNextPage && !isLoading && <h3>No more photos to load</h3>}
        </InfiniteScroll>
      ) : (
        <></>
      )}
    </div>
  );
}
