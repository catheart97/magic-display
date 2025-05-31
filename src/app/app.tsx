"use client";

import { Battlemap } from "@/components/battlemap";
import Calendar from "@/components/calendar";
import { DisplayWrapper } from "@/components/display-wrapper";
import { ParticleLayer } from "@/components/particle-layer";
import { PartySlider } from "@/components/party-slider";
import { PathOfHeros } from "@/components/path-of-heroes";
import { PersistentImage } from "@/components/persistent-image";
import Tipps from "@/components/tipps";
import { useCampaignMeta, useServerState } from "@/server/client-utility";
import { getDiashowImages } from "@/server/server";
import * as React from "react";
import Markdown from "react-markdown";

export default () => {
  const [diashowIndex, setDiashowIndex] = React.useState(0);
  const [diashowImages, setDiashowImages] = React.useState<Array<string>>([]);
  const intervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const { campaignMeta } = useCampaignMeta();
  const { serverState, isLoading } = useServerState();

  React.useEffect(() => {
    if (intervalRef.current !== undefined) {
      clearInterval(intervalRef.current);
    }
    let index = 0;
    intervalRef.current = setInterval(() => {
      index = (index + 1) % diashowImages.length;
      setDiashowIndex(index);
    }, 10000);
  }, [diashowImages]);

  React.useEffect(() => {
    (async () => {
      const images = await getDiashowImages();
      setDiashowImages(images);
    })();
  }, [serverState]);

  const usePathOfHeroes = campaignMeta && campaignMeta.map;

  return (
    <DisplayWrapper>
      <div className="relative h-full w-full">
        {/** Background blurred */}
        <div className="absolute bottom-0 left-0 right-0 top-0">
          {diashowImages.map((image, index) => {
            const isPrev =
              (diashowIndex - 1 + diashowImages.length) %
                diashowImages.length ===
              index;
            const isNext = (diashowIndex + 1) % diashowImages.length === index;
            const is = diashowIndex === index;

            if (!(isPrev || isNext || is)) return null;

            return (
              <div
                key={index}
                className={[
                  "linear bottom-0 left-0 right-0 top-0 blur-xl transition-opacity duration-1000",
                  index === diashowIndex ? "opacity-100" : "opacity-0",
                  isPrev || isNext || is ? "absolute" : "hidden",
                ].join(" ")}
              >
                <PersistentImage
                  className="h-full w-full object-cover"
                  src={"/api/image?fn=" + encodeURIComponent(image)}
                />
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-10 right-10 z-20 h-96 w-xl">
          {usePathOfHeroes ? <PathOfHeros /> : null}
        </div>

        <ParticleLayer />

        <div className="absolute inset-0 flex justify-between">
          <div className="flex w-1/2 flex-col items-center justify-between p-10">
            <div className="grid h-full w-full grow grid-cols-1 grid-rows-2 gap-10">
              <div className="flex h-full w-full items-stretch justify-between gap-6 rounded-xl">
                {campaignMeta &&
                campaignMeta.players.length + campaignMeta.playerNPCs.length >
                  0 ? (
                  <>
                    <div className="grow">
                      <PartySlider />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col">
                    <div className="flex grow flex-col justify-center text-french">
                      <div className="pb-4 text-7xl">
                        {campaignMeta && campaignMeta.name}
                      </div>
                      <hr />
                      <div className="pt-3">Campaign/Adventure</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-full w-full">
                <Tipps />
              </div>
            </div>
          </div>

          {campaignMeta && campaignMeta.calendar && (
            <div
              className="absolute bottom-10 z-20"
              style={{
                left: "52%",
              }}
            >
              <div className="h-fit w-72">
                <Calendar admin={false} />
              </div>
            </div>
          )}

          <div
            className={
              "flex w-1/2 flex-col p-10 " +
              (usePathOfHeroes ? "pr-26 justify-start" : "justify-center")
            }
          >
            <div className="relative h-fit">
              <div className="aspect-square w-full" />
              {diashowImages.map((image, index) => {
                const isPrev =
                  (diashowIndex - 1 + diashowImages.length) %
                    diashowImages.length ===
                  index;
                const isNext =
                  (diashowIndex + 1) % diashowImages.length === index;
                const is = diashowIndex === index;

                if (!(isPrev || isNext || is)) return null;

                return (
                  <div
                    key={index}
                    className={[
                      "linear absolute bottom-0 left-0 right-0 top-0 transition-opacity duration-1000",
                      index === diashowIndex ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  >
                    <PersistentImage
                      className="aspect-1 w-full rounded-xl object-contain shadow-2xl shadow-black"
                      src={"/api/image?fn=" + encodeURIComponent(image)}
                    />
                  </div>
                );
              })}
              <div
                className={[
                  "linear absolute bottom-0 left-0 right-0 top-0 transition-opacity duration-1000",
                  !isLoading && serverState?.preview?.type == "image"
                    ? "opacity-100"
                    : "opacity-0",
                ].join(" ")}
              >
                {!isLoading &&
                serverState?.preview?.data &&
                serverState?.preview?.data != "" ? (
                  <img
                    className="aspect-1 w-full rounded-xl"
                    src={serverState?.preview?.data}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={[
          "linear prose prose-lg prose-neutral absolute bottom-0 left-1/2 right-0 top-0 z-50 max-w-none rounded-l-xl bg-white p-8 transition-opacity duration-1000 prose-p:w-full",
          !isLoading && serverState?.preview?.type == "text"
            ? "opacity-100"
            : "opacity-0",
        ].join(" ")}
      >
        <Markdown>{!isLoading ? serverState?.preview?.data : ""}</Markdown>
      </div>

      <Battlemap />
    </DisplayWrapper>
  );
};
