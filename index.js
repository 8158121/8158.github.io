import { createStore } from 'vuex'
import { tokenName } from '../config'
import { getInfo } from '@/network/api/user';
import { verifyToken } from '@/network/api/login';
import { getConfigList, getModuleList, getGoodsBgImages,getArticleList } from '@/network/api/index';
import router from '../router'

const state = {
	platformId: 1,//平台ID
	token: '',//toekn
	userId: 0,
	//个人信息
	userInfoAssets: {
		ammon: 0,//弹壳
		amount: 0,//金额
		point: 0,//积分
		spreadBoxCount: 0,//推广箱子数
		spreadRewardAmount: 0//推广奖励的金额(可提取)
	},
	userInfoBase: {
		account: "",
		avater: "",
		avaterFrame: 0,
		mobile: "",
		nickName: "",
		platformId: 1,
		userLevel: 0,
		userType: 1
	},
	userInfoExt: {
		channelCode: "",//当前的渠道
		idNumber: "",//身份证
		invitationCode: "",//邀请码
		isChangeInvitationCode: true,//是否可修改邀请码(true:可以修改,false:不可修改)
		isChangeSpreadCode: true,//是否可修改推广码(true:可以修改,false:不可修改)
		realName: "",//真实姓名
		sex: 0,//性别 0.不公开 1.男 2.女
		spreadCode: "",//推广码
		steamUrl: ""//steam仓库链接
	},
	hasRegisterPacket: false,//是否可领取注册红包(true-可以领取, false-不可领取)
	noReadMessages: 0,//未读取的消息条数
	avaterStatus:-1,//头像状态 0审核中, 1-审核通过, 2-审核未通过

	//配置信息
	serverConfigList: [],

	//模块信息
	moduleList: [],
	moduleBlindBox: true,
	moduleRoll: true,
	moduleLucky: true,
	moduleContract: true,
	moduleGrade: true,
	moduleTiming: true,
	moduleMall: true,
	moduleAmmonBox: true,
	moduleBattle: true,
	moduleRecharge: true,
	moduleVIP: true,
	moduleBestHistory: true,
	moduleRucksack: true,
	moduleAppDownload:true,
	moduleService:true,
	moduleGroupChat:true,
	moduleHelpContact:true,
	moduleHelpPrivacy:true,
	moduleHelpRegulation:true,
	moduleHelpProblem:true,
	moduleHelpRelevant:true,
	moduleHelpCompliance:true,
	moduleHelpFanDuBoNotice:true,
	moduleHelpChengMiNotice:true,

	//装备背景图信息
	goodsBgList: [],

	//用户协议相关
	agreementChecked: false,


	showSignView: false, //登录弹框
	showRegisterView: false, //注册弹框
	showForgetPWView: false, //忘记密码
	showBindPhoneiew: false, //绑定手机
	showFooterView: false, //底部
	showHeaderView: true, //顶部

	//玩法介绍
	howPlay: {
		show: false,
		html: ""
	},

	switchNotice: false, //公告

	//绑定手机弹框
	bindingmobileShow: false,

	//注册红包
	regPacket: {
		closeRed: false, //未开
		openRed: false, //已开
		leftSmall: false, //侧边
		money: 0 //金额
	},

	//口令红包
	passRed: false,


	//盲盒最近掉落
	boxDropList: [],

	//对战 新的房间信息
	battleCreateRoom: [],
	battleJoinRoom: null,
	watchUserCount: 0,
	notJoinRoomNotice: false,
	clickBattleBoxData:{},

	//roll
	openResultRollId: 0,

	//时间盲盒首页提示
	timingIndexNotice: true,

	//审核控制显示
	beiAnExamine: false,

	//幸运盲盒
	fliterParams:{ type: 0, subType: 0 ,roomSort:0},

	//全局开关
	soundSwitch: true,
	animationSwitch: true,

	//对战声音开关
	battleSoundSwitch: true,

	//开箱声音开关
	openboxSoundSwitch: true,
	//开箱动画开关
	openboxAnimationSwitch: true,

	// 火星背景
	sparkBg: {
		show: true,
		left: true,
		top: true,
		right: true
	},

	showActivityDialog: false,
	activityConfig: {},

	otherConfig: {},

	//pc h5
	isPCClient: false,

	indexScrollPosition: 0,
	luckyScrollPosition: 0,
}

