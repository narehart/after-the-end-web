import { useState, useEffect } from 'react';

export default function useActionModalWidth(actionModalRef, isOpen) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isOpen && actionModalRef.current) {
      setWidth(actionModalRef.current.offsetWidth);
    }
  }, [actionModalRef, isOpen]);

  return width;
}
