import React from 'react';
import { cn } from '@/lib/utils';
import { Search, X, AlertCircle, ChevronDown, Calendar, Check } from 'lucide-react';

// FormLabel
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required,
  className,
  ...props
}) => (
  <label
    className={cn('block text-xs font-semibold text-slate-700 mb-1.5 select-none', className)}
    {...props}
  >
    {children}
    {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
  </label>
);

// FormError
export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string;
  id?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error, id, className, ...props }) => {
  if (!error) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn('flex items-center gap-1.5 text-xs text-rose-600 mt-1 font-medium', className)}
      {...props}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>{error}</span>
    </p>
  );
};

// FormHelperText
export interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  id?: string;
}

export const FormHelperText: React.FC<FormHelperTextProps> = ({
  children,
  id,
  className,
  ...props
}) => {
  if (!children) return null;
  return (
    <p id={id} className={cn('text-[11px] text-slate-500 mt-1', className)} {...props}>
      {children}
    </p>
  );
};

// 1. TextInput
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, id, className, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <FormLabel htmlFor={inputId} required={required}>
            {label}
          </FormLabel>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-sparkline-midnight placeholder-slate-400 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-sparkline-blue focus:border-transparent',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-rose-300 focus:ring-rose-500 bg-rose-50/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        <FormError id={errorId} error={error} />
        {!error && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';

// 2. TextArea
export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, helperText, error, maxLength, id, value, className, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <FormLabel htmlFor={inputId} required={required} className="mb-0">
              {label}
            </FormLabel>
            {maxLength && (
              <span className="text-[10px] text-slate-400 font-mono">
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-sparkline-midnight placeholder-slate-400 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-sparkline-blue focus:border-transparent',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed resize-y min-h-[90px]',
            error && 'border-rose-300 focus:ring-rose-500 bg-rose-50/20',
            className
          )}
          {...props}
        />
        <FormError id={errorId} error={error} />
        {!error && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
      </div>
    );
  }
);
TextArea.displayName = 'TextArea';

// 3. SelectInput
export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, helperText, error, options, id, className, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full">
        {label && (
          <FormLabel htmlFor={inputId} required={required}>
            {label}
          </FormLabel>
        )}
        <div className="relative">
          <select
            id={inputId}
            ref={ref}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-sparkline-midnight transition-all appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-sparkline-blue focus:border-transparent',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer',
              error && 'border-rose-300 focus:ring-rose-500 bg-rose-50/20',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <FormError id={errorId} error={error} />
        {!error && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
      </div>
    );
  }
);
SelectInput.displayName = 'SelectInput';

// 4. SearchInput
export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (val: string) => void;
  onClear?: () => void;
  label?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, label, placeholder = 'Search...', className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <FormLabel>{label}</FormLabel>}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-xs text-sparkline-midnight placeholder-slate-400 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-sparkline-blue focus:border-transparent',
              className
            )}
            {...props}
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                if (onClear) onClear();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

// 5. CurrencyInput
export interface CurrencyInputProps {
  label?: string;
  value: number;
  currency?: string;
  currencies?: string[];
  onChange: (amount: number, currency: string) => void;
  helperText?: string;
  error?: string;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  currency = 'USD',
  currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
  onChange,
  helperText,
  error,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-sparkline-blue focus-within:border-transparent transition-all">
        {/* Currency Selector */}
        <select
          value={currency}
          onChange={(e) => onChange(value, e.target.value)}
          className="bg-slate-50 border-r border-slate-200 px-3 py-2.5 text-xs font-semibold text-sparkline-midnight focus:outline-none cursor-pointer"
        >
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {/* Amount Input */}
        <input
          type="number"
          min="0"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(Number(e.target.value) || 0, currency)}
          placeholder="0"
          className="w-full px-3.5 py-2.5 text-xs text-sparkline-midnight focus:outline-none"
        />
      </div>
      <FormError error={error} />
      {!error && <FormHelperText>{helperText}</FormHelperText>}
    </div>
  );
};

// 6. NumberInput
export interface NumberInputProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  helperText?: string;
  error?: string;
  unit?: string;
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  min = 0,
  max = 1000000,
  step = 1,
  onChange,
  helperText,
  error,
  unit,
  className,
}) => {
  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-sparkline-blue focus-within:border-transparent">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="px-3 py-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border-r border-slate-200 select-none text-xs font-bold"
        >
          -
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full px-3 py-2 text-center text-xs text-sparkline-midnight focus:outline-none"
        />
        {unit && (
          <span className="text-[11px] text-slate-400 font-medium px-2 shrink-0">
            {unit}
          </span>
        )}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="px-3 py-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border-l border-slate-200 select-none text-xs font-bold"
        >
          +
        </button>
      </div>
      <FormError error={error} />
      {!error && <FormHelperText>{helperText}</FormHelperText>}
    </div>
  );
};

// 7. Checkbox Component
export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  helperText?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, id, checked, disabled, className, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? `chk-${label.toLowerCase().replace(/\s+/g, '-')}` : 'chk-input');

    return (
      <div className={cn('w-full', className)}>
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-start gap-3 min-h-[44px] cursor-pointer select-none group',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
            <input
              id={inputId}
              ref={ref}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              className="sr-only peer"
              {...props}
            />
            <div
              className={cn(
                'w-5 h-5 rounded-lg border-2 border-slate-300 bg-white transition-all duration-150',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-sparkline-blue peer-focus-visible:ring-offset-2',
                'peer-checked:bg-sparkline-blue peer-checked:border-sparkline-blue',
                'group-hover:border-sparkline-blue/70',
                error && 'border-rose-400 bg-rose-50/30'
              )}
            >
              <Check
                className={cn(
                  'w-3.5 h-3.5 text-white stroke-[3] transition-transform duration-150 transform scale-0',
                  checked && 'scale-100'
                )}
              />
            </div>
          </div>

          <div className="flex-1">
            <span className="text-xs font-semibold text-sparkline-midnight block leading-tight">
              {label}
            </span>
            {helperText && !error && (
              <span className="text-[11px] text-slate-500 block mt-0.5">{helperText}</span>
            )}
            <FormError error={error} />
          </div>
        </label>
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// 8. Radio Option & RadioGroup Component
export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (val: string) => void;
  helperText?: string;
  error?: string;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  helperText,
  error,
  direction = 'vertical',
  className,
}) => {
  return (
    <fieldset className={cn('w-full', className)}>
      {label && <legend className="text-xs font-semibold text-slate-700 mb-2 select-none">{label}</legend>}
      <div
        className={cn(
          'gap-2',
          direction === 'horizontal' ? 'flex flex-wrap' : 'flex flex-col'
        )}
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          const optId = `${name}-${opt.value}`;

          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none min-h-[44px]',
                isSelected
                  ? 'bg-blue-50/50 border-sparkline-blue ring-1 ring-sparkline-blue'
                  : 'bg-white border-slate-200/90 hover:bg-slate-50',
                opt.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                <input
                  id={optId}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={isSelected}
                  disabled={opt.disabled}
                  onChange={() => onChange(opt.value)}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 border-slate-300 bg-white transition-all flex items-center justify-center',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-sparkline-blue peer-focus-visible:ring-offset-2',
                    isSelected && 'border-sparkline-blue'
                  )}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-sparkline-blue" />}
                </div>
              </div>

              <div className="flex-1">
                <span className="text-xs font-semibold text-sparkline-midnight block leading-tight">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
      <FormError error={error} />
      {!error && <FormHelperText>{helperText}</FormHelperText>}
    </fieldset>
  );
};

// 9. DateInput Component
export interface DateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, helperText, error, id, required, className, ...props }, ref) => {
    const inputId = id || (label ? `date-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <FormLabel htmlFor={inputId} required={required}>
            {label}
          </FormLabel>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            type="date"
            required={required}
            aria-invalid={Boolean(error)}
            className={cn(
              'w-full bg-white border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-sparkline-midnight transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-sparkline-blue focus:border-transparent',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              error && 'border-rose-300 focus:ring-rose-500 bg-rose-50/20',
              className
            )}
            {...props}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <FormError error={error} />
        {!error && <FormHelperText>{helperText}</FormHelperText>}
      </div>
    );
  }
);
DateInput.displayName = 'DateInput';

