export function dateToRelative(
  dateStr = null,
  { short = false, interval = null } = {}
) {
  if (!dateStr) return "";

  const date = new Date(dateStr * 1000);

  const now = new Date();
  const diff = now - date;

  if (diff < 1000 * 60) {
    const seconds = Math.floor(diff / 1000);
    if (seconds < 10) return "now";
    if (short) return `${seconds}s`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
  if (diff < 1000 * 60 * 60) {
    const minutes = Math.floor(diff / (1000 * 60));
    if (short) return `${minutes}m`;
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (diff < 1000 * 60 * 60 * 24) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (short) return `${hours}h`;
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  switch (interval) {
    case "week":
      const week = Math.floor(diff / (604800 * 1000));
      if (week >= 1) return week + "w";
    case "day":
      const day = Math.floor(diff / (86400 * 1000));
      return day + "d";
  }

  return date.toLocaleString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTime(dateStr = null) {
  if (!dateStr) return;

  const date = new Date(dateStr * 1000);

  return date.toLocaleString("it-it", {
    hour: "numeric",
    minute: "numeric",
  });
}
