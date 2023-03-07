import { NameSpace } from "./atom";
import { RecoilState } from "./types";

type SubscribeReturn = {
  unsubscribe: VoidFunction;
};

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

export class Selector<T> {
  private listeners = new Set<(context: T) => void>();

  private registeredDeps = new Set();
  value: T;

  private bindAtom<V>(dep: RecoilState): V {
    if (Boolean(this.context.set)) {
    }

    if (!this.registeredDeps.has(dep)) {
      dep.subscribe(() => this.updateSelector());
      this.registeredDeps.add(dep);
    }
    return dep.getter();
  }

  private updateSelector() {
    this.value = this.context.get({
      get: (dep: RecoilState) => this.bindAtom(dep),
    });
    this.emit();
  }

  constructor(private readonly context: SelectConext) {
    this.getter = this.getter.bind(this);
    this.setter = this.setter.bind(this);
    this.value = context.get({ get: (dep: RecoilState) => this.bindAtom(dep) });
  }

  setter() {
    this.context.set({
      get: (dep: RecoilState) => dep.getter(),
      set: (dep: RecoilState, value: any) => dep.setter(value),
    });
  }

  getter(): T {
    return this.value;
  }

  emit() {
    for (const listener of this.listeners) {
      const value = this.getter();
      listener(value);
    }
  }

  subscribe(callback: (value: T) => void): SubscribeReturn {
    this.listeners.add(callback);
    return {
      unsubscribe: () => {
        this.listeners.delete(callback);
      },
    };
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
