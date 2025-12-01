import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
  type?: string;
  placeholder?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, helperText, type = "text", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label required={required}>{label}</Label>
        <Input
          ref={ref}
          type={type}
          isInvalid={!!error}
          error={error}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
