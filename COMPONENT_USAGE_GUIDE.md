# Component Usage Guide

Quick reference for using the NightMarket component library.

## Import Components

```javascript
// Import from centralized index
import { Button, Input, Card, Modal } from '../components';
import { PrivacyBadge, OddsBar, Countdown, MarketCard } from '../components';

// Or import directly
import Button from '../components/common/Button';
import MarketCard from '../components/market/MarketCard';
```

## Button

```jsx
// Primary button
<Button variant="primary" onClick={handleClick}>
  Submit
</Button>

// With loading state
<Button variant="primary" loading={isProcessing}>
  Processing...
</Button>

// With icon
<Button variant="secondary" icon="🚀">
  Launch
</Button>

// Sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

## Input

```jsx
// Basic input
<Input
  label="Amount"
  type="number"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  placeholder="0.00"
/>

// With prefix/suffix
<Input
  label="Bet Amount"
  value={bet}
  onChange={(e) => setBet(e.target.value)}
  prefix="$"
  suffix="DUST"
/>

// With validation
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>

// With hint and character count
<Input
  label="Description"
  value={desc}
  onChange={(e) => setDesc(e.target.value)}
  hint="Brief description of your market"
  maxLength={200}
/>
```

## Card

```jsx
// Basic card
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Hoverable card
<Card hoverable onClick={handleClick}>
  Clickable content
</Card>

// Elevated card
<Card variant="elevated">
  Raised content
</Card>
```

## Modal

```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Place Bet"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Confirm
      </Button>
    </>
  }
>
  <p>Modal content goes here</p>
</Modal>
```

## PrivacyBadge

```jsx
// Show privacy status
<PrivacyBadge isPrivate={true} />
<PrivacyBadge isPrivate={false} size="small" />
<PrivacyBadge isPrivate={true} showIcon={false} />
```

## OddsBar

```jsx
// Display market odds
<OddsBar yesPercentage={65} />

// Without percentages
<OddsBar yesPercentage={42} showPercentages={false} />

// Static (no animation)
<OddsBar yesPercentage={78} animated={false} />
```

## Countdown

```jsx
// Full countdown
<Countdown 
  endDate="2025-12-31T23:59:59" 
  onExpire={() => console.log('Market closed')}
/>

// Compact format
<Countdown 
  endDate="2025-12-31T23:59:59" 
  compact={true}
/>
```

## MarketCard

```jsx
const market = {
  id: '1',
  title: 'Will Bitcoin reach $100k?',
  category: 'Crypto',
  isPrivate: true,
  volume: 125000,
  traders: 342,
  yesPercentage: 65,
  liquidity: 50000,
  endDate: '2025-12-31T23:59:59'
};

<MarketCard market={market} />
```

## Complete Example

```jsx
import { useState } from 'react';
import { Button, Input, Card, Modal } from '../components';
import { OddsBar, Countdown } from '../components';

function MarketExample() {
  const [showModal, setShowModal] = useState(false);
  const [betAmount, setBetAmount] = useState('');

  return (
    <Card hoverable>
      <h3>Will Bitcoin reach $100k?</h3>
      
      <OddsBar yesPercentage={65} />
      
      <Countdown 
        endDate="2025-12-31T23:59:59" 
        compact={true}
      />

      <Button 
        variant="primary"
        onClick={() => setShowModal(true)}
      >
        Place Bet
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Place Your Bet"
        footer={
          <>
            <Button 
              variant="ghost" 
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={() => console.log('Bet placed!')}
            >
              Confirm
            </Button>
          </>
        }
      >
        <Input
          label="Amount"
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          suffix="DUST"
          placeholder="10.00"
        />
      </Modal>
    </Card>
  );
}
```

## Styling Tips

### Colors
```css
/* Use CSS variables from index.css */
color: var(--color-main);      /* #371F76 */
color: var(--color-secondary);  /* #F7F4EB */
color: var(--color-third);      /* #B9C0FF */
color: var(--color-shadow);     /* #C8CEEE */
```

### Spacing
```css
/* Common gaps */
gap: 0.5rem;  /* 8px */
gap: 1rem;    /* 16px */
gap: 1.5rem;  /* 24px */
gap: 2rem;    /* 32px */

/* Padding */
padding: 1.5rem;  /* Cards, containers */
padding: 0.75rem 1rem;  /* Buttons, small elements */
```

### Responsive
```css
/* Mobile first approach */
@media (max-width: 640px) {
  /* Mobile styles */
}

@media (max-width: 1024px) {
  /* Tablet styles */
}
```

## Common Patterns

### Loading State
```jsx
const [loading, setLoading] = useState(false);

<Button 
  variant="primary" 
  loading={loading}
  onClick={async () => {
    setLoading(true);
    await doSomething();
    setLoading(false);
  }}
>
  Submit
</Button>
```

### Form Validation
```jsx
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!amount) newErrors.amount = 'Amount is required';
  if (amount < 10) newErrors.amount = 'Minimum 10 DUST';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

<Input
  label="Bet Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  error={errors.amount}
/>
```

### Conditional Rendering
```jsx
{isConnected ? (
  <Button variant="primary" onClick={placeBet}>
    Place Bet
  </Button>
) : (
  <Button variant="secondary" onClick={connectWallet}>
    Connect Wallet First
  </Button>
)}
```
