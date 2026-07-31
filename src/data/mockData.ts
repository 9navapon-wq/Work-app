import { StaffProfile, UFundTransaction, StockItemCount, TaskSubmission } from '../types';

export const defaultStaffProfile: StaffProfile = {
  employeeId: '16286',
  employeeName: 'ณวพล เอกเกียรติขจร',
  nickname: 'เก้า',
  position: 'ABM',
};

export const initialUFundAccount = {
  cardNumber: '•••• •••• •••• 4821',
  cardHolder: 'UFUND MEMBER STORE',
  balance: 45200.00,
  limit: 100000.00,
  recentTransactions: [
    {
      id: 'tx-101',
      type: 'payment',
      title: 'ชำระค่าสินค้าหน้าร้าน สาขาหลัก',
      amount: -1250.00,
      date: 'วันนี้ 10:15 น.',
      status: 'completed',
    },
    {
      id: 'tx-102',
      type: 'deposit',
      title: 'เติมเงินสวัสดิการพนักงานประจำเดือน',
      amount: 5000.00,
      date: 'เมื่อวาน 09:00 น.',
      status: 'completed',
    },
    {
      id: 'tx-103',
      type: 'payment',
      title: 'เบิกอุปกรณ์จัดดิสเพลย์',
      amount: -890.00,
      date: '28 ก.ค. 2026',
      status: 'completed',
    },
  ] as UFundTransaction[],
};

export const initialStockCatalog: StockItemCount[] = [
  { itemId: 'SKU-001', itemName: 'iPhone 15 Pro 128GB - Natural Titanium', category: 'Smartphone', systemCount: 8, actualCount: 8, unit: 'เครื่อง' },
  { itemId: 'SKU-002', itemName: 'iPad Air M2 11" 128GB Wi-Fi - Starlight', category: 'Tablet', systemCount: 5, actualCount: 5, unit: 'เครื่อง' },
  { itemId: 'SKU-003', itemName: 'AirPods Pro 2nd Gen USB-C', category: 'Audio', systemCount: 12, actualCount: 12, unit: 'กล่อง' },
  { itemId: 'SKU-004', itemName: '20W USB-C Power Adapter', category: 'Accessory', systemCount: 25, actualCount: 25, unit: 'ชิ้น' },
  { itemId: 'SKU-005', itemName: 'MagSafe Charger (1m)', category: 'Accessory', systemCount: 18, actualCount: 18, unit: 'ชิ้น' },
  { itemId: 'SKU-006', itemName: 'เคสกันกระแทก Clear Case iPhone 15 Pro', category: 'Accessory', systemCount: 30, actualCount: 30, unit: 'ชิ้น' },
];

export const sampleSubmissions: TaskSubmission[] = [];
