function IoTDashboardHeader({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="text-4xl font-bold text-gray-800 mb-8"
      data-testid="app-title"
    >
      {children}
    </h1>
  );
}

export default IoTDashboardHeader;
