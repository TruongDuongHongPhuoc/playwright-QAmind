import { test, expect } from '../../fixtures/index.fixture'


test.describe('Login Feature', () => {

  test('User can login with valid account', async ({ loginPage, page }) => {
    await loginPage.goto()
    await loginPage.fill_email(process.env.EMAIL!)
    await loginPage.fill_password(process.env.PASSWORD!)
    await loginPage.click_login()
    await loginPage.wait_for_webidle()
    await expect(page).toHaveURL('/ecommerce')
  })

  test('Verify that the user can log in with correct email with extra space', async ({ loginPage, page }) => {
    await loginPage.goto()
    await loginPage.fill_email(process.env.EMAIL!+"  ")
    await loginPage.fill_password(process.env.PASSWORD!)
    await loginPage.click_login()

    await expect(page).toHaveURL('/ecommerce')
  })

  // this test will fail due to reported defect
  test.fixme('Verify that user can login with correct email with upper case', async ({ loginPage, page }) => {
    await loginPage.goto()
    await loginPage.fill_email(process.env.EMAIL!.toUpperCase())
    await loginPage.fill_password(process.env.PASSWORD!)
    await loginPage.click_login()
    await expect(page).toHaveURL('/ecommerce')
  })

  test('Verify that the user cannot log in with in-correct email', async ({ loginPage, page }) => {
    await loginPage.goto()
    await loginPage.fill_email('incorrectEmail@gmail.com')
    await loginPage.fill_password(process.env.PASSWORD!)
    await loginPage.click_login()

    let error = await loginPage.get_error_email_message()
    await expect(error).toBe(loginPage.errorTexts.invalidUsername)

    await loginPage.clear_email()
    await loginPage.fill_email('incorrectemail.com')
    await loginPage.click_login()

    error = await loginPage.get_error_email_message()
    await expect(error).toBe(loginPage.errorTexts.invalidEmail)

    await loginPage.clear_email()
    await loginPage.click_login()
    error = await loginPage.get_error_email_message()
    await expect(error).toBe(loginPage.errorTexts.requiredEmail)
  })

  test('Verify that the user cannot log in with in-correct password', async ({ loginPage, page }) => {
    await loginPage.goto()
    await loginPage.fill_email(process.env.EMAIL!)
    await loginPage.fill_password('incorrect')
    await loginPage.click_login()

    let error = await loginPage.get_error_password_message()
    await expect(error).toBe(loginPage.errorTexts.invalidPassword)

    await loginPage.clear_password()
    await loginPage.fill_password(process.env.PASSWORD!.toUpperCase())
    await loginPage.click_login()

    error = await loginPage.get_error_password_message()
    await expect(error).toBe(loginPage.errorTexts.invalidPassword)

    await loginPage.clear_password()
    await loginPage.fill_password(process.env.PASSWORD!.toLowerCase())
    await loginPage.click_login()

    error = await loginPage.get_error_password_message()
    await expect(error).toBe(loginPage.errorTexts.invalidPassword)

    await loginPage.clear_password()
    await loginPage.click_login()
    error = await loginPage.get_error_password_message()
    await expect(error).toBe(loginPage.errorTexts.requiredPassword)
  })

  




})