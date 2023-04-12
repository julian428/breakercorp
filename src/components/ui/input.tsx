import { InputHTMLAttributes, Ref, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default forwardRef(function StandardInput(
  { label, ...props }: Props,
  ref?: Ref<HTMLInputElement>
) {
  const id = label + Math.random();
  return (
    <div className="relative">
      <input
        {...props}
        id={id}
        ref={ref}
        className="border-b-2 valid:border-valid border-disabled pl-2 pr-4 py-1 outline-none peer focus-within:border-30 transition-all"
      />
      <label
        className="absolute bottom-1 left-2 text-disabled peer-focus-within:text-sm peer-valid:text-sm peer-focus-within:text-30 peer-valid:text-valid peer-focus-within:bottom-6 peer-valid:bottom-6 transition-all"
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
});
