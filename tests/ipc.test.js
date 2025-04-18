const { ipcMain } = require('electron');
const { setupIPC } = require('../src/main/main');

// در بالای فایل تست
jest.setTimeout(10000); // افزایش timeout برای تست‌های طولانی


describe('IPC Communication Tests', () => {
  beforeAll(() => {
    setupIPC();
  });

  test('should handle get-interfaces request', async () => {
    const mockEvent = {
      reply: jest.fn()
    };

    ipcMain.emit('get-interfaces', mockEvent);
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockEvent.reply).toHaveBeenCalled();
  });
});