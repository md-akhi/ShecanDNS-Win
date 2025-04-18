const Application = require('spectron').Application;
const path = require('path');
const electronPath = require('electron');

// در بالای فایل تست
jest.setTimeout(10000); // افزایش timeout برای تست‌های طولانی

describe('Application Launch', () => {
  let app;

  beforeEach(async () => {
    app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')],
      startTimeout: 10000,
      requireName: 'electronRequire'
    });
    await app.start();
  });

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  test('shows initial window', async () => {
    const count = await app.client.getWindowCount();
    expect(count).toBe(1);
  });

  test('displays app title', async () => {
    const title = await app.client.getTitle();
    expect(title).toBe('مدیریت DNS');
  });

  test('loads network interfaces', async () => {
    await app.client.waitUntilTextExists('#status-log', 'رابط شبکه بارگذاری شد', 5000);
    const interfaces = await app.client.$$('#interface-select option');
    expect(interfaces.length).toBeGreaterThan(0);
  });
});