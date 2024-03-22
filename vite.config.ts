import { defineConfig, ConfigEnv, UserConfigExport } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default function ({}: ConfigEnv): UserConfigExport {
  return defineConfig({
    plugins: [tsconfigPaths()],
    build: {
      assetsDir: '.',
    },
  });
}