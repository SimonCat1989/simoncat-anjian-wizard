/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

// console.info(app.getPackageName("喜马拉雅"));
var PACKAGE_NAME = "tv.danmaku.bili";
var MAX_PARENT_LEVEL = 3;
var NEED_PRINT_ALL = true;
var PRINT_PARENT = true;
var TARGET_ELE = "";
if (NEED_PRINT_ALL) {
    console.info("Package ".concat(currentPackage()));
    console.info("Activity ".concat(currentActivity()));
    packageName(PACKAGE_NAME).clickable().find().forEach(function (tv) { return printWell("clickable", tv); });
    packageName(PACKAGE_NAME).clickable(false).find().forEach(function (tv) { return printWell("non-clickable", tv); });
}
if (!NEED_PRINT_ALL) {
    var currentLevel_1 = 0;
    var theOne = text(TARGET_ELE).findOne(2000);
    printWell("LEVEL-0", theOne);
    while (theOne && currentLevel_1 < MAX_PARENT_LEVEL) {
        currentLevel_1 += 1;
        if (PRINT_PARENT) {
            theOne = theOne.parent();
            if (theOne) {
                printWell("LEVEL-".concat(currentLevel_1, " Parent"), theOne);
                theOne.children().forEach(function (tv) { return printWell("LEVEL-".concat(currentLevel_1, " Child"), tv); });
            }
            else {
                console.info("No parent any more with target ".concat(TARGET_ELE));
            }
        }
    }
}
function printWell(section, tv) {
    if (tv) {
        var id_1 = tv.id();
        var text_1 = tv.text();
        var drawingOrder_1 = tv.drawingOrder();
        var bounds_1 = tv.bounds();
        console.info("[".concat(section, "][id]").concat(id_1, ",[text]").concat(text_1, ",[drawingOrder]").concat(drawingOrder_1, ",[bounds]").concat(bounds_1));
    }
}

/******/ })()
;