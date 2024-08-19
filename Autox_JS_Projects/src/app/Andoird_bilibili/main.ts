import { AutoxAutomatorEngine } from '../../engine/autox_automator_engine';
import { AutoxActionDefault, PredefinedAutoxActions } from '../../engine/const';

new AutoxAutomatorEngine("tv.danmaku.bili")
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
            { target: text("我的"), targetDesc: "[按钮] 我的" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 我的" }
        ]
    })
    .addAction({
        id: 3, name: "跳转至[会员中心]",
        preconditions: [
            { waitForElementAppearance: id("vip_info_layout_v2"), preconditionDesc: "等待出现：[超链接] 会员中心" }
        ],
        targets: [
            { target: id("vip_info_layout_v2"), targetDesc: "[超链接] 会员中心" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[超链接] 会员中心" }
        ]
    })
    .addAction({
        id: 4, name: "处理[限时优惠对话框]",
        preconditions: [
            { waitForElementAppearance: idMatches("canvasVip"), preconditionDesc: "等待出现：限时优惠对话框", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
        ],
        targets: [],
        actions: [
            { action: PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框" }
        ]
    })
    .addAction({
        id: 5, name: "处理[专属等级加速包]",
        preconditions: [
            { waitForElementAppearance: idMatches("drawExperienceModule"), preconditionDesc: "等待出现：[按钮] 领取" }
        ],
        targets: [
            { target: idMatches("drawExperienceModule"), targetDesc: "[按钮] 领取", relativePathFunc: (obj) => obj.findOne(text("领取")), skipIfTargetNonExistent: true }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 领取" }
        ]
    })
    .addAction({
        id: 6, name: "处理[大会员装扮权益专区]",
        preconditions: [
            { waitForElementAppearance: idMatches("vipEquityZoneModule"), preconditionDesc: "等待出现：[按钮] 立即领取", timeoutForWaitingSec: 10000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: idMatches("vipEquityZoneModule"), targetDesc: "[按钮] 立即领取", relativePathFunc: (obj) => obj.findOne(text("立即领取")), skipIfTargetNonExistent: true }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 立即领取" }
        ]
    })
    .addAction({
        id: 7, name: "跳转至[权益精选页面]",
        preconditions: [
            { waitForElementAppearance: idMatches("vipBenefitsModule"), preconditionDesc: "等待出现：[超链接] 查看更多" }
        ],
        targets: [
            { target: idMatches("vipBenefitsModule"), targetDesc: "[超链接] 查看更多", relativePathFunc: (obj) => obj.findOne(text("查看更多")) },
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[超链接] 查看更多", sleepSecPostAction: 10000 },
        ]
    })
    .addAction({
        id: 8, name: "处理[权益精选]",
        preconditions: [
            { waitForElementAppearance: text("立即领取"), preconditionDesc: "等待出现：[按钮] 立即领取", timeoutForWaitingSec: 5000, skipIfTimeoutForWaiting: true },
            { waitForElementAppearance: textMatches("(确定|取消)"), preconditionDesc: "等待出现：[按钮] 确定 / 取消" }
        ],
        targets: [
            { target: text("立即领取"), targetDesc: "[按钮] 立即领取" },
            { target: textMatches("(确定|取消)"), targetDesc: "[按钮] 确定 / 取消" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 立即领取" },
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 确定 / 取消" }
        ],
        repetitive: true
    })
    .addAction({
        id: 9, name: "返回至[会员中心]",
        actions: [
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 5000 }
        ]
    })
    .addAction({
        id: 10, name: "跳转至[大积分商城页面]",
        preconditions: [
            { waitForElementAppearance: idMatches("bigPointModule"), preconditionDesc: "等待出现：[超链接] 查看更多" },
            { waitForElementAppearance: textMatches("(做任务得大积分|签到赚大积分.*)"), preconditionDesc: "等待出现：[按钮] 做任务得大积分 / 签到賺大积分" }
        ],
        targets: [
            { target: idMatches("bigPointModule"), targetDesc: "[超链接] 查看更多", relativePathFunc: (obj) => obj.findOne(text("查看更多")) },
            { target: textMatches("(做任务得大积分|签到赚大积分.*)"), targetDesc: "[按钮] 做任务得大积分 / 签到賺大积分" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[超链接] 查看更多", sleepSecPostAction: 10000 },
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 做任务得大积分 / 签到得大积分", sleepSecPostAction: 5000 }
        ]
    })
    .addAction({
        id: 11, name: "处理[大积分商城]的[按钮]立即领取",
        preconditions: [
            { waitForElementAppearance: text("立即领取"), preconditionDesc: "等待出现：[按钮] 立即领取", timeoutForWaitingSec: 2000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: text("立即领取"), targetDesc: "[按钮] 立即领取" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 立即领取", sleepSecPostAction: 3000 },
            { action: PredefinedAutoxActions.CLICK_TOP_MIDDLE, actionDesc: "点击：空白处关闭对话框", sleepSecPostAction: 3000 }
        ],
        repetitive: true
    })
    .addAction({
        id: 12, name: "处理[大积分商城]的[按钮]去完成",
        preconditions: [
            { waitForElementAppearance: text("去完成"), preconditionDesc: "等待出现：[按钮] 去完成", timeoutForWaitingSec: 2000, skipIfTimeoutForWaiting: true }
        ],
        targets: [
            { target: text("去完成"), targetDesc: "[按钮] 去完成" }
        ],
        actions: [
            { action: AutoxActionDefault.CLICK, actionDesc: "点击：[按钮] 去完成", sleepSecPostAction: 15000 },
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 3000 }
        ],
        repetitive: true
    })
    .addAction({
        id: 13, name: "返回至[会员中心]",
        actions: [
            { action: PredefinedAutoxActions.BACK, actionDesc: "点击：返回按键", sleepSecPostAction: 3000 }
        ]
    }).launch();