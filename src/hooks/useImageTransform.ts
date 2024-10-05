import { useCallback, useEffect, useState } from "react";

/**
 * @description image transform methods
 */
export const useImageTransform = (props: {
  scale: {
    min: number;
    max: number;
  };
  initialScale: number;
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

          const clampedValue = Math.min(
            Math.max(newScale, props.scale.min),
            props.scale.max,
          );

          return clampedValue;
        });
      } else {
        const clampedValue = Math.min(
          Math.max(value, props.scale.min),
          props.scale.max,
        );

        setScale(clampedValue);
      }
    },
    [props.scale.min, props.scale.max],
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
