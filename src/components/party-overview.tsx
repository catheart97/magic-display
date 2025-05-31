"use client";

import { useCampaignMeta, useServerState } from "@/server/client-utility";
import React from "react";
import Calendar from "./calendar";
import { PersistentImage } from "./persistent-image";
import { AbstractPlayer } from "@/types/CampaignMeta";

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
        "linear aspect-1 absolute left-0 right-0 top-0 transition-opacity duration-1000 " +
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
        "linear aspect-1 absolute top-1 transition-opacity duration-1000 " +
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
  const { campaignMeta } = useCampaignMeta();
  const { serverState } = useServerState();

  React.useEffect(() => {
    if (!campaignMeta || !serverState) return;

    const aP =
      campaignMeta && serverState
        ? [...campaignMeta.players, ...campaignMeta.playerNPCs]
        : [];

    if (abstractPlayers.length !== aP.length) {
      setAbstractPlayers(aP);
    }
  }, [campaignMeta, serverState]);

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
