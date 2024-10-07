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
  minPortalImageWidth = 200,
  maxPortalImageWidth = 10000,
  customControls,
  customControlClassName,
}) => {
  const { lockBodyScroll, unlockBodyScroll } = useLockBodyScroll();

  const [enterAnimationCompleted, setEnterAnimationCompleted] = useState(false);
  const [initialScale, setInitialScale] = useState(1);
  const [
    portalImageNaturalWidthAndHeight,
    setPortalImageNaturalWidthAndHeight,
  ] = useState({
    width: 0,
    height: 0,
  });

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
    initialScale,
    minPortalImageWidth,
    maxPortalImageWidth,
    portalImageNaturalWidth: portalImageNaturalWidthAndHeight.width,
    portalImageNaturalHeight: portalImageNaturalWidthAndHeight.height,
  });

  useEffect(() => {
    if (!currentClickImage) return;

    lockBodyScroll();

    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const imageHeight = currentClickImage.naturalHeight;
    const imageWidth = currentClickImage.naturalWidth;

    setPortalImageNaturalWidthAndHeight({
      width: imageWidth,
      height: imageHeight,
    });

    const targetHeight = windowHeight * 0.8;
    const targetWidth =
      windowWidth * 0.8 > minPortalImageWidth
        ? windowWidth * 0.8
        : minPortalImageWidth;

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
  const touchStartDistance = useRef<number | null>(null);

  const imgElement = useRef<HTMLImageElement | null>(null);

  /**
   * delay close portal
   * @returns void
   */
  const delayClosePortal = useCallback(() => {
    setEnterAnimationCompleted(false);

    setTimeout(() => {
      onClose();
      resetImageTransform();
      unlockBodyScroll();
    }, portalAnimationDuration);
  }, [onClose, portalAnimationDuration, resetImageTransform]);

  /**
   * handle desktop mouse wheel event
   * @param e - wheel event
   * @returns void
   */
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
      let newScale = imageScale * (e.deltaY > 0 ? 0.9 : 1.1);

      // get new image size
      const newImageSize = {
        width: image.offsetWidth * newScale,
        height: image.offsetHeight * newScale,
      };

      // if new image size is smaller than min portal image width or larger than max portal image width, adjust the scale
      if (
        newImageSize.width < minPortalImageWidth ||
        newImageSize.width > maxPortalImageWidth
      ) {
        if (newImageSize.width < minPortalImageWidth) {
          newScale = minPortalImageWidth / image.offsetWidth;
        } else {
          newScale = maxPortalImageWidth / image.offsetWidth;
        }

        newImageSize.width = image.offsetWidth * newScale;
        newImageSize.height = image.offsetHeight * newScale;
      }

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
    [
      imageScale,
      minPortalImageWidth,
      maxPortalImageWidth,
      transformImagePosition,
      transformImageScale,
    ],
  );

  /**
   * handle desktop mouse down event
   * @param e - mouse down event
   * @returns void
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  /**
   * handle desktop mouse move event
   * @param e - mouse move event
   * @returns void
   */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    transformWrapperPosition({ x: dx, y: dy }, "increment");
    lastPosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  /**
   * handle desktop mouse up event
   * @returns void
   */
  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  /**
   * handle mobile touch start event
   * @param e - touch start event
   * @returns void
   */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      touchStartDistance.current = distance;
    }
  }, []);

  /**
   * handle mobile touch move event
   * @param e - touch move event
   * @returns void
   */
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging.current) {
        // move wrapper
        const dx = e.touches[0].clientX - lastPosition.current.x;
        const dy = e.touches[0].clientY - lastPosition.current.y;
        transformWrapperPosition({ x: dx, y: dy }, "increment");
        lastPosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (
        e.touches.length === 2 &&
        touchStartDistance.current !== null &&
        imgElement.current
      ) {
        // zoom image
        const image = imgElement.current;

        const newDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const scale = newDistance / touchStartDistance.current;
        let newScale = imageScale * scale;

        const newImageSize = {
          width: image.offsetWidth * newScale,
          height: image.offsetHeight * newScale,
        };

        if (
          newImageSize.width < minPortalImageWidth ||
          newImageSize.width > maxPortalImageWidth
        ) {
          if (newImageSize.width < minPortalImageWidth) {
            newScale = minPortalImageWidth / image.offsetWidth;
          } else {
            newScale = maxPortalImageWidth / image.offsetWidth;
          }

          newImageSize.width = image.offsetWidth * newScale;
          newImageSize.height = image.offsetHeight * newScale;
        }

        if (newScale !== imageScale) {
          transformImageScale(newScale);
        }

        touchStartDistance.current = newDistance;
      }

      // prevent default touch event
      return false;
    },
    [
      imageScale,
      minPortalImageWidth,
      maxPortalImageWidth,
      touchStartDistance,
      transformWrapperPosition,
      transformImageScale,
    ],
  );

  /**
   * handle mobile touch end event
   * @returns void
   */
  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    touchStartDistance.current = null;
  }, []);

  if (!currentClickImage) return null;

  return createPortal(
    <div
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
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
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
