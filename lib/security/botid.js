import { checkBotId } from "botid/server";

export async function verifyBotRequest() {
  try {
    return await checkBotId();
  } catch (error) {
    console.warn("BotID verification skipped:", error.message);
    return {
      isBot: false,
      isHuman: true,
      bypassed: true,
      skipped: true,
      reason: error.message,
    };
  }
}
