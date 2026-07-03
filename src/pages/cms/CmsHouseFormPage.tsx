import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { HouseForm } from '@/features/house-renting';
import type { HouseFormValues } from '@/features/house-renting/schemas/houseFormSchema';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addHouse, updateHouse } from '@/store/features/housesSlice';
import type { HouseListing, RenterDetail } from '@/types/house';
import { toDatetimeLocalValue } from '@/utils/imageUpload';

function buildRenter(values: HouseFormValues): RenterDetail | undefined {
  if (values.status !== 'rented' || !values.renter) return undefined;
  const start = new Date(values.renter.contractStart).toISOString();
  return {
    name: values.renter.name,
    phone: values.renter.phone,
    idType: values.renter.idType,
    idNumber: values.renter.idNumber,
    contractStart: start,
    durationMonths: Number(values.renter.durationMonths),
    contractEnd: values.renter.contractEnd
      ? new Date(values.renter.contractEnd).toISOString()
      : start,
    contractPhoto: values.renter.contractPhoto,
    nrcPhoto: values.renter.nrcPhoto,
  };
}

function mapHouseToForm(house: HouseListing): HouseListing {
  if (!house.renter) return house;
  return {
    ...house,
    renter: {
      ...house.renter,
      contractStart: toDatetimeLocalValue(house.renter.contractStart),
      contractEnd: toDatetimeLocalValue(house.renter.contractEnd),
    },
  };
}

export function CmsHouseFormPage() {
  const { houseId } = useParams<{ houseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isHydrated = useAppSelector((state) => state.houses.isHydrated);
  const isEdit = Boolean(houseId && houseId !== 'new');
  const existing = useAppSelector((state) =>
    isEdit ? state.houses.houses.find((h) => h.id === houseId) : undefined,
  );

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" tip="Loading…" />
      </div>
    );
  }

  if (isEdit && !existing) {
    return <Navigate to="/cms/houses" replace />;
  }

  if (isEdit && existing && existing.ownerId !== user?.id) {
    return <Navigate to="/cms/houses" replace />;
  }

  const handleSubmit = (values: HouseFormValues) => {
    if (!user) return;

    const payload = {
      ownerId: user.id,
      title: values.title,
      description: values.description,
      photos: values.photos,
      status: values.status,
      renter: buildRenter(values),
    };

    if (isEdit && existing) {
      dispatch(updateHouse({ ...existing, ...payload }));
    } else {
      dispatch(addHouse(payload));
    }
    navigate('/cms/houses');
  };

  return (
    <div className="app-page mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">
        {isEdit ? 'Edit house' : 'Add house'}
      </h1>
      <p className="mb-4 text-sm text-slate-600">
        Upload photos, set status, and add renter details when rented.
      </p>
      <HouseForm
        initial={existing ? mapHouseToForm(existing) : undefined}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/cms/houses')}
      />
    </div>
  );
}
