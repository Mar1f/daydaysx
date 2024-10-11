import UpdateModal from '@/pages/cart/Detail/components/UpdateModal';
import {
  deleteCartGoodsUsingPost,
  listCartVoByPageFastUsingPost
} from '@/services/backend/cartController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Select, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * 购物车管理页面
 *
 * @constructor
 */
const CartPage: React.FC = () => {
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前商品点击的数据
  const [currentRow, setCurrentRow] = useState<API.CartVO>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.CartVO) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteCartGoodsUsingPost({
        id: row.id as any,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.CartVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '名称',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '描述',
      dataIndex: 'content',
      valueType: 'textarea',
    },
    {
      title: '数量',
      dataIndex: 'buysNum',
      valueType: 'text',
    },
    {
      title: '商品单价',
      dataIndex: 'goodsPrice',
      valueType: 'text',
    },
    {
      title: '图片',
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
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="goods-admin-page">
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        购物车
      </Typography.Title>
      <ProTable<API.CartVO>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listCartVoByPageFastUsingPost({
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
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
    </div>
  );
};
export default CartPage;
