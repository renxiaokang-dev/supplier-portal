import { useContext } from 'react';
import { AppContext } from '../pages/Root';
import { Warehouse, ChevronDown } from 'lucide-react';

interface WarehouseSelectorProps {
  className?: string;
}

export function WarehouseSelector({ className = '' }: WarehouseSelectorProps) {
  const { companies, selectedCompanyId, getCurrentWarehouses, selectedWarehouseId, setSelectedWarehouseId } = useContext(AppContext);
  const warehouses = getCurrentWarehouses();
  const selectedWarehouse = warehouses.find(w => w.id === selectedWarehouseId);
  const currentCompany = companies.find(c => c.id === selectedCompanyId);

  if (!selectedCompanyId) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <Warehouse className="w-4 h-4" />
        <span>请先选择所属公司</span>
      </div>
    );
  }

  if (warehouses.length === 0) {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <Warehouse className="w-4 h-4" />
        <span>当前公司暂无可用仓库</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          选择仓库:
        </label>
        <span className="text-xs text-gray-500">
          ({currentCompany?.name})
        </span>
      </div>
      <div className="relative">
        <select
          value={selectedWarehouseId || ''}
          onChange={(e) => setSelectedWarehouseId(e.target.value)}
          className="w-full appearance-none px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b5698] focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors"
        >
          {warehouses.map(warehouse => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.code} - {warehouse.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
      <div className="text-xs text-gray-500">
        共 {warehouses.length} 个已开通仓库
      </div>
    </div>
  );
}