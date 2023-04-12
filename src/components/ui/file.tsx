import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import {
  AiOutlineCloudUpload as UploadIcon,
  AiFillDelete as DeleteIcon,
} from "react-icons/ai";

interface Props {
  defaultImage?: {
    url: string;
    name: string;
  };
  setImageData: Dispatch<SetStateAction<File | null>>;
}

export default function StandardFileInput({
  defaultImage,
  setImageData,
}: Props) {
  const [imageURL, setImageURL] = useState<string>(defaultImage?.url || "");
  const [imageFileName, setImageFileName] = useState<string>(
    defaultImage?.name || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const url = URL.createObjectURL(files[0]);
    setImageURL(url);
    setImageFileName(files[0].name);
    setImageData(files[0]);
  };

  const handleDelete = () => {
    setImageData(null);
    setImageFileName("");
    setImageURL("");
  };

  return (
    <section className="w-[200px] h-[200px] relative border-2 border-dashed cursor-pointer flex justify-center items-center border-disabled">
      <div
        className={`${
          !imageURL && "hidden"
        } absolute bottom-0 bg-black bg-opacity-50 w-full flex justify-between px-2 py-1 z-10`}
      >
        <h3 className="text-white">{imageFileName}</h3>
        <button
          onClick={handleDelete}
          type="button"
          className="text-10"
        >
          <DeleteIcon className="text-xl" />
        </button>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={changeHandler}
        hidden
      />
      {imageURL ? (
        <Image
          src={imageURL}
          alt={imageFileName}
          width={200}
          height={200}
        />
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon className="text-5xl text-10" />
        </button>
      )}
    </section>
  );
}
