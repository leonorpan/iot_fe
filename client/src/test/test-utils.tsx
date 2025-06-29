import { configureStore } from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";

import { rootReducer, RootState } from "../store"; // adjust path as needed

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState: preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  return render(<Provider store={store}>{ui}</Provider>, renderOptions);
}
