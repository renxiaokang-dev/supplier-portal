import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2, Warehouse, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';

interface WarehousePermission {
  warehouseCode: string;
  warehouseName: string;
}

interface BusinessLinePermission {
  businessLineId: string;
  warehouses: WarehousePermission[];
}

interface CompanyPermission {
  companyId: string;
  businessLines: BusinessLinePermission[];
}

interface MenuPermissionNode {
  id: string;
  name_zh: string;
  name_en: string;
  children?: MenuPermissionNode[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  companyPermissions: CompanyPermission[];
  menuPermissions: string[];
  userCount: number;
  createdAt: string;
}

export function RoleManagement() {
  // 使用本地 state 管理语言，默认为中文
  const [language] = useState<'zh' | 'en'>('zh');
  
  const t = {
    zh: {
      title: '角色管理',
      subtitle: '配置角色权限，权限层级：公司 → 业务线（派送/劳务）→ 仓库账号',
      createRole: '新建角色',
      editRole: '编辑角色',
      searchPlaceholder: '搜索角色名称或描述',
      totalRoles: '个角色',
      total: '共',
      roleName: '角色名称',
      description: '描述',
      dataScopePermissions: '数据范围权限',
      userCount: '用户数',
      actions: '操作',
      edit: '编辑',
      delete: '删除',
      people: '人',
      cancel: '取消',
      save: '保存',
      saveChanges: '保存更改',
      createNew: '创建角色',
      roleNameLabel: '角色名称',
      descriptionLabel: '角色描述',
      roleNamePlaceholder: '请输入角色名称',
      descriptionPlaceholder: '请输入角色描述',
      dataScopeTitle: '数据范围权限',
      dataScopeDesc: '选择该角色可以访问的公司、业务线和仓库账号',
      required: '必填',
      dispatch: '派送',
      labor: '劳务',
      deleteConfirm: '确定要删除此角色吗？此操作不可恢复。',
      deleteWarning: '该角色下有 {count} 个用户，请先解除用户绑定再删除',
      nameRequired: '请填写角色名称',
      companyRequired: '请至少选择一个公司和业务线',
      businessLineRequired: '公司\"{company}\"至少需要选择一个业务线',
      warehouseRequired: '公司\"{company}\"的业务线\"{businessLine}\"至少需要选择一个仓库',
    },
    en: {
      title: 'Role Management',
      subtitle: 'Configure role permissions: Company → Business Line (Dispatch/Labor) → Warehouse',
      createRole: 'Create Role',
      editRole: 'Edit Role',
      searchPlaceholder: 'Search role name or description',
      totalRoles: 'roles',
      total: 'Total',
      roleName: 'Role Name',
      description: 'Description',
      dataScopePermissions: 'Data Scope',
      userCount: 'Users',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      people: 'users',
      cancel: 'Cancel',
      save: 'Save',
      saveChanges: 'Save Changes',
      createNew: 'Create Role',
      roleNameLabel: 'Role Name',
      descriptionLabel: 'Description',
      roleNamePlaceholder: 'e.g., Warehouse Manager',
      descriptionPlaceholder: 'Brief description of this role',
      dataScopeTitle: 'Data Scope Permissions',
      dataScopeDesc: 'Select companies, business lines, and warehouse accounts this role can access',
      required: 'Required',
      dispatch: 'Dispatch',
      labor: 'Labor',
      deleteConfirm: 'Are you sure you want to delete this role? This action cannot be undone.',
      deleteWarning: 'This role has {count} users. Please unbind users first.',
      nameRequired: 'Please enter role name',
      companyRequired: 'Please select at least one company and business line',
      businessLineRequired: 'Company \"{company}\" requires at least one business line',
      warehouseRequired: 'Business line \"{businessLine}\" of company \"{company}\" requires at least one warehouse',
    }
  }[language];

  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: '仓库管理员',
      description: '负责仓库日常运营管理，包括报价、货量预测等',
      userCount: 5,
      companyPermissions: [
        {
          companyId: 'ABC物流公司',
          businessLines: [
            {
              businessLineId: 'dispatch',
              warehouses: [
                { warehouseCode: 'LAX100019', warehouseName: 'Los Angeles仓库' },
                { warehouseCode: 'MIA1000000', warehouseName: 'Miami仓库' }
              ]
            }
          ]
        }
      ],
      menuPermissions: ['quotation-view', 'quotation-edit', 'quotation-upload', 'volume-view'],
      createdAt: '2024-01-15 10:00:00',
    },
    {
      id: '2',
      name: '报价员',
      description: '专门负责报价单的上传和管理',
      userCount: 3,
      companyPermissions: [
        {
          companyId: 'ABC物流公司',
          businessLines: [
            {
              businessLineId: 'dispatch',
              warehouses: [
                { warehouseCode: 'LAX100019', warehouseName: 'Los Angeles仓库' }
              ]
            }
          ]
        }
      ],
      menuPermissions: ['quotation-view', 'quotation-edit', 'quotation-upload', 'quotation-export'],
      createdAt: '2024-01-20 14:30:00',
    },
  ]);

  const availableCompanies = [
    { id: 'ABC物流公司', name: 'ABC物流公司' },
    { id: 'XYZ运输公司', name: 'XYZ运输公司' },
    { id: 'DEF配送中心', name: 'DEF配送中心' },
  ];

  const businessLines = [
    { id: 'dispatch', name_zh: '派送', name_en: 'Dispatch' },
    { id: 'labor', name_zh: '劳务', name_en: 'Labor' },
  ];

  const warehousesByBusinessLine: Record<string, WarehousePermission[]> = {
    dispatch: [
      { warehouseCode: 'LAX100019', warehouseName: 'Los Angeles仓库' },
      { warehouseCode: 'MIA1000000', warehouseName: 'Miami仓库' },
      { warehouseCode: 'DFW10000', warehouseName: 'Dallas仓库' },
      { warehouseCode: 'JFK20000', warehouseName: 'New York仓库' },
    ],
    labor: [
      { warehouseCode: 'LAX-LABOR', warehouseName: 'Los Angeles劳务中心' },
      { warehouseCode: 'MIA-LABOR', warehouseName: 'Miami劳务中心' },
      { warehouseCode: 'DFW-LABOR', warehouseName: 'Dallas劳务中心' },
    ],
  };

  const menuPermissions: MenuPermissionNode[] = [
    {
      id: 'quotation',
      name_zh: '报价管理',
      name_en: 'Quotation',
      children: [
        { id: 'quotation-view', name_zh: '查看报价单', name_en: 'View Quotations' },
        { id: 'quotation-edit', name_zh: '编辑报价单', name_en: 'Edit Quotations' },
        { id: 'quotation-upload', name_zh: '上传报价单', name_en: 'Upload Quotations' },
        { id: 'quotation-delete', name_zh: '删除报价单', name_en: 'Delete Quotations' },
        { id: 'quotation-export', name_zh: '导出报价单', name_en: 'Export Quotations' },
        { id: 'quotation-approve', name_zh: '审核报价单', name_en: 'Approve Quotations' },
      ],
    },
    {
      id: 'volume',
      name_zh: '货量预测',
      name_en: 'Volume Forecast',
      children: [
        { id: 'volume-view', name_zh: '查看预测', name_en: 'View Forecast' },
        { id: 'volume-edit', name_zh: '编辑预测', name_en: 'Edit Forecast' },
        { id: 'volume-export', name_zh: '导出预测', name_en: 'Export Forecast' },
      ],
    },
    {
      id: 'box',
      name_zh: '分箱管理',
      name_en: 'Box Management',
      children: [
        { id: 'box-view', name_zh: '查看分箱', name_en: 'View Boxes' },
        { id: 'box-edit', name_zh: '编辑分箱', name_en: 'Edit Boxes' },
        { id: 'box-stats', name_zh: '查看统计', name_en: 'View Statistics' },
      ],
    },
    {
      id: 'driver',
      name_zh: '司机管理',
      name_en: 'Driver Management',
      children: [
        { id: 'driver-view', name_zh: '查看司机档案', name_en: 'View Drivers' },
        { id: 'driver-edit', name_zh: '编辑司机档案', name_en: 'Edit Drivers' },
        { id: 'driver-delete', name_zh: '删除司机档案', name_en: 'Delete Drivers' },
      ],
    },
    {
      id: 'waybill',
      name_zh: '运单统计',
      name_en: 'Waybill Stats',
      children: [
        { id: 'waybill-view', name_zh: '查看运单', name_en: 'View Waybills' },
        { id: 'waybill-export', name_zh: '导出运单', name_en: 'Export Waybills' },
      ],
    },
    {
      id: 'pod',
      name_zh: '工单管理',
      name_en: 'Work Orders',
      children: [
        { id: 'pod-view', name_zh: '查看POD处罚', name_en: 'View POD Penalty' },
        { id: 'pod-edit', name_zh: '编辑POD处罚', name_en: 'Edit POD Penalty' },
        { id: 'pod-export', name_zh: '导出POD数据', name_en: 'Export POD Data' },
      ],
    },
    {
      id: 'labor',
      name_zh: '劳务管理',
      name_en: 'Labor Management',
      children: [
        { id: 'labor-timesheet', name_zh: '工时填报', name_en: 'Timesheet Entry' },
        { id: 'labor-payment', name_zh: '申请付款', name_en: 'Payment Request' },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companyPermissions: [] as CompanyPermission[],
    menuPermissions: [] as string[],
  });

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      companyPermissions: [],
      menuPermissions: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      companyPermissions: role.companyPermissions,
      menuPermissions: role.menuPermissions,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && role.userCount > 0) {
      alert(t.deleteWarning.replace('{count}', role.userCount.toString()));
      return;
    }
    if (window.confirm(t.deleteConfirm)) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  const handleSave = () => {
    if (!formData.name) {
      alert(t.nameRequired);
      return;
    }

    if (formData.companyPermissions.length === 0) {
      alert(t.companyRequired);
      return;
    }

    for (const companyPerm of formData.companyPermissions) {
      if (companyPerm.businessLines.length === 0) {
        alert(t.businessLineRequired.replace('{company}', companyPerm.companyId));
        return;
      }
      for (const businessLine of companyPerm.businessLines) {
        if (businessLine.warehouses.length === 0) {
          const blName = businessLines.find(bl => bl.id === businessLine.businessLineId)?.[language === 'zh' ? 'name_zh' : 'name_en'];
          alert(t.warehouseRequired.replace('{company}', companyPerm.companyId).replace('{businessLine}', blName || ''));
          return;
        }
      }
    }

    if (editingRole) {
      setRoles(roles.map(r =>
        r.id === editingRole.id
          ? { ...r, ...formData }
          : r
      ));
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...formData,
        userCount: 0,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setRoles([...roles, newRole]);
    }
    setIsDialogOpen(false);
  };

  const handleCompanyToggle = (companyId: string) => {
    setFormData(prev => {
      const exists = prev.companyPermissions.find(cp => cp.companyId === companyId);
      if (exists) {
        return {
          ...prev,
          companyPermissions: prev.companyPermissions.filter(cp => cp.companyId !== companyId)
        };
      } else {
        return {
          ...prev,
          companyPermissions: [...prev.companyPermissions, { companyId, businessLines: [] }]
        };
      }
    });
  };

  const handleBusinessLineToggle = (companyId: string, businessLineId: string) => {
    setFormData(prev => ({
      ...prev,
      companyPermissions: prev.companyPermissions.map(cp => {
        if (cp.companyId === companyId) {
          const exists = cp.businessLines.find(bl => bl.businessLineId === businessLineId);
          if (exists) {
            return {
              ...cp,
              businessLines: cp.businessLines.filter(bl => bl.businessLineId !== businessLineId)
            };
          } else {
            return {
              ...cp,
              businessLines: [...cp.businessLines, { businessLineId, warehouses: [] }]
            };
          }
        }
        return cp;
      })
    }));
  };

  const handleWarehouseToggle = (companyId: string, businessLineId: string, warehouse: WarehousePermission) => {
    setFormData(prev => ({
      ...prev,
      companyPermissions: prev.companyPermissions.map(cp => {
        if (cp.companyId === companyId) {
          return {
            ...cp,
            businessLines: cp.businessLines.map(bl => {
              if (bl.businessLineId === businessLineId) {
                const exists = bl.warehouses.find(w => w.warehouseCode === warehouse.warehouseCode);
                if (exists) {
                  return {
                    ...bl,
                    warehouses: bl.warehouses.filter(w => w.warehouseCode !== warehouse.warehouseCode)
                  };
                } else {
                  return {
                    ...bl,
                    warehouses: [...bl.warehouses, warehouse]
                  };
                }
              }
              return bl;
            })
          };
        }
        return cp;
      })
    }));
  };

  const handleMenuPermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      menuPermissions: prev.menuPermissions.includes(permissionId)
        ? prev.menuPermissions.filter(p => p !== permissionId)
        : [...prev.menuPermissions, permissionId]
    }));
  };

  const getBusinessLineName = (id: string) => {
    const bl = businessLines.find(bl => bl.id === id);
    return bl ? (language === 'zh' ? bl.name_zh : bl.name_en) : id;
  };

  const getMenuPermissionName = (permissionId: string): string => {
    for (const menu of menuPermissions) {
      if (menu.children) {
        const permission = menu.children.find(p => p.id === permissionId);
        if (permission) return language === 'zh' ? permission.name_zh : permission.name_en;
      }
    }
    return permissionId;
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-medium text-gray-900">{t.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{t.subtitle}</p>
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[#0b5698] hover:bg-[#0d679f]"
        >
          <Plus className="w-4 h-4" />
          {t.createRole}
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {t.total} <span className="font-semibold text-[#0b5698]">{filteredRoles.length}</span> {t.totalRoles}
          </div>
        </div>
      </div>

      {/* 角色列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.roleName}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.description}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.dataScopePermissions}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.userCount}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRoles.map(role => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{role.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs">{role.description}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-2 max-w-md">
                      {role.companyPermissions.map((cp, cpIdx) => (
                        <div key={cpIdx} className="border-l-2 border-[#0b5698] pl-3">
                          <div className="flex items-center gap-2 font-medium text-gray-900 mb-1">
                            <Building2 className="w-4 h-4 text-[#0b5698]" />
                            {cp.companyId}
                          </div>
                          {cp.businessLines.map((bl, blIdx) => (
                            <div key={blIdx} className="ml-4 mb-1">
                              <div className="text-xs font-medium text-gray-700">
                                {getBusinessLineName(bl.businessLineId)}:
                              </div>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {bl.warehouses.map((wh, whIdx) => (
                                  <span
                                    key={whIdx}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-800"
                                  >
                                    <Warehouse className="w-3 h-3 mr-0.5" />
                                    {wh.warehouseCode}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {role.userCount} {t.people}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title={t.edit}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={t.delete}
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

      {/* 创建/编辑角色弹窗 - 仅数据权限 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!w-[70vw] !max-w-[70vw] h-[88vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b bg-gradient-to-r from-[#0b5698]/5 to-transparent">
            <DialogTitle className="text-base font-medium text-gray-900">
              {editingRole ? t.editRole : t.createRole}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              配置角色的数据范围权限和菜单功能权限
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col px-6">
            {/* 基本信息 */}
            <div className="py-4 border-b">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    {t.roleNameLabel} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.roleNamePlaceholder}
                    className="h-10 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    {t.descriptionLabel}
                  </Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t.descriptionPlaceholder}
                    className="h-10 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 左右布局：数据权限 | 菜单权限 */}
            <div className="flex-1 grid grid-cols-2 gap-6 py-4 overflow-hidden">
              {/* 左侧：数据范围权限 */}
              <div className="flex flex-col overflow-hidden border-r pr-6">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-medium text-gray-900">{t.dataScopeTitle}</h3>
                    <span className="text-red-500 text-xs">*</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t.dataScopeDesc}
                  </p>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {availableCompanies.map(company => {
                    const companyPerm = formData.companyPermissions.find(cp => cp.companyId === company.id);
                    const isSelected = !!companyPerm;
                    
                    return (
                      <div
                        key={company.id}
                        className={`rounded-lg border transition-all ${
                          isSelected ? 'border-[#0b5698] bg-blue-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <label className="flex items-start gap-3 p-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCompanyToggle(company.id)}
                            className="w-4 h-4 mt-0.5 text-[#0b5698] border-gray-300 rounded focus:ring-[#0b5698] cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 mb-2">{company.name}</div>
                            
                            {isSelected && (
                              <div className="space-y-2.5 pl-0.5">
                                {businessLines.map(bl => {
                                  const businessLinePerm = companyPerm?.businessLines.find(
                                    blp => blp.businessLineId === bl.id
                                  );
                                  const isBusinessLineSelected = !!businessLinePerm;
                                  
                                  return (
                                    <div key={bl.id} className="border-l-2 border-blue-300 pl-3">
                                      <label
                                        className="flex items-center gap-2 cursor-pointer mb-1.5 group"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isBusinessLineSelected}
                                          onChange={() => handleBusinessLineToggle(company.id, bl.id)}
                                          className="w-3.5 h-3.5 text-[#0b5698] border-gray-300 rounded focus:ring-[#0b5698] cursor-pointer flex-shrink-0"
                                        />
                                        <span className="text-xs font-medium text-gray-800">
                                          {language === 'zh' ? bl.name_zh : bl.name_en}
                                        </span>
                                      </label>
                                      
                                      {isBusinessLineSelected && (
                                        <div className="ml-5 space-y-1 mt-1.5">
                                          {warehousesByBusinessLine[bl.id]?.map(warehouse => (
                                            <label
                                              key={warehouse.warehouseCode}
                                              className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-white/80 transition-colors group"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={businessLinePerm?.warehouses.some(
                                                  w => w.warehouseCode === warehouse.warehouseCode
                                                )}
                                                onChange={() => handleWarehouseToggle(company.id, bl.id, warehouse)}
                                                className="w-3.5 h-3.5 mt-0.5 text-[#0b5698] border-gray-300 rounded focus:ring-[#0b5698] cursor-pointer flex-shrink-0"
                                              />
                                              <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-gray-800">
                                                  {warehouse.warehouseCode}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                  {warehouse.warehouseName}
                                                </div>
                                              </div>
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 右侧:菜单功能权限 */}
              <div className="flex flex-col overflow-hidden pl-0">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-medium text-gray-900">菜单功能权限</h3>
                    <span className="text-red-500 text-xs">*</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    选择该角色可以访问的菜单和操作功能
                  </p>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-3">
                    {menuPermissions.map(menu => (
                      <div key={menu.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <h4 className="text-xs font-medium text-gray-900 mb-2 flex items-center gap-1.5">
                          <div className="w-1 h-3 bg-[#0b5698] rounded-full"></div>
                          {language === 'zh' ? menu.name_zh : menu.name_en}
                        </h4>
                        <div className="space-y-1">
                          {menu.children?.map(permission => (
                            <label
                              key={permission.id}
                              className="flex items-center gap-2 cursor-pointer hover:bg-white p-1.5 rounded transition-colors group"
                            >
                              <input
                                type="checkbox"
                                checked={formData.menuPermissions.includes(permission.id)}
                                onChange={() => handleMenuPermissionToggle(permission.id)}
                                className="w-3.5 h-3.5 text-[#0b5698] border-gray-300 rounded focus:ring-[#0b5698] cursor-pointer flex-shrink-0"
                              />
                              <span className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors">
                                {language === 'zh' ? permission.name_zh : permission.name_en}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t px-6 py-4 bg-gray-50">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="px-6 h-9 text-sm font-medium"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#0b5698] hover:bg-[#0d679f] px-6 h-9 text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              {editingRole ? t.saveChanges : t.createNew}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}