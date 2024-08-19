export interface AutoxAction {
    id: number;
    /**
      * Just a name of one particular action
      */
    name: string;
    preconditions?: Array<AutoxActionPrecondition>;
    targets?: Array<AutoxActionTarget>;
    actions: Array<AutoxActionAction>;
    repetitive?: boolean;
}

export interface AutoxActionPrecondition {
    waitForActivityDisappearance?: string;
    waitForElementAppearance?: AutoJs.UiSelector;
    waitForElementDisappearance?: AutoJs.UiSelector;
    preconditionDesc: string;
    timeoutForWaitingSec?: number;
    skipIfTimeoutForWaiting?: boolean;

}

export interface AutoxActionTarget {
    target: AutoJs.UiSelector;
    targetDesc: string;
    relativePathFunc?: (ele: AutoJs.UiObject) => AutoJs.UiObject | null | undefined;
    skipIfTargetNonExistent?: boolean;
    maxWaitForFindingTargetSec?: number;
}

export interface AutoxActionAction {
    action: (ele?: AutoJs.UiObject) => boolean;
    actionDesc: string;
    skipIfActionFailed?: boolean;
    sleepSecPreAction?: number;
    sleepSecPostAction?: number;
}

export interface AutoxActionDto extends AutoxAction {
    preconditions: Array<AutoxActionPreconditionDto>;
    targets: Array<AutoxActionTargetDto>;
    actions: Array<AutoxActionActionDto>;
    repetitive: boolean;
}

export interface AutoxActionPreconditionDto extends AutoxActionPrecondition {
    timeoutForWaitingSec: number;
    skipIfTimeoutForWaiting: boolean;

}

export interface AutoxActionTargetDto extends AutoxActionTarget {
    skipIfTargetNonExistent: boolean;
    maxWaitForFindingTargetSec: number;

}

export interface AutoxActionActionDto extends AutoxActionAction {
    skipIfActionFailed: boolean;
    sleepSecPreAction: number;
    sleepSecPostAction: number;
}