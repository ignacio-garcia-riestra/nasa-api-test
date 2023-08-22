"use client";
import { usePathname } from "next/navigation";

export default function Rover() {
  const currentRover = usePathname().substring(1).toLowerCase();
  return <h1>{currentRover.toUpperCase()}</h1>;
}
