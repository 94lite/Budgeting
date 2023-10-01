import { days, daysInMonth } from "@/constants/dates";

export const findNextPaymentDate = (strDate, frequency, value) => {
  const date = new Date(strDate);
  switch (frequency) {
    case "yearly":
      date.setMonth(value ? value[0] : 11);
      date.setDate(value ? value[1] : 31);
      if (!(date > new Date(strDate))) {
        date.setFullYear(date.getFullYear() + 1);
      }
      break;
    case "monthly":
      value = value || daysInMonth(date.getMonth(), date.getFullYear());
      date.setDate(value);
      if (!(date > new Date(strDate))) {
        date.setMonth(date.getMonth() + 1);
      }
      break;
    case "fortnightly":
      value = value || "Sunday";
      date.setDate(date.getDate() + 7);
      for (var i = 1; i <= 7; i++) {
        date.setDate(date.getDate() + 1);
        if (value === days[date.getDay()]) {
          break;
        }
      }
      break;
    case "weekly":
      value = value || "Sunday";
      for (var i = 1; i <= 7; i++) {
        date.setDate(date.getDate() + 1);
        if (value === days[date.getDay()]) {
          break;
        }
      }
      break;
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    default:
      return null;
  }
  return date;
};

export const getPrevDate = (strDate, frequency) => {
  const date = new Date(strDate);
  switch (frequency) {
    case "yearly":
      date.setFullYear(date.getFullYear() - 1);
      break;
    case "monthly":
      date.setMonth(date.getMonth() - 1);
      break;
    case "fortnightly":
      date.setDate(date.getDate() - 14);
      break;
    case "weekly":
      date.setDate(date.getDate() - 7);
      break;
    case "daily":
      date.setDate(date.getDate() - 1);
      break;
    default:
      return null;
  }
  return date;
};

export const getNextDate = (strDate, frequency) => {
  const date = new Date(strDate);
  switch (frequency) {
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "fortnightly":
      date.setDate(date.getDate() + 14);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    default:
      return null;
  }
  return date;
};

