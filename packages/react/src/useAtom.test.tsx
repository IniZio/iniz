import { fireEvent, render, screen } from "@testing-library/react";
// @ts-ignore
import React, { useCallback, useEffect } from "react";
import { act } from "react-dom/test-utils";
import { beforeEach, describe, expect, test } from "vitest";
import { atom, Atom } from ".";
import { useAtom } from "./useAtom";

React.version;

describe("useAtom", () => {
  describe("Inline atom", () => {
    function Counter() {
      const counter$ = useAtom({ count: 10 });
      const increment = useCallback(() => {
        counter$.value.count += 1;
      }, [counter$]);

      return (
        <div>
          <button data-testid="counter-increment" onClick={increment}>
            {counter$.value.count}
          </button>
        </div>
      );
    }

    beforeEach(() => {
      render(<Counter />);
    });

    test("should show count on render", () => {
      expect(screen.getByTestId("counter-increment").innerHTML).toBe("10");
    });

    test("should reflect increment", () => {
      fireEvent.click(screen.getByTestId("counter-increment"));

      expect(screen.getByTestId("counter-increment").innerHTML).toBe("11");
    });
  });

  describe("Re-render scope", () => {
    type Company = {
      basic: {
        name: string;
      };
      contacts: {
        phone: string;
        name: string;
      }[];
    };
    let company: Atom<Company>;
    let profileRerenderCount = 0;

    function ContactPersonSubForm({ company }: { company: Atom<Company> }) {
      const companyContacts$ = useAtom(company.value.contacts);

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
      const companyBasic$ = useAtom(company.value.basic);

      useEffect(() => {
        profileRerenderCount++;
      });

      return (
        <div>
          <h1 data-testid="name-display">{companyBasic$.value.name}</h1>
          <input
            data-testid="name-input"
            onChange={(e) => {
              companyBasic$.value.name = e.target.value;
            }}
            value={company$.value.basic.name}
          />

          <ContactPersonSubForm company={company$} />
        </div>
      );
    }

    beforeEach(() => {
      profileRerenderCount = 0;
      company = atom({
        basic: { name: "ABC" },
        contacts: [{ phone: "111111111", name: "Tom" }],
      });

      render(<ProfileForm />);
    });

    test("should show name on render", () => {
      expect(screen.getByTestId("name-display").innerHTML).toBe("ABC");
      expect(screen.getByTestId<HTMLInputElement>("name-input").value).toBe(
        "ABC"
      );
    });

    test("should update according to useAtom", () => {
      const nameInputEl = screen.getByTestId<HTMLInputElement>("name-input");
      fireEvent.change(nameInputEl, { target: { value: "CDE" } });

      expect(screen.getByTestId("name-display").innerHTML).toBe("CDE");
      expect(screen.getByTestId<HTMLInputElement>("name-input").value).toBe(
        "CDE"
      );
    });

    test("should update according to atom", () => {
      act(() => {
        company.value.basic.name = "DEF";
      });

      expect(screen.getByTestId("name-display").innerHTML).toBe("DEF");
      expect(screen.getByTestId<HTMLInputElement>("name-input").value).toBe(
        "DEF"
      );
    });

    /**
     *
     * All of the following usages will not cause re-render in parent when `contacts`'s value changes
     *
     * ```
     * function Child({ company }) {
     *   const company$ = useAtom(company)
     *   const companyContacts$ = useAtom(company$.value.contacts)
     * }
     * ```
     *
     * ``
     * function Child({ company }) {
     *   const companyContacts$ = useAtom(company.value.contacts)
     * }
     * ```
     *
     * ``
     * function Child({ companyContacts }) {
     *   const companyContacts$ = useAtom(compantConctacts)
     * }
     * ```
     */
    test("should not update parent if property only used by child's useAtom", () => {
      expect(profileRerenderCount).toBe(1);

      const contactNameInputEl =
        screen.getByTestId<HTMLInputElement>("contact-name-input");
      fireEvent.change(contactNameInputEl, { target: { value: "Jerry" } });

      expect(profileRerenderCount).toBe(1);

      expect(screen.getByTestId("contact-name-display").innerHTML).toBe(
        "Jerry"
      );
      expect(
        screen.getByTestId<HTMLInputElement>("contact-name-input").value
      ).toBe("Jerry");
    });
  });
});
