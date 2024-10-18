import CreateModal from '@/pages/Admin/Goods/components/CreateModal';
import UpdateModal from '@/pages/Admin/Goods/components/UpdateModal';
import {
  deleteGoodsUsingPost,
  listGoodsByPageUsingPost,
} from '@/services/backend/goodsController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Select, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * 商品管理页面
 *
 * @constructor
 */
const GoodsAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前商品点击的数据
  const [currentRow, setCurrentRow] = useState<API.Goods>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.Goods) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteGoodsUsingPost({
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
  const columns: ProColumns<API.Goods>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
      hideInSearch:true
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
      title: '发货地址',
      dataIndex: 'place',
      valueType: 'text',
    },
    {
      title: '商品数量',
      dataIndex: 'goodsNum',
      valueType: 'text',
      hideInSearch:true
    },
    {
      title: '商品单价',
      dataIndex: 'price',
      valueType: 'text',
      hideInSearch:true
    },
    {
      title: '标签',
      dataIndex: 'tags',
      valueType: 'text',
      renderFormItem(schema) {
        const { fieldProps } = schema;
        // @ts-ignore
        return <Select mode="tags"   colSize={1}  // Control the form item width within the grid layout
                       fieldProps={{ style: { width: 200 } }} // Set the width of the select dropdown
                       options={[
                         { label: '新鲜水果', value: '新鲜水果' },
                         { label: '海鲜水产', value: '海鲜水产' },
                         { label: '猪牛羊肉', value: '猪牛羊肉' },
                         { label: '禽类蛋品', value: '禽类蛋品' },
                         { label: '新鲜蔬菜', value: '新鲜蔬菜' },
                         { label: '速冻食品', value: '速冻食品' },
                       ]} />;
      },
      render(_, record) {
        if (!record.tags) {
          return <></>;
        }

        return JSON.parse(record.tags).map((tag: string) => {
          return <Tag key={tag}>{tag}</Tag>;
        });
      },
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
      title: '创建用户',
      dataIndex: 'userId',
      valueType: 'text',
      hideInSearch:true
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
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
      <Typography.Title level={4} style={{ marginBottom: 12 }}>
        商品管理
      </Typography.Title>
      <ProTable<API.Goods>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              console.log("新建")
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listGoodsByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.GoodsQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
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
export default GoodsAdminPage;
