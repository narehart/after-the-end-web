import type { DisplayInfo } from '../types/ui';
import { isTauri } from './isTauri';
import { getTauriDisplayInfo } from './getTauriDisplayInfo';
import { getBrowserDisplayInfo } from './getBrowserDisplayInfo';

type GetDisplayInfoReturn = DisplayInfo;

export async function getDisplayInfo(): Promise<GetDisplayInfoReturn> {
  if (isTauri()) {
    const tauriInfo = await getTauriDisplayInfo();
    if (tauriInfo !== null) {
      return tauriInfo;
    }
  }

  return getBrowserDisplayInfo();
}
