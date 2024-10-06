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

    private static final long serialVersionUID = 1L;
}