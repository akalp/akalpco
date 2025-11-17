export type Technology = {
  name: string;
  icon?: string;
  color?: string;
};

export type Project = {
  title: string;
  description: string;
  image?: string;
  technologies: Technology[];
  link?: string;
  github?: string;
  featured: boolean;
  category: "professional" | "personal";
};
