# biztechbridge-tools

Open-source React components powering [BizTechBridge.com](https://biztechbridge.com) — a suite of free developer tools built for speed, privacy, and ease of use.

All tools run **100% client-side**. No data ever leaves your browser.

---

## Tools

| Tool | Live Demo | Source |
|------|-----------|--------|
| Epoch / Unix Timestamp Converter | [Try it →](https://biztechbridge.com/tools/epoch-converter) | [tools/epoch-converter](tools/epoch-converter/) |
| JSON Formatter & Validator | [Try it →](https://biztechbridge.com/tools/json-formatter) | Coming soon |
| JWT Decoder | [Try it →](https://biztechbridge.com/tools/jwt-decoder) | Coming soon |
| QR Code Generator | [Try it →](https://biztechbridge.com/tools/qr-code-generator) | Coming soon |
| Base64 Encoder / Decoder | [Try it →](https://biztechbridge.com/tools/base64) | Coming soon |
| Password Generator | [Try it →](https://biztechbridge.com/tools/password-generator) | Coming soon |
| GUID Generator | [Try it →](https://biztechbridge.com/tools/guid-generator) | Coming soon |
| Regex Tester | [Try it →](https://biztechbridge.com/tools/regex-tester) | Coming soon |
| Diff Checker | [Try it →](https://biztechbridge.com/tools/diff-checker) | Coming soon |
| Barcode Generator | [Try it →](https://biztechbridge.com/tools/barcode-generator) | Coming soon |

---

## Using the Components

These components are **standalone React** — no Astro, no framework lock-in. Each tool folder contains:

- The React component (`.tsx`)
- A `README.md` with props, usage notes, and a live demo link

**Dependencies per component are listed in each tool's README.** Most tools only require React.

To embed a tool in your own project, copy the component file and install any listed dependencies.

---

## Stack

- React 18+
- TypeScript
- Tailwind CSS v4 (utility classes used for styling — swap for your own CSS if preferred)

---

## License

MIT — free to use, fork, and embed. Attribution appreciated but not required.

---

## Contributing

Issues and PRs welcome. If you find a bug in a live tool or want to suggest a new one, open an issue.
