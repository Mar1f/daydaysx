package com.mar.springbootinit.model.dto.cart;

import com.mar.springbootinit.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * 订单查询请求
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CartQueryRequest extends PageRequest implements Serializable {

    /**
     *  id
     */
    private Long goodsId;
    /**
     * 名称
     */
    private String title;
    /**
     * 购买数量
     */
    private String BuysNum;
    /**
     * 标签列表（json 数组）
     */
    private List<String> tags;
    /**
     * 用户 id
     */
    private Long userId;

    private static final long serialVersionUID = 1L;
}