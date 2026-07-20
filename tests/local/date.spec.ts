import { test, expect } from '../../fixtures/index.fixture'

test.describe('Date picker', () => {
  test('Verify selected date range is displayed correctly', async ({ auth, localDashboardPage, localDatePage }) => {
    await auth.loginAsAdminOnLocal()

    const dateRange = {
      startDate: '2003-02-12',
      endDate: '2003-03-13',
    }

    await localDashboardPage.navigateToDatePage()
    await localDatePage.submitDateRange(dateRange.startDate, dateRange.endDate)

    await expect(localDatePage.startDateSpan).toHaveText(dateRange.startDate)
    await expect(localDatePage.endDateSpan).toHaveText(dateRange.endDate)
  })
})
