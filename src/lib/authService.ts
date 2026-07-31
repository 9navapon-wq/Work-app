export const getEmployeePassword = (employeeId: string): string => {
  const stored = localStorage.getItem('workhub_custom_passwords');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed[employeeId]) {
        return parsed[employeeId];
      }
    } catch (e) {
      console.error('Error parsing custom passwords:', e);
    }
  }
  // รหัสผ่านเริ่มต้นคือ รหัสพนักงาน (Employee ID)
  return employeeId;
};

export const setEmployeePassword = (employeeId: string, newPassword: string): void => {
  const stored = localStorage.getItem('workhub_custom_passwords');
  let passwordsMap: Record<string, string> = {};
  if (stored) {
    try {
      passwordsMap = JSON.parse(stored);
    } catch (e) {
      passwordsMap = {};
    }
  }
  passwordsMap[employeeId] = newPassword;
  localStorage.setItem('workhub_custom_passwords', JSON.stringify(passwordsMap));
};

export const hasCustomPassword = (employeeId: string): boolean => {
  const stored = localStorage.getItem('workhub_custom_passwords');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return Boolean(parsed[employeeId]);
    } catch (e) {
      return false;
    }
  }
  return false;
};
