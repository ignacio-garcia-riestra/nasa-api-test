import { Camera } from "./Camera";
import { Rover } from "./Rover";

export interface Photo {
  id: number;
  sol: number;
  camera: Camera;
  img_src: string;
  earth_date: string;
  rover: Rover;
}
