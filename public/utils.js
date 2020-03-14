/*
 * formatTime：时间字符串的格式化处理
 */
function formatTime(templete = "{0}年{1}月{2}日 {3}时{4}分{5}秒") {
	let timeAry = this.match(/\d+/g);
	return templete.replace(/\{(\d+)\}/g, (...[, $1]) => {
		let time = timeAry[$1] || "00";
		return time.length < 2 ? "0" + time : time;
	});
}
String.prototype.formatTime = formatTime;

/* 
 * queryURLParams：获取URL地址问号和面的参数信息（可能也包含HASH值）
 */
function queryURLParams() {
	let obj = {};
	this.replace(/([^?=&#]+)=([^?=&#]+)/g, (...[, $1, $2]) => obj[$1] = $2);
	this.replace(/#([^?=&#]+)/g, (...[, $1]) => obj['HASH'] = $1);
	return obj;
}
String.prototype.queryURLParams = queryURLParams;


/*
 * _type：用来检测数据类型的对象
 */
let _type = (function () {
	var _obj = {
		isNumeric: "Number",
		isBoolean: 'Boolean',
		isString: 'String',
		isNull: 'Null',
		isUndefined: 'Undefined',
		isSymbol: 'Symbol',
		isPlainObject: 'Object',
		isArray: 'Array',
		isRegExp: 'RegExp',
		isDate: 'Date',
		isFunction: "Function",
		isWindow: 'Window'
	};

	var _type = {},
		_toString = _type.toString;
	for (var key in _obj) {
		if (!_obj.hasOwnProperty(key)) break;
		_type[key] = (function () {
			var reg = new RegExp("^\\[object " + _obj[key] + "\\]$");
			return function anonymous(val) {
				return reg.test(_toString.call(val));
			}
		})();
	}
	return _type;
})();

/*
 * _each：遍历数组、类数组、对象中的每一项 
 */
function _each(obj, callback, context = window) {
	let isLikeArray = _type.isArray(obj) || (('length' in obj) && _type.isNumeric(obj.length));
	typeof callback !== "function" ? callback = Function.prototype : null;

	//=>数组或者类数组
	if (isLikeArray) {
		let arr = [...obj];
		for (let i = 0; i < arr.length; i++) {
			let item = arr[i],
				result = callback.call(context, item, i);
			if (result === false) break;
			if (typeof result === "undefined") continue;
			arr[i] = result;
		}
		return arr;
	}

	//=>对象的处理
	let opp = {
		...obj
	};
	for (let key in opp) {
		if (!opp.hasOwnProperty(key)) break;
		let value = opp[key],
			result = callback.call(context, value, key);
		if (result === false) break;
		if (typeof result === "undefined") continue;
		opp[key] = result;
	}
	return opp;
}

/*
 * _throttle:函数的节流 
 */
function _throttle(func, wait) {
	let timer = null,
		result = null,
		previous = 0;
	return function anonymous(...args) {
		let context = this,
			now = new Date,
			spanTime = wait - (now - previous);
		if (spanTime <= 0) {
			result = func.call(context, ...args);
			clearTimeout(timer);
			timer = null;
			previous = now;
		} else if (!timer) {
			timer = setTimeout(() => {
				result = func.call(context, ...args);
				timer = null;
				previous = new Date;
			}, spanTime);
		}
		return result;
	}
}

/*
 * _debounce:函数的防抖
 */
function _debounce(func, wait) {
	let timer = null,
		result = null;
	return function anonymous(...args) {
		let context = this;
		clearTimeout(timer);
		timer = setTimeout(() => {
			result = func.call(context, ...args);
			timer = null;
		}, wait);
		return result;
	}
}

/*
 * DIALOG：模态框组件 
 */
window.alert = (function () {
	class Dialog {
		constructor(content, options) {
			this.content = content;
			this.options = options;
			this.timer = null;

			this.$DIALOG = null;
			this.$MAIN = null;
			this.$HEADER = null;
			this.$TITLE = null;
			this.$CLOSE = null;
			this.$BODY = null;
			this.$FOOTER = null;
			this.$CONFIRM = null;
			this.$CANCEL = null;

			//=>START
			this.init();
		}
		createDIV(cssText = '', type = 'div') {
			let div = document.createElement(type);
			div.style.cssText = cssText;
			return div;
		}
		create() {
			let {
				title,
				confirm,
				handled
			} = this.options,
				content = this.content;
			//=>创建元素
			this.$DIALOG = this.createDIV(`
				display:'none';
				position: fixed;
				top: 0;
				left: 0;
				z-index: 9999;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, .8);
				user-select: none;
				opacity: 0;
				transition: opacity .3s;
			`);
			this.$MAIN = this.createDIV(`
				position: absolute;
				top: 2rem;
				left: 50%;
				margin-left: -3rem;
				z-index: 9999;
				width: 6rem;
				background: #FFF;
				border-radius: .06rem;
				overflow: hidden;
				transform: translateY(-10rem);
				transition: transform .3s;
			`);
			this.$HEADER = this.createDIV(`
				position: relative;
				box-sizing: border-box;
				padding: 0 .2rem;
				height: .8rem;
				line-height:.8rem;
				background: #2299EE;
			`);
			this.$TITLE = this.createDIV(`
				font-size: .36rem;
				color: #FFF;
				font-weight: normal;
			`, 'h3');
			this.$CLOSE = this.createDIV(`
				position: absolute;
				right: 10px;
				top: 50%;
				transform: translateY(-50%);
				font-size:.48rem;
				font-style: normal;
				color: #FFF;
				font-family: 'Courier New';
				cursor: pointer;
			`, 'i');
			this.$BODY = this.createDIV(`
				padding: .6rem .2rem;
				line-height: .6rem;
				font-size: .3rem;
			`);
			this.$FOOTER = this.createDIV(`
				text-align: right;
				padding: .1rem;
				display:flex;
				justify-content:flex-end;
			`);
			this.$CONFIRM = this.createDIV(`
				margin: 0 .1rem;
				padding: 0 .3rem;
				height: .5rem;
				line-height: .5rem;
				border: none;
				font-size: .28rem;
				cursor: pointer;
				color: #FFF;
				background: #2299EE;
			`, 'button');
			this.$CANCEL = this.createDIV(`
				margin: 0 .1rem;
				padding: 0 .3rem;
				height: .5rem;
				line-height: .5rem;
				border: none;
				font-size:.28rem;
				cursor: pointer;
				color: #000;
				background: #DDD;
			`, 'button');
			//=>插入到页面中
			// HEADER
			this.$TITLE.innerHTML = title;
			this.$CLOSE.innerHTML = 'X';
			this.$HEADER.appendChild(this.$TITLE);
			this.$HEADER.appendChild(this.$CLOSE);
			this.$MAIN.appendChild(this.$HEADER);

			// BODY
			this.$BODY.innerHTML = content;
			this.$MAIN.appendChild(this.$BODY);

			// FOOTER
			if (confirm) {
				this.$CONFIRM.innerHTML = '确定';
				this.$CANCEL.innerHTML = '取消';
				this.$FOOTER.appendChild(this.$CONFIRM);
				this.$FOOTER.appendChild(this.$CANCEL);
				this.$MAIN.appendChild(this.$FOOTER);
			}

			this.$DIALOG.appendChild(this.$MAIN);
			document.body.appendChild(this.$DIALOG);
		}
		show() {
			let {
				$DIALOG,
				$MAIN
			} = this;
			$DIALOG.style.display = 'block';
			$DIALOG.style.opacity = 1;
			$MAIN.style.transform = 'translateY(0)';

			if (!this.options.confirm) {
				let handled = this.options.handled;
				this.timer = setTimeout(() => {
					this.hide();
					typeof handled === 'function' ? handled.call(this, 'CLOSE') : null;
					clearTimeout(this.timer);
					this.timer = null;
				}, 2000);
			}
		}
		hide() {
			clearTimeout(this.timer);
			this.timer = null;

			if (!this.$DIALOG) return;
			let {
				$DIALOG,
				$MAIN
			} = this;
			$DIALOG.style.opacity = 0;
			$MAIN.style.transform = 'translateY(-1000px)';

			//=>动画结束让其隐藏
			let hidden = () => {
				$DIALOG.style.display = 'none';
				document.body.removeChild($DIALOG);
				$DIALOG.removeEventListener('transitionend', hidden);
			};
			$DIALOG.addEventListener('transitionend', hidden);
		}
		init() {
			this.create();
			this.$DIALOG.offsetLeft;
			this.show();

			//=>事件处理
			let {
				$CLOSE,
				$CONFIRM,
				$CANCEL,
				options: {
					confirm,
					handled
				}
			} = this;
			$CLOSE.onclick = () => {
				this.hide();
				typeof handled === 'function' ? handled.call(this, 'CLOSE') : null;
			};
			if (confirm) {
				$CONFIRM.onclick = () => {
					this.hide();
					typeof handled === 'function' ? handled.call(this, 'CONFIRM') : null;
				};
				$CANCEL.onclick = () => {
					this.hide();
					typeof handled === 'function' ? handled.call(this, 'CANCEL') : null;
				};
			}
		}
	}

	return function anonymous(content = '', options = {}) {
		options = Object.assign({
			title: '系统温馨提示',
			confirm: false,
			handled: null
		}, options);
		return new Dialog(content, options);
	}
})();