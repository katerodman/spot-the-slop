# Spot the Slop

A phone-first workshop game. Players rate how much AI slop is in each graphic, see the tells, and get a score. Results go anonymously to a Google Sheet, and the presenter view shows how the room did.

- **Player link:** `https://<your-username>.github.io/spot-the-slop/`
- **Presenter view:** the same link with `#room` on the end

## Files

| File | What it is |
|---|---|
| `index.html` | The whole game. Graphics, answers and notes are in the `GRAPHICS` list near the top of the script. |
| `images-web/` | The copies the game uses: JPEGs at most 1200 px on the longest side, about 4 MB in total. |
| `images/` | Your full-size originals. The game doesn't use these, so they don't need to be uploaded. |
| `google-apps-script/Code.gs` | The script that turns your Google Sheet into the results collector. |

## 1. Set up the Google Sheet (about 5 minutes)

1. Create a new Google Sheet, and name it something like "Spot the Slop results".
2. Go to **Extensions → Apps Script**.
3. Delete what's in `Code.gs` and paste in everything from `google-apps-script/Code.gs`. Save.
4. Click **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
   - Description: `Spot the Slop`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**. Google will ask you to authorize. Choose your account. If you see "Google hasn't verified this app", click **Advanced → Go to (project name)**. It's your own script, so this is expected.
6. Copy the **Web app URL**. It ends in `/exec`.
7. In `index.html`, find this line near the top of the script and paste your URL in:
   ```js
   const SCRIPT_URL = "PASTE_YOUR_WEB_APP_URL_HERE";
   ```

The **Plays** and **Ratings** tabs are created when the first result arrives. Reload the sheet to see a **Spot the Slop → Clear results** menu, and use it to wipe test plays before the workshop.

If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → Version: New version**. This keeps the same URL.

## 2. Put it on GitHub Pages

1. On GitHub, create a new **public** repository called `spot-the-slop`.
2. Click **Add file → Upload files** and drag in `index.html`, `README.md`, and the `images-web` and `google-apps-script` folders. Commit.
3. Go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, then **main** and **/ (root)**. Save.
4. After a minute or two, the site is live at `https://<your-username>.github.io/spot-the-slop/`.

To update later, edit or re-upload files on GitHub. Pages republishes on its own.

## 3. Adding your graphics

Put the original in `images/`, then make a web copy in `images-web/` (on a Mac, run this from the project folder):

```bash
sips -s format jpeg -s formatOptions 88 -Z 1200 images/14.png --out images-web/14.jpg
```

Leave out `-Z 1200` if the image is already smaller than 1200 px, or sips will enlarge it and soften the details. Then add or edit its entry in `GRAPHICS` in `index.html`:

```js
{"id": "g14", "title": "New poster", "src": "images-web/14.jpg", "slop": 70, "range": [60, 80], "human": false,
 "notes": "What gives it away."},
```

- `id`: a short, unique code. Don't change it once people have played, because results are matched by id.
- `slop`: your answer, shown on the reveal and in the presenter view.
- `range`: what counts as correct, both ends included. It's set to `slop` ±10.
- `human: true` marks a human-made control. Its notes appear under "Why it's human-made".
- `notes`: the text revealed after rating.
- Any entry without `src` shows a gray placeholder.

## Before the workshop

- Play through once on your phone, then open `#room` and check that your result shows up.
- Clear the test results from the sheet menu.
- Open `#room` on the projector laptop. It refreshes every 5 seconds.

## Privacy

Each result stores a random play ID, a timestamp, the score, and one rating per graphic. No names, emails or device details. Anyone with the web app URL can read the anonymous results and add new ones. The script rejects anything that isn't a well-formed result.
