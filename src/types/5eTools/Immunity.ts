import { AltDamageType } from "./DamageType";

export interface Immunity {
  immune?: AltDamageType[];
  note?: string;
  cond?: boolean;
  preNote?: string;
  special?: string;
  resist?: Array<
    | {
        resist: AltDamageType[];
        note: string;
        cond: boolean;
      }
    | AltDamageType
  >;
}
