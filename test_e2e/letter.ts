import { test, expect, type Page } from '@playwright/test';

export async function createLetter (page: Page) : Promise<void> {
    await page.goto('/letter');

    // enter an incomplete address
    await page.locator('input[name="name"]').fill('John Doe');
    await page.locator('input[name="street"]').fill('100 Landsdowne');
    await page.locator('input[name="city"]').fill('Cambridge');
    await page.locator('input[name="state"]').fill('MA');
    await page.locator('input[name="zipcode"]').fill('02139');
    await page.locator('input[name="email"]').fill('foo@bar.baz');

    await expect(page.getByTestId('address-submit')).toBeEnabled();
    await page.getByTestId('address-submit').click();

    // see USPS error
    await expect(page.locator('#usps-error')).toBeVisible({ timeout: 10_000 });

    // correct the address, expecting pre-filled form for other fields
    await page.locator('input[name="line2"]').fill('Apartment 1211');
    await page.getByTestId('address-submit').click();

    // be sent to Draft.tsx
    await expect(page.locator('#message')).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveTitle(/Write your letter/);
    // with cannonicalized address
    const returnAddress = page.locator("#return-address");
    await expect(returnAddress).toContainText(/John Doe/);
    await expect(returnAddress).toContainText(/100 LANDSDOWNE ST/);
    await expect(returnAddress).toContainText(/APT 1211/);
    await expect(returnAddress).toContainText(/CAMBRIDGE/);
    await expect(returnAddress).toContainText(/MA/);
    await expect(returnAddress).toContainText(/02139-4227/);

    var messageText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '; // 57 characters

    await page.locator('#message').fill(messageText);
    await expect(page.getByTestId('draft-submit')).toBeDisabled(); // too short

    const catpcha = page.locator('#captcha');
    if (await catpcha.isVisible()) {
        await catpcha.click();
        await expect(page.getByTestId('draft-submit')).toBeDisabled(); // still too short
    }
    
    await page.locator('#message').fill(messageText + messageText); // 114
    await expect(page.getByTestId('draft-submit')).toBeEnabled();

    await page.getByTestId('draft-submit').click();

    // be sent to Receipt.astro
    await expect(page.getByTestId('letter-list')).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveTitle(/Thank you for your letter/);

    // look for letter links
    const letters = page.getByRole('link').filter({ hasText: 'your letter to Senator'});
    const count = await letters.count();
    expect(count > 0 && count < 3);
    for (const letter of await letters.all()) {
       console.log(await letter.getAttribute('href'));
    }
}
