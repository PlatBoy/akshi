# Portfolio Website (Local Hosting)

This is a static portfolio site with modern CSS and JavaScript interactions.

## Run locally

```bash
npm start
```

## Open on your computer

- `http://127.0.0.1:4173`

## Open on your mobile phone (same Wi-Fi)

1. Start the server with `npm start`.
2. In the terminal, copy one of the `http://<your-local-ip>:4173` links printed under:
   - `Open on mobile (same Wi-Fi):`
3. Open that link on your phone browser.

## Import from LinkedIn

Direct LinkedIn account/API import is not enabled in this local app.
Instead, export your LinkedIn data and upload CSV files in the portfolio page:

- `Skills.csv`
- `Positions.csv`

The page will automatically populate skills and experience cards from those files.

## If mobile still does not work

- Ensure phone and computer are on the same Wi-Fi network.
- Allow Node.js through your firewall.
- Try another port:

```bash
PORT=8080 npm start
```

Then use the printed mobile link with port `8080`.

## Validation

```bash
npm run check
```
