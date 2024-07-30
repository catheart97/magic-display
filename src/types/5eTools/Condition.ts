export enum Condition {
  Blinded = "blinded",
  Charmed = "charmed",
  Deafened = "deafened",
  Disease = "disease",
  Exhaustion = "exhaustion",
  Frightened = "frightened",
  Grappled = "grappled",
  Incapacitated = "incapacitated",
  Invisible = "invisible",
  Paralyzed = "paralyzed",
  Petrified = "petrified",
  Poisoned = "poisoned",
  Prone = "prone",
  Restrained = "restrained",
  Stunned = "stunned",
  Unconscious = "unconscious",
}

export interface SpecialCondition {
  conditionImmune: Condition[];
  note?: string;
  cond?: boolean;
  preNote?: string;
}
