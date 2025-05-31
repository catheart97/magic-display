"use client";

import React from "react";

export const DisplayWrapper = (props: { children: React.ReactNode }) => {
  const pageContainer = React.useRef<HTMLDivElement>(null);
  const elementContainer = React.useRef<HTMLDivElement>(null);
  const [containerScale, setContainerScale] = React.useState<number>(1);

  React.useEffect(() => {
    const resizeHandler = (_e: Event) => {
      if (pageContainer.current && elementContainer.current) {
        const scale = Math.min(
          pageContainer.current.clientWidth /
            elementContainer.current.clientWidth,
          pageContainer.current.clientHeight /
            elementContainer.current.clientHeight,
        );
        setContainerScale(scale);
      }
    };

    resizeHandler(new Event("resize"));

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="h-dvh w-[dvw] overflow-hidden bg-black">
      <div
        className="h-full w-full"
        ref={pageContainer}
        style={{
          resize: "both",
          position: "relative",
        }}
      >
        <div
          ref={elementContainer}
          className="bg-white transition-all duration-100 overflow-hidden"
          style={{
            transform: `translate(-50%, -50%) scale(${containerScale})`,
            transformOrigin: "center center",
            left: "50%",
            top: "50%",
            position: "relative",
            width: "1920px",
            height: "1080px",
          }}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};
