import { Modal } from 'antd';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormItem,
} from '@ant-design/pro-components';
import PictureUploader from '@/components/PictureUploader';
import { addUserUsingPost } from '@/services/backend/userController';
import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-components';
import { message } from 'antd';

interface CreateModalProps {
  visible: boolean;
  columns: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ visible, onSubmit, onCancel }) => {
  const formRef = useRef<ProFormInstance>();

  /**
   * 创建用户
   */
  const handleCreate = async (values: any) => {
    try {
      const res = await addUserUsingPost(values);
      if (res.data) {
        message.success('创建成功');
        onSubmit();
      }
    } catch (error: any) {
      message.error('创建失败，' + error.message);
    }
  };

  return (
    <Modal
      visible={visible}
      title="新建商品"
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <ProForm
        formRef={formRef}
        onFinish={handleCreate}
        submitter={{
          searchConfig: {
            submitText: '提交',
            resetText: '重置',
          },
        }}
      >
        <ProFormText name="userAccount" label="账号" placeholder="请输入账号" rules={[{ required: true }]} />
        <ProFormTextArea name="userName" label="名字" placeholder="请输入名字" />
        <ProFormText name="userPassword" label="密码" placeholder="请输入密码" />
        <ProFormText name="userProfile" label="个性签名" placeholder="请输入个性签名" />
        <ProFormText name="userPlace" label="所在地" placeholder="请输入所在地" />
        {/* 图片上传 */}
        <ProFormItem label="图片" name="userAvatar">
          <PictureUploader biz="user_picture" />
        </ProFormItem>
      </ProForm>
    </Modal>
  );
};

export default CreateModal;
