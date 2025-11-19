import { test } from '@playwright/test';
import { createLetter } from './letter';

/**
 * This test is flakey when run against SHOW_CAPTCH=true
 * 
 * With captcha enabled you must use the public test keys,
 * see https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
 */ 
test('create a letter', async ({ page }) => { await createLetter(page) });
