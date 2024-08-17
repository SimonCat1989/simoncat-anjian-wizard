export const MAX_ANCESTOR_COUNT = 3;
export const DEFAULT_MAX_WAIT_FOR_FINDING_SEC = 5000;
export const DEFAULT_MAX_WAIT_FOR_PRECONDITIONS_SEC = 30000;
export const DEFAULT_WAIT_FOR_PRECONDITIONS_SEC_INTERVAL = 1000;
export const DEFAULT_SLEEP_SEC_PRE_ACTION = 1000;
export const DEFAULT_SLEEP_SEC_POST_ACTION = 1000;

export const AutoxActionDefault = {
    "CLICK": (ele?: AutoJs.UiObject) => (ele as AutoJs.UiObject).click(),
    "CLICK_DIRECTLY": (ele?: AutoJs.UiObject) => {
        let area = (ele as AutoJs.UiObject).bounds();
        return click(area.centerX(), area.centerY());
    },
}

export const PredefinedAutoxActions = {
    "CLICK_TOP_MIDDLE": () => click(device.width / 2, 100),
    "BACK": () => back()
}