const getters = {
	hasLogin(state) {
		return state.token != '';
	},
	//获取配置
	getConfigItem(state ) {
		return function (key) {
			for (let i=0;i< state.serverConfigList.length;i++) {
				let item=state.serverConfigList[i];
				if (item.itemKey === key) {
					return item.itemValue;
				}
			}
		}
	},

	getGoodsBgImage(state) {
		return function (type, level) {
			return state.goodsBgList[type][level];
		}
	},
}

const mutations = {
	initLocalData(state){
		let soundSwitch=localStorage.getItem("soundSwitch");
		let animationSwitch=localStorage.getItem("animationSwitch");
		let battleSoundSwitch=localStorage.getItem("battleSoundSwitch");
		let openboxSoundSwitch=localStorage.getItem("openboxSoundSwitch");
		let openboxAnimationSwitch=localStorage.getItem("openboxAnimationSwitch");

		if(soundSwitch==null || soundSwitch==undefined){
			localStorage.setItem("soundSwitch",true);
			soundSwitch="true";
		}
		if(animationSwitch==null || animationSwitch==undefined){
			localStorage.setItem("animationSwitch",true);
			animationSwitch="true";
		}
		if(battleSoundSwitch==null || battleSoundSwitch==undefined){
			localStorage.setItem("battleSoundSwitch",true);
			battleSoundSwitch="true";
		}
		if(openboxSoundSwitch==null || openboxSoundSwitch==undefined){
			localStorage.setItem("openboxSoundSwitch",true);
			openboxSoundSwitch="true";
		}
		if(openboxAnimationSwitch==null || openboxAnimationSwitch==undefined){
			localStorage.setItem("openboxAnimationSwitch",true);
			openboxAnimationSwitch="true";
		}

		state.soundSwitch = soundSwitch=="true";
		state.animationSwitch = animationSwitch=="true";
		state.battleSoundSwitch = battleSoundSwitch=="true";
		state.openboxSoundSwitch = openboxSoundSwitch=="true";
		state.openboxAnimationSwitch = openboxAnimationSwitch=="true";
	},

	setSoundSwitch(state, data){
		state.soundSwitch = data;
	},

	setAnimationSwitch(state, data){
		state.animationSwitch = data;
	},

	setBattleSoundSwitch(state, data){
		state.battleSoundSwitch = data;
	},

	setOpenboxSoundSwitch(state, data){
		state.openboxSoundSwitch = data;
	},

	setOpenboxAnimationSwitch(state, data){
		state.openboxAnimationSwitch = data;
	},

	setPlatformId(state, data) {
		state.platformId = data;
	},

	setLoginInfo(state, data) {
		state.token = data.token;
		state.userId = data.userId;
		localStorage.setItem(tokenName, data.token);
	},

	setUserInfo(state, data) {
		state.userInfoAssets = data.assets;
		state.userInfoBase = data.base;
		state.userInfoExt = data.ext;
		state.noReadMessages = data.noReadMessages;
		state.userId = data.userId;
		state.avaterStatus = data.avaterStatus;

		let preHasRegisterPacket = state.hasRegisterPacket;
		state.hasRegisterPacket = data.hasRegisterPacket;

		if (!preHasRegisterPacket && data.hasRegisterPacket) {
			state.regPacket.closeRed = true;
			state.regPacket.openRed = false;
			state.regPacket.leftSmall = false;
		}
		if (!data.hasRegisterPacket) {
			state.regPacket.closeRed = false;
			state.regPacket.openRed = false;
			state.regPacket.leftSmall = false;
		}
	},

	setUserAmount(state, amount) {
		state.userInfoAssets.amount = amount;
	},


	refreshToken(state, token) {
		state.token = token;
	},

	//登出
	logout(state) {
		state.token = '';
		state.userId = 0;
		localStorage.removeItem(tokenName);
		router.replace('/');
		Window.closeWebSocketSend(false);
	},

	initConfigList(state, data) {
		state.serverConfigList = data;
	},

	initModuleList(state, data) {
		let items=data.items;
		state.moduleList = items;

		let hasModule=function(arr, name) {
			for (let i=0;i<arr.length;i++) {
				if (arr[i].name === name) {
					return arr[i].status == 1;
				}
			}
		}
		state.moduleBlindBox = hasModule(items,'BlindBox');
		state.moduleRoll = hasModule(items,'Roll');
		state.moduleLucky = hasModule(items,'Lucky');
		state.moduleContract = hasModule(items,'Contract');
		state.moduleGrade = hasModule(items,'Grade');
		state.moduleTiming = hasModule(items,'Timing');
		state.moduleMall= hasModule(items,'Mall');
		state.moduleAmmonBox= hasModule(items,'AmmonBox');
		state.moduleBattle= hasModule(items,'Battle');
		state.moduleRecharge= hasModule(items,'Recharge');
		state.moduleRucksack= hasModule(items,'Rucksack');
		state.moduleVIP= hasModule(items,'Vip');
		state.moduleBestHistory= hasModule(items,'BestHistory');
		state.moduleAppDownload= hasModule(items,'AppDownload');
		state.moduleService= hasModule(items,'Service');
		state.moduleGroupChat= hasModule(items,'GroupChat');
		state.moduleHelpContact= hasModule(items,'HelpContact');
		state.moduleHelpPrivacy= hasModule(items,'HelpPrivacy');
		state.moduleHelpRegulation= hasModule(items,'HelpRegulation');
		state.moduleHelpProblem= hasModule(items,'HelpProblem');
		state.moduleHelpRelevant= hasModule(items,'HelpRelevant');
		state.moduleHelpCompliance= hasModule(items,'HelpCompliance');
		state.moduleHelpFanDuBoNotice= hasModule(items,'HelpFanDuBoNotice');
		state.moduleHelpChengMiNotice= hasModule(items,'HelpFangChengMiNotice');
	
	},

	initGoodsBgList(state, data) {
		state.goodsBgList = data;
	},

	//登录弹框
	setSignView(state, data) {
		state.showSignView = data
	},

	//注册弹框
	setRegisterView(state, data) {
		state.showRegisterView = data
	},

	//忘记密码弹框
	setForgetPWView(state, data) {
		state.showForgetPWView = data
	},

	//绑定手机弹框
	setBindPhoneView(state, data) {
		state.showBindPhoneiew = data
	},


	//用户协议
	setAgreementChecked(state, condition) {
		state.agreementChecked = condition
	},

	//玩法介绍
	setHowPlay(state, data) {
		state.howPlay.show = data.show
		state.howPlay.html = data.html
	},

	//公告
	setSwitchNotice(state, data) {
		state.switchNotice = data
	},

	//绑定手机弹框
	setbindingmobileShow(state, data) {
		state.bindingmobileShow = data
	},

	//设置底部
	setFooterView(state, data) {
		state.showFooterView = data;
	},
	//设置头部
	setHeaderView(state, data) {
		state.showHeaderView = data;
	},
	//红包
	setRegPacket(state, data) {
		state.regPacket.closeRed = data.closeRed
		state.regPacket.openRed = data.openRed
		state.regPacket.leftSmall = data.leftSmall
		state.regPacket.money = data.money
	},

	//口令红包
	setPassRed(state, data) {
		state.passRed = data
	},

	//盲盒最近掉落
	updateBoxDropList(state, data) {
		state.boxDropList = data;
	},
	//对战 新的房间信息
	updateCreateBattleRoom(state, data) {
		state.battleCreateRoom = data;
	},
	updateJoinBattleRoom(state, data) {
		state.battleJoinRoom = data;
	},
	updateRoomWatchCount(state, data) {
		state.watchUserCount = data;
	},
	//加入对战房间弹框
	setBattleNotJoinNoitce(state, data) {
		state.notJoinRoomNotice = data
	},
	//点击箱子的信息
	setClickBattleBoxData(state, data) {
		state.clickBattleBoxData = data
	},

	//roll房开奖
	setOpenResultRollId(state, data) {
		state.openResultRollId = data
	},
	setTimingIndexNotice(state, data) {
		state.timingIndexNotice = data
	},

	setFliterParams(state, params) {
		state.fliterParams = params;
	},
	setActivityDialogVisible(state, data){
		state.showActivityDialog = data;
	},
	setActivityConfig(state, data){
		state.activityConfig = data;
	},
	setOtherConfig(state, data){
		state.otherConfig = data;
	},
	setPCClient(state, isPC) {
		state.isPCClient = isPC;
	},
	setSparkBg(state, data) {
		state.sparkBg = { ...state.sparkBg, ...data };
	},
	setIndexScrollPos(state, pos) {
		state.indexScrollPosition = pos;
	},
	setLuckyScrollPos(state, pos) {
		state.luckyScrollPosition = pos;
	},
}

