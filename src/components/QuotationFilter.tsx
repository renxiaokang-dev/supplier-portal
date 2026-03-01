import { Search } from 'lucide-react';

interface QuotationFilterProps {
  statusFilter: 'all' | 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
  zoneFilter: string;
  dateRange: { start: string; end: string };
  onStatusChange: (status: 'all' | 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'expired') => void;
  onZoneChange: (zone: string) => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
}

// 预设分区列表
const PRESET_ZONES = [
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

export function QuotationFilter({
  statusFilter,
  zoneFilter,
  dateRange,
  onStatusChange,
  onZoneChange,
  onDateRangeChange,
}: QuotationFilterProps) {
  const tabs = [
    { id: 'active', label: '生效中' },
    { id: 'expired', label: '已失效' },
    { id: 'draft', label: '草稿' },
    { id: 'pending', label: '待审核' },
    { id: 'approved', label: '审核通过' },
    { id: 'rejected', label: '审核拒绝' },
    { id: 'all', label: '全部' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 页签区域 */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id as any)}
              className={`
                px-5 py-3 text-base font-medium transition-all relative
                ${statusFilter === tab.id
                  ? 'text-[#0b5698] bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {tab.label}
              {statusFilter === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0b5698]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-200">
        <div className={`grid ${statusFilter === 'active' || statusFilter === 'expired' ? 'grid-cols-3' : 'grid-cols-2'} gap-4`}>
          {/* 只在生效中和已失效状态显示分区筛选 */}
          {(statusFilter === 'active' || statusFilter === 'expired') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                按分区筛选
              </label>
              <select
                value={zoneFilter}
                onChange={(e) => onZoneChange(e.target.value)}
                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
              >
                <option value="all">全部分区</option>
                {PRESET_ZONES.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              开始日期
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              结束日期
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
              className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
      </div>

      {/* 快捷操作区域 */}
     
    </div>
  );
}