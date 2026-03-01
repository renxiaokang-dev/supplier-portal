import { useState } from 'react';
import { DollarSign, FileText, Plus, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

interface PaymentRequest {
  id: string;
  requestDate: string;
  amount: number;
  type: string;
  period: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  remarks?: string;
}

export function PaymentRequest() {
  const [language] = useState<'zh' | 'en'>('zh');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState<PaymentRequest[]>([
    {
      id: '1',
      requestDate: '2026-02-20',
      amount: 4500.00,
      type: 'regular',
      period: '2026-02 Week 3',
      description: '2月第三周工资',
      status: 'approved',
    },
    {
      id: '2',
      requestDate: '2026-02-15',
      amount: 1200.00,
      type: 'overtime',
      period: '2026-02 Week 2',
      description: '加班费申请',
      status: 'paid',
    },
    {
      id: '3',
      requestDate: '2026-02-25',
      amount: 5000.00,
      type: 'regular',
      period: '2026-02 Week 4',
      description: '2月第四周工资',
      status: 'pending',
    },
  ]);

  const [newRequest, setNewRequest] = useState({
    amount: '',
    type: 'regular',
    period: '',
    description: '',
  });

  const t = {
    zh: {
      title: '申请付款',
      subtitle: '提交和管理您的付款申请',
      createRequest: '新建付款申请',
      requestDate: '申请日期',
      amount: '金额',
      type: '类型',
      period: '周期',
      description: '说明',
      status: '状态',
      actions: '操作',
      regular: '正常工资',
      overtime: '加班费',
      bonus: '奖金',
      allowance: '津贴',
      pending: '待审核',
      approved: '已批准',
      rejected: '已拒绝',
      paid: '已支付',
      save: '保存',
      submit: '提交',
      cancel: '取消',
      totalPending: '待支付',
      totalApproved: '已批准',
      totalPaid: '已支付',
      amountPlaceholder: '请输入金额',
      periodPlaceholder: '例如：2026-02 Week 4',
      descriptionPlaceholder: '请输入付款说明',
      createSuccess: '付款申请已创建',
      requestDetails: '申请详情',
    },
    en: {
      title: 'Payment Request',
      subtitle: 'Submit and manage your payment requests',
      createRequest: 'Create Payment Request',
      requestDate: 'Request Date',
      amount: 'Amount',
      type: 'Type',
      period: 'Period',
      description: 'Description',
      status: 'Status',
      actions: 'Actions',
      regular: 'Regular Salary',
      overtime: 'Overtime Pay',
      bonus: 'Bonus',
      allowance: 'Allowance',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      paid: 'Paid',
      save: 'Save',
      submit: 'Submit',
      cancel: 'Cancel',
      totalPending: 'Pending',
      totalApproved: 'Approved',
      totalPaid: 'Paid',
      amountPlaceholder: 'Enter amount',
      periodPlaceholder: 'e.g., 2026-02 Week 4',
      descriptionPlaceholder: 'Enter description',
      createSuccess: 'Payment request created',
      requestDetails: 'Request Details',
    },
  }[language];

  const handleCreateRequest = () => {
    if (!newRequest.amount || !newRequest.period) {
      alert('请填写金额和周期');
      return;
    }

    const request: PaymentRequest = {
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0],
      amount: parseFloat(newRequest.amount),
      type: newRequest.type,
      period: newRequest.period,
      description: newRequest.description,
      status: 'pending',
    };

    setRequests([request, ...requests]);
    setNewRequest({
      amount: '',
      type: 'regular',
      period: '',
      description: '',
    });
    setIsDialogOpen(false);
    alert(t.createSuccess);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      paid: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle2 },
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock };

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {t[status as keyof typeof t]}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    return t[type as keyof typeof t] || type;
  };

  const calculateTotals = () => {
    return {
      pending: requests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
      approved: requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0),
      paid: requests.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0),
    };
  };

  const totals = calculateTotals();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0b5698] rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
            </div>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-[#0b5698] hover:bg-[#0d679f]"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.createRequest}
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-yellow-600 font-medium">{t.totalPending}</div>
              <div className="text-2xl font-bold text-yellow-900 mt-1">
                ${totals.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-600 font-medium">{t.totalApproved}</div>
              <div className="text-2xl font-bold text-green-900 mt-1">
                ${totals.approved.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium">{t.totalPaid}</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                ${totals.paid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* 付款申请列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.requestDate}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.period}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.type}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.amount}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.description}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{request.requestDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{request.period}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{getTypeLabel(request.type)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    ${request.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {request.description}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建付款申请弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {t.createRequest}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {t.subtitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t.type} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newRequest.type}
                  onValueChange={(value) => setNewRequest({ ...newRequest, type: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">{t.regular}</SelectItem>
                    <SelectItem value="overtime">{t.overtime}</SelectItem>
                    <SelectItem value="bonus">{t.bonus}</SelectItem>
                    <SelectItem value="allowance">{t.allowance}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t.amount} <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRequest.amount}
                  onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                  placeholder={t.amountPlaceholder}
                  className="h-10"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                {t.period} <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newRequest.period}
                onChange={(e) => setNewRequest({ ...newRequest, period: e.target.value })}
                placeholder={t.periodPlaceholder}
                className="h-10"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">{t.description}</Label>
              <Textarea
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                placeholder={t.descriptionPlaceholder}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="px-6 h-10"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleCreateRequest}
              className="bg-[#0b5698] hover:bg-[#0d679f] px-6 h-10"
            >
              {t.submit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
