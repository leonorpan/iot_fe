import { useDispatch, useSelector } from "react-redux";

import { setToConnectedOnly } from "../features/sensors";
import { RootState } from "../store";

function IoTSocketFilters() {
  const dispatch = useDispatch();
  const showConnectedOnly = useSelector(
    (state: RootState) => state.sensors.showConnectedOnly
  );

  return (
    <div
      className="mb-8 p-4 bg-white rounded-lg shadow-md flex items-center space-x-4"
      data-testid="iot-socket-filter"
    >
      <label
        htmlFor="showConnectedToggle"
        className="text-gray-700 font-medium text-lg"
        data-testid="filter-toggle"
      >
        Show Connected Sensors Only:
      </label>
      <input
        type="checkbox"
        id="showConnectedToggle"
        checked={showConnectedOnly}
        onChange={(e) => dispatch(setToConnectedOnly(e.target.checked))}
        data-testid="iot-filter-input"
        className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
      />
    </div>
  );
}

export default IoTSocketFilters;
