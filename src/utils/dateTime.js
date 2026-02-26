export const formatLastUpdateTime = (timestamp) => {
  if (!timestamp) return "--:--";

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const parseTimestamp = (timestamp) => {
  if (!timestamp) return NaN;

  if (typeof timestamp === "number") {
    return timestamp < 1e12 ? timestamp * 1000 : timestamp;
  }

  const parsed = new Date(timestamp).getTime();
  return Number.isNaN(parsed) ? NaN : parsed;
};

export const formatUpdatedAgo = (timestamp, currentTime = Date.now()) => {
  if (!timestamp) return "Updated just now";

  const updatedAt = parseTimestamp(timestamp);
  if (Number.isNaN(updatedAt)) return "Updated just now";

  const diffSeconds = Math.max(0, Math.floor((currentTime - updatedAt) / 1000));

  if (diffSeconds < 60) return `Updated ${diffSeconds}s ago`;

  return `Updated ${Math.floor(diffSeconds / 60)}m ago`;
};
