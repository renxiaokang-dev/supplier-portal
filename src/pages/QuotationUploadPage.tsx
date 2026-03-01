import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { QuotationContext, AppContext } from './Root';
import { QuotationUpload } from '../components/QuotationUpload';
import { WarehouseSelector } from '../components/WarehouseSelector';
import { FileSpreadsheet } from 'lucide-react';

export function QuotationUploadPage() {
  const navigate = useNavigate();
  const { handleUpload } = useContext(QuotationContext);
  const { selectedCompanyId, selectedWarehouseId } = useContext(AppContext);

  const onUploadComplete = (quotations: any) => {
    handleUpload(quotations);
    // 上传成功后跳转到查询页面
    navigate('/query');
  };

  return (
    <div className="p-6">
      {/* 页面标题提示 */}
      <div className="mb-5 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg px-4 py-3">
        <div className="flex-shrink-0">
          <FileSpreadsheet className="w-5 h-5 text-[#0b5698]" />
        </div>
        <div>
          <p className="text-base text-gray-900">
            支持Excel批量导入、手动录入、快速报价三种方式，按批次审核（只能全部通过或拒绝）
          </p>
        </div>
      </div>

      {/* 仓库选择器 */}
      <div className="mb-5 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <WarehouseSelector className="w-full max-w-md" />
      </div>

      <QuotationUpload onUpload={onUploadComplete} onSaveDraft={onUploadComplete} />
    </div>
  );
}