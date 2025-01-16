import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Orders from './pages/Admin/Orders/Orders.jsx';
import Reports from './pages/Admin/Reports/Reports.jsx';
import Manage from './pages/Admin/Manage/Manage.jsx';
import Profile from './pages/Admin/Profile/Profile.jsx';
import NewOrder from './pages/Customer/NewOrder.jsx';
import Adminlayout from './layouts/AdminLayout.jsx';
import OrderHistory from './pages/Admin/Manage/OrderHistory.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Adminlayout />,  
    children: [
      {
        path: "/",
        element: <Navigate to ="/Orders" replace />,
      },
      {
        path: "/Orders",
        element: <Orders />
      },
      {
        path: "/Reports",
        element: <Reports />
      },
      {
        path: "/Manage",
        element: <Manage />
      },
      {
        path: "/Profile",
        element: <Profile />
      },
      {
        path: "/OrderHistory",
        element: <OrderHistory />
      }
    ]
  },
  {
    path: "/customer/NewOrder",
    element: <NewOrder />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
