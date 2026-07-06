import helper from 'csvtojson'
import { CustomSession } from '../../components/custom_session'
import { LocalRoutes } from '../../constant/routes'
import { test, expect } from '../../fixtures/index.fixture'
import { LocalApprovalPage } from '../../pages/local_page/L_approval_page'
import { LocalCourseListPage } from '../../pages/local_page/L_courselist_page'
import { LocalDatePage } from '../../pages/local_page/L_date_page'
import { LocalTablePage, LocalTableRowInstance } from '../../pages/local_page/L_table_page'
import { DownloadHepler } from '../../utils/helper/downloadHepler'
import { getTestFilePath, readCsvFile } from '../../utils/helper/helper'
import { LocalDashboardPage } from '../../pages/local_page/L_dashboard_page'

test.describe('Course module', ()=>{
    test('Verify Author can create course, Admin can update and approve course, User can view approved course',async({browser})=>{
        // Login as Admin in a tab
        const adminTab = await CustomSession.create(browser)

        const adminEmail = adminTab.localLoginPage.userList.adminEmail
        const adminPass = adminTab.localLoginPage.userList.adminPass
        
        await adminTab.localLoginPage.login(adminEmail,adminPass)
        await adminTab.localLoginPage.waitForLogin()

        const authorTab = await CustomSession.create(browser)
        const authorEmail = authorTab.localLoginPage.userList.authorEmail
        const authorPass = authorTab.localLoginPage.userList.authorPass
        
        await authorTab.localLoginPage.login(authorEmail,authorPass)
        await authorTab.localLoginPage.waitForLogin()

        const readerTab = await CustomSession.create(browser)
        
        const readerEmail = readerTab.localLoginPage.userList.userEmail
        const readerPass = readerTab.localLoginPage.userList.userPass
        
        await readerTab.localLoginPage.login(readerEmail,readerPass)
        await readerTab.localLoginPage.waitForLogin()
        
        // Navigate Create Course
        await authorTab.dashboardPage.navigateToCreateCoursePage()

        // Create course "Playwright Masterclass"
        const courseTitle = "Playwright Masterclass"
        const courseDescription = "Description of the playwright masterclass"

        await authorTab.createCoursePage.courseForm.fill(courseTitle,courseDescription)
        await authorTab.createCoursePage.courseForm.submitButton.click()

        //Verify course created
        await expect(authorTab.page).toHaveURL(LocalRoutes.listCoursePage)
        await expect(authorTab.listCoursePage.flash).toHaveText(authorTab.listCoursePage.flashNotification.courseCreateSuccess)
        
        const authorTabCourseInstance = await authorTab.listCoursePage.getCourseRowBy(courseTitle,courseDescription)
        await expect(authorTabCourseInstance.root).toBeVisible()

        // Admin Open Course List
        await adminTab.dashboardPage.navigateToCoursePage()
        
        // Edit course description
        const adminTabCourseInstance = await adminTab.listCoursePage.getCourseRowBy(courseTitle,courseDescription)
        await adminTabCourseInstance.editButton.click()

        const courseDescriptionEdited = "abc123"
        await adminTab.editCoursePage.courseForm.descriptionInput.fill(courseDescriptionEdited)
        await adminTab.editCoursePage.courseForm.submitButton.click()

        //Verify course is edited
        await authorTab.page.reload()
        const authorTabCourseInstanceEdited = await authorTab.listCoursePage.getCourseRowBy(courseTitle,courseDescriptionEdited)
        await expect(authorTabCourseInstanceEdited.root).toBeVisible()
        
        // Open Approvals page
        await adminTab.listCoursePage.headerComponent.brandLink.click()
        await adminTab.page.waitForURL(LocalRoutes.dashboardPage)

        await adminTab.dashboardPage.navigateToCourseApprovalPage()
        await adminTab.page.waitForURL(LocalRoutes.approvalPage)

        // Click Approve
        await authorTab.page.reload()
        const pendingApprovalCourse = await adminTab.approvalPage.getPendingApprovalCourseBy(courseTitle, courseDescriptionEdited)
        await pendingApprovalCourse.approveButton.click()

        // User Open Course List
        await readerTab.dashboardPage.navigateToCoursePage()

        // Verify updated description
        const readerTabCourseInstanceEdited = await readerTab.listCoursePage.getCourseRowBy(courseTitle,courseDescriptionEdited)
        await expect(readerTabCourseInstanceEdited.root).toBeVisible() 
        await expect(readerTabCourseInstanceEdited.status).toHaveText('Approved')

        await authorTab.close()
        await adminTab.close()
        await readerTab.close()
    })

    test("Verify Admin can reject Author course request",async ({auth,localDashboardPage,localCreateCoursePage,page, localApprovalPage,localCourseListPage})=>{
        // Login as Author
        await auth.loginAsAuthorOnLocal()

        // Create course "Rejected Course"
        const course = {
            title: "Rejected Course"+Date.now(),
            description: "This course will be rejected"
        }

        await localDashboardPage.navigateToCreateCoursePage()
        await localCreateCoursePage.courseForm.fill(course.title,course.description)
        await localCreateCoursePage.courseForm.submitButton.click()

        // Logout
        await localCreateCoursePage.headerComponent.logout()
        await expect(page).toHaveURL(LocalRoutes.loginPage)

        // Login as Admin
        await auth.loginAsAdminOnLocal()
        
        // Open Approvals page
        await localDashboardPage.navigateToCourseApprovalPage()

        // Click Reject
        const pendingCourse = await localApprovalPage.getPendingApprovalCourseBy(course.title,course.description)
        await pendingCourse.rejectButton.click()

        //verify course rejected remove from approval page
        await expect(pendingCourse.rootLocator).not.toBeVisible()

        // Open Course List
        await localApprovalPage.headerComponent.brandLink.click()
        await page.waitForURL(LocalRoutes.dashboardPage)
        await localDashboardPage.navigateToCoursePage()

        const rejectedCourse = await localCourseListPage.getCourseRowBy(course.title,course.description)
        await expect(rejectedCourse.root).toBeVisible()
        await expect(rejectedCourse.status).toHaveText("Rejected")

        // Logout
        await localCourseListPage.headerComponent.logout()
        await expect(page).toHaveURL(LocalRoutes.loginPage)

        //veify reader cannot view the rejected course
        await auth.loginAsUserOnLocal()
        await localDashboardPage.navigateToCoursePage()
        await expect(rejectedCourse.root).not.toBeVisible()
    
    })

    test("Verify Admin can delete course", async({apisession, localLoginPage,auth, localDashboardPage, localCourseListPage, page})=>{
        //precondition
        const course = {
            title: "Playwright Test"+Date.now(),
            description:"abc123"
        }

        await apisession.authAPI.login(localLoginPage.userList.adminEmail,localLoginPage.userList.adminPass)
        const response = await apisession.courseAPI.createCourse(course.title,course.description)
        await expect(response.status()).toBe(201)

        await auth.loginAsAdminOnLocal()
        await localDashboardPage.navigateToCoursePage()
        
        const removeCourse = await localCourseListPage.getCourseRowBy(course.title,course.description)
        await expect(removeCourse.deleteButton).toBeVisible();
        await expect(removeCourse.deleteButton).toBeEnabled();

        // const dialogPromise = page.waitForEvent('dialog');
        // await localCourseListPage.confirmDeleteCourse()
        const dialogPromise =
            page.waitForEvent("dialog");

        const clickPromise =
            removeCourse.deleteButton.click();

        const dialog =
            await dialogPromise;

        await dialog.accept();

        await clickPromise;

        await expect(removeCourse.root).toHaveCount(0)
    })

    test('Verify selected date range is displayed correctly',async ({auth, localDashboardPage, localDatePage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()
        const dateRange = {
            startDate: "2003-02-12",
            endDate: "2003-03-13"
        }

        // 1. Open Date Picker page
        await localDashboardPage.navigateToDatePage()
        
        // 2. Select Start Date
        await localDatePage.submitDateRange(dateRange.startDate,dateRange.endDate)

        // Verify start date, end date
        await expect(localDatePage.startDateSpan).toHaveText(dateRange.startDate)
        await expect(localDatePage.endDateSpan).toHaveText(dateRange.endDate)

    })

    test('Verify table filter works correctly',async ({auth, localDashboardPage, localTablePage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //1. Open Table Demo page
        await localDashboardPage.navigateToTablePage()

        // 2. Select Status = Active
        await localTablePage.statusFilterDropdown.selectOption(localTablePage.statusFilterValues.active)

        // Verify table sort by Active status only
        const activeRows = await localTablePage.getRowInstances()
        for (const row of activeRows) {
            await expect(row.status).toHaveText("Active");
        }

        // 3. Select Status = Inactive
        await localTablePage.statusFilterDropdown.selectOption(localTablePage.statusFilterValues.inactive)
        
        //Verify table sort by Inactive status only
        const inactiveRows = await localTablePage.getRowInstances()
        for (const row of inactiveRows) {
            await expect(row.status).toHaveText("Inactive");
        }

        // 4. Select Status = Pending
        await localTablePage.statusFilterDropdown.selectOption(localTablePage.statusFilterValues.pending)

        //Verify table sort by pending status only
        const pendingRows = await localTablePage.getRowInstances()
        for (const row of pendingRows) {
            await expect(row.status).toHaveText("Pending");
        }
    })

    test('Verify table filter by searched name correctly',async ({auth, localDashboardPage, localTablePage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //1. Open Table Demo page
        await localDashboardPage.navigateToTablePage()

        // 2. Select Status = Active
        let searchedValue = 'i'
        await localTablePage.searchField.fill(searchedValue)

        // Verify table sort by Active status only
        let searchedInstance = await localTablePage.getRowInstances()
        for (const row of searchedInstance) {
            await expect(row.name).toContainText(searchedValue);
        }

        await localTablePage.paginate.nextButton.click()

        searchedInstance = await localTablePage.getRowInstances()
        for (const row of searchedInstance) {
            await expect(row.name).toContainText(searchedValue);
        }

        searchedValue = 'A'
        await localTablePage.searchField.fill(searchedValue)

        searchedInstance = await localTablePage.getRowInstances()
        for (const row of searchedInstance) {
            const rowName = (await row.name.textContent())?.toLowerCase() ?? "";

            expect(rowName).toContain(searchedValue.toLowerCase());
        }

        await localTablePage.searchField.clear()

        const firstRow = (await localTablePage.getRowInstances()).at(0)

        await localTablePage.searchField.fill( await firstRow?.getNameText() ?? '')
        
        searchedInstance = await localTablePage.getRowInstances()
        await expect(searchedInstance).toHaveLength(1)
    })

    test("Verify table order by name correctly",async ({auth, localDashboardPage, localTablePage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToTablePage()

        //set order table by asc
        await localTablePage.nameSortDropdown.selectOption(localTablePage.nameSortValues.accending)

        //Verify table has sorted asc
        let originalList: string[] = await localTablePage.getNames()

        // let sortedList: Product[] = [...productList].sort((a,b) => b.price - a.price)
        let sortedList: string[] =  [...originalList].sort((a,b) => a.localeCompare(b))
        
        await expect(originalList).toEqual(sortedList)

        await localTablePage.nameSortDropdown.selectOption(localTablePage.nameSortValues.descending)
        originalList = await localTablePage.getNames()

        sortedList =  [...originalList].sort((b,a) => a.localeCompare(b))
        await expect(originalList).toEqual(sortedList)
    })

    test("Verify sort by date correctly",async ({auth, localDashboardPage, localTablePage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToTablePage()

        //set order table by asc
        await localTablePage.dateSortDropdown.selectOption(localTablePage.dateSortValues.accending)
        let dateTextList:string[] = await localTablePage.getDates()

        let originalList = dateTextList.map(d => new Date(d).getTime())

        let sortedList = [...originalList].sort((a,b) => a - b)

        await expect(originalList).toEqual(sortedList)

        //set order table by desc
        await localTablePage.dateSortDropdown.selectOption(localTablePage.dateSortValues.descending)
        dateTextList = await localTablePage.getDates()

        originalList = dateTextList.map(d => new Date(d).getTime())

        sortedList = [...originalList].sort((a,b) => a - b).reverse()

        await expect(originalList).toEqual(sortedList)
    })

    test("Verify that pagination work correctly",async ({auth, localDashboardPage, localTablePage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToTablePage()

        // observe page 1
        const IDsPage1: string[] = await localTablePage.getIds()

        // next and observe page 2 
        await localTablePage.paginate.nextButton.click()
        const IDsPage2: string[] = await localTablePage.getIds()

        await expect(IDsPage1).not.toEqual(IDsPage2)
        // return page 1       
        await localTablePage.paginate.previousButton.click()
        const IDsPage1v1: string[] = await localTablePage.getIds()

        await expect(IDsPage1v1).toEqual(IDsPage1)
    })

    test("Verify user can interact with help content",async ({auth, localDashboardPage, localHelpCenterPage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToHelpCenterPage()

        //Input search
        await localHelpCenterPage.searchInput.fill("abcc123")

        //Click contact button
        await localHelpCenterPage.contactButton.click()

        // verify success message
        const expectedText = await localHelpCenterPage.contactSuccessText.textContent()

        await expect(expectedText).toContain("Contact request submitted successfully.")

    })

    test("Verify modal can be opened and closed",async ({auth, localDashboardPage, localPlayGroundPage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToPlayGroundPage()

        //open modal
        await localPlayGroundPage.openModalButton.click()

        //
        await expect(localPlayGroundPage.modalRoot).toBeVisible()

        //Verify body content
        await expect(await localPlayGroundPage.getModalParagraph()).toEqual("This modal is available for Playwright open, verify, and close scenarios.")

        // verify success message
        await localPlayGroundPage.closeModal()

        await expect(localPlayGroundPage.modalRoot).not.toBeVisible()

    })

    test("Verify toast message appears",async ({auth, localDashboardPage, localPlayGroundPage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToPlayGroundPage()

        //open modal
        await localPlayGroundPage.openToastButton.click()

        //
        await expect(localPlayGroundPage.toastMessageDiv).toBeVisible()

        //Verify body content
        await expect(await localPlayGroundPage.toastMessageDiv.textContent())
            .toContain("Toast message displayed successfully.")

    })

    test("Verify dropdown selection updates result",async ({auth, localDashboardPage, localPlayGroundPage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToPlayGroundPage()

        //open modal
        await localPlayGroundPage.playgroundDropdown.selectOption(localPlayGroundPage.playgroundDropdownvalues.alpha)
        await expect(await localPlayGroundPage.playgroundDropdownSelectedValueSpan.textContent()).toEqual("Alpha")
        
        await localPlayGroundPage.playgroundDropdown.selectOption(localPlayGroundPage.playgroundDropdownvalues.beta)
        await expect(await localPlayGroundPage.playgroundDropdownSelectedValueSpan.textContent()).toEqual("Beta")
        
        await localPlayGroundPage.playgroundDropdown.selectOption(localPlayGroundPage.playgroundDropdownvalues.gamma)
        await expect(await localPlayGroundPage.playgroundDropdownSelectedValueSpan.textContent()).toEqual("Gamma")

    })

    test("Verify uploaded filename is displayed",async ({auth, localDashboardPage, localPlayGroundPage})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToPlayGroundPage()

        //open modal
        const fileName = "image1.jpg"
        const uploadfilePath = await getTestFilePath(fileName)
        await localPlayGroundPage.sampleUploadInput.setInputFiles(uploadfilePath)

        await expect(localPlayGroundPage.sampleUploadResultSpan).toHaveText(fileName)
    })


    test("Verify CSV file can be downloaded",async ({auth, localDashboardPage, localPlayGroundPage, page}, testInfo)=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToPlayGroundPage()

        //open modal
        const fileName = Date.now()+"users.csv"
        const downloadedFilePath = await DownloadHepler.Download(page,localPlayGroundPage.downloadCSVButton,fileName,testInfo)
        const downloadedFileContent = await readCsvFile(downloadedFilePath)

        await expect(downloadedFileContent).toContain("Chloe Smith")
    })

    test("Verify new tab opens successfully",async ({auth, localDashboardPage, localPlayGroundPage, browser})=>{
        //precondition
        await auth.loginAsAdminOnLocal()

        //navigate to table page
        await localDashboardPage.navigateToPlayGroundPage()

        //open new tab
        const newPage = await localPlayGroundPage.ClickopenNewTab()
        const dashboardPageV2 = new LocalDashboardPage(newPage)

        await expect(dashboardPageV2.currentUserSpan).toContainText("@test.com")
        await expect(dashboardPageV2.currentRoleSpan).toContainText("Admin")
    })
    
})