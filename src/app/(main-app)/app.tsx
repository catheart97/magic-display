"use client";

import { Battlemap } from "@/components/Battlemap";
import { PersistentImage } from "@/components/PersistentImage";
import { DisplayWrapper } from "@/components/DisplayWrapper";
import { Aspect1Element } from "@/components/Aspect1Element";
import { PartyOverview } from "@/components/PartyOverview";
import { PartySlider } from "@/components/PartySlider";
import { PathOfHeros } from "@/components/PathOfHeroes";
import Tipps from "@/components/Tipps";
import { getDiashowImages } from "@/server/Server";
import { useCampaignData, useServerState } from "@/server/ClientUtility";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import * as React from "react";
import Markdown from "react-markdown";

const ParticleLayer = React.memo(() => {
  const [init, setInit] = React.useState(false);

  React.useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <Particles
      id="tsparticles"
      options={{
        background: {
          color: {
            value: "#00000000",
          },
          opacity: 0.5,
        },
        fpsLimit: 30,
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#E6E6E6",
            distance: 150,
            enable: true,
            opacity: 0.8,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 80,
          },
          opacity: {
            value: 1,
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
});

export default () => {
  const [diashowIndex, setDiashowIndex] = React.useState(0);
  const [diashowImages, setDiashowImages] = React.useState<Array<string>>([]);
  const intervalRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const { campaignData } = useCampaignData();
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

  const usePathOfHeroes = campaignData && campaignData.map;

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

        <div className="absolute bottom-10 right-10 z-20 h-96 w-[36rem]">
          {usePathOfHeroes ? <PathOfHeros /> : null}
        </div>

        <ParticleLayer />

        <div className="absolute inset-0 flex justify-between">
          <div className="flex w-1/2 flex-col items-center justify-between p-10">
            <div className="grid h-full w-full grow grid-cols-1 grid-rows-2 gap-10">
              <div className="flex h-full w-full items-stretch justify-between gap-6 rounded-xl">
                {campaignData &&
                campaignData.players.length + campaignData.playerNPCs.length >
                  0 ? (
                  <>
                    <div className="grow">
                      <PartySlider />
                    </div>
                    <div className="relative h-full shrink-0">
                      <Aspect1Element className="h-full" />
                      <div className="absolute inset-0 rounded-xl shadow-2xl shadow-black">
                        <PartyOverview />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col">
                    <div className="flex grow flex-col justify-center text-french">
                      <div className="pb-4 text-7xl">
                        {campaignData && campaignData.name}
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

          <div
            className={
              "flex w-1/2 flex-col p-10 " +
              (usePathOfHeroes ? "justify-start pr-24" : "justify-center")
            }
          >
            <div className="relative h-fit">
              <Aspect1Element className="w-full" />
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
                      className="aspect-1 w-full rounded-xl shadow-2xl shadow-black"
                      src={"/api/image?fn=" + encodeURIComponent(image)}
                    />
                  </div>
                );
              })}
              <div
                className={[
                  "linear absolute bottom-0 left-0 right-0 top-0 transition-opacity duration-1000",
                  !isLoading && serverState?.previewImage != ""
                    ? "opacity-100"
                    : "opacity-0",
                ].join(" ")}
              >
                <img
                  className="aspect-1 w-full rounded-xl"
                  src={!isLoading ? serverState?.previewImage : ""}
                />
              </div>

              <div
                className={[
                  "linear prose prose-neutral absolute bottom-0 left-0 right-0 top-0 max-w-none rounded-xl bg-white p-8 transition-opacity duration-1000 prose-p:w-full",
                  !isLoading && serverState?.previewText != ""
                    ? "opacity-100"
                    : "opacity-0",
                ].join(" ")}
              >
                <Markdown>
                  {!isLoading ? serverState?.previewText : ""}
                </Markdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Battlemap />
    </DisplayWrapper>
  );
};
