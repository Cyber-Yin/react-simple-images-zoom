import { useEffect } from "react";

import { ImagePortal } from "@/components/image-portal/image-portal";

import { useBindImages } from "@/hooks/useBindImages";

import { ImagesZoomGroupProps } from "@/types";

export const ImagesZoomGroup: React.FC<ImagesZoomGroupProps> = ({
  imagesNode,
  customProps,
}) => {
  const { bindImages, currentClickImage, setCurrentClickImage } =
    useBindImages();

  useEffect(() => {
    if (!imagesNode) return;

    bindImages(imagesNode);
  }, [imagesNode]);

  return (
    <ImagePortal
      currentClickImage={currentClickImage}
      onClose={() => setCurrentClickImage(null)}
      {...customProps}
    />
  );
};
