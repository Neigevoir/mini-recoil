type SubscribeReturn = {
  unsubscribe: VoidFunction;
};

export const NameSpace = new Map();

export class Basic<T> {
  private listeners = new Set<(value: any) => void>();

  constructor(protected value?: T) {
    this.getter = this.getter.bind(this);
    this.setter = this.setter.bind(this);
  }

  setter(value: T) {
    if (this.value === value) {
      console.log("memo");
    } else {
      this.value = value;
      this.emit();
    }
  }

  getter() {
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
