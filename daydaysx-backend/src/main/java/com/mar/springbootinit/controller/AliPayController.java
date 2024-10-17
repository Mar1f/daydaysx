package com.mar.springbootinit.controller;

import cn.hutool.json.JSONObject;
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.mar.springbootinit.common.AliPayConfig;
import com.mar.springbootinit.model.entity.GoodsOrder;
import com.mar.springbootinit.service.GoodsOrderService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Date;
/**
 * @description；
 * @author:mar1
 * @data:2024/10/13
 **/
@RestController
@RequestMapping("/aliPay")
public class AliPayController {

    private static final String GATEWAY_URL = "https://openapi-sandbox.dl.alipaydev.com/gateway.do";
    private static final String FORMAT = "JSON";
    private static final String CHARSET = "utf-8";
    private static final String SIGN_TYPE = "RSA2";
    @Resource
    private GoodsOrderService goodsOrderService;
    @Resource
    private AliPayConfig aliPayConfig;
    @GetMapping("/pay")
    public void pay(String id, HttpServletResponse httpResponse) throws Exception {
        //查询订单信息
        GoodsOrder goodsOrder = goodsOrderService.getById(id);
        System.out.println("订单id："+id);
        if(goodsOrder == null){
            System.out.println("Order not found for ID: " + id);
            return;
        }else {
        System.out.println("Order details: " + goodsOrder);
        }
        //调用支付宝支付接口
        AlipayClient alipayClient = new DefaultAlipayClient(GATEWAY_URL, aliPayConfig.getAppId(),
                aliPayConfig.getAppPrivateKey(), FORMAT, CHARSET, aliPayConfig.getAlipayPublicKey(), SIGN_TYPE);
        //创建支付请求
        AlipayTradePagePayRequest request = new AlipayTradePagePayRequest();
        request.setNotifyUrl(aliPayConfig.getNotifyUrl());
        JSONObject bizContent = new JSONObject();
        bizContent.set("out_trade_no", goodsOrder.getId());
        bizContent.set("total_amount", goodsOrder.getOrderPrice());
        bizContent.set("subject", goodsOrder.getId());
        bizContent.set("product_code", "FAST_INSTANT_TRADE_PAY");
        request.setBizContent(bizContent.toString());
        request.setReturnUrl("http://localhost:8000/order");//支付完成之后跳转的路径
        //执行操作，拿到响应的结果，返回给浏览器
        String form = "";
        try{
            form = alipayClient.pageExecute(request).getBody();
        } catch (AlipayApiException e){
            e.printStackTrace();
            httpResponse.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "支付宝支付接口调用失败");
        }
        httpResponse.setContentType("text/html;charset=" + CHARSET);
        httpResponse.getWriter().write(form);
        System.out.println("生成的表单: " + form); // 输出生成的表单
        httpResponse.getWriter().flush();
        httpResponse.getWriter().close();
    }


    @PostMapping("/notify")
    public void payNotify(HttpServletRequest request) throws Exception {

        // 检查交易状态是否为 TRADE_SUCCESS
        if (request.getParameter("trade_status").equals("TRADE_SUCCESS")) {
            System.out.println("----支付宝异步回调----");

            Map<String, String> params = new HashMap<>();
            Map<String, String[]> requestParams = request.getParameterMap();

            // 遍历请求参数并将其存储到 params
            for (String name : requestParams.keySet()) {
                params.put(name, request.getParameter(name));
            }

            // 从参数中获取 sign
            String sign = params.get("sign");

            // 打印 sign 以调试
            System.out.println("签名：" + sign);

            // 删除不参与签名校验的字段 sign 和 sign_type
            params.remove("sign");
            params.remove("sign_type");

            // 生成签名内容
            String content = AlipaySignature.getSignContent(params);

            // 调用支付宝工具进行签名校验
            boolean checkSignature = AlipaySignature.rsa256CheckContent(content, sign, aliPayConfig.getAlipayPublicKey(), "UTF-8");

            // 验证签名是否通过
            if (checkSignature) {
                System.out.println("交易名称：" + params.get("subject"));
                System.out.println("交易状态：" + params.get("trade_status"));
                System.out.println("交易号：" + params.get("trade_no"));
                System.out.println("交易金额：" + params.get("total_amount"));
                System.out.println("买家支付宝账号：" + params.get("buyer_logon_id"));
                System.out.println("买家支付时间：" + params.get("gmt_payment"));
                System.out.println("买家付款金额：" + params.get("buyer_pay_amount"));

                // 获取订单号、支付时间等信息
                String tradeNo = params.get("out_trade_no");
                String getPayment = params.get("gmt_payment");
                String alipayTradeNo = params.get("trade_no");

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                try {
                    // 将字符串支付时间转换为 Date 对象
                    Date paymentDate = dateFormat.parse(getPayment);

                    // 获取订单并更新状态为已支付
                    GoodsOrder goodsOrder = goodsOrderService.getById(tradeNo);
                    goodsOrder.setPlaceStatus(1);  // 设置订单状态为已支付
                    goodsOrder.setPayTime(paymentDate);  // 设置支付时间
                    goodsOrder.setAlipay_trade_no(alipayTradeNo);  // 存储支付宝交易号

                    // 保存更新后的订单
                    goodsOrderService.updateById(goodsOrder);
                } catch (Exception e) {
                    e.printStackTrace();  // 捕获解析日期时可能出现的异常
                }
            } else {
                System.out.println("验签失败");
            }
        }
    }

    //处理支付宝回调
}
