import {Browser, BrowserContext, Page} from "@playwright/test";
import { LocalLoginPage } from "../pages/local_page/L_login_page";
import { LocalDashboardPage } from "../pages/local_page/L_dashboard_page";
import { LocalCreateCoursePage } from "../pages/local_page/L_createcourse_page";
import { LocalEditCoursePage } from "../pages/local_page/L_editcourse_page";
import { LocalCourseListPage } from "../pages/local_page/L_courselist_page";
import { LocalApprovalPage } from "../pages/local_page/L_approval_page";

export class CustomSession {

  private _loginPage?: LocalLoginPage;
  private _dashboardPage?: LocalDashboardPage;
  private _createCoursePage?: LocalCreateCoursePage;
  private _editCoursePage?: LocalEditCoursePage;
  private _listCoursePage?: LocalCourseListPage;
  private _approvalPage?: LocalApprovalPage;

  private constructor(
    readonly context: BrowserContext,
    readonly page: Page
  ) {}

  static async create(browser: Browser): Promise<CustomSession> {
    const context =await browser.newContext();
    const page = await context.newPage();
    return new CustomSession( context,page);
  }

  get approvalPage(): LocalApprovalPage {
    if (!this._approvalPage) {
      this._approvalPage =
        new LocalApprovalPage(this.page);
    }
    return this._approvalPage;
  }

  get editCoursePage(): LocalEditCoursePage {
    if (!this._editCoursePage) {
      this._editCoursePage =
        new LocalEditCoursePage(this.page);
    }
    return this._editCoursePage;
  }

  get listCoursePage(): LocalCourseListPage {
    if (!this._listCoursePage) {
      this._listCoursePage =
        new LocalCourseListPage(this.page);
    }
    return this._listCoursePage;
  }

  get localLoginPage(): LocalLoginPage {
    if (!this._loginPage) {
      this._loginPage =
        new LocalLoginPage(this.page);
    }
    return this._loginPage;
  }

  get dashboardPage(): LocalDashboardPage {
    if (!this._dashboardPage) {
      this._dashboardPage =
        new LocalDashboardPage(this.page);
    }
    return this._dashboardPage;
  }

  get createCoursePage(): LocalCreateCoursePage {
    if (!this._createCoursePage) {
      this._createCoursePage =
        new LocalCreateCoursePage(this.page);
    }
    return this._createCoursePage;
  }

  async close(): Promise<void> {
    await this.context.close();
  }
}