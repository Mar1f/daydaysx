import PictureUploader from '@/components/PictureUploader';
import { COS_HOST } from '@/constants';
import {
  addGoodsUsingPost,
  editGoodsUsingPost,
  getGoodsVoByIdUsingGet,
} from '@/services/backend/goodsController';
import { useSearchParams } from '@@/exports';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ProCard,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { ProFormItem } from '@ant-design/pro-form';
import { history } from '@umijs/max';
import { message, UploadFile } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

/**
 * 创建生成器页面
 * @constructor
 */
const GoodsAddPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [oldData, setOldData] = useState<API.GoodsEditRequest>();
  const formRef = useRef<ProFormInstance>();
  // 记录表单已填数据
  const [basicInfo, setBasicInfo] = useState<API.GoodsEditRequest>();

  /**
   * 加载数据
   */
  const loadData = async () => {
    if (!id) {
      return;
    }
    try {
      const res = await getGoodsVoByIdUsingGet({
        id,
      });

    } catch (error: any) {
      message.error('加载数据失败，' + error.message);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  /**
   * 创建
   * @param values
   */
  const doAdd = async (values: API.GoodsAddRequest) => {
    try {
      const res = await addGoodsUsingPost(values);
      if (res.data) {
        message.success('创建成功');
        history.push(`/goods/detail/${res.data}`);
      }
    } catch (error: any) {
      message.error('创建失败，' + error.message);
    }
  };

  /**
   * 更新
   * @param values
   */
  const doUpdate = async (values: API.GoodsEditRequest) => {
    try {
      const res = await editGoodsUsingPost(values);
      if (res.data) {
        message.success('更新成功');
        history.push(`/goods/detail/${id}`);
      }
    } catch (error: any) {
      message.error('更新失败，' + error.message);
    }
  };

  /**
   * 提交
   * @param values
   */
  const doSubmit = async (values: API.GoodsAddRequest) => {

    if (id) {
      await doUpdate({
        id,
        ...values,
      });
    } else {
      await doAdd(values);
    }
  };

  return (
    <ProCard>
      {/* 创建或者已加载要更新的数据时，才渲染表单，顺利填充默认值 */}
      {(!id || oldData) && (
        <StepsForm<API.GoodsAddRequest | API.GoodsEditRequest>
          formRef={formRef}
          formProps={{
            initialValues: oldData,
          }}
          onFinish={doSubmit}
        >
          <StepsForm.StepForm
            name="base"
            title="基本信息"
            onFinish={async (values) => {
              setBasicInfo(values);
              return true;
            }}
          >
            <ProFormText name="title" label="名称" placeholder="请输入名称" />
            <ProFormTextArea name="content" label="描述" placeholder="请输入描述" />
            <ProFormText name="price" label="商品单价" placeholder="请输入商品单价" />
            <ProFormText name="place" label="产地" placeholder="请输入产地" />
            <ProFormText name="goodsNum" label="库存" placeholder="请输入库存数量" />
            <ProFormSelect label="标签" mode="tags" name="tags" placeholder="请输入标签列表" />
            <ProFormItem label="图片" name="goodsPic">
              <PictureUploader biz="goods_picture" />
            </ProFormItem>
          </StepsForm.StepForm>
        </StepsForm>
      )}
    </ProCard>
  );
};

export default GoodsAddPage;
