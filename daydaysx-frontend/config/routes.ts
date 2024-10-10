
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/index', icon: 'smile', component: './index/index', name: '主页' },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
    ],
  },
  { path: '/welcome', icon: 'smile', component: './Welcome', name: '欢迎页' },
  { path: '/cart', icon: 'ShoppingCartOutlined', component: './cart/cart', name: '购物车' },
  { path: '/about', icon: 'ShoppingCartOutlined', component: './Our/about', name: '关于我们' },
  {
    path: '/Goods/add',
    icon: 'plus',
    component: './Goods/Add',
    name: '商品添加',
  },
  {
    path: '/Goods/detail/:id',
    icon: 'home',
    component: './Goods/Detail',
    name: '商品详情',
    hideInMenu: true,
  },



  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
