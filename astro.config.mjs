// @ts-check
import { defineConfig, envField } from 'astro/config';

import compressor from "astro-compressor";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import robotsTxt from 'astro-robots-txt';
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://www.herdonthehill.com/",
  integrations: [
    react(),
    sitemap(),
    robotsTxt({
      sitemap: [
        'https://herdonthehill.com/sitemap-index.xml',
      ],
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: '/letter',
          crawlDelay: 10,
        },
      ],
      }),
    compressor()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [
        'devserver-main--herdonthehill.netlify.app', 
      ],
    },
  },
  
  prefetch: {
    defaultStrategy: 'viewport',
  },

  compressHTML: true,

  env: {
    schema: {
      STAGING: envField.boolean({ context: "server", access:"public", default: false }),
      DARKLAUNCH: envField.boolean({ context: "server", access:"public", default: false }),
      FIVECALLS_API: envField.string({ context: "server", access:"secret" }),
      SERVICE_KEY: envField.string({ context: "server", access:"secret" }),
      DRIVE_ID: envField.string({ context: "server", access:"secret" }),
      // random, generate with `openssl rand -hex N`, or use any string for dev
      ENVELOPE_KEY: envField.string({ context: "server", access:"secret" }),
      USE_CAPTCHA: envField.boolean({ context: "server", access:"public", default: true }),
      SHOW_CAPTCHA: envField.boolean({ context: "client", access:"public", default: true }),
      RECAPTCHA_SITE_KEY: envField.string({ context: "client", access:"public" }),
      RECAPTCHA_SECRET_KEY: envField.string({ context: "server", access:"secret" }),
      GTAG: envField.string({ context: "client", access:"public" }),
      USPS_KEY: envField.string({ context: "server", access:"secret" }),
      USPS_SECRET: envField.string({ context: "server", access:"secret" }),
      MAPS_KEY: envField.string({ context: "server", access:"secret" }),
      VALIDATORS: envField.string({ context: "server", access:"public", default: "usps maps" }),
    }
  },

  adapter: netlify(),
});