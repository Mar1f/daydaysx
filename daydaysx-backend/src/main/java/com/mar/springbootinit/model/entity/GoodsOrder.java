package com.mar.springbootinit.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
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
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 商品名字
     */
    private String title;
    /**
     * 支付宝交易id
     */
    private String alipay_trade_no;
    /**
     * 商品 id
     */
    private Long goodsId;


    /**
     * 买家的id
     */
    private Long userId;
    /**
     * 卖家的id
     */
    private Long sellerId;

    /**
     * 购买数量
     */
    private Integer goodsNum;
    /**
     * 发货地址
     */
    private String startPlace;

    /**
     * 收货地址
     */
    private String arrivePlace;
    /**
     * 订单价格
     */
    private BigDecimal orderPrice;

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
     * 支付时间
     */
    private Date payTime;
    /**
     * 是否删除
     */
    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}