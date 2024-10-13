package com.mar.springbootinit.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mar.springbootinit.common.ErrorCode;
import com.mar.springbootinit.constant.CommonConstant;
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
import com.mar.springbootinit.service.UserService;
import com.mar.springbootinit.utils.SqlUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

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
    @Resource
    private UserService userService;
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
        goodsOrder.setStartPlace(goods.getPlace());
        goodsOrder.setArrivePlace(loginUser.getUserPlace());
        goodsOrder.setGoodsNum(goodsOrderAddRequest.getGoodsNum());
        BigDecimal goodsNum = BigDecimal.valueOf(goodsOrderAddRequest.getGoodsNum());
        BigDecimal price = goods.getPrice();
        BigDecimal totalPrice = goodsNum.multiply(price);
// 设置订单价格
        goodsOrder.setOrderPrice(totalPrice);
        goodsOrder.setPlaceStatus(GoodsOrderStatusEnum.FAILED.getValue());
        boolean save = this.save(goodsOrder);
        if(!save ){
            throw new BusinessException(ErrorCode.SYSTEM_ERROR,"订单下单失败");
        }
        return goodsOrder.getGoodsId();
    }


    /**
     * 获取查询包装类（用户根据哪些字段查询，根据前端传来的请求对象，得到 mybatis 框架支持的查询 QueryWrapper 类）
     *
     * @param goodsOrderQueryRequest
     * @return
     */
    @Override
    public QueryWrapper<GoodsOrder> getQueryWrapper(GoodsOrderQueryRequest goodsOrderQueryRequest) {
        QueryWrapper<GoodsOrder> queryWrapper = new QueryWrapper<>();
        if (goodsOrderQueryRequest == null) {
            return queryWrapper;
        }
        Long goodsId = goodsOrderQueryRequest.getGoodsId();
        Long userId = goodsOrderQueryRequest.getUserId();
        Integer status = goodsOrderQueryRequest.getPlaceStatus();
        String sortField = goodsOrderQueryRequest.getSortField();
        String sortOrder = goodsOrderQueryRequest.getSortOrder();

        // 拼接查询条件
        queryWrapper.eq(ObjectUtils.isNotEmpty(userId), "userId", userId);
        queryWrapper.eq(ObjectUtils.isNotEmpty(goodsId), "goodsId", goodsId);
        queryWrapper.eq(GoodsOrderStatusEnum.getEnumByValue(status) != null, "status", status);
        queryWrapper.eq("isDelete", false);
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        return queryWrapper;
    }

    @Override
    public GoodsOrderVO getGoodsOrderVO(GoodsOrder goodsOrder, User loginUser) {
        GoodsOrderVO goodsOrderVO = GoodsOrderVO.objToVo(goodsOrder);
        // 脱敏：仅本人和管理员能看见自己（提交 userId 和登录用户 id 不同）提交的代码
        long userId = loginUser.getId();
        // 处理脱敏
        if (userId != goodsOrder.getUserId() && !userService.isAdmin(loginUser)) {
            goodsOrderVO.getStartPlace();
            goodsOrderVO.getArrivePlace();
        }
        return goodsOrderVO;
    }

    @Override
    public Page<GoodsOrderVO> getGoodsOrderVOPage(Page<GoodsOrder> goodsOrderPage, User loginUser) {
        List<GoodsOrder> goodsOrderList = goodsOrderPage.getRecords();
        Page<GoodsOrderVO> goodsOrderVOPage = new Page<>(goodsOrderPage.getCurrent(), goodsOrderPage.getSize(), goodsOrderPage.getTotal());
        if (CollectionUtils.isEmpty(goodsOrderList)) {
            return goodsOrderVOPage;
        }
        List<GoodsOrderVO> goodsOrderVOList = goodsOrderList.stream()
                .map(goodsOrder -> getGoodsOrderVO(goodsOrder, loginUser))
                .collect(Collectors.toList());
        goodsOrderVOPage.setRecords(goodsOrderVOList);
        return goodsOrderVOPage;
    }



}




