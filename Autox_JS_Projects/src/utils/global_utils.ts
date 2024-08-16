export class GlobalUtils {

    public static initApp(appPackageName: string): void {
        auto();
        //console.show();
        device.wakeUpIfNeeded();
        setScreenMetrics(1080, 2040);

        // Launch APP
        app.launch(appPackageName);
        sleep(5000)
    }

    public static killApp(appPackageName: string): void {
        // Open the APP setting page
        app.openAppSetting(appPackageName);
        // Wait for setting page be ready
        text(app.getAppName(appPackageName)).waitFor();
        // Click the button to terminate app
        // INVOKER.click(() => text("强行停止"), true, 2000, 2000);
        // INVOKER.click(() => text("强行停止"));
        text("强行停止").findOne().click();
        // Confirm the termination in dialog
        sleep(500);
        text("强行停止").findOne().click();
        // Back to home page
        sleep(500);
        home();
    }

    public static waitForActivityDisappear(activity: string, timeout:number = 300000, period: number = 1000): boolean {
        let start = Date.now();
        while (currentActivity() == activity) {
            if (timeout > 0 && Date.now() - start > timeout) {
                return false;
            }
            sleep(period);
        }
        return true;
    }

    public static waitForElementAppear(element: AutoJs.UiSelector, timeout:number = 60000, period: number = 1000): boolean {
        let start = Date.now();
        while (!element.exists()) {
            if (timeout > 0 && Date.now() - start > timeout) {
                return false;
            }
            sleep(period);
        }
        return true;
    }

    public static waitForElementDisappear(element: AutoJs.UiSelector, timeout:number = 300000, period: number = 1000): boolean {
        let start = Date.now();
        while (element.exists()) {
            if (timeout > 0 && Date.now() - start > timeout) {
                return false;
            }
            sleep(period);
        }
        return true;
    }
}