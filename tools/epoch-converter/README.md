# Epoch / Unix Timestamp Converter

A clean, self-contained React component that converts between Unix epoch timestamps and human-readable dates — in both directions.

**[→ Live demo on BizTechBridge.com](https://biztechbridge.com/tools/epoch-converter)**

---

## Features

- **Epoch → Date**: paste any Unix timestamp, get ISO 8601, UTC, local time, and more
- **Date → Epoch**: pick a date and time, get the Unix timestamp instantly
- Supports both **seconds** and **milliseconds** precision
- Live clock showing current epoch time
- One-click copy for every output value
- 100% client-side — no network requests

---

## Usage

Copy `EpochConverter.tsx` into your project and render it:

```tsx
import EpochConverter from './EpochConverter';

export default function App() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <EpochConverter />
    </div>
  );
}
```

No props required — the component is fully self-contained.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18+ | Core |
| react-dom | 18+ | Core |

Styling uses **Tailwind CSS v4** utility classes. If you're not using Tailwind, replace the `className` values with your own CSS.

---

## How It Works

- Epoch → Date: parses the input as a number, multiplies by 1000 if seconds precision is selected, constructs a `Date` object, and formats it using built-in `Date` methods and `Intl.DateTimeFormat`
- Date → Epoch: constructs a `Date` from the local date/time inputs and returns `getTime()` in the selected precision
- The live clock uses `setInterval` with a 1-second tick, cleaned up on unmount

---

## License

MIT
