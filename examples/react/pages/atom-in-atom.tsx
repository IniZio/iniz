/** @jsxImportSource @iniz/react */

import { atom, store } from "@iniz/react";

const email = atom("");

const form = store({
  name: "",
  email,
  reset() {
    this.name = "Tom Cruise";
    this.email = "tom@someemail.com"; // Note it won't need function call
  },
});

form.reset();
form.email = "cruise@anotheremail.com";

function AtomInAtom() {
  return (
    <form>
      <label>Name</label>
      <input value={form.name} onChange={(e) => (form.name = e.target.value)} />

      <label>Email in form</label>
      <input
        value={form.email}
        onChange={(e) => (form.email = e.target.value)}
      />

      <label>Name in atom</label>
      <input value={email()} onChange={(e) => email(e.target.value)} />
    </form>
  );
}

export default AtomInAtom;
