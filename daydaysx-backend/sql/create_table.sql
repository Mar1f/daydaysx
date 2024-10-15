# 数据库初始化

-- 创建库
create database if not exists ttsx_db;

-- 切换库
use ttsx_db;

-- 用户表
create table if not exists user
(
    id           bigint auto_increment comment 'id' primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    userPlace    varchar(256)                           null comment '收货地址',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除'
    ) comment '用户' collate = utf8mb4_unicode_ci;


-- 产品表
create table if not exists goods
(
    id         bigint auto_increment comment 'id' primary key,
    title      varchar(512)                       null comment '标题',
    content    text                               null comment '介绍',
    goodsPic   varchar(1024)                      null comment '商品照片',
    tags       varchar(1024)                      null comment '标签列表（json 数组）',
    price     decimal(10, 2) default 0.00        not null comment '价格',
    goodsNum   int      default 0                 not null comment '库存',
    place     varchar(256)                       null comment '货源地址',
    buysNum    int      default 0                 not null comment '购买数',
    userId     bigint                             not null comment '卖家 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_userId (userId)
    ) comment '商品' collate = utf8mb4_unicode_ci;

-- 商品订单表
create table if not exists goods_order
(
    id         bigint auto_increment comment 'id' primary key,
    alipay_trade_no varchar(256)                       null comment '支付宝交易号',
    goodsId     bigint                             not null comment '商品 id',
    userId    bigint                             not null comment '买家的id',
    goodsNum   int      default 0                 not null comment '购买数量',
    orderPrice decimal(10, 2) default 0.00        not null comment '订单价格',
    StartPlace varchar(256)                       null comment '发货地址',
    ArrivePlace     varchar(256)                       null comment '收货地址',
    placeStatus  int      default 0                 not null comment '订单状态 0-待发货，1-配送中 2-已送达 3-退货中',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    payTime datetime default CURRENT_TIMESTAMP not null comment '支付时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_goodsId (goodsId),
    index idx_userId (userId)
) comment '订单';


-- 购物车表
CREATE TABLE IF NOT EXISTS shopping_cart (
     id          BIGINT AUTO_INCREMENT COMMENT 'id' PRIMARY KEY,
     userId      BIGINT NOT NULL COMMENT '用户id',
     goodsId     BIGINT NOT NULL COMMENT '商品id',
     content    text                               null comment '介绍',
     goodsPic   varchar(1024)                      null comment '商品照片',
     tags       varchar(1024)                      null comment '标签列表（json 数组）',
     price     decimal(10, 2) default 0.00        not null comment '价格',
     quantity     INT DEFAULT 1 NOT NULL COMMENT '购买数量',
     createTime  DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
     updateTime  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
     isDelete    TINYINT DEFAULT 0 NOT NULL COMMENT '是否删除',
     INDEX idx_userId (userId),
     INDEX idx_goodsId (goodsId),
     FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
     FOREIGN KEY (goodsId) REFERENCES goods(id) ON DELETE CASCADE
) COMMENT '购物车' COLLATE = utf8mb4_unicode_ci;
