import './OddsBar.css';

export default function OddsBar({ yesOdds, noOdds }) {
  return (
    <div className="odds-bar-container">
      <div className="odds-bar">
        <div className="odds-yes" style={{ width: `${yesOdds}%` }}>
          <span className="odds-label">YES {yesOdds}%</span>
        </div>
        <div className="odds-no" style={{ width: `${noOdds}%` }}>
          <span className="odds-label">NO {noOdds}%</span>
        </div>
      </div>
    </div>
  );
}
