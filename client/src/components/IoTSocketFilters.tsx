interface IoTSocketFiltersProps {
  showConnectedOnly: boolean;
  setShowConnectedOnly: (value: boolean) => void;
}

function IoTSocketFilters({
  showConnectedOnly,
  setShowConnectedOnly,
}: IoTSocketFiltersProps) {
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
        onChange={(e) => setShowConnectedOnly(e.target.checked)}
        data-testid="iot-filter-input"
        className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
      />
    </div>
  );
}

export default IoTSocketFilters;
