import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { validateEmail, validatePassword, validateVerificationCode } from '../utils/validation';
import LogoUpCnCr1WhQWl from '../imports/LogoUpCnCr1WhQWl1';
import LogoDownCt7Q2Wyl from '../imports/LogoDownCt7Q2Wyl1';
import svgPaths from '../imports/svg-6ie8qbnxdf';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [language, setLanguage] = useState<'zh' | 'en'>('en');

  // 步骤1：身份验证
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [step1Errors, setStep1Errors] = useState<{ email?: string; code?: string }>({});

  // 步骤2：重置密码
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step2Errors, setStep2Errors] = useState<{ password?: string; confirmPassword?: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 发送验证码
  const handleSendCode = () => {
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setStep1Errors({ email: validation.error });
      return;
    }
    setStep1Errors({});
    setCountdown(60);
    console.log('发送验证码至:', email);
  };

  // 验证身份
  const handleVerifyIdentity = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { email?: string; code?: string } = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    const codeValidation = validateVerificationCode(verificationCode);
    if (!codeValidation.isValid) {
      errors.code = codeValidation.error;
    }

    setStep1Errors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // 验证成功，进入下一步
    setCurrentStep(2);
  };

  // 重置密码
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { password?: string; confirmPassword?: string } = {};

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setStep2Errors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // 模拟密码重置
    setTimeout(() => {
      console.log('密码重置成功');
      setIsSubmitting(false);
      alert('Password has been reset successfully! Please login with your new password.');
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-[#0b5698] text-white h-16">
        <div className="flex items-center justify-between h-full pl-0 pr-6">
          <div className="flex items-center h-full">
            {/* Logo */}
            <div className="w-[200px] h-full flex items-end flex-shrink-0">
              <div className="w-full h-[60px]">
                <LogoUpCnCr1WhQWl />
              </div>
            </div>
          </div>

          {/* 右侧语言切换 */}
          <div className="flex items-center">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-white/10 transition-colors text-white rounded font-medium border border-white/30"
            >
              <span>{language === 'zh' ? '简体中文' : 'EN'}</span>
              <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 14.0219 8">
                <path d={svgPaths.p226cf2f0} fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 过渡条 */}
      <div className="relative h-4 bg-[#acc83e]">
        <div className="absolute left-0 top-0 h-4 w-[200px]">
          <LogoDownCt7Q2Wyl />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-lg shadow-md p-10">
            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-10">
              <div className="flex items-center gap-4">
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep === 1 
                      ? 'bg-[#055AA1] text-white' 
                      : 'bg-[#4ade80] text-white'
                  }`}>
                    {currentStep === 1 ? '1' : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep === 1 ? 'text-[#055AA1]' : 'text-gray-500'
                  }`}>
                    Identity Verification
                  </span>
                </div>

                {/* Divider */}
                <div className="w-12 h-0.5 bg-gray-300"></div>

                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep === 2 
                      ? 'bg-[#055AA1] text-white' 
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    2
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep === 2 ? 'text-[#055AA1]' : 'text-gray-400'
                  }`}>
                    Reset Password
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1: Identity Verification */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                  Identity Verification
                </h2>

                <form onSubmit={handleVerifyIdentity} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email address"
                      className={`mt-2 h-11 bg-white placeholder:text-gray-400 ${
                        step1Errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {step1Errors.email && (
                      <p className="text-sm text-red-500 mt-1">{step1Errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="code" className="text-gray-700 text-sm font-medium">
                      Verification Code
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit verification code"
                        maxLength={6}
                        className={`h-11 bg-white placeholder:text-gray-400 ${
                          step1Errors.code ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <Button
                        type="button"
                        onClick={handleSendCode}
                        disabled={countdown > 0}
                        variant="outline"
                        className="whitespace-nowrap border-gray-300 hover:border-[#055AA1] hover:text-[#055AA1] h-11 px-5"
                      >
                        {countdown > 0 ? `${countdown}s` : 'Send Code'}
                      </Button>
                    </div>
                    {step1Errors.code && (
                      <p className="text-sm text-red-500 mt-1">{step1Errors.code}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      If you don't receive the code, please check your email settings or click "Send Code" again after the countdown.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#055AA1] hover:bg-[#044a8a] text-white h-11 text-base font-medium mt-8"
                  >
                    Next Step
                  </Button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="text-sm text-[#055AA1] hover:underline font-medium"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Reset Password */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                  Reset Password
                </h2>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-700 text-sm font-medium">
                      New Password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className={`h-11 bg-white placeholder:text-gray-400 ${
                          step2Errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {step2Errors.password && (
                      <p className="text-sm text-red-500 mt-1">{step2Errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Password must be at least 8 characters long and contain letters and numbers.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 text-sm font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className={`h-11 bg-white placeholder:text-gray-400 ${
                          step2Errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {step2Errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">{step2Errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1 border-gray-300 hover:border-gray-400 h-11 text-base font-medium mt-8"
                    >
                      Previous Step
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#055AA1] hover:bg-[#044a8a] text-white h-11 text-base font-medium mt-8"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
