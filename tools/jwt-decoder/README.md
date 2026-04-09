# JWT Decoder

A clean, self-contained React component that decodes JSON Web Tokens (JWTs) client-side — splits the header, payload, and signature, base64url-decodes each part, and displays the claims in formatted JSON.

**[→ Live demo on BizTechBridge.com](https://biztechbridge.com/tools/jwt-decoder)**

---

## Features

- Decodes header, payload, and raw signature separately
- Highlights `exp`, `iat`, `nbf` claims with human-readable timestamps
- Shows expired/valid status badge based on current time
- One-click copy for header and payload JSON
- Input size limit (10,000 chars) enforced client-side
- 100% client-side — the token never leaves your browser

---

## Usage

Copy `JwtDecoder.tsx` into your project and render it:

```tsx
import JwtDecoder from './JwtDecoder';

export default function App() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <JwtDecoder />
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

Styling uses **Tailwind CSS v4** utility classes. Replace `className` values with your own CSS if not using Tailwind.

---

## How It Works

- Splits the token on `.` to get 3 parts: header, payload, signature
- Base64url-decodes header and payload (handles padding, `+`/`-` and `/`/`_` swapping)
- Parses decoded strings as JSON
- Checks `exp` claim against `Date.now()` for expired/valid status
- The signature is displayed raw — verification requires the secret/public key which is never available client-side

---

## Security Notes

- This component **decodes only** — it does not verify the signature
- Never use client-side JWT decoding as a security check — always verify server-side
- The token is processed entirely in memory and never sent over the network

---

## License

MIT
