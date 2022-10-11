import { atom, useAtom } from "@iniz/react";

const counter = atom(55);
const increment = () => counter.value++;

// // NOTE: This is also working
// function useAtom<TValue>(value: TValue) {
//   return useState(() => atom(value))[0];
// }

export default function CreateElement() {
  const message = useAtom("Hello World");

  return (
    <div>
      <div>Create Element</div>
      <button onClick={increment}>{counter.value}</button>
      <input
        onChange={(e) => (message.value = e.target.value)}
        value={message.value}
      />
    </div>
  );
}
