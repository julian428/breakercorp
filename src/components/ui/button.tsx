import { ButtonHTMLAttributes, ReactNode } from "react";
import { AiOutlineLoading as LoadingIcon } from "react-icons/ai";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  loading?: boolean;
}

export default function StandardButton({ children, loading, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={loading}
      className="px-4 py-1 bg-10 rounded-lg text-60 shadow-md shadow-10"
    >
      {loading ? <LoadingIcon className="animate-spin" /> : children}
    </button>
  );
}
