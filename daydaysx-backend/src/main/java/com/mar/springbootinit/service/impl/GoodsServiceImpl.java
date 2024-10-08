package com.mar.springbootinit.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mar.springbootinit.common.ErrorCode;
import com.mar.springbootinit.constant.CommonConstant;
import com.mar.springbootinit.exception.BusinessException;
import com.mar.springbootinit.exception.ThrowUtils;
import com.mar.springbootinit.model.dto.goods.GoodsQueryRequest;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.vo.GoodsVO;
import com.mar.springbootinit.model.vo.UserVO;
import com.mar.springbootinit.service.UserService;
import com.mar.springbootinit.utils.SqlUtils;
import com.mar.springbootinit.service.GoodsService;
import com.mar.springbootinit.mapper.GoodsMapper;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.sort.SortBuilder;
import org.elasticsearch.search.sort.SortBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
* @author mar1
* @description 针对表【goods(商品)】的数据库操作Service实现
* @createDate 2024-10-06 11:34:05
*/
@Service
public class GoodsServiceImpl extends ServiceImpl<GoodsMapper, Goods>
    implements GoodsService{

    @Resource
    private UserService userService;

    @Override
    public void validGoods(Goods goods, boolean add) {
        if (goods == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String title = goods.getTitle();
        String content = goods.getContent();
        String tags = goods.getTags();
        BigDecimal price = goods.getPrice();
        Integer goodsNum = goods.getGoodsNum();


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
     * 获取查询包装类
     *
     * @param goodsQueryRequest
     * @return
     */
    @Override
    public QueryWrapper<Goods> getQueryWrapper(GoodsQueryRequest goodsQueryRequest) {
        QueryWrapper<Goods> queryWrapper = new QueryWrapper<>();
        if (goodsQueryRequest == null) {
            return queryWrapper;
        }
        Long id = goodsQueryRequest.getId();
        String title = goodsQueryRequest.getTitle();
        String content = goodsQueryRequest.getContent();
        List<String> tags = goodsQueryRequest.getTags();
        BigDecimal price = goodsQueryRequest.getPrice();
        String searchText = goodsQueryRequest.getSearchText();
        String place = goodsQueryRequest.getPlace();
        Long userId = goodsQueryRequest.getUserId();
        String sortField = goodsQueryRequest.getSortField();
        String sortOrder = goodsQueryRequest.getSortOrder();
        if (StringUtils.isNotBlank(searchText)) {
            queryWrapper.and(qw -> qw.like("title", searchText).or().like("content", searchText));
        }
        // 拼接查询条件
        queryWrapper.like(StringUtils.isNotBlank(title), "title", title);
        queryWrapper.like(StringUtils.isNotBlank(content), "content", content);
        queryWrapper.like(StringUtils.isNotBlank((CharSequence) price), "price", price);
        queryWrapper.like(StringUtils.isNotBlank(place), "place", place);

        if (CollUtil.isNotEmpty(tags)) {
            for (String tag : tags) {
                queryWrapper.like("tags", "\"" + tag + "\"");
            }
        }
        queryWrapper.eq(ObjectUtils.isNotEmpty(id), "id", id);
        queryWrapper.eq(ObjectUtils.isNotEmpty(userId), "userId", userId);
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        return queryWrapper;
    }

    @Override
    public GoodsVO getGoodsVO(Goods goods, HttpServletRequest request) {
        GoodsVO goodsVO = GoodsVO.objToVo(goods);
        // 1. 关联查询用户信息
        Long userId = goods.getUserId();
        User user = null;
        if (userId != null && userId > 0) {
            user = userService.getById(userId);
        }
        UserVO userVO = userService.getUserVO(user);
        goodsVO.setUserVO(userVO);
        return goodsVO;
    }

    @Override
    public Page<GoodsVO> getGoodsVOPage(Page<Goods> goodsPage, HttpServletRequest request) {
        List<Goods> goodsList = goodsPage.getRecords();
        Page<GoodsVO> goodsVOPage = new Page<>(goodsPage.getCurrent(), goodsPage.getSize(), goodsPage.getTotal());
        if (CollUtil.isEmpty(goodsList)) {
            return goodsVOPage;
        }
        // 1. 关联查询用户信息
        Set<Long> userIdSet = goodsList.stream().map(Goods::getUserId).collect(Collectors.toSet());
        Map<Long, List<User>> userIdUserListMap = userService.listByIds(userIdSet).stream()
                .collect(Collectors.groupingBy(User::getId));

        // 填充信息
        List<GoodsVO> goodsVOList = goodsList.stream().map(goods -> {
            GoodsVO goodsVO = GoodsVO.objToVo(goods);
            Long userId = goods.getUserId();
            User user = null;
            if (userIdUserListMap.containsKey(userId)) {
                user = userIdUserListMap.get(userId).get(0);
            }
            goodsVO.setUserVO(userService.getUserVO(user)) ;
            return goodsVO;
        }).collect(Collectors.toList());
        goodsVOPage.setRecords(goodsVOList);
        return goodsVOPage;
    }
}




