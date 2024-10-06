package com.mar.springbootinit.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mar.springbootinit.common.BaseResponse;
import com.mar.springbootinit.common.ErrorCode;
import com.mar.springbootinit.common.ResultUtils;
import com.mar.springbootinit.exception.BusinessException;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderAddRequest;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderQueryRequest;
import com.mar.springbootinit.model.entity.GoodsOrder;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.vo.GoodsOrderVO;
import com.mar.springbootinit.service.GoodsOrderService;
import com.mar.springbootinit.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    /**
     * 提交题目
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
        // 登录才能点赞
        final User loginUser = userService.getLoginUser(request);
        long goodsOrderId = goodsOrderService.doGoodsOrder(goodsOrderAddRequest, loginUser);
        return ResultUtils.success(goodsOrderId);
    }

    /**
     * 分页获取订单提交列表
     *
     * @param goodsOrderQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/list/page")
    public BaseResponse<Page<GoodsOrderVO>> listGoodsOrderByPage(@RequestBody GoodsOrderQueryRequest goodsOrderQueryRequest,
                                                                 HttpServletRequest request) {
        long current = goodsOrderQueryRequest.getCurrent();
        long size = goodsOrderQueryRequest.getPageSize();
        // 从数据库中查询原始的题目提交分页信息
        Page<GoodsOrder> goodsOrderPage = goodsOrderService.page(new Page<>(current, size),
                goodsOrderService.getQueryWrapper(goodsOrderQueryRequest));
        final User loginUser = userService.getLoginUser(request);
        // 返回脱敏信息
        return ResultUtils.success(goodsOrderService.getGoodsOrderVOPage(goodsOrderPage, loginUser));
    }


}
