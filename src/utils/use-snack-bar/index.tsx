import { useState, useCallback } from 'react';
import { SnackVariant } from '@/components/common/snack-bar';

interface SnackState {
  show: boolean;
  text: string;
  variant: SnackVariant;
}

interface ShowSnackOptions {
  text: string;
  variant?: SnackVariant;
}

export const useSnackBar = () => {
  const [snackState, setSnackState] = useState<SnackState>({
    show: false,
    text: '',
    variant: 'info',
  });

  const showSnack = useCallback((options: ShowSnackOptions) => {
    setSnackState({
      show: true,
      text: options.text,
      variant: options.variant || 'info',
    });
  }, []);

  const hideSnack = useCallback(() => {
    setSnackState(prev => ({ ...prev, show: false }));
  }, []);

  // Convenience methods for different variants
  const showError = useCallback(
    (text: string) => {
      showSnack({ text, variant: 'error' });
    },
    [showSnack]
  );

  const showSuccess = useCallback(
    (text: string) => {
      showSnack({ text, variant: 'success' });
    },
    [showSnack]
  );

  const showWarning = useCallback(
    (text: string) => {
      showSnack({ text, variant: 'warning' });
    },
    [showSnack]
  );

  const showInfo = useCallback(
    (text: string) => {
      showSnack({ text, variant: 'info' });
    },
    [showSnack]
  );

  return {
    snackState,
    showSnack,
    hideSnack,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
};
