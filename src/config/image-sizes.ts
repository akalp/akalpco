export const DEVICE_SIZES = [
  320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840,
];
export const IMAGE_SIZES = [320, 640, 768, 1024];

const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const MAX_DEVICE_SIZE = Math.max(...DEVICE_SIZES);
export const BLOG_IMAGE_SIZES = `(max-width: ${MAX_DEVICE_SIZE}px) 100vw, ${MAX_DEVICE_SIZE}px`;
export const HERO_IMAGE_SIZES = `(max-width: ${TAILWIND_BREAKPOINTS.lg}px) 100vw, 50vw`;
