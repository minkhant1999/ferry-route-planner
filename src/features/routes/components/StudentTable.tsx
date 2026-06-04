import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Card } from 'antd';
import { AppButton } from '@/components';
import { useAppDispatch } from '@/store/hooks';
import { removeStudent } from '@/store/features/routePlansSlice';
import type { Student } from '@/types/geo';

interface StudentTableProps {
  planId: string;
  students: Student[];
  /** When true, renders below form without a separate card. */
  embedded?: boolean;
}

export function StudentTable({
  planId,
  students,
  embedded = false,
}: StudentTableProps) {
  const dispatch = useAppDispatch();

  const columns: ColumnsType<Student> = [
    { title: 'Student', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      key: 'phone',
      ellipsis: true,
      render: (v: string) => v || '—',
    },
    {
      title: 'Latitude',
      dataIndex: 'lat',
      key: 'lat',
      render: (v: number) => v.toFixed(5),
    },
    {
      title: 'Longitude',
      dataIndex: 'lng',
      key: 'lng',
      render: (v: number) => v.toFixed(5),
    },
    {
      title: '',
      key: 'actions',
      width: 88,
      fixed: 'right',
      render: (_, record) => (
        <AppButton
          danger
          size="small"
          label="Remove"
          onClick={() =>
            dispatch(removeStudent({ planId, studentId: record.id }))
          }
        />
      ),
    },
  ];

  const table = (
    <div className={embedded ? 'mt-6 overflow-x-auto border-t border-slate-100 pt-4' : 'overflow-x-auto'}>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={students}
        pagination={false}
        scroll={{ x: 560 }}
        locale={{
          emptyText: 'No students yet — add one using the form above.',
        }}
        size="small"
      />
    </div>
  );

  if (embedded) {
    return table;
  }

  return (
    <Card title="Student stops" className="app-card shadow-sm">
      {table}
    </Card>
  );
}
