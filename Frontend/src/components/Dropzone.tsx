import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface ImageDropzoneProps<T extends FieldValues> {
  onImageUpload: (file: File) => void;
  register: UseFormRegister<T>;
  name: Path<T>; // Ensures the correct key from the form data type
  error?: string;
}

export default function ImageDropzone<T extends FieldValues>({
  onImageUpload,
  register,
  name,
  error,
}: ImageDropzoneProps<T>) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
  });

  const inputProps = {
    ...getInputProps(),
    ...register(name, {
      required: "Image is required",
      validate: (files: FileList) => {
        if (files.length === 0) return "Image is required";
        const file = files[0];
        return file.type.startsWith("image/") || "Only image files are allowed";
      },
    }),
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...inputProps} />
        <div className="space-y-2">
          <ImagePlus className="w-12 h-12 mx-auto text-gray-400" />
          <p className="text-gray-600">
            {isDragActive
              ? "Drop the image here"
              : "Drag & drop an image here, or click to select"}
          </p>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
