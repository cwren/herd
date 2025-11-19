import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/letter');
    await expect(page).toHaveTitle(/Send a Letter/);
});

test('button starts disabled', async ({ page }) => {
    await page.goto('/letter');
    const button = page.locator('#submit');
    await expect(button).toBeDisabled();
});

test('button becomes enabled with valid input', async ({ page }) => {
    await page.goto('/letter');

    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="street"]').fill('123 Main Street');
    await page.locator('input[name="line2"]').fill('Apartment 1');
    await page.locator('input[name="city"]').fill('Springfield');
    await page.locator('input[name="state"]').fill('MA');
    await page.locator('input[name="zipcode"]').fill('01101');
    await page.locator('input[name="email"]').fill('foo@bar.baz');

    // flaky on chromium and mobile safari, why?
    await expect(page.locator('#submit')).toBeEnabled();
});

test('button remains disabled with invalid input', async ({ page }) => {
    await page.goto('/letter');

    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="street"]').fill('123 Main Street');
    await page.locator('input[name="city"]').fill('Springfield');
    await page.locator('input[name="state"]').fill('Mashichsetts');
    await page.locator('input[name="zipcode"]').fill('0202');
    await page.locator('input[name="email"]').fill('foo at bar.baz');

    await expect(page.locator('#submit')).toBeDisabled();
});