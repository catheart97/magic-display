import { Ability, MonsterSave } from "./Ability";
import { Action } from "./Action";
import { Alignment, SpecialAlignment } from "./Alignment";
import { ArmourClass } from "./ArmourClass";
import { Condition, SpecialCondition } from "./Condition";
import { AltDamageType, DamageType } from "./DamageType";
import { Entry, EntryType } from "./Entry";
import { Environment } from "./Environment";
import { HitPoints } from "./HitPoints";
import { Immunity } from "./Immunity";
import { MonsterSpellcasting } from "./MonsterSpellcasting";
import { SidekickType } from "./SidekickType";
import { Size } from "./Size";
import { Skill } from "./Skill";
import { Speed } from "./Speed";
import { Trait } from "./Trait";

export interface BestiaryDatabase {
  monster: Monster[];
}

export interface Monster {
  name: string;
  source: string;
  page?: number;
  summonedByClass?: string;
  size?: Size[];
  type?:
    | {
        type:
          | {
              choose: MonsterType[];
            }
          | MonsterType;
        tags?: Array<
          | {
              tag: string;
              prefix: string;
            }
          | string
        >;
        swarmSize?: Size;
        sidekickType?: SidekickType;
        sidekickHidden?: boolean;
        sidekickTags?: string[];
      }
    | MonsterType;
  traitTags?: string[];
  hasToken: boolean;
  alignment?: Array<SpecialAlignment | Alignment>;
  ac?: Array<ArmourClass | number>;
  hp?: HitPoints;
  speed?: Speed;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  senses?: string[] | null;
  passive?: number | string;
  immune?: Array<Immunity | AltDamageType> | null;
  conditionImmune?: Array<SpecialCondition | Condition>;
  action?: Action[] | null;
  senseTags?: Sense[];
  damageTags?: DamageType[];
  miscTags?: string[];
  isNpc?: boolean;
  isNamedCreature?: boolean;
  cr?:
    | {
        cr: string;
        coven?: string;
        lair?: string;
        xp?: number;
      }
    | string;
  hasFluff?: boolean;
  resist?: Array<Immunity | AltDamageType>;
  languages?: string[] | null;
  trait?: Trait[] | null;
  languageTags?: string[];
  conditionInflict?: Condition[];
  savingThrowForced?: Ability[];
  spellcasting?: MonsterSpellcasting[] | null;
  damageTagsLegendary?: DamageType[];
  damageTagsSpell?: DamageType[];
  savingThrowForcedSpell?: Ability[];
  hasFluffImages?: boolean;
  spellcastingTags?: SpellcastingType[];
  save?: MonsterSave;
  actionTags?: string[];
  legendaryGroup?: {
    name: string;
    source: string;
  };
  savingThrowForcedLegendary?: Ability[];
  attachedItems?: string[];
  skill?: Skill;
  legendary?: Entry[] | null;
  conditionInflictSpell?: Condition[];
  reaction?: Action[] | null;
  vulnerable?: Array<
    | {
        vulnerable: AltDamageType[];
        note: string;
        cond: boolean;
      }
    | AltDamageType
  > | null;
  group?: string[] | null;
  soundClip?: {
    type: "internal";
    path: string;
  };
  bonus?: {
    name: string;
    entries: Array<Entry | string>;
  }[];
  alignmentPrefix?: string;
  otherSources?: {
    source: string;
    page?: number;
  }[];
  mythicHeader?: string[];
  mythic?: Entry[];
  variant?: Entry[];
  reprintedAs?: string[];
  environment?: Environment[];
  conditionInflictLegendary?: Condition[];
  shortName?: boolean | string;
  familiar?: boolean;
  alias?: string[];
  altArt?: {
    name: string;
    source: string;
    page?: number;
  }[];
  reactionHeader?: string[];
  tokenCredit?: string;
  dragonAge?:
    | "adult"
    | "ancient"
    | "aspect"
    | "greatwyrm"
    | "wyrmling"
    | "young";
  pbNote?: string;
  summonedBySpell?: string;
  summonedBySpellLevel?: number;
  sizeNote?: string;
  actionNote?: string;
  level?: number;
  dragonCastingColor?: string;
  legendaryHeader?: string[];
  legendaryActions?: number;
  srd?: boolean;
  basicRules?: boolean;
}

export enum MonsterAbilityDisplayType {
  Action = "action",
  Bonus = "bonus",
  Trait = "trait",
}

export enum MonsterType {
  Aberration = "aberration",
  Beast = "beast",
  Celestial = "celestial",
  Construct = "construct",
  Dragon = "dragon",
  Elemental = "elemental",
  Fey = "fey",
  Fiend = "fiend",
  Giant = "giant",
  Humanoid = "humanoid",
  Monstrosity = "monstrosity",
  Ooze = "ooze",
  Plant = "plant",
  Undead = "undead",
}

enum Sense {
  Blingsight = "B", // Blindsight
  Darkvision = "D", // Darkvision
  SuperiorDarkvision = "SD", // Superior Darkvision
  Tremorsense = "T", // Tremorsense
  Truesight = "U", // Truesight
}

enum SpellcastingType {
  Cantrips = "CA", // Cantrips
  CantripsDruid = "CD", // Cantrips (Druid)
  CantripsRanger = "CR", // Cantrips (Ranger)
  CantripsSourcerer = "CS", // Cantrips (Sorcerer)
  CantripsBard = "CB", // Cantrips (Bard)
  CantripsCleric = "CC", // Cantrips (Cleric)
  CantripsWarlock = "CL", // Cantrips (Warlock)
  CantripsPaladin = "CP", // Cantrips (Paladin)
  CantripsWizard = "CW", // Cantrips (Wizard)
  Focus = "F", // Focus
  Innate = "I", // Innate
  Oath = "O", // Oath
  Pact = "P", // Pact
  Spellbook = "S", // Spellbook
}
