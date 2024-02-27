import { ReplenishInterval } from "@prisma/client";
import { prisma } from "../prisma";

function getReplenishIntervalSeconds(interval: ReplenishInterval) {
  switch (interval) {
    case "TEN_SECONDS":
      return 10;
    case "MINUTE":
      return 60;
    case "HOUR":
      return 60 * 60;
    case "DAY":
      return 60 * 60 * 24;
  }
}

export function setupRateLimitReplenishCron() {
  replenishRateLimitLoop("TEN_SECONDS");
  replenishRateLimitLoop("MINUTE");
  replenishRateLimitLoop("HOUR");
  replenishRateLimitLoop("DAY");
}

function replenishRateLimitLoop(interval: ReplenishInterval) {
  const seconds = getReplenishIntervalSeconds(interval);
  setInterval(() => {
    prisma.$transaction([
      prisma.$queryRaw`UPDATE \`License\` SET \`validationPoints\` = \`validationLimit\` WHERE \`replenishInterval\` = ${interval} AND \`validationPoints\` >= \`validationLimit\` - \`replenishAmount\` AND \`validationPoints\` < \`validationLimit\``,
      prisma.$queryRaw`UPDATE \`License\` SET \`validationPoints\` = \`validationPoints\` + \`replenishAmount\` WHERE \`replenishInterval\` = ${interval} AND \`validationPoints\` < \`validationLimit\` - \`replenishAmount\``,
    ]);
  }, seconds * 1000);
}
