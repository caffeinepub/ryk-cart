import { useState, useEffect } from 'react';

const ADMIN_UNLOCK_KEY = 'ryk_admin_unlocked';
const CORRECT_PASSWORD = 'miang275@';

export function useAdminUnlock() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const unlocked = sessionStorage.getItem(ADMIN_UNLOCK_KEY) === 'true';
    setIsUnlocked(unlocked);
    setIsChecking(false);
  }, []);

  const unlock = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(ADMIN_UNLOCK_KEY, 'true');
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
    setIsUnlocked(false);
  };

  return {
    isUnlocked,
    isChecking,
    unlock,
    lock,
  };
}
