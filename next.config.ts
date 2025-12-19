import type { NextConfig } from "next";
import { DEVICE_SIZES, IMAGE_SIZES } from "./src/config/image-sizes";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    imageSizes: IMAGE_SIZES,
    deviceSizes: DEVICE_SIZES,
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "85",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "optimized",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
    nextImageExportOptimizer_remoteImageCacheTTL: "0",
  },
};

export default nextConfig;
