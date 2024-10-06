import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ImageZoomContainer } from "@/components";

const App = () => {
  return (
    <div>
      <ImageZoomContainer
        style={{ width: "100px", height: "100px" }}
        src="https://images.unsplash.com/photo-1728068136248-6527c9c06c73?q=80&w=2574"
        alt=""
      />

      <ImageZoomContainer
        style={{ width: "100px", height: "100px" }}
        src="https://plus.unsplash.com/premium_photo-1728034277956-9f6fbf7b4c33?q=80&w=2574"
        alt=""
      />

      <ImageZoomContainer
        style={{ width: "100px", height: "100px" }}
        src="https://images.unsplash.com/photo-1728046321877-f76888663fd6?q=80&w=1000"
        alt=""
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
