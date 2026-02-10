# Beehiiv Newsletter Integration Setup

## Step 1: Add to your `.env` file

```
BEEHIIV_API_KEY=your_api_key_here
BEEHIIV_PUBLICATION_ID=pub_3ef78e9e-5c0e-49ea-bb97-f9e313b0fdad
```

## Step 2: Add this to your `server.js`

Add this line near the top with your other requires:
```javascript
const newsletterRoutes = require('./routes/newsletterRoutes');
```

Add this line after your other route definitions (after the `app.use(express.json())` line):
```javascript
// Newsletter API
app.use('/api/newsletter', newsletterRoutes);
```

## Step 3: Copy the new files to your backend folder

- `backend/controllers/newsletterController.js`
- `backend/routes/newsletterRoutes.js`

## Step 4: Test the endpoint

After restarting your server, test it by visiting:
```
http://localhost:3001/api/newsletter/latest
```

You should see JSON like:
```json
{
  "hasNewsletter": true,
  "title": "The Tools That Actually Ship",
  "snippet": "Why most AI tools fail creative teams...",
  "url": "https://cahns-newsletter.beehiiv.com/p/tools-that-ship",
  "publishedAt": "2026-01-28T10:00:00Z",
  "highlights": [
    "Why most AI tools fail creative teams",
    "Our Sora workflow, documented",
    "3 prompts that changed our output"
  ]
}
```

## API Response Format

| Field | Type | Description |
|-------|------|-------------|
| hasNewsletter | boolean | Whether a newsletter exists |
| title | string | Newsletter title |
| snippet | string | Short preview text |
| url | string | Link to full newsletter |
| publishedAt | string | ISO date string |
| thumbnail | string | Image URL (if available) |
| highlights | array | Up to 3 key points from the content |

## Caching

The endpoint caches results for 5 minutes to avoid hitting Beehiiv's API on every page load.
To adjust, change the `ttl` value in `newsletterController.js`.
