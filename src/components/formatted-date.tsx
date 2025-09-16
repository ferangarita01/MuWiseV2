
'use client';

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  dateString: string;
  options?: Intl.DateTimeFormatOptions;
}

export function FormattedDate({ dateString, options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
} }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (dateString) {
      try {
        const date = new Date(dateString);
        // Check if the date is valid before formatting
        if (!isNaN(date.getTime())) {
          setFormattedDate(new Intl.DateTimeFormat('es-ES', options).format(date));
        } else {
          setFormattedDate('Fecha Inválida');
        }
      } catch (e) {
        setFormattedDate('Fecha Inválida');
      }
    }
  }, [dateString, options]);

  return <>{formattedDate}</>;
}
