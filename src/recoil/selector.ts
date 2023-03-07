import { NameSpace, Basic } from "./basic";
import { RecoilState } from "./types";

type SelectorGetGenerator<T> = (context: {
  get: <V>(dep: RecoilState) => V;
}) => T;

type SelectorSetGenerator<T> = (context: {
  get: <V>(dep: RecoilState) => V;
  set: <V>(dep: RecoilState, value?: any) => void;
}) => T;

type SelectConext = {
  key: string;
  get: SelectorGetGenerator<any>;
  set: SelectorSetGenerator<any>;
};

export class Selector<T> extends Basic<T> {
  private registeredDeps = new Set();

  private updateSelector() {
    this.value = this.context.get({
      get: (dep: RecoilState) => dep.getter(),
    });
    this.emit();
  }

  private bindAtom<V>(dep: RecoilState): V {
    dep.subscribe(() => this.updateSelector());
    this.registeredDeps.add(dep);
    return dep.getter();
  }

  constructor(private readonly context: SelectConext) {
    super();
    this.value = context.get({ get: (dep: RecoilState) => this.bindAtom(dep) });
  }

  setter() {
    this.context.set({
      get: (dep: RecoilState) => dep.getter(),
      set: (dep: RecoilState, value: any) => dep.setter(value),
    });
  }
}

export const selector = (context: SelectConext) => {
  if (NameSpace.has(context.key)) {
    throw new Error(`invalid key`);
  } else {
    const defaultValue = new Selector(context);
    NameSpace.set(context.key, defaultValue);
    return defaultValue;
  }
};
