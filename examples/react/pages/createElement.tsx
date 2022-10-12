import { atom } from "@iniz/react";
import { useState } from "react";

const counter = atom(55);
const increment = () => counter.value++;

// NOTE: This is also working
function useAtom<TValue>(value: TValue) {
  return useState(() => atom(value))[0];
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
  companyContacts: companyContacts$,
}: {
  companyContacts: Company["contacts"];
}) {
  return (
    <div>
      <div data-testid="contact-name-display">{companyContacts$[0].name}</div>
      <input
        data-testid="contact-name-input"
        onChange={(e) => {
          companyContacts$[0].name = e.target.value;
        }}
        value={companyContacts$[0].name}
      />
    </div>
  );
}

function ProfileForm() {
  const companyBasic = company.value.basic;

  return (
    <div>
      <h1 data-testid="name-display">{companyBasic.name}</h1>
      <input
        data-testid="name-input"
        onChange={(e) => {
          companyBasic.name = e.target.value;
        }}
        value={company.value.basic.name}
      />

      <ContactPersonSubForm companyContacts={company.value.contacts} />
    </div>
  );
}

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
      <ProfileForm />
    </div>
  );
}
