package com.mar.springbootinit.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mar.springbootinit.common.ErrorCode;
import com.mar.springbootinit.constant.CommonConstant;
import com.mar.springbootinit.exception.BusinessException;
import com.mar.springbootinit.exception.ThrowUtils;
import com.mar.springbootinit.model.dto.cart.CartAddRequest;
import com.mar.springbootinit.model.dto.cart.CartQueryRequest;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderAddRequest;
import com.mar.springbootinit.model.dto.goodsorder.GoodsOrderQueryRequest;
import com.mar.springbootinit.model.entity.Cart;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.GoodsOrder;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.enums.GoodsOrderStatusEnum;
import com.mar.springbootinit.model.vo.CartVO;
import com.mar.springbootinit.model.vo.GoodsOrderVO;
import com.mar.springbootinit.service.CartService;
import com.mar.springbootinit.mapper.CartMapper;
import com.mar.springbootinit.service.GoodsService;
import com.mar.springbootinit.service.UserService;
import com.mar.springbootinit.utils.SqlUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
* @author mar1
* @description 针对表【cart(购物车)】的数据库操作Service实现
* @createDate 2024-10-11 16:27:53
*/
@Service
public class CartServiceImpl extends ServiceImpl<CartMapper, Cart>
    implements CartService{

    @Resource
    private GoodsService goodsService;
    @Resource
    private UserService userService;

    @Override
    public void validCart(Cart goods, boolean add) {
        if (goods == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String title = goods.getTitle();
        String content = goods.getContent();
        String tags = goods.getTags();
        BigDecimal price = goods.getPrice();
        Integer goodsNum = goods.getBuysNum();


        // 创建时，参数不能为空
        if (add) {
            ThrowUtils.throwIf(StringUtils.isAnyBlank(title, content, tags), ErrorCode.PARAMS_ERROR);
        }
        // 有参数则校验
        if (StringUtils.isNotBlank(title) && title.length() > 80) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标题过长");
        }
        if (StringUtils.isNotBlank(content) && content.length() > 8192) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "内容过长");
        }
        if(price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "价格不能为空");
        }
        if (goodsNum == null || goodsNum < 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "商品数量不能为空");
        }
    }
    /**
     * 订单
     *
     * @param cartAddRequest
     * @param loginUser
     * @return
     */
    @Override
    public long doCart(CartAddRequest cartAddRequest, User loginUser) {
        long goodsId = cartAddRequest.getGoodsId();
        // 判断是否存在
        Goods goods = goodsService.getById(goodsId);
        if (goods == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        // 是否已已下单
        long userId = loginUser.getId();
        // 每个用户串行订单
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setGoodsId(goodsId);
        cart.setContent(goods.getContent());
        cart.setTitle(goods.getTitle());
        cart.setGoodsPic(goods.getGoodsPic());
        cart.setTags(goods.getTags());
        cart.setGoodsPrice(goods.getPrice());
        cart.setBuysNum(cartAddRequest.getBuysNum());
        BigDecimal goodsNum = BigDecimal.valueOf(cartAddRequest.getBuysNum());
        BigDecimal price = goods.getPrice();
        BigDecimal totalPrice = goodsNum.multiply(price);
// 设置订单价格
        cart.setPrice(totalPrice);
        boolean save = this.save(cart);
        if(!save ){
            throw new BusinessException(ErrorCode.SYSTEM_ERROR,"订单下单失败");
        }
        return cart.getGoodsId();
    }


    /**
     * 获取查询包装类（用户根据哪些字段查询，根据前端传来的请求对象，得到 mybatis 框架支持的查询 QueryWrapper 类）
     *
     * @param cartQueryRequest
     * @return
     */
    @Override
    public QueryWrapper<Cart> getQueryWrapper(CartQueryRequest cartQueryRequest) {
        QueryWrapper<Cart> queryWrapper = new QueryWrapper<>();
        if (cartQueryRequest == null) {
            return queryWrapper;
        }
        Long goodsId = cartQueryRequest.getGoodsId();
        Long userId = cartQueryRequest.getUserId();

        String title = cartQueryRequest.getTitle();
        List<String> tags = cartQueryRequest.getTags();
        String sortField = cartQueryRequest.getSortField();
        String sortOrder = cartQueryRequest.getSortOrder();
        queryWrapper.like(StringUtils.isNotBlank(title), "title", title);
        // 拼接查询条件
        queryWrapper.eq(ObjectUtils.isNotEmpty(userId), "userId", userId);
        queryWrapper.eq(ObjectUtils.isNotEmpty(goodsId), "goodsId", goodsId);
        if (CollUtil.isNotEmpty(tags)) {
            for (String tag : tags) {
                queryWrapper.like("tags", "\"" + tag + "\"");
            }
        }
        queryWrapper.eq("isDelete", false);
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        return queryWrapper;
    }

    @Override
    public CartVO getCartVO(Cart cart, User loginUser) {
        CartVO cartVO = CartVO.objToVo(cart);
        // 脱敏：仅本人和管理员能看见自己（提交 userId 和登录用户 id 不同）提交的代码
        long userId = loginUser.getId();
        // 处理脱敏
        if (userId != cart.getUserId() && !userService.isAdmin(loginUser)) {
            cartVO.getUserId();
            cartVO.getGoodsId();
        }
        return cartVO;
    }

    @Override
    public Page<CartVO> getCartVOPage(Page<Cart> cartPage, User loginUser) {
        List<Cart> cartList = cartPage.getRecords();
        Page<CartVO> cartVOPage = new Page<>(cartPage.getCurrent(), cartPage.getSize(), cartPage.getTotal());
        if (CollectionUtils.isEmpty(cartList)) {
            return cartVOPage;
        }
        List<CartVO> cartVOList = cartList.stream()
                .map(cart -> getCartVO(cart, loginUser))
                .collect(Collectors.toList());
        cartVOPage.setRecords(cartVOList);
        return cartVOPage;
    }


}




