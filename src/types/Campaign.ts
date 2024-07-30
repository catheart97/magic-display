import { FantasyCalendar, FantasyCalendarDate } from "@/types/FantasyCalendar";

// simply use the 5e-monster-maker model and copy paste it to your campaign
import { Monster as Monster5emm } from "5e-monster-maker/src/components/models";

export type PartyDisplayData = {
  foregroundActives?: {
    [key: string]: string; // player.name -> image path
  };
  backgroundIndex?: number;
};

export type AbstractPlayer = {
  images: {
    portrait: string;
    keyed: {
      [key: string]: {
        name: string;
        path: string;
      }[];
    };
  };
  name: string;
  race: string;
  class: string;
  description: string;
};

export type Player = AbstractPlayer & {
  stats: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
};

export type PlayerNPC = AbstractPlayer & {
  statblock: Monster5emm;
  background: string;
  weaponProficiencies: string;
  toolProficiencies: string;
};

export type Campaign = {
  name: string;
  calendar?: FantasyCalendar & {
    // I know this is redundant, but comes from architecture adjustments down the line
    currentDate: FantasyCalendarDate;
  };
  players: Player[];
  playerNPCs: PlayerNPC[];
  displayData: PartyDisplayData;
  map?: {
    image: string;
    // svg containing a single path describing their journey
    // relevant path : g#Ebene-3 > g > path
    heroPath: string;
  };
};
