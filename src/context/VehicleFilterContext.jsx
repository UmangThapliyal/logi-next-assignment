import { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_STATUS_FILTER } from "../constants/vehicle";

const VehicleFilterContext = createContext(undefined);

export const VehicleFilterProvider = ({ children }) => {
  const [selectedStatus, setSelectedStatus] = useState(DEFAULT_STATUS_FILTER);

  const value = useMemo(
    () => ({ selectedStatus, setSelectedStatus }),
    [selectedStatus]
  );

  return (
    <VehicleFilterContext.Provider value={value}>
      {children}
    </VehicleFilterContext.Provider>
  );
};

export const useVehicleFilter = () => {
  const context = useContext(VehicleFilterContext);

  if (!context) {
    throw new Error("useVehicleFilter must be used within VehicleFilterProvider");
  }

  return context;
};
