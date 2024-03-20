export function dateToRelative(dateStr = null, short = null) {
  if (!dateStr) return "";

  const date = new Date(dateStr * 1000);

  const now = new Date();
  const diff = now - date;

  if (diff < 1000 * 60) {
    const seconds = Math.floor(diff / 1000);
    if (seconds < 10) return "now";
    if (short === "short") return `${seconds}s`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  if (diff < 1000 * 60 * 60) {
    const minutes = Math.floor(diff / (1000 * 60));
    if (short === "short") return `${minutes}m`;
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  if (diff < 1000 * 60 * 60 * 24) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (short === "short") return `${hours}h`;
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  // return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
  //   "0" +
  //   (date.getDate() + 1)
  // ).slice(-2)}`;

  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTime(dateStr = null) {
  if (!dateStr) return;

  const date = new Date(dateStr * 1000);

  const getDigits = (method) => {
    let digits = method;
    if (digits.toString().length === 1) {
      digits = "0" + digits;
    }

    return digits;
  };

  return {
    hour: getDigits(date.getHours()),
    minute: getDigits(date.getMinutes()),
  };
}
