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

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://marone-1326817243.cos.ap-beijing.myqcloud.com/test%2Fimg_1.png')", // 背景图片不变
      backgroundSize: '100% 100%',
    };
  });

  const handleSubmit = async (values: API.UserLoginRequest) => {
    try {
      // 登录
      const res = await userLoginUsingPost({
        ...values,
      });

      const defaultLoginSuccessMessage = '登录成功！';
      message.success(defaultLoginSuccessMessage);
      // 保存已登录用户信息
      setInitialState({
        ...initialState,
        currentUser: res.data,
      });
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    } catch (error: any) {
      const defaultLoginFailureMessage = `登录失败，${error.message}`;
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
          marginTop: '50px',
          display: 'flex',
          justifyContent: 'space-between', // 使子元素等间距排列
          alignItems: 'flex-start',
        }}
      >
        {/* 第一部分 */}
        <div style={{ flexBasis: '16.67%' }}></div>

        {/* 第二部分：登录框放置在这里 */}
        <div
          style={{
            flexBasis: '16.67%',
            display: 'flex',
            justifyContent: 'center', // 确保登录框在第二部分居中对齐
          }}
        >
          <LoginForm
            contentStyle={{
              minWidth: 280,
              maxWidth: '75vw',
            }}
            logo={
              <img
                alt="logo"
                style={{
                  height: '100px',
                  width: '220px',
                  display: 'block',
                  marginLeft: '-80px', // 确保 logo 左对齐
                  marginTop:'-20px',
                  alignSelf: 'flex-start',
                }}
                src="/logo.png"
              />
            }
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
              style={{
                marginTop:'50px',
                padding:'15px'
              }}
              centered
              items={[
                {
                  key: 'account',
                  label: ( <span style={{ color: '#1D4ED8' }}>账户密码登录</span>),
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
                  rules={[
                    {
                      required: true,
                      message: '账号是必填项！',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="userPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                  }}
                  placeholder={'请输入密码'}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                  ]}
                />
              </>
            )}

            <div
              style={{
                marginBottom: 24,
                textAlign: 'right',
              }}
            >
              <Link to="/user/register" style={{ color: '#D97706' }}>新用户注册</Link>
            </div>
          </LoginForm>
        </div>

        {/* 第三到第六部分 */}
        <div style={{ flexBasis: '66.66%' }}></div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
