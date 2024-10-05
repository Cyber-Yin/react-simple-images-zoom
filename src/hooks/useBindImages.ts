import { useCallback, useEffect, useState } from "react";

/**
 * @description bind images node and listen click event
 */
export const useBindImages = () => {
  const [imagesNode, setImagesNode] = useState<HTMLImageElement[]>([]);
  const [currentClickImage, setCurrentClickImage] =
    useState<HTMLImageElement | null>(null);

  /**
   * @description bind images node
   */
  const bindImages = useCallback((images: NodeListOf<HTMLImageElement>) => {
    setImagesNode(Array.from(images));
  }, []);

  /**
   * @description listen click event
   */
  const imageClickListener = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLImageElement;
    setCurrentClickImage(target);
  }, []);

  useEffect(() => {
    imagesNode.forEach((node) => {
      node.addEventListener("click", imageClickListener);
    });

    return () => {
      imagesNode.forEach((node) => {
        node.removeEventListener("click", imageClickListener);
      });
    };
  }, [imagesNode]);

  return {
    bindImages,
    currentClickImage,
    setCurrentClickImage,
  };
};
