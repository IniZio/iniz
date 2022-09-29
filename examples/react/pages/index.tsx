import { atom, batch, useAtom, useSideEffect, useCompute } from '@reim/react';
import { useCallback, useEffect } from 'react';

const store = atom({ count: 10, a: { b: 12 }, message: 'hello' });
const timer = atom<Date>(undefined);

function Stat() {
  const store$ = useAtom(store);

  const stat = store$.value.a.b + store$.value.count;
  const statMemo = useCompute(() => store$.value.a.b + store$.value.count);

  return (
    <div>
      <div>Stat</div>
      <div>Asssign: {stat}</div>
      <div>Function: {statMemo}</div>
    </div>
  )
}

function Message() {
  const store$ = useAtom(store);

  const onChange = useCallback((event) => {
    store.value.message = event.target.value;
  }, [])

  return (
    <div>
      <div>Message</div>
      <div>{store$.value.message}</div>
      <input onChange={onChange} value={store$.value.message} />
    </div>
  )
}

function ShowDecrement({ store }: any) {
  const store$$ = useAtom(store);

  return (
    <div>
      <div>Decrement</div>
      <div>{store$$.value.a.b}</div>
    </div>
  )
}

function Counter() {
  // NOTE: Under strict mode, effect is called twice
  useSideEffect(() => {
    console.log("=== counter ", store.value.count)
  });
  useSideEffect(() => {
    console.log("=== nested ", store.value.a.b)
  });

  const store$ = useAtom(store);

  const increment = useCallback(() => {
    store.value.count += 1;
  }, [])

  const decrementOther = useCallback(() => {
    store.value.a.b -= 2;
  }, [])

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrementOther}>Decrement other</button>
      <div>Count: {store$.value.count}</div>
      <ShowDecrement store={store$} />
    </div>
  );
}

function Timer() {
  const store$ = useAtom(store);
  const timer$ = useAtom(timer);

  useEffect(() => {
    timer.value = new Date();
    setInterval(() => {timer.value = new Date()}, 1000)
  }, [])

  return (
    <div>
      <div>Timer</div>
      <div>{store$.value.message} {timer$.value?.toLocaleTimeString()}</div>
    </div>
  )
}

function Inline() {
  const theme$ = useAtom("black");
  const altTheme = theme$.value === "black" ? "white" : "black";

  const changeTheme = useCallback(() => {
    theme$.value = altTheme;
  }, [altTheme, theme$])

  return (
    <div>
      <button
        onClick={changeTheme}
        style={{ backgroundColor: theme$.value, color: altTheme }}
      >Change theme from {theme$.value} to {altTheme}</button>
      <br />
    </div>
  )
}

function BatchUpdate() {
  const count$ = useAtom<number>(2000);
  const todos$ = useAtom<string[]>(["buy dinner", "play basketball"]);
  const profile$ = useAtom<{username: string}>({ username: 'tom' });

  useSideEffect(() => {
    count$.value;
    todos$.value;
    profile$.value;

    console.log("=== batch update");
  })

  const reset = useCallback(
    () => {
      batch(() => {
        count$.value = 0;
        todos$.value = []
        profile$.value = { username: '' }
      })
    },
    [count$, profile$, todos$]
  )

  return (
    <div>
      <div>Count: {count$.value}</div>
      <div>Todos: {JSON.stringify(todos$.value)}</div>
      <div>Profile: {JSON.stringify(profile$.value)}</div>

      <button onClick={reset}>Reset</button>
    </div>
  )
}

export default function Web() {
  const visibility$ = useAtom(true);

  return (
    <div>
      <h1>Web</h1>
      <hr />
      <button onClick={() => visibility$.value = !visibility$.value}>set visiblity</button>
      <Counter />
      <hr />
      {visibility$.value && <Stat />}
      <hr />
      <Message />
      <hr />
      <Timer />
      <hr />
      <Inline />
      <hr />
      <BatchUpdate />
    </div>
  );
}
