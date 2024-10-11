import AuthorInfo from '@/pages/Goods/Detail/components/AuthorInfo';
import {
  getGoodsVoByIdUsingGet,
} from '@/services/backend/goodsController';
import { Link, useModel, useParams } from '@@/exports';
import {DownloadOutlined, EditOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Col, Image, message, Row, Space, Tabs, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {doGoodsOrderUsingPost} from "@/services/backend/goodsOrderController";

/**
 * 生成器详情页
 * @constructor
 */
const GoodsDetailPage: React.FC = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<API.GoodsVO>({});
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const my = currentUser?.id === data?.userId;

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


  /**
   * 加入购物车按钮
   */
  const editButton = my && (
    <Link to={`/goods/update?id=${data.id}`}>
      <Button icon={<ShoppingCartOutlined />}>加入购物车</Button>
    </Link>
  );

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
              <Link to={`/goods/use/${data.id}`}>
                <Button type="primary">立刻下单</Button>
              </Link>
              {editButton}
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

export default GoodsDetailPage;
