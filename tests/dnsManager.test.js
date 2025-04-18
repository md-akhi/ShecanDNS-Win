const DNSManager = require('../src/main/dnsManager');
const sudo = require('sudo-prompt');

jest.mock('sudo-prompt');

describe('DNSManager', () => {
  let dnsManager;

  beforeEach(() => {
    dnsManager = new DNSManager();
    sudo.exec.mockClear();
  });

  test('should set DNS successfully', async () => {
    sudo.exec.mockImplementation((cmd, options, callback) => {
      callback(null, 'Success', '');
    });

    const result = await dnsManager.setDNS('Ethernet', {
      primary: '8.8.8.8',
      secondary: '8.8.4.4'
    });

    expect(result.success).toBe(true);
  });

  test('should handle sudo errors', async () => {
    sudo.exec.mockImplementation((cmd, options, callback) => {
      callback(new Error('Permission denied'), '', 'Error');
    });

    const result = await dnsManager.setDNS('Ethernet', {
      primary: '8.8.8.8'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Permission denied');
  });
});