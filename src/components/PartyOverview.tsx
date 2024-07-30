"use client";

import { getBackgrounds, storePartyData } from "@/server/Server";
import { useCampaignData, useServerState } from "@/server/ClientUtility";
import React from "react";
import Calendar from "./Calendar";
import { PersistentImage } from "./PersistentImage";
import { AbstractPlayer } from "@/types/Campaign";

interface IBackgroundProps {
  image: string;
  active: boolean;
  zIndex?: number;
  className?: string;
}

const Image = (props: IBackgroundProps) => {
  return (
    <PersistentImage
      src={props.image}
      className={
        "linear aspect-1 absolute left-0 right-0 top-0 transition-[opacity] duration-1000 " +
        (props.className ?? "")
      }
      style={{
        opacity: props.active ? 1 : 0,
        zIndex: props.zIndex ?? 0,
      }}
    />
  );
};

const CharacterImage = React.memo((props: IBackgroundProps) => {
  return (
    <PersistentImage
      src={props.image}
      className={
        "linear aspect-1 absolute top-1 transition-[opacity] duration-1000 " +
        (props.className ?? "")
      }
      style={{
        opacity: props.active ? 1 : 0,
        zIndex: props.zIndex ?? -1,
      }}
    />
  );
});

const BackgroundButton = (
  props: {} & React.HTMLAttributes<HTMLButtonElement>,
) => {
  return (
    <button
      className="grow rounded-full bg-french-200 p-1 px-3 text-xs text-french-900 hover:bg-gray-300"
      {...props}
      style={{
        ...(props.style ?? {}),
        ...{
          zIndex: 1000,
        },
      }}
    />
  );
};

export const PartyOverview = React.memo((props: { admin?: boolean }) => {
  const [backgrounds, setBackgrounds] = React.useState<string[]>([]);
  const { campaignData, isLoading: campaignDataLoading } = useCampaignData();
  const { serverState, isLoading: serverStateLoading } = useServerState();
  const anyLoading = campaignDataLoading || serverStateLoading;

  React.useEffect(() => {
    console.log("Remounted PartyOverview");
    (async () => {
      setBackgrounds(await getBackgrounds());
    })();
  }, []);

  React.useEffect(() => {
    if (!campaignData || !serverState) return;

    const aP =
      campaignData && serverState
        ? [...campaignData.players, ...campaignData.playerNPCs]
        : [];

    if (abstractPlayers.length !== aP.length) {
      setAbstractPlayers(aP);
    }
  }, [campaignData, serverState]);

  const [abstractPlayers, setAbstractPlayers] = React.useState<
    AbstractPlayer[]
  >([]);

  return (
    <div
      className={
        "flex h-full flex-wrap gap-2 rounded-xl text-black " +
        (props.admin ? "items-center justify-center" : "w-full")
      }
    >
      <div
        className={
          "relative h-fit overflow-hidden rounded-xl " +
          (props.admin ? "w-96" : "w-full")
        }
      >
        {backgrounds.length > 0 && !anyLoading && (
          <>
            <PersistentImage
              src={`/api/image?fn=${encodeURIComponent(backgrounds[0])}`}
              className="aspect-1 w-full transition-[opacity] duration-1000 ease-in-out"
              style={{
                opacity: campaignData?.displayData.backgroundIndex == 0 ? 1 : 0,
              }}
            />
            {backgrounds.map((background, index) => {
              if (index === 0) return;
              return (
                <Image
                  key={index}
                  image={`/api/image?fn=${encodeURIComponent(background)}`}
                  active={index === campaignData!.displayData.backgroundIndex}
                />
              );
            })}
          </>
        )}

        {campaignData && campaignData.calendar && (
          <Calendar admin={props.admin} />
        )}

        {abstractPlayers.map((player) => {
          const images: {
            index: number;
            path: string;
          }[] = [];
          const keyed = player.images.keyed;
          const keys = Object.keys(keyed);
          for (let key of keys) {
            for (let elem of keyed[key]) {
              images.push({
                index: parseInt(key),
                path: elem.path,
              });
            }
          }

          return (
            <React.Fragment key={player.name}>
              {images.map((e) => {
                return (
                  <CharacterImage
                    key={player + "#" + e.index + "#" + e.path}
                    image={`/api/image?fn=data/campaigns/${serverState!.campaign}/${encodeURIComponent(e.path)}`}
                    active={
                      e.path ===
                      campaignData!.displayData.foregroundActives![player.name]
                    }
                    zIndex={e.index}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
      {props.admin && (
        <div className="flex w-96 flex-col gap-2 bg-transparent p-2 p-4">
          <label className="w-full text-end uppercase text-white">
            Backgrounds
          </label>
          <div className="flex flex-wrap gap-1">
            {backgrounds.map((background, index) => {
              return (
                <BackgroundButton
                  onClick={() => {
                    let nindex = structuredClone(index);
                    storePartyData({
                      foregroundActives:
                        campaignData!.displayData.foregroundActives,
                      backgroundIndex: nindex, // will be refetched on next render
                    });
                  }}
                  key={index}
                >
                  {background
                    .split("/")
                    .pop()
                    ?.split(".")[0]
                    .toUpperCase()
                    .split("_")
                    .join(" ")}
                </BackgroundButton>
              );
            })}
          </div>
          <label className="w-full text-end uppercase text-white">
            Characters
          </label>
          {abstractPlayers.map((player) => {
            const images: {
              index: number;
              name: string;
              path: string;
            }[] = [];
            const keyed = player.images.keyed;
            const keys = Object.keys(keyed);
            for (let key of keys) {
              for (let elem of keyed[key]) {
                images.push({
                  index: parseInt(key),
                  name: elem.name,
                  path: elem.path,
                });
              }
            }

            if (images.length <= 1) return null;

            return (
              <div className="flex gap-1" key={player.name}>
                {images.map((image, index) => {
                  let title = player.name + " " + image.name;

                  return (
                    <BackgroundButton
                      key={player + index.toFixed()}
                      style={{
                        order: images.length - index - 1,
                      }}
                      onClick={() => {
                        let nfga = structuredClone(
                          campaignData!.displayData.foregroundActives!,
                        );
                        nfga[player.name] = image.path;
                        storePartyData({
                          foregroundActives: nfga,
                          backgroundIndex:
                            campaignData!.displayData.backgroundIndex,
                        });
                      }}
                    >
                      {title}
                    </BackgroundButton>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
