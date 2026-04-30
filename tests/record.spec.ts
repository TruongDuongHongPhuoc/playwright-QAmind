import { test, expect } from '@playwright/test';


test('test', async ({ page }) => {
  await page.goto(process.env.BASE_URL!);
  await page.getByRole('textbox', { name: 'Email*' }).click();
  await page.getByRole('textbox', { name: 'Email*' }).fill('test@qabrains.com');
  await page.getByRole('textbox', { name: 'Password*' }).click();
  await page.getByRole('textbox', { name: 'Password*' }).fill('Password123');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await expect(page.getByRole('textbox', { name: 'Password*' })).toHaveValue('Password123');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#product-sort')).toContainText('Product');
  await page.getByRole('button', { name: 'test@qabrains.com' }).click();
  await page.locator('html').click();
});
