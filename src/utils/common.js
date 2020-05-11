const LESSTEN = 10;
const TWENTYFOUR = 24;

const castTimeFormat = (value) => {
  return value < LESSTEN ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % TWENTYFOUR);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};
