# React Simple Images Zoom

> A simple image zoom component for React

## Sources

- [Demo](https://react-simple-images-zoom-demo.vercel.app/)

## Dependencies

- react: >=16.8.0
- react-dom: >=16.8.0

## Key Features

- 🚀 Fast and easy to use
- 🏭 Light, without external dependencies
- 💎 Desktop mouse events support
- 🔧 Highly customizable

## Installation

```bash
npm install --save react-simple-images-zoom
```

## Examples

You can use this package in two ways:

### Use `ImageZoomContainer` component

This component is extended from `<img />` tag, so you can use it as a replacement for `<img />` tag.

```tsx
import { ImageZoomContainer } from "react-simple-images-zoom";

const App = () => {
  return (
    <ImageZoomContainer
      src="your-image-url"
      alt="your-image-alt"
    />
  );
};
```

### Use `ImagesZoomGroup` component

If you want to bind existing `<img />` tags, you can use `ImagesZoomGroup` component.

```tsx
import { useEffect, useState } from "react";
import { ImagesZoomGroup } from "react-simple-images-zoom";

const App = () => {
  const [imagesNode, setImagesNode] = useState<NodeListOf<HTMLImageElement>>();

  useEffect(() => {
    const images = document.querySelectorAll("img");
    setImagesNode(images);
  }, []);

  return <ImagesZoomGroup imagesNode={imagesNode} />;
};
```

## Custom Props

You can pass `customProps` to `ImageZoomContainer` and `ImagesZoomGroup` components.

```tsx
import { useEffect, useState } from "react";
import { ImageZoomContainer, ImagesZoomGroup } from "react-simple-images-zoom";

const CustomImageZoomContainer = () => {
  return (
    <ImageZoomContainer
      src="your-image-url"
      alt="your-image-alt"
      customProps={{
        portalAnimationDuration: 200,
        imageTransformDuration: 50,
        // ... other custom props
      }}
    />
  );
};

const CustomImagesZoomGroup = () => {
  const [imagesNode, setImagesNode] = useState<NodeListOf<HTMLImageElement>>();

  useEffect(() => {
    const images = document.querySelectorAll("img");
    setImagesNode(images);
  }, []);

  return (
    <ImagesZoomGroup
      imagesNode={imagesNode}
      customProps={{
        portalAnimationDuration: 200,
        imageTransformDuration: 50,
        // ... other custom props
      }}
    />
  );
};
```

You can also custom controller buttons by passing `customControls` and `customControlClassName` props:

```tsx
import { ImageZoomContainer } from "react-simple-images-zoom";

const App = () => {
  const customControls = ({
    transformImageScale,
    transformImagePosition,
    transformImageRotate,
    resetImageTransform,
    closePortal,
  }) => {
    return (
      <div>
        <button onClick={() => transformImageScale(0.1, "increment")}>
          Zoom In
        </button>
        <button onClick={() => transformImageScale(-0.1, "increment")}>
          Zoom Out
        </button>
        <button onClick={() => transformImageRotate(90, "increment")}>
          Rotate
        </button>
        <button onClick={() => resetImageTransform()}>Reset</button>
        <button onClick={() => closePortal()}>Close</button>
      </div>
    );
  };

  return (
    <ImageZoomContainer
      src="your-image-url"
      alt="your-image-alt"
      customProps={{
        customControls,
        customControlClassName: "custom-controls",
      }}
    />
  );
};
```

This is the full list of custom props:

```ts
interface CustomProps {
  /**
   * @description image portal display (open/close) animation duration, default is 300ms
   */
  portalAnimationDuration?: number;

  /**
   * @description image transform (zoom in/out and drag) animation duration, default is 100ms
   */
  imageTransformDuration?: number;

  /**
   * @description image max zoom, default is 2
   */
  maxZoom?: number;

  /**
   * @description image min zoom, default is 0.2
   */
  minZoom?: number;

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
   * @description image inside portal props
   */
  imageProps?: {
    className?: string;
    style?: React.CSSProperties;
  };

  /**
   * @description image controllers function
   */
  customControls?: (methods: {
    transformImageScale: (
      value: number,
      type?: "increment" | "absolute",
    ) => void;
    transformImagePosition: (
      value: { x: number; y: number },
      type?: "increment" | "absolute",
    ) => void;
    transformImageRotate: (
      value: number,
      type?: "increment" | "absolute",
    ) => void;
    resetImageTransform: () => void;
    closePortal: () => void;
  }) => React.ReactNode;

  /**
   * @description custom controllers className
   */
  customControlClassName?: string;
}
```

> Tip: `type` in `customControls` means react setState type, `increment` means the value is added to the current value, `absolute` means the value is set to the current value.

```tsx
const [state, setState] = useState(1);

// increment
setState((prev) => prev + 1);
setState((prev) => prev + 1);
setState((prev) => prev + 1);

// absolute
setState(1);
```

## Development

```bash
git clone https://github.com/Cyber-Yin/react-simple-images-zoom.git
cd react-simple-images-zoom

yarn --frozen-lockfile
yarn dev
```

Then open `http://localhost:3000` in your browser.

## License

[MIT](https://github.com/Cyber-Yin/react-simple-images-zoom/blob/main/LICENSE)
