"use client";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useGlobalContext } from "../context/store";
import { useRouter } from "next/navigation";

export default function Rover() {
  const router = useRouter();

  const { selectedRover, photos } = useGlobalContext();

  const fetchPhotos = async (page: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return photos.slice((page - 1) * 25, page * 25);
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["query"],
    async ({ pageParam = 1 }) => {
      const response = await fetchPhotos(pageParam);
      return response;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [photos.slice(0, 25)],
        pageParams: [1],
      },
    }
  );

  const allPagesWereLoaded = () =>
    !((data?.pages.length ?? 0) < Math.ceil(photos.length / 25));

  return (
    <div className="bg-blue-200 flex flex-col items-center">
      <button onClick={() => router.replace(`/`)}>Back to home</button>
      {selectedRover ? <h1>{selectedRover?.name.toUpperCase()}</h1> : null}

      {data ? (
        <>
          {data?.pages.map((page, index) => (
            <ImageList key={index} className="w-2/3 mb-12" cols={5} gap={16}>
              {page.map((photo) => (
                <ImageListItem key={photo.id}>
                  <img
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

          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || allPagesWereLoaded()}
          >
            {isFetchingNextPage
              ? "Loading more photos..."
              : !allPagesWereLoaded()
              ? "Load more photos"
              : "No more photos to load"}
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
