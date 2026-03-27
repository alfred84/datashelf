import { test, expect } from '@playwright/test';

const uniqueEmail = () => `test-${Date.now()}@example.com`;
const testPassword = 'SecurePass123';

test.describe('Authentication', () => {
  test('should register a new user and redirect to files', async ({ page }) => {
    const email = uniqueEmail();
    await page.goto('/register');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/files');
    await expect(page.locator('h1')).toContainText('My Files');
  });

  test('should login with existing user', async ({ page }) => {
    const email = uniqueEmail();

    await page.goto('/register');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/files');

    await page.evaluate(() => {
      localStorage.removeItem('datashelf_token');
      localStorage.removeItem('datashelf_email');
    });
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/files');
    await expect(page.locator('h1')).toContainText('My Files');
  });

  test('should show error for invalid login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('.bg-red-50')).toBeVisible();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/files');
    await page.waitForURL('**/login');
  });
});

test.describe('File Management', () => {
  test.beforeEach(async ({ page }) => {
    const email = uniqueEmail();
    await page.goto('/register');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/files');
  });

  test('should show empty state when no files uploaded', async ({ page }) => {
    await expect(page.locator('text=No files yet')).toBeVisible();
  });
});
