# Maadi Nile Storefront

A responsive Arabic (RTL) demo storefront for Maadi Nile, serving Sudanese shops in Cairo. This first version is a static website: customers browse sample products, build a cart, and send an order request through WhatsApp.

## Features

- Arabic RTL layout with responsive mobile and desktop styles.
- Product categories and client-side search.
- Demo catalog with clearly illustrative names and EGP prices.
- Cart with quantity controls, removal, and optional local browser persistence.
- Checkout message composed in Arabic and sent to WhatsApp.
- Bankak listed as a manual payment option. No bank account details or payment confirmation are fabricated.
- Custom SVG brand mark; no build tools or server are required.

## Preview locally

Open `index.html` in a browser. For local testing with a simple server, run `python3 -m http.server 8000` in the project directory and visit `http://localhost:8000`.

## Publish with GitHub Pages

1. Merge this branch into the repository's default branch.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select the default branch and `/ (root)`, then save.
4. GitHub Pages will provide the published URL after deployment.

## Before taking real orders

- Replace the sample product names, prices, descriptions, and approved photos with verified products and current prices.
- Confirm `201050422690` is the correct WhatsApp number in international format.
- Confirm stock, minimum quantities, delivery coverage, delivery fees, and wholesale pricing.
- Share Bankak account details only after confirming the recipient; the site intentionally contains no invented financial details.

Orders are only requests for confirmation. This website does not process payments, verify transfers, reserve inventory, or calculate delivery charges.
