# Spot the Slop

A phone-first workshop game. Players rate how much AI slop is in each graphic, see the tells, and get a score. Results go anonymously to a Google Sheet, and the presenter view shows how the room did.

- **Player link:** `https://<your-username>.github.io/spot-the-slop/`
- **Presenter view:** the same link with `#room` on the end

## Files

| File | What it is |
|---|---|
| `index.html` | The whole game. Graphics, ranges and signals are in the `GRAPHICS` list near the top of the script. |
| `images/` | Put your graphics here. |
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
2. Click **Add file → Upload files** and drag in `index.html`, `README.md`, and the `images` and `google-apps-script` folders. Commit.
3. Go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, then **main** and **/ (root)**. Save.
4. After a minute or two, the site is live at `https://<your-username>.github.io/spot-the-slop/`.

To update later, edit or re-upload files on GitHub. Pages republishes on its own.

## 3. Adding your graphics

Put each image in `images/`, then edit its entry in `GRAPHICS` in `index.html`:

```js
{id:"g01", title:"Event poster", src:"images/g01.jpg", range:[70,80], human:false,
 signals:["First tell","Second tell","Third tell"]},
```

- `id`: a short, unique code. Don't change it once people have played, because results are matched by id.
- `range`: the correct answer range in percent, both ends included.
- `human: true` marks a human-made control. Its signals appear under "Signs it's human-made".
- Any entry without `src` shows a gray placeholder.

## Before the workshop

- Play through once on your phone, then open `#room` and check that your result shows up.
- Clear the test results from the sheet menu.
- Open `#room` on the projector laptop. It refreshes every 5 seconds.

## Privacy

Each result stores a random play ID, a timestamp, the score, and one rating per graphic. No names, emails or device details. Anyone with the web app URL can read the anonymous results and add new ones. The script rejects anything that isn't a well-formed result.
