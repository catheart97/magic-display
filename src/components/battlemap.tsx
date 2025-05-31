import React from "react";
import { useServerState } from "@/server/client-utility";
import { Configuration } from "@/configuration";

export const Battlemap = () => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const { serverState } = useServerState();
  const visible = serverState?.preview.type == "battlemap";

  React.useEffect(() => {
    if (visible) {
      iframeRef.current!.src = iframeRef.current!.src;
    }
  }, [visible]);

  return (
    visible && (
      <iframe
        ref={iframeRef}
        src={Configuration.battlemapURL}
        className={
          "absolute inset-0 h-full w-full bg-black transition-opacity duration-500 ease-in-out " +
          (visible ? "opacity-100" : "opacity-0")
        }
        style={{
          zIndex: 99999,
          backgroundColor: "black",
        }}
      />
    )
  );
};
