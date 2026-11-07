import React from 'react';
import clsx from 'clsx';

/**
 * Pílula/Badge semântica do Design System YBY.
 * @param {object} props
 * @param {'green'|'beige'|'orange'|'blue'|'teal'|'gray'|'red'} [props.variant='green']
 */
export function Badge({ children, variant = 'green', className = '', ...props }) {
  const variants = {
    green: 'bg-yby-tint text-yby-primary border-yby-light',
    beige: 'bg-yby-surface text-yby-heading border-yby-border',
    orange: 'bg-orange-50 text-yby-orange border-orange-200',
    blue: 'bg-blue-50 text-yby-blue border-blue-200',
    teal: 'bg-emerald-50 text-yby-teal border-emerald-200',
    gray: 'bg-gray-100 text-yby-muted border-gray-200',
    red: 'bg-red-50 text-yby-danger border-red-200',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
