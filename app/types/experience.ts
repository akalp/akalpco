export type Experience = {
  company: string;
  role: string;
  start: string; // e.g., "Jan 2022"
  end: string; // e.g., "Present" or "Dec 2023"
  bullets: string[]; // 2–3 concise, impact-focused points
  location?: string;
  link?: string; // optional company or project link
};

