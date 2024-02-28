"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _commonUtils = _interopRequireDefault(require("./commonUtils"));

var _timeChunk = _interopRequireDefault(require("./timeChunk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var CONFIG = {
  precisionSetting: {
    10: 8640,
    // 10s
    60: 1440,
    // 1min
    300: 288,
    // 5min
    600: 144,
    // 10min
    1800: 48,
    // 30min
    3600: 24 // 1h

  },
  wheelIndexMap: [3600, 1800, 600, 300, 60, 10],
  speed: 1 // 速度

};
/**
 * 时间轴组件类
 * @param {el} 元素选择器
 * @param {config} 配置参数
 */

var timeSlider =
/*#__PURE__*/
function (_CommonUtils) {
  _inherits(timeSlider, _CommonUtils);

  function timeSlider(el) {
    var _this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, timeSlider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(timeSlider).call(this));
    _this.el = el;
    _this.PRECISION = 3600; // 最小精度

    _this.DAYSECONDS = 60 * 60 * 24; // 一天的秒数

    _this.PADDINGLEFT = 20; // 根元素的padding值

    _this.precisionSetting = CONFIG.precisionSetting; // 精度对应参数
    // 初始化dom元素

    _this.initDomInfo(); // 初始化事件监听


    _this.initRootDomEvent(); // 初始化时间轴


    _this.initTimeAxisDom(_this.PRECISION);

    _this.timeChunkType = config.timeChunkType; // 交互相关

    _this.isMouseDown = false; // 是否按下鼠标了

    _this.startX = null; // 开始坐标

    _this.startLeft = null; // 开始left距离

    _this.startMouseDownTime = null; // 开始按下鼠标时间

    _this.wheelIndex = 0; // 时间轴缩放精度值的索引

    _this.wheelIndexMap = CONFIG.wheelIndexMap; // 精度时间的集合

    _this.speed = config.speed || CONFIG.speed; // 倍速

    _this.timer = null; // 定时器，测试用

    _this.curPlayTimeChunk = []; // 目前播放的时间块 0->开始时间 1->结束时间 2->时间块的索引
    // 长度相关

    _this.axisLength = null;
    _this.allAxisLength = null;
    _this.presentSeconds = config.presentSeconds || 0; // 当前时间(s)

    _this.timeNow = ''; // 当前时间字符串

    _this.timeLineOutClient = false; // 时间线是否超出屏幕了

    _this.isValidMove = true; // 是否为有效的移动

    _this.curDaytimeChunkArray = config.curDaytimeChunkArray || []; // '001201-031236-A' 当天的时间块

    _this.timeChunkArray = _this.curDaytimeChunkArray; // 当前展示的时间块

    _this.isInitialPlay = config.isInitialPlay || false;
    _this.onClickCallback = config.onClick; // 外部监听点击事件回调

    _this.onMoveCallback = config.onMove; // 外部监听移动事件回调

    _this.onMouseDownCallback = config.onMouseDown; // 外部监听mousedown事件

    _this.initAxis();

    _this.initTimeChunk(); // this.initTimeChunkSelector()
    // 模拟播放条件


    if (config.presentSeconds && _this.curDaytimeChunkArray.length) {
      // 找出当前时间所在的时间块
      for (var i = 0; i < _this.curDaytimeChunkArray.length; i++) {
        // 解析时间块的时间
        var timeData = _this.curDaytimeChunkArray[i].split('-');

        var startTime = timeData[0];
        var endTime = timeData[1];

        if (_this.presentSeconds >= startTime && _this.presentSeconds <= endTime) {
          _this.curPlayTimeChunk = [startTime, endTime, i];
          _this.isInitialPlay && _this.timeLinePlay();
          break;
        }
      }
    }

    return _this;
  } // 重新初始化时间轴精度


  _createClass(timeSlider, [{
    key: "initAxis",
    value: function initAxis(flag) {
      console.log('initAxis', flag); // todo

      if (this.timeChunkArray.length === 0) {
        // document.getElementsByClassName('ts-line')[0].style.display = 'none';
        // this.timeLineDom = null;
        // document.getElementsByClassName('ts-timeChunk')[0].style.display = 'none';
        this.calTimeSlider();
      } else {
        this.initTimeAxisDom(this.wheelIndexMap[this.wheelIndex]);
        this.calTimeSlider();
        !flag && this.setTimeLineLeft(); // 时间块

        this.initTimeChunk();
      }
    } // 初始化时间块

  }, {
    key: "initTimeChunk",
    value: function initTimeChunk() {
      var _this2 = this;

      var list = document.querySelectorAll('.ts-timeChunk');
      list.forEach(function (item) {
        item.remove();
      });
      this.timeChunkArray.forEach(function (item, index) {
        var dom = new _timeChunk["default"](item).createDom(_this2.allAxisLength, _this2.timeChunkType);

        _this2.containerDom.appendChild(dom);
      });
    } // 初始化dom信息

  }, {
    key: "initDomInfo",
    value: function initDomInfo() {
      this.rootDom = this.getDomInstanceUtils(this.el); // 创建容器元素

      var containerDiv = document.createElement('div');
      containerDiv.classList.add('ts-container');
      this.rootDom.appendChild(containerDiv);
      this.containerDom = containerDiv; // 初始化时间线

      var div = document.createElement('div');
      var span = document.createElement('span'); // 初始化辅助时间线

      var divAssist = document.createElement('div');
      var spanAssist = document.createElement('span');
      divAssist.classList.add('ts-assist-line');
      spanAssist.classList.add('ts-assist-line-present');
      div.classList.add('ts-line');
      span.classList.add('ts-line-present');
      span.innerHTML = '00:00:00';
      spanAssist.innerHTML = '00:00:00';
      div.appendChild(span);
      divAssist.appendChild(spanAssist);
      this.rootDom.appendChild(div);
      this.rootDom.appendChild(divAssist); // 时间线dom

      this.timeLinePresentDom = span;
      this.timeLineDom = div; // 辅助线dom

      this.assistTimeLinePresentDom = spanAssist;
      this.assistTimeLineDom = divAssist;
    }
  }, {
    key: "initRootDomEvent",
    value: function initRootDomEvent() {
      var _this3 = this;

      var that = this; // 鼠标滑动时间轴

      this.rootDom.addEventListener('mousedown', function (e) {
        that.isMouseDown = true;
        that.startX = e.offsetX;
        _this3.startLeft = that.domLeftToNumberUtils(that.containerDom);
        _this3.startMouseDownTime = new Date().getTime();

        _this3.rootDom.classList.add('ts-move');

        _this3.isValidMove = true;
      });
      this.rootDom.addEventListener('mousemove', function (e) {
        // 判断是否在移动
        if (_this3.isMouseDown && new Date().getTime() - that.startMouseDownTime > 300) {
          try {
            _this3.onMoveCallback && _this3.onMoveCallback();
          } catch (e) {}
        }

        if (that.isMouseDown && _this3.precision !== 3600) {
          var offsetX = e.offsetX - _this3.startX;
          var isDragToLeft = offsetX < 0;
          var isDragToRight = offsetX > 0; // 滚动到临界值

          var isRightOver = _this3.allAxisLength + that.containerDom.offsetLeft < 20 + _this3.rootDom.offsetWidth;

          if (_this3.startLeft + offsetX > 20 && isDragToRight) {
            that.containerDom.style.left = 0 + 'px';
            _this3.isValidMove = false;
            return;
          } else if (isRightOver && isDragToLeft) {
            that.containerDom.style.left = -_this3.allAxisLength + _this3.rootDom.offsetWidth - 35 + 'px';
            _this3.isValidMove = false;
            return;
          }

          that.containerDom.style.left = _this3.startLeft + offsetX + 'px';
        } // 处理辅助时间线


        _this3.showMouseMoveAssistTimeLine(e.offsetX);
      });
      this.rootDom.addEventListener('mouseup', function (e) {
        _this3.assistTimeLineDom.style.display = 'none';
        _this3.assistTimeLinePresentDom.style.display = 'none';
        var oldPresentSeconds = _this3.presentSeconds; // 处理点击事件

        if (new Date().getTime() - that.startMouseDownTime < 300) {
          _this3.handleClick(e.offsetX);
        } else {// 计算当前时间
          // this.calCurPreseconds(e.offsetX - this.startX - this.PADDINGLEFT)
        }

        that.isMouseDown = false;

        _this3.rootDom.classList.remove('ts-move'); // 判断是否在移动


        try {
          _this3.onMouseDownCallback && _this3.onMouseDownCallback();
        } catch (e) {} // 校验当前位置


        if (_this3.verifyTimeLineSite(oldPresentSeconds)) {
          return;
        } else {
          _this3.timeLinePlay();
        }
      });
      this.rootDom.addEventListener('mouseout', function (e) {
        that.isMouseDown = false;
        _this3.assistTimeLineDom.style.display = 'none';
        _this3.assistTimeLinePresentDom.style.display = 'none';

        _this3.rootDom.classList.remove('ts-move');
      }); // 鼠标滑动进行缩放

      this.rootDom.addEventListener('mousewheel', function (e) {
        console.log(e);
        var oldAllAxisLength = that.allAxisLength;

        var oldTimeLineLeft = _this3.domLeftToNumberUtils(_this3.timeLineDom);

        if (e.wheelDelta > 0) {
          if (that.wheelIndex < that.wheelIndexMap.length - 1) {
            ++that.wheelIndex;
            that.precision = that.wheelIndexMap[that.wheelIndex]; //重新初始化

            that.initAxis(true);

            _this3.zoomSetTimeSlider(oldAllAxisLength, oldTimeLineLeft, that.allAxisLength, true);
          }
        } else {
          if (that.wheelIndex > 0) {
            --that.wheelIndex;
            that.precision = that.wheelIndexMap[that.wheelIndex]; //重新初始化

            that.initAxis(true);

            _this3.zoomSetTimeSlider(oldAllAxisLength, oldTimeLineLeft, that.allAxisLength, false);
          }
        } // 精度为1小时需要设置left


        if (that.precision === 3600) {
          _this3.containerDom.style.left = 0;
        } // 判断时间轴left值不能大于0


        if (that.containerDom.offsetLeft >= 0) {
          that.containerDom.style.left = 0;
        } // 以及right值 大于0需要归0


        if (_this3.allAxisLength + _this3.rootDom.offsetLeft <= document.body.clientWidth) {
          _this3.rootDom.style.left = -_this3.allAxisLength + document.body.clientWidth - 2 * _this3.paddingLeft + 'px';
        }

        _this3.setTimeLineLeft();
      });
    }
  }, {
    key: "handleChangeTimeChunk",
    value: function handleChangeTimeChunk(type) {
      var that = this;
      var oldAllAxisLength = that.allAxisLength;
      var oldTimeLineLeft = this.domLeftToNumberUtils(this.timeLineDom);

      if (type == 1) {
        if (that.wheelIndex < that.wheelIndexMap.length - 1) {
          ++that.wheelIndex;
          that.precision = that.wheelIndexMap[that.wheelIndex]; //重新初始化

          that.initAxis(true);
          this.zoomSetTimeSlider(oldAllAxisLength, oldTimeLineLeft, that.allAxisLength, true);
        }
      } else {
        if (that.wheelIndex > 0) {
          --that.wheelIndex;
          that.precision = that.wheelIndexMap[that.wheelIndex]; //重新初始化

          that.initAxis(true);
          this.zoomSetTimeSlider(oldAllAxisLength, oldTimeLineLeft, that.allAxisLength, false);
        }
      } // 精度为1小时需要设置left


      if (that.precision === 3600) {
        this.containerDom.style.left = 0;
      } // 判断时间轴left值不能大于0


      if (that.containerDom.offsetLeft >= 0) {
        that.containerDom.style.left = 0;
      } // 以及right值 大于0需要归0


      if (this.allAxisLength + this.rootDom.offsetLeft <= document.body.clientWidth) {
        this.rootDom.style.left = -this.allAxisLength + document.body.clientWidth - 2 * this.paddingLeft + 'px';
      }

      this.setTimeLineLeft();
    }
  }, {
    key: "secondsToTime",
    value: function secondsToTime(seconds) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor(seconds % 3600 / 60);
      var remainingSeconds = (seconds % 60).toFixed(0);
      hours = hours.toString().padStart(2, '0');
      minutes = minutes.toString().padStart(2, '0');
      remainingSeconds = remainingSeconds.toString().padStart(2, '0');
      return "".concat(hours, ":").concat(minutes, ":").concat(remainingSeconds);
    }
    /**
     * 处理点击事件
     * @param {number} left 鼠标点击时offsetX的值
     */

  }, {
    key: "handleClick",
    value: function handleClick(left) {
      console.log(left);
      var oldPresentSeconds = this.presentSeconds;
      this.presentSeconds = (-this.domLeftToNumberUtils(this.containerDom) + left - this.PADDINGLEFT) * this.DAYSECONDS / this.allAxisLength;

      try {
        this.onClickCallback && this.onClickCallback(Math.floor(oldPresentSeconds), Math.floor(this.presentSeconds), this.secondsToTime(this.presentSeconds));
      } catch (err) {
        console.warn(err);
      }

      this.setTimeLineLeft();
    }
    /**
     * 检验时间线移动后的位置
     * @param {number} oldPresentSeconds 移动前的时间
     * @returns {undefined | true}
     */

  }, {
    key: "verifyTimeLineSite",
    value: function verifyTimeLineSite(oldPresentSeconds) {
      if (!this.timeChunkArray.length) {
        return;
      } // 当前位置没有录像


      var isInTimeChunk = false; // 是否再

      var isInLastRight = this.presentSeconds > this.getTimeChunkLastEndTime();

      for (var i = 0; i < this.timeChunkArray.length; i++) {
        var timeArr = this.timeChunkArray[i].split('-');
        var startTimeSecond = this.timeTranslateSecondsUtils(timeArr[0]);
        var endTimeSecond = this.timeTranslateSecondsUtils(timeArr[1]);

        if (startTimeSecond <= this.presentSeconds && this.presentSeconds <= endTimeSecond) {
          isInTimeChunk = true;
          this.curPlayTimeChunk[0] = startTimeSecond;
          this.curPlayTimeChunk[1] = endTimeSecond;
          this.curPlayTimeChunk[2] = i;
          break;
        }
      } // 判断当前时间有录像


      if (isInTimeChunk) {
        return;
      } // 获取下一段录像


      if (!isInLastRight) {
        for (var _i = 0; _i < this.timeChunkArray.length; _i++) {
          var _timeArr = this.timeChunkArray[_i].split('-');

          var timeNextArr = void 0,
              nextEndTimeSecond = void 0;

          var _startTimeSecond = this.timeTranslateSecondsUtils(_timeArr[0]);

          var _endTimeSecond = this.timeTranslateSecondsUtils(_timeArr[1]);

          if (_i + 1 >= this.timeChunkArray.length) {
            nextEndTimeSecond = 0;
          } else {
            timeNextArr = this.timeChunkArray[_i + 1].split('-');
            nextEndTimeSecond = this.timeTranslateSecondsUtils(timeNextArr[1]);
          }

          if (nextEndTimeSecond < this.presentSeconds && this.presentSeconds < _startTimeSecond) {
            this.presentSeconds = _startTimeSecond;
            this.curPlayTimeChunk[0] = _startTimeSecond;
            this.curPlayTimeChunk[1] = _endTimeSecond;
            this.curPlayTimeChunk[2] = _i;
            break;
          }
        }
      } else {
        // 无法获取最后一段时间
        this.presentSeconds = oldPresentSeconds;
        this.setTimeLineLeft();
        return true;
      }

      this.setTimeLineLeft();
    } // 拖拽后 计算当前时间

  }, {
    key: "calCurPreseconds",
    value: function calCurPreseconds(x) {
      this.presentSeconds = -x * 60 * 60 * 24 / this.allAxisLength + this.presentSeconds;
    }
    /**
    * 获取长度
    @param {number} precision 精度大小 1|5|10|30|60
    */

  }, {
    key: "calTimeSlider",
    value: function calTimeSlider() {
      console.log('calTimeSlider');
      var axisDom = this.getDomInstanceUtils('.ts-axis');
      this.axisLength = axisDom.getBoundingClientRect().width.toFixed(2);
      this.allAxisLength = axisDom.getBoundingClientRect().width.toFixed(2) * this.precisionSetting[this.wheelIndexMap[this.wheelIndex]];
    }
    /**
    * 时间轴dom的展示
    @param {number} precision 精度大小 1|5|10|30|60
    */

  }, {
    key: "initTimeAxisDom",
    value: function initTimeAxisDom(precision) {
      this.containerDom.innerHTML = '';
      var axisNum = this.precisionSetting[precision]; // 获取轴的数量

      for (var i = 0; i < axisNum; i++) {
        var div = document.createElement('div');
        div.classList.add('ts-axis'); // 特殊轴的处理 最后一轴

        if (i === axisNum - 1) {
          div.classList.add('ts-axis-last');
          var span = document.createElement('span');
          span.classList.add('ts-axis-time-last');
          span.innerText = "24:00";
          div.appendChild(span);
        }

        if (i % 2 === 0 && axisNum === 24) {
          var _span = document.createElement('span');

          _span.classList.add('ts-axis-time');

          _span.innerText = "".concat(i >= 10 ? i : '0' + i, ":00");
          div.appendChild(_span);
        }

        if (axisNum === 48) {
          var _span2 = document.createElement('span');

          _span2.classList.add('ts-axis-time');

          var min = i % 2;
          var hour = Math.floor(i / 2);
          _span2.innerText = "".concat(hour >= 10 ? hour : '0' + hour, ":").concat(min ? '30' : '00');
          div.appendChild(_span2);
        }

        if (axisNum === 144) {
          var _span3 = document.createElement('span');

          _span3.classList.add('ts-axis-time');

          var time = i * 10;

          var _min = time % 60;

          var _hour = (time - _min) / 60;

          _span3.innerText = "".concat(_hour >= 10 ? _hour : '0' + _hour, ":").concat(_min >= 10 ? _min : '0' + _min);
          div.appendChild(_span3);
        }

        if (axisNum === 288) {
          var _span4 = document.createElement('span');

          _span4.classList.add('ts-axis-time');

          var _time = i * 5;

          var _min2 = _time % 60;

          var _hour2 = (_time - _min2) / 60;

          _span4.innerText = "".concat(_hour2 >= 10 ? _hour2 : '0' + _hour2, ":").concat(_min2 >= 10 ? _min2 : '0' + _min2);
          div.appendChild(_span4);
        }

        if (axisNum === 1440) {
          var _span5 = document.createElement('span');

          _span5.classList.add('ts-axis-time');

          var _time2 = i * 1;

          var _min3 = _time2 % 60;

          var _hour3 = (_time2 - _min3) / 60;

          _span5.innerText = "".concat(_hour3 >= 10 ? _hour3 : '0' + _hour3, ":").concat(_min3 >= 10 ? _min3 : '0' + _min3);
          div.appendChild(_span5);
        }

        if (i % 6 === 0 && axisNum === 8640) {
          var _span6 = document.createElement('span');

          _span6.classList.add('ts-axis-time');

          var _time3 = i * 10;

          var _min4 = _time3 / 60 % 60;

          var _hour4 = Math.floor(_time3 / 60 / 60).toFixed(2) * 100 / 100;

          _span6.innerText = "".concat(_hour4 >= 10 ? _hour4 : '0' + _hour4, ":").concat(_min4 >= 10 ? _min4 : '0' + _min4);
          div.appendChild(_span6);
        }

        var line = document.createElement('div');
        line.classList.add('ts-axis-line');
        div.appendChild(line);
        div.classList.add('ts-axis-60');
        this.containerDom.appendChild(div);
      }
    }
    /**
     * 设置时间线的位置
     */

  }, {
    key: "setTimeLineLeft",
    value: function setTimeLineLeft() {
      var left = this.presentSeconds * (this.allAxisLength / this.DAYSECONDS);
      left = left + this.domLeftToNumberUtils(this.containerDom);
      console.log(left, this, this.timeLineDom);
      this.timeLineDom.style.left = this.PADDINGLEFT + left + 'px';
    }
    /**
    * 缩放的时候，以时间线为中心进行，时间线相对位置不变
    * @param {number}  oldAxisLength 旧的时间轴长度
    * @param {number}  oldTimeLineLeft 旧的时间线left长度
    * @param {number}  newAxisLength 新的时间轴长度
    */

  }, {
    key: "zoomSetTimeSlider",
    value: function zoomSetTimeSlider(oldAxisLength, oldTimeLineLeft, newAxisLength) {
      var curRootDomLeft = this.domLeftToNumberUtils(this.containerDom);
      var left = (oldTimeLineLeft - this.PADDINGLEFT - curRootDomLeft) / oldAxisLength * newAxisLength - (oldTimeLineLeft - this.PADDINGLEFT);
      this.containerDom.style.left = -left + 'px';
    }
    /**
     * 测试模拟时间线停止移动
     */

  }, {
    key: "timeLineStop",
    value: function timeLineStop() {
      clearInterval(this.timer);
      this.timer = null;
      /**
      * 测试模拟时间线开始移动
      */
    }
  }, {
    key: "timeLinePlay",
    value: function timeLinePlay() {
      this.presentSeconds = this.presentSeconds; // 拖动的时候指针不滚动

      if (this.isMouseDown) {
        return;
      }

      var left = this.speed * (this.allAxisLength / this.DAYSECONDS) + this.domLeftToNumberUtils(this.timeLineDom);
      this.setTimeLineLeft();

      if (this.containerDom.offsetWidth < left) {
        this.isRightOver = true;
      } else {
        this.isRightOver = false;
      }

      this.timeNow = this.secondsTranslateTimeUtils(this.presentSeconds);
      this.timeLinePresentDom.innerText = this.timeNow; // 当段录像播放完毕  兼容处理'174252-174656-A', '173952-174253-A'
      // +2为了临界值的判断

      if (this.presentSeconds + 1 >= this.curPlayTimeChunk[1]) {
        var index = this.curPlayTimeChunk[2] - 1;

        if (index < 0) {
          this.presentSeconds = this.presentSeconds + this.speed;
          this.setTimeLineLeft();
          this.timeLineStop();
          this.playbackState = 0;
          return;
        }

        var timeArr = this.timeChunkArray[index].split('-');
        var startTimeSecond = this.timeTranslateSecondsUtils(timeArr[0]);
        var endTimeSecond = this.timeTranslateSecondsUtils(timeArr[1]);
        this.presentSeconds = startTimeSecond;
        this.curPlayTimeChunk[0] = startTimeSecond;
        this.curPlayTimeChunk[1] = endTimeSecond;
        this.curPlayTimeChunk[2] = index;
        this.playbackState = 0;
        this.setTimeLineLeft();
        this.timeNow = this.secondsTranslateTimeUtils(this.presentSeconds);
        this.timeLinePresentDom.innerText = this.timeNow;
      }
    }
    /**
     * 获取时间块最后一段的结束时间
     */

  }, {
    key: "getTimeChunkLastEndTime",
    value: function getTimeChunkLastEndTime() {
      return this.timeTranslateSecondsUtils(this.timeChunkArray[0] && this.timeChunkArray[0].split('-')[1]);
    }
    /**
     * 获取时间块的第一段的开始时间
     */

  }, {
    key: "getTimeChunkFirstStartTime",
    value: function getTimeChunkFirstStartTime() {
      return this.timeTranslateSecondsUtils(this.timeChunkArray[this.timeChunkArray.length - 1] && this.timeChunkArray[this.timeChunkArray.length - 1].split('-')[0]);
    }
    /**
    * 获取时间块的第一段的结束时间
    */

  }, {
    key: "getTimeChunkFirstEndTime",
    value: function getTimeChunkFirstEndTime() {
      return this.timeTranslateSecondsUtils(this.timeChunkArray[this.timeChunkArray.length - 1] && this.timeChunkArray[this.timeChunkArray.length - 1].split('-')[1]);
    }
    /**
     * 展示鼠标移动时的时间线时间
     */

  }, {
    key: "showMouseMoveAssistTimeLine",
    value: function showMouseMoveAssistTimeLine(left) {
      var seconds = (-this.domLeftToNumberUtils(this.containerDom) + left - this.PADDINGLEFT) * this.DAYSECONDS / this.allAxisLength;
      var timeNow = this.secondsTranslateTimeUtils(seconds); // 开启辅助时间线

      if (seconds >= 0 && seconds <= 60 * 60 * 24) {
        this.assistTimeLineDom.style.display = 'block';
        this.assistTimeLinePresentDom.style.display = 'block';
      } else {
        this.assistTimeLineDom.style.display = 'none';
        this.assistTimeLinePresentDom.style.display = 'none';
      }

      this.assistTimeLinePresentDom.innerText = timeNow;
      var leftPx = seconds * (this.allAxisLength / this.DAYSECONDS);
      leftPx = leftPx + this.domLeftToNumberUtils(this.containerDom);
      this.assistTimeLineDom.style.left = this.PADDINGLEFT + leftPx + 'px';
    }
  }]);

  return timeSlider;
}(_commonUtils["default"]);

var _default = timeSlider;
exports["default"] = _default;