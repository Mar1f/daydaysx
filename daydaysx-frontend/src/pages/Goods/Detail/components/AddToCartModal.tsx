import { doCartUsingPost } from '@/services/backend/cartController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';
interface Props {
  visible: boolean;
  goodsId: number;
  onSubmit:  (values: API.CartVO) => void;
  onCancel: () => void;
}
/**
 * 添加购物车
 * @param fields
 */
const handleAdd = async (fields: API.CartVO) => {
  const hide = message.loading('正在添加');
  try {
    await doCartUsingPost(fields);
    hide();
    message.success('加入购物车成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('加入购物车失败，' + error.message);
    return false;
  }
};
/**
 * 创建购物车弹窗
 * @param props
 * @constructor
 */
const AddToCartModal: React.FC<Props> = (props) => {
  const { visible, goodsId, onSubmit, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title={'加入购物车'}
      open={visible}
      footer={null}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <ProTable
        type="form"
        columns={[
          {
            title: '商品ID',
            dataIndex: 'goodsId',
            valueType: 'text',
            initialValue: goodsId, // 设置商品ID为默认值
            hideInForm: true, // 在表单中隐藏此字段
          },
          {
            title: '数量',
            dataIndex: 'buysNum',
            valueType: 'digit',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '请输入购买数量',
                },
              ],
            },
          },
        ]}
        onSubmit={async (values: API.CartVO) => {
          // 提交表单时包含商品ID
          const formValues = { ...values, goodsId };
          const success = await handleAdd(formValues);
          if (success) {
            onSubmit?.(formValues);
          }
        }}
      />
    </Modal>
  );
};

export default AddToCartModal;
