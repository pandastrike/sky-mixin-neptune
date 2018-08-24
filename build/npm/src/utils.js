"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offset = undefined;

require("datejs");

var offset, update;

update = function (shift, time) {
  var day, hour, minute;
  [day, hour, minute] = time.split(":");
  hour = parseInt(hour, 10);
  minute = parseInt(minute, 10);
  return Date.parse(`next ${day}`).set({ hour, minute }).add(shift).hour().toString("ddd:HH:mm");
};

exports.offset = offset = function (shift, range) {
  var end, start;
  [start, end] = range.split("-");
  return `${update(shift, start)}-${update(shift, end)}`;
};

exports.offset = offset;