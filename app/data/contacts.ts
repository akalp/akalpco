import {
  Mail,
  Linkedin,
  Github,
  MapPin,
  Instagram,
  Bird,
  Twitter,
} from "lucide-react";
import type { ContactMethod } from "@/app/types/contact";

export const contacts: ContactMethod[] = [
  {
    name: "Email",
    value: "hasan.akalp@gmail.com",
    href: "mailto:hasan.akalp@gmail.com",
    icon: Mail,
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/akalp",
    href: "https://linkedin.com/in/akalp",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    value: "github.com/akalp",
    href: "https://github.com/akalp",
    icon: Github,
  },
  {
    name: "Instagram",
    value: "instagram.com/hasanakalp",
    href: "https://instagram.com/hasanakalp",
    icon: Instagram,
  },
  {
    name: "Bluesky",
    value: "bsky.app/profile/hasan.akalp.co",
    href: "https://bsky.app/profile/hasan.akalp.co",
    icon: Bird,
  },
  {
    name: "X (Twitter)",
    value: "x.com/hasanakalp",
    href: "https://x.com/hasanakalp",
    icon: Twitter,
  },
  {
    name: "Location",
    value: "Ankara, Turkey",
    icon: MapPin,
  },
] as const;
