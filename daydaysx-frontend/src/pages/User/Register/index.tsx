import Footer from '@/components/Footer';
import { userRegisterUsingPost } from '@/services/backend/userController';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history } from '@umijs/max';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { Link } from 'umi';
import Settings from '../../../../config/defaultSettings';

/**
 * 用户注册页面
 * @constructor
 */
const UserRegisterPage: React.FC = () => {
  const [type, setType] = useState<string>('account');
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

  /**
   * 提交注册
   * @param values
   */
  const handleSubmit = async (values: API.UserRegisterRequest) => {
    // 前端校验
    // 1. 判断密码是否一致
    const { userPassword, checkPassword } = values;
    if (userPassword !== checkPassword) {
      message.error('二次输入的密码不一致');
      return;
    }

    try {
      // 注册
      await userRegisterUsingPost({
        ...values,
      });

      const defaultLoginSuccessMessage = '注册成功！';
      message.success(defaultLoginSuccessMessage);
      history.push('/user/login');
      return;
    } catch (error: any) {
      const defaultLoginFailureMessage = `注册失败，${error.message}`;
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
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
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
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
                label: '新用户注册',
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
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请再次确认密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
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
            <Link to="/user/login" style={{ color: '#D97706' }}>老用户登录</Link>
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
export default UserRegisterPage;
