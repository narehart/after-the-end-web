import { useState, useEffect } from 'react';
import type { DisplayInfo } from '../types/ui';
import { getDisplayInfo } from '../utils/getDisplayInfo';

interface UseDisplayInfoReturn {
  displayInfo: DisplayInfo | null;
  isLoading: boolean;
}

export default function useDisplayInfo(): UseDisplayInfoReturn {
  const [displayInfo, setDisplayInfo] = useState<DisplayInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDisplayInfo = async (): Promise<void> => {
      const info = await getDisplayInfo();
      setDisplayInfo(info);
      setIsLoading(false);
    };

    void fetchDisplayInfo();
  }, []);

  return { displayInfo, isLoading };
}
