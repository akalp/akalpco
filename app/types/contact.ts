import type { IconType } from "react-icons";

export type ContactMethod = {
  name: string;
  value: string;
  href?: string;
  icon: IconType;
};
