const { validateDNS } = require('../src/main/utils/validators');

// در بالای فایل تست
jest.setTimeout(10000); // افزایش timeout برای تست‌های طولانی


describe('Security Tests', () => {
  test('should reject invalid DNS addresses', () => {
    expect(validateDNS('8.8.8.8')).toBe(true);
    expect(validateDNS('1.1.1.1')).toBe(true);
    expect(validateDNS('invalid.dns')).toBe(false);
    expect(validateDNS('http://malicious.com')).toBe(false);
  });

  test('should prevent command injection', () => {
    const maliciousInput = '8.8.8.8 && rm -rf /';
    expect(validateDNS(maliciousInput)).toBe(false);
  });
});