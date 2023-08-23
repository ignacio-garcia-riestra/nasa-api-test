export interface Rover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: "active" | "complete";
  max_sol: number;
  max_date: string;
  cameras: Array<{
    name: string;
    full_name: string;
  }>;
}
