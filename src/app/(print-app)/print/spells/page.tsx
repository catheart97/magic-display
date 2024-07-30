"use client";
import { A4Paper } from "@/components/Print";
import { Monster as Monster5emm } from "5e-monster-maker/src/components/models";
import React from "react";

import { useCampaignData, useServerState } from "@/server/ClientUtility";
import { PlayerNPC } from "@/types/Campaign";
import { getSpellDict } from "@/server/Database";
import LoadingPage from "@/components/LoadingPage";
import { Spell } from "@/types/5eTools/Spell";

const Bubble = (props: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={
        "flex min-w-10 items-center justify-center rounded-full bg-neutral-700 p-1 px-2 text-white " +
        props.className
      }
    >
      {props.children}
    </div>
  );
};

const rangeDistanceType2Emoji = (range: string) => {
  switch (range) {
    case "feet":
      return "ft";
    case "self":
      return "🧍 self";
    case "touch":
      return "✋🏻 touch";
    case "sight":
      return "👁️ sight";
    default:
      return "🎯 ranged";
  }
};

const duration2Emoji = (duration: string) => {
  switch (duration) {
    case "instant":
      return "🔥 instant";
    case "timed":
      return "⏳";
    default:
      return "⏳";
  }
};

const schoolAbbr2School = (abbr: string) => {
  switch (abbr) {
    case "A":
      return "Abjuration";
    case "C":
      return "Conjuration";
    case "D":
      return "Divination";
    case "E":
      return "Enchantment";
    case "I":
      return "Illusion";
    case "N":
      return "Necromancy";
    case "T":
      return "Transmutation";
    case "V":
      return "Evocation";
    default:
      return "Unknown";
  }
};

