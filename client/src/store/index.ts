import { combineReducers, configureStore } from "@reduxjs/toolkit";

import sensorsReducer from "../slices/sensors";

export const rootReducer = combineReducers({
  sensors: sensorsReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
