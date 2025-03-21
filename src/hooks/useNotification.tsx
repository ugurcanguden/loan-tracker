// hooks/useNotification.ts 

import { useNotificationContext } from "@guden-context";

export const useNotification = () => {
  const { showNotification, hideNotification } = useNotificationContext();

  return {
    notify: showNotification,
    closeNotification: hideNotification,
  };
};
