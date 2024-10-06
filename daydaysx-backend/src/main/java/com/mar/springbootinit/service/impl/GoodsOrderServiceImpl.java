package com.mar.springbootinit.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mar.springbootinit.common.ErrorCode;
import com.mar.springbootinit.exception.BusinessException;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderAddRequest;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderQueryRequest;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.GoodsOrder;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.enums.GoodsOrderStatusEnum;
import com.mar.springbootinit.model.vo.GoodsOrderVO;
import com.mar.springbootinit.service.GoodsOrderService;
import com.mar.springbootinit.service.GoodsService;
import com.mar.springbootinit.mapper.GoodsOrderMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.concurrent.CompletableFuture;

/**
* @author mar1
* @description 针对表【goods_order(订单)】的数据库操作Service实现
* @createDate 2024-10-06 11:34:08
*/
@Service
public class GoodsOrderServiceImpl extends ServiceImpl<GoodsOrderMapper, GoodsOrder>
    implements GoodsOrderService{

    @Resource
    private GoodsService goodsService;

    /**
     * 订单
     *
     * @param goodsOrderAddRequest
     * @param loginUser
     * @return
     */
    @Override
    public long doGoodsOrder(GoodsOrderAddRequest goodsOrderAddRequest, User loginUser) {
       long goodsId = goodsOrderAddRequest.getGoodsId();
        // 判断是否存在
        Goods goods = goodsService.getById(goodsId);
        if (goods == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        // 是否已已下单
        long userId = loginUser.getId();
        // 每个用户串行订单
        GoodsOrder goodsOrder = new GoodsOrder();
        goodsOrder.setUserId(userId);
        goodsOrder.setGoodsId(goodsId);
        goodsOrder.setPlace(goods.getPlace());
        goodsOrder.setGoodsNum(goods.getGoodsNum());
        goodsOrder.setPlaceStatus(GoodsOrderStatusEnum.WAITING.getValue());
        boolean save = this.save(goodsOrder);
        if(!save ){
            throw new BusinessException(ErrorCode.SYSTEM_ERROR,"订单下单失败");
        }
        return goodsOrder.getId();
    }

    @Override
    public QueryWrapper<GoodsOrder> getQueryWrapper(GoodsOrderQueryRequest goodsOrderQueryRequest) {
        return null;
    }

    @Override
    public GoodsOrderVO getGoodsOrderVO(GoodsOrder goodsOrder, User loginUser) {
        return null;
    }

    @Override
    public Page<GoodsOrderVO> getGoodsOrderVOPage(Page<GoodsOrder> goodsOrderPage, User loginUser) {
        return null;
    }


}




