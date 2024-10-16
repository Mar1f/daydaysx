package com.mar.springbootinit.model.dto.goodsorder;

import com.mar.springbootinit.common.PageRequest;
import com.mar.springbootinit.model.dto.post.PostQueryRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 订单查询请求
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class GoodsOrderQueryRequest extends PageRequest implements Serializable {

    /**
     * 订单 id
     */
    private Long id;
    /**
     * 订单状态
     */
    private Integer placeStatus;

    /**
     * 用户 id
     */
    private Long userId;
    /**
     * 用户 id
     */
    private Long sellerId;
    /**
     * 商品名称
     */
    private String title;

    private static final long serialVersionUID = 1L;
}