import { Entry } from "./Entry";

export interface Trait {
  name: string;
  entries: Array<Entry | string>;
  type?: string;
}
