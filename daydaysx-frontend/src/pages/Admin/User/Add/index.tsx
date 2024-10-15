import PictureUploader from '@/components/PictureUploader';
import { COS_HOST } from '@/constants';
import {
  addUserUsingPost,
  deleteUserUsingPost,
  getUserVoByIdUsingGet
} from '@/services/backend/userController';
import { useSearchParams } from '@@/exports';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { ProFormItem } from '@ant-design/pro-form';
import { history } from '@umijs/max';
import { message, UploadFile } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { updateUserUsingPost} from "@/services/backend/userController";

/**
 * 创建生成器页面
 * @constructor
 */
const UserAddPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [oldData, setOldData] = useState<API.UserVO>();
  const formRef = useRef<ProFormInstance>();
  // 记录表单已填数据
  const [basicInfo, setBasicInfo] = useState<API.UserVO>();

  /**
   * 加载数据
   */
  const loadData = async () => {
    if (!id) {
      return;
    }
    try {
      const res = await getUserVoByIdUsingGet({
        id,
      });
    } catch (error: any) {
      message.error('加载数据失败，' + error.message);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  /**
   * 创建
   * @param values
   */
  const doAdd = async (values: API.UserVO) => {
    try {
      const res = await addUserUsingPost(values);
      if (res.data) {
        message.success('创建成功');
        history.push(`/user/detail/${res.data}`);
      }
    } catch (error: any) {
      message.error('创建失败，' + error.message);
    }
  };

  /**
   * 更新
   * @param values
   */
  const doUpdate = async (values: API.UserVO) => {
    try {
      const res = await updateUserUsingPost(values);
      if (res.data) {
        message.success('更新成功');
        history.push(`/user/detail/${id}`);
      }
    } catch (error: any) {
      message.error('更新失败，' + error.message);
    }
  };

  /**
   * 提交
   * @param values
   */
  const doSubmit = async (values: API.UserAddRequest) => {

    if (id) {
      await doUpdate({
        id,
        ...values,
      });
    } else {
      await doAdd(values);
    }
  };

  return (
    <ProCard>
      {/* 创建或者已加载要更新的数据时，才渲染表单，顺利填充默认值 */}
      {(!id || oldData) && (
        <StepsForm<API.UserAddRequest | API.UserVO>
          formRef={formRef}
          formProps={{
            initialValues: oldData,
          }}
          onFinish={doSubmit}
        >
          <StepsForm.StepForm
            name="base"
            title="用户信息"
            onFinish={async (values) => {
              setBasicInfo(values);
              return true;
            }}
          >
            <ProFormText name="userAccount" label="名称" placeholder="请输入名称" />
            <ProFormText name="userPlace" label="所在地" placeholder="请输入所在地" />
            <ProFormItem label="图片" name="userAvatar">
              <PictureUploader biz="user_picture" />
            </ProFormItem>
          </StepsForm.StepForm>
        </StepsForm>
      )}
    </ProCard>
  );
};

export default UserAddPage;
