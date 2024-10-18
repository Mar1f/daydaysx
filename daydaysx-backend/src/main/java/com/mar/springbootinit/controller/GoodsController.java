package com.mar.springbootinit.controller;

import cn.hutool.core.codec.Base64Encoder;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mar.springbootinit.annotation.AuthCheck;
import com.mar.springbootinit.common.BaseResponse;
import com.mar.springbootinit.common.DeleteRequest;
import com.mar.springbootinit.common.ErrorCode;
import com.mar.springbootinit.common.ResultUtils;
import com.mar.springbootinit.constant.UserConstant;
import com.mar.springbootinit.exception.BusinessException;
import com.mar.springbootinit.exception.ThrowUtils;
import com.mar.springbootinit.manager.CacheManager;
import com.mar.springbootinit.model.dto.goods.GoodsAddRequest;
import com.mar.springbootinit.model.dto.goods.GoodsEditRequest;
import com.mar.springbootinit.model.dto.goods.GoodsQueryRequest;
import com.mar.springbootinit.model.dto.goods.GoodsUpdateRequest;
import com.mar.springbootinit.model.entity.Goods;
import com.mar.springbootinit.model.entity.User;
import com.mar.springbootinit.model.vo.GoodsVO;
import com.mar.springbootinit.service.GoodsService;
import com.mar.springbootinit.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.List;

/**
 * 帖子接口
 *
 */
@RestController
@RequestMapping("/goods")
@Slf4j
public class GoodsController {

    @Resource
    private GoodsService goodsService;

    @Resource
    private UserService userService;
    @Resource
    private CacheManager cacheManager;
    // region 增删改查

