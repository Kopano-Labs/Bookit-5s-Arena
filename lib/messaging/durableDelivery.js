/** Recovered revision-keyed receipt/claim pattern from Bookit 73b7ce1.
 * A sent receipt means provider acceptance, never delivered/read evidence.
 * Ambiguous or abandoned sends are held for review, never blindly retried.
 */
export async function runDurableDelivery({ Model, key, recipientAddress, send }) {
  const address = String(recipientAddress || '').trim();
  await Model.init(); // await unique indexes before racing claims in a new DB
  let receipt;
  try {
    receipt = await Model.create({ ...key, recipientAddress: address || '[missing]',
      status: address ? 'queued' : 'skipped', error: address ? null : 'Missing destination' });
  } catch (error) {
    if (error?.code !== 11000) throw error;
    receipt = await Model.findOne(key);
  }
  if (!receipt) throw new Error('Delivery receipt unavailable');
  const summary = (record, extra = {}) => ({ deliveryId: String(record._id),
    status: record.status, provider: record.provider, ...extra });
  if (!address) return summary(receipt);
  const claimed = await Model.findOneAndUpdate({ _id: receipt._id,
    status: { $in: ['queued', 'failed', 'skipped'] } },
  { $set: { status: 'sending', recipientAddress: address, lastAttemptAt: new Date(), error: null },
    $inc: { attempts: 1 } }, { new: true });
  if (!claimed) return summary(await Model.findById(receipt._id), { duplicateSuppressed: true });
  let result;
  try { result = await send(String(receipt._id)); }
  catch { result = { uncertain: true, reason: 'Delivery outcome requires review' }; }
  const simulated = result?.mode === 'simulation' || result?.provider === 'simulation';
  const status = simulated || result?.skipped ? 'skipped' : result?.success === true ? 'sent'
    : result?.uncertain ? 'unknown' : 'failed';
  const updated = await Model.findByIdAndUpdate(receipt._id, { $set: { status,
    provider: result?.provider || result?.mode || null,
    providerMessageId: result?.providerMessageId || null,
    sentAt: status === 'sent' ? new Date() : null,
    error: status === 'sent' ? null : (result?.reason || 'Message not accepted') } }, { new: true });
  return summary(updated);
}
