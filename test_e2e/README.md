# end to end tests 

Launching end to end tests against a local development server:
```
npx playwright test
```

Launching end to end tests against a deploy preview:
```
BASE_URL=https://deploy-preview-36--herdonthehill.netlify.app/ npx playwright test
```

Running a single end to end test with a specific browser engine:
```
npx playwright test letter.spec.ts --project chromium
```

Chromium seems to be the most stable. Other engines seem to be flaky on waiting for the dtaft submit button to become enabled. To further reduce flakiness, set `SHOW_CAPTCHA` and `USE_CAPTCHA` to `false`. Dynamic loading of the captcha box sometimes consuses the locator. 

## Load Tests

I was hoping to use a "preview server" but unlike the "deploy previews" that get built for pull requests, the preview server on netlify is password protected, so the playwright tests can't touch it.

1. create a pull request and wait for the preview to build and run
2. run `letter.spec.ts` against the deploy server to make sure it will pass
3. execute the artillery run:

```
BASE_URL=https://previewhost.netlify.app npx artillery run test_e2e/load_test.ts
```

[artillery metrics](https://www.artillery.io/docs/reference/engines/playwright#metrics-reported-by-the-engine):
- CLS: Cumulative Layout Shift, shift score
- FCP: First Contentful Paint, milliseconds
- FID: First Input Delay, milliseconds
- INP: Interaction to Next Paint, milliseconds
- LCP: Largest Contentful Paint, milliseconds
- TTFB: time to firt byte, milliseconds
- vusers.completed - successful run
- vusers.failed - test failed at some point
- vusers.session_length, milliseconds
