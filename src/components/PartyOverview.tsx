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
          "relative h-full overflow-hidden rounded-xl bg-white " +
          (props.admin ? "w-96" : "w-full")
        }
      >


      </div>
    </div>
  );
});
