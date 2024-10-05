import { useRef } from "react";

/**
 * @description lock body scroll
 */
export const useLockBodyScroll = () => {
  const bodyOverflowProperty = useRef("");

  const lockBodyScroll = () => {
    bodyOverflowProperty.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  };

  const unlockBodyScroll = () => {
    document.body.style.overflow = bodyOverflowProperty.current;
  };

  return { lockBodyScroll, unlockBodyScroll };
};
