import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { QuotationContext, AppContext } from './Root';
import { QuotationList } from '../components/QuotationList';
import { QuotationFilter } from '../components/QuotationFilter';
import { WarehouseSelector } from '../components/WarehouseSelector';
import { Search, Upload } from 'lucide-react';

export function QuotationQuery() {
  const navigate = useNavigate();
  const {
    quotations,
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
  } = useContext(QuotationContext);

  const { warehouses } = useContext(AppContext);

  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'pending' | 'approved' | 'rejected' | 'active' | 'expired'>('active');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
  const [previewBatchId, setPreviewBatchId] = useState<string | null>(null);

  // 当弹窗打开时，禁用主页面滚动
  useEffect(() => {
    if (previewBatchId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [previewBatchId]);

  const handleConfirmBatchLocal = (batchId: string) => {
    // 改为先预览批次数据
    setPreviewBatchId(batchId);
  };

  const handleConfirmBatchAfterPreview = () => {
    if (previewBatchId) {
      handleConfirmBatch(previewBatchId);
      setPreviewBatchId(null);
    }
  };

  const filteredQuotations = quotations.filter(q => {
    if (filterStatus === 'active' && !isActive(q)) return false;
    if (filterStatus === 'expired' && !isExpired(q)) return false;
    if (filterStatus !== 'all' && filterStatus !== 'active' && filterStatus !== 'expired' && q.status !== filterStatus) return false;
    // 只在生效中或已失效状态下应用分区筛选
    if ((filterStatus === 'active' || filterStatus === 'expired') && filterZone !== 'all' && q.zone !== filterZone) return false;
    return true;
  });

  return (
    <div className="p-6">
      {/* 核心提示区域 */}
      <div className="mb-5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 flex-1 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex-shrink-0">
            <Search className="w-5 h-5 text-[#0b5698]" />
          </div>
          <div>
            <p className="text-base text-gray-900">
              查询和管理历史报价单，支持按状态筛选，草稿可编辑删除，已提交的批次可批量审核
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-base font-medium text-white bg-[#0b5698] hover:bg-[#0d679f] rounded shadow-sm transition-all"
        >
          <Upload className="w-4 h-4" />
          上传报价单
        </button>
      </div>

      <div className="space-y-5">
        {/* 仓库选择器 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <WarehouseSelector className="w-full max-w-md" />
        </div>

        <QuotationFilter
          statusFilter={filterStatus}
          zoneFilter={filterZone}
          dateRange={filterDateRange}
          onStatusChange={setFilterStatus}
          onZoneChange={setFilterZone}
          onDateRangeChange={setFilterDateRange}
        />

        <QuotationList
          quotations={filteredQuotations}
          onApprove={handleApprove}
          onReject={handleReject}
          onBulkApprove={handleBulkApprove}
          onBulkReject={handleBulkReject}
          onConfirmBatch={handleConfirmBatchLocal}
          onDeleteBatch={handleDeleteBatch}
          onRevokeBatch={handleRevokeBatch}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onBatchUpdate={handleBatchUpdate}
          onBatchSaveAndSubmit={handleBatchSaveAndSubmit}
          isActive={isActive}
          showAsBatch={filterStatus !== 'active' && filterStatus !== 'expired'}
        />
      </div>

      {/* 草稿批次预览弹窗 */}
      {previewBatchId && (() => {
        const batchQuotations = quotations.filter(q => q.batchId === previewBatchId);
        const batchInfo = batchQuotations[0];
        
        return (
          <div 
            className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 p-6 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPreviewBatchId(null);
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl my-6">
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">批次数据预览</h2>
                <button
                  onClick={() => setPreviewBatchId(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h2 className="text-lg font-semibold text-gray-900">数据预览</h2>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {batchQuotations.length}条记录
                      </span>
                    </div>
                  </div>

                  {/* 显示批次日期信息 */}
                  {batchInfo && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">批次生效时间</h3>
                      <div className="flex gap-6 text-sm text-gray-700">
                        <div>
                          <span className="font-medium">生效期：</span>
                          <span>{batchInfo.effectiveDate}</span>
                        </div>
                        <div>
                          <span className="font-medium">失效日期：</span>
                          <span>{batchInfo.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      请仔细检查以下数据，确认无误后点击"确认提交"按钮
                    </p>
                  </div>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">序号</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">分区</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">单价（美元）</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {batchQuotations.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                            <td className="px-4 py-3 text-gray-900">{item.zone}</td>
                            <td className="px-4 py-3 font-medium text-gray-900">${item.unitPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setPreviewBatchId(null)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      取消
                    </button>
                    <button
                      onClick={handleConfirmBatchAfterPreview}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#0b5698] hover:bg-[#0d679f] rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      确认提交
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}