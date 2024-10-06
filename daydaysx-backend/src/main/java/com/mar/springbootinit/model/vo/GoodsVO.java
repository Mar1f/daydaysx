package com.mar.springbootinit.model.vo;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.mar.springbootinit.model.entity.Goods;
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
public class GoodsVO implements Serializable {

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
    private List<String>  tags;

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
     * 创建题目人的信息
     */
    private UserVO userVO;

    /**
     * 包装类转对象
     *
     * @param goodsVO
     * @return
     */
    public static Goods voToObj(GoodsVO goodsVO) {
        if (goodsVO == null) {
            return null;
        }
        Goods goods = new Goods();
        BeanUtils.copyProperties(goodsVO, goods);
        List<String> tagList = goodsVO.getTags();
        if (tagList != null) {
            goods.setTags(JSONUtil.toJsonStr(tagList));
        }
        return goods;
    }

    /**
     * 对象转包装类
     *
     * @param goods
     * @return
     */
    public static GoodsVO objToVo(Goods goods) {
        if (goods == null) {
            return null;
        }
        GoodsVO goodsVO = new GoodsVO();
        BeanUtils.copyProperties(goods, goodsVO);
        List<String> tagList = JSONUtil.toList(goods.getTags(), String.class);
        goodsVO.setTags(tagList);
        return goodsVO;
    }

    private static final long serialVersionUID = 1L;
}
