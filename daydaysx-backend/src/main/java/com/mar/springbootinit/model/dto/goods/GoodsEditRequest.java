package com.mar.springbootinit.model.dto.goods;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 编辑请求
 *
 */
@Data
public class GoodsEditRequest implements Serializable {

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
    private Integer goodsNum;

    private static final long serialVersionUID = 1L;
}