import { Input } from '@/components/ui/input';
import { ChangeEvent } from 'react';
import { FaPlus } from 'react-icons/fa';

type FileSelectProps = {
  onInputFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function FileSelect({ onInputFileChange }: FileSelectProps) {
  return (
    <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 transition-all hover:border-blue-400 group/upload">
      <Input
        type="file"
        accept="image/*"
        onChange={onInputFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="text-center space-y-3">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mx-auto group-hover/upload:bg-blue-100 transition-colors">
          <FaPlus className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">
            클릭하여 이미지 업로드
          </p>
          <p className="text-xs text-gray-500 mt-1">
            또는 이미지를 여기로 드래그하세요
          </p>
        </div>
      </div>
    </div>
  );
}
