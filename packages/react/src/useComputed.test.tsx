import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { act } from "react-dom/test-utils";
import { beforeEach, describe, expect, it, test } from "vitest";
import { atom } from ".";
import { useAtom } from "./useAtom";
import { useComputed } from "./useComputed";

React.version;

describe("useComputed", () => {
  const lastName = atom("CD");

  function NameForm() {
    const firstName$ = useAtom("AB");
    const lastName$ = useAtom(lastName);

    const [age, setAge] = useState(10);

    const fullName$ = useComputed(
      () => `${firstName$.value} ${lastName$.value} (${age})`,
      [age]
    );

    return (
      <div>
        <button data-testid="age-increment" onClick={() => setAge(age + 1)}>
          {age}++
        </button>
        <input
          data-testid="firstName-input"
          onChange={(e) => {
            firstName$.value = e.target.value;
          }}
          value={firstName$.value}
        />
        <div data-testid="fullName">{fullName$.value}</div>
      </div>
    );
  }

  beforeEach(() => {
    lastName.value = "CD";

    render(<NameForm />);
  });

  test("should show full name on render", () => {
    expect(screen.getByTestId("fullName").innerHTML).toBe("AB CD (10)");
  });

  test("should reflect dependency update", () => {
    act(() => {
      lastName.value = "EF";
    });

    fireEvent.change(screen.getByTestId<HTMLInputElement>("firstName-input"), {
      target: { value: "XY" },
    });

    expect(screen.getByTestId("fullName").innerHTML).toBe("XY EF (10)");
  });

  it("should reflect hook dependency update", () => {
    fireEvent.click(screen.getByTestId<HTMLInputElement>("age-increment"));

    expect(screen.getByTestId("fullName").innerHTML).toBe("AB CD (11)");
  });
});
