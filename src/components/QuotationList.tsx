import { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Download, Trash2, FileEdit } from 'lucide-react';
import { Quotation } from '../pages/Root';
import * as XLSX from 'xlsx';
import { BatchEditDialog } from './BatchEditDialog';

interface QuotationListProps {
  quotations: Quotation[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onBulkApprove: (zone: string, batchId: string) => void;
  onBulkReject: (zone: string, batchId: string) => void;
  onConfirmBatch: (batchId: string) => void;
  onDeleteBatch: (batchId: string) => void;
  onRevokeBatch?: (batchId: string) => void;
  onUpdate: (id: string, updates: Partial<Quotation>) => void;
  onDelete: (id: string) => void;
  onBatchUpdate?: (batchId: string, quotations: Quotation[]) => void;
  onBatchSaveAndSubmit?: (batchId: string, quotations: Quotation[]) => void;
  isActive: (quotation: Quotation) => boolean;
  showAsBatch: boolean;
}

export function QuotationList({
  quotations,
  onApprove,
  onReject,
  onBulkApprove,
  onBulkReject,
  onConfirmBatch,
  onDeleteBatch,
  onRevokeBatch,
  onUpdate,
  onDelete,
  onBatchUpdate,
  onBatchSaveAndSubmit,
  isActive,
  showAsBatch,
}: QuotationListProps) {
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Quotation>>({});
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  const toggleBatch = (batchId: string) => {
    setExpandedBatches(prev => {
      const next = new Set(prev);
      if (next.has(batchId)) {
        next.delete(batchId);
      } else {
        next.add(batchId);
      }
      return next;
    });
  };

  const startEdit = (quotation: Quotation) => {
    setEditingId(quotation.id);
    setEditForm({
      zone: quotation.zone,
      unitPrice: quotation.unitPrice,
      effectiveDate: quotation.effectiveDate,
      expiryDate: quotation.expiryDate,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const groupedByBatch = quotations.reduce((acc, q) => {
    if (!acc[q.batchId]) {
      acc[q.batchId] = [];
    }
    acc[q.batchId].push(q);
    return acc;
  }, {} as Record<string, Quotation[]>);

  const getStatusBadge = (quotation: Quotation) => {
    if (isActive(quotation)) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          生效中
        </span>
      );
    }

    switch (quotation.status) {
      case 'draft':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            草稿
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            待审核
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            已通过
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            已拒绝
          </span>
        );
    }
  };

  const downloadExcel = () => {
    const data = quotations.map(q => ({
      '分区': q.zone,
      '单价': q.unitPrice,
      '生效日期': q.effectiveDate,
      '失效日期': q.expiryDate,
      '状态': q.status === 'draft' ? '草稿' : q.status === 'pending' ? '待审核' : q.status === 'approved' ? '已通过' : '已拒绝',
      '是否生效': isActive(q) ? '是' : '否',
      '上传时间': new Date(q.uploadTime).toLocaleString('zh-CN'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '报价单');
    XLSX.writeFile(workbook, `报价单_${new Date().toLocaleDateString('zh-CN')}.xlsx`);
  };

  if (quotations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">暂无报价数据</p>
      </div>
    );
  }

  // 扁平列表展示（生效中数据）
  if (!showAsBatch) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {quotations.some(q => isActive(q)) ? '生效中报价单' : '已失效报价单'} ({quotations.length}条)
          </h2>
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            导出Excel
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">分区</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">单价（美元）</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">生效日期</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">失效日期</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">上传时间</th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-600">批次</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 text-base text-gray-900 font-medium">
                    {q.zone}
                  </td>
                  <td className="px-5 py-3.5 text-base text-gray-900 font-semibold">
                    ${q.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    {q.effectiveDate}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    {q.expiryDate}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">
                    {new Date(q.uploadTime).toLocaleString('zh-CN')}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">
                    {q.batchId.split('-')[1]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 批次展示（其他状态数据）
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            报价单列表 ({quotations.length}条)
          </h2>
          <button
            onClick={downloadExcel}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            导出Excel
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {Object.entries(groupedByBatch).map(([batchId, batchQuotations]) => {
            const isExpanded = expandedBatches.has(batchId);
            const uploadTime = new Date(batchQuotations[0].uploadTime).toLocaleString('zh-CN');
            const isDraft = batchQuotations[0].status === 'draft';
            const isPending = batchQuotations[0].status === 'pending';
            const effectiveDate = batchQuotations[0].effectiveDate;
            const expiryDate = batchQuotations[0].expiryDate;

            return (
              <div key={batchId}>
                <div className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => toggleBatch(batchId)}
                    className="flex items-center gap-3 flex-1"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                    <div className="text-left">
                      <div className="flex items-center gap-2.5">
                        <p className="text-base font-medium text-gray-900">
                          批次 {batchId.split('-')[1]}
                        </p>
                        {isDraft && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            待确认
                          </span>
                        )}
                        {!isDraft && (
                          <div className="flex gap-1">
                            {batchQuotations.some(q => q.status === 'approved') && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                已通过
                              </span>
                            )}
                            {batchQuotations.some(q => q.status === 'pending') && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                待审核
                              </span>
                            )}
                            {batchQuotations.some(q => q.status === 'rejected') && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                已拒绝
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span>上传时间: {uploadTime}</span>
                        <span>·</span>
                        <span>{batchQuotations.length}条记录</span>
                        <span>·</span>
                        <span className="text-gray-700">生效日期: {effectiveDate}</span>
                        <span>·</span>
                        <span className="text-gray-700">失效日期: {expiryDate}</span>
                      </div>
                    </div>
                  </button>

                  {isDraft && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingBatchId(batchId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                      >
                        <FileEdit className="w-4 h-4" />
                        批量编辑
                      </button>
                      <button
                        onClick={() => onConfirmBatch(batchId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-[#0b5698] hover:bg-[#0d679f] rounded-md transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        确认提交
                      </button>
                      <button
                        onClick={() => onDeleteBatch(batchId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除批次
                      </button>
                    </div>
                  )}

                  {isPending && onRevokeBatch && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRevokeBatch(batchId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        撤销提交
                      </button>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div className="px-6 pb-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2.5 text-left text-sm font-medium text-gray-600">分区</th>
                            <th className="px-4 py-2.5 text-left text-sm font-medium text-gray-600">单价（美元）</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {batchQuotations.map((q) => {
                            return (
                              <tr key={q.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3.5 text-base text-gray-900">
                                  {q.zone}
                                </td>
                                <td className="px-4 py-3.5 text-base font-medium text-gray-900">
                                  ${q.unitPrice.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 批次编辑弹窗 */}
      {editingBatchId && onBatchUpdate && onBatchSaveAndSubmit && (() => {
        const batchQuotations = quotations.filter(q => q.batchId === editingBatchId);
        
        return (
          <BatchEditDialog
            batchId={editingBatchId}
            quotations={batchQuotations}
            onSaveDraft={(batchId, updatedQuotations) => {
              onBatchUpdate(batchId, updatedQuotations);
              setEditingBatchId(null);
            }}
            onSubmit={(batchId, updatedQuotations) => {
              onBatchSaveAndSubmit(batchId, updatedQuotations);
              setEditingBatchId(null);
            }}
            onClose={() => setEditingBatchId(null)}
          />
        );
      })()}
    </>
  );
}