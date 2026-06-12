import React from "react";

export default function AnimatedInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  maxLength = null,
  error = "",
  className = "",
  required = false
}) {
  return (
    <div className={`relative flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-400 font-heading tracking-wide uppercase">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-3 bg-slate-900/35 backdrop-blur-lg border rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all duration-300 ${
            error 
              ? "border-rose-500/40 focus:border-rose-500" 
              : "border-white/5 focus:border-indigo-500/45 focus:bg-slate-900/60 shadow-inner"
          }`}
        />
        {maxLength && (
          <div className="absolute right-3.5 bottom-1.5 text-[10px] text-slate-500 font-mono select-none">
            {value?.length || 0}/{maxLength}
          </div>
        )}
      </div>
      {error && <span className="text-[11px] text-rose-400 font-medium pl-1">{error}</span>}
    </div>
  );
}
