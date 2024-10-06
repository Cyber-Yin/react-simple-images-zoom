import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Close, Reset, ZoomIn, ZoomOut } from "@/components/icons";

import { useImageTransform } from "@/hooks/useImageTransform";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

import { ImagePortalProps } from "@/types";

import "./image-portal.style.css";

export const ImagePortal: React.FC<ImagePortalProps> = ({
  currentClickImage,
  portalAnimationDuration = 300,
  imageTransformDuration = 100,
  onClose,
  portalProps,
  wrapperProps,
  imageProps,
  maxZoom = 2,
  minZoom = 0.2,
  customControls,
  customControlClassName,
}) => {
  const { lockBodyScroll, unlockBodyScroll } = useLockBodyScroll();

  const [enterAnimationCompleted, setEnterAnimationCompleted] = useState(false);

  const [initialScale, setInitialScale] = useState(1);

  const {
    imageScale,
    imagePosition,
    imageRotate,
    wrapperPosition,
    transformImageScale,
    transformImagePosition,
    transformImageRotate,
    transformWrapperPosition,
    resetImageTransform,
  } = useImageTransform({
    scale: {
      min: minZoom,
      max: maxZoom,
    },
    initialScale,
  });

  useEffect(() => {
    if (!currentClickImage) return;

    lockBodyScroll();

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const imageHeight = currentClickImage.naturalHeight;
    const imageWidth = currentClickImage.naturalWidth;

    const targetHeight = windowHeight * 0.8;
    const targetWidth = windowWidth * 0.8;

    const isImageTooBig =
      imageHeight > targetHeight || imageWidth > targetWidth;

    if (isImageTooBig) {
      const scale = Math.min(
        targetHeight / imageHeight,
        targetWidth / imageWidth,
      );

      setInitialScale(scale);
    }

    setTimeout(() => {
      setEnterAnimationCompleted(true);
    }, portalAnimationDuration);
  }, [currentClickImage]);

  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const imgElement = useRef<HTMLImageElement | null>(null);

  const delayClosePortal = useCallback(() => {
    setEnterAnimationCompleted(false);

    setTimeout(() => {
      onClose();
      resetImageTransform();
      unlockBodyScroll();
    }, portalAnimationDuration);
  }, [onClose, portalAnimationDuration, resetImageTransform]);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLImageElement>) => {
      if (!imgElement.current) return;

      const image = imgElement.current;

      const rect = image.getBoundingClientRect();

      // get image center position
      const imageCenterPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      // get image size
      const currentImageSize = {
        width: image.offsetWidth * imageScale,
        height: image.offsetHeight * imageScale,
      };

      // get cursor position rate
      const cursorPositionRate = {
        x: (e.clientX - imageCenterPosition.x) / (rect.width / 2),
        y: (e.clientY - imageCenterPosition.y) / (rect.height / 2),
      };

      // get new scale
      const newScale = imageScale * (e.deltaY > 0 ? 0.9 : 1.1);
      const clampedScale = Math.min(Math.max(newScale, minZoom), maxZoom);

      if (clampedScale === maxZoom || clampedScale === minZoom) {
        return;
      }

      // get new image size
      const newImageSize = {
        width: image.offsetWidth * clampedScale,
        height: image.offsetHeight * clampedScale,
      };

      // get image size diff
      const imageSizeDiff = {
        width: (newImageSize.width - currentImageSize.width) / 2,
        height: (newImageSize.height - currentImageSize.height) / 2,
      };

      // get transform position
      const transformPosition = {
        x: -imageSizeDiff.width * cursorPositionRate.x,
        y: -imageSizeDiff.height * cursorPositionRate.y,
      };

      transformImagePosition(transformPosition, "increment");
      transformImageScale(newScale);
    },
    [imageScale, minZoom, maxZoom, transformImagePosition, transformImageScale],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    transformWrapperPosition({ x: dx, y: dy }, "increment");
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);

  if (!currentClickImage) return null;

  return createPortal(
    <div
      onMouseMove={handleMouseMove}
      onClick={delayClosePortal}
      {...portalProps}
      className={`image-portal ${enterAnimationCompleted ? "enter" : "exit"}${portalProps?.className ? ` ${portalProps.className}` : ""}`}
      style={{
        opacity: enterAnimationCompleted ? 1 : 0,
        transition: `opacity ${portalAnimationDuration}ms`,
        pointerEvents: enterAnimationCompleted ? "auto" : "none",
        ...portalProps?.style,
      }}
    >
      {customControls ? (
        <div
          className={customControlClassName}
          onClick={(e) => e.stopPropagation()}
          style={{ zIndex: 100 }}
        >
          {customControls({
            transformImageScale: transformImageScale,
            transformImagePosition: transformImagePosition,
            transformImageRotate: transformImageRotate,
            resetImageTransform: resetImageTransform,
            closePortal: delayClosePortal,
          })}
        </div>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="image-wrapper-button-group"
        >
          <button
            className="image-wrapper-button"
            aria-label="zoom in"
            onClick={() => transformImageScale(0.1, "increment")}
          >
            <ZoomIn />
          </button>
          <button
            className="image-wrapper-button"
            aria-label="zoom out"
            onClick={() => transformImageScale(-0.1, "increment")}
          >
            <ZoomOut />
          </button>
          <button
            className="image-wrapper-button"
            aria-label="reset"
            onClick={resetImageTransform}
          >
            <Reset />
          </button>
          <button
            className="image-wrapper-button"
            aria-label="close"
            onClick={delayClosePortal}
          >
            <Close />
          </button>
        </div>
      )}
      <div
        className={
          "image-wrapper" +
          (wrapperProps?.className ? ` ${wrapperProps.className}` : "")
        }
        style={{
          transform: `translate(calc(-50% + ${wrapperPosition.x}px), calc(-50% + ${wrapperPosition.y}px))`,
          transition: isDragging.current
            ? "none"
            : `transform ${imageTransformDuration}ms`,
          willChange: "transform",
          ...wrapperProps?.style,
        }}
      >
        <img
          ref={imgElement}
          src={currentClickImage.src}
          alt={currentClickImage.alt}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          {...imageProps}
          className={imageProps?.className ? ` ${imageProps?.className}` : ""}
          style={{
            transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale}) rotate(${imageRotate}deg)`,
            transition: `transform ${imageTransformDuration}ms`,
            willChange: "transform",
            cursor: "grab",
            ...imageProps?.style,
          }}
        />
      </div>
    </div>,
    document.body,
  );
};
