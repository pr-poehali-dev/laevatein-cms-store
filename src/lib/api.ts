const URLS = {
  auth: 'https://functions.poehali.dev/141d0b9c-5f1e-4ef6-87ee-d92a373f291b',
  orders: 'https://functions.poehali.dev/aa4074f6-6eaa-4b70-adf3-711ae908e561',
  downloads: 'https://functions.poehali.dev/5d4f7b73-ec27-4cdd-ac24-d3a777f1b14c',
  ask: 'https://functions.poehali.dev/086bae18-20de-4bad-a466-ed95e8c4d395',
  admin: 'https://functions.poehali.dev/a095ac16-c32e-48be-8ee3-6f5275ca6453',
};

async function post(url: string, body: object, headers?: Record<string, string>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(url: string, params?: Record<string, string>, headers?: Record<string, string>) {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(url + q, { headers: headers || {} });
  return res.json();
}

export const api = {
  register: (email: string, password: string, name: string) =>
    post(URLS.auth, { action: 'register', email, password, name }),

  login: (email: string, password: string) =>
    post(URLS.auth, { action: 'login', email, password }),

  resetRequest: (email: string) =>
    post(URLS.auth, { action: 'reset_request', email }),

  resetConfirm: (token: string, password: string) =>
    post(URLS.auth, { action: 'reset_confirm', token, password }),

  getLicenses: (user_id: number) =>
    get(URLS.orders, { user_id: String(user_id) }),

  createOrder: (user_id: number, email: string, items: string[]) =>
    post(URLS.orders, { user_id, email, items }),

  getDownloads: (user_id: number) =>
    get(URLS.downloads, { user_id: String(user_id) }),

  adminLogin: (login: string, password: string) =>
    post(URLS.admin, { action: 'login', login, password }),

  adminGet: (action: string, token: string, params?: Record<string, string>) =>
    get(URLS.admin, { action, ...(params || {}) }, { 'X-Admin-Token': token }),

  adminPost: (action: string, token: string, body: object) =>
    post(URLS.admin, { action, ...body }, { 'X-Admin-Token': token }),
};
