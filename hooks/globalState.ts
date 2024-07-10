import { useEffect, useState } from 'react';

interface GlobalState<T> {
  readonly listeners: Set<() => void>;
  value: T;
}

function createGlobalState<T>(defaultValue: T): GlobalState<T> {
  let value = defaultValue;

  return {
    listeners: new Set(),
    set value(newValue: T) {
      if (value === newValue) return;
      value = newValue;
      for (const listener of this.listeners) listener();
    },
    get value() {
      return value;
    }
  };
}

function useGlobalState<T>(state: GlobalState<T>) {
  const [_, setRefresh] = useState(false);

  useEffect(() => {
    const refresh = () => setRefresh(r => !r);

    state.listeners.add(refresh);
    return () => void state.listeners.delete(refresh);
  }, []);

  return {
    get value() {
      return state.value;
    },
    set value(newValue: T) {
      state.value = newValue;
    }
  };
}

export { createGlobalState, useGlobalState };

