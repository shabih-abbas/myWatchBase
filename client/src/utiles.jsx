import fallback from './assets/fallback.png'
export function formatDate(date) {
  var dateObj = new Date(date);
  var year = dateObj.getFullYear();
  var month = dateObj.toLocaleString("default", { month: "short" });
  return month + " " + year;
}
export function Img({ path, alt, className, size, height }) {
  const baseImgUrl="https://image.tmdb.org/t/p/";
  return (
    <img
      className={className}
      src={path ? baseImgUrl + size + path: fallback}
      alt={alt}
      height={height}
    />
  );
}
