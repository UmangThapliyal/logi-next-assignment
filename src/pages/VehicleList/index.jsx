import { useState } from "react";
import useQuery from "../../hooks/useQuery";
import useWebSocket from "../../hooks/useWebSocket";
import { useVehicleFilter } from "../../context";
import Table from "../../components/Table";
import VehicleDetailsModal from "../../components/VehicleDetailsModal";
import {
  formatDateTime,
  formatLocation,
  formatStatus,
} from "../../utils/vehicleFormatters";
import "./VehicleList.css";

const VehicleList = () => {
  const { data: vehicleData, isLoading } = useQuery("/api/vehicles?limit=25");
  const { status: socketStatus } = useWebSocket("");
  const { selectedStatus } = useVehicleFilter();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const allVehicles = vehicleData?.data ?? [];
  const vehicleList =
    selectedStatus === "total"
      ? allVehicles
      : allVehicles.filter((vehicle) => vehicle.status === selectedStatus);

  const totalVehicles = vehicleList.length;
  const selectedVehicleFromList = allVehicles.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  const columns = [
    {
      header: "Vehicle",
      accessor: "vehicleNumber",
      render: (row) => (
        <button
          type="button"
          className="vehicle-link-btn"
          onClick={() => setSelectedVehicleId(row.id)}
        >
          {row.vehicleNumber}
        </button>
      ),
    },
    { header: "Driver", accessor: "driverName" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className={`status-pill ${row.status}`}>
          {formatStatus(row.status)}
        </span>
      ),
    },
    {
      header: "Speed",
      accessor: "speed",
      render: (row) => (
        <span className="speed-pill">{Number(row.speed ?? 0)} mph</span>
      ),
    },
    { header: "Destination", accessor: "destination" },
    {
      header: "ETA",
      accessor: "estimatedArrival",
      render: (row) => formatDateTime(row.estimatedArrival),
    },
    {
      header: "Last Update",
      accessor: "lastUpdated",
      render: (row) =>
        formatDateTime(row.lastUpdated || row.lastUpdatedAt || row.updatedAt),
    },
    {
      header: "Location",
      accessor: "currentLocation",
      render: (row) => formatLocation(row.currentLocation),
    },
  ];

  if (isLoading) {
    return <div className="vehicle-list-wrap">Loading vehicles...</div>;
  }

  return (
    <div className="vehicle-list-wrap">
      <div className="vehicle-list-header">
        <h3>Vehicles ({totalVehicles})</h3>
        <span className="live-pill">
          {socketStatus === "open" ? "Live" : "Reconnecting"}
        </span>
      </div>

      <div className="vehicle-table-scroll">
        <Table columns={columns} data={vehicleList} className="vehicle-table" />
      </div>

      <VehicleDetailsModal
        vehicleId={selectedVehicleId}
        fallbackVehicle={selectedVehicleFromList}
        onClose={() => setSelectedVehicleId(null)}
      />
    </div>
  );
};

export default VehicleList;
