import { useEffect } from "react";
import useQuery from "../../hooks/useQuery";
import {
  formatDateTime,
  formatLocation,
  formatStatus,
  toPercent,
} from "../../utils/vehicleFormatters";
import "./VehicleDetailsModal.css";

const VehicleDetailsModal = ({ vehicleId, fallbackVehicle, onClose }) => {
  const { data: selectedVehicleResponse, isLoading } = useQuery(
    vehicleId ? `/api/vehicles/${vehicleId}` : null
  );

  const selectedVehicle = selectedVehicleResponse?.data ?? fallbackVehicle;

  useEffect(() => {
    if (!vehicleId) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [vehicleId, onClose]);

  if (!vehicleId) return null;

  return (
    <div className="vehicle-modal-overlay" onClick={onClose} role="presentation">
      <div className="vehicle-modal" onClick={(e) => e.stopPropagation()}>
        {isLoading && !selectedVehicle ? (
          <div className="vehicle-modal-body">
            <div className="vehicle-modal-loading">Loading vehicle details...</div>
          </div>
        ) : (
          <>
            <div className="vehicle-modal-head">
              <div>
                <h3>{selectedVehicle?.vehicleNumber}</h3>
                <p>
                  {selectedVehicle?.driverName} • {formatStatus(selectedVehicle?.status)}
                </p>
              </div>
              <button
                type="button"
                className="vehicle-modal-close"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            <div className="vehicle-modal-body">
              <div className="vehicle-modal-grid">
                <div className="vehicle-info-card">
                  <span className="card-label">STATUS</span>
                  <span className={`status-pill ${selectedVehicle?.status}`}>
                    {formatStatus(selectedVehicle?.status)}
                  </span>
                </div>

                <div className="vehicle-info-card">
                  <span className="card-label">CURRENT SPEED</span>
                  <strong>{Number(selectedVehicle?.speed ?? 0)} mph</strong>
                </div>

                <div className="vehicle-info-card">
                  <span className="card-label">DRIVER</span>
                  <strong>{selectedVehicle?.driverName || "-"}</strong>
                </div>

                <div className="vehicle-info-card">
                  <span className="card-label">PHONE</span>
                  <strong>{selectedVehicle?.driverPhone || "-"}</strong>
                </div>

                <div className="vehicle-info-card">
                  <span className="card-label">DESTINATION</span>
                  <strong>{selectedVehicle?.destination || "-"}</strong>
                </div>

                <div className="vehicle-info-card">
                  <span className="card-label">LOCATION</span>
                  <strong>{formatLocation(selectedVehicle?.currentLocation)}</strong>
                </div>

                <div className="vehicle-info-card">
                  <span className="card-label">BATTERY LEVEL</span>
                  <strong>{toPercent(selectedVehicle?.batteryLevel)}%</strong>
                  <div className="meter">
                    <span
                      className="meter-fill battery"
                      style={{ width: `${toPercent(selectedVehicle?.batteryLevel)}%` }}
                    />
                  </div>
                </div>

                <div className="vehicle-info-card">
                  <span className="card-label">FUEL LEVEL</span>
                  <strong>{toPercent(selectedVehicle?.fuelLevel)}%</strong>
                  <div className="meter">
                    <span
                      className="meter-fill fuel"
                      style={{ width: `${toPercent(selectedVehicle?.fuelLevel)}%` }}
                    />
                  </div>
                </div>

                <div className="vehicle-info-card vehicle-info-wide">
                  <span className="card-label">LAST UPDATED</span>
                  <strong>
                    {formatDateTime(
                      selectedVehicle?.lastUpdated ||
                        selectedVehicle?.lastUpdatedAt ||
                        selectedVehicle?.updatedAt
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailsModal;
