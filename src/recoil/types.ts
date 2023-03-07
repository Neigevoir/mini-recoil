import { Atom } from "./atom";
import { Selector } from "./selector";

export type RecoilState = Atom<any> | Selector<any>;
