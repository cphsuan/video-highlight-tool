import { expect } from "vitest";

const isElement = (value: unknown): value is Element =>
  value instanceof Element;

const elementOrFail = (
  received: unknown,
  matcherName: string
): { element: Element | null; pass: boolean; message: () => string } => {
  if (received === null || received === undefined) {
    return {
      element: null,
      pass: false,
      message: () =>
        `Expected a DOM element in ${matcherName}, but received ${String(
          received
        )}.`,
    };
  }

  if (!isElement(received)) {
    return {
      element: null,
      pass: false,
      message: () =>
        `Expected a DOM element in ${matcherName}, but received type "${typeof received}".`,
    };
  }

  return {
    element: received,
    pass: true,
    message: () => "",
  };
};

expect.extend({
  toBeInTheDocument(received: unknown) {
    if (!isElement(received)) {
      return {
        pass: false,
        message: () =>
          "Expected a DOM element when calling toBeInTheDocument().",
      };
    }

    const pass = received.isConnected;

    return {
      pass,
      message: () =>
        pass
          ? "Expected the element not to be present in the document."
          : "Expected the element to be present in the document.",
    };
  },

  toHaveAttribute(received: unknown, name: string, expected?: unknown) {
    const { element, pass, message } = elementOrFail(
      received,
      "toHaveAttribute"
    );
    if (!pass || !element) return { pass, message };

    const actualValue = element.getAttribute(name);

    if (expected === undefined) {
      const exists = actualValue !== null;
      return {
        pass: exists,
        message: () =>
          exists
            ? `Expected attribute "${name}" not to exist.`
            : `Expected attribute "${name}" to exist.`,
      };
    }

    const expectedValue =
      expected instanceof RegExp ? expected : String(expected);
    const matches =
      actualValue !== null &&
      (expected instanceof RegExp
        ? expected.test(actualValue)
        : actualValue === expectedValue);

    return {
      pass: matches,
      message: () =>
        matches
          ? `Expected attribute "${name}" not to equal ${expectedValue}.`
          : `Expected attribute "${name}" to equal ${expectedValue}, but received ${actualValue}.`,
    };
  },

  toHaveClass(received: unknown, ...classNames: string[]) {
    const { element, pass, message } = elementOrFail(
      received,
      "toHaveClass"
    );
    if (!pass || !element) return { pass, message };

    const expectedClasses = classNames.flatMap((value) =>
      value.split(" ").filter(Boolean)
    );
    const missing = expectedClasses.filter(
      (className) => !element.classList.contains(className)
    );

    const hasAll = missing.length === 0;
    return {
      pass: hasAll,
      message: () =>
        hasAll
          ? `Expected element not to have classes: ${expectedClasses.join(
              ", "
            )}.`
          : `Expected element to have classes: ${missing.join(", ")}, but it did not.`,
    };
  },

  toBeDisabled(received: unknown) {
    const { element, pass, message } = elementOrFail(
      received,
      "toBeDisabled"
    );
    if (!pass || !element) return { pass, message };

    const isNativeDisabled =
      "disabled" in element && (element as HTMLButtonElement).disabled === true;
    const ariaDisabled = element.getAttribute("aria-disabled") === "true";

    const disabled = isNativeDisabled || ariaDisabled;

    return {
      pass: disabled,
      message: () =>
        disabled
          ? "Expected element to be enabled."
          : "Expected element to be disabled.",
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any> {
    toBeInTheDocument(): T;
    toHaveAttribute(name: string, expected?: unknown): T;
    toHaveClass(...classNames: string[]): T;
    toBeDisabled(): T;
  }

  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): void;
    toHaveAttribute(name: string, expected?: unknown): void;
    toHaveClass(...classNames: string[]): void;
    toBeDisabled(): void;
  }
}