const actions = {
	async getUserInfo(store) {
		const res = await getInfo();
		if (res.code === 0) {
			store.commit("setUserInfo", res.data);

			if (res.data.base.mobile == ''&&!Window.googleChannel) {
				store.commit("setBindPhoneView", true);
			}
		}
	},
	async refreshToken(store) {
		let token = localStorage.getItem(tokenName);
		if (token) {
			const res = await verifyToken();
			if (res.code === 0) {
				if (res.data.isValid) {
					store.commit('refreshToken', token);
					store.commit('setSwitchNotice', true);
					store.dispatch('getUserInfo');
					store.dispatch('getActivityConfig');
					Window.webSocketSend({ cid: 11, data: JSON.stringify({ token: token }) });
				} else {
					store.commit('logout');
				}
			}
		}

	},

	async initConfigList(store) {
		const res = await getConfigList();
		if (res.code === 0) {
			store.commit('initConfigList', res.data.items);
		}
	},

	async initModuleList(store) {
		const res = await getModuleList();
		if (res.code === 0) {
			store.commit('initModuleList', res.data);
		}
	},

	async initGoodsBgList(store) {
		const res = await getGoodsBgImages();
		if (res.code === 0) {
			let items = res.data.items;
			let list = {};
			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				if (!list[item.type]) {
					list[item.type] = {};
				}
				list[item.type][item.goodsLevel] = item.image;
			}
			store.commit('initGoodsBgList', list);
		}
	},
	async  getActivityConfig(store) {
		let type = 'ActivityConfig';
		const res = await getArticleList({ type: type, platformId: store.state.platformId });
		if (res.code === 0) {
			let items = res.data.items;
			if (items&&items.length > 0) {
				items.sort((a, b) => (a.sort - b.sort));
				let infoText = items[0].content;
				infoText=infoText.replace("<p>","");
				infoText=infoText.replace("</p>","");
				let config=JSON.parse(infoText);
				if(config){
					store.commit("setActivityConfig", config);
					store.commit("setActivityDialogVisible", config.open);
				}
			}
		}
	},
	async  getOtherConfig(store) {
		let type = 'OtherConfig';
		const res = await getArticleList({ type: type, platformId: store.state.platformId });
		if (res.code === 0) {
			let items = res.data.items;
			if (items&&items.length > 0) {
				items.sort((a, b) => (a.sort - b.sort));
				let infoText = items[0].content;
				infoText=infoText.replace("<p>","");
				infoText=infoText.replace("</p>","");
				var reg = new RegExp( '&amp;' , "g" )
				infoText=infoText.replace(reg,"&");
				let config=JSON.parse(infoText);
				if(config){
					console.log(config);
					store.commit("setOtherConfig", config);
				}
			}
		}
	},
}

export default createStore({
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions
})