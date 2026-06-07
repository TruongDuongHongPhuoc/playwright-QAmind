import { Routes } from '../../constant/routes'
import { test, expect } from '../../fixtures/index.fixture'

test.describe('Login Feature', () => {

  test('User can login with valid account', async ({ loginPage, page }) => {
    await loginPage.login(process.env.EMAIL!,process.env.PASSWORD!)
    await expect(page).toHaveURL(Routes.productPage)
  })

  test('Verify that the user can log in with correct email with extra space', async ({ loginPage, page }) => {
    await loginPage.login(process.env.EMAIL!+"    ",process.env.PASSWORD!)
    await expect(page).toHaveURL(Routes.productPage)
  })

  // this test will fail due to reported defect
  test.fixme('Verify that user can login with correct email with upper case', async ({ loginPage, page }) => {
    await loginPage.login(process.env.EMAIL!.toUpperCase(),process.env.PASSWORD!)
    await expect(page).toHaveURL(Routes.productPage)
  })

  test('Verify that the user cannot log in with incorrect email', async ({ loginPage }) => {
    // Input in-correct email
    await loginPage.login('incorrectEmail@gmail.com',process.env.PASSWORD!)
    let error = await loginPage.emailErrorText.textContent()
    await expect(error).toBe(loginPage.errorTexts.invalidUsername)

    // Clear email field
    await loginPage.emailInput.clear()
    await loginPage.loginButton.click()
  
    //verify error message
    error = await loginPage.emailErrorText.textContent()
    await expect(error).toBe(loginPage.errorTexts.requiredEmail)
  })

  test('Verify that the user cannot log in with incorrect password', async ({ loginPage }) => {
    await loginPage.login(process.env.EMAIL!,'incorrect')
    let error = await loginPage.passwordErrorText.textContent()
    await expect(error).toBe(loginPage.errorTexts.invalidPassword)

    await loginPage.clearLoginFields()
    await loginPage.login(process.env.EMAIL!,process.env.PASSWORD!.toUpperCase())

    error = await loginPage.passwordErrorText.textContent()
    await expect(error).toBe(loginPage.errorTexts.invalidPassword)

    await loginPage.clearLoginFields()
    await loginPage.login(process.env.EMAIL!,process.env.PASSWORD!.toLowerCase())

    error = await loginPage.passwordErrorText.textContent()
    await expect(error).toBe(loginPage.errorTexts.invalidPassword)

    await loginPage.passwordInput.clear()
    await loginPage.loginButton.click()

    error = await loginPage.passwordErrorText.textContent()
    await expect(error).toBe(loginPage.errorTexts.requiredPassword)
  })

  




})