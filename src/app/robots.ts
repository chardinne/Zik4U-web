import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zik4u.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Default: allow all, block private/API routes
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/subscribe/',
          '/partner/dashboard',
          '/partner/cancel',
          '/partner/success',
        ],
      },
      {
        // OpenAI web crawler — allow indexing for ChatGPT citations
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/partner/dashboard', '/partner/cancel', '/partner/success'],
      },
      {
        // ChatGPT browsing plugin
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/partner/dashboard', '/partner/cancel', '/partner/success'],
      },
      {
        // Google Gemini / AI Overviews
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/partner/dashboard', '/partner/cancel', '/partner/success'],
      },
      {
        // Perplexity AI
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/partner/dashboard', '/partner/cancel', '/partner/success'],
      },
      {
        // Anthropic Claude
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/partner/dashboard', '/partner/cancel', '/partner/success'],
      },
      {
        // Anthropic Claude (alternate)
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/partner/dashboard', '/partner/cancel', '/partner/success'],
      },
      {
        // Amazon Alexa / Bedrock
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/api/', '/partner/dashboard', '/partner/cancel', '/partner/success'],
      },
      {
        // Webz.io — used by some AI training pipelines
        userAgent: 'Omgilibot',
        disallow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
