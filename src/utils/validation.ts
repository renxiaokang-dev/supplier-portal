export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// 验证用户名/邮箱/手机号
export function validateLoginId(value: string): ValidationResult {
  if (!value) {
    return { isValid: false, error: '请输入用户名、邮箱或手机号' };
  }
  if (value.length < 3) {
    return { isValid: false, error: '输入内容过短' };
  }
  return { isValid: true };
}

// 验证密码
export function validatePassword(value: string): ValidationResult {
  if (!value) {
    return { isValid: false, error: '请输入密码' };
  }
  if (value.length < 6) {
    return { isValid: false, error: '密码至少需要6个字符' };
  }
  return { isValid: true };
}

// 验证密码强度
export function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  label: string;
  color: string;
  percentage: number;
} {
  if (!password) {
    return { strength: 'weak', label: '弱', color: '#ef4444', percentage: 0 };
  }

  let score = 0;
  
  // 长度
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // 包含数字
  if (/\d/.test(password)) score += 1;
  
  // 包含小写字母
  if (/[a-z]/.test(password)) score += 1;
  
  // 包含大写字母
  if (/[A-Z]/.test(password)) score += 1;
  
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score <= 2) {
    return { strength: 'weak', label: '弱', color: '#ef4444', percentage: 33 };
  } else if (score <= 4) {
    return { strength: 'medium', label: '中等', color: '#f59e0b', percentage: 66 };
  } else {
    return { strength: 'strong', label: '强', color: '#10b981', percentage: 100 };
  }
}

// 验证新密码
export function validateNewPassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: '请输入密码' };
  }
  if (password.length < 8) {
    return { isValid: false, error: '密码至少需要8个字符' };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, error: '密码必须包含数字' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, error: '密码必须包含字母' };
  }
  return { isValid: true };
}

// 验证确认密码
export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return { isValid: false, error: '请确认密码' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: '两次输入的密码不一致' };
  }
  return { isValid: true };
}

// 验证邮箱
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: '请输入邮箱地址' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '邮箱格式不正确' };
  }
  return { isValid: true };
}

// 验证手机号
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: '请输入手机号' };
  }
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: '手机号格式不正确' };
  }
  return { isValid: true };
}

// 验证验证码
export function validateVerificationCode(code: string): ValidationResult {
  if (!code) {
    return { isValid: false, error: '请输入验证码' };
  }
  if (code.length !== 6) {
    return { isValid: false, error: '验证码为6位数字' };
  }
  if (!/^\d{6}$/.test(code)) {
    return { isValid: false, error: '验证码必须为数字' };
  }
  return { isValid: true };
}

// 验证用户名
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { isValid: false, error: '请输入用户名' };
  }
  if (username.length < 3) {
    return { isValid: false, error: '用户名至少需要3个字符' };
  }
  if (username.length > 20) {
    return { isValid: false, error: '用户名最多20个字符' };
  }
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    return { isValid: false, error: '用户名只能包含字母、数字、下划线或中文' };
  }
  return { isValid: true };
}
