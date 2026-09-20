import { test, expect } from '@playwright/test'

test.describe('Dictionary manage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Dismiss').click()
  })

  test('Homepage default dictionary', async ({ page }) => {
    await expect(await page.getByText('CET-4').isVisible()).toBeTruthy()

    await page.getByText('CET-4').hover()
    await expect(await page.getByText('Switch dictionary').isVisible()).toBeTruthy()
  })

  test('Shows English dictionaries only', async ({ page }) => {
    await page.getByText('CET-4').click()
    await page.waitForURL('**/gallery')

    await expect(page.getByRole('button', { name: /CET-4/ }).first()).toBeVisible()
    await expect(page.getByRole('radio', { name: /^Japanese$/ })).toHaveCount(0)
    await expect(page.getByRole('radio', { name: /^Code$/ })).toHaveCount(0)
    await expect(page.getByRole('radio', { name: /^German$/ })).toHaveCount(0)
    await expect(page.getByRole('radio', { name: /^Kazakh$/ })).toHaveCount(0)
    await expect(page.getByRole('radio', { name: /^Indonesian$/ })).toHaveCount(0)
  })

  test('Switch category', async ({ page }) => {
    await page.getByText('CET-4').click()
    await page.waitForURL('**/gallery')

    await expect(await page.getByRole('radio', { name: /^College English$/ }).getAttribute('aria-checked')).toBeTruthy()

    await page.getByRole('radio', { name: /^Postgraduate Exam$/ }).click()
    await expect(await page.getByRole('radio', { name: /^Postgraduate Exam$/ }).getAttribute('aria-checked')).toBeTruthy()
    await expect(await page.getByRole('button', { name: /Postgraduate Exam/g }).first().isVisible()).toBeTruthy()

    await page.getByRole('radio', { name: /^GRE$/ }).click()
    await expect(await page.getByRole('radio', { name: /^GRE$/ }).getAttribute('aria-checked')).toBeTruthy()
    await expect(await page.getByRole('button', { name: /GRE/g }).first().isVisible()).toBeTruthy()
  })

  test('Switch dictionary', async ({ page }) => {
    await page.getByText('CET-4').click()
    await page.waitForURL('**/gallery')

    await page
      .getByRole('button', { name: /CET-6 Smart Memory/g })
      .first()
      .click()
    await page.getByRole('heading', { name: 'Chapter 2' }).click()

    await page.waitForURL('**/')
    await expect(await page.getByRole('button', { name: 'Chapter 2' }).first().isVisible()).toBeTruthy()
  })

  test('Close dictionary settings', async ({ page }) => {
    await page.getByText('CET-4').click()
    await page.waitForURL('**/gallery')
    await page.getByRole('button', { name: 'Close dictionary gallery' }).click()

    await page.waitForURL('**/')
    await expect(await page.getByText('Start').first().isVisible()).toBeTruthy()
  })

  test('Switch dictionary chapter', async ({ page }) => {
    await page.getByText('Chapter 1').first().hover()
    await expect(await page.getByText('Switch chapter').isVisible()).toBeTruthy()

    await page.getByText('Chapter 1').click()
    await page.getByRole('option', { name: 'Chapter 2' }).click()

    await page.getByText('Chapter 2').first().hover()
    await expect(await page.getByText('Switch chapter').isVisible()).toBeTruthy()
  })
})
