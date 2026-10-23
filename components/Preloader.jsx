// The app's splash screen: green gradient, glow, logo and the "Thirty Forty"
// wordmark. Pure CSS so it covers the first paint and fades out on its own.
export default function Preloader() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-glow" />
      <div className="splash-beam" />
      <div className="splash-center">
        <img src="/brand/logo-light.png" alt="" className="splash-logo" />
        <p className="splash-name">Thirty Forty</p>
        <span className="splash-bar">
          <i />
        </span>
      </div>
    </div>
  );
}