const SpellCard = (props: {
  spell: Spell;
  onLoaded?: (height: number) => void;
}) => {
  const root = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (props.onLoaded && root.current) {
      props.onLoaded(root.current!.scrollHeight);
    }
  }, []);
  return (
    <div
      className="flex flex-col gap-2 rounded-xl bg-neutral-100 p-2"
      style={{
        fontSize: "0.5rem",
      }}
      ref={root}
    >
      <div
        className="font-bold uppercase"
        style={{
          fontSize: "0.6rem",
        }}
      >
        {props.spell.name}
      </div>
      <div className="flex w-full flex-wrap gap-1">
        <Bubble>{props.spell.level}</Bubble>
        <Bubble>
          {props.spell.time.map((e, i) => {
            return (
              <div className="flex items-center gap-1" key={i}>
                <span>{e.number}</span>
                <span>{e.unit[0].toUpperCase() + e.unit.slice(1)}</span>
              </div>
            );
          })}
        </Bubble>
        <Bubble>{schoolAbbr2School(props.spell.school)}</Bubble>
        <Bubble>
          {props.spell.range.distance ? (
            <span>
              {props.spell.range.distance.amount || ""}
              {rangeDistanceType2Emoji(props.spell.range.distance.type)}
            </span>
          ) : (
            <span>0</span>
          )}
        </Bubble>
        <Bubble>
          {props.spell.duration.map(
            (
              duration: {
                type: string;
                duration?: {
                  amount: number;
                  type: string;
                };
                concentration?: boolean;
              },
              index,
            ) => {
              return (
                <span key={index}>
                  {duration.concentration ? (
                    <span>🧠 concentration | </span>
                  ) : null}
                  {duration2Emoji(duration.type)}
                  {duration.duration ? (
                    <span>
                      &nbsp;
                      {duration.duration.amount} {duration.duration.type}
                      {duration.duration.amount > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </span>
              );
            },
          )}
        </Bubble>
        <Bubble>
          {props.spell.components.m
            ? "M (" +
              (typeof props.spell.components.m == "string"
                ? props.spell.components.m
                : props.spell.components.m.text) +
              ")"
            : ""}{" "}
          {props.spell.components.v ? "V" : ""}{" "}
          {props.spell.components.s ? "S" : ""}
        </Bubble>
      </div>
      <div
        style={{
          // respect lf in spell entries
          whiteSpace: "pre-line",
        }}
      >
        {props.spell.entries.join("\n")}
      </div>
    </div>
  );
};

const SpellList = (props: { background?: string; spells: string[] }) => {
  const spellContainerRef = React.useRef<HTMLDivElement>(null);
  const [spellDict, setSpellDict] = React.useState<Record<string, Spell>>({});

  const computedHeights = React.useRef<{ [key: number]: number }>({});
  const [didComputeHeights, setDidComputeHeights] =
    React.useState<boolean>(false);
  const [computedLayout, setComputedLayout] = React.useState<
    | {
        pages: number;
        spliceLengths: number[];
      }
    | undefined
  >(undefined);

  React.useEffect(() => {
    getSpellDict().then((data) => {
      setSpellDict(data);
    });
  }, []);

  React.useEffect(() => {
    if (!didComputeHeights) {
      return;
    }
    const MAX_HEIGHT_PER_COLUMN = spellContainerRef.current!.clientHeight;
    const COLUMNS_PER_PAGE = 3;

    // transform computedHeights to an array
    let spliceLengths: number[] = [];
    let currentHeight = 0;
    let currentColumn = 0;
    for (let i = 0; i < spells.length; i++) {
      currentHeight += computedHeights.current[i];
      currentColumn++;
      if (currentHeight > MAX_HEIGHT_PER_COLUMN - 16 * currentColumn - 32) {
        spliceLengths.push(i); // this index does not fit anymore
        currentHeight = computedHeights.current[i];
        currentColumn = 1;
      }
    }

    if (currentHeight > 0) {
      spliceLengths.push(spells.length);
    }

    let pages = Math.floor(spliceLengths.length / COLUMNS_PER_PAGE);

    console.log("Computed Layout", {
      pages,
      spliceLengths,
    });

    setComputedLayout({
      pages,
      spliceLengths,
    });
  }, [didComputeHeights]);

  const spells = (
    props.spells
      ?.map((spell: string) => {
        return spellDict[spell] ? spellDict[spell] : undefined;
      })
      .filter((spell) => {
        return spell !== undefined;
      }) as Spell[]
  ).toSorted((a: Spell, b: Spell) => {
    // first sort by level, then by name
    return a!.level - b!.level || a!.name.localeCompare(b!.name);
  }) as Spell[];

  return (
    <>
      <A4Paper>
        <div
          className="relative grid h-full w-full grid-cols-3 gap-2 overflow-hidden rounded-2xl p-4"
          style={{
            backgroundImage: `url(${props.background})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <div
            className="flex h-full flex-col justify-between"
            ref={spellContainerRef}
          >
            {computedLayout &&
              spells
                .slice(0, computedLayout.spliceLengths[0])
                .map((spell, index) => {
                  return <SpellCard key={index} spell={spell} />;
                })}
            {!didComputeHeights &&
              spells.map((spell, index) => {
                return (
                  <SpellCard
                    key={"#" + index}
                    spell={spell}
                    onLoaded={(h) => {
                      computedHeights.current[index] = h;
                      if (
                        Object.keys(computedHeights.current).length ==
                        spells.length
                      ) {
                        setDidComputeHeights(true);
                      }
                    }}
                  />
                );
              })}
          </div>
          <div className="flex h-full flex-col justify-between">
            {computedLayout &&
              1 < computedLayout.spliceLengths.length + 1 &&
              spells
                .slice(
                  computedLayout.spliceLengths[0],
                  computedLayout.spliceLengths[1],
                )
                .map((spell, index) => {
                  return <SpellCard key={index} spell={spell} />;
                })}
          </div>
          <div className="flex h-full flex-col justify-between">
            {computedLayout &&
              2 < computedLayout.spliceLengths.length + 1 &&
              spells
                .slice(
                  computedLayout.spliceLengths[0],
                  computedLayout.spliceLengths[1],
                )
                .map((spell, index) => {
                  return <SpellCard key={index} spell={spell} />;
                })}
          </div>
        </div>
      </A4Paper>
      {computedLayout &&
        new Array(computedLayout.pages).fill(0).map((_, index) => {
          const columnIndex = 3 * index;
          return (
            <A4Paper key={index}>
              <div
                className="relative grid h-full w-full grid-cols-3 gap-2 overflow-hidden rounded-2xl p-4"
                style={{
                  backgroundImage: `url(${props.background})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="flex h-full flex-col justify-between">
                  {computedLayout &&
                    spells
                      .slice(
                        computedLayout.spliceLengths[columnIndex],
                        computedLayout.spliceLengths[columnIndex + 1],
                      )
                      .map((spell, index) => {
                        return <SpellCard key={index} spell={spell} />;
                      })}
                </div>
                <div className="flex h-full flex-col justify-between">
                  {computedLayout &&
                    columnIndex + 2 < computedLayout.spliceLengths.length + 1 &&
                    spells
                      .slice(
                        computedLayout.spliceLengths[columnIndex + 1],
                        computedLayout.spliceLengths[columnIndex + 2],
                      )
                      .map((spell, index) => {
                        return <SpellCard key={index} spell={spell} />;
                      })}
                </div>
                <div className="flex h-full flex-col justify-between gap-2">
                  {computedLayout &&
                    columnIndex + 3 < computedLayout.spliceLengths.length + 1 &&
                    spells
                      .slice(
                        computedLayout.spliceLengths[columnIndex + 2],
                        computedLayout.spliceLengths[columnIndex + 3],
                      )
                      .map((spell, index) => {
                        return <SpellCard key={index} spell={spell} />;
                      })}
                </div>
              </div>
            </A4Paper>
          );
        })}
    </>
  );
};

export default () => {
  const { campaignData, isLoading } = useCampaignData();
  const { serverState, isLoading: serverStateLoading } = useServerState();

  if (!campaignData || !serverState) {
    return <LoadingPage />;
  }

  return (
    <SpellList
      background="/api/image?fn=data/campaigns/dracaiya/backgrounds/arctic.png"
      spells={[
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Fire Bolt",
        "Magic Missile",
      ]}
    />
  );
};
