import {
  listGoodsVoByPageFastUsingPost,
  listGoodsByPageUsingPost
} from '@/services/backend/goodsController';
import { UserOutlined } from '@ant-design/icons';
import { PageContainer, ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-components';
import { Avatar, Card, Flex, Image, Input, List, message, Tabs, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';

/**
 * 默认分页参数
 */
const DEFAULT_PAGE_PARAMS: PageRequest = {
  current: 1,
  pageSize: 8,
  sortField: 'createTime',
  sortOrder: 'descend',
};

/**
 * 主页
 * @constructor
 */
const IndexPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dataList, setDataList] = useState<API.GoodsVO[]>([]);
  const [total, setTotal] = useState<number>(0);
  // 搜索条件
  const [searchParams, setSearchParams] = useState<API.GoodsQueryRequest>({
    ...DEFAULT_PAGE_PARAMS,
  });

  // 当前的 Tab 键
  const [activeTabKey, setActiveTabKey] = useState<string>('newest');

  /**
   * 搜索
   */
  const doSearch = async () => {
    setLoading(true);
    try {
      const params = {
        ...searchParams,
        ...(activeTabKey === 'recommend' ? { minBuysNum: 500 } : {}),
      };

      console.log('请求参数:', params); // 打印请求参数，调试用

      const res = await listGoodsVoByPageFastUsingPost(params);
      setDataList(res.data?.records ?? []);
      setTotal(Number(res.data?.total) ?? 0);
    } catch (error: any) {
      message.error('获取数据失败，' + error.message);
    }
    setLoading(false);
  };


  useEffect(() => {
    doSearch();
  }, [searchParams, activeTabKey]);

  /**
   * 标签列表
   * @param tags
   */
  const tagListView = (tags?: string[]) => {
    if (!tags) {
      return <></>;
    }

    return (
      <div style={{ marginBottom: 8 }}>
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    );
  };

  return (
    <PageContainer title={<></>}>
      <Flex justify="center">
        <Input.Search
          style={{
            width: '40vw',
            minWidth: 320,
          }}
          placeholder="搜索商品"
          allowClear
          enterButton="搜索"
          size="large"
          onChange={(e) => {
            searchParams.searchText = e.target.value;
          }}
          onSearch={(value: string) => {
            setSearchParams({
              ...searchParams,
              ...DEFAULT_PAGE_PARAMS,
              searchText: value,
            });
          }}
        />
      </Flex>
      <div style={{ marginBottom: 16 }} />

      <Tabs
        size="large"
        defaultActiveKey="newest"
        items={[
          {
            key: 'newest',
            label: '最新',
          },
          {
            key: 'recommend',
            label: '推荐',
          },
        ]}
        onChange={(key) => setActiveTabKey(key)}
      />

      <QueryFilter
        span={12}
        labelWidth="auto"
        labelAlign="left"
        defaultCollapsed={false}
        style={{ padding: '16px 0' }}
        onFinish={async (values: API.GoodsQueryRequest) => {
          setSearchParams({
            ...DEFAULT_PAGE_PARAMS,
            // @ts-ignore
            ...values,
            searchText: searchParams.searchText,
          });
        }}
      >
        <ProFormSelect label="商品类别" name="tags"  mode="multiple" // 允许多选
                       options={[
                         { label: '新鲜水果', value: '新鲜水果' },
                         { label: '海鲜水产', value: '海鲜水产' },
                         { label: '猪牛羊肉', value: '猪牛羊肉' },
                         { label: '禽类蛋品', value: '禽类蛋品' },
                         { label: '新鲜蔬菜', value: '新鲜蔬菜' },
                         { label: '速冻食品', value: '速冻食品' },
                       ]} />
        <ProFormText label="名称" name="title" />
        <ProFormText label="描述" name="content" />
      </QueryFilter>

      <div style={{ marginBottom: 10 }} />

      <List<API.GoodsVO>
        rowKey="id"
        loading={loading}
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={dataList}
        pagination={{
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total,
          onChange(current: number, pageSize: number) {
            setSearchParams({
              ...searchParams,
              current,
              pageSize,
            });
          },
        }}
        renderItem={(data) => (
          <List.Item>
            <Link to={`/goods/detail/${data.id}`}>
              <Card hoverable cover={<Image alt={data.title} src={data.goodsPic} />}>
                <Card.Meta
                  title={<a>{data.title}</a>}
                  description={
                    <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
                      {data.content}<br/>
                      <span style={{ color: data.buysNum > 500 ? 'red' : 'blue', fontWeight: 'bold' }}>
              销量：{data.buysNum}
                        {data.buysNum > 500 && <span>🔥</span>}
            </span>
                    </Typography.Paragraph>
                  }
                />
                {tagListView(data.tags)}
                <Flex justify="space-between" align="center">
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {moment(data.createTime).fromNow()}
                  </Typography.Text>
                  <div>
                    <Avatar src={data.userVO?.userAvatar ?? <UserOutlined />} />
                  </div>
                </Flex>
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default IndexPage;
