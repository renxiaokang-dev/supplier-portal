import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// 公司和仓库数据结构
export interface Company {
  id: string;
  name: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  companyId: string;
}

export interface Quotation {
  id: string;
  zone: string;
  unitPrice: number;
  effectiveDate: string;
  expiryDate: string;
  batchId: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  uploadTime: string;
  companyId: string;
  warehouseId: string;
}

export interface Batch {
  id: string;
  uploadTime: string;
  totalCount: number;
  effectiveDate: string;
  expiryDate: string;
}

// 生成历史数据
const generateMockData = (): Quotation[] => {
  const zones = [
    'LAX-A-001',
    'LAX-A-002',
    'LAX-A-003',
    'LAX-A-004',
    'LAX-A-005',
    'LAX-A-006',
    'LAX-A-007',
    'LAX-B-008',
    'LAX-B-009',
    'LAX-B-010',
    'LAX-B-011',
    'LAX-B-012',
    'LAX-B-013',
  ];
  const mockData: Quotation[] = [];
  
  // 批次1: 全部已通过且生效中
  const batch1Id = 'batch-1704067200000';
  const batch1Time = '2024-01-01T08:00:00.000Z';
  zones.forEach((zone, index) => {
    mockData.push({
      id: `${batch1Id}-${index}`,
      zone,
      unitPrice: 95 + Math.random() * 20,
      effectiveDate: '2024-01-01',
      expiryDate: '2026-12-31',
      batchId: batch1Id,
      status: 'approved',
      uploadTime: batch1Time,
      companyId: 'company-1',
      warehouseId: 'warehouse-1',
    });
  });

  // 批次2: 全部已通过且生效中
  const batch2Id = 'batch-1720684800000';
  const batch2Time = '2024-07-11T10:30:00.000Z';
  zones.forEach((zone, index) => {
    mockData.push({
      id: `${batch2Id}-${index}`,
      zone,
      unitPrice: 100 + Math.random() * 15,
      effectiveDate: '2024-07-11',
      expiryDate: '2026-12-31',
      batchId: batch2Id,
      status: 'approved',
      uploadTime: batch2Time,
      companyId: 'company-1',
      warehouseId: 'warehouse-1',
    });
  });

  // 批次3: 已失效
  const batch3Id = 'batch-1640995200000';
  const batch3Time = '2022-01-01T09:00:00.000Z';
  zones.forEach((zone, index) => {
    mockData.push({
      id: `${batch3Id}-${index}`,
      zone,
      unitPrice: 80 + Math.random() * 25,
      effectiveDate: '2022-01-01',
      expiryDate: '2023-12-31',
      batchId: batch3Id,
      status: 'approved',
      uploadTime: batch3Time,
      companyId: 'company-1',
      warehouseId: 'warehouse-1',
    });
  });

  // 批次4: 草稿
  const batch4Id = 'batch-1737446400000';
  const batch4Time = '2025-01-21T06:00:00.000Z';
  zones.slice(0, 4).forEach((zone, index) => {
    mockData.push({
      id: `${batch4Id}-${index}`,
      zone,
      unitPrice: 105 + Math.random() * 10,
      effectiveDate: '2025-02-01',
      expiryDate: '2026-12-31',
      batchId: batch4Id,
      status: 'draft',
      uploadTime: batch4Time,
      companyId: 'company-1',
      warehouseId: 'warehouse-1',
    });
  });

  // 批次5: 待审核
  const batch5Id = 'batch-1737532800000';
  const batch5Time = '2025-01-22T06:00:00.000Z';
  zones.slice(0, 5).forEach((zone, index) => {
    mockData.push({
      id: `${batch5Id}-${index}`,
      zone,
      unitPrice: 98 + Math.random() * 12,
      effectiveDate: '2025-03-01',
      expiryDate: '2026-12-31',
      batchId: batch5Id,
      status: 'pending',
      uploadTime: batch5Time,
      companyId: 'company-1',
      warehouseId: 'warehouse-1',
    });
  });

  // 批次6: 审核拒绝
  const batch6Id = 'batch-1737273600000';
  const batch6Time = '2025-01-19T06:00:00.000Z';
  zones.slice(0, 3).forEach((zone, index) => {
    mockData.push({
      id: `${batch6Id}-${index}`,
      zone,
      unitPrice: 92 + Math.random() * 18,
      effectiveDate: '2025-04-01',
      expiryDate: '2026-12-31',
      batchId: batch6Id,
      status: 'rejected',
      uploadTime: batch6Time,
      companyId: 'company-1',
      warehouseId: 'warehouse-1',
    });
  });

  return mockData;
};

