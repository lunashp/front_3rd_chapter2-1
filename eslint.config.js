import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  { files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser, // 브라우저 환경
        ...globals.node // Node.js 환경 추가
      }
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended
];
