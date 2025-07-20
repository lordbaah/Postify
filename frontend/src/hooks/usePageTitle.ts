import { useEffect } from 'react';

const APP_NAME = 'Posity';

const usePageTitle = (pageTitle?: string) => {
  useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} | ${APP_NAME}`;
    } else {
      document.title = APP_NAME; // Default title if no specific page title
    }

    // Optional: Cleanup function if you need to revert title on unmount
    return () => {
      document.title = APP_NAME;
    };
  }, [pageTitle]); // Re-run effect if pageTitle changes
};

export default usePageTitle;
