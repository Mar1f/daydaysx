import { doGoodsOrderUsingPost } from '@/services/backend/goodsOrderController';
import { payUsingGet } from '@/services/backend/aliPayController';
import { message, Modal } from 'antd';
import React, {useRef} from 'react';
import {ActionType, ProTable} from '@ant-design/pro-components';
import {deleteCartGoodsUsingPost} from "@/services/backend/cartController";

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
  const hide = message.loading('正在添加订单...');
  try {
    // Step 1: 创建订单并获取响应结果
    const result = await doGoodsOrderUsingPost(fields);
    hide();

    if (result?.code === 0 && result?.data) {
      const orderId = result.data; // 订单 ID
      message.success('订单创建成功');

      // Step 2: 调用支付宝支付接口
      const paymentUrl = `http://localhost:8101/api/aliPay/pay?id=${orderId}`;

      // Step 3: 直接打开支付页面
      window.open(paymentUrl);
      return true;
    } else {
      throw new Error('订单创建失败');
    }
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
  const actionRef = useRef<ActionType>();
  const handleDelete = async (row: API.CartVO) => {
    const hide = message.loading('正在删除...');
    if (!row) return true;
    try {
      await deleteCartGoodsUsingPost({
        id: row.id as any,
      });
      hide();
      message.success('删除成功！');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败：' + error.message);
      return false;
    }
  };
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
            initialValue: goodsId, // 设置商品 ID 为默认值
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
          const formValues = { ...values, goodsId };
          const success = await handleAdd(formValues);
          if (success) {
            onSubmit?.(formValues); // 调用父组件的 onSubmit 方法
          }
        }}
      />
    </Modal>
  );
};

export default CreateModal;
