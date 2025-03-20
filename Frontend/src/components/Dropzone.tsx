import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface ImageDropzoneProps<T extends FieldValues> {
  onImageUpload: (file: File) => void;
  register: UseFormRegister<T>;
  name: Path<T>; // Ensures the correct key from the form data type
  error?: string;
  setError: any;
  clearErrors: any;
}

export default function ImageDropzone<T extends FieldValues>({
  onImageUpload,
  error,
  setError, // Accept setError from useForm
  clearErrors, // Accept clearErrors from useForm
}: ImageDropzoneProps<T>) {
  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
      setFileError("Only image files are allowed");
      setError("image", { type: "manual", message: "Only image files are allowed" });
      return;
    }

    if (acceptedFiles.length > 0) {
      setFileError(null);
      clearErrors("image"); // Clear previous error
      onImageUpload(acceptedFiles[0]);
    }
  },[]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-full size-36 p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-center h-full">
          <ImagePlus className="w-12 h-12 mx-auto text-gray-400" />
          {/* <p className="text-gray-600">
            {isDragActive
              ? "Drop the image here"
              : "Drag & drop an image here, or click to select"}
          </p> */}
        </div>
      </div>
      {fileError && <p className="mt-2 text-sm text-red-500">{fileError}</p>}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
