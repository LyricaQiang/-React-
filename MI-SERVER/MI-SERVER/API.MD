=======个人中心 /user/xxx
1. 登录
/login  POST
@params
	account=xxx&password=xxx&type=1
		account 用户名或者手机号
		password 密码或者手机校验码（需要MD5）
		type 默认1代表用户名密码校验方式  2代表手机号和校验码验证方式
@return
	{
		code:0成功  1失败
		codeText:状态描述
		data:{  如果登录成功，返回登录者基本信息
			id:用户ID
			name:用户名
			phone:用户手机号
			pic:用户头像
		}
	}

2. 校验是否登录
/login  GET
@params
@return
	{
		code:0已经登录  1未登录
		codeText:状态描述
	}

3. 退出登录
/signout  GET
@params
@return
	{
		code:0
		codeText:状态描述
	}

4. 注册新用户
/register POST
@params
	name=xxx&phone=xxx&password=xxx&passwordPay=xxx
@return
	{
		code:0
		codeText
	}

5. 获取用户信息
/info GET
@params
	id=xxx
		id:用户ID，不传则为获取当前登录用户的信息
@return
	{
		code:0
		codeText:状态描述
		data:{ 
			id:用户ID
			name:用户名
			phone:用户手机号
			pic:用户头像
		}
	}

6. 验证手机号是否被注册
/phone POST
@params
	phone=xxx
@return
	{
		code:0已经注册 1未注册
		codeText:状态描述
	}

7. 发送短信验证码
/code POST
@params
	phone=xxx
@return
	{
		code:0已发送 1未发送
		codeText:状态描述
	}

8. 校验验证码是否正确
/checkCode POST
@params
	phone=xxx&code=xxx
@return
	{
		code:0正确 1不正确
		codeText:状态描述
	}

=======产品中心 /product/xxx
1. 获取BANNER数据
/banner  GET
@params
@return
	{
		code:0 1
		codeText:状态描述
		data:[{
			id:1, 
			pic:'',
			title:'',
			link:''
		},...]
	}

2. 获取商品列表
/list  GET
@params
	type=xxx&recommend=true
		type商品大类（默认空）
		recommend是否是推荐的（默认false）
@return
	{
		code:0
		codeText:状态描述
		data:[{
			id:1,
			title:'',
			pic:'',
			images:[],
			detail:{
				text:'',
				images:[]
			},
			price:'',
			discount:'',
			limitedTime:'',
			recommend:,
			category1:'',
			category2:'',
			tag:''
		},...]
	}

3. 获取限时抢购的商品
/limited  GET
@params
	time=xxx
@return
	{
		code:0
		codeText:状态描述
		data:[{
			id:1,
			title:'',
			pic:'',
			images:[],
			...
		},...]
	}

4. 获取商品详情
/info  GET
@params
	id=xxx
@return
	{
		code:0
		codeText:状态描述
		data:{
			id:1,
			title:'',
			pic:'',
			images:[],
			...
		}
	}

5. 获取类别
/category  GET
@params
@return
	{
		code:0
		codeText:状态描述
		data:[{
			"id": 1,
			"name": "手机电脑",
			"children": [{
				"id": 1,
				"name": "手机"
			},...]
		},...]
	}

6. 获取服务器时间
/serverTime HEAD
@params
@return
	服务器返回的响应头中包含着服务器的时间

=======购物中心 /cart/xxx
1. 加入购物车
/add POST
@params
	pid=xxx&count=xxx
		pid产品ID
		count购买数量(默认1)
@return
	{
		code:0
		codeText:状态描述
	}

2. 修改购物车某产品数量
/update POST
@params
	id=xxx&count=xxx
		id购物车标识ID
@return
	{
		code:0
		codeText:状态描述
	}

3. 移除购物车中的某产品
/remove GET
@params
	id=xxx
@return
	{
		code:0
		codeText:状态描述
	}

4. 获取当前用户指定状态下的订单信息
/list GET
@params
	state=xxx  
	0全部（默认）  1未支付（等同于购物车）  
	2待收货（等同于已支付） 3待评价（等同于已收货）  
	4已评价
@return
	{
		code:0
		codeText:状态描述,
		data:[{
			id:xxx,
			pid:xxx,
			count:xxx,
			state:xxx,
			info:{
				...产品详细信息
			}
		}]
	}

5. 修改订单的状态
/state GET
@params
	id=xxx&state=xxx
@return
	{
		code:0
		codeText:状态描述
	}