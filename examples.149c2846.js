parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"c4UV":[function(require,module,exports) {
module.exports=function(n,o,e){document.addEventListener("keydown",function(t){t.which==(e||27)&&(n(),console.log(o||"HALT IN THE NAME OF SCIENCE!"))})};
},{}],"pTQG":[function(require,module,exports) {
"use strict";function r(r,t){return{x:r||0,y:t||0}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.v2=r,exports.vd=f,exports.angleOf=l,exports.rotate2d=exports.translate=exports.perpDot=exports.normal=exports.normalize=exports.magnitude=exports.distance2=exports.distance=exports.scale=exports.dot=exports.sub=exports.add=exports.set=exports.copy=void 0;var t=function(r,t){return r.x=t.x,r.y=t.y,r};exports.copy=t;var e=function(r,t,e){return r.x=t,r.y=e,r};exports.set=e;var n=function(r,t,e){return r.x=t.x+e.x,r.y=t.y+e.y,r};exports.add=n;var o=function(r,t,e){return r.x=t.x-e.x,r.y=t.y-e.y,r};exports.sub=o;var x=function(r,t){return r.x*t.x+r.y*t.y};exports.dot=x;var a=function(r,t,e){return r.x=t.x*e,r.y=t.y*e,r};exports.scale=a;var s=function(r,t){var e=r.x-t.x,n=r.y-t.y;return Math.sqrt(e*e+n*n)};exports.distance=s;var u=function(r,t){var e=r.x-t.x,n=r.y-t.y;return e*e+n*n};exports.distance2=u;var p=function(r){var t=r.x,e=r.y;return Math.sqrt(t*t+e*e)};exports.magnitude=p;var y=function(r,t){var e=t.x,n=t.y,o=e*e+n*n;return o>0&&(o=1/Math.sqrt(o),r.x=t.x*o,r.y=t.y*o),r};exports.normalize=y;var i=function(r,t,e){return r.y=e.x-t.x,r.x=t.y-e.y,y(r,r)};exports.normal=i;var c=function(r,t){return r.x*t.y-r.y*t.x};exports.perpDot=c;var v=function(r){for(var t=[],e=1;e<arguments.length;e++)t[e-1]=arguments[e];for(var o=0;o<t.length;o++){var x=t[o];n(x,x,r)}};function f(r){return"("+r.x+", "+r.y+")"}exports.translate=v;var d=function(r,t,e,n){var o=t.x-e.x,x=t.y-e.y,a=Math.sin(n),s=Math.cos(n);return r.x=o*s-x*a+e.x,r.y=o*a+x*s+e.y,r};function l(r){return Math.atan2(r.y,r.x)}exports.rotate2d=d;
},{}],"mPXB":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.accelerate=void 0;var e=require("./v2"),c=function(c,r){c.cpos.x+=c.acel.x*r*r*.001,c.cpos.y+=c.acel.y*r*r*.001,(0,e.set)(c.acel,0,0)};exports.accelerate=c;
},{"./v2":"pTQG"}],"MuB2":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.collideCircleCircle=void 0;var s=require("./v2"),o={x:0,y:0},p={x:0,y:0},x={x:0,y:0},c={x:0,y:0},y=function(y,e,r,i,t,l,a,u){var d=(0,s.distance2)(y.cpos,i.cpos),v=e+t;(0,s.sub)(o,y.cpos,y.ppos),(0,s.sub)(p,i.cpos,i.ppos),(0,s.sub)(x,y.cpos,i.cpos);var b=Math.sqrt(d),n=(b-v)/b;0===b&&(n=1);var C=r>0?r:1,f=l>0?l:1,q=C+f;if(c.x=x.x*n*(f/q),c.y=x.y*n*(f/q),r>0&&(0,s.sub)(y.cpos,y.cpos,c),c.x=x.x*n*(C/q),c.y=x.y*n*(C/q),l>0&&(0,s.add)(i.cpos,i.cpos,c),a){var M=(u=u||1)*(x.x*o.x+x.y*o.y)/(d||1),_=u*(x.x*p.x+x.y*p.y)/(d||1);o.x+=(_*x.x-M*x.x)/(C||1),p.x+=(M*x.x-_*x.x)/(f||1),o.y+=(_*x.y-M*x.y)/(C||1),p.y+=(M*x.y-_*x.y)/(f||1),r>0&&(0,s.set)(y.ppos,y.cpos.x-o.x,y.cpos.y-o.y),l>0&&(0,s.set)(i.ppos,i.cpos.x-p.x,i.cpos.y-p.y)}};exports.collideCircleCircle=y;
},{"./v2":"pTQG"}],"rY2c":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.collideCircleEdge=u;var p=require("./v2"),s=require("./collide-circle-circle"),o=(0,p.v2)(),c=(0,p.v2)(),e=(0,p.v2)(),l=(0,p.v2)(),a=(0,p.v2)(),i=(0,p.v2)(),v=(0,p.v2)(),r=(0,p.v2)(),d={cpos:(0,p.v2)(),ppos:(0,p.v2)()},t={cpos:(0,p.v2)(),ppos:(0,p.v2)()};function u(e,a,i,r,d,t,u,n,f){(0,p.sub)(c,t.cpos,r.cpos),(0,p.normalize)(o,c),(0,p.sub)(l,e.cpos,r.cpos);var b=(0,p.dot)(c,l),y=(0,p.dot)(c,c),h=Math.sqrt(y);if(!(b<0||b>y)){var x=b/y,g=1-x;if((0,p.scale)(v,o,x*h),(0,p.add)(v,v,r.cpos),!((0,p.distance)(v,e.cpos)>a)){var C=g*i,P=x*i,m={cpos:(0,p.v2)(),ppos:(0,p.v2)()},M={cpos:(0,p.v2)(),ppos:(0,p.v2)()};(0,p.scale)(m.cpos,o,x*h),(0,p.sub)(m.cpos,e.cpos,m.cpos),(0,p.scale)(m.ppos,o,x*h),(0,p.sub)(m.ppos,e.ppos,m.ppos),(0,p.scale)(M.cpos,o,g*h),(0,p.add)(M.cpos,e.cpos,M.cpos),(0,p.scale)(M.ppos,o,g*h),(0,p.add)(M.ppos,e.ppos,M.ppos);var S={cpos:(0,p.v2)(),ppos:(0,p.v2)()},q={cpos:(0,p.v2)(),ppos:(0,p.v2)()};(0,p.copy)(S.cpos,m.cpos),(0,p.copy)(S.ppos,m.ppos),(0,p.copy)(q.cpos,M.cpos),(0,p.copy)(q.ppos,M.ppos);(0,s.collideCircleCircle)(m,a,C,r,0,d,n,f),(0,s.collideCircleCircle)(M,a,P,t,0,u,n,f);var E={cpos:(0,p.v2)(),ppos:(0,p.v2)()},I={cpos:(0,p.v2)(),ppos:(0,p.v2)()};(0,p.sub)(E.cpos,m.cpos,S.cpos),(0,p.sub)(I.cpos,M.cpos,q.cpos),(0,p.scale)(E.cpos,E.cpos,g),(0,p.scale)(I.cpos,I.cpos,x),(0,p.add)(e.cpos,e.cpos,E.cpos),(0,p.add)(e.cpos,e.cpos,I.cpos),n&&((0,p.sub)(E.ppos,m.ppos,S.ppos),(0,p.sub)(I.ppos,M.ppos,q.ppos),(0,p.scale)(E.ppos,E.ppos,g),(0,p.scale)(I.ppos,I.ppos,x),(0,p.add)(e.ppos,e.ppos,E.ppos),(0,p.add)(e.ppos,e.ppos,I.ppos))}}}function n(p,s,o){void 0===s&&(s=[]),void 0===o&&(o=[]);var c=document.createElement("canvas"),e=c.getContext("2d");document.body.appendChild(c),c.width=800,c.height=800;for(var l=0;l<s.length;l++){var a=s[l];e.fillStyle="rgba(255, 0, 0, 0.5)",e.beginPath(),e.arc(a.ppos.x,a.ppos.y,a.radius,0,2*Math.PI,!1),e.fill(),e.fillStyle="rgba(0, 0, 0, 0.5)",e.beginPath(),e.arc(a.cpos.x,a.cpos.y,a.radius,0,2*Math.PI,!1),e.fill()}for(l=0;l<o.length;l++){var i=o[l],v=i[0],r=i[1];e.fillStyle="purple",e.fillRect(r.x,r.y,1,1),e.fillText(v+" ("+r.x+","+r.y+")",r.x+1,r.y+1)}e.fillStyle="black",e.fillText(p,10,10)}
},{"./v2":"pTQG","./collide-circle-circle":"MuB2"}],"zfJE":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.collisionResponseAABB=void 0;var e=require("./v2"),s=(0,e.v2)(),a=(0,e.v2)(),v=(0,e.v2)(),t=(0,e.v2)(),d=(0,e.v2)(),o=(0,e.v2)(),l=(0,e.v2)(),c=(0,e.v2)(),r=(0,e.v2)(),i=(0,e.v2)(),u=(0,e.v2)(),n=(0,e.v2)(),b=(0,e.v2)(),p=(0,e.v2)(),x=1e-4,y=function(y,m,A,B,f,g,z,M,R,_,h,j,q,O,P){(0,e.set)(s,0,0),(0,e.set)(a,0,0),(0,e.set)(v,0,0),(0,e.set)(t,0,0),(0,e.set)(d,0,0),(0,e.set)(o,0,0),(0,e.set)(l,0,0),(0,e.set)(c,0,0),(0,e.set)(r,0,0),(0,e.set)(i,0,0),(0,e.set)(u,0,0),(0,e.set)(n,0,0),(0,e.set)(b,0,0),(0,e.set)(p,0,0),!q||0===q.x&&0===q.y?((0,e.sub)(s,y,z),(0,e.normalize)(s,s)):(0,e.set)(s,q.x,q.y),(0,e.scale)(a,s,-1);var k=A+R,w=1+(B>_?B:_);(0,e.sub)(v,y,m);var C=(0,e.dot)(s,v);(0,e.scale)(t,s,C),(0,e.sub)(d,v,t),(0,e.sub)(o,z,M);var D=(0,e.dot)(a,o);(0,e.scale)(l,a,D),(0,e.sub)(c,o,l),(0,e.scale)(u,t,(A-R)/k),(0,e.scale)(n,l,w*R/k),(0,e.add)(r,u,n),(0,e.add)(r,r,d),(0,e.scale)(b,t,w*A/k),(0,e.scale)(p,l,(R-A)/k),(0,e.add)(i,b,p),(0,e.add)(i,i,c);var E=(0,e.add)((0,e.v2)(),r,i),F=(0,e.v2)();(0,e.scale)(F,s,(0,e.dot)(E,s));var G=(0,e.sub)((0,e.v2)(),E,F);(0,e.normalize)(G,G);var H=-(0,e.dot)(E,G);H/=1/(A+R);var I=Math.abs(H);if(I>x){var J=(0,e.magnitude)(d),K=(0,e.magnitude)(c),L=(0,e.v2)(),N=(0,e.v2)();I<J*f?(0,e.scale)(L,G,f):(0,e.scale)(L,G,-J*g),I<K*h?(0,e.scale)(N,G,h):(0,e.scale)(N,G,-K*j),(0,e.add)(r,r,L),(0,e.add)(i,i,N)}(0,e.copy)(O,r),(0,e.copy)(P,i)};exports.collisionResponseAABB=y;
},{"./v2":"pTQG"}],"MROi":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.solveDistanceConstraint=e;var s=require("./v2");function e(e,o,c,a,p,r){void 0===r&&(r=1);var t=1/((o>0?o:1)||1),v=1/((a>0?a:1)||1),i=t+v,u=(0,s.sub)((0,s.v2)(),c.cpos,e.cpos),d=(0,s.magnitude)(u);if(0!==d){var n=(d-p)/d;(0,s.scale)(u,u,n/i);var l=(0,s.scale)((0,s.v2)(),u,t*r),b=(0,s.scale)((0,s.v2)(),u,v*r);o>0?(0,s.add)(e.cpos,e.cpos,l):a>0&&(0,s.sub)(c.cpos,c.cpos,l),a>0?(0,s.sub)(c.cpos,c.cpos,b):o>0&&(0,s.add)(e.cpos,e.cpos,b)}}
},{"./v2":"pTQG"}],"ujJY":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.solveDrag=void 0;var o=function(o,p){var s=(o.ppos.x-o.cpos.x)*p,e=(o.ppos.y-o.cpos.y)*p;o.ppos.x=o.cpos.x+s,o.ppos.y=o.cpos.y+e};exports.solveDrag=o;
},{}],"iXvS":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.solveGravitation=s;var e=require("./v2"),o=(0,e.v2)();function s(s,a,r,t,c){if(void 0===c&&(c=.99),!(a<=0||t<=0)){var i,v,l=r.cpos.x-s.cpos.x,p=r.cpos.y-s.cpos.y;(0,e.set)(o,l,p),v=c*(a*t/((i=0===(i=(0,e.magnitude)(o))?1:i)*i)),(0,e.normalize)(o,o),(0,e.scale)(o,o,v),(0,e.add)(s.acel,s.acel,o)}}
},{"./v2":"pTQG"}],"aEct":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.inertia=void 0;var e=require("./v2"),s=function(s){var o=2*s.cpos.x-s.ppos.x,p=2*s.cpos.y-s.ppos.y;(0,e.set)(s.ppos,s.cpos.x,s.cpos.y),(0,e.set)(s.cpos,o,p)};exports.inertia=s;
},{"./v2":"pTQG"}],"AvgD":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.overlapAABBAABB=exports.createAABBOverlapResult=void 0;var e=require("./v2"),r=function(){return{resolve:(0,e.v2)(),hitPos:(0,e.v2)(),normal:(0,e.v2)()}};exports.createAABBOverlapResult=r;var t=function(r,t,o,s,l,a,v,i,n){var u=l-r,A=v/2+o/2-Math.abs(u),B=a-t,p=i/2+s/2-Math.abs(B);if(A<=0)return null;if(p<=0)return null;if((0,e.set)(n.resolve,0,0),(0,e.set)(n.hitPos,0,0),(0,e.set)(n.normal,0,0),A<p){var x=u<0?-1:1;n.resolve.x=A*x,n.normal.x=x,n.hitPos.x=r+o/2*x,n.hitPos.y=a}else{var h=B<0?-1:1;n.resolve.y=p*h,n.normal.y=h,n.hitPos.x=l,n.hitPos.y=t+s/2*h}return n};exports.overlapAABBAABB=t;
},{"./v2":"pTQG"}],"njau":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.overlapCircleCircle=void 0;var e=function(e,r,o,t,i,l){var c=t-e,p=i-r,s=o+l;return c*c+p*p<s*s};exports.overlapCircleCircle=e;
},{}],"k8bf":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.segmentIntersection=r;var e=require("./v2"),x=(0,e.v2)(),y=(0,e.v2)();function r(r,t,s,u,n){(0,e.sub)(x,t,r),(0,e.sub)(y,u,s);var o=(-x.y*(r.x-s.x)+x.x*(r.y-s.y))/(-y.x*x.y+x.x*y.y),v=(y.x*(r.y-s.y)-y.y*(r.x-s.x))/(-y.x*x.y+x.x*y.y);return o>=0&&o<=1&&v>=0&&v<=1&&(n.x=r.x+v*x.x,n.y=r.y+v*x.y,!0)}
},{"./v2":"pTQG"}],"pvJA":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.rewindToCollisionPoint=u;var e=require("./v2"),s=require("./segment-intersection"),o=(0,e.v2)(),i=(0,e.v2)(),n=(0,e.v2)(),r=(0,e.v2)(),t=(0,e.v2)(),p=(0,e.v2)();function u(u,c,v,a){return(0,e.sub)(n,u.cpos,u.ppos),(0,e.normalize)(r,n),(0,e.scale)(t,r,c),(0,e.add)(p,t,u.cpos),!!(0,s.segmentIntersection)(p,u.ppos,v,a,o)&&((0,e.sub)(i,p,o),(0,e.sub)(u.cpos,u.cpos,i),(0,e.sub)(u.ppos,u.ppos,i),!0)}function c(e){isNaN(e.x)||isNaN(e.y)}
},{"./v2":"pTQG","./segment-intersection":"k8bf"}],"afWl":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});
},{}],"lMI8":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createPointEdgeProjectionResult=r,exports.projectPointEdge=i;var e=require("./v2");function r(){return{distance:0,similarity:0,u:0,projectedPoint:(0,e.v2)(),edgeNormal:(0,e.v2)()}}var t=(0,e.v2)(),o=(0,e.v2)();function i(r,i,n,a){if((0,e.sub)(t,n,i),0===t.x&&0===t.y)throw new Error("ZeroLengthEdge");var s=((r.x-i.x)*t.x+(r.y-i.y)*t.y)/(t.x*t.x+t.y*t.y);a.u=s;var d=(0,e.set)(a.projectedPoint,i.x+s*t.x,i.y+s*t.y);a.distance=(0,e.distance)(d,r);var c=(0,e.normal)(a.edgeNormal,i,n);(0,e.sub)(o,r,d),a.similarity=(0,e.dot)(c,o)}
},{"./v2":"pTQG"}],"RXiv":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.projectCposWithRadius=void 0;var e=require("./v2"),o=(0,e.v2)(),s=(0,e.v2)(),r=(0,e.v2)(),t=function(t,p,i){return(0,e.sub)(o,p.cpos,p.ppos),(0,e.normalize)(s,o),(0,e.scale)(r,s,i),(0,e.add)(t,r,p.cpos),t};exports.projectCposWithRadius=t;
},{"./v2":"pTQG"}],"fUdq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./accelerate");Object.keys(e).forEach(function(r){"default"!==r&&"__esModule"!==r&&Object.defineProperty(exports,r,{enumerable:!0,get:function(){return e[r]}})});var r=require("./collide-circle-circle");Object.keys(r).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return r[e]}})});var t=require("./collide-circle-edge");Object.keys(t).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return t[e]}})});var n=require("./collision-response-aabb");Object.keys(n).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return n[e]}})});var o=require("./solve-distance-constraint");Object.keys(o).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return o[e]}})});var u=require("./solve-drag");Object.keys(u).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return u[e]}})});var c=require("./solve-gravitation");Object.keys(c).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return c[e]}})});var i=require("./inertia");Object.keys(i).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return i[e]}})});var a=require("./overlap-aabb-aabb");Object.keys(a).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return a[e]}})});var f=require("./overlap-circle-circle");Object.keys(f).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return f[e]}})});var l=require("./rewind-to-collision-point");Object.keys(l).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return l[e]}})});var s=require("./segment-intersection");Object.keys(s).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return s[e]}})});var d=require("./v2");Object.keys(d).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return d[e]}})});var b=require("./common-types");Object.keys(b).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return b[e]}})});var p=require("./project-point-edge");Object.keys(p).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return p[e]}})});var j=require("./project-capsule");Object.keys(j).forEach(function(e){"default"!==e&&"__esModule"!==e&&Object.defineProperty(exports,e,{enumerable:!0,get:function(){return j[e]}})});
},{"./accelerate":"mPXB","./collide-circle-circle":"MuB2","./collide-circle-edge":"rY2c","./collision-response-aabb":"zfJE","./solve-distance-constraint":"MROi","./solve-drag":"ujJY","./solve-gravitation":"iXvS","./inertia":"aEct","./overlap-aabb-aabb":"AvgD","./overlap-circle-circle":"njau","./rewind-to-collision-point":"pvJA","./segment-intersection":"k8bf","./v2":"pTQG","./common-types":"afWl","./project-point-edge":"lMI8","./project-capsule":"RXiv"}],"R1Yz":[function(require,module,exports) {
"use strict";var s=this&&this.__importDefault||function(s){return s&&s.__esModule?s:{default:s}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.start=void 0;var e=s(require("science-halt")),o=require("../src");exports.start=function(){var s=document.createElement("canvas"),p=s.getContext("2d");s.width=s.height=800,s.style.border="1px solid gray",document.body.appendChild(s);var t={cpos:o.v2(350,90),ppos:o.v2(349,80),acel:o.v2(),w:100,h:150,mass:10},r={cpos:o.v2(350,600),ppos:o.v2(350,600),acel:o.v2(),w:100,h:150,mass:10},a=[],c={resolve:o.v2(),hitPos:o.v2(),normal:o.v2()};a.push(t,r);var l=!0;function i(s,e){e.clearRect(0,0,e.canvas.width,e.canvas.height);for(var o=0;o<s.length;o++){var p=s[o];e.fillStyle="red",e.fillRect(p.ppos.x-p.w/2,p.ppos.y-p.h/2,p.w,p.h),e.fillStyle="black",e.fillRect(p.cpos.x-p.w/2,p.cpos.y-p.h/2,p.w,p.h)}}e.default(function(){return l=!1}),function s(){for(var e=0;e<a.length;e++){var n=a[e];o.accelerate(n,1)}if(o.overlapAABBAABB(t.cpos.x,t.cpos.y,t.w,t.h,r.cpos.x,r.cpos.y,r.w,r.h,c)){i(a,p);var v=o.scale(o.v2(),c.resolve,.5);o.add(r.cpos,r.cpos,v),o.add(r.ppos,r.ppos,v),o.sub(t.cpos,t.cpos,v),o.sub(t.ppos,t.ppos,v),i(a,p);var u=o.v2(),h=o.v2();o.collisionResponseAABB(t.cpos,t.ppos,t.mass,1,.9,.01,r.cpos,r.ppos,r.mass,1,.9,.01,o.v2(),u,h),o.sub(t.ppos,t.cpos,u),o.sub(r.ppos,r.cpos,h),i(a,p)}for(e=0;e<a.length;e++){n=a[e];o.inertia(n)}i(a,p),l&&window.requestAnimationFrame(s)}()};
},{"science-halt":"c4UV","../src":"fUdq"}],"qzHv":[function(require,module,exports) {
"use strict";var s=this&&this.__importDefault||function(s){return s&&s.__esModule?s:{default:s}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.start=void 0;var e=s(require("science-halt")),o=require("../src/index");exports.start=function(){var s=document.createElement("canvas"),t=s.getContext("2d");s.width=s.height=800,s.style.border="1px solid gray",document.body.appendChild(s);for(var a=[],r=0;r<25;r++){var i=s.width/2,p=s.height/2,c=.5*Math.min(i,p),n=i+Math.cos(r)*c,h=p+Math.sin(r)*c;a.push(v(n,h))}var l={cpos:o.v2(s.width/2,s.height/2),ppos:o.v2(s.width/2,s.height/2),acel:o.v2(),mass:1e5},d=!0;function v(s,e){return{id:"id-"+Math.floor(1e7*Math.random()),cpos:o.v2(s,e),ppos:o.v2(s,e),acel:o.v2(),mass:10,w:10,h:10}}function u(s,e){e.clearRect(0,0,e.canvas.width,e.canvas.height);for(var o=0;o<s.length;o++){var t=s[o];e.fillStyle="red",e.fillRect(t.ppos.x-t.w/2,t.ppos.y-t.h/2,t.w,t.h),e.fillStyle="black",e.fillRect(t.cpos.x-t.w/2,t.cpos.y-t.h/2,t.w,t.h)}}e.default(function(){return d=!1}),function s(){for(var e=0;e<a.length;e++){var r=a[e];o.distance(r.cpos,l.cpos)>100&&o.solveGravitation(r,r.mass,l,l.mass)}for(e=0;e<a.length;e++){r=a[e];o.accelerate(r,1)}var i=[],p={resolve:o.v2(),hitPos:o.v2(),normal:o.v2()};for(e=0;e<a.length;e++)for(var c=e+1;c<a.length;c++){var n=a[e],h=a[c];if(o.overlapAABBAABB(n.cpos.x,n.cpos.y,n.w,n.h,h.cpos.x,h.cpos.y,h.w,h.h,p)&&-1===i.indexOf(n.id+","+h.id)&&-1===i.indexOf(h.id+","+n.id)){var v=o.scale(o.v2(),p.resolve,.5);o.add(h.cpos,h.cpos,v),o.add(h.ppos,h.ppos,v),o.sub(n.cpos,n.cpos,v),o.sub(n.ppos,n.ppos,v),u(a,t);var f=o.v2(),m=o.v2();o.collisionResponseAABB(n.cpos,n.ppos,n.mass,1,.9,.01,h.cpos,h.ppos,h.mass,1,.9,.01,o.v2(),f,m),o.sub(n.ppos,n.cpos,f),o.sub(h.ppos,h.cpos,m),u(a,t),i.push(n.id+","+h.id),i.push(h.id+","+n.id)}}for(e=0;e<a.length;e++){r=a[e];o.inertia(r)}u(a,t),d&&window.requestAnimationFrame(s)}()};
},{"science-halt":"c4UV","../src/index":"fUdq"}],"bcb3":[function(require,module,exports) {
"use strict";var a=this&&this.__importDefault||function(a){return a&&a.__esModule?a:{default:a}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.start=void 0;var e=a(require("science-halt")),r=require("../src/index");exports.start=function(){var a=document.createElement("canvas"),t=a.getContext("2d");a.width=a.height=800,a.style.border="1px solid gray",document.body.appendChild(a);var s={x:400,y:400},i={cpos:r.copy(r.v2(),s),ppos:r.copy(r.v2(),s),acel:r.v2(),radius:20,mass:1e4},o=function(a,e,r){for(var t=[],s=0;s<r;s++){var i=Math.cos(s)*a.x+a.x,o=Math.sin(s)*a.y+a.y;t.push({cpos:{x:i,y:o},ppos:{x:i,y:o},acel:{x:0,y:0},radius:Math.max(Math.abs(Math.cos(s)+Math.sin(s))*e,10),mass:Math.max(1*Math.abs(Math.cos(s)+Math.sin(s)),1)})}return t}(s,15,40),c=[];o.unshift(i);var n=!0;e.default(function(){return n=!1});var l=0;!function a(){r.v2();for(var e=0;e<o.length;e++){(u=o[e])!==i&&l<100&&r.solveGravitation(u,u.mass,i,i.mass),r.accelerate(u,16)}!function(a,e){a.length=0;for(var t=0;t<e.length;t++)for(var s=e[t],i=t+1;i<e.length;i++){var o=e[i];r.overlapCircleCircle(s.cpos.x,s.cpos.y,s.radius,o.cpos.x,o.cpos.y,o.radius)&&a.push(s,o)}}(c,o);for(e=0;e<c.length;e+=2){var s=c[e],h=c[e+1];r.collideCircleCircle(s,s.radius,s.mass,h,h.radius,h.mass,!1,.1)}for(e=0;e<o.length;e++){var u=o[e];r.inertia(u)}for(e=0;e<c.length;e+=2){s=c[e],h=c[e+1];r.collideCircleCircle(s,s.radius,s.mass,h,h.radius,h.mass,!0,.1)}!function(a,e){e.clearRect(0,0,e.canvas.width,e.canvas.height);for(var r=0;r<a.length;r++){var t=a[r];e.fillStyle="red",e.beginPath(),e.arc(t.ppos.x,t.ppos.y,t.radius,0,2*Math.PI,!1),e.fill(),e.fillStyle="black",e.beginPath(),e.arc(t.cpos.x,t.cpos.y,t.radius,0,2*Math.PI,!1),e.fill()}}(o,t),l++,n&&window.requestAnimationFrame(a)}()};
},{"science-halt":"c4UV","../src/index":"fUdq"}],"rnWH":[function(require,module,exports) {
"use strict";var o=this&&this.__importDefault||function(o){return o&&o.__esModule?o:{default:o}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.start=void 0;var t=o(require("science-halt")),i=require("../src/index");exports.start=function(){var o=document.createElement("canvas"),s=o.getContext("2d");o.width=o.height=800,o.style.border="1px solid gray",document.body.appendChild(o);var e=[],n=[],p=[],r=function(o,t,s,e){for(var n=[],p=[],r=[],a=[i.v2(o,t),i.v2(o+s,t),i.v2(o+s,t+e),i.v2(o,t+e)],l=0;l<a.length;l++){var c=a[l],u=0===p.length?null:p[l-1],v={cpos:i.copy(i.v2(),c),ppos:i.copy(i.v2(),c),acel:i.v2(0,0),mass:0===l?-1:1,radius:1};u&&(n.push({point1:u,point2:v}),r.push({point1:u,point2:v,goal:i.distance(c,u.cpos)})),p.push(v)}return n.push({point1:p[p.length-1],point2:p[0]}),r.push({point1:p[p.length-1],point2:p[0],goal:i.distance(p[p.length-1].cpos,p[0].cpos)}),r.push({point1:p[0],point2:p[2],goal:i.distance(p[0].cpos,p[2].cpos)}),{lines:n,circles:p,constraints:r}}(300,200,100,200);e.push.apply(e,r.circles),n.push.apply(n,r.lines),p.push.apply(p,r.constraints),e.push({cpos:i.v2(500,390),ppos:i.v2(510,390),acel:i.v2(0,0),mass:100,radius:10});var a=!0;function l(o,t,s){void 0===s&&(s=.9);for(var e=0;e<o.length;e++)for(var n=o[e],p=e+1;p<o.length;p++){var r=o[p];i.overlapCircleCircle(n.cpos.x,n.cpos.y,n.radius,r.cpos.x,r.cpos.y,r.radius)&&i.collideCircleCircle(n,n.radius,n.mass,r,r.radius,r.mass,t,s)}}function c(o,t,s,e){void 0===e&&(e=.9);for(var n=0;n<o.length;n++)for(var p=o[n],r=0;r<t.length;r++){var a=t[r];p.point1!=a&&p.point2!==a&&(s||i.rewindToCollisionPoint(a,a.radius,p.point1.cpos,p.point2.cpos),i.collideCircleEdge(a,a.radius,a.mass,p.point1,p.point1.mass,p.point2,p.point2.mass,s,e))}}t.default(function(){return a=!1}),function o(){for(var t=0;t<e.length;t++){var r=e[t];i.accelerate(r,16)}for(t=0;t<2;t++)for(var u=0;u<p.length;u++){var v=p[u];i.solveDistanceConstraint(v.point1,v.point1.mass,v.point2,v.point2.mass,v.goal)}l(e,!1),c(n,e,!1);for(t=0;t<e.length;t++){r=e[t];i.inertia(r)}l(e,!0),c(n,e,!0),function(o,t,i){i.clearRect(0,0,i.canvas.width,i.canvas.height);for(var s=0;s<o.length;s++){var e=o[s];i.fillStyle="red",i.beginPath(),i.arc(e.ppos.x,e.ppos.y,e.radius,0,2*Math.PI,!1),i.fill(),i.fillStyle="black",i.beginPath(),i.arc(e.cpos.x,e.cpos.y,e.radius,0,2*Math.PI,!1),i.fill()}for(var s=0;s<t.length;s++){var n=t[s];i.strokeStyle="red",i.beginPath(),i.moveTo(n.point1.ppos.x,n.point1.ppos.y),i.lineTo(n.point2.ppos.x,n.point2.ppos.y),i.stroke(),i.beginPath(),i.strokeStyle="black",i.moveTo(n.point1.cpos.x,n.point1.cpos.y),i.lineTo(n.point2.cpos.x,n.point2.cpos.y),i.stroke()}}(e,n,s),a&&window.requestAnimationFrame(o)}()};
},{"science-halt":"c4UV","../src/index":"fUdq"}],"seMj":[function(require,module,exports) {
"use strict";var o=this&&this.__importDefault||function(o){return o&&o.__esModule?o:{default:o}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.start=void 0;var t=o(require("science-halt")),e=require("../src");exports.start=function(){var o=document.createElement("canvas"),i=o.getContext("2d");o.tabIndex=1,o.width=o.height=800,o.style.border="1px solid gray",document.body.appendChild(o);var s={cpos:e.v2(600,0),ppos:e.v2(600,0),acel:e.v2(0,0),mass:1,radius:20},a={point1:{cpos:e.v2(100,300),ppos:e.v2(100,300),acel:e.v2(0,0),mass:-1,radius:0},point2:{cpos:e.v2(700,300),ppos:e.v2(700,300),acel:e.v2(0,0),mass:-1,radius:0},goal:500},n=[s,a.point1,a.point2],p=(e.v2(),!0);t.default(function(){return p=!1}),function o(){e.add(s.acel,s.acel,e.v2(0,.8));for(var t=0;t<n.length;t++){var r=n[t];e.accelerate(r,16)}e.rewindToCollisionPoint(s,s.radius,a.point1.cpos,a.point2.cpos),e.collideCircleEdge(s,s.radius,s.mass,a.point1,a.point1.mass,a.point2,a.point2.mass,!1,.9);for(t=0;t<n.length;t++){r=n[t];e.inertia(r)}e.collideCircleEdge(s,s.radius,s.mass,a.point1,a.point1.mass,a.point2,a.point2.mass,!0,.9);for(t=0;t<5;t++)e.solveDistanceConstraint(a.point1,a.point1.mass,a.point2,a.point2.mass,a.goal);!function(o,t,e){e.clearRect(0,0,e.canvas.width,e.canvas.height);for(var i=0;i<o.length;i++){var s=o[i];e.fillStyle="red",e.beginPath(),e.arc(s.ppos.x,s.ppos.y,s.radius,0,2*Math.PI,!1),e.fill(),e.fillStyle="black",e.beginPath(),e.arc(s.cpos.x,s.cpos.y,s.radius,0,2*Math.PI,!1),e.fill()}for(var i=0;i<t.length;i++){var a=t[i];e.strokeStyle="red",e.beginPath(),e.moveTo(a.point1.ppos.x,a.point1.ppos.y),e.lineTo(a.point2.ppos.x,a.point2.ppos.y),e.stroke(),e.beginPath(),e.strokeStyle="black",e.moveTo(a.point1.cpos.x,a.point1.cpos.y),e.lineTo(a.point2.cpos.x,a.point2.cpos.y),e.stroke()}}(n,[a],i),p&&window.requestAnimationFrame(o)}()};
},{"science-halt":"c4UV","../src":"fUdq"}],"krcC":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.start=void 0;var t=e(require("science-halt")),o=require("../src");exports.start=function(){var e=document.createElement("canvas"),a=e.getContext("2d");e.tabIndex=1,e.width=e.height=800,e.style.border="1px solid gray",document.body.appendChild(e);var s={cpos:o.v2(400,0),ppos:o.v2(400,0),acel:o.v2(0,0),width:50,height:75,mass:1},r={cpos:o.v2(400,700),ppos:o.v2(400,700),acel:o.v2(0,0),width:800,height:100,mass:Number.MAX_SAFE_INTEGER-1e5},i=[s,r],c={resolve:o.v2(),hitPos:o.v2(),normal:o.v2()},l=!0;t.default(function(){return l=!1});var p={};function n(e,t){t.clearRect(0,0,t.canvas.width,t.canvas.height);for(var o=0;o<e.length;o++){var a=e[o];t.fillStyle="red",t.fillRect(a.ppos.x-a.width/2,a.ppos.y-a.height/2,a.width,a.height),t.fillStyle="black",t.fillRect(a.cpos.x-a.width/2,a.cpos.y-a.height/2,a.width,a.height)}}e.addEventListener("keydown",function(e){p[e.key]=!0,e.preventDefault()}),document.body.addEventListener("keyup",function(e){p[e.key]=!1,e.preventDefault()}),function e(){o.add(s.acel,s.acel,o.v2(0,9.8));for(var t=0;t<i.length;t++){var d=i[t];o.accelerate(d,16)}var v=o.overlapAABBAABB(s.cpos.x,s.cpos.y,s.width,s.height,r.cpos.x,r.cpos.y,r.width,r.height,c);if(v){var h=o.scale(o.v2(),c.resolve,-1);o.translate(h,s.cpos,s.ppos),n(i,a);var u=o.v2(),f=o.v2();o.collisionResponseAABB(s.cpos,s.ppos,s.mass,1,.9,.1,r.cpos,r.ppos,r.mass,1,.9,.1,c.normal,u,f),o.sub(s.ppos,s.cpos,u),s.ppos.y=s.cpos.y,n(i,a)}p.ArrowLeft&&o.add(s.acel,s.acel,o.v2(v?-5:-.5,0)),p.ArrowRight&&o.add(s.acel,s.acel,o.v2(v?5:.5,0)),v&&p.ArrowUp&&s.cpos.y-s.ppos.y==0&&o.add(s.acel,s.acel,o.v2(0,-98));for(t=0;t<i.length;t++){d=i[t];o.inertia(d)}n(i,a),l&&window.requestAnimationFrame(e)}()};
},{"science-halt":"c4UV","../src":"fUdq"}],"nHtR":[function(require,module,exports) {
"use strict";var o=this&&this.__spreadArrays||function(){for(var o=0,t=0,r=arguments.length;t<r;t++)o+=arguments[t].length;var s=Array(o),i=0;for(t=0;t<r;t++)for(var n=arguments[t],e=0,a=n.length;e<a;e++,i++)s[i]=n[e];return s},t=this&&this.__importDefault||function(o){return o&&o.__esModule?o:{default:o}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.start=void 0;var r=t(require("science-halt")),s=require("../src");exports.start=function(){var t=document.createElement("canvas"),i=t.getContext("2d");t.tabIndex=1,t.width=t.height=800,t.style.border="1px solid gray",document.body.appendChild(t);var n=[],e=[],a=[],p=h([s.v2(50,50),s.v2(750,50),s.v2(750,750),s.v2(50,750)]),l=h([s.v2(500,400),s.v2(300,600)]);l.pop(),n.push.apply(n,o(p,l)),a.push.apply(a,function(o,t,r,s){for(var i=[],n=0;n<s;n++){var e=o.x+Math.cos(n)*t,a=o.y+Math.sin(n)*t;i.push({cpos:{x:e,y:a},ppos:{x:e,y:a},acel:{x:0,y:0},radius:Math.max(Math.abs(Math.cos(n)+Math.sin(n))*r,10),mass:Math.max(1*Math.abs(Math.cos(n)+Math.sin(n)),1)})}return i}(s.v2(400,400),200,10,400)),[u(6,s.v2(300,100),15),u(3,s.v2(400,100),15),u(4,s.v2(600,100),15)].forEach(function(o){a.push.apply(a,o.circles),e.push.apply(e,o.constraints),n.push.apply(n,o.lines)});var c=!0;function h(o){for(var t=[],r=[],i=0;i<o.length;i++){var n=o[i],e=0===r.length?null:r[i-1],a={cpos:s.copy(s.v2(),n),ppos:s.copy(s.v2(),n),acel:s.v2(0,0),mass:-1,radius:1};if(e){var p={point1:e,point2:a};t.push(p)}r.push(a)}return t.push({point1:r[r.length-1],point2:r[0]}),t}function u(o,t,r){for(var i=[],n=[],e=[],a=0;a<o;a++){var p=t.x+Math.cos(a/o*Math.PI*2)*r,l=t.y+Math.sin(a/o*Math.PI*2)*r;n.push({cpos:{x:p,y:l},ppos:{x:p,y:l},acel:{x:0,y:0},radius:5,mass:5})}for(a=0;a<n.length;a++){var c=n[a],h=a===n.length-1?n[0]:n[a+1];i.push({point1:c,point2:h})}var u=function(o){for(var t=n[o],r=o,i=function(){var o=n[++r%n.length];return o===t?"break":void 0!==e.find(function(r){return r.point1===t&&r.point2===o||r.point2===t&&r.point1===o})?"break":void e.push({point1:t,point2:o,goal:s.distance(t.cpos,o.cpos)})};;){if("break"===i())break}};for(a=0;a<n.length;a++)u(a);return{circles:n,lines:i,constraints:e}}r.default(function(){return c=!1}),function o(){for(var t=0;t<a.length;t++){(g=a[t]).mass>0&&s.add(g.acel,g.acel,s.v2(0,.8)),s.accelerate(g,16)}for(t=0;t<5;t++)for(var r=0;r<e.length;r++){var h=e[r];s.solveDistanceConstraint(h.point1,h.point1.mass,h.point2,h.point2.mass,h.goal,1)}for(t=0;t<n.length;t++){var u=n[t],v=p.indexOf(u)>-1;for(r=0;r<a.length;r++){(g=a[r])!==u.point1&&g!==u.point2&&(v||s.rewindToCollisionPoint(g,g.radius,u.point1.cpos,u.point2.cpos),s.collideCircleEdge(g,g.radius,g.mass,u.point1,u.point1.mass,u.point2,u.point2.mass,!1,.9))}}for(t=0;t<a.length;t++){var d=a[t];for(r=t+1;r<a.length;r++){var f=a[r];s.overlapCircleCircle(d.cpos.x,d.cpos.y,d.radius,f.cpos.x,f.cpos.y,f.radius)&&s.collideCircleCircle(d,d.radius,d.mass,f,f.radius,f.mass,!1,.9)}}for(t=0;t<a.length;t++){var g=a[t];s.inertia(g)}for(t=0;t<n.length;t++)for(u=n[t],r=0;r<a.length;r++){(g=a[r])!==u.point1&&g!==u.point2&&s.collideCircleEdge(g,g.radius,g.mass,u.point1,u.point1.mass,u.point2,u.point2.mass,!0,.9)}for(t=0;t<a.length;t++)for(d=a[t],r=t+1;r<a.length;r++){f=a[r];s.overlapCircleCircle(d.cpos.x,d.cpos.y,d.radius,f.cpos.x,f.cpos.y,f.radius)&&s.collideCircleCircle(d,d.radius,d.mass,f,f.radius,f.mass,!0,.9)}for(t=0;t<p.length;t++){if((u=p[t])!==l[0])for(r=0;r<a.length;r++){g=a[r];var y=s.createPointEdgeProjectionResult();if(s.projectPointEdge(g.cpos,u.point1.cpos,u.point2.cpos,y),!(y.similarity>0)){var x=s.v2();s.sub(x,y.projectedPoint,g.cpos),s.add(g.cpos,g.cpos,x)}}}!function(o,t,r,s){s.clearRect(0,0,s.canvas.width,s.canvas.height);for(var i=0;i<o.length;i++){var n=o[i];s.fillStyle="red",s.beginPath(),s.arc(n.ppos.x,n.ppos.y,n.radius,0,2*Math.PI,!1),s.fill(),s.fillStyle="black",s.beginPath(),s.arc(n.cpos.x,n.cpos.y,n.radius,0,2*Math.PI,!1),s.fill()}for(var i=0;i<t.length;i++){var e=t[i];s.strokeStyle="red",s.beginPath(),s.moveTo(e.point1.ppos.x,e.point1.ppos.y),s.lineTo(e.point2.ppos.x,e.point2.ppos.y),s.stroke(),s.beginPath(),s.strokeStyle="black",s.moveTo(e.point1.cpos.x,e.point1.cpos.y),s.lineTo(e.point2.cpos.x,e.point2.cpos.y),s.stroke()}for(var i=0;i<r.length;i++){var a=r[i];s.strokeStyle="magenta",s.beginPath(),s.moveTo(a.point1.ppos.x,a.point1.ppos.y),s.lineTo(a.point2.ppos.x,a.point2.ppos.y),s.stroke(),s.beginPath(),s.strokeStyle="purple",s.moveTo(a.point1.cpos.x,a.point1.cpos.y),s.lineTo(a.point2.cpos.x,a.point2.cpos.y),s.stroke()}}(a,n,e,i),c&&window.requestAnimationFrame(o)}()};
},{"science-halt":"c4UV","../src":"fUdq"}],"X29T":[function(require,module,exports) {
"use strict";var o=this&&this.__importDefault||function(o){return o&&o.__esModule?o:{default:o}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.start=void 0;var t=o(require("science-halt")),e=require("../src");exports.start=function(){var o=document.createElement("canvas"),s=o.getContext("2d");o.tabIndex=1,o.width=o.height=800,o.style.border="1px solid gray",document.body.appendChild(o);var p={cpos:e.v2(600,100),ppos:e.v2(600,100),acel:e.v2(0,0),mass:1,radius:20},i={point1:{cpos:e.v2(100,300),ppos:e.v2(100,300),acel:e.v2(0,0),mass:1,radius:0},point2:{cpos:e.v2(700,300),ppos:e.v2(700,300),acel:e.v2(0,0),mass:1,radius:0},goal:500},a=[p,i.point1,i.point2],n=!0;t.default(function(){return n=!1}),function o(){e.add(p.acel,p.acel,e.v2(0,.98));for(var t=0;t<a.length;t++){var r=a[t];e.accelerate(r,16)}var c=e.createPointEdgeProjectionResult();e.projectPointEdge(p.ppos,i.point1.cpos,i.point2.cpos,c);var l=e.v2(),v=e.projectCposWithRadius(e.v2(),p,p.radius);if(e.segmentIntersection(p.ppos,v,i.point1.cpos,i.point2.cpos,l)&&c.similarity<0){var d=e.v2();e.sub(d,l,v),e.translate(d,p.cpos,p.ppos);var u=e.v2(),h=e.v2();e.collisionResponseAABB(p.cpos,p.ppos,p.mass,1,.9,.1,c.projectedPoint,c.projectedPoint,(i.point1.mass+i.point2.mass)*c.u,1,.9,.1,c.edgeNormal,u,h),e.sub(p.ppos,p.cpos,u),e.add(p.ppos,p.ppos,h)}for(t=0;t<a.length;t++){r=a[t];e.inertia(r)}for(t=0;t<5;t++)e.solveDistanceConstraint(i.point1,i.point1.mass,i.point2,i.point2.mass,i.goal);!function(o,t,e){e.clearRect(0,0,e.canvas.width,e.canvas.height);for(var s=0;s<o.length;s++){var p=o[s];e.fillStyle="red",e.beginPath(),e.arc(p.ppos.x,p.ppos.y,p.radius,0,2*Math.PI,!1),e.fill(),e.fillStyle="black",e.beginPath(),e.arc(p.cpos.x,p.cpos.y,p.radius,0,2*Math.PI,!1),e.fill()}for(var s=0;s<t.length;s++){var i=t[s];e.strokeStyle="red",e.beginPath(),e.moveTo(i.point1.ppos.x,i.point1.ppos.y),e.lineTo(i.point2.ppos.x,i.point2.ppos.y),e.stroke(),e.beginPath(),e.strokeStyle="black",e.moveTo(i.point1.cpos.x,i.point1.cpos.y),e.lineTo(i.point2.cpos.x,i.point2.cpos.y),e.stroke()}}(a,[i],s),n&&window.requestAnimationFrame(o)}()};
},{"science-halt":"c4UV","../src":"fUdq"}],"QCba":[function(require,module,exports) {
"use strict";var e=this&&this.__createBinding||(Object.create?function(e,r,i,o){void 0===o&&(o=i),Object.defineProperty(e,o,{enumerable:!0,get:function(){return r[i]}})}:function(e,r,i,o){void 0===o&&(o=i),e[o]=r[i]}),r=this&&this.__setModuleDefault||(Object.create?function(e,r){Object.defineProperty(e,"default",{enumerable:!0,value:r})}:function(e,r){e.default=r}),i=this&&this.__importStar||function(i){if(i&&i.__esModule)return i;var o={};if(null!=i)for(var t in i)"default"!==t&&Object.prototype.hasOwnProperty.call(i,t)&&e(o,i,t);return r(o,i),o};Object.defineProperty(exports,"__esModule",{value:!0});var o=i(require("./aabb-overlap")),t=i(require("./aabb-soup")),l=i(require("./circle-collisions")),n=i(require("./circle-box-collision")),a=i(require("./edge-collision")),u=i(require("./platformer")),c=i(require("./bucket")),s=i(require("./edge-collision-aabb")),d=new URLSearchParams(window.location.search),f=d.get("demo"),p=new Map([["Bucket of Circles (Verlet)",c],["Circle Collisions (Verlet)",l],["Circle to Box Collision (Verlet)",n],["Single Edge Circle Collision (Verlet)",a],["Platformer (AABB Impulse Model)",u],["AABB Overlap Demo (AABB Impulse Model)",o],["AABB Soup Demo (AABB Impulse Model)",t],["Single Edge Circle Collision (AABB Impulse Model)",s]]);if(f&&p.has(f))p.get(f).start();else{var m=Array.from(p.keys()),b=function(e){var r=encodeURIComponent(e);return'\n      <li><a href="'+(window.location.pathname+"?demo="+r)+'">'+e+"</a></li>\n    "},B="\n    <ul>\n      "+m.map(function(e){return b(e)}).join("\n")+"\n    </ul>\n  ",h=document.createElement("div");h.innerHTML=B,document.body.appendChild(h)}
},{"./aabb-overlap":"R1Yz","./aabb-soup":"qzHv","./circle-collisions":"bcb3","./circle-box-collision":"rnWH","./edge-collision":"seMj","./platformer":"krcC","./bucket":"nHtR","./edge-collision-aabb":"X29T"}]},{},["QCba"], null)
//# sourceMappingURL=examples.149c2846.js.map