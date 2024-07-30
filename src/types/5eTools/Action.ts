import { Entry } from "./Entry";

export interface Action {
  name: string;
  entries: Array<Entry | string>;
}
