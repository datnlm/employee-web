//----------------------------------------------------------------------

export type OptionStatus = {
  id: any;
  label: string;
};

const status = ['Deleted', 'Available'];

export const statusOptions = status.map((v, index) => ({
  id: index,
  label: v
}));

export const statusOrder = [
  { id: '0', label: 'Đã huỷ' },
  { id: '1', label: 'Mới' },
  { id: '3', label: 'Hoàn thành' }
];
// ------------------------------------------------------------------

export const statusOrderOptions = statusOrder.map((v: any) => ({
  id: v.id,
  label: v.label
}));
