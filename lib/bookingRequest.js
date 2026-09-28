// A rejected or interrupted write must never become a successful UI update.
export async function bookingRequest(url, options = {}) {
  const response = await fetch(url, { cache: 'no-store', ...options });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'The request could not be completed. Refresh to check the latest booking status.');
  }
  if (data === null) throw new Error('The server returned an unreadable response. Refresh before trying again.');
  return data;
}
