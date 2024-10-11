package com.mar.springbootinit.model.vo;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.mar.springbootinit.model.entity.Cart;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.GoodsOrder;
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
public class CartVO implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 商品id
     */
    private Long goodsId;

    /**
     * 介绍
     */
    private String content;

    /**
     * 名字
     */
    private String title;

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
    private BigDecimal goodsPrice;

    /**
     * 总价格
     */
    private BigDecimal price;

    /**
     * 购买数量
     */
    private Integer buysNum;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
    
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
    /**
     * 对应商品信息
     */
    private GoodsVO goodsVO;


    /**
     * 包装类转对象
     *
     * @param cartVO
     * @return
     */
    public static Cart voToObj(CartVO cartVO) {
        if (cartVO == null) {
            return null;
        }
        Cart cart = new Cart();
        BeanUtils.copyProperties(cartVO, cart);
        List<String> tagList = cartVO.getTags();
        if (tagList != null) {
            cart.setTags(JSONUtil.toJsonStr(tagList));
        }
        return cart;
    }

    /**
     * 对象转包装类
     *
     * @param cart
     * @return
     */
    public static CartVO objToVo(Cart cart) {
        if (cart == null) {
            return null;
        }
        CartVO cartVO = new CartVO();
        BeanUtils.copyProperties(cart, cartVO);
        List<String> tagList = JSONUtil.toList(cart.getTags(), String.class);
        cartVO.setTags(tagList);
        return cartVO;
    }
}
