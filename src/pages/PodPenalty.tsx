import { useState } from 'react';
import { Upload, X, Eye, FileDown, FileUp, Search, RotateCcw, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { WarehouseSelector } from '../components/WarehouseSelector';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type AppealStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'expired';
type AppealType = 'misjudgment' | 'modify-reason' | 'reported' | 'other' | '';

interface PodPenaltyRecord {
  id: string;
  trackingNumber: string;
  deliveryAddress: string;
  podImages: string[];
  errorReason: string;
  pickupWarehouse: string;
  boxCreatedDate: string;
  signedDate: string;
  gridArea: string;
  boxNumber: string;
  penaltyAmount: number;
  inspectionDate: string;
  appealType: AppealType;
  appealReason: string;
  appealAttachments: string[];
  appealStatus: AppealStatus;
  workOrderNumber: string;
  reviewComment?: string;
}

export function PodPenalty() {
  const [searchFilters, setSearchFilters] = useState({
    trackingNumber: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  // 申诉弹窗状态
  const [appealDialogOpen, setAppealDialogOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PodPenaltyRecord | null>(null);
  const [appealForm, setAppealForm] = useState({
    appealType: '' as AppealType,
    appealReason: '',
    attachments: [] as File[],
  });
  const [appealErrors, setAppealErrors] = useState<{ [key: string]: string }>({});

  // 图片预览
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 图片切换功能
  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setPreviewImage(previewImages[newIndex]);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < previewImages.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setPreviewImage(previewImages[newIndex]);
    }
  };

  // 模拟数据
  const mockData: PodPenaltyRecord[] = [
    {
      id: '1',
      trackingNumber: 'YW.A00025410492',
      deliveryAddress: '123 Main St, Los Angeles, CA 90001',
      podImages: [
        'https://images.unsplash.com/photo-1766234538697-6b33f97ed86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yc3RlcHxlbnwxfHx8fDE3NzIwMjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: 'POD信息无效 - 签名不清晰',
      pickupWarehouse: 'LAX-A仓库',
      boxCreatedDate: '2025-01-10',
      signedDate: '2025-01-14',
      gridArea: 'LAX-A-001',
      boxNumber: 'BX202501100123',
      penaltyAmount: 2,
      inspectionDate: '2025-01-15',
      appealType: '',
      appealReason: '',
      appealAttachments: [],
      appealStatus: 'pending',
      workOrderNumber: 'WO-2025-001',
    },
    {
      id: '2',
      trackingNumber: 'YW.A00025310260',
      deliveryAddress: 'Apartment 3D, 30 Park Avenue, New York, NY 10016',
      podImages: [
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1765605897167-7a4da7d3887c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZW50cmFuY2V8ZW58MXx8fHwxNzcyMDkzNDY1fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: '图片中建筑物与地址不符',
      pickupWarehouse: 'LAX-B仓库',
      boxCreatedDate: '2025-01-09',
      signedDate: '2025-01-13',
      gridArea: 'LAX-B-005',
      boxNumber: 'BX202501090088',
      penaltyAmount: 100,
      inspectionDate: '2025-01-14',
      appealType: 'modify-reason',
      appealReason: '该地址为新建小区，Google地图尚未更新',
      appealAttachments: ['proof_photo_1.jpg', 'google_map_screenshot.png'],
      appealStatus: 'reviewing',
      workOrderNumber: 'WO-2025-002',
    },
    {
      id: '3',
      trackingNumber: 'YW.A00025210123',
      deliveryAddress: '456 Oak Street, San Francisco, CA 94102',
      podImages: [
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1765605897167-7a4da7d3887c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZW50cmFuY2V8ZW58MXx8fHwxNzcyMDkzNDY1fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: 'POD逾期未交',
      pickupWarehouse: 'LAX-A仓库',
      boxCreatedDate: '2025-01-08',
      signedDate: '2025-01-12',
      gridArea: 'LAX-A-003',
      boxNumber: 'BX202501080045',
      penaltyAmount: 2,
      inspectionDate: '2025-01-13',
      appealType: 'reported',
      appealReason: '已提前报备系统故障',
      appealAttachments: ['system_report.pdf'],
      appealStatus: 'approved',
      workOrderNumber: 'WO-2025-003',
      reviewComment: '审核通过，免除处罚',
    },
    {
      id: '4',
      trackingNumber: 'YW.A00025110456',
      deliveryAddress: '789 Pine Road, Seattle, WA 98101',
      podImages: [
        'https://images.unsplash.com/photo-1765605897167-7a4da7d3887c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZW50cmFuY2V8ZW58MXx8fHwxNzcyMDkzNDY1fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1766234538697-6b33f97ed86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yc3RlcHxlbnwxfHx8fDE3NzIwMjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: '恶意错传POD照片',
      pickupWarehouse: 'LAX-B仓库',
      boxCreatedDate: '2025-01-05',
      signedDate: '2025-01-09',
      gridArea: 'LAX-B-007',
      boxNumber: 'BX202501050012',
      penaltyAmount: 100,
      inspectionDate: '2025-01-10',
      appealType: 'misjudgment',
      appealReason: '认为系统误判',
      appealAttachments: ['evidence_1.jpg', 'evidence_2.jpg'],
      appealStatus: 'rejected',
      workOrderNumber: 'WO-2025-004',
      reviewComment: '经核实确为错误POD，申诉驳回',
    },
    {
      id: '5',
      trackingNumber: 'YW.A00024910789',
      deliveryAddress: '321 Elm Avenue, Boston, MA 02101',
      podImages: [
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1766234538697-6b33f97ed86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yc3RlcHxlbnwxfHx8fDE3NzIwMjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: 'POD照片模糊不清',
      pickupWarehouse: 'LAX-A仓库',
      boxCreatedDate: '2024-12-15',
      signedDate: '2024-12-19',
      gridArea: 'LAX-A-009',
      boxNumber: 'BX202412150099',
      penaltyAmount: 2,
      inspectionDate: '2024-12-20',
      appealType: '',
      appealReason: '',
      appealAttachments: [],
      appealStatus: 'expired',
      workOrderNumber: 'WO-2024-128',
    },
    {
      id: '6',
      trackingNumber: 'YW.A00024810321',
      deliveryAddress: '555 Broadway, Chicago, IL 60601',
      podImages: [
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1766234538697-6b33f97ed86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yc3RlcHxlbnwxfHx8fDE3NzIwMjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: 'POD信息无效 - 缺少签名',
      pickupWarehouse: 'LAX-A仓库',
      boxCreatedDate: '2025-01-12',
      signedDate: '2025-01-16',
      gridArea: 'LAX-A-005',
      boxNumber: 'BX202501120067',
      penaltyAmount: 2,
      inspectionDate: '2025-01-17',
      appealType: '',
      appealReason: '',
      appealAttachments: [],
      appealStatus: 'pending',
      workOrderNumber: 'WO-2025-005',
    },
    {
      id: '7',
      trackingNumber: 'YW.A00024710654',
      deliveryAddress: '888 Market Street, Dallas, TX 75201',
      podImages: [
        'https://images.unsplash.com/photo-1766234538697-6b33f97ed86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yc3RlcHxlbnwxfHx8fDE3NzIwMjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1765605897167-7a4da7d3887c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZW50cmFuY2V8ZW58MXx8fHwxNzcyMDkzNDY1fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: '图片质量不达标',
      pickupWarehouse: 'LAX-B仓库',
      boxCreatedDate: '2025-01-11',
      signedDate: '2025-01-15',
      gridArea: 'LAX-B-009',
      boxNumber: 'BX202501110033',
      penaltyAmount: 2,
      inspectionDate: '2025-01-16',
      appealType: '',
      appealReason: '',
      appealAttachments: [],
      appealStatus: 'pending',
      workOrderNumber: 'WO-2025-006',
    },
    {
      id: '8',
      trackingNumber: 'YW.A00024610987',
      deliveryAddress: '999 Washington Ave, Houston, TX 77002',
      podImages: [
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1765605897167-7a4da7d3887c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZW50cmFuY2V8ZW58MXx8fHwxNzcyMDkzNDY1fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: 'POD照片角度不对',
      pickupWarehouse: 'LAX-A仓库',
      boxCreatedDate: '2025-01-10',
      signedDate: '2025-01-14',
      gridArea: 'LAX-A-007',
      boxNumber: 'BX202501100098',
      penaltyAmount: 100,
      inspectionDate: '2025-01-15',
      appealType: 'misjudgment',
      appealReason: '由于现场光线问题导致拍摄角度受限',
      appealAttachments: ['scene_photo.jpg'],
      appealStatus: 'reviewing',
      workOrderNumber: 'WO-2025-007',
    },
    {
      id: '9',
      trackingNumber: 'YW.A00024510432',
      deliveryAddress: '1234 Fifth Avenue, Phoenix, AZ 85001',
      podImages: [
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1765605897167-7a4da7d3887c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZW50cmFuY2V8ZW58MXx8fHwxNzcyMDkzNDY1fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: 'POD信息缺失',
      pickupWarehouse: 'LAX-B仓库',
      boxCreatedDate: '2025-01-09',
      signedDate: '2025-01-13',
      gridArea: 'LAX-B-011',
      boxNumber: 'BX202501090055',
      penaltyAmount: 2,
      inspectionDate: '2025-01-14',
      appealType: '',
      appealReason: '',
      appealAttachments: [],
      appealStatus: 'pending',
      workOrderNumber: 'WO-2025-008',
    },
    {
      id: '10',
      trackingNumber: 'YW.A00024410765',
      deliveryAddress: '4567 Sunset Blvd, San Diego, CA 92101',
      podImages: [
        'https://images.unsplash.com/photo-1765605897167-7a4da7d3887c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpZGVudGlhbCUyMGJ1aWxkaW5nJTIwZW50cmFuY2V8ZW58MXx8fHwxNzcyMDkzNDY1fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1766234538697-6b33f97ed86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yc3RlcHxlbnwxfHx8fDE3NzIwMjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: 'POD上传超时',
      pickupWarehouse: 'LAX-A仓库',
      boxCreatedDate: '2025-01-08',
      signedDate: '2025-01-12',
      gridArea: 'LAX-A-011',
      boxNumber: 'BX202501080022',
      penaltyAmount: 2,
      inspectionDate: '2025-01-13',
      appealType: 'reported',
      appealReason: '网络故障已提前报备',
      appealAttachments: ['network_report.pdf'],
      appealStatus: 'approved',
      workOrderNumber: 'WO-2025-009',
      reviewComment: '情况属实，免除处罚',
    },
    {
      id: '11',
      trackingNumber: 'YW.A00024310098',
      deliveryAddress: '7890 Lincoln Road, Denver, CO 80201',
      podImages: [
        'https://images.unsplash.com/photo-1669066972075-72b6a5fa88e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBidWlsZGluZyUyMHN0cmVldHxlbnwxfHx8fDE3NzIwOTM0NjV8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1766234538697-6b33f97ed86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yc3RlcHxlbnwxfHx8fDE3NzIwMjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: '签名不完整',
      pickupWarehouse: 'LAX-B仓库',
      boxCreatedDate: '2025-01-07',
      signedDate: '2025-01-11',
      gridArea: 'LAX-B-013',
      boxNumber: 'BX202501070044',
      penaltyAmount: 2,
      inspectionDate: '2025-01-12',
      appealType: '',
      appealReason: '',
      appealAttachments: [],
      appealStatus: 'pending',
      workOrderNumber: 'WO-2025-010',
    },
    {
      id: '12',
      trackingNumber: 'YW.A00024210543',
      deliveryAddress: '3210 Ocean Drive, Miami, FL 33139',
      podImages: [
        'https://images.unsplash.com/photo-1771273359277-0eaaa654d1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3VzZSUyMG51bWJlciUyMGFkZHJlc3N8ZW58MXx8fHwxNzcyMDg2OTM4fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1766234538697-6b33f97ed86a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yc3RlcHxlbnwxfHx8fDE3NzIwMjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1606295835125-2338079fdfc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduZWQlMjBwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcyMDkzNDY0fDA&ixlib=rb-4.1.0&q=80&w=400',
        'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yc3RlcCUyMGRlbGl2ZXJ5JTIwYm94fGVufDF8fHx8MTc3MjA5MzQ2NHww&ixlib=rb-4.1.0&q=80&w=400',
      ],
      errorReason: 'POD照片重复',
      pickupWarehouse: 'LAX-A仓库',
      boxCreatedDate: '2025-01-06',
      signedDate: '2025-01-10',
      gridArea: 'LAX-A-013',
      boxNumber: 'BX202501060011',
      penaltyAmount: 100,
      inspectionDate: '2025-01-11',
      appealType: 'other',
      appealReason: '系统上传故障导致重复',
      appealAttachments: ['system_log.txt'],
      appealStatus: 'rejected',
      workOrderNumber: 'WO-2025-011',
      reviewComment: '经查证为人为操作失误',
    },
  ];

  const [records, setRecords] = useState<PodPenaltyRecord[]>(mockData);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 计算分页数据
  const totalPages = Math.ceil(records.length / pageSize);
  const paginatedRecords = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 计算统计数据
  const statistics = {
    totalErrors: records.filter(r => 
      r.appealStatus === 'pending' || r.appealStatus === 'reviewing'
    ).length,
    totalPenalty: records
      .filter(r => r.appealStatus !== 'approved')
      .reduce((sum, r) => sum + r.penaltyAmount, 0),
  };

  // 状态配置
  const statusConfig = {
    pending: { label: '待申诉', color: 'bg-gray-100 text-gray-700', buttonColor: 'bg-[#055AA1] hover:bg-[#044a8a]' },
    reviewing: { label: '审批中', color: 'bg-orange-100 text-orange-700', buttonColor: 'bg-gray-400' },
    approved: { label: '申诉通过', color: 'bg-green-100 text-green-700', buttonColor: 'bg-gray-400' },
    rejected: { label: '申诉败', color: 'bg-red-100 text-red-700', buttonColor: 'bg-gray-400' },
    expired: { label: '超期自动认可', color: 'bg-gray-200 text-gray-500', buttonColor: 'bg-gray-300' },
  };

  // 申诉类型选项
  const appealTypeOptions = [
    { value: 'misjudgment', label: 'POD误判', description: '车队任务POD本身合格，认为判定错误，申请免除罚款' },
    { value: 'modify-reason', label: '修改错误原因', description: '认可POD不合格，但认为判定的违规类型过重' },
    { value: 'reported', label: '已报备', description: '该异常情况在配送前已通过其他渠道向官方报备' },
    { value: 'other', label: '其他原因', description: '自定义填写说明' },
  ];

  // 获取申诉类型标签
  const getAppealTypeLabel = (type: AppealType) => {
    if (!type) return '-';
    return appealTypeOptions.find(o => o.value === type)?.label || '-';
  };

  // 打开申诉弹窗
  const handleOpenAppeal = (record: PodPenaltyRecord) => {
    setCurrentRecord(record);
    setAppealForm({
      appealType: record.appealType || '',
      appealReason: record.appealReason || '',
      attachments: [],
    });
    setAppealErrors({});
    setAppealDialogOpen(true);
  };

  // 处理申诉提交
  const handleSubmitAppeal = () => {
    const errors: { [key: string]: string } = {};

    if (!appealForm.appealType) {
      errors.appealType = '请选择申诉类型';
    }

    if (!appealForm.appealReason.trim()) {
      errors.appealReason = '请填写申诉原因';
    }

    // 某些申诉类型必须上传附件
    if ((appealForm.appealType === 'reported' || appealForm.appealType === 'misjudgment') 
        && appealForm.attachments.length === 0) {
      errors.attachments = '该申诉类型需要上传证明材料';
    }

    setAppealErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // 提交申诉
    if (currentRecord) {
      setRecords(prev => prev.map(r => 
        r.id === currentRecord.id 
          ? {
              ...r,
              appealStatus: 'reviewing' as AppealStatus,
              appealType: appealForm.appealType,
              appealReason: appealForm.appealReason,
              appealAttachments: appealForm.attachments.map(f => f.name),
            }
          : r
      ));
    }

    setAppealDialogOpen(false);
    alert('申诉已提交，请等待审批');
  };

  // 处理文件上传
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    const imageFiles = newFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    setAppealForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...imageFiles]
    }));
  };

  // 删除附件
  const handleRemoveAttachment = (index: number) => {
    setAppealForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // 导出Excel
  const handleExport = () => {
    alert('导出功能：将当前筛选结果导出为Excel文件');
  };

  // 批量申诉导入
  const handleBatchImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`已选择文件：${file.name}\n批量申诉功能将解析Excel并批量提交申诉`);
      }
    };
    input.click();
  };

  // 查询
  const handleSearch = () => {
    console.log('查询条件：', searchFilters);
    // 实际应用中这里会调用API
  };

  // 重置
  const handleReset = () => {
    setSearchFilters({
      trackingNumber: '',
      status: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 主内容 - 可滚动区域 */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-6">
        <div className="space-y-5">
          {/* 仓库选择器 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <WarehouseSelector className="w-full max-w-md" />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* 数据统计栏 */}
            <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">POD错误单量</p>
                  <p className="text-3xl font-bold text-[#055AA1]">{statistics.totalErrors}</p>
                  <p className="text-xs text-gray-500 mt-1">待处理及处理中</p>
                </div>
                <div className="w-16 h-16 bg-[#055AA1] rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">预扣罚金额</p>
                  <p className="text-3xl font-bold text-orange-600">${statistics.totalPenalty}</p>
                  <p className="text-xs text-gray-500 mt-1">潜在罚款总额</p>
                </div>
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 筛选栏 */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  运单号
                </label>
                <Input 
                  placeholder="请输入运单号" 
                  value={searchFilters.trackingNumber}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, trackingNumber: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  申诉状态
                </label>
                <Select 
                  value={searchFilters.status}
                  onValueChange={(value) => setSearchFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待申诉</SelectItem>
                    <SelectItem value="reviewing">审批中</SelectItem>
                    <SelectItem value="approved">申诉通过</SelectItem>
                    <SelectItem value="rejected">申诉失败</SelectItem>
                    <SelectItem value="expired">超期自动认可</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  查验日期（从）
                </label>
                <Input 
                  type="date" 
                  value={searchFilters.dateFrom}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  查验日期（至）
                </label>
                <Input 
                  type="date"
                  value={searchFilters.dateTo}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>

            {/* 操作按钮栏 */}
            <div className="flex gap-3 pt-2">
              <Button 
                className="bg-[#055AA1] hover:bg-[#044a8a] text-white"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                查询
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                重置
              </Button>
              <div className="flex-1"></div>
              <Button 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50"
                onClick={handleExport}
              >
                <FileDown className="w-4 h-4 mr-2" />
                导出Excel
              </Button>
              <Button 
                variant="outline" 
                className="border-orange-600 text-orange-600 hover:bg-orange-50"
                onClick={handleBatchImport}
              >
                <FileUp className="w-4 h-4 mr-2" />
                批量申诉导入
              </Button>
            </div>
          </div>

          {/* 数据表格 - 带横向滚动和固定操作列 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-center font-medium w-[140px] sticky left-0 bg-gray-50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">运单号</TableHead>
                    <TableHead className="text-center font-medium w-[200px]">地址</TableHead>
                    <TableHead className="text-center font-medium w-[320px]">POD照片</TableHead>
                    <TableHead className="text-center font-medium w-[180px]">POD错误原因</TableHead>
                    <TableHead className="text-center font-medium w-[120px]">提货仓库</TableHead>
                    <TableHead className="text-center font-medium w-[120px]">分箱创建日期</TableHead>
                    <TableHead className="text-center font-medium w-[120px]">签收日期</TableHead>
                    <TableHead className="text-center font-medium w-[120px]">所属网格</TableHead>
                    <TableHead className="text-center font-medium w-[140px]">分箱号</TableHead>
                    <TableHead className="text-center font-medium w-[100px]">预扣罚金额</TableHead>
                    <TableHead className="text-center font-medium w-[120px]">查验日期</TableHead>
                    <TableHead className="text-center font-medium w-[120px]">申诉类型</TableHead>
                    <TableHead className="text-center font-medium w-[200px]">申诉原因</TableHead>
                    <TableHead className="text-center font-medium w-[120px]">申诉附件</TableHead>
                    <TableHead className="text-center font-medium w-[120px]">申诉状态</TableHead>
                    <TableHead className="text-center font-medium w-[140px]">工单编号</TableHead>
                    <TableHead className="text-center font-medium w-[100px] sticky right-0 bg-gray-50 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="text-center text-blue-600 font-medium sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        {record.trackingNumber}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {record.deliveryAddress}
                      </TableCell>
                      <TableCell className="px-2">
                        <div className="flex gap-2 justify-center flex-wrap">
                          {record.podImages.length > 0 ? (
                            record.podImages.map((img, idx) => (
                              <div 
                                key={idx}
                                className="relative group cursor-pointer"
                                onClick={() => {
                                  setPreviewImages(record.podImages);
                                  setCurrentImageIndex(idx);
                                  setPreviewImage(img);
                                }}
                              >
                                <ImageWithFallback 
                                  src={img}
                                  alt={`POD ${idx + 1}`}
                                  className="w-14 h-14 object-cover rounded border border-gray-200 hover:border-blue-500 transition-colors"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded flex items-center justify-center transition-all">
                                  <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                  {idx + 1}
                                </div>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">无照片</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-red-600 text-sm">
                        {record.errorReason}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-700">
                        {record.pickupWarehouse}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {record.boxCreatedDate}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {record.signedDate}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-700">
                        {record.gridArea}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-700">
                        {record.boxNumber}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-orange-600">
                        ${record.penaltyAmount}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {record.inspectionDate}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-700">
                        {getAppealTypeLabel(record.appealType)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        <div className="max-w-[200px] truncate" title={record.appealReason}>
                          {record.appealReason || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {record.appealAttachments.length > 0 ? (
                          <div className="flex items-center justify-center gap-1 text-blue-600">
                            <Paperclip className="w-4 h-4" />
                            <span className="text-sm">{record.appealAttachments.length}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${statusConfig[record.appealStatus].color}`}>
                          {statusConfig[record.appealStatus].label}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-700">
                        {record.workOrderNumber}
                      </TableCell>
                      <TableCell className="text-center sticky right-0 bg-white z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        <Button
                          size="sm"
                          onClick={() => handleOpenAppeal(record)}
                          disabled={
                            record.appealStatus === 'expired' || 
                            record.appealStatus === 'reviewing' ||
                            record.appealStatus === 'approved' ||
                            record.appealStatus === 'rejected'
                          }
                          className={`${statusConfig[record.appealStatus].buttonColor} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {record.appealStatus === 'pending' ? '申诉' : '查看'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 分页栏 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              显示 {paginatedRecords.length} 条记录，共 {records.length} 条
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm text-gray-700">
                第 {currentPage} 页 / 共 {totalPages} 页
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 底部说明 */}
          
          </div>
        </div>
      </div>

      {/* 申诉弹窗 */}
      <Dialog open={appealDialogOpen} onOpenChange={setAppealDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {currentRecord?.appealStatus === 'pending' ? 'POD处罚申诉' : 'POD处罚详情'}
            </DialogTitle>
            {currentRecord?.appealStatus === 'pending' && (
              <DialogDescription className="text-sm text-gray-500">
                请仔细填写申诉信息，提供充分的证据和理由，以便加快审批进度。
              </DialogDescription>
            )}
          </DialogHeader>

          {currentRecord && (
            <div className="space-y-6 py-4">
              {/* 运单基本信息 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">运单信息</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">运单号：</span>
                    <span className="font-medium text-blue-600">{currentRecord.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">工单编号：</span>
                    <span className="font-medium">{currentRecord.workOrderNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">扣罚金额：</span>
                    <span className="font-semibold text-orange-600">${currentRecord.penaltyAmount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">提货仓库：</span>
                    <span className="text-gray-900">{currentRecord.pickupWarehouse}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">收货地址：</span>
                    <span className="text-gray-900">{currentRecord.deliveryAddress}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">所属网格：</span>
                    <span className="text-gray-900">{currentRecord.gridArea}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">分箱号：</span>
                    <span className="text-gray-900">{currentRecord.boxNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">分箱创建日期：</span>
                    <span className="text-gray-900">{currentRecord.boxCreatedDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">签收日期：</span>
                    <span className="text-gray-900">{currentRecord.signedDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">错误原因：</span>
                    <span className="text-red-600">{currentRecord.errorReason}</span>
                  </div>
                </div>
              </div>

              {/* POD照片展示 */}
              {currentRecord.podImages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">POD照片</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {currentRecord.podImages.map((img, idx) => (
                      <div 
                        key={idx}
                        className="relative group cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                      >
                        <ImageWithFallback 
                          src={img}
                          alt={`POD ${idx + 1}`}
                          className="w-full h-32 object-cover rounded border border-gray-200 hover:border-blue-500 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded flex items-center justify-center transition-all">
                          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 仅待申诉状态显示申诉表单 */}
              {currentRecord.appealStatus === 'pending' && (
                <>
                  {/* 申诉类型选择 */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-3 block">
                      申诉类型 <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup 
                      value={appealForm.appealType}
                      onValueChange={(value) => setAppealForm(prev => ({ ...prev, appealType: value as AppealType }))}
                      className="space-y-3"
                    >
                      {appealTypeOptions.map(option => (
                        <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                          <label htmlFor={option.value} className="flex-1 cursor-pointer">
                            <p className="font-medium text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                    {appealErrors.appealType && (
                      <p className="text-sm text-red-500 mt-2">{appealErrors.appealType}</p>
                    )}
                  </div>

                  {/* 申诉原因 */}
                  <div>
                    <Label htmlFor="appealReason" className="text-base font-semibold text-gray-900 mb-2 block">
                      申诉原因 <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="appealReason"
                      value={appealForm.appealReason}
                      onChange={(e) => setAppealForm(prev => ({ ...prev, appealReason: e.target.value }))}
                      placeholder="请详细说明申诉原因，提供充分的证据和理由..."
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">请尽可能详细地描述情况，有助于加快审批进度</p>
                    {appealErrors.appealReason && (
                      <p className="text-sm text-red-500 mt-1">{appealErrors.appealReason}</p>
                    )}
                  </div>

                  {/* 附件上传 */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-2 block">
                      证明材料
                      {(appealForm.appealType === 'reported' || appealForm.appealType === 'misjudgment') && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    
                    {/* 已上传文件列表 */}
                    {appealForm.attachments.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {appealForm.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded border">
                            <div className="flex-1 flex items-center gap-2">
                              {file.type.startsWith('image/') && (
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={file.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 上传按钮 */}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#055AA1] hover:bg-blue-50 transition-colors">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600">点击上传图片或PDF文件</span>
                      </div>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">支持jpg, png, pdf格式，单个文件不超过5MB</p>
                    {appealErrors.attachments && (
                      <p className="text-sm text-red-500 mt-1">{appealErrors.attachments}</p>
                    )}
                  </div>
                </>
              )}

              {/* 已申诉状态显示申诉信息 */}
              {currentRecord.appealStatus !== 'pending' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">申诉信息</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">申诉类型：</span>
                        <span className="font-medium">
                          {getAppealTypeLabel(currentRecord.appealType)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">申诉原因：</span>
                        <p className="mt-1 text-gray-900">{currentRecord.appealReason || '-'}</p>
                      </div>
                      {currentRecord.appealAttachments.length > 0 && (
                        <div>
                          <span className="text-gray-600">申诉附件：</span>
                          <div className="mt-1 space-y-1">
                            {currentRecord.appealAttachments.map((filename, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-blue-600">
                                <Paperclip className="w-4 h-4" />
                                <span>{filename}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">当前状态：</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${statusConfig[currentRecord.appealStatus].color}`}>
                          {statusConfig[currentRecord.appealStatus].label}
                        </span>
                      </div>
                      {currentRecord.reviewComment && (
                        <div className="pt-3 border-t">
                          <span className="text-gray-600">审核意见：</span>
                          <p className="mt-1 text-gray-900">{currentRecord.reviewComment}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAppealDialogOpen(false)}>
              {currentRecord?.appealStatus === 'pending' ? '取消' : '关闭'}
            </Button>
            {currentRecord?.appealStatus === 'pending' && (
              <Button 
                onClick={handleSubmitAppeal}
                className="bg-[#055AA1] hover:bg-[#044a8a] text-white"
              >
                提交申诉
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 图片预览 Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>POD照片预览 ({currentImageIndex + 1}/{previewImages.length})</DialogTitle>
            <DialogDescription>
              使用左右箭头按钮或键盘方向键切换查看该运单的所有POD照片
            </DialogDescription>
          </DialogHeader>
          {previewImage && (
            <div className="relative flex justify-center bg-gray-100 rounded-lg p-4 min-h-[400px]">
              <ImageWithFallback 
                src={previewImage} 
                alt={`POD照片 ${currentImageIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded"
              />
              
              {/* 上一张按钮 */}
              {previewImages.length > 1 && currentImageIndex > 0 && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              )}
              
              {/* 下一张按钮 */}
              {previewImages.length > 1 && currentImageIndex < previewImages.length - 1 && (
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              )}
              
              {/* 图片指示器 */}
              {previewImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {previewImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentImageIndex ? 'bg-[#055AA1]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}