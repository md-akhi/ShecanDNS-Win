const DNSManager = require('../src/main/dnsManager');
const { performance } = require('perf_hooks');

// در بالای فایل تست
jest.setTimeout(10000); // افزایش timeout برای تست‌های طولانی


describe('Performance Tests', () => {
  test('DNS change should complete under 2 seconds', async () => {
    const dnsManager = new DNSManager();
    const start = performance.now();
    
    await dnsManager.setDNS('Ethernet', {
      primary: '8.8.8.8'
    });
    
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(2000); // 2 seconds
  });
});