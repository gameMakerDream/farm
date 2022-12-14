var _this;
var landid;//土地Id
var muid;
var yuid;
var yinyue = 1;
var yinxiao = 1;//1开0关
var zhanghao;
var mima;
var ishaoyou = false;
var querenleixing;
var youjiandangqiannum = 1;
var youjianzongnum;
var jianger;
var jiangnum;
var chongzhiid;
var isdonghua = false;
var yitounum;
var beitounum;
var zhongdi;
var zhongziid;
var zhonglejikuai;
var arr_guoshi = [];
var caijinarr = [];
var shanchu;
var tuiguangerweima;
var maijiaerweima1;
var maijiaerweima2;
var chanlei = 1;
var nengzhong = true;
var zimg = "";
var wimg = "";
var ping = "";
var Game = (function (_super) {
    function Game() {
        _this = this;
        this.caijinarr = [];
        Game.super(this);

        //隐藏： 登录box
        this.dl_box.visible = false;
        this.gerenzhongxin_box.getChildByName("金币").getChildAt(0).text = "金币：";
        this.dl_btn.on(Laya.Event.MOUSE_DOWN, this, this.dlfun);//登录
        this.choose.on(Laya.Event.MOUSE_DOWN, this, this.choosefun);//选择账号
        this.bg.on(Laya.Event.MOUSE_DOWN, this, this.chooseguan);//选择账号
        this.dl_box.getChildByName("登录").getChildAt(0).on(Laya.Event.MOUSE_DOWN, this, this.chooseguan);//选择账号
        this.wjmm_btn.on(Laya.Event.MOUSE_DOWN, this, this.wjmmfun);//忘记密码
        this.jzmm_btn.on(Laya.Event.MOUSE_DOWN, this, this.jzmmfun);//记住密码

        //8-3 新增

        //注册会员
        this.ce.on(Laya.Event.MOUSE_DOWN, this, function () {
            console.log(222)
            // this.zhucebox.visible = true;
            window.location.href=web_url+"/register"
        });
        this.zhucebox.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, function () {
            this.zhucebox.visible = false;
        });
        this.zhucebox.getChildByName("发送验证码").on(Laya.Event.MOUSE_DOWN, this, this.fsfun1);//验证码
        this.zhucebox.getChildByName("确定").on(Laya.Event.MOUSE_DOWN, this, function () {
            ajax({
                url: web_url + "/member/register",
                type: 'post',
                data: {
                    account: _this.huishou.text,
                    phone: _this.huishou.text,
                    up_id: user_id,
                    password: _this.huimi.text,
                    nickname: _this.huihao.text,
                    code: _this.huiyan.text,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "注册")
                    _this.tanfun(data.info);
                },
            })
        });



        //重置密码
        this.fs_btn.on(Laya.Event.MOUSE_DOWN, this, this.fsfun);//发送验证码
        this.queding.on(Laya.Event.MOUSE_DOWN, this, this.czmmqdfun);//重置密码确定

        this.dl_box.getChildByName("登录").getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [1]);
        this.dl_box.getChildByName("重置密码").getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [2]);
        this.bb_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [3]);
        this.ck_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [4]);
        this.sd_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [5]);
        this.shuoming_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [6]);
        this.xinfeng_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [7]);
        this.liuyan_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [8]);
        this.gerenzhongxin_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [9]);
        this.jilu_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [10]);
        this.choujiang_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [11]);
        this.qiandao_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [12]);
        this.haoyou_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [13]);
        this.zhuanzhang_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [14]);
        this.chongzhi_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [15]);
        this.duihuan_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [16]);
        this.gaiming_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [17]);
        this.xiaoyouxi_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [18]);
        this.xinfeng_box.getChildByName("详情").getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [19]);
        this.xianshi_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [22]);
        //复制链接
        this.fuzhi.on(Laya.Event.MOUSE_DOWN, this, this.fuzhifun);

        //土地的点击
        for (var i = 0; i < 18; i++) {
            this.land_box.getChildAt(i).on(Laya.Event.CLICK, this, this.dianfun, [i]);//土地的点击
            this.land_box.getChildAt(i).getChildAt(0).visible = false;
            this.land_box.getChildAt(i).landid = i;
        }

 
        //牧场的点击
        for (var i = 0; i < 13; i++) {
            this.mu_box.getChildAt(i).on(Laya.Event.CLICK, this, this.dianfun1, [i]);//土地的点击
            this.mu_box.getChildAt(i).getChildAt(0).visible = false;
            this.mu_box.getChildAt(i).muid = i;
        }
        //渔场的点击
        for (var i = 0; i < 18; i++) {
            this.yu_box.getChildAt(i).on(Laya.Event.CLICK, this, this.dianfun2, [i]);//土地的点击
            this.yu_box.getChildAt(i).getChildAt(0).visible = false;
            this.yu_box.getChildAt(i).yuid = i;
        }
        //点击背景取消选中
        this.bg1.on(Laya.Event.MOUSE_MOVE, this, this.quxiaoxuanzhong);

        // home点击
        this.ck_btn.on(Laya.Event.CLICK, this, this.ckfun);//仓库
        this.sd_btn.on(Laya.Event.CLICK, this, this.sdfun);//商店

        this.ck_box.getChildByName("未选").getChildAt(0).on(Laya.Event.MOUSE_DOWN, this, this.cangkufun, [1]);//打开仓库种子
        this.ck_box.getChildByName("未选").getChildAt(1).on(Laya.Event.MOUSE_DOWN, this, this.cangkufun, [2]);//打开仓库道具
        this.ck_box.getChildByName("未选").getChildAt(2).on(Laya.Event.MOUSE_DOWN, this, this.cangkufun, [3]);//打开仓库果实
        this.cszz_btn.on(Laya.Event.MOUSE_DOWN, this, this.chushouguoshifun);//出售果实

        for (var i = 0; i < 3; i++) {
            this.sd_box.getChildByName("未选").getChildAt(i).on(Laya.Event.MOUSE_DOWN, this, this.shangdianfun, [i + 1])
        }

        this.gz_btn.on(Laya.Event.MOUSE_DOWN, this, this.gzfun);//规则
        this.xf_btn.on(Laya.Event.MOUSE_DOWN, this, this.xffun);//信封
        //左侧菜单隐藏
        this.ly_btn.visible =false;
        this.ma_btn.visible = false;
        this.cj_btn.visible = false;
        this.qd_btn.visible = false;

       // this.ly_btn.on(Laya.Event.MOUSE_DOWN, this, this.lyfun);//留言
        this.sz_btn.on(Laya.Event.MOUSE_DOWN, this, this.szfun);//设置
        this.jl_btn.on(Laya.Event.MOUSE_DOWN, this, this.jlfun);//记录
       // this.ma_btn.on(Laya.Event.MOUSE_DOWN, this, this.mafun);//二维码
       // this.cj_btn.on(Laya.Event.MOUSE_DOWN, this, this.cjfun);//抽奖
        //this.qd_btn.on(Laya.Event.MOUSE_DOWN, this, this.qdfun);//签到
        this.hy_btn.on(Laya.Event.MOUSE_DOWN, this, this.hyfun);//好友
        this.jy_btn.on(Laya.Event.MOUSE_DOWN, this, this.mmfun);//交易打开充值提现
        // this.lb_btn.on(Laya.Event.MOUSE_DOWN, this, this.liebiaofun, [2]);//偷取列表
        this.lb_btn.on(Laya.Event.MOUSE_DOWN, this, this.haoyoufun, [1]);//新偷取列表
        this.yx_btn.on(Laya.Event.MOUSE_DOWN, this, this.yxfun);//小游戏

        this.shouqi.on(Laya.Event.MOUSE_DOWN, this, this.shouqiyouxifun);

        this.fanhui.on(Laya.Event.MOUSE_DOWN, this, this.tuichufun);//退出登录

        for (var i = 0; i < 30; i++) {
            this.qiandao_box.getChildByName("签到了").getChildAt(i).on(Laya.Event.CLICK, this, this.qiandaofun, [i]);//点击签到
        }

        this.fsly_btn.on(Laya.Event.MOUSE_DOWN, this, this.liuyanfun);//发送留言

        this.home.getChildByName("信息栏").on(Laya.Event.MOUSE_DOWN, this, this.szfun);
        //this.home.getChildByName("信息栏").getChildAt(1).visible = false;

        // 记录、偷取、交易
        for (var i = 0; i < 3; i++) {
            this.jilu_box.getChildByName("未选").getChildAt(i).on(Laya.Event.MOUSE_DOWN, this, this.jilufun, [i + 1]);
        }
        //记录头部选择
        for (var i = 0; i < 4; i++) {
            this.head_box.getChildByName("未选").getChildAt(i).on(Laya.Event.MOUSE_DOWN, this, this.jilufunxiangqing, [i + 1])
        }

        // 好友列表的点击
        // for (var i = 0; i < 3; i++) {
        //     this.haoyou_box.getChildByName("未选").getChildAt(i).on(Laya.Event.MOUSE_DOWN, this, this.liebiaofun, [i + 1]);
        // }
        //好友列表头部功能选择
        // for (var i = 0; i < 6; i++) {
        //     this.liebiaohead_box.getChildByName("未选").getChildAt(i).on(Laya.Event.MOUSE_DOWN, this, this.haoyouxiangqing, [i + 1]);
        // }

        this.xianshi_box.getChildByName("确定").on(Laya.Event.MOUSE_DOWN, this, this.tianjiahaoyoufun);//添加好友
        this.xianshi_box.getChildByName("取消").on(Laya.Event.MOUSE_DOWN, this, function () {
            this.xianshi_box.visible = false;
        });

        //选择头像
        for (var i = 0; i < 12; i++) {
            this.tx.getChildAt(i).on(Laya.Event.MOUSE_DOWN, this, this.xuanfun, [i]);
        }

        //音乐音效
        this.yinyue_btn.on(Laya.Event.MOUSE_DOWN, this, this.yinyuefun);
        this.yinxiao_btn.on(Laya.Event.MOUSE_DOWN, this, this.yinxiaofun);

        //编辑绑定
        this.bianji_btn.on(Laya.Event.MOUSE_DOWN, this, this.bianjifun);//编辑
        this.head1.on(Laya.Event.MOUSE_DOWN, this, this.touxiangfun);//选择头像
        this.bangding_btn.on(Laya.Event.MOUSE_DOWN, this, this.bangdingfun);//绑定支付
        this.bangding_qd.on(Laya.Event.MOUSE_DOWN, this, this.querenbangding);//确认绑定
        this.bangding_qx.on(Laya.Event.MOUSE_DOWN, this, this.quxiaobangding);//取消绑定

        this.touxiang_box.getChildByName("确定").on(Laya.Event.MOUSE_DOWN, this, this.xuanzetouxiangfun);

        // 背包点击
        this.bb_btn.on(Laya.Event.MOUSE_DOWN, this, this.bbfun, [1]);//背包
        this.js_btn.on(Laya.Event.MOUSE_DOWN, this, this.jsfun);//浇水
        this.chong_btn.on(Laya.Event.MOUSE_DOWN, this, this.chongfun);//除虫
         //===隐藏： 除草
        //this.cao_btn.visible = false; 
        this.cao_btn.on(Laya.Event.MOUSE_DOWN, this, this.caofun);//除草

        this.chan_btn.on(Laya.Event.MOUSE_DOWN, this, this.chanfun);//铲除
        this.shou_btn.on(Laya.Event.MOUSE_DOWN, this, this.shoufun);//收获
        this.mu_btn.on(Laya.Event.MOUSE_DOWN, this, this.muweifun);//喂食
        this.yu_btn.on(Laya.Event.MOUSE_DOWN, this, this.yuweifun);//喂食



        // 抽奖
        this.choujiang_box.getChildByName("开始").on(Laya.Event.MOUSE_DOWN, this, this.choujiangfun);//开始抽奖

        this.bangding_jieshou.on(Laya.Event.MOUSE_DOWN, this, this.bangdingyanzheng);//修改支付信息获取验证码

        this.zhuanzhang_qd.on(Laya.Event.MOUSE_DOWN, this, this.zhuanzhangfun);//转账

        this.hycx_qd.on(Laya.Event.MOUSE_DOWN, this, this.haoyouchaxun);//好友查询

        this.fanhuijiayuan.on(Laya.Event.MOUSE_DOWN, this, this.fanhuifun);//返回自己土地

        this.zhedie.on(Laya.Event.MOUSE_DOWN, this, this.zhediefun);//折叠

        this.duihuan.on(Laya.Event.MOUSE_DOWN, this, this.duihuanfun);//金币换积分
        this.chongqian.on(Laya.Event.MOUSE_DOWN, this, this.jyfun)//加号打开充值

        this.duihuan_btn.on(Laya.Event.MOUSE_DOWN, this, this.querenduihuan);//兑换接口

        this.chongzhi_box.getChildByName("方式").getChildByName("未选").getChildAt(0).on(Laya.Event.MOUSE_DOWN, this, this.chongzhileixing, [1]);
        this.chongzhi_box.getChildByName("方式").getChildByName("未选").getChildAt(1).on(Laya.Event.MOUSE_DOWN, this, this.chongzhileixing, [2]);

        this.gerenzhongxin_box.getChildByName("未选").getChildAt(0).on(Laya.Event.MOUSE_DOWN, this, this.shezhifun);
        this.gerenzhongxin_box.getChildByName("未选").getChildAt(1).on(Laya.Event.MOUSE_DOWN, this, this.kefufun);
        this.gerenzhongxin_box.getChildByName("未选").getChildAt(2).on(Laya.Event.MOUSE_DOWN, this, this.qunfun);

        // this.yijiantouqu.on(Laya.Event.MOUSE_DOWN, this, this.yijiantoufun);//一键偷取

        this.gm_qd.on(Laya.Event.MOUSE_DOWN, this, this.xiugainicheng);//改昵称

        this.queren.on(Laya.Event.MOUSE_DOWN, this, this.querencaozuo);
        this.quxiao.on(Laya.Event.MOUSE_DOWN, this, this.quxiaocaozuo);//

        this.jilu_box.getChildByName("偷取头部").getChildByName("未选").getChildAt(1).on(Laya.Event.MOUSE_DOWN, this, this.beitouquliebiao);
        this.jilu_box.getChildByName("偷取头部").getChildByName("未选").getChildAt(0).on(Laya.Event.MOUSE_DOWN, this, this.jilufun, [2]);

        // this.jilu_box.getChildByName("交易头部").getChildByName("未选").getChildAt(1).on(Laya.Event.MOUSE_DOWN, this, this.tixianjilu);
        // this.jilu_box.getChildByName("交易头部").getChildByName("未选").getChildAt(0).on(Laya.Event.MOUSE_DOWN, this, this.jilufun, [3]);

        this.wx_tu.on(Laya.Event.MOUSE_DOWN, this, this.tixianfangshi, [1]);
        this.zfb_tu.on(Laya.Event.MOUSE_DOWN, this, this.tixianfangshi, [2]);

        // this.qdtx_btn.on(Laya.Event.MOUSE_DOWN, this, this.tixianfun);

        this.jifen_box.on(Laya.Event.MOUSE_DOWN, this, this.shouqufun);

        //邮件翻页
        this.shang_btn.on(Laya.Event.MOUSE_DOWN, this, this.upfun);
        this.xia_btn.on(Laya.Event.MOUSE_DOWN, this, this.downfun);

        this.shuiguo_btn.on(Laya.Event.MOUSE_DOWN, this, this.shuiguojifun);
        // this.caiquan_btn.on(Laya.Event.MOUSE_DOWN, this, this.caiquanfun);
        //小游戏选择筹码档次
        for (var i = 0; i < 3; i++) {
            this.zhushu.getChildAt(i).on(Laya.Event.MOUSE_DOWN, this, this.xuanzhufun, [i]);
        }
        this.xuan_qd.on(Laya.Event.MOUSE_DOWN, this, this.qianwangcaiquan);
        this.xuan_qx.on(Laya.Event.MOUSE_DOWN, this, this.quxiaocaiquan);

        //== 隐藏：鸟 
        this.niao1.visible = false;

        this.niao1.on(Laya.Event.MOUSE_DOWN, this, this.weiniaofun);
        this.dog.on(Laya.Event.MOUSE_DOWN, this, this.weigoufun);

        this.tianjia_btn.on(Laya.Event.MOUSE_DOWN, this, this.haoyouxinxi);//添加好友显示信息
        this.shenqing_btn.on(Laya.Event.MOUSE_DOWN, this, this.shenqingliebiao);//添加好友显示申请信息
        this.shenqing_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, function () {
            this.shenqing_box.visible = false;
        })

        this.home.getChildByName("彩金记录").getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [20]);
        this.ewm_box.on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [33])
        this.caijin_btn.on(Laya.Event.MOUSE_DOWN, this, this.caijinjilu);

        this.hero.on(Laya.Event.MOUSE_DOWN, this, this.dubaifun);

        this.shouci_box.getChildByName("领取").on(Laya.Event.MOUSE_DOWN, this, this.lingqufun);//领取大礼包
        _this.jiaru_box.getChildByName("确定").on(Laya.Event.MOUSE_DOWN, this, function () {
            _this.jiaru_box.visible = false;
            if (gold_num >= youxinum) {
                window.location.href = web_url + "/caiquan/index.html";
            } else {
                _this.tanfun("您的水果不足无法参与")
            }
        });
        _this.jiaru_box.getChildByName("取消").on(Laya.Event.MOUSE_DOWN, this, function () {
            _this.jiaru_box.visible = false;
        });


        this.list_zhanghao.vScrollBarSkin = "";
        arr_zhanghao = [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
        ]
        // 给list_zhanghao赋值更改list_zhanghao的显示
        _this.list_zhanghao.array = arr_zhanghao;
        _this.list_zhanghao.selectEnable = true;
        _this.list_zhanghao.scrollBar.elasticBackTime = 400;
        _this.list_zhanghao.scrollBar.elasticDistance = 50;
        _this.list_zhanghao.mouseHandler = new Laya.Handler(_this, onMouse_zhanghao);
        function onMouse_zhanghao(e, index) {
            if (e.type == "click") {
                // console.log(index)
            }
        }

        this.list_beibao.hScrollBarSkin = "";

        this.list_cangku.hScrollBarSkin = "";

        this.list_jilu.vScrollBarSkin = "";

        this.list_shop.hScrollBarSkin = "";

        this.list_xinfeng.vScrollBarSkin = "";

        this.list_chongzhi.vScrollBarSkin = "";

        this.list_touxiang.vScrollBarSkin = "";
        arr_touxiang = [
        ]
        // 给list_touxiang赋值更改list_touxiang的显示
        _this.list_touxiang.array = arr_touxiang;
        _this.list_touxiang.selectEnable = true;
        _this.list_touxiang.scrollBar.elasticBackTime = 400;
        _this.list_touxiang.scrollBar.elasticDistance = 50;
        _this.list_touxiang.mouseHandler = new Laya.Handler(_this, onMouse_touxiang);
        function onMouse_touxiang(e, index) {
            if (e.type == "click") {
                // console.log(index)
            }
        }

        _this.shoufuewm_box.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, function () {
            _this.shoufuewm_box.visible = false;
        })

        this.weixin.on(Laya.Event.MOUSE_DOWN, this, function () {
            var os = conchConfig.getOS();
            var bridge;
            var obj = "拍照上传";
            if (os == "Conch-ios") {
                bridge = PlatformClass.createClass("JSBridge");//创建脚步代理
            }
            else if (os == "Conch-android") {
                //需要完整的类路径，注意与iOS的不同
                bridge = PlatformClass.createClass("demo.JSBridge");//创建脚步代理
            }
            if (os == "Conch-ios") {
                bridge.callWithBack(function (value) {
                    // alert(value)
                    // var obj = JSON.parse(value)
                    wimg = value;
                    _this.weixin.skin = wimg;
                }, "testAsyncCallback:", JSON.stringify(obj));
            }
            else if (os == "Conch-android") {
                bridge.callWithBack(function (value) {
                    var obj = JSON.parse(value)
                    wimg = obj.data.url;
                    _this.weixin.skin = wimg;
                }, "testAsyncCallback", JSON.stringify(obj));
            }
        });//上传微信图
        this.zfb.on(Laya.Event.MOUSE_DOWN, this, function () {
            var os = conchConfig.getOS();
            var bridge;
            var obj = "拍照上传";
            if (os == "Conch-ios") {
                bridge = PlatformClass.createClass("JSBridge");//创建脚步代理
            }
            else if (os == "Conch-android") {
                //需要完整的类路径，注意与iOS的不同
                bridge = PlatformClass.createClass("demo.JSBridge");//创建脚步代理
            }
            if (os == "Conch-ios") {
                bridge.callWithBack(function (value) {
                    // var obj = JSON.parse(value)
                    // alert(obj)
                    zimg = value;
                    _this.zfb.skin = zimg;
                }, "testAsyncCallback:", JSON.stringify(obj));
            }
            else if (os == "Conch-android") {
                bridge.callWithBack(function (value) {
                    var obj = JSON.parse(value)
                    zimg = obj.data.url;
                    _this.zfb.skin = zimg;
                }, "testAsyncCallback", JSON.stringify(obj));
            }
        });//上传支付宝图

        this.pp.vScrollBarSkin = "";
        this.list_haoyou.vScrollBarSkin = "";

        this.list_pai.vScrollBarSkin = "";

        this.list_shangcheng.vScrollBarSkin = "";

        this.list_dingdan.vScrollBarSkin = "";

        this.list_caijin.vScrollBarSkin = "";

        this.list_shenqing.vScrollBarSkin = "";

        this.list_renwu.vScrollBarSkin = "";

        this.list_maimai.vScrollBarSkin = "";

        this.list_mairu.vScrollBarSkin = "";

        this.pp4.hScrollBarSkin = "";

        // this.game_btn2.visible=false;
        this.game_btn1.on(Laya.Event.CLICK, this, this.xiaoyouxifun, [1]);
        this.game_btn2.on(Laya.Event.CLICK, this, this.xiaoyouxifun, [2]);

        this.chongzhi.visible=false;
        this.chongzhi.on(Laya.Event.CLICK, this, function(){
            this.quchongzhi();
        });
        this.tixian.visible=false;
        this.tixian.on(Laya.Event.CLICK, this, function(){
            alert("提现")
        });

        this.shouchong_btn.on(Laya.Event.CLICK, this, this.shouchongfun);

        this.sc_btn.on(Laya.Event.CLICK, this, this.quchongzhi);//首冲充值

        // 隐藏:排行榜
        this.ph_box.visible = false;
       // this.ph_btn.on(Laya.Event.CLICK, this, this.phfun, [1]);//打开排行榜
        this.rw_btn.on(Laya.Event.CLICK, this, this.rwfun);//打开任务

        for (var i = 0; i < 2; i++) {
            this.renwutype.getChildAt(i).on(Laya.Event.CLICK, this, this.renwufun, [i]);
        }

        //this.ph_box.getChildAt(0).getChildByName("关闭").on(Laya.Event.CLICK, this, this.gbfun, [34]);

        this.renwu_box.getChildAt(0).getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, this.gbfun, [35]);

        this.maimai_box.getChildByName("关闭").on(Laya.Event.CLICK, this, this.gbfun, [36]);

        this.xinhaoyou_box.getChildByName("关闭").on(Laya.Event.CLICK, this, this.gbfun, [37]);

        this.shouchong_box.getChildByName("关闭").on(Laya.Event.CLICK, this, this.gbfun, [38]);

        for (var i = 0; i < 3; i++) {
            this.paihangtype.getChildAt(i).on(Laya.Event.CLICK, this, this.paihangleixing, [i]);
        }

        for (var i = 0; i < 4; i++) {
            this.maimaitype.getChildAt(i).on(Laya.Event.CLICK, this, this.maimaifun, [i]);
        }

        for (var i = 0; i < 3; i++) {
            this.haoyoutype.getChildAt(i).on(Laya.Event.CLICK, this, this.haoyoufun, [i]);
        }

        this.shipei();
        this.reset();

        // 新增
        this.home.on(Laya.Event.MOUSE_DOWN, this, this.dian);
        //隐藏： 左侧菜单-商城
       // this.shangcheng_btn.visible = false;
        this.shangcheng_btn.on(Laya.Event.CLICK, this, this.shangchengfun);//打开商城

        this.shangcheng_box.getChildByName("关闭").on(Laya.Event.CLICK, this, this.gbfun, [39]);

        this.tianxie_box.getChildByName("关闭").on(Laya.Event.CLICK, this, this.gbfun, [40]);

        this.que_btn.on(Laya.Event.CLICK, this, this.duihuanshiwu);//商城确认兑换

        for (var i = 0; i < 2; i++) {
            this.shangchengtype.getChildAt(i).on(Laya.Event.CLICK, this, this.shangchengleixing, [i]);
        }

        this.chushou_btn.on(Laya.Event.CLICK, this, this.chushoufun);//挂卖出售

        this.quxiao_btn.on(Laya.Event.CLICK, this, function () {
            this.goumai_box.visible = false;
        });

        this.queding_btn.on(Laya.Event.CLICK, this, this.mairufun);//交易买入金币

        this.kaidibox.getChildByName("取消").on(Laya.Event.MOUSE_DOWN, this, function () {
            _this.kaidibox.visible = false;
        })
        this.kaidibox.getChildByName("确定").on(Laya.Event.MOUSE_DOWN, this, function () {
            console.log(datanum + 1, user_id)
            // zhifu(datanum + 1, user_id)
            if (kaidilei == 11) {
                ajax({
                    url: web_url + "/game/frame/buy",
                    type: 'post',
                    data: {
                        token: token,
                        id: datanum + 1,
                    },
                    dataType: 'json',
                    success: function (data) {
                        var data = JSON.parse(data);
                        console.log(data, "开地")
                        _this.xiaotanfun(data.info);
                        _this.wanjiafun();
                        _this.tudifun();
                        _this.kaidibox.visible = false;
                    },
                })
            }

            if (kaidilei == 12) {
                ajax({
                    url: web_url + "/game/animal/buy",
                    type: 'post',
                    data: {
                        token: token,
                        id: datanum + 1,
                    },
                    dataType: 'json',
                    success: function (data) {
                        var data = JSON.parse(data);
                        console.log(data, "开草地")
                        _this.xiaotanfun(data.info);
                        _this.wanjiafun();
                        _this.muchangfun();
                        _this.kaidibox.visible = false;
                    },
                })
            }

            if (kaidilei == 13) {
                ajax({
                    url: web_url + "/game/fish/buy",
                    type: 'post',
                    data: {
                        token: token,
                        id: datanum + 1,
                    },
                    dataType: 'json',
                    success: function (data) {
                        var data = JSON.parse(data);
                        console.log(data, "开池塘")
                        _this.xiaotanfun(data.info);
                        _this.wanjiafun();
                        _this.yuchangfun();
                        _this.kaidibox.visible = false;
                    },
                })
            }

        })

        // 删除
        this.shanyou_box.getChildByName("取消").on(Laya.Event.MOUSE_DOWN, this, function () {
            this.shanyou_box.visible = false;
        })
        this.shanyou_box.getChildByName("确定").on(Laya.Event.MOUSE_DOWN, this, function () {
            this.shanyou_box.visible = false;
            ajax({
                url: web_url + "/member/friend/del",
                type: 'post',
                data: {
                    token: token,
                    id: shanchu,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "闪闪闪")
                    if (data.status == 1) {
                        _this.haoyoufun(0);
                    }
                    _this.ts_txt.text = data.info;
                    _this.ts_box.visible = true;
                    Laya.timer.once(2000, this, function () {
                        _this.ts_box.visible = false;
                    })
                },
            })
        })

        // 赠送
        this.zengsong.on(Laya.Event.MOUSE_DOWN, this, function () {
            if (_this.vip.text == "体验会员") {
                this.ts_txt.text = "0级会员（体验会员）没有转账功能，需要升级成正式会员";
                this.ts_box.visible = true;
                Laya.timer.once(2000, this, function () {
                    _this.ts_box.visible = false;
                })
            } else {
                this.zengbox.visible = true;
            }

        })

        this.zengbox.getChildByName("关闭").on(Laya.Event.MOUSE_DOWN, this, function () {
            this.zengbox.visible = false;
        })

        this.zengbox.getChildByName("确定").on(Laya.Event.MOUSE_DOWN, this, function () {
            if (this.zengbox.getChildByName("账号").text != "" && this.zengbox.getChildByName("金额").text != "") {
                ajax({
                    url: web_url + "/game/send",
                    type: 'post',
                    data: {
                        token: token,
                        tid: this.zengbox.getChildByName("账号").text,
                        num: this.zengbox.getChildByName("金额").text,
                    },
                    dataType: 'json',
                    success: function (data) {
                        var data = JSON.parse(data);
                        console.log(data, "赠送")
                        _this.zengbox.visible = false;
                        _this.xiaotanfun(data.info)
                        _this.wanjiafun();
                    },
                })
            } else {
                _this.xiaotanfun("请输入正确的转账信息")
            }
        })
        // 切换农场牧场
        for (var i = 0; i < 3; i++) {
            //隐藏：农场牧场切换按钮
               this.qiehuan.getChildAt(i).visible = false;
            //this.qiehuan.getChildAt(i).on(Laya.Event.MOUSE_DOWN, this, this.qiefun, [i])
        }
    }

    Laya.class(Game, "Game", _super)
    var _proto = Game.prototype;

    _proto.qiefun = function (data) {
        this.land_box.visible = false;
        this.mu_box.visible = false;
        this.yu_box.visible = false;
        this.bg1.getChildByName("牧场").visible = false;
        this.bg1.getChildByName("渔场").visible = false;
        this.js_btn.visible = false;
        this.chong_btn.visible = false;
        this.cao_btn.visible = false;
        this.mu_btn.visible = false;
        this.yu_btn.visible = false;
        if (data == 0) {
            this.land_box.visible = true;
            this.js_btn.visible = true;
            this.chong_btn.visible = true;
            this.cao_btn.visible = true;
            _this.tudifun();
            chanlei = 1;
        }
        if (data == 1) {
            this.bg1.getChildByName("牧场").visible = true;
            this.mu_box.visible = true;
            this.mu_btn.visible = true;
            _this.muchangfun();
            chanlei = 2;
        }
        if (data == 2) {
            this.bg1.getChildByName("渔场").visible = true;
            this.yu_box.visible = true;
            this.yu_btn.visible = true;
            _this.yuchangfun();
            chanlei = 3;
        }
    }

    _proto.muchangfun = function () {
        //自己土地数据
        ajax({
            url: web_url + "/game/animal/list",
            type: 'post',
            data: {
                token: token,

            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "框架数据")
                if (data.errcode != 10001) {
                    tudishuju = data.data.list;
                    zhongdi = data.data.zhongdi;
                    kaiprice = data.data.price;
                    if (data.data.jifen > 0) {
                        // console.log(123)
                        //偷取10,显示收取积分
                        //自己土地
                        if (!ishaoyou) {
                            // console.log("执行一次")
                            _this.jifen_box.visible = true;
                            _this.jifennum.text = data.data.jifen;

                        }
                    } else {
                        _this.jifen_box.visible = false;
                    }
                    iszhongnum = 0;
                    isdebuff = [0, 0, 0];
                    for (var i = 0; i < data.data.list.length; i++) {
                        if (data.data.list[i].status != 3) {
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(5).visible = false;
                        } else {
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(5).visible = true;
                        }
                        if (data.data.list[i].g_s_id != 0) {
                            iszhongnum++;
                            zhonglejikuai = i + 1;
                            //土地有种子展示
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = true;
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).skin = "comp/liachang/donghua/" + data.data.list[i].g_s_id + ".png";
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).x = -2;
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).y = -42;
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).clipX = 5;
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).scaleX = 0.4;
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).scaleY = 0.4;
                            if (data.data.list[i].g_s_id == 12 || data.data.list[i].g_s_id == 13) {
                                _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).x = 20;
                                _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).y = -9;
                            }
                            //给土地剩余赋值
                            var zhongziname = data.data.list[i].g_s_id == 12 ? "鸡" : data.data.list[i].g_s_id == 13 ? "猪" : data.data.list[i].g_s_id == 14 ? "羊" : "牛";
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(3).text = zhongziname + " 当前收益" + data.data.list[i].profit_now;
                            // data.data.list[i].profit_now = 0;
                            // data.data.list[i].status = 2;
                            // 作物生长状态
                            if (data.data.list[i].profit_now == 0 && data.data.list[i].status == 2) {
                                //枯萎
                                _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = true;
                                _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = false;
                            } else {
                                //生长状态
                            }

                        } else {
                            // console.log("铲掉", data.data.list[i].position - 1)
                            //关闭展示
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = false;
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(3).text = "";
                            // _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                        }
                        //debuff
                        if (data.data.list[i].debuff != 0) {
                            isdebuff[0] = 1;
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "";
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/jie.png";
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = true;
                        } else {
                            _this.mu_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = false;
                        }
                    }
                }
            },
        })
    }

    _proto.yuchangfun = function () {
        //自己土地数据
        ajax({
            url: web_url + "/game/fish/list",
            type: 'post',
            data: {
                token: token,

            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "框架数据")
                if (data.errcode != 10001) {
                    tudishuju = data.data.list;
                    zhongdi = data.data.zhongdi;
                    kaiprice = data.data.price;

                    if (data.data.jifen > 0) {
                        // console.log(123)
                        //偷取10,显示收取积分
                        //自己土地
                        if (!ishaoyou) {
                            // console.log("执行一次")
                            _this.jifen_box.visible = true;
                            _this.jifennum.text = data.data.jifen;

                        }
                    } else {
                        _this.jifen_box.visible = false;
                    }
                    iszhongnum = 0;
                    isdebuff = [0, 0, 0];
                    for (var i = 0; i < data.data.list.length; i++) {
                        if (data.data.list[i].status != 3) {
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(5).visible = false;
                        } else {
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(5).visible = true;
                        }
                        if (data.data.list[i].g_s_id != 0) {
                            iszhongnum++;
                            zhonglejikuai = i + 1;
                            //土地有种子展示
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = true;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).skin = "comp/liachang/donghua/" + data.data.list[i].g_s_id + ".png";
                            // _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).x = 52;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).y = 22;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).clipX = 5;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).scaleX = 0.8;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).scaleY = 0.8;
                            if (data.data.list[i].g_s_id == 18 || data.data.list[i].g_s_id == 21) {
                                _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).clipX = 6;
                            }
                            if (data.data.list[i].g_s_id == 19) {
                                _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).clipX = 4;
                            }
                            //给土地剩余赋值
                            var zhongziname = data.data.list[i].g_s_id == 18 ? "金鱼" : data.data.list[i].g_s_id == 19 ? "蝴蝶鱼" : data.data.list[i].g_s_id == 20 ? "蓝倒吊鱼" : "小丑鱼";
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(3).text = zhongziname + " 当前收益" + data.data.list[i].profit_now;
                            // data.data.list[i].profit_now = 0;
                            // data.data.list[i].status = 2;
                            // 作物生长状态
                            if (data.data.list[i].profit_now == 0 && data.data.list[i].status == 2) {
                                //枯萎
                                _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = true;
                                _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = false;
                            } else {
                                //生长状态
                            }

                        } else {
                            // console.log("铲掉", data.data.list[i].position - 1)
                            //关闭展示
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = false;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(3).text = "";
                            // _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                        }
                        //debuff
                        if (data.data.list[i].debuff != 0) {
                            isdebuff[0] = 1;
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "";
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/jie.png";
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = true;
                        } else {
                            _this.yu_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = false;
                        }
                    }
                }
            },
        })
    }

    _proto.xiaoyouxifun = function (data) {
        console.log(data, "+++++")
        localStorage.setItem('token', token);
        if (data == 1) {
            //打开水果机
            window.location.href = web_url + "/shuiguoji/index.html";
        }
        if (data == 2) {
            console.log(1212)
            // 猜拳
            this.caiquan_box.visible = true;
            this.zhushu.getChildAt(0).getChildAt(1).visible = true;
        }
    }

    //复制链接
    _proto.fuzhifun = function () {
        console.log(lian, "复制链接")
        var text = lian;
        var input = document.getElementById("input");
        input.value = text; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
        // var os = conchConfig.getOS();
        // var bridge;
        // var obj = "复制内容" + lian;
        // if (os == "Conch-ios") {
        //     bridge = PlatformClass.createClass("JSBridge");//创建脚步代理
        // }
        // else if (os == "Conch-android") {
        //     //需要完整的类路径，注意与iOS的不同
        //     bridge = PlatformClass.createClass("demo.JSBridge");//创建脚步代理
        // }
        // if (os == "Conch-ios") {
        //     bridge.callWithBack(function (value) {
        //         // var obj = JSON.parse(value)
        //     }, "testAsyncCallback:", JSON.stringify(obj));
        // }
        // else if (os == "Conch-android") {
        //     bridge.callWithBack(function (value) {
        //         // var obj = JSON.parse(value)
        //     }, "testAsyncCallback", JSON.stringify(obj));
        // }
        _this.tanfun("复制成功");
    }

    _proto.shouchongfun = function () {
        console.log("首冲")
        this.shouchong_box.visible = true;
    }

    _proto.quchongzhi = function () {
        console.log("首冲去充值")
        this.jyfun();
        this.gbfun(38);
    }

    _proto.phfun = function (data) {
        console.log("打开排行榜", data, paihang + 1)

        // for (var i = 0; i < 3; i++) {
        //     this.paihangtype.getChildAt(i).visible = true;
        // }
        this.paihangtype.getChildAt(data).visible = false;

        arr_pai = [];
        // 清空显示重新赋值
        ajax({
            url: web_url + "/member/rank/list",
            type: 'post',
            data: {
                token: token,
                type: paihang + 1,
                is_friend: 2,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "排行榜")
                _this.ph_box.visible = true;

                for (var i = 0; i < data.list.length; i++) {
                    arr_pai.push({
                        head: "comp/head/head_" + data.list[i].head_url + ".jpg",
                        tu: i == 0 ? "comp/xin2/phb/tu2.png" : i == 1 ? "comp/xin2/phb/tu3.png" : i == 2 ? "comp/xin2/phb/tu4.png" : "",
                        // diji: i + 1 == 1 ? "comp/diyi.png" : i + 1 == 2 ? "comp/dier.png" : i + 1 == 3 ? "comp/disan.png" : "",
                        name: "(id:" + data.list[i].id + ")" + data.list[i].nickname,
                        num: data.list[i].num,
                        mingci: i + 1,
                    })
                }
                _this.list_pai.array = arr_pai;
                _this.list_pai.selectEnable = true;
                _this.list_pai.scrollBar.elasticBackTime = 400;
                _this.list_pai.scrollBar.elasticDistance = 50;
                _this.list_pai.mouseHandler = new Laya.Handler(_this, onMouse_pai);
                function onMouse_pai(e, index) {
                    if (e.type == "click") {
                        // console.log(index)

                    }
                }

            },
        })

    }

    var paihang = 0;
    _proto.paihangleixing = function (data) {
        for (var i = 0; i < 3; i++) {
            this.paihangtype.getChildAt(i).visible = true;
        }
        this.paihangtype.getChildAt(data).visible = false;
        paihang = data;
        this.phfun(1);
    }

    _proto.rwfun = function () {
        console.log("打开任务")
        this.renwu_box.visible = true;
        this.renwufun(0);
    }

    _proto.renwufun = function (data) {
        // // console.log(data)
        // for (var i = 0; i < 2; i++) {
        //     this.renwutype.getChildAt(i).visible = true;
        // }
        this.renwutype.getChildAt(data).visible = false;

        if (data == 0) {
            // 每日任务
            arr_renwu = [];
            ajax({
                url: web_url + "/task/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "每日任务")
                    for (var i = 0; i < data.list.length; i++) {
                        //判断任务类型
                        if (data.list[i].type > 5) {
                            // console.log("每日")
                            arr_renwu.push({
                                id: data.list[i].id,
                                title: data.list[i].title + "(" + data.list[i].now + "/" + data.list[i].need + ")",
                                shuoming: data.list[i].info,
                                tu: data.list[i].status == 1 ? "comp/xin2/renwu/b1.png" : data.list[i].status == 2 ? "comp/xin2/renwu/b3.png" : "comp/xin2/renwu/b4.png"
                            })
                        }
                    }
                    _this.list_renwu.array = arr_renwu;
                    _this.list_renwu.selectEnable = true;
                    _this.list_renwu.scrollBar.elasticBackTime = 400;
                    _this.list_renwu.scrollBar.elasticDistance = 50;
                    _this.list_renwu.mouseHandler = new Laya.Handler(_this, onMouse_renwu);
                    function onMouse_renwu(e, index) {
                        if (e.type == "click") {
                            if (arr_renwu[index]) {
                                anniuzhuangtai = arr_renwu[index].tu;
                                renwuid = arr_renwu[index].id;
                                // console.log(anniuzhuangtai, renwuid)
                                if (e.target.name == "点击") {
                                    // console.log(index)
                                    if (anniuzhuangtai == "comp/xin2/renwu/b3.png") {//红色领取按钮
                                        ajax({
                                            url: web_url + "/task/update",
                                            type: 'post',
                                            data: {
                                                token: token,
                                                id: renwuid,
                                            },
                                            dataType: 'json',
                                            success: function (data) {
                                                var data = JSON.parse(data);
                                                console.log(data, "完成任务")
                                                _this.xiaotanfun(data.info);
                                                _this.wanjiafun();
                                                //刷新道具
                                                if (data.status == 1) {
                                                    //领取成功更改按钮状态
                                                    _this.renwufun(0);
                                                    console.log(index, _this.list_renwu.array[index].title)
                                                    // _this.list_renwu.array[index].title = "";
                                                    console.log(_this.list_renwu.array[index].title)
                                                    // arr_renwu[nayigeanniu].tu.skin = "comp/xin2/renwu/b1.png"
                                                    // console.log(_this.list_renwu.array,"++++++++++++++++++"+nayigeanniu,arr_renwu)
                                                }
                                            },
                                        })
                                    }
                                    if (anniuzhuangtai == "comp/xin2/renwu/b1.png") {//黄色进行中按钮
                                        // 任务固定，判断每日任务id前往对应操作
                                         console.log("前往任务", data, data.list[index].id)
                                        if (index == 0 || index == 1 || index == 2) {
                                            console.log("前往偷取")
                                             
                                        }
                                        if (index == 3 || index == 4 || index == 5) {
                                            console.log("前往土地操作")
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            })
        }
        if (data == 1) {
            arr_renwu = [];
            //主线任务
            ajax({
                url: web_url + "/task/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "主线任务")
                    for (var i = 0; i < data.list.length; i++) {
                        //判断任务类型
                        if (data.list[i].type <= 5) {
                            // console.log("主线")
                            arr_renwu.push({
                                id: data.list[i].id,
                                title: data.list[i].title + "(" + data.list[i].now + "/" + data.list[i].need + ")",
                                shuoming: data.list[i].info,
                                tu: data.list[i].status == 1 ? "comp/xin2/renwu/b1.png" : data.list[i].status == 2 ? "comp/xin2/renwu/b3.png" : "comp/xin2/renwu/b4.png"
                            })
                        }
                    }
                    _this.list_renwu.array = arr_renwu;
                    _this.list_renwu.selectEnable = true;
                    _this.list_renwu.scrollBar.elasticBackTime = 400;
                    _this.list_renwu.scrollBar.elasticDistance = 50;
                    _this.list_renwu.mouseHandler = new Laya.Handler(_this, onMouse_renwu);
                    function onMouse_renwu(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                            anniuzhuangtai = arr_renwu[index].tu;
                            renwuid = arr_renwu[index].id;
                            if (e.target.name == "点击") {
                                // console.log(index)
                                if (anniuzhuangtai == "comp/xin2/renwu/b3.png") {

                                    ajax({
                                        url: web_url + "/task/update",
                                        type: 'post',
                                        data: {
                                            token: token,
                                            id: renwuid,
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            var data = JSON.parse(data);
                                            console.log(data, "完成任务")
                                            _this.xiaotanfun(data.info);
                                            _this.wanjiafun();
                                            //刷新道具
                                            if (data.status == 1) {
                                                //领取成功更改按钮状态
                                                _this.renwufun(1);
                                                console.log(index, _this.list_renwu.array[index].title)
                                                // _this.list_renwu.array[index].title = "";
                                                console.log(_this.list_renwu.array[index].title)
                                                // arr_renwu[nayigeanniu].tu.skin = "comp/xin2/renwu/b1.png"
                                                // console.log(arr_renwu[nayigeanniu])
                                                // console.log(_this.list_renwu.array,"++++++++++++++++++"+nayigeanniu,arr_renwu)
                                            }
                                        },
                                    })
                                }
                                if (anniuzhuangtai == "comp/xin2/renwu/b1.png") {
                                    if (index == 1 || index == 2 || index == 3 || index == 4) {
                                        console.log("前往种植")
                                        
                                    }
                                    if (index == 5 || index == 6 || index == 7 || index == 8) {
                                        console.log("种植不同作物")
                                    }
                                    if (index == 9) {
                                        console.log("前往喂狗")
                                    }
                                    if (index == 10) {
                                        console.log("前往喂鸟")
                                    }
                                }
                            }
                        }
                    }
                },
            })
        }
    }


    _proto.mmfun = function () {
        console.log("挂买挂卖")
        this.maimai_box.visible = true;
        this.maimaifun(0);
    }

    var guadanid;
    var dakuanid;
    var shoukuanid;
    _proto.maimaifun = function (data) {
        // console.log(data)
        for (var i = 0; i < 4; i++) {
            this.maimaitype.getChildAt(i).visible = true;
        }
        this.maimaitype.getChildAt(data).visible = false;
        if (data == 0) {
            //出售
            this.liebiao_box.visible = false;
            this.shuru_box.visible = true;
            this.biaoti_box.visible = false;
            this.mairu_box.visible = false;
        }
        if (data == 1) {
            //列表
            this.liebiao_box.visible = true;
            this.biaoti_box.visible = true;
            this.shuru_box.visible = false;
            this.mairu_box.visible = false;
            // 标题
            this.biaoti_box.getChildAt(0).text = "挂单人id";
            this.biaoti_box.getChildAt(1).text = "单价";
            this.biaoti_box.getChildAt(2).text = "剩余金币数量";
            arr_maimai = [];
            ajax({
                url: web_url + "/trade/gd/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "挂单列表")
                    arr_maimai = [];
                    for (var i = 0; i < data.data.list.length; i++) {
                        arr_maimai.push({
                            id: data.data.list[i].m_id,
                            danhao: data.data.list[i].id,
                            danjia: data.data.list[i].price,
                            shengyu: data.data.list[i].surplus_num,
                            num: "",
                            名字: user_id == data.data.list[i].m_id ? "撤销" : "买入"
                        })
                    }
                    _this.list_maimai.array = arr_maimai;
                    _this.list_maimai.selectEnable = true;
                    _this.list_maimai.scrollBar.elasticBackTime = 400;
                    _this.list_maimai.scrollBar.elasticDistance = 50;
                    _this.list_maimai.mouseHandler = new Laya.Handler(_this, onMouse_maimai);
                    function onMouse_maimai(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                            if (e.target.name == "买入") {
                                if (arr_maimai[index]) {
                                    if (arr_maimai[index].名字 == "买入") {
                                        _this.goumai_box.visible = true;
                                        guadanid = arr_maimai[index].danhao;
                                        // console.log(arr_maimai[index].danhao)
                                    } else {
                                        ajax({
                                            url: web_url + "/trade/gd/down",
                                            type: 'post',
                                            data: {
                                                token: token,
                                                id: arr_maimai[index].danhao
                                            },
                                            dataType: 'json',
                                            success: function (data) {
                                                var data = JSON.parse(data);
                                                _this.wanjiafun();
                                                _this.xiaotanfun(data.info);
                                                _this.maimaifun(1);
                                            },
                                        })
                                    }
                                }
                            }
                        }
                    }
                },
            })
        }
        if (data == 2) {
            console.log("买入")
            this.liebiao_box.visible = false;
            this.biaoti_box.visible = true;
            this.shuru_box.visible = false;
            this.mairu_box.visible = true;
            // 标题
            this.biaoti_box.getChildAt(0).text = "挂单人id";
            this.biaoti_box.getChildAt(1).text = "总价";
            this.biaoti_box.getChildAt(2).text = "手机号";
            arr_mairu = [];
            ajax({
                url: web_url + "/trade/gd/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "买入")
                    for (var i = 0; i < data.data.buy.length; i++) {
                        arr_mairu.push({
                            name: data.data.buy[i].mc_rel_name,
                            zfb: data.data.buy[i].mc_zfb,
                            khh: data.data.buy[i].mc_khh,
                            ykh: data.data.buy[i].mc_kh,
                            phone: data.data.buy[i].mc_phone,

                            id: data.data.buy[i].mc_id,
                            danjia: data.data.buy[i].price * data.data.buy[i].gold_num,
                            shengyu: data.data.buy[i].mc_phone,
                            num: "",
                            mc_alipay_number: data.data.buy[i].mc_alipay_number,
                            mc_wechat_number: data.data.buy[i].mc_wechat_number,
                            guadanid: data.data.buy[i].id,
                            status: data.data.buy[i].status,
                            queren: data.data.buy[i].status == 1 ? "comp/xin2/haoyou/k1.png" : "",
                            dakuan: data.data.buy[i].status == 1 ? "确认打款" : "",
                            tu: "comp/xin2/haoyou/k1.png",
                            chakan: "查看",
                            shangchuan: "comp/xin2/haoyou/k1.png",
                            pingzheng: "上传凭证"
                        })
                    }
                    _this.list_mairu.array = arr_mairu;
                    _this.list_mairu.selectEnable = true;
                    _this.list_mairu.scrollBar.elasticBackTime = 400;
                    _this.list_mairu.scrollBar.elasticDistance = 50;
                    _this.list_mairu.mouseHandler = new Laya.Handler(_this, onMouse_mairu);
                    function onMouse_mairu(e, index) {
                        if (e.type == "click") {
                            // 获取列表id
                            if (arr_mairu[index]) {
                                dakuanid = arr_mairu[index].guadanid
                                if (e.target.name == "查看") {
                                    _this.shoufuewm_box.visible = true;
                                    maijiaerweima1 = arr_mairu[index].mc_alipay_number;
                                    maijiaerweima2 = arr_mairu[index].mc_wechat_number;
                                    console.log("查看卖家二维码", maijiaerweima1, maijiaerweima2)
                                    _this.shoufuewm_box.getChildByName("支付宝").skin = maijiaerweima1;
                                    _this.shoufuewm_box.getChildByName("微信").skin = maijiaerweima2;
                                    _this.mz.text = arr_mairu[index].zfb;
                                    _this.mm.text = arr_mairu[index].name;
                                    _this.mk.text = arr_mairu[index].khh;
                                    _this.my.text = arr_mairu[index].ykh;
                                    _this.ms.text = arr_mairu[index].phone;
                                }
                                if (e.target.name == "打款") {
                                    if (arr_mairu[index].status == 1) {
                                        console.log("打款", dakuanid)
                                        ajax({
                                            url: web_url + "/trade/gd/one",
                                            type: 'post',
                                            data: {
                                                token: token,
                                                id: dakuanid,
                                            },
                                            dataType: 'json',
                                            success: function (data) {
                                                var data = JSON.parse(data);
                                                console.log(data, "确认打款")
                                                _this.xiaotanfun(data.info);
                                                _this.wanjiafun();
                                                _this.maimaifun(2);
                                            },
                                        })
                                    } else {
                                        console.log("确认过了")
                                    }
                                }
                                if (e.target.name == "上传") {
                                    var os = conchConfig.getOS();
                                    var bridge;
                                    var obj = "拍照上传";
                                    if (os == "Conch-ios") {
                                        bridge = PlatformClass.createClass("JSBridge");//创建脚步代理
                                    }
                                    else if (os == "Conch-android") {
                                        //需要完整的类路径，注意与iOS的不同
                                        bridge = PlatformClass.createClass("demo.JSBridge");//创建脚步代理
                                    }
                                    if (os == "Conch-ios") {
                                        bridge.callWithBack(function (value) {
                                            // alert(value)
                                            // var obj = JSON.parse(value)
                                            ping = value;
                                            _this.pingzheng.skin = ping;
                                            // _this.pingzheng.visible=true;
                                            _this.pingzhengfun();
                                        }, "testAsyncCallback:", JSON.stringify(obj));
                                    }
                                    else if (os == "Conch-android") {
                                        bridge.callWithBack(function (value) {
                                            var obj = JSON.parse(value)
                                            ping = obj.data.url;
                                            _this.pingzheng.skin = ping;
                                            // _this.pingzheng.visible=true;
                                            _this.pingzhengfun();
                                        }, "testAsyncCallback", JSON.stringify(obj));
                                    }
                                }
                            }
                        }
                    }
                },
            })
        }
        if (data == 3) {
            console.log("售出")
            this.liebiao_box.visible = false;
            this.biaoti_box.visible = true;
            this.shuru_box.visible = false;
            this.mairu_box.visible = true;
            // 标题
            this.biaoti_box.getChildAt(0).text = "挂单人id";
            this.biaoti_box.getChildAt(1).text = "总价";
            this.biaoti_box.getChildAt(2).text = "手机号";
            arr_mairu = [];
            ajax({
                url: web_url + "/trade/gd/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "售出")
                    for (var i = 0; i < data.data.sale.length; i++) {
                        arr_mairu.push({
                            id: data.data.sale[i].mc_id,
                            danjia: data.data.sale[i].price * data.data.sale[i].gold_num,
                            shengyu: data.data.sale[i].mr_phone,//买家手机号
                            num: "",
                            // queren: data.data.sale[i].status == 2 ? "comp/xin2/haoyou/k1.png" : "",
                            queren: "",
                            // dakuan: data.data.sale[i].status == 2 ? "确认收款" : "",
                            dakuan: "",
                            status: data.data.sale[i].status,
                            shoukuanid: data.data.sale[i].id,
                            tu: "comp/xin2/haoyou/k1.png",
                            chakan: data.data.sale[i].status == 2 ? "确认收款" : "等待打款",
                            shangchuan: "",
                            pingzheng: ""
                        })
                    }
                    _this.list_mairu.array = arr_mairu;
                    _this.list_mairu.selectEnable = true;
                    _this.list_mairu.scrollBar.elasticBackTime = 400;
                    _this.list_mairu.scrollBar.elasticDistance = 50;
                    _this.list_mairu.mouseHandler = new Laya.Handler(_this, onMouse_mairu);
                    function onMouse_mairu(e, index) {
                        if (e.type == "click") {
                            if (arr_mairu[index]) {
                                shoukuanid = arr_mairu[index].shoukuanid;
                                //卖家确认
                                if (e.target.name == "查看") {
                                    if (arr_mairu[index].status == 2) {
                                        console.log("查看", shoukuanid)
                                        ajax({
                                            url: web_url + "/trade/gd/two",
                                            type: 'post',
                                            data: {
                                                token: token,
                                                id: shoukuanid,
                                            },
                                            dataType: 'json',
                                            success: function (data) {
                                                var data = JSON.parse(data);
                                                console.log(data, "确认打款")
                                                _this.xiaotanfun(data.info);
                                                _this.wanjiafun();
                                                _this.maimaifun(3);
                                            },
                                        })
                                    } else {
                                        console.log("确认过了")
                                    }
                                }
                            }
                        }
                    }
                },
            })
        }
    }

    _proto.mairufun = function () {
        console.log(guadanid)
        ajax({
            url: web_url + "/trade/gd/buy",
            type: 'post',
            data: {
                token: token,
                id: guadanid,
                num: _this.num_txt.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "买入金币")
                _this.xiaotanfun(data.info);
                _this.wanjiafun();
                _this.maimaifun(1);
                _this.goumai_box.visible = false;
            },
        })
    }

    _proto.chushoufun = function () {
        console.log("出售")
        //判断是否绑定
        ajax({
            url: web_url + "/member/info",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "判断是否绑定二维码")
                if (data.data.wechat_number != "" || data.data.alipay_number != "") {

                    ajax({
                        url: web_url + "/trade/gd/add",
                        type: 'post',
                        data: {
                            token: token,
                            // price: _this.danjia_txt.text,//单价
                            num: _this.shuliang_txt.text,//数量
                        },
                        dataType: 'json',
                        success: function (data) {
                            var data = JSON.parse(data);
                            console.log(data, "出售金币")
                            _this.xiaotanfun(data.info);
                            _this.wanjiafun();
                        },
                    })

                } else {
                    _this.xiaotanfun("请绑定收款码");
                }
            },
        })



    }

    //新好友
    _proto.haoyoufun = function (data) {
        console.log(data)
        arr_haoyou = [];

        this.xinhaoyou_box.visible = true;

        this.tianjia_box.visible = true;
        // this.tianjia_box.visible = false;

        for (var i = 0; i < 3; i++) {
            this.haoyoutype.getChildAt(i).visible = true;
        }
        this.haoyoutype.getChildAt(data).visible = false;

        if (data == 0) {
            console.log("打开好友")
            // 不要层级
            this.biaoti.getChildAt(3).visible = false;
            this.biaoti.getChildAt(2).visible = true;

            // this.tianjia_box.visible = true;

            ajax({
                url: web_url + "/member/friend/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "好友列表")
                    for (var i = 0; i < data.list.length; i++) {
                        arr_haoyou.push({
                            tu: "comp/head/head_" + data.list[i].head_url + ".jpg",
                            id1: data.list[i].m_id,
                            name: data.list[i].nickname,
                            // name: data.list[i].nickname + data.list[i].m_id,
                            name: "(id:" + data.list[i].m_id + ")" + data.list[i].nickname,
                            phone: data.list[i].phone,
                            cengshu: "删除",
                            id: "",
                        })
                    }
                    _this.list_haoyou.array = arr_haoyou;
                    _this.list_haoyou.selectEnable = true;
                    _this.list_haoyou.scrollBar.elasticBackTime = 400;
                    _this.list_haoyou.scrollBar.elasticDistance = 50;
                    _this.list_haoyou.mouseHandler = new Laya.Handler(_this, onMouse_haoyou);
                    function onMouse_haoyou(e, index) {
                        if (e.type == "click") {
                            if (e.target.name == "删除") {
                                console.log("删除好友", index)
                                shanchu = arr_haoyou[index].id1;
                                _this.shanyou_box.getChildByName("文字").text = "是否确定删除好友" + arr_haoyou[index].name + "？";
                                _this.shanyou_box.visible = true;
                            }
                        }
                        if (e.type == "click") {
                            if (e.target.name == "好友") {
                                console.log(index, "好友")
                                // 进入好友土地
                                // _this.haoyou_box.visible = false;
                                ishaoyou = true;
                                _this.qiehuan.visible = false;
                                haoyouid = arr_haoyou[index].id1;
                                _this.haoyoutudishuju(haoyouid);
                                _this.xinhaoyou_box.visible = false;
                                _this.jinbitxt1.text = "???";
                                _this.jifentxt1.text = "???";
                                _this.mingtxt1.text = arr_haoyou[index].name;
                                _this.idtxt1.text = arr_haoyou[index].id;
                                _this.head.skin = arr_haoyou[index].tu;

                                _this.bb_btn.disabled = true;
                                _this.chan_btn.disabled = true;
                                _this.duihuan.disabled = true;
                                //隐藏狗 鸟
                                _this.goutxt.visible = false;
                                _this.niaotxt1.visible = false; //==隐藏： 鸟

                                // _this.tiyan_btn.visible = false;

                                _this.fanhuijiayuan.visible = true;
                                Laya.Tween.to(_this.you_box, { x: 1580 }, 300);
                                Laya.Tween.to(_this.zuo_box, { x: -90 }, 300);
                            }
                        }
                    }
                },
            })

        }
        if (data == 1) {
            this.biaoti.getChildAt(2).visible = false;
            this.biaoti.getChildAt(3).visible = false;

            //偷取
            ajax({
                url: web_url + "/game/steal/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "偷取列表")
                    for (var i = 0; i < data.list.length; i++) {
                        arr_haoyou.push({
                            tu: "comp/head/head_" + data.list[i].head_url + ".jpg",
                            // id: data.list[i].m_id,
                            // name: "(id:" + data.list[i].id + ")" + data.list[i].nickname,
                            name: "(id:" + data.list[i].m_id + ")" + data.list[i].nickname,
                            phone: "",
                            dengji: "",
                            cengshu: "可偷取",
                            m_id: data.list[i].m_id,
                        })
                    }
                    _this.list_haoyou.array = arr_haoyou;
                    _this.list_haoyou.selectEnable = true;
                    _this.list_haoyou.scrollBar.elasticBackTime = 400;
                    _this.list_haoyou.scrollBar.elasticDistance = 50;
                    _this.list_haoyou.mouseHandler = new Laya.Handler(_this, onMouse_haoyou);
                    function onMouse_haoyou(e, index) {
                        if (e.type == "click") {
                            // console.log(index)

                            // _this.haoyou_box.visible = false;
                            ishaoyou = true;
                            _this.qiehuan.visible = false;
                            touquid = arr_haoyou[index].m_id;
                            console.log(touquid, arr_haoyou[index])
                            // console.log(arr_haoyou[index].tu,"--=======")
                            _this.touquhaoyoutudi(touquid);

                            _this.xinhaoyou_box.visible = false;

                            this.yijiantoufun();
                            _this.jinbitxt1.text = "???";
                            _this.jifentxt1.text = "???";
                            _this.mingtxt1.text = arr_haoyou[index].name;
                            _this.idtxt1.text = arr_haoyou[index].id;
                            _this.head.skin = arr_haoyou[index].tu;

                            _this.bb_btn.disabled = true;
                            _this.chan_btn.disabled = true;
                            _this.c_box.visible = false;
                            _this.duihuan.disabled = true;

                            // _this.yijiantouqu.disabled = false;

                            //隐藏狗 鸟
                            _this.goutxt.visible = false;
                            _this.niaotxt1.visible = false;
                            // _this.tiyan_btn.visible = false;

                            _this.fanhuijiayuan.visible = true;
                            Laya.Tween.to(_this.you_box, { x: 1580 }, 300);
                            Laya.Tween.to(_this.zuo_box, { x: -90 }, 300);

                        }
                    }

                },
            })
        }
        if (data == 2) {
            console.log("打开团队")
            this.biaoti.getChildAt(3).visible = true;
            this.biaoti.getChildAt(2).visible = true;

            ajax({
                url: web_url + "/member/fellow/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "关系列表")
                    for (var i = 0; i < data.list.length; i++) {
                        arr_haoyou.push({
                            tu: "comp/head/head_" + data.list[i].head_url + ".jpg",
                            id1: data.list[i].id,
                            name: "(id:" + data.list[i].id + ")" + data.list[i].nickname,
                            phone: data.list[i].phone,
                            cengshu: data.list[i].type,
                        })
                    }
                    _this.list_haoyou.array = arr_haoyou;
                    _this.list_haoyou.selectEnable = true;
                    _this.list_haoyou.scrollBar.elasticBackTime = 400;
                    _this.list_haoyou.scrollBar.elasticDistance = 50;
                    _this.list_haoyou.mouseHandler = new Laya.Handler(_this, onMouse_haoyou);
                    function onMouse_haoyou(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                            // _this.haoyou_box.visible = false;
                            ishaoyou = true;
                            _this.qiehuan.visible = false;
                            haoyouid = arr_haoyou[index].id1;
                            _this.haoyoutudishuju(haoyouid);
                            _this.xinhaoyou_box.visible = false;
                            console.log(haoyouid)
                            _this.jinbitxt1.text = "???";
                            _this.jifentxt1.text = "???";
                            _this.mingtxt1.text = arr_haoyou[index].name;
                            _this.idtxt1.text = arr_haoyou[index].id;
                            _this.head.skin = arr_haoyou[index].tu;

                            _this.bb_btn.disabled = true;
                            _this.chan_btn.disabled = true;
                            _this.duihuan.disabled = true;
                            //隐藏狗 鸟
                            _this.goutxt.visible = false;
                            _this.niaotxt1.visible = false;

                            _this.fanhuijiayuan.visible = true;
                            Laya.Tween.to(_this.you_box, { x: 1580 }, 300);
                            Laya.Tween.to(_this.zuo_box, { x: -90 }, 300);

                        }
                    }
                },
            })
        }
    }

    _proto.reset = function () {
        // this.jy_btn.visible=false;
        // this.zengsong.visible=false;

        // this.qiehuan.visible=false;
        // this.yx_btn.visible = false;
        //====隐藏： 排行 切换  
        this.qiehuan.visible=false;
        this.ph_btn.visible = false;
        this.yx_btn.visible = false;

        this.chou_txt1.text = 2;
        this.chou_txt2.text = "2金币一次";
        Laya.timer.frameLoop(1, this, _this.zhixingfudong);
        for (var i = 0; i < 18; i++) {
            this.land_box.getChildAt(i).getChildAt(3).width += 50;
            this.land_box.getChildAt(i).getChildAt(3).x -= 50 / 2;
        }
    }

    var bg1x;
    var bg1y;
    _proto.dian = function () {
        bg1x = this.bg1.x;
        bg1y = this.bg1.y;
        this.home.on(Laya.Event.MOUSE_MOVE, this, this.dianmove, [this.home.mouseX, this.home.mouseY]);
    }

    _proto.dianmove = function (data1, data2) {
        this.bg1.pos(bg1x + (this.home.mouseX - data1), bg1y + (this.home.mouseY - data2))
    }

    _proto.tiyanfu = function () {
       // window.location.replace("http://sttest.modn.xin/shentou/index.html");
    }

    var xianshi = false;
    _proto.dubaifun = function () {
        if (!xianshi) {
            xianshi = true;
            this.duibai_box.visible = true;
            Laya.timer.once(3000, this, function () {
                this.duibai_box.visible = false;
                xianshi = false;
            })

            if (iszhongnum == 0) {
                var randdubai = Math.floor(Math.random() * 4)
                if (randdubai == 0) {
                    this.duibaitxt.text = "种植白茶以外的金币才可以偷取哦~"
                }
                if (randdubai == 1) {
                    this.duibaitxt.text = "点击商店购买种子，更多精彩在等着你~"
                }
                if (randdubai == 2) {
                    this.duibaitxt.text = "不充钱怎么变强，赶快开启你的幸运之旅吧~"
                }
                if (randdubai == 3) {
                    this.duibaitxt.text = "想怎么种就怎么种~"
                }
                return;
            }
            var randdubai = Math.floor(Math.random() * 5);
            if (randdubai != 0) {
                if (iszhongnum == 1 || iszhongnum == 6 || iszhongnum == 12 || iszhongnum == 18) {
                    var randdubai = Math.floor(Math.random() * 8)
                    if (randdubai == 0) {
                        this.duibaitxt.text = "您已经获取了偷取资格，快去偷取吧~"
                    }
                    if (randdubai == 1) {
                        this.duibaitxt.text = "听说养鸟后偷到的会更多呢~"
                    }
                    if (randdubai == 2) {
                        this.duibaitxt.text = "狗粮鸟粮用能量也能购买哦~"
                    }
                    if (randdubai == 3) {
                        this.duibaitxt.text = "偷菜偷累了，试试休闲游戏吧~"
                    }
                    if (randdubai == 4) {
                        this.duibaitxt.text = "偷菜偷累了，试试休闲游戏吧~"
                    }
                    if (randdubai == 5) {
                        this.duibaitxt.text = "你地里的果实，我就收下了~"
                    }
                    if (randdubai == 6) {
                        this.duibaitxt.text = "你地里的果实，我就收下了~"
                    }
                    if (randdubai == 7) {
                        this.duibaitxt.text = "你地里的果实，我就收下了~"
                    }
                    return;
                }
                if (iszhongnum > 1 && iszhongnum < 6) {
                    var randdubai = Math.floor(Math.random() * 5)
                    if (randdubai == 0) {
                        this.duibaitxt.text = "听说养鸟后偷到的会更多呢~"
                    }
                    if (randdubai == 1) {
                        this.duibaitxt.text = "听说养鸟后偷到的会更多呢~"
                    }
                    if (randdubai == 2) {
                        this.duibaitxt.text = "听说养鸟后偷到的会更多呢~"
                    }
                    if (randdubai == 3) {
                        this.duibaitxt.text = "害怕忘记偷，快去喂养一条守护犬吧~"
                    }
                    if (randdubai == 4) {
                        this.duibaitxt.text = "你地里的果实，我就收下了~"
                    }
                    return;
                }
                if (iszhongnum > 6 && iszhongnum < 12) {
                    var randdubai = Math.floor(Math.random() * 5)
                    if (randdubai == 0) {
                        this.duibaitxt.text = "听说养鸟后偷到的会更多呢~"
                    }
                    if (randdubai == 1) {
                        this.duibaitxt.text = "听说养鸟后偷到的会更多呢~"
                    }
                    if (randdubai == 2) {
                        this.duibaitxt.text = "狗粮鸟粮用能量也能购买哦~"
                    }
                    if (randdubai == 3) {
                        this.duibaitxt.text = "锄禾日当午，汗滴禾下土~"
                    }
                    if (randdubai == 4) {
                        this.duibaitxt.text = "锄禾日当午，汗滴禾下土~"
                    }
                    return;
                }
                if (iszhongnum > 12 && iszhongnum < 18) {
                    var randdubai = Math.floor(Math.random() * 5)
                    if (randdubai == 0) {
                        this.duibaitxt.text = "没有什么比偷果实更有意思的事了，如果有那就偷两次~"
                    }
                    if (randdubai == 1) {
                        this.duibaitxt.text = "没有什么比偷果实更有意思的事了，如果有那就偷两次~"
                    }
                    if (randdubai == 2) {
                        this.duibaitxt.text = "还不去种地，等着吃白米饭吗~"
                    }
                    if (randdubai == 3) {
                        this.duibaitxt.text = "工作是不可能工作的，只能偷偷果实维持生活的样子~"
                    }
                    if (randdubai == 4) {
                        this.duibaitxt.text = "工作是不可能工作的，只能偷偷果实维持生活的样子~";
                    }
                    return;
                }
            } else {
                if (isdebuff[0] == 1) {
                    this.duibaitxt.text = "都快渴死了,快给地里浇浇水吧~"
                    return;
                }
                if (isdebuff[1] == 1) {
                    this.duibaitxt.text = "看到地里的草了吗？快使用除草剂吧~"
                    return;
                }
                if (isdebuff[2] == 1) {
                    this.duibaitxt.text = "虫子在偷吃果子，快消灭它吧~"
                    return;
                }
                this.duibaitxt.text = "真厉害，所有的果树都在健康成长~"
            }
        }

    }

    var iszhongnum = 0;
    var isdebuff = [0, 0, 0]
    _proto.tudifun = function () {
        //自己土地数据
        ajax({
            url: web_url + "/game/frame/list",
            type: 'post',
            data: {
                token: token,

            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "框架数据")
                if (data.errcode != 10001) {
                    //判断是否第一次登录
                    if (data.data.is_day == 1) {
                        // console.log("第一次登录")
                      //===彩金相关隐藏 
                        //jianger = data.data.cj.m_id;
                        //jiangnum = data.data.cj.num;
                        // _this.caijinfun(data.data.is_sign);
                    } else {

                    }

                    tudishuju = data.data.list;
                    yitounum = data.data.steal1_times;
                    beitounum = data.data.steal_times;
                    zhongdi = data.data.zhongdi;
                    kaiprice = data.data.price;

                    // 彩金奖池的值
                   // _this.caijinnum.text = data.data.cj_num;

                    if (data.data.jifen > 0) {
                        // console.log(123)
                        //偷取10,显示收取积分
                        //自己土地
                        if (!ishaoyou) {
                            // console.log("执行一次")
                            _this.jifen_box.visible = true;
                            _this.jifennum.text = data.data.jifen;

                        }
                    } else {
                        _this.jifen_box.visible = false;
                    }
                    iszhongnum = 0;
                    isdebuff = [0, 0, 0];
                    for (var i = 0; i < data.data.list.length; i++) {
                        if (data.data.list[i].status != 3) {
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(5).visible = false;
                        } else {
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(5).visible = true;
                        }
                        if (data.data.list[i].g_s_id != 0) {
                            iszhongnum++;
                            zhonglejikuai = i + 1;
                            //土地有种子展示
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).pivot(98.5, 75);
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).pos(85, 20);
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = true;
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).skin = "comp/tree/" + data.data.list[i].g_s_id + "3.png";
                            // _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                            //给土地剩余赋值
                            var zhongziname = data.data.list[i].g_s_id == 1 ? "辣椒" : data.data.list[i].g_s_id == 2 ? "胡萝卜" : data.data.list[i].g_s_id == 3 ? "番茄" : data.data.list[i].g_s_id == 4 ? "南瓜" : data.data.list[i].g_s_id == 5 ? "雏菊" : "郁金香";
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(3).text = zhongziname + " 当前收益" + data.data.list[i].profit_now;
                            // data.data.list[i].profit_now = 0;
                            // data.data.list[i].status = 2;
                            // 作物生长状态
                            if (data.data.list[i].profit_now == 0 && data.data.list[i].status == 2) {
                                //枯萎
                                _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = true;
                                _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = false;
                            } else {
                                //生长状态
                            }

                        } else {
                            // console.log("铲掉", data.data.list[i].position - 1)
                            //关闭展示
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = false;
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(3).text = "";
                            // _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                        }
                        //debuff
                        if (data.data.list[i].debuff != 0) {
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = true;
                            if (data.data.list[i].debuff == 9) {
                                isdebuff[0] = 1;
                                _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/shui.png";
                            }
                            if (data.data.list[i].debuff == 10) {
                                isdebuff[1] = 1;
                                _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/cao.png";
                            }
                            if (data.data.list[i].debuff == 11) {
                                isdebuff[2] = 1;
                                _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/chong.png";
                            }
                        } else {
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = false;
                        }
                    }
                }
            },
        })
    }

    var movenum = 0;
    var movesudu = 1.5;
    var movezhi = -1;
    var caijinnum = 0;
    _proto.zhixingfudong = function () {
        movenum++;
        if (movenum == 30) {
            movenum = 0;
            movezhi = movezhi == -1 ? 1 : -1;
        }
        _this.jifen_box.y += movezhi;

        if (isjinbi) {
            caijinnum++;
            if (caijinnum == 5) {
                caijinnum = 0;
                this.jinbisheng();
            }
            this.jinbiluo();
        }

        if (isgonggao) {
            this.gb_txt.x--;
            if (this.gb_txt.x <= -1272) {
                this.gb_txt.x = 1272;
            }
        }

        //判断地图边界
        if (this.bg1.x >= 905) {
            this.bg1.x = 905;
        }
        if (this.bg1.x <= 439) {
            this.bg1.x = 439;
        }
        if (this.bg1.y >= 509) {
            this.bg1.y = 509;
        }
        if (this.bg1.y <= 241) {
            this.bg1.y = 241;
        }
    }

    _proto.shouqufun = function () {
        ajax({
            url: web_url + "/game/integral/update",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "收取积分")
                _this.jifen_box.visible = false;
                _this.xiaotanfun(data.info);
                _this.wanjiafun();
                _this.tudifun();
            },
        })
    }

    _proto.haoyoutudishuju = function (data) {
        // console.log("获取好友土地框架", haoyouid)
        this.land_box.visible = true;
        this.mu_box.visible = false;
        this.yu_box.visible = false;
        this.bg1.getChildByName("牧场").visible = false;
        this.bg1.getChildByName("渔场").visible = false;
        this.js_btn.visible = true;
        this.chong_btn.visible = true;
        this.cao_btn.visible = true;
        this.mu_btn.visible = false;
        this.yu_btn.visible = false;

        ajax({
            url: web_url + "/game/frame/list",
            type: 'post',
            data: {
                token: token,
                friend_id: haoyouid,
                // type: 1,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "好友土地")
                if (data.errcode != 10001) {
                    _this.jifen_box.visible = false;

                    // tudishuju = data.data.list;
                    for (var i = 0; i < data.data.list.length; i++) {
                        //土地剩余不显示
                        _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(3).text = "";
                        if (data.data.list[i].g_s_id != 0) {
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).pivot(98.5, 75);
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).pos(85, 20);
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = true;
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).skin = "comp/tree/" + data.data.list[i].g_s_id + "2.png";
                            // _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                        } else {
                            //关闭展示
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = false;
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                        }
                        //debuff
                        if (data.data.list[i].debuff != 0) {
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = true;
                            if (data.data.list[i].debuff == 9) {
                                _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/shui.png";
                            }
                            if (data.data.list[i].debuff == 10) {
                                _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/cao.png";
                            }
                            if (data.data.list[i].debuff == 11) {
                                _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/chong.png";
                            }
                        } else {
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = false;
                        }

                        // if (data.data.list[i].status != 3) {
                        _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(5).visible = false;
                        // } else {
                        //     _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(5).visible = true;
                        // }
                    }
                }
            },
        })
    }

    _proto.touquhaoyoutudi = function (data) {
        // console.log("偷取好友土地数据", touquid)
        // this.yijiantouqu.visible = true;
        ajax({
            url: web_url + "/game/frame/list",
            type: 'post',
            data: {
                token: token,
                friend_id: touquid,
                type: 2,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "偷取土地数据")
                if (data.errcode != 10001) {
                    _this.jifen_box.visible = false;
                    // tudishuju = data.data.list;
                    for (var i = 0; i < data.data.list.length; i++) {
                        _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(3).text = "";
                        if (data.data.list[i].g_s_id != 0) {
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).pivot(98.5, 75);
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).pos(85, 20);
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = true;
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).skin = "comp/tree/" + data.data.list[i].g_s_id + "2.png";
                            // _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                        } else {
                            //关闭展示
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(1).visible = false;
                            _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(4).visible = false;
                        }
                        //debuff
                        // if (data.data.list[i].debuff != 0) {
                        //     _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = true;
                        //     if (data.data.list[i].debuff == 9) {
                        //         _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/shui.png";
                        //     }
                        //     if (data.data.list[i].debuff == 10) {
                        //         _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/cao.png";
                        //     }
                        //     if (data.data.list[i].debuff == 11) {
                        //         _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).skin = "comp/zhuyemian/ui/ui/chong.png";
                        //     }
                        // } else {
                        //     _this.land_box.getChildAt(data.data.list[i].position - 1).getChildAt(2).visible = false;
                        // }

                        //不显示debuff
                        _this.land_box.getChildAt(i).getChildAt(2).visible = false;
                    }
                }
            },
        })
    }

    var isjinbi = false;
    _proto.caijinfun = function (data) {
        // console.log(data, "=======")
        _this.caijin_box.visible = true;
        // _this.caijintxt.text = "恭喜卡卡卡卡卡获得彩金999999元！"
        _this.caijintxt.text = "恭喜玩家" + jianger + "获得彩金" + jiangnum + "金币！";
        isjinbi = true;
        Laya.timer.once(3000, this, function () {
            isjinbi = false;
            caijinnum = 0;
            _this.caijin_box.visible = false;
            if (data == 1) {
                _this.shouci_box.visible = true;
            } else {
                _this.qiandao_box.visible = true;
            }
        })
    }

    _proto.caijinjilu = function () {
        // this.home.getChildByName("彩金记录").visible = true;
        arr_caijin = [];
        // _this.list_caijin.array = arr_caijin;
        ajax({
            url: web_url + "/game/cj/log",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "彩金记录")
                _this.home.getChildByName("彩金记录").visible = true;
                for (var i = 0; i < data.list.length; i++) {
                    arr_caijin.push({
                        id: data.list[i].m_id,
                        nickname: data.list[i].nickname,
                        cjnum: data.list[i].create_date,
                        jine: data.list[i].num,
                    })
                }

                _this.list_caijin.array = arr_caijin;
                _this.list_caijin.selectEnable = true;
                _this.list_caijin.scrollBar.elasticBackTime = 400;
                _this.list_caijin.scrollBar.elasticDistance = 50;
                _this.list_caijin.mouseHandler = new Laya.Handler(_this, onMouse_caijin);
                function onMouse_caijin(e, index) {
                    if (e.type == "click") {
                        // console.log(index)

                    }
                }


            },
        })
    }

    _proto.lingqufun = function () {
        ajax({
            url: web_url + "/member/sign/update",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "领取礼包")
                _this.xiaotanfun(data.info);
                _this.shouci_box.visible = false;
                _this.qiandao_box.visible = true;
            },
        })
    }

    _proto.jinbisheng = function () {
        var randx = Math.floor(Math.random() * 20 + 1);
        imgx = 260 + randx * 39;
        var obs = new Laya.Sprite();
        obs.loadImage("comp/caijin3.png")
        obs.x = imgx;
        obs.y = 260;
        this.caijin_box.addChild(obs);
        this.caijinarr.push(obs);
    }

    _proto.jinbiluo = function () {
        if (this.caijinarr) {
            for (var i = 0; i < _this.caijinarr.length; i++) {
                _this.caijinarr[i].y += 15;
            }
        }
    }

    _proto.yijiantoufun = function () {
        console.log("一键偷取", touquid)
        ajax({
            url: web_url + "/game/steal",
            type: 'post',
            data: {
                token: token,
                tid: touquid,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "偷取")
                // _this.tanfun(data.info);
                if (data.status == 1) {
                    _this.donghuafun(data.info);
                } else {
                    _this.tanfun(data.info);
                }
                // _this.yijiantouqu.disabled = true;
            },
        })
    }

    _proto.donghuafun = function (data) {
        isdonghua = true;
        _this.touqutxt.text = data;
        _this.shentou.x = -329;
        _this.touqudonghua_box.visible = true;
        Laya.Tween.to(this.shentou, { x: 1344 }, 2000);
        Laya.timer.once(2000, this, function () {
            _this.touqudonghua_box.visible = false;
            isdonghua = false;
        })
    }

    _proto.fanhuifun = function () {
        //返回家园
        if (!isdonghua) {
            _this.tudifun();
            _this.wanjiafun();
            _this.bbfun(2);
            _this.fanhuijiayuan.visible = false;
            _this.c_box.visible = true;
            Laya.Tween.to(_this.you_box, { x: 1164 }, 300);
            Laya.Tween.to(_this.zuo_box, { x: 0 }, 300);

            _this.bb_btn.disabled = false;
            _this.chan_btn.disabled = false;
            _this.duihuan.disabled = false;
            ishaoyou = false;
            _this.qiehuan.visible = true;
            // _this.yijiantouqu.visible = false;

            //显示狗 鸟
            _this.goutxt.visible = true;
            //  ==== 隐藏： 鸟
            _this.niao1.visible = false;
            _this.niaotxt1.visible = false;

            // _this.tiyan_btn.visible = true;
        }
    }

    _proto.shixiaofun = function () {
        localStorage.removeItem("token");
        token = "";
        user_id = "";
        //返回登录页面
        _this.home.visible = false;
        _this.dl_box.visible = false;
        denglu = false;
        _this.tanfun("登录失效")
    }

    var bangding1;
    var bangding2;
    var isgou = 0;
    var isniao = 0;
    var lian;
    _proto.wanjiafun = function () {
        // console.log("112345")
        ajax({
            url: web_url + "/member/info",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "用户信息")
                if (data.errcode == 10001) {
                    console.log("失效？")
                    _this.shixiaofun();
                } else {
                    // 用户信息
                    lian = data.data.poster_url;
                    _this.danjia_txt.text = data.data.gd_price;
                    head = "comp/head/head_" + data.data.head_url + ".jpg";
                    user_id = data.data.serial_number;
                    chongzhiid = data.data.serial_number;
                    shouji_num = data.data.phone;
                    bangding1 = data.data.wechat_number;
                    bangding2 = data.data.alipay_number;

                    shuiguo = Number(data.data.shuiguo);
                    gold_num = data.data.gold_num;
                    console.log("vip", data.data.hy)
                    if (data.data.hy == 1) {
                        _this.vip.text = "正式会员";
                    } else {
                        _this.vip.text = "体验会员";
                    }
                    if (data.data.alipay_number != "") {
                        _this.zfb.skin = data.data.alipay_number;
                    }
                    if (data.data.wechat_number != "") {
                        _this.weixin.skin = data.data.wechat_number;
                    }
                    //左上
                    _this.head.skin = head;
                    _this.mingtxt1.text = data.data.nickname;
                    _this.idtxt1.text = data.data.serial_number;
                    _this.jinbitxt1.text = data.data.gold_num;
                    _this.jifentxt1.text = data.data.integral;
                    // 详情
                    _this.head1.skin = head;//详情头像
                    _this.mingtxt2.text = data.data.nickname;
                    _this.idtxt2.text = data.data.serial_number;
                    _this.jinbitxt2.text = data.data.gold_num;
                    _this.jifentxt2.text = data.data.integral;
                    _this.haomatxt2.text = data.data.phone;

                    //商店金币
                    _this.jinbi_shop.text = data.data.gold_num;
                    _this.jifen_shop.text = data.data.integral;
                    //仓库金币
                    _this.jinbi_cangku.text = data.data.gold_num;
                    _this.jifen_cangku.text = data.data.integral;

                    //提现金币
                    _this.czjbtxt.text = data.data.gold_num;
                    if (data.data.bird_day > 0) {
                        _this.niaotxt1.text = "剩余时间" + data.data.bird_day + "天";
                        isniao = 1;
                    } else {
                        _this.niaotxt1.text = "";
                        isniao = 0;
                    }

                    if (data.data.dog_day > 0) {
                        _this.goutxt.text = "剩余时间" + data.data.dog_day + "天";
                        isgou = 1;
                    } else {
                        _this.goutxt.text = "";
                        isgou = 0;
                    }

                    tuiguangerweima = data.data.poster;

                    //充值提现显示金币、显示二维码
                    _this.czjbtxt.text = data.data.gold_num;
                    // 签到显示
                    for (var i = 0; i < 30; i++) {
                        _this.qiandao_box.getChildByName("签到了").getChildAt(i).visible = true;
                    }

                    // 给签到赋值
                    if (data.data.sign_date >= 1) {
                        for (var i = 0; i < data.data.sign_date; i++) {
                            _this.qiandao_box.getChildByName("签到了").getChildAt(i).visible = false;
                        }
                    }

                    _this.duoshaotian.text = data.data.sign_date;

                }
            },
        })
    }

    _proto.shipei = function () {
        // console.log(vw / vh, (1344 / 750 - vh / vw) * vw);
        if (vw / vh < 0.5) {
        }

        //居中显示
        // this.dl_box.getChildByName("登录").x = (1344 - 793) / 2 + (750 / 1344 - vw / vh) * 1344 / 2;//舞台-宽/2：中间位置+偏移
        // this.dl_box.getChildByName("重置密码").x = (1344 - 793) / 2 + (750 / 1344 - vw / vh) * 1344 / 2;

        //屏幕底部
        // this.c_box.y = (750 - 75) + (1344 / 750 - vh / vw) * vw
    }

    _proto.shengfun = function (data, data1) {
        // console.log(data, data1, _this.num);
        _this.land_box.getChildAt(data).getChildAt(1).visible = true;
        _this.land_box.getChildAt(data).getChildAt(1).skin = 'comp/tree/' + data1 + "" + _this.num + '.png';
        _this.land_box.getChildAt(data).getChildAt(1).pivot(98.5, 75);
        _this.land_box.getChildAt(data).getChildAt(1).pos(85, 20);
        _this.num++;
        // _this.tudifun();
        if (_this.num >= 4) {
            Laya.timer.clear(this, _this.shengfun);
            _this.tudifun();
            nengzhong = true;
            // console.log(11233)
        }
    }

    var kaidilei;
    //土地点击
    _proto.dianfun = function (data) {
        // console.log(data)
        this.landid = data;
        kaidilei = 11;
        for (var i = 0; i < 18; i++) {
            this.land_box.getChildAt(i).getChildAt(0).visible = false;//点击选中光圈
            this.land_box.getChildAt(i).getChildAt(3).visible = false;
        }
        this.land_box.getChildAt(data).getChildAt(0).visible = true;//点击选中光圈
        // alert(this.land_box.getChildAt(data).getChildAt(0).visible)
        // console.log(this.landid, "+++++++",this.land_box.getChildAt(data).getChildAt(0).visible)
        this.land_box.getChildAt(data).getChildAt(3).visible = true;
        datanum = data;
        if (this.land_box.getChildAt(data).getChildAt(5).visible) {
            console.log("开地")
            this.kaidibox.visible = true;
            this.kaidibox.getChildByName("文字").text = "当前土地未开启，是否花费" + kaiprice + "金币开启当前土地";
        }
    }



    //牧场点击
    _proto.dianfun1 = function (data) {
        // console.log(data)
        this.muid = data;
        kaidilei = 12;
        for (var i = 0; i < 13; i++) {
            this.mu_box.getChildAt(i).getChildAt(0).visible = false;//点击选中光圈
            this.mu_box.getChildAt(i).getChildAt(3).visible = false;
        }
        this.mu_box.getChildAt(data).getChildAt(0).visible = true;//点击选中光圈
        // alert(this.mu_box.getChildAt(data).getChildAt(0).visible)
        // console.log(this.muid, "+++++++",this.mu_box.getChildAt(data).getChildAt(0).visible)
        this.mu_box.getChildAt(data).getChildAt(3).visible = true;
        datanum = data;
        if (this.mu_box.getChildAt(data).getChildAt(5).visible) {
            console.log("开草地")
            this.kaidibox.visible = true;
            this.kaidibox.getChildByName("文字").text = "当前草地未开启，是否花费" + kaiprice + "金币开启当前草地";
        }
    }

    //渔场点击
    _proto.dianfun2 = function (data) {
        // console.log(data)
        this.yuid = data;
        kaidilei = 13;
        for (var i = 0; i < 18; i++) {
            this.yu_box.getChildAt(i).getChildAt(0).visible = false;//点击选中光圈
            this.yu_box.getChildAt(i).getChildAt(3).visible = false;
        }
        this.yu_box.getChildAt(data).getChildAt(0).visible = true;//点击选中光圈
        // alert(this.yu_box.getChildAt(data).getChildAt(0).visible)
        // console.log(this.yuid, "+++++++",this.yu_box.getChildAt(data).getChildAt(0).visible)
        this.yu_box.getChildAt(data).getChildAt(3).visible = true;
        datanum = data;
        if (this.yu_box.getChildAt(data).getChildAt(5).visible) {
            console.log("开池塘")
            this.kaidibox.visible = true;
            this.kaidibox.getChildByName("文字").text = "当前池塘未开启，是否花费" + kaiprice + "金币开启当前池塘";
        }
    }

    _proto.quxiaoxuanzhong = function () {
        // alert(123)
        for (var i = 0; i < 18; i++) {
            this.land_box.getChildAt(i).getChildAt(0).visible = false;//点击选中光圈
            this.land_box.getChildAt(i).getChildAt(3).visible = false;//点击选中文字
        }

        for (var i = 0; i < 13; i++) {
            this.mu_box.getChildAt(i).getChildAt(0).visible = false;//点击选中光圈
            this.mu_box.getChildAt(i).getChildAt(3).visible = false;//点击选中文字
        }
        for (var i = 0; i < 18; i++) {
            this.yu_box.getChildAt(i).getChildAt(0).visible = false;//点击选中光圈
            this.yu_box.getChildAt(i).getChildAt(3).visible = false;//点击选中文字
        }
    }

    _proto.dlfun = function () {
        // console.log("登录游戏")
        ajax({
            url: web_url + "/login",
            type: 'post',
            data: {
                mktoken:mktoken,
                account:account,
                unionid:unionid,
                parent_id:parent_id,
                nickname:nickname,
                //account: _this.zhtxt.text,
                //password: _this.mmtxt.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "登录")
                // 登录成功
                if (data.status == 1) {
                     console.log("登录方式二登录成功")
                    token = data.token;
                    denglu = true;
                    console.log(token)
                    localStorage.setItem('token', JSON.stringify(token));
                    localStorage.setItem('mktoken', mktoken);
                    console.log(localStorage.getItem('token'))
                    var ishave = false;//账号是否相同
                    var ishave1 = false;//密码是否相同
                    var ishave2 = false;//是否记住密码，isjizhu是否一样
                    for (var i = 0; i < dengluarr.length; i++) {
                        if (_this.zhtxt.text == dengluarr[i].u) {
                            ishave = true;
                        }
                        if (_this.mmtxt.text == dengluarr[i].p) {
                            ishave1 = true;
                        }
                        if (isjizhu == dengluarr[i].isjizhu) {
                            ishave2 = true;
                        }
                    }
                    if (!ishave) {
                        dengluarr.push({
                            u: _this.zhtxt.text, p: isjizhu == 1 ? _this.mmtxt.text : "", isjizhu: isjizhu
                        })
                    }
                    if (ishave && !ishave1 || ishave && !ishave2) {
                        // console.log(123)
                        for (var i = 0; i < dengluarr.length; i++) {
                            if (_this.zhtxt.text == dengluarr[i].u) {
                                // console.log(isjizhu)
                                dengluarr[i].u = _this.zhtxt.text;
                                dengluarr[i].p = isjizhu == 1 ? _this.mmtxt.text : "";
                                dengluarr[i].isjizhu = isjizhu;
                            }
                        }
                    }
                    localStorage.setItem('dengluarr', JSON.stringify(dengluarr));
                    _this.wanjiafun();
                    _this.tudifun();
                    _this.bbfun(2);
                    _this.yinyue();
                    _this.collectedfun(0);
                    _this.dl_box.visible = false;
                    _this.home.visible = true;
                } else {
                    _this.tanfun(data.info);
                }
            },
        })
    }

    //===待收取肥料列表
    _proto.collectedfun = function(data){
        //好友id，自己农场传0，进入好友农场传好友id
//{
// 	"errcode": 0,
// 	"errmsg": "",
// 	"status": 1,
// 	"info": "查询成功",
// 	"list": [
// 		{
// 			"id": 116,/*待收取肥料id*/
// 			"collect_num": 48,/*可收取数量*/
// 			"steal_num": 2,/*可偷取数量*/
// 			"steal_m_id": 9/*偷取人id，等于0可偷取，大于0不可偷取*/
// 		}
// 	]
// }
        ajax({
            url: web_url + "/game/fertilizer/list",
            type: 'post',
            data: {
                token:token,
                friend_id:data,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "待收取肥料列表")
                // 请求成功
                if (data.status == 1) {
                  
                    for (var i = 0; i < data.list.length; i++) {
                        console.log(data.list[i]);
                    }
                  
                  
                    // _this.wanjiafun();
                    // _this.tudifun();
                    // _this.bbfun(2);
                    // _this.yinyue();
                    // _this.dl_box.visible = false;
                    // _this.home.visible = true;
                } else {
                     
                }
            },
        })
    }

    var isdian = false;
    _proto.choosefun = function () {
        // console.log("选择账号")
        if (!isdian) {
            this.zhanghao_box.visible = true;
            isdian = true;
        } else {
            this.zhanghao_box.visible = false;
            isdian = false;
        }

        arr_zhanghao = [];
        for (var i = 0; i < dengluarr.length; i++) {
            arr_zhanghao.push({
                账号: dengluarr[i].u,
                zhanghao: dengluarr[i].u,
                pass: dengluarr[i].p,
                isjizhu: dengluarr[i].isjizhu,
            })
        }

        // 给list_zhanghao赋值更改list_zhanghao的显示
        this.list_zhanghao.array = arr_zhanghao;
        this.list_zhanghao.selectEnable = true;
        this.list_zhanghao.scrollBar.elasticBackTime = 400;
        this.list_zhanghao.scrollBar.elasticDistance = 50;
        this.list_zhanghao.mouseHandler = new Laya.Handler(this, onMouse_zhanghao);
        function onMouse_zhanghao(e, index) {
            if (e.type == "click") {
                // console.log(index)
                this.zhtxt.text = arr_zhanghao[index].zhanghao;
                this.mmtxt.text = arr_zhanghao[index].pass;
                this.zhanghao_box.visible = false;
                if (arr_zhanghao[index].isjizhu == 1) {
                    isjizhu = 1;
                    this.duihao.visible = true;//记住密码打钩
                } else {
                    isjizhu = 2;
                    this.duihao.visible = false;//不记住密码
                }
            }
        }
    }

    _proto.chooseguan = function () {
        // console.log("关闭选择账号")
        this.zhanghao_box.visible = false;
        isdian = false;
    }

    _proto.wjmmfun = function () {
        // console.log("忘记密码")
        this.dl_box.getChildByName("重置密码").visible = true;
    }

    _proto.jzmmfun = function () {
        // console.log("记住密码")
        if (isjizhu == 2) {
            this.duihao.visible = true;
            isjizhu = 1;
        } else {
            this.duihao.visible = false;
            isjizhu = 2;
        }
    }

    _proto.fsfun = function () {
        // console.log("获取验证码")
        ajax({
            url: web_url + "/tool/code",
            type: 'post',
            data: {
                token: token,
                phone: _this.zhtxt1.text
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "获取验证码")
                _this.xiaotanfun(data.msg);
            },
        })
    }

    _proto.fsfun1 = function () {
        // console.log("获取验证码")
        ajax({
            url: web_url + "/tool/code",
            type: 'post',
            data: {
                token: token,
                phone: _this.huishou.text
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "获取验证码")
                _this.xiaotanfun(data.msg);
            },
        })
    }

    _proto.pingzhengfun = function () {
        console.log("凭证")
        ajax({
            url: web_url + "/trade/gd/pz",
            type: 'post',
            data: {
                token: token,
                image: _this.pingzheng.skin,
                id: dakuanid,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "凭证")
                _this.tanfun(data.info);
            },
        })
    }


    _proto.czmmqdfun = function () {
        // console.log("确认重置密码")
        _this.wanjiafun();
        ajax({
            url: web_url + "/member/back/pwd",
            type: 'post',
            data: {
                account: _this.zhtxt1.text,
                password: _this.qrcztxt1.text,
                code: _this.yzmtxt1.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                _this.tanfun(data.info);
                if (data.status == 1) {
                    _this.gbfun(2);
                }
            },
        })
    }

    _proto.tanfun = function (data) {
        _this.ts_box.visible = true;
        if (data == undefined) {
            _this.ts_txt.text = "登录失效";
        } else {
            _this.ts_txt.text = data;
        }
        Laya.timer.once(2000, this, function () {
            _this.ts_box.visible = false;
        })
    }

    _proto.xiaotanfun = function (data) {
        console.log(data)
        _this.xiaotishi_box.visible = true;
        if (data == undefined) {
            _this.xiaotishi.text = "登录失效";
        } else {
            _this.xiaotishi.text = data;
        }
        Laya.timer.once(1000, this, function () {
            _this.xiaotishi_box.visible = false;
        })
    }

    _proto.qiandaofun = function (data) {
        console.log(data)
        _this.wanjiafun();
        ajax({
            url: web_url + "/game/sign",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "确定签到")
                _this.tanfun(data.info);
                if (data.status == 1) {
                    _this.wanjiafun();
                    _this.bbfun(2);
                    // _this.qdcg_box.visible = true;
                    // Laya.timer.once(1500, _this, function () {
                    //     _this.qdcg_box.visible = false;
                    //     _this.qiandao_box.visible = false;
                    // })
                } else {
                    // _this.tanfun(data.info);
                }

            },
        })
    }
    var isgonggao = false;
    _proto.gbfun = function (data) {
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/guanbi.wav", 1);//音效
        }
        if (data == 1) {
            // console.log("关闭登录页面")
        }
        if (data == 2) {
            // console.log("关闭重置密码")
            this.dl_box.getChildByName("重置密码").visible = false;
        }
        if (data == 3) {
            // console.log("关闭种子背包")
            this.bb_box.visible = false;
        }
        if (data == 4) {
            // console.log("关闭仓库")
            this.ck_box.visible = false;
        }
        if (data == 5) {
            // console.log("关闭商店")
            this.sd_box.visible = false;
            this.bbfun(2);
        }
        if (data == 6) {
            // console.log("关闭规则")
            this.shuoming_box.visible = false;
        }
        if (data == 7) {
            // console.log("关闭信封")
            this.xinfeng_box.visible = false;
        }
        if (data == 8) {
            // console.log("关闭留言")
            this.liuyan_box.visible = false;
        }
        if (data == 9) {
            // console.log("关闭设置")
            this.gerenzhongxin_box.visible = false;
            this.shezhiyinyue();
        }
        if (data == 10) {
            // console.log("关闭记录")
            this.jilu_box.visible = false;
        }
        if (data == 11) {
            // console.log("关闭抽奖")
            this.choujiang_box.visible = false;
        }
        if (data == 12) {
            this.qiandao_box.visible = false;
        }
        if (data == 13) {
            this.haoyou_box.visible = false;
            isgonggao = false;
        }
        if (data == 14) {
            this.zhuanzhang_box.visible = false;
        }
        if (data == 15) {
            this.chongzhi_box.visible = false;
        }
        if (data == 16) {
            this.duihuan_box.visible = false;
        }
        if (data == 17) {
            this.gaiming_box.visible = false;
        }
        if (data == 18) {
            this.xiaoyouxi_box.visible = false;
        }
        if (data == 19) {
            this.xinfeng_box.getChildByName("详情").visible = false;
        }
        if (data == 20) {
            this.home.getChildByName("彩金记录").visible = false;
        }
        if (data == 22) {
            this.xianshi_box.visible = false;
        }
        if (data == 33) {
            this.ewm_box.visible = false;
        }
        if (data == 34) {
            this.ph_box.visible = false;
        }
        if (data == 35) {
            this.renwu_box.visible = false;
        }
        if (data == 36) {
            this.maimai_box.visible = false;
            _this.wanjiafun();
        }
        if (data == 37) {
            this.xinhaoyou_box.visible = false;
        }
        if (data == 38) {
            this.shouchong_box.visible = false;
        }
        if (data == 39) {
            this.shangcheng_box.visible = false;
        }
        if (data == 40) {
            this.tianxie_box.visible = false;
        }
    }

    _proto.bbfun = function (data) {
        // console.log("打开背包")
        // _this.wanjiafun();
        kaidilei = this.land_box.visible ? 11 : this.mu_box.visible ? 12 : 13;
        if (data == 1) {
            //打开种子背包
            arr_beibao = [];
            ajax({
                url: web_url + "/game/bag",
                type: 'post',
                data: {
                    token: token,
                    type_id: kaidilei,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "打开背包")
                    _this.bb_box.visible = true;
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].num > 0) {
                            arr_beibao.push({
                                zzid: data.list[i].id,
                                zztu: "comp/tree/daoju/" + data.list[i].id + ".png",
                                zznum: data.list[i].num,
                                zzming: data.list[i].title,
                            })
                        }
                    }
                    // 给list_beibao赋值更改list_beibao的显示
                    _this.list_beibao.array = arr_beibao;
                    _this.list_beibao.selectEnable = true;
                    _this.list_beibao.scrollBar.elasticBackTime = 400;
                    _this.list_beibao.scrollBar.elasticDistance = 50;
                    _this.list_beibao.mouseHandler = new Laya.Handler(_this, onMouse_beibao);
                    function onMouse_beibao(e, index) {
                        if (e.type == "click") {
                            // console.log(arr_beibao[index].zzid)
                            zhongziid = arr_beibao[index].zzid;
                            // 种植接口
                            // console.log(zhonglejikuai, "__________", nengzhong)
                            if (nengzhong == true) {
                                if (kaidilei == 11) {
                                    ajax({
                                        url: web_url + "/game/plant",
                                        type: 'post',
                                        data: {
                                            token: token,
                                            f_id: _this.landid + 1,
                                            s_id: zhongziid,
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            var data = JSON.parse(data);
                                            // console.log(data, "种植")
                                            _this.bb_box.visible = false;
                                            // _this.tanfun(data.info);
                                            if (data.status == 1) {
                                                nengzhong = false;
                                                // _this.land.getChildAt(_this.landid).getChildAt(1).visible = true;
                                                _this.land_box.getChildAt(_this.landid).getChildAt(1).pivot(22.5, 11.5);
                                                _this.land_box.getChildAt(_this.landid).getChildAt(1).pos(94, 53);

                                                _this.num = 0;
                                                _this.land_box.getChildAt(_this.landid).getChildAt(1).skin = "comp/zhongzi/zhongzi.png";
                                                _this.land_box.getChildAt(_this.landid).getChildAt(1).visible = true;
                                                Laya.timer.loop(1000, this, _this.shengfun, [_this.landid, zhongziid]);
                                                // _this.tudifun();
                                                // _this.land_box.getChildAt(_this.landid).getChildAt(4).skin = "comp/tree/donghua/" + arr_beibao[index].zzid + ".png";
                                                // _this.land_box.getChildAt(_this.landid).getChildAt(4).visible = true;
                                                // _this.land_box.getChildAt(_this.landid).getChildAt(4).autoPlay = true;
                                                // _this.land_box.getChildAt(_this.landid).getChildAt(4).interval = 500;
                                                // Laya.timer.once(1400, _this, function () {
                                                //     _this.land_box.getChildAt(_this.landid).getChildAt(4).autoPlay = false;
                                                // })

                                            } else {
                                                _this.tanfun(data.info);
                                            }
                                        },
                                    })
                                }
                                if (kaidilei == 12) {
                                    ajax({
                                        url: web_url + "/game/animal/plant",
                                        type: 'post',
                                        data: {
                                            token: token,
                                            f_id: _this.muid + 1,
                                            s_id: zhongziid,
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            var data = JSON.parse(data);
                                            console.log(data, "种植")
                                            _this.bb_box.visible = false;
                                            // _this.tanfun(data.info);
                                            if (data.status == 1) {
                                                _this.muchangfun();
                                            } else {
                                                _this.tanfun(data.info);
                                            }
                                        },
                                    })
                                }
                                if (kaidilei == 13) {
                                    ajax({
                                        url: web_url + "/game/fish/plant",
                                        type: 'post',
                                        data: {
                                            token: token,
                                            f_id: _this.yuid + 1,
                                            s_id: zhongziid,
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            var data = JSON.parse(data);
                                            // console.log(data, "种植")
                                            _this.bb_box.visible = false;
                                            // _this.tanfun(data.info);
                                            if (data.status == 1) {
                                                _this.yuchangfun();
                                            } else {
                                                _this.tanfun(data.info);
                                            }
                                        },
                                    })
                                }
                            }

                            if (arr_beibao[index].zzid == 7) {
                                //喂狗
                                _this.bb_box.visible = false;
                                _this.goufun();
                            }
                            if (arr_beibao[index].zzid == 8) {
                                //喂鸟
                                _this.bb_box.visible = false;
                                _this.niaofun();
                            }
                        }
                    }
                },
            })
        } else {
            //刷新道具数据
            ajax({
                url: web_url + "/game/bag",
                type: 'post',
                data: {
                    token: token,
                    type_id: 2,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "获取道具数量")
                    // 道具数量赋值
                    if (data.errcode != 10001) {
                        for (var i = 0; i < data.list.length; i++) {
                            if (data.list[i].id == 7) {
                                //狗粮
                            }
                            if (data.list[i].id == 8) {
                                //鸟粮
                            }
                            if (data.list[i].id == 9) {
                                _this.shuinum.text = data.list[i].num;
                            }
                            if (data.list[i].id == 10) {
                                _this.caonum.text = data.list[i].num;
                            }
                            if (data.list[i].id == 11) {
                                _this.chongnum.text = data.list[i].num;
                            }
                            if (data.list[i].id == 24) {
                                _this.munum.text = data.list[i].num;
                            }
                            if (data.list[i].id == 25) {
                                _this.yunum.text = data.list[i].num;
                            }
                        }
                    }
                },
            })
        }
    }

    _proto.muweifun = function () {
        if (!ishaoyou) {
            ajax({
                url: web_url + "/game/animal/update",
                type: 'post',
                data: {
                    token: token,
                    f_id: _this.muid + 1,
                    // friend_id:,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "浇水")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/jiaoshui.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        _this.wanjiafun();
                        _this.muchangfun();
                        _this.mu_box.getChildAt(_this.muid).getChildAt(2).visible = false;
                    }
                },
            })
        } else {
            // console.log(111)
            ajax({
                url: web_url + "/game/frame/update",
                type: 'post',
                data: {
                    token: token,
                    f_id: _this.muid + 1,
                    friend_id: haoyouid,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "给好友浇水")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/jiaoshui.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        // _this.wanjiafun();
                        // _this.haoyoutudishuju(haoyouid)
                        _this.mu_box.getChildAt(_this.muid).getChildAt(2).visible = false;
                    }
                },
            })
        }
    }

    _proto.yuweifun = function () {
        if (!ishaoyou) {
            ajax({
                url: web_url + "/game/fish/update",
                type: 'post',
                data: {
                    token: token,
                    f_id: _this.yuid + 1,
                    // friend_id:,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "浇水")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/jiaoshui.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        _this.wanjiafun();
                        _this.yuchangfun();
                        _this.yu_box.getChildAt(_this.yuid).getChildAt(2).visible = false;
                    }
                },
            })
        } else {
            // console.log(111)
            ajax({
                url: web_url + "/game/frame/update",
                type: 'post',
                data: {
                    token: token,
                    f_id: _this.yuid + 1,
                    friend_id: haoyouid,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "给好友浇水")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/jiaoshui.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        // _this.wanjiafun();
                        // _this.haoyoutudishuju(haoyouid)
                        _this.yu_box.getChildAt(_this.yuid).getChildAt(2).visible = false;
                    }
                },
            })
        }
    }


    _proto.jsfun = function () {
        // console.log(" ++++++",this.landid)
        // _this.wanjiafun();
        if (!ishaoyou) {
            ajax({
                url: web_url + "/game/frame/update",
                type: 'post',
                data: {
                    token: token,
                    type: 9,
                    f_id: _this.landid + 1,
                    // friend_id:,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "浇水")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/jiaoshui.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        _this.wanjiafun();
                        _this.tudifun();
                        _this.land_box.getChildAt(_this.landid).getChildAt(2).visible = false;
                    }
                },
            })
        } else {
            // console.log(111)
            ajax({
                url: web_url + "/game/frame/update",
                type: 'post',
                data: {
                    token: token,
                    type: 9,
                    f_id: _this.landid + 1,
                    friend_id: haoyouid,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "给好友浇水")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/jiaoshui.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        // _this.wanjiafun();
                        // _this.haoyoutudishuju(haoyouid)
                        _this.land_box.getChildAt(_this.landid).getChildAt(2).visible = false;
                    }
                },
            })
        }
    }

    _proto.chongfun = function () {
        // console.log("除虫")
        // _this.wanjiafun();
        if (!ishaoyou) {
            ajax({
                url: web_url + "/game/frame/update",
                type: 'post',
                data: {
                    token: token,
                    type: 11,
                    f_id: _this.landid + 1,
                    // friend_id:,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "除虫")
                    // _this.tanfun(data.info);
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/chuchong.wav", 1);//音效
                    }
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        _this.wanjiafun();
                        _this.tudifun();
                        _this.land_box.getChildAt(_this.landid).getChildAt(2).visible = false;
                    }
                },
            })
        } else {
            ajax({
                url: web_url + "/game/frame/update",
                type: 'post',
                data: {
                    token: token,
                    type: 11,
                    f_id: _this.landid + 1,
                    friend_id: haoyouid,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "给好友除虫")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/chuchong.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        // _this.wanjiafun();
                        _this.land_box.getChildAt(_this.landid).getChildAt(2).visible = false;
                    }
                },
            })
        }
    }

    _proto.caofun = function () {
        // console.log("除草",ishaoyou)
        // _this.wanjiafun();
        if (!ishaoyou) {
            ajax({
                url: web_url + "/game/frame/update",
                type: 'post',
                data: {
                    token: token,
                    type: 10,
                    f_id: _this.landid + 1,
                    // friend_id:,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "除草")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/chucao.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        _this.wanjiafun();
                        _this.tudifun();
                        _this.land_box.getChildAt(_this.landid).getChildAt(2).visible = false;
                    }
                },
            })
        } else {
            ajax({
                url: web_url + "/game/frame/update",
                type: 'post',
                data: {
                    token: token,
                    type: 10,
                    f_id: _this.landid + 1,
                    friend_id: haoyouid,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "给好友除草")
                    if (yinxiao == 1) {
                        Laya.SoundManager.playSound("res/chucao.wav", 1);//音效
                    }
                    // _this.tanfun(data.info);
                    _this.xiaotanfun(data.info);
                    if (data.status == 1) {
                        _this.bbfun(2);//获取最新数量
                        // _this.wanjiafun();
                        _this.land_box.getChildAt(_this.landid).getChildAt(2).visible = false;
                    }
                },
            })
        }
    }

    _proto.chanfun = function () {
        // console.log("铲除")
        _this.querenfun(2);
        // _this.wanjiafun();
        // ajax({
        //     url: web_url + "/game/outSeed",
        //     type: 'post',
        //     data: {
        //         token: token,
        //     },
        //     dataType: 'json',
        //     success: function (data) {
        // console.log(data, "铲除")
        //         _this.tanfun(data.info);
        //         if (data.status == 1) {
        //             _this.wanjiafun();
        //             _this.tudifun();
        //         } else {

        //         }
        //     },
        // })
    }

    _proto.shoufun = function () {
        console.log("收获")

        if (chanlei == 1) {
            ajax({
                url: web_url + "/game/profit/update",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "收获作物")
                    _this.tanfun(data.info);
                    if (data.status == 1) {

                        _this.wanjiafun();
                        _this.tudifun();
                    } else {
                        //失败
                    }
                },
            })
        }
        if (chanlei == 2) {
            ajax({
                url: web_url + "/game/profit/animal",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "收获牧场")
                    _this.tanfun(data.info);
                    if (data.status == 1) {

                        _this.wanjiafun();
                        _this.muchangfun();
                    } else {
                        //失败
                    }
                },
            })
        }
        if (chanlei == 3) {
            ajax({
                url: web_url + "/game/profit/fish",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "收获渔场")
                    _this.tanfun(data.info);
                    if (data.status == 1) {

                        _this.wanjiafun();
                        _this.yuchangfun();
                    } else {
                        //失败
                    }
                },
            })
        }
    }



    _proto.adtaskfun = function () {
       console.log("打开adtaskfun")
     // js通信test
         window.NativeBridge.showNativeDialog('1','mid',token,mktoken);
    }
     _proto.adtaskfun = function () {
       console.log("打开adtaskfun")
     // js通信test
         window.NativeBridge.doTask3();
    }
    _proto.ckfun = function () {
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        if (!ishaoyou) {
            // console.log("打开仓库")
            // this.ck_box.getChildByName("未选").getChildAt(0).visible = false;
            // this.ck_box.getChildByName("未选").getChildAt(1).visible = true;
            // this.ck_box.getChildByName("未选").getChildAt(2).visible = true;
            this.cangkufun(1);
        }
    }


    _proto.cangkufun = function (data) {
        // console.log("打开仓库", data)
        _this.wanjiafun();
        arr_cangku = [];
        arr_guoshi = [];
        this.list_cangku.array = arr_cangku;
        this.ck_box.visible = true;
        if (data == 1) {
            //种子仓库 
            ajax({
                url: web_url + "/game/bag",
                type: 'post',
                data: {
                    token: token,
                    type_id: 1,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "打开仓库--种子")
                    _this.ck_box.getChildByName("未选").getChildAt(0).visible = false;
                    _this.ck_box.getChildByName("未选").getChildAt(1).visible = true;
                    // _this.ck_box.getChildByName("未选").getChildAt(2).visible = true;
                    _this.cszz_btn.visible = false;
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].num > 0) {
                            arr_cangku.push({
                                ming: data.list[i].title,
                                // tu: data.list[i].image,
                                tu: "comp/tree/daoju/" + data.list[i].id + ".png",
                                num: data.list[i].num,
                                id: data.list[i].id,
                            });
                        }
                    }
                    // 给list_cangku赋值更改list_cangku的显示
                    _this.list_cangku.array = arr_cangku;
                    _this.list_cangku.selectEnable = true;
                    _this.list_cangku.scrollBar.elasticBackTime = 400;
                    _this.list_cangku.scrollBar.elasticDistance = 50;
                    _this.list_cangku.mouseHandler = new Laya.Handler(_this, onMouse_cangku);
                    function onMouse_cangku(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                        }
                    }
                },
            })

        }
        if (data == 2) {
            //道具仓库
            ajax({
                url: web_url + "/game/bag",
                type: 'post',
                data: {
                    token: token,
                    type_id: 2,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "打开仓库--道具")
                    _this.ck_box.getChildByName("未选").getChildAt(0).visible = true;
                    _this.ck_box.getChildByName("未选").getChildAt(1).visible = false;
                    // _this.ck_box.getChildByName("未选").getChildAt(2).visible = true;
                    _this.cszz_btn.visible = false;
                    for (var i = 0; i < data.list.length; i++) {
                        if (data.list[i].num > 0) {
                            arr_cangku.push({
                                ming: data.list[i].title,
                                // tu: data.list[i].image,
                                tu: "comp/tree/daoju/" + data.list[i].id + ".png",
                                num: data.list[i].num,
                                id: data.list[i].id,
                            });
                        }
                    }
                    // 给list_cangku赋值更改list_cangku的显示
                    _this.list_cangku.array = arr_cangku;
                    _this.list_cangku.selectEnable = true;
                    _this.list_cangku.scrollBar.elasticBackTime = 400;
                    _this.list_cangku.scrollBar.elasticDistance = 50;
                    _this.list_cangku.mouseHandler = new Laya.Handler(_this, onMouse_cangku);
                    function onMouse_cangku(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                        }
                    }
                },
            })
        }
        if (data == 3) {
            // console.log(arr_guoshi, "++++++++")
            ajax({
                url: web_url + "/game/stock",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "打开仓库--果实")
                    _this.ck_box.getChildByName("未选").getChildAt(0).visible = true;
                    _this.ck_box.getChildByName("未选").getChildAt(1).visible = true;
                    _this.ck_box.getChildByName("未选").getChildAt(2).visible = false;
                    _this.cszz_btn.visible = true;
                    for (var i = 0; i < data.list.length; i++) {
                        arr_cangku.push({
                            // ming: data.list[i].title = data.list[i].title == "一级种子" ? "一级果实" : data.list[i].title == "二级种子" ? "二级果实" : "三级果实",
                            ming: data.list[i].title = data.list[i].title == "辣椒种子" ? "辣椒果实" : data.list[i].title == "胡萝卜种子" ? "胡萝卜果实" : data.list[i].title == "番茄种子" ? "番茄果实" : data.list[i].title == "南瓜种子" ? "南瓜果实" : data.list[i].title == "雏菊种子" ? "雏菊果实" : "郁金香果实",
                            tu: "comp/tree/daoju/" + data.list[i].id + ".png",
                            num: data.list[i].num,
                            // id: data.list[i].id,
                        });
                        arr_guoshi.push(data.list[i].id)
                    }
                    // console.log(arr_guoshi)
                    // 给list_cangku赋值更改list_cangku的显示
                    _this.list_cangku.array = arr_cangku;
                    _this.list_cangku.selectEnable = true;
                    _this.list_cangku.scrollBar.elasticBackTime = 400;
                    _this.list_cangku.scrollBar.elasticDistance = 50;
                    _this.list_cangku.mouseHandler = new Laya.Handler(_this, onMouse_cangku);
                    function onMouse_cangku(e, index) {
                        if (e.type == "click") {
                            // console.log(index,"++=====++",arr_guoshi)
                        }
                    }
                },
            })
        }
    }

    _proto.chushouguoshifun = function () {
        // console.log("出售全部果实")
        _this.wanjiafun();
        ajax({
            url: web_url + "/game/sale",
            type: 'post',
            data: {
                token: token,
                s_id: arr_guoshi,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "出售果实")
                _this.tanfun(data.info);
                _this.cangkufun(3);
            },
        })
    }

    _proto.sdfun = function () {
        // console.log(ishaoyou)
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        if (!ishaoyou) {
            // console.log("打开商店")
            this.sd_box.visible = true;
            this.shangdianfun(1);
            //================隐藏商店中 tab标签   start  ========================
 
            for (var i = 0; i < 3; i++) {
                this.sd_box.getChildByName("未选").getChildAt(i).visible = true;
            }
            this.sd_box.getChildByName("未选").getChildAt(0).visible = false;

              this.sd_box.getChildByName("未选").getChildAt(2).visible = false;
                this.sd_box.getChildByName("选中").getChildAt(2).visible = false;



            //===============隐藏商店中tab标签  end  ==================================
        }
    }

    function clear(str) {
        str = str.replace(/,/g, "");//取消字符串中出现的所有逗号 
        return str;
    }

    _proto.shangdianfun = function (data) {
        // console.log("打开商店", data)
        _this.wanjiafun();
        for (var i = 0; i < 2; i++) {
            this.sd_box.getChildByName("未选").getChildAt(i).visible = true;
        }
        arr_shop = [];
        this.list_shop.array = arr_shop;
        if (data == 1) {
            this.sd_box.getChildByName("未选").getChildAt(0).visible = false;
            // 种子
            ajax({
                url: web_url + "/game/seed",
                type: 'post',
                data: {
                    token: token,
                    type_id: 1,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "种子商店")
                    for (var i = 0; i < data.list.length; i++) {
                        arr_shop.push({
                            // tu: data.list[i].image,
                            tu: "comp/tree/daoju/" + data.list[i].id + ".png",
                            ming: data.list[i].title,
                            num: "售价" + data.list[i].total_num,  //===修改商店 种子售价 参数取值 gold_num
                            id: data.list[i].id,
                           // info: "每天12点产出" + Math.floor(clear(data.list[i].profit_out) / 30 * 100) / 100 + " 30天产出" + data.list[i].profit_out,
                        })
                    }
                    // 给list_shop赋值更改list_shop的显示
                    _this.list_shop.array = arr_shop;
                    _this.list_shop.selectEnable = true;
                    _this.list_shop.scrollBar.elasticBackTime = 400;
                    _this.list_shop.scrollBar.elasticDistance = 50;
                    _this.list_shop.mouseHandler = new Laya.Handler(_this, onMouse_shop);
                    function onMouse_shop(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                            if (e.target.name == "购买") {
                                // console.log("购买", arr_shop[index].id)
                                ajax({
                                    url: web_url + "/game/buy",
                                    type: 'post',
                                    data: {
                                        token: token,
                                        id: arr_shop[index].id,
                                        num: 1,
                                    },
                                    dataType: 'json',
                                    success: function (data) {
                                        var data = JSON.parse(data);
                                        // console.log(data, "购买种子")
                                        // _this.tanfun(data.info);
                                        _this.xiaotanfun(data.info);
                                        _this.wanjiafun();
                                        // _this.bbfun(2);
                                        _this.bb_box.visible = false;
                                    },
                                })
                            }
                        }
                    }
                },
            })
        }

        if (data == 2) {
            this.sd_box.getChildByName("未选").getChildAt(1).visible = false;
            // 宠物
            ajax({
                url: web_url + "/game/seed",
                type: 'post',
                data: {
                    token: token,
                    type_id: 8,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "道具商店")
                    for (var i = 0; i < data.list.length; i++) {
                        arr_shop.push({
                            // tu: data.list[i].image,
                            tu: "comp/tree/daoju/" + data.list[i].id + ".png",
                            ming: data.list[i].title,
                            num: data.list[i].gold_num,
                            id: data.list[i].id,
                            info: ""
                        })
                    }
                    // 给list_shop赋值更改list_shop的显示
                    _this.list_shop.array = arr_shop;
                    _this.list_shop.selectEnable = true;
                    _this.list_shop.scrollBar.elasticBackTime = 400;
                    _this.list_shop.scrollBar.elasticDistance = 50;
                    _this.list_shop.mouseHandler = new Laya.Handler(_this, onMouse_shop);
                    function onMouse_shop(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                            if (e.target.name == "购买") {
                                // console.log("购买", arr_shop[index].id)
                                ajax({
                                    url: web_url + "/game/buy",
                                    type: 'post',
                                    data: {
                                        token: token,
                                        id: arr_shop[index].id,
                                        num: 1,
                                    },
                                    dataType: 'json',
                                    success: function (data) {
                                        var data = JSON.parse(data);
                                        // console.log(data, "购买宠物饲料")
                                        // _this.tanfun(data.info);
                                        _this.xiaotanfun(data.info);
                                        _this.wanjiafun();
                                        // _this.bbfun();
                                        _this.bb_box.visible = false;
                                    },
                                })
                            }
                        }
                    }
                },
            })
        }
        if (data == 3) {
            this.sd_box.getChildByName("未选").getChildAt(2).visible = false;
            // 道具
            ajax({
                url: web_url + "/game/seed",
                type: 'post',
                data: {
                    token: token,
                    type_id: 7,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "宠物商店")
                    for (var i = 0; i < data.list.length; i++) {
                        arr_shop.push({
                            // tu: data.list[i].image,
                            tu: "comp/tree/daoju/" + data.list[i].id + ".png",
                            ming: data.list[i].title,
                            num: data.list[i].gold_num,
                            id: data.list[i].id,
                            info: ""
                        })
                    }
                    // 给list_shop赋值更改list_shop的显示
                    _this.list_shop.array = arr_shop;
                    _this.list_shop.selectEnable = true;
                    _this.list_shop.scrollBar.elasticBackTime = 400;
                    _this.list_shop.scrollBar.elasticDistance = 50;
                    _this.list_shop.mouseHandler = new Laya.Handler(_this, onMouse_shop);
                    function onMouse_shop(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                            if (e.target.name == "购买") {
                                // console.log("购买", arr_shop[index].id)
                                ajax({
                                    url: web_url + "/game/buy",
                                    type: 'post',
                                    data: {
                                        token: token,
                                        id: arr_shop[index].id,
                                        num: 1,
                                    },
                                    dataType: 'json',
                                    success: function (data) {
                                        var data = JSON.parse(data);
                                        // console.log(data, "购买道具")
                                        // _this.tanfun(data.info);
                                        _this.xiaotanfun(data.info);
                                        _this.wanjiafun();
                                        // _this.bbfun();
                                        _this.bb_box.visible = false;
                                    },
                                })
                            }
                        }
                    }
                },
            })
        }
    }

    _proto.gzfun = function () {
        // console.log("打开规则")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        _this.wanjiafun();
        ajax({
            url: web_url + "/setting",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "获取平台信息")
                _this.shuoming_box.visible = true;
                _this.gztxt.text = data.data.rule_info;
            },
        })
    }

    _proto.xffun = function () {
        // console.log("打开信封")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        _this.wanjiafun();
        _this.xinfeng_box.visible = true;
        youjiandangqiannum = 1;
        _this.youjianneirong();
    }

    _proto.upfun = function () {
        // console.log("上一页", youjiandangqiannum, youjianzongnum)
        if (youjiandangqiannum > 1) {
            youjiandangqiannum--;
            _this.youjianneirong();
        }
    }

    _proto.downfun = function () {
        // console.log("下一页", youjiandangqiannum, youjianzongnum)
        if (youjiandangqiannum < youjianzongnum) {
            youjiandangqiannum++;
            _this.youjianneirong();
        }
    }

    _proto.youjianneirong = function () {
        // console.log("邮件", youjiandangqiannum, youjianzongnum)
        arr_xinfeng = [];
        ajax({
            url: web_url + "/notice/list",
            type: 'post',
            data: {
                token: token,
                // curPage: youjiandangqiannum, //当前页数
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "邮件列表")
                // _this.yeshu.text = youjiandangqiannum + "/" + data.allPages;
                // youjianzongnum = data.allPages;

                for (var i = 0; i < data.list.length; i++) {
                    arr_xinfeng.push({
                        // xuhao: data.list[i].id,
                        xuhao: "",
                        biaoti: data.list[i].title,
                        // fasongren: data.list[i].addresser,
                        fasongren: "已回复，查看详情",
                        handle_id: data.list[i].handle_id,
                    })
                }
                _this.list_xinfeng.array = arr_xinfeng;
                _this.list_xinfeng.selectEnable = true;
                _this.list_xinfeng.scrollBar.elasticBackTime = 400;
                _this.list_xinfeng.scrollBar.elasticDistance = 50;
                _this.list_xinfeng.mouseHandler = new Laya.Handler(_this, onMouse_xinfeng);
                function onMouse_xinfeng(e, index) {
                    if (e.type == "click") {
                        // console.log(index);

                        ajax({
                            url: web_url + "/notice/detail",
                            type: 'post',
                            data: {
                                token: token,
                                // type_id: 3,
                                handle_id: data.list[index].handle_id,
                            },
                            dataType: 'json',
                            success: function (data) {
                                var data = JSON.parse(data);
                                // console.log(data, "邮件详情")
                                _this.xinfeng_box.getChildByName("详情").visible = true;
                                _this.wentxt.text = data.data.content;
                                _this.neitongtxt.text = data.data.reply_content;
                            },
                        })
                    }
                }
            },
        })
    }

    _proto.lyfun = function () {
        // console.log("打开留言")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        this.liuyan_box.visible = true;
    }

    _proto.liuyanfun = function () {
        _this.wanjiafun();
        ajax({
            url: web_url + "/notice/add/feedback",
            type: 'post',
            data: {
                token: token,
                content: _this.ly_txt.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "提交留言")
                _this.tanfun(data.info);
                _this.liuyan_box.visible = false;
            },
        })
    }

    _proto.szfun = function () {
        // console.log("打开设置")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        if (!ishaoyou) {
            this.gerenzhongxin_box.visible = true;
            this.yinyue();
            this.shezhifun();
            if (yinyue == 0) {
                this.yinyue_btn.getChildAt(1).visible = true;
            }
            if (yinxiao == 0) {
                this.yinxiao_btn.getChildAt(1).visible = true;
            }
        }
    }

    _proto.shezhifun = function () {
        // console.log("打开设置")
        //==============================设置中内容隐藏 start  =====================================
        for (var i = 0; i < 3; i++) {
             this.gerenzhongxin_box.getChildByName("未选").getChildAt(i).visible = false;
            this.gerenzhongxin_box.getChildByName("选中").getChildAt(i).visible = false;
        }
         this.gerenzhongxin_box.getChildByName("选中").getChildAt(0).visible = true;
        // this.gerenzhongxin_box.getChildByName("未选").getChildAt(0).visible = false;
        // this.gerenzhongxin_box.getChildByName("未选").getChildAt(1).visible = true;
        // this.gerenzhongxin_box.getChildByName("未选").getChildAt(2).visible = true;

       //==============================设置中内容隐藏 end  =====================================
        this.shezhi_box.visible = true;
        this.kefu_box.visible = false;
        this.ewm_qun.visible = false;
    }

    _proto.kefufun = function () {
        // console.log("打开客服")
        // 隐藏：客服tab

        // this.gerenzhongxin_box.getChildByName("未选").getChildAt(0).visible = true;
        // this.gerenzhongxin_box.getChildByName("未选").getChildAt(1).visible = false;
        // this.gerenzhongxin_box.getChildByName("未选").getChildAt(2).visible = true;

        this.shezhi_box.visible = false;
        this.kefu_box.visible = true;
        this.ewm_qun.visible = false;

        ajax({
            url: web_url + "/setting",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // alert(111)
                console.log(data, "获取客服二维码")
                _this.kefu_box.skin = web_url + data.data.image1;
            },
        })
    }

    _proto.qunfun = function () {
        // console.log("打开群二维码")
        this.gerenzhongxin_box.getChildByName("未选").getChildAt(0).visible = true;
        this.gerenzhongxin_box.getChildByName("未选").getChildAt(1).visible = true;

        this.gerenzhongxin_box.getChildByName("未选").getChildAt(2).visible = false;

        this.shezhi_box.visible = false;
        this.kefu_box.visible = false;
        this.ewm_qun.visible = true;

        ajax({
            url: web_url + "/setting",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                _this.ewm_qun.skin = web_url + data.data.image2;
            },
        })
    }

    //1开2关
    _proto.yinyuefun = function () {
        // console.log(yinyue, ",+++++")
        if (yinyue == 1) {
            yinyue = 0;
            this.yinyue_btn.getChildAt(1).visible = true;
            Laya.SoundManager.stopAll(this)
        } else {
            // console.log("放音乐")
            yinyue = 1;
            this.yinyue_btn.getChildAt(1).visible = false;
            Laya.SoundManager.playMusic("res/bgm.mp3", 0);
            Laya.SoundManager.setSoundVolume(1, "res/bgm.mp3");
        }
    }

    _proto.yinxiaofun = function () {
        if (yinxiao == 1) {
            yinxiao = 0;
            this.yinxiao_btn.getChildAt(1).visible = true;
        } else {
            yinxiao = 1;
            this.yinxiao_btn.getChildAt(1).visible = false;
        }
    }

    _proto.shezhiyinyue = function () {
        // console.log(yinyue, yinxiao)
        _this.wanjiafun();
        ajax({
            url: web_url + "/member/update/settings",
            type: 'post',
            data: {
                token: token,
                is_sound: yinyue,//音乐0关1开
                is_effect: yinxiao,//音效
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "修改设置")
            },
        })
    }

    // 获取设置
    _proto.yinyue = function () {
        _this.wanjiafun();
        ajax({
            url: web_url + "/member/get/settings",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "获取设置")
                yinyue = data.is_sound;
                yinxiao = data.is_effect;
                if (yinyue == 0) {
                    // console.log("停")
                    _this.yinyue_btn.getChildAt(1).visible = true;
                    Laya.SoundManager.stopAll(_this)
                } else {
                    // console.log("放音乐")
                    _this.yinyue_btn.getChildAt(1).visible = false;
                    Laya.SoundManager.playMusic("res/bgm.mp3", 0);
                    Laya.SoundManager.setSoundVolume(1, "res/bgm.mp3");
                }
            },
        })
    }

    _proto.bianjifun = function () {
        // console.log("打开编辑")
        this.gaiming_box.visible = true;
    }

    _proto.xiugainicheng = function () {
        ajax({
            url: web_url + "/member/update/nickname",
            type: 'post',
            data: {
                token: token,
                nickname: _this.xinmingzi.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "修改昵称")
                _this.tanfun(data.info);
                _this.gaiming_box.visible = false;
                _this.wanjiafun();
            },
        })
    }

    _proto.touxiangfun = function () {
        this.touxiang_box.visible = true;
        for (var i = 0; i < 12; i++) {
            this.txkuang.getChildAt(i).visible = false;
        }
    }

    var touxiangid;
    _proto.xuanfun = function (data) {
        // console.log(data)
        for (var i = 0; i < 12; i++) {
            this.txkuang.getChildAt(i).visible = false;
        }
        this.txkuang.getChildAt(data).visible = true;
        touxiangid = data + 1;
    }

    _proto.bangdingyanzheng = function () {
        // console.log(shouji_num)
        ajax({
            url: web_url + "/tool/code",
            type: 'post',
            data: {
                token: token,
                phone: shouji_num,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "修改支付获取验证码")
                _this.tanfun(data.msg)
                if (data.code == 1) {
                    _this.jishifun();
                }
            },
        })
    }

    _proto.jishifun = function () {
        _this.bangding_jieshou.visible = false;
        _this.jishinum.text = "60s"
        Laya.timer.loop(1000, this, this.daojishifun);
    }

    var miaonum = 60;
    _proto.daojishifun = function () {
        if (miaonum > 0) {
            miaonum--;
        }
        if (miaonum == 0) {
            Laya.timer.clear(this, this.daojishifun);
            // console.log(123)
            this.bangding_jieshou.visible = true;
            miaonum = 60;
        }
        this.jishinum.text = miaonum + "s";
    }

    _proto.bangdingfun = function () {
        // console.log("打开绑定支付")
        _this.wanjiafun();
        this.bangding_box.visible = true;
        ajax({
            url: web_url + "/member/info",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "获取玩家绑定信息", data.rel_name)
                if (data.errcode != 10001) {
                    // if (data.rel_name != "") {
                    if (data.data.rel_name != null) {
                        _this.zsxmtxt.text = data.data.rel_name;
                    }
                    if (data.data.kh != "") {
                        _this.yhktxt.text = data.data.kh;
                    }
                    if (data.data.khh != "") {
                        _this.khhtxt.text = data.data.khh;
                    }
                    if (data.data.zfb != "") {
                        _this.zfbtxt.text = data.data.zfb;
                    }
                }
            },
        })
    }

    _proto.xuanzetouxiangfun = function () {
        // console.log("确定修改头像")
        _this.wanjiafun();
        ajax({
            url: web_url + "/member/update/head",
            type: 'post',
            data: {
                token: token,
                head_id: touxiangid,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "修改头像")
                _this.touxiang_box.visible = false;
                _this.wanjiafun();
            },
        })
    }

    _proto.querenbangding = function () {
        // console.log("确认绑定")
        _this.wanjiafun();
        ajax({
            url: web_url + "/member/update/pay",
            type: 'post',
            data: {
                token: token,
                alipay_number: zimg,//支付宝二维码
                wechat_number: wimg,//微信
                rel_name: _this.zsxmtxt.text,//姓名
                code: _this.yzmtxt.text,//短信
                kh: _this.yhktxt.text,//微信
                khh: _this.khhtxt.text,//姓名
                zfb: _this.zfbtxt.text,//短信
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "修改支付信息")
                _this.bangding_box.visible = false;
                _this.tanfun(data.info);
            },
        })
    }

    _proto.quxiaobangding = function () {
        this.bangding_box.visible = false;
    }

    _proto.mafun = function () {
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        this.ewm_box.visible = true;
        this.ewm_box.getChildByName("img").skin = tuiguangerweima;
    }

    _proto.cjfun = function () {
        // console.log("打开抽奖")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        _this.wanjiafun();
        ajax({
            url: web_url + "/game/zp/reward",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "奖品列表")
                _this.choujiang_box.visible = true;
                // _this.zhuan.getChildAt(0).text = data.list[0].title;
                // _this.zhuan.getChildAt(1).text = data.list[1].title;
                // _this.zhuan.getChildAt(2).text = data.list[2].title;
                // _this.zhuan.getChildAt(3).text = data.list[3].title;
                // _this.zhuan.getChildAt(4).text = data.list[4].title;
                // _this.zhuan.getChildAt(5).text = data.list[5].title;
                // _this.zhuan.getChildAt(6).text = data.list[6].title;
                // _this.zhuan.getChildAt(7).text = data.list[7].title;
                // _this.zhuan.getChildAt(8).text = data.list[8].title;
                // _this.zhuan.getChildAt(9).text = data.list[9].title;
            },
        })
    }

    var iszhuan = false;
    _proto.choujiangfun = function () {
        if (!iszhuan) {
            iszhuan = true;
            _this.wanjiafun();
            this.zhuan.rotation = 0;
            // console.log(iszhuan)
            ajax({
                url: web_url + "/game/zp/roll",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "抽奖")
                    if (data.status == 1) {
                        _this.wanjiafun();
                        // Laya.Tween.to(_this.zhuan, { rotation: 1080 + 360 - 36 * (data.id - 1) }, 600);
                        Laya.Tween.to(_this.zhuan, { rotation: 1080 + 22.5 + 45 * (data.data.id - 1) }, 600);
                        // Laya.Tween.to(_this.zhuan, { rotation: 1080 }, 600);
                        Laya.timer.once(1600, this, function () {
                            _this.xiaotanfun(data.data.title);
                            iszhuan = false;
                        })
                    } else {
                        _this.tanfun(data.info);
                        iszhuan = false;
                    }
                },
            })
        }
    }

    _proto.qdfun = function () {
        // console.log("打开签到")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        this.qiandao_box.visible = true;

    }

    _proto.hyfun = function () {
        console.log("打开好友")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        // this.xinhaoyou_box.visible = true;
        this.haoyoufun(0);
    }

    _proto.zzfun = function () {
        // console.log("打开转账")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        this.zhuanzhang_box.visible = true;
    }

    _proto.zhuanzhangfun = function () {
        // console.log("确认转账")
        _this.wanjiafun();
        ajax({
            url: web_url + "/game/zz/add",
            type: 'post',
            data: {
                token: token,
                id: _this.zhuanid.text,
                num: _this.zhuannum.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "转账")
                _this.tanfun(data.info);
                _this.wanjiafun();
                _this.zhuanzhang_box.visible = false;
            },
        })
    }

    _proto.jyfun = function () {
        // console.log("打开充值提现")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        this.chongzhi_box.visible = true;
        this.chongzhifun(1);
        this.chongzhileixing(1);
    }

    _proto.chongzhifun = function (data) {
        // console.log("充值/提现")
        if (data == 1) {
            //充值
            // console.log("充值")
            this.cz_biao.visible = true;
            this.tx_biao.visible = false;
            this.chongzhi_box.getChildByName("勾选").visible = false;

            // this.chongzhi_box.getChildByName("未选").getChildAt(0).visible = false;
            // this.chongzhi_box.getChildByName("未选").getChildAt(1).visible = true;
            this.chongzhi_box.getChildByName("方式").visible = true;
            this.chongzhileixing(1);
        } else {
            //提现
            // console.log("提现")
            this.cz_biao.visible = false;
            this.tx_biao.visible = true;
            // this.chongzhi_box.getChildByName("未选").getChildAt(1).visible = false;
            // this.chongzhi_box.getChildByName("未选").getChildAt(0).visible = true;
            this.chongzhi_box.getChildByName("方式").visible = false;

            this.chongzhi_box.getChildByName("客服充值").visible = false;
            this.chongzhi_box.getChildByName("列表充值").visible = false;
            this.chongzhi_box.getChildByName("提现").visible = true;

            this.chongzhi_box.getChildByName("勾选").visible = true;
            this.chongzhi_box.getChildByName("勾选").getChildAt(0).visible = true;
            this.chongzhi_box.getChildByName("勾选").getChildAt(1).visible = false;
            // _this.wanjiafun();//增加充值显示账户金币 增加二维码显示
        }
    }

    var tixianzhanghao = 1;
    _proto.tixianfangshi = function (data) {
        // console.log("选择提现账户")
        if (data == 1) {
            this.chongzhi_box.getChildByName("勾选").getChildAt(0).visible = true;
            this.chongzhi_box.getChildByName("勾选").getChildAt(1).visible = false;
            tixianzhanghao = 1;
        }
        if (data == 2) {
            this.chongzhi_box.getChildByName("勾选").getChildAt(1).visible = true;
            this.chongzhi_box.getChildByName("勾选").getChildAt(0).visible = false;
            tixianzhanghao = 2;
        }
    }

    // _proto.tixianfun = function () {
    //     // bangding1 = ""
    //     // console.log("确认提现")
    //     // 判断是否绑定收款码
    //     if (tixianzhanghao == 1) {
    //         if (bangding1 == "") {
    //             // console.log("上传微信收款码")
    //             _this.chongzhi_box.visible = false;
    //             _this.gerenzhongxin_box.visible = true;
    //             _this.bangdingfun();
    //         } else {
    //             _this.querentixian();
    //         }
    //     } else {
    //         if (bangding2 == "") {
    //             // console.log("上传支付宝收款码")
    //             _this.chongzhi_box.visible = false;
    //             _this.gerenzhongxin_box.visible = true;
    //             _this.bangdingfun();
    //         } else {
    //             _this.querentixian();
    //         }
    //     }
    // }

    // _proto.querentixian = function () {
    //     // console.log(bangding1, bangding2, tixianzhanghao)
    //     ajax({
    //         url: web_url + "/game/withdraw",
    //         type: 'post',
    //         data: {
    //             token: token,
    //             price: _this.tixiantxt.text,
    //             type: tixianzhanghao,
    //         },
    //         dataType: 'json',
    //         success: function (data) {
    //             // console.log(data, "确认提现")
    //             _this.tanfun(data.info);
    //             if (data.status == 1) {
    //                 _this.wanjiafun();
    //             }
    //         },
    //     })
    // }

    _proto.chongzhileixing = function (data) {
        if (data == 1) {
            // console.log("客服充值")
            this.chongzhi_box.getChildByName("方式").getChildByName("未选").getChildAt(0).visible = false;
            this.chongzhi_box.getChildByName("方式").getChildByName("未选").getChildAt(1).visible = true;

            this.chongzhi_box.getChildByName("客服充值").visible = true;
            this.chongzhi_box.getChildByName("列表充值").visible = false;
            this.chongzhi_box.getChildByName("提现").visible = false;

            ajax({
                url: web_url + "/setting",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // alert(111)
                    console.log(data, "获取客服充值二维码")
                    _this.kefuchongzhi.skin = web_url + data.data.image;
                },
            })

        } else {
            // console.log("列表充值")
            this.chongzhi_box.getChildByName("方式").getChildByName("未选").getChildAt(0).visible = true;
            this.chongzhi_box.getChildByName("方式").getChildByName("未选").getChildAt(1).visible = false;

            this.chongzhi_box.getChildByName("客服充值").visible = false;
            this.chongzhi_box.getChildByName("列表充值").visible = true;
            this.chongzhi_box.getChildByName("提现").visible = false;

            arr_chongzhi = [];
            ajax({
                url: web_url + "/game/recharge/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "充值列表")
                    for (var i = 0; i < data.list.length; i++) {
                        arr_chongzhi.push({
                            num1: data.list[i].price + "￥",
                            num2: data.list[i].in_price,
                            id: data.list[i].id,
                        })
                    }
                    _this.list_chongzhi.array = arr_chongzhi;
                    _this.list_chongzhi.selectEnable = true;
                    _this.list_chongzhi.scrollBar.elasticBackTime = 400;
                    _this.list_chongzhi.scrollBar.elasticDistance = 50;
                    _this.list_chongzhi.mouseHandler = new Laya.Handler(_this, onMouse_chongzhi);
                    function onMouse_chongzhi(e, index) {
                        if (e.type == "click") {
                            if (e.target.name == "购买") {
                                // console.log(arr_chongzhi[index].id, chongzhiid)
                                zhifu(arr_chongzhi[index].id, chongzhiid)
                            }
                        }
                    }
                },
            })
        }
    }

    _proto.jlfun = function () {
        // console.log("打开记录")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        this.jilufun(1);
        for (var i = 0; i < 2; i++) {
            this.jilu_box.getChildByName("未选").getChildAt(i).visible = true;
        }
        this.jilu_box.getChildByName("未选").getChildAt(0).visible = false;
        this.head_box.getChildByName("未选").getChildAt(0).visible = false;
    }

    _proto.jilufun = function (data) {
        console.log("打开记录", data)
        this.jilu_box.visible = true;
        this.head_box.visible = false;
        this.jilu_box.getChildByName("偷取头部").visible = false;
        this.jilu_box.getChildByName("交易头部").visible = false;
        if (data == 1) {
            console.log("打开记录")
            this.head_box.visible = true;
            this.jl_biao.visible = true;
            this.tqjl_biao.visible = false;
            this.jyjl_biao.visible = false;
            this.jilu_box.getChildByName("偷取头部").visible = false;
            this.jilu_box.getChildByName("交易头部").visible = false;
            for (var i = 0; i < 2; i++) {
                this.jilu_box.getChildByName("未选").getChildAt(i).visible = true;
            }
            this.jilu_box.getChildByName("未选").getChildAt(0).visible = false;
            _this.biaotilan.getChildAt(0).text = "转账人"
            _this.biaotilan.getChildAt(1).text = "接收人"
            _this.biaotilan.getChildAt(2).text = "金币"
            _this.biaotilan.getChildAt(3).text = "状态"
            _this.biaotilan.getChildAt(4).text = ""
            _this.jilufunxiangqing(1);
        }
        if (data == 2) {
            // console.log("打开偷取记录")
            this.jl_biao.visible = false;
            this.tqjl_biao.visible = true;
            this.jyjl_biao.visible = false;
            this.jilu_box.getChildByName("偷取头部").visible = true;
            this.jilu_box.getChildByName("交易头部").visible = false;
            this.jilu_box.getChildByName("偷取头部").getChildByName("未选").getChildAt(0).visible = false;
            this.jilu_box.getChildByName("偷取头部").getChildByName("未选").getChildAt(1).visible = true;
            arr_jilu = [];
            for (var i = 0; i < 2; i++) {
                this.jilu_box.getChildByName("未选").getChildAt(i).visible = true;
            }
            this.jilu_box.getChildByName("未选").getChildAt(1).visible = false;
            ajax({
                url: web_url + "/game/steal/log",
                type: 'post',
                data: {
                    token: token,
                    type: 1,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "打开偷取记录")
                    _this.biaotilan.getChildAt(0).text = "偷取人"
                    _this.biaotilan.getChildAt(1).text = "被偷取人"
                    _this.biaotilan.getChildAt(2).text = "数量"
                    _this.biaotilan.getChildAt(3).text = "时间"
                    _this.biaotilan.getChildAt(4).text = ""
                    for (var i = 0; i < data.list.length; i++) {
                        arr_jilu.push({
                            j1: data.list[i].nickname,
                            j2: data.list[i].c_nickname,
                            j3: data.list[i].num,
                            j4: data.list[i].create_date,
                            j5: "",
                        })
                    }
                    _this.list_jilu.array = arr_jilu;
                    _this.list_jilu.selectEnable = true;
                    _this.list_jilu.scrollBar.elasticBackTime = 400;
                    _this.list_jilu.scrollBar.elasticDistance = 50;
                    _this.list_jilu.mouseHandler = new Laya.Handler(_this, onMouse_jilu);
                    function onMouse_jilu(e, index) {
                        if (e.type == "click") {
                        }
                    }
                },
            })
        }
        if (data == 3) {
            // console.log("打开交易记录")
            this.jl_biao.visible = false;
            this.tqjl_biao.visible = false;
            this.jyjl_biao.visible = true;;
            this.jilu_box.getChildByName("偷取头部").visible = false;
            this.jilu_box.getChildByName("交易头部").visible = true;
            this.jilu_box.getChildByName("交易头部").getChildByName("未选").getChildAt(0).visible = false;
            this.jilu_box.getChildByName("交易头部").getChildByName("未选").getChildAt(1).visible = true;
            arr_jilu = [];

            for (var i = 0; i < 2; i++) {
                this.jilu_box.getChildByName("未选").getChildAt(i).visible = true;
            }
            this.jilu_box.getChildByName("未选").getChildAt(2).visible = false;

            ajax({
                url: web_url + "/game/recharge/log",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "获取充值记录")
                    _this.biaotilan.getChildAt(0).text = "用户id"
                    _this.biaotilan.getChildAt(1).text = "金币数量"
                    _this.biaotilan.getChildAt(2).text = "时间"
                    _this.biaotilan.getChildAt(3).text = ""
                    _this.biaotilan.getChildAt(4).text = ""
                    for (var i = 0; i < data.list.length; i++) {
                        arr_jilu.push({
                            j1: data.list[i].id,
                            j2: data.list[i].in_price,
                            j3: data.list[i].create_date,
                            j4: "",
                            j5: "",
                        })
                    }
                    _this.list_jilu.array = arr_jilu;
                    _this.list_jilu.selectEnable = true;
                    _this.list_jilu.scrollBar.elasticBackTime = 400;
                    _this.list_jilu.scrollBar.elasticDistance = 50;
                    _this.list_jilu.mouseHandler = new Laya.Handler(_this, onMouse_jilu);
                    function onMouse_jilu(e, index) {
                        if (e.type == "click") {
                        }
                    }
                },
            })
        }
    }

    _proto.beitouquliebiao = function () {
        this.jilu_box.getChildByName("偷取头部").getChildByName("未选").getChildAt(1).visible = false;
        this.jilu_box.getChildByName("偷取头部").getChildByName("未选").getChildAt(0).visible = true;
        arr_jilu = [];
        ajax({
            url: web_url + "/game/steal/log",
            type: 'post',
            data: {
                token: token,
                type: 2,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "打开被偷取记录")
                _this.biaotilan.getChildAt(0).text = "被偷取人"
                _this.biaotilan.getChildAt(1).text = "偷取人"
                _this.biaotilan.getChildAt(2).text = "数量"
                _this.biaotilan.getChildAt(3).text = "时间"
                _this.biaotilan.getChildAt(4).text = ""
                for (var i = 0; i < data.list.length; i++) {
                    arr_jilu.push({
                        j1: data.list[i].c_nickname,
                        j2: data.list[i].nickname,
                        j3: data.list[i].num,
                        j4: data.list[i].create_date,
                        j5: "",
                    })
                }
                _this.list_jilu.array = arr_jilu;
                _this.list_jilu.selectEnable = true;
                _this.list_jilu.scrollBar.elasticBackTime = 400;
                _this.list_jilu.scrollBar.elasticDistance = 50;
                _this.list_jilu.mouseHandler = new Laya.Handler(_this, onMouse_jilu);
                function onMouse_jilu(e, index) {
                    if (e.type == "click") {
                    }
                }
            },
        })
    }

    // _proto.tixianjilu = function () {
    //     // console.log("打开提现记录")
    //     this.jl_biao.visible = false;
    //     this.tqjl_biao.visible = false;
    //     this.jyjl_biao.visible = true;;
    //     this.jilu_box.getChildByName("偷取头部").visible = false;
    //     this.jilu_box.getChildByName("交易头部").visible = true;
    //     this.jilu_box.getChildByName("交易头部").getChildByName("未选").getChildAt(1).visible = false;
    //     this.jilu_box.getChildByName("交易头部").getChildByName("未选").getChildAt(0).visible = true;
    //     for (var i = 0; i < 3; i++) {
    //         this.jilu_box.getChildByName("未选").getChildAt(i).visible = true;
    //     }
    //     this.jilu_box.getChildByName("未选").getChildAt(2).visible = false;
    //     arr_jilu = [];
    //     ajax({
    //         url: web_url + "/game/withdraw/log",
    //         type: 'post',
    //         data: {
    //             token: token,
    //         },
    //         dataType: 'json',
    //         success: function (data) {
    //             // console.log(data, "获取提现记录")
    //             _this.biaotilan.getChildAt(0).text = "用户id"
    //             _this.biaotilan.getChildAt(1).text = "数量"
    //             _this.biaotilan.getChildAt(2).text = "状态"
    //             _this.biaotilan.getChildAt(3).text = "时间"
    //             _this.biaotilan.getChildAt(4).text = ""
    //             for (var i = 0; i < data.list.length; i++) {
    //                 arr_jilu.push({
    //                     j1: data.list[i].id,
    //                     j2: data.list[i].price,
    //                     j3: data.list[i].status = data.list[i].status == 1 ? "未发放" : "已发放",
    //                     j4: data.list[i].create_date,
    //                     // j5: "",
    //                 })
    //             }
    //             _this.list_jilu.array = arr_jilu;
    //             _this.list_jilu.selectEnable = true;
    //             _this.list_jilu.scrollBar.elasticBackTime = 400;
    //             _this.list_jilu.scrollBar.elasticDistance = 50;
    //             _this.list_jilu.mouseHandler = new Laya.Handler(_this, onMouse_jilu);
    //             function onMouse_jilu(e, index) {
    //                 if (e.type == "click") {
    //                 }
    //             }
    //         },
    //     })
    // }

    _proto.jilufunxiangqing = function (data) {
        // console.log(data)
        arr_jilu = [];
        for (var i = 0; i < 4; i++) {
            this.head_box.getChildByName("未选").getChildAt(i).visible = true;
        }
        if (data == 1) {
            // console.log("抽奖")
            //获取大转盘记录
            ajax({
                url: web_url + "/game/zp/log",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "大转盘记录")
                    _this.head_box.getChildByName("未选").getChildAt(0).visible = false;
                    _this.biaotilan.getChildAt(0).text = "抽奖id"
                    _this.biaotilan.getChildAt(1).text = "奖品名"
                    _this.biaotilan.getChildAt(2).text = "消耗金币"
                    _this.biaotilan.getChildAt(3).text = ""
                    _this.biaotilan.getChildAt(4).text = ""
                    for (var i = 0; i < data.list.length; i++) {
                        arr_jilu.push({
                            j1: user_id,
                            j2: data.list[i].title,
                            j3: "2金币",
                            j4: "",
                            j5: "",
                        })
                    }
                    _this.list_jilu.array = arr_jilu;
                    _this.list_jilu.selectEnable = true;
                    _this.list_jilu.scrollBar.elasticBackTime = 400;
                    _this.list_jilu.scrollBar.elasticDistance = 50;
                    _this.list_jilu.mouseHandler = new Laya.Handler(_this, onMouse_jilu);
                    function onMouse_jilu(e, index) {
                        if (e.type == "click") {
                        }
                    }
                },
            })
        }
        if (data == 2) {
            // console.log("种植")
            ajax({
                url: web_url + "/game/plant/log",
                type: 'post',
                data: {
                    token: token,
                    type: 1,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "种植列表")
                    _this.head_box.getChildByName("未选").getChildAt(1).visible = false;
                    _this.biaotilan.getChildAt(0).text = "种植人"
                    _this.biaotilan.getChildAt(1).text = "土地id"
                    _this.biaotilan.getChildAt(2).text = "种子名称"
                    _this.biaotilan.getChildAt(3).text = "价格"
                    _this.biaotilan.getChildAt(4).text = "时间"
                    for (var i = 0; i < data.list.length; i++) {
                        arr_jilu.push({
                            j1: data.list[i].nickname,
                            j2: data.list[i].g_f_id,
                            j3: data.list[i].title,
                            j4: data.list[i].gold_num,
                            j5: data.list[i].create_date,
                        })
                    }
                    _this.list_jilu.array = arr_jilu;
                    _this.list_jilu.selectEnable = true;
                    _this.list_jilu.scrollBar.elasticBackTime = 400;
                    _this.list_jilu.scrollBar.elasticDistance = 50;
                    _this.list_jilu.mouseHandler = new Laya.Handler(_this, onMouse_jilu);
                    function onMouse_jilu(e, index) {
                        if (e.type == "click") {

                        }
                    }
                },
            })
            // this.head_box.getChildByName("未选").getChildAt(2).visible = false;
        }

        if (data == 3) {
            // console.log("团队收获")
            ajax({
                url: web_url + "/game/team/profit/log",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "团队收获")
                    _this.head_box.getChildByName("未选").getChildAt(2).visible = false;
                    _this.biaotilan.getChildAt(0).text = "提供者id"
                    _this.biaotilan.getChildAt(1).text = "类型"
                    _this.biaotilan.getChildAt(2).text = "数量"
                    _this.biaotilan.getChildAt(3).text = "时间"
                    _this.biaotilan.getChildAt(4).text = ""
                    for (var i = 0; i < data.list.length; i++) {
                        arr_jilu.push({
                            j1: data.list[i].c_m_id,
                            j2: data.list[i].type = data.list[i].type == 1 ? "下级佣金" : "顶级佣金",
                            j3: data.list[i].num,
                            j4: data.list[i].create_date,
                            j5: "",
                        })
                    }
                    _this.list_jilu.array = arr_jilu;
                    _this.list_jilu.selectEnable = true;
                    _this.list_jilu.scrollBar.elasticBackTime = 400;
                    _this.list_jilu.scrollBar.elasticDistance = 50;
                    _this.list_jilu.mouseHandler = new Laya.Handler(_this, onMouse_jilu);
                    function onMouse_jilu(e, index) {
                        if (e.type == "click") {

                        }
                    }
                },
            })
            // this.head_box.getChildByName("未选").getChildAt(3).visible = false;
        }
        if (data == 4) {
            // console.log("出售水果")
            this.head_box.getChildByName("未选").getChildAt(3).visible = false;
            ajax({
                url: web_url + "/member/member/log",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "金流记录")
                    _this.head_box.getChildByName("未选").getChildAt(3).visible = false;
                    _this.biaotilan.getChildAt(0).text = "数量"
                    _this.biaotilan.getChildAt(1).text = "收支"
                    _this.biaotilan.getChildAt(2).text = "方式"
                    _this.biaotilan.getChildAt(3).text = ""
                    _this.biaotilan.getChildAt(4).text = "时间"
                    for (var i = 0; i < data.list.length; i++) {
                        arr_jilu.push({
                            j1: data.list[i].num,
                            j2: data.list[i].status == 1 ? "收入" : "支出",
                            j3: data.list[i].str,
                            j4: "",
                            j5: data.list[i].create_date,
                        })
                    }
                    _this.list_jilu.array = arr_jilu;
                    _this.list_jilu.selectEnable = true;
                    _this.list_jilu.scrollBar.elasticBackTime = 400;
                    _this.list_jilu.scrollBar.elasticDistance = 50;
                    _this.list_jilu.mouseHandler = new Laya.Handler(_this, onMouse_jilu);
                    function onMouse_jilu(e, index) {
                        if (e.type == "click") {

                        }
                    }
                },
            })
        }
    }

    _proto.yxfun = function () {
        // console.log("打开小游戏")
        if (yinxiao == 1) {
            Laya.SoundManager.playSound("res/dakai.wav", 1);//音效
        }
        Laya.Tween.to(this.youxizhankai, { x: 0 }, 300);
        this.yx_btn.visible = false;
        // this.xiaoyouxi_box.visible = true;
    }

    _proto.shouqiyouxifun = function () {
        Laya.Tween.to(this.youxizhankai, { x: -250 }, 100);
        this.yx_btn.visible = true;
    }

    _proto.tuichufun = function () {
        // console.log("退出登录")
        _this.querenfun(3);
    }

    // _proto.liebiaofun = function (data) {
    //     arr_haoyou = [];
    //     for (var i = 0; i < 3; i++) {
    //         this.haoyou_box.getChildByName("未选").getChildAt(i).visible = true;
    //     }
    //     if (data == 1) {
    //         // console.log("打开关系")
    //         this.guanxi_biao.visible = true;
    //         this.tq_biao.visible = false;
    //         this.hy_biao.visible = false;
    //         isgonggao = false;
    //         this.haoyou_box.getChildByName("未选").getChildAt(0).visible = false;
    //         this.liebiaohead_box.visible = true;
    //         this.tianjia_box.visible = false;
    //         ajax({
    //             url: web_url + "/member/fellow/list",
    //             type: 'post',
    //             data: {
    //                 token: token,
    //             },
    //             dataType: 'json',
    //             success: function (data) {
    //                 console.log(data, "关系列表")
    //                 for (var i = 0; i < data.list.length; i++) {
    //                     arr_haoyou.push({
    //                         tu: "comp/head/head_" + data.list[i].head_url + ".jpg",
    //                         id: data.list[i].id,
    //                         name: data.list[i].nickname,
    //                         phone: data.list[i].phone,
    //                         // phone: data.list[i].phone,
    //                         // dengji:data.list[i].
    //                         cengshu: data.list[i].type,
    //                     })
    //                 }
    //                 _this.list_haoyou.array = arr_haoyou;
    //                 _this.list_haoyou.selectEnable = true;
    //                 _this.list_haoyou.scrollBar.elasticBackTime = 400;
    //                 _this.list_haoyou.scrollBar.elasticDistance = 50;
    //                 _this.list_haoyou.mouseHandler = new Laya.Handler(_this, onMouse_haoyou);
    //                 function onMouse_haoyou(e, index) {
    //                     if (e.type == "click") {
    //                         // console.log(index)
    //                         _this.haoyou_box.visible = false;
    //                         ishaoyou = true;
    //                         haoyouid = arr_haoyou[index].id;
    //                         _this.haoyoutudishuju(haoyouid);
    //                         _this.xinhaoyou_box.visible = false;
    //                         _this.jinbitxt1.text = "???";
    //                         _this.jifentxt1.text = "???";
    //                         _this.mingtxt1.text = arr_haoyou[index].name;
    //                         _this.idtxt1.text = arr_haoyou[index].id;
    //                         _this.head.skin = arr_haoyou[index].tu;

    //                         _this.bb_btn.disabled = true;
    //                         _this.chan_btn.disabled = true;
    //                         _this.duihuan.disabled = true;
    //                         //隐藏狗 鸟
    //                         _this.goutxt.visible = false;
    //                         _this.niaotxt1.visible = false;

    //                         // _this.tiyan_btn.visible = false;

    //                         _this.fanhuijiayuan.visible = true;
    //                         Laya.Tween.to(_this.you_box, { x: 1580 }, 300);
    //                         Laya.Tween.to(_this.zuo_box, { x: -90 }, 300);

    //                         // for (var i = 0; i < 18; i++) {
    //                         //     this.land_box.getChildAt(i).off(Laya.Event.MOUSE_DOWN, this, this.dianfun);
    //                         //     this.land_box.getChildAt(i).landid = i;
    //                         // }

    //                     }
    //                 }
    //             },
    //         })
    //     }
    //     if (data == 2) {
    //         //偷取列表
    //         // console.log("打开偷取列表")
    //         this.gb_txt.x = 0;
    //         isgonggao = true;
    //         this.tq_biao.visible = true;
    //         this.tounum.text = "已偷取" + yitounum + "次,被偷取" + beitounum + "次。"
    //         this.guanxi_biao.visible = false;
    //         this.hy_biao.visible = false;
    //         this.haoyou_box.getChildByName("未选").getChildAt(1).visible = false;
    //         this.liebiaohead_box.visible = false;
    //         this.tianjia_box.visible = false;
    //         ajax({
    //             url: web_url + "/game/steal/list",
    //             type: 'post',
    //             data: {
    //                 token: token,
    //             },
    //             dataType: 'json',
    //             success: function (data) {
    //                 // console.log(data, "偷取列表")
    //                 for (var i = 0; i < data.list.length; i++) {
    //                     arr_haoyou.push({
    //                         tu: "comp/head/head_" + data.list[i].head_url + ".jpg",
    //                         id: data.list[i].m_id,
    //                         name: data.list[i].nickname,
    //                         phone: "",
    //                         dengji: "",
    //                         cengshu: "可偷取",
    //                     })
    //                 }
    //                 _this.list_haoyou.array = arr_haoyou;
    //                 _this.list_haoyou.selectEnable = true;
    //                 _this.list_haoyou.scrollBar.elasticBackTime = 400;
    //                 _this.list_haoyou.scrollBar.elasticDistance = 50;
    //                 _this.list_haoyou.mouseHandler = new Laya.Handler(_this, onMouse_haoyou);
    //                 function onMouse_haoyou(e, index) {
    //                     if (e.type == "click") {
    //                         // console.log(index)
    //                         _this.haoyou_box.visible = false;
    //                         ishaoyou = true;
    //                         touquid = arr_haoyou[index].id;
    //                         // console.log(arr_haoyou[index].tu,"--=======")
    //                         _this.touquhaoyoutudi(touquid);
    //                         _this.xinhaoyou_box.visible = false;
    //                         _this.jinbitxt1.text = "???";
    //                         _this.jifentxt1.text = "???";
    //                         _this.mingtxt1.text = arr_haoyou[index].name;
    //                         _this.idtxt1.text = arr_haoyou[index].id;
    //                         _this.head.skin = arr_haoyou[index].tu;

    //                         _this.bb_btn.disabled = true;
    //                         _this.chan_btn.disabled = true;
    //                         _this.c_box.visible = false;
    //                         _this.duihuan.disabled = true;

    //                         // _this.yijiantouqu.disabled = false;

    //                         //隐藏狗 鸟
    //                         _this.goutxt.visible = false;
    //                         _this.niaotxt1.visible = false;
    //                         // _this.tiyan_btn.visible = false;

    //                         _this.fanhuijiayuan.visible = true;
    //                         Laya.Tween.to(_this.you_box, { x: 1580 }, 300);
    //                         Laya.Tween.to(_this.zuo_box, { x: -90 }, 300);

    //                     }
    //                 }

    //             },
    //         })
    //     }
    //     if (data == 3) {
    //         console.log("打开好友")
    //         this.guanxi_biao.visible = false;
    //         this.tq_biao.visible = false;
    //         this.hy_biao.visible = true;
    //         this.tianjia_box.visible = true;
    //         isgonggao = false;
    //         this.haoyou_box.getChildByName("未选").getChildAt(2).visible = false;
    //         this.liebiaohead_box.visible = true;

    //         ajax({
    //             url: web_url + "/member/friend/list",
    //             type: 'post',
    //             data: {
    //                 token: token,
    //             },
    //             dataType: 'json',
    //             success: function (data) {
    //                 console.log(data, "好友列表")
    //                 for (var i = 0; i < data.list.length; i++) {
    //                     arr_haoyou.push({
    //                         tu: "comp/head/head_" + data.list[i].head_url + ".jpg",
    //                         id: data.list[i].m_id,
    //                         name: data.list[i].nickname,
    //                         phone: data.list[i].phone,
    //                         // phone: data.list[i].phone,
    //                         // dengji:data.list[i].
    //                         // cengshu: data.list[i].type,
    //                     })
    //                 }
    //                 _this.list_haoyou.array = arr_haoyou;
    //                 _this.list_haoyou.selectEnable = true;
    //                 _this.list_haoyou.scrollBar.elasticBackTime = 400;
    //                 _this.list_haoyou.scrollBar.elasticDistance = 50;
    //                 _this.list_haoyou.mouseHandler = new Laya.Handler(_this, onMouse_haoyou);
    //                 function onMouse_haoyou(e, index) {
    //                     if (e.type == "click") {
    //                         // console.log(index)
    //                         // 进入好友土地
    //                         _this.haoyou_box.visible = false;
    //                         ishaoyou = true;
    //                         haoyouid = arr_haoyou[index].id;
    //                         _this.haoyoutudishuju(haoyouid);
    //                         _this.jinbitxt1.text = "???";
    //                         _this.jifentxt1.text = "???";
    //                         _this.mingtxt1.text = arr_haoyou[index].name;
    //                         _this.idtxt1.text = arr_haoyou[index].id;
    //                         _this.head.skin = arr_haoyou[index].tu;

    //                         _this.bb_btn.disabled = true;
    //                         _this.chan_btn.disabled = true;
    //                         _this.duihuan.disabled = true;
    //                         //隐藏狗 鸟
    //                         _this.goutxt.visible = false;
    //                         _this.niaotxt1.visible = false;

    //                         // _this.tiyan_btn.visible = false;

    //                         _this.fanhuijiayuan.visible = true;
    //                         Laya.Tween.to(_this.you_box, { x: 1580 }, 300);
    //                         Laya.Tween.to(_this.zuo_box, { x: -90 }, 300);
    //                     }
    //                 }
    //             },
    //         })

    //     }
    //     this.haoyou_box.visible = true;
    // }

    _proto.haoyouxinxi = function () {
        console.log("添加好友查找显示")
        ajax({
            url: web_url + "/member/basic/info",
            type: 'post',
            data: {
                token: token,
                id: _this.tianjiahaoyouid.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "查询好友")
                _this.xianshi_box.visible = true;
                _this.ming.text = data.data.nickname;
                _this.haonum.text = data.data.phone;
            },
        })
    }

    _proto.shenqingliebiao = function () {
        arr_shenqing = [];
        ajax({
            url: web_url + "/member/send/list",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "申请列表")
                _this.shenqing_box.visible = true;

                for (var i = 0; i < data.list.length; i++) {
                    arr_shenqing.push({
                        head: "comp/head/head_" + data.list[i].head_url + ".jpg",
                        id: data.list[i].m_id,
                        nickna: data.list[i].nickname,
                        phone: data.list[i].phone,
                        jiluid: data.list[i].id,
                    })
                }
                _this.list_shenqing.array = arr_shenqing;
                _this.list_shenqing.selectEnable = true;
                _this.list_shenqing.scrollBar.elasticBackTime = 400;
                _this.list_shenqing.scrollBar.elasticDistance = 50;
                _this.list_shenqing.mouseHandler = new Laya.Handler(_this, onMouse_shenqing);
                function onMouse_shenqing(e, index) {
                    if (e.type == "click") {
                        // console.log(index)
                        if (e.target.name == "同意") {
                            // console.log(arr_shenqing[index].jiluid)
                            //添加好友
                            ajax({
                                url: web_url + "/member/send/update",
                                type: 'post',
                                data: {
                                    token: token,
                                    id: arr_shenqing[index].jiluid,
                                    type: 1,
                                },
                                dataType: 'json',
                                success: function (data) {
                                    var data = JSON.parse(data);
                                    console.log(data, "同意操作申请")
                                    _this.xiaotanfun(data.info);
                                    _this.shenqing_box.visible = false;
                                    // _this.liebiaofun(3);
                                    _this.haoyoufun(0)
                                },
                            })

                        }
                        if (e.target.name == "拒绝") {
                            ajax({
                                url: web_url + "/member/send/update",
                                type: 'post',
                                data: {
                                    token: token,
                                    id: arr_shenqing[index].jiluid,
                                    type: 2,
                                },
                                dataType: 'json',
                                success: function (data) {
                                    var data = JSON.parse(data);
                                    console.log(data, "拒绝操作申请")
                                    _this.xiaotanfun(data.info);
                                    _this.shenqing_box.visible = false;
                                    _this.liebiaofun(3);
                                },
                            })
                        }
                    }
                }

            },
        })
    }

    _proto.tianjiahaoyoufun = function () {
        console.log("添加好友")
        ajax({
            url: web_url + "/member/friend/add",
            type: 'post',
            data: {
                token: token,
                fid: _this.tianjiahaoyouid.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "查询好友")
                _this.xianshi_box.visible = false;
                _this.xiaotanfun(data.info);
            },
        })
    }

    _proto.haoyouchaxun = function () {
        // console.log("好友查询")
        // ajax({
        //     url: web_url + "/member/basic/info",
        //     type: 'post',
        //     data: {
        //         token: token,
        //         id: _this.haoyouid.text,
        //     },
        //     dataType: 'json',
        //     success: function (data) {
        //         // console.log(data, "查询好友")
        //     },
        // })
    }

    var iszhedie = false;
    _proto.zhediefun = function () {
        // console.log("折叠")
        if (!iszhedie) {
            Laya.Tween.to(this.pp2, { height: 0 }, 300);
            Laya.Tween.to(this.pp3, { height: 0 }, 300);
            Laya.Tween.to(this.dibu, { y: 55 }, 300);
            Laya.timer.once(300, this, function () {
                this.dingbu.height = 25;
            })
            iszhedie = true;
        } else {
            Laya.Tween.to(this.pp2, { height: 480 }, 300);
            Laya.Tween.to(this.pp3, { height: 530 }, 300);
            Laya.Tween.to(this.dibu, { y: 565 }, 300);
            this.dingbu.height = 54;
            iszhedie = false;
        }
    }

    _proto.querenfun = function (data) {
        _this.wanjiafun();
        querenleixing = data;
        // _this.queren_box.visible = true;
        // console.log("确认类型", querenleixing, data)

        // 确认铲除
        if (data == 2 && chanlei == 1) {
            _this.queren_box.visible = true;
            if (yitounum > beitounum) {
                _this.querentxt.text = "现在铲除要扣掉多偷取的果实哦~"
            }
            if (yitounum < beitounum) {
                _this.querentxt.text = "铲除？会亏的~"
            }
            if (yitounum == beitounum) {
                _this.querentxt.text = "铲除后就没办法变强啦~"
            }
        } else {
            _this.queren_box.visible = true;
            _this.querentxt.text = "铲除后就没办法变强啦~"
        }
        // 退出
        if (data == 3) {
            _this.queren_box.visible = true;
            _this.querentxt.text = "官人，不再考虑下吗~"
        }
        // 喂狗
        if (data == 4) {
            _this.queren_box.visible = true;
            _this.querentxt.text = "好心人给袋狗粮吧~"
        }
        // 喂鸟
        if (data == 5) {
            _this.queren_box.visible = true;
            _this.querentxt.text = "都快饿死了"
        }
        if (data == 6) {
            //偷多了种
            _this.queren_box.visible = true;
            if (yitounum > beitounum) {
                _this.querentxt.text = "现在种植要扣掉多偷取的果实哦~"
            }
            if (yitounum < beitounum) {
                _this.querentxt.text = "不要啊小主，会亏的！"
            }

        }
    }

    _proto.querencaozuo = function () {
        console.log(querenleixing, "+++++++++")
        if (querenleixing == 1) {
            //补满操作
            ajax({
                url: web_url + "/game/frame/add",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data, "补满")
                    _this.queren_box.visible = false;
                    _this.tanfun(data.info);
                    _this.wanjiafun();
                    _this.tudifun();
                },
            })
        }
        if (querenleixing == 2) {
            if (chanlei == 1) {
                //农场铲除
                ajax({
                    url: web_url + "/game/outSeed",
                    type: 'post',
                    data: {
                        token: token,
                        f_id: _this.landid + 1,//土地id
                    },
                    dataType: 'json',
                    success: function (data) {
                        var data = JSON.parse(data);
                        console.log(data, "铲除")
                        _this.tanfun(data.info);
                        _this.queren_box.visible = false;
                        if (data.status == 1) {
                            _this.wanjiafun();
                            _this.tudifun();
                        } else {

                        }
                    },
                })
            }

            if (chanlei == 2) {
                //牧场铲除
                ajax({
                    url: web_url + "/game/outSeed1",
                    type: 'post',
                    data: {
                        token: token,
                        f_id: _this.muid + 1,//土地id
                    },
                    dataType: 'json',
                    success: function (data) {
                        var data = JSON.parse(data);
                        console.log(data, "铲除")
                        _this.tanfun(data.info);
                        _this.queren_box.visible = false;
                        if (data.status == 1) {
                            _this.wanjiafun();
                            _this.muchangfun();
                        } else {

                        }
                    },
                })
            }

            if (chanlei == 3) {
                //渔场铲除
                ajax({
                    url: web_url + "/game/outSeed2",
                    type: 'post',
                    data: {
                        token: token,
                        f_id: _this.yuid + 1,//土地id
                    },
                    dataType: 'json',
                    success: function (data) {
                        var data = JSON.parse(data);
                        console.log(data, "铲除")
                        _this.tanfun(data.info);
                        _this.queren_box.visible = false;
                        if (data.status == 1) {
                            _this.wanjiafun();
                            _this.yuchangfun();
                        } else {

                        }
                    },
                })
            }

        }
        if (querenleixing == 3) {
           // open(location, '_self').close();
            window.android.oneMethod();
                       // ajax({
            //     url: web_url + "/member/logout",
            //     type: 'post',
            //     data: {
            //         token: token,
            //     },
            //     dataType: 'json',
            //     success: function (data) {
            //         var data = JSON.parse(data);
            //         // console.log(data, "退出登录")
            //         if (data.status == 1) {
            //             //退出成功
            //             localStorage.removeItem("token");
            //             token = "";
            //             user_id = "";
            //             //返回登录页面
            //             _this.home.visible = false;
            //             _this.dl_box.visible = true;
            //             denglu = false;
            //             _this.queren_box.visible = false;
            //         }
            //     },
            // })
        }
        if (querenleixing == 4) {
            //喂狗
            _this.queren_box.visible = false;
            _this.goufun();
        }
        if (querenleixing == 5) {
            //喂鸟
            _this.queren_box.visible = false;
            _this.niaofun();
        }
    }

    _proto.quxiaocaozuo = function () {
        _this.querentxt.text = ""
        _this.queren_box.visible = false;
    }

    _proto.duihuanfun = function () {
        // console.log("金币换积分")
        this.duihuan_box.visible = true;
    }

    _proto.querenduihuan = function () {
        ajax({
            url: web_url + "/game/exchange/integral",
            type: 'post',
            data: {
                token: token,
                num: _this.duihuantxt.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "金币换积分")
                _this.duihuan_box.visible = false;
                _this.tanfun(data.info);
                _this.wanjiafun();
            },
        })
    }

    _proto.weiniaofun = function () {
        if (isniao == 1) {
            _this.tanfun("小主，我已经吃饱啦~")
        } else {
            // console.log("是否喂鸟")
            this.querenfun(5);
        }
    }

    _proto.weigoufun = function () {
        if (isgou == 1) {
            _this.tanfun("拒绝吃狗粮~")
        } else {
            // console.log("是否喂狗")
            this.querenfun(4);
        }
    }

    _proto.goufun = function () {
        // console.log("喂狗")
        ajax({
            url: web_url + "/game/dog",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "喂狗")
                _this.tanfun(data.info);
                _this.wanjiafun();
            },
        })
    }

    _proto.niaofun = function () {
        // console.log("喂鸟")
        ajax({
            url: web_url + "/game/bird",
            type: 'post',
            data: {
                token: token,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                // console.log(data, "喂鸟")
                _this.tanfun(data.info);
                _this.wanjiafun();
            },
        })
    }

    _proto.shuiguojifun = function () {
        // console.log("打开水果机", user_id)
        window.location.href = web_url + "/shuiguoji/index.html";
    }

    _proto.caiquanfun = function () {
        //打开
        this.caiquan_box.visible = true;
        this.zhushu.getChildAt(0).getChildAt(1).visible = true;
    }

    var cainum = 10;
    _proto.xuanzhufun = function (data) {
        for (var i = 0; i < 3; i++) {
            this.zhushu.getChildAt(i).getChildAt(1).visible = false;
        }
        this.zhushu.getChildAt(data).getChildAt(1).visible = true;
        cainum = data == 0 ? 10 : data == 1 ? 100 : 1000;
    }

    _proto.qianwangcaiquan = function () {
        console.log(gold_num, cainum)
        if (gold_num >= cainum) {
            socket.emit("水果猜拳", { id: user_id, cainum: cainum })
        } else {
            _this.tanfun("您的金币不足无法参与")
        }
    }

    _proto.quxiaocaiquan = function () {
        this.caiquan_box.visible = false;
        for (var i = 0; i < 3; i++) {
            this.zhushu.getChildAt(i).getChildAt(1).visible = false;
        }
    }

    _proto.shangchengfun = function () {
        this.shangcheng_box.visible = true;
        this.shangchengleixing(0);
    }

    var shangpinid;
    _proto.shangchengleixing = function (data) {
        console.log("打开" + data)
        if (data == 0) {
            console.log("打开商城")
            this.shangchengtype.getChildAt(0).visible = false;
            this.shangchengtype.getChildAt(1).visible = true;

            this.shang_box.visible = true;
            this.ding_box.visible = false;
            arr_shangcheng = [];

            ajax({
                url: web_url + "/game/shop/list",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "兑换商城")
                    // _this.tanfun(data.info);
                    _this.wanjiafun();

                    for (var i = 0; i < data.list.length; i++) {
                        arr_shangcheng.push({
                            tu: web_url + data.list[i].image,
                            num: data.list[i].gold_num,
                            id: data.list[i].id,
                            ming: data.list[i].title,
                        })
                    }
                    _this.list_shangcheng.array = arr_shangcheng;
                    _this.list_shangcheng.selectEnable = true;
                    _this.list_shangcheng.scrollBar.elasticBackTime = 400;
                    _this.list_shangcheng.scrollBar.elasticDistance = 50;
                    _this.list_shangcheng.mouseHandler = new Laya.Handler(_this, onMouse_shangcheng);
                    function onMouse_shangcheng(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                            if (e.target.name == "兑换") {
                                // console.log(index)
                                _this.tianxie_box.visible = true;
                                shangpinid = arr_shangcheng[index].id;
                                console.log(shangpinid, arr_shangcheng[index].id)
                            }
                        }
                    }
                },
            })
        }
        if (data == 1) {
            console.log("打开订单")
            this.shangchengtype.getChildAt(0).visible = true;
            this.shangchengtype.getChildAt(1).visible = false;

            this.shang_box.visible = false;
            this.ding_box.visible = true;

            arr_dingdan = [];

            ajax({
                url: web_url + "/game/shop/log",
                type: 'post',
                data: {
                    token: token,
                },
                dataType: 'json',
                success: function (data) {
                    var data = JSON.parse(data);
                    console.log(data, "兑换订单")
                    for (var i = 0; i < data.list.length; i++) {
                        arr_dingdan.push({
                            shangpin: data.list[i].title,
                            jiage: data.list[i].gold_num,
                            zhuangtai: data.list[i].status = data.list[i].status == 1 ? "已发货" : "未发货",
                            dingdanhao: data.list[i].express,
                        })
                    }
                    _this.list_dingdan.array = arr_dingdan;
                    _this.list_dingdan.selectEnable = true;
                    _this.list_dingdan.scrollBar.elasticBackTime = 400;
                    _this.list_dingdan.scrollBar.elasticDistance = 50;
                    _this.list_dingdan.mouseHandler = new Laya.Handler(_this, onMouse_dingdan);
                    function onMouse_dingdan(e, index) {
                        if (e.type == "click") {
                            // console.log(index)
                        }
                    }
                },
            })
        }
    }

    _proto.duihuanshiwu = function () {
        console.log("商城确认兑换")
        ajax({
            url: web_url + "/game/shop/buy",
            type: 'post',
            data: {
                token: token,
                id: shangpinid,
                name: _this.nametxt.text,
                phone: _this.numtxt.text,
                address: _this.dizhitxt.text,
            },
            dataType: 'json',
            success: function (data) {
                var data = JSON.parse(data);
                console.log(data, "提交兑换")
                _this.xiaotanfun(data.info);
                _this.tianxie_box.visible = false;
                _this.wanjiafun();
            },
        })
    }

    return Game;

})(ui.gameUI);

function ajax(options) {
    //创建一个ajax对象
    var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft,XMLHTTP");
    //数据的处理 {a:1,b:2} a=1&b=2;
    var str = "";
    for (var key in options.data) {
        str += "&" + key + "=" + options.data[key];
    }
    str = str.slice(1)
    if (options.type == "get") {
        var url = options.url + "?" + str;
        xhr.open("get", url);
        xhr.send();
    } else if (options.type == "post") {
        xhr.open("post", options.url);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.send(str)
    }
    //监听
    xhr.onreadystatechange = function () {
        //当请求成功的时候
        if (xhr.readyState == 4 && xhr.status == 200) {
            var d = xhr.responseText;
            //将请求的数据传递给成功回调函数
            options.success && options.success(d)
        } else if (xhr.status != 200) {
            //当失败的时候将服务器的状态传递给失败的回调函数
            options.error && options.error(xhr.status);
        }
    }
}