import { AutoxAutomatorEngine } from '../../engine/autox_automator_engine';
import { AutoxActionDefault, PredefinedAutoxActions } from '../../engine/const';

new AutoxAutomatorEngine("com.ximalaya.ting.android")
    .addAction({
        name: "处理[弹窗广告页面]",
        preconditions: [
            { waitForElementAppearance: id("main_iv_close"), preconditionDesc: "等待出现：[按钮] 关闭弹窗广告", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: id("main_iv_close"), targetDesc: "[按钮] 关闭弹窗广告" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 关闭弹窗广告" }
        ]
    })
    .addAction({
        name: "跳转至[会员特权页面]",
        preconditions: [
            { waitForElementAppearance: id("main_ll_title_bar"), preconditionDesc: "等待出现：[超链接] 会员特权" }
        ],
        targets: [
            { target: id("main_ll_title_bar"), targetDesc: "[超链接] 会员特权" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[超链接] 会员特权" }
        ]
    })
    .addAction({
        name: "处理[会员特权页面]",
        preconditions: [
            { waitForElementAppearance: text("剩余1次机会"), preconditionDesc: "等待出现：[文本] 剩余1次机会", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: text("剩余1次机会"), targetDesc: "[按钮] 立即抽奖", relativePathFunc: (obj) => obj.parent()?.children()[0] }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 立即抽奖" },
            { action: PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
        ]
    })
    .addAction({
        name: "返回[首页]",
        actions: [
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 5000 }
        ]
    })
    .addAction({
        name: "跳转至[我的页面]",
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
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 我的" },
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 积分待领取" },
            { action: PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
        ]
    })
    .addAction({
        name: "处理[待领取福利]的[按钮]待领取",
        preconditions: [
            { waitForElementAppearance: text("待领取"), preconditionDesc: "等待出现：[按钮] 待领取", timeoutForWaitingSec: 5000, skipIfTimeoutForWaiting: true },
        ],
        targets: [
            { target: text("待领取"), targetDesc: "[按钮] 待领取" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 待领取" },
            { action: PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
        ]
    })
    .addAction({
        name: "处理[待领取福利]的[按钮]领取",
        preconditions: [
            { waitForElementAppearance: text("领取"), preconditionDesc: "等待出现：[按钮] 领取", timeoutForWaitingSec: 5000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: text("领取"), targetDesc: "[按钮] 领取", skipIfTargetNonExistent: true }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 领取" },
            { action: PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
        ]
    })
    .launch();