#!/usr/bin/env node
import * as cluster from "cluster";
import { cpus } from "os";
import { runner } from "./app";

const clusteringEnabled = (process.env.CLUSTERING || "false").toLowerCase() === "true";

const execute = () => runner();
const executeClustering = () => cluster.isMaster ? cpus().forEach(cluster.fork) : runner();

if (clusteringEnabled) {
  executeClustering();
} else {
  execute();
}
