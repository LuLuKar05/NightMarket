import './PrivacyBadge.css';

export default function PrivacyBadge({ isPrivate }) {
  return (
    <span className={`privacy-badge ${isPrivate ? 'private' : 'public'}`}>
      ● {isPrivate ? 'Private' : 'Public'}
    </span>
  );
}
