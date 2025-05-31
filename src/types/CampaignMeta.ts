import { FantasyCalendar } from "@/types/FantasyCalendar";

export type AbstractPlayer = {
  image: string;
  name: string;
  race: string;
  class: string;
  description: string;
  titles?: string[];
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

export type CampaignMeta = {
  name: string;
  playerNPCs: Player[];
  players: Player[];

  // if set enables the campaign feature 
  calendar?: FantasyCalendar;

  // if set enables the hero path feature
  map?: {
    image: string;
    // svg containing a single path describing their journey
    // relevant path : g#Ebene-3 > g > path
    heroPath: string;
  };
};
