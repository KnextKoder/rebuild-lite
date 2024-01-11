import {ChangeEvent} from 'react';

type FileUploadButtonProps = {
  onFileSelect: (file: File) => void;
};

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex justify-center">
      <input
        type="file"
        accept="image/*, .pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-700
                   hover:file:text-violet-100"
      />
    </div>
  );
};

export default FileUploadButton;
