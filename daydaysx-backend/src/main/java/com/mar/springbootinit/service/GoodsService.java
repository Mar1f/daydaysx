package com.mar.springbootinit.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mar.springbootinit.model.dto.goods.GoodsQueryRequest;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.vo.GoodsVO;
import com.baomidou.mybatisplus.extension.service.IService;

import javax.servlet.http.HttpServletRequest;

/**
* @author mar1
* @description 针对表【goods(商品)】的数据库操作Service
* @createDate 2024-10-06 11:34:05
*/
public interface GoodsService extends IService<Goods> {

    /**
     * 校验
     *
     * @param goods
     * @param add
     */
    void validGoods(Goods goods, boolean add);

    /**
     * 获取查询条件
     *
     * @param goodsQueryRequest
     * @return
     */
    QueryWrapper<Goods> getQueryWrapper(GoodsQueryRequest goodsQueryRequest);
    /**
     * 获取帖子封装
     *
     * @param goods
     * @param request
     * @return
     */
    GoodsVO getGoodsVO(Goods goods, HttpServletRequest request);

    /**
     * 分页获取帖子封装
     *
     * @param goodsPage
     * @param request
     * @return
     */
    Page<GoodsVO> getGoodsVOPage(Page<Goods> goodsPage, HttpServletRequest request);
}
