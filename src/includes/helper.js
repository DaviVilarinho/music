export function formatTimeSecondToPlayer(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60) || 0;
  const seconds = (Math.floor(timeInSeconds) || 0) % 60;
  return `${minutes < 10 ? 0 : ''}${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
}