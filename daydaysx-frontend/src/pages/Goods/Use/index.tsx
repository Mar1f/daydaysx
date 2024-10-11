import {
  getGoodsVoByIdUsingGet,
} from '@/services/backend/goodsController';
import {
  doGoodsOrderUsingPost
} from '@/services/backend/goodsOrderController';
import { Link, useModel, useParams } from '@@/exports';
import {  ShoppingCartOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Image,
  Input,
  message,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * 下单
 * @constructor
 */
const GoodsUsePage: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<API.GoodsVO>({});
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};


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



  return (
    <PageContainer title={<></>} loading={loading}>
      <Card>
        <Row justify="space-between" gutter={[32, 32]}>
          <Col flex="auto">
            <Space size="large" align="center">
              <Typography.Title level={4}>{data.title}</Typography.Title>
              {tagListView(data.tags)}
              <Typography.Title level={4}>{data.content}</Typography.Title>
            </Space>
            <Typography.Paragraph>{data.content}</Typography.Paragraph>
            <div style={{ marginBottom: 24 }} />
            <Space size="middle">
              <Link to={`/goods/detail/${id}`}>
                <Button>查看详情</Button>
              </Link>
            </Space>
          </Col>
          <Col flex="320px">
            <Image src={data.goodsPic} />
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default GoodsUsePage;
