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
import NotFound from './pages/Page404';
import AuthGuard from "./utils/route-guard/AuthGuard";
import GuestGuard from "./utils/route-guard/GuestGuard";
import DepositDetail from "./pages/DepositDetail";
import DepositNew from "./pages/DepositNew";
import Company from "./pages/Company";
import CompanyDetail from "./pages/CompanyDetail";
import CompanyNew from "./pages/CompanyNew";
import ModeratorGuard from "./utils/route-guard/ModeratorGuard";
import UserModerator from "./pages/UserModerator";
import Profile from "./pages/Profile";
import CompanyModerator from "./pages/CompanyModerator";
import TypeModerate from "./pages/TypeModerate";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element:
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>,
      children: [
        { path: 'app', element:
            <DashboardApp />
        },
        { path: 'blog', element:
            <Deposit />
        },
        { path: 'deposit', element:
            <DepositDetail />
        },
        { path: 'deposits/new', element:
            <DepositNew />
        },
        { path: 'companies', element:
            <Company />
        },
        { path: 'company', element:
            <CompanyDetail />
        },
        { path: 'companies/new', element:
            <CompanyNew />
        },
        { path: 'profile', element:
            <Profile />
        },
        {
          path: 'moderate/user', element:
            <ModeratorGuard>
              <UserModerator />
            </ModeratorGuard>
        },
        {
          path: 'moderate/company', element:
            <ModeratorGuard>
              <CompanyModerator />
            </ModeratorGuard>
        },
        {
          path: 'moderate/type', element:
            <ModeratorGuard>
              <TypeModerate />
            </ModeratorGuard>
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
