import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { useAuth } from '../context/AuthContext';
import {
  validateUsername,
  validateNewPassword,
  validateConfirmPassword,
  getPasswordStrength,
} from '../utils/validation';
import LogoUpCnCr1WhQWl from '../imports/LogoUpCnCr1WhQWl1';

export function AccountSetup() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      username?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      newErrors.username = usernameValidation.error;
    }

    const passwordValidation = validateNewPassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
    }

    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.error;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // 模拟提交请求
    setTimeout(() => {
      if (user) {
        updateUser({
          username,
          isFirstLogin: false,
        });
      }
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
  };

  // 密码要求列表
  const passwordRequirements = [
    { label: '至少8个字符', met: password.length >= 8 },
    { label: '包含数字', met: /\d/.test(password) },
    { label: '包含字母', met: /[a-zA-Z]/.test(password) },
    { label: '包含大写字母（推荐）', met: /[A-Z]/.test(password), optional: true },
    { label: '包含特殊字符（推荐）', met: /[!@#$%^&*(),.?":{}|<>]/.test(password), optional: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b5698] to-[#0d679f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 返回演示按钮 */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/demo')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回演示页面
          </Button>
        </div>

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-48 h-12 bg-white rounded-lg p-2">
            <LogoUpCnCr1WhQWl />
          </div>
        </div>

        {/* 设置卡片 */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 text-center">账户设置</h1>
            <p className="text-sm text-gray-500 text-center mt-2">
              首次登录，请完善您的账户信息
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名 */}
            <div>
              <Label htmlFor="username">用户名 *</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名（3-20个字符）"
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                可使用字母、数字、下划线或中文
              </p>
            </div>

            {/* 密码 */}
            <div>
              <Label htmlFor="password">设置密码 *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className={errors.password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}

              {/* 密码强度指示器 */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">密码强度：</span>
                    <span style={{ color: passwordStrength.color }} className="font-medium">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <Progress
                    value={passwordStrength.percentage}
                    className="h-2"
                    style={{
                      '--progress-color': passwordStrength.color,
                    } as React.CSSProperties}
                  />
                </div>
              )}

              {/* 密码要求 */}
              <div className="mt-3 space-y-1.5">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {req.met ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 确认密码 */}
            <div>
              <Label htmlFor="confirmPassword">确认密码 *</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
              {!errors.confirmPassword && confirmPassword && password === confirmPassword && (
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-green-600">密码一致</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0b5698] hover:bg-[#0d679f] mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? '提交中...' : '完成设置'}
            </Button>
          </form>
        </div>

        <p className="text-center text-white text-sm mt-6">
          © 2026 供应商门户系统. All rights reserved.
        </p>
      </div>
    </div>
  );
}