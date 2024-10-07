import { useCallback, useEffect, useState } from "react";

/**
 * @description image transform methods
 */
export const useImageTransform = (props: {
  initialScale: number;
  minPortalImageWidth: number;
  maxPortalImageWidth: number;
  portalImageNaturalWidth: number;
  portalImageNaturalHeight: number;
}) => {
  const [scale, setScale] = useState(props.initialScale);
  // image position used for smooth scale transform
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState(0);

  // wrapper position used for drag image
  const [wrapperPosition, setWrapperPosition] = useState({ x: 0, y: 0 });

  const transformImageScale = useCallback(
    (value: number, type: "increment" | "absolute" = "absolute") => {
      if (type === "increment") {
        setScale((prevScale) => {
          const newScale = prevScale + value;

          // get new image size
          const newImageSize = {
            width: props.portalImageNaturalWidth * newScale,
            height: props.portalImageNaturalHeight * newScale,
          };

          if (newImageSize.width < props.minPortalImageWidth) {
            // if new image size is smaller than min portal image width, set scale to min portal image width
            return props.minPortalImageWidth / props.portalImageNaturalWidth;
          } else if (newImageSize.width > props.maxPortalImageWidth) {
            // if new image size is larger than max portal image width, set scale to max portal image width
            return props.maxPortalImageWidth / props.portalImageNaturalWidth;
          }

          // if new image size is within the range, set scale to new scale
          return newScale;
        });
      } else {
        const newScale = value;

        // get new image size
        const newImageSize = {
          width: props.portalImageNaturalWidth * newScale,
          height: props.portalImageNaturalHeight * newScale,
        };

        if (newImageSize.width < props.minPortalImageWidth) {
          // if new image size is smaller than min portal image width, set scale to min portal image width
          setScale(props.minPortalImageWidth / props.portalImageNaturalWidth);
        } else if (newImageSize.width > props.maxPortalImageWidth) {
          // if new image size is larger than max portal image width, set scale to max portal image width
          setScale(props.maxPortalImageWidth / props.portalImageNaturalWidth);
        } else {
          // if new image size is within the range, set scale to new scale
          setScale(value);
        }
      }
    },
    [
      props.minPortalImageWidth,
      props.maxPortalImageWidth,
      props.portalImageNaturalWidth,
      props.portalImageNaturalHeight,
    ],
  );

  const transformImagePosition = useCallback(
    (
      value: { x: number; y: number },
      type: "increment" | "absolute" = "absolute",
    ) => {
      if (type === "increment") {
        setPosition((prevPosition) => {
          return {
            x: prevPosition.x + value.x,
            y: prevPosition.y + value.y,
          };
        });
      } else {
        setPosition(value);
      }
    },
    [],
  );

  const transformImageRotate = useCallback(
    (value: number, type: "increment" | "absolute" = "absolute") => {
      if (type === "increment") {
        setRotate((prevRotate) => {
          const newRotate = prevRotate + value;
          const clampedValue = newRotate % 360;
          return clampedValue;
        });
      } else {
        const clampedValue = value % 360;
        setRotate(clampedValue);
      }
    },
    [],
  );

  const transformWrapperPosition = useCallback(
    (
      value: { x: number; y: number },
      type: "increment" | "absolute" = "absolute",
    ) => {
      if (type === "increment") {
        setWrapperPosition((prevPosition) => {
          return {
            x: prevPosition.x + value.x,
            y: prevPosition.y + value.y,
          };
        });
      } else {
        setWrapperPosition(value);
      }
    },
    [],
  );

  const resetImageTransform = useCallback(() => {
    setScale(props.initialScale);
    setPosition({ x: 0, y: 0 });
    setRotate(0);
    setWrapperPosition({ x: 0, y: 0 });
  }, [props.initialScale]);

  useEffect(() => {
    setScale(props.initialScale);
  }, [props.initialScale]);

  return {
    imageScale: scale,
    imagePosition: position,
    imageRotate: rotate,
    wrapperPosition,
    transformImageScale,
    transformImagePosition,
    transformImageRotate,
    transformWrapperPosition,
    resetImageTransform,
  };
};
