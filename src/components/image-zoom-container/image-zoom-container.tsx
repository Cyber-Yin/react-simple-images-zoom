import { useRef, useState } from "react";

import { ImagePortal } from "@/components/image-portal/image-portal";

import { ImageZoomContainerProps } from "@/types";

export const ImageZoomContainer: React.FC<ImageZoomContainerProps> = ({
  customProps,
  ...props
}) => {
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <>
      <img
        onClick={() => setIsPortalOpen(true)}
        ref={imageRef}
        {...props}
      />
      <ImagePortal
        currentClickImage={isPortalOpen ? imageRef.current : null}
        onClose={() => setIsPortalOpen(false)}
        {...customProps}
      />
    </>
  );
};
