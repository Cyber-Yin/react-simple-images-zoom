export interface ImageControlMethods {
  transformImageScale: (value: number, type?: "increment" | "absolute") => void;
  transformImagePosition: (
    value: { x: number; y: number },
    type?: "increment" | "absolute",
  ) => void;
  transformImageRotate: (
    value: number,
    type?: "increment" | "absolute",
  ) => void;
  transformWrapperPosition: (
    value: { x: number; y: number },
    type?: "increment" | "absolute",
  ) => void;
  resetImageTransform: () => void;
}

export interface CustomProps {
  /**
   * @description image portal display (open/close) animation duration, default is 300ms
   */
  portalAnimationDuration?: number;

  /**
   * @description image transform (zoom in/out and drag) animation duration, default is 100ms
   */
  imageTransformDuration?: number;

  /**
   * @description image portal min width, default is 200px
   */
  minPortalImageWidth?: number;

  /**
   * @description image portal max width, default is 10000px
   */
  maxPortalImageWidth?: number;

  /**
   * @description image portal props
   */
  portalProps?: {
    className?: string;
    style?: React.CSSProperties;
  };

  /**
   * @description image portal wrapper props
   */
  wrapperProps?: {
    className?: string;
    style?: React.CSSProperties;
  };

  /**
   * @description image props
   */
  imageProps?: {
    className?: string;
    style?: React.CSSProperties;
  };

  /**
   * @description image function button group
   */
  customControls?: (methods: {
    transformImageScale: ImageControlMethods["transformImageScale"];
    transformImagePosition: ImageControlMethods["transformImagePosition"];
    transformImageRotate: ImageControlMethods["transformImageRotate"];
    resetImageTransform: ImageControlMethods["resetImageTransform"];
    closePortal: () => void;
  }) => React.ReactNode;

  /**
   * @description custom control button group className
   */
  customControlClassName?: string;
}

export interface ImagesZoomGroupProps {
  /**
   * @description images node
   */
  imagesNode?: NodeListOf<HTMLImageElement>;

  /**
   * @description custom props
   */
  customProps?: CustomProps;
}

export interface ImagePortalProps extends CustomProps {
  currentClickImage: HTMLImageElement | null;
  onClose: () => void;
}

export interface ImageZoomContainerProps
  extends React.HTMLProps<HTMLImageElement> {
  /**
   * @description custom props
   */
  customProps?: CustomProps;
}
