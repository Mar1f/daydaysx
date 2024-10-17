package com.mar.springbootinit.utils;

import cn.hutool.extra.qrcode.QrCodeUtil;
import cn.hutool.extra.qrcode.QrConfig;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

import java.awt.*;
import java.io.File;

/**
 * @description；
 * @author:mar1
 * @data:2024/10/13
 **/
public class CodeUtil {
    public static void main(String[] args) {
        QrConfig config = new QrConfig(500, 500);
        config.setErrorCorrection(ErrorCorrectionLevel.H);
        config.setWidth(500);
        config.setHeight(500);
        QrCodeUtil.generate("http://www.baidu.com", 300, 300, new File("F:\\java\\code\\daydaysx\\daydaysx-backend\\doc\\qrcode.png"));
    }
}
