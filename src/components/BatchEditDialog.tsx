import { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Quotation } from '../pages/Root';

interface BatchEditDialogProps {
  batchId: string;
  quotations: Quotation[];
  onSaveDraft: (batchId: string, quotations: Quotation[]) => void;
  onSubmit: (batchId: string, quotations: Quotation[]) => void;
  onClose: () => void;
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

export function BatchEditDialog({
  batchId,
  quotations,
  onSaveDraft,
  onSubmit,
  onClose,
}: BatchEditDialogProps) {
  const [editableQuotations, setEditableQuotations] = useState<Quotation[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const effectiveDate = quotations[0]?.effectiveDate || '';
  const expiryDate = quotations[0]?.expiryDate || '';

  useEffect(() => {
    setEditableQuotations(quotations.map(q => ({ ...q })));
  }, [quotations]);

  const handleAddNew = () => {
    const newQuotation: Quotation = {
      id: `new-${Date.now()}`,
      zone: '',
      unitPrice: 0,
      effectiveDate: effectiveDate,
      expiryDate: expiryDate,
      status: 'draft',
      uploadTime: new Date().toISOString(),
      batchId: batchId,
    };
    setEditableQuotations([...editableQuotations, newQuotation]);
  };

  const handleDelete = (index: number) => {
    if (editableQuotations.length > 1) {
      setEditableQuotations(editableQuotations.filter((_, i) => i !== index));
      // 清除该项的错误
      const newErrors = { ...errors };
      delete newErrors[`${index}-zone`];
      delete newErrors[`${index}-price`];
      setErrors(newErrors);
    }
  };

  const handleChange = (index: number, field: keyof Quotation, value: any) => {
    const newData = [...editableQuotations];
    newData[index] = { ...newData[index], [field]: value };
    setEditableQuotations(newData);
    
    // 清除该字段的错误
    if (field === 'zone') {
      const newErrors = { ...errors };
      delete newErrors[`${index}-zone`];
      setErrors(newErrors);
    } else if (field === 'unitPrice') {
      const newErrors = { ...errors };
      delete newErrors[`${index}-price`];
      setErrors(newErrors);
    }
  };

  const validateAll = () => {
    const newErrors: { [key: string]: string } = {};
    let hasError = false;

    editableQuotations.forEach((q, index) => {
      if (!q.zone || q.zone.trim() === '') {
        newErrors[`${index}-zone`] = '请选择分区';
        hasError = true;
      }
      if (!q.unitPrice || q.unitPrice <= 0) {
        newErrors[`${index}-price`] = '请输入有效单价';
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  const handleSaveDraft = () => {
    if (!validateAll()) {
      return;
    }

    if (editableQuotations.length === 0) {
      alert('批次中至少需要一条报价记录');
      return;
    }

    onSaveDraft(batchId, editableQuotations);
  };

  const handleSubmit = () => {
    if (!validateAll()) {
      return;
    }

    if (editableQuotations.length === 0) {
      alert('批次中至少需要一条报价记录');
      return;
    }

    onSubmit(batchId, editableQuotations);
  };

  const hasChanges = JSON.stringify(editableQuotations) !== JSON.stringify(quotations);

  return (
    <div 
      className="fixed inset-0 bg-black/30 flex items-start justify-center z-50 p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (hasChanges) {
            if (window.confirm('有未保存的修改，确定要关闭吗？')) {
              onClose();
            }
          } else {
            onClose();
          }
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl my-6">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-[#0b5698] to-[#0d679f] text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              批量编辑批次 {batchId.split('-')[1]}
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              生效日期: {effectiveDate} | 失效日期: {expiryDate}
            </p>
          </div>
          <button
            onClick={() => {
              if (hasChanges) {
                if (window.confirm('有未保存的修改，确定要关闭吗？')) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}
            className="text-white hover:bg-white/20 p-1.5 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {/* 操作栏 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">共 {editableQuotations.length} 条记录</span>
              {hasChanges && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                  有未保存的修改
                </span>
              )}
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增记录
            </button>
          </div>

          {/* 手动报价样式的表单 */}
          <div className="space-y-2.5 mb-4 max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg p-3">
            {editableQuotations.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                暂无数据，点击"新增记录"添加报价
              </div>
            ) : (
              editableQuotations.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">记录 {index + 1}</span>
                    {editableQuotations.length > 1 && (
                      <button
                        onClick={() => handleDelete(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        分区 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={item.zone}
                        onChange={(e) => handleChange(index, 'zone', e.target.value)}
                        className={`w-full px-3 py-2 text-sm border ${errors[`${index}-zone`] ? 'border-red-300' : 'border-gray-300'} rounded focus:outline-none focus:border-[#0b5698]`}
                      >
                        <option value="">请选择分区</option>
                        {PRESET_ZONES.map((zone) => (
                          <option key={zone} value={zone}>
                            {zone}
                          </option>
                        ))}
                      </select>
                      {errors[`${index}-zone`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`${index}-zone`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        单价（美元） <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice || ''}
                        onChange={(e) => handleChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className={`w-full px-3 py-2 text-sm border ${errors[`${index}-price`] ? 'border-red-300' : 'border-gray-300'} rounded focus:outline-none focus:border-[#0b5698]`}
                      />
                      {errors[`${index}-price`] && (
                        <p className="text-xs text-red-600 mt-1">{errors[`${index}-price`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 说明 */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">操作说明：</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>可以对批次中的报价记录进行增删改操作</li>
                  <li>从下拉列表选择分区，输入对应单价</li>
                  <li>修改后可选择"保存草稿"（保持草稿状态）或"确认提交"（提交审核）</li>
                  <li>批次中的所有记录共享相同的生效/失效日期</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg flex items-center justify-between">
          <button
            onClick={() => {
              if (hasChanges) {
                if (window.confirm('有未保存的修改，确定要关闭吗？')) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}
            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
          >
            取消
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              保存草稿
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm text-white bg-[#0b5698] hover:bg-[#0d679f] rounded-md transition-colors"
            >
              确认提交
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
