import { Download, Locator, Page, TestInfo } from "@playwright/test";
import { LocalLoginPage } from "../../pages/local_page/L_login_page";
import { LoginPage } from "../../pages/login_page";
import { getDownloadPath } from "./helper";
import * as fs from "node:fs";
import path from "path";

export class DownloadHelper {
    
    static async download(page: Page, triggerButton: Locator, fileName: string, testInfo: TestInfo): Promise<string> {
        const downloadPromise = page.waitForEvent('download')

        await triggerButton.click()

        const download:Download = await downloadPromise;

        const workerDownloadFilePath = path.join(testInfo.outputDir, fileName);

        const savePath = await getDownloadPath(workerDownloadFilePath)
        console.log(savePath)
        fs.mkdirSync(path.dirname(savePath), { recursive: true });

        await download.saveAs(savePath);

        return savePath
    }

}