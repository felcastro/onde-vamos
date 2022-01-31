import React, { forwardRef, InputHTMLAttributes } from "react";

interface FormControlProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  labelClassName?: string;
  helpMessage?: string;
}

export default forwardRef<HTMLInputElement, FormControlProps>(
  ({ id, label, labelClassName, helpMessage, ...props }, ref) => (
    <div>
      {label && (
        <label htmlFor={id} className={labelClassName || "font-semibold"}>
          {label}
        </label>
      )}
      <input ref={ref} id={id} name={id} required {...props} />
      {helpMessage && (
        <span className="text-sm text-gray-400">{helpMessage}</span>
      )}
    </div>
  )
);
