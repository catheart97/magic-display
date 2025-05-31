"use client";
import { updateServerState } from "@/server/server";
import { useServerState } from "@/server/client-utility";
import React from "react";

export const PreviewTextOption = () => {
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>(undefined);
  const { serverState, isLoading } = useServerState();

  React.useEffect(() => {
    if (serverState) {
      if (!areaRef.current) return;
      areaRef.current.value = serverState!.preview?.type == "text" ? serverState.preview.data : "";
    }
  }, [serverState]);

  return (
    <div className="grow h-full w-full">
      <textarea
        ref={areaRef}
        className="h-full w-full resize-none rounded-xl p-2 bg-white"
        placeholder="Type to show a text to your players..."
        onChange={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            if (areaRef.current !== null && areaRef.current!.value != "") {
              serverState!.preview = {
                type: "text",
                data: areaRef.current!.value,
              };
              updateServerState(serverState!);
            } else if (serverState!.preview?.type === "text") {
              serverState!.preview.type = "none";
              updateServerState(serverState!);
            }
          }, 1000);
        }}
      />
    </div>
  );
};
