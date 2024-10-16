declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseGoodsVO_ = {
    code?: number;
    data?: GoodsVO;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageCartVO_ = {
    code?: number;
    data?: PageCartVO_;
    message?: string;
  };

  type BaseResponsePageGoods_ = {
    code?: number;
    data?: PageGoods_;
    message?: string;
  };

  type BaseResponsePageGoodsOrderVO_ = {
    code?: number;
    data?: PageGoodsOrderVO_;
    message?: string;
  };

  type BaseResponsePageGoodsVO_ = {
    code?: number;
    data?: PageGoodsVO_;
    message?: string;
  };

  type BaseResponsePagePost_ = {
    code?: number;
    data?: PagePost_;
    message?: string;
  };

  type BaseResponsePagePostVO_ = {
    code?: number;
    data?: PagePostVO_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponsePostVO_ = {
    code?: number;
    data?: PostVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type CartAddRequest = {
    buysNum?: number;
    goodsId?: number;
    goodsPrice?: number;
  };

  type CartEditRequest = {
    buysNum?: string;
    id?: number;
  };

  type CartQueryRequest = {
    buysNum?: string;
    current?: number;
    goodsId?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type CartUpdateRequest = {
    buysNum?: string;
    id?: number;
    tags?: string[];
  };

  type CartVO = {
    buysNum?: number;
    content?: string;
    createTime?: string;
    goodsId?: number;
    goodsPic?: string;
    goodsPrice?: number;
    goodsVO?: GoodsVO;
    id?: number;
    price?: number;
    tags?: string[];
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type deleteCacheUsingDELETEParams = {
    /** key */
    key: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type getGoodsVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getPostVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type Goods = {
    buysNum?: number;
    content?: string;
    createTime?: string;
    goodsNum?: number;
    goodsPic?: string;
    id?: number;
    isDelete?: number;
    place?: string;
    price?: number;
    tags?: string;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type GoodsAddRequest = {
    content?: string;
    goodsNum?: number;
    goodsPic?: string;
    place?: string;
    price?: number;
    tags?: string[];
    title?: string;
  };

  type GoodsEditRequest = {
    content?: string;
    goodsNum?: number;
    goodsPic?: string;
    id?: number;
    place?: string;
    price?: number;
    tags?: string[];
    title?: string;
  };

  type GoodsOrderAddRequest = {
    goodsId?: number;
    goodsNum?: number;
    goodsPrice?: number;
  };

  type GoodsOrderQueryRequest = {
    current?: number;
    id?: number;
    pageSize?: number;
    placeStatus?: number;
    sellerId?: number;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    userId?: number;
  };

  type GoodsOrderVO = {
    arrivePlace?: string;
    createTime?: string;
    goodsId?: number;
    goodsNum?: number;
    goodsVO?: GoodsVO;
    id?: number;
    orderPrice?: number;
    payTime?: string;
    placeStatus?: number;
    sellerId?: number;
    startPlace?: string;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type GoodsQueryRequest = {
    buysNum?: number;
    content?: string;
    current?: number;
    goodsNum?: number;
    id?: number;
    minBuysNum?: number;
    number?: number;
    pageSize?: number;
    place?: string;
    price?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type GoodsUpdateRequest = {
    content?: string;
    goodsPic?: string;
    id?: number;
    number?: number;
    place?: string;
    price?: number;
    tags?: string[];
    title?: string;
  };

  type GoodsVO = {
    buysNum?: number;
    content?: string;
    createTime?: string;
    goodsNum?: number;
    goodsPic?: string;
    id?: number;
    place?: string;
    price?: number;
    tags?: string[];
    title?: string;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type LoginUserVO = {
    createTime?: string;
    id?: number;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageCartVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: CartVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageGoods_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Goods[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageGoodsOrderVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: GoodsOrderVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageGoodsVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: GoodsVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePost_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Post[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePostVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: PostVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type payUsingGETParams = {
    /** id */
    id?: string;
  };

  type Post = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    tags?: string;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type PostAddRequest = {
    content?: string;
    tags?: string[];
    title?: string;
  };

  type PostEditRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostFavourAddRequest = {
    postId?: number;
  };

  type PostFavourQueryRequest = {
    current?: number;
    pageSize?: number;
    postQueryRequest?: PostQueryRequest;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type PostQueryRequest = {
    content?: string;
    current?: number;
    favourUserId?: number;
    id?: number;
    notId?: number;
    orTags?: string[];
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type PostThumbAddRequest = {
    postId?: number;
  };

  type PostUpdateRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostVO = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    tagList?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type updateOrderStatusUsingPOSTParams = {
    /** newStatus */
    newStatus: number;
    /** orderId */
    orderId: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userPlace?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    userAvatar?: string;
    userName?: string;
    userPlace?: string;
    userProfile?: string;
    userRole?: string;
  };
}
