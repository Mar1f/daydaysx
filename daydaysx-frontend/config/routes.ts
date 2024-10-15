
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/', icon: 'smile', component: './index/index', name: '主页' },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
      { icon: 'tools', path: '/admin/goods', component: './Admin/Goods', name: "商品管理" },
      { icon: 'tools', path: '/admin/goods/add', component: './Admin/Goods/Add', name: "商品添加",hideInMenu: true, },
    ],
  },
  { path: '/cart', icon: 'ShoppingCartOutlined', component: './cart/index', name: '购物车' },
  { path: '/order', icon: 'ShoppingCartOutlined', component: './Order/index', name: '订单' },
  { path: '/about', icon: 'ShoppingCartOutlined', component: './Our/about', name: '关于我们' },

  {
    path: '/Goods/detail/:id',
    icon: 'home',
    component: './Goods/Detail',
    name: '商品详情',
    hideInMenu: true,
  },
  {
    path: '/Order/detail/:id',
    icon: 'home',
    component: './Order/Detail',
    name: '订单详细界面',
    hideInMenu: true,
  },
  {
    path: '/User/detail/:id',
    icon: 'home',
    component: './User/Detail',
    name: '个人详情',
    hideInMenu: true,
  },
  { path: '*', layout: false, component: './404' },
];
