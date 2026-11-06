// Keep the bearer credential out of HTTP URLs and referrers.
export function guestManagementPath(id, token) {
  if (!/^[a-f\d]{24}$/i.test(String(id)) || !/^[A-Za-z0-9_-]{43}$/.test(String(token))) return null;
  return `/book/manage/${id}#token=${token}`;
}
