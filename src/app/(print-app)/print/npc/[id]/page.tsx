"use client";
import { A4Paper } from "@/components/Print";
import { Monster as Monster5emm } from "5e-monster-maker/src/components/models";
import React from "react";

import { useCampaignData, useServerState } from "@/server/ClientUtility";
import { PlayerNPC } from "@/types/Campaign";
import { getSpellDict } from "@/server/Database";
import LoadingPage from "@/components/LoadingPage";
import { Spell } from "@/types/5eTools/Spell";
import { Entry } from "@/types/5eTools/Entry";

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

const EntryRenderer = (props: {
  entry: (string | Entry)[];
}) => {
  return props.entry.map((e, i) => {
    return (
      <div
        style={{
          // respect lf in spell entries
          whiteSpace: "pre-line",
        }}
        key={i}
      >
        {typeof e === "string" ? e : (
          <>
            {e.entry ?? ""}
            {e.entries && (
              <EntryRenderer entry={e.entries} />
            )}
            {e.items && (
              <EntryRenderer entry={e.items} />
            )}
          </>
        )}
      </div>
    )
  })
}

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
      <EntryRenderer entry={props.spell.entries} />
    </div>
  );
};

const ExpectedValueForDice = (dice: number) => {
  return Math.round((dice + 1) / 2);
};

const Label = (
  props: {
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLLabelElement>,
) => {
  return (
    <label
      {...props}
      className="uppercase text-neutral-800"
      style={{
        fontSize: "0.6rem",
      }}
    >
      {props.children}
    </label>
  );
};

const NPCViewer = (props: {
  monster: Monster5emm;
  image?: string;
  background?: string;
  playerNPC: PlayerNPC;
}) => {
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

    let pages = Math.ceil((spliceLengths.length - 2) / COLUMNS_PER_PAGE);

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
    props.monster.spellcasting.standard
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

  const profBonus = props.monster.proficiency;
  const expBonus = 2 * profBonus;

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
          <div className="h-full w-full overflow-hidden">
            <div
              className="flex h-full flex-col gap-1 rounded-xl bg-white p-2"
              style={{
                fontSize: "0.5rem",
              }}
            >
              <div className="flex w-full justify-between">
                <div className="text-lg">+{profBonus}</div>
                <div className="grow text-end text-lg font-bold">
                  {props.monster.name}
                </div>
              </div>
              <div className="w-full text-end">
                {props.monster.size}, {props.monster.alignment}, Harengon, Bard
              </div>
              <hr className="my-1" />
              <div className="flex justify-center gap-2">
                <Bubble>
                  <span className="font-bold">
                    <i className="bi bi-shield-fill"></i>
                  </span>
                  &nbsp;{props.monster.AC}
                </Bubble>
                <Bubble>
                  <span className="font-bold">
                    <i className="bi bi-heart-fill"></i>
                  </span>
                  &nbsp;
                  {props.monster.HP.HD *
                    ExpectedValueForDice(props.monster.HP.type) +
                    props.monster.HP.modifier}
                </Bubble>
                {props.monster.speeds.map((speed) => (
                  <Bubble key={speed.type}>
                    {speed.type} {speed.speed}
                  </Bubble>
                ))}
              </div>
              <hr className="my-1" />
              <Label>
                Stats | <a className="text-red-700">Proficient Saving Throws</a>
              </Label>
              <div className="flex justify-between">
                <Bubble
                  className={
                    props.monster.saves.STR.proficient ? "bg-red-700" : ""
                  }
                >
                  S&nbsp;<b>{props.monster.stats.STR}</b>&nbsp;|&nbsp;
                  {props.monster.stats.STR > 10 ? "+" : ""}
                  {Math.floor((props.monster.stats.STR - 10) / 2)}
                </Bubble>
                <Bubble
                  className={
                    props.monster.saves.DEX.proficient ? "bg-red-700" : ""
                  }
                >
                  D&nbsp;<b>{props.monster.stats.DEX}</b>&nbsp;|&nbsp;
                  {props.monster.stats.DEX > 10 ? "+" : ""}
                  {Math.floor((props.monster.stats.DEX - 10) / 2)}
                </Bubble>
                <Bubble
                  className={
                    props.monster.saves.CON.proficient ? "bg-red-700" : ""
                  }
                >
                  C&nbsp;<b>{props.monster.stats.CON}</b>&nbsp;|&nbsp;
                  {props.monster.stats.CON > 10 ? "+" : ""}
                  {Math.floor((props.monster.stats.CON - 10) / 2)}
                </Bubble>
                <Bubble
                  className={
                    props.monster.saves.INT.proficient ? "bg-red-700" : ""
                  }
                >
                  I&nbsp;<b>{props.monster.stats.INT}</b>&nbsp;|&nbsp;
                  {props.monster.stats.INT > 10 ? "+" : ""}
                  {Math.floor((props.monster.stats.INT - 10) / 2)}
                </Bubble>
                <Bubble
                  className={
                    props.monster.saves.WIS.proficient ? "bg-red-700" : ""
                  }
                >
                  W&nbsp;<b>{props.monster.stats.WIS}</b>&nbsp;|&nbsp;
                  {props.monster.stats.WIS > 10 ? "+" : ""}
                  {Math.floor((props.monster.stats.WIS - 10) / 2)}
                </Bubble>
                <Bubble
                  className={
                    props.monster.saves.CHA.proficient ? "bg-red-700" : ""
                  }
                >
                  C&nbsp;<b>{props.monster.stats.CHA}</b>&nbsp;|&nbsp;
                  {props.monster.stats.CHA > 10 ? "+" : ""}
                  {Math.floor((props.monster.stats.CHA - 10) / 2)}
                </Bubble>
              </div>
              <hr className="my-1" />
              <div className="flex w-full gap-2">
                <div className="flex grow flex-col gap-1">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-1">
                    {props.monster.skills.map((skill, i) => {
                      return (
                        <span key={i}>
                          {skill.skill.label}{" "}
                          {skill.proficient ? (
                            <span className="text-purple-700">
                              +{profBonus}
                            </span>
                          ) : skill.expertise ? (
                            <span className="text-purple-700">+{expBonus}</span>
                          ) : (
                            <span className="text-purple-700">+0</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <Label>Senses</Label>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(props.monster.senses).map((s, i) => {
                      return (
                        <span key={i}>
                          {/** @ts-ignore */}
                          {s} {props.monster.senses[s]}
                        </span>
                      );
                    })}
                  </div>
                  <Label>Languages</Label>
                  <div>{props.monster.languages}</div>
                </div>
                <div className="flex h-full w-24 items-center">
                  <img
                    src={props.image}
                    alt=""
                    className="align-self-center w-full rounded-xl"
                  />
                </div>
              </div>

              <hr className="my-1"></hr>
              <Label>Traits</Label>
              <div>
                {props.monster.traits.map((trait, i) => {
                  return (
                    <div key={i}>
                      <b className="uppercase text-purple-700">{trait.name}</b>:{" "}
                      {trait.description}
                    </div>
                  );
                })}
              </div>

              <hr className="my-1"></hr>

              <Label>Actions</Label>
              <div>
                {props.monster.actions.map((action, i) => {
                  return (
                    <div key={i}>
                      <b className="uppercase text-red-700">{action.name}</b>:{" "}
                      {action.description}
                    </div>
                  );
                })}
                {props.monster.attacks.map((attack, i) => {
                  return (
                    <div key={i}>
                      <b className="uppercase text-red-700">{attack.name}</b>:
                      <i>
                        {attack.distance == "MELEE"
                          ? "Melee Weapon Attack"
                          : attack.distance == "BOTH"
                            ? "Melee or Ranged Weapon Attack"
                            : "Ranged Weapon Attack"}
                      </i>
                      ,&nbsp;
                      {attack.targets} target,&nbsp; reach {attack.range.reach}{" "}
                      ft., &nbsp;+
                      {attack.modifier.override
                        ? attack.modifier.overrideValue
                        : Math.floor(
                            (props.monster.stats[attack.modifier.stat] - 10) /
                              2,
                          ) + props.monster.proficiency}{" "}
                      to hit, &nbsp;{attack.damage.count}d{attack.damage.dice} +{" "}
                      {attack.damage.modifier.override
                        ? attack.damage.modifier.overrideValue
                        : Math.floor(
                            (props.monster.stats[attack.damage.modifier.stat] -
                              10) /
                              2,
                          ) + props.monster.proficiency}{" "}
                      ({attack.damage.type})
                      {attack.additionalDamage.map((v, i) => {
                        return ` + ${v.count}d${v.dice} (${v.type})`;
                      })}
                      &nbsp; damage
                    </div>
                  );
                })}
              </div>

              {props.monster.reactions.length > 0 && (
                <>
                  <hr className="my-1"></hr>
                  <Label>Reactions</Label>
                  <div>
                    {props.monster.reactions.map((reaction, i) => {
                      return (
                        <div key={i}>
                          <b className="uppercase text-red-700">
                            {reaction.name}
                          </b>
                          : {reaction.description}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              <hr className="my-1"></hr>
              <Label>Spellcasting</Label>
              <div className="flex justify-between">
                <div className="uppercase text-purple-700">
                  Spellcasting Ability
                </div>
                <div>
                  {props.monster.spellcasting.stat} | DC{" "}
                  {
                    // compute dc
                    8 +
                      profBonus +
                      Math.floor(
                        (props.monster.stats[props.monster.spellcasting.stat] -
                          10) /
                          2,
                      )
                  }{" "}
                  | +
                  {
                    // compute attack bonus
                    profBonus +
                      Math.floor(
                        (props.monster.stats[props.monster.spellcasting.stat] -
                          10) /
                          2,
                      )
                  }
                </div>
              </div>
              <div className="flex justify-between">
                <div className="uppercase text-purple-700">Spellslots</div>
                <div className="flex justify-end gap-2">
                  {props.monster.spellcasting.slots.map((slot, i) => {
                    if (slot == 0) return null;
                    return (
                      <Bubble key={i}>
                        {i + 1} | {slot}
                      </Bubble>
                    );
                  })}
                </div>
              </div>

              {props.monster.inventory != "" && (
                <>
                  <hr className="my-1"></hr>
                  <Label>Inventory</Label>
                  <div>{props.monster.inventory}</div>
                </>
              )}

              <hr className="my-1"></hr>
              <Label>Proficiencies</Label>
              <div>
                <div className="uppercase text-purple-700">Weapons</div>
                {props.playerNPC.weaponProficiencies}
              </div>
              <div>
                <div className="uppercase text-purple-700">Tools</div>
                {props.playerNPC.toolProficiencies}
              </div>
            </div>
          </div>
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
          const columnIndex = 1 + 3 * index;
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

export default ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const { campaignData, isLoading } = useCampaignData();
  const { serverState, isLoading: serverStateLoading } = useServerState();

  if (!campaignData || !serverState) {
    return <LoadingPage />;
  }

  // get default keyed image
  const player = campaignData!.playerNPCs[+params.id];
  let path = player.images.portrait;

  return (
    <NPCViewer
      monster={
        campaignData!.playerNPCs[+params.id].statblock as unknown as Monster5emm
      }
      playerNPC={campaignData!.playerNPCs[+params.id]}
      image={`/api/image?fn=data/campaigns/${serverState.campaign}/${path}`}
      background={`/api/image?fn=data/campaigns/${serverState.campaign}/${campaignData!.playerNPCs[+params.id].background}`}
    />
  );
};