// 模拟公司数据
export const mockCompanies: Company[] = [
  { id: 'company-1', name: 'ABC Logistics USA Inc.' },
  { id: 'company-2', name: 'XYZ Freight Services LLC' },
  { id: 'company-3', name: 'Global Shipping Co.' },
];

// 模拟仓库数据
export const mockWarehouses: Warehouse[] = [
  // Company 1 的仓库
  { id: 'warehouse-1', code: 'LAX100019', name: 'Los Angeles Warehouse', companyId: 'company-1' },
  { id: 'warehouse-2', code: 'MIA1000000', name: 'Miami Distribution Center', companyId: 'company-1' },
  { id: 'warehouse-3', code: 'DFW10000', name: 'Dallas Fort Worth Hub', companyId: 'company-1' },
  
  // Company 2 的仓库
  { id: 'warehouse-4', code: 'LAX200025', name: 'LAX West Terminal', companyId: 'company-2' },
  { id: 'warehouse-5', code: 'JFK500088', name: 'JFK Cargo Center', companyId: 'company-2' },
  { id: 'warehouse-6', code: 'ORD300050', name: 'Chicago O\'Hare Facility', companyId: 'company-2' },
  
  // Company 3 的仓库
  { id: 'warehouse-7', code: 'SEA600077', name: 'Seattle Warehouse', companyId: 'company-3' },
  { id: 'warehouse-8', code: 'ATL400066', name: 'Atlanta Distribution', companyId: 'company-3' },
];

// 创建一个Context来共享数据
import { createContext } from 'react';

// 应用级别的Context（公司和仓库选择）
export const AppContext = createContext<{
  companies: Company[];
  warehouses: Warehouse[];
  selectedCompanyId: string | null;
  selectedWarehouseId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  setSelectedWarehouseId: (id: string | null) => void;
  getCurrentWarehouses: () => Warehouse[];
}>({
  companies: [],
  warehouses: [],
  selectedCompanyId: null,
  selectedWarehouseId: null,
  setSelectedCompanyId: () => {},
  setSelectedWarehouseId: () => {},
  getCurrentWarehouses: () => [],
});

