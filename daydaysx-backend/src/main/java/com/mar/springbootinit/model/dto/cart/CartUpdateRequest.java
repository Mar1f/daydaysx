package com.mar.springbootinit.model.dto.cart;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 编辑请求
 *
 */
@Data
public class CartUpdateRequest implements Serializable {

    /**
     * id
     */
    private Long id;
    /**
     * 购买数量
     */
    private String BuysNum;


    /**
     * 标签列表（json 数组）
     */
    private List<String> tags;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}