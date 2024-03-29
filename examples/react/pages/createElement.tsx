/** @jsxImportSource @iniz/react */
import { atom } from "@iniz/react";
import { useState } from "react";

const counter = atom(55);
const increment = () => counter(counter() + 1);

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
  basic: { name: "ABC", type: "logistics" },
  contacts: [{ phone: "111111111", name: "Tom" }],
});

function ContactPersonSubForm({
  companyContacts,
}: {
  companyContacts: Company["contacts"];
}) {
  return (
    <div>
      <div data-testid="contact-name-display">{companyContacts[0].name}</div>
      <input
        data-testid="contact-name-input"
        onChange={(e) => {
          companyContacts[0].name = e.target.value;
        }}
        value={companyContacts[0].name}
      />
    </div>
  );
}

function ProfileForm() {
  const companyBasic = company().basic;
  const address = useAtom("");
  // const firstCompanyContact = company().contacts[0];

  // NOTE: This works but react complains about exhaustive deps if just pass `company().contacts[0].name`
  // useEffect(() => {
  //   console.log("=== first contact name", firstCompanyContact.name);
  // }, [firstCompanyContact.name]);

  return (
    <div>
      <h1 data-testid="name-display">{companyBasic.name}</h1>
      <input
        data-testid="name-input"
        onChange={(e) => {
          companyBasic.name = e.target.value;
        }}
        value={company().basic.name}
      />
      <input value={address()} onChange={(e) => address(e.target.value)} />

      <ContactPersonSubForm companyContacts={company().contacts} />
    </div>
  );
}

export default function CreateElement() {
  const message = useAtom("Hello World");

  return (
    <div>
      <div>Create Element</div>
      <button onClick={increment}>{counter()}</button>
      <input onChange={(e) => message(e.target.value)} value={message()} />
      <ProfileForm />
    </div>
  );
}
