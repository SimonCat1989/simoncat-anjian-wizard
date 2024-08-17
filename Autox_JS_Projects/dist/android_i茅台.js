/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 728:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var app_const_json_1 = __importDefault(__webpack_require__(817));
var sms_code_extractor_1 = __webpack_require__(116);
var autox_selector_wrapper_1 = __webpack_require__(123);
var global_utils_1 = __webpack_require__(333);
global_utils_1.GlobalUtils.initApp(app_const_json_1.default.APP_PACKAGE_NAME);
global_utils_1.GlobalUtils.waitForActivityDisappear(app_const_json_1.default.PAGE_SPLASH.activity_name);
// Handle Login Page
if (app_const_json_1.default.PAGE_LOGIN.activity_name == currentActivity()) {
    console.info("[INFO] [Current Page] ".concat(app_const_json_1.default.PAGE_LOGIN.name));
    sms_code_extractor_1.SMSCodeExtractor.installOnce(function (smsCode) {
        autox_selector_wrapper_1.SINGLETON_WRAPPER.setText(app_const_json_1.default.PAGE_LOGIN.input_sms_code_id, smsCode).clickById(app_const_json_1.default.PAGE_LOGIN.btn_login_id);
    });
    autox_selector_wrapper_1.SINGLETON_WRAPPER.setText(app_const_json_1.default.PAGE_LOGIN.input_user_name_id, "")
        .clickById(app_const_json_1.default.PAGE_LOGIN.checkbox_grant_permission, function (ele) { return ele.checked(false); }, true)
        .clickById(app_const_json_1.default.PAGE_LOGIN.btn_fetch_sms_code_id);
    global_utils_1.GlobalUtils.waitForActivityDisappear(app_const_json_1.default.PAGE_LOGIN.activity_name);
}
// Handle AD dialog
if (global_utils_1.GlobalUtils.waitForElementAppear(id("vClose")), 10000) {
    console.info("[INFO] Enter AD Dialog page.");
    autox_selector_wrapper_1.SINGLETON_WRAPPER.clickById("vClose");
}
// Handle Main page
if (global_utils_1.GlobalUtils.waitForElementAppear(id("ivLeft"))) {
    console.info("[INFO] Enter main page.");
    autox_selector_wrapper_1.SINGLETON_WRAPPER.clickById("ivLeft");
}
// Handle Reservation Page
if (global_utils_1.GlobalUtils.waitForElementAppear(id("bt_goods"))) {
    console.info("[INFO] Enter reservation page.");
    autox_selector_wrapper_1.SINGLETON_WRAPPER.clickById("bt_goods", function (ele) { return ele.drawingOrder(3); });
}
// GlobalUtils.killApp(APP_CONST.APP_PACKAGE_NAME);
// exit();


/***/ }),

/***/ 123:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SINGLETON_WRAPPER = exports.AutoxSelectorWrapper = void 0;
var AutoxSelectorWrapper = /** @class */ (function () {
    function AutoxSelectorWrapper(isContinue) {
        if (isContinue === void 0) { isContinue = true; }
        this.isContinue = isContinue;
    }
    AutoxSelectorWrapper.prototype.pause = function (pauseTime) {
        if (this.isContinue) {
            sleep(pauseTime ? pauseTime : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_APPLY);
        }
        return this;
    };
    AutoxSelectorWrapper.prototype.clickTopMiddleArea = function (waitSecBeforeApply, waitSecBeforeNext) {
        if (this.isContinue) {
            sleep(waitSecBeforeApply ? waitSecBeforeApply : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_APPLY);
            this.isContinue = click(device.width / 2, 100);
            sleep(waitSecBeforeNext ? waitSecBeforeNext : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_NEXT);
        }
        return this;
    };
    AutoxSelectorWrapper.prototype.clickById = function (selectorId, selectorFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext) {
        return this.execute(id(selectorId), "[id] ".concat(selectorId), function (ele) { return ele.click(); }, "[action] click", selectorFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext);
    };
    AutoxSelectorWrapper.prototype.clickByText = function (selectorText, selectorFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext) {
        return this.execute(text(selectorText), "[Text] ".concat(selectorText), function (ele) { return ele.click(); }, "[action] click", selectorFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext);
    };
    AutoxSelectorWrapper.prototype.setText = function (selectorId, desiredText, selectorFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext) {
        return this.execute(id(selectorId), "[id] ".concat(selectorId), function (ele) { return ele.setText(desiredText); }, "[action] setText ".concat(desiredText), selectorFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext);
    };
    AutoxSelectorWrapper.prototype.clickDirectly = function (baseSelector, selectorDesc, relativeFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext) {
        if (this.isContinue) {
            var baseObject = baseSelector.findOne(maxWaitSecTimeout ? maxWaitSecTimeout : AutoxSelectorWrapper.DEFAULT_MAX_WAIT_SEC_TIMEOUT);
            this.recursivlyApplyAction(baseObject && relativeFilterFunc ? relativeFilterFunc(baseObject) : baseObject, selectorDesc, function (ele) { return ele.click(); }, "[action] click", skipOnNonExistent);
            sleep(waitSecBeforeNext ? waitSecBeforeNext : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_NEXT);
        }
        return this;
    };
    AutoxSelectorWrapper.prototype.execute = function (selector, selectorDesc, actionFunc, actionDesc, selectorFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext) {
        if (this.isContinue) {
            this.recursivlyApplyAction((selectorFilterFunc ? selectorFilterFunc(selector) : selector)
                .findOne(maxWaitSecTimeout ? maxWaitSecTimeout : AutoxSelectorWrapper.DEFAULT_MAX_WAIT_SEC_TIMEOUT), selectorDesc, actionFunc, actionDesc, skipOnNonExistent);
            sleep(waitSecBeforeNext ? waitSecBeforeNext : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_NEXT);
        }
        return this;
    };
    AutoxSelectorWrapper.prototype.recursivlyApplyAction = function (target, selectorDesc, actionFunc, actionDesc, skipOnNonExistent) {
        if (target) {
            if (actionFunc(target)) {
                console.info("[INFO] Detected \"".concat(selectorDesc, "\", and applied \"").concat(actionDesc, "\"."));
            }
            else {
                console.info("[WARN] Detected \"".concat(selectorDesc, "\", but failed to apply \"").concat(actionDesc, "\"."));
                var currentLevel = 0;
                var doneAction = false;
                while (currentLevel < AutoxSelectorWrapper.MAX_ANCESTOR_COUNT) {
                    currentLevel += 1;
                    var parent_1 = target.parent();
                    if (parent_1) {
                        if (actionFunc(parent_1)) {
                            console.info("[INFO] Detected parent LV-".concat(currentLevel, " of \"").concat(selectorDesc, "\", and applied \"").concat(actionDesc, "\"."));
                            doneAction = true;
                            break;
                        }
                        else {
                            console.info("[ERROR] Detected parent LV-".concat(currentLevel, " of \"").concat(selectorDesc, "\", but failed to apply \"").concat(actionDesc, "\"."));
                            target = parent_1;
                        }
                    }
                    else {
                        console.info("[ERROR] NO Detected parent of LV-".concat(currentLevel, " \"").concat(selectorDesc, "\", and failed to apply \"").concat(actionDesc, "\"."));
                        break;
                    }
                }
                this.isContinue = doneAction;
            }
        }
        else if (skipOnNonExistent) {
            console.info("[INFO] Skipped \"".concat(selectorDesc, "\" due to non-existent."));
        }
        else {
            console.error("[ERROR] Unable to detect \"".concat(selectorDesc, "\", skipped all following steps."));
            this.isContinue = false;
        }
    };
    AutoxSelectorWrapper.MAX_ANCESTOR_COUNT = 3;
    AutoxSelectorWrapper.DEFAULT_MAX_WAIT_SEC_TIMEOUT = 5000;
    AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_NEXT = 1000;
    AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_APPLY = 5000;
    return AutoxSelectorWrapper;
}());
exports.AutoxSelectorWrapper = AutoxSelectorWrapper;
;
exports.SINGLETON_WRAPPER = new AutoxSelectorWrapper();


/***/ }),

/***/ 333:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlobalUtils = void 0;
var GlobalUtils = /** @class */ (function () {
    function GlobalUtils() {
    }
    GlobalUtils.initApp = function (appPackageName) {
        auto();
        //console.show();
        device.wakeUpIfNeeded();
        setScreenMetrics(1080, 2040);
        // Launch APP
        app.launch(appPackageName);
        sleep(5000);
    };
    GlobalUtils.killApp = function (appPackageName) {
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
    };
    GlobalUtils.waitForActivityDisappear = function (activity, timeout, period) {
        if (timeout === void 0) { timeout = 300000; }
        if (period === void 0) { period = 1000; }
        var start = Date.now();
        while (currentActivity() == activity) {
            if (timeout > 0 && Date.now() - start > timeout) {
                return false;
            }
            sleep(period);
        }
        return true;
    };
    GlobalUtils.waitForElementAppear = function (element, timeout, period) {
        if (timeout === void 0) { timeout = 60000; }
        if (period === void 0) { period = 1000; }
        var start = Date.now();
        while (!element.exists()) {
            if (timeout > 0 && Date.now() - start > timeout) {
                return false;
            }
            sleep(period);
        }
        return true;
    };
    GlobalUtils.waitForElementDisappear = function (element, timeout, period) {
        if (timeout === void 0) { timeout = 300000; }
        if (period === void 0) { period = 1000; }
        var start = Date.now();
        while (element.exists()) {
            if (timeout > 0 && Date.now() - start > timeout) {
                return false;
            }
            sleep(period);
        }
        return true;
    };
    return GlobalUtils;
}());
exports.GlobalUtils = GlobalUtils;


