// @ts-nocheck
import { Plugin } from 'G:/_DemoProject/test-umi-todolist/node_modules/@umijs/runtime';

const plugin = new Plugin({
  validKeys: ['modifyClientRenderOpts','patchRoutes','rootContainer','render','onRouteChange','dva','getInitialState','request',],
});

export { plugin };
