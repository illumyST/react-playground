import {
  createSystem,
  defaultConfig,
  defineConfig,
  type SystemStyleObject,
} from '@chakra-ui/react';
import colors from './colors';

/** Chakra 只作用在這個 class 底下，避免 preflight / html 樣式影響 playground 其他 Tailwind 頁面 */
export const MOCK_ADMIN_SCOPE_CLASS = 'mock-admin-scope';
const scope = `.${MOCK_ADMIN_SCOPE_CLASS}`;

const {
  html,
  '*::placeholder, *[data-placeholder]': placeholder,
  '*::selection': selection,
  ...restGlobalCss
} = (defaultConfig.globalCss ?? {}) as Record<string, SystemStyleObject>;

// 預設的 html 規則（color / bg / lineHeight）改套用到 scope 容器；其餘 `*` 規則只是 CSS 變數，維持原樣。
const scopedDefaultConfig = {
  ...defaultConfig,
  preflight: { scope },
  globalCss: {
    ...restGlobalCss,
    [scope]: html,
    [`${scope} *::placeholder, ${scope} *[data-placeholder]`]: placeholder,
    [`${scope} *::selection`]: selection,
  },
};

const config = defineConfig({
  theme: {
    tokens: {
      colors,
    },
  },
  globalCss: {
    '.read-the-docs': {
      color: '#888',
    },

    '.jsoneditor': {
      border: '0 !important',
    },

    '.jsoneditor-menu': {
      backgroundColor: '#d1d1d1 !important',
      borderBottom: '1px solid #fff !important',
    },

    '.jsoneditor-menu>button, .jsoneditor-menu>.jsoneditor-modes>button': {
      backgroundColor: '#000 !important',
      borderRadius: '5px !important',
    },

    '.jsoneditor-menu>button:hover, .jsoneditor-menu>.jsoneditor-modes>button:hover': {
      opacity: '0.6 !important',
    },
  },
});

export const system = createSystem(scopedDefaultConfig, config);
