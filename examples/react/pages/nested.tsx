/** @jsxImportSource @iniz/react */
import { atom, effect, useAtom } from "@iniz/react";

const companyBasicForm = atom({
  companyName: "ABC",
  type: "logistics",
});

const contactPersonsForm = atom([{ phone: "11111111", name: "Tom" }]);

// Notice how `contactPersonsForm` is not directly used anywhere but will be notified of updates
effect(() => {
  console.log("=== contacts updated", contactPersonsForm()[0].name);
});

const companyForm = atom({
  basic: companyBasicForm,
  contacts: contactPersonsForm,
});

function ContactPersonSubForm({
  companyContactsForm: companyContacts,
}: {
  companyContactsForm: any;
}) {
  return (
    <div>
      <div data-testid="contact-name-display">{companyContacts()[0].name}</div>
      <input
        data-testid="contact-name-input"
        onChange={(e) => {
          companyForm().contacts[0].name = e.target.value;
        }}
        value={companyContacts()[0].name}
      />
    </div>
  );
}

function ProfileForm() {
  const address = useAtom("");
  const contacts$ = useAtom(companyForm().contacts);

  return (
    <div>
      <h1 data-testid="name-display">{companyForm().basic.companyName}</h1>
      <input
        data-testid="name-input"
        onChange={(e) => {
          companyForm().basic.companyName = e.target.value;
        }}
        value={companyForm().basic.companyName}
      />
      <input value={address()} onChange={(e) => address(e.target.value)} />

      <ContactPersonSubForm companyContactsForm={contacts$} />
    </div>
  );
}

export default function Nested() {
  return (
    <div>
      <div>Nested Atom</div>
      <ProfileForm />
    </div>
  );
}
