import { useCampaignData, useServerState } from "@/server/ClientUtility";
import { CardStack } from "./CardStack";
import React from "react";

const Bubble = (props: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={
        "flex min-w-10 items-center justify-between gap-2 rounded-xl bg-french-900/80 p-1 px-6 text-white " +
        props.className
      }
      style={props.style}
    >
      {props.children}
    </div>
  );
};

export const PlayerCard = (props: {
  image: string;
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
}) => (
  <div
    className="h-full min-h-full w-full overflow-hidden rounded-xl"
    style={{
      backgroundImage: `url(${props.image})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}
  >
    <div className="flex h-full w-full flex-col gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-black/0 via-black/10 to-black/70 p-4">
      <div className="flex w-full flex-col items-end text-end text-white">
        <p className="w-full text-end text-xs text-white">{props.class}</p>
        <div className="w-full text-xl">
          <a className="text-sm text-neutral-50/80">{props.race}</a>&nbsp;
          <a>{props.name}</a>
        </div>
      </div>
      <div className="grow"></div>
      <div className={"flex justify-end " + (props.npc ? "" : "hidden")}>
        <Bubble>
          <p className="text-xs">NPC|Sidekick</p>
        </Bubble>
      </div>
      <p className="w-full text-end text-white">{props.description}</p>
      <div className="grid grid-cols-3 flex-wrap gap-2">
        {Object.keys(props.stats).map((key) => (
          <Bubble
            key={key}
            style={{
              fontSize: "0.6rem",
            }}
          >
            <p className="">{key}</p>
            {/* @ts-ignore */}
            <p className="text-2xl">{props.stats[key]}</p>
          </Bubble>
        ))}
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
              image={`/api/image?fn=data/campaigns/${serverState!.campaign}/${encodeURIComponent(player.images.portrait)}`}
              name={player.name}
              npc={true}
              race={player.race}
              class={player.class}
              description={player.description}
              stats={stats}
            />
          );
        }),
      );
      players.push(
        ...campaignData!.players.map((player, i) => {
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
            />
          );
        }),
      );
      setPlayers(players);
    }
  }, [campaignData, serverState]);

  return (
    <div className="h-full min-h-full w-full rounded-xl">
      <CardStack>{players}</CardStack>
    </div>
  );
};
