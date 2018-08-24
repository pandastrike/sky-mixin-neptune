"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

var _utils = require("./utils");

// Panda Sky Mixin: Neptune
// This mixin allocates the requested Neptune cluster into your CloudFormation stack.
var process;

process = function (SDK, config) {
  var c, cluster, env, tags;
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
  if (!cluster.backupWindow) {
    cluster.backupWindow = "06:00-07:00"; // 11pm - 12am PST
  }
  if (!cluster.maintenanceWindow) {
    cluster.maintenanceWindow = "Wed:07:00-Wed:08:00"; // 12am - 1am PST
    cluster.replicaMaintenanceWindow = (0, _utils.offset)(1, cluster.maintenanceWindow);
  }
  if (cluster.allowMajorUpgrades == null) {
    cluster.allowMajorUpgrades = false;
  }
  return { tags, cluster };
};

exports.default = process;