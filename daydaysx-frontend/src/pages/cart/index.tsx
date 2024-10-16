import UpdateModal from '@/pages/cart/Detail/components/UpdateModal';
import {
  deleteCartGoodsUsingPost,
  listCartVoByPageUsingPost
} from '@/services/backend/cartController';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Select, Space, Tag, Typography, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import {PlusOutlined} from "@ant-design/icons";
import CreateModal from "@/pages/Goods/Detail/components/CreateModal";

/**
 * 购物车管理页面
 *
 * @constructor
 */
const CartPage: React.FC = () => {
  // 是否显示更新窗口
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前商品点击的数据
  const [currentRow, setCurrentRow] = useState<API.CartVO>();
// 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  /**
   * 删除商品
   *
   * @param row
   */
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

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.CartVO>[] = [
    {
      title: '商品ID',
      dataIndex: 'goodsId',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '商品名称',
      dataIndex: 'title',
      valueType: 'text',
      render: (text) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: '商品描述',
      dataIndex: 'content',
      valueType: 'textarea',
      ellipsis: true,  // 自动省略过长的文本
    },
    {
      title: '数量',
      dataIndex: 'buysNum',
      valueType: 'digit',
    },
    {
      title: '商品单价',
      dataIndex: 'goodsPrice',
      valueType: 'money',  // 显示为货币格式
    },
    {
      title: '商品图片',
      dataIndex: 'goodsPic',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                console.log("下单")
                // handleDelete(record)
                setCreateModalVisible(true);

              }}
            >
              下单
            </Button>,
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
          <CreateModal
            visible={createModalVisible}
            goodsId={record.goodsId}
            onSubmit={async (values) => {
              setCreateModalVisible(false);
              // 提交表单值，包括商品ID
              console.log(values);
              await handleDelete(record); // 在下单成功后删除商品
            }}
            onCancel={() => {
              setCreateModalVisible(false);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="cart-admin-page" style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
      <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        购物车管理
      </Typography.Title>
      <ProTable<API.CartVO>
        headerTitle="购物车列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          pageSize: 10, // 每页显示条数
        }}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listCartVoByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.CartQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
        rowClassName={(record, index) =>
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark' // 条纹效果
        }
      />
      <UpdateModal
        visible={isUpdateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setIsUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setIsUpdateModalVisible(false);
        }}
      />
    </div>
  );
};
export default CartPage;
