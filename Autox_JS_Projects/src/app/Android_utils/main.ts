// console.info(app.getPackageName("喜马拉雅"));

var PACKAGE_NAME = "tv.danmaku.bili";
var MAX_PARENT_LEVEL = 3;
var NEED_PRINT_ALL = true;
var PRINT_PARENT = true;
var TARGET_ELE = "";

if (NEED_PRINT_ALL) {
    console.info(`Package ${currentPackage()}`);
    console.info(`Activity ${currentActivity()}`);
    packageName(PACKAGE_NAME).clickable().find().forEach((tv) => printWell("clickable", tv));
    packageName(PACKAGE_NAME).clickable(false).find().forEach((tv) => printWell("non-clickable", tv));
}

if (!NEED_PRINT_ALL) {
    let currentLevel = 0;
    let theOne: AutoJs.UiObject | null = text(TARGET_ELE).findOne(2000);
    printWell("LEVEL-0", theOne);
    while (theOne && currentLevel < MAX_PARENT_LEVEL) {
        currentLevel += 1;
        if (PRINT_PARENT) {
            theOne = theOne.parent();
            if (theOne) {
                printWell(`LEVEL-${currentLevel} Parent`, theOne);
                theOne.children().forEach((tv) => printWell(`LEVEL-${currentLevel} Child`, tv));
            } else {
                console.info(`No parent any more with target ${TARGET_ELE}`);
            }
        }
    }
}


function printWell(section:string, tv:AutoJs.UiObject | null) {
    if (tv) {
        let id = tv.id();
        let text = tv.text();
        let drawingOrder = tv.drawingOrder()
        let bounds = tv.bounds();
        console.info(`[${section}][id]${id},[text]${text},[drawingOrder]${drawingOrder},[bounds]${bounds}`);
    }
}