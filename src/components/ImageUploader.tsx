import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  taskPresetType?: 'ufund' | 'morning_brief' | 'live_cleaning' | 'stock_count';
}

const PRESET_SAMPLE_PHOTOS: Record<string, { label: string; url: string }[]> = {
  ufund: [
    { label: 'สลิป UFund / บัตร', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80' },
    { label: 'เอกสารทำรายการ', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80' },
  ],
  morning_brief: [
    { label: 'รูปประชุมยามเช้า', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' },
    { label: 'บอร์ดทีมงานประจำวัน', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80' },
  ],
  live_cleaning: [
    { label: 'จัด Live Display หน้าร้าน', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80' },
    { label: 'ทำความสะอาด Big Cleaning', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80' },
  ],
  stock_count: [
    { label: 'เช็กสินค้าในคลัง', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80' },
    { label: 'ตู้โชว์สต๊อกสินค้า', url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80' },
  ],
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = '📷 อัปโหลดรูปภาพ',
  taskPresetType = 'ufund',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) return;

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 900;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            onChange(canvas.toDataURL('image/jpeg', 0.65));
          } else {
            onChange(rawResult);
          }
        } catch (err) {
          console.error('Canvas compression error:', err);
          onChange(rawResult);
        }
      };
      img.onerror = () => onChange(rawResult);
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const presets = PRESET_SAMPLE_PHOTOS[taskPresetType] || PRESET_SAMPLE_PHOTOS.ufund;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label} <span className="text-rose-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          {showPresets ? 'ซ่อนรูปตัวอย่าง' : 'เลือกรูปตัวอย่าง'}
        </button>
      </div>

      {/* Preset options */}
      {showPresets && (
        <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 dark:bg-slate-800/80 dark:border-slate-700 animate-fadeIn">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
            เลือกรูปภาพตัวอย่างสำหรับการทดสอบส่งงาน:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className="group flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-white dark:bg-slate-900 transition-all text-left"
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-10 h-10 object-cover rounded-md flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 line-clamp-2">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Upload Box / Preview */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-emerald-500/30 bg-slate-900 shadow-sm">
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90 flex items-end justify-between p-3">
            <span className="text-xs text-emerald-300 font-medium flex items-center gap-1.5 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" /> แนบรูปภาพเรียบร้อยแล้ว
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full transition-all shadow-md hover:scale-105"
              title="ลบรูปภาพ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/30'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            แตะเพื่อถ่ายรูป หรือ เลือกรูปจากคลัง
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            รองรับไฟล์ PNG, JPG, WEBP (ลากไฟล์วางได้ที่นี่)
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-blue-500" /> อัปโหลดไฟล์รูป
          </div>
        </div>
      )}
    </div>
  );
};
