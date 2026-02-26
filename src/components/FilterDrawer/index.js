import useQuery from "../../hooks/useQuery";
import useWebSocket from "../../hooks/useWebSocket";
import { STATUS_ITEMS } from "../../constants/vehicle";
import { useVehicleFilter } from "../../context";
import { formatLastUpdateTime, formatUpdatedAgo } from "../../utils/dateTime";
import { useEffect, useState } from "react";
import "./FilterDrawer.css";
import { BiGroup } from "react-icons/bi";
import { IoMdTrendingUp } from "react-icons/io";
import { FiClock } from "react-icons/fi";
import { GoPulse } from "react-icons/go";
import { FaWifi } from "react-icons/fa6";
import { TbActivityHeartbeat } from "react-icons/tb";

const FilterDrawer = () => {
  const { data: statisticsResponse, refetch } = useQuery("/api/statistics");
  const { lastMessage, status: socketStatus } = useWebSocket("");
  const [statistics, setStatistics] = useState({});
  const [now, setNow] = useState(Date.now());
  const { selectedStatus, setSelectedStatus } = useVehicleFilter();

  useEffect(() => {
    if (statisticsResponse?.data) {
      setStatistics(statisticsResponse.data);
    }
  }, [statisticsResponse]);

  useEffect(() => {
    if (!lastMessage) return;
    refetch();
  }, [lastMessage, refetch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const lastUpdateTime = formatLastUpdateTime(statistics?.timestamp);
  const updatedAgoText = formatUpdatedAgo(statistics?.timestamp, now);

  const statsCards = [
    {
      label: "TOTAL FLEET",
      value: Number(statistics?.total ?? 0),
      icon: <BiGroup size={16} />,
    },
    {
      label: "AVG SPEED",
      value: Number(statistics?.average_speed ?? 0).toFixed(0),
      icon: <IoMdTrendingUp size={16} />,
    },
    {
      label: "MOVING",
      value: Number(statistics?.en_route ?? 0),
      icon: <GoPulse size={16} />,
    },
    {
      label: "LAST UPDATE",
      value: lastUpdateTime,
      icon: <FiClock size={16} />,
    },
  ];

  return (
    <div className="drawer">
      <div className="live-banner">
        <FaWifi size={16} />
        <span>
          {socketStatus === "open"
            ? "Live Updates Active"
            : "Live stream reconnecting..."}
        </span>
      </div>

      <div className="section">
        <h3 className="section-title">
          <TbActivityHeartbeat size={16} /> Filter by Status
        </h3>
        <div className="status-grid">
          {STATUS_ITEMS.map((status) => (
            <button
              key={status.key}
              className={`status-chip ${
                selectedStatus === status.key ? "active" : ""
              }`}
              onClick={() => setSelectedStatus(status.key)}
              type="button"
            >
              <span className={`status-dot ${status.dotClass}`} />
              <span className="status-name">{status.name}</span>
              <span className="status-value">
                ( {Number(statistics?.[status.key] ?? 0)} )
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">◷ Fleet Statistics</h3>
        <div className="stats-grid">
          {statsCards.map((card) => (
            <div key={card.label} className="stat-card">
              <div className="stat-value">{card.value}</div>
              <div className="stat-label">
                <span>{card.icon}</span> {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex update-footer">
        <FiClock size={12} />
        <span>
          {updatedAgoText} <span className="inline-dot" />
          next update in ~3 minutes
        </span>
      </div>
    </div>
  );
};

export default FilterDrawer;
