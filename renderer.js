window.addEventListener('DOMContentLoaded', async () => {
    // Load interfaces
    const interfaces = await window.electronAPI.getInterfaces()
    const interfaceSelect = document.getElementById('interfaceSelect')
    interfaces.forEach(intf => {
      const option = document.createElement('option')
      option.value = intf
      option.textContent = intf
      interfaceSelect.appendChild(option)
    })
  
    // Load profiles
  await refreshProfilesList()
  })
  
  async function refreshProfiles() {
    const profiles = await window.electronAPI.loadProfiles()
    const profileSelect = document.getElementById('profileSelect')
    profileSelect.innerHTML = ''
    profiles.forEach(profile => {
      const option = document.createElement('option')
      option.value = profile.name
      option.textContent = profile.name
      profileSelect.appendChild(option)
    })
  }
  
  async function applySettings() {
    const config = {
      interfaceName: document.getElementById('interfaceSelect').value,
      dnsServers: [
        document.getElementById('dns1').value,
        document.getElementById('dns2').value
      ],
      dot: document.getElementById('dotCheck').checked,
      dotServer: document.getElementById('dotServer').value,
      doh: document.getElementById('dohCheck').checked,
      dohServer: document.getElementById('dohServer').value
    }
  
    try {
      await window.electronAPI.setDNS(config)
      alert('تنظیمات با موفقیت اعمال شد!')
    } catch (error) {
      alert('خطا در اعمال تنظیمات: ' + error.message)
    }
  }
  
// تابع ذخیره پروفایل
async function saveProfile() {
  const currentConfig = {
    name: document.getElementById('profileName').value || `پروفایل_${new Date().toISOString()}`,
    dns1: document.getElementById('dns1').value,
    dns2: document.getElementById('dns2').value,
    dotEnabled: document.getElementById('dotCheck').checked,
    dotServer: document.getElementById('dotServer').value,
    dohEnabled: document.getElementById('dohCheck').checked,
    dohServer: document.getElementById('dohServer').value,
    interface: document.getElementById('interfaceSelect').value,
    createdAt: new Date().toISOString()
  }

  const result = await window.electronAPI.saveProfile(currentConfig)
  if (result.success) {
    alert('پروفایل با موفقیت ذخیره شد')
    await refreshProfilesList()
  } else {
    alert(`خطا در ذخیره پروفایل: ${result.error}`)
  }
}

// تابع بارگذاری لیست پروفایل‌ها
async function refreshProfilesList() {
  const profiles = await window.electronAPI.loadProfiles()
  const profileSelect = document.getElementById('profileSelect')
  
  profileSelect.innerHTML = ''
  profiles.forEach(profile => {
    const option = document.createElement('option')
    option.value = profile.name
    option.textContent = profile.name
    profileSelect.appendChild(option)
  })
}

// تابع بارگذاری پروفایل
async function loadSelectedProfile() {
  const profileName = document.getElementById('profileSelect').value
  if (!profileName) return

  const profiles = await window.electronAPI.loadProfiles()
  const selectedProfile = profiles.find(p => p.name === profileName)

  if (selectedProfile) {
    document.getElementById('dns1').value = selectedProfile.dns1 || ''
    document.getElementById('dns2').value = selectedProfile.dns2 || ''
    document.getElementById('dotCheck').checked = selectedProfile.dotEnabled || false
    document.getElementById('dotServer').value = selectedProfile.dotServer || ''
    document.getElementById('dohCheck').checked = selectedProfile.dohEnabled || false
    document.getElementById('dohServer').value = selectedProfile.dohServer || ''
    document.getElementById('interfaceSelect').value = selectedProfile.interface || ''
  }
}

// تابع حذف پروفایل
async function deleteProfile() {
  const profileName = document.getElementById('profileSelect').value
  if (!profileName) {
    alert('لطفاً یک پروفایل انتخاب کنید')
    return
  }

  const confirmDelete = confirm(`آیا مطمئن هستید که می‌خواهید پروفایل "${profileName}" را حذف کنید؟`)
  if (confirmDelete) {
    const result = await window.electronAPI.deleteProfile(profileName)
    if (result.success) {
      alert('پروفایل با موفقیت حذف شد')
      await refreshProfilesList()
    } else {
      alert(`خطا در حذف پروفایل: ${result.error}`)
    }
  }
}

  
  async function resetDNS() {
    const interfaceName = document.getElementById('interfaceSelect').value;
    if (!interfaceName) {
      alert('لطفاً یک اینترفیس شبکه انتخاب کنید');
      return;
    }
  
    try {
      await window.electronAPI.resetDNS(interfaceName);
      alert('تنظیمات DNS با موفقیت به حالت پیش‌فرض بازگردانده شد!');
    } catch (error) {
      alert(error.message);
    }
  }