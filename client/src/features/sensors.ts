import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { type Sensor } from "../types";

interface SensorsState {
  sensors: Sensor[];
  showConnectedOnly: boolean;
}

const initialState: SensorsState = {
  sensors: [],
  showConnectedOnly: false,
};

export const sensorsSlice = createSlice({
  name: "sensors",
  initialState,
  reducers: {
    setToConnectedOnly: (state, action) => {
      state.showConnectedOnly = action.payload;
    },
    upsertSensor: (state, action: PayloadAction<Sensor>) => {
      const incomingSensor = action.payload
      const idx = state.sensors.findIndex((s) => s.id === incomingSensor.id);

      if (idx === -1) {
        state.sensors.push(incomingSensor);
        return;
      }

      state.sensors[idx] = {
        ...incomingSensor,
        value: incomingSensor.connected
          ? incomingSensor.value
          : state.sensors[idx].value,
      };
    },
  },
});

export const { upsertSensor, setToConnectedOnly } = sensorsSlice.actions;

export default sensorsSlice.reducer;
