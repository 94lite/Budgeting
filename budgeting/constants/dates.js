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

export const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`
};

export const getEndOfYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = 12;
  const day = 31;
  return `${year}-${month}-${day}`
};

export const getDifference = (d1, d2) => {
  const start = new Date(d1);
  const end = new Date(d2);
  const startTime = start.getTime();
  const endTime = end.getTime();
  const diffTime = endTime - startTime;
  const difference = Math.ceil(diffTime / (1000 * 3600 * 24));
  return difference
};