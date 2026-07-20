import { test, expect } from '../../fixtures/index.fixture'

test.describe('Table module', () => {
  test('Verify table filter works correctly', async ({ auth, localDashboardPage, localTablePage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToTablePage()

    await localTablePage.statusFilterDropdown.selectOption(localTablePage.statusFilterValues.active)

    const activeRows = await localTablePage.getRowInstances()
    for (const row of activeRows) {
      await expect(row.status).toHaveText('Active')
    }

    await localTablePage.statusFilterDropdown.selectOption(localTablePage.statusFilterValues.inactive)

    const inactiveRows = await localTablePage.getRowInstances()
    for (const row of inactiveRows) {
      await expect(row.status).toHaveText('Inactive')
    }

    await localTablePage.statusFilterDropdown.selectOption(localTablePage.statusFilterValues.pending)

    const pendingRows = await localTablePage.getRowInstances()
    for (const row of pendingRows) {
      await expect(row.status).toHaveText('Pending')
    }
  })

  test('Verify table filter by searched name correctly', async ({ auth, localDashboardPage, localTablePage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToTablePage()

    let searchedValue = 'i'
    await localTablePage.searchField.fill(searchedValue)

    let searchedInstance = await localTablePage.getRowInstances()
    for (const row of searchedInstance) {
      await expect(row.name).toContainText(searchedValue)
    }

    await localTablePage.paginate.nextButton.click()

    searchedInstance = await localTablePage.getRowInstances()
    for (const row of searchedInstance) {
      await expect(row.name).toContainText(searchedValue)
    }

    searchedValue = 'A'
    await localTablePage.searchField.fill(searchedValue)

    searchedInstance = await localTablePage.getRowInstances()
    for (const row of searchedInstance) {
      const rowName = (await row.name.textContent())?.toLowerCase() ?? ''

      expect(rowName).toContain(searchedValue.toLowerCase())
    }

    await localTablePage.searchField.clear()

    const firstRow = (await localTablePage.getRowInstances()).at(0)

    await localTablePage.searchField.fill(await firstRow?.getNameText() ?? '')

    searchedInstance = await localTablePage.getRowInstances()
    await expect(searchedInstance).toHaveLength(1)
  })

  test('Verify table order by name correctly', async ({ auth, localDashboardPage, localTablePage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToTablePage()

    await localTablePage.nameSortDropdown.selectOption(localTablePage.nameSortValues.accending)

    let originalList: string[] = await localTablePage.getNames()
    let sortedList: string[] = [...originalList].sort((a, b) => a.localeCompare(b))

    await expect(originalList).toEqual(sortedList)

    await localTablePage.nameSortDropdown.selectOption(localTablePage.nameSortValues.descending)
    originalList = await localTablePage.getNames()

    sortedList = [...originalList].sort((b, a) => a.localeCompare(b))
    await expect(originalList).toEqual(sortedList)
  })

  test('Verify sort by date correctly', async ({ auth, localDashboardPage, localTablePage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToTablePage()

    await localTablePage.dateSortDropdown.selectOption(localTablePage.dateSortValues.accending)
    let dateTextList: string[] = await localTablePage.getDates()

    let originalList = dateTextList.map(d => new Date(d).getTime())
    let sortedList = [...originalList].sort((a, b) => a - b)

    await expect(originalList).toEqual(sortedList)

    await localTablePage.dateSortDropdown.selectOption(localTablePage.dateSortValues.descending)
    dateTextList = await localTablePage.getDates()

    originalList = dateTextList.map(d => new Date(d).getTime())
    sortedList = [...originalList].sort((a, b) => a - b).reverse()

    await expect(originalList).toEqual(sortedList)
  })

  test('Verify that pagination work correctly', async ({ auth, localDashboardPage, localTablePage }) => {
    await auth.loginAsAdminOnLocal()
    await localDashboardPage.navigateToTablePage()

    const IDsPage1: string[] = await localTablePage.getIds()

    await localTablePage.paginate.nextButton.click()
    const IDsPage2: string[] = await localTablePage.getIds()

    await expect(IDsPage1).not.toEqual(IDsPage2)

    await localTablePage.paginate.previousButton.click()
    const IDsPage1v1: string[] = await localTablePage.getIds()

    await expect(IDsPage1v1).toEqual(IDsPage1)
  })
})
