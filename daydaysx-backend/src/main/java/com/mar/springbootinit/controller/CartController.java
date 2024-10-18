package com.mar.springbootinit.controller;

import cn.hutool.core.codec.Base64Encoder;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mar.springbootinit.annotation.AuthCheck;
import com.mar.springbootinit.common.BaseResponse;
import com.mar.springbootinit.common.DeleteRequest;
import com.mar.springbootinit.common.ErrorCode;
import com.mar.springbootinit.common.ResultUtils;
import com.mar.springbootinit.constant.UserConstant;
import com.mar.springbootinit.exception.BusinessException;
import com.mar.springbootinit.exception.ThrowUtils;
import com.mar.springbootinit.manager.CacheManager;
import com.mar.springbootinit.model.dto.cart.CartAddRequest;
import com.mar.springbootinit.model.dto.cart.CartEditRequest;
import com.mar.springbootinit.model.dto.cart.CartQueryRequest;
import com.mar.springbootinit.model.dto.cart.CartUpdateRequest;
import com.mar.springbootinit.model.dto.goods.GoodsEditRequest;
import com.mar.springbootinit.model.dto.goods.GoodsQueryRequest;
import com.mar.springbootinit.model.dto.goods.GoodsUpdateRequest;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.Cart;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.vo.CartVO;
import com.mar.springbootinit.model.vo.GoodsVO;
import com.mar.springbootinit.service.CartService;
import com.mar.springbootinit.service.GoodsService;
import com.mar.springbootinit.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 订单收藏接口
 *
 */
@RestController
@RequestMapping("/cart")
@Slf4j
public class CartController {

    @Resource
    private CartService cartService;

    @Resource
    private UserService userService;
    @Resource
    private GoodsService goodsService;
    @Resource
    private CacheManager cacheManager;
    /**
     * 加入购物车
     *
     * @param cartAddRequest
     * @param request
     * @return 提交记录的 id
     */
    @PostMapping("/add")
    public BaseResponse<Long> doCart(@RequestBody CartAddRequest cartAddRequest,
                                     HttpServletRequest request) {
        // 1. 检查请求参数是否合法
        if (cartAddRequest == null || cartAddRequest.getGoodsId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品 ID 无效");
        }

        // 2. 检查商品数量是否有效，且不能为 0
        Integer buysNum = cartAddRequest.getBuysNum();
        if (buysNum == null || buysNum <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品数量无效，不能为 0 或更小");
        }

        // 3. 登录才能添加商品到购物车
        final User loginUser = userService.getLoginUser(request);
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR, "请先登录");
        }

        // 4. 获取商品详情，检查商品是否存在
        Long goodsId = cartAddRequest.getGoodsId();
        Goods goods = goodsService.getById(goodsId);
        if (goods == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品不存在");
        }

        // 5. 检查商品库存是否足够
        if (goods.getGoodsNum() < buysNum) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品库存不足");
        }

        // 6. 检查购物车中是否已存在该商品
        CartQueryRequest cartQueryRequest = new CartQueryRequest();
        cartQueryRequest.setGoodsId(goodsId);
        cartQueryRequest.setUserId(loginUser.getId());
        QueryWrapper<Cart> queryWrapper = cartService.getQueryWrapper(cartQueryRequest);
        List<Cart> existingCarts = cartService.list(queryWrapper);

        if (existingCarts != null && !existingCarts.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "购物车中已存在该商品，不能重复添加");
        }

        // 7. 添加商品到购物车
        long cartId = cartService.doCart(cartAddRequest, loginUser);
        return ResultUtils.success(cartId);
    }
    /**
     * 分页获取列表（封装类）
     *
     * @param cartQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/list/page/vo")
    public BaseResponse<Page<CartVO>> listCartVOByPage(@RequestBody CartQueryRequest cartQueryRequest,
                                                         HttpServletRequest request) {
        long current = cartQueryRequest.getCurrent();
        long size = cartQueryRequest.getPageSize();
        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        final User loginUser = userService.getLoginUser(request);
        Long loginUserId = loginUser.getId();
        System.out.println("当前用户id:"+loginUserId);
        Page<Cart> cartPage = cartService.page(new Page<>(current, size),
                cartService.getQueryWrapper(cartQueryRequest).eq("userId", loginUserId));

        return ResultUtils.success(cartService.getCartVOPage(cartPage, loginUser));
    }

    /**
     * 获取分页缓存 keu
     *
     * @param cartQueryRequest
     * @return
     */
    public static String getPageCacheKey(CartQueryRequest cartQueryRequest) {
        String jsonStr = JSONUtil.toJsonStr(cartQueryRequest);
        // 请求参数编码
        String base64 = Base64Encoder.encode(jsonStr);
        String key = "cart:page:" + base64;
        return key;
    }
    /**
     * 快速分页获取列表（封装类）
     *
     * @param cartQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/list/page/vo/fast")
    public BaseResponse<Page<CartVO>> listCartVOByPageFast(@RequestBody CartQueryRequest cartQueryRequest,
                                                             HttpServletRequest request) {
        long current = cartQueryRequest.getCurrent();
        long size = cartQueryRequest.getPageSize();
        // 优先从缓存读取
        String cacheKey = getPageCacheKey(cartQueryRequest);
        Object cacheValue = cacheManager.get(cacheKey);
        if (cacheValue != null) {
            return ResultUtils.success((Page<CartVO>) cacheValue);
        }

        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        QueryWrapper<Cart> queryWrapper = cartService.getQueryWrapper(cartQueryRequest);
        queryWrapper.select("id",
                "title",
                "content",
                "tags",
                "goodsPic",
                "price",
                "userId",
                "goodsId",
                "price",
                "GoodsPrice",
                "BuysNum",
                "createTime",
                "updateTime"
        );
        Page<Cart> cartPage = cartService.page(new Page<>(current, size), queryWrapper);
        final User loginUser = userService.getLoginUser(request);
        Page<CartVO> cartVOPage = cartService.getCartVOPage(cartPage, loginUser);
        // 写入缓存
        cacheManager.put(cacheKey, cartVOPage);
        return ResultUtils.success(cartVOPage);
    }
    @PostMapping("/list/page")
    public BaseResponse<Page<CartVO>> listCartByPage(@RequestBody CartQueryRequest cartQueryRequest,
                                                                 HttpServletRequest request) {
        long current = cartQueryRequest.getCurrent();
        long size = cartQueryRequest.getPageSize();
        // 获取当前登录的用户
        final User loginUser = userService.getLoginUser(request);

        // 获取当前用户的ID
        Long loginUserId = loginUser.getId();
        System.out.println("当前用户id:"+loginUserId);

        // 查询当前登录用户的订单
        Page<Cart> cartPage = cartService.page(new Page<>(current, size),
                cartService.getQueryWrapper(cartQueryRequest)
                        .eq("userId", loginUserId)); // 添加过滤条件：只显示当前用户创建的订单

        // 返回脱敏后的订单信息
        return ResultUtils.success(cartService.getCartVOPage(cartPage, loginUser));
    }

    /**
     * 删除
     *
     * @param deleteRequest
     * @param request
     * @return
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteCartGoods(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getLoginUser(request);
        long id = deleteRequest.getId();
        // 判断是否存在
        Cart oldGoods = cartService.getById(id);
        ThrowUtils.throwIf(oldGoods == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可删除
        if (!oldGoods.getUserId().equals(user.getId()) && !userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean b = cartService.removeById(id);
        return ResultUtils.success(b);
    }
    /**
     * 更新（仅管理员）
     *
     * @param cartUpdateRequest
     * @return
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> updateCartGoods(@RequestBody CartUpdateRequest cartUpdateRequest) {
        if (cartUpdateRequest == null || cartUpdateRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Cart cart = new Cart();
        BeanUtils.copyProperties(cartUpdateRequest, cart);
        // 参数校验
        cartService.validCart(cart, false);
        long id = cartUpdateRequest.getId();
        // 判断是否存在
        Cart oldGoods = cartService.getById(id);
        ThrowUtils.throwIf(oldGoods == null, ErrorCode.NOT_FOUND_ERROR);
        boolean result = cartService.updateById(cart);
        return ResultUtils.success(result);
    }
    /**
     * 编辑（用户）
     *
     * @param cartEditRequest
     * @param request
     * @return
     */
    @PostMapping("/edit")
    public BaseResponse<Boolean> editGoods(@RequestBody CartEditRequest cartEditRequest, HttpServletRequest request) {
        if (cartEditRequest == null || cartEditRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Cart cart = new Cart();
        BeanUtils.copyProperties(cartEditRequest, cart);
        // 参数校验
        cartService.validCart(cart, false);
        User loginUser = userService.getLoginUser(request);
        long id = cartEditRequest.getId();
        // 判断是否存在
        Cart oldGoods = cartService.getById(id);
        ThrowUtils.throwIf(oldGoods == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可编辑
        if (!oldGoods.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean result = cartService.updateById(cart);
        return ResultUtils.success(result);
    }
}
