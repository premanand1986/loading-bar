var loadingBar = function(container,_options) {
	var self = this;
	var options = {styles:{},duration:0};
	if (!_options) {
		_options = {};
	}
	if(!_options.styles){
		_options.styles = {};
	}
	
	/*
	 * internal_options are the default styling and duration properties
	 */
	var internal_options = {
		"mode":"async",
		"syncDataFeeder":function(){},
		"styles":{
			border :"1px solid #949494",
			width :"375px",
			height :"14px",
			backgroundColor :"transparent",
			backgroundImage :null,
			forgroundColor :"#929292",
			forgroundImage :null
		},
		"duration":120
	};
	
	/*
	 * Merge the coders options with the default Internal_options.
	 */	
	options.mode = _options.mode || internal_options.mode;
	options.syncDataFeeder = _options.syncDataFeeder || internal_options.syncDataFeeder;
	
	options.styles.border =_options.styles.border || internal_options.styles.border;
	options.styles.width = _options.styles.width || internal_options.styles.width;
	options.styles.height = _options.styles.height || internal_options.styles.height;
	options.styles.backgroundColor = _options.styles.backgroundColor || internal_options.styles.backgroundColor;
	options.styles.backgroundImage = _options.styles.backgroundImage || internal_options.styles.backgroundImage;
	options.styles.forgroundColor = _options.styles.forgroundColor || internal_options.styles.forgroundColor;
	options.styles.forgroundImage = _options.styles.forgroundImage || internal_options.styles.forgroundImage;
	
	options.duration = (_options.duration * 100) || (internal_options.duration * 100);
	
	/**
	 * Private functions for the timer logic.
	 */	
	var helper = {}; 
	var dynBar ;
	var loading_counter = 0;
	var total_width = 0;
	var counter_incr = 0;
	var killTimer = false;
	var moveToPoint = 0;
	
	/*
	 * create the loading bar and trigger the loading process.
	 */
	helper.addLoaderBar = function(){
		var backGroundStr = "";
		var outer_div;
		var inner_div;
		outer_div = new Element("div",{
											"style":"margin:0px auto;padding:0px;border:"+options.styles.border+";width:"+options.styles.width+";height:"+options.styles.height+";"
										});
		inner_div = new Element("div",{
											"style":"margin:0px;padding:0px;border:0px none;width:0px;height:"+options.styles.height+";"
										});
		inner_div.update("");
		
		backGroundStr=options.styles.backgroundColor;
		if(options.styles.backgroundImage){
			backGroundStr = "url("+options.styles.backgroundImage+") repeat-x "+options.styles.backgroundColor;
		}
		outer_div.style.background = backGroundStr;
		
		backGroundStr = options.styles.forgroundColor;
		if(options.styles.forgroundImage){
			backGroundStr="url("+options.styles.forgroundImage+") repeat-x "+options.styles.forgroundColor;
		}
		inner_div.style.background=backGroundStr;
		outer_div.appendChild(inner_div);
		container.appendChild(outer_div);
		
		self.component = outer_div;
		
		dynBar = inner_div;
	};
	
	/*
	 * resetParams used to initialze the varaibles used for the timer logic.
	 */
	helper.resetParams = function(property) {
		 var resetValues = {};
		 resetValues.loading_counter = 0;
		 resetValues.total_width = options.styles.width.split("px")[0];
		 resetValues.counter_incr = resetValues.total_width/options.duration;
		 resetValues.killTimer = true;
		 resetValues.moveToPoint = resetValues.total_width;
		 
		 if(property){
			property=resetValues[property];
		 }else{
			 loading_counter = resetValues.loading_counter;
			 total_width = resetValues.total_width;
			 counter_incr = resetValues.counter_incr;
			 killTimer = resetValues.killTimer;
			 moveToPoint = resetValues.moveToPoint;
		 }
	};
	/*
	 * changeDynamicWidthCounter - the timer logic
	 */
	helper.changeDynamicWidthCounter = function() {
		if(self.component && loading_counter<total_width){
			loading_counter += counter_incr;
			dynBar.style.width = loading_counter+"px";
			if(!killTimer && ((options.mode == "sync" && loading_counter <= moveToPoint) ||(options.mode == "async"))){
				setTimeout(helper.changeDynamicWidthCounter,10);
			}else if(options.mode=="sync" && loading_counter > moveToPoint){
				helper.resetParams(moveToPoint);
				self.stop();
			}
		}else if(self.component){
			self.reset();
			self.start();
		}
	};
	
			
	/**
	 * This property holds the loader component container his is created dynamically.t
	 * @type DOM element.
	 * @member loader.
	 */
	this.component = null;
	
	/**
	 * This is to initialize the loader .This happens only for the first time.
	 * @member loader.
	 */
	this.add = function() {
		if(!self.component){
			helper.addLoaderBar();
			helper.resetParams();
			
			if(options.mode == "sync"){
				options.syncDataFeeder(self);
			}else{
				self.start();
			}
		}
	};
	
	/**
	 * This is to start or continue the loading progress.
	 * @member loader.
	 */
	this.start=function() {
		if(killTimer == true){
			killTimer = false;
			setTimeout(helper.changeDynamicWidthCounter,10);
		}
	};
	
	/**
	 * This method is to stop the loading progress and retain the last state of the loading bar.
	 * @member loader
	 */
	this.stop=function() {
		if(killTimer == false){
			killTimer = true;
		}
	};
	
	/**
	 * This method is to stop the loading progress and start the loading again from the initial point.
	 * @member loader
	 */
	this.reset=function() {
		helper.resetParams();
	};
	
	this.moveTo = function(x) {
		moveToPoint = x;
		
		if(killTimer == true){
			self.start();
		}
	};
	/**
	 * This method is to remove the loading bar from the DOM.
	 * @member loader
	 */
	this.remove=function() {
		if(self.component){
			killTimer=true;
			self.component.remove();
			self.component = null;
		}
	};		
	
	/*
	 * trigger the add function.
	 */
	 self.add();

};