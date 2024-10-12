package com.mar.springbootinit.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mar.springbootinit.common.BaseResponse;
import com.mar.springbootinit.common.ErrorCode;
import com.mar.springbootinit.common.ResultUtils;
import com.mar.springbootinit.exception.BusinessException;
import com.mar.springbootinit.exception.ThrowUtils;
import com.mar.springbootinit.model.dto.goods.GoodsQueryRequest;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderAddRequest;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderQueryRequest;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.GoodsOrder;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.vo.GoodsOrderVO;
import com.mar.springbootinit.model.vo.GoodsVO;
import com.mar.springbootinit.service.GoodsOrderService;
import com.mar.springbootinit.service.GoodsService;
import com.mar.springbootinit.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * 订单收藏接口
 *
 */
@RestController
@RequestMapping("/goods_order")
@Slf4j
public class GoodsOrderController {

    @Resource
    private GoodsOrderService goodsOrderService;

    @Resource
    private UserService userService;
    @Resource
    private GoodsService goodsService;

    /**
     * 提交订单
     *
     * @param goodsOrderAddRequest
     * @param request
     * @return 提交记录的 id
     */
    @PostMapping("/add")
    public BaseResponse<Long> doGoodsOrder(@RequestBody GoodsOrderAddRequest goodsOrderAddRequest,
                                               HttpServletRequest request) {
        // 1. 检查请求参数是否合法
        if (goodsOrderAddRequest == null || goodsOrderAddRequest.getGoodsId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品 ID 无效");
        }

        // 2. 检查商品数量是否有效
        Integer goodsNum = goodsOrderAddRequest.getGoodsNum();
        if (goodsNum == null || goodsNum <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品数量无效");
        }

        // 登录才能下单
        final User loginUser = userService.getLoginUser(request);
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR, "请先登录");
        }
        // 3. 获取商品详情，检查商品是否存在
        Long goodsId = goodsOrderAddRequest.getGoodsId();
        Goods goods = goodsService.getById(goodsId);
        if (goods == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品不存在");
        } // 5. 检查商品库存是否足够
        if (goods.getGoodsNum() < goodsNum) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品库存不足");
        }
        if (goods == null || goods.getGoodsNum() < goodsNum) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品不存在或库存不足");
        }

        // 4. 减少库存
        goods.setGoodsNum( goods.getGoodsNum() - goodsNum);

        // 5. 更新库存到数据库
        boolean updateSuccess = goodsService.updateById(goods);
        if (!updateSuccess) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "更新库存失败");
        }

        long goodsOrderId = goodsOrderService.doGoodsOrder(goodsOrderAddRequest, loginUser);
        return ResultUtils.success(goodsOrderId);
    }

    @PostMapping("/list/page")
    public BaseResponse<Page<GoodsOrderVO>> listGoodsOrderByPage(@RequestBody GoodsOrderQueryRequest goodsOrderQueryRequest,
                                                                 HttpServletRequest request) {
        long current = goodsOrderQueryRequest.getCurrent();
        long size = goodsOrderQueryRequest.getPageSize();
        // 获取当前登录的用户
        final User loginUser = userService.getLoginUser(request);

        // 获取当前用户的ID
        Long loginUserId = loginUser.getId();

        // 查询当前登录用户的订单
        Page<GoodsOrder> goodsOrderPage = goodsOrderService.page(new Page<>(current, size),
                goodsOrderService.getQueryWrapper(goodsOrderQueryRequest)
                        .eq("userId", loginUserId)); // 添加过滤条件：只显示当前用户创建的订单

        // 返回脱敏后的订单信息
        return ResultUtils.success(goodsOrderService.getGoodsOrderVOPage(goodsOrderPage, loginUser));
    }




}
