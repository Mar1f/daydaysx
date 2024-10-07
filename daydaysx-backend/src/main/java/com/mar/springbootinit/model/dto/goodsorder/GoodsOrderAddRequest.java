package com.mar.springbootinit.model.dto.goodsorder;

import lombok.Data;

import java.io.Serializable;

/**
 * 订单请求
 *
 */
@Data
public class GoodsOrderAddRequest implements Serializable {

    /**
     * 订单 id
     */
    private Long goodsId;
    /**
     * 订单数量
     */
    private Integer goodsNum;
    /**
     * 订单价格
     */
    private Double goodsPrice;

    private static final long serialVersionUID = 1L;
}