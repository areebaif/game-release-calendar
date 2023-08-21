import dayjs from "dayjs";

export const formatDate = (date: string) => {
  return dayjs(date).format("MMM DD YYYY");
};

export const getNewDateAddMonth = (monthToAdd: number) => {
  const b = dayjs().add(monthToAdd, "month");
  return b;
};

export const getEndOfMonth = () => {
  return dayjs().endOf("month");
};
