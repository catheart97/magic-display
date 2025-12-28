import React from "react";
import { useCampaignMeta, useServerState } from "@/server/client-utility";
import { Configuration } from "@/configuration";

export const Battlemap = () => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const { serverState } = useServerState();
  const visible = serverState?.preview.type == "battlemap";

  const { campaignMeta, isLoading } = useCampaignMeta();

  React.useEffect(() => {
    if (visible) {
      iframeRef.current!.src = iframeRef.current!.src;
    }
  }, [visible]);

  return (
    visible && (
      <div className="absolute inset-0 z-50 h-full w-full">
        <div className="relative h-full w-full">
          <iframe
            ref={iframeRef}
            src={Configuration.battlemapURL}
            className={
              "h-full w-full bg-black transition-opacity duration-500 ease-in-out"
            }
            style={{
              zIndex: 99999,
              backgroundColor: "black",
            }}
          />
          <div className="absolute top-0 left-0 z-20 min-w-64 bg-white rounded-br-3xl">
            {campaignMeta && (
              <div className="p-4">
                <h2 className="text-french-900 text-4xl font-bold">
                  {campaignMeta.name}
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};
