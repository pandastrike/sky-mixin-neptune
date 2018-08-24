"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyLookup = exports.pickWindow = exports.pickZone = exports.offset = undefined;

require("datejs");

var _fairmont = require("fairmont");

var _sundog = require("sundog");

var _sundog2 = _interopRequireDefault(_sundog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var keyLookup, offset, pickWindow, pickZone, update;

exports.keyLookup = keyLookup = (() => {
  var _ref = _asyncToGenerator(function* (SDK, name) {
    var Arn, e, get;
    ({
      AWS: {
        KMS: { get }
      }
    } = yield (0, _sundog2.default)(SDK));
    try {
      ({ Arn } = yield get(`alias/${name}`));
      return Arn;
    } catch (error) {
      e = error;
      throw new Error(`The KMS key "${name}" is not found.`);
    }
  });

  return function keyLookup(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

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

// We have 2 availability zones.  Stagger the placement and configurations of the cluster's read replicas between them.
exports.pickZone = pickZone = function (index) {
  var zone;
  zone = (0, _fairmont.even)(index) ? 1 : 0;
  return `[${zone}, "Fn::Split": [",", {"Ref": AvailabilityZones}]]`;
};

exports.pickWindow = pickWindow = function (index, { maintenanceWindow, maintenanceWindow2 }) {
  if ((0, _fairmont.even)(index)) {
    return maintenanceWindow2;
  } else {
    return maintenanceWindow;
  }
};

exports.offset = offset;
exports.pickZone = pickZone;
exports.pickWindow = pickWindow;
exports.keyLookup = keyLookup;