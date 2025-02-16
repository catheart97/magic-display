import { useCampaignData, useServerState } from "@/server/ClientUtility";
import { CardStack } from "./CardStack";
import React from "react";
import { Player } from "@/types/Campaign";

const Bubble = (props: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={
        "flex min-w-10 items-center justify-between gap-2 rounded-xl bg-neutral-700/80 p-1 px-6 text-white " +
        props.className
      }
      style={props.style}
    >
      {props.children}
    </div>
  );
};

export const PlayerCard = (props: {
  image?: string;
  name: string;
  race: string;
  class: string;
  description: string;
  stats: {
    STR: string | number;
    DEX: string | number;
    CON: string | number;
    INT: string | number;
    WIS: string | number;
    CHA: string | number;
  };
  npc?: boolean;
  titles?: string[];
}) => (
  <div
    className="h-full min-h-full w-full overflow-hidden rounded-xl"
    style={{
      backgroundImage: props.image ? `url(${props.image})` : "",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left",
      backgroundColor: "#111",
    }}
  >
    <div className="h-full w-ful flex justify-end relative">
      <div className="absolute bg-gradient-to-r from-black/0 via-black to-black right-0 top-0 bottom-0 left-1/4">
      </div>
      <div className="absolute top-0 right-0 bottom-0 flex h-full w-96 flex-col gap-2 overflow-hidden rounded-xl p-4 z-10">
        <div className="flex w-full flex-col items-end text-end text-white">
          <p className="w-full text-end text-xs text-white">{props.class}</p>
          <div className="w-full text-xl">
            <a className="text-sm text-neutral-50/80">{props.race}</a>&nbsp;
            <a>{props.name}</a>
          </div>
        </div>
        <div className={"flex flex-wrap justify-end items-center gap-2 " + ((props.titles && props.titles.length > 0) ? "" : "hidden")}>
          {
            props.titles && props.titles.length > 0 && (
              props.titles.map((title, i) => (
                <Bubble key={i}>
                  <i className="bi bi-megaphone-fill"></i>
                  <p className="text-sm">{title}</p>
                </Bubble>
              ))
            )
          }
        </div>
        <p className="w-full text-end text-white">{props.description}</p>
        <div className="grow"></div>
        <div className="grid grid-cols-3 flex-wrap gap-2">
          {Object.keys(props.stats).map((key) => (
            <Bubble
              key={key}
              style={{
                fontSize: "0.6rem",
              }}
              className="flex gap-2 justify-center items-center"
            >
              <p className="text-lg">{key}</p>
              {/* @ts-ignore */}
              <p className="text-xl font-bold">{props.stats[key]}</p>
            </Bubble>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const PartySlider = (props: {}) => {
  const { campaignData } = useCampaignData(true);
  const { serverState } = useServerState(true);
  const [players, setPlayers] = React.useState<React.ReactElement[]>([]);

  React.useEffect(() => {
    if (campaignData && serverState && players.length == 0) {
      let players = [];
      players.push(
        ...campaignData!.playerNPCs.map((player, i) => {
          const stats: any = player.statblock.stats;
          for (const key in stats) {
            if (typeof stats[key] === "number") {
              stats[key] = stats[key].toString();
            }
          }
          return (
            <PlayerCard
              key={player.name}
              image={player.images.portrait != "" ? `/api/image?fn=data/campaigns/${serverState!.campaign}/${encodeURIComponent(player.images.portrait)}` : undefined}
              name={player.name}
              npc={true}
              race={player.race}
              class={player.class}
              description={player.description}
              stats={stats}
              titles={player.titles}
            />
          );
        }),
      );
      players.push(
        ...campaignData!.players.map((player : Player, i) => {
          return (
            <PlayerCard
              key={player.name}
              image={`/api/image?fn=data/campaigns/${serverState!.campaign}/${encodeURIComponent(player.images.portrait)}`}
              name={player.name}
              npc={false}
              race={player.race}
              class={player.class}
              description={player.description}
              stats={player.stats}
              titles={player.titles}
            />
          );
        }),
      );
      setPlayers(players);
    }
  }, [campaignData, serverState]);

  return (
    <div className="h-full min-h-full w-full rounded-xl">
      <CardStack swap speed={20000}>{players}</CardStack>
    </div>
  );
};
