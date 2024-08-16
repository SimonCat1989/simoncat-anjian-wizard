import APP_CONST from './app_const.json'
import { SMSCodeExtractor } from '../../utils/sms_code_extractor'
import { SINGLETON_WRAPPER } from '../../utils/autox_selector_wrapper'
import { GlobalUtils } from '../../utils/global_utils';

GlobalUtils.initApp(APP_CONST.APP_PACKAGE_NAME);
GlobalUtils.waitForActivityDisappear(APP_CONST.PAGE_SPLASH.activity_name);

// Handle Login Page
if (APP_CONST.PAGE_LOGIN.activity_name == currentActivity()) {
    console.info(`[INFO] [Current Page] ${APP_CONST.PAGE_LOGIN.name}`);
    SMSCodeExtractor.installOnce((smsCode: string) => {
        SINGLETON_WRAPPER.setText(APP_CONST.PAGE_LOGIN.input_sms_code_id, smsCode).clickById(APP_CONST.PAGE_LOGIN.btn_login_id);
    });
    SINGLETON_WRAPPER.setText(APP_CONST.PAGE_LOGIN.input_user_name_id, "")
        .clickById(APP_CONST.PAGE_LOGIN.checkbox_grant_permission, (ele) => ele.checked(false), true)
        .clickById(APP_CONST.PAGE_LOGIN.btn_fetch_sms_code_id);
    GlobalUtils.waitForActivityDisappear(APP_CONST.PAGE_LOGIN.activity_name);
}

// Handle AD dialog
if (GlobalUtils.waitForElementAppear(id("vClose")), 10000) {
    console.info("[INFO] Enter AD Dialog page.");
    SINGLETON_WRAPPER.clickById("vClose");
}

// Handle Main page
if (GlobalUtils.waitForElementAppear(id("ivLeft"))) {
    console.info("[INFO] Enter main page.");
    SINGLETON_WRAPPER.clickById("ivLeft");
}

// Handle Reservation Page
if (GlobalUtils.waitForElementAppear(id("bt_goods"))) {
    console.info("[INFO] Enter reservation page.");
    SINGLETON_WRAPPER.clickById("bt_goods", (ele) => ele.drawingOrder(3));
}

// GlobalUtils.killApp(APP_CONST.APP_PACKAGE_NAME);
// exit();