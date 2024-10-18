import { Modal } from 'antd';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormItem,
} from '@ant-design/pro-components';
import PictureUploader from '@/components/PictureUploader';
import { addGoodsUsingPost } from '@/services/backend/goodsController';
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
   * 创建商品
   */
  const handleCreate = async (values: any) => {
    try {
      const res = await addGoodsUsingPost(values);
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
        <ProFormText name="title" label="名称" placeholder="请输入名称" rules={[{ required: true }]} />
        <ProFormTextArea name="content" label="描述" placeholder="请输入描述" />
        <ProFormText name="place" label="货源" placeholder="请输入货源" />
        <ProFormText name="price" label="单价" placeholder="请输入单价" />
        <ProFormText name="goodsNum" label="库存" placeholder="请输入库存" />

        {/* 标签选择 */}
        <ProFormSelect
          label="标签"
          name="tags"
          placeholder="请选择标签"
          mode="multiple"  // 支持多选
          options={[
            { label: '新鲜水果', value: '新鲜水果' },
            { label: '海鲜水产', value: '海鲜水产' },
            { label: '猪牛羊肉', value: '猪牛羊肉' },
            { label: '禽类蛋品', value: '禽类蛋品' },
            { label: '新鲜蔬菜', value: '新鲜蔬菜' },
            { label: '速冻食品', value: '速冻食品' },
          ]}
        />

        {/* 图片上传 */}
        <ProFormItem label="图片" name="goodsPic">
          <PictureUploader biz="goods_picture" />
        </ProFormItem>
      </ProForm>
    </Modal>
  );
};

export default CreateModal;
