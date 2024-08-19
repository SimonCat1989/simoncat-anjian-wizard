import { AutoxAutomatorEngine } from '../../engine/autox_automator_engine';
import { AutoxActionDefault, PredefinedAutoxActions } from '../../engine/const';

new AutoxAutomatorEngine("com.jingdong.app.mall")
    .addAction({
        id: 1, name: "处理[青少年模式对话框]",
        preconditions: [
            { waitForElementAppearance: id("button").text("我知道了"), preconditionDesc: "等待出现：[按钮] 我知道了", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: id("button").text("我知道了"), targetDesc: "[按钮] 我知道了" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 我知道了" }
        ]
    })
    .addAction({
        id: 2, name: "跳转至[我的页面]",
        preconditions: [
            { waitForElementAppearance: text("我的"), preconditionDesc: "等待出现：[按钮] 我的" }
        ],
        targets: [
            { target: text("我的"), targetDesc: "[按钮] 我的", relativePathFunc: (ele) => ele.parent()?.children()[2] }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 我的" }
        ]
    })
    .addAction({
        id: 3, name: "跳转至[我的京豆]",
        preconditions: [
            { waitForElementAppearance: text("签到领豆"), preconditionDesc: "等待出现：[按钮] 签到领豆" }
        ],
        targets: [
            { target: text("签到领豆"), targetDesc: "[按钮] 签到领豆" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 签到领豆" }
        ]
    })
    .addAction({
        id: 4, name: "跳转至[签到领豆]",
        preconditions: [
            { waitForElementAppearance: textMatches("(去签到领京豆|已签到)"), preconditionDesc: "等待出现：[按钮] 去签到领京豆 / 已签到", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: textMatches("(去签到领京豆|已签到)"), targetDesc: "[按钮] 去签到领京豆 / 已签到" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK_DIRECTLY, actionDesc: "点击：[按钮] 去签到领京豆 / 已签到" }
        ]
    })
    .addAction({
        id: 5, name: "处理[签到领豆]",
        preconditions: [
            { waitForElementAppearance: text("签到领豆"), preconditionDesc: "等待出现：[按钮] 签到领豆", skipIfTimeoutForWaiting: true, timeoutForWaitingSec: 5000 }
        ],
        targets: [
            { target: text("签到领豆"), targetDesc: "[按钮] 签到领豆" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 签到领豆", sleepSecPostAction: 5000 }
        ]
    })
    .addAction({
        id: 6, name: "跳转至弹窗[赚更多京豆]",
        preconditions: [
            { waitForElementAppearance: idMatches("homeSignButton"), preconditionDesc: "等待出现：[按钮] 赚更多京豆" }
        ],
        targets: [
            { target: idMatches("homeSignButton"), targetDesc: "[按钮] 赚更多京豆" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 签到领豆" }
        ]
    })
    .addAction({
        id: 7, name: "处理[双签领豆]",
        preconditions: [
            { waitForElementAppearance: textStartsWith("双签领豆"), preconditionDesc: "等待出现：[文本] 双签领豆", skipIfTimeoutForWaiting: true, timeoutForWaitingSec: 5000 }
        ],
        targets: [
            { target: textStartsWith("双签领豆"), targetDesc: "[按钮] 去完成", relativePathFunc: (ele) => ele.parent()?.findOne(text("去完成")), skipIfTargetNonExistent: true }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 去完成", sleepSecPostAction: 7000 },
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 3000 },
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 3000 }
        ]
    })
    .addAction({
        id: 8, name: "处理其他任务[领豆]",
        preconditions: [
            { waitForElementAppearance: text("去完成"), preconditionDesc: "等待出现：[按钮] 去完成", skipIfTimeoutForWaiting: true, timeoutForWaitingSec: 5000 }
        ],
        targets: [
            { target: text("去完成"), targetDesc: "[按钮] 去完成" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 去完成", sleepSecPostAction: 7000 },
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 3000 }
        ],
        repetitive: true
    })
    .test();