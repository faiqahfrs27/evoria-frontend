export const fadeUp = (delay = 0): React.CSSProperties => ({
  animation: `fade-up 0.6s ${delay}ms ease forwards`,
  opacity: 0,
});