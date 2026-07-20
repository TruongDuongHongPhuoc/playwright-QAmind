import { test, expect } from '../../fixtures/index.fixture'
import { LocalDashboardPage } from '../../pages/local_page/L_dashboard_page'
import { DownloadHelper } from '../../utils/helper/downloadHelper'
import { getTestFilePath, readCsvFile } from '../../utils/helper/helper'

test.describe('Playground module', () => {
  test('Verify modal can be opened and closed', async ({ auth, localDashboardPage, localPlayGroundPage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToPlayGroundPage()

    await localPlayGroundPage.openModalButton.click()

    await expect(localPlayGroundPage.modalRoot).toBeVisible()
    await expect(await localPlayGroundPage.getModalParagraph()).toEqual('This modal is available for Playwright open, verify, and close scenarios.')

    await localPlayGroundPage.closeModal()

    await expect(localPlayGroundPage.modalRoot).not.toBeVisible()
  })

  test('Verify toast message appears', async ({ auth, localDashboardPage, localPlayGroundPage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToPlayGroundPage()

    await localPlayGroundPage.openToastButton.click()

    await expect(localPlayGroundPage.toastMessageDiv).toBeVisible()
    await expect(await localPlayGroundPage.toastMessageDiv.textContent()).toContain('Toast message displayed successfully.')
  })

  test('Verify dropdown selection updates result', async ({ auth, localDashboardPage, localPlayGroundPage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToPlayGroundPage()

    await localPlayGroundPage.playgroundDropdown.selectOption(localPlayGroundPage.playgroundDropdownvalues.alpha)
    await expect(await localPlayGroundPage.playgroundDropdownSelectedValueSpan.textContent()).toEqual('Alpha')

    await localPlayGroundPage.playgroundDropdown.selectOption(localPlayGroundPage.playgroundDropdownvalues.beta)
    await expect(await localPlayGroundPage.playgroundDropdownSelectedValueSpan.textContent()).toEqual('Beta')

    await localPlayGroundPage.playgroundDropdown.selectOption(localPlayGroundPage.playgroundDropdownvalues.gamma)
    await expect(await localPlayGroundPage.playgroundDropdownSelectedValueSpan.textContent()).toEqual('Gamma')
  })

  test('Verify uploaded filename is displayed', async ({ auth, localDashboardPage, localPlayGroundPage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToPlayGroundPage()

    const fileName = 'image1.jpg'
    const uploadfilePath = await getTestFilePath(fileName)
    await localPlayGroundPage.sampleUploadInput.setInputFiles(uploadfilePath)

    await expect(localPlayGroundPage.sampleUploadResultSpan).toHaveText(fileName)
  })

  test('Verify CSV file can be downloaded', async ({ auth, localDashboardPage, localPlayGroundPage, page }, testInfo) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToPlayGroundPage()

    const fileName = Date.now() + 'users.csv'
    const downloadedFilePath = await DownloadHelper.download(page, localPlayGroundPage.downloadCSVButton, fileName, testInfo)
    const downloadedFileContent = await readCsvFile(downloadedFilePath)

    await expect(downloadedFileContent).toContain('Chloe Smith')
  })

  test('Verify new tab opens successfully', async ({ auth, localDashboardPage, localPlayGroundPage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToPlayGroundPage()

    const newPage = await localPlayGroundPage.ClickopenNewTab()
    const dashboardPageV2 = new LocalDashboardPage(newPage)

    await expect(dashboardPageV2.currentUserSpan).toContainText('@test.com')
    await expect(dashboardPageV2.currentRoleSpan).toContainText('Admin')
  })
})
