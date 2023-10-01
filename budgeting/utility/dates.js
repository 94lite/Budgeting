export const getTodayDate = () => {
  const date = new Date();
  return dateToString(date);
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

export const dateToString = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`
};
