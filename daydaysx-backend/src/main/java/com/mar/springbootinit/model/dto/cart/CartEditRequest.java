package com.mar.springbootinit.model.dto.cart;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

import java.io.Serializable;

/**
 * 编辑请求
 *
 */
@Data
public class CartEditRequest implements Serializable {

    /**
     * id
     */
    private Long id;
    /**
     * 购买数量
     */
    private String BuysNum;


    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}