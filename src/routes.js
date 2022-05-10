import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import AuthGuard from "./utils/route-guard/AuthGuard";
import GuestGuard from "./utils/route-guard/GuestGuard";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element:
              <AuthGuard>
                <DashboardApp />
              </AuthGuard>
        },
        { path: 'user', element:
              <AuthGuard>
                <User />
              </AuthGuard>
        },
        { path: 'products', element:
              <AuthGuard>
                <Products />
              </AuthGuard>
        },
        { path: 'blog', element:
              <AuthGuard>
                <Blog />
              </AuthGuard>
        }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element:
              <GuestGuard>
                <Login />
              </GuestGuard>
        },
        { path: 'register', element:
              <GuestGuard>
                <Register />
              </GuestGuard>
        },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <NotFound /> }
      ]
    },
    { path: '*', element: <NotFound /> }
  ]);
}