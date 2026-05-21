import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock our custom i18n navigation helpers to avoid ESM resolution issues in Jest
jest.mock('./src/lib/i18n/navigation', () => {
  const React = require('react');
  return {
    Link: props => React.createElement('a', props, props.children),
    useRouter: () => require('next/navigation').useRouter(),
    usePathname: () => require('next/navigation').usePathname(),
    redirect: url => require('next/navigation').useRouter().replace(url),
  };
});

// Mock Three.js
jest.mock('three', () => ({
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    remove: jest.fn(),
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { set: jest.fn() },
    lookAt: jest.fn(),
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
    domElement: document.createElement('canvas'),
  })),
  BoxGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn(),
  Mesh: jest.fn(),
  AmbientLight: jest.fn(),
  DirectionalLight: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: props => <img {...props} />,
}));

// Mock next-intl client-side functions using real en.json translations
jest.mock('next-intl', () => {
  const enTranslations = require('./src/lib/i18n/messages/en.json');
  return {
    NextIntlClientProvider: ({ children }) => <>{children}</>,
    useLocale: () => 'en',
    useTranslations: (namespace) => {
      const t = (key, values) => {
        let val = enTranslations;
        if (namespace) {
          const parts = namespace.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        if (key) {
          const parts = key.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        val = val || key;

        if (values) {
          Object.keys(values).forEach(k => {
            if (typeof values[k] === 'function') {
              val = values[k](val);
            } else {
              val = String(val).replace(new RegExp(`\\{${k}\\}`, 'g'), values[k]);
            }
          });
        }
        return val;
      };
      t.rich = (key, formatters) => {
        let val = enTranslations;
        if (namespace) {
          const parts = namespace.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        if (key) {
          const parts = key.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        val = val || key;

        if (!formatters) return val;

        const regex = /<(\w+)>(.*?)<\/\1>/g;
        let lastIndex = 0;
        const result = [];
        let match;
        const strVal = String(val);

        while ((match = regex.exec(strVal)) !== null) {
          const tag = match[1];
          const content = match[2];
          const offset = match.index;

          if (offset > lastIndex) {
            result.push(strVal.substring(lastIndex, offset));
          }

          let processedContent = content;
          Object.keys(formatters).forEach(k => {
            if (typeof formatters[k] !== 'function') {
              processedContent = processedContent.replace(new RegExp(`\\{${k}\\}`, 'g'), formatters[k]);
            }
          });

          if (formatters[tag] && typeof formatters[tag] === 'function') {
            result.push(formatters[tag](processedContent));
          } else {
            result.push(processedContent);
          }

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < strVal.length) {
          result.push(strVal.substring(lastIndex));
        }

        // Apply simple placeholder replacements to string chunks
        for (let i = 0; i < result.length; i++) {
          if (typeof result[i] === 'string') {
            Object.keys(formatters).forEach(k => {
              if (typeof formatters[k] !== 'function') {
                result[i] = result[i].replace(new RegExp(`\\{${k}\\}`, 'g'), formatters[k]);
              }
            });
          }
        }

        if (result.length === 0) return strVal;
        if (result.length === 1 && typeof result[0] === 'string') return result[0];
        return result;
      };
      t.raw = (key) => {
        let val = enTranslations;
        if (namespace) {
          const parts = namespace.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        if (key) {
          const parts = key.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        return val || key;
      };
      t.has = (key) => {
        let val = enTranslations;
        if (namespace) {
          const parts = namespace.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        if (key) {
          const parts = key.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        return val !== undefined;
      };
      return t;
    },
  };
});

jest.mock('next-intl/server', () => {
  const enTranslations = require('./src/lib/i18n/messages/en.json');
  return {
    getLocale: () => Promise.resolve('en'),
    getMessages: () => Promise.resolve(enTranslations),
    getTranslations: (config) => {
      const ns = typeof config === 'string' ? config : (config?.namespace || undefined);
      const t = (key, values) => {
        let val = enTranslations;
        if (ns) {
          const parts = ns.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        if (key) {
          const parts = key.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        val = val || key;

        if (values) {
          Object.keys(values).forEach(k => {
            if (typeof values[k] === 'function') {
              val = values[k](val);
            } else {
              val = String(val).replace(new RegExp(`\\{${k}\\}`, 'g'), values[k]);
            }
          });
        }
        return val;
      };
      t.rich = (key) => key;
      t.raw = (key) => {
        let val = enTranslations;
        if (ns) {
          const parts = ns.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        if (key) {
          const parts = key.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        return val || key;
      };
      t.has = (key) => {
        let val = enTranslations;
        if (ns) {
          const parts = ns.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        if (key) {
          const parts = key.split('.');
          for (const part of parts) {
            val = val?.[part];
          }
        }
        return val !== undefined;
      };
      return Promise.resolve(t);
    },
  };
});

if (typeof global.Request === 'undefined') {
  global.Request = class { };
}
if (typeof global.NextResponse === 'undefined') {
  global.NextResponse = {
    json: jest.fn(data => data),
  };
}
if (typeof global.Response === 'undefined') {
  global.Response = class {
    static json() {
      return {};
    }
  };
}

// Global Environment Mocks
process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.example.com';

// Mock Axios globally to preventing "interceptors of undefined" error
jest.mock('axios', () => {
  const actualAxios = jest.requireActual('axios');
  const mockAxiosInstance = {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    defaults: {
      headers: { common: {} },
      baseURL: '',
    },
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  return {
    ...actualAxios,
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
    ...mockAxiosInstance,
  };
});
