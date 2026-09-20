import { test, expect, Page } from '@playwright/test'

test.describe('Practice List', () => {
  test.beforeEach(async ({ page }) => {
    test.slow()
    await page.goto('/')
    await page.getByLabel('Dismiss').click()
    await page.waitForTimeout(1000)

    // should use testId
    await page.locator('#root > div').locator('.fixed').locator('svg').last().click()
    await page.waitForTimeout(1000)
  })

  test('Practice list button click to open the list ', async ({ page }) => {
    await expect(await page.getByRole('heading', { name: 'CET-4 Chapter 1' }).isVisible()).toBeTruthy()
    // should use testId
    await page.locator('#headlessui-portal-root').locator('div > p', { hasText: 'cancel' }).click()
  })

  test('Close practice list', async ({ page }) => {
    await page.getByRole('heading', { name: 'CET-4 Chapter 1' }).getByRole('img').click()
    await page.waitForTimeout(1000)
    await expect(await page.locator('h3', { hasText: 'CET-4 Chapter 1' }).isVisible()).not.toBeTruthy()
  })
})
