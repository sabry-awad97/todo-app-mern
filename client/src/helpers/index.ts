export const getCurrentDay = () => {
  const today = new Date();
  const day = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return day;
};
