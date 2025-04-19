import "@testing-library/jest-dom";
import "core-js/stable/structured-clone";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, "MessageChannel", {
  writable: true,
  value: jest.fn().mockImplementation(() => {
    let onmessage: any;

    return {
      port1: {
        set onmessage(cb: any) {
          onmessage = cb;
        },
      },
      port2: {
        postMessage: (data: any) => {
          onmessage?.({ data });
        },
      },
    };
  }),
});

global.TextEncoder = require("util").TextEncoder;
