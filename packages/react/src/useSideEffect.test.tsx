import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { act } from "react-dom/test-utils";
import { beforeEach, describe, expect, test } from "vitest";
import { atom } from ".";
import { useAtom } from "./useAtom";
import { useSideEffect } from "./useSideEffect";

React.version;

describe("useSideEffect", () => {
  let effectCount = 0;

  const lastName = atom("CD");

  function NameForm() {
    const firstName$ = useAtom("AB");
    const lastName$ = useAtom(lastName);

    const [age, setAge] = useState(10);

    useSideEffect(() => {
      firstName$();
      lastName$();
      effectCount++;
    }, [age]);

    return (
      <div>
        <button data-testid="age-increment" onClick={() => setAge(age + 1)}>
          {age}++
        </button>
        <input
          data-testid="firstName-input"
          onChange={(e) => {
            firstName$(e.target.value);
          }}
          value={firstName$()}
        />
      </div>
    );
  }

  beforeEach(() => {
    effectCount = 0;

    render(<NameForm />);
  });

  test("should only run effect once on mount", () => {
    expect(effectCount).toBe(1);
  });

  test("should execute on atom chaNge", () => {
    expect(effectCount).toBe(1);
    act(() => {
      lastName("EF");
    });
    expect(effectCount).toBe(2);

    fireEvent.change(screen.getByTestId<HTMLInputElement>("firstName-input"), {
      target: { value: "XY" },
    });
    expect(effectCount).toBe(3);

    fireEvent.click(screen.getByTestId<HTMLInputElement>("age-increment"));
    expect(effectCount).toBe(4);
  });
});
