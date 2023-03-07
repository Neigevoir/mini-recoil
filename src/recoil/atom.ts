import { Basic, NameSpace } from "./basic";

type AtomContext = {
  key: string;
  default: any;
};

export class Atom<T> extends Basic<T> {
  value: any;

  constructor(private context: AtomContext) {
    super();
    this.value = context.default;
  }
}

export const atom = (value: AtomContext) => {
  if (NameSpace.has(value.key)) {
    throw new Error(`invalid key`);
  } else {
    const defaultValue = new Atom(value);
    NameSpace.set(value.key, defaultValue);
    return defaultValue;
  }
};
