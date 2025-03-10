export const sevenDaysFromNow = () => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};
export const oneDayFromNow = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
};
export const fiveMinutesFromNow = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};

export const oneDayInMS = Date.now() + 24 * 60 * 60 * 1000;

export const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60 * 1000);
