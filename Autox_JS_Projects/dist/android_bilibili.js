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
            this._doInternal();
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
        this._doInternal();
    };
    AutoxAutomatorEngine.prototype._doInternal = function () {
        var actionTotalCount = this.actions.length;
        var isInterrupted = false;
        for (var actionIndex = 0; !isInterrupted && actionIndex < actionTotalCount; actionIndex++) {
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
new autox_automator_engine_1.AutoxAutomatorEngine("tv.danmaku.bili")
    .addAction({
    name: "处理[青少年模式对话框]",
    preconditions: [
        { waitForElementAppearance: id("button").text("我知道了"), preconditionDesc: "等待出现：[按钮] 我知道了", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
    ],
    targets: [
        { target: id("button").text("我知道了"), targetDesc: "[按钮] 我知道了" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 我知道了" }
    ]
})
    .addAction({
    name: "跳转至[我的页面]",
    preconditions: [
        { waitForElementAppearance: text("我的"), preconditionDesc: "等待出现：[按钮] 我的" }
    ],
    targets: [
        { target: text("我的"), targetDesc: "[按钮] 我的" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 我的" }
    ]
})
    .addAction({
    name: "跳转至[会员中心]",
    preconditions: [
        { waitForElementAppearance: id("vip_info_layout_v2"), preconditionDesc: "等待出现：[超链接] 会员中心" }
    ],
    targets: [
        { target: id("vip_info_layout_v2"), targetDesc: "[超链接] 会员中心" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[超链接] 会员中心" }
    ]
})
    .addAction({
    name: "处理[限时优惠对话框]",
    preconditions: [
        { waitForElementAppearance: idMatches("canvasVip"), preconditionDesc: "等待出现：限时优惠对话框", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
    ],
    targets: [],
    actions: [
        { action: const_1.PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框" }
    ]
})
    .addAction({
    name: "处理[专属等级加速包]",
    preconditions: [
        { waitForElementAppearance: idMatches("drawExperienceModule"), preconditionDesc: "等待出现：[按钮] 领取" }
    ],
    targets: [
        { target: idMatches("drawExperienceModule"), targetDesc: "[按钮] 领取", relativePathFunc: function (obj) { return obj.findOne(text("领取")); }, skipIfTargetNonExistent: true }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 领取" }
    ]
})
    .addAction({
    name: "处理[大会员装扮权益专区]",
    preconditions: [
        { waitForElementAppearance: idMatches("vipEquityZoneModule"), preconditionDesc: "等待出现：[按钮] 立即领取", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
    ],
    targets: [
        { target: idMatches("vipEquityZoneModule"), targetDesc: "[按钮] 立即领取", relativePathFunc: function (obj) { return obj.findOne(text("立即领取")); }, skipIfTargetNonExistent: true }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 立即领取" }
    ]
})
    .addAction({
    name: "跳转至[权益精选页面]",
    preconditions: [
        { waitForElementAppearance: idMatches("vipBenefitsModule"), preconditionDesc: "等待出现：[超链接] 查看更多" }
    ],
    targets: [
        { target: idMatches("vipBenefitsModule"), targetDesc: "[超链接] 查看更多", relativePathFunc: function (obj) { return obj.findOne(text("查看更多")); } },
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[超链接] 查看更多", sleepSecPostAction: 10000 },
    ]
})
    .addAction({
    name: "处理[权益精选]",
    preconditions: [
        { waitForElementAppearance: text("立即领取"), preconditionDesc: "等待出现：[按钮] 立即领取", timeoutForWaitingSec: 5000, skipIfTimeoutForWaiting: true },
        { waitForElementAppearance: textMatches("(确定|取消)"), preconditionDesc: "等待出现：[按钮] 确定 / 取消" }
    ],
    targets: [
        { target: text("立即领取"), targetDesc: "[按钮] 立即领取" },
        { target: textMatches("(确定|取消)"), targetDesc: "[按钮] 确定 / 取消" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 立即领取" },
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 确定 / 取消" }
    ],
    repetitive: true
})
    .addAction({
    name: "返回至[会员中心]",
    actions: [
        { action: const_1.PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 5000 }
    ]
})
    .addAction({
    name: "跳转至[大积分商城页面]",
    preconditions: [
        { waitForElementAppearance: idMatches("bigPointModule"), preconditionDesc: "等待出现：[超链接] 查看更多" },
        { waitForElementAppearance: textMatches("(做任务得大积分|签到赚大积分.*)"), preconditionDesc: "等待出现：[按钮] 做任务得大积分 / 签到賺大积分" }
    ],
    targets: [
        { target: idMatches("bigPointModule"), targetDesc: "[超链接] 查看更多", relativePathFunc: function (obj) { return obj.findOne(text("查看更多")); } },
        { target: textMatches("(做任务得大积分|签到赚大积分.*)"), targetDesc: "[按钮] 做任务得大积分 / 签到賺大积分" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[超链接] 查看更多", sleepSecPostAction: 10000 },
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 做任务得大积分 / 签到得大积分", sleepSecPostAction: 5000 }
    ]
})
    .addAction({
    name: "处理[大积分商城]的[按钮]立即领取",
    preconditions: [
        { waitForElementAppearance: text("立即领取"), preconditionDesc: "等待出现：[按钮] 立即领取", timeoutForWaitingSec: 2000, skipIfTimeoutForWaiting: true }
    ],
    targets: [
        { target: text("立即领取"), targetDesc: "[按钮] 立即领取" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 立即领取", sleepSecPostAction: 3000 },
        { action: const_1.PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
    ],
    repetitive: true
})
    .addAction({
    name: "处理[大积分商城]的[按钮]去完成",
    preconditions: [
        { waitForElementAppearance: text("去完成"), preconditionDesc: "等待出现：[按钮] 去完成", timeoutForWaitingSec: 2000, skipIfTimeoutForWaiting: true }
    ],
    targets: [
        { target: text("去完成"), targetDesc: "[按钮] 去完成" }
    ],
    actions: [
        { action: const_1.AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 去完成", sleepSecPostAction: 15000 },
        { action: const_1.PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 3000 }
    ],
    repetitive: true
})
    .addAction({
    name: "返回至[会员中心]",
    actions: [
        { action: const_1.PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 3000 }
    ]
}).launch();

})();

/******/ })()
;