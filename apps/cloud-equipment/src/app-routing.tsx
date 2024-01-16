import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { Auth } from '@cloud-equipment/auth';
import { Main } from './Pages/Main/Main';
import { useSelector } from 'react-redux';
import { IAppState } from './Store/store';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state: IAppState) => state.auth.user);
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

export const AppRouting = () => {
  return useRoutes([
    { path: '/auth/*', element: <Auth /> },
    {
      path: '/*',
      element: <ProtectedRoute />,
    },
  ]);
};
