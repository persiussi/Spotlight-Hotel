# Spotlight Hotel — Nawalgarh

A responsive, static hotel concept website created for **Spotlight Hotel**, near Basotia Gardens, Laxmangarh–Nawalgarh Road, Nawalgarh, Rajasthan 333042.

## Quick start

Open `index.html` in a web browser, or serve locally:

```bash
cd website
python3 -m http.server 8080
# Visit http://localhost:8080
```

No backend, Node.js, framework or build step is needed. Google Fonts, Maps and public-listing photographs require an internet connection.

## Files

- `index.html` — full semantic website
- `style.css` — responsive visual design (midnight navy / electric gold)
- `script.js` — mobile navigation, image fallback, gallery filters, lightbox, enquiry text builder
- `assets/images/` — custom favicon, illustrated hotel / room fallbacks and original film poster
- `assets/videos/spotlight-concept.mp4` — original **12-second illustrative concept video**, not actual hotel footage
- `create_concept_video.py` — editable video generator (requires Python, Pillow and ffmpeg)
- `MEDIA_SOURCES.md` — photo source URLs, attributions, permissions and verified details

## Important notes

- The gallery references six photographs hosted by Justdial for Spotlight Hotel. Files are **not downloaded or redistributed** in this ZIP. Justdial's media server may block hotlinking; clearly identified illustrative Unsplash photos are tried first and local original illustrations appear when all remote photos fail. Always get the photo owners' / hotel's written permission and approved media before publishing commercially.
- The video is original illustrative motion graphics, *not actual footage of the property*.
- No real-time reservation or online payment is implemented. The form prepares a message for a guest to copy or open in their email application; it does not send it to the hotel or save their details.
- Confirm room categories, availability, facilities, pricing and business contact details with the hotel before publishing. No example room prices are claimed.
- For a reliable commercial site, replace the external image URLs with permitted local files and connect enquiries to a verified hotel email/booking solution.

## Verified publicly listed details (as of November 2026)

- Spotlight Hotel
- Ward No. 1, Laxmangarh–Nawalgarh Road, near Basotia Gardens, Nawalgarh 333042, Rajasthan
- Phone: +91 91165 18613
- Maps: https://www.google.com/maps/search/?api=1&query=27.8481056%2C75.2469818

## Notes on local video regeneration

```bash
python3 -m pip install pillow
python3 create_concept_video.py
```

The script requires `ffmpeg` on your PATH. Video generation creates a temporary `assets/video-frames` directory; it isn't needed for deploying the website.
