package com.mar.springbootinit.model.dto.goods;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.mar.springbootinit.common.PageRequest;
import com.mar.springbootinit.model.vo.UserVO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 查询请求
 *
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class GoodsQueryRequest extends PageRequest implements Serializable {

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
     * 标签列表（json 数组）
     */
    private List<String>  tags;
    /**
     * 搜索词
     */
    private String searchText;
    /**
     * 价格
     */
    private BigDecimal price;

    /**
     * 销量
     */
    private Integer goodsNum;

    /**
     * 货源地址
     */
    private String place;

    /**
     * 库存
     */
    private Integer number;

    /**
     * 购买数
     */
    private Integer buysNum;

    /**
     * 卖家 id
     */
    private Long userId;
    private static final long serialVersionUID = 1L;

}