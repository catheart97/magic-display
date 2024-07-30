"use client";
import { updateServerState } from "@/server/Server";
import { useServerState } from "@/server/ClientUtility";
import React from "react";

export const PreviewTextOption = () => {
  const areaRef = React.useRef<HTMLTextAreaElement>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const { serverState, isLoading } = useServerState();

  React.useEffect(() => {
    if (serverState) {
      if (!areaRef.current) return;
      areaRef.current.value = serverState!.previewText;
    }
  }, [serverState]);

  return (
    <div className="grow p-2">
      <textarea
        ref={areaRef}
        className="h-full w-full resize-none rounded-xl p-2"
        placeholder="Type to show a text to your players..."
        onChange={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            serverState!.previewText = areaRef.current!.value;
            updateServerState(serverState!);
          }, 1000);
        }}
      />
    </div>
  );
};
