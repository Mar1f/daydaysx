package com.mar.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 商品
 * @TableName goods
 */
@TableName(value ="goods")
@Data
public class Goods implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
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
    private String tags;

    /**
     * 价格
     */
    private BigDecimal price;

    /**
     * 库存
     */
    private Integer goodsNum;

    /**
     * 货源地址
     */
    private String place;


    /**
     * 购买数
     */
    private Integer buysNum;

    /**
     * 卖家 id
     */
    private Long userId;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除
     */
    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}