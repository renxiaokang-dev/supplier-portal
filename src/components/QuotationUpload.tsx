import { useRef, useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, Check, X, Plus, Trash2, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Quotation } from '../pages/Root';

interface QuotationUploadProps {
  onUpload: (quotations: Omit<Quotation, 'id' | 'batchId' | 'status' | 'uploadTime'>[]) => void;
  onSaveDraft?: (quotations: Omit<Quotation, 'id' | 'batchId' | 'status' | 'uploadTime'>[]) => void;
}

interface PreviewQuotation {
  zone: string;
  unitPrice: number;
}

type ImportMode = 'excel' | 'manual' | 'quick';

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

export function QuotationUpload({ onUpload, onSaveDraft }: QuotationUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewQuotation[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>('quick');
  
  // 批次级别的日期
  const [batchEffectiveDate, setBatchEffectiveDate] = useState('');
  const [batchExpiryDate, setBatchExpiryDate] = useState('');
  
  // 手动录入状态
  const [manualData, setManualData] = useState<PreviewQuotation[]>([
    { zone: '', unitPrice: 0 }
  ]);

  // 快速报价状态 - 预填充所有分区
  const [quickData, setQuickData] = useState<PreviewQuotation[]>(
    PRESET_ZONES.map(zone => ({ zone, unitPrice: 0 }))
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    
    // 验证批次日期
    if (!batchEffectiveDate || !batchExpiryDate) {
      setError('请先填写批次的生效日期和失效日期');
      return;
    }
    
    if (new Date(batchEffectiveDate) >= new Date(batchExpiryDate)) {
      setError('生效日期必须早于失效日期');
      return;
    }

    setUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error('Excel文件为空');
      }

      const quotations = jsonData.map((row: any, index) => {
        if (!row['分区'] || !row['单价']) {
          throw new Error(`第${index + 2}行数据不完整，请检查必填字段`);
        }

        return {
          zone: String(row['分区']),
          unitPrice: Number(row['单价']),
        };
      });

      setPreviewData(quotations);
      setShowPreview(true);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '文件解析失败');
    } finally {
      setUploading(false);
    }
  };

  const handleManualAdd = () => {
    setManualData([...manualData, { zone: '', unitPrice: 0 }]);
  };

  const handleManualRemove = (index: number) => {
    if (manualData.length > 1) {
      setManualData(manualData.filter((_, i) => i !== index));
    }
  };

  const handleManualChange = (index: number, field: keyof PreviewQuotation, value: any) => {
    const newData = [...manualData];
    newData[index] = { ...newData[index], [field]: value };
    setManualData(newData);
  };

  const handleManualPreview = () => {
    setError('');
    
    // 验证批次日期
    if (!batchEffectiveDate || !batchExpiryDate) {
      setError('请填写批次的生效日期和失效日期');
      return;
    }
    
    if (new Date(batchEffectiveDate) >= new Date(batchExpiryDate)) {
      setError('生效日期必须早于失效日期');
      return;
    }
    
    // 验证数据
    for (let i = 0; i < manualData.length; i++) {
      const item = manualData[i];
      if (!item.zone || !item.unitPrice) {
        setError(`第${i + 1}行数据不完整，请填写所有必填字段`);
        return;
      }
      if (item.unitPrice <= 0) {
        setError(`第${i + 1}行单价必须大于0`);
        return;
      }
    }

    setPreviewData(manualData);
    setShowPreview(true);
  };

  const handleQuickPreview = () => {
    setError('');
    
    // 验证批次日期
    if (!batchEffectiveDate || !batchExpiryDate) {
      setError('请填写批次的生效日期和失效日期');
      return;
    }
    
    if (new Date(batchEffectiveDate) >= new Date(batchExpiryDate)) {
      setError('生效日期必须早于失效日期');
      return;
    }
    
    // 验证数据 - 至少填写一个分区的单价（大于0）
    const validQuotations = quickData.filter(item => item.unitPrice > 0);
    
    if (validQuotations.length === 0) {
      setError('请至少填写一个分区的单价');
      return;
    }

    // 只提交填写了单价的分区
    setPreviewData(validQuotations);
    setShowPreview(true);
  };

  const handleQuickChange = (index: number, value: number) => {
    const newData = [...quickData];
    newData[index] = { ...newData[index], unitPrice: value };
    setQuickData(newData);
  };

  const handleConfirmUpload = () => {
    // 将批次日期添加到每条数据中
    const quotationsWithDates = previewData.map(q => ({
      ...q,
      effectiveDate: batchEffectiveDate,
      expiryDate: batchExpiryDate,
    }));
    
    onUpload(quotationsWithDates);
    setShowPreview(false);
    setPreviewData([]);
    setBatchEffectiveDate('');
    setBatchExpiryDate('');
    
    // 重置手动录入
    if (importMode === 'manual') {
      setManualData([{ zone: '', unitPrice: 0 }]);
    }
    
    // 重置快速报价
    if (importMode === 'quick') {
      setQuickData(PRESET_ZONES.map(zone => ({ zone, unitPrice: 0 })));
    }
  };

  const handleSaveDraft = () => {
    // 将批次日期添加到每条数据中
    const quotationsWithDates = previewData.map(q => ({
      ...q,
      effectiveDate: batchEffectiveDate,
      expiryDate: batchExpiryDate,
    }));
    
    if (onSaveDraft) {
      onSaveDraft(quotationsWithDates);
    }
    setShowPreview(false);
    setPreviewData([]);
    setBatchEffectiveDate('');
    setBatchExpiryDate('');
    
    // 重置手动录入
    if (importMode === 'manual') {
      setManualData([{ zone: '', unitPrice: 0 }]);
    }
    
    // 重置快速报价
    if (importMode === 'quick') {
      setQuickData(PRESET_ZONES.map(zone => ({ zone, unitPrice: 0 })));
    }
  };

  const handleCancelUpload = () => {
    setShowPreview(false);
    setPreviewData([]);
  };

  const downloadTemplate = () => {
    const template = PRESET_ZONES.slice(0, 10).map((zone, index) => ({
      '分区': zone,
      '单价': (100 + index * 5).toFixed(2),
    }));

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '报价单');
    XLSX.writeFile(workbook, '报价单模板.xlsx');
  };

  if (showPreview) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#0b5698]" />
            <h2 className="text-base font-semibold text-gray-900">数据预览</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-[#0b5698]/10 text-[#0b5698] rounded-full">
              {previewData.length}条记录
            </span>
          </div>
        </div>

        {/* 显示批次日期息 */}
        <div className="mb-2.5 p-2.5 bg-[#0b5698]/5 border border-[#0b5698]/20 rounded-md">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">批次生效时间</h3>
          <div className="flex gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">生效日期：</span>
              <span>{batchEffectiveDate}</span>
            </div>
            <div>
              <span className="font-medium">失效日期：</span>
              <span>{batchExpiryDate}</span>
            </div>
          </div>
        </div>

        <div className="mb-2.5 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            请仔细检查以下数据，确认无误后点击"确认上传"按钮
          </p>
        </div>

        <div className="overflow-x-auto mb-2.5">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-gray-600">序号</th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-gray-600">分区</th>
                <th className="px-4 py-2.5 text-left text-sm font-medium text-gray-600">单价（美元）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {previewData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 text-base text-gray-900">{item.zone}</td>
                  <td className="px-4 py-3 text-base font-medium text-gray-900">${item.unitPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancelUpload}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            取消
          </button>
          {onSaveDraft && (
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
            >
              <Check className="w-4 h-4" />
              保存草稿
            </button>
          )}
          <button
            onClick={handleConfirmUpload}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#0b5698] hover:bg-[#0d679f] rounded-md transition-colors"
          >
            <Check className="w-4 h-4" />
            确认上传
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <FileSpreadsheet className="w-4 h-4 text-[#0b5698]" />
          <span className="text-sm font-semibold text-gray-900">选择导入方式</span>
        </div>
      </div>

      {/* 导入方式切换 */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setImportMode('quick')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${
            importMode === 'quick'
              ? 'bg-[#0b5698]/10 text-[#0b5698] border border-[#0b5698]/40'
              : 'text-gray-600 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          快速报价
        </button>
        <button
          onClick={() => setImportMode('excel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${
            importMode === 'excel'
              ? 'bg-[#0b5698]/10 text-[#0b5698] border border-[#0b5698]/40'
              : 'text-gray-600 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Excel导入
        </button>
        <button
          onClick={() => setImportMode('manual')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${
            importMode === 'manual'
              ? 'bg-[#0b5698]/10 text-[#0b5698] border border-[#0b5698]/40'
              : 'text-gray-600 border border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          手动报价
        </button>
      </div>

      {error && (
        <div className="mb-2.5 p-2 bg-red-50 border border-red-200 rounded flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-800">{error}</p>
        </div>
      )}

      {/* 批次级别的日期设置 */}
      <div className="mb-3 p-2.5 bg-[#0b5698]/5 border border-[#0b5698]/20 rounded">
        <h3 className="text-xs font-semibold text-gray-900 mb-1.5">批次生效时间设置</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              生效日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={batchEffectiveDate}
              onChange={(e) => setBatchEffectiveDate(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              失效日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={batchExpiryDate}
              onChange={(e) => setBatchExpiryDate(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-1.5">
          此批次所有报价单将使用相同的生效日期和失效日期
        </p>
      </div>

      {importMode === 'excel' ? (
        <>
          <div className="border-2 border-dashed border-gray-300 rounded p-5 text-center hover:border-[#0b5698] transition-colors mb-2.5">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-1.5"
            >
              <div className="w-10 h-10 bg-[#0b5698]/10 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#0b5698]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploading ? '正在解析...' : '点击上传Excel文件'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  支持 .xlsx 和 .xls 格式
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between mb-2">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#0b5698] bg-[#0b5698]/10 hover:bg-[#0b5698]/20 border border-[#0b5698]/30 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              下载Excel模板
            </button>
            <p className="text-xs text-gray-500">
              必须包含：分区、单价（数字格式）
            </p>
          </div>
        </>
      ) : importMode === 'quick' ? (
        <>
          <div className="mb-2.5 p-2.5 bg-green-50 border border-green-200 rounded">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-xs text-green-800">
                <p className="font-medium mb-0.5">快速报价模式</p>
                <p>所有LAX分区已预填充，您只需填写每个分区的单价即可，无需手动选择分区</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-2.5 max-h-96 overflow-y-auto border border-gray-200 rounded p-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {quickData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded p-2 bg-white">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {item.zone}
                  </label>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleQuickChange(index, parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#0b5698]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleQuickPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#0b5698] hover:bg-[#0d679f] rounded transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              预览数据
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2 mb-2.5">
            {manualData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded p-2.5">
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-700">记录 {index + 1}</span>
                  {manualData.length > 1 && (
                    <button
                      onClick={() => handleManualRemove(index)}
                      className="p-0.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      分区 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.zone}
                      onChange={(e) => handleManualChange(index, 'zone', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                    >
                      <option value="">请选择分区</option>
                      {PRESET_ZONES.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      单价（美元） <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleManualChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleManualAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#0b5698] bg-[#0b5698]/10 hover:bg-[#0b5698]/20 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              添加记录
            </button>
            <button
              onClick={handleManualPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#0b5698] hover:bg-[#0d679f] rounded transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              预览数据
            </button>
          </div>
        </>
      )}

      <div className="mt-2.5 pt-2.5 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">提示：</span>
          上传数据后将保存为草稿，可在线编辑调整，确认后提交审核
        </p>
      </div>
    </div>
  );
}