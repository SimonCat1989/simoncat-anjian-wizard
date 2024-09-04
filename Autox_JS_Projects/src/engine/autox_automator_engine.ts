import {
    DEFAULT_SLEEP_SEC_PRE_ACTION,
    DEFAULT_MAX_WAIT_FOR_PRECONDITIONS_SEC,
    DEFAULT_SLEEP_SEC_POST_ACTION,
    DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL,
    DEFAULT_MAX_WAIT_FOR_FINDING_SEC,
    MAX_ANCESTOR_COUNT
} from './const'
import { AutoxAction, AutoxActionDto, AutoxActionPreconditionDto, } from './autox_action_def';

export class AutoxAutomatorEngine {

    constructor(
        /**
         * Create automator engine for each APP or package
         */
        private packageName: string,
        /**
         * All pre-defined action list
         * @default []
         */
        private actions: Array<AutoxActionDto> = []) { }

    addAction(action: AutoxAction): AutoxAutomatorEngine {
        this.actions.push(this.beautify(action));
        return this;
    }

    printActions(): void {
        this.actions.forEach((action) => {
            console.info("[INFO] ==================================");
            console.info(`name: ${action.name}`);
            action.preconditions.forEach((pre) => {
                console.info(`precondition: ${pre.waitForActivityDisappearance}, ${pre.waitForElementAppearance}, ${pre.waitForElementDisappearance}`);
                console.info(`preconditionDesc: ${pre.preconditionDesc}`);
                console.info(`timeoutForWaitingSec: ${pre.timeoutForWaitingSec}`);
                console.info(`skipIfTimeoutForWaiting: ${pre.skipIfTimeoutForWaiting}`);
            });
            action.targets.forEach((tar) => {
                console.info(`target: ${tar.target}`);
                console.info(`targetDesc: ${tar.targetDesc}`);
                console.info(`relativePathFunc: ${tar.relativePathFunc}`);
                console.info(`skipIfTargetNonExistent: ${tar.skipIfTargetNonExistent}`);
                console.info(`maxWaitForFindingTargetSec: ${tar.maxWaitForFindingTargetSec}`);
            });
            action.actions.forEach((act) => {
                console.info(`action: ${act.action}`);
                console.info(`actionDesc: ${act.actionDesc}`);
                console.info(`skipIfActionFailed: ${act.skipIfActionFailed}`);
                console.info(`sleepSecPreAction: ${act.sleepSecPreAction}`);
                console.info(`sleepSecPostAction: ${act.sleepSecPostAction}`);
            });
            console.info(`repetitive: ${action.repetitive}`);
        });
    }

    launch(): void {
        this._init();
        if (app.launch(this.packageName)) {
            console.info(`[INFO] [Success] Launched Package '${this.packageName}'`);
            sleep(5000);

            this._doInternal(0, this.actions.length);

            console.info("[INFO] ==================================");
            this._kill();
            console.info(`[INFO] [Success] Killed Package '${this.packageName}'. Programe is end.`);
            
        } else {
            console.info(`[ERROR] [Failed] Unable to Launch Package '${this.packageName}'`);
        }
        exit();
    }

    /**
     * 
     * @param command Input Action ID Range (e.g. '1,4') or single Action ID
     */
    test(command: string): void {
        if (command) {
            let actionIds = command.split(",");
            if (actionIds.length == 2) {
                this._doInternal(+actionIds[0] - 1, +actionIds[1]);
            } else if (actionIds.length == 1) {
                this._doInternal(+actionIds[0] - 1, +actionIds[0]);
            } else {
                console.error("[ERROR] Invalid input !");
            }
        }
    }

