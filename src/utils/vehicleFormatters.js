export const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};

export const formatLocation = (location) => {
  const lat = location?.lat;
  const lng = location?.lng;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return "-";
  }

  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

export const formatStatus = (status) =>
  String(status || "-")
    .replace("_", " ")
    .toUpperCase();

export const toPercent = (value) => {
  const safe = Number(value ?? 0);
  if (Number.isNaN(safe)) return 0;
  return Math.max(0, Math.min(100, safe));
};
