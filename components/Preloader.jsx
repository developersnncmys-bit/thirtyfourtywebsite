import Skyline from "./Skyline";

// Replica of the app's splash screen. Pure CSS so it covers the page from the
// first paint and fades out on its own, even before JavaScript loads.
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <Skyline seed={11} count={12} className="preloader-sky" />
      <div className="preloader-center">
        <div className="preloader-tile">
          <img src="/logo-mark.png" alt="" />
        </div>
        <span className="preloader-line" />
        <p className="preloader-name">Thirty Forty</p>
        <span className="preloader-line short" />
      </div>
    </div>
  );
}
