"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

var _utils = require("./utils");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Panda Sky Mixin: Neptune
// This mixin allocates the requested Neptune cluster into your CloudFormation stack.
var process;

process = (() => {
  var _ref = _asyncToGenerator(function* (SDK, config) {
    var c, cluster, env, i, j, ref, replicas, tags;
    // Start by extracting out the Neptune Mixin configuration:
    ({ env, tags = [] } = config);
    c = config.aws.environments[env].mixins.neptune;
    c = (0, _fairmont.isObject)(c) ? c : {};
    c.tags = (0, _fairmont.cat)(c.tags || [], tags);
    if (!config.aws.vpc) {
      throw new Error("The Neptune mixin can only be used in environments featuring a VPC.");
    }
    // Expand the cluster configuration with defaults.
    ({ cluster, tags } = c);
    if (!cluster.name) {
      c.cluster.name = config.environmentVariables.fullName;
    }
    if (!cluster.type) {
      c.cluster.type = "db.r4.large";
    }
    if (cluster.replicaCount == null) {
      cluster.replicaCount = 0;
    }
    if (!cluster.backupTTL) {
      cluster.backupTTL = 1;
    }
    if (!cluster.backupWindow) {
      cluster.backupWindow = "06:00-07:00"; // 11pm - 12am PST
    }
    if (!cluster.maintenanceWindow) {
      cluster.maintenanceWindow = "Wed:07:00-Wed:08:00"; // 12am - 1am PST
    }
    cluster.maintenanceWindow2 = (0, _utils.offset)(1, cluster.maintenanceWindow);
    if (cluster.allowMajorUpgrades == null) {
      cluster.allowMajorUpgrades = false;
    }
    if (cluster.allowMinorUpgrades == null) {
      cluster.allowMinorUpgrades = true;
    }
    if (cluster.kmsKey) {
      cluster.kmsKey = yield (0, _utils.keyLookup)(SDK, cluster.kmsKey);
    }
    // Create the read replica configuration based on the requested number of replicas.
    replicas = [];
    for (i = j = 0, ref = cluster.replicaCount; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      replicas.push({
        availabilityZone: (0, _utils.pickZone)(i),
        maintenanceWindow: (0, _utils.pickWindow)(i, cluster)
      });
    }
    return { tags, cluster, replicas };
  });

  return function process(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = process;