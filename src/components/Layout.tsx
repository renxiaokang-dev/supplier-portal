import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User, Globe, LogOut, KeyRound, Building2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import LogoUpCnCr1WhQWl from '../imports/LogoUpCnCr1WhQWl1';
import LogoDownCt7Q2Wyl from '../imports/LogoDownCt7Q2Wyl1';
import svgPaths from '../imports/svg-6ie8qbnxdf';
import { useAuth } from '../context/AuthContext';
import { useContext } from 'react';
import { AppContext } from '../pages/Root';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

type Language = 'zh' | 'en';

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<Language>('zh');
  const [activeTopMenu, setActiveTopMenu] = useState('dispatch');
  
  // 根据当前路径自动设置顶部菜单和展开的左侧菜单
  const getTopMenuFromPath = () => {
    if (location.pathname.includes('timesheet') ||
        location.pathname.includes('payment-request')) {
      return 'labor';
    }
    if (location.pathname.includes('user-management') || 
        location.pathname.includes('role-management')) {
      return 'merchant';
    }
    return 'dispatch';
  };

  const getExpandedMenusFromPath = () => {
    if (location.pathname.includes('timesheet') ||
        location.pathname.includes('payment-request')) {
      return new Set(['laborManagement']);
    }
    if (location.pathname.includes('user-management') || 
        location.pathname.includes('role-management')) {
      return new Set(['merchantManagement']);
    }
    return new Set(['quotation']);
  };

  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(getExpandedMenusFromPath());

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const next = new Set(prev);
      if (next.has(menuId)) {
        next.delete(menuId);
      } else {
        next.add(menuId);
      }
      return next;
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const translations = {
    zh: {
      portal: '供应商门户',
      home: '首页',
      dispatch: '派送管理',
      labor: '劳务管理',
      finance: '账务管理',
      merchant: '商户管理',
      user: 'renxk',
      quotation: '报价管理',
      quotationUpload: '上传报价单',
      quotationQuery: '报价单查询',
      volumeForecast: '货量预测',
      boxManagement: '分箱管理',
      subBoxArchive: '子箱档案',
      subBoxStats: '子分箱配送统计',
      driverManagement: '司机管理',
      driverArchive: '司机档案',
      waybillStats: '运单统计',
      pendingReturn: '待返仓运单查询',
      podPenalty: 'POD处罚',
      workOrder: '工单管理',
      userManagement: '用户管理',
      roleManagement: '角色管理',
      timesheetEntry: '工时填报',
      paymentRequest: '申请付款',
    },
    en: {
      portal: 'Supplier Portal',
      home: 'Home',
      dispatch: 'Dispatch',
      labor: 'Labor Management',
      finance: 'Finance',
      merchant: 'Merchant',
      user: 'Test User',
      quotation: 'Quotation',
      quotationUpload: 'Upload Quotation',
      quotationQuery: 'Query Quotation',
      volumeForecast: 'Volume Forecast',
      boxManagement: 'Box Management',
      subBoxArchive: 'Sub-box Archive',
      subBoxStats: 'Sub-box Delivery Stats',
      driverManagement: 'Driver Management',
      driverArchive: 'Driver Archive',
      waybillStats: 'Waybill Statistics',
      pendingReturn: 'Pending Return Query',
      podPenalty: 'POD Penalty',
      workOrder: 'Work Order',
      userManagement: 'User Management',
      roleManagement: 'Role Management',
      timesheetEntry: 'Timesheet Entry',
      paymentRequest: 'Payment Request',
    }
  };

  const t = translations[language];

  const topMenuItems = [
    { id: 'home', label: t.home },
    { id: 'dispatch', label: t.dispatch },
    { id: 'labor', label: t.labor },
    { id: 'finance', label: t.finance },
    { id: 'merchant', label: t.merchant },
  ];

  // 根据顶部菜单获取对应的左侧菜单
  const getMenuItemsByTopMenu = () => {
    if (activeTopMenu === 'dispatch') {
      return [
        {
          id: 'quotation',
          label: t.quotation,
          children: [
            { id: 'quotationUpload', label: t.quotationUpload, path: '/upload' },
            { id: 'quotationQuery', label: t.quotationQuery, path: '/query' }
          ]
        },
        {
          id: 'volumeForecast',
          label: t.volumeForecast,
          children: [] as Array<{id: string, label: string, path?: string}>
        },
        {
          id: 'boxManagement',
          label: t.boxManagement,
          children: [
            { id: 'subBoxArchive', label: t.subBoxArchive },
            { id: 'subBoxStats', label: t.subBoxStats }
          ]
        },
        {
          id: 'driverManagement',
          label: t.driverManagement,
          children: [
            { id: 'driverArchive', label: t.driverArchive }
          ]
        },
        {
          id: 'waybillStats',
          label: t.waybillStats,
          children: [
            { id: 'pendingReturn', label: t.pendingReturn }
          ]
        },
        {
          id: 'workOrder',
          label: t.workOrder,
          children: [
            { id: 'podPenalty', label: t.podPenalty, path: '/pod-penalty' }
          ]
        }
      ];
    } else if (activeTopMenu === 'labor') {
      return [
        {
          id: 'laborManagement',
          label: t.labor,
          children: [
            { id: 'timesheetEntry', label: t.timesheetEntry, path: '/timesheet' },
            { id: 'paymentRequest', label: t.paymentRequest, path: '/payment-request' },
          ]
        }
      ];
    } else if (activeTopMenu === 'merchant') {
      return [
        {
          id: 'merchantManagement',
          label: t.merchant,
          children: [
            { id: 'userManagement', label: t.userManagement, path: '/user-management' },
            { id: 'roleManagement', label: t.roleManagement, path: '/role-management' }
          ]
        }
      ];
    }
    return [];
  };

  const menuItems = getMenuItemsByTopMenu();

  const handleMenuClick = (menuId: string) => {
    const menu = menuItems.find(m => m.id === menuId);
    if (menu && menu.children.length > 0) {
      toggleMenu(menuId);
    }
  };

  const handleChildClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  // 根据当前路径判断活跃的菜单项
  const getActiveMenu = () => {
    if (location.pathname === '/upload') return 'quotationUpload';
    if (location.pathname === '/query' || location.pathname === '/') return 'quotationQuery';
    if (location.pathname === '/pod-penalty') return 'podPenalty';
    if (location.pathname === '/timesheet') return 'timesheetEntry';
    if (location.pathname === '/payment-request') return 'paymentRequest';
    if (location.pathname === '/user-management') return 'userManagement';
    if (location.pathname === '/role-management') return 'roleManagement';
    return '';
  };

  const activeMenu = getActiveMenu();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };
  
  // 获取公司和仓库上下文
  const { companies, selectedCompanyId, setSelectedCompanyId } = useContext(AppContext);
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  useEffect(() => {
    const topMenu = getTopMenuFromPath();
    const expandedMenus = getExpandedMenusFromPath();
    setActiveTopMenu(topMenu);
    setExpandedMenus(expandedMenus);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-[#0b5698] text-white h-16 flex-shrink-0">
        <div className="flex items-center justify-between h-full pl-0 pr-6">
          <div className="flex items-center gap-6 h-full">
            {/* Logo - 放大尺寸，减少顶部间距 */}
            <div className="w-[200px] h-full flex items-end flex-shrink-0">
              <div className="w-full h-[60px]">
                <LogoUpCnCr1WhQWl />
              </div>
            </div>

            {/* 主导航 - 垂直居中 */}
            <nav className="flex items-center gap-1">
              {topMenuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTopMenu(item.id)}
                  className={`px-5 h-9 text-sm rounded transition-colors ${
                    activeTopMenu === item.id
                      ? 'bg-[#d4df4e]/10 text-[#dde856] font-semibold'
                      : 'text-white hover:bg-[#0d679f]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 右侧用户信息 - 垂直居中 */}
          <div className="flex items-center gap-4">
            {/* 公司选择器 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-white/10 transition-colors text-white rounded font-medium border border-white/30">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="max-w-[180px] truncate">
                    {selectedCompany?.name || '选择公司'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 border-b border-gray-200">
                  所属美国公司
                </div>
                {companies.map(company => (
                  <DropdownMenuItem
                    key={company.id}
                    onClick={() => setSelectedCompanyId(company.id)}
                    className={selectedCompanyId === company.id ? 'bg-blue-50 text-blue-700 font-medium' : ''}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    {company.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-white/10 transition-colors text-white rounded font-medium border border-white/30"
            >
              <span>{language === 'zh' ? '简体中文' : 'EN'}</span>
              <svg className="w-2.5 h-1.5" fill="none" viewBox="0 0 14.0219 8">
                <path d={svgPaths.p226cf2f0} fill="currentColor" />
              </svg>
            </button>
            
            {/* 用户下拉菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm hover:bg-white/10 px-3 py-1.5 rounded transition-colors">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <User className="w-4 h-4 text-[#0b5698]" />
                  </div>
                  <span>{user?.username || t.user}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleChangePassword}>
                  <KeyRound className="w-4 h-4 mr-2" />
                  修改密码
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* 过渡条 */}
      <div className="relative h-4 bg-[#acc83e] flex-shrink-0">
        <div className="absolute left-0 top-0 h-4 w-[200px]">
          <LogoDownCt7Q2Wyl />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧菜单 */}
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map(menu => (
                <li key={menu.id}>
                  {menu.children.length > 0 ? (
                    <>
                      <button
                        onClick={() => handleMenuClick(menu.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        <span className="font-medium">{menu.label}</span>
                        {expandedMenus.has(menu.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      
                      {expandedMenus.has(menu.id) && (
                        <ul className="mt-1 ml-4 space-y-1">
                          {menu.children.map(child => (
                            <li key={child.id}>
                              <button
                                onClick={() => handleChildClick(child.path)}
                                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                                  activeMenu === child.id
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {child.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleMenuClick(menu.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                        activeMenu === menu.id
                          ? 'bg-[#0b5698]/10 text-[#0b5698] font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium">{menu.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}