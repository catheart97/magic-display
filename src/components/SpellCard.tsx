"use client";

import { Spell } from "@/types/5eTools/Spell";
import React from "react";

const Bubble = (props: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={
        "flex min-w-10 items-center justify-center rounded-xl bg-neutral-700 p-1 px-2 text-white " +
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

export const SpellCard = (props: {
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
      ref={root}
    >
      <div className="text-2xl uppercase">{props.spell.name}</div>
      <div className="w-full text-center">
        {props.spell.source} p.{props.spell.page}
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
