import { doGoodsOrderUsingPost } from '@/services/backend/goodsOrderController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

interface Props {
  visible: boolean;
  goodsId: number;  // 添加商品ID作为一个属性
  onSubmit: (values: API.GoodsOrderVO) => void;
  onCancel: () => void;
}

/**
 * 添加订单
 * @param fields
 */
const handleAdd = async (fields: API.GoodsOrderVO) => {
  const hide = message.loading('正在添加');
  try {
    await doGoodsOrderUsingPost(fields);
    hide();
    message.success('订单创建成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('订单创建失败，' + error.message);
    return false;
  }
};

/**
 * 创建订单弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { visible, goodsId, onSubmit, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title={'创建订单'}
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
            title: '购买数量',
            dataIndex: 'goodsNum',
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
          {
            title: '收货地址',
            dataIndex: 'address',
            valueType: 'text',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '请输入收货地址',
                },
              ],
            },
          },
        ]}
        onSubmit={async (values: API.GoodsOrderVO) => {
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

export default CreateModal;
