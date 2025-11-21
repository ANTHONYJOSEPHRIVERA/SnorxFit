// Sencilla cola offline persistida en localStorage
const KEY = 'snorxfit_offline_queue_v1';

export const loadQueue = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

export const saveQueue = (q) => {
  localStorage.setItem(KEY, JSON.stringify(q));
};

export const enqueueOp = (op) => {
  const q = loadQueue();
  q.push({ id: Date.now()+Math.random(), ...op });
  saveQueue(q);
  return op.id;
};

export const flushQueue = async (handlers) => {
  let q = loadQueue();
  const remaining = [];
  for (const item of q) {
    const fn = handlers[item.type];
    if (!fn) { remaining.push(item); continue; }
    try {
      const ok = await fn(item.payload);
      if (!ok) remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  saveQueue(remaining);
  return { flushed: q.length - remaining.length, remaining: remaining.length };
};
