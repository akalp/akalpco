import {
  FiMail,
  FiLinkedin,
  FiGithub,
  FiMapPin,
  FiInstagram,
  FiTwitter,
} from "react-icons/fi";
import { RiBlueskyLine } from "react-icons/ri";
import type { ContactMethod } from "@/types/contact";

export const contacts: ContactMethod[] = [
  {
    name: "Email",
    value: "hasan.akalp@gmail.com",
    href: "mailto:hasan.akalp@gmail.com",
    icon: FiMail,
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/akalp",
    href: "https://linkedin.com/in/akalp",
    icon: FiLinkedin,
  },
  {
    name: "GitHub",
    value: "github.com/akalp",
    href: "https://github.com/akalp",
    icon: FiGithub,
  },
  {
    name: "Instagram",
    value: "instagram.com/hasanakalp",
    href: "https://instagram.com/hasanakalp",
    icon: FiInstagram,
  },
  {
    name: "Bluesky",
    value: "bsky.app/profile/hasan.akalp.co",
    href: "https://bsky.app/profile/hasan.akalp.co",
    icon: RiBlueskyLine,
  },
  {
    name: "X (Twitter)",
    value: "x.com/hasanakalp",
    href: "https://x.com/hasanakalp",
    icon: FiTwitter,
  },
  {
    name: "Location",
    value: "Ankara, Turkey",
    icon: FiMapPin,
  },
] as const;
