import { Record } from "@/types";

declare module "*/main.json" {
  const data: Record[];

  export default data;
}
