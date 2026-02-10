const fetch = require('node-fetch');

/* 
 * Newsletter API Route
 * Fetches latest posts from Beehiiv API
 */

const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2';

// Cache to avoid hitting Beehiiv API on every request
let cache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes cache
};

async function fetchLatestNewsletter(req, res) {
  try {
    // Check cache first
    if (cache.data && cache.timestamp && (Date.now() - cache.timestamp < cache.ttl)) {
      console.log('📰 Returning cached newsletter data');
      return res.json(cache.data);
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error('❌ Missing Beehiiv credentials');
      return res.status(500).json({ error: 'Newsletter service not configured' });
    }

    console.log('📰 Fetching latest newsletter from Beehiiv...');

    // Fetch with content expanded
    const response = await fetch(
      `${BEEHIIV_API_URL}/publications/${publicationId}/posts?status=confirmed&limit=1&order_by=publish_date&direction=desc&expand=free_web_content`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Beehiiv API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'Failed to fetch newsletter' });
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return res.json({ 
        hasNewsletter: false,
        message: 'No published newsletters yet' 
      });
    }

    const latestPost = data.data[0];
    
    console.log('📰 Latest post title:', latestPost.title);
    
    // Extract first half of paragraphs from the HTML content
    const allParagraphs = extractAllParagraphs(latestPost.content?.free?.web || '');
    const halfIndex = Math.ceil(allParagraphs.length / 2);
    const contentPreview = allParagraphs.slice(0, halfIndex);

    const result = {
      hasNewsletter: true,
      title: latestPost.title || 'Latest Issue',
      contentPreview: contentPreview,
      totalParagraphs: allParagraphs.length,
      previewParagraphs: contentPreview.length,
      url: latestPost.web_url || `https://cahns-newsletter.beehiiv.com/p/${latestPost.slug}`,
      publishedAt: latestPost.publish_date || latestPost.created,
      thumbnail: latestPost.thumbnail_url || null,
    };

    // Update cache
    cache.data = result;
    cache.timestamp = Date.now();

    console.log('✅ Newsletter fetched successfully:', result.title, `(${contentPreview.length}/${allParagraphs.length} paragraphs)`);
    return res.json(result);

  } catch (error) {
    console.error('❌ Error fetching newsletter:', error);
    return res.status(500).json({ error: 'Failed to fetch newsletter' });
  }
}

// Extract all valid paragraphs from HTML content
function extractAllParagraphs(html) {
  if (!html) return [];
  
  const paragraphs = [];
  
  // Match <p> tags and their content
  const pTagRegex = /<p[^>]*>(.*?)<\/p>/gis;
  let match;
  
  while ((match = pTagRegex.exec(html)) !== null) {
    // Get the inner content
    let text = match[1];
    
    // Remove nested HTML tags but keep the text
    text = text.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    text = decodeHtmlEntities(text).trim();
    
    // Skip empty paragraphs, CSS, or very short content
    if (isValidParagraph(text)) {
      paragraphs.push(text);
    }
  }
  
  return paragraphs;
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}

function isValidParagraph(text) {
  // Skip empty or very short
  if (!text || text.length < 20) return false;
  
  // Skip CSS/code
  if (text.includes('{') || text.includes('}')) return false;
  if (text.includes('background-color') || text.includes('color:')) return false;
  if (text.startsWith('*') || text.startsWith('.')) return false;
  if (text.includes('var(--')) return false;
  
  return true;
}

module.exports = { fetchLatestNewsletter };