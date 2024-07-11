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

    setTimeout(refresh, 1000); // Next.js skips rerendering the initial page if this is immediate
    // If anyone makes the techinal decision to use this framework again in the future
    // they should be burned alive

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

