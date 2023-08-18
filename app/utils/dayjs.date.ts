import dayjs from "dayjs";

export const formatDate = (date: string) => {
  return dayjs(date).format("MMM DD YYYY");
};

export const getNewDateAddMonth = (monthToAdd: number) => {
  const b = dayjs().add(monthToAdd, "month");
  return b;
};

export const getEndOfCurrentMonth = () => {
  return dayjs().endOf("month");
};

export const getStartOfCurrentMonth = () => {
  return dayjs().startOf("month");
};

export const getEndOfYear = (year: number) => {
  const yearVal = dayjs().year(year);
  const result = yearVal.endOf("year");
  const correctDate = result.subtract(1, "day");
  return correctDate;
};

export const getStartOfYear = (year: number) => {
  const jan = dayjs(new Date()).get("month");

  const yearVal = dayjs().year(year);
  const result = yearVal.startOf("year");
  return result;
};

export const getMonthNumber = (date: string) => {
  const monthNo = dayjs(date).get("month");
  return monthNo;
};
