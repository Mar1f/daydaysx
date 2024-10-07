package com.mar.springbootinit.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.mar.springbootinit.model.dto.goods.GoodsAddRequest;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderAddRequest;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderQueryRequest;
import com.mar.springbootinit.model.entity.GoodsOrder;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.vo.GoodsOrderVO;

/**
* @author mar1
* @description 针对表【goods_order(订单)】的数据库操作Service
* @createDate 2024-10-06 11:34:08
*/
public interface GoodsOrderService extends IService<GoodsOrder> {

    /**
     * 订单提交
     *
     * @param goodsOrderAddRequest 订单提交信息
     * @param loginUser
     * @return
     */
    long doGoodsOrder(GoodsOrderAddRequest goodsOrderAddRequest, User loginUser);

    /**
     * 获取查询条件
     *
     * @param goodsOrderQueryRequest
     * @return
     */
    QueryWrapper<GoodsOrder> getQueryWrapper(GoodsOrderQueryRequest goodsOrderQueryRequest);

    /**
     * 获取订单封装
     *
     * @param goodsOrder
     * @param loginUser
     * @return
     */
    GoodsOrderVO getGoodsOrderVO(GoodsOrder goodsOrder, User loginUser);

    /**
     * 分页获取订单封装
     *
     * @param goodsOrderPage
     * @param loginUser
     * @return
     */
    Page<GoodsOrderVO> getGoodsOrderVOPage(Page<GoodsOrder> goodsOrderPage, User loginUser);
}