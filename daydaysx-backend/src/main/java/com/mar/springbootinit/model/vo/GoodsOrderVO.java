package com.mar.springbootinit.model.vo;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.GoodsOrder;
import com.mar.springbootinit.model.entity.Post;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 帖子视图
 *
 */
@Data
public class GoodsOrderVO implements Serializable {
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
     * 对应商品信息
     */
    private GoodsVO goodsVO;

    /**
     * 包装类转对象
     *
     * @param goodsOrderVO
     * @return
     */
    public static GoodsOrder voToObj(GoodsOrderVO goodsOrderVO) {
        if (goodsOrderVO == null) {
            return null;
        }
        GoodsOrder goodsOrder = new GoodsOrder();
        BeanUtils.copyProperties(goodsOrderVO, goodsOrder);
        return goodsOrder;
    }

    /**
     * 对象转包装类
     *
     * @param goodsOrder
     * @return
     */
    public static GoodsOrderVO objToVo(GoodsOrder goodsOrder) {
        if (goodsOrder == null) {
            return null;
        }
        GoodsOrderVO goodsOrderVO = new GoodsOrderVO();
        BeanUtils.copyProperties(goodsOrder, goodsOrderVO);
        return goodsOrderVO;
    }

    private static final long serialVersionUID = 1L;
}
