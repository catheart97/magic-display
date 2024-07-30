export interface SpecialAlignment {
  alignment?: Alignment[];
  special?: string;
  chance?: number;
  note?: string;
}

export enum Alignment {
  Any = "A", // Any
  Chaotic = "C", // Chaotic
  Evil = "E", // Evil
  Good = "G", // Good
  Lawful = "L", // Lawful
  Neutral = "N", // Neutral
  NeutralX = "NX", // Neutral (law/chaos axis)
  NeutralY = "NY", // Neutral (good/evil axis)
  Unaligned = "U", // Unaligned
}
