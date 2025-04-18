const Network = require('../src/main/network');
const { exec } = require('child_process');

// در بالای فایل تست
jest.setTimeout(10000); // افزایش timeout برای تست‌های طولانی


jest.mock('child_process');

describe('Network Module Tests', () => {
  let network;

  beforeEach(() => {
    network = new Network();
    exec.mockClear();
  });

  test('should parse interfaces correctly', async () => {
    const mockOutput = `
    Admin State    State          Type             Interface Name
    ----------    -----          ----             --------------
    Enabled       Connected      Dedicated        Ethernet
    Disabled      Disconnected   Dedicated        Wi-Fi
    `;

    exec.mockImplementation((cmd, callback) => {
      callback(null, mockOutput, '');
    });

    const interfaces = await network.getInterfaces();
    
    expect(interfaces).toHaveLength(1);
    expect(interfaces[0]).toEqual({
      name: 'Ethernet',
      adminState: 'Enabled',
      state: 'Connected',
      type: 'Dedicated'
    });
  });

  test('should handle exec error', async () => {
    exec.mockImplementation((cmd, callback) => {
      callback(new Error('Command failed'), '', 'Error occurred');
    });

    await expect(network.getInterfaces()).rejects.toThrow('Failed to get network interfaces');
  });
});