export const QuotationContext = createContext<{
  quotations: Quotation[];
  setQuotations: React.Dispatch<React.SetStateAction<Quotation[]>>;
  handleUpload: (quotations: Omit<Quotation, 'id' | 'batchId' | 'status' | 'uploadTime'>[]) => void;
  handleUpdate: (id: string, updates: Partial<Quotation>) => void;
  handleDelete: (id: string) => void;
  handleConfirmBatch: (batchId: string) => void;
  handleDeleteBatch: (batchId: string) => void;
  handleRevokeBatch: (batchId: string) => void;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  handleBulkApprove: (zone: string, batchId: string) => void;
  handleBulkReject: (zone: string, batchId: string) => void;
  handleBatchUpdate: (batchId: string, updatedQuotations: Quotation[]) => void;
  handleBatchSaveAndSubmit: (batchId: string, updatedQuotations: Quotation[]) => void;
  isActive: (quotation: Quotation) => boolean;
  isExpired: (quotation: Quotation) => boolean;
}>({
  quotations: [],
  setQuotations: () => {},
  handleUpload: () => {},
  handleUpdate: () => {},
  handleDelete: () => {},
  handleConfirmBatch: () => {},
  handleDeleteBatch: () => {},
  handleRevokeBatch: () => {},
  handleApprove: () => {},
  handleReject: () => {},
  handleBulkApprove: () => {},
  handleBulkReject: () => {},
  handleBatchUpdate: () => {},
  handleBatchSaveAndSubmit: () => {},
  isActive: () => false,
  isExpired: () => false,
});

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [quotations, setQuotations] = useState<Quotation[]>(generateMockData());
  
  // 公司和仓库选择状态
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>('company-1');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>('warehouse-1');
  
  // 获取当前公司的仓库列表
  const getCurrentWarehouses = () => {
    if (!selectedCompanyId) return [];
    return mockWarehouses.filter(w => w.companyId === selectedCompanyId);
  };
  
  // 当公司切换时，重置仓库选择为该公司的第一个仓库
  useEffect(() => {
    if (selectedCompanyId) {
      const companyWarehouses = mockWarehouses.filter(w => w.companyId === selectedCompanyId);
      if (companyWarehouses.length > 0) {
        setSelectedWarehouseId(companyWarehouses[0].id);
      } else {
        setSelectedWarehouseId(null);
      }
    } else {
      setSelectedWarehouseId(null);
    }
  }, [selectedCompanyId]);

  const handleUpload = (newQuotations: Omit<Quotation, 'id' | 'batchId' | 'status' | 'uploadTime'>[]) => {
    const batchId = `batch-${Date.now()}`;
    const uploadTime = new Date().toISOString();
    
    const quotationsWithMetadata = newQuotations.map((q, index) => ({
      ...q,
      id: `${batchId}-${index}`,
      batchId,
      status: 'draft' as const,
      uploadTime,
      companyId: 'company-1',
      warehouseId: 'warehouse-1',
    }));

    setQuotations(prev => [...quotationsWithMetadata, ...prev]);
  };

  const handleUpdate = (id: string, updates: Partial<Quotation>) => {
    setQuotations(prev => prev.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const handleDelete = (id: string) => {
    setQuotations(prev => prev.filter(q => q.id !== id));
  };

  const handleConfirmBatch = (batchId: string) => {
    setQuotations(prev => prev.map(q => 
      q.batchId === batchId && q.status === 'draft' 
        ? { ...q, status: 'pending' as const } 
        : q
    ));
  };

  const handleDeleteBatch = (batchId: string) => {
    setQuotations(prev => prev.filter(q => q.batchId !== batchId));
  };

  const handleRevokeBatch = (batchId: string) => {
    setQuotations(prev => prev.map(q => 
      q.batchId === batchId && q.status === 'pending' 
        ? { ...q, status: 'draft' as const } 
        : q
    ));
  };

  const handleApprove = (id: string) => {
    setQuotations(prev => prev.map(q => 
      q.id === id ? { ...q, status: 'approved' as const } : q
    ));
  };

  const handleReject = (id: string) => {
    setQuotations(prev => prev.map(q => 
      q.id === id ? { ...q, status: 'rejected' as const } : q
    ));
  };

  const handleBulkApprove = (zone: string, batchId: string) => {
    setQuotations(prev => prev.map(q => 
      q.zone === zone && q.batchId === batchId && q.status === 'pending'
        ? { ...q, status: 'approved' as const }
        : q
    ));
  };

  const handleBulkReject = (zone: string, batchId: string) => {
    setQuotations(prev => prev.map(q => 
      q.zone === zone && q.batchId === batchId && q.status === 'pending'
        ? { ...q, status: 'rejected' as const }
        : q
    ));
  };

  const handleBatchUpdate = (batchId: string, updatedQuotations: Quotation[]) => {
    // 删除批次中的旧数据，添加更新后的数据（保持草稿状态）
    setQuotations(prev => [
      ...updatedQuotations.map(q => ({ ...q, status: 'draft' as const })),
      ...prev.filter(q => q.batchId !== batchId)
    ]);
    alert('批次已保存为草稿');
  };

  const handleBatchSaveAndSubmit = (batchId: string, updatedQuotations: Quotation[]) => {
    // 删除批次中的旧数据，添加更新后的数据（直接提交为待审核状态）
    setQuotations(prev => [
      ...updatedQuotations.map(q => ({ ...q, status: 'pending' as const })),
      ...prev.filter(q => q.batchId !== batchId)
    ]);
    alert('批次已提交审核');
  };

  const isActive = (quotation: Quotation) => {
    if (quotation.status !== 'approved') return false;
    const now = new Date();
    const effective = new Date(quotation.effectiveDate);
    const expiry = new Date(quotation.expiryDate);
    return now >= effective && now <= expiry;
  };

  const isExpired = (quotation: Quotation) => {
    if (quotation.status !== 'approved') return false;
    const now = new Date();
    const expiry = new Date(quotation.expiryDate);
    return now > expiry;
  };

  const contextValue = {
    quotations,
    setQuotations,
    handleUpload,
    handleUpdate,
    handleDelete,
    handleConfirmBatch,
    handleDeleteBatch,
    handleRevokeBatch,
    handleApprove,
    handleReject,
    handleBulkApprove,
    handleBulkReject,
    handleBatchUpdate,
    handleBatchSaveAndSubmit,
    isActive,
    isExpired,
  };
  
  const appContextValue = {
    companies: mockCompanies,
    warehouses: mockWarehouses,
    selectedCompanyId,
    selectedWarehouseId,
    setSelectedCompanyId,
    setSelectedWarehouseId,
    getCurrentWarehouses,
  };

  const currentPath = location.pathname;

  return (
    <ProtectedRoute>
      <AppContext.Provider value={appContextValue}>
        <QuotationContext.Provider value={contextValue}>
          <Layout>
            <Outlet />
          </Layout>
        </QuotationContext.Provider>
      </AppContext.Provider>
    </ProtectedRoute>
  );
}