/***/ }),

/***/ 116:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SMSCodeExtractor = void 0;
var SMSCodeRegex = /.*验证码[\s:：是]*(\d{4,6}).*/;
var SMSCodeExtractionExitCode;
(function (SMSCodeExtractionExitCode) {
    SMSCodeExtractionExitCode[SMSCodeExtractionExitCode["OK"] = 0] = "OK";
    SMSCodeExtractionExitCode[SMSCodeExtractionExitCode["INVALID_MESSAGE"] = 1] = "INVALID_MESSAGE";
    SMSCodeExtractionExitCode[SMSCodeExtractionExitCode["NOT_FOUND"] = 2] = "NOT_FOUND";
})(SMSCodeExtractionExitCode || (SMSCodeExtractionExitCode = {}));
var SMSCodeExtractedResponse = /** @class */ (function () {
    function SMSCodeExtractedResponse(exitCode, resposne) {
        this.exitCode = exitCode;
        this.resposne = resposne;
    }
    SMSCodeExtractedResponse.prototype.isSuccess = function () {
        return this.exitCode === SMSCodeExtractionExitCode.OK;
    };
    SMSCodeExtractedResponse.prototype.getCode = function () {
        return this.resposne;
    };
    SMSCodeExtractedResponse.prototype.toString = function () {
        return "SMSCodeExtractedResponse[exit_code=".concat(this.exitCode, ", response=").concat(this.resposne, "]");
    };
    return SMSCodeExtractedResponse;
}());
var SMSCodeExtractor = /** @class */ (function () {
    function SMSCodeExtractor() {
    }
    SMSCodeExtractor.installOnce = function (callbackFunc) {
        var notificationThread = threads.start(function () {
            var isDone = false;
            events.observeNotification();
            events.on("notification", function (notification) {
                console.info("asadfasdf  ".concat(notification));
                var response = SMSCodeExtractor.extract(notification);
                if (response.isSuccess()) {
                    console.info("[INFO] Received SMS Verification Code \"".concat(response.getCode(), "\""));
                    callbackFunc(response.getCode());
                    events.removeAllListeners("notification");
                    isDone = true;
                }
                else {
                    console.error("[ERROR] Can NOT receive SMS Verification Code: \"".concat(response.toString(), "\""));
                }
                notification.delete();
            });
            // Keep thread on running state, until receive correct sms code
            var waitForSmsCodeBlocker = setInterval(function () {
                if (isDone) {
                    clearInterval(waitForSmsCodeBlocker);
                }
            }, 5000);
        });
        // Wait for thread be started
        notificationThread.waitFor();
    };
    SMSCodeExtractor.extract = function (notification) {
        var rawMessage = notification.getText();
        if (!rawMessage || !rawMessage.includes('验证码')) {
            return new SMSCodeExtractedResponse(SMSCodeExtractionExitCode.INVALID_MESSAGE, "\u672A\u5728\u6D88\u606F\u4E2D\u627E\u5230\u9A8C\u8BC1\u7801\u4FE1\u606F\uFF0C\u8BF7\u786E\u8BA4\u8BE5\u6D88\u606F\uFF1A".concat(rawMessage));
        }
        else {
            var match = SMSCodeRegex.exec(rawMessage);
            if (!match) {
                return new SMSCodeExtractedResponse(SMSCodeExtractionExitCode.NOT_FOUND, "\u672A\u5728\u6D88\u606F\u4E2D\u627E\u5230\u9A8C\u8BC1\u7801\u4FE1\u606F\uFF0C\u8BF7\u786E\u8BA4\u8BE5\u6D88\u606F\uFF1A".concat(rawMessage));
            }
            else {
                return new SMSCodeExtractedResponse(SMSCodeExtractionExitCode.OK, match[1]);
            }
        }
    };
    return SMSCodeExtractor;
}());
exports.SMSCodeExtractor = SMSCodeExtractor;


/***/ }),

/***/ 817:
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"APP_PACKAGE_NAME":"com.moutai.mall","PAGE_SPLASH":{"activity_name":"com.moutai.mall.module.splash.SplashActivity"},"PAGE_LOGIN":{"name":"Login Page","activity_name":"com.moutai.mall.module.login.LoginActivity","input_user_name_id":"etPhone","input_sms_code_id":"etVerifyCode","btn_fetch_sms_code_id":"btVerifyCode","btn_login_id":"btLogin","checkbox_grant_permission":"check_box"},"PAGE_MAIN":{"activity_name":"com.moutai.mall.MainActivity"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(728);
/******/ 	
/******/ })()
;