package com.mar.springbootinit.manager;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.concurrent.TimeUnit;

import static com.squareup.okhttp.internal.Internal.logger;

/**
 * 多级缓存
 */
@Component
public class CacheManager {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 本地缓存
     */
    Cache<String, Object> localCache = Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .maximumSize(10_000)
            .build();

    /**
     * 写入缓存
     *
     * @param key
     * @param value
     */
    public void put(String key, Object value) {
        logger.info(key);  // 添加日志
        localCache.put(key, value);
        redisTemplate.opsForValue().set(key, value, 5, TimeUnit.MINUTES);
    }

    /**
     * 读缓存
     *
     * @param key
     * @return
     */
    public Object get(String key) {
        logger.info(key);  // 添加日志
        // 先从本地缓存中获取
        Object value = localCache.getIfPresent(key);
        if (value != null) {
            return value;
        }

        // 本地缓存未命中，尝试从 Redis 获取
        value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            // 将 redis 的值写入到本地缓存
            localCache.put(key, value);
        }

        return value;
    }

    /**
     * 删除缓存
     *
     * @param key
     */
    public void delete(String key) {
        logger.info(key);  // 添加日志
        localCache.invalidate(key);
        redisTemplate.delete(key);
    }

}