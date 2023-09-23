export const spectrum = [
  "daily",
  "weekly",
  "fortnightly",
  "monthly",
  "yearly"
];

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const _daysInMonth = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];

export const daysInMonth = (month, year) => {
  if (month === 1) {
    if (isLeapYear(year)) {
      return 29;
    }
    return 28;
  }
  return _daysInMonth[month];
};

const isLeapYear = year => {
  if ((year % 4) === 0) {
    if ((year % 100) === 0) {
      if ((year % 400) === 0) {
        return true;
      }
      return false;
    }
    return true;
  }
  return false;
};