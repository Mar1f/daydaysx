import AuthorInfo from '@/pages/Goods/Detail/components/AuthorInfo';
import {
  getGoodsVoByIdUsingGet,
} from '@/services/backend/goodsController';
import { Link, useModel, useParams } from '@@/exports';
import { PlusOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Image, message, Row, Space, Tabs, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { doCartUsingPost } from "@/services/backend/cartController";
import {doGoodsOrderUsingPost} from "@/services/backend/goodsOrderController";
import CreateModal from "@/pages/Goods/Detail/components/CreateModal";
import AddToCartModal from "@/pages/Goods/Detail/components/AddToCartModal";// 导入新的弹窗组件

/**
 * 生成器详情页
 * @constructor
 */
const GoodsOrderDetailPage: React.FC = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<API.GoodsVO>({});
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const my = currentUser?.id === data?.userId;
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [addToCartModalVisible, setAddToCartModalVisible] = useState<boolean>(false); // 新的弹窗状态

  /**
   * 加载数据
   */
  const loadData = async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const res = await getGoodsVoByIdUsingGet({
        id,
      });
      setData(res.data || {});
    } catch (error: any) {
      message.error('获取数据失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  /**
   * 标签列表视图
   * @param tags
   */
  const tagListView = (tags?: string[]) => {
    if (!tags) {
      return <></>;
    }

    return (
      <div style={{ marginBottom: 8 }}>
        {tags.map((tag: string) => {
          return <Tag key={tag}>{tag}</Tag>;
        })}
      </div>
    );
  };

  // 添加到购物车的逻辑
  const handleAddToCartSubmit = async (values: API.CartVO) => {
    try {
      await doCartUsingPost({
        ...values,
        goodsId: id,
      });
      message.success('商品已成功加入购物车');
    } catch (error: any) {
      message.error('加入购物车失败，' + error.message);
    }
  };

  // 创建订单
  const handleOrderSubmit = async (values: API.GoodsOrderVO) => {
    try {
      await doGoodsOrderUsingPost({
        ...values,
        goodsId: id,  // 将商品 ID 传递给后端
      });
      message.success('订单创建成功');
    } catch (error: any) {
      message.error('订单创建失败，' + error.message);
    }
  };
  return (
    <PageContainer title={<></>} loading={loading}>
      <Card>
        <Row justify="space-between" gutter={[32, 32]}>
          <Col flex="auto">
            <Space size="large" align="center">
              <Typography.Title level={4}>{data.title}</Typography.Title>
              {tagListView(data.tags)}
            </Space>
            <Typography.Paragraph>{data.content}</Typography.Paragraph>
            <Typography.Paragraph type="secondary">
              创建时间：{moment(data.createTime).format('YYYY-MM-DD hh:mm:ss')}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary">单价：{data.price}</Typography.Paragraph>
            <Typography.Paragraph type="secondary">货源：{data.place}</Typography.Paragraph>
            <Typography.Paragraph type="secondary">库存：{data.goodsNum}</Typography.Paragraph>
            <div style={{ marginBottom: 24 }} />
            <Space size="middle">
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  console.log("下单")
                  setCreateModalVisible(true);
                }}
              >
                <PlusOutlined /> 立即下单
              </Button>,
              <Button
                icon={<ShoppingCartOutlined />}
                type="primary"
                key="primary"
                onClick={() => {
                  setAddToCartModalVisible(true); // 打开加入购物车的弹窗
                }}
              >
                加入购物车
              </Button>
              <CreateModal
                visible={createModalVisible}
                goodsId={data.id} // 将商品ID传递到弹窗
                onSubmit={(values) => {
                  setCreateModalVisible(false);
                  // 提交表单值，包括商品ID
                  console.log(values);
                }}
                onCancel={() => {
                  setCreateModalVisible(false);
                }}
              />
              <AddToCartModal // 新的加入购物车弹窗
                visible={addToCartModalVisible}
                goodsId={data.id}
                onSubmit={(values) => {
                  setAddToCartModalVisible(false);
                  // 提交表单值，包括商品ID
                  console.log(values);
                }}
                onCancel={() => {
                  setAddToCartModalVisible(false);
                }}
              />
            </Space>
          </Col>
          <Col flex="320px">
            <Image src={data.goodsPic} />
          </Col>
        </Row>
      </Card>
      <div style={{ marginBottom: 24 }} />
      <Card>
        <Tabs
          size="large"
          defaultActiveKey={'fileConfig'}
          onChange={() => {}}
          items={[
            {
              key: 'userInfo',
              label: '商家信息',
              children: <AuthorInfo data={data} />,
            },
          ]}
        />
      </Card>
    </PageContainer>
  );
};

export default GoodsOrderDetailPage;
