import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Smartphone, Package, TrendingUp, Shield, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { 
  validateLoginId, 
  validatePassword, 
  validateEmail, 
  validatePhone, 
  validateVerificationCode 
} from '../utils/validation';
import LogoUpCnCr1WhQWl from '../imports/LogoUpCnCr1WhQWl1';
import LogoDownCt7Q2Wyl from '../imports/LogoDownCt7Q2Wyl1';
import svgPaths from '../imports/svg-6ie8qbnxdf';

interface LoginProps {
  isFirstLogin?: boolean;
}

export function Login({ isFirstLogin = false }: LoginProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // 密码登录表单
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ loginId?: string; password?: string }>({});
  
  // 验证码登录表单 - Email
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [emailAgreedToPolicy, setEmailAgreedToPolicy] = useState(false);
  const [emailErrors, setEmailErrors] = useState<{ email?: string; code?: string }>({});
  
  // 验证码登录表单 - SMS
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [smsCountdown, setSmsCountdown] = useState(0);
  const [smsAgreedToPolicy, setSmsAgreedToPolicy] = useState(false);
  const [smsErrors, setSmsErrors] = useState<{ phone?: string; code?: string }>({});
  
  const [activeTab, setActiveTab] = useState<'password' | 'code'>(isFirstLogin ? 'code' : 'password');
  const [activeCodeTab, setActiveCodeTab] = useState<'email' | 'sms'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState<'zh' | 'en'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // 倒计时效果
  useEffect(() => {
    if (emailCountdown > 0) {
      const timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailCountdown]);

  useEffect(() => {
    if (smsCountdown > 0) {
      const timer = setTimeout(() => setSmsCountdown(smsCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [smsCountdown]);

  // 发送邮箱验证码
  const handleSendEmailCode = () => {
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setEmailErrors({ email: validation.error });
      return;
    }
    setEmailErrors({});
    setEmailCountdown(60);
    // 模拟发送验证码
    console.log('发送邮箱验证码至:', email);
  };

  // 发送短信验证码
  const handleSendSmsCode = () => {
    const validation = validatePhone(phone);
    if (!validation.isValid) {
      setSmsErrors({ phone: validation.error });
      return;
    }
    setSmsErrors({});
    setSmsCountdown(60);
    // 模拟发送验证码
    console.log('发送短信验证码至:', phone);
  };

  // 密码登录
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: { loginId?: string; password?: string } = {};
    
    const loginIdValidation = validateLoginId(loginId);
    if (!loginIdValidation.isValid) {
      errors.loginId = loginIdValidation.error;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
    }
    
    if (!agreedToPolicy) {
      // 可以添加更明显的提示
      return;
    }
    
    setLoginErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟登录请求
    setTimeout(() => {
      // 模拟登录成功
      login({
        id: '1',
        username: loginId,
        email: 'user@example.com',
        phone: '13800138000',
        isFirstLogin: false,
      });
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
  };

  // 验证码登录 - Email
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: { email?: string; code?: string } = {};
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }
    
    const codeValidation = validateVerificationCode(emailCode);
    if (!codeValidation.isValid) {
      errors.code = codeValidation.error;
    }
    
    if (!emailAgreedToPolicy) {
      return;
    }
    
    setEmailErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟登录请求
    setTimeout(() => {
      const user = {
        id: '2',
        username: '',
        email: email,
        phone: '',
        isFirstLogin: isFirstLogin,
      };
      login(user);
      setIsSubmitting(false);
      
      if (isFirstLogin) {
        navigate('/account-setup');
      } else {
        navigate('/');
      }
    }, 1000);
  };

  // 验证码登录 - SMS
  const handleSmsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: { phone?: string; code?: string } = {};
    
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    }
    
    const codeValidation = validateVerificationCode(smsCode);
    if (!codeValidation.isValid) {
      errors.code = codeValidation.error;
    }
    
    if (!smsAgreedToPolicy) {
      return;
    }
    
    setSmsErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟登录请求
    setTimeout(() => {
      const user = {
        id: '3',
        username: '',
        email: '',
        phone: phone,
        isFirstLogin: isFirstLogin,
      };
      login(user);
      setIsSubmitting(false);
      
      if (isFirstLogin) {
        navigate('/account-setup');
      } else {
        navigate('/');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation - 使用 query 页面样式 */}
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

      {/* Hero Section with Login */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0b5698] via-[#0d6ba8] to-[#1084c9]">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1619070284836-e850273d69ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2UlMjBtb2Rlcm58ZW58MXx8fHwxNzcwNzAyMzU2fDA&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-8 py-20">
          <div className="flex items-center justify-between gap-16">
            {/* Left Side - Marketing Content */}
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Global Logistics<br />Made Simple
              </h1>
              <p className="text-xl text-white/95 mb-4">
                Powerful cross-border e-commerce shipping solutions
              </p>
              <p className="text-lg text-white/90 mb-8">
                Connect with millions of customers worldwide through our reliable express delivery network
              </p>
              
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">200+</div>
                    <div className="text-sm text-white/90">Countries & Regions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm text-white/90">On-Time Delivery</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                  {isFirstLogin ? 'First Time Login' : 'Supplier Login'}
                </h2>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'password' | 'code')} className="w-full">
                  {!isFirstLogin && (
                    <TabsList className="grid w-full grid-cols-2 mb-6 h-11 bg-gray-100">
                      <TabsTrigger 
                        value="password"
                        className="data-[state=active]:bg-[#055AA1] data-[state=active]:text-white"
                      >
                        Password
                      </TabsTrigger>
                      <TabsTrigger 
                        value="code"
                        className="data-[state=active]:bg-[#055AA1] data-[state=active]:text-white"
                      >
                        Verification Code
                      </TabsTrigger>
                    </TabsList>
                  )}

                  {/* Password Login */}
                  {!isFirstLogin && (
                    <TabsContent value="password" className="mt-0">
                      <form onSubmit={handlePasswordLogin} className="space-y-5">
                        <div>
                          <Label htmlFor="loginId" className="text-gray-700 text-sm font-medium">
                            Username / Email / Phone
                          </Label>
                          <Input
                            id="loginId"
                            type="text"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            placeholder="Enter your credentials"
                            className={`mt-2 h-11 bg-white placeholder:text-gray-400 ${loginErrors.loginId ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          {loginErrors.loginId && (
                            <p className="text-sm text-red-500 mt-1">{loginErrors.loginId}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="password" className="text-gray-700 text-sm font-medium">
                            Password
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              className={`h-11 bg-white placeholder:text-gray-400 ${loginErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {loginErrors.password && (
                            <p className="text-sm text-red-500 mt-1">{loginErrors.password}</p>
                          )}
                          <div className="text-right mt-1">
                            <button
                              type="button"
                              onClick={() => navigate('/forgot-password')}
                              className="text-sm text-[#055AA1] hover:underline font-medium"
                            >
                              Forgot Password?
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              className="bg-white"
                              id="policy"
                              checked={agreedToPolicy}
                              onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
                            />
                            <label htmlFor="policy" className="text-sm text-gray-600 cursor-pointer">
                              I agree to the{' '}
                              <a href="#" className="text-[#055AA1] hover:underline font-medium">
                                Privacy Policy
                              </a>
                            </label>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-[#055AA1] hover:bg-[#044a8a] text-white h-11 text-base font-medium mt-6"
                          disabled={!agreedToPolicy || isSubmitting}
                        >
                          {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                      </form>
                    </TabsContent>
                  )}

                  {/* Verification Code Login */}
                  <TabsContent value="code" className="mt-0">
                    <Tabs value={activeCodeTab} onValueChange={(v) => setActiveCodeTab(v as 'email' | 'sms')} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-6 h-10 bg-gray-50">
                        <TabsTrigger 
                          value="email"
                          className="data-[state=active]:bg-[#055AA1] data-[state=active]:text-white"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5" />
                          Email
                        </TabsTrigger>
                        <TabsTrigger 
                          value="sms"
                          className="data-[state=active]:bg-[#055AA1] data-[state=active]:text-white"
                        >
                          <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                          SMS
                        </TabsTrigger>
                      </TabsList>

                      {/* Email Verification Login */}
                      <TabsContent value="email" className="mt-0">
                        <form onSubmit={handleEmailLogin} className="space-y-5">
                          <div>
                            <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              className={`mt-2 h-11 bg-white placeholder:text-gray-400 ${emailErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {emailErrors.email && (
                              <p className="text-sm text-red-500 mt-1">{emailErrors.email}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="emailCode" className="text-gray-700 text-sm font-medium">
                              Verification Code
                            </Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id="emailCode"
                                type="text"
                                value={emailCode}
                                onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="6-digit code"
                                maxLength={6}
                                className={`h-11 bg-white placeholder:text-gray-400 ${emailErrors.code ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              <Button
                                type="button"
                                onClick={handleSendEmailCode}
                                disabled={emailCountdown > 0}
                                variant="outline"
                                className="whitespace-nowrap border-gray-300 hover:border-[#055AA1] hover:text-[#055AA1] h-11 px-5"
                              >
                                {emailCountdown > 0 ? `${emailCountdown}s` : 'Send Code'}
                              </Button>
                            </div>
                            {emailErrors.code && (
                              <p className="text-sm text-red-500 mt-1">{emailErrors.code}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              className="bg-white"
                              id="emailPolicy"
                              checked={emailAgreedToPolicy}
                              onCheckedChange={(checked) => setEmailAgreedToPolicy(checked as boolean)}
                            />
                            <label htmlFor="emailPolicy" className="text-sm text-gray-600 cursor-pointer">
                              I agree to the{' '}
                              <a href="#" className="text-[#055AA1] hover:underline font-medium">
                                Privacy Policy
                              </a>
                            </label>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-[#055AA1] hover:bg-[#044a8a] text-white h-11 text-base font-medium mt-6"
                            disabled={!emailAgreedToPolicy || isSubmitting}
                          >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                          </Button>
                        </form>
                      </TabsContent>

                      {/* SMS Verification Login */}
                      <TabsContent value="sms" className="mt-0">
                        <form onSubmit={handleSmsLogin} className="space-y-5">
                          <div>
                            <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                              placeholder="Enter your phone number"
                              maxLength={11}
                              className={`mt-2 h-11 bg-white placeholder:text-gray-400 ${smsErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {smsErrors.phone && (
                              <p className="text-sm text-red-500 mt-1">{smsErrors.phone}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="smsCode" className="text-gray-700 text-sm font-medium">
                              Verification Code
                            </Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                id="smsCode"
                                type="text"
                                value={smsCode}
                                onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="6-digit code"
                                maxLength={6}
                                className={`h-11 bg-white placeholder:text-gray-400 ${smsErrors.code ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              <Button
                                type="button"
                                onClick={handleSendSmsCode}
                                disabled={smsCountdown > 0}
                                variant="outline"
                                className="whitespace-nowrap border-gray-300 hover:border-[#055AA1] hover:text-[#055AA1] h-11 px-5"
                              >
                                {smsCountdown > 0 ? `${smsCountdown}s` : 'Send Code'}
                              </Button>
                            </div>
                            {smsErrors.code && (
                              <p className="text-sm text-red-500 mt-1">{smsErrors.code}</p>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              className="bg-white"
                              id="smsPolicy"
                              checked={smsAgreedToPolicy}
                              onCheckedChange={(checked) => setSmsAgreedToPolicy(checked as boolean)}
                            />
                            <label htmlFor="smsPolicy" className="text-sm text-gray-600 cursor-pointer">
                              I agree to the{' '}
                              <a href="#" className="text-[#055AA1] hover:underline font-medium">
                                Privacy Policy
                              </a>
                            </label>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-[#055AA1] hover:bg-[#044a8a] text-white h-11 text-base font-medium mt-6"
                            disabled={!smsAgreedToPolicy || isSubmitting}
                          >
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Yanwen Express
            </h2>
            <p className="text-lg text-gray-600">
              Comprehensive logistics solutions for your business growth
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Package className="w-7 h-7 text-[#055AA1]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Global Network
              </h3>
              <p className="text-gray-600">
                Access to 200+ countries and regions with comprehensive logistics coverage
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-[#055AA1]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Real-time tracking and insurance protection for your shipments
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-[#055AA1]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                99.9% on-time delivery rate with express shipping options
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-[#055AA1]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cost Effective
              </h3>
              <p className="text-gray-600">
                Competitive pricing with flexible payment options for suppliers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Tailored logistics solutions for e-commerce businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-xl p-8 hover:border-[#055AA1] transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Cross-Border E-Commerce
              </h3>
              <p className="text-gray-600 mb-4">
                Streamlined international shipping for online sellers with customs clearance support
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Door-to-door delivery
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Customs clearance assistance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Multi-channel integration
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-8 hover:border-[#055AA1] transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Warehouse Solutions
              </h3>
              <p className="text-gray-600 mb-4">
                Strategic warehouse locations worldwide for efficient inventory management
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Global fulfillment centers
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Inventory management system
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Value-added services
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl p-8 hover:border-[#055AA1] transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Express Delivery
              </h3>
              <p className="text-gray-600 mb-4">
                Fast and reliable express shipping with real-time tracking capabilities
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Real-time tracking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Multiple delivery options
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#055AA1]"></div>
                  Signature confirmation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm text-gray-600">
            © 2026 Yanwen Express. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}