import { useRoutes } from 'react-router-dom';
import { Reports } from '@cloud-equipment/reports';
import Management from './Management/Management';

export const MainRouting = () => {
  return useRoutes([
    // {
    //   path: "/",
    //   element: <Dashboard />,
    // },
    {
      path: '/reports/*',
      element: <Reports />,
    },
    {
      path: '/management/*',
      element: <Management />,
    },
  ]);
};