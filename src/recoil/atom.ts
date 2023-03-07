type SubscribeReturn = {
  unsubscribe: VoidFunction;
};

export const NameSpace = new Map();

type AtomContext = {
  key: string;
  default: any;
};

export class Atom<T> {
  private listeners = new Set<(value: T) => void>();
  value: any;
  key: string;

  constructor(private context: AtomContext) {
    this.getter = this.getter.bind(this);
    this.setter = this.setter.bind(this);
    this.value = context.default;
    this.key = context.key;
  }

  setter(value: T) {
    if (this.value === value) {
      console.log("memo");
    } else {
      this.value = value;
      this.emit();
    }
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

export const atom = (value: AtomContext) => {
  if (NameSpace.has(value.key)) {
    throw new Error(`invalid key`);
  } else {
    const defaultValue = new Atom(value);
    NameSpace.set(value.key, defaultValue);
    return defaultValue;
  }
};
