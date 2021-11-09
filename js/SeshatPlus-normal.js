﻿(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jspdf')) :
    typeof define === 'function' && define.amd ? define(['jspdf'], factory) :
    (global = global || self, factory(global.jspdf));
}(this, (function (jspdf) { 'use strict';
var jsPDF = jspdf.jsPDF;
var callAddFont = function () {
this.addFileToVFS('SeshatPlus-normal.ttf', font);
this.addFont('SeshatPlus-normal.ttf', 'SeshatPlus', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])
})));