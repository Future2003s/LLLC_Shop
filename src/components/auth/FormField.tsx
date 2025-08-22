import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon, Shield } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  icon: Icon,
  error,
  required = false,
  optional = false,
  className = "",
  inputProps = {},
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {optional && (
          <span className="text-gray-500 font-normal ml-1">(tùy chọn)</span>
        )}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
          {...inputProps}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
