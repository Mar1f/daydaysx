package com.mar.springbootinit.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mar.springbootinit.model.entity.ShoppingCart;
import com.mar.springbootinit.service.ShoppingCartService;
import com.mar.springbootinit.mapper.ShoppingCartMapper;
import org.springframework.stereotype.Service;

/**
* @author mar1
* @description 针对表【shopping_cart(购物车)】的数据库操作Service实现
* @createDate 2024-10-11 11:34:58
*/
@Service
public class ShoppingCartServiceImpl extends ServiceImpl<ShoppingCartMapper, ShoppingCart>
    implements ShoppingCartService{

}




