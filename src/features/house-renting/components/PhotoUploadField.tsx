import { fileToWebpDataUrl } from '@/utils/imageUpload';

interface PhotoUploadFieldProps {
  label: string;
  photos: string[];
  onChange: (photos: string[]) => void;
  error?: string;
  multiple?: boolean;
  maxPhotos?: number;
}

export function PhotoUploadField({
  label,
  photos,
  onChange,
  error,
  multiple = true,
  maxPhotos = 8,
}: PhotoUploadFieldProps) {
  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const files = Array.from(fileList).slice(0, maxPhotos - photos.length);
    const converted = await Promise.all(files.map((file) => fileToWebpDataUrl(file)));
    onChange(multiple ? [...photos, ...converted] : converted.slice(0, 1));
  };

  const removeAt = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex flex-wrap gap-3">
        {photos.map((src, index) => (
          <div key={`${index}-${src.slice(0, 24)}`} className="relative">
            <img
              src={src}
              alt=""
              className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white"
              aria-label="Remove photo"
            >
              ×
            </button>
          </div>
        ))}
        {(multiple ? photos.length < maxPhotos : photos.length === 0) ? (
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600">
            + Photo
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              className="hidden"
              onChange={(e) => {
                void handleFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

interface SinglePhotoUploadProps {
  label: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  error?: string;
}

export function SinglePhotoUpload({ label, value, onChange, error }: SinglePhotoUploadProps) {
  return (
    <PhotoUploadField
      label={label}
      photos={value ? [value] : []}
      onChange={(list) => onChange(list[0])}
      error={error}
      multiple={false}
      maxPhotos={1}
    />
  );
}
