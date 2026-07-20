import { CustomSession } from '../../components/custom_session'
import { LocalRoutes } from '../../constant/routes'
import { test, expect } from '../../fixtures/index.fixture'

test.describe('Course module', () => {
  test('Verify Author can create course, Admin can update and approve course, User can view approved course', async ({ apisession, browser }) => {
    const adminTab = await CustomSession.create(browser)
    const authorTab = await CustomSession.create(browser)
    const readerTab = await CustomSession.create(browser)
    let createdCourseID: number | undefined

    try {
      const adminEmail = adminTab.localLoginPage.userList.adminEmail
      const adminPass = adminTab.localLoginPage.userList.adminPass
      const authorEmail = authorTab.localLoginPage.userList.authorEmail
      const authorPass = authorTab.localLoginPage.userList.authorPass
      const readerEmail = readerTab.localLoginPage.userList.userEmail
      const readerPass = readerTab.localLoginPage.userList.userPass

      await adminTab.localLoginPage.login(adminEmail, adminPass)
      await adminTab.localLoginPage.waitForLogin()
      await authorTab.localLoginPage.login(authorEmail, authorPass)
      await authorTab.localLoginPage.waitForLogin()
      await readerTab.localLoginPage.login(readerEmail, readerPass)
      await readerTab.localLoginPage.waitForLogin()

      await authorTab.dashboardPage.navigateToCreateCoursePage()

      const courseTitle = 'Playwright Masterclass' + Date.now()
      const courseDescription = 'Description of the playwright masterclass'

      await authorTab.createCoursePage.courseForm.fill(courseTitle, courseDescription)
      await authorTab.createCoursePage.courseForm.submitButton.click()

      await expect(authorTab.page).toHaveURL(LocalRoutes.listCoursePage)
      await expect(authorTab.listCoursePage.flash).toHaveText(authorTab.listCoursePage.flashNotification.courseCreateSuccess)

      const authorTabCourseInstance = await authorTab.listCoursePage.getCourseRowBy(courseTitle, courseDescription)
      await expect(authorTabCourseInstance.root).toBeVisible()

      await adminTab.dashboardPage.navigateToCoursePage()

      const adminTabCourseInstance = await adminTab.listCoursePage.getCourseRowBy(courseTitle, courseDescription)
      createdCourseID = await adminTabCourseInstance.getCourseID()
      await adminTabCourseInstance.editButton.click()

      const courseDescriptionEdited = 'abc123'
      await adminTab.editCoursePage.courseForm.descriptionInput.fill(courseDescriptionEdited)
      await adminTab.editCoursePage.courseForm.submitButton.click()

      await authorTab.page.reload()
      const authorTabCourseInstanceEdited = await authorTab.listCoursePage.getCourseRowBy(courseTitle, courseDescriptionEdited)
      await expect(authorTabCourseInstanceEdited.root).toBeVisible()

      await adminTab.listCoursePage.headerComponent.brandLink.click()
      await adminTab.page.waitForURL(LocalRoutes.dashboardPage)
      await adminTab.dashboardPage.navigateToCourseApprovalPage()
      await adminTab.page.waitForURL(LocalRoutes.approvalPage)

      await authorTab.page.reload()
      const pendingApprovalCourse = await adminTab.approvalPage.getPendingApprovalCourseBy(courseTitle, courseDescriptionEdited)
      await pendingApprovalCourse.approveButton.click()

      await readerTab.dashboardPage.navigateToCoursePage()

      const readerTabCourseInstanceEdited = await readerTab.listCoursePage.getCourseRowBy(courseTitle, courseDescriptionEdited)
      await expect(readerTabCourseInstanceEdited.root).toBeVisible()
      await expect(readerTabCourseInstanceEdited.status).toHaveText('Approved')
    } finally {
      if (createdCourseID !== undefined) {
        await apisession.deleteCourse(createdCourseID)
      }

      await authorTab.close()
      await adminTab.close()
      await readerTab.close()
    }
  })

  test('Verify Admin can reject Author course request', async ({ apisession, auth, localDashboardPage, localCreateCoursePage, page, localApprovalPage, localCourseListPage }) => {
    let rejectedCourseID: number | undefined

    try {
      await auth.loginAsAuthorOnLocal()

      const course = {
        title: 'Rejected Course' + Date.now(),
        description: 'This course will be rejected',
      }

      await localDashboardPage.navigateToCreateCoursePage()
      await localCreateCoursePage.courseForm.fill(course.title, course.description)
      await localCreateCoursePage.courseForm.submitButton.click()

      await localCreateCoursePage.headerComponent.logout()
      await expect(page).toHaveURL(LocalRoutes.loginPage)

      await auth.loginAsAdminOnLocal()
      await localDashboardPage.navigateToCourseApprovalPage()

      const pendingCourse = await localApprovalPage.getPendingApprovalCourseBy(course.title, course.description)
      await pendingCourse.rejectButton.click()

      await expect(pendingCourse.rootLocator).not.toBeVisible()

      await localApprovalPage.headerComponent.brandLink.click()
      await page.waitForURL(LocalRoutes.dashboardPage)
      await localDashboardPage.navigateToCoursePage()

      const rejectedCourse = await localCourseListPage.getCourseRowBy(course.title, course.description)
      rejectedCourseID = await rejectedCourse.getCourseID()
      await expect(rejectedCourse.root).toBeVisible()
      await expect(rejectedCourse.status).toHaveText('Rejected')

      await localCourseListPage.headerComponent.logout()
      await expect(page).toHaveURL(LocalRoutes.loginPage)

      await auth.loginAsUserOnLocal()
      await localDashboardPage.navigateToCoursePage()
      await expect(rejectedCourse.root).not.toBeVisible()
    } finally {
      if (rejectedCourseID !== undefined) {
        await apisession.deleteCourse(rejectedCourseID)
      }
    }
  })

  test('Verify Admin can delete course', async ({ apisession, localLoginPage, auth, localDashboardPage, localCourseListPage, page }) => {
    let createdCourseID: number | undefined
    let isCourseDeleted = false
    const course = {
      title: 'Playwright Test' + Date.now(),
      description: 'abc123',
    }

    try {
      await apisession.authAPI.login(localLoginPage.userList.adminEmail, localLoginPage.userList.adminPass)
      const response = await apisession.courseAPI.createCourse(course.title, course.description)
      await expect(response.status()).toBe(201)

      await auth.loginAsAdminOnLocal()
      await localDashboardPage.navigateToCoursePage()

      const removeCourse = await localCourseListPage.getCourseRowBy(course.title, course.description)
      createdCourseID = await removeCourse.getCourseID()
      await expect(removeCourse.deleteButton).toBeVisible()
      await expect(removeCourse.deleteButton).toBeEnabled()

      const dialogPromise = page.waitForEvent('dialog')
      const clickPromise = removeCourse.deleteButton.click()
      const dialog = await dialogPromise

      await dialog.accept()
      await clickPromise

      await expect(removeCourse.root).toHaveCount(0)
      isCourseDeleted = true
    } finally {
      if (createdCourseID !== undefined && !isCourseDeleted) {
        await apisession.deleteCourse(createdCourseID)
      }
    }
  })
})
