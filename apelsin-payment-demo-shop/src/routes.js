import { Navigate ,useRoutes } from 'react-router-dom';
import DemoShopPage from "./pages/DemoShopPage";
import DemoOrderSuccessPage from "./pages/DemoOrderSuccessPage";


export default function Router() {
  return useRoutes([
    { path: '/', element: <DemoShopPage /> },
    { path: '/success', element: <DemoOrderSuccessPage /> },
    { path: '*', element: <Navigate to="/" /> }
  ]);
}
