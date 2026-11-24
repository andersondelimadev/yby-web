import React, { useState, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { ChevronDown, Search, Check, X } from 'lucide-react';

/**
 * Componente reutilizável de Select com busca interna (OCP / Low Coupling).
 * Suporta rótulo, descrição secundária por opção, estado desabilitado e erro inline.
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {boolean} [props.required]
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {Array<{ value: string, label: string, description?: string }>} props.options
 * @param {string} [props.placeholder='Selecione...']
 * @param {string} [props.searchPlaceholder='Buscar...']
 * @param {string} [props.emptyMessage='Nenhuma opção encontrada']
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.error]
 * @param {string} [props.helperText]
 * @param {string} [props.className]
 * @param {string} [props.id]
 */
export function SearchableSelect({
  label,
  required = false,
  value = '',
  onChange,
  options = [],
  placeholder = 'Selecione...',
  searchPlaceholder = 'Digite para buscar...',
  emptyMessage = 'Nenhuma opção encontrada',
  disabled = false,
  error,
  helperText,
  className = '',
  id,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const fieldId = id || (label ? `searchable-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value) || null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter(
      (opt) =>
        String(opt.label || '').toLowerCase().includes(q) ||
        String(opt.description || '').toLowerCase().includes(q)
    );
  }, [options, query]);

  useEffect(() => {
    if (disabled && open) {
      setOpen(false);
    }
  }, [disabled, open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={clsx('flex flex-col gap-1.5 w-full text-left relative', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-xs font-semibold text-yby-heading">
          {label}
          {required && <span className="text-yby-danger ml-0.5">*</span>}
        </label>
      )}

      <button
        id={fieldId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={clsx(
          'w-full flex items-center justify-between gap-2 text-sm rounded-lg border px-3.5 py-2.5 h-[44px] text-left transition-colors',
          disabled
            ? 'bg-gray-100/90 border-yby-border/80 text-yby-muted cursor-not-allowed'
            : 'bg-white border-yby-border text-yby-heading hover:border-yby-primary cursor-pointer',
          open && !disabled && 'border-yby-primary ring-2 ring-yby-tint',
          error && 'border-yby-danger hover:border-yby-danger focus:border-yby-danger'
        )}
      >
        <span className={clsx('truncate', !selectedOption && 'text-yby-muted/80')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-yby-muted shrink-0 transition-transform duration-150',
            open && 'rotate-180 text-yby-primary'
          )}
        />
      </button>

      {open && !disabled && (
        <div
          role="listbox"
          aria-label={label || 'Opções'}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl border border-yby-border shadow-popup overflow-hidden"
        >
          <div className="p-2 border-b border-yby-border/60 bg-yby-surface/40">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-yby-muted pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white rounded-lg border border-yby-border focus:outline-none focus:border-yby-primary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 text-yby-muted hover:text-yby-heading"
                  aria-label="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-xs text-center text-yby-muted">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={clsx(
                      'w-full px-3 py-2 text-left flex items-start justify-between gap-2 transition-colors',
                      isSelected
                        ? 'bg-yby-tint/60 text-yby-primary'
                        : 'text-yby-heading hover:bg-yby-surface/70'
                    )}
                  >
                    <div className="min-w-0">
                      <span className={clsx('block text-xs truncate', isSelected ? 'font-bold' : 'font-semibold')}>
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span className="block text-[11px] text-yby-muted truncate mt-0.5">
                          {opt.description}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-yby-primary shrink-0 mt-0.5" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error ? (
        <span className="text-xs text-yby-danger font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-yby-muted">{helperText}</span>
      ) : null}
    </div>
  );
}
