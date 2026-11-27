// backend/src/services/sseHub.js
// Manages Server-Sent Events (SSE) connections per community space for real-time updates.

const channels = new Map(); // spaceId -> Set<res>

export function addSseClient(spaceId, res) {
  if (!channels.has(spaceId)) {
    channels.set(spaceId, new Set());
  }
  channels.get(spaceId).add(res);

  return () => {
    const clients = channels.get(spaceId);
    if (!clients) return;
    clients.delete(res);
    if (clients.size === 0) {
      channels.delete(spaceId);
    }
  };
}

export function broadcastToSpace(spaceId, eventName, payload) {
  const clients = channels.get(spaceId);
  if (!clients || clients.size === 0) return;

  const data = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const res of clients) {
    try {
      res.write(data);
    } catch {
      clients.delete(res);
    }
  }
}
