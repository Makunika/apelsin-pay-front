import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Deposit from './pages/Deposit';
import User from './pages/User';
import NotFound from './pages/Page404';
import AuthGuard from "./utils/route-guard/AuthGuard";
import GuestGuard from "./utils/route-guard/GuestGuard";
import DepositDetail from "./pages/DepositDetail";
import DepositNew from "./pages/DepositNew";
import Company from "./pages/Company";
import CompanyDetail from "./pages/CompanyDetail";

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
              <Deposit />
            </AuthGuard>
        },
        { path: 'deposit', element:
            <AuthGuard>
              <DepositDetail />
            </AuthGuard>
        },
        { path: 'deposits/new', element:
            <AuthGuard>
              <DepositNew />
            </AuthGuard>
        },
        { path: 'companies', element:
            <AuthGuard>
              <Company />
            </AuthGuard>
        },
        { path: 'company', element:
            <AuthGuard>
              <CompanyDetail />
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
