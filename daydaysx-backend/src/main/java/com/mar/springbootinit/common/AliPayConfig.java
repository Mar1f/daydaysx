package com.mar.springbootinit.common;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @description；
 * @author:mar1
 * @data:2024/10/13
 **/
@Component
@ConfigurationProperties(prefix = "alipay")
public class AliPayConfig {
    //支付宝appId
    private String appId;
    //应用私钥
    private String appPrivateKey;
    //支付宝公钥
    private String alipayPublicKey;
    //支付宝通知本地的接口完整地址
    private String notifyUrl;

    public String getAppId() {
        return appId;
    }
    public void setAppId(String appId) {
        this.appId = appId;
    }
    public String getAppPrivateKey (){
        return appPrivateKey;
    }
    public void setAppPrivateKey(String appPrivateKey) {
        this.appPrivateKey = appPrivateKey;
    }
    public String getAlipayPublicKey() {
        return alipayPublicKey;
    }
    public void setAlipayPublicKey(String alipayPublicKey) {
        this.alipayPublicKey = alipayPublicKey;
    }
    public String getNotifyUrl() {
        return notifyUrl;
    }
    public void setNotifyUrl(String notifyUrl) {
        this.notifyUrl = notifyUrl;
    }
}
