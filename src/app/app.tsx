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

const SmartImageFill = (props: { src: string; className?: string }) => {
  const [heightMaxed, setHeightMaxed] = React.useState(false);
  const image = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!image.current) return;

    // get parent element height and width
    const parent = image.current.parentElement;
    if (!parent) return;
    const parentHeight = parent.clientHeight;
    const parentWidth = parent.clientWidth;
    const parentRatio = parentWidth / parentHeight;

    const img = image.current;
    const update = () => {
      const imgHeight = img.naturalHeight;
      const imgWidth = img.naturalWidth;
      const imgRatio = imgWidth / imgHeight;

      // Check if the image is taller than the parent
      if (imgRatio < parentRatio) {
        setHeightMaxed(true);
      } else {
        setHeightMaxed(false);
      }
    };
    img.addEventListener("load", update);
    img.addEventListener("error", update); // Handle error case as well

    update(); // Call onLoad initially in case the image is already loaded
  }, [props.src]);

  return (
    <img
      ref={image}
      className={
        (heightMaxed ? "h-full w-auto" : "h-auto w-full") +
        " transition-all duration-400 ease-in-out " +
        props.className
      }
      src={props.src}
    ></img>
  );
};

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
        <div className="absolute top-0 right-0 bottom-0 left-0">
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
                  "linear top-0 right-0 bottom-0 left-0 blur-xl transition-opacity duration-1000",
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

        <div className="absolute right-10 bottom-10 z-20 h-96 w-xl">
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
                    <div className="text-french flex grow flex-col justify-center">
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
              <div className="w-fit h-fit border-[0.5px] border-white/80 rounded-3xl shadow-2xl inset-shadow-glass">
                <div className="h-fit w-96 rounded-3xl">
                  <Calendar admin={false} />
                </div>
              </div>
            </div>
          )}

          <div
            className={
              "flex w-1/2 flex-col p-10 " +
              (usePathOfHeroes ? "justify-start pr-26" : "justify-start")
            }
          >
            <div className="relative h-fit ">
              <div className="aspect-square w-full inset-shadow-glass rounded-3xl" />
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
                      "linear absolute top-0 right-0 bottom-0 left-0 transition-opacity duration-1000 rounded-3xl backdrop-blur-3xl",
                      index === diashowIndex ? "opacity-80" : "opacity-0",
                    ].join(" ")}
                  >
                    <PersistentImage
                      className="aspect-1 w-full rounded-3xl object-contain shadow-2xl shadow-black"
                      src={"/api/image?fn=" + encodeURIComponent(image)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className={[
          "linear absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 p-4 transition-opacity duration-1000",
          !isLoading && serverState?.preview?.type == "image"
            ? "opacity-100"
            : "opacity-0",
        ].join(" ")}
      >
        {!isLoading &&
        serverState?.preview?.data &&
        serverState?.preview?.data != "" ? (
          <SmartImageFill
            className="rounded-2xl"
            src={serverState?.preview?.data}
          />
        ) : (
          <></>
        )}
      </div>


      <div className="absolute inset-0 bg-black/80 transition-opacity duration-1000 z-40 pointer-events-none" style={{
        opacity: !isLoading && serverState?.preview?.type == "text" ? 1 : 0,
      }}></div>
      <div
        className={[
          "linear prose prose-2xl prose-neutral flex items-center prose-p:w-full absolute top-0 right-0 bottom-0 left-1/2 z-50 max-w-none rounded-l-2xl bg-white p-8 transition-opacity duration-1000",
          !isLoading && serverState?.preview?.type == "text"
            ? "opacity-100"
            : "opacity-0",
        ].join(" ")}
      >
        <Markdown>{!isLoading ? serverState?.preview?.data : ""}</Markdown>
      </div>

      <div className="right-12 bottom-12 text-7xl text-french-100 z-50 absolute">
        {(campaignMeta && !campaignMeta.map) && campaignMeta.name}
      </div>

      <Battlemap />
    </DisplayWrapper>
  );
};
