package com.mar.springbootinit.model.dto.goods;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 更新请求
 *
 */
@Data
public class GoodsUpdateRequest implements Serializable {


    /**
     * id
     */
    private Long id;

    /**
     * 标题
     */
    private String title;

    /**
     * 介绍
     */
    private String content;

    /**
     * 商品照片
     */
    private String goodsPic;

    /**
     * 标签列表（json 数组）
     */
    private List<String> tags;

    /**
     * 价格
     */
    private BigDecimal price;

    /**
     * 货源地址
     */
    private String place;

    /**
     * 库存
     */
    private Integer number;
    private static final long serialVersionUID = 1L;
}