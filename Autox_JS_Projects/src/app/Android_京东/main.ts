import { AutoxAutomatorEngine } from '../../engine/autox_automator_engine';
import { AutoxActionDefault, PredefinedAutoxActions } from '../../engine/const';

new AutoxAutomatorEngine("com.jingdong.app.mall")
    .addAction({
        name: "处理[青少年模式对话框]",
        preconditions: [
            { waitForElementAppearance: id("button").text("我知道了"), preconditionDesc: "等待出现：[按钮] 我知道了", timeoutForWaitingSec: 15000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: id("button").text("我知道了"), targetDesc: "[按钮] 我知道了" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 我知道了" }
        ]
    })
    .addAction({
        name: "跳转至[领京豆]",
        preconditions: [
            { waitForElementAppearance: text("领京豆"), preconditionDesc: "等待出现：[按钮] 领京豆" }
        ],
        targets: [
            { target: text("领京豆"), targetDesc: "[按钮] 领京豆" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 领京豆" }
        ]
    })
    .addAction({
        name: "处理[签到领豆]",
        preconditions: [
            { waitForElementAppearance: text("签到领豆"), preconditionDesc: "等待出现：[按钮] 签到领豆", skipIfTimeoutForWaiting: true, timeoutForWaitingSec: 10000 }
        ],
        targets: [
            { target: text("签到领豆"), targetDesc: "[按钮] 签到领豆" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 签到领豆", sleepSecPostAction: 10000 }
        ]
    })
    .addAction({
        name: "处理[双签领豆]",
        preconditions: [
            { waitForElementAppearance: idMatches("secKill_bean_sign_view"), preconditionDesc: "等待出现：[按钮] 双签领豆" },
            { preconditionDesc: "等待点击：[按钮] 返回按键" },
            { waitForElementAppearance: text("后会有期"), preconditionDesc: "等待出现：[按钮] 后会有期", skipIfTimeoutForWaiting: true, timeoutForWaitingSec: 5000 },
        ],
        targets: [
            { target: idMatches("secKill_bean_sign_view"), targetDesc: "[按钮] 双签领豆", relativePathFunc: (ele) => ele.parent()?.children()[1], skipIfTargetNonExistent: true }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 双签领豆", sleepSecPostAction: 10000 },
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键" },
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键" }
        ]
    })
    .addAction({
        name: "跳转至弹窗[升级赚京豆]",
        preconditions: [
            { waitForElementAppearance: idMatches("homeTaskListButton"), preconditionDesc: "等待出现：[按钮] 赚京豆" }
        ],
        targets: [
            { target: idMatches("homeTaskListButton"), targetDesc: "[按钮] 赚京豆" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 赚京豆" }
        ]
    })
    .addAction({
        name: "处理其他任务[领豆]",
        preconditions: [
            { waitForElementAppearance: text("收下奖励"), preconditionDesc: "等待出现：[按钮] 收下奖励", skipIfTimeoutForWaiting: true, timeoutForWaitingSec: 5000, skipAllIfTimeoutForWaiting: false },
            { waitForElementAppearance: text("去完成"), preconditionDesc: "等待出现：[按钮] 去完成", skipIfTimeoutForWaiting: true, timeoutForWaitingSec: 5000 }
        ],
        targets: [
            { target: text("收下奖励"), targetDesc: "[按钮] 收下奖励" },
            { target: text("去完成"), targetDesc: "[按钮] 去完成" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK_DIRECTLY, actionDesc: "点击：[按钮] 收下奖励" },
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 去完成", sleepSecPostAction: 7000 },
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 3000 }
        ],
        repetitive: true
    })
    .launch();