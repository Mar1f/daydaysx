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
    @PostMapping("/")
    public BaseResponse<Long> doGoodsOrder(@RequestBody GoodsOrderAddRequest goodsOrderAddRequest,
                                               HttpServletRequest request) {
        if (goodsOrderAddRequest == null || goodsOrderAddRequest.getGoodsId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 登录才能下单
        final User loginUser = userService.getLoginUser(request);
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


    /**
     * 根据 id 获取
     *
     * @param id
     * @return
     */
    @GetMapping("/get/vo")
    public BaseResponse<GoodsVO> getGoodsVOById(long id, HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Goods goods = goodsService.getById(id);
        if (goods == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        return ResultUtils.success(goodsService.getGoodsVO(goods, request));
    }


}
