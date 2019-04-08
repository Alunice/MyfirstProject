namespace Alun{
	export class DisplayManager extends BaseClass {

		private static INSTANCE: DisplayManager = null;
		private static _uiStage: eui.UILayer;

		private _layers: any;
		private _currentScene: number;
		private _vertexSec: string;

		private events: string[];
		private callbacks: Function[];
		private instances: any[];
		private count = 0;

        static get():DisplayManager {
            if (DisplayManager.INSTANCE == null){
                DisplayManager.INSTANCE = new DisplayManager();
            }
            return DisplayManager.INSTANCE;
        }

        static reset(){
            if (!DisplayManager.INSTANCE){
                return;
            }
            DisplayManager.INSTANCE = null;
        }

		public constructor() {
			super();
			this._layers = {};
			if (DisplayManager._uiStage == null){
				DisplayManager._uiStage = new eui.UILayer();
				DisplayManager._uiStage.percentHeight = 100;
				DisplayManager._uiStage.percentWidth = 100;
				DisplayManager._uiStage.touchEnabled = false;
				this.getStage().addChild(DisplayManager._uiStage);
			}
			this.events = [];
			this.callbacks = [];
			this.instances = [];
			this.initShaderSrc();
		}

		public initShaderSrc(){
			this._vertexSec = 
			"attribute vec2 aVertexPosition;\n" +
            "attribute vec2 aTextureCoord;\n" +
            "attribute vec2 aColor;\n" +

            "uniform vec2 projectionVector;\n" +

            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +

            "const vec2 center = vec2(-1.0, 1.0);\n" +

            "void main(void) {\n" +
            "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
            "   vTextureCoord = aTextureCoord;\n" +
            "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
            "}";
		}

		public getStage(): egret.Stage{
			return egret.MainContext.instance.stage;
		}
		
		public getUIStage():eui.UILayer{
			return DisplayManager._uiStage;
		}

		public getUIStageByLayer(layer:number):eui.UILayer{
			if (this._layers[layer]){
				return this._layers[layer];
			}else{
				let t_layer = new eui.UILayer();
				t_layer.touchEnabled = false;
				this.getUIStage().addChild(t_layer);
				this._layers[layer] = t_layer;
				return this._layers[layer];
			}
		}

		public createBitmap(resName: string):egret.Bitmap{
			var result:egret.Bitmap = new egret.Bitmap();
			var texture:egret.Texture = RES.getRes(resName);
			result.texture = texture;
			return result;
		}

		public removeFromParent(child:egret.DisplayObject){
			if(child.parent == null)
				return ;
			child.parent.removeChild(child);
		}

		//create Bezier by self-position and target-position
		public createBezier(route_length:number,s_pos:egret.Point,t_pos:egret.Point,max_hight:number = 50):egret.Point[]{
			let gold_divid = 0.618;
			let c_pos_x;
			if (t_pos.x < s_pos.x){
				c_pos_x = s_pos.x - (s_pos.x - t_pos.x)*gold_divid;
			}else{
				c_pos_x = s_pos.x + (t_pos.x - s_pos.x)*gold_divid;
			}

			//Bezier : (1-t)^2 *p0 + 2t(1-t)pc + t^2*p1       t -->[0,1]
			// ===> (p2 + p0 - 2*pc)t^2 + 2(pc-p0)t + p0     ---> A*t^2 + Bt + C
			// ===> max_t = (4AC - B^2)/4A 
			// ===>  pc = [2max_t + math.sqrt(4(max_t^2 - (p0^2 - (p0^2 - max_t)(p1+p0))))]/2

			let temp_z = 4*(max_hight*max_hight - (t_pos.y*t_pos.y - (t_pos.y - max_hight)*(t_pos.y + s_pos.y)));
			temp_z = Math.abs(temp_z);
			let c_pos_y = (2 * max_hight + Math.sqrt(temp_z))/2;
			let step = 1/route_length;
			let route_point:egret.Point[];
			for(let i = 1;i<route_length;i++){
				let t = step * i;
				let route_x = (1-t)*(1-t)*s_pos.x + 2*t*(1-t)*c_pos_x + t*t*t_pos.x;
				let route_y = (1-t)*(1-t)*s_pos.y + 2*t*(1-t)*c_pos_y + t*t*t_pos.y;
				let t_point = new egret.Point(route_x,route_y);
				route_point.push(t_point);
			}
			return route_point;
		}

		public createSinShader(img:eui.Image){
			let fragmentSrc =
            "precision lowp float;\n" +
            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +
            "uniform sampler2D uSampler;\n" +

            "uniform float customUniform;\n" +

            "void main(void) {\n" +
            "vec2 uvs = vTextureCoord.xy;\n" +
            "vec4 fg = texture2D(uSampler, vTextureCoord);\n" +
            "fg.rgb += sin(customUniform + uvs.x * 2. + uvs.y * 2.) * 0.2;\n" +
            "gl_FragColor = fg * vColor;\n" +
            "}";

			let customFilter = new egret.CustomFilter(
				this._vertexSec,
				fragmentSrc,
				{
					customUniform: 0
				}
			);
			img.filters = [customFilter];
			this.clearEventListener(img,egret.Event.ENTER_FRAME);
			let callbackFunc = ()=>{
				customFilter.uniforms.customUniform += 0.1;
				if (customFilter.uniforms.customUniform > Math.PI * 2) {
					customFilter.uniforms.customUniform = 0.0;
				}
			}
			img.addEventListener(egret.Event.ENTER_FRAME,callbackFunc,img);
			this.events.push(egret.Event.ENTER_FRAME);
			this.callbacks.push(callbackFunc);
			this.instances.push(img);
		}

		public createDripShader(img:eui.Image){
			let fragmentSrc =[
				"precision lowp float;\n" +
				"varying vec2 vTextureCoord;",
				"varying vec4 vColor;\n",
				"uniform sampler2D uSampler;",

				"uniform vec2 center;",
				"uniform vec3 params;", // 10.0, 0.8, 0.1"
				"uniform float time;",

				"void main()",
				"{",
				"vec2 uv = vTextureCoord.xy;",
				"vec2 texCoord = uv;",

				"float dist = distance(uv, center);",

				"if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )",
				"{",
				"float diff = (dist - time);",
				"float powDiff = 1.0 - pow(abs(diff*params.x), params.y);",

				"float diffTime = diff  * powDiff;",
				"vec2 diffUV = normalize(uv - center);",
				"texCoord = uv + (diffUV * diffTime);",
				"}",

				"gl_FragColor = texture2D(uSampler, texCoord);",
				"}"
			].join("\n");

			let customFilter = new egret.CustomFilter(
				this._vertexSec,
				fragmentSrc,
				{
					center: { x: 0.5, y: 0.5 },
					params: { x: 10, y: 0.8, z: 0.1 },
					time: 0
				}
			);

			img.filters = [customFilter];
			this.clearEventListener(img,egret.Event.ENTER_FRAME);
			let callbackFunc = ()=>{
				customFilter.uniforms.time += 0.01;
				if (customFilter.uniforms.time > 1) {
					customFilter.uniforms.time = 0.0;
				}
			}
			img.addEventListener(egret.Event.ENTER_FRAME,callbackFunc,img);
			this.events.push(egret.Event.ENTER_FRAME);
			this.callbacks.push(callbackFunc);
			this.instances.push(img);
		}

		public createGaussBlur(img:eui.Image){
			let fragmentSrc =[
				"precision lowp float;\n" +
				"varying vec2 vTextureCoord;",
				"varying vec4 vColor;\n",
				"uniform sampler2D uSampler;",

				"uniform float BlurRadius_;\n",
				"uniform vec2 textureSize_;\n",

				"mat3 gaussWeight = mat3(1.0/16.0, 2.0/16.0,1.0/16.0, 2.0/16.0,4.0/16.0, 2.0/16.0, 1.0/16.0,2.0/16.0, 1.0/16.0);\n",

				"void main()",
				"{",
					"vec2 uv = vTextureCoord.xy;",
					"vec2 texCoord = uv;",
					"vec4 col = vec4(0,0,0,0);\n",
					"for(int x = 0;x< 3;x++){\n",
						"for (int y = 0;y<3;y++){\n",
							"vec4 textColor = texture2D(uSampler, texCoord + vec2((float(x - 1) / textureSize_.x) * BlurRadius_,(float(y - 1) / textureSize_.y) * BlurRadius_));\n",
			
							"float weight = gaussWeight[x][y];\n",
							"col += textColor * weight;\n",
						"}\n",  
					"}\n",
					
					"gl_FragColor = col ;\n",
				"}"
			].join("\n");

			let customFilter = new egret.CustomFilter(
				this._vertexSec,
				fragmentSrc,
				{
					BlurRadius_: 1,
					textureSize_: { x: img.width, y: img.height},
				}
			);

			img.filters = [customFilter];
			this.clearEventListener(img,egret.Event.ENTER_FRAME);
			let callbackFunc = ()=>{
				customFilter.uniforms.BlurRadius_ += 0.05;
				if(customFilter.uniforms.BlurRadius_ >= 5){
					customFilter.uniforms.BlurRadius_ = 1;
				}
			}
			img.addEventListener(egret.Event.ENTER_FRAME,callbackFunc,img);
			this.events.push(egret.Event.ENTER_FRAME);
			this.callbacks.push(callbackFunc);
			this.instances.push(img);
		}


		//Vertex Rotation + Zoom out + GaussBlur = ShenWei kakaxi
		public createRotationShader(img:eui.Image){
			let fragmentSrc =[
				"precision lowp float;\n" +
				"varying vec2 vTextureCoord;",
				"varying vec4 vColor;\n",
				"uniform sampler2D uSampler;",

				"uniform float RotationRadius_;\n",
				"uniform vec2 textureSize_;\n",
				"uniform float RotationArc_;\n",
				"uniform vec2 AnchorPos_;\n",

				"void main()",
				"{",
					"vec2 uv = vTextureCoord.xy;",
					"vec2 texCoord = uv;",
					"float anchor_x = AnchorPos_.x * textureSize_.x;\n",
					"float anchor_y = AnchorPos_.y * textureSize_.y;\n",
					"vec2 offset = vec2((texCoord.x - AnchorPos_.x)*textureSize_.x,(texCoord.y - AnchorPos_.y)*textureSize_.y);\n",
					"float dist = sqrt(offset.x * offset.x + offset.y * offset.y);\n",
					"if(dist > RotationRadius_){\n",
						"gl_FragColor = texture2D(uSampler, texCoord);\n",
						"return;\n",
					"}\n",
					"float a = atan(offset.y,offset.x);\n",
					"a += dist * RotationArc_ ;\n",
					"vec2 outUV = vec2(anchor_x + dist * cos(a),anchor_y + dist * sin(a));\n",
					"outUV.x /= textureSize_.x;\n",
					"outUV.y /= textureSize_.y;\n",
					"gl_FragColor = texture2D(uSampler, outUV) ;\n",
				"}"
			].join("\n");

			let customFilter = new egret.CustomFilter(
				this._vertexSec,
				fragmentSrc,
				{
					RotationRadius_: 200,
					textureSize_: { x: img.width, y: img.height},
					RotationArc_:0.0001,
					AnchorPos_:{x:0.3,y:0.2},
				}
			);
			img.filters = [customFilter];
			this.clearEventListener(img,egret.Event.ENTER_FRAME);
			let callbackFunc = ()=>{
				customFilter.uniforms.RotationArc_ += 0.0001;
				if(customFilter.uniforms.RotationArc_ >= 1){
					customFilter.uniforms.RotationArc_ = 0.0001;
				}
			}
			img.addEventListener(egret.Event.ENTER_FRAME,callbackFunc,img);
			this.events.push(egret.Event.ENTER_FRAME);
			this.callbacks.push(callbackFunc);
			this.instances.push(img);
		}


		public createZoomOutShader(img:eui.Image){
			let fragmentSrc =[
				"precision lowp float;\n" +
				"varying vec2 vTextureCoord;",
				"varying vec4 vColor;\n",
				"uniform sampler2D uSampler;",

				"uniform float RotationRadius_;\n",
				"uniform vec2 textureSize_;\n",
				"uniform float RotationRadiusNow_;\n",
				"uniform vec2 AnchorPos_;\n",

				"void main()",
				"{",
					"vec2 uv = vTextureCoord.xy;",
					"vec2 texCoord = uv;",
					"float anchor_x = AnchorPos_.x * textureSize_.x;\n",
					"float anchor_y = AnchorPos_.y * textureSize_.y;\n",
					"vec2 offset = vec2((texCoord.x - AnchorPos_.x)*textureSize_.x,(texCoord.y - AnchorPos_.y)*textureSize_.y);\n",
					"float dist = sqrt(offset.x * offset.x + offset.y * offset.y);\n",
					"if(dist > RotationRadius_){\n",
						"gl_FragColor = texture2D(uSampler, texCoord);\n",
						"return;\n",
					"}else if(dist > RotationRadiusNow_){\n",
						"gl_FragColor = texture2D(uSampler, vec2(0.1,0.1));\n",
						"return;\n",
					"}\n",
					"float offsetRadius = RotationRadius_ - RotationRadiusNow_ + dist;\n",
					"float a = atan(offset.y,offset.x);\n",
					"vec2 outUV = vec2(anchor_x + offsetRadius * cos(a),anchor_y + offsetRadius * sin(a)) ;\n",
					"outUV.x /= textureSize_.x;\n",
					"outUV.y /= textureSize_.y;\n",
					"gl_FragColor = texture2D(uSampler, outUV) ;\n",
				"}"
			].join("\n");

			let customFilter = new egret.CustomFilter(
				this._vertexSec,
				fragmentSrc,
				{
					RotationRadius_: 300,
					textureSize_: { x: img.width, y: img.height},
					RotationRadiusNow_:300,
					AnchorPos_:{x:0.3,y:0.2},
				}
			);
			img.filters = [customFilter];
			this.clearEventListener(img,egret.Event.ENTER_FRAME);
			let callbackFunc = ()=>{
				customFilter.uniforms.RotationRadiusNow_ -= 1;
				if(customFilter.uniforms.RotationRadiusNow_ <= 1){
					customFilter.uniforms.RotationArc_ = 300;
				}
			}
			img.addEventListener(egret.Event.ENTER_FRAME,callbackFunc,img);
			this.events.push(egret.Event.ENTER_FRAME);
			this.callbacks.push(callbackFunc);
			this.instances.push(img);
		}

		public createShenWeiShader(img:eui.Image){
			let fragmentSrc =[
				"precision lowp float;\n" +
				"varying vec2 vTextureCoord;",
				"varying vec4 vColor;\n",
				"uniform sampler2D uSampler;",

				"uniform float RotationRadius_;\n",
				"uniform vec2 textureSize_;\n",
				"uniform float RotationArc_;\n",
				"uniform vec2 AnchorPos_;\n",
				"uniform float RotationRadiusNow_;\n",
				"uniform float BlurRadius_;\n",
				"mat3 gaussWeight = mat3(1.0/16.0, 2.0/16.0,1.0/16.0, 2.0/16.0,4.0/16.0, 2.0/16.0, 1.0/16.0,2.0/16.0, 1.0/16.0);\n",

				"void main()",
				"{",
					"vec2 uv = vTextureCoord.xy;",
					"vec2 texCoord = uv;",
					"float anchor_x = AnchorPos_.x * textureSize_.x;\n",
					"float anchor_y = AnchorPos_.y * textureSize_.y;\n",
					"vec2 offset = vec2((texCoord.x - AnchorPos_.x)*textureSize_.x,(texCoord.y - AnchorPos_.y)*textureSize_.y);\n",
					"float dist = sqrt(offset.x * offset.x + offset.y * offset.y);\n",
					"if(dist > RotationRadius_){\n",
						"gl_FragColor = texture2D(uSampler, texCoord);\n",
						"return;\n",
					"}else if(dist > RotationRadiusNow_){\n",
						// "gl_FragColor = texture2D(uSampler, vec2(0.1,0.1));\n",
						"gl_FragColor = vec4(0,0,0,1);\n",
						"return;\n",
					"}\n",

					"float offsetRadius = RotationRadius_ - RotationRadiusNow_ + dist;\n",
					"float a = atan(offset.y,offset.x);\n",
					"vec2 outUV = vec2(anchor_x + offsetRadius * cos(a),anchor_y + offsetRadius * sin(a)) ;\n",
					"outUV.x /= textureSize_.x;\n",
					"outUV.y /= textureSize_.y;\n",

					"float percent = (RotationRadius_ - dist)/ RotationRadius_;\n",
					"float theta = percent * percent *RotationArc_ * 16.0;\n",
					"outUV = outUV - AnchorPos_;\n",
					"outUV = vec2(dot(outUV,vec2(cos(theta),-sin(theta))), dot(outUV,vec2(sin(theta),cos(theta))));\n",
					"outUV += AnchorPos_;\n",
					"vec4 col = vec4(0,0,0,0);\n",
					"for(int x = 0;x< 3;x++){\n",
						"for (int y = 0;y<3;y++){\n",
							"vec4 textColor = texture2D(uSampler, outUV + vec2((float(x - 1) / textureSize_.x),(float(y - 1) / textureSize_.y))* BlurRadius_);\n",
			
							"float weight = gaussWeight[x][y];\n",
							"col += textColor * weight;\n",
						"}\n",  
					"}\n",
					"gl_FragColor = col ;\n",
				"}"
			].join("\n");

			let customFilter = new egret.CustomFilter(
				this._vertexSec,
				fragmentSrc,
				{
					RotationRadius_: 800,
					textureSize_: { x: img.width, y: img.height},
					RotationArc_:0.01,
					RotationRadiusNow_:800,
					AnchorPos_:{x:0.5,y:0.5},
					BlurRadius_:1,
				}
			);
			img.filters = [customFilter];
			this.clearEventListener(img,egret.Event.ENTER_FRAME);
			let callbackFunc = ()=>{
				customFilter.uniforms.RotationArc_ += 0.01;
				customFilter.uniforms.RotationRadiusNow_ -= 15;
				customFilter.uniforms.BlurRadius_ += 0.1;
				if(customFilter.uniforms.RotationRadiusNow_ <= 1){
					customFilter.uniforms.RotationRadiusNow_ = 800;
					customFilter.uniforms.RotationArc_ = 0.0001;
					customFilter.uniforms.BlurRadius_ = 1;
				}
			}
			img.addEventListener(egret.Event.ENTER_FRAME,callbackFunc,img);
			this.events.push(egret.Event.ENTER_FRAME);
			this.callbacks.push(callbackFunc);
			this.instances.push(img);
		}


		public createSwirlShader(img:eui.Image){
			let fragmentSrc =[
				"precision lowp float;\n" +
				"varying vec2 vTextureCoord;",
				"varying vec4 vColor;\n",
				"uniform sampler2D uSampler;",

				"uniform float RotationRadius_;\n",
				"uniform vec2 textureSize_;\n",
				"uniform float RotationArc_;\n",
				"uniform vec2 AnchorPos_;\n",

				"void main()",
				"{",
					"vec2 uv = vTextureCoord.xy;",
					"vec2 texCoord = uv;",
					"float anchor_x = AnchorPos_.x * textureSize_.x;\n",
					"float anchor_y = AnchorPos_.y * textureSize_.y;\n",
					"vec2 offset = vec2((texCoord.x - AnchorPos_.x)*textureSize_.x,(texCoord.y - AnchorPos_.y)*textureSize_.y);\n",
					"float dist = sqrt(offset.x * offset.x + offset.y * offset.y);\n",
					"if(dist > RotationRadius_){\n",
						"gl_FragColor = texture2D(uSampler, texCoord);\n",
						"return;\n",
					"}\n",
					"float percent = (RotationRadius_ - dist)/ RotationRadius_;\n",
					"float theta = percent * percent *RotationArc_ * 16.0;\n",
					"vec2 outUV = texCoord - AnchorPos_;\n",
					"outUV = vec2(dot(outUV,vec2(cos(theta),-sin(theta))), dot(outUV,vec2(sin(theta),cos(theta))));\n",
					"outUV += AnchorPos_;\n",
					"gl_FragColor = texture2D(uSampler, outUV) ;\n",
				"}"
			].join("\n");

			let customFilter = new egret.CustomFilter(
				this._vertexSec,
				fragmentSrc,
				{
					RotationRadius_: 600,
					textureSize_: { x: img.width, y: img.height},
					RotationArc_:0.01,
					AnchorPos_:{x:0.5,y:0.5},
				}
			);
			img.filters = [customFilter];
			this.clearEventListener(img,egret.Event.ENTER_FRAME);
			let callbackFunc = ()=>{
				customFilter.uniforms.RotationArc_ += 0.01;
				if(customFilter.uniforms.RotationArc_ >= 2){
					customFilter.uniforms.RotationArc_ = 0.01;
				}
			}
			img.addEventListener(egret.Event.ENTER_FRAME,callbackFunc,img);
			this.events.push(egret.Event.ENTER_FRAME);
			this.callbacks.push(callbackFunc);
			this.instances.push(img);
		}


		//to avoid memory leak
		public clearEventListener(obj,eventName_?){
			for(let i = this.events.length - 1;i>= 0 ;i--){
				let event_ = this.events[i];
				if(eventName_ && event_ == eventName_ && obj == this.instances[i] 
					|| !eventName_ && obj == this.instances[i]){
					obj.removeEventListener(eventName_,this.callbacks[i],obj);
					this.events.splice(i);
					this.callbacks.splice(i);
					this.instances.splice(i);
				}
			}
		}

	}
}