    private _doInternal(actionIndex: number, actionTotalCount: number): void {
        let isInterrupted = false;
        for (; !isInterrupted && actionIndex < actionTotalCount; actionIndex++) {
            let currentAction = this.actions[actionIndex];
            console.info("[INFO] ==================================");
            console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Start] ${currentAction.name}`);

            // Analyze sub-actions
            if (currentAction.actions.length > 0) {
                const subActionTotal = currentAction.actions.length;
                const subPreconditionTotal = currentAction.preconditions.length;
                const subTargetTotal = currentAction.targets.length;
                let subActionIndex = 0;
                let isSkippedAllSubActions = false;

                while (!isSkippedAllSubActions && subActionIndex < subActionTotal) {
                    let currentSubAction = currentAction.actions[subActionIndex];
                    let isSkippedSubAction = false;
                    console.info("[INFO] ----------------------------------");
                    // Pause before taking sub-action
                    sleep(currentSubAction.sleepSecPreAction);

                    if (subActionIndex < subPreconditionTotal) {
                        // Detected precondition for current sub-action
                        let currentSubPrecondition = currentAction.preconditions[subActionIndex];
                        console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Pre-Condition] [Start] ${currentSubPrecondition.preconditionDesc}.`);
                        if (!this._waitForPreconditions(currentSubPrecondition)) {
                            if (currentSubPrecondition.skipIfTimeoutForWaiting) {
                                isSkippedSubAction = true;
                                if (currentSubPrecondition.skipAllIfTimeoutForWaiting) {
                                    console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Pre-Condition] [Timeout] ${currentSubPrecondition.preconditionDesc}, skip all.`);
                                    isSkippedAllSubActions = true;
                                } else {
                                    console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Pre-Condition] [Timeout] ${currentSubPrecondition.preconditionDesc}, skip it.`);
                                }
                            } else {
                                console.error(`[ERROR] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Pre-Condition] [Failed] ${currentSubPrecondition.preconditionDesc}, exit.`);
                                isInterrupted = true;
                                break;
                            }
                        } else {
                            console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Pre-Condition] [Success] ${currentSubPrecondition.preconditionDesc}.`);
                        }
                    } else {
                        console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Pre-Condition] [Skip] No pre-conditions.`);
                    }

                    try {
                        if (!isSkippedSubAction) {
                            if (subActionIndex < subTargetTotal) {
                                // Detected targets for current sub-action
                                let currentSubTarget = currentAction.targets[subActionIndex];
                                console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [UI-Object] [Start] ${currentSubTarget.targetDesc}`);

                                let baseObject: AutoJs.UiObject | null | undefined = currentSubTarget.target.findOne(currentSubTarget.maxWaitForFindingTargetSec);
                                baseObject = (baseObject && currentSubTarget.relativePathFunc) ? currentSubTarget.relativePathFunc(baseObject) : baseObject;
                                if (baseObject) {
                                    console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [UI-Object] [Success] ${currentSubTarget.targetDesc}`);

                                    console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Start] ${currentSubAction.actionDesc}`);
                                    if (this._recursivlyDoAction(baseObject, currentSubTarget.targetDesc, currentSubAction.action, currentSubAction.actionDesc)) {
                                        console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Success] ${currentSubAction.actionDesc}`);
                                    } else if (currentSubAction.skipIfActionFailed) {
                                        if (currentSubAction.skipAllIfActionFailed) {
                                            console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Skip] ${currentSubAction.actionDesc}, skip all.`);
                                            isSkippedAllSubActions = true;
                                        } else {
                                            console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Skip] ${currentSubAction.actionDesc}, skip it.`);
                                        }
                                    } else {
                                        console.error(`[ERROR] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Failed] ${currentSubAction.actionDesc}, exit.`);
                                        isInterrupted = true;
                                        break;
                                    }
                                } else if (currentSubTarget.skipIfTargetNonExistent) {
                                    if (currentSubTarget.skipAllIfTargetNonExistent) {
                                        console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [UI-Object] [Timeout] ${currentSubTarget.targetDesc}, skip all.`);
                                        isSkippedAllSubActions = true;
                                    } else {
                                        console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [UI-Object] [Timeout] ${currentSubTarget.targetDesc}, skip it.`);
                                    }
                                } else {
                                    console.error(`[ERROR] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [UI-Object] [Failed] ${currentSubTarget.targetDesc}, exit.`);
                                    isInterrupted = true;
                                    break;
                                }
                            } else {
                                // No targets for current sub-action, directly apply action
                                console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [UI-Object] [Skip] No definitions, directly apply job.`);

                                console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Start] ${currentSubAction.actionDesc}.`);
                                if (currentSubAction.action()) {
                                    console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Success] ${currentSubAction.actionDesc}.`);
                                } else if (currentSubAction.skipIfActionFailed) {
                                    if (currentSubAction.skipAllIfActionFailed) {
                                        console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Skip] ${currentSubAction.actionDesc}, skip all.`);
                                        isSkippedAllSubActions = true;
                                    } else {
                                        console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Skip] ${currentSubAction.actionDesc}, skip it.`);
                                    }
                                } else {
                                    console.error(`[ERROR] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Job] [Failed] ${currentSubAction.actionDesc}, exit.`);
                                    isInterrupted = true;
                                    break;
                                }
                            }
                        } else {
                            console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [Skip] ${currentSubAction.actionDesc}, due to timeout in Pre-Condition.`);
                        }
                    } catch (e) {
                        console.error(`[ERROR] [Action ${actionIndex + 1}/${actionTotalCount}] [Step ${subActionIndex + 1}/${subActionTotal}] [ERROR] ${currentSubAction.actionDesc}, with Error: ${e}`);
                        isInterrupted = true;
                        break;
                    }

                    // Pause after taking sub-action
                    sleep(currentSubAction.sleepSecPostAction);

                    // Reset the index if repetitive is true
                    subActionIndex++;
                    if (currentAction.repetitive && subActionIndex === subActionTotal) {
                        subActionIndex = 0;
                    }
                }
            } else {
                console.warn(`[WARN] [Action ${actionIndex + 1}/${actionTotalCount}] [Skip] No sub-actions in "${currentAction.name}".`);
            }

            if (isInterrupted) {
                console.error(`[ERROR] [Action ${actionIndex + 1}/${actionTotalCount}] [Failed] ${currentAction.name}, exit.`);
            } else {
                console.info(`[INFO] [Action ${actionIndex + 1}/${actionTotalCount}] [Success] ${currentAction.name}`);
            }
        }
    }

    private _waitForPreconditions(precondition: AutoxActionPreconditionDto) {
        if (precondition.waitForActivityDisappearance) {
            return this._waitForActivityDisappear(precondition.waitForActivityDisappearance, precondition.timeoutForWaitingSec);
        } else if (precondition.waitForElementAppearance) {
            return this._waitForElementAppear(precondition.waitForElementAppearance, precondition.timeoutForWaitingSec);
        } else if (precondition.waitForElementDisappearance) {
            return this._waitForElementDisappear(precondition.waitForElementDisappearance, precondition.timeoutForWaitingSec);
        }
        return true;
    }

    private _waitForActivityDisappear(activity: string | undefined, timeout: number = 300000, period?: number): boolean {
        if (activity) {
            let start = Date.now();
            while (currentActivity() == activity) {
                if (timeout > 0 && Date.now() - start > timeout) {
                    return false;
                }
                sleep(period ? period : DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL);
            }
        }
        return true;
    }

    private _waitForElementAppear(element: AutoJs.UiSelector | undefined, timeout: number = 60000, period?: number): boolean {
        if (element) {
            let start = Date.now();
            while (!element.exists()) {
                if (timeout > 0 && Date.now() - start > timeout) {
                    return false;
                }
                sleep(period ? period : DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL);
            }
        }
        return true;
    }

    private _waitForElementDisappear(element: AutoJs.UiSelector | undefined, timeout: number = 300000, period?: number): boolean {
        if (element) {
            let start = Date.now();
            while (element.exists()) {
                if (timeout > 0 && Date.now() - start > timeout) {
                    return false;
                }
                sleep(period ? period : DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL);
            }
        }
        return true;
    }

    private _recursivlyDoAction(target: AutoJs.UiObject, selectorDesc: string | undefined, actionFunc: (ele: AutoJs.UiObject) => boolean,
        actionDesc: string | undefined): boolean {
        if (actionFunc(target)) {
            console.info(`[INFO] Found "${selectorDesc}", and applied "${actionDesc}".`);
            return true;
        } else {
            console.warn(`[WARN] Found "${selectorDesc}", but failed to apply "${actionDesc}". Start to retry with ancestors for ${MAX_ANCESTOR_COUNT} times.`);
            let currentLevel = 0;
            while (currentLevel < MAX_ANCESTOR_COUNT) {
                currentLevel += 1;
                let parent: AutoJs.UiObject | null = target.parent();
                if (parent) {
                    if (actionFunc(parent)) {
                        console.info(`[INFO] Found [LV-${currentLevel}] ancestor of "${selectorDesc}", and applied "${actionDesc}".`);
                        return true;
                    } else {
                        console.warn(`[WARN] Found [LV-${currentLevel}] ancestor of "${selectorDesc}", but failed to apply "${actionDesc}".`);
                        target = parent;
                    }
                } else {
                    console.error(`[ERROR] Can NOT find [LV-${currentLevel}] ancestor of "${selectorDesc}", so failed to apply "${actionDesc}".`);
                    return false;
                }
            }
            console.error(`[ERROR] Retried with ancestors of "${selectorDesc}" for ${MAX_ANCESTOR_COUNT} times, so failed to apply "${actionDesc}".`);
            return false;
        }
    }

    private beautify(action: AutoxAction): AutoxActionDto {
        action.preconditions = action.preconditions ? action.preconditions : [];
        action.targets = action.targets ? action.targets : [];
        action.actions = action.actions ? action.actions : [];
        action.repetitive = action.repetitive ? action.repetitive : false;

        action.preconditions.forEach((pre) => {
            pre.timeoutForWaitingSec = pre.timeoutForWaitingSec === undefined ? DEFAULT_MAX_WAIT_FOR_PRECONDITIONS_SEC : pre.timeoutForWaitingSec;
            pre.skipIfTimeoutForWaiting = pre.skipIfTimeoutForWaiting === undefined ? false : pre.skipIfTimeoutForWaiting;
            pre.skipAllIfTimeoutForWaiting = pre.skipAllIfTimeoutForWaiting === undefined ? true : pre.skipAllIfTimeoutForWaiting;
        });

        action.targets.forEach((tar) => {
            tar.skipIfTargetNonExistent = tar.skipIfTargetNonExistent === undefined ? false : tar.skipIfTargetNonExistent;
            tar.skipAllIfTargetNonExistent = tar.skipAllIfTargetNonExistent === undefined ? true : tar.skipAllIfTargetNonExistent;
            tar.maxWaitForFindingTargetSec = tar.maxWaitForFindingTargetSec === undefined ? DEFAULT_MAX_WAIT_FOR_FINDING_SEC : tar.maxWaitForFindingTargetSec;
        });

        action.actions.forEach((act) => {
            act.skipIfActionFailed = act.skipIfActionFailed === undefined ? false : act.skipIfActionFailed;
            act.skipAllIfActionFailed = act.skipAllIfActionFailed === undefined ? true : act.skipAllIfActionFailed;
            act.sleepSecPreAction = act.sleepSecPreAction === undefined ? DEFAULT_SLEEP_SEC_PRE_ACTION : act.sleepSecPreAction;
            act.sleepSecPostAction = act.sleepSecPostAction === undefined ? DEFAULT_SLEEP_SEC_POST_ACTION : act.sleepSecPostAction;
        });

        if (action.repetitive && (action.preconditions.length === 0 || action.preconditions.length >= 1
            && action.preconditions[0].waitForActivityDisappearance === undefined
            && action.preconditions[0].waitForElementAppearance === undefined
            && action.preconditions[0].waitForElementDisappearance === undefined)
        ) {
            action.repetitive = false;
        }

        return action as AutoxActionDto;
    }

    private _init() {
        auto();
        device.keepScreenOn(600000);
        // Wait for device up completely
        sleep(10000);

        setScreenMetrics(1080, 2040);
        console.hide();
        sleep(200); //等待一会，才能设置尺寸成功
        console.setPosition(0, 150);
        console.setSize(device.width, device.height / 3);
        console.log(""); //刷新显示，解决尺寸无法无法刷新的问题
    }

    private _kill() {
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
        textMatches("(确定|强行停止)").findOne().click();
        // Back to home page
        sleep(500);
        back();
        console.hide();
        device.cancelKeepingAwake();
    }
}