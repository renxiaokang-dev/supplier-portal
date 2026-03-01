import { useState } from 'react';
import { Clock, Calendar, Plus, Save, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface TimesheetEntry {
  id: string;
  date: string;
  workType: string;
  startTime: string;
  endTime: string;
  hours: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved';
}

export function TimesheetEntry() {
  const [language] = useState<'zh' | 'en'>('zh');
  const [entries, setEntries] = useState<TimesheetEntry[]>([
    {
      id: '1',
      date: '2026-02-24',
      workType: 'regular',
      startTime: '08:00',
      endTime: '17:00',
      hours: 8,
      description: '仓库理货作业',
      status: 'submitted',
    },
    {
      id: '2',
      date: '2026-02-25',
      workType: 'overtime',
      startTime: '18:00',
      endTime: '22:00',
      hours: 4,
      description: '加班装卸货物',
      status: 'approved',
    },
  ]);

  const [newEntry, setNewEntry] = useState({
    date: '',
    workType: 'regular',
    startTime: '',
    endTime: '',
    description: '',
  });

  const t = {
    zh: {
      title: '工时填报',
      subtitle: '记录和提交您的工作时间',
      addEntry: '添加工时记录',
      date: '日期',
      workType: '工作类型',
      startTime: '开始时间',
      endTime: '结束时间',
      hours: '工时',
      description: '工作描述',
      status: '状态',
      actions: '操作',
      regular: '正常工时',
      overtime: '加班工时',
      draft: '草稿',
      submitted: '已提交',
      approved: '已批准',
      save: '保存',
      submit: '提交',
      cancel: '取消',
      totalHours: '总工时',
      thisWeek: '本周',
      thisMonth: '本月',
      datePlaceholder: '选择日期',
      descriptionPlaceholder: '请输入工作内容描述',
    },
    en: {
      title: 'Timesheet Entry',
      subtitle: 'Record and submit your working hours',
      addEntry: 'Add Timesheet Entry',
      date: 'Date',
      workType: 'Work Type',
      startTime: 'Start Time',
      endTime: 'End Time',
      hours: 'Hours',
      description: 'Description',
      status: 'Status',
      actions: 'Actions',
      regular: 'Regular Hours',
      overtime: 'Overtime',
      draft: 'Draft',
      submitted: 'Submitted',
      approved: 'Approved',
      save: 'Save',
      submit: 'Submit',
      cancel: 'Cancel',
      totalHours: 'Total Hours',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      datePlaceholder: 'Select date',
      descriptionPlaceholder: 'Enter work description',
    },
  }[language];

  const calculateHours = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.startTime || !newEntry.endTime) {
      alert('请填写完整的日期和时间信息');
      return;
    }

    const hours = calculateHours(newEntry.startTime, newEntry.endTime);
    const entry: TimesheetEntry = {
      id: Date.now().toString(),
      ...newEntry,
      hours,
      status: 'draft',
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      date: '',
      workType: 'regular',
      startTime: '',
      endTime: '',
      description: '',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      submitted: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
    }[status];

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${styles}`}>
        {t[status as keyof typeof t]}
      </span>
    );
  };

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#0b5698] rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-600 font-medium">{t.thisWeek}</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">{totalHours}h</div>
            </div>
            <Clock className="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-green-600 font-medium">{t.thisMonth}</div>
              <div className="text-2xl font-bold text-green-900 mt-1">{totalHours}h</div>
            </div>
            <FileText className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-600 font-medium">{t.totalHours}</div>
              <div className="text-2xl font-bold text-purple-900 mt-1">{totalHours}h</div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-purple-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* 添加工时记录表单 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-[#0b5698]" />
          <h2 className="text-lg font-semibold text-gray-900">{t.addEntry}</h2>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">{t.date}</Label>
            <Input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="h-10"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">{t.workType}</Label>
            <Select
              value={newEntry.workType}
              onValueChange={(value) => setNewEntry({ ...newEntry, workType: value })}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">{t.regular}</SelectItem>
                <SelectItem value="overtime">{t.overtime}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">{t.startTime}</Label>
            <Input
              type="time"
              value={newEntry.startTime}
              onChange={(e) => setNewEntry({ ...newEntry, startTime: e.target.value })}
              className="h-10"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">{t.endTime}</Label>
            <Input
              type="time"
              value={newEntry.endTime}
              onChange={(e) => setNewEntry({ ...newEntry, endTime: e.target.value })}
              className="h-10"
            />
          </div>

          <div className="col-span-2">
            <Label className="text-sm font-medium mb-2 block">{t.description}</Label>
            <Input
              value={newEntry.description}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              placeholder={t.descriptionPlaceholder}
              className="h-10"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleAddEntry} className="bg-[#0b5698] hover:bg-[#0d679f]">
            <Plus className="w-4 h-4 mr-2" />
            {t.addEntry}
          </Button>
        </div>
      </div>

      {/* 工时记录列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.date}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.workType}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.startTime}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.endTime}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.hours}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.description}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{entry.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.workType === 'regular' ? t.regular : t.overtime}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.startTime}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{entry.endTime}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.hours}h</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {entry.description}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(entry.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
