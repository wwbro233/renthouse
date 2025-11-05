const COZE_SCRIPT_ID = 'coze-websdk';
const COZE_SCRIPT_SRC =
  'https://lf-cdn-tos.bytescm.com/obj/static/coze/cz-dashboard/CozeWebSDK/v1.0.0/webchat.umd.js';
const DEFAULT_CLIENT_OPTIONS = {
  token: 'sat_70nGuMFiKS8pajBwOb4QHc1WB3JyvJzN8tQVHCks57mrGT7I4sqcFpLzDX5VT4mD'
};

let loadPromise;

const injectScript = () =>
  new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('document is not available'));
      return;
    }

    const existing = document.getElementById(COZE_SCRIPT_ID);
    if (existing) {
      if (typeof window !== 'undefined' && window.CozeWebSDK) {
        resolve();
      } else {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = COZE_SCRIPT_ID;
    script.async = true;
    script.src = COZE_SCRIPT_SRC;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', () => reject(new Error('Failed to load Coze Web SDK')), {
      once: true
    });
    document.head.appendChild(script);
  });

export const initCozeChat = async (options = {}) => {
  if (typeof window === 'undefined') return null;
  if (window.__cozeChatClient) return window.__cozeChatClient;

  if (!loadPromise) {
    loadPromise = injectScript();
  }

  await loadPromise;

  if (!window.CozeWebSDK?.WebChatClient) {
    console.error('[Coze] WebChatClient not found on CozeWebSDK');
    return null;
  }

  const client = new window.CozeWebSDK.WebChatClient({
    config: {
      ...DEFAULT_CLIENT_OPTIONS,
      ...options.config
    },
    componentProps: {
      title: '智能AI客服',
      description: '随时解答您的疑问',
      layout: 'bubble',
      welcomeMessage: '您好，我是智能客服，有什么可以帮您？',
      ...options.componentProps
    }
  });

  window.__cozeChatClient = client;
  if (typeof client.mount === 'function') {
    client.mount();
  }
  return client;
};
