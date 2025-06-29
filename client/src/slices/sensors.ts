import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
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
    setShowConnectedOnly: (state, action) => {
      state.showConnectedOnly = action.payload;
    },
    upsertSensor: (state, action: PayloadAction<Sensor>) => {
      const incomingSensor = action.payload;
      const incomingSensorId = state.sensors.findIndex(
        (s) => s.id === incomingSensor.id
      );

      if (incomingSensorId === -1) {
        state.sensors.push(incomingSensor);
        return;
      }

      state.sensors[incomingSensorId] = {
        ...incomingSensor,
        value: incomingSensor.connected
          ? incomingSensor.value
          : state.sensors[incomingSensorId].value,
      };
    },
  },
});

export const { upsertSensor, setShowConnectedOnly } = sensorsSlice.actions;

export default sensorsSlice.reducer;

export const selectSensors = (state: RootState) => state.sensors.sensors;
export const selectShowConnectedOnly = (state: RootState) =>
  state.sensors.showConnectedOnly;
