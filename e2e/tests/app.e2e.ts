
import {setupBrowserHooks, getBrowserState} from './utils';

describe('App test', function () {
  setupBrowserHooks();
  it('is running', async function () {
    const {page} = getBrowserState();
    const element = await page.locator('::-p-text(fuse)').wait();

    expect(element).not.toBeNull();

  });
});
