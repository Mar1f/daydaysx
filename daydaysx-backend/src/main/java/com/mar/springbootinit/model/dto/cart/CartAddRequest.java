package com.mar.springbootinit.model.dto.cart;

import lombok.Data;

import java.io.Serializable;

/**
 * 订单请求
 *
 */
@Data
public class CartAddRequest implements Serializable {

    /**
     * 商品 id
     */
    private Long goodsId;
    /**
     * 购买数量
     */
    private Integer BuysNum;
    /**
     * 商品价格
     */
    private Double goodsPrice;

    private static final long serialVersionUID = 1L;
}