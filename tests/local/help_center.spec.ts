import { test, expect } from '../../fixtures/index.fixture'

test.describe('Help center', () => {
  test('Verify user can interact with help content', async ({ auth, localDashboardPage, localHelpCenterPage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToHelpCenterPage()

    await localHelpCenterPage.searchInput.fill('abcc123')
    await localHelpCenterPage.contactButton.click()

    const expectedText = await localHelpCenterPage.contactSuccessText.textContent()

    await expect(expectedText).toContain('Contact request submitted successfully.')
  })
})
