import { useFieldArray, type Control, type FieldErrors } from 'react-hook-form';
import { AppButton, FormInput } from '@/components';
import type { StudentHomeValues } from '@/features/routes/schemas/studentSchema';

export type StudentBusStopsFormValues = {
  students: StudentHomeValues[];
};

const emptyStop = (lat: number, lng: number): StudentHomeValues => ({
  name: '',
  phone: '',
  lat,
  lng,
});

interface StudentLocationsEditorProps {
  control: Control<StudentBusStopsFormValues>;
  errors?: FieldErrors<StudentBusStopsFormValues>;
  defaultLat?: number;
  defaultLng?: number;
}

/**
 * Repeatable student home fields (bus stops between home and school).
 * Use **Add More** to append another stop row.
 */
export function StudentLocationsEditor({
  control,
  errors,
  defaultLat = 25.2,
  defaultLng = 55.27,
}: StudentLocationsEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'students',
  });

  const studentErrors = errors?.students;

  const addMore = () => append(emptyStop(defaultLat, defaultLng));

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2.5 text-xs text-slate-700 sm:px-4 sm:py-3 sm:text-sm">
        <span className="font-medium">Route:</span>{' '}
        <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5">
          <span className="text-blue-700">Home</span>
          <span className="text-slate-400">→</span>
          <span className="text-orange-700">Bus stops</span>
          <span className="text-slate-400">→</span>
          <span className="text-green-700">School</span>
        </span>
      </div>

      <div className="space-y-3">
        <div className="w-full">
          <p className="text-sm font-semibold text-slate-800">
            Bus stops — student home locations
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
            Stops between home and school. Add each student&apos;s home as a pickup /
            drop-off point on the route.
          </p>
        </div>
        <AppButton
          type="default"
          label="Add More"
          onClick={addMore}
          className="!w-full sm:!w-auto"
        />
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
          <p className="text-sm text-slate-500">
            No bus stops yet. Click <strong>Add More</strong> to add a student home
            location.
          </p>
          <AppButton
            type="primary"
            label="Add More"
            className="mt-3 !w-full sm:!w-auto"
            onClick={addMore}
          />
        </div>
      ) : null}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full rounded-lg border border-orange-200 bg-orange-50/40 p-3 sm:p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-orange-900">
              Bus stop {index + 1}
            </span>
            <AppButton
              danger
              size="small"
              type="text"
              label="Remove"
              onClick={() => remove(index)}
            />
          </div>
          <FormInput
            control={control}
            name={`students.${index}.name`}
            id={`student-${index}-name`}
            label="Student name"
            placeholder="Ahmed Ali"
            error={studentErrors?.[index]?.name?.message}
          />
          <FormInput
            control={control}
            name={`students.${index}.phone`}
            id={`student-${index}-phone`}
            label="Student phone number"
            type="tel"
            placeholder="09 123 456 789"
            autoComplete="tel"
            error={studentErrors?.[index]?.phone?.message}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormInput
              control={control}
              name={`students.${index}.lat`}
              id={`student-${index}-lat`}
              label="Home latitude"
              type="number"
              error={studentErrors?.[index]?.lat?.message}
            />
            <FormInput
              control={control}
              name={`students.${index}.lng`}
              id={`student-${index}-lng`}
              label="Home longitude"
              type="number"
              error={studentErrors?.[index]?.lng?.message}
            />
          </div>
        </div>
      ))}

      {fields.length > 0 ? (
        <AppButton
          type="dashed"
          label="Add More"
          onClick={addMore}
          className="!w-full"
        />
      ) : null}
    </div>
  );
}
