export type TaskTypeId = 'ufund' | 'morning_brief' | 'live_cleaning' | 'stock_count' | 'edit_bill';

export type EditBillCategory = 
  | '🔴 edit bill หลัง 20:00' 
  | '🟢 รับคืนสินค้าภายใน 7 วัน' 
  | '🟠 รับคืนสินค้าเกิน 7 วัน'
  | 'edit bill หลัง 20:00' 
  | 'รับคืนสินค้าภายใน 7 วัน' 
  | 'รับคืนสินค้าเกิน 7 วัน';

export interface StaffProfile {
  employeeId: string;
  employeeName: string;
  nickname?: string;
  position?: string;
}

export interface BaseSubmission {
  id: string;
  taskType: TaskTypeId;
  date: string;
  time: string;
  employeeId: string;
  employeeName: string;
  photoUrl?: string;
  notes?: string;
  submittedAt: string;
}

export interface UFundTransaction {
  id: string;
  type: 'deposit' | 'payment' | 'refund';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface UFundSubmission extends BaseSubmission {
  taskType: 'ufund';
  currentBalance: number;
  creditLimit: number;
  transactionNote?: string;
}

export interface MorningBriefSubmission extends BaseSubmission {
  taskType: 'morning_brief';
  workDay: 'จันทร์' | 'พุธ' | 'ศุกร์';
  briefTopic?: string;
}

export interface LiveCleaningSubmission extends BaseSubmission {
  taskType: 'live_cleaning';
  jobType: 'Live Display' | 'Big Cleaning';
  checklist?: { [key: string]: boolean };
}

export interface StockItemCount {
  itemId: string;
  itemName: string;
  category: string;
  systemCount: number;
  actualCount: number;
  unit: string;
}

export interface StockCountSubmission extends BaseSubmission {
  taskType: 'stock_count';
  items: StockItemCount[];
  totalUnitsCounted: number;
}

export interface EditBillSubmission extends BaseSubmission {
  taskType: 'edit_bill';
  editCategory: EditBillCategory;
  dateTime: string;
  productName: string;
  price: number;
  phyId: string;
  reason: string;
}

export type TaskSubmission = 
  | UFundSubmission 
  | MorningBriefSubmission 
  | LiveCleaningSubmission 
  | StockCountSubmission
  | EditBillSubmission;

