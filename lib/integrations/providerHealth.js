import { getISportsProviderHealth } from "@/lib/sports/isports";
import { getYouTubeProviderHealth } from "@/lib/media/youtube";

export async function getProviderHealthSnapshot() {
  const [sports, youtube] = await Promise.all([
    getISportsProviderHealth(),
    getYouTubeProviderHealth(),
  ]);

  return {
    checkedAt: new Date().toISOString(),
    sports,
    youtube,
  };
}
