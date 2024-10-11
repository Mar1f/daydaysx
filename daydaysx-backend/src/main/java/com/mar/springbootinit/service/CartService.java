package com.mar.springbootinit.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.mar.springbootinit.model.dto.cart.CartAddRequest;
import com.mar.springbootinit.model.dto.cart.CartQueryRequest;
import com.mar.springbootinit.model.entity.Cart;
import com.mar.springbootinit.model.entity.Cart;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.vo.CartVO;

/**
* @author mar1
* @description 针对表【cart(购物车)】的数据库操作Service
* @createDate 2024-10-11 16:27:53
*/
public interface CartService extends IService<Cart> {
    /**
     * 校验
     *
     * @param goods
     * @param add
     */
    void validCart(Cart goods, boolean add);

    /**
     * 订单提交
     *
     * @param cartAddRequest 订单提交信息
     * @param loginUser
     * @return
     */
    long doCart(CartAddRequest cartAddRequest, User loginUser);

    /**
     * 获取查询条件
     *
     * @param cartQueryRequest
     * @return
     */
    QueryWrapper<Cart> getQueryWrapper(CartQueryRequest cartQueryRequest);

    /**
     * 获取订单封装
     *
     * @param cart
     * @param loginUser
     * @return
     */
    CartVO getCartVO(Cart cart, User loginUser);

    /**
     * 分页获取订单封装
     *
     * @param cartPage
     * @param loginUser
     * @return
     */
    Page<CartVO> getCartVOPage(Page<Cart> cartPage, User loginUser);
}
