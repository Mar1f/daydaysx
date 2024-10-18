package com.mar.springbootinit.controller;

import com.mar.springbootinit.manager.CacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Set;
/**
 * @description；
 * @author:mar1
 * @data:2024/10/17
 **/


/**
 * 缓存管理控制器
 */
@RestController
public class CacheController {

    @Resource
    private CacheManager cacheManager;

    /**
     * 手动删除缓存
     *
     * @param key 缓存键
     * @return 删除结果
     */
    @DeleteMapping("/cache")
    public String deleteCache(@RequestParam String key) {
        cacheManager.delete(key);
        return "缓存删除成功: " + key;
    }
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/cache/keys")
    public Set<String> getAllCacheKeys() {
        return redisTemplate.keys("*");
    }
}
