import {
  listGoodsVoByPageFastUsingPost
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
  pageSize: 4,
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

  /**
   * 搜索
   */
  const doSearch = async () => {
    setLoading(true);
    try {
      const res = await listGoodsVoByPageFastUsingPost(searchParams);
      setDataList(res.data?.records ?? []);
      setTotal(Number(res.data?.total) ?? 0);
    } catch (error: any) {
      message.error('获取数据失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    doSearch();
  }, [searchParams]);

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
        onChange={() => {}}
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
        <ProFormSelect label="商品类别" name="tags" mode="tags" />
        <ProFormText label="名称" name="title" />
        <ProFormText label="描述" name="content" />
      </QueryFilter>

      <div style={{ marginBottom: 24 }} />

      <List<API.GoodsVO>
        rowKey="id"
        loading={loading}
        grid={{
          gutter: 16,
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
            <Link to={`/generator/detail/${data.id}`}>
              <Card hoverable cover={<Image alt={data.title} src={data.goodsPic} />}>
                <Card.Meta
                  title={<a>{data.title}</a>}
                  description={
                    <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ height: 44 }}>
                      {data.content}
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
