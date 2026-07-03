import { Link, useNavigate } from 'react-router-dom';
import { Card, List, Tag, Spin } from 'antd';
import { AppButton } from '@/components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteHouse } from '@/store/features/housesSlice';
import { HOUSE_STATUS_LABELS } from '@/types/house';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function CmsHousesListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isHydrated = useAppSelector((state) => state.houses.isHydrated);
  const houses = useAppSelector((state) =>
    state.houses.houses.filter((h) => h.ownerId === user?.id),
  );

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" tip="Loading houses…" />
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Houses</h1>
          <p className="text-sm text-slate-600">Add, edit, or remove your rental properties.</p>
        </div>
        <Link to="/cms/houses/new" className="no-underline">
          <AppButton type="primary" block className="sm:!w-auto">
            Add house
          </AppButton>
        </Link>
      </div>

      <Card className="app-card shadow-sm">
        <List
          dataSource={houses}
          locale={{ emptyText: 'No houses yet. Add your first listing.' }}
          renderItem={(house) => (
            <List.Item
              className="!flex-col !items-stretch gap-4 !px-0 sm:!flex-row sm:!items-start"
              actions={[]}
            >
              <div className="flex min-w-0 flex-1 gap-4">
                {house.photos[0] ? (
                  <img
                    src={house.photos[0]}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-2xl">
                    🏠
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{house.title}</span>
                    <Tag color={house.status === 'available' ? 'green' : 'blue'}>
                      {HOUSE_STATUS_LABELS[house.status]}
                    </Tag>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{house.description}</p>
                  {house.status === 'rented' && house.renter ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Renter: {house.renter.name} · {house.renter.phone} · until{' '}
                      {formatDate(house.renter.contractEnd)}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
                <AppButton
                  type="primary"
                  className="flex-1 sm:flex-none"
                  onClick={() => navigate(`/cms/houses/${house.id}/edit`)}
                >
                  Edit
                </AppButton>
                <AppButton
                  danger
                  className="flex-1 sm:flex-none"
                  onClick={() => {
                    if (window.confirm(`Delete “${house.title}”?`)) {
                      dispatch(deleteHouse(house.id));
                    }
                  }}
                >
                  Delete
                </AppButton>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
