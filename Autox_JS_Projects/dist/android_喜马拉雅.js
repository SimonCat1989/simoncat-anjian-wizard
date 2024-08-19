/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 24:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AutoxAutomatorEngine = void 0;
var const_1 = __webpack_require__(456);
var AutoxAutomatorEngine = /** @class */ (function () {
    function AutoxAutomatorEngine(
    /**
     * Create automator engine for each APP or package
     */
    packageName, 
    /**
     * All pre-defined action list
     * @default []
     */
    actions) {
        if (actions === void 0) { actions = []; }
        this.packageName = packageName;
        this.actions = actions;
    }
    AutoxAutomatorEngine.prototype.addAction = function (action) {
        this.actions.push(this.beautify(action));
        return this;
    };
    AutoxAutomatorEngine.prototype.printActions = function () {
        this.actions.forEach(function (action) {
            console.info("[INFO] ==================================");
            console.info("name: ".concat(action.name));
            action.preconditions.forEach(function (pre) {
                console.info("precondition: ".concat(pre.waitForActivityDisappearance, ", ").concat(pre.waitForElementAppearance, ", ").concat(pre.waitForElementDisappearance));
                console.info("preconditionDesc: ".concat(pre.preconditionDesc));
                console.info("timeoutForWaitingSec: ".concat(pre.timeoutForWaitingSec));
                console.info("skipIfTimeoutForWaiting: ".concat(pre.skipIfTimeoutForWaiting));
            });
            action.targets.forEach(function (tar) {
                console.info("target: ".concat(tar.target));
                console.info("targetDesc: ".concat(tar.targetDesc));
                console.info("relativePathFunc: ".concat(tar.relativePathFunc));
                console.info("skipIfTargetNonExistent: ".concat(tar.skipIfTargetNonExistent));
                console.info("maxWaitForFindingTargetSec: ".concat(tar.maxWaitForFindingTargetSec));
            });
            action.actions.forEach(function (act) {
                console.info("action: ".concat(act.action));
                console.info("actionDesc: ".concat(act.actionDesc));
                console.info("skipIfActionFailed: ".concat(act.skipIfActionFailed));
                console.info("sleepSecPreAction: ".concat(act.sleepSecPreAction));
                console.info("sleepSecPostAction: ".concat(act.sleepSecPostAction));
            });
            console.info("repetitive: ".concat(action.repetitive));
        });
    };
    AutoxAutomatorEngine.prototype.launch = function () {
        this._init();
        if (app.launch(this.packageName)) {
            console.info("[INFO] [Success] Launched Package '".concat(this.packageName, "'"));
            sleep(5000);
            this._doInternal(0, this.actions.length);
            console.info("[INFO] ==================================");
            this._kill();
            console.info("[INFO] [Success] Killed Package '".concat(this.packageName, "'. Programe is end."));
        }
        else {
            console.info("[ERROR] [Failed] Unable to Launch Package '".concat(this.packageName, "'"));
        }
        exit();
    };
    AutoxAutomatorEngine.prototype.test = function () {
        console.setCanInput(true);
        while (true) {
            var command = console.input("Input Action ID Range (e.g. '1,4') or quit: ");
            if (command === 'quit') {
                break;
            }
            else {
                var actionIds = command.split(",");
                if (actionIds.length !== 2) {
                    console.error("[ERROR] Invalid input !");
                }
                else {
                    this._doInternal(actionIds[0] - 1, actionIds[1]);
                }
            }
        }
    };
    AutoxAutomatorEngine.prototype._doInternal = function (actionIndex, actionTotalCount) {
        var isInterrupted = false;
        for (; !isInterrupted && actionIndex < actionTotalCount; actionIndex++) {
            var currentAction = this.actions[actionIndex];
            console.info("[INFO] ==================================");
            console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Start] ").concat(currentAction.name));
            // Analyze sub-actions
            if (currentAction.actions.length > 0) {
                var subActionTotal = currentAction.actions.length;
                var subPreconditionTotal = currentAction.preconditions.length;
                var subTargetTotal = currentAction.targets.length;
                var subActionIndex = 0;
                var isSkippedSubAction = false;
                while (!isSkippedSubAction && subActionIndex < subActionTotal) {
                    var currentSubAction = currentAction.actions[subActionIndex];
                    // Pause before taking sub-action
                    sleep(currentSubAction.sleepSecPreAction);
                    if (subActionIndex < subPreconditionTotal) {
                        // Detected precondition for current sub-action
                        var currentSubPrecondition = currentAction.preconditions[subActionIndex];
                        console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Pre-Condition] [Start] ").concat(currentSubPrecondition.preconditionDesc, "."));
                        if (!this._waitForPreconditions(currentSubPrecondition)) {
                            if (currentSubPrecondition.skipIfTimeoutForWaiting) {
                                console.warn("[WARN] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Pre-Condition] [Timeout] ").concat(currentSubPrecondition.preconditionDesc, "."));
                                isSkippedSubAction = true;
                            }
                            else {
                                console.error("[ERROR] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Pre-Condition] [Failed] ").concat(currentSubPrecondition.preconditionDesc, ", exit."));
                                isInterrupted = true;
                                break;
                            }
                        }
                        else {
                            console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Pre-Condition] [Success] ").concat(currentSubPrecondition.preconditionDesc, "."));
                        }
                    }
                    else {
                        console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Pre-Condition] [Skip] No pre-conditions."));
                    }
                    try {
                        if (!isSkippedSubAction) {
                            if (subActionIndex < subTargetTotal) {
                                // Detected targets for current sub-action
                                var currentSubTarget = currentAction.targets[subActionIndex];
                                console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [UI-Object] [Start] ").concat(currentSubTarget.targetDesc));
                                var baseObject = currentSubTarget.target.findOne(currentSubTarget.maxWaitForFindingTargetSec);
                                baseObject = (baseObject && currentSubTarget.relativePathFunc) ? currentSubTarget.relativePathFunc(baseObject) : baseObject;
                                if (baseObject) {
                                    console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [UI-Object] [Success] ").concat(currentSubTarget.targetDesc));
                                    console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Job] [Start] ").concat(currentSubAction.actionDesc));
                                    if (this._recursivlyDoAction(baseObject, currentSubTarget.targetDesc, currentSubAction.action, currentSubAction.actionDesc)) {
                                        console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Job] [Success] ").concat(currentSubAction.actionDesc));
                                    }
                                    else if (currentSubAction.skipIfActionFailed) {
                                        console.warn("[WARN] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Job] [Skip] ").concat(currentSubAction.actionDesc, "."));
                                        isSkippedSubAction = true;
                                    }
                                    else {
                                        console.error("[ERROR] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Job] [Failed] ").concat(currentSubAction.actionDesc, ", exit."));
                                        isInterrupted = true;
                                        break;
                                    }
                                }
                                else if (currentSubTarget.skipIfTargetNonExistent) {
                                    console.warn("[WARN] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [UI-Object] [Timeout] ").concat(currentSubTarget.targetDesc, "."));
                                    isSkippedSubAction = true;
                                }
                                else {
                                    console.error("[ERROR] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [UI-Object] [Failed] ").concat(currentSubTarget.targetDesc, ", exit."));
                                    isInterrupted = true;
                                    break;
                                }
                            }
                            else {
                                // No targets for current sub-action, directly apply action
                                console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [UI-Object] [Skip] No definitions, directly apply job."));
                                console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Job] [Start] ").concat(currentSubAction.actionDesc, "."));
                                if (currentSubAction.action()) {
                                    console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Job] [Success] ").concat(currentSubAction.actionDesc, "."));
                                }
                                else if (currentSubAction.skipIfActionFailed) {
                                    console.warn("[WARN] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Job] [Skip] ").concat(currentSubAction.actionDesc, "."));
                                }
                                else {
                                    console.error("[ERROR] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Job] [Failed] ").concat(currentSubAction.actionDesc, ", exit."));
                                    isInterrupted = true;
                                    break;
                                }
                            }
                        }
                        else {
                            console.warn("[WARN] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [Skip] ").concat(currentSubAction.actionDesc, ", due to timeout in Pre-Condition."));
                        }
                    }
                    catch (e) {
                        console.error("[ERROR] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Step ").concat(subActionIndex + 1, "/").concat(subActionTotal, "] [ERROR] ").concat(currentSubAction.actionDesc, ", with Error: ").concat(e));
                        isInterrupted = true;
                        break;
                    }
                    // Pause after taking sub-action
                    sleep(currentSubAction.sleepSecPostAction);
                    // Reset the index if repetitive is true
                    subActionIndex++;
                    if (currentAction.repetitive && subActionIndex === subActionTotal && subPreconditionTotal > 0 && this._waitForPreconditions(currentAction.preconditions[0])) {
                        subActionIndex = 0;
                    }
                }
            }
            else {
                console.warn("[WARN] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Skip] No sub-actions in \"").concat(currentAction.name, "\"."));
            }
            if (isInterrupted) {
                console.error("[ERROR] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Failed] ").concat(currentAction.name, ", exit."));
            }
            else {
                console.info("[INFO] [Action ".concat(actionIndex + 1, "/").concat(actionTotalCount, "] [Success] ").concat(currentAction.name));
            }
        }
    };
    AutoxAutomatorEngine.prototype._waitForPreconditions = function (precondition) {
        if (precondition.waitForActivityDisappearance) {
            return this._waitForActivityDisappear(precondition.waitForActivityDisappearance, precondition.timeoutForWaitingSec);
        }
        else if (precondition.waitForElementAppearance) {
            return this._waitForElementAppear(precondition.waitForElementAppearance, precondition.timeoutForWaitingSec);
        }
        else if (precondition.waitForElementDisappearance) {
            return this._waitForElementDisappear(precondition.waitForElementDisappearance, precondition.timeoutForWaitingSec);
        }
        return true;
    };
    AutoxAutomatorEngine.prototype._waitForActivityDisappear = function (activity, timeout, period) {
        if (timeout === void 0) { timeout = 300000; }
        if (activity) {
            var start = Date.now();
            while (currentActivity() == activity) {
                if (timeout > 0 && Date.now() - start > timeout) {
                    return false;
                }
                sleep(period ? period : const_1.DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL);
            }
        }
        return true;
    };
    AutoxAutomatorEngine.prototype._waitForElementAppear = function (element, timeout, period) {
        if (timeout === void 0) { timeout = 60000; }
        if (element) {
            var start = Date.now();
            while (!element.exists()) {
                if (timeout > 0 && Date.now() - start > timeout) {
                    return false;
                }
                sleep(period ? period : const_1.DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL);
            }
        }
        return true;
    };
    AutoxAutomatorEngine.prototype._waitForElementDisappear = function (element, timeout, period) {
        if (timeout === void 0) { timeout = 300000; }
        if (element) {
            var start = Date.now();
            while (element.exists()) {
                if (timeout > 0 && Date.now() - start > timeout) {
                    return false;
                }
                sleep(period ? period : const_1.DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL);
            }
        }
        return true;
    };
    AutoxAutomatorEngine.prototype._recursivlyDoAction = function (target, selectorDesc, actionFunc, actionDesc) {
        if (actionFunc(target)) {
            console.info("[INFO] Found \"".concat(selectorDesc, "\", and applied \"").concat(actionDesc, "\"."));
            return true;
        }
        else {
            console.warn("[WARN] Found \"".concat(selectorDesc, "\", but failed to apply \"").concat(actionDesc, "\". Start to retry with ancestors for ").concat(const_1.MAX_ANCESTOR_COUNT, " times."));
            var currentLevel = 0;
            while (currentLevel < const_1.MAX_ANCESTOR_COUNT) {
                currentLevel += 1;
                var parent_1 = target.parent();
                if (parent_1) {
                    if (actionFunc(parent_1)) {
                        console.info("[INFO] Found [LV-".concat(currentLevel, "] ancestor of \"").concat(selectorDesc, "\", and applied \"").concat(actionDesc, "\"."));
                        return true;
                    }
                    else {
                        console.warn("[WARN] Found [LV-".concat(currentLevel, "] ancestor of \"").concat(selectorDesc, "\", but failed to apply \"").concat(actionDesc, "\"."));
                        target = parent_1;
                    }
                }
                else {
                    console.error("[ERROR] Can NOT find [LV-".concat(currentLevel, "] ancestor of \"").concat(selectorDesc, "\", so failed to apply \"").concat(actionDesc, "\"."));
                    return false;
                }
            }
            console.error("[ERROR] Retried with ancestors of \"".concat(selectorDesc, "\" for ").concat(const_1.MAX_ANCESTOR_COUNT, " times, so failed to apply \"").concat(actionDesc, "\"."));
            return false;
        }
    };
    AutoxAutomatorEngine.prototype.beautify = function (action) {
        action.preconditions = action.preconditions ? action.preconditions : [];
        action.targets = action.targets ? action.targets : [];
        action.actions = action.actions ? action.actions : [];
        action.repetitive = action.repetitive ? action.repetitive : false;
        action.preconditions.forEach(function (pre) {
            pre.timeoutForWaitingSec = pre.timeoutForWaitingSec === undefined ? const_1.DEFAULT_MAX_WAIT_FOR_PRECONDITIONS_SEC : pre.timeoutForWaitingSec;
            pre.skipIfTimeoutForWaiting = pre.skipIfTimeoutForWaiting === undefined ? false : pre.skipIfTimeoutForWaiting;
        });
        action.targets.forEach(function (tar) {
            tar.skipIfTargetNonExistent = tar.skipIfTargetNonExistent === undefined ? false : tar.skipIfTargetNonExistent;
            tar.maxWaitForFindingTargetSec = tar.maxWaitForFindingTargetSec === undefined ? const_1.DEFAULT_MAX_WAIT_FOR_FINDING_SEC : tar.maxWaitForFindingTargetSec;
        });
        action.actions.forEach(function (act) {
            act.skipIfActionFailed = act.skipIfActionFailed === undefined ? false : act.skipIfActionFailed;
            act.sleepSecPreAction = act.sleepSecPreAction === undefined ? const_1.DEFAULT_SLEEP_SEC_PRE_ACTION : act.sleepSecPreAction;
            act.sleepSecPostAction = act.sleepSecPostAction === undefined ? const_1.DEFAULT_SLEEP_SEC_POST_ACTION : act.sleepSecPostAction;
        });
        if (action.repetitive && (action.preconditions.length === 0 || action.preconditions.length >= 1
            && action.preconditions[0].waitForActivityDisappearance === undefined
            && action.preconditions[0].waitForElementAppearance === undefined
            && action.preconditions[0].waitForElementDisappearance === undefined)) {
            action.repetitive = false;
        }
        return action;
    };
    AutoxAutomatorEngine.prototype._init = function () {
        auto();
        device.wakeUpIfNeeded();
        // Wait for device up completely
        sleep(10000);
        setScreenMetrics(1080, 2040);
        console.show();
        sleep(200); //等待一会，才能设置尺寸成功
        console.setPosition(0, 0);
        console.setSize(device.width, device.height / 3);
        console.log(""); //刷新显示，解决尺寸无法无法刷新的问题
    };
    AutoxAutomatorEngine.prototype._kill = function () {
        // Open the APP setting page
        app.openAppSetting(this.packageName);
        // Wait for setting page be ready
        text(app.getAppName(this.packageName)).waitFor();
        // Click the button to terminate app
        // INVOKER.click(() => text("强行停止"), true, 2000, 2000);
        // INVOKER.click(() => text("强行停止"));
        text("强行停止").findOne().click();
        // Confirm the termination in dialog
        sleep(500);
        text("强行停止").findOne().click();
        // Back to home page
        sleep(500);
        back();
        console.hide();
    };
    return AutoxAutomatorEngine;
}());
exports.AutoxAutomatorEngine = AutoxAutomatorEngine;


/***/ }),

/***/ 456:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PredefinedAutoxActions = exports.AutoxActionDefault = exports.DEFAULT_SLEEP_SEC_POST_ACTION = exports.DEFAULT_SLEEP_SEC_PRE_ACTION = exports.DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL = exports.DEFAULT_MAX_WAIT_FOR_PRECONDITIONS_SEC = exports.DEFAULT_MAX_WAIT_FOR_FINDING_SEC = exports.MAX_ANCESTOR_COUNT = void 0;
exports.MAX_ANCESTOR_COUNT = 3;
exports.DEFAULT_MAX_WAIT_FOR_FINDING_SEC = 5000;
exports.DEFAULT_MAX_WAIT_FOR_PRECONDITIONS_SEC = 30000;
exports.DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL = 1000;
exports.DEFAULT_SLEEP_SEC_PRE_ACTION = 1000;
exports.DEFAULT_SLEEP_SEC_POST_ACTION = 1000;
exports.AutoxActionDefault = {
    "CLICK": function (ele) { return ele.click(); },
    "CLICK_DIRECTLY": function (ele) {
        var area = ele.bounds();
        return click(area.centerX(), area.centerY());
    },
};
exports.PredefinedAutoxActions = {
    "CLICK_TOP_MIDDLE": function () { return click(device.width / 2, 100); },
    "BACK": function () { return back(); }
};


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
var autox_automator_engine_1 = __webpack_require__(24);
var const_1 = __webpack_require__(456);
new autox_automator_engine_1.AutoxAutomatorEngine("com.ximalaya.ting.android")
    .addAction({
    id: 1, name: "处理[弹窗广告页面]",
    preconditions: [
        { waitForElementAppearance: id("main_iv_close"), preconditionDesc: "等待出现：[按钮] 关闭弹窗广告", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
    ],
    targets: [
        { target: id("main_iv_close"), targetDesc: "[按钮] 关闭弹窗广告" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 关闭弹窗广告" }
    ]
})
    .addAction({
    id: 2, name: "跳转至[会员特权页面]",
    preconditions: [
        { waitForElementAppearance: id("main_ll_title_bar"), preconditionDesc: "等待出现：[超链接] 会员特权" }
    ],
    targets: [
        { target: id("main_ll_title_bar"), targetDesc: "[超链接] 会员特权" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[超链接] 会员特权" }
    ]
})
    .addAction({
    id: 3, name: "处理[会员特权页面]",
    preconditions: [
        { waitForElementAppearance: text("剩余1次机会"), preconditionDesc: "等待出现：[文本] 剩余1次机会", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
    ],
    targets: [
        { target: text("剩余1次机会"), targetDesc: "[按钮] 立即抽奖", relativePathFunc: function (obj) { var _a; return (_a = obj.parent()) === null || _a === void 0 ? void 0 : _a.children()[0]; } }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 立即抽奖" },
        { action: const_1.PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
    ]
})
    .addAction({
    id: 4, name: "返回[首页]",
    actions: [
        { action: const_1.PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 5000 }
    ]
})
    .addAction({
    id: 5, name: "跳转至[我的页面]",
    preconditions: [
        { waitForElementAppearance: id("tab_myspace_and_listen"), preconditionDesc: "等待出现：[按钮] 我的" },
        { waitForElementAppearance: id("main_iv_entrance"), preconditionDesc: "等待出现：[按钮] 积分待领取" },
        { waitForElementAppearance: text("签到成功"), preconditionDesc: "等待出现：[对话框] 签到成功", timeoutForWaitingSec: 5000, skipIfTimeoutForWaiting: true }
    ],
    targets: [
        { target: id("tab_myspace_and_listen"), targetDesc: "[按钮] 我的" },
        { target: id("main_iv_entrance"), targetDesc: "[按钮] 积分待领取" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 我的" },
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 积分待领取" },
        { action: const_1.PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
    ]
})
    .addAction({
    id: 6, name: "处理[待领取福利]的[按钮]待领取",
    preconditions: [
        { waitForElementAppearance: text("待领取"), preconditionDesc: "等待出现：[按钮] 待领取", timeoutForWaitingSec: 5000, skipIfTimeoutForWaiting: true },
    ],
    targets: [
        { target: text("待领取"), targetDesc: "[按钮] 待领取" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 待领取" },
        { action: const_1.PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
    ]
})
    .addAction({
    id: 7, name: "处理[待领取福利]的[按钮]领取",
    preconditions: [
        { waitForElementAppearance: text("领取"), preconditionDesc: "等待出现：[按钮] 领取", timeoutForWaitingSec: 5000, skipIfTimeoutForWaiting: true }
    ],
    targets: [
        { target: text("领取"), targetDesc: "[按钮] 领取", skipIfTargetNonExistent: true }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 领取" },
        { action: const_1.PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
    ]
})
    .launch();

})();

/******/ })()
;