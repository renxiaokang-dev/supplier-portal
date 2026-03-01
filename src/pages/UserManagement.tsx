import { useState } from 'react';
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle, Building2, Key } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';

interface User {
  id: string;
  username: string;
  phone: string;
  email: string;
  company: string;
  assignedCompanies: string[]; // 主用户分配给子用户的公司权限
  roles: string[];
  status: 'active' | 'inactive';
  userType: 'owner' | 'member'; // 主用户或子用户
  lastLogin: string;
  createdAt: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'zhangsan',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      company: 'ABC物流公司',
      assignedCompanies: ['ABC物流公司'],
      roles: ['仓库管理员', '报价员'],
      status: 'active',
      userType: 'owner',
      lastLogin: '2024-02-27 15:30:00',
      createdAt: '2024-01-15 10:00:00',
    },
    {
      id: '2',
      username: 'lisi',
      phone: '13900139000',
      email: 'lisi@example.com',
      company: 'ABC物流公司',
      assignedCompanies: ['ABC物流公司'],
      roles: ['财务专员'],
      status: 'active',
      userType: 'member',
      lastLogin: '2024-02-28 09:15:00',
      createdAt: '2024-01-20 14:30:00',
    },
    {
      id: '3',
      username: 'wangwu',
      phone: '13700137000',
      email: 'wangwu@example.com',
      company: 'XYZ运输公司',
      assignedCompanies: ['XYZ运输公司'],
      roles: ['司机主管'],
      status: 'inactive',
      userType: 'member',
      lastLogin: '2024-02-25 16:45:00',
      createdAt: '2024-02-01 11:20:00',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    company: '',
    assignedCompanies: [] as string[],
    roles: [] as string[],
    status: 'active' as 'active' | 'inactive',
    userType: 'member' as 'owner' | 'member',
    password: '',
    confirmPassword: '',
  });
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // 可选的公司列表
  const companies = ['ABC物流公司', 'XYZ运输公司', 'DEF配送中心'];
  
  // 可选的角色列表
  const availableRoles = ['仓库管理员', '报价员', '财务专员', '司机主管', '数据分析员', '客服专员'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesCompany = filterCompany === 'all' || user.company === filterCompany;
    return matchesSearch && matchesStatus && matchesCompany;
  });

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      phone: '',
      email: '',
      company: '',
      assignedCompanies: [],
      roles: [],
      status: 'active',
      userType: 'member',
      password: '',
      confirmPassword: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      phone: user.phone,
      email: user.email,
      company: user.company,
      assignedCompanies: user.assignedCompanies,
      roles: user.roles,
      status: user.status,
      userType: user.userType,
      password: '',
      confirmPassword: '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('确定要删除此用户吗？此操作不可恢复。')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } 
        : u
    ));
  };

  const handleSave = () => {
    if (!formData.username || !formData.phone || !formData.email || formData.roles.length === 0) {
      alert('请填写所有必填字段，并至少选择一个角色');
      return;
    }

    // 新建用户时验证密码
    if (!editingUser) {
      if (!formData.password || !formData.confirmPassword) {
        alert('请填写密码和确认密码');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        alert('两次输入的密码不一致');
        return;
      }
    }

    if (editingUser) {
      // 编辑 - 只更新角色
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, roles: formData.roles }
          : u
      ));
      alert('用户信息已更新');
    } else {
      // 新建 - 设置默认公司和用户类型
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        company: formData.company || 'ABC物流公司', // 默认公司
        assignedCompanies: formData.assignedCompanies.length > 0 ? formData.assignedCompanies : ['ABC物流公司'],
        userType: 'member', // 默认为子用户
        lastLogin: '-',
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setUsers([...users, newUser]);
      alert('用户创建成功');
    }
    setIsDialogOpen(false);
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleAssignedCompanyToggle = (company: string) => {
    setFormData(prev => ({
      ...prev,
      assignedCompanies: prev.assignedCompanies.includes(company)
        ? prev.assignedCompanies.filter(c => c !== company)
        : [...prev.assignedCompanies, company]
    }));
  };

  const handleResetPassword = (user: User) => {
    setResetPasswordUser(user);
    setResetPasswordData({
      newPassword: '',
      confirmPassword: '',
    });
    setIsResetPasswordDialogOpen(true);
  };

  const handleResetPasswordSave = () => {
    if (!resetPasswordData.newPassword || !resetPasswordData.confirmPassword) {
      alert('请填写新密码和确认密码');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      alert('新密码和确认密码不一致');
      return;
    }

    if (resetPasswordUser) {
      // 重置密码逻辑
      // 这里可以添加实际的重置密码逻辑，例如调用API
      alert(`用户 ${resetPasswordUser.username} 的密码已重置`);
    }
    setIsResetPasswordDialogOpen(false);
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">用户管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理系统用户账号，分配角色权限
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#0b5698] hover:bg-[#0d679f]"
        >
          <Plus className="w-4 h-4" />
          新建用户
        </Button>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-5">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">搜索</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="用户名/手机/邮箱"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5">企业筛选</Label>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
            >
              <option value="all">全部企业</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              共 <span className="font-semibold text-[#0b5698]">{filteredUsers.length}</span> 个用户
            </div>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">用户名</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">手机号</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">邮箱</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">所属企业</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">角色</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">上次登录</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{user.username}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.company}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <span
                          key={role}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                        title="重置密码"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建/编辑用户弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">{editingUser ? '编辑用户' : '新建用户'}</DialogTitle>
            <DialogDescription className="text-sm">
              {editingUser ? '编辑用户信息' : '创建新用户'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5">
                  用户名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="请输入用户名"
                  disabled={!!editingUser}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5">
                  手机号 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入手机号"
                  disabled={!!editingUser}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5">
                邮箱 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱"
                disabled={!!editingUser}
              />
            </div>
            
            {/* 新建用户时显示密码字段 */}
            {!editingUser && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5">
                      密码 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="请输入密码"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-1.5">
                      确认密码 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="请再次输入密码"
                    />
                  </div>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500">两次输入的密码不一致</p>
                )}
              </>
            )}

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                绑定角色 <span className="text-red-500">*</span> <span className="text-xs text-gray-500">（至少选择一个）</span>
              </Label>
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {availableRoles.map(role => (
                  <label
                    key={role}
                    className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="w-4 h-4 text-[#0b5698] border-gray-300 rounded focus:ring-[#0b5698]"
                    />
                    <span className="text-sm text-gray-700">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#0b5698] hover:bg-[#0d679f]"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 重置密码弹窗 */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-medium">重置密码</DialogTitle>
            <DialogDescription className="text-sm">
              为用户 {resetPasswordUser?.username} 重置密码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5">
                新密码 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                placeholder="请输入新密码"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5">
                确认密码 <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                value={resetPasswordData.confirmPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                placeholder="请确认新密码"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleResetPasswordSave}
              className="bg-[#0b5698] hover:bg-[#0d679f]"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}