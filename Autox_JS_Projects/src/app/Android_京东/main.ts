import APP_CONST from './app_const.json'
import { SINGLETON_WRAPPER } from '../../utils/autox_selector_wrapper'
import { GlobalUtils } from '../../utils/global_utils';

GlobalUtils.initApp(APP_CONST.APP_PACKAGE_NAME);

if (GlobalUtils.waitForElementAppear(text("我的"))) {
    console.info("[INFO] [Current Page] 首页");
    SINGLETON_WRAPPER.clickByText("我的");

    if (GlobalUtils.waitForElementAppear(text("签到领豆"))) {
        console.info("[INFO] [Current Page] 签到领豆");
        SINGLETON_WRAPPER.clickByText("我的");
    }
}

// GlobalUtils.killApp(APP_CONST.APP_PACKAGE_NAME);
// exit();