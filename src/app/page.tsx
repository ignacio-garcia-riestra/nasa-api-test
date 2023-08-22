"use client";
import { useRouter } from "next/navigation";
import { Rovers } from "./constants";

export default function Home() {
  const router = useRouter();
  const rovers = Rovers;

  const onClickHandler = (e: { target: any }) => {
    router.push(`/${e.target.textContent}`);
  };

  return (
    <div>
      <h1>NASA - API - TEST</h1>

      {Object.values(rovers).map((rover, index) => {
        return (
          <button
            key={index}
            className="btn btn-primary m-2 p-3 w-50"
            onClick={onClickHandler}
          >
            {rover}
          </button>
        );
      })}
    </div>
  );
}
