import { initBotId } from "botid/client/core";
import { BOTID_PROTECTED_ROUTES } from "@/lib/security/botRoutes";

initBotId({
  protect: BOTID_PROTECTED_ROUTES,
});
