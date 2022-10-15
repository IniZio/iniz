/** @jsxImportSource @iniz/react */
import {
  atom,
  batch,
  effect,
  useAtom,
  useComputed,
  useSideEffect,
} from "@iniz/react";
import { useCallback, useEffect } from "react";

const store = atom({ count: 10, a: { b: 12 }, message: "hello" });
const timer = atom<Date | undefined>(undefined);

function Stat() {
  /*
  Both plain expression (i.e. `stat`) and `useComputed` can trigger rerender correctly,
  `useComputed` is for cases where value from React hook e.g. `useState` is included
   */
  const store$ = useAtom(store);

  const stat = store$.value.a.b + store$.value.count;
  const statMemo = useComputed(() => store$.value.a.b + store$.value.count);

  return (
    <div>
      <div>Stat</div>
      <div>Asssign: {stat}</div>
      <button onClick={() => statMemo.value++}>
        Try to update computed value
      </button>
      <div>Function: {statMemo.value}</div>
    </div>
  );
}

function Message() {
  /*
  Simple usage of atom in text input
   */
  const store$ = useAtom(store);

  const onChange = useCallback(
    (event) => {
      store$.value.message = event.target.value;
    },
    [store$]
  );

  useEffect(() => {
    effect(() => {
      console.log("=== message A", store.value.message);
    });
  }, []);
  useSideEffect(() => {
    console.log("=== message B", store$.value.message);
  });

  return (
    <div>
      <div>Message</div>
      <div>{store$.value.message}</div>
      <input onChange={onChange} value={store$.value.message} />
    </div>
  );
}

function ShowDecrement({ store }: any) {
  /*
  Scope an atom to property when passed to child component.
  Changes to `a` will reflect in store, but won't cause parent to re-render unnecessarily
   */
  const a$ = useAtom(store);

  return (
    <div>
      <div>Decrement</div>
      <button onClick={() => a$.value.b--}>{a$.value.b}--</button>
    </div>
  );
}

function Counter() {
  /*
  Classic counter example along with `useSideEffect`, which is similar to `useEffect`
   */

  // NOTE: Under strict mode, effect is called twice
  useSideEffect(() => {
    console.log("=== counter ", store.value.count);
  });
  useSideEffect(() => {
    console.log("=== nested ", store.value.a.b);
  });

  const store$ = useAtom(store);

  const increment = useCallback(() => {
    store.value.count += 1;
  }, []);

  const decrementOther = useCallback(() => {
    store.value.a.b -= 2;
  }, []);

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrementOther}>Decrement other</button>
      <div>Count: {store$.value.count}</div>
      <ShowDecrement store={store$.value.a} />
    </div>
  );
}

function Timer() {
  /*
  Notice only the timer component is updating to value change,
  although the store is global
   */
  const store$ = useAtom(store);
  const timer$ = useAtom(timer);

  const timerLabel = useComputed(
    () => `${store$.value.message} ${timer$.value?.toLocaleDateString()}`
  );

  useEffect(() => {
    timer.value = new Date();
    setInterval(() => {
      timer.value = new Date();
    }, 1000);
  }, []);

  return (
    <div>
      <div>Timer</div>
      <div>{timerLabel.value}</div>
    </div>
  );
}

function Inline() {
  /*
  Inline an atom creation in a component
   */
  const theme$ = useAtom("black");
  const altTheme = theme$.value === "black" ? "white" : "black";

  const changeTheme = useCallback(() => {
    theme$.value = altTheme;
  }, [altTheme, theme$]);

  return (
    <div>
      <button
        onClick={changeTheme}
        style={{ backgroundColor: theme$.value, color: altTheme }}
      >
        Change theme from {theme$.value} to {altTheme}
      </button>
      <br />
    </div>
  );
}

function BatchUpdate() {
  /*
  Update multiple stores at same time in batch,
  should see `useSideEffect` only executed once on reset
   */
  const count$ = useAtom<number>(2000);
  const todos$ = useAtom<string[]>(["buy dinner", "play basketball"]);
  const profile$ = useAtom<{ username: string }>({ username: "tom" });

  useSideEffect(() => {
    count$.value;
    todos$.value;
    profile$.value;

    console.log("=== batch update");
  });

  const reset = useCallback(() => {
    batch(() => {
      count$.value = 0;
      todos$.value = [];
      profile$.value = { username: "" };
    });
  }, [count$, profile$, todos$]);

  return (
    <div>
      <div>Count: {count$.value}</div>
      <div>Todos: {JSON.stringify(todos$.value)}</div>
      <div>Profile: {JSON.stringify(profile$.value)}</div>

      <button onClick={reset}>Reset</button>
    </div>
  );
}

type Company = {
  basic: {
    name: string;
  };
  contacts: {
    phone: string;
    name: string;
  }[];
};

const company = atom({
  basic: { name: "ABC" },
  contacts: [{ phone: "111111111", name: "Tom" }],
});

function ContactPersonSubForm({
  companyContacts,
}: {
  companyContacts: Company["contacts"];
}) {
  const companyContacts$ = useAtom(companyContacts);

  return (
    <div>
      <div data-testid="contact-name-display">
        {companyContacts$.value[0].name}
      </div>
      <input
        data-testid="contact-name-input"
        onChange={(e) => {
          companyContacts$.value[0].name = e.target.value;
        }}
        value={companyContacts$.value[0].name}
      />
    </div>
  );
}

function ProfileForm() {
  const company$ = useAtom(company);
  const companyBasic$ = company().basic;

  return (
    <div>
      <h1 data-testid="name-display">{companyBasic$.name}</h1>
      <input
        data-testid="name-input"
        onChange={(e) => {
          companyBasic$.name = e.target.value;
        }}
        value={company$().basic.name}
      />

      <ContactPersonSubForm companyContacts={company$.value.contacts} />
    </div>
  );
}

export default function Web() {
  const visibility$ = useAtom(true);

  return (
    <div>
      <h1>Web</h1>
      <hr />
      <button onClick={() => (visibility$.value = !visibility$.value)}>
        set visiblity
      </button>
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
      <ProfileForm />
    </div>
  );
}
