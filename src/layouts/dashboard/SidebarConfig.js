// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'Профиль',
    path: '/dashboard/profile',
    icon: getIcon('eva:people-fill')
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill')
  },
  {
    title: 'Счета',
    path: '/dashboard/blog',
    icon: getIcon('eva:file-text-fill')
  },
  {
    title: 'Компании',
    path: '/dashboard/companies',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'Модерация пользователей',
    path: '/dashboard/moderate/user',
    icon: getIcon('eva:people-fill')
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill')
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill')
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill')
  }
];

export default sidebarConfig;