    /**
     * 创建
     *
     * @param goodsAddRequest
     * @param request
     * @return
     */
    @PostMapping("/add")
    public BaseResponse<Long> addGoods(@RequestBody GoodsAddRequest goodsAddRequest, HttpServletRequest request) {
        if (goodsAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Goods goods = new Goods();
        BeanUtils.copyProperties(goodsAddRequest, goods);
        List<String> tags = goodsAddRequest.getTags();
        if (tags != null) {
            goods.setTags(JSONUtil.toJsonStr(tags));
        }
        if(goodsAddRequest.getTitle() != null){
            goods.setTitle(JSONUtil.toJsonStr(goodsAddRequest.getTitle()));
        }
        if(goodsAddRequest.getContent() != null){
            goods.setContent(JSONUtil.toJsonStr(goodsAddRequest.getContent()));
        }
        String goodsPic = goodsAddRequest.getGoodsPic();
        if(goodsPic != null){
            goods.setGoodsPic(JSONUtil.toJsonStr(goodsPic));
        }
        BigDecimal price = goodsAddRequest.getPrice();
        if(price != null){
            goods.setGoodsPic(JSONUtil.toJsonStr(goodsPic));
        }
        String place = goodsAddRequest.getPlace();
        if(place != null){
            goods.setPlace(place);
        }
        Integer goodsNum = goodsAddRequest.getGoodsNum();
        if(goodsNum != null){
            goods.setGoodsNum(goodsNum);
        }
        goodsService.validGoods(goods, true);
        User loginUser = userService.getLoginUser(request);
        goods.setUserId(loginUser.getId());
        boolean result = goodsService.save(goods);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        long newGoodsId = goods.getId();
        return ResultUtils.success(newGoodsId);
    }
    /**
     * 快速分页获取列表（封装类）
     *
     * @param goodsQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/list/page/vo/fast")
    public BaseResponse<Page<GoodsVO>> listGoodsVOByPageFast(@RequestBody GoodsQueryRequest goodsQueryRequest,
                                                                     HttpServletRequest request) {
        long current = goodsQueryRequest.getCurrent();
        long size = goodsQueryRequest.getPageSize();
        // 优先从缓存读取
        String cacheKey = getPageCacheKey(goodsQueryRequest);
        Object cacheValue = cacheManager.get(cacheKey);
        if (cacheValue != null) {
            return ResultUtils.success((Page<GoodsVO>) cacheValue);
        }

        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        QueryWrapper<Goods> queryWrapper = goodsService.getQueryWrapper(goodsQueryRequest);
        queryWrapper.select("id",
                "title",
                "content",
                "tags",
                "goodsPic",
                "price",
                "userId",
                "goodsNum",
                "place",
                "buysNum",
                "createTime",
                "updateTime"
        );
        // 添加销量过滤逻辑
        if (goodsQueryRequest.getMinBuysNum() != null) {
            queryWrapper.ge("buysNum", goodsQueryRequest.getMinBuysNum());
        }
        Page<Goods> goodsPage = goodsService.page(new Page<>(current, size), queryWrapper);
        Page<GoodsVO> goodsVOPage = goodsService.getGoodsVOPage(goodsPage, request);
        // 写入缓存
        cacheManager.put(cacheKey, goodsVOPage);
        return ResultUtils.success(goodsVOPage);
    }
    /**
     * 获取分页缓存 keu
     *
     * @param goodsQueryRequest
     * @return
     */
    public static String getPageCacheKey(GoodsQueryRequest goodsQueryRequest) {
        String jsonStr = JSONUtil.toJsonStr(goodsQueryRequest);
        // 请求参数编码
        String base64 = Base64Encoder.encode(jsonStr);
        String key = "goods:page:" + base64;
        // 打印缓存键
        System.out.println("Generated Cache Key: " + key);
        return key;
    }
    /**
     * 删除
     *
     * @param deleteRequest
     * @param request
     * @return
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteGoods(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getLoginUser(request);
        long id = deleteRequest.getId();
        // 判断是否存在
        Goods oldGoods = goodsService.getById(id);
        ThrowUtils.throwIf(oldGoods == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可删除
        if (!oldGoods.getUserId().equals(user.getId()) && !userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean b = goodsService.removeById(id);
        return ResultUtils.success(b);
    }

    /**
     * 更新（仅管理员）
     *
     * @param goodsUpdateRequest
     * @return
     */
    @PostMapping("/update")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Boolean> updateGoods(@RequestBody GoodsUpdateRequest goodsUpdateRequest) {
        if (goodsUpdateRequest == null || goodsUpdateRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Goods goods = new Goods();
        BeanUtils.copyProperties(goodsUpdateRequest, goods);
        List<String> tags = goodsUpdateRequest.getTags();
        if (tags != null) {
            goods.setTags(JSONUtil.toJsonStr(tags));
        }
        // 参数校验
        goodsService.validGoods(goods, false);
        long id = goodsUpdateRequest.getId();
        // 判断是否存在
        Goods oldGoods = goodsService.getById(id);
        ThrowUtils.throwIf(oldGoods == null, ErrorCode.NOT_FOUND_ERROR);
        boolean result = goodsService.updateById(goods);
        return ResultUtils.success(result);
    }

    /**
     * 根据 id 获取
     *
     * @param id
     * @return
     */
    @GetMapping("/get/vo")
    public BaseResponse<GoodsVO> getGoodsVOById(long id, HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Goods goods = goodsService.getById(id);
        if (goods == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        return ResultUtils.success(goodsService.getGoodsVO(goods, request));
    }

    /**
     * 分页获取列表（仅管理员）
     *
     * @param goodsQueryRequest
     * @return
     */
    @PostMapping("/list/page")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Page<Goods>> listGoodsByPage(@RequestBody GoodsQueryRequest goodsQueryRequest) {
        long current = goodsQueryRequest.getCurrent();
        long size = goodsQueryRequest.getPageSize();
        Page<Goods> goodsPage = goodsService.page(new Page<>(current, size),
                goodsService.getQueryWrapper(goodsQueryRequest));
        return ResultUtils.success(goodsPage);
    }

    /**
     * 分页获取列表（封装类）
     *
     * @param goodsQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/list/page/vo")
    public BaseResponse<Page<GoodsVO>> listGoodsVOByPage(@RequestBody GoodsQueryRequest goodsQueryRequest,
            HttpServletRequest request) {
        long current = goodsQueryRequest.getCurrent();
        long size = goodsQueryRequest.getPageSize();
        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        Page<Goods> goodsPage = goodsService.page(new Page<>(current, size),
                goodsService.getQueryWrapper(goodsQueryRequest));
        return ResultUtils.success(goodsService.getGoodsVOPage(goodsPage, request));
    }

    /**
     * 分页获取当前用户创建的资源列表
     *
     * @param goodsQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/my/list/page/vo")
    public BaseResponse<Page<GoodsVO>> listMyGoodsVOByPage(@RequestBody GoodsQueryRequest goodsQueryRequest,
            HttpServletRequest request) {
        if (goodsQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        goodsQueryRequest.setUserId(loginUser.getId());
        long current = goodsQueryRequest.getCurrent();
        long size = goodsQueryRequest.getPageSize();
        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        Page<Goods> goodsPage = goodsService.page(new Page<>(current, size),
                goodsService.getQueryWrapper(goodsQueryRequest));
        return ResultUtils.success(goodsService.getGoodsVOPage(goodsPage, request));
    }

    // endregion


    /**
     * 编辑（用户）
     *
     * @param goodsEditRequest
     * @param request
     * @return
     */
    @PostMapping("/edit")
    public BaseResponse<Boolean> editGoods(@RequestBody GoodsEditRequest goodsEditRequest, HttpServletRequest request) {
        if (goodsEditRequest == null || goodsEditRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Goods goods = new Goods();
        BeanUtils.copyProperties(goodsEditRequest, goods);
        List<String> tags = goodsEditRequest.getTags();
        if (tags != null) {
            goods.setTags(JSONUtil.toJsonStr(tags));
        }
        // 参数校验
        goodsService.validGoods(goods, false);
        User loginUser = userService.getLoginUser(request);
        long id = goodsEditRequest.getId();
        // 判断是否存在
        Goods oldGoods = goodsService.getById(id);
        ThrowUtils.throwIf(oldGoods == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可编辑
        if (!oldGoods.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean result = goodsService.updateById(goods);
        return ResultUtils.success(result);
    }

}
