package com.mar.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 订单
 * @TableName goods_order
 */
@TableName(value ="goods_order")
@Data
public class GoodsOrder implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 商品 id
     */
    private Long goodsId;

    /**
     * 订单 id
     */
    private Long orderId;

    /**
     * 买家的id
     */
    private Long userId;

    /**
     * 购买数量
     */
    private Integer goodsNum;

    /**
     * 收货地址
     */
    private String place;

    /**
     * 订单状态 0-待发货，1-配送中 2-已送达 3-退货中
     */
    private Integer placeStatus;

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