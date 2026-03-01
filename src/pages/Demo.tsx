import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import LogoUpCnCr1WhQWl from '../imports/LogoUpCnCr1WhQWl1';
import { LogIn, UserPlus, Key } from 'lucide-react';

export function Demo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b5698] to-[#0d679f] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-64 h-16 bg-white rounded-lg p-3">
            <LogoUpCnCr1WhQWl />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            用户账户管理系统演示
          </h1>
          <p className="text-gray-600 text-center mb-8">
            点击下面的按钮体验不同的登录和账户管理功能
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* 密码登录 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0b5698]/10 rounded-lg flex items-center justify-center mb-4">
                  <LogIn className="w-6 h-6 text-[#0b5698]" />
                </div>
                <CardTitle>密码登录</CardTitle>
                <CardDescription>
                  使用用户名/邮箱/手机号和密码登录系统
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full bg-[#0b5698] hover:bg-[#0d679f]"
                >
                  进入登录页面
                </Button>
              </CardContent>
            </Card>

            {/* 首次登录 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>首次登录</CardTitle>
                <CardDescription>
                  体验首次登录流程，仅显示验证码登录选项
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/first-login')} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  首次登录体验
                </Button>
              </CardContent>
            </Card>

            {/* 账户设置 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Key className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>账户设置</CardTitle>
                <CardDescription>
                  首次登录后的账户设置页面，含密码强度检测
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/account-setup')} 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  查看账户设置
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">功能特性</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">登录功能</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>密码登录：支持用户名/邮箱/手机号登录</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>验证码登录：支持邮箱和短信两种方式</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>60秒验证码倒计时</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>隐私政策勾选确认</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>密码显示/隐藏切换</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>首次登录仅显示验证码登录</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">账户管理</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>用户菜单下拉框（点击用户名触发）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>修改密码功能（含密码强度指示器）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>退出登录功能</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>账户设置页面（首次登录后）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>实时密码强度检测（弱/中/强）</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0b5698] mr-2">•</span>
                  <span>完整的表单验证和错误提示</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">表单验证</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong className="text-gray-900">用户名验证：</strong>
                <p>3-20个字符，支持字母、数字、下划线和中文</p>
              </div>
              <div>
                <strong className="text-gray-900">密码验证：</strong>
                <p>至少8个字符，必须包含数字和字母</p>
              </div>
              <div>
                <strong className="text-gray-900">验证码验证：</strong>
                <p>6位数字验证码</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-6">
          © 2026 供应商门户系统. All rights reserved.
        </p>
      </div>
    </div>
  );
}
