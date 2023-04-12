"use client";

import { Ref, forwardRef } from "react";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

interface Props extends TextareaAutosizeProps {
  label: string;
}

export default forwardRef(function StandardTextara(
  { label, ...props }: Props,
  ref?: Ref<HTMLTextAreaElement>
) {
  const id = label + Math.random();
  return (
    <div className="relative">
      <TextareaAutosize
        id={id}
        {...props}
        ref={ref}
        className="resize-none valid:border-valid w-full peer outline-none px-2 pb-1 pt-2 border-2 rounded-lg border-disabled focus-within:border-30 transition-colors"
      />
      <label
        htmlFor={id}
        className="absolute left-2 peer-valid:text-valid -top-2 text-sm bg-60 pl-2 pr-4 text-disabled peer-focus-within:text-30 transition-colors"
      >
        {label}
      </label>
    </div>
  );
});
