import React, { useEffect, useRef, useState } from 'react';
import { ProCard, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import { getLoginUserUsingGet, updateMyUserUsingPost } from '@/services/backend/userController'; // API 引用
import PictureUploader from '@/components/PictureUploader'; // 引入图片上传组件

const UserProfilePage: React.FC = () => {
  const formRef = useRef();
  const [userInfo, setUserInfo] = useState<API.LoginUserVO>(); // 存储用户信息
  const [avatarUrl, setAvatarUrl] = useState<string>(); // 存储上传的头像URL

  /**
   * 加载当前登录用户信息
   */
  const loadUserInfo = async () => {
    try {
      const res = await getLoginUserUsingGet();
      if (res.data) {
        setUserInfo(res.data);
        formRef.current?.setFieldsValue(res.data);
        // 设置已有的头像URL
        if (res.data.userAvatar) {
          setAvatarUrl(res.data.userAvatar);
        }
      }
    } catch (error: any) {
      message.error('加载用户信息失败: ' + error.message);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  /**
   * 提交更新的个人信息
   * @param values
   */
  const handleSubmit = async (values: API.UserUpdateMyRequest) => {
    try {
      const res = await updateMyUserUsingPost({
        ...values,
        userAvatar: avatarUrl, // 传递上传的头像URL
      });
      if (res.data) {
        message.success('个人信息更新成功');
        loadUserInfo(); // 重新加载用户信息
      }
    } catch (error: any) {
      message.error('更新失败: ' + error.message);
    }
  };

  return (
    <ProCard title="个人中心" bordered>
      <ProForm
        formRef={formRef}
        initialValues={userInfo}
        onFinish={handleSubmit}
        submitter={{
          submitButtonProps: { type: 'primary' },
          resetButtonProps: { style: { display: 'none' } },
        }}
      >
        <ProFormText
          name="userName"
          label="用户名"
          placeholder="请输入用户名"
          rules={[{ required: true, message: '用户名是必填项' }]}
        />
        <ProFormTextArea
          name="userProfile"
          label="个人简介"
          placeholder="请输入个人简介"
        />

        <ProForm.Item label="头像">
          <PictureUploader
            biz="user_avatar" // 业务分类
            value={avatarUrl}
            onChange={(url: string) => setAvatarUrl(url)} // 更新头像URL
          />
        </ProForm.Item>
      </ProForm>
    </ProCard>
  );
};

export default UserProfilePage;
