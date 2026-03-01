import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import {
  validatePassword,
  validateNewPassword,
  validateConfirmPassword,
  getPasswordStrength,
} from '../utils/validation';
import { toast } from 'sonner@2.0.3';

export function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    const currentPasswordValidation = validatePassword(currentPassword);
    if (!currentPasswordValidation.isValid) {
      newErrors.currentPassword = currentPasswordValidation.error;
    }

    const newPasswordValidation = validateNewPassword(newPassword);
    if (!newPasswordValidation.isValid) {
      newErrors.newPassword = newPasswordValidation.error;
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = '新密码不能与当前密码相同';
    }

    const confirmPasswordValidation = validateConfirmPassword(newPassword, confirmPassword);
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
      setIsSubmitting(false);
      toast.success('密码修改成功！');
      navigate('/');
    }, 1000);
  };

  // 密码要求列表
  const passwordRequirements = [
    { label: '至少8个字符', met: newPassword.length >= 8 },
    { label: '包含数字', met: /\d/.test(newPassword) },
    { label: '包含字母', met: /[a-zA-Z]/.test(newPassword) },
    { label: '包含大写字母（推荐）', met: /[A-Z]/.test(newPassword), optional: true },
    { label: '包含特殊字符（推荐）', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword), optional: true },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>

        {/* 主卡片 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">修改密码</h1>
            <p className="text-sm text-gray-500 mt-2">
              为了账户安全，请定期更换密码
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 当前密码 */}
            <div>
              <Label htmlFor="currentPassword">当前密码 *</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="请输入当前密码"
                  className={errors.currentPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
              )}
            </div>

            <div className="border-t pt-6">
              {/* 新密码 */}
              <div className="mb-6">
                <Label htmlFor="newPassword">新密码 *</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="请输入新密码"
                    className={errors.newPassword ? 'border-red-500' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
                )}

                {/* 密码强度指示器 */}
                {newPassword && (
                  <div className="mt-3 space-y-2">
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
                <div className="mt-4 space-y-1.5 bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-700 mb-2">密码要求：</p>
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

              {/* 确认新密码 */}
              <div>
                <Label htmlFor="confirmPassword">确认新密码 *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入新密码"
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
                {!errors.confirmPassword && confirmPassword && newPassword === confirmPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-sm text-green-600">密码一致</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#0b5698] hover:bg-[#0d679f]"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '确认修改'}
              </Button>
            </div>
          </form>
        </div>

        {/* 安全提示 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">安全提示</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• 密码长度至少8个字符，建议使用字母、数字和特殊字符的组合</li>
            <li>• 不要使用与用户名相同的密码</li>
            <li>• 建议定期更换密码，增强账户安全性</li>
            <li>• 不要在多个网站使用相同的密码</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
