import { useState, useEffect } from 'react';
import './Countdown.css';

export default function Countdown({ endDate, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(endDate) - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return null;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return <span className="countdown-ended">Ended</span>;
  }

  if (compact) {
    return (
      <span className="countdown-compact">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    );
  }

  return (
    <div className="countdown">
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.hours}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.minutes}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.seconds}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  );
}
