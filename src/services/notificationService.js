const headersFor = (user, json = false) => ({
  ...(json ? { 'Content-Type': 'application/json' } : {}),
  'x-user-id': user?.id || '',
  'x-user-email': user?.email || '',
});

async function request(path, user, options = {}) {
  const response = await fetch(`/api/notifications${path}`, { ...options, headers: { ...headersFor(user, Boolean(options.body)), ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Notification service request failed');
  return body;
}

export const notificationService = {
  preferences: (user) => request('/preferences', user),
  updatePreferences: (user, preferences) => request('/preferences', user, { method: 'PUT', body: JSON.stringify(preferences) }),
  connectTelegram: (user) => request('/telegram/connect', user, { method: 'POST' }),
  disconnectTelegram: (user) => request('/telegram/disconnect', user, { method: 'POST' }),
  testTelegram: (user) => request('/telegram/test', user, { method: 'POST' }),
  history: (user) => request('/history', user),
  emit: (user, event) => request('/events', user, { method: 'POST', body: JSON.stringify(event) }),
};
