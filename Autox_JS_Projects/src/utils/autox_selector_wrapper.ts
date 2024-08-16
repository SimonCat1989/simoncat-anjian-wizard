export class AutoxSelectorWrapper {

    private static MAX_ANCESTOR_COUNT = 3;
    public static DEFAULT_MAX_WAIT_SEC_TIMEOUT = 5000;
    public static DEFAULT_WAIT_SEC_BEFORE_NEXT = 1000;
    public static DEFAULT_WAIT_SEC_BEFORE_APPLY = 5000;

    constructor(private isContinue: boolean = true) { }

    public pause(pauseTime?: number) {
        if (this.isContinue) {
            sleep(pauseTime ? pauseTime : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_APPLY);
        }
        return this;
    }

    public clickTopMiddleArea(waitSecBeforeApply?: number, waitSecBeforeNext?: number) {
        if (this.isContinue) {
            sleep(waitSecBeforeApply ? waitSecBeforeApply : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_APPLY);
            this.isContinue = click(device.width / 2, 100);
            sleep(waitSecBeforeNext ? waitSecBeforeNext : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_NEXT);
        }
        return this;
    }

    public clickById(selectorId: string, selectorFilterFunc?: (ele: AutoJs.UiSelector) => AutoJs.UiSelector,
        skipOnNonExistent?: boolean, maxWaitSecTimeout?: number, waitSecBeforeNext?: number): AutoxSelectorWrapper {
        return this.execute(id(selectorId), `[id] ${selectorId}`, (ele) => ele.click(), "[action] click", selectorFilterFunc,
            skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext);
    }

    public clickByText(selectorText: string, selectorFilterFunc?: (ele: AutoJs.UiSelector) => AutoJs.UiSelector,
        skipOnNonExistent?: boolean, maxWaitSecTimeout?: number, waitSecBeforeNext?: number): AutoxSelectorWrapper {
        return this.execute(text(selectorText), `[Text] ${selectorText}`, (ele) => ele.click(), "[action] click", selectorFilterFunc,
            skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext);
    }

    public setText(selectorId: string, desiredText: string, selectorFilterFunc?: (ele: AutoJs.UiSelector) => AutoJs.UiSelector,
        skipOnNonExistent?: boolean, maxWaitSecTimeout?: number, waitSecBeforeNext?: number): AutoxSelectorWrapper {
        return this.execute(id(selectorId), `[id] ${selectorId}`, (ele) => ele.setText(desiredText), `[action] setText ${desiredText}`,
            selectorFilterFunc, skipOnNonExistent, maxWaitSecTimeout, waitSecBeforeNext);
    }

    public clickDirectly(baseSelector: AutoJs.UiSelector, selectorDesc: string, 
        relativeFilterFunc?: (ele: AutoJs.UiObject) => AutoJs.UiObject | null | undefined, 
        skipOnNonExistent?: boolean, maxWaitSecTimeout?: number, waitSecBeforeNext?: number): AutoxSelectorWrapper {
        if (this.isContinue) {
            let baseObject = baseSelector.findOne(maxWaitSecTimeout ? maxWaitSecTimeout : AutoxSelectorWrapper.DEFAULT_MAX_WAIT_SEC_TIMEOUT);
            this.recursivlyApplyAction(baseObject && relativeFilterFunc ? relativeFilterFunc(baseObject) : baseObject, selectorDesc, 
                (ele) => ele.click(), "[action] click", skipOnNonExistent);
            sleep(waitSecBeforeNext ? waitSecBeforeNext : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_NEXT);
        }
        return this;
    }

    private execute(selector: AutoJs.UiSelector, selectorDesc: string, actionFunc: (ele: AutoJs.UiObject) => boolean,
        actionDesc: string, selectorFilterFunc?: (ele: AutoJs.UiSelector) => AutoJs.UiSelector,
        skipOnNonExistent?: boolean, maxWaitSecTimeout?: number, waitSecBeforeNext?: number): AutoxSelectorWrapper {

        if (this.isContinue) {
            this.recursivlyApplyAction((selectorFilterFunc ? selectorFilterFunc(selector) : selector)
                .findOne(maxWaitSecTimeout ? maxWaitSecTimeout : AutoxSelectorWrapper.DEFAULT_MAX_WAIT_SEC_TIMEOUT), selectorDesc,
                actionFunc, actionDesc, skipOnNonExistent);
            sleep(waitSecBeforeNext ? waitSecBeforeNext : AutoxSelectorWrapper.DEFAULT_WAIT_SEC_BEFORE_NEXT);
        }
        return this;
    }

    private recursivlyApplyAction(target: AutoJs.UiObject | null | undefined, selectorDesc: string,
        actionFunc: (ele: AutoJs.UiObject) => boolean, actionDesc: string, skipOnNonExistent?: boolean) {
        if (target) {
            if (actionFunc(target)) {
                console.info(`[INFO] Detected "${selectorDesc}", and applied "${actionDesc}".`);
            } else {
                console.info(`[WARN] Detected "${selectorDesc}", but failed to apply "${actionDesc}".`);
                let currentLevel = 0;
                let doneAction = false;
                while (currentLevel < AutoxSelectorWrapper.MAX_ANCESTOR_COUNT) {
                    currentLevel += 1;
                    let parent: AutoJs.UiObject | null = target.parent();
                    if (parent) {
                        if (actionFunc(parent)) {
                            console.info(`[INFO] Detected parent LV-${currentLevel} of "${selectorDesc}", and applied "${actionDesc}".`);
                            doneAction = true;
                            break;
                        } else {
                            console.info(`[ERROR] Detected parent LV-${currentLevel} of "${selectorDesc}", but failed to apply "${actionDesc}".`);
                            target = parent;
                        }
                    } else {
                        console.info(`[ERROR] NO Detected parent of LV-${currentLevel} "${selectorDesc}", and failed to apply "${actionDesc}".`);
                        break;
                    }
                }
                this.isContinue = doneAction;
            }
        } else if (skipOnNonExistent) {
            console.info(`[INFO] Skipped "${selectorDesc}" due to non-existent.`);
        } else {
            console.error(`[ERROR] Unable to detect "${selectorDesc}", skipped all following steps.`);
            this.isContinue = false
        }
    }
};

export const SINGLETON_WRAPPER = new AutoxSelectorWrapper()
