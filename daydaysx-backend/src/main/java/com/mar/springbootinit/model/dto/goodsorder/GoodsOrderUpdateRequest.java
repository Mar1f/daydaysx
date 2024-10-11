package com.mar.springbootinit.model.dto.goodsorder;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serializable;

/**
 * 编辑请求
 *
 */
@Data
public class GoodsOrderUpdateRequest implements Serializable {

    /**
     * id
     */
    private Long id;
    /**
     * 收货地址
     */
    private String arrivePlace;


    /**
     * 订单状态 0-待发货，1-配送中 2-已送达 3-退货中
     */
    private Integer placeStatus;


    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}