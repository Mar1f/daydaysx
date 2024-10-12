import Footer from '@/components/Footer';
import { userLoginUsingPost } from '@/services/backend/userController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { Link } from 'umi';
import Settings from '../../../../config/defaultSettings';
import './Login.css'; // 导入 CSS 文件

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const containerClassName = useEmotionCss(() => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    background: '#eff0f4', // 设置背景颜色
  }));

  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      const res = await userLoginUsingPost({ ...values });
      message.success('登录成功！');
      setInitialState({ ...initialState, currentUser: res.data });
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
    } catch (error: any) {
      message.error(`登录失败，${error.message}`);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>{'登录'} - {Settings.title}</title>
      </Helmet>
      <div className="box"> {/* 包装盒 */}
        <div className="content">
          <h2>登录</h2>
          <LoginForm
            contentStyle={{
              minWidth: 1000,
              maxWidth: '75vw',
            }}
            logo={<img alt="logo" style={{ height: '100%' }} src="/logo.svg" />}
            title="天天生鲜"
            subTitle={'快速开发天天生鲜'}
            initialValues={{
              autoLogin: true,
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.UserLoginRequest);
            }}
          >
            <Tabs
              activeKey={type}
              onChange={setType}
              centered
              items={[
                {
                  key: 'account',
                  label: '账户密码登录',
                },
              ]}
            />
            {type === 'account' && (
              <>
                <ProFormText
                  name="userAccount"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                  }}
                  placeholder={'请输入账号'}
                  rules={[{ required: true, message: '账号是必填项！' }]}
                />
                <ProFormText.Password
                  name="userPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                  }}
                  placeholder={'请输入密码'}
                  rules={[{ required: true, message: '密码是必填项！' }]}
                />
              </>
            )}
            <div style={{ marginBottom: 24, textAlign: 'right' }}>
              <Link to="/user/register">新用户注册</Link>
            </div>
          </LoginForm>
        </div>
        <Link to="#" className="btns">忘记密码</Link>
        <Link to="/user/register" className="btns register">注册</Link>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
