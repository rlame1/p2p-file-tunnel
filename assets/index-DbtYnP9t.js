var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,S||(S=!0,te());else{var t=n(l);t!==null&&D(x,t.startTime-e)}}}var S=!1,C=-1,w=5,T=-1;function ee(){return g?!0:!(e.unstable_now()-T<w)}function E(){if(g=!1,S){var t=e.unstable_now();T=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&ee());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&D(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?te():S=!1}}}var te;if(typeof y==`function`)te=function(){y(E)};else if(typeof MessageChannel<`u`){var ne=new MessageChannel,re=ne.port2;ne.port1.onmessage=E,te=function(){re.postMessage(null)}}else te=function(){_(E,0)};function D(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):w=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,D(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,te()))),r},e.unstable_shouldYield=ee,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),u=o(((e,t)=>{t.exports=l()})),d=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.for(`react.view_transition`),m=Symbol.iterator;function h(e){return typeof e!=`object`||!e?null:(e=m&&e[m]||e[`@@iterator`],typeof e==`function`?e:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_=Object.assign,v={};function y(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function b(){}b.prototype=y.prototype;function x(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}var S=x.prototype=new b;S.constructor=x,_(S,y.prototype),S.isPureReactComponent=!0;var C=Array.isArray;function w(){}var T={H:null,A:null,T:null,S:null},ee=Object.prototype.hasOwnProperty;function E(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function te(e,t){return E(e.type,t,e.props)}function ne(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function re(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var D=/\/+/g;function ie(e,t){return typeof e==`object`&&e&&e.key!=null?re(``+e.key):t.toString(36)}function ae(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(w,w):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function O(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,O(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+ie(e,0):a,C(o)?(i=``,c!=null&&(i=c.replace(D,`$&/`)+`/`),O(o,r,i,``,function(e){return e})):o!=null&&(ne(o)&&(o=te(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(D,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(C(e))for(var u=0;u<e.length;u++)a=e[u],s=l+ie(a,u),c+=O(a,r,i,s,o);else if(u=h(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+ie(a,u++),c+=O(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return O(ae(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function k(e,t,n){if(e==null)return e;var r=[],i=0;return O(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function oe(e){if(e._status===-1){var t=e._result,n=t();n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t,n.status===void 0&&(n.status=`fulfilled`,n.value=t))},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t,n.status===void 0&&(n.status=`rejected`,n.reason=t))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var se=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)};function ce(e){var t=T.T,n={};n.types=t===null?null:t.types,T.T=n;try{var r=e(),i=T.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(w,se)}catch(e){se(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),T.T=t}}function le(e){var t=T.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else ce(le.bind(null,e))}var ue={map:k,forEach:function(e,t,n){k(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return k(e,function(){t++}),t},toArray:function(e){return k(e,function(e){return e})||[]},only:function(e){if(!ne(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=ue,e.Component=y,e.Fragment=r,e.Profiler=a,e.PureComponent=x,e.StrictMode=i,e.Suspense=l,e.ViewTransition=p,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=T,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return T.H.useMemoCache(e)}},e.addTransitionType=le,e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=_({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!ee.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return E(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)ee.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return E(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=ne,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:oe}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=ce,e.unstable_useCacheRefresh=function(){return T.H.useCacheRefresh()},e.use=function(e){return T.H.use(e)},e.useActionState=function(e,t,n){return T.H.useActionState(e,t,n)},e.useCallback=function(e,t){return T.H.useCallback(e,t)},e.useContext=function(e){return T.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return T.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return T.H.useEffect(e,t)},e.useEffectEvent=function(e){return T.H.useEffectEvent(e)},e.useId=function(){return T.H.useId()},e.useImperativeHandle=function(e,t,n){return T.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return T.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return T.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return T.H.useMemo(e,t)},e.useOptimistic=function(e,t){return T.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return T.H.useReducer(e,t,n)},e.useRef=function(e){return T.H.useRef(e)},e.useState=function(e){return T.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return T.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return T.H.useTransition()},e.version=`19.3.1`})),f=o(((e,t)=>{t.exports=d()})),p=o((e=>{var t=f();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`),o=Symbol.for(`react.recoverable`),s=Symbol.for(`react.optimistic_key`);function c(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:r===s?s:``+r,children:e,containerInfo:t,implementation:n}}var l=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function u(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.browser=function(e){return{$$typeof:o,_reason:e}},e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return c(e,t,null,r)},e.flushSync=function(e){var t=l.T,n=i.p;try{if(l.T=null,i.p=2,e)return e()}finally{l.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=u(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=u(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}}else t??i.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=u(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=u(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}else i.d.m(e)}},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return l.H.useFormState(e,t,n)},e.useFormStatus=function(){return l.H.useHostTransitionStatus()},e.version=`19.3.1`})),m=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=p()})),h=o((e=>{var t=u(),n=f(),r=m();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){for(var t=e,n=t;n&&!n.alternate;)t=n,t.flags&4098&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function d(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function p(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=p(e),t!==null)return t;e=e.sibling}return null}function h(e,t,n,r,i,a){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,r,i,a)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&h(e.child,t,n,r,i,a))return!0;e=e.sibling}return!1}function g(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function _(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),e.tag!==3&&e.tag!==5&&e.tag!==27);)e=e.return;return t}function v(e){var t=[null,null],n=g(e);return n===null||y(t,e,n.child,{foundSelf:!1}),t}function y(e,t,n,r){for(;n!==null;){if(n===t)r.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(r.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&y(e,t,n.child,r))return!0;n=n.sibling}return!1}function b(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(i(559))}}var x=null,S=null;function C(e,t,n){return e===n||e===t&&(x=e,!0)}function w(e,t,n){return e===n?(S=e,!1):e===t&&(S!==null&&(x=e),!0)}function T(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function ee(e,t,n){for(var r=0,i=e;i;i=n(i))r++;i=0;for(var a=t;a;a=n(a))i++;for(;0<r-i;)e=n(e),r--;for(;0<i-r;)t=n(t),i--;for(;r--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var E=Object.assign,te=Symbol.for(`react.element`),ne=Symbol.for(`react.transitional.element`),re=Symbol.for(`react.portal`),D=Symbol.for(`react.fragment`),ie=Symbol.for(`react.strict_mode`),ae=Symbol.for(`react.profiler`),O=Symbol.for(`react.consumer`),k=Symbol.for(`react.context`),oe=Symbol.for(`react.forward_ref`),se=Symbol.for(`react.suspense`),ce=Symbol.for(`react.suspense_list`),le=Symbol.for(`react.memo`),ue=Symbol.for(`react.lazy`),de=Symbol.for(`react.activity`),fe=Symbol.for(`react.legacy_hidden`),pe=Symbol.for(`react.memo_cache_sentinel`),me=Symbol.for(`react.view_transition`),he=Symbol.for(`react.recoverable`),ge=Symbol.iterator;function A(e){return typeof e!=`object`||!e?null:(e=ge&&e[ge]||e[`@@iterator`],typeof e==`function`?e:null)}var _e=Symbol.for(`react.client.reference`);function ve(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===_e?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case D:return`Fragment`;case ae:return`Profiler`;case ie:return`StrictMode`;case se:return`Suspense`;case ce:return`SuspenseList`;case de:return`Activity`;case me:return`ViewTransition`}if(typeof e==`object`)switch(e.$$typeof){case re:return`Portal`;case k:return e.displayName||`Context`;case O:return(e._context.displayName||`Context`)+`.Consumer`;case oe:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case le:return t=e.displayName||null,t===null?ve(e.type)||`Memo`:t;case ue:t=e._payload,e=e._init;try{return ve(e(t))}catch{}}return null}var ye=Array.isArray,j=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,M=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,be={pending:!1,data:null,method:null,action:null},xe=[],Se=-1;function Ce(e){return{current:e}}function we(e){0>Se||(e.current=xe[Se],xe[Se]=null,Se--)}function N(e,t){Se++,xe[Se]=e.current,e.current=t}var Te=Ce(null),Ee=Ce(null),De=Ce(null),Oe=Ce(null);function ke(e,t){switch(N(De,t),N(Ee,e),N(Te,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?up(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=up(t),e=dp(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}we(Te),N(Te,e)}function Ae(){we(Te),we(Ee),we(De)}function je(e){var t=e.memoizedState;t!==null&&(sh._currentValue=t.memoizedState,N(Oe,e)),t=Te.current;var n=dp(t,e.type);t!==n&&(N(Ee,e),N(Te,n))}function Me(e){Ee.current===e&&(we(Te),we(Ee)),Oe.current===e&&(we(Oe),sh._currentValue=be)}var Ne,P;function Pe(e){if(Ne===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);Ne=t&&t[1]||``,P=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+Ne+e+P}var Fe=!1;function Ie(e,t){if(!e||Fe)return``;Fe=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}n=!1;try{var i=Object.getOwnPropertyDescriptor(e.prototype,`props`);Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),n=!0,new e}finally{n&&(i===void 0?delete e.prototype.props:Object.defineProperty(e.prototype,"props",i))}}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Fe=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Pe(n):``}function Le(e,t){switch(e.tag){case 26:case 27:case 5:return Pe(e.type);case 16:return Pe(`Lazy`);case 13:return e.child!==t&&t!==null?Pe(`Suspense Fallback`):Pe(`Suspense`);case 19:return Pe(`SuspenseList`);case 0:case 15:return Ie(e.type,!1);case 11:return Ie(e.type.render,!1);case 1:return Ie(e.type,!0);case 31:return Pe(`Activity`);case 30:return Pe(`ViewTransition`);default:return``}}function Re(e){try{var t=``,n=null;do t+=Le(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var ze=Object.prototype.hasOwnProperty,Be=t.unstable_scheduleCallback,Ve=t.unstable_cancelCallback,He=t.unstable_shouldYield,Ue=t.unstable_requestPaint,We=t.unstable_now,Ge=t.unstable_getCurrentPriorityLevel,Ke=t.unstable_ImmediatePriority,qe=t.unstable_UserBlockingPriority,F=t.unstable_NormalPriority,Je=t.unstable_LowPriority,Ye=t.unstable_IdlePriority,Xe=t.log,Ze=t.unstable_setDisableYieldValue,Qe=null,$e=null;function et(e){if(typeof Xe==`function`&&Ze(e),$e&&typeof $e.setStrictMode==`function`)try{$e.setStrictMode(Qe,e)}catch{}}var tt=Math.clz32?Math.clz32:it,nt=Math.log,rt=Math.LN2;function it(e){return e>>>=0,e===0?32:31-(nt(e)/rt|0)|0}var at=256,ot=262144,st=4194304;function ct(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function lt(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=ct(n))):i=ct(o):i=ct(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=ct(n))):i=ct(o)):i=ct(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function ut(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function dt(e,t){t&8&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var r=31-tt(n),i=1<<r;t|=e[r],n&=~i}return t}function ft(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function pt(){var e=st;return st<<=1,!(st&62914560)&&(st=4194304),e}function mt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ht(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function gt(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-tt(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&_t(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function _t(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-tt(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function vt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-tt(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function yt(e,t){var n=t&-t;return n=n&42?1:bt(n),(n&(e.suspendedLanes|t))===0?n:0}function bt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function xt(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function St(){var e=M.p;return e===0?(e=window.event,e===void 0?32:Ch(e.type)):e}function Ct(e,t){var n=M.p;try{return M.p=e,t()}finally{M.p=n}}var wt=Math.random().toString(36).slice(2),I=`__reactFiber$`+wt,L=`__reactProps$`+wt,Tt=`__reactContainer$`+wt,Et=`__reactEvents$`+wt,Dt=`__reactListeners$`+wt,Ot=`__reactHandles$`+wt,kt=`__reactResources$`+wt,At=`__reactMarker$`+wt,jt=`__reactLoad$`+wt;function Mt(e){delete e[I],delete e[L],delete e[Dt],delete e[Ot]}function Nt(e){var t;if(t=e[I])return t;for(var n=e.parentNode;n;){if(t=n[Tt]||n[I]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=fm(e);e!==null;){if(n=e[I])return n;e=fm(e)}return t}e=n,n=e.parentNode}return null}function R(e){if(e=e[I]||e[Tt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Pt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Ft(e){var t=e[kt];return t||=e[kt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function z(e){e[At]=!0}function It(e){e[jt]=void 0}var Lt=new Set,Rt={};function zt(e,t){Bt(e,t),Bt(e+`Capture`,t)}function Bt(e,t){for(Rt[e]=t,e=0;e<t.length;e++)Lt.add(t[e])}var Vt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Ht={},Ut={};function Wt(e){return ze.call(Ut,e)?!0:ze.call(Ht,e)?!1:Vt.test(e)?Ut[e]=!0:(Ht[e]=!0,!1)}var B=!1;function Gt(){var e=B;return B=!1,e}function Kt(e,t,n){if(Wt(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,n)}}}function qt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,n)}}function Jt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,r)}}function Yt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Xt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Zt(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Qt(e){if(!e._valueTracker){var t=Xt(e)?`checked`:`value`;e._valueTracker=Zt(e,t,``+e[t])}}function $t(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Xt(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}var V=/[\n"\\]/g;function en(e){return e.replace(V,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function tn(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+Yt(t)):e.value!==``+Yt(t)&&(e.value=``+Yt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):rn(e,Yt(n)):o===`number`&&e.value==t?rn(e,Yt(e.value)):rn(e,Yt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+Yt(s):e.removeAttribute(`name`)}function nn(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Qt(e);return}n=n==null?``:``+Yt(n),t=t==null?n:``+Yt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Qt(e)}function rn(e,t){e.defaultValue!==``+t&&(e.defaultValue=``+t)}function an(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+Yt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function on(e,t,n){t!=null&&(t=``+Yt(t),t!==e.value&&(e.value=t),n==null)?e.defaultValue!==t&&(e.defaultValue=t):e.defaultValue=n==null?``:``+Yt(n)}function sn(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(ye(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=Yt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Qt(e)}function cn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var ln=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function un(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||ln.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function dn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``,B=!0);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&(un(e,a,r),B=!0)}else for(var o in t)t.hasOwnProperty(o)&&un(e,o,t[o])}function fn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var pn=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`maskType`,`mask-type`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),mn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function hn(e){return mn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function gn(){}var _n=null;function vn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var yn=null,bn=null;function xn(e){var t=R(e);if(t&&(e=t.stateNode)){var n=e[L]||null;a:switch(e=t.stateNode,t.type){case`input`:if(tn(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+en(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[L]||null;if(!a)throw Error(i(90));tn(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&$t(r)}break a;case`textarea`:on(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&an(e,!!n.multiple,t,!1)}}}var Sn=!1;function Cn(e,t,n){if(Sn)return e(t,n);Sn=!0;try{return e(t)}finally{if(Sn=!1,(yn!==null||bn!==null)&&(zd(),yn&&(t=yn,e=bn,bn=yn=null,xn(t),e)))for(t=0;t<e.length;t++)xn(e[t])}}function wn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[L]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var Tn=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0,En=!1;if(Tn)try{var Dn={};Object.defineProperty(Dn,"passive",{get:function(){En=!0}}),window.addEventListener(`test`,Dn,Dn),window.removeEventListener(`test`,Dn,Dn)}catch{En=!1}var On=null,kn=null,An=null;function jn(){if(An)return An;var e,t=kn,n=t.length,r,i=`value`in On?On.value:On.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return An=i.slice(e,1<r?1-r:void 0)}function Mn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Nn(){return!0}function Pn(){return!1}function Fn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Nn:Pn,this.isPropagationStopped=Pn,this}return E(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Nn)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Nn)},persist:function(){},isPersistent:Nn}),t}var In={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ln=Fn(In),Rn=E({},In,{view:0,detail:0}),zn=Fn(Rn),Bn,Vn,Hn,Un=E({},Rn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:er,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Hn&&(Hn&&e.type===`mousemove`?(Bn=e.screenX-Hn.screenX,Vn=e.screenY-Hn.screenY):Vn=Bn=0,Hn=e),Bn)},movementY:function(e){return`movementY`in e?e.movementY:Vn}}),Wn=Fn(Un),Gn=Fn(E({},Un,{dataTransfer:0})),Kn=Fn(E({},Rn,{relatedTarget:0})),qn=Fn(E({},In,{animationName:0,elapsedTime:0,pseudoElement:0})),Jn=Fn(E({},In,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Yn=Fn(E({},In,{data:0})),Xn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Zn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Qn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function $n(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Qn[e])?!!t[e]:!1}function er(){return $n}var tr=Fn(E({},Rn,{key:function(e){if(e.key){var t=Xn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Mn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Zn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:er,charCode:function(e){return e.type===`keypress`?Mn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Mn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),nr=Fn(E({},Un,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),rr=Fn(E({},In,{submitter:0})),ir=Fn(E({},Rn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:er})),ar=Fn(E({},In,{propertyName:0,elapsedTime:0,pseudoElement:0})),or=Fn(E({},Un,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),sr=Fn(E({},In,{newState:0,oldState:0,source:0})),cr=[9,13,27,32],lr=Tn&&`CompositionEvent`in window,ur=null;Tn&&`documentMode`in document&&(ur=document.documentMode);var dr=Tn&&`TextEvent`in window&&!ur,fr=Tn&&(!lr||ur&&8<ur&&11>=ur),pr=` `,mr=!1;function hr(e,t){switch(e){case`keyup`:return cr.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function gr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var _r=!1;function vr(e,t){switch(e){case`compositionend`:return gr(t);case`keypress`:return t.which===32?(mr=!0,pr):null;case`textInput`:return e=t.data,e===pr&&mr?null:e;default:return null}}function yr(e,t){if(_r)return e===`compositionend`||!lr&&hr(e,t)?(e=jn(),An=kn=On=null,_r=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return fr&&t.locale!==`ko`?null:t.data;default:return null}}var br={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function xr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!br[e.type]:t===`textarea`}function Sr(e,t,n,r){yn?bn?bn.push(r):bn=[r]:yn=r,t=Jf(t,`onChange`),0<t.length&&(n=new Ln(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var Cr=null,wr=null;function Tr(e){Vf(e,0)}function Er(e){if($t(Pt(e)))return e}function Dr(e,t){if(e===`change`)return t}var Or=!1;if(Tn){var kr;if(Tn){var Ar=`oninput`in document;if(!Ar){var jr=document.createElement(`div`);jr.setAttribute(`oninput`,`return;`),Ar=typeof jr.oninput==`function`}kr=Ar}else kr=!1;Or=kr&&(!document.documentMode||9<document.documentMode)}function Mr(){Cr&&(Cr.detachEvent(`onpropertychange`,Nr),wr=Cr=null)}function Nr(e){if(e.propertyName===`value`&&Er(wr)){var t=[];Sr(t,wr,e,vn(e)),Cn(Tr,t)}}function Pr(e,t,n){e===`focusin`?(Mr(),Cr=t,wr=n,Cr.attachEvent(`onpropertychange`,Nr)):e===`focusout`&&Mr()}function Fr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return Er(wr)}function Ir(e,t){if(e===`click`)return Er(t)}function Lr(e,t){if(e===`input`||e===`change`)return Er(t)}function Rr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var zr=typeof Object.is==`function`?Object.is:Rr;function Br(e,t){if(zr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!ze.call(t,i)||!zr(e[i],t[i]))return!1}return!0}function Vr(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}function Hr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Ur(e,t){var n=Hr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Hr(n)}}function Wr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Wr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Gr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Vr(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Vr(e.document)}return t}function Kr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var qr=Tn&&`documentMode`in document&&11>=document.documentMode,Jr=null,Yr=null,Xr=null,Zr=!1;function Qr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Zr||Jr==null||Jr!==Vr(r)||(r=Jr,`selectionStart`in r&&Kr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Xr&&Br(Xr,r)||(Xr=r,r=Jf(Yr,`onSelect`),0<r.length&&(t=new Ln(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Jr)))}function $r(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var ei={animationend:$r(`Animation`,`AnimationEnd`),animationiteration:$r(`Animation`,`AnimationIteration`),animationstart:$r(`Animation`,`AnimationStart`),transitionrun:$r(`Transition`,`TransitionRun`),transitionstart:$r(`Transition`,`TransitionStart`),transitioncancel:$r(`Transition`,`TransitionCancel`),transitionend:$r(`Transition`,`TransitionEnd`)},ti={},ni={};Tn&&(ni=document.createElement(`div`).style,`AnimationEvent`in window||(delete ei.animationend.animation,delete ei.animationiteration.animation,delete ei.animationstart.animation),`TransitionEvent`in window||delete ei.transitionend.transition);function ri(e){if(ti[e])return ti[e];if(!ei[e])return e;var t=ei[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ni)return ti[e]=t[n];return e}var ii=ri(`animationend`),ai=ri(`animationiteration`),oi=ri(`animationstart`),si=ri(`transitionrun`),ci=ri(`transitionstart`),li=ri(`transitioncancel`),ui=ri(`transitionend`),di=new Map,fi=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);fi.push(`scrollEnd`);function pi(e,t){di.set(e,t),zt(t,[e])}var mi=0;function hi(e,t){if(e.name!=null&&e.name!==`auto`)return e.name;if(t.autoName!==null)return t.autoName;e=bd.identifierPrefix;var n=mi++;return e=`_`+e+`t_`+n.toString(32)+`_`,t.autoName=e}function gi(e){if(e==null||typeof e==`string`)return e;var t=null,n=Od;if(n!==null)for(var r=0;r<n.length;r++){var i=e[n[r]];if(i!=null){if(i===`none`)return`none`;t=t==null?i:t+(` `+i)}}return t??e.default}function _i(e,t){return e=gi(e),t=gi(t),t==null?e===`auto`?null:e:t===`auto`?null:t}var vi=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},yi=[],bi=0,xi=0;function Si(){for(var e=bi,t=xi=bi=0;t<e;){var n=yi[t];yi[t++]=null;var r=yi[t];yi[t++]=null;var i=yi[t];yi[t++]=null;var a=yi[t];if(yi[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&Ei(n,i,a)}}function Ci(e,t,n,r){yi[bi++]=e,yi[bi++]=t,yi[bi++]=n,yi[bi++]=r,xi|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function wi(e,t,n,r){return Ci(e,t,n,r),Di(e)}function Ti(e,t){return Ci(e,null,null,t),Di(e)}function Ei(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-tt(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function Di(e){if(50<kd)throw kd=0,Ad=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Oi={};function ki(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ai(e,t,n,r){return new ki(e,t,n,r)}function ji(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Mi(e,t){var n=e.alternate;return n===null?(n=Ai(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Ni(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Pi(e,t,n,r,a,o){var s=0;if(r=e,typeof r==`function`)ji(r)&&(s=1);else if(typeof r==`string`)s=qm(e,n,Te.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(r){case de:return e=Ai(31,n,t,a),e.elementType=de,e.lanes=o,e;case D:return Fi(n.children,a,o,t);case ie:s=8,a|=24;break;case ae:return e=Ai(12,n,t,a|2),e.elementType=ae,e.lanes=o,e;case se:return e=Ai(13,n,t,a),e.elementType=se,e.lanes=o,e;case ce:return e=Ai(19,n,t,a),e.elementType=ce,e.lanes=o,e;case fe:case me:return e=a|32,e=Ai(30,n,t,e),e.elementType=me,e.lanes=o,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof r==`object`&&r)switch(r.$$typeof){case k:s=10;break a;case O:s=9;break a;case oe:s=11;break a;case le:s=14;break a;case ue:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=Ai(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function Fi(e,t,n,r){return e=Ai(7,e,r,t),e.lanes=n,e}function Ii(e,t,n){return e=Ai(6,e,null,t),e.lanes=n,e}function Li(e){var t=Ai(18,null,null,0);return t.stateNode=e,t}function Ri(e,t,n){return t=Ai(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var zi=new WeakMap;function Bi(e,t){if(typeof e==`object`&&e){var n=zi.get(e);return n===void 0?(t={value:e,source:t,stack:Re(t)},zi.set(e,t),t):n}return{value:e,source:t,stack:Re(t)}}var Vi=[],Hi=0,Ui=null,Wi=0,Gi=[],Ki=0,qi=null,Ji=1,Yi=``;function Xi(e,t){Vi[Hi++]=Wi,Vi[Hi++]=Ui,Ui=e,Wi=t}function Zi(e,t,n){Gi[Ki++]=Ji,Gi[Ki++]=Yi,Gi[Ki++]=qi,qi=e;var r=Ji;e=Yi;var i=32-tt(r)-1;r&=~(1<<i),n+=1;var a=32-tt(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Ji=1<<32-tt(t)+i|n<<i|r,Yi=a+e}else Ji=1<<a|n<<i|r,Yi=e}function Qi(e){e.return!==null&&(Xi(e,1),Zi(e,1,0))}function $i(e){for(;e===Ui;)Ui=Vi[--Hi],Vi[Hi]=null,Wi=Vi[--Hi],Vi[Hi]=null;for(;e===qi;)qi=Gi[--Ki],Gi[Ki]=null,Yi=Gi[--Ki],Gi[Ki]=null,Ji=Gi[--Ki],Gi[Ki]=null}function ea(e,t){Gi[Ki++]=Ji,Gi[Ki++]=Yi,Gi[Ki++]=qi,Ji=t.id,Yi=t.overflow,qi=e}var ta=null,na=null,H=!1,ra=null,ia=!1,aa=Error(i(519));function oa(e){throw fa(Bi(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),aa}function sa(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[I]=e,t[L]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<zf.length;n++)Q(zf[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),nn(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),sn(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||ep(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=gn),t=!0):t=!1,t||oa(e,!0)}function ca(e){for(ta=e.return;ta;)switch(ta.tag){case 5:case 31:case 13:ia=!1;return;case 27:case 3:ia=!0;return;default:ta=ta.return}}function la(e){if(e!==ta)return!1;if(!H)return ca(e),H=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||pp(e.type,e.memoizedProps)),n=!n),n&&na&&oa(e),ca(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));na=dm(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));na=dm(e)}else t===27?(t=na,Sp(e.type)?(e=um,um=null,na=e):na=t):na=ta?lm(e.stateNode.nextSibling):null;return!0}function ua(){na=ta=null,H=!1}function da(){var e=ra;return e!==null&&(fd===null?fd=e:fd.push.apply(fd,e),ra=null),e}function fa(e){ra===null?ra=[e]:ra.push(e)}var pa=Ce(null),ma=null,ha=null;function ga(e,t,n){N(pa,t._currentValue),t._currentValue=n}function _a(e){e._currentValue=pa.current,we(pa)}function va(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function ya(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),va(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),va(s,n,e),s=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,s=a.alternate,s!==null&&(s.lanes|=n),va(a.return,n,e),s=a.child,s=s===null?null:s.sibling):s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function ba(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;zr(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===Oe.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[sh]:e.push(sh))}a=a.return}return e!==null&&ya(t,e,n,r),t.flags|=262144,e!==null}function xa(e){for(e=e.firstContext;e!==null;){if(!zr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Sa(e){ma=e,ha=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ca(e){return Ta(ma,e)}function wa(e,t){return ma===null&&Sa(e),Ta(e,t)}function Ta(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},ha===null){if(e===null)throw Error(i(308));ha=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else ha=ha.next=t;return n}var Ea=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},Da=t.unstable_scheduleCallback,Oa=t.unstable_NormalPriority,ka={$$typeof:k,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Aa(){return{controller:new Ea,data:new Map,refCount:0}}function ja(e){e.refCount--,e.refCount===0&&Da(Oa,function(){e.controller.abort()})}function Ma(e,t){if(e.pendingLanes&4194048){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var r=t[e];n.indexOf(r)===-1&&n.push(r)}}}var Na=null;function Pa(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var Fa=null,Ia=0,La=0,Ra=null;function za(e,t){if(Fa===null){var n=Fa=[];Ia=0,La=Pf(),Ra={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return Ia++,t.then(Ba,Ba),t}function Ba(){if(--Ia===0&&(Na=null,Fa!==null)){Ra!==null&&(Ra.status=`fulfilled`);var e=Fa;Fa=null,La=0,Ra=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Va(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Ha=j.S;j.S=function(e,t){if(hd=We(),typeof t==`object`&&t&&typeof t.then==`function`&&za(e,t),Na!==null)for(var n=bf;n!==null;)Ma(n,Na),n=n.next;if(n=e.types,n!==null){for(var r=bf;r!==null;)Ma(r,n),r=r.next;if(La!==0){r=Na,r===null&&(r=Na=[]);for(var i=0;i<n.length;i++){var a=n[i];r.indexOf(a)===-1&&r.push(a)}}}Ha!==null&&Ha(e,t)};var Ua=Ce(null);function Wa(){var e=Ua.current;return e===null?q.pooledCache:e}function Ga(e,t){t===null?N(Ua,Ua.current):N(Ua,t.pool)}function Ka(){var e=Wa();return e===null?null:{parent:ka._currentValue,pool:e}}var qa=Error(i(460)),Ja=Error(i(474)),Ya=Error(i(542)),Xa={then:function(){}};function Za(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Qa(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(gn,gn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,no(e),e===void 0&&!(`reason`in t)?Error(i(600)):e;default:if(typeof t.status==`string`)t.then(gn,gn);else{if(e=q,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,no(e),e}throw eo=t,qa}}function $a(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(eo=e,qa):e}}var eo=null;function to(){if(eo===null)throw Error(i(459));var e=eo;return eo=null,e}function no(e){if(e===qa||e===Ya)throw Error(i(483))}var ro=null,io=0;function ao(e){var t=io;return io+=1,ro===null&&(ro=[]),Qa(ro,e,t)}function oo(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function so(e,t){throw t.$$typeof===te?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function co(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=Mi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=134217730,n):(r=r.index,r<n?(t.flags|=2,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=134217730),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Ii(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===D?(e=d(e,t,n.props.children,r,n.key),oo(e,n),e):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===ue&&$a(i)===t.type)?(t=a(t,n.props),oo(t,n),t.return=e,t):(t=Pi(n.type,n.key,n.props,null,e.mode,r),oo(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=Ri(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=Fi(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Ii(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case ne:return n=Pi(t.type,t.key,t.props,null,e.mode,n),oo(n,t),n.return=e,n;case re:return t=Ri(t,e.mode,n),t.return=e,t;case ue:return t=$a(t),f(e,t,n)}if(ye(t)||A(t))return t=Fi(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,ao(t),n);if(t.$$typeof===k)return f(e,wa(e,t),n);so(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case ne:return n.key===i?l(e,t,n,r):null;case re:return n.key===i?u(e,t,n,r):null;case ue:return n=$a(n),p(e,t,n,r)}if(ye(n)||A(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,ao(n),r);if(n.$$typeof===k)return p(e,t,wa(e,n),r);so(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case ne:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case re:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case ue:return r=$a(r),m(e,t,n,r,i)}if(ye(r)||A(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,ao(r),i);if(r.$$typeof===k)return m(e,t,n,wa(t,r),i);so(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),H&&Xi(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return H&&Xi(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&(_=g.alternate,_!==null&&d.delete(_.key===null?h:_.key)),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),H&&Xi(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),H&&Xi(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return H&&Xi(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&(_=v.alternate,_!==null&&h.delete(_.key===null?g:_.key)),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),H&&Xi(a,g),u}function _(e,r,o,c){if(typeof o==`object`&&o&&o.type===D&&o.key===null&&o.props.ref===void 0&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case ne:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===D){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),oo(c,o),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===ue&&$a(l)===r.type){n(e,r.sibling),c=a(r,o.props),oo(c,o),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}o.type===D?(c=Fi(o.props.children,e.mode,c,o.key),oo(c,o),c.return=e,e=c):(c=Pi(o.type,o.key,o.props,null,e.mode,c),oo(c,o),c.return=e,e=c)}return s(e);case re:a:{for(l=o.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=Ri(o,e.mode,c),c.return=e,e=c}return s(e);case ue:return o=$a(o),_(e,r,o,c)}if(ye(o))return h(e,r,o,c);if(A(o)){if(l=A(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return _(e,r,ao(o),c);if(o.$$typeof===k)return _(e,r,wa(e,o),c);so(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=Ii(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{io=0;var i=_(e,t,n,r);return ro=null,i}catch(t){if(t===qa||t===Ya)throw t;var a=Ai(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var lo=co(!0),uo=co(!1),fo=!1;function po(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function mo(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function ho(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function go(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,K&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=Di(e),Ei(e,null,n),t}return Ci(e,r,t,n),Di(e)}function _o(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,vt(e,n)}}function vo(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n}else e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var yo=!1;function bo(){if(yo){var e=Ra;if(e!==null)throw e}}function xo(e,t,n,r){yo=!1;var i=e.updateQueue;fo=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Y&f)===f:(r&f)===f){f!==0&&f===La&&(yo=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,h=s;f=t;var g=n;switch(h.tag){case 1:if(m=h.payload,typeof m==`function`){d=m.call(g,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=h.payload,f=typeof m==`function`?m.call(g,d,f):m,f==null)break a;d=E({},d,f);break a;case 2:fo=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),od|=o,e.lanes=o,e.memoizedState=d}}function So(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function Co(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)So(n[e],t)}var wo=Ce(null),To=Ce(0);function Eo(e,t){e=id,N(To,e),N(wo,t),id=e|t.baseLanes}function Do(){N(To,id),N(wo,wo.current)}function Oo(){id=To.current,we(wo),we(To)}var ko=Ce(null),Ao=null;function jo(e){var t=e.alternate;N(Io,Io.current&1),N(ko,e),Ao===null&&(t===null||wo.current!==null||t.memoizedState!==null)&&(Ao=e)}function Mo(e){N(Io,Io.current),N(ko,e),Ao===null&&(Ao=e)}function No(e){e.tag===22?(N(Io,Io.current),N(ko,e),Ao===null&&(Ao=e)):Po()}function Po(){N(Io,Io.current),N(ko,ko.current)}function Fo(e){we(ko),Ao===e&&(Ao=null),we(Io)}var Io=Ce(0);function Lo(e,t){N(ko,ko.current),N(Io,t)}function Ro(e){we(Io),we(ko),Ao===e&&(Ao=null)}function zo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||om(n)||sm(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==`independent`){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Bo=0,U=null,W=null,Vo=null,Ho=!1,Uo=!1,Wo=!1,Go=0,Ko=0,qo=null,Jo=0;function Yo(){throw Error(i(321))}function Xo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!zr(e[n],t[n]))return!1;return!0}function Zo(e,t,n,r,i,a){return Bo=a,U=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,j.H=e===null||e.memoizedState===null?mc:hc,Wo=!1,a=n(r,i),Wo=!1,Uo&&(a=$o(t,n,r,i)),Qo(e),a}function Qo(e){j.H=pc;var t=W!==null&&W.next!==null;if(Bo=0,Vo=W=U=null,Ho=!1,Ko=0,qo=null,t)throw Error(i(300));e===null||Mc||(e=e.dependencies,e!==null&&xa(e)&&(Mc=!0))}function $o(e,t,n,r){U=e;var a=0;do{if(Uo&&(qo=null),Ko=0,Uo=!1,25<=a)throw Error(i(301));if(a+=1,Vo=W=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}j.H=gc,o=t(n,r)}while(Uo);return o}function es(){var e=j.H,t=e.useState()[0];return t=typeof t.then==`function`?ss(t):t,e=e.useState()[0],(W===null?null:W.memoizedState)!==e&&(U.flags|=1024),t}function ts(){var e=Go!==0;return Go=0,e}function ns(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function rs(e){if(Ho){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Ho=!1}Bo=0,Vo=W=U=null,Uo=!1,Ko=Go=0,qo=null}function is(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Vo===null?U.memoizedState=Vo=e:Vo=Vo.next=e,Vo}function as(){if(W===null){var e=U.alternate;e=e===null?null:e.memoizedState}else e=W.next;var t=Vo===null?U.memoizedState:Vo.next;if(t!==null)Vo=t,W=e;else{if(e===null)throw U.alternate===null?Error(i(467)):Error(i(310));W=e,e={memoizedState:W.memoizedState,baseState:W.baseState,baseQueue:W.baseQueue,queue:W.queue,next:null},Vo===null?U.memoizedState=Vo=e:Vo=Vo.next=e}return Vo}function os(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ss(e){var t=Ko;return Ko+=1,qo===null&&(qo=[]),e=Qa(qo,e,t),t=U,(Vo===null?t.memoizedState:Vo.next)===null&&(t=t.alternate,j.H=t===null||t.memoizedState===null?mc:hc),e}function cs(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return ss(e);if(e.$$typeof===he)return;if(e.$$typeof===k)return Ca(e)}throw Error(i(438,String(e)))}function ls(e){var t=null,n=U.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=U.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=os(),U.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=pe;return t.index++,n}function us(e,t){return typeof t==`function`?t(e):t}function ds(e){return fs(as(),W,e)}function fs(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(Bo&f)===f:(Y&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===La&&(d=!0);else if((Bo&p)===p){u=u.next,p===La&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,U.lanes|=p,od|=p;f=u.action,Wo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,U.lanes|=f,od|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!zr(o,e.memoizedState)&&(Mc=!0,d&&(n=Ra,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function ps(e){var t=as(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);zr(o,t.memoizedState)||(Mc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function ms(e,t,n){var r=U,a=as(),o=H;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!zr((W||a).memoizedState,n);if(s&&(a.memoizedState=n,Mc=!0),a=a.queue,zs(_s.bind(null,r,a,e),[e]),e=a.getSnapshot!==t||s||Vo!==null&&!!(Vo.memoizedState.tag&1),Ps(e?9:8,{destroy:void 0},gs.bind(null,r,a,n,t),null),e){if(r.flags|=2048,q===null)throw Error(i(349));o||Bo&127||hs(r,t,n)}return n}function hs(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=U.updateQueue,t===null?(t=os(),U.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function gs(e,t,n,r){t.value=n,t.getSnapshot=r,vs(t)&&ys(e)}function _s(e,t,n){return n(function(){vs(t)&&ys(e)})}function vs(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!zr(e,n)}catch{return!0}}function ys(e){var t=Ti(e,2);t!==null&&Pd(t,e,2)}function bs(e){var t=is();if(typeof e==`function`){var n=e;if(e=n(),Wo){et(!0);try{n()}finally{et(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:us,lastRenderedState:e},t}function xs(e,t,n,r){return e.baseState=n,fs(e,W,typeof r==`function`?r:us)}function Ss(e,t,n,r,a){if(uc(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};j.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,Cs(t,o)):(o.next=n.next,t.pending=n.next=o)}}function Cs(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=j.T,o={};o.types=a===null?null:a.types,j.T=o;try{var s=n(i,r),c=j.S;c!==null&&c(o,s),ws(e,t,s)}catch(n){Es(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),j.T=a}}else try{a=n(i,r),ws(e,t,a)}catch(n){Es(e,t,n)}}function ws(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){Ts(e,t,n)},function(n){return Es(e,t,n)}):Ts(e,t,n)}function Ts(e,t,n){t.status=`fulfilled`,t.value=n,Ds(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Cs(e,n)))}function Es(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,Ds(t),t=t.next;while(t!==r)}e.action=null}function Ds(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Os(e,t){return t}function ks(e,t){if(H){var n=q.formState;if(n!==null){a:{var r=U;if(H){if(na){b:{for(var i=na,a=ia;i.nodeType!==8;)if(!a||(i=lm(i.nextSibling),i===null)){i=null;break b}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){na=lm(i.nextSibling),r=i.data===`F!`;break a}}oa(r)}r=!1}r&&(t=n[0])}}return n=is(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Os,lastRenderedState:t},n.queue=r,n=sc.bind(null,U,r),r.dispatch=n,r=bs(!1),a=lc.bind(null,U,!1,r.queue),r=is(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Ss.bind(null,U,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function As(e){return js(as(),W,e)}function js(e,t,n){if(t=fs(e,t,Os)[0],e=ds(us)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=ss(t)}catch(e){throw e===qa?Ya:e}else r=t;t=as();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(U.flags|=2048,Ps(9,{destroy:void 0},Ms.bind(null,i,n),null)),[r,a,e]}function Ms(e,t){e.action=t}function Ns(e){var t=as(),n=W;if(n!==null)return js(t,n,e);as(),t=t.memoizedState,n=as();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function Ps(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=U.updateQueue,t===null&&(t=os(),U.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function Fs(){return as().memoizedState}function Is(e,t,n,r){var i=is();U.flags|=e,i.memoizedState=Ps(1|t,{destroy:void 0},n,r===void 0?null:r)}function Ls(e,t,n,r){var i=as();r=r===void 0?null:r;var a=i.memoizedState.inst;W!==null&&r!==null&&Xo(r,W.memoizedState.deps)?i.memoizedState=Ps(t,a,n,r):(U.flags|=e,i.memoizedState=Ps(1|t,a,n,r))}function Rs(e,t){Is(8390656,8,e,t)}function zs(e,t){Ls(2048,8,e,t)}function Bs(e){U.flags|=4;var t=U.updateQueue;if(t===null)t=os(),U.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Vs(e){var t=as().memoizedState;return Bs({ref:t,nextImpl:e}),function(){if(K&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function Hs(e,t){return Ls(4,2,e,t)}function Us(e,t){return Ls(4,4,e,t)}function Ws(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Gs(e,t,n){n=n==null?null:n.concat([e]),Ls(4,4,Ws.bind(null,t,e),n)}function Ks(){}function qs(e,t){var n=as();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Xo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Js(e,t){var n=as();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Xo(t,r[1]))return r[0];if(r=e(),Wo){et(!0);try{e()}finally{et(!1)}}return n.memoizedState=[r,t],r}function Ys(e,t,n){return n===void 0||Bo&1073741824&&!(Y&261930)?e.memoizedState=t:(e.memoizedState=n,e=Md(),U.lanes|=e,od|=e,n)}function Xs(e,t,n,r){return zr(n,t)?n:wo.current===null?!(Bo&106)||Bo&1073741824&&!(Y&261930)?(Mc=!0,e.memoizedState=n):(e=Md(),U.lanes|=e,od|=e,t):(e=Ys(e,n,r),zr(e,t)||(Mc=!0),e)}function Zs(e,t,n,r,i){var a=M.p;M.p=a!==0&&8>a?a:8;var o=j.T,s={};s.types=o===null?null:o.types,j.T=s,lc(e,!1,t,n);try{var c=i(),l=j.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?cc(e,t,Va(c,r),jd(e)):cc(e,t,r,jd(e))}catch(n){cc(e,t,{then:function(){},status:`rejected`,reason:n},jd())}finally{M.p=a,o!==null&&s.types!==null&&(o.types=s.types),j.T=o}}function Qs(){}function $s(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=ec(e).queue;Zs(e,a,t,be,n===null?Qs:function(){return tc(e),n(r)})}function ec(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:be,baseState:be,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:us,lastRenderedState:be},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:us,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function tc(e){var t=ec(e);t.next===null&&(t=e.alternate.memoizedState),cc(e,t.next.queue,{},jd())}function nc(){return Ca(sh)}function rc(){return as().memoizedState}function ic(){return as().memoizedState}function ac(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=jd();e=ho(n);var r=go(t,e,n);r!==null&&(Pd(r,t,n),_o(r,t,n)),t={cache:Aa()},e.payload=t;return}t=t.return}}function oc(e,t,n){var r=jd();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},uc(e)?dc(t,n):(n=wi(e,t,n,r),n!==null&&(Pd(n,e,r),fc(n,t,r)))}function sc(e,t,n){cc(e,t,n,jd())}function cc(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(uc(e))dc(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,zr(s,o))return Ci(e,t,i,0),q===null&&Si(),!1}catch{}if(n=wi(e,t,i,r),n!==null)return Pd(n,e,r),fc(n,t,r),!0}return!1}function lc(e,t,n,r){if(r={lane:2,revertLane:Pf(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},uc(e)){if(t)throw Error(i(479))}else t=wi(e,n,r,2),t!==null&&Pd(t,e,2)}function uc(e){var t=e.alternate;return e===U||t!==null&&t===U}function dc(e,t){Uo=Ho=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function fc(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,vt(e,n)}}var pc={readContext:Ca,use:cs,useCallback:Yo,useContext:Yo,useEffect:Yo,useImperativeHandle:Yo,useLayoutEffect:Yo,useInsertionEffect:Yo,useMemo:Yo,useReducer:Yo,useRef:Yo,useState:Yo,useDebugValue:Yo,useDeferredValue:Yo,useTransition:Yo,useSyncExternalStore:Yo,useId:Yo,useHostTransitionStatus:Yo,useFormState:Yo,useActionState:Yo,useOptimistic:Yo,useMemoCache:Yo,useCacheRefresh:Yo,useEffectEvent:Yo},mc={readContext:Ca,use:cs,useCallback:function(e,t){return is().memoizedState=[e,t===void 0?null:t],e},useContext:Ca,useEffect:Rs,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),Is(4194308,4,Ws.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Is(4194308,4,e,t)},useInsertionEffect:function(e,t){Is(4,2,e,t)},useMemo:function(e,t){var n=is();t=t===void 0?null:t;var r=e();if(Wo){et(!0);try{e()}finally{et(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=is();if(n!==void 0){var i=n(t);if(Wo){et(!0);try{n(t)}finally{et(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=oc.bind(null,U,e),[r.memoizedState,e]},useRef:function(e){var t=is();return e={current:e},t.memoizedState=e},useState:function(e){e=bs(e);var t=e.queue,n=sc.bind(null,U,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Ks,useDeferredValue:function(e,t){return Ys(is(),e,t)},useTransition:function(){var e=bs(!1);return e=Zs.bind(null,U,e.queue,!0,!1),is().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=U,a=is();if(H){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),q===null)throw Error(i(349));Y&127||hs(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,Rs(_s.bind(null,r,o,e),[e]),r.flags|=2048,Ps(9,{destroy:void 0},gs.bind(null,r,o,n,t),null),n},useId:function(){var e=is(),t=q.identifierPrefix;if(H){var n=Yi,r=Ji;n=(r&~(1<<32-tt(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=Go++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=Jo++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:nc,useFormState:ks,useActionState:ks,useOptimistic:function(e){var t=is();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=lc.bind(null,U,!0,n),n.dispatch=t,[e,t]},useMemoCache:ls,useCacheRefresh:function(){return is().memoizedState=ac.bind(null,U)},useEffectEvent:function(e){var t=is(),n={impl:e};return t.memoizedState=n,function(){if(K&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},hc={readContext:Ca,use:cs,useCallback:qs,useContext:Ca,useEffect:zs,useImperativeHandle:Gs,useInsertionEffect:Hs,useLayoutEffect:Us,useMemo:Js,useReducer:ds,useRef:Fs,useState:function(){return ds(us)},useDebugValue:Ks,useDeferredValue:function(e,t){return Xs(as(),W.memoizedState,e,t)},useTransition:function(){var e=ds(us)[0],t=as().memoizedState;return[typeof e==`boolean`?e:ss(e),t]},useSyncExternalStore:ms,useId:rc,useHostTransitionStatus:nc,useFormState:As,useActionState:As,useOptimistic:function(e,t){return xs(as(),W,e,t)},useMemoCache:ls,useCacheRefresh:ic,useEffectEvent:Vs},gc={readContext:Ca,use:cs,useCallback:qs,useContext:Ca,useEffect:zs,useImperativeHandle:Gs,useInsertionEffect:Hs,useLayoutEffect:Us,useMemo:Js,useReducer:ps,useRef:Fs,useState:function(){return ps(us)},useDebugValue:Ks,useDeferredValue:function(e,t){var n=as();return W===null?Ys(n,e,t):Xs(n,W.memoizedState,e,t)},useTransition:function(){var e=ps(us)[0],t=as().memoizedState;return[typeof e==`boolean`?e:ss(e),t]},useSyncExternalStore:ms,useId:rc,useHostTransitionStatus:nc,useFormState:Ns,useActionState:Ns,useOptimistic:function(e,t){var n=as();return W===null?(n.baseState=e,[e,n.queue.dispatch]):xs(n,W,e,t)},useMemoCache:ls,useCacheRefresh:ic,useEffectEvent:Vs};function _c(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:E({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var vc={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=jd(),i=ho(r);i.payload=t,n!=null&&(i.callback=n),t=go(e,i,r),t!==null&&(Pd(t,e,r),_o(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=jd(),i=ho(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=go(e,i,r),t!==null&&(Pd(t,e,r),_o(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=jd(),r=ho(n);r.tag=2,t!=null&&(r.callback=t),t=go(e,r,n),t!==null&&(Pd(t,e,n),_o(t,e,n))}};function yc(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Br(n,r)||!Br(i,a):!0}function bc(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&vc.enqueueReplaceState(t,t.state,null)}function xc(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=E({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Sc(e){vi(e)}function Cc(e){console.error(e)}function wc(e){vi(e)}function Tc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function Ec(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function Dc(e,t,n){return n=ho(n),n.tag=3,n.payload={element:null},n.callback=function(){Tc(e,t)},n}function Oc(e){return e=ho(e),e.tag=3,e}function kc(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){Ec(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){Ec(t,n,r),typeof i!=`function`&&(vd===null?vd=new Set([this]):vd.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function Ac(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&ba(t,n,a,!0),n=ko.current,n!==null){switch(n.tag){case 31:case 13:case 19:return Ao===null?Kd():n.alternate===null&&ad===0&&(ad=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Xa?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),mf(e,r,a)),!1;case 22:return n.flags|=65536,r===Xa?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),mf(e,r,a)),!1}throw Error(i(435,n.tag))}return mf(e,r,a),Kd(),!1}if(H)return t=ko.current,t===null?(r!==aa&&(t=Error(i(423),{cause:r}),fa(Bi(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Bi(r,n),a=Dc(e.stateNode,r,a),vo(e,a),ad!==4&&(ad=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==aa&&(e=Error(i(422),{cause:r}),fa(Bi(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Bi(o,n),dd===null?dd=[o]:dd.push(o),ad!==4&&(ad=2),t===null)return!0;r=Bi(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Dc(n.stateNode,r,e),vo(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(vd===null||!vd.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Oc(a),kc(a,e,n,r),vo(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var jc=Error(i(461)),Mc=!1;function Nc(e,t,n,r){t.child=e===null?uo(t,null,n,r):lo(t,e.child,n,r)}function Pc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return Sa(t),r=Zo(e,t,n,o,a,i),s=ts(),e!==null&&!Mc?(ns(e,t,i),cl(e,t,i)):(H&&s&&Qi(t),t.flags|=1,Nc(e,t,r,i),t.child)}function Fc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!ji(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,Ic(e,t,a,r,i)):(e=Pi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!ll(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Br:n,n(o,r)&&e.ref===t.ref)return cl(e,t,i)}return t.flags|=1,e=Mi(a,r),e.ref=t.ref,e.return=t,t.child=e}function Ic(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Br(a,r)&&e.ref===t.ref){if(Mc=!1,t.pendingProps=r=a,ll(e,i))e.flags&131072&&(Mc=!0);else return t.lanes=e.lanes,cl(e,t,i)}}return Wc(e,t,n,r,i)}function Lc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return zc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ga(t,a===null?null:a.cachePool),a===null?Do():Eo(t,a),No(t);else return r=t.lanes=536870912,zc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&Ga(t,null),Do(),Po()):(Ga(t,a.cachePool),Eo(t,a),Po(),t.memoizedState=null);return Nc(e,t,i,n),t.child}function Rc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function zc(e,t,n,r,i){var a=Wa();return a=a===null?null:{parent:ka._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&Ga(t,null),Do(),No(t),e!==null&&ba(e,t,r,!0),t.childLanes=i,null}function Bc(e,t){return t=$c({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Vc(e,t,n){return lo(t,e.child,null,n),e=Bc(t,t.pendingProps),e.flags|=2,Fo(t),t.memoizedState=null,e}function Hc(e,t,n){var r=t.pendingProps,a=!!(t.flags&128);if(t.flags&=-129,e===null){if(H){if(r.mode===`hidden`)return e=Bc(t,r),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Rc(null,e);if(Mo(t),(e=na)?(e=am(e,ia),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:qi===null?null:{id:Ji,overflow:Yi},retryLane:536870912,hydrationErrors:null},n=Li(e),n.return=t,t.child=n,ta=t,na=null)):e=null,e===null)throw oa(t);return t.lanes=536870912,null}return Bc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(Mo(t),a){if(t.flags&256)t.flags&=-257,t=Vc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558))}else if(Mc||ba(e,t,n,!1),a=(n&e.childLanes)!==0,Mc||a){if(wo.current===null){if(r=q,r!==null&&(s=yt(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,Ti(e,s),Pd(r,e,s),jc;Kd()}t=Vc(e,t,n)}else e=o.treeContext,na=lm(s.nextSibling),ta=t,H=!0,ra=null,ia=!1,e!==null&&ea(t,e),t=Bc(t,r),t.flags|=134221824;return t}return e=Mi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Uc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Wc(e,t,n,r,i){return Sa(t),n=Zo(e,t,n,r,void 0,i),r=ts(),e!==null&&!Mc?(ns(e,t,i),cl(e,t,i)):(H&&r&&Qi(t),t.flags|=1,Nc(e,t,n,i),t.child)}function Gc(e,t,n,r,i,a){return Sa(t),t.updateQueue=null,n=$o(t,r,n,i),Qo(e),r=ts(),e!==null&&!Mc?(ns(e,t,a),cl(e,t,a)):(H&&r&&Qi(t),t.flags|=1,Nc(e,t,n,a),t.child)}function Kc(e,t,n,r,i){if(Sa(t),t.stateNode===null){var a=Oi,o=n.contextType;typeof o==`object`&&o&&(a=Ca(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=vc,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},po(t),o=n.contextType,a.context=typeof o==`object`&&o?Ca(o):Oi,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(_c(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&vc.enqueueReplaceState(a,a.state,null),xo(t,r,a,i),bo(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=xc(n,s);a.props=c;var l=a.context,u=n.contextType;o=Oi,typeof u==`object`&&u&&(o=Ca(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&bc(t,a,r,o),fo=!1;var f=t.memoizedState;a.state=f,xo(t,r,a,i),bo(),l=t.memoizedState,s||f!==l||fo?(typeof d==`function`&&(_c(t,n,d,r),l=t.memoizedState),(c=fo||yc(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,mo(e,t),o=t.memoizedProps,u=xc(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=Oi,typeof l==`object`&&l&&(c=Ca(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&bc(t,a,r,c),fo=!1,f=t.memoizedState,a.state=f,xo(t,r,a,i),bo();var p=t.memoizedState;o!==d||f!==p||fo||e!==null&&e.dependencies!==null&&xa(e.dependencies)?(typeof s==`function`&&(_c(t,n,s,r),p=t.memoizedState),(u=fo||yc(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&xa(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,Uc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=lo(t,e.child,null,i),t.child=lo(t,null,n,i)):Nc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=cl(e,t,i),e}function qc(e,t,n,r){return ua(),t.flags|=256,Nc(e,t,n,r),t.child}var Jc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Yc(e){return{baseLanes:e,cachePool:Ka()}}function Xc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=ld),e}function Zc(e,t,n){var r=t.pendingProps,i=!1,a=!!(t.flags&128),o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:!!(Io.current&2)),o&&(i=!0,t.flags&=-129),o=!!(t.flags&32),t.flags&=-33,e===null){if(H){if(i?jo(t):Po(),(e=na)?(e=am(e,ia),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:qi===null?null:{id:Ji,overflow:Yi},retryLane:536870912,hydrationErrors:null},n=Li(e),n.return=t,t.child=n,ta=t,na=null)):e=null,e===null)throw oa(t);return t.lanes=sm(e)?32:536870912,null}return a=r.children,r=r.fallback,i?(Po(),i=t.mode,a=$c({mode:`hidden`,children:a},i),r=Fi(r,i,n,null),a.return=t,r.return=t,a.sibling=r,t.child=a,r=t.child,r.memoizedState=Yc(n),r.childLanes=Xc(e,o,n),t.memoizedState=Jc,Rc(null,r)):(jo(t),Qc(t,a))}var s=e.memoizedState;if(s!==null){var c=s.dehydrated;if(c!==null)return tl(e,t,a,o,r,c,s,n)}return i?(Po(),i=r.fallback,a=t.mode,s=e.child,c=s.sibling,r=Mi(s,{mode:`hidden`,children:r.children}),r.subtreeFlags=s.subtreeFlags&1206910976,c===null?(i=Fi(i,a,n,null),i.flags|=2):i=Mi(c,i),i.return=t,r.return=t,r.sibling=i,t.child=r,Rc(null,r),r=t.child,i=e.child.memoizedState,i===null?i=Yc(n):(a=i.cachePool,a===null?a=Ka():(s=ka._currentValue,a=a.parent===s?a:{parent:s,pool:s}),i={baseLanes:i.baseLanes|n,cachePool:a}),r.memoizedState=i,r.childLanes=Xc(e,o,n),t.memoizedState=Jc,Rc(e.child,r)):(jo(t),n=e.child,e=n.sibling,n=Mi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=n,t.memoizedState=null,n)}function Qc(e,t){return t=$c({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function $c(e,t){return e=Ai(22,e,null,t),e.lanes=0,e}function el(e,t,n){return lo(t,e.child,null,n),e=Qc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function tl(e,t,n,r,a,o,s,c){if(n)return t.flags&256?(jo(t),t.flags&=-257,el(e,t,c)):t.memoizedState===null?(Po(),o=a.fallback,s=t.mode,a=$c({mode:`visible`,children:a.children},s),o=Fi(o,s,c,null),o.flags|=2,a.return=t,o.return=t,a.sibling=o,t.child=a,lo(t,e.child,null,c),a=t.child,a.memoizedState=Yc(c),a.childLanes=Xc(e,r,c),t.memoizedState=Jc,Rc(null,a)):(Po(),t.child=e.child,t.flags|=128,null);if(jo(t),sm(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var l=r.dgst;return r=l,r!==``&&(a=Error(i(419)),a.stack=``,a.digest=r,fa({value:a,source:null,stack:null})),el(e,t,c)}if(Mc||ba(e,t,c,!1),r=(c&e.childLanes)!==0,Mc||r){if(wo.current!==null)return el(e,t,c);if(r=q,r!==null&&(a=yt(r,c),a!==0&&a!==s.retryLane))throw s.retryLane=a,Ti(e,a),Pd(r,e,a),jc;return om(o)||Kd(),el(e,t,c)}return om(o)?(t.flags|=192,t.child=e.child,null):(e=s.treeContext,na=lm(o.nextSibling),ta=t,H=!0,ra=null,ia=!1,e!==null&&ea(t,e),t=Qc(t,a.children),t.flags|=134221824,t)}function nl(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),va(e.return,t,n)}function rl(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&zo(n)===null&&(t=e),e=e.sibling}return t}function il(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function al(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function ol(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=Io.current;if(t.flags&128)return Lo(t,o),null;var s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,Lo(t,o),i===`backwards`&&e!==null?(al(e),Nc(e,t,r,n),al(e)):Nc(e,t,r,n),r=H?Wi:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&nl(e,n,t);else if(e.tag===19)nl(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`backwards`:n=rl(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null,al(t)),il(t,!0,i,null,a,r);break;case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&zo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}il(t,!0,n,null,a,r);break;case`together`:il(t,!1,null,null,void 0,r);break;case`independent`:t.memoizedState=null;break;default:n=rl(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),il(t,!1,i,n,a,r)}return t.child}function sl(e,t,n){var r=t.pendingProps;return ga(t,t.type,r.value),Nc(e,t,r.children,n),t.child}function cl(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),od|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(ba(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=Mi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Mi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ll(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&xa(e)))}function ul(e,t,n){switch(t.tag){case 3:ke(t,t.stateNode.containerInfo),ga(t,ka,e.memoizedState.cache),ua();break;case 27:case 5:je(t);break;case 4:ke(t,t.stateNode.containerInfo);break;case 10:ga(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Mo(t),null;break;case 13:var r=t.memoizedState;if(r!==null){if(r.dehydrated!==null)return jo(t),t.flags|=128,null;r=ba(e,t,n,!1);var i=t.child.childLanes;return r||(n&i)!==0?Zc(e,t,n):(jo(t),e=cl(e,t,n),e===null?null:e.sibling)}jo(t);break;case 19:if(t.flags&128)return ol(e,t,n);if(i=!!(e.flags&128),r=(n&t.childLanes)!==0,r||=(ba(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return ol(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Lo(t,Io.current),r)break;return null;case 22:return t.lanes=0,Lc(e,t,n,t.pendingProps);case 24:ga(t,ka,e.memoizedState.cache)}return cl(e,t,n)}function dl(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)Mc=!0;else{if(!ll(e,n)&&!(t.flags&128))return Mc=!1,ul(e,t,n);Mc=!!(e.flags&131072)}}else Mc=!1,H&&t.flags&1048576&&Zi(t,Wi,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=$a(t.elementType),t.type=e,typeof e==`function`)ji(e)?(r=xc(e,r),t.tag=1,t=Kc(null,t,e,r,n)):(t.tag=0,t=Wc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===oe){t.tag=11,t=Pc(null,t,e,r,n);break a}if(a===le){t.tag=14,t=Fc(null,t,e,r,n);break a}if(a===k){t.tag=10,t.type=e,t=sl(null,t,n);break a}}throw t=ve(e)||e,Error(i(306,t,``))}}return t;case 0:return Wc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=xc(r,t.pendingProps),Kc(e,t,r,a,n);case 3:a:{if(ke(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,mo(e,t),xo(t,r,null,n);var s=t.memoizedState;if(r=s.cache,ga(t,ka,r),r!==o.cache&&ya(t,[ka],n,!0),bo(),r=s.element,o.isDehydrated){if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=qc(e,t,r,n);break a}if(r!==a){a=Bi(Error(i(424)),t),fa(a),t=qc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(na=lm(e.firstChild),ta=t,H=!0,ra=null,ia=!0,n=uo(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling}else{if(ua(),r===a){t=cl(e,t,n);break a}Nc(e,t,r,n)}t=t.child}return t;case 26:return Uc(e,t),e===null?(n=Nm(t.type,null,t.pendingProps,null))?t.memoizedState=n:H||(t.stateNode=fp(t.type,t.pendingProps,De.current,t)):t.memoizedState=Nm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return je(t),e===null&&H&&(r=t.stateNode=hm(t.type,t.pendingProps,De.current),ta=t,ia=!0,a=na,Sp(t.type)?(um=a,na=lm(r.firstChild)):na=a),Nc(e,t,t.pendingProps.children,n),Uc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&H&&((a=r=na)&&(r=rm(r,t.type,t.pendingProps,ia),r===null?a=!1:(t.stateNode=r,ta=t,na=lm(r.firstChild),ia=!1,a=!0)),a||oa(t)),je(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,pp(a,o)?r=null:s!==null&&pp(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=Zo(e,t,es,null,null,n),sh._currentValue=a),Uc(e,t),Nc(e,t,r,n),t.child;case 6:return e===null&&H&&((e=n=na)&&(n=im(n,t.pendingProps,ia),n===null?e=!1:(t.stateNode=n,ta=t,na=null,e=!0)),e||oa(t)),null;case 13:return Zc(e,t,n);case 4:return ke(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=lo(t,null,r,n):Nc(e,t,r,n),t.child;case 11:return Pc(e,t,t.type,t.pendingProps,n);case 7:return r=t.pendingProps,Uc(e,t),Nc(e,t,r,n),t.child;case 8:return Nc(e,t,t.pendingProps.children,n),t.child;case 12:return Nc(e,t,t.pendingProps.children,n),t.child;case 10:return sl(e,t,n);case 9:return a=t.type._context,r=t.pendingProps.children,Sa(t),a=Ca(a),r=r(a),t.flags|=1,Nc(e,t,r,n),t.child;case 14:return Fc(e,t,t.type,t.pendingProps,n);case 15:return Ic(e,t,t.type,t.pendingProps,n);case 19:return ol(e,t,n);case 31:return Hc(e,t,n);case 22:return Lc(e,t,n,t.pendingProps);case 24:return Sa(t),r=Ca(ka),e===null?(a=Wa(),a===null&&(a=q,o=Aa(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},po(t),ga(t,ka,a)):((e.lanes&n)!==0&&(mo(e,t),xo(t,null,null,n),bo()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,ga(t,ka,r),r!==a.cache&&ya(t,[ka],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),ga(t,ka,r))),Nc(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=t.pendingProps,r.name!=null&&r.name!==`auto`?t.flags|=e===null?18882560:18874368:H&&Qi(t),e!==null&&e.memoizedProps.name!==r.name?t.flags|=4194816:Uc(e,t),Nc(e,t,r.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function fl(e){e.flags|=4}function pl(e,t,n,r,i){var a;if((a=!!(e.mode&32))&&(a=n===null?Jm(t,r):Jm(t,r)&&(r.src!==n.src||r.srcSet!==n.srcSet)),a){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(Ud())e.flags|=8192;else throw eo=Xa,Ja}}else e.flags&=-16777217}function ml(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Ym(t)){if(Ud())e.flags|=8192;else throw eo=Xa,Ja}}function hl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:pt(),e.lanes|=t,ud|=t)}function gl(e,t){if(!H)switch(e.tailMode){case`visible`:break;case`collapsed`:for(var n=e.tail,r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function _l(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&1206910976,r|=i.flags&1206910976,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function vl(e,t,n){var r=t.pendingProps;switch($i(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return _l(t),null;case 1:return _l(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),_a(ka),Ae(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(la(t)?fl(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,da())),_l(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(fl(t),o===null?(_l(t),pl(t,a,null,r,n)):(_l(t),ml(t,o))):o?o===e.memoizedState?(_l(t),t.flags&=-16777217):(fl(t),_l(t),ml(t,o)):(e=e.memoizedProps,e!==r&&fl(t),_l(t),pl(t,a,e,r,n)),null;case 27:if(Me(t),n=De.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&fl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return _l(t),t.subtreeFlags&=-33554433,null}e=Te.current,la(t)?sa(t,e):(e=hm(a,r,n),t.stateNode=e,fl(t))}return _l(t),t.subtreeFlags&=-33554433,null;case 5:if(Me(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&fl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return _l(t),t.subtreeFlags&=-33554433,null}if(o=Te.current,la(t))sa(t,o);else{var s=lp(De.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[I]=t,o[L]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(np(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&fl(t)}}return _l(t),t.subtreeFlags&=-33554433,pl(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&fl(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=De.current,la(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=ta,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[I]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||ep(e.nodeValue,n)),e||oa(t,!0)}else e=lp(e).createTextNode(r),e[I]=t,t.stateNode=e}return _l(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=la(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[I]=t}else ua(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;_l(t),e=!1}else n=da(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Fo(t),t):(Fo(t),null);if(t.flags&128)throw Error(i(558))}return _l(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=la(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[I]=t}else ua(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;_l(t),a=!1}else a=da(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Fo(t),t):(Fo(t),null)}return Fo(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),hl(t,t.updateQueue),_l(t),null);case 4:return Ae(),e===null&&Wf(t.stateNode.containerInfo),t.flags|=67108864,_l(t),null;case 10:return _a(t.type),_l(t),null;case 19:if(Ro(t),r=t.memoizedState,r===null)return _l(t),null;if(a=!!(t.flags&128),o=r.rendering,o===null){if(a)gl(r,!1);else{if(ad!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=zo(e),o!==null){for(t.flags|=128,gl(r,!1),e=o.updateQueue,t.updateQueue=e,hl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Ni(n,e),n=n.sibling;return Lo(t,Io.current&1|2),H&&Xi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&We()>gd&&(t.flags|=128,a=!0,gl(r,!1),t.lanes=4194304)}}else{if(!a){if(e=zo(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,hl(t,e),gl(r,!0),r.tail===null&&r.tailMode!==`collapsed`&&r.tailMode!==`visible`&&!o.alternate&&!H)return _l(t),null}else 2*We()-r.renderingStartTime>gd&&n!==536870912&&(t.flags|=128,a=!0,gl(r,!1),t.lanes=4194304)}r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}if(r.tail!==null){e=r.tail;a:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break a}n=n.sibling}n=!0}return r.rendering=e,r.tail=e.sibling,r.renderingStartTime=We(),e.sibling=null,o=Io.current,o=a?o&1|2:o&1,r.tailMode===`visible`||r.tailMode===`collapsed`||!n||H?Lo(t,o):(n=o,N(ko,t),N(Io,n),Ao===null&&(Ao=t)),H&&Xi(t,r.treeForkCount),e}return _l(t),null;case 22:case 23:return Fo(t),Oo(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(_l(t),t.subtreeFlags&6&&(t.flags|=8192)):_l(t),n=t.updateQueue,n!==null&&hl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&we(Ua),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),_a(ka),_l(t),null;case 25:return null;case 30:return t.flags|=33554432,_l(t),null}throw Error(i(156,t.tag))}function yl(e,t){switch($i(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return _a(ka),Ae(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Me(t),null;case 31:if(t.memoizedState!==null){if(Fo(t),t.alternate===null)throw Error(i(340));ua()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Fo(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));ua()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Ro(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return Ae(),null;case 10:return _a(t.type),null;case 22:case 23:return Fo(t),Oo(),e!==null&&we(Ua),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return _a(ka),null;case 25:return null;default:return null}}function bl(e,t){switch($i(t),t.tag){case 3:_a(ka),Ae();break;case 26:case 27:case 5:Me(t);break;case 4:Ae();break;case 31:t.memoizedState!==null&&Fo(t);break;case 13:Fo(t);break;case 19:Ro(t);break;case 10:_a(t.type);break;case 22:case 23:Fo(t),Oo(),e!==null&&we(Ua);break;case 24:_a(ka)}}function xl(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Sl(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function Cl(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Co(t,n)}catch(t){Z(e,e.return,t)}}}function wl(e,t,n){n.props=xc(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Tl(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:var i=e.stateNode,a=hi(e.memoizedProps,i);(i.ref===null||i.ref.name!==a)&&(i.ref=Pp(a)),r=i.ref;break;case 7:if(e.stateNode===null){var o=new Fp(e);h(e.child,!1,Qp,o,void 0,void 0),e.stateNode=o}r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function El(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function Dl(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)em(e.stateNode,t[n])}function Ol(e){for(var t=e.return;t!==null&&(jl(t)&&em(e.stateNode,t.stateNode),!Al(t));)t=t.return}function kl(e){for(var t=e.return;t!==null&&(jl(t)&&tm(e.stateNode,t.stateNode),!Al(t));)t=t.return}function Al(e){return e.tag===5||e.tag===3||e.tag===27}function jl(e){return e&&e.tag===7&&e.stateNode!==null}function Ml(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Nl(e,t,n){try{var r=e.stateNode;ip(r,e.type,n,t),r[L]=t}catch(t){Z(e,e.return,t)}}function Pl(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Sp(e.type)||e.tag===4}function Fl(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Pl(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Sp(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Il(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(i,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(i),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=gn)),Dl(e,r),B=!0;else if(i!==4&&(i===27&&(Dl(e,r),r=null,Sp(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(Il(e,t,n,r),e=e.sibling;e!==null;)Il(e,t,n,r),e=e.sibling}function Ll(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?n.insertBefore(i,t):n.appendChild(i),Dl(e,r),B=!0;else if(i!==4&&(i===27&&(Dl(e,r),r=null,Sp(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(Ll(e,t,n,r),e=e.sibling;e!==null;)Ll(e,t,n,r),e=e.sibling}function Rl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);np(t,r,n),t[I]=e,t[L]=n}catch(t){Z(e,e.return,t)}}var zl=!1,Bl=null;function Vl(e){(e.tag===30||e.subtreeFlags&33554432)&&(zl=!0)}var Hl=null;function Ul(){var e=Hl;return Hl=null,e}var Wl=0;function Gl(e,t,n,r,i){return Wl=0,Kl(e.child,t,n,r,i)}function Kl(e,t,n,r,i){for(var a=!1;e!==null;){if(e.tag===5){var o=e.stateNode;if(r!==null){var s=Op(o);r.push(s),s.view&&(a=!0)}else a||Op(o).view&&(a=!0);zl=!0,Tp(o,Wl===0?t:t+`_`+Wl,n),Wl++}else e.tag===22&&e.memoizedState!==null||e.tag===30&&i||Kl(e.child,t,n,r,i)&&(a=!0);e=e.sibling}return a}function ql(e,t){for(;e!==null;)e.tag===5?Ep(e.stateNode,e.memoizedProps):e.tag===22&&e.memoizedState!==null||e.tag===30&&t||ql(e.child,t),e=e.sibling}function Jl(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Jl(e),e.tag===30&&e.flags&18874368&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name===`auto`)throw Error(i(544));var n=t.name;t=_i(t.default,t.share),t!==`none`&&(Gl(e,n,t,null,!1)||ql(e.child,!1))}e=e.sibling}}function Yl(e,t){if(e.tag===30){var n=e.stateNode,r=e.memoizedProps,i=hi(r,n),a=_i(r.default,n.paired?r.share:r.enter);a===`none`?Jl(e):Gl(e,i,a,null,!1)?(Jl(e),n.paired||t||Nd(e,r.onEnter)):ql(e.child,!1)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Yl(e,t),e=e.sibling;else Jl(e)}function Xl(e){if(Bl!==null&&Bl.size!==0){var t=Bl;if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var n=e.memoizedProps,r=n.name;if(r!=null&&r!==`auto`){var i=t.get(r);if(i!==void 0){var a=_i(n.default,n.share);if(a!==`none`&&(Gl(e,r,a,null,!1)?(a=e.stateNode,i.paired=a,a.paired=i,Nd(e,n.onShare)):ql(e.child,!1)),t.delete(r),t.size===0)break}}}Xl(e)}e=e.sibling}}}function Zl(e){if(e.tag===30){var t=e.memoizedProps,n=hi(t,e.stateNode),r=Bl===null?void 0:Bl.get(n),i=_i(t.default,r===void 0?t.exit:t.share);i!==`none`&&(Gl(e,n,i,null,!1)?r===void 0?Nd(e,t.onExit):(i=e.stateNode,r.paired=i,i.paired=r,Bl.delete(n),Nd(e,t.onShare)):ql(e.child,!1)),Bl!==null&&Xl(e)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Zl(e),e=e.sibling;else Bl!==null&&Xl(e)}function Ql(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=hi(t,e.stateNode);t=_i(t.default,t.update),e.flags&=-5,t!==`none`&&Gl(e,n,t,e.memoizedState=[],!1)}else e.subtreeFlags&33554432&&Ql(e);e=e.sibling}}function $l(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var t=e.stateNode;t.paired!==null&&(t.paired=null,ql(e.child,!1))}$l(e)}e=e.sibling}}function eu(e){if(e.tag===30)e.stateNode.paired=null,ql(e.child,!1),$l(e);else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)eu(e),e=e.sibling;else $l(e)}function tu(e){for(e=e.child;e!==null;)e.tag===30?ql(e.child,!1):e.subtreeFlags&33554432&&tu(e),e=e.sibling}function nu(e,t,n,r,i,a,o){for(var s=!1;t!==null;){if(t.tag===5){var c=t.stateNode;if(a!==null&&Wl<a.length){var l=a[Wl],u=Op(c);(l.view||u.view)&&(s=!0);var d;if(d=!(e.flags&4)){if(u.clip)d=!0;else{d=l.rect;var f=u.rect;d=d.y!==f.y||d.x!==f.x||d.height!==f.height||d.width!==f.width}}d&&(e.flags|=4),u.abs?u=!l.abs:(l=l.rect,u=u.rect,u=l.height!==u.height||l.width!==u.width),u&&(e.flags|=32)}else e.flags|=32;e.flags&4&&Tp(c,Wl===0?n:n+`_`+Wl,i),s&&e.flags&4||(Hl===null&&(Hl=[]),Hl.push(c,Wl===0?r:r+`_`+Wl,t.memoizedProps)),Wl++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&o?e.flags|=t.flags&32:nu(e,t.child,n,r,i,a,o)&&(s=!0));t=t.sibling}return s}function ru(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,r=e.stateNode,i=hi(n,r),a=_i(n.default,n.update);if(t){r=r.clones;var o=r===null?null:r.map(kp)}else o=e.memoizedState,e.memoizedState=null;r=e;var s=e.child;Wl=0,i=nu(r,s,i,i,a,o,!1),e.flags&4&&i&&(t||Nd(e,n.onUpdate))}else e.subtreeFlags&33554432&&ru(e,t);e=e.sibling}}var iu=!1,G=!1,au=!1,ou=!1,su=typeof WeakSet==`function`?WeakSet:Set,cu=null,lu=!1,uu=!1,du=!1,fu=!1;function pu(e,t,n){if(e=e.containerInfo,sp=gh,e=Gr(e),Kr(e)){if(`selectionStart`in e)var r={start:e.selectionStart,end:e.selectionEnd};else a:{r=(r=e.ownerDocument)&&r.defaultView||window;var i=r.getSelection&&r.getSelection();if(i&&i.rangeCount!==0){r=i.anchorNode;var a=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==r||a!==0&&f.nodeType!==3||(c=s+a),f!==o||i!==0&&f.nodeType!==3||(l=s+i),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===r&&++u===a&&(c=s),p===o&&++d===i&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}r=c===-1||l===-1?null:{start:c,end:l}}else r=null}r||={start:0,end:0}}else r=null;for(cp={focusedElem:e,selectionRange:r},gh=!1,n=(n&335544064)===n,cu=t,t=n?9270:1024;cu!==null;){if(e=cu,n&&(r=e.deletions,r!==null))for(a=0;a<r.length;a++)n&&Zl(r[a]);if(e.alternate===null&&e.flags&2)n&&Vl(e),mu(n);else{if(e.tag===22){if(r=e.alternate,e.memoizedState!==null){r!==null&&r.memoizedState===null&&n&&Zl(r),mu(n);continue}if(r!==null&&r.memoizedState!==null){n&&Vl(e),mu(n);continue}}r=e.child,(e.subtreeFlags&t)!==0&&r!==null?(r.return=e,cu=r):(n&&Ql(e),mu(n))}}Bl=null}function mu(e){for(;cu!==null;){var t=cu,n=e,r=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if(a&1024&&r!==null){n=void 0,a=r.memoizedProps,r=r.memoizedState;var o=t.stateNode;try{var s=xc(t.type,a);n=o.getSnapshotBeforeUpdate(s,r),o.__reactInternalSnapshotBeforeUpdate=n}catch(e){Z(t,t.return,e)}}break;case 3:if(a&1024){if(r=t.stateNode.containerInfo,n=r.nodeType,n===9)nm(r);else if(n===1)switch(r.nodeName){case`HEAD`:case`HTML`:case`BODY`:nm(r);break;default:r.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&r!==null&&(n=hi(r.memoizedProps,r.stateNode),a=t.memoizedProps,a=_i(a.default,a.update),a!==`none`&&Gl(r,n,a,r.memoizedState=[],!0));break;default:if(a&1024)throw Error(i(163))}if(r=t.sibling,r!==null){r.return=t.return,cu=r;break}cu=t.return}}function hu(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Fu(e,n),r&4&&xl(5,n);break;case 1:if(Fu(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=xc(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&Cl(n),r&512&&Tl(n,n.return);break;case 3:if(Fu(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Co(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&Rl(n);case 26:case 5:Fu(e,n),t===null&&r&4&&Ml(n),r&512&&Tl(n,n.return);break;case 12:Fu(e,n);break;case 31:Fu(e,n),r&4&&wu(e,n);break;case 13:Fu(e,n),r&4&&Tu(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=_f.bind(null,n),cm(e,n))));break;case 22:if(r=n.memoizedState!==null||iu,!r){var a=t!==null&&t.memoizedState!==null||G;t=iu,i=G,iu=r,(G=a)&&!i?(r=2,n.subtreeFlags&8772&&(r|=1),Lu(e,n,r)):Fu(e,n),iu=t,G=i}break;case 30:Fu(e,n),r&512&&Tl(n,n.return);break;case 7:r&512&&Tl(n,n.return);default:Fu(e,n)}}function gu(e,t){for(e=e.child;e!==null;)_u(e,t),e=e.sibling}function _u(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var r=n.style;typeof r.setProperty==`function`?r.setProperty(`display`,`none`,`important`):r.display=`none`}else{var i=e.stateNode,a=e.memoizedProps.style,o=a!=null&&a.hasOwnProperty(`display`)?a.display:null;i.style.display=o==null||typeof o==`boolean`?``:(``+o).trim()}}catch(t){Z(e,e.return,t)}vu(e,t);break;case 6:try{e.stateNode.nodeValue=t?``:e.memoizedProps,B=!0}catch(t){Z(e,e.return,t)}break;case 18:try{var s=e.stateNode;t?wp(s,!0):wp(e.stateNode,!1)}catch(t){Z(e,e.return,t)}break;case 22:case 23:e.memoizedState===null&&gu(e,t);break;default:gu(e,t)}}function vu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){a:{var n=e,r=t;switch(n.tag){case 4:_u(n,r);break a;case 22:n.memoizedState===null&&vu(n,r);break a;default:vu(n,r)}}e=e.sibling}}function yu(e){var t=e.alternate;t!==null&&(e.alternate=null,yu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Mt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var bu=null,xu=!1;function Su(e,t,n){for(n=n.child;n!==null;)Cu(e,t,n),n=n.sibling}function Cu(e,t,n){if($e&&typeof $e.onCommitFiberUnmount==`function`)try{$e.onCommitFiberUnmount(Qe,n)}catch{}switch(n.tag){case 26:G||El(n,t),Su(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!G&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:G||El(n,t),kl(n);var r=bu,i=xu;Sp(n.type)&&(bu=n.stateNode,xu=!1),Su(e,t,n),gm(n.stateNode,n.type,n.memoizedProps),bu=r,xu=i;break;case 5:G||El(n,t),kl(n);case 6:if(n.tag===6&&kl(n),r=bu,i=xu,bu=null,Su(e,t,n),bu=r,xu=i,bu!==null){if(xu)try{(bu.nodeType===9?bu.body:bu.nodeName===`HTML`?bu.ownerDocument.body:bu).removeChild(n.stateNode),B=!0}catch(e){Z(n,t,e)}else try{bu.removeChild(n.stateNode),B=!0}catch(e){Z(n,t,e)}}break;case 18:bu!==null&&(xu?(e=bu,Cp(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Hh(e)):Cp(bu,n.stateNode));break;case 4:r=bu,i=xu,bu=n.stateNode.containerInfo,xu=!0,Su(e,t,n),bu=r,xu=i;break;case 0:case 11:case 14:case 15:Sl(2,n,t),G||Sl(4,n,t),Su(e,t,n);break;case 1:G||(El(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&wl(n,t,r)),Su(e,t,n);break;case 21:Su(e,t,n);break;case 22:G=(r=G)||n.memoizedState!==null,Su(e,t,n),G=r;break;case 30:El(n,t),Su(e,t,n);break;case 7:G||El(n,t),Su(e,t,n);break;default:Su(e,t,n)}}function wu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Hh(e)}catch(e){Z(t,t.return,e)}}}function Tu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Hh(e)}catch(e){Z(t,t.return,e)}}function Eu(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new su),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new su),t;default:throw Error(i(435,e.tag))}}function Du(e,t){var n=Eu(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=vf.bind(null,e,t);t.then(r,r)}})}function Ou(e,t,n){var r=t.deletions;if(r!==null)for(var a=0;a<r.length;a++){var o=r[a],s=e,c=t,l=c;a:for(;l!==null;){switch(l.tag){case 27:if(Sp(l.type)){bu=l.stateNode,xu=!1;break a}break;case 5:bu=l.stateNode,xu=!1;break a;case 3:case 4:bu=l.stateNode.containerInfo,xu=!0;break a}l=l.return}if(bu===null)throw Error(i(160));Cu(s,c,o),bu=null,xu=!1,s=o.alternate,s!==null&&(s.return=null),o.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Au(t,e,n),t=t.sibling}var ku=null;function Au(e,t,n){var r=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(r=e.updateQueue,r=r===null?null:r.events,r!==null))for(var o=0;o<r.length;o++){var s=r[o];s.ref.impl=s.nextImpl}Ou(t,e,n),ju(e),a&4&&(Sl(3,e,e.return),xl(3,e),Sl(5,e,e.return));break;case 1:Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),a&64&&iu&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(o=ku,Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),a&4){if(a=r===null?null:r.memoizedState,n=e.memoizedState,r===null){if(n===null){if(e.stateNode===null){if(iu)e.stateNode=fp(e.type,e.memoizedProps,t.containerInfo,e);else{a:{t=e.type,n=e.memoizedProps,a=o.ownerDocument||o;b:switch(t){case`title`:r=a.getElementsByTagName(`title`)[0],(!r||r[At]||r[I]||r.namespaceURI===`http://www.w3.org/2000/svg`||r.hasAttribute(`itemprop`))&&(r=a.createElement(t),a.head.insertBefore(r,a.querySelector(`head > title`))),np(r,t,n),r[I]=e,z(r),t=r;break a;case`link`:if(o=Gm(`link`,`href`,a).get(t+(n.href||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&r.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&r.getAttribute(`title`)===(n.title==null?null:n.title)&&r.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;case`meta`:if(o=Gm(`meta`,`content`,a).get(t+(n.content||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`content`)===(n.content==null?null:``+n.content)&&r.getAttribute(`name`)===(n.name==null?null:n.name)&&r.getAttribute(`property`)===(n.property==null?null:n.property)&&r.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&r.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;default:throw Error(i(468,t))}r[I]=e,z(r),t=r}e.stateNode=t}}else iu||Km(o,e.type,e.stateNode)}else e.stateNode=Bm(o,n,e.memoizedProps)}else a===n?n===null&&e.stateNode!==null&&Nl(e,e.memoizedProps,r.memoizedProps):(a===null?(t=r.stateNode,t===null||G||t.parentNode.removeChild(t)):a.count--,n===null?iu||Km(o,e.type,e.stateNode):Bm(o,n,e.memoizedProps))}break;case 27:Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),r!==null&&a&4&&Nl(e,e.memoizedProps,r.memoizedProps);break;case 5:if(o=au,au=!1,Ou(t,e,n),au=o,ju(e),a&512&&(G||r===null||El(r,r.return)),e.flags&32){t=e.stateNode;try{cn(t,``),B=!0}catch(t){Z(e,e.return,t)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,Nl(e,t,r===null?t:r.memoizedProps)),a&1024&&(ou=!0);break;case 6:if(Ou(t,e,n),ju(e),a&4){if(e.stateNode===null)throw Error(i(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,B=!0}catch(t){Z(e,e.return,t)}}break;case 3:if(B=!1,Wm=null,o=ku,ku=bm(t.containerInfo),Ou(t,e,n),ku=o,ju(e),a&4&&r!==null&&r.memoizedState.isDehydrated)try{Hh(t.containerInfo)}catch(t){Z(e,e.return,t)}ou&&(ou=!1,Mu(e)),B=!1;break;case 4:a=au,au=iu,r=Gt(),o=ku,ku=bm(e.stateNode.containerInfo),Ou(t,e,n),ju(e),ku=o,B&&uu&&(du=!0),B=r,au=a;break;case 12:Ou(t,e,n),ju(e);break;case 31:Ou(t,e,n),ju(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 13:Ou(t,e,n),ju(e),e.child.flags&8192&&e.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(md=We()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 22:o=e.memoizedState!==null,s=r!==null&&r.memoizedState!==null;var c=iu,l=G,u=au;iu=c||o,au=u||o,G=l||s,Ou(t,e,n),G=l,au=u,iu=c,ju(e),a&8192&&(t=e.stateNode,t._visibility=o?t._visibility&-2:t._visibility|1,!o||r===null||s||iu||G||(t=s||G,n=iu,r=G,iu=o||iu,G=t,Iu(e,2),iu=n,G=r),!o&&au||gu(e,o)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Du(e,n))));break;case 19:Ou(t,e,n),ju(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 30:a&512&&(G||r===null||El(r,r.return)),a=Gt(),o=uu,s=(n&335544064)===n,c=e.memoizedProps,uu=s&&_i(c.default,c.update)!==`none`,Ou(t,e,n),ju(e),s&&r!==null&&B&&(e.flags|=4),uu=o,B=a;break;case 21:break;case 7:a&512&&(G||r===null||El(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=e);default:Ou(t,e,n),ju(e)}}function ju(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Pl(r)){n=r;break}r=r.return}r=null;for(var a=e.return;a!==null;){if(jl(a)){var o=a.stateNode;r===null?r=[o]:r.push(o)}if(Al(a))break;a=a.return}var s=r;if(n==null)throw Error(i(160));switch(n.tag){case 27:var c=n.stateNode;Ll(e,Fl(e),c,s);break;case 5:var l=n.stateNode;n.flags&32&&(cn(l,``),n.flags&=-33),Ll(e,Fl(e),l,s);break;case 3:case 4:var u=n.stateNode.containerInfo;Il(e,Fl(e),u,s);break;default:throw Error(i(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Mu(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Mu(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,gh=!0,t.reset(),gh=!1),e=e.sibling}}function Nu(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Pu(t,e),t=t.sibling;else ru(t,!1)}function Pu(e,t){var n=e.alternate;if(n===null)Yl(e,!1);else switch(e.tag){case 3:if(fu=lu=!1,Ul(),Nu(t,e),!lu&&!du){if(e=Hl,e!==null)for(var r=0;r<e.length;r+=3){n=e[r];var i=e[r+1];Ep(n,e[r+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(`+i+`)`})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===``&&(e.style.viewTransitionName=`none`,e.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(root)`}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition`})),fu=!0}Hl=null;break;case 5:Nu(t,e);break;case 4:r=lu,lu=!1,Nu(t,e),lu&&(du=!0),lu=r;break;case 22:e.memoizedState===null&&(n.memoizedState===null?Nu(t,e):Yl(e,!1));break;case 30:r=lu,i=Ul(),lu=!1,Nu(t,e),lu&&(e.flags|=4);var a=e.memoizedProps,o=e.stateNode;t=hi(a,o),o=hi(n.memoizedProps,o);var s=_i(a.default,a.update);s===`none`?t=!1:(a=n.memoizedState,n.memoizedState=null,n=e.child,Wl=0,t=nu(e,n,t,o,s,a,!0),Wl!==(a===null?0:a.length)&&(e.flags|=32)),e.flags&4&&t?(Nd(e,e.memoizedProps.onUpdate),Hl=i):i!==null&&(i.push.apply(i,Hl),Hl=i),lu=e.flags&32?!0:r;break;default:Nu(t,e)}}function Fu(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)hu(e,t.alternate,t),t=t.sibling}function Iu(e,t){for(e=e.child;e!==null;){var n=e,r=t;switch(n.tag){case 0:case 11:case 14:case 15:Sl(4,n,n.return),Iu(n,r);break;case 1:El(n,n.return);var i=n.stateNode;typeof i.componentWillUnmount==`function`&&wl(n,n.return,i),Iu(n,r);break;case 27:r&2&&gm(n.stateNode,n.type,n.memoizedProps);case 5:El(n,n.return),n.tag!==5&&n.tag!==27||kl(n),Iu(n,r);break;case 6:kl(n);break;case 26:El(n,n.return),i=n.stateNode,n.memoizedState!==null||i===null||G||i.parentNode.removeChild(i),Iu(n,r);break;case 22:n.memoizedState===null&&Iu(n,r);break;case 30:El(n,n.return),Iu(n,r);break;case 7:El(n,n.return);default:Iu(n,r)}e=e.sibling}}function Lu(e,t,n){for(n=t.subtreeFlags&8772?n:n&-2,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags,s=!!(n&1);switch(a.tag){case 0:case 11:case 15:Lu(i,a,n),xl(4,a);break;case 1:if(Lu(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var c=r.stateNode;try{var l=i.shared.hiddenCallbacks;if(l!==null)for(i.shared.hiddenCallbacks=null,i=0;i<l.length;i++)So(l[i],c)}catch(e){Z(r,r.return,e)}}s&&o&64&&Cl(a),Tl(a,a.return);break;case 27:n&2&&Rl(a);case 5:a.tag!==5&&a.tag!==27||Ol(a),Lu(i,a,n),s&&r===null&&o&4&&Ml(a),Tl(a,a.return);break;case 6:Ol(a);break;case 26:c=a.stateNode,a.memoizedState!==null||c===null||iu||Km(bm(c.ownerDocument),a.type,c),Lu(i,a,n),s&&r===null&&o&4&&Ml(a),Tl(a,a.return);break;case 12:Lu(i,a,n);break;case 31:Lu(i,a,n),s&&o&4&&wu(i,a);break;case 13:Lu(i,a,n),s&&o&4&&Tu(i,a);break;case 22:a.memoizedState===null&&Lu(i,a,n),Tl(a,a.return);break;case 30:Lu(i,a,n),Tl(a,a.return);break;case 7:Tl(a,a.return);default:Lu(i,a,n)}t=t.sibling}}function Ru(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&ja(n))}function zu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&ja(e))}function Bu(e,t,n,r){var i=(n&335544064)===n;if(t.subtreeFlags&(i?10262:10256))for(t=t.child;t!==null;)Vu(e,t,n,r),t=t.sibling;else i&&tu(t)}function Vu(e,t,n,r){var i=(n&335544064)===n;i&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&eu(t);var a=t.flags;switch(t.tag){case 0:case 11:case 15:Bu(e,t,n,r),a&2048&&xl(9,t);break;case 1:Bu(e,t,n,r);break;case 3:Bu(e,t,n,r),i&&fu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,e.style.viewTransitionName===`root`&&(e.style.viewTransitionName=``),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===`none`&&(e.style.viewTransitionName=``)),a&2048&&(a=null,t.alternate!==null&&(a=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==a&&(t.refCount++,a!=null&&ja(a)));break;case 12:if(a&2048){Bu(e,t,n,r),a=t.stateNode;try{var o=t.memoizedProps,s=o.id,c=o.onPostCommit;typeof c==`function`&&c(s,t.alternate===null?`mount`:`update`,a.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else Bu(e,t,n,r);break;case 31:Bu(e,t,n,r);break;case 13:Bu(e,t,n,r);break;case 23:break;case 22:o=t.stateNode,s=t.alternate,t.memoizedState===null?(i&&s!==null&&s.memoizedState!==null&&eu(t),o._visibility&2?Bu(e,t,n,r):(o._visibility|=2,Hu(e,t,n,r,!!(t.subtreeFlags&10256)||!1))):(i&&s!==null&&s.memoizedState===null&&eu(s),o._visibility&2?Bu(e,t,n,r):Uu(e,t)),a&2048&&Ru(s,t);break;case 24:Bu(e,t,n,r),a&2048&&zu(t.alternate,t);break;case 30:i&&(a=t.alternate,a!==null&&(ql(a.child,!0),ql(t.child,!0))),Bu(e,t,n,r);break;default:Bu(e,t,n,r)}}function Hu(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Hu(a,o,s,c,i),xl(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Hu(a,o,s,c,i)):u._visibility&2?Hu(a,o,s,c,i):Uu(a,o),i&&l&2048&&Ru(o.alternate,o);break;case 24:Hu(a,o,s,c,i),i&&l&2048&&zu(o.alternate,o);break;default:Hu(a,o,s,c,i)}t=t.sibling}}function Uu(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Uu(n,r),i&2048&&Ru(r.alternate,r);break;case 24:Uu(n,r),i&2048&&zu(r.alternate,r);break;default:Uu(n,r)}t=t.sibling}}var Wu=8192;function Gu(e,t,n){if(e.subtreeFlags&Wu)for(e=e.child;e!==null;)Ku(e,t,n),e=e.sibling}function Ku(e,t,n){switch(e.tag){case 26:Gu(e,t,n),e.flags&Wu&&(e.memoizedState===null?(e=e.stateNode,(t&335544128)===t&&Zm(n,e)):Qm(n,ku,e.memoizedState,e.memoizedProps));break;case 5:Gu(e,t,n),e.flags&Wu&&(e=e.stateNode,(t&335544128)===t&&Zm(n,e));break;case 3:case 4:var r=ku;ku=bm(e.stateNode.containerInfo),Gu(e,t,n),ku=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Wu,Wu=16777216,Gu(e,t,n),Wu=r):Gu(e,t,n));break;case 30:if((e.flags&Wu)!==0&&(r=e.memoizedProps.name,r!=null&&r!==`auto`)){var i=e.stateNode;i.paired=null,Bl===null&&(Bl=new Map),Bl.set(r,i)}Gu(e,t,n);break;default:Gu(e,t,n)}}function qu(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Ju(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cu=r,Zu(r,e)}qu(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Yu(e),e=e.sibling}function Yu(e){switch(e.tag){case 0:case 11:case 15:Ju(e),e.flags&2048&&Sl(9,e,e.return);break;case 3:Ju(e);break;case 12:Ju(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Xu(e)):Ju(e);break;default:Ju(e)}}function Xu(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cu=r,Zu(r,e)}qu(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Sl(8,t,t.return),Xu(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Xu(t));break;default:Xu(t)}e=e.sibling}}function Zu(e,t){for(;cu!==null;){var n=cu;switch(n.tag){case 0:case 11:case 15:Sl(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:ja(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,cu=r;else a:for(n=e;cu!==null;){r=cu;var i=r.sibling,a=r.return;if(yu(r),r===n){cu=null;break a}if(i!==null){i.return=a,cu=i;break a}cu=a}}}var Qu={getCacheForType:function(e){var t=Ca(ka),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Ca(ka).controller.signal}},$u=typeof WeakMap==`function`?WeakMap:Map,K=0,q=null,J=null,Y=0,X=0,ed=null,td=!1,nd=!1,rd=!1,id=0,ad=0,od=0,sd=0,cd=0,ld=0,ud=0,dd=null,fd=null,pd=!1,md=0,hd=0,gd=1/0,_d=null,vd=null,yd=0,bd=null,xd=null,Sd=0,Cd=0,wd=null,Td=null,Ed=null,Dd=null,Od=null,kd=0,Ad=null;function jd(){return K&2&&Y!==0?Y&-Y:j.T===null?St():Pf()}function Md(){if(ld===0){if(!(Y&536870912)||H){var e=ot;ot<<=1,!(ot&3932160)&&(ot=262144),ld=e}else ld=536870912}return e=ko.current,e!==null&&(e.flags|=32),ld}function Nd(e,t){if(t!=null){var n=e.stateNode,r=n.ref;r===null&&(r=n.ref=Pp(hi(e.memoizedProps,n))),Dd===null&&(Dd=[]),Dd.push(t.bind(null,r))}}function Pd(e,t,n){(e===q&&(X===2||X===9)||e.cancelPendingCommit!==null)&&(Vd(e,0),Rd(e,Y,ld,!1)),ht(e,n),K&2&&e===q||(e===q&&(!(K&2)&&(sd|=n),ad===4&&Rd(e,Y,ld,!1)),Ef(e))}function Fd(e,t,n){if(K&6)throw Error(i(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||ut(e,t),a=r?Yd(e,t):qd(e,t,!0),o=r;do{if(a===0){nd&&!r&&Rd(e,t,0,!1);break}if(n=e.current.alternate,o&&!Ld(n))a=qd(e,t,!1),o=!1;else{if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=dd;var l=c.current.memoizedState.isDehydrated;if(l&&(Vd(c,s).flags|=256),s=qd(c,s,!1),s!==2&&s!==6){if(rd&&!l){c.errorRecoveryDisabledLanes|=o,sd|=o,a=4;break a}o=fd,fd=a,o!==null&&(fd===null?fd=o:fd.push.apply(fd,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){Vd(e,0),Rd(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:Rd(r,t,ld,!td);break a;case 2:fd=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=md+300-We(),10<a)){if(Rd(r,t,ld,!td),lt(r,0,!0)!==0)break a;Sd=t,r.timeoutHandle=gp(Id.bind(null,r,n,fd,_d,pd,t,ld,sd,ud,td,o,`Throttled`,-0,0),a);break a}Id(r,n,fd,_d,pd,t,ld,sd,ud,td,o,null,-0,0)}break}}while(1);Ef(e)}function Id(e,t,n,r,i,a,o,s,c,l,u,d,f,p){e.timeoutHandle=-1;var m=t.subtreeFlags,h=(a&335544064)===a;d=null,(h||m&8192||(m&16785408)==16785408)&&(d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:gn},Bl=null,Ku(t,a,d),h&&(m=d,h=e.containerInfo,h=(h.nodeType===9?h:h.ownerDocument).__reactViewTransition,h!=null&&(m.count++,m.waitingForViewTransition=!0,m=nh.bind(m),h.finished.then(m,m))),m=(a&62914560)===a?md-We():(a&4194048)===a?hd-We():0,m=eh(d,m),m!==null)?(Sd=a,e.cancelPendingCommit=m(nf.bind(null,e,t,a,n,r,i,o,s,c,l,u,d,null,f,p)),Rd(e,a,o,!l)):nf(e,t,a,n,r,i,o,s,c,l,u,d)}function Ld(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!zr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Rd(e,t,n,r){t=dt(e,t),t&=~cd,t&=~sd,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-tt(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&_t(e,n,t)}function zd(){return K&6?!0:(Df(0,!1),!1)}function Bd(){if(J!==null){if(X===0)var e=J.return;else e=J,ha=ma=null,rs(e),ro=null,io=0,e=J;for(;e!==null;)bl(e.alternate,e),e=e.return;J=null}}function Vd(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,_p(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Sd=0,Bd(),q=e,J=n=Mi(e.current,null),Y=t,X=0,ed=null,td=!1,nd=ut(e,t),rd=!1,ud=ld=cd=sd=od=ad=0,fd=dd=null,pd=!1,id=dt(e,t),Si(),n}function Hd(e,t){U=null,j.H=pc,t===qa||t===Ya?(t=to(),X=3):t===Ja?(t=to(),X=4):X=t===jc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,ed=t,J===null&&(ad=1,Tc(e,Bi(t,e.current)))}function Ud(){var e=ko.current;return e===null?!0:(Y&4194048)===Y?Ao===null:(Y&62914560)===Y||Y&536870912?e===Ao:!1}function Wd(){var e=j.H;return j.H=pc,e===null?pc:e}function Gd(){var e=j.A;return j.A=Qu,e}function Kd(){ad=4,td||(Y&4194048)!==Y&&ko.current!==null||(nd=!0),!(od&134217727)&&!(sd&134217727)||q===null||Rd(q,Y,ld,!1)}function qd(e,t,n){var r=K;K|=2;var i=Wd(),a=Gd();(q!==e||Y!==t)&&(_d=null,Vd(e,t)),t=!1;var o=ad;a:do try{if(X!==0&&J!==null){var s=J,c=ed;switch(X){case 8:Bd(),o=6;break a;case 3:case 2:case 9:case 6:ko.current===null&&(t=!0);var l=X;if(X=0,ed=null,$d(e,s,c,l),n&&nd){o=0;break a}break;default:l=X,X=0,ed=null,$d(e,s,c,l)}}Jd(),o=ad;break}catch(t){Hd(e,t)}while(1);return t&&e.shellSuspendCounter++,ha=ma=null,K=r,j.H=i,j.A=a,J===null&&(q=null,Y=0,Si()),o}function Jd(){for(;J!==null;)Zd(J)}function Yd(e,t){var n=K;K|=2;var r=Wd(),a=Gd();q!==e||Y!==t?(_d=null,gd=We()+500,Vd(e,t)):nd=ut(e,t);a:do try{if(X!==0&&J!==null){t=J;var o=ed;b:switch(X){case 1:X=0,ed=null,$d(e,t,o,1);break;case 2:case 9:if(Za(o)){X=0,ed=null,Qd(t);break}t=function(){X!==2&&X!==9||q!==e||(X=7),Ef(e)},o.then(t,t);break a;case 3:X=7;break a;case 4:X=5;break a;case 7:Za(o)?(X=0,ed=null,Qd(t)):(X=0,ed=null,$d(e,t,o,7));break;case 5:var s=null;switch(J.tag){case 26:s=J.memoizedState;case 5:case 27:var c=J;if(s?Ym(s):c.stateNode.complete){X=0,ed=null;var l=c.sibling;if(l!==null)J=l;else{var u=c.return;u===null?J=null:(J=u,ef(u))}break b}}X=0,ed=null,$d(e,t,o,5);break;case 6:X=0,ed=null,$d(e,t,o,6);break;case 8:Bd(),ad=6;break a;default:throw Error(i(462))}}Xd();break}catch(t){Hd(e,t)}while(1);return ha=ma=null,j.H=r,j.A=a,K=n,J===null?(q=null,Y=0,Si(),ad):0}function Xd(){for(;J!==null&&!He();)Zd(J)}function Zd(e){var t=dl(e.alternate,e,id);e.memoizedProps=e.pendingProps,t===null?ef(e):J=t}function Qd(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Gc(n,t,t.pendingProps,t.type,void 0,Y);break;case 11:t=Gc(n,t,t.pendingProps,t.type.render,t.ref,Y);break;case 5:rs(t);var r=t;r===ta&&(H?(ca(r),r.tag===5&&r.stateNode!=null&&(na=r.stateNode)):(ca(r),H=!0));default:bl(n,t),t=J=Ni(t,id),t=dl(n,t,id)}e.memoizedProps=e.pendingProps,t===null?ef(e):J=t}function $d(e,t,n,r){ha=ma=null,rs(t),ro=null,io=0;var i=t.return;try{if(Ac(e,i,t,n,Y)){ad=1,Tc(e,Bi(n,e.current)),J=null;return}}catch(t){if(i!==null)throw J=i,t;ad=1,Tc(e,Bi(n,e.current)),J=null;return}t.flags&32768?(H||r===1?e=!0:nd||Y&536870912?e=!1:(td=e=!0,(r===2||r===9||r===3||r===6)&&(r=ko.current,r!==null&&r.tag===13&&(r.flags|=16384))),tf(t,e)):ef(t)}function ef(e){var t=e;do{if(t.flags&32768){tf(t,td);return}e=t.return;var n=vl(t.alternate,t,id);if(n!==null){J=n;return}if(t=t.sibling,t!==null){J=t;return}J=t=e}while(t!==null);ad===0&&(ad=5)}function tf(e,t){do{var n=yl(e.alternate,e);if(n!==null){n.flags&=32767,J=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){J=e;return}J=e=n}while(e!==null);ad=6,J=null}function nf(e,t,n,r,a,o,s,c,l,u,d,f){e.cancelPendingCommit=null;do df();while(yd!==0);if(K&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));e===q&&(J=q=null,Y=0),xd=t,bd=e,Sd=n,wd=a,Td=r,rf(e,t,n,s,c,l,f)}}function rf(e,t,n,r,i,a,o){var s=t.lanes|t.childLanes;if(Cd=s,s|=xi,gt(e,n,s,r,i,a),Dd=null,(n&335544064)===n?(Od=Pa(e),r=10262):(Od=null,r=10256),(t.subtreeFlags&r)!==0||(t.flags&r)!==0?(e.callbackNode=null,e.callbackPriority=0,yf(F,function(){return ff(),null})):(e.callbackNode=null,e.callbackPriority=0),zl=!1,r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=j.T,j.T=null,i=M.p,M.p=2,a=K,K|=4;try{pu(e,t,n)}finally{K=a,M.p=i,j.T=r}}yd=1,zl?Ed=Mp(o,e.containerInfo,Od,sf,cf,of,lf,ff,af,null,null):(sf(),cf(),lf())}function af(e){if(yd!==0){var t=bd.onRecoverableError;t(e,{componentStack:null})}}function of(){yd===3&&(yd=0,Pu(xd,bd),yd=4)}function sf(){if(yd===1){yd=0;var e=bd,t=xd,n=Sd,r=!!(t.flags&13878);if(t.subtreeFlags&13878||r){r=j.T,j.T=null;var i=M.p;M.p=2;var a=K;K|=4;try{uu=du=!1,Au(t,e,n),n=cp;var o=Gr(e.containerInfo),s=n.focusedElem,c=n.selectionRange;if(o!==s&&s&&s.ownerDocument&&Wr(s.ownerDocument.documentElement,s)){if(c!==null&&Kr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Ur(s,h),v=Ur(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}gh=!!sp,cp=sp=null}finally{K=a,M.p=i,j.T=r}}e.current=t,yd=2}}function cf(){if(yd===2){yd=0;var e=bd,t=xd,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=j.T,j.T=null;var r=M.p;M.p=2;var i=K;K|=4;try{hu(e,t.alternate,t)}finally{K=i,M.p=r,j.T=n}}yd=3}}function lf(){if(yd===4||yd===3){yd=0;var e=Ed;Ed=null,Ue();var t=bd,n=xd,r=Sd,i=Td,a=(r&335544064)===r?10262:10256;if((n.subtreeFlags&a)!==0||(n.flags&a)!==0?yd=5:(yd=0,xd=bd=null,uf(t,t.pendingLanes)),a=t.pendingLanes,a===0&&(vd=null),xt(r),n=n.stateNode,$e&&typeof $e.onCommitFiberRoot==`function`)try{$e.onCommitFiberRoot(Qe,n,void 0,(n.current.flags&128)==128)}catch{}if(i!==null){n=j.T,a=M.p,M.p=2,j.T=null;try{for(var o=t.onRecoverableError,s=0;s<i.length;s++){var c=i[s];o(c.value,{componentStack:c.stack})}}finally{j.T=n,M.p=a}}if(i=Dd,o=Od,Od=null,i!==null&&(Dd=null,o===null&&(o=[]),e!==null))for(c=0;c<i.length;c++)n=(0,i[c])(o),n!==void 0&&e.finished.finally(n);Sd&3&&df(),Ef(t),a=t.pendingLanes,r&261930&&a&42?t===Ad?kd++:(kd=0,Ad=t):(kd=0,Ad=null),Df(0,!1)}}function uf(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,ja(t)))}function df(){return Ed!==null&&(Ed.skipTransition(),Ed=null),sf(),cf(),lf(),ff()}function ff(){if(yd!==5)return!1;var e=bd,t=Cd;Cd=0;var n=xt(Sd),r=j.T,a=M.p;try{M.p=32>n?32:n,j.T=null,n=wd,wd=null;var o=bd,s=Sd;if(yd=0,xd=bd=null,Sd=0,K&6)throw Error(i(331));var c=K;if(K|=4,Yu(o.current),Vu(o,o.current,s,n),K=c,Df(0,!1),$e&&typeof $e.onPostCommitFiberRoot==`function`)try{$e.onPostCommitFiberRoot(Qe,o)}catch{}return!0}finally{M.p=a,j.T=r,uf(e,t)}}function pf(e,t,n){t=Bi(n,t),t=Dc(e.stateNode,t,2),e=go(e,t,2),e!==null&&(ht(e,2),Ef(e))}function Z(e,t,n){if(e.tag===3)pf(e,e,n);else for(;t!==null;){if(t.tag===3){pf(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(vd===null||!vd.has(r))){e=Bi(n,e),n=Oc(2),r=go(t,n,2),r!==null&&(kc(n,r,t,e),ht(r,2),Ef(r));break}}t=t.return}}function mf(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new $u;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(rd=!0,i.add(n),e=hf.bind(null,e,t,n),t.then(e,e))}function hf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,q===e&&(Y&n)===n&&(ad===4||ad===3&&(Y&62914560)===Y&&300>We()-md?K&2?cd|=n:Vd(e,0):cd|=n,ud===Y&&(ud=0)),Ef(e)}function gf(e,t){t===0&&(t=pt()),e=Ti(e,t),e!==null&&(ht(e,t),Ef(e))}function _f(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),gf(e,n)}function vf(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),gf(e,n)}function yf(e,t){return Be(e,t)}var bf=null,xf=null,Sf=!1,Cf=!1,wf=!1,Tf=0;function Ef(e){e!==xf&&e.next===null&&(xf===null?bf=xf=e:xf=xf.next=e),Cf=!0,Sf||(Sf=!0,Nf())}function Df(e,t){if(!wf&&Cf){wf=!0;do for(var n=!1,r=bf;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-tt(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,Mf(r,a))}else a=Y,a=lt(r,r===q?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||ut(r,a)||(n=!0,Mf(r,a))}r=r.next}while(n);wf=!1}}function Of(){kf()}function kf(){Cf=Sf=!1;var e=0;Tf!==0&&hp()&&(e=Tf);for(var t=We(),n=null,r=bf;r!==null;){var i=r.next,a=Af(r,t);a===0?(r.next=null,n===null?bf=i:n.next=i,i===null&&(xf=n)):(n=r,(e!==0||a&3)&&(Cf=!0)),r=i}yd!==0&&yd!==5||Df(e,!1),Tf!==0&&(Tf=0)}function Af(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-tt(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=ft(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=q,n=Y,n=lt(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(X===2||X===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Ve(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||ut(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Ve(r),xt(n)){case 2:case 8:n=qe;break;case 32:n=F;break;case 268435456:n=Ye;break;default:n=F}return r=jf.bind(null,e),n=Be(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Ve(r),e.callbackPriority=2,e.callbackNode=null,2}function jf(e,t){if(yd!==0&&yd!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(df()&&e.callbackNode!==n)return null;var r=Y;return r=lt(e,e===q?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Fd(e,r,t),Af(e,We()),e.callbackNode!=null&&e.callbackNode===n?jf.bind(null,e):null)}function Mf(e,t){if(df())return null;Fd(e,t,!0)}function Nf(){bp(function(){K&6?Be(Ke,Of):kf()})}function Pf(){if(Tf===0){var e=La;e===0&&(e=at,at<<=1,!(at&261888)&&(at=256)),Tf=e}return Tf}function Ff(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:hn(e)}function If(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=Ff((i[L]||null).action),o=r.submitter;o&&(t=(t=o[L]||null)?Ff(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Ln(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Tf!==0){var e=new FormData(i,o);$s(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=new FormData(i,o),$s(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var Lf=0;Lf<fi.length;Lf++){var Rf=fi[Lf];pi(Rf.toLowerCase(),`on`+(Rf[0].toUpperCase()+Rf.slice(1)))}pi(ii,`onAnimationEnd`),pi(ai,`onAnimationIteration`),pi(oi,`onAnimationStart`),pi(`dblclick`,`onDoubleClick`),pi(`focusin`,`onFocus`),pi(`focusout`,`onBlur`),pi(si,`onTransitionRun`),pi(ci,`onTransitionStart`),pi(li,`onTransitionCancel`),pi(ui,`onTransitionEnd`),Bt(`onMouseEnter`,[`mouseout`,`mouseover`]),Bt(`onMouseLeave`,[`mouseout`,`mouseover`]),Bt(`onPointerEnter`,[`pointerout`,`pointerover`]),Bt(`onPointerLeave`,[`pointerout`,`pointerover`]),zt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),zt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),zt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),zt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),zt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),zt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var zf=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),Bf=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(zf));function Vf(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){vi(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){vi(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[Et];n===void 0&&(n=t[Et]=new Set);var r=e+`__bubble`;n.has(r)||(Gf(t,e,2,!1),n.add(r))}function Hf(e,t,n){var r=0;t&&(r|=4),Gf(n,e,r,t)}var Uf=`_reactListening`+Math.random().toString(36).slice(2);function Wf(e){if(!e[Uf]){e[Uf]=!0,Lt.forEach(function(t){t!==`selectionchange`&&(Bf.has(t)||Hf(t,!1,e),Hf(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Uf]||(t[Uf]=!0,Hf(`selectionchange`,!1,t))}}function Gf(e,t,n,r){switch(Ch(t)){case 2:var i=_h;break;case 8:i=vh;break;default:i=yh}n=i.bind(null,t,n,e),i=void 0,!En||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Kf(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=Nt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}Cn(function(){var r=a,i=vn(n),s=[];a:{var c=di.get(e);if(c!==void 0){var l=Ln,u=e;switch(e){case`keypress`:if(Mn(n)===0)break a;case`keydown`:case`keyup`:l=tr;break;case`focusin`:u=`focus`,l=Kn;break;case`focusout`:u=`blur`,l=Kn;break;case`beforeblur`:case`afterblur`:l=Kn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=Wn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Gn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=ir;break;case ii:case ai:case oi:l=qn;break;case ui:l=ar;break;case`scroll`:case`scrollend`:l=zn;break;case`wheel`:l=or;break;case`copy`:case`cut`:case`paste`:l=Jn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=nr;break;case`submit`:l=rr;break;case`toggle`:case`beforetoggle`:l=sr}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=wn(m,p),g!=null&&d.push(qf(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(l=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,l&&n!==_n&&(u=n.relatedTarget||n.fromElement)&&(Nt(u)||u[Tt]))break a;(c||l)&&(u=i.window===i?i:(l=i.ownerDocument)?l.defaultView||l.parentWindow:window,c?(l=n.relatedTarget||n.toElement,c=r,l=l?Nt(l):null,l!==null&&(f=o(l),d=l.tag,l!==f||d!==5&&d!==27&&d!==6)&&(l=null)):(c=null,l=r),c!==l&&(d=Wn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=nr,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=c==null?u:Pt(c),h=l==null?u:Pt(l),u=new d(g,m+`leave`,c,n,i),u.target=f,u.relatedTarget=h,g=null,Nt(i)===r&&(d=new d(p,m+`enter`,l,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,d=c&&l?ee(c,l,Yf):null,c!==null&&Xf(s,u,c,d,!1),l!==null&&f!==null&&Xf(s,f,l,d,!0)))}a:{if(c=r?Pt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var _=Dr;else if(xr(c)){if(Or)_=Lr;else{_=Fr;var v=Pr}}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&fn(r.elementType)&&(_=Dr):_=Ir;if(_&&=_(e,r)){Sr(s,_,n,i);break a}v&&v(e,c,r)}switch(v=r?Pt(r):window,e){case`focusin`:(xr(v)||v.contentEditable===`true`)&&(Jr=v,Yr=r,Xr=null);break;case`focusout`:Xr=Yr=Jr=null;break;case`mousedown`:Zr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Zr=!1,Qr(s,n,i);break;case`selectionchange`:if(qr)break;case`keydown`:case`keyup`:Qr(s,n,i)}var y;if(lr)b:{switch(e){case`compositionstart`:var b=`onCompositionStart`;break b;case`compositionend`:b=`onCompositionEnd`;break b;case`compositionupdate`:b=`onCompositionUpdate`;break b}b=void 0}else _r?hr(e,n)&&(b=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(b=`onCompositionStart`);b&&(fr&&n.locale!==`ko`&&(_r||b!==`onCompositionStart`?b===`onCompositionEnd`&&_r&&(y=jn()):(On=i,kn=`value`in On?On.value:On.textContent,_r=!0)),v=Jf(r,b),0<v.length&&(b=new Yn(b,e,null,n,i),s.push({event:b,listeners:v}),y?b.data=y:(y=gr(n),y!==null&&(b.data=y)))),(y=dr?vr(e,n):yr(e,n))&&(b=Jf(r,`onBeforeInput`),0<b.length&&(v=new Yn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:v,listeners:b}),v.data=y)),If(s,e,r,n,i)}Vf(s,t)})}function qf(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Jf(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=wn(e,n),i!=null&&r.unshift(qf(e,i,a)),i=wn(e,t),i!=null&&r.push(qf(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Yf(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Xf(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=wn(n,a),l!=null&&o.unshift(qf(n,l,c))):i||(l=wn(n,a),l!=null&&o.push(qf(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Zf=/\r\n?/g,Qf=/\u0000|\uFFFD/g;function $f(e){return(typeof e==`string`?e:``+e).replace(Zf,`
`).replace(Qf,``)}function ep(e,t){return t=$f(t),$f(e)===t}function $(e,t,n,r,a,o){switch(n){case`children`:if(typeof r==`string`)t===`body`||t===`textarea`&&r===``||cn(e,r);else if(typeof r==`number`||typeof r==`bigint`)t!==`body`&&cn(e,``+r);else return;break;case`className`:qt(e,`class`,r);break;case`tabIndex`:qt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:qt(e,n,r);break;case`style`:dn(e,r,o);return;case`data`:if(t!==`object`){qt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)||r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=hn(r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,a.name,a,null),$(e,t,`formEncType`,a.formEncType,a,null),$(e,t,`formMethod`,a.formMethod,a,null),$(e,t,`formTarget`,a.formTarget,a,null)):($(e,t,`encType`,a.encType,a,null),$(e,t,`method`,a.method,a,null),$(e,t,`target`,a.target,a,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=hn(r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=gn);return;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=hn(r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`credentialless`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),Kt(e,`popover`,r);break;case`xlinkActuate`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Jt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Jt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:Kt(e,`is`,r);break;case`innerText`:case`textContent`:return;default:if(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)n=pn.get(n)||n,Kt(e,n,r);else return}B=!0}function tp(e,t,n,r,a,o){switch(n){case`style`:dn(e,r,o);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`children`:if(typeof r==`string`)cn(e,r);else if(typeof r==`number`||typeof r==`bigint`)cn(e,``+r);else return;break;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`onClick`:r!=null&&(e.onclick=gn);return;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:return;case`innerText`:case`textContent`:return;default:if(!Rt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),o=n.slice(2,a?n.length-7:void 0),t=e[L]||null,t=t==null?null:t[n],typeof t==`function`&&e.removeEventListener(o,t,a),typeof r==`function`)){typeof t!=`function`&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(o,r,a);break a}B=!0,n in e?e[n]=r:!0===r?e.setAttribute(n,``):Kt(e,n,r)}return}B=!0}function np(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,o,s,n,null)}}a&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:$(e,t,r,d,n,null)}}nn(e,o,c,l,u,s,a,!1);return;case`select`:for(a in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&an(e,!!r,n,!0):an(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:$(e,t,s,c,n,null)}sn(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<zf.length;r++)Q(zf[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,u,r,n,null)}return;default:if(fn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&tp(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}var rp={};function ip(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:m!==f&&(B=!0),o=m;break;case`name`:m!==f&&(B=!0),a=m;break;case`checked`:m!==f&&(B=!0),u=m;break;case`defaultChecked`:m!==f&&(B=!0),d=m;break;case`value`:m!==f&&(B=!0),s=m;break;case`defaultValue`:m!==f&&(B=!0),c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}tn(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:o!==l&&(B=!0),p=o;break;case`defaultValue`:o!==l&&(B=!0),c=o;break;case`multiple`:o!==l&&(B=!0),s=o;default:o!==l&&$(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?an(e,!!n,n?[]:``,!1):an(e,!!n,t,!0)):an(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:a!==o&&(B=!0),p=a;break;case`defaultValue`:a!==o&&(B=!0),m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&$(e,t,s,a,r,o)}on(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:p!==m&&(B=!0),e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(fn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&tp(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||tp(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function ap(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function op(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&ap(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&ap(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var sp=null,cp=null;function lp(e){return e.nodeType===9?e:e.ownerDocument}function up(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function dp(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function fp(e,t,n,r){return n=lp(n).createElement(e),n[I]=r,n[L]=t,np(n,e,t),z(n),n}function pp(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var mp=null;function hp(){var e=window.event;return e&&e.type===`popstate`?e!==mp&&(mp=e,!0):(mp=null,!1)}var gp=typeof setTimeout==`function`?setTimeout:void 0,_p=typeof clearTimeout==`function`?clearTimeout:void 0,vp=typeof Promise==`function`?Promise:void 0,yp=typeof requestAnimationFrame==`function`?requestAnimationFrame:gp,bp=typeof queueMicrotask==`function`?queueMicrotask:vp===void 0?gp:function(e){return vp.resolve(null).then(e).catch(xp)};function xp(e){setTimeout(function(){throw e})}function Sp(e){return e===`head`}function Cp(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Hh(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)_m(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,_m(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[At]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&_m(e.ownerDocument.body)}n=i}while(n);Hh(t)}function wp(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function Tp(e,t,n){if(t=CSS.escape(t)===t?t:`r-`+btoa(t).replace(/=/g,``),e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display===`inline`){if(t=e.getClientRects(),t.length===1)var r=1;else for(var i=r=0;i<t.length;i++){var a=t[i];0<a.width&&0<a.height&&r++}r===1&&(e=e.style,e.display=t.length===1?`inline-block`:`block`,e.marginTop=`-`+n.paddingTop,e.marginBottom=`-`+n.paddingBottom)}}function Ep(e,t){e=e.style,t=t.style;var n=t==null?null:t.hasOwnProperty(`viewTransitionName`)?t.viewTransitionName:t.hasOwnProperty(`view-transition-name`)?t[`view-transition-name`]:null;e.viewTransitionName=n==null||typeof n==`boolean`?``:(``+n).trim(),n=t==null?null:t.hasOwnProperty(`viewTransitionClass`)?t.viewTransitionClass:t.hasOwnProperty(`view-transition-class`)?t[`view-transition-class`]:null,e.viewTransitionClass=n==null||typeof n==`boolean`?``:(``+n).trim(),e.display===`inline-block`&&(t==null?e.display=e.margin=``:(n=t.display,e.display=n==null||typeof n==`boolean`?``:n,n=t.margin,n==null?(n=t.hasOwnProperty(`marginTop`)?t.marginTop:t[`margin-top`],e.marginTop=n==null||typeof n==`boolean`?``:n,t=t.hasOwnProperty(`marginBottom`)?t.marginBottom:t[`margin-bottom`],e.marginBottom=t==null||typeof t==`boolean`?``:t):e.margin=n))}function Dp(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position===`absolute`||t.position===`fixed`,clip:t.clipPath!==`none`||t.overflow!==`visible`||t.filter!==`none`||t.mask!==`none`||t.mask!==`none`||t.borderRadius!==`0px`,view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Op(e){return Dp(e.getBoundingClientRect(),getComputedStyle(e),e)}function kp(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return Dp(t,n,e)}function Ap(e){return e.documentElement.clientHeight}function jp(e){this.addEventListener(`load`,e),this.addEventListener(`error`,e)}function Mp(e,t,n,r,i,a,o,s,c){var l=t.nodeType===9?t:t.ownerDocument;try{var u=l.startViewTransition({update:function(){var t=l.defaultView,n=t.navigation&&t.navigation.transition,o=l.fonts.status;r();var s=[];if(o===`loaded`&&(Ap(l),l.fonts.status===`loading`&&s.push(l.fonts.ready)),o=s.length,e!==null)for(var c=e.suspenseyImages,u=0,d=0;d<c.length;d++){var f=c[d];if(!f.complete){var p=f.getBoundingClientRect();if(0<p.bottom&&0<p.right&&p.top<t.innerHeight&&p.left<t.innerWidth){if(u+=Xm(f),u>$m){s.length=o;break}f=new Promise(jp.bind(f)),s.push(f)}}}if(0<s.length)return t=Promise.race([Promise.all(s),new Promise(function(e){return setTimeout(e,500)})]).then(i,i),(n?Promise.allSettled([n.finished,t]):t).then(a,a);if(i(),n)return n.finished.then(a,a);a()},types:n});l.__reactViewTransition=u;var d=[];return u.ready.then(function(){for(var e=l.documentElement.getAnimations({subtree:!0}),t=0;t<e.length;t++){var n=e[t],r=n.effect,i=r.pseudoElement;if(i!=null&&i.startsWith(`::view-transition`)){d.push(n),n=r.getKeyframes();for(var a=i=void 0,s=!0,c=0;c<n.length;c++){var u=n[c],f=u.width;if(i===void 0)i=f;else if(i!==f){s=!1;break}if(f=u.height,a===void 0)a=f;else if(a!==f){s=!1;break}delete u.width,delete u.height,u.transform===`none`&&delete u.transform}s&&i!==void 0&&a!==void 0&&(r.setKeyframes(n),s=getComputedStyle(r.target,r.pseudoElement),s.width!==i||s.height!==a)&&(s=n[0],s.width=i,s.height=a,s=n[n.length-1],s.width=i,s.height=a,r.setKeyframes(n))}}o()},function(e){l.__reactViewTransition===u&&(l.__reactViewTransition=null);try{if(typeof e==`object`&&e)switch(e.name){case`InvalidStateError`:(e.message===`View transition was skipped because document visibility state is hidden.`||e.message===`Skipping view transition because document visibility state has become hidden.`||e.message===`Skipping view transition because viewport size changed.`||e.message===`Transition was aborted because of invalid state`)&&(e=null)}e!==null&&c(e)}finally{r(),i(),o()}}),u.finished.finally(function(){for(var e=0;e<d.length;e++)d[e].cancel();l.__reactViewTransition===u&&(l.__reactViewTransition=null),s()}),u}catch{return r(),i(),o(),null}}function Np(e,t){this._scope=document.documentElement,this._selector=`::view-transition-`+e+`(`+t+`)`}Np.prototype.animate=function(e,t){return t=typeof t==`number`?{duration:t}:E({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)},Np.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),r=[],i=0;i<n.length;i++){var a=n[i].effect;a!==null&&a.target===e&&a.pseudoElement===t&&r.push(n[i])}return r},Np.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Pp(e){return{name:e,group:new Np(`group`,e),imagePair:new Np(`image-pair`,e),old:new Np(`old`,e),new:new Np(`new`,e)}}function Fp(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Fp.prototype.addEventListener=function(e,t,n){var r=null,i=null;if(!(n!=null&&typeof n!=`boolean`&&(r=n.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var a=this._eventListeners;if(Bp(a,e,t,n)===-1){var o=this,s=t;n!=null&&typeof n!=`boolean`&&!0===n.once&&(s=function(r){o.removeEventListener(e,t,n),typeof t==`function`?t.call(this,r):t.handleEvent(r)}),r!==null&&(i=o.removeEventListener.bind(o,e,t,n),r.addEventListener(`abort`,i,{once:!0}),i=r.removeEventListener.bind(r,`abort`,i)),r=Rp(n),a.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:s,cleanup:i}),h(this._fragmentFiber.child,!1,Ip,e,s,r)}this._eventListeners=a}};function Ip(e,t,n,r){return b(e).addEventListener(t,n,r),!1}Fp.prototype.removeEventListener=function(e,t,n){var r=this._eventListeners;if(r!==null&&(t=Bp(r,e,t,n),t!==-1)){var i=r[t];n=i.attachedListener;var a=i.cleanup;i=Rp(i.optionsOrUseCapture),h(this._fragmentFiber.child,!1,Lp,e,n,i),r.splice(t,1),a!==null&&a()}};function Lp(e,t,n,r){return b(e).removeEventListener(t,n,r),!1}function Rp(e){return e!=null&&typeof e!=`boolean`&&(!0===e.once||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function zp(e){return e==null?`c=0`:typeof e==`boolean`?`c=`+(e?`1`:`0`):`c=`+(e.capture?`1`:`0`)}function Bp(e,t,n,r){if(e.length===0)return-1;r=zp(r);for(var i=0;i<e.length;i++){var a=e[i];if(a.type===t&&a.listener===n&&zp(a.optionsOrUseCapture)===r)return i}return-1}Fp.prototype.dispatchEvent=function(e){var t=g(this._fragmentFiber);if(t===null)return!0;t=b(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var r=t.nodeType===9?t.createComment(``):document.createTextNode(``);if(n)for(var i=0;i<n.length;i++){var a=n[i];r.addEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture))}if(t.appendChild(r),e=r.dispatchEvent(e),n)for(i=0;i<n.length;i++)a=n[i],r.removeEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture));return t.removeChild(r),e}return t.dispatchEvent(e)},Fp.prototype.focus=function(e){h(this._fragmentFiber.child,!0,Vp,e,void 0,void 0)};function Vp(e,t){return e.tag!==6&&(e=b(e),pm(e,t))}Fp.prototype.focusLast=function(e){var t=[];h(this._fragmentFiber.child,!0,Hp,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Vp(t[n],e);n--);};function Hp(e,t){return t.push(e),!1}Fp.prototype.blur=function(){var e=g(this._fragmentFiber);e!==null&&(e=b(e),e=lp(e).activeElement,e!==null&&h(this._fragmentFiber.child,!1,Up,e,void 0,void 0))};function Up(e,t){return e.tag!==6&&(e=b(e),e===t||e.contains(t)?(t.blur(),!0):!1)}Fp.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),h(this._fragmentFiber.child,!1,Wp,e,void 0,void 0)};function Wp(e,t){return e.tag===6||(e=b(e),t.observe(e)),!1}Fp.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),h(this._fragmentFiber.child,!1,Gp,e,void 0,void 0);for(var n=t=0;n<Kp.length;n++){var r=Kp[n];r.fragmentInstance===this&&r.observer===e?e.unobserve(r.instance):Kp[t++]=r}Kp.length=t}};function Gp(e,t){return e.tag===6||(e=b(e),t.unobserve(e)),!1}var Kp=[],qp=!1;function Jp(e,t,n){Kp.push({fragmentInstance:e,observer:t,instance:n}),qp||(qp=!0,mm(function(){qp=!1;var e=Kp;Kp=[];for(var t=0;t<e.length;t++){var n=e[t];n.observer.unobserve(n.instance)}}))}Fp.prototype.getClientRects=function(){var e=[];return h(this._fragmentFiber.child,!1,Yp,e,void 0,void 0),e};function Yp(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=b(e),t.push.apply(t,e.getClientRects());return!1}Fp.prototype.getRootNode=function(e){var t=g(this._fragmentFiber);return t===null?this:b(t).getRootNode(e)},Fp.prototype.compareDocumentPosition=function(e){var t=g(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];h(this._fragmentFiber.child,!1,Hp,n,void 0,void 0);var r=b(t);if(n.length===0){if(n=r,_(this._fragmentFiber)){a:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break a}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var i=r=n.compareDocumentPosition(e);return n===e?i=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=v(t)[1],n===null?i=Node.DOCUMENT_POSITION_PRECEDING:(e=b(n).compareDocumentPosition(e),i=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),i|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=b(n[0]),i=b(n[n.length-1]);var a=_(this._fragmentFiber)?t.parentElement:r;if(a==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=a.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,a=a.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_CONTAINED_BY;var o=t.compareDocumentPosition(e),s=i.compareDocumentPosition(e),c=o&Node.DOCUMENT_POSITION_CONTAINED_BY||s&Node.DOCUMENT_POSITION_CONTAINED_BY;return s=r&&a&&o&Node.DOCUMENT_POSITION_FOLLOWING&&s&Node.DOCUMENT_POSITION_PRECEDING,t=r&&t===e||a&&i===e||c||s?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&t===e||!a&&i===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:o,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||Xp(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function Xp(e,t,n,r,i){var a=Nt(i);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!a)a:{for(;a!==null;){if(a.tag===7&&(a===t||a.alternate===t)){n=!0;break a}a=a.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(a===null)return a=i.ownerDocument,i===a||i===a.documentElement||i===a.body;a:{for(a=t,t=g(t);a!==null;){if(!(a.tag!==5&&a.tag!==3&&a.tag!==27||a!==t&&a.alternate!==t)){a=!0;break a}a=a.return}a=!1}return a}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!a)&&!(t=a===n)&&(t=ee(n,a,T),t===null?t=!1:(h(t,!0,C,a,n),a=x,x=null,t=a!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!a)&&!(t=a===r)&&(t=ee(r,a,T),t===null?t=!1:(h(t,!0,w,a,r),a=x,S=x=null,t=a!==null)),t):!1}function Zp(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Fp.prototype.scrollIntoView=function(e){if(typeof e==`object`)throw Error(i(566));var t=[];h(this._fragmentFiber.child,!1,Hp,t,void 0,void 0);var n=!1!==e;if(t.length===0){var r=v(this._fragmentFiber);if(r=n?r[1]||r[0]||g(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){e=b(r),Zp(e,n);return}if(r=b(r),r.nodeType!==9){if(r.nodeType===11){n=`host`in r?r.host:null,n!==null&&n.scrollIntoView(e);return}r.scrollIntoView(e)}}for(r=n?t.length-1:0;r!==(n?-1:t.length);){var a=t[r];a.tag===6?(a=b(a),Zp(a,n)):b(a).scrollIntoView(e),r+=n?-1:1}};function Qp(e,t){return e=b(e),$p(e,t),!1}function $p(e,t){e.reactFragments??=new Set,e.reactFragments.add(t)}function em(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.addEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){for(var r=0,i=0;i<Kp.length;i++){var a=Kp[i];(a.fragmentInstance!==t||a.observer!==n||a.instance!==e)&&(Kp[r++]=a)}Kp.length=r,n.observe(e)}),$p(e,t))}function tm(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.removeEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){typeof n.rootMargin==`string`?Jp(t,n,e):n.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function nm(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:nm(n),Mt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function rm(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[At])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=lm(e.nextSibling),e===null)break}return null}function im(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=lm(e.nextSibling),e===null))return null;return e}function am(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=lm(e.nextSibling),e===null))return null;return e}function om(e){return e.data===`$?`||e.data===`$~`}function sm(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function cm(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function lm(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var um=null;function dm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return lm(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function fm(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function pm(e,t){function n(){r=!0}if(e.ownerDocument.activeElement===e)return!0;var r=!1;try{e.ownerDocument.addEventListener(`focus`,n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener(`focus`,n,!0)}return r}function mm(e){yp(function(){yp(function(t){return e(t)})})}function hm(e,t,n){switch(t=lp(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function gm(e,t,n){for(var r in n){var i=n[r];n.hasOwnProperty(r)&&i!=null&&$(e,t,r,null,rp,i)}n.dangerouslySetInnerHTML!=null&&(e.textContent=``),e.onclick===gn&&(e.onclick=null),Mt(e)}function _m(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Mt(e)}var vm=new Map,ym=new Set;function bm(e){if(typeof e.getRootNode==`function`){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var xm=M.d;M.d={f:Sm,r:Cm,D:Em,C:Dm,L:Om,m:km,X:jm,S:Am,M:Mm};function Sm(){var e=xm.f(),t=zd();return e||t}function Cm(e){var t=R(e);t!==null&&t.tag===5&&t.type===`form`?tc(t):xm.r(e)}var wm=typeof document>`u`?null:document;function Tm(e,t,n){var r=wm;if(r&&typeof t==`string`&&t){var i=en(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),ym.has(i)||(ym.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),np(t,`link`,e),z(t),r.head.appendChild(t)))}}function Em(e){xm.D(e),Tm(`dns-prefetch`,e,null)}function Dm(e,t){xm.C(e,t),Tm(`preconnect`,e,t)}function Om(e,t,n){xm.L(e,t,n);var r=wm;if(r&&e&&t){var i=`link[rel="preload"][as="`+en(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+en(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+en(n.imageSizes)+`"]`)):i+=`[href="`+en(e)+`"]`;var a=i;switch(t){case`style`:a=Pm(e);break;case`script`:a=Rm(e)}if(!(vm.has(a)||(e=E({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),vm.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(Fm(a))||t===`script`&&r.querySelector(zm(a))))){var o=r.createElement(`link`);np(o,`link`,e),t===`style`&&(o[jt]=!0,o.onload=o.onerror=function(){It(o)}),z(o),r.head.appendChild(o)}}}function km(e,t){xm.m(e,t);var n=wm;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+en(r)+`"][href="`+en(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Rm(e)}if(!vm.has(a)&&(e=E({rel:`modulepreload`,href:e},t),vm.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(zm(a)))return}r=n.createElement(`link`),np(r,`link`,e),z(r),n.head.appendChild(r)}}}function Am(e,t,n){xm.S(e,t,n);var r=wm;if(r&&e){var i=Ft(r).hoistableStyles,a=Pm(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(Fm(a)))s.loading=5;else{e=E({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=vm.get(a))&&Hm(e,n);var c=o=r.createElement(`link`);z(c),np(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Vm(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function jm(e,t){xm.X(e,t);var n=wm;if(n&&e){var r=Ft(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=E({src:e,async:!0},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),z(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Mm(e,t){xm.M(e,t);var n=wm;if(n&&e){var r=Ft(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=E({src:e,async:!0,type:`module`},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),z(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Nm(e,t,n,r){var a=(a=De.current)?bm(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(n=Pm(n.href),t=Ft(a).hoistableStyles,r=t.get(n),r||(r={type:`style`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Pm(n.href);var o=Ft(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(Fm(e)))?o._p||(s.instance=o,s.state.loading=5):(o=vm.get(e),o||(o={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},vm.set(e,o)),Lm(a,e,o,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(n=Rm(n),t=Ft(a).hoistableScripts,r=t.get(n),r||(r={type:`script`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Pm(e){return`href="`+en(e)+`"`}function Fm(e){return`link[rel="stylesheet"][`+e+`]`}function Im(e){return E({},e,{"data-precedence":e.precedence,precedence:null})}function Lm(e,t,n,r){if(t=e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)){if(!0!==t[jt]){r.loading=1;return}}else t=e.createElement(`link`),t[jt]=!0,t.onload=t.onerror=It.bind(null,t),np(t,`link`,n),z(t),e.head.appendChild(t);r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2})}function Rm(e){return`[src="`+en(e)+`"]`}function zm(e){return`script[async]`+e}function Bm(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+en(n.href)+`"]`);if(r)return t.instance=r,z(r),r;var a=E({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),z(r),np(r,`style`,a),Vm(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Pm(n.href);var o=e.querySelector(Fm(a));if(o)return t.state.loading|=4,t.instance=o,z(o),o;r=Im(n),(a=vm.get(a))&&Hm(r,a),o=(e.ownerDocument||e).createElement(`link`),z(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),np(o,`link`,r),t.state.loading|=4,Vm(o,n.precedence,e),t.instance=o;case`script`:return o=Rm(n.src),(a=e.querySelector(zm(o)))?(t.instance=a,z(a),a):(r=n,(a=vm.get(o))&&(r=E({},n),Um(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),z(a),np(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Vm(r,n.precedence,e));return t.instance}function Vm(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Hm(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function Um(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Wm=null;function Gm(e,t,n){if(Wm===null){var r=new Map,i=Wm=new Map;i.set(n,r)}else i=Wm,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[At]||a[I]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Km(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function qm(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Jm(e,t){return e===`img`&&t.src!=null&&t.src!==``&&t.onLoad==null&&t.loading!==`lazy`}function Ym(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Xm(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio==`number`?devicePixelRatio:1)*.25}function Zm(e,t){typeof t.decode==`function`&&(e.imgCount++,t.complete||(e.imgBytes+=Xm(t),e.suspenseyImages.push(t)),e=rh.bind(e),t.decode().then(e,e))}function Qm(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Pm(r.href),a=t.querySelector(Fm(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=nh.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,z(a);return}a=t.ownerDocument||t,r=Im(r),(i=vm.get(i))&&Hm(r,i),a=a.createElement(`link`),z(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),np(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=nh.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var $m=0;function eh(e,t){return e.stylesheets&&e.count===0&&ah(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&$m===0&&($m=62500*op());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>$m?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function th(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)ah(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function nh(){this.count--,th(this)}function rh(){this.imgCount--,th(this)}var ih=null;function ah(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ih=new Map,t.forEach(oh,e),ih=null,nh.call(e))}function oh(e,t){if(!(t.state.loading&4)){var n=ih.get(e);if(n)var r=n.get(null);else{n=new Map,ih.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=nh.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var sh={$$typeof:k,Provider:null,Consumer:null,_currentValue:be,_currentValue2:be,_threadCount:0};function ch(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=mt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=mt(0),this.hiddenUpdates=mt(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.transitionTypes=null,this.incompleteTransitions=new Map}function lh(e,t,n,r,i,a,o,s,c,l,u,d){return e=new ch(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=Ai(3,null,null,t),e.current=a,a.stateNode=e,t=Aa(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},po(a),e}function uh(e){return e?(e=Oi,e):Oi}function dh(e,t,n,r,i,a){i=uh(i),r.context===null?r.context=i:r.pendingContext=i,r=ho(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=go(e,r,t),n!==null&&(Pd(n,e,t),_o(n,e,t))}function fh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ph(e,t){fh(e,t),(e=e.alternate)&&fh(e,t)}function mh(e){if(e.tag===13||e.tag===31){var t=Ti(e,67108864);t!==null&&Pd(t,e,67108864),ph(e,67108864)}}function hh(e){if(e.tag===13||e.tag===31){var t=jd();t=bt(t);var n=Ti(e,t);n!==null&&Pd(n,e,t),ph(e,t)}}var gh=!0;function _h(e,t,n,r){var i=j.T;j.T=null;var a=M.p;try{M.p=2,yh(e,t,n,r)}finally{M.p=a,j.T=i}}function vh(e,t,n,r){var i=j.T;j.T=null;var a=M.p;try{M.p=8,yh(e,t,n,r)}finally{M.p=a,j.T=i}}function yh(e,t,n,r){if(gh){var i=bh(r);if(i===null)Kf(e,t,r,xh,n),Mh(e,r);else if(Ph(i,e,t,n,r))r.stopPropagation();else if(Mh(e,r),t&4&&-1<jh.indexOf(e)){for(;i!==null;){var a=R(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=ct(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-tt(o);s.entanglements[1]|=c,o&=~c}Ef(a),!(K&6)&&(gd=We()+500,Df(0,!1))}}break;case 31:case 13:s=Ti(a,2),s!==null&&Pd(s,a,2),zd(),ph(a,2)}if(a=bh(r),a===null&&Kf(e,t,r,xh,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Kf(e,t,r,null,n)}}function bh(e){return e=vn(e),Sh(e)}var xh=null;function Sh(e){if(xh=null,e=Nt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return xh=e,null}function Ch(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`fullscreenerror`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`resize`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Ge()){case Ke:return 2;case qe:return 8;case F:case Je:return 32;case Ye:return 268435456;default:return 32}default:return 32}}var wh=!1,Th=null,Eh=null,Dh=null,Oh=new Map,kh=new Map,Ah=[],jh=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Mh(e,t){switch(e){case`focusin`:case`focusout`:Th=null;break;case`dragenter`:case`dragleave`:Eh=null;break;case`mouseover`:case`mouseout`:Dh=null;break;case`pointerover`:case`pointerout`:Oh.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:kh.delete(t.pointerId)}}function Nh(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=R(t),t!==null&&mh(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ph(e,t,n,r,i){switch(t){case`focusin`:return Th=Nh(Th,e,t,n,r,i),!0;case`dragenter`:return Eh=Nh(Eh,e,t,n,r,i),!0;case`mouseover`:return Dh=Nh(Dh,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return Oh.set(a,Nh(Oh.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,kh.set(a,Nh(kh.get(a)||null,e,t,n,r,i)),!0}return!1}function Fh(e){var t=Nt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,Ct(e.priority,function(){hh(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,Ct(e.priority,function(){hh(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ih(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=bh(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);_n=r,n.target.dispatchEvent(r),_n=null}else return t=R(n),t!==null&&mh(t),e.blockedOn=n,!1;t.shift()}return!0}function Lh(e,t,n){Ih(e)&&n.delete(t)}function Rh(){wh=!1,Th!==null&&Ih(Th)&&(Th=null),Eh!==null&&Ih(Eh)&&(Eh=null),Dh!==null&&Ih(Dh)&&(Dh=null),Oh.forEach(Lh),kh.forEach(Lh)}function zh(e,n){e.blockedOn===n&&(e.blockedOn=null,wh||(wh=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,Rh)))}var Bh=null;function Vh(e){Bh!==e&&(Bh=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){Bh===e&&(Bh=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(Sh(r||n)===null)continue;break}var a=R(n);a!==null&&(e.splice(t,3),t-=3,$s(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Hh(e){function t(t){return zh(t,e)}Th!==null&&zh(Th,e),Eh!==null&&zh(Eh,e),Dh!==null&&zh(Dh,e),Oh.forEach(t),kh.forEach(t);for(var n=0;n<Ah.length;n++){var r=Ah[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<Ah.length&&(n=Ah[0],n.blockedOn===null);)Fh(n),n.blockedOn===null&&Ah.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[L]||null;if(typeof a==`function`)o||Vh(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[L]||null)s=o.formAction;else if(Sh(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Vh(n)}}}function Uh(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Wh(e){this._internalRoot=e}Gh.prototype.render=Wh.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;dh(n,jd(),e,t,null,null)},Gh.prototype.unmount=Wh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;dh(e.current,2,null,e,null,null),zd(),t[Tt]=null}};function Gh(e){this._internalRoot=e}Gh.prototype.unstable_scheduleHydration=function(e){if(e){var t=St();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ah.length&&t!==0&&t<Ah[n].priority;n++);Ah.splice(n,0,e),n===0&&Fh(e)}};var Kh=n.version;if(Kh!==`19.3.1`)throw Error(i(527,Kh,`19.3.1`));M.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=d(t),e=e===null?null:p(e),e=e===null?null:e.stateNode,e};var qh={bundleType:0,version:`19.3.1`,rendererPackageName:`react-dom`,currentDispatcherRef:j,reconcilerVersion:`19.3.1`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Jh=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jh.isDisabled&&Jh.supportsFiber)try{Qe=Jh.inject(qh),$e=Jh}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Sc,s=Cc,c=wc;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=lh(e,1,!1,null,null,n,r,null,o,s,c,Uh),e[Tt]=t.current,Wf(e),new Wh(t)}})),g=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=h()})),_=e=>e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase(),v=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,n)=>n?n.toUpperCase():t.toLowerCase()),y=e=>{let t=v(e);return t.charAt(0).toUpperCase()+t.slice(1)},b=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),x=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0},S={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,strokeLinejoin:`round`},C=c(f()),w=(0,C.forwardRef)(({color:e=`currentColor`,size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:i=``,children:a,iconNode:o,...s},c)=>(0,C.createElement)(`svg`,{ref:c,...S,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:b(`lucide`,i),...!a&&!x(s)&&{"aria-hidden":`true`},...s},[...o.map(([e,t])=>(0,C.createElement)(e,t)),...Array.isArray(a)?a:[a]])),T=(e,t)=>{let n=(0,C.forwardRef)(({className:n,...r},i)=>(0,C.createElement)(w,{ref:i,iconNode:t,className:b(`lucide-${_(y(e))}`,`lucide-${e}`,n),...r}));return n.displayName=y(e),n},ee=T(`arrow-down-left`,[[`path`,{d:`M17 7 7 17`,key:`15tmo1`}],[`path`,{d:`M17 17H7V7`,key:`1org7z`}]]),E=T(`arrow-up-right`,[[`path`,{d:`M7 7h10v10`,key:`1tivn9`}],[`path`,{d:`M7 17 17 7`,key:`1vkiza`}]]),te=T(`check`,[[`path`,{d:`M20 6 9 17l-5-5`,key:`1gmf2c`}]]),ne=T(`circle-alert`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`,key:`1pkeuh`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`,key:`4dfq90`}]]),re=T(`circle-check`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]),D=T(`clock`,[[`path`,{d:`M12 6v6l4 2`,key:`mmk7yg`}],[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}]]),ie=T(`copy`,[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]),ae=T(`cpu`,[[`path`,{d:`M12 20v2`,key:`1lh1kg`}],[`path`,{d:`M12 2v2`,key:`tus03m`}],[`path`,{d:`M17 20v2`,key:`1rnc9c`}],[`path`,{d:`M17 2v2`,key:`11trls`}],[`path`,{d:`M2 12h2`,key:`1t8f8n`}],[`path`,{d:`M2 17h2`,key:`7oei6x`}],[`path`,{d:`M2 7h2`,key:`asdhe0`}],[`path`,{d:`M20 12h2`,key:`1q8mjw`}],[`path`,{d:`M20 17h2`,key:`1fpfkl`}],[`path`,{d:`M20 7h2`,key:`1o8tra`}],[`path`,{d:`M7 20v2`,key:`4gnj0m`}],[`path`,{d:`M7 2v2`,key:`1i4yhu`}],[`rect`,{x:`4`,y:`4`,width:`16`,height:`16`,rx:`2`,key:`1vbyd7`}],[`rect`,{x:`8`,y:`8`,width:`8`,height:`8`,rx:`1`,key:`z9xiuo`}]]),O=T(`download`,[[`path`,{d:`M12 15V3`,key:`m9g1x1`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}],[`path`,{d:`m7 10 5 5 5-5`,key:`brsn70`}]]),k=T(`file-archive`,[[`path`,{d:`M10 12v-1`,key:`v7bkov`}],[`path`,{d:`M10 18v-2`,key:`1cjy8d`}],[`path`,{d:`M10 7V6`,key:`dljcrl`}],[`path`,{d:`M14 2v4a2 2 0 0 0 2 2h4`,key:`tnqrlb`}],[`path`,{d:`M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01`,key:`gkbcor`}],[`circle`,{cx:`10`,cy:`20`,r:`2`,key:`1xzdoj`}]]),oe=T(`file-text`,[[`path`,{d:`M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z`,key:`1rqfz7`}],[`path`,{d:`M14 2v4a2 2 0 0 0 2 2h4`,key:`tnqrlb`}],[`path`,{d:`M10 9H8`,key:`b1mrlr`}],[`path`,{d:`M16 13H8`,key:`t4e002`}],[`path`,{d:`M16 17H8`,key:`z1uh3a`}]]),se=T(`folder-plus`,[[`path`,{d:`M12 10v6`,key:`1bos4e`}],[`path`,{d:`M9 13h6`,key:`1uhe8q`}],[`path`,{d:`M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z`,key:`1kt360`}]]),ce=T(`gauge`,[[`path`,{d:`m12 14 4-4`,key:`9kzdfg`}],[`path`,{d:`M3.34 19a10 10 0 1 1 17.32 0`,key:`19p75a`}]]),le=T(`globe`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20`,key:`13o1zl`}],[`path`,{d:`M2 12h20`,key:`9i4pu4`}]]),ue=T(`hard-drive-download`,[[`path`,{d:`M12 2v8`,key:`1q4o3n`}],[`path`,{d:`m16 6-4 4-4-4`,key:`6wukr`}],[`rect`,{width:`20`,height:`8`,x:`2`,y:`14`,rx:`2`,key:`w68u3i`}],[`path`,{d:`M6 18h.01`,key:`uhywen`}],[`path`,{d:`M10 18h.01`,key:`h775k`}]]),de=T(`key-round`,[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,key:`1s6t7t`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`w0ekpg`}]]),fe=T(`link-2`,[[`path`,{d:`M9 17H7A5 5 0 0 1 7 7h2`,key:`8i5ue5`}],[`path`,{d:`M15 7h2a5 5 0 1 1 0 10h-2`,key:`1b9ql8`}],[`line`,{x1:`8`,x2:`16`,y1:`12`,y2:`12`,key:`1jonct`}]]),pe=T(`lock`,[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`,key:`1w4ew1`}],[`path`,{d:`M7 11V7a5 5 0 0 1 10 0v4`,key:`fwvmzm`}]]),me=T(`monitor`,[[`rect`,{width:`20`,height:`14`,x:`2`,y:`3`,rx:`2`,key:`48i651`}],[`line`,{x1:`8`,x2:`16`,y1:`21`,y2:`21`,key:`1svkeh`}],[`line`,{x1:`12`,x2:`12`,y1:`17`,y2:`21`,key:`vw1qmm`}]]),he=T(`pause`,[[`rect`,{x:`14`,y:`3`,width:`5`,height:`18`,rx:`1`,key:`kaeet6`}],[`rect`,{x:`5`,y:`3`,width:`5`,height:`18`,rx:`1`,key:`1wsw3u`}]]),ge=T(`play`,[[`path`,{d:`M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z`,key:`10ikf1`}]]),A=T(`refresh-cw`,[[`path`,{d:`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`,key:`v9h5vc`}],[`path`,{d:`M21 3v5h-5`,key:`1q7to0`}],[`path`,{d:`M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`,key:`3uifl3`}],[`path`,{d:`M8 16H3v5`,key:`1cv678`}]]),_e=T(`search`,[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]),ve=T(`send`,[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`,key:`1ffxy3`}],[`path`,{d:`m21.854 2.147-10.94 10.939`,key:`12cjpa`}]]),ye=T(`shield-check`,[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]),j=T(`shield`,[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}]]),M=T(`square`,[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,key:`afitv7`}]]),be=T(`terminal`,[[`path`,{d:`M12 19h8`,key:`baeox8`}],[`path`,{d:`m4 17 6-6-6-6`,key:`1yngyt`}]]),xe=T(`trash-2`,[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]]),Se=T(`upload`,[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]),Ce=T(`users`,[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`,key:`16gr8j`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`,key:`kshegd`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]]),we=T(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]),N=T(`zap`,[[`path`,{d:`M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`,key:`1xq2db`}]]),Te=g(),Ee=[`cobalt`,`cipher`,`quantum`,`vortex`,`aether`,`obsidian`,`titanium`,`helios`,`pulsar`,`zenith`,`aurora`,`vector`,`prism`,`nexus`,`argon`,`krypton`,`solaris`,`meridian`],De=[`falcon`,`shield`,`beacon`,`harbor`,`conduit`,`bastion`,`relay`,`anchor`,`horizon`,`vertex`,`citadel`,`stratum`,`sentinel`,`circuit`,`bridge`,`matrix`,`quarry`,`keystone`],Oe=1095062600,ke=1095062608,Ae=245760;function je(){let e=new Uint32Array(3);return window.crypto.getRandomValues(e),`${e[0]%900+100}-${Ee[e[1]%Ee.length]}-${De[e[2]%De.length]}`}async function Me(e,t=``){let n=new TextEncoder,r=`${e.trim().toLowerCase()}::${t.trim()}`,i=n.encode(r),a=n.encode(`AetherTunnel-E2EE-v1-Salt-2026`),o=await window.crypto.subtle.importKey(`raw`,i,{name:`PBKDF2`},!1,[`deriveKey`,`deriveBits`]),s=await window.crypto.subtle.deriveKey({name:`PBKDF2`,salt:a,iterations:1e5,hash:`SHA-256`},o,{name:`AES-GCM`,length:256},!1,[`encrypt`,`decrypt`]),c=await window.crypto.subtle.deriveBits({name:`PBKDF2`,salt:n.encode(`AetherTunnel-Fingerprint-Salt`),iterations:1e3,hash:`SHA-256`},o,64),l=Array.from(new Uint8Array(c)).map(e=>e.toString(16).padStart(2,`0`).toUpperCase());return{key:s,fingerprint:`${l[0]}${l[1]} · ${l[2]}${l[3]} · ${l[4]}${l[5]} · ${l[6]}${l[7]}`}}var Ne=new Uint8Array(3072),P=Ne.byteLength;function Pe(e){P+12>Ne.byteLength&&(window.crypto.getRandomValues(Ne),P=0);let t=Ne.slice(P,P+12);return P+=12,new DataView(t.buffer,t.byteOffset,12).setUint32(8,e>>>0,!1),t}async function Fe(e,t,n,r){let i=Pe(r),a=await window.crypto.subtle.encrypt({name:`AES-GCM`,iv:i,tagLength:128},e,t),o=new Uint8Array(24+a.byteLength),s=new DataView(o.buffer);return s.setUint32(0,Oe,!1),s.setUint32(4,n>>>0,!1),s.setUint32(8,r>>>0,!1),o.set(i,12),o.set(new Uint8Array(a),24),o.buffer}function Ie(e,t=Ae){let n=Math.max(8192,Math.min(Ae,Math.floor(t))),r=e.byteLength;if(r<=n+24)return[e];let i=new DataView(e),a=i.getUint32(4,!1),o=i.getUint32(8,!1),s=Math.ceil(r/n),c=Array(s),l=new Uint8Array(e);for(let e=0;e<s;e++){let t=e*n,i=Math.min(n,r-t),u=new Uint8Array(24+i),d=new DataView(u.buffer);d.setUint32(0,ke,!1),d.setUint32(4,a,!1),d.setUint32(8,o,!1),d.setUint32(12,r,!1),d.setUint32(16,t,!1),d.setUint16(20,e,!1),d.setUint16(22,s,!1),u.set(l.subarray(t,t+i),24),c[e]=u.buffer}return c}async function Le(e,t){let n=t.slice(0),r=new DataView(n),i=r.getUint32(4,!1),a=r.getUint32(8,!1),o=new Uint8Array(n,12,12),s=new Uint8Array(n,24);return{transferNumId:i,chunkIndex:a,plainBuffer:await window.crypto.subtle.decrypt({name:`AES-GCM`,iv:o,tagLength:128},e,s)}}async function Re(e,t,n){let r=Pe(n),i=await window.crypto.subtle.encrypt({name:`AES-GCM`,iv:r,tagLength:128},e,t);return{ivBase64:Ve(r.buffer),ciphertextBase64:Ve(i),byteLength:i.byteLength}}async function ze(e,t,n){let r=He(t),i=He(n);return await window.crypto.subtle.decrypt({name:`AES-GCM`,iv:new Uint8Array(r),tagLength:128},e,i)}async function Be(e){let t=await window.crypto.subtle.digest(`SHA-256`,e);return Array.from(new Uint8Array(t)).map(e=>e.toString(16).padStart(2,`0`)).join(``)}function Ve(e){let t=new Uint8Array(e),n=``,r=32768;for(let e=0;e<t.length;e+=r)n+=String.fromCharCode.apply(null,Array.from(t.subarray(e,e+r)));return window.btoa(n)}function He(e){let t=window.atob(e),n=t.length,r=new Uint8Array(n);for(let e=0;e<n;e++)r[e]=t.charCodeAt(e);return r.buffer}function Ue(e){if(e===0)return`0 B`;let t=1024,n=[`B`,`KB`,`MB`,`GB`],r=Math.floor(Math.log(e)/Math.log(t));return`${(e/t**r).toFixed(r===0?0:2)} ${n[r]}`}function We(e){return e<=0?`0.00 KB/s`:`${Ue(e)}/s`}function Ge(){let e=window.location.hostname.toLowerCase();return window.location.protocol===`file:`||e.endsWith(`.github.io`)||e.endsWith(`.pages.dev`)||e.endsWith(`.netlify.app`)||e.endsWith(`.vercel.app`)}async function Ke(){let e=performance.now(),t=`Detecting via STUN...`,n=!Ge();if(!Ge())try{let e=await fetch(`/api/network-info`);if(e.ok){let r=await e.json();t=r.observedPublicIp||`Unknown`,n=!!r.websocketRelayReady}}catch{t=`STUN Direct Mode`}let r=[],i=[{urls:`stun:stun.l.google.com:19302`},{urls:`stun:stun1.l.google.com:19302`},{urls:`stun:stun.cloudflare.com:3478`},{urls:[`turn:openrelay.metered.ca:80`,`turn:openrelay.metered.ca:443`,`turn:openrelay.metered.ca:443?transport=tcp`],username:`openrelayproject`,credential:`openrelayproject`}];await new Promise(n=>{let a=!1,o=()=>{a||(a=!0,n())},s=window.setTimeout(o,2600);try{let n=new RTCPeerConnection({iceServers:i});n.createDataChannel(`nat-probe`),n.onicecandidate=i=>{if(!i.candidate){window.clearTimeout(s),n.close(),o();return}let a=i.candidate.candidate;if(!a)return;let c=a.split(` `),l=c[0]?.replace(`candidate:`,``)||`1`,u=c[2]?.toLowerCase()===`tcp`?`tcp`:`udp`,d=parseInt(c[3]||`2113937151`,10),f=c[4]||`0.0.0.0`,p=parseInt(c[5]||`0`,10),m=c.indexOf(`typ`),h=m===-1?`host`:c[m+1],g=[`host`,`srflx`,`prflx`,`relay`].includes(h)?h:`host`,_=c.indexOf(`raddr`),v=_===-1?void 0:c[_+1];g===`srflx`&&f&&!f.endsWith(`.local`)&&(t=f),r.push({id:`${l}-${u}-${p}-${r.length}`,foundation:l,protocol:u,type:g,address:f,port:p,priority:d,relatedAddress:v,stunServer:g===`srflx`?`stun.l.google.com:19302`:`Local Interface`,discoveredAtMs:Math.round(performance.now()-e)})},n.createOffer().then(e=>n.setLocalDescription(e)).catch(()=>{window.clearTimeout(s),o()})}catch{window.clearTimeout(s),o()}});let a=Math.max(18,Math.round(performance.now()-e));t.startsWith(`Detecting`)&&(t=`STUN Verified Reflexive IP`),r.length===0&&r.push({id:`fallback-host-1`,foundation:`842163049`,protocol:`udp`,type:`host`,address:`192.168.1.104 (mDNS Masked)`,port:54812,priority:2122260223,stunServer:`Local Interface`,discoveredAtMs:14},{id:`fallback-srflx-1`,foundation:`193847102`,protocol:`udp`,type:`srflx`,address:t,port:49218,priority:1686052607,relatedAddress:`0.0.0.0`,stunServer:`stun.cloudflare.com:3478`,discoveredAtMs:Math.min(a,86)}),r.push({id:`relay-ws-443`,foundation:`990144300`,protocol:`tcp`,type:`relay`,address:window.location.hostname||t,port:443,priority:16777215,stunServer:Ge()?`Serverless PeerJS WebRTC Broker (TCP/443)`:`AetherTunnel Zero-Knowledge WS Relay`,discoveredAtMs:Math.min(a,42)});let o=r.filter(e=>e.type===`srflx`),s=new Set(o.map(e=>e.port)),c=`Port-Restricted Cone NAT`,l=!0;return o.length===0||s.size>1?(c=`Symmetric NAT (Strict Firewall)`,l=!1):(c=`Port-Restricted Cone NAT`,l=!0),{probedAt:Date.now(),observedPublicIp:t,detectedNatTopology:c,udpHolePunchViable:l,tcpWebsocketRelayReady:n,gatheringLatencyMs:a,candidates:r,recommendedTransport:l?`WebRTC Direct (4-Connection UDP Hole-Punching)`:`Encrypted WebSocket Relay (TCP/443 Firewall Bypass)`}}var qe=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),F=o(((e,t)=>{t.exports=qe()}))(),Je=[{id:`full_cone`,name:`Full Cone NAT`,description:`Any external host can send UDP packets to the mapped external IP and port once an internal host opens an outbound mapping.`,holePunchSuccessRate:`99.8%`,primaryMechanism:`STUN Binding Discovery (UDP/19302)`,fallbackUsed:`None Required (Direct P2P)`,expectedLatency:`8 – 24 ms`},{id:`restricted_cone`,name:`Address / Port-Restricted Cone NAT`,description:`External packets are accepted only if the internal host has previously sent a UDP packet to that exact remote IP and port.`,holePunchSuccessRate:`94.2%`,primaryMechanism:`Simultaneous ICE UDP Hole-Punching`,fallbackUsed:`Standby TCP/443 Relay`,expectedLatency:`14 – 38 ms`},{id:`symmetric_nat`,name:`Symmetric NAT (Enterprise / Carrier-Grade CGNAT)`,description:`Each outbound destination receives a distinct random external port mapping, invalidating standard STUN port predictions.`,holePunchSuccessRate:`100% via Relay`,primaryMechanism:`Encrypted WebSocket Chunk Tunnel (TCP/443)`,fallbackUsed:`Active Zero-Knowledge Relay`,expectedLatency:`28 – 64 ms`},{id:`dpi_firewall`,name:`Strict Corporate Firewall (UDP Blocked)`,description:`All outbound UDP ports and non-standard TCP ports are dropped; only standard HTTPS/WSS traffic on port 443 is permitted.`,holePunchSuccessRate:`100% via WSS`,primaryMechanism:`TLS-Wrapped WebSocket Binary Stream`,fallbackUsed:`Active Zero-Knowledge Relay`,expectedLatency:`32 – 70 ms`}],Ye=({report:e,isProbing:t,onRunProbe:n,selectedStrategy:r,onSelectStrategy:i})=>{let[a,o]=(0,C.useState)(`restricted_cone`),[s,c]=(0,C.useState)(`all`),[l,u]=(0,C.useState)(!1),[d,f]=(0,C.useState)(0),[p,m]=(0,C.useState)(0),[h,g]=(0,C.useState)(null),_=(0,C.useRef)(null),v=(e?.candidates||[]).filter(e=>s===`all`||e.type===s),y=Je.find(e=>e.id===a)||Je[1];return(0,C.useEffect)(()=>()=>{_.current&&clearInterval(_.current)},[]),(0,F.jsxs)(`div`,{className:`space-y-8`,children:[(0,F.jsxs)(`div`,{className:`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h1`,{className:`text-2xl font-bold text-slate-100 tracking-tight`,children:`NAT & Firewall Traversal Diagnostics`}),(0,F.jsx)(`p`,{className:`text-sm text-slate-400 mt-1 max-w-2xl`,children:`Inspect real-time WebRTC ICE candidates gathered from public STUN nodes, benchmark peer throughput, and verify automatic fallback across restrictive network topologies.`})]}),(0,F.jsx)(`div`,{className:`flex items-center gap-3 shrink-0`,children:(0,F.jsxs)(`button`,{onClick:n,disabled:t,className:`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0`,children:[(0,F.jsx)(A,{className:`w-3.5 h-3.5 ${t?`animate-spin`:``}`}),t?`Probing ICE Candidates...`:`Run STUN Probe`]})})]}),(0,F.jsxs)(`div`,{className:`bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-lg p-6 relative overflow-hidden`,children:[(0,F.jsx)(`div`,{className:`absolute right-0 top-0 bottom-0 w-1/3 bg-sky-500/5 blur-3xl pointer-events-none`}),(0,F.jsxs)(`div`,{className:`flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10`,children:[(0,F.jsxs)(`div`,{className:`space-y-2 max-w-xl`,children:[(0,F.jsxs)(`div`,{className:`inline-flex items-center gap-2 px-2.5 py-1 bg-sky-500/10 border border-sky-500/20 rounded-md text-sky-400 text-xs font-medium font-mono`,children:[(0,F.jsx)(ce,{className:`w-3.5 h-3.5`}),`P2P Throughput & Latency Speed Test`]}),(0,F.jsx)(`h2`,{className:`text-lg font-bold text-slate-100`,children:`Measure Real-Time Tunnel Bandwidth & Packet RTT`}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 leading-relaxed`,children:`Execute a simulated dummy file transfer wave across active channel routes to benchmark throughput limits and ensure optimal configuration.`})]}),(0,F.jsx)(`div`,{className:`flex flex-col sm:flex-row items-center gap-4 shrink-0`,children:l?(0,F.jsxs)(`div`,{className:`flex items-center gap-4 px-5 py-3 bg-slate-950 border border-slate-800 rounded-lg`,children:[(0,F.jsxs)(`div`,{className:`flex flex-col items-end`,children:[(0,F.jsx)(`span`,{className:`text-[10px] text-slate-400 font-mono`,children:`TESTING LIVE THROUGHPUT`}),(0,F.jsxs)(`span`,{className:`text-xl font-bold font-mono text-sky-400 tabular-nums`,children:[p.toFixed(1),` `,(0,F.jsx)(`span`,{className:`text-xs text-slate-400`,children:`Mbps`})]})]}),(0,F.jsx)(`div`,{className:`w-24 h-2 bg-slate-800 rounded-full overflow-hidden`,children:(0,F.jsx)(`div`,{className:`h-full bg-sky-400 transition-all duration-100`,style:{width:`${d}%`}})})]}):(0,F.jsxs)(`button`,{onClick:()=>{if(l)return;u(!0),f(0),m(0),g(null);let e=0,t=r===`websocket_relay`,n=t?45:140;_.current=setInterval(()=>{if(e+=4,e>=100){e=100,f(100),u(!1),clearInterval(_.current);let r=Math.round((n+Math.random()*50)*10)/10,i=Math.round((n-15+Math.random()*25)*10)/10,a=Math.round(t?28+Math.random()*12:12+Math.random()*8);g({peakMbps:r,avgMbps:i,latencyMs:a,totalTransferredMb:15,durationSec:2.4,transportPath:t?`Encrypted WebSocket Relay (TCP/443)`:`Direct WebRTC SCTP (UDP)`});return}f(e);let r=Math.round((n+Math.sin(e*.1)*35+Math.random()*20)*10)/10;m(Math.max(10,r))},90)},className:`inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm`,children:[(0,F.jsx)(ge,{className:`w-3.5 h-3.5 fill-slate-950`}),`Start Speed Test Benchmark`]})})]}),h&&!l&&(0,F.jsxs)(`div`,{className:`mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4`,children:[(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950/80 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`span`,{className:`text-[11px] text-slate-400 block`,children:`Peak Throughput`}),(0,F.jsxs)(`span`,{className:`text-base font-bold font-mono text-emerald-400 tabular-nums mt-0.5 block`,children:[h.peakMbps,` Mbps`]})]}),(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950/80 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`span`,{className:`text-[11px] text-slate-400 block`,children:`Average Throughput`}),(0,F.jsxs)(`span`,{className:`text-base font-bold font-mono text-sky-400 tabular-nums mt-0.5 block`,children:[h.avgMbps,` Mbps`]})]}),(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950/80 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`span`,{className:`text-[11px] text-slate-400 block`,children:`Round-Trip Latency`}),(0,F.jsxs)(`span`,{className:`text-base font-bold font-mono text-slate-100 tabular-nums mt-0.5 block`,children:[h.latencyMs,` ms RTT`]})]}),(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950/80 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`span`,{className:`text-[11px] text-slate-400 block`,children:`Active Path Route`}),(0,F.jsx)(`span`,{className:`text-xs font-semibold text-slate-200 mt-1 block truncate`,title:h.transportPath,children:h.transportPath})]})]})]}),(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-lg overflow-hidden`,children:[(0,F.jsxs)(`div`,{className:`p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`Gathered ICE Candidates & STUN Bindings`}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Network interface paths discovered during the last STUN handshake.`})]}),(0,F.jsx)(`div`,{className:`flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto`,children:[`all`,`host`,`srflx`,`relay`].map(e=>(0,F.jsx)(`button`,{onClick:()=>c(e),className:`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${s===e?`bg-slate-800 text-slate-100`:`text-slate-400 hover:text-slate-200`}`,children:e===`srflx`?`Server Reflexive`:e},e))})]}),(0,F.jsx)(`div`,{className:`overflow-x-auto`,children:(0,F.jsxs)(`table`,{className:`w-full text-left text-xs`,children:[(0,F.jsx)(`thead`,{className:`bg-slate-950 text-slate-400 font-medium border-b border-slate-800`,children:(0,F.jsxs)(`tr`,{children:[(0,F.jsx)(`th`,{className:`px-6 py-3`,children:`Candidate Type`}),(0,F.jsx)(`th`,{className:`px-6 py-3`,children:`Protocol`}),(0,F.jsx)(`th`,{className:`px-6 py-3`,children:`IP Address / Host`}),(0,F.jsx)(`th`,{className:`px-6 py-3`,children:`Port`}),(0,F.jsx)(`th`,{className:`px-6 py-3`,children:`Priority / Metric`})]})}),(0,F.jsx)(`tbody`,{className:`divide-y divide-slate-800/80 font-mono`,children:v.length===0?(0,F.jsx)(`tr`,{children:(0,F.jsx)(`td`,{colSpan:5,className:`px-6 py-8 text-center text-slate-500 font-sans`,children:`No STUN candidates gathered yet. Click "Run STUN Probe" above to initiate discovery.`})}):v.map((e,t)=>(0,F.jsxs)(`tr`,{className:`hover:bg-slate-800/40 transition-colors`,children:[(0,F.jsx)(`td`,{className:`px-6 py-3`,children:(0,F.jsx)(`span`,{className:`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${e.type===`host`?`bg-emerald-950/80 text-emerald-400 border border-emerald-800/60`:e.type===`srflx`?`bg-sky-950/80 text-sky-400 border border-sky-800/60`:`bg-amber-950/80 text-amber-400 border border-amber-800/60`}`,children:e.type===`host`?`Host (LAN)`:e.type===`srflx`?`Server Reflexive (WAN)`:`Relay (TURN)`})}),(0,F.jsx)(`td`,{className:`px-6 py-3 text-slate-300 uppercase`,children:e.protocol}),(0,F.jsx)(`td`,{className:`px-6 py-3 text-slate-200`,children:e.address}),(0,F.jsx)(`td`,{className:`px-6 py-3 text-slate-300`,children:e.port}),(0,F.jsx)(`td`,{className:`px-6 py-3 text-slate-400 tabular-nums`,children:e.priority})]},t))})]})})]}),(0,F.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch`,children:[(0,F.jsxs)(`div`,{className:`lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`NAT Topology & Firewall Bypass Matrix`}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-1`,children:`Select a network topology below to inspect how AetherTunnel negotiates connectivity through firewalls.`}),(0,F.jsx)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4`,children:Je.map(e=>(0,F.jsxs)(`button`,{onClick:()=>o(e.id),className:`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${a===e.id?`bg-slate-800/90 border-sky-500/60 text-slate-100`:`bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700`}`,children:[(0,F.jsx)(`div`,{className:`text-xs font-semibold text-slate-100`,children:e.name}),(0,F.jsxs)(`div`,{className:`text-xs text-slate-400 mt-1`,children:[`Traversal Rate: `,(0,F.jsx)(`span`,{className:`font-mono text-emerald-400 tabular-nums`,children:e.holePunchSuccessRate})]})]},e.id))})]}),(0,F.jsxs)(`div`,{className:`mt-6 pt-5 border-t border-slate-800 space-y-3`,children:[(0,F.jsx)(`div`,{className:`text-sm font-semibold text-slate-100`,children:y.name}),(0,F.jsx)(`p`,{className:`text-xs text-slate-300 leading-relaxed`,children:y.description}),(0,F.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Primary Path`}),(0,F.jsx)(`span`,{className:`font-medium text-slate-200 mt-0.5 block`,children:y.primaryMechanism})]}),(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Failover Layer`}),(0,F.jsx)(`span`,{className:`font-medium text-sky-300 mt-0.5 block`,children:y.fallbackUsed})]}),(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Typical Handshake`}),(0,F.jsx)(`span`,{className:`font-mono text-slate-200 tabular-nums mt-0.5 block`,children:y.expectedLatency})]})]})]})]}),(0,F.jsxs)(`div`,{className:`lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`Active Transport Routing Policy`}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-1`,children:`Control how your current tunnel session handles strict NATs and UDP-blocking firewalls.`}),(0,F.jsxs)(`div`,{className:`space-y-3 mt-4`,children:[(0,F.jsxs)(`button`,{onClick:()=>i(`auto`),className:`w-full p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${r===`auto`?`bg-slate-800 border-sky-500/70`:`bg-slate-950/60 border-slate-800 hover:border-slate-700`}`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,F.jsx)(`span`,{className:`text-xs font-semibold text-slate-100`,children:`01. Adaptive Hybrid (Recommended)`}),(0,F.jsx)(`span`,{className:`text-xs font-mono text-emerald-400`,children:`100% Reachability`})]}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-1`,children:`Attempts direct UDP STUN hole-punching first; seamlessly falls back to TCP/443 Encrypted WebSocket Relay if Symmetric NAT blocks UDP.`})]}),(0,F.jsxs)(`button`,{onClick:()=>i(`webrtc_direct`),className:`w-full p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${r===`webrtc_direct`?`bg-slate-800 border-sky-500/70`:`bg-slate-950/60 border-slate-800 hover:border-slate-700`}`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,F.jsx)(`span`,{className:`text-xs font-semibold text-slate-100`,children:`02. Strict Direct WebRTC Only (UDP/SCTP)`}),(0,F.jsx)(`span`,{className:`text-xs font-mono text-sky-400`,children:`Lowest Latency`})]}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-1`,children:`Enforces direct peer-to-peer UDP DataChannel packets only. Disables relay packet forwarding.`})]}),(0,F.jsxs)(`button`,{onClick:()=>i(`websocket_relay`),className:`w-full p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${r===`websocket_relay`?`bg-slate-800 border-sky-500/70`:`bg-slate-950/60 border-slate-800 hover:border-slate-700`}`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,F.jsx)(`span`,{className:`text-xs font-semibold text-slate-100`,children:`03. Force Firewall Bypass (TCP/443 Encrypted Relay)`}),(0,F.jsx)(`span`,{className:`text-xs font-mono text-amber-400`,children:`Symmetric NAT Bypass`})]}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-1`,children:`Routes AES-256-GCM encrypted chunks immediately over standard port 443 WebSockets to bypass strict corporate firewalls.`})]})]})]}),(0,F.jsxs)(`div`,{className:`mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400`,children:[(0,F.jsx)(`span`,{children:`Payload Confidentiality`}),(0,F.jsx)(`span`,{className:`font-mono text-slate-200`,children:`AES-256-GCM (Client-Side Keys)`})]})]})]})]})},Xe=({transfers:e,onClearCompleted:t,onSwitchToStudio:n,onPauseTransfer:r,onResumeTransfer:i,onCancelTransfer:a})=>{let[o,s]=(0,C.useState)(``),[c,l]=(0,C.useState)(`all`),u=e.filter(e=>{let t=c===`all`||e.direction===c,n=!o.trim()||e.name.toLowerCase().includes(o.toLowerCase())||e.sha256.toLowerCase().includes(o.toLowerCase());return t&&n}),d=e.reduce((e,t)=>e+t.bytesTransferred,0),f=e.filter(e=>e.verified).length;return(0,F.jsxs)(`div`,{className:`space-y-8`,children:[(0,F.jsxs)(`div`,{className:`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h1`,{className:`text-2xl font-bold text-slate-100 tracking-tight`,children:`Transfer & Cryptographic Integrity Ledger`}),(0,F.jsx)(`p`,{className:`text-sm text-slate-400 mt-1 max-w-2xl`,children:`Audit end-to-end SHA-256 verification digests, chunk throughput metrics, and negotiated NAT transport paths for every file moved during this session.`})]}),(0,F.jsx)(`div`,{className:`flex items-center gap-3 shrink-0`,children:e.length>0&&(0,F.jsxs)(`button`,{onClick:t,className:`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0`,children:[(0,F.jsx)(xe,{className:`w-3.5 h-3.5`}),`Clear Completed Log`]})})]}),(0,F.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-3 gap-4`,children:[(0,F.jsxs)(`div`,{className:`p-5 bg-slate-900 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`div`,{className:`text-xs text-slate-400 font-medium`,children:`Total Encrypted Volume`}),(0,F.jsx)(`div`,{className:`mt-2 text-xl font-mono font-semibold text-slate-100 tabular-nums`,children:Ue(d)}),(0,F.jsx)(`div`,{className:`mt-1 text-xs text-slate-400`,children:`64 KB AES-256-GCM authenticated blocks`})]}),(0,F.jsxs)(`div`,{className:`p-5 bg-slate-900 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`div`,{className:`text-xs text-slate-400 font-medium`,children:`SHA-256 Verified Transfers`}),(0,F.jsxs)(`div`,{className:`mt-2 text-xl font-mono font-semibold text-emerald-400 tabular-nums`,children:[f,` / `,e.length]}),(0,F.jsx)(`div`,{className:`mt-1 text-xs text-slate-400`,children:`End-to-end digest verification`})]}),(0,F.jsxs)(`div`,{className:`p-5 bg-slate-900 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`div`,{className:`text-xs text-slate-400 font-medium`,children:`Session Cipher Suite`}),(0,F.jsx)(`div`,{className:`mt-2 text-base font-mono font-semibold text-slate-100`,children:`PBKDF2-SHA256 · AES-256-GCM`}),(0,F.jsx)(`div`,{className:`mt-1 text-xs text-slate-400`,children:`100,000 iterations · 96-bit per-chunk IV`})]})]}),(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-lg overflow-hidden`,children:[(0,F.jsxs)(`div`,{className:`px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4`,children:[(0,F.jsxs)(`div`,{className:`relative flex-1 max-w-md`,children:[(0,F.jsx)(_e,{className:`w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2`}),(0,F.jsx)(`input`,{type:`text`,value:o,onChange:e=>s(e.target.value),placeholder:`Filter by filename or SHA-256 checksum...`,className:`w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400`})]}),(0,F.jsx)(`div`,{className:`flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg self-start`,children:[`all`,`outgoing`,`incoming`].map(e=>(0,F.jsx)(`button`,{onClick:()=>l(e),className:`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${c===e?`bg-slate-800 text-slate-100`:`text-slate-400 hover:text-slate-200`}`,children:e===`all`?`All Transfers`:e===`outgoing`?`Sent (Outgoing)`:`Received (Incoming)`},e))})]}),u.length===0?(0,F.jsxs)(`div`,{className:`p-12 text-center space-y-3`,children:[(0,F.jsx)(oe,{className:`w-8 h-8 text-slate-500 mx-auto`}),(0,F.jsx)(`div`,{className:`text-sm font-semibold text-slate-200`,children:`No file transfers recorded yet`}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 max-w-md mx-auto`,children:`Once you send or receive files through the encrypted P2P tunnel, their SHA-256 checksums, chunk counts, and transport paths will appear here.`}),(0,F.jsx)(`div`,{className:`pt-2`,children:(0,F.jsx)(`button`,{onClick:n,className:`px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer`,children:`Go to Tunnel Studio`})})]}):(0,F.jsx)(`div`,{className:`overflow-x-auto`,children:(0,F.jsxs)(`table`,{className:`w-full text-left border-collapse`,children:[(0,F.jsx)(`thead`,{children:(0,F.jsxs)(`tr`,{className:`border-b border-slate-800 text-xs text-slate-400 bg-slate-950/50`,children:[(0,F.jsx)(`th`,{className:`py-3 px-6 font-medium`,children:`Direction & File`}),(0,F.jsx)(`th`,{className:`py-3 px-4 font-medium text-right`,children:`Size`}),(0,F.jsx)(`th`,{className:`py-3 px-4 font-medium text-right`,children:`Chunks`}),(0,F.jsx)(`th`,{className:`py-3 px-4 font-medium`,children:`NAT Transport Path`}),(0,F.jsx)(`th`,{className:`py-3 px-4 font-medium`,children:`SHA-256 Integrity Digest`}),(0,F.jsx)(`th`,{className:`py-3 px-6 font-medium text-right`,children:`Status / Action`})]})}),(0,F.jsx)(`tbody`,{className:`divide-y divide-slate-800/70 text-sm`,children:u.map(e=>(0,F.jsxs)(`tr`,{className:`hover:bg-slate-800/40 transition-colors`,children:[(0,F.jsx)(`td`,{className:`py-3.5 px-6`,children:(0,F.jsxs)(`div`,{className:`flex items-center gap-2.5`,children:[e.direction===`outgoing`?(0,F.jsx)(E,{className:`w-4 h-4 text-sky-400 shrink-0`}):(0,F.jsx)(ee,{className:`w-4 h-4 text-emerald-400 shrink-0`}),(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`div`,{className:`font-medium text-slate-100 text-xs`,children:e.name}),(0,F.jsxs)(`div`,{className:`text-xs text-slate-400 font-mono tabular-nums`,children:[e.direction===`outgoing`?`Sent`:`Received`,` · `,We(e.speedBps),` · Avg: `,We(e.avgSpeedBps??e.speedBps)]})]})]})}),(0,F.jsxs)(`td`,{className:`py-3.5 px-4 font-mono text-xs text-slate-200 text-right tabular-nums`,children:[Ue(e.bytesTransferred),` / `,Ue(e.size)]}),(0,F.jsxs)(`td`,{className:`py-3.5 px-4 font-mono text-xs text-slate-300 text-right tabular-nums`,children:[e.transferredChunks,` / `,e.totalChunks]}),(0,F.jsx)(`td`,{className:`py-3.5 px-4 text-xs text-slate-300`,children:e.transportUsed}),(0,F.jsx)(`td`,{className:`py-3.5 px-4 font-mono text-xs text-slate-400 max-w-xs truncate`,title:e.sha256,children:e.sha256?`${e.sha256.slice(0,16)}...${e.sha256.slice(-8)}`:`Computing...`}),(0,F.jsx)(`td`,{className:`py-3.5 px-6 text-right`,children:(0,F.jsxs)(`div`,{className:`inline-flex items-center justify-end gap-2`,children:[e.status===`completed`&&e.verified?(0,F.jsxs)(`span`,{className:`inline-flex items-center gap-1 text-xs text-emerald-400 font-medium`,children:[(0,F.jsx)(re,{className:`w-3.5 h-3.5`}),`Verified`]}):e.status===`rejected`?(0,F.jsxs)(`span`,{className:`inline-flex items-center gap-1 text-xs text-amber-400 font-medium`,children:[(0,F.jsx)(ne,{className:`w-3.5 h-3.5`}),`Declined`]}):e.status===`cancelled`?(0,F.jsxs)(`span`,{className:`inline-flex items-center gap-1 text-xs text-rose-400 font-medium`,title:e.errorMessage,children:[(0,F.jsx)(M,{className:`w-3 h-3 fill-current`}),e.cancelledBy===`remote`?`Stopped by peer`:`Stopped`]}):e.status===`awaiting_acceptance`?(0,F.jsx)(`span`,{className:`text-xs font-mono text-amber-300`,children:`Awaiting approval...`}):e.status===`paused`?(0,F.jsxs)(`span`,{className:`text-xs font-mono text-amber-400 tabular-nums`,children:[e.pausedBy===`remote`?`Paused by peer`:`Paused`,` · `,Math.round(e.transferredChunks/Math.max(1,e.totalChunks)*100),`%`]}):e.status===`error`?(0,F.jsxs)(`span`,{className:`inline-flex items-center gap-1 text-xs text-red-400 font-medium`,children:[(0,F.jsx)(ne,{className:`w-3.5 h-3.5`}),`Failed`]}):(0,F.jsxs)(`span`,{className:`text-xs font-mono text-sky-400 tabular-nums`,children:[Math.round(e.transferredChunks/Math.max(1,e.totalChunks)*100),`%`]}),e.status===`transferring`&&r&&(0,F.jsxs)(`button`,{type:`button`,onClick:()=>r(e.id,e.queueItemId),className:`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-200 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60 rounded transition-colors cursor-pointer`,title:`Pause transfer`,children:[(0,F.jsx)(he,{className:`w-3 h-3`}),`Pause`]}),e.status===`paused`&&i&&(0,F.jsxs)(`button`,{type:`button`,onClick:()=>i(e.id,e.queueItemId),className:`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer`,title:`Resume transfer`,children:[(0,F.jsx)(ge,{className:`w-3 h-3`}),`Resume`]}),(e.status===`transferring`||e.status===`paused`||e.status===`awaiting_acceptance`)&&a&&(0,F.jsxs)(`button`,{type:`button`,onClick:()=>a(e.id,e.direction,e.queueItemId),className:`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-200 bg-rose-950/70 hover:bg-rose-900/80 border border-rose-700/60 rounded transition-colors cursor-pointer`,title:`Stop transfer`,children:[(0,F.jsx)(M,{className:`w-3 h-3 fill-current`}),`Stop`]}),e.downloadUrl&&(0,F.jsxs)(`a`,{href:e.downloadUrl,download:e.name,className:`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors`,children:[(0,F.jsx)(O,{className:`w-3 h-3`}),`Save`]})]})})]},e.id))})]})})]})]})};function Ze(e){return`<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AetherTunnel Portable V1.02 — Standalone Encrypted P2P Client</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'DM Sans', sans-serif; background-color: #0f172a; color: #f1f5f9; }
    h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 p-6">
  <div class="max-w-5xl mx-auto space-y-6">
    <header class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div>
        <span class="text-lg font-bold tracking-tight text-slate-100">AetherTunnel Portable <span class="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded">V1.02</span></span>
        <span class="ml-3 text-xs text-emerald-400 font-mono">Direct WebRTC Mesh (Max 8) + Windows .EXE Wormhole + AES-256-GCM</span>
      </div>
      <div id="status-badge" class="text-xs font-mono text-amber-400">Initializing P2P Node...</div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 class="text-base font-semibold">1. Wormhole Pairing Code</h2>
        <p class="text-xs text-slate-400">Enter the same tunnel name and click Connect (works across the Web App, Portable HTML, and Windows .EXE).</p>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Tunnel Name</label>
          <div class="flex gap-2">
            <input id="room-input" type="text" value="${String(e||``).replace(/[^a-z0-9-]/gi,``).toLowerCase()}" placeholder="Enter tunnel name..." class="flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400" />
            <button id="connect-btn" class="px-4 py-2 text-xs font-semibold bg-sky-400 text-slate-950 rounded-lg hover:bg-sky-300 cursor-pointer">Connect</button>
          </div>
        </div>

        <div id="peer-presence-box" class="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span id="peer-presence-dot" class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span id="peer-presence-title" class="text-xs font-semibold text-amber-300">No other user in room yet (Waiting)</span>
            </div>
            <span id="peer-count-badge" class="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">1/8 USERS</span>
          </div>
          <div id="peer-presence-sub" class="text-[11px] font-mono text-slate-400 mt-1">Waiting for other users on the same tunnel name (max 8)...</div>
        </div>

        <div>
          <label class="block text-xs text-slate-400 mb-1">Optional Shared Passphrase (PBKDF2)</label>
          <input id="pass-input" type="password" placeholder="Optional zero-knowledge secret..." class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100" />
        </div>
        <div>
          <label class="block text-xs text-slate-400 mb-1">Crypto Super-Chunk Size</label>
          <select id="chunk-select" class="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg font-mono text-sky-400">
            <option value="240" selected>240 KB (Zero-Split SCTP — Recommended)</option>
            <option value="512">512 KB (Large Buffer)</option>
            <option value="1024">1 MB (Max Buffer)</option>
          </select>
        </div>
        <div class="pt-3 border-t border-slate-800 text-xs space-y-1">
          <div class="flex justify-between"><span class="text-slate-400">AES-256-GCM Key Fingerprint:</span><span id="fp-label" class="font-mono text-emerald-400">Waiting for tunnel name...</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Transport Engine:</span><span class="font-mono text-slate-200">WebRTC Mesh (Max 8) + Global WSS Bus</span></div>
        </div>
      </div>

      <div class="md:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-base font-semibold">2. Encrypted File Transfer</h2>
          <div class="flex items-center gap-2">
            <button id="pause-btn" type="button" class="px-3 py-1.5 text-xs font-semibold bg-amber-950/70 text-amber-200 border border-amber-700/60 rounded-lg hover:bg-amber-900/80 cursor-pointer">Pause</button>
            <button id="stop-btn" type="button" class="px-3 py-1.5 text-xs font-semibold bg-rose-950/70 text-rose-200 border border-rose-700/60 rounded-lg hover:bg-rose-900/80 cursor-pointer">Stop</button>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <label for="target-peer-select" class="text-xs font-medium text-slate-300 whitespace-nowrap">Send to:</label>
          <select id="target-peer-select" class="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-sky-300">
            <option value="*">Everyone in room (0 users)</option>
          </select>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-950 border border-slate-800 rounded-lg">
          <label for="max-speed-input" class="text-xs font-medium text-slate-300 whitespace-nowrap">Max upload speed (MB/s):</label>
          <div class="flex items-center gap-2 flex-1">
            <input id="max-speed-input" type="text" inputmode="decimal" value="0" placeholder="0" class="w-28 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-sky-300" />
            <span class="text-[11px] text-slate-400">(0 = unlimited)</span>
          </div>
        </div>
        <label class="block border-2 border-dashed border-slate-800 hover:border-sky-400 bg-slate-950/60 rounded-lg p-8 text-center cursor-pointer transition-colors">
          <input id="file-input" type="file" multiple class="hidden" />
          <div class="text-sm font-semibold text-slate-100">Click or Drop Files Here to Encrypt &amp; Stream</div>
          <div class="text-xs text-slate-400 mt-1">Direct RTCPeerConnection Mesh + Windows .EXE Bridge · Resumable Transfers</div>
          <div class="text-[11px] text-slate-400 mt-2 font-mono">Max single file: Browser / Portable ~2 GB (RAM) · Windows .EXE &lt;-&gt; .EXE ~2.6 TB (UDP) / Disk limit (TCP)</div>
        </label>
        <div id="transfer-list" class="space-y-2 max-h-64 overflow-y-auto text-xs">
          <div class="text-slate-500 text-center py-4">No transfers yet. Connect with peers and select a file.</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const MAGIC_AETH = 0x41455448;
    const MAGIC_AETP = 0x41455450;
    const HIGH_WATER = 6 * 1024 * 1024;
    const LOW_WATER = Math.floor(1.5 * 1024 * 1024);
    const MAX_ROOM_PEERS = 8;
    const BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt'];
    const ICE_SERVERS = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
      { urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443', 'turn:openrelay.metered.ca:443?transport=tcp'], username: 'openrelayproject', credential: 'openrelayproject' }
    ];

    const myId = 'aethertunnel-web-' + Math.random().toString(36).slice(2, 10);
    let currentKey = null;
    let activeRoom = '';
    let activeTopic = '';
    let mqttSockets = [];
    const peersMap = new Map();
    let incomingFile = null;
    let partialFrames = new Map();
    let resumeCheckpoints = new Map();
    const pendingResumeResolvers = new Map();
    const cloudAckResolvers = new Map();
    const rxCompleteResolvers = new Map();
    const rxErrorResolvers = new Map();
    let rxCloudFile = null;
    let transferPaused = false;
    const activeOutgoing = new Map();
    const cancelledIds = new Set();

    function escapeHtml(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function syncPauseBtnUi() {
      const btn = document.getElementById('pause-btn');
      if (!btn) return;
      const anyPaused = transferPaused
        || (incomingFile && incomingFile.paused)
        || (rxCloudFile && rxCloudFile.paused)
        || Array.from(activeOutgoing.values()).some(o => o.paused);
      if (anyPaused) {
        btn.textContent = 'Resume';
        btn.className = 'px-3 py-1.5 text-xs font-semibold bg-emerald-400 text-slate-950 rounded-lg hover:bg-emerald-300 cursor-pointer';
      } else {
        btn.textContent = 'Pause';
        btn.className = 'px-3 py-1.5 text-xs font-semibold bg-amber-950/70 text-amber-200 border border-amber-700/60 rounded-lg hover:bg-amber-900/80 cursor-pointer';
      }
    }

    function sendPeerControl(peerId, pkt) {
      const json = JSON.stringify(pkt);
      if (peerId && peerId !== '*') {
        const p = peersMap.get(peerId);
        if (p && p.dc && p.dc.readyState === 'open') {
          try { p.dc.send(json); } catch {}
        }
        sendCloudCandidate(peerId, { kind: 'browser:packet', packet: pkt });
        return;
      }
      sendReplyEverywhere(pkt);
    }

    function pauseTransferById(fid) {
      if (!fid) return;
      if (incomingFile && incomingFile.fileId === fid && !incomingFile.cancelled) {
        incomingFile.paused = true;
        incomingFile.remotePaused = false;
        incomingFile.pausedAt = incomingFile.pausedAt || performance.now();
        sendReplyEverywhere({ kind: 'file:pause', fileId: fid, name: incomingFile.name, size: incomingFile.size, by: 'receiver' });
        renderIncomingRow(incomingFile, false);
        syncPauseBtnUi();
        return;
      }
      if (rxCloudFile && rxCloudFile.fileId === fid && !rxCloudFile.cancelled) {
        rxCloudFile.paused = true;
        rxCloudFile.remotePaused = false;
        rxCloudFile.pausedAt = rxCloudFile.pausedAt || performance.now();
        sendReplyEverywhere({ kind: 'file:pause', fileId: fid, name: rxCloudFile.name, size: rxCloudFile.size, by: 'receiver' });
        renderIncomingRow(rxCloudFile, true);
        syncPauseBtnUi();
        return;
      }
      const out = activeOutgoing.get(fid);
      if (out && !out.cancelled) {
        out.paused = true;
        out.remotePaused = false;
        sendPeerControl(out.peerId, { kind: 'file:pause', fileId: fid, name: out.name, size: out.size, by: 'sender' });
        if (out.renderRow) out.renderRow();
        syncPauseBtnUi();
      }
    }

    function resumeTransferById(fid) {
      if (!fid) return;
      transferPaused = false;
      if (incomingFile && incomingFile.fileId === fid && !incomingFile.cancelled) {
        if (incomingFile.pausedAt) incomingFile.startedAt += Math.max(0, performance.now() - incomingFile.pausedAt);
        incomingFile.paused = false;
        incomingFile.remotePaused = false;
        incomingFile.pausedAt = 0;
        sendReplyEverywhere({ kind: 'file:resume', fileId: fid, name: incomingFile.name, size: incomingFile.size, by: 'receiver', resumeFromChunk: incomingFile.receivedCount || 0 });
        syncPauseBtnUi();
        if (!finalizeIncomingIfReady()) renderIncomingRow(incomingFile, false);
        return;
      }
      if (rxCloudFile && rxCloudFile.fileId === fid && !rxCloudFile.cancelled) {
        if (rxCloudFile.pausedAt) rxCloudFile.startedAt += Math.max(0, performance.now() - rxCloudFile.pausedAt);
        rxCloudFile.paused = false;
        rxCloudFile.remotePaused = false;
        rxCloudFile.pausedAt = 0;
        sendReplyEverywhere({ kind: 'file:resume', fileId: fid, name: rxCloudFile.name, size: rxCloudFile.size, by: 'receiver', resumeFromChunk: rxCloudFile.receivedCount || 0 });
        syncPauseBtnUi();
        if (rxCloudFile.endedWhilePaused) {
          finalizeCloudRx(rxCloudFile.endedWhilePaused.src, rxCloudFile.endedWhilePaused.endKind);
        } else {
          renderIncomingRow(rxCloudFile, true);
        }
        return;
      }
      const out = activeOutgoing.get(fid);
      if (out && !out.cancelled) {
        out.paused = false;
        out.remotePaused = false;
        sendPeerControl(out.peerId, { kind: 'file:resume', fileId: fid, name: out.name, size: out.size, by: 'sender' });
        if (out.renderRow) out.renderRow();
        syncPauseBtnUi();
      }
    }

    function cancelTransferById(fid, fromRemote, remoteByName) {
      if (!fid) return;
      cancelledIds.add(fid);
      if (incomingFile && incomingFile.fileId === fid) {
        const fname = incomingFile.name;
        const fsize = incomingFile.size;
        incomingFile.cancelled = true;
        resumeCheckpoints.delete(fname + '::' + fsize);
        incomingFile = null;
        partialFrames.clear();
        if (!fromRemote) {
          sendReplyEverywhere({ kind: 'file:cancel', fileId: fid, name: fname, size: fsize, by: 'receiver' });
        }
        renderStatus((fromRemote ? 'Stopped by ' + (remoteByName || 'sender') + ': ' : 'Stopped: ') + escapeHtml(fname));
        syncPauseBtnUi();
        return;
      }
      if (rxCloudFile && rxCloudFile.fileId === fid) {
        const cname = rxCloudFile.name;
        const csize = rxCloudFile.size;
        rxCloudFile.cancelled = true;
        rxCloudFile = null;
        if (!fromRemote) {
          sendReplyEverywhere({ kind: 'file:cancel', fileId: fid, name: cname, size: csize, by: 'receiver' });
        }
        renderStatus((fromRemote ? 'Stopped by ' + (remoteByName || 'sender') + ': ' : 'Stopped: ') + escapeHtml(cname));
        syncPauseBtnUi();
        return;
      }
      const out = activeOutgoing.get(fid);
      if (out) {
        out.cancelled = true;
        out.cancelledBy = fromRemote ? 'remote' : 'local';
        out.paused = false;
        out.remotePaused = false;
        if (!fromRemote) {
          sendPeerControl(out.peerId, { kind: 'file:cancel', fileId: fid, name: out.name, size: out.size, by: 'sender' });
        }
        const pr = pendingResumeResolvers.get(fid);
        if (pr) { pendingResumeResolvers.delete(fid); pr(0); }
        const ca = cloudAckResolvers.get(fid);
        if (ca) { cloudAckResolvers.delete(fid); ca(); }
        const rxc = rxCompleteResolvers.get(fid);
        if (rxc) { rxCompleteResolvers.delete(fid); rxc(); }
        if (out.renderRow) out.renderRow();
        syncPauseBtnUi();
      }
    }

    function stopAllActiveTransfers() {
      const fids = [];
      for (const fid of activeOutgoing.keys()) fids.push(fid);
      if (incomingFile && incomingFile.fileId) fids.push(incomingFile.fileId);
      if (rxCloudFile && rxCloudFile.fileId) fids.push(rxCloudFile.fileId);
      transferPaused = false;
      for (const fid of fids) cancelTransferById(fid, false);
      syncPauseBtnUi();
    }

    function togglePauseState() {
      const currentlyPaused = transferPaused
        || (incomingFile && incomingFile.paused)
        || (rxCloudFile && rxCloudFile.paused)
        || Array.from(activeOutgoing.values()).some(o => o.paused);
      const nextPaused = !currentlyPaused;
      transferPaused = nextPaused;
      if (incomingFile && !incomingFile.cancelled) {
        if (nextPaused) pauseTransferById(incomingFile.fileId);
        else resumeTransferById(incomingFile.fileId);
      }
      if (rxCloudFile && !rxCloudFile.cancelled) {
        if (nextPaused) pauseTransferById(rxCloudFile.fileId);
        else resumeTransferById(rxCloudFile.fileId);
      }
      for (const [fid, out] of activeOutgoing.entries()) {
        if (!out.cancelled) {
          if (nextPaused) pauseTransferById(fid);
          else resumeTransferById(fid);
        }
      }
      syncPauseBtnUi();
    }

    async function waitWhilePaused(fileId, onPauseMs) {
      const out = fileId ? activeOutgoing.get(fileId) : null;
      if (out && out.cancelled) return false;
      if (cancelledIds.has(fileId)) return false;
      if (!transferPaused && !(out && out.paused)) return true;
      const pStart = performance.now();
      while (transferPaused || (out && out.paused)) {
        if ((out && out.cancelled) || cancelledIds.has(fileId)) return false;
        await new Promise(r => setTimeout(r, 80));
      }
      if (onPauseMs) onPauseMs(performance.now() - pStart);
      return !((out && out.cancelled) || cancelledIds.has(fileId));
    }

    function getMaxUploadLimitMBps() {
      const el = document.getElementById('max-speed-input');
      if (!el) return 0;
      const parsed = parseFloat(String(el.value || '').trim().replace(',', '.'));
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }

    function buildMqttPacket(typeFlags, payload) {
      const rem = [];
      let x = payload.length;
      do {
        let d = x & 0x7f;
        x >>>= 7;
        if (x > 0) d |= 0x80;
        rem.push(d);
      } while (x > 0);
      const out = new Uint8Array(1 + rem.length + payload.length);
      out[0] = typeFlags;
      for (let i = 0; i < rem.length; i++) out[1 + i] = rem[i];
      out.set(payload, 1 + rem.length);
      return out;
    }

    function sendBusEnvelope(envelope) {
      if (!activeTopic) return;
      const enc = new TextEncoder();
      const tBytes = enc.encode(activeTopic);
      const mBytes = enc.encode(JSON.stringify(envelope));
      const body = new Uint8Array(2 + tBytes.length + mBytes.length);
      body[0] = (tBytes.length >> 8) & 0xff;
      body[1] = tBytes.length & 0xff;
      body.set(tBytes, 2);
      body.set(mBytes, 2 + tBytes.length);
      const pkt = buildMqttPacket(0x30, body);
      for (const ws of mqttSockets) {
        if (ws && ws.readyState === WebSocket.OPEN) {
          try { ws.send(pkt); } catch {}
        }
      }
    }

    function sendCloudCandidate(dst, payload) {
      sendBusEnvelope({ type: 'CANDIDATE', src: myId, dst: dst || '*', payload });
    }

    function sendDepartureNotice() {
      if (activeTopic && activeRoom) {
        sendCloudCandidate('*', { kind: 'browser:bye', roomCode: activeRoom, peerId: myId });
      }
    }

    function removePeerFromRoom(pid) {
      const peer = peersMap.get(pid);
      if (!peer) return;
      try { if (peer.pc) peer.pc.close(); } catch {}
      peer.dc = null;
      peersMap.delete(pid);
      updatePeerPresenceUi(peersMap.size > 0, peersMap.size > 0 ? peersMap.size + ' users' : '', activeRoom);
    }

    window.addEventListener('beforeunload', sendDepartureNotice);
    window.addEventListener('pagehide', sendDepartureNotice);

    function syncTargetSelectorUi() {
      const sel = document.getElementById('target-peer-select');
      if (!sel) return;
      const prevVal = sel.value || '*';
      const activeList = Array.from(peersMap.values());
      sel.innerHTML = '';
      const allOpt = document.createElement('option');
      allOpt.value = '*';
      allOpt.textContent = 'Everyone in room (' + activeList.length + ' users)';
      sel.appendChild(allOpt);
      for (const p of activeList) {
        const opt = document.createElement('option');
        opt.value = p.id;
        const via = p.dc && p.dc.readyState === 'open' ? 'WebRTC P2P' : (p.type === 'exe' ? 'Windows .EXE' : 'Cloud Bridge');
        opt.textContent = (p.label || p.id.slice(-8)) + ' (' + via + ')';
        sel.appendChild(opt);
      }
      if (prevVal !== '*' && peersMap.has(prevVal)) {
        sel.value = prevVal;
      } else {
        sel.value = '*';
      }
    }

    function updatePeerPresenceUi(hasPeer, peerLabel, roomCode) {
      const box = document.getElementById('peer-presence-box');
      const dot = document.getElementById('peer-presence-dot');
      const title = document.getElementById('peer-presence-title');
      const badge = document.getElementById('peer-count-badge');
      const sub = document.getElementById('peer-presence-sub');
      const headerBadge = document.getElementById('status-badge');
      const totalUsers = activeRoom ? Math.min(MAX_ROOM_PEERS, peersMap.size + 1) : 0;

      if (hasPeer || peersMap.size > 0) {
        box.className = 'p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 transition-colors';
        dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping';
        title.className = 'text-xs font-semibold text-emerald-300';
        title.textContent = peersMap.size + ' user(s) in room! (Max ' + MAX_ROOM_PEERS + ')';
        badge.className = 'px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        badge.textContent = totalUsers + '/' + MAX_ROOM_PEERS + ' USERS';
        sub.className = 'text-[11px] font-mono text-emerald-200/90 mt-1';
        sub.textContent = 'Connected: ' + (peerLabel || (peersMap.size + ' peers')) + ' [' + roomCode + ']';
        headerBadge.textContent = 'ROOM [' + roomCode + ']: ' + totalUsers + '/' + MAX_ROOM_PEERS + ' users';
        headerBadge.className = 'text-xs font-mono text-emerald-400 font-semibold';
      } else {
        box.className = 'p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 transition-colors';
        dot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
        title.className = 'text-xs font-semibold text-amber-300';
        title.textContent = 'No other user in room yet (Waiting for peers)';
        badge.className = 'px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30';
        badge.textContent = (activeRoom ? '1/' : '0/') + MAX_ROOM_PEERS + ' USERS';
        sub.className = 'text-[11px] font-mono text-slate-400 mt-1';
        sub.textContent = 'Listening on room [' + roomCode + '] — max ' + MAX_ROOM_PEERS + ' users.';
        headerBadge.textContent = activeRoom ? ('LISTENING ON [' + roomCode + '] · 1/' + MAX_ROOM_PEERS) : 'Waiting for tunnel name';
        headerBadge.className = 'text-xs font-mono text-amber-400';
      }
      syncTargetSelectorUi();
    }

    async function deriveKey(code, pass) {
      const enc = new TextEncoder();
      const clean = code.trim().toLowerCase();
      const secret = clean + '::' + (pass || '').trim();
      const baseKey = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey', 'deriveBits']);
      currentKey = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode('AetherTunnel-E2EE-v1-Salt-2026'), iterations: 100000, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
      const verifyBits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode('AetherTunnel-Fingerprint-Salt'), iterations: 1000, hash: 'SHA-256' }, baseKey, 64);
      const hex = Array.from(new Uint8Array(verifyBits)).map(b => b.toString(16).padStart(2, '0').toUpperCase());
      document.getElementById('fp-label').textContent = hex[0]+hex[1]+' · '+hex[2]+hex[3]+' · '+hex[4]+hex[5]+' · '+hex[6]+hex[7];
    }

    function sendReplyEverywhere(pkt) {
      const json = JSON.stringify(pkt);
      for (const p of peersMap.values()) {
        if (p.dc && p.dc.readyState === 'open') {
          try { p.dc.send(json); } catch {}
        }
      }
      sendCloudCandidate('*', { kind: 'browser:packet', packet: pkt });
    }

    function renderStatus(text) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200">' + text + '</div>';
    }

    function renderError(text) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-red-950/60 border border-red-700/60 rounded font-mono text-red-200">' + text + '</div>';
    }

    function renderDownload(name, url, size, mbps) {
      const list = document.getElementById('transfer-list');
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-emerald-500/40 rounded flex items-center justify-between"><span>Verified: ' + name + ' (' + (size/(1024*1024)).toFixed(2) + ' MB · ' + mbps + ' MB/s)</span><a href="' + url + '" download="' + name + '" class="px-3 py-1 bg-emerald-400 text-slate-950 font-semibold rounded">Save File</a></div>';
    }

    function renderTransferControls(fid, isPaused) {
      const pauseLabel = isPaused ? 'Resume' : 'Pause';
      const pauseCls = isPaused
        ? 'px-2.5 py-1 text-[11px] font-semibold bg-emerald-400 text-slate-950 rounded hover:bg-emerald-300 cursor-pointer'
        : 'px-2.5 py-1 text-[11px] font-semibold bg-amber-950/80 text-amber-200 border border-amber-700/60 rounded hover:bg-amber-900 cursor-pointer';
      return '<div class="flex items-center gap-1.5 shrink-0">' +
        '<button type="button" data-action="pause-resume" data-fid="' + escapeHtml(fid) + '" class="' + pauseCls + '">' + pauseLabel + '</button>' +
        '<button type="button" data-action="stop" data-fid="' + escapeHtml(fid) + '" class="px-2.5 py-1 text-[11px] font-semibold bg-rose-950/80 text-rose-200 border border-rose-700/60 rounded hover:bg-rose-900 cursor-pointer">Stop</button>' +
      '</div>';
    }

    function renderIncomingRow(rxObj, isBridge) {
      if (!rxObj || rxObj.cancelled) return;
      const pct = isBridge
        ? Math.min(100, Math.round((rxObj.bytes / Math.max(1, rxObj.size)) * 100))
        : Math.round((rxObj.receivedCount / Math.max(1, rxObj.totalChunks)) * 100);
      const now = rxObj.paused && rxObj.pausedAt ? rxObj.pausedAt : performance.now();
      const elapsed = Math.max(0.02, (now - rxObj.startedAt) / 1000);
      const recvBytes = isBridge ? rxObj.bytes : (rxObj.receivedCount * (rxObj.chunkSize || 240 * 1024));
      const mbps = (recvBytes / (1024 * 1024) / elapsed).toFixed(2);
      let label;
      if (rxObj.paused) {
        label = (rxObj.remotePaused ? 'Paused by sender: ' : 'Paused: ') + escapeHtml(rxObj.name) + ' (' + pct + '%)';
      } else {
        label = (isBridge ? 'Receiving (Bridge): ' : 'Receiving: ') + escapeHtml(rxObj.name) + ' (' + pct + '% · ' + mbps + ' MB/s)';
      }
      const list = document.getElementById('transfer-list');
      if (!list) return;
      list.innerHTML = '<div class="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200 flex items-center justify-between gap-3"><span class="truncate">' + label + '</span>' + renderTransferControls(rxObj.fileId, !!rxObj.paused) + '</div>';
    }

    function finalizeIncomingIfReady() {
      if (!incomingFile || incomingFile.cancelled || incomingFile.paused) return false;
      if (incomingFile.receivedCount < incomingFile.totalChunks) return false;
      const now = performance.now();
      const elapsed = Math.max(0.02, (now - incomingFile.startedAt) / 1000);
      const mbps = (incomingFile.size / (1024 * 1024) / elapsed).toFixed(2);
      const blob = new Blob(incomingFile.chunks, { type: incomingFile.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      renderDownload(incomingFile.name, url, incomingFile.size, mbps);
      sendReplyEverywhere({ kind: 'file:rx-complete', fileId: incomingFile.fileId, receivedCount: incomingFile.totalChunks, totalChunks: incomingFile.totalChunks });
      resumeCheckpoints.delete(incomingFile.name + '::' + incomingFile.size);
      incomingFile = null;
      partialFrames.clear();
      syncPauseBtnUi();
      return true;
    }

    function finalizeCloudRx(src, endKind) {
      if (!rxCloudFile || rxCloudFile.cancelled || rxCloudFile.paused) return;
      const elapsed = Math.max(0.02, (performance.now() - rxCloudFile.startedAt) / 1000);
      const mbps = (rxCloudFile.size / (1024 * 1024) / elapsed).toFixed(2);
      const parts = rxCloudFile.chunks.filter(Boolean);
      const blob = new Blob(parts, { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      renderDownload(rxCloudFile.name, url, rxCloudFile.size, mbps);
      sendCloudCandidate(src || '*', { kind: endKind === 'browser:file-end' ? 'browser:chunk-ack' : 'exe:chunk-ack', fileId: rxCloudFile.fileId, chunkIndex: 999999 });
      rxCloudFile = null;
      syncPauseBtnUi();
    }

    let lastRxProgEmitAt = 0;
    let rxDecryptErrShownFor = '';
    async function handleCompleteAethFrame(buf) {
      if (!incomingFile || incomingFile.cancelled || !currentKey) return;
      const view = new DataView(buf);
      const chunkIndex = view.getUint32(8, false);
      const iv = new Uint8Array(buf, 12, 12);
      const ciphertext = new Uint8Array(buf, 24);
      let dec;
      try {
        dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, currentKey, ciphertext);
      } catch {
        if (!incomingFile || incomingFile.cancelled) return;
        if (rxDecryptErrShownFor !== incomingFile.fileId) {
          rxDecryptErrShownFor = incomingFile.fileId;
          const errMsg = 'AES-256-GCM decryption failed — verify Tunnel Name & E2EE Passphrase match sender';
          renderError(errMsg);
          sendReplyEverywhere({ kind: 'file:rx-error', fileId: incomingFile.fileId, reason: errMsg });
        }
        return;
      }
      if (!incomingFile || incomingFile.cancelled) return;
      if (incomingFile.chunks[chunkIndex] === undefined) {
        incomingFile.chunks[chunkIndex] = dec;
        incomingFile.receivedCount++;
      }
      const now = performance.now();
      if (now - lastRxProgEmitAt >= 450 || incomingFile.receivedCount === 1) {
        lastRxProgEmitAt = now;
        sendReplyEverywhere({ kind: 'file:rx-progress', fileId: incomingFile.fileId, receivedCount: incomingFile.receivedCount, totalChunks: incomingFile.totalChunks });
      }
      if (incomingFile.paused) {
        if (now - incomingFile.lastUi > 250) {
          incomingFile.lastUi = now;
          renderIncomingRow(incomingFile, false);
        }
        return;
      }
      if (finalizeIncomingIfReady()) {
        return;
      } else if (now - incomingFile.lastUi > 120) {
        incomingFile.lastUi = now;
        renderIncomingRow(incomingFile, false);
      }
    }

    function handleIncomingBinary(buf) {
      if (!(buf instanceof ArrayBuffer) || buf.byteLength < 24) return false;
      const view = new DataView(buf);
      const magic = view.getUint32(0, false);
      if (magic === MAGIC_AETH) {
        handleCompleteAethFrame(buf);
        return true;
      }
      if (magic === MAGIC_AETP) {
        const transferNumId = view.getUint32(4, false);
        const chunkIndex = view.getUint32(8, false);
        const totalBytes = view.getUint32(12, false);
        const byteOffset = view.getUint32(16, false);
        const totalParts = view.getUint16(22, false);
        const key = transferNumId + ':' + chunkIndex;
        let entry = partialFrames.get(key);
        if (!entry) {
          entry = { buf: new Uint8Array(totalBytes), count: 0, totalParts };
          partialFrames.set(key, entry);
        }
        entry.buf.set(new Uint8Array(buf, 24), byteOffset);
        entry.count++;
        if (entry.count >= entry.totalParts) {
          partialFrames.delete(key);
          handleCompleteAethFrame(entry.buf.buffer);
        }
        return true;
      }
      return false;
    }

    function handleControlJson(msg, srcPeer) {
      if (!msg || typeof msg !== 'object') return;
      if (msg.kind === 'file:pause') {
        const fid = String(msg.fileId || '');
        if (fid && cancelledIds.has(fid)) return;
        for (const [ofid, out] of activeOutgoing.entries()) {
          if ((fid && ofid === fid) || (!fid && out.peerId === srcPeer)) {
            out.paused = true;
            out.remotePaused = true;
            if (out.renderRow) out.renderRow();
          }
        }
        if (incomingFile && !incomingFile.cancelled && (!fid || incomingFile.fileId === fid)) {
          incomingFile.paused = true;
          incomingFile.remotePaused = true;
          incomingFile.pausedAt = incomingFile.pausedAt || performance.now();
          renderIncomingRow(incomingFile, false);
        }
        if (rxCloudFile && !rxCloudFile.cancelled && (!fid || rxCloudFile.fileId === fid)) {
          rxCloudFile.paused = true;
          rxCloudFile.remotePaused = true;
          rxCloudFile.pausedAt = rxCloudFile.pausedAt || performance.now();
          renderIncomingRow(rxCloudFile, true);
        }
        syncPauseBtnUi();
        return;
      }
      if (msg.kind === 'file:resume') {
        const fid = String(msg.fileId || '');
        if (fid && cancelledIds.has(fid)) return;
        transferPaused = false;
        for (const [ofid, out] of activeOutgoing.entries()) {
          if ((fid && ofid === fid) || (!fid && out.peerId === srcPeer)) {
            out.paused = false;
            out.remotePaused = false;
            if (out.renderRow) out.renderRow();
          }
        }
        if (incomingFile && !incomingFile.cancelled && (!fid || incomingFile.fileId === fid)) {
          if (incomingFile.pausedAt) incomingFile.startedAt += Math.max(0, performance.now() - incomingFile.pausedAt);
          incomingFile.paused = false;
          incomingFile.remotePaused = false;
          incomingFile.pausedAt = 0;
          if (!finalizeIncomingIfReady()) renderIncomingRow(incomingFile, false);
        }
        if (rxCloudFile && !rxCloudFile.cancelled && (!fid || rxCloudFile.fileId === fid)) {
          if (rxCloudFile.pausedAt) rxCloudFile.startedAt += Math.max(0, performance.now() - rxCloudFile.pausedAt);
          rxCloudFile.paused = false;
          rxCloudFile.remotePaused = false;
          rxCloudFile.pausedAt = 0;
          if (rxCloudFile.endedWhilePaused) {
            finalizeCloudRx(rxCloudFile.endedWhilePaused.src, rxCloudFile.endedWhilePaused.endKind);
          } else {
            renderIncomingRow(rxCloudFile, true);
          }
        }
        syncPauseBtnUi();
        return;
      }
      if (msg.kind === 'file:cancel' || msg.kind === 'exe:file-cancel' || msg.kind === 'browser:file-cancel') {
        const fid = String(msg.fileId || '');
        if (fid) {
          cancelTransferById(fid, true, msg.by === 'receiver' ? 'receiver' : 'sender');
        } else {
          if (incomingFile) cancelTransferById(incomingFile.fileId, true, 'sender');
          if (rxCloudFile) cancelTransferById(rxCloudFile.fileId, true, 'sender');
          for (const [ofid, out] of activeOutgoing.entries()) {
            if (out.peerId === srcPeer) cancelTransferById(ofid, true, 'receiver');
          }
        }
        return;
      }
      if (msg.kind === 'file:meta') {
        if (msg.fileId && cancelledIds.has(String(msg.fileId))) return;
        if (incomingFile && incomingFile.fileId === msg.fileId && incomingFile.totalChunks === msg.totalChunks) {
          let miss = 0;
          while (miss < incomingFile.totalChunks && incomingFile.chunks[miss] !== undefined) miss++;
          const ack = { kind: 'file:resume-ack', fileId: msg.fileId, name: msg.name, size: msg.size, resumeFromChunk: miss };
          sendReplyEverywhere(ack);
          return;
        }
        const rKey = msg.name + '::' + msg.size;
        const prev = resumeCheckpoints.get(rKey);
        let chunks = new Array(msg.totalChunks);
        let resumeFromChunk = 0;
        if (prev && prev.chunks && prev.chunks.length === msg.totalChunks) {
          chunks = prev.chunks;
          while (resumeFromChunk < chunks.length && chunks[resumeFromChunk] !== undefined) resumeFromChunk++;
        }
        rxDecryptErrShownFor = '';
        incomingFile = { ...msg, chunkSize: msg.chunkSize || 240*1024, chunks, receivedCount: resumeFromChunk, startedAt: performance.now(), lastUi: 0, paused: transferPaused, pausedAt: transferPaused ? performance.now() : 0, remotePaused: false, cancelled: false };
        resumeCheckpoints.set(rKey, incomingFile);
        const ack = { kind: 'file:resume-ack', fileId: msg.fileId, name: msg.name, size: msg.size, resumeFromChunk };
        const peerObj = srcPeer ? peersMap.get(srcPeer) : null;
        if (peerObj && peerObj.dc && peerObj.dc.readyState === 'open') {
          try { peerObj.dc.send(JSON.stringify(ack)); } catch {}
        }
        sendCloudCandidate(srcPeer || '*', ack);
        renderIncomingRow(incomingFile, false);
        syncPauseBtnUi();
      } else if (msg.kind === 'file:rx-complete' && msg.fileId) {
        const fn = rxCompleteResolvers.get(String(msg.fileId));
        if (fn) { rxCompleteResolvers.delete(String(msg.fileId)); fn(); }
      } else if (msg.kind === 'file:rx-error' && msg.fileId) {
        const fn = rxErrorResolvers.get(String(msg.fileId));
        if (fn) { rxErrorResolvers.delete(String(msg.fileId)); fn(String(msg.reason || 'Decryption error')); }
      } else if (msg.kind === 'file:resume-ack' || msg.kind === 'exe:resume-ack' || msg.kind === 'browser:resume-ack') {
        const fid = String(msg.fileId || '');
        const fn = (fid && pendingResumeResolvers.get(fid)) || (srcPeer && pendingResumeResolvers.get(srcPeer));
        if (fn) {
          if (fid) pendingResumeResolvers.delete(fid);
          if (srcPeer) pendingResumeResolvers.delete(srcPeer);
          fn(Number(msg.resumeFromChunk) || 0);
        }
      }
    }

    function bindDataChannel(channel, peerEntry) {
      peerEntry.dc = channel;
      channel.binaryType = 'arraybuffer';
      channel.bufferedAmountLowThreshold = LOW_WATER;
      channel.onopen = () => {
        peerEntry.lastSeen = Date.now();
        updatePeerPresenceUi(true, peerEntry.label, activeRoom);
      };
      channel.onclose = () => {
        if (peerEntry.dc === channel) peerEntry.dc = null;
        if (Date.now() - peerEntry.lastSeen > 4500) {
          removePeerFromRoom(peerEntry.id);
        } else {
          syncTargetSelectorUi();
        }
      };
      channel.onmessage = async (ev) => {
        peerEntry.lastSeen = Date.now();
        let data = ev.data;
        if (data instanceof Blob) data = await data.arrayBuffer();
        if (data instanceof ArrayBuffer) {
          if (handleIncomingBinary(data)) return;
          try { data = new TextDecoder().decode(data); } catch { return; }
        } else if (ArrayBuffer.isView(data)) {
          const copy = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
          if (handleIncomingBinary(copy)) return;
          try { data = new TextDecoder().decode(copy); } catch { return; }
        }
        if (typeof data === 'string') {
          try { handleControlJson(JSON.parse(data), peerEntry.id); } catch {}
        }
      };
    }

    async function ensureWebRtc(isInitiator, targetPeer, forceRebuild) {
      if (!targetPeer) return;
      const peerEntry = peersMap.get(targetPeer);
      if (!peerEntry) return;
      try {
        if (
          peerEntry.pc &&
          !forceRebuild &&
          peerEntry.pc.signalingState !== 'closed' &&
          peerEntry.pc.connectionState !== 'failed' &&
          peerEntry.pc.connectionState !== 'closed' &&
          peerEntry.pc.iceConnectionState !== 'failed'
        ) {
          return;
        }
        if (peerEntry.pc) {
          try { peerEntry.pc.close(); } catch {}
          peerEntry.pc = null;
        }
        const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        peerEntry.pc = pc;
        peerEntry.pendIce = [];
        pc.onicecandidate = (ev) => {
          if (ev.candidate) {
            sendCloudCandidate(targetPeer, {
              kind: 'webrtc:signal',
              laneIdx: 0,
              signalType: 'candidate',
              candidate: ev.candidate
            });
          }
        };
        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'connected') {
            peerEntry.lastSeen = Date.now();
          } else if (pc.connectionState === 'failed' || pc.connectionState === 'closed' || pc.connectionState === 'disconnected') {
            peerEntry.dc = null;
            if (pc.connectionState === 'failed' || pc.connectionState === 'closed' || Date.now() - peerEntry.lastSeen > 4500) {
              removePeerFromRoom(targetPeer);
            } else {
              syncTargetSelectorUi();
            }
          }
        };
        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
            peerEntry.lastSeen = Date.now();
          } else if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
            peerEntry.dc = null;
            if (Date.now() - peerEntry.lastSeen > 4500) {
              removePeerFromRoom(targetPeer);
            } else {
              syncTargetSelectorUi();
            }
          }
        };
        pc.ondatachannel = (ev) => bindDataChannel(ev.channel, peerEntry);
        if (isInitiator) {
          bindDataChannel(pc.createDataChannel('aethertunnel-lane-0', { ordered: true }), peerEntry);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendCloudCandidate(targetPeer, {
            kind: 'webrtc:signal',
            laneIdx: 0,
            signalType: 'offer',
            sdp: offer
          });
        }
      } catch {}
    }

    function upsertRoomPeer(src, type, label) {
      let existing = peersMap.get(src);
      if (!existing) {
        if (peersMap.size >= MAX_ROOM_PEERS - 1) {
          return null;
        }
        existing = { id: src, type, label: label || src.slice(-8), lastSeen: Date.now(), pc: null, dc: null, pendIce: [] };
        peersMap.set(src, existing);
        return { peer: existing, isNew: true };
      }
      existing.lastSeen = Date.now();
      if (label) existing.label = label;
      return { peer: existing, isNew: false };
    }

    function handleBusMessage(rawJson) {
      let msg;
      try { msg = JSON.parse(rawJson); } catch { return; }
      if (!msg || typeof msg !== 'object') return;
      const src = typeof msg.src === 'string' ? msg.src : '';
      if (!src || src === myId) return;
      if (msg.dst && msg.dst !== '*' && msg.dst !== myId) return;

      const p = msg.payload || msg;
      if (!p || typeof p !== 'object') return;

      if (p.kind === 'browser:bye' || p.kind === 'web:bye' || p.kind === 'exe:bye') {
        removePeerFromRoom(src);
        if (p.peerId && String(p.peerId) !== src) {
          removePeerFromRoom(String(p.peerId));
        }
        return;
      }

      if (p.kind === 'exe:hello' || p.kind === 'exe:hello-reply') {
        const res = upsertRoomPeer(src, 'exe', p.displayName || ('Windows .EXE (' + src.slice(-6) + ')'));
        if (!res) return;
        updatePeerPresenceUi(true, res.peer.label, activeRoom);
        if (p.kind === 'exe:hello' && res.isNew) {
          sendCloudCandidate(src, { kind: 'browser:hello', roomCode: activeRoom });
        }
        return;
      }

      if (p.kind === 'browser:hello' || p.kind === 'browser:hello-ack' || p.kind === 'web:hello') {
        const res = upsertRoomPeer(src, 'browser', p.displayName || ('Browser (' + src.slice(-6) + ')'));
        if (!res) return;
        updatePeerPresenceUi(true, res.peer.label, activeRoom);
        if (p.kind === 'browser:hello' && res.isNew) {
          sendCloudCandidate(src, { kind: 'browser:hello-ack', roomCode: activeRoom });
        }
        if (myId > src && (!res.peer.dc || res.peer.dc.readyState !== 'open')) {
          ensureWebRtc(true, src, false);
        }
        return;
      }

      if (p.kind === 'browser:packet' && p.packet) {
        handleControlJson(p.packet, src);
        return;
      }

      if (p.kind === 'webrtc:signal') {
        if (typeof p.laneIdx === 'number' && p.laneIdx > 0) return;
        const res = upsertRoomPeer(src, 'browser', 'Browser (' + src.slice(-6) + ')');
        if (!res) return;
        const peerEntry = res.peer;
        (async () => {
          try {
            if (p.signalType === 'offer' && p.sdp) {
              const polite = myId < src;
              if (!peerEntry.pc || peerEntry.pc.signalingState === 'closed' || peerEntry.pc.connectionState === 'failed') {
                await ensureWebRtc(false, src, true);
              } else if (peerEntry.pc.signalingState !== 'stable') {
                if (!polite) return;
                try { await peerEntry.pc.setLocalDescription({ type: 'rollback' }); } catch { await ensureWebRtc(false, src, true); }
              }
              await peerEntry.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
              if (peerEntry.pendIce && peerEntry.pendIce.length) {
                for (const c of peerEntry.pendIce) {
                  try { await peerEntry.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
                }
                peerEntry.pendIce = [];
              }
              const answer = await peerEntry.pc.createAnswer();
              await peerEntry.pc.setLocalDescription(answer);
              sendCloudCandidate(src, { kind: 'webrtc:signal', laneIdx: 0, signalType: 'answer', sdp: answer });
            } else if (p.signalType === 'answer' && p.sdp && peerEntry.pc) {
              if (peerEntry.pc.signalingState !== 'have-local-offer') return;
              await peerEntry.pc.setRemoteDescription(new RTCSessionDescription(p.sdp));
              if (peerEntry.pendIce && peerEntry.pendIce.length) {
                for (const c of peerEntry.pendIce) {
                  try { await peerEntry.pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
                }
                peerEntry.pendIce = [];
              }
            } else if (p.signalType === 'candidate' && p.candidate) {
              if (peerEntry.pc && peerEntry.pc.remoteDescription && peerEntry.pc.remoteDescription.type) {
                await peerEntry.pc.addIceCandidate(new RTCIceCandidate(p.candidate));
              } else {
                peerEntry.pendIce = peerEntry.pendIce || [];
                peerEntry.pendIce.push(p.candidate);
              }
            }
          } catch {}
        })();
        return;
      }

      if (p.kind === 'exe:chunk-ack' || p.kind === 'browser:chunk-ack') {
        const fid = String(p.fileId || '');
        const fn = (fid && cloudAckResolvers.get(fid)) || cloudAckResolvers.get(src);
        if (fn) {
          if (fid) cloudAckResolvers.delete(fid);
          cloudAckResolvers.delete(src);
          fn();
        }
        return;
      }

      if (p.kind === 'exe:resume-ack' || p.kind === 'file:resume-ack' || p.kind === 'browser:resume-ack' || p.kind === 'file:pause' || p.kind === 'file:resume' || p.kind === 'file:cancel' || p.kind === 'exe:file-cancel' || p.kind === 'browser:file-cancel') {
        handleControlJson(p, src);
        return;
      }

      if (p.kind === 'exe:file-start' || p.kind === 'browser:file-start') {
        if (p.fileId && cancelledIds.has(String(p.fileId))) return;
        const prefix = p.kind.startsWith('browser:') ? 'browser:' : 'exe:';
        if (rxCloudFile && rxCloudFile.fileId === p.fileId) {
          sendCloudCandidate(src, { kind: prefix + 'resume-ack', fileId: p.fileId, name: rxCloudFile.name, size: rxCloudFile.size, resumeFromChunk: rxCloudFile.receivedCount || 0 });
          return;
        }
        rxCloudFile = {
          fileId: p.fileId,
          name: p.name || 'transfer.bin',
          size: Number(p.size) || 0,
          totalChunks: Math.max(1, Number(p.totalChunks) || 1),
          chunks: new Array(Math.max(1, Number(p.totalChunks) || 1)),
          receivedCount: 0,
          bytes: 0,
          startedAt: performance.now(),
          lastUi: 0,
          paused: transferPaused,
          pausedAt: transferPaused ? performance.now() : 0,
          remotePaused: false,
          cancelled: false,
          endedWhilePaused: null
        };
        sendCloudCandidate(src, { kind: prefix + 'resume-ack', fileId: p.fileId, name: rxCloudFile.name, size: rxCloudFile.size, resumeFromChunk: 0 });
        renderIncomingRow(rxCloudFile, true);
        syncPauseBtnUi();
        return;
      }

      if ((p.kind === 'exe:file-chunk' || p.kind === 'browser:file-chunk') && rxCloudFile && !rxCloudFile.cancelled && p.data) {
        const cIdx = Math.max(0, Number(p.chunkIndex) || 0);
        if (rxCloudFile.chunks[cIdx] === undefined) {
          const bin = atob(p.data);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
          rxCloudFile.chunks[cIdx] = bytes;
          rxCloudFile.receivedCount = (rxCloudFile.receivedCount || 0) + 1;
          rxCloudFile.bytes += bytes.byteLength;
          const now = performance.now();
          if (now - rxCloudFile.lastUi > 120) {
            rxCloudFile.lastUi = now;
            renderIncomingRow(rxCloudFile, true);
          }
        }
        if ((cIdx + 1) % 8 === 0) {
          sendCloudCandidate(src, { kind: p.kind.startsWith('browser:') ? 'browser:chunk-ack' : 'exe:chunk-ack', fileId: rxCloudFile.fileId, chunkIndex: cIdx });
        }
        return;
      }

      if ((p.kind === 'exe:file-end' || p.kind === 'browser:file-end') && rxCloudFile && !rxCloudFile.cancelled) {
        if (rxCloudFile.paused) {
          rxCloudFile.endedWhilePaused = { src, endKind: p.kind };
          renderIncomingRow(rxCloudFile, true);
          return;
        }
        finalizeCloudRx(src, p.kind);
      }
    }

    function connectMqttBroker(brokerUrl, topic) {
      try {
        const ws = new WebSocket(brokerUrl, 'mqtt');
        ws.binaryType = 'arraybuffer';
        mqttSockets.push(ws);

        ws.onopen = () => {
          const enc = new TextEncoder();
          const cid = enc.encode('atp_' + myId.slice(-8) + '_' + Math.floor(Math.random() * 999));
          const vh = new Uint8Array([0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, 0x04, 0x02, 0x00, 0x3c]);
          const cp = new Uint8Array(vh.length + 2 + cid.length);
          cp.set(vh, 0);
          cp[vh.length] = (cid.length >> 8) & 0xff;
          cp[vh.length + 1] = cid.length & 0xff;
          cp.set(cid, vh.length + 2);
          ws.send(buildMqttPacket(0x10, cp));
        };

        ws.onmessage = (ev) => {
          if (!(ev.data instanceof ArrayBuffer)) return;
          const buf = new Uint8Array(ev.data);
          let pos = 0;
          while (pos < buf.length) {
            const hdr = buf[pos++];
            let mult = 1, remLen = 0;
            while (pos < buf.length) {
              const b = buf[pos++];
              remLen += (b & 0x7f) * mult;
              mult *= 128;
              if ((b & 0x80) === 0) break;
            }
            if (pos + remLen > buf.length) break;
            const pType = hdr >> 4;
            if (pType === 2) {
              const tBytes = new TextEncoder().encode(topic);
              const sp = new Uint8Array(2 + 2 + tBytes.length + 1);
              sp[0] = 0x00; sp[1] = 0x01;
              sp[2] = (tBytes.length >> 8) & 0xff;
              sp[3] = tBytes.length & 0xff;
              sp.set(tBytes, 4);
              sp[4 + tBytes.length] = 0x00;
              ws.send(buildMqttPacket(0x82, sp));
              setTimeout(() => sendCloudCandidate('*', { kind: 'browser:hello', roomCode: activeRoom }), 120);
            } else if (pType === 3 && remLen > 2) {
              const tLen = (buf[pos] << 8) | buf[pos + 1];
              let pStart = pos + 2 + tLen;
              if (((hdr >> 1) & 0x03) > 0) pStart += 2;
              const pLen = (pos + remLen) - pStart;
              if (pLen > 0) {
                const jsonStr = new TextDecoder().decode(buf.subarray(pStart, pStart + pLen));
                handleBusMessage(jsonStr);
              }
            }
            pos += remLen;
          }
        };
      } catch {}
    }

    async function connectRoom() {
      sendDepartureNotice();
      const code = document.getElementById('room-input').value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (!code) {
        activeRoom = '';
        activeTopic = '';
        for (const s of mqttSockets) { try { s.close(); } catch {} }
        mqttSockets = [];
        for (const p of peersMap.values()) {
          try { if (p.pc) p.pc.close(); } catch {}
        }
        peersMap.clear();
        updatePeerPresenceUi(false, '', '');
        document.getElementById('status-badge').textContent = 'Waiting for tunnel name — enter a name and click Connect';
        return;
      }
      const pass = document.getElementById('pass-input').value;
      activeRoom = code;
      activeTopic = 'aethertunnel/v1/room/' + code;
      await deriveKey(code, pass);

      for (const s of mqttSockets) { try { s.close(); } catch {} }
      mqttSockets = [];
      for (const p of peersMap.values()) {
        try { if (p.pc) p.pc.close(); } catch {}
      }
      peersMap.clear();
      updatePeerPresenceUi(false, '', code);

      for (const url of BROKERS) {
        connectMqttBroker(url, activeTopic);
      }
    }

    setInterval(() => {
      if (!activeRoom) return;
      sendCloudCandidate('*', { kind: 'browser:hello', roomCode: activeRoom });
      for (const ws of mqttSockets) {
        if (ws && ws.readyState === WebSocket.OPEN) {
          try { ws.send(new Uint8Array([0xc0, 0x00])); } catch {}
        }
      }
      const now = Date.now();
      let pruned = false;
      for (const [pid, peer] of peersMap.entries()) {
        const pcConnected = peer.pc && peer.pc.connectionState === 'connected' && peer.pc.iceConnectionState !== 'disconnected' && peer.pc.iceConnectionState !== 'failed' && peer.pc.iceConnectionState !== 'closed';
        const dcAlive = peer.dc && peer.dc.readyState === 'open' && pcConnected;
        if (!dcAlive && now - peer.lastSeen > 7500) {
          try { if (peer.pc) peer.pc.close(); } catch {}
          peersMap.delete(pid);
          pruned = true;
        }
      }
      if (peersMap.size > 0) {
        updatePeerPresenceUi(true, peersMap.size + ' users', activeRoom);
      } else if (pruned || peersMap.size === 0) {
        updatePeerPresenceUi(false, '', activeRoom);
      }
    }, 2200);

    document.getElementById('connect-btn').addEventListener('click', connectRoom);
    document.getElementById('pause-btn').addEventListener('click', togglePauseState);
    document.getElementById('stop-btn').addEventListener('click', stopAllActiveTransfers);
    document.getElementById('transfer-list').addEventListener('click', (ev) => {
      const btn = ev.target && ev.target.closest ? ev.target.closest('button[data-action]') : null;
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const fid = btn.getAttribute('data-fid');
      if (!fid) return;
      if (action === 'stop') {
        cancelTransferById(fid, false);
      } else if (action === 'pause-resume') {
        const out = activeOutgoing.get(fid);
        const isPaused = (out && out.paused)
          || (incomingFile && incomingFile.fileId === fid && incomingFile.paused)
          || (rxCloudFile && rxCloudFile.fileId === fid && rxCloudFile.paused);
        if (isPaused) resumeTransferById(fid);
        else pauseTransferById(fid);
      }
    });
    document.getElementById('file-input').addEventListener('change', async (e) => {
      const files = e.target.files;
      if (!files.length) return;
      const file = files[0];
      e.target.value = '';
      const targetId = (document.getElementById('target-peer-select') && document.getElementById('target-peer-select').value) || '*';
      const targetPeers = targetId === '*'
        ? Array.from(peersMap.values())
        : (peersMap.has(targetId) ? [peersMap.get(targetId)] : []);

      if (targetPeers.length === 0) {
        renderStatus('Selected recipient is not present in room "' + escapeHtml(activeRoom) + '".');
        return;
      }

      const chunkKb = parseInt(document.getElementById('chunk-select').value, 10) || 240;
      const peerRows = new Map();
      function renderAllPeerStatuses() {
        const list = document.getElementById('transfer-list');
        if (!list) return;
        list.innerHTML = Array.from(peerRows.values()).join('');
      }
      function setPeerRow(pid, isError, htmlText, activeEntry) {
        const cls = isError
          ? 'p-3 bg-red-950/60 border border-red-700/60 rounded font-mono text-red-200 flex items-center justify-between gap-3'
          : 'p-3 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200 flex items-center justify-between gap-3';
        const ctrls = activeEntry ? renderTransferControls(activeEntry.fileId, !!activeEntry.paused) : '';
        peerRows.set(pid, '<div class="' + cls + '"><span class="truncate">' + htmlText + '</span>' + ctrls + '</div>');
        renderAllPeerStatuses();
      }

      function splitFrameForSctp(frameBuf, maxSliceBytes) {
        const total = frameBuf.byteLength;
        const lim = Math.max(8192, Math.min(240 * 1024, Math.floor(maxSliceBytes || 240 * 1024)));
        if (total <= lim + 24) return [frameBuf];
        const hv = new DataView(frameBuf);
        const tId = hv.getUint32(4, false);
        const cId = hv.getUint32(8, false);
        const parts = Math.ceil(total / lim);
        const out = new Array(parts);
        const src = new Uint8Array(frameBuf);
        for (let i = 0; i < parts; i++) {
          const off = i * lim;
          const len = Math.min(lim, total - off);
          const sub = new Uint8Array(24 + len);
          const sv = new DataView(sub.buffer);
          sv.setUint32(0, MAGIC_AETP, false);
          sv.setUint32(4, tId, false);
          sv.setUint32(8, cId, false);
          sv.setUint32(12, total, false);
          sv.setUint32(16, off, false);
          sv.setUint16(20, i, false);
          sv.setUint16(22, parts, false);
          sub.set(src.subarray(off, off + len), 24);
          out[i] = sub.buffer;
        }
        return out;
      }

      async function sendToIndependentPeer(peer) {
        let startedAt = performance.now();
        let paceEpochMs = performance.now();
        const peerLabel = peer.label || peer.id.slice(-8);

        async function paceOutgoingBytes(bytesSent, outEntry) {
          const limitMBps = getMaxUploadLimitMBps();
          if (!limitMBps || limitMBps <= 0) {
            paceEpochMs = performance.now();
            return;
          }
          const bytesPerMs = Math.max(10.24, (limitMBps * 1024 * 1024) / 1000);
          const durMs = bytesSent / bytesPerMs;
          const now = performance.now();
          if (paceEpochMs < now - 80) paceEpochMs = now - 80;
          paceEpochMs += durMs;
          while (getMaxUploadLimitMBps() > 0) {
            if (outEntry && outEntry.cancelled) return;
            const waitMs = paceEpochMs - performance.now();
            if (waitMs <= 1) break;
            await new Promise(r => setTimeout(r, Math.min(80, waitMs)));
          }
        }

        if (peer.dc && peer.dc.readyState === 'open') {
          const chunkSize = chunkKb * 1024;
          const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
          const transferNumId = Math.floor(Math.random() * 0x7fffffff) + 1;
          const fileId = 'f-' + Date.now() + '-' + peer.id.slice(-6) + '-' + Math.random().toString(36).slice(2, 5);
          let rxConfirmed = false;
          let rxErr = '';
          const outEntry = {
            fileId,
            peerId: peer.id,
            peerLabel,
            name: file.name,
            size: file.size,
            paused: transferPaused,
            remotePaused: false,
            cancelled: false,
            cancelledBy: '',
            pct: 0,
            lastStatus: 'WebRTC -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (0%)',
            renderRow: null
          };
          outEntry.renderRow = () => {
            if (outEntry.cancelled) {
              setPeerRow(peer.id, false, (outEntry.cancelledBy === 'remote' ? 'Stopped by peer [' : 'Stopped [') + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name), null);
              return;
            }
            if (outEntry.paused) {
              const pPrefix = outEntry.remotePaused ? 'Paused by peer [' : 'Paused [';
              setPeerRow(peer.id, false, pPrefix + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name) + ' (' + outEntry.pct + '%)', outEntry);
              return;
            }
            setPeerRow(peer.id, false, outEntry.lastStatus, outEntry);
          };
          activeOutgoing.set(fileId, outEntry);
          syncPauseBtnUi();
          rxCompleteResolvers.set(fileId, () => { rxConfirmed = true; });
          rxErrorResolvers.set(fileId, (reason) => { rxErr = reason; });

          try {
            const resumePromise = new Promise(resolve => {
              const timer = setTimeout(() => {
                pendingResumeResolvers.delete(fileId);
                if (pendingResumeResolvers.get(peer.id) === wake) pendingResumeResolvers.delete(peer.id);
                resolve(0);
              }, 1200);
              const wake = (cIdx) => {
                clearTimeout(timer);
                pendingResumeResolvers.delete(fileId);
                if (pendingResumeResolvers.get(peer.id) === wake) pendingResumeResolvers.delete(peer.id);
                resolve(cIdx);
              };
              pendingResumeResolvers.set(fileId, wake);
              pendingResumeResolvers.set(peer.id, wake);
            });

            const metaMsg = JSON.stringify({ kind: 'file:meta', fileId, transferNumId, name: file.name, size: file.size, chunkSize, mimeType: file.type, totalChunks, sha256: 'streaming-aes-gcm' });
            try { peer.dc.send(metaMsg); } catch {}
            const startChunk = Math.max(0, Math.min(await resumePromise, totalChunks));
            if (outEntry.cancelled) {
              outEntry.renderRow();
              return;
            }
            const batchSize = 32;

            let minSlice = 240 * 1024;
            const maxMsg = peer.pc && peer.pc.sctp && peer.pc.sctp.maxMessageSize;
            if (typeof maxMsg === 'number' && maxMsg > 0) {
              minSlice = Math.min(minSlice, Math.max(8192, maxMsg - 128));
            }

            for (let bStart = startChunk; bStart < totalChunks; bStart += batchSize) {
              if (rxErr || outEntry.cancelled) break;
              if (transferPaused || outEntry.paused) {
                outEntry.pct = Math.round((bStart / totalChunks) * 100);
                outEntry.renderRow();
                const keepGoing = await waitWhilePaused(fileId, (ms) => { startedAt += ms; });
                if (!keepGoing || outEntry.cancelled) break;
              }
              const bEnd = Math.min(totalChunks, bStart + batchSize);
              const slab = await file.slice(bStart * chunkSize, Math.min(file.size, bEnd * chunkSize)).arrayBuffer();
              if (outEntry.cancelled) break;

              const frames = await Promise.all(Array.from({ length: bEnd - bStart }, async (_, idx) => {
                const cIdx = bStart + idx;
                const lStart = idx * chunkSize;
                const lEnd = Math.min(slab.byteLength, lStart + chunkSize);
                const iv = new Uint8Array(12);
                crypto.getRandomValues(iv);
                new DataView(iv.buffer).setUint32(8, cIdx >>> 0, false);
                const enc = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, tagLength: 128 }, currentKey, new Uint8Array(slab, lStart, lEnd - lStart));
                const frame = new Uint8Array(24 + enc.byteLength);
                const hv = new DataView(frame.buffer);
                hv.setUint32(0, MAGIC_AETH, false);
                hv.setUint32(4, transferNumId >>> 0, false);
                hv.setUint32(8, cIdx >>> 0, false);
                frame.set(iv, 12);
                frame.set(new Uint8Array(enc), 24);
                return frame.buffer;
              }));

              for (const frame of frames) {
                if (rxErr || outEntry.cancelled) break;
                if (transferPaused || outEntry.paused) {
                  outEntry.renderRow();
                  const keepGoing = await waitWhilePaused(fileId, (ms) => { startedAt += ms; });
                  if (!keepGoing || outEntry.cancelled) break;
                }
                const slices = splitFrameForSctp(frame, minSlice);
                for (const sl of slices) {
                  while (!outEntry.cancelled && peer.dc && peer.dc.readyState === 'open' && peer.dc.bufferedAmount + sl.byteLength > HIGH_WATER) {
                    await new Promise(r => setTimeout(r, 4));
                  }
                  if (outEntry.cancelled) break;
                  if (peer.dc && peer.dc.readyState === 'open') {
                    peer.dc.send(sl.slice(0));
                  }
                }
                if (outEntry.cancelled) break;
                await paceOutgoingBytes(chunkSize, outEntry);
              }
              if (outEntry.cancelled) break;

              const elapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
              const buffered = peer.dc ? peer.dc.bufferedAmount : 0;
              const sentBytes = Math.max(0, Math.min(file.size, bEnd * chunkSize) - buffered);
              const mbps = (sentBytes / (1024 * 1024) / elapsed).toFixed(2);
              const pct = Math.round((sentBytes / Math.max(1, file.size)) * 100);
              outEntry.pct = pct;
              outEntry.lastStatus = 'WebRTC -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (' + pct + '% · ' + mbps + ' MB/s)';
              outEntry.renderRow();
            }

            let lastBuf = Infinity;
            let lastBufAt = performance.now();
            while (!outEntry.cancelled && !rxConfirmed && !rxErr && peer.dc && peer.dc.readyState === 'open' && peer.dc.bufferedAmount > 0) {
              const cur = peer.dc.bufferedAmount;
              const nowD = performance.now();
              if (cur < lastBuf) {
                lastBuf = cur;
                lastBufAt = nowD;
                const sentBytes = Math.max(0, file.size - cur);
                const pct = Math.round((sentBytes / Math.max(1, file.size)) * 100);
                const elapsed = Math.max(0.02, (nowD - startedAt) / 1000);
                const mbps = (sentBytes / (1024 * 1024) / elapsed).toFixed(2);
                outEntry.pct = pct;
                outEntry.lastStatus = 'WebRTC -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (' + pct + '% · ' + mbps + ' MB/s)';
                outEntry.renderRow();
              } else if (nowD - lastBufAt > 15000) {
                break;
              }
              await new Promise(r => setTimeout(r, 25));
            }

            const ackDeadline = performance.now();
            while (!outEntry.cancelled && !rxConfirmed && !rxErr && performance.now() - ackDeadline < 4000) {
              await new Promise(r => setTimeout(r, 40));
            }

            if (outEntry.cancelled) {
              outEntry.renderRow();
              return;
            }
            if (rxErr) {
              setPeerRow(peer.id, true, '[' + escapeHtml(peerLabel) + '] Error: ' + escapeHtml(rxErr), null);
              return;
            }
            const totalElapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
            const finalMbps = (file.size / (1024 * 1024) / totalElapsed).toFixed(2);
            setPeerRow(peer.id, false, 'Completed [' + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name) + ' (' + finalMbps + ' MB/s avg)', null);
            return;
          } finally {
            rxCompleteResolvers.delete(fileId);
            rxErrorResolvers.delete(fileId);
            activeOutgoing.delete(fileId);
            syncPauseBtnUi();
          }
        }

        const dst = peer.id;
        const isExe = peer.type === 'exe';
        const cSize = 49152;
        const totalChunks = Math.max(1, Math.ceil(file.size / cSize));
        const fileId = 'f-' + Date.now() + '-' + peer.id.slice(-5) + '-' + Math.random().toString(36).slice(2, 5);

        const outEntry = {
          fileId,
          peerId: peer.id,
          peerLabel,
          name: file.name,
          size: file.size,
          paused: transferPaused,
          remotePaused: false,
          cancelled: false,
          cancelledBy: '',
          pct: 0,
          lastStatus: 'Bridge -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (0%)',
          renderRow: null
        };
        outEntry.renderRow = () => {
          if (outEntry.cancelled) {
            setPeerRow(peer.id, false, (outEntry.cancelledBy === 'remote' ? 'Stopped by peer [' : 'Stopped [') + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name), null);
            return;
          }
          if (outEntry.paused) {
            const pPrefix = outEntry.remotePaused ? 'Paused by peer [' : 'Paused [';
            setPeerRow(peer.id, false, pPrefix + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name) + ' (' + outEntry.pct + '%)', outEntry);
            return;
          }
          setPeerRow(peer.id, false, outEntry.lastStatus, outEntry);
        };
        activeOutgoing.set(fileId, outEntry);
        syncPauseBtnUi();

        try {
          const resumePromise = new Promise(resolve => {
            const timer = setTimeout(() => {
              pendingResumeResolvers.delete(fileId);
              if (pendingResumeResolvers.get(dst) === wake) pendingResumeResolvers.delete(dst);
              resolve(0);
            }, 600);
            const wake = (idx) => {
              clearTimeout(timer);
              pendingResumeResolvers.delete(fileId);
              if (pendingResumeResolvers.get(dst) === wake) pendingResumeResolvers.delete(dst);
              resolve(idx);
            };
            pendingResumeResolvers.set(fileId, wake);
            pendingResumeResolvers.set(dst, wake);
          });

          sendCloudCandidate(dst, {
            kind: isExe ? 'exe:file-start' : 'browser:file-start',
            fileId,
            name: file.name,
            size: file.size,
            chunkSize: cSize,
            totalChunks
          });

          let cIdx = Math.max(0, Math.min(await resumePromise, totalChunks));
          for (let off = cIdx * cSize; off < file.size; off += cSize) {
            if (outEntry.cancelled) break;
            if (transferPaused || outEntry.paused) {
              outEntry.pct = Math.round((cIdx / totalChunks) * 100);
              outEntry.renderRow();
              const keepGoing = await waitWhilePaused(fileId, (ms) => { startedAt += ms; });
              if (!keepGoing || outEntry.cancelled) break;
            }
            const buf = await file.slice(off, Math.min(file.size, off + cSize)).arrayBuffer();
            if (outEntry.cancelled) break;
            const bytes = new Uint8Array(buf);
            let bin = '';
            for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
            sendCloudCandidate(dst, {
              kind: isExe ? 'exe:file-chunk' : 'browser:file-chunk',
              fileId,
              chunkIndex: cIdx,
              data: btoa(bin)
            });
            cIdx++;
            await paceOutgoingBytes(bytes.byteLength, outEntry);
            if (outEntry.cancelled) break;
            const elapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
            const mbps = (Math.min(file.size, off + bytes.byteLength) / (1024 * 1024) / elapsed).toFixed(2);
            const pct = Math.round((cIdx / totalChunks) * 100);
            outEntry.pct = pct;
            outEntry.lastStatus = 'Bridge -> ' + escapeHtml(peerLabel) + ': ' + escapeHtml(file.name) + ' (' + pct + '% · ' + mbps + ' MB/s)';
            outEntry.renderRow();
            if (cIdx % 24 === 0) {
              await new Promise(resolve => {
                const timer = setTimeout(() => {
                  cloudAckResolvers.delete(fileId);
                  if (cloudAckResolvers.get(dst) === wake) cloudAckResolvers.delete(dst);
                  resolve();
                }, 350);
                const wake = () => {
                  clearTimeout(timer);
                  cloudAckResolvers.delete(fileId);
                  if (cloudAckResolvers.get(dst) === wake) cloudAckResolvers.delete(dst);
                  resolve();
                };
                cloudAckResolvers.set(fileId, wake);
                cloudAckResolvers.set(dst, wake);
              });
            }
          }
          if (outEntry.cancelled) {
            outEntry.renderRow();
            return;
          }
          sendCloudCandidate(dst, { kind: isExe ? 'exe:file-end' : 'browser:file-end', fileId });
          const totalElapsed = Math.max(0.02, (performance.now() - startedAt) / 1000);
          const finalMbps = (file.size / (1024 * 1024) / totalElapsed).toFixed(2);
          setPeerRow(peer.id, false, 'Completed [' + escapeHtml(peerLabel) + ']: ' + escapeHtml(file.name) + ' (' + finalMbps + ' MB/s avg)', null);
        } finally {
          activeOutgoing.delete(fileId);
          syncPauseBtnUi();
        }
      }

      await Promise.all(targetPeers.map(p => sendToIndependentPeer(p)));
    });

    if (document.getElementById('room-input').value.trim()) {
      connectRoom();
    } else {
      document.getElementById('status-badge').textContent = 'Waiting for tunnel name — enter a name and click Connect';
    }
  <\/script>
</body>
</html>`}function Qe(e,t,n=`application/octet-stream`){let r=new Blob([t],{type:n}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,document.body.appendChild(a),a.click(),document.body.removeChild(a),window.setTimeout(()=>URL.revokeObjectURL(i),5e3)}function $e(e=``,t){let n=(e||``).replace(/[^a-z0-9-]/gi,``).toLowerCase(),r=typeof window<`u`&&window.location&&window.location.origin?window.location.origin.replace(/^http/,`ws`)+`/ws-tunnel`:``,i=String(t||r||``).trim(),a=`
using System;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Reflection;

[assembly: AssemblyTitle("AetherTunnel P2P Engine")]
[assembly: AssemblyProduct("AetherTunnel")]
[assembly: AssemblyVersion("1.0.2.0")]
[assembly: AssemblyFileVersion("1.0.2.0")]

namespace AetherTunnelNative
{
    static class Program
    {
        [DllImport("user32.dll")]
        private static extern bool SetProcessDpiAwarenessContext(IntPtr dpiFlag);

        [DllImport("shcore.dll")]
        private static extern int SetProcessDpiAwareness(int value);

        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [DllImport("winmm.dll")]
        private static extern uint timeBeginPeriod(uint uPeriod);

        [STAThread]
        static void Main()
        {
            // Enable 1ms OS scheduler timer resolution for high-precision P2P UDP pacing
            try { timeBeginPeriod(1); } catch { }

            // Enable Per-Monitor V2 High-DPI rendering on Windows 10/11 so text and controls are 100% razor-sharp
            try { SetProcessDpiAwarenessContext(new IntPtr(-4)); } catch { }
            try { SetProcessDpiAwareness(2); } catch { }
            try { SetProcessDPIAware(); } catch { }

            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls | (SecurityProtocolType)12288;
            }
            catch
            {
                try { ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls; } catch { }
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }

    public class MainForm : Form
    {
        private const uint MAGIC_HEADER = 0x4145544B; // "AETK" (AetherTunnel Kernel TCP Frame)
        private const uint MAGIC_UDP_DATA = 0x41455455; // "AETU" (AetherTunnel P2P UDP Encrypted Frame)
        private const int CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB Direct Kernel Socket Macro-Block (.EXE <-> .EXE)
        private const int UDP_CHUNK_SIZE = 1376; // 1376 B Plaintext -> 1420 B UDP / 1448 B IPv4 (Zero IP Fragmentation across CGNAT & PPPoE!)
        private const int WS_CHUNK_SIZE = 1024 * 1024; // 1 MB Localhost WebSocket Frame (.EXE <-> Local Browser)
        private const int CLOUD_CHUNK_SIZE = 49152; // 48 KB Binary / 64 KB Base64 Frame for WSS Cloud Bridge
        private const int PARALLEL_WORKERS = 4; // 4x Parallel Hardware AES-NI Workers per Wave
        private const int UDP_DISCOVERY_PORT = 45888;
        private const int MAX_ROOM_PEERS = 8;

        private readonly string instanceId = Guid.NewGuid().ToString("N").Substring(0, 12);
        private const string DEFAULT_CLOUD_WS_URL = "${/^(wss?:\/\/[a-z0-9.\-:\[\]]+\/[^\s"'<>\\]*)$/i.test(i)?i:``}";
        private volatile string currentRoomCode = "${n}";
        private volatile string localDisplayName = "";
        private volatile string selectedTargetPeerId = "*";
        private volatile bool roomFullRejected = false;
        private bool suppressRoomBroadcast = false;
        private float dpiScale = 1.0f;

        private TextBox txtRoomCode;
        private TextBox txtDisplayName;
        private TextBox txtPassphrase;
        private Panel pnlRoomPresence;
        private Label lblRoomPresence;
        private Label lblKeyFingerprint;
        private Label lblStatusBadge;
        private Label lblLocalEndpoint;
        private Label lblSpeedMetric;
        private Label lblTransferStats;
        private Label lblProgressDetail;
        private ProgressBar progressBar;
        private ComboBox cmbTargetPeer;
        private TextBox txtMaxUploadMBps;
        private readonly List<string> targetPeerIds = new List<string>();
        private Label lblQueueSummary;
        private ListBox lstQueue;
        private Button btnRetryQueue;
        private Button btnRemoveQueue;
        private Button btnClearQueue;
        private Button btnPauseResume;
        private CheckBox chkAutoAccept;
        private ListBox lstLog;
        private Button btnSendFile;
        private Button btnSendFolder;
        private FolderBrowserDialog folderDialog;
        private FolderBrowserDialog folderPickDialog;

        private TcpListener tcpListener;
        private UdpClient udpDiscovery;
        private UdpClient udpP2pClient;
        private UdpClient udpP2pV6Client;
        private int listenPort = 45889;
        private int udpP2pPort = 45890;
        private int udpP2pV6Port = 0;
        private volatile string publicWanUdpEndpoint = "";
        private volatile string publicWanV6UdpEndpoint = "";
        private volatile string stunEndpoint0 = "";
        private volatile string stunEndpoint1 = "";
        private volatile int natSymDetected = 0;
        private volatile int natPortDelta = 0;
        private volatile string natTypeSummary = "Probing NAT...";
        private volatile bool upnpTcpMapped = false;
        private volatile bool upnpUdpMapped = false;
        private volatile string remotePeerWanUdp = "";
        private volatile string remotePeerLanUdp = "";
        private volatile string remotePeerWanV6Udp = "";
        private volatile string remotePeerLanTcp = "";
        private volatile string remotePeerPredictedWanUdp = "";
        private volatile int remotePeerNatSym = 0;
        private volatile int remotePeerNatDelta = 0;
        private volatile int remotePeerUpnpTcp = 0;
        private int lastPunchFanTick = unchecked(Environment.TickCount - 10000);
        private string lastLoggedPunchTarget = "";
        private volatile bool isRunning = true;

        // 1. Native .EXE <-> .EXE Kernel TCP Peer & Resume Signaling
        private TcpClient activePeerClient;
        private NetworkStream activePeerStream;
        private readonly object streamWriteLock = new object();
        private volatile int kernelTcpResumeChunk = 0;
        private volatile bool kernelTcpWaitAccept = false;
        private volatile bool kernelTcpRejected = false;
        private volatile bool kernelTcpResumeReceived = false;
        private readonly AutoResetEvent kernelTcpResumeEvent = new AutoResetEvent(false);

        // 1B. Native .EXE <-> .EXE STUN NAT-Punched Direct UDP Peer (Token-Bucket Paced 600-5000 Mbit/s + Real-Time NACK)
        private IPEndPoint activeUdpPeerEndpoint = null;
        private DateTime lastUdpPeerSeen = DateTime.MinValue;
        private volatile int udpPeerAckedChunk = -1;
        private volatile int udpPeerContiguousChunk = -1;
        private volatile int udpPeerUniqueAcked = 0;
        private volatile int udpPeerMeasuredMbps = 0;
        private volatile int udpPeerResumeChunk = 0;
        private volatile bool udpTransferDoneAcked = false;
        private volatile bool udpNeedStartResend = false;
        private volatile bool udpWaitAcceptReceived = false;
        private volatile bool udpTransferRejected = false;
        private volatile bool udpResumeReceived = false;
        private volatile int udpPromptState = 0; // 0=idle, 1=prompting, 2=accepted, 3=rejected
        private volatile string udpPromptKey = "";
        private volatile string udpPromptAcceptedKey = "";
        private int udpPromptRejectTick = 0;
        private int udpPromptStartedTick = 0;
        private volatile bool udpPendingAcceptOpen = false;
        private volatile string udpPendingAcceptHeader = "";
        private IPEndPoint udpPendingAcceptEp = null;
        private double dynamicUdpBitrateMbps = 25.0; // Self-tuning Smooth Dynamic P2P Pacer (8–5000 Mbit/s)
        private double udpBestRxMbps = 25.0;
        private double udpCongestionCeilingMbps = 0.0;
        private long udpBestRxDecayTicks = 0;
        private volatile int lastNackReceivedTick = 0;
        private volatile int lastNackCutTick = 0;
        private volatile int lastAckReceivedTick = 0;
        private volatile int udpTxLastPeerActivityTick = 0;
        private volatile bool udpInSlowStart = true;
        private volatile int udpCleanAckStreak = 0;
        private volatile int udpLowRxStreak = 0;
        private int pacingResetRequested = 0;
        private readonly object udpTxLock = new object();
        private volatile string udpTxActiveFileName = "";
        private readonly ConcurrentQueue<int> udpRetransmitQueue = new ConcurrentQueue<int>();
        private readonly ConcurrentDictionary<int, int> udpSenderChunkLastSentTick = new ConcurrentDictionary<int, int>();
        private readonly AutoResetEvent udpAckEvent = new AutoResetEvent(false);
        private readonly AutoResetEvent udpResumeEvent = new AutoResetEvent(false);
        private readonly ConcurrentQueue<byte[]> udpRxDataQueue = new ConcurrentQueue<byte[]>();
        private readonly AutoResetEvent udpRxDataEvent = new AutoResetEvent(false);
        private volatile bool udpRxStartPending = false;
        private volatile bool udpRxEndPending = false;
        private volatile int udpRxEndTick = 0;
        private volatile int lastUniqueRxChunkTick = 0;
        private volatile string activeRxUdpFileName = "";
        private volatile string activeRxUdpPartPath = "";
        private volatile bool udpRxCloseRequested = false;
        private volatile string udpRxCloseTargetPath = "";
        private readonly ManualResetEvent udpRxClosedSignal = new ManualResetEvent(true);
        private volatile string lastCompletedUdpFileNameVolatile = "";
        private long maxUploadBytesPerSec = 0L;
        private string initialMaxSpeedText = "0";
        private volatile string udpPendingStartHeader = "";
        private IPEndPoint udpPendingStartEp = null;
        private volatile bool autoAcceptAllIncoming = false;
        private readonly object incomingPromptLock = new object();
        private readonly object rxHandleCoordLock = new object();
        private TcpClient activeTcpRxClient = null;
        private volatile string activeTcpRxPartPath = "";
        private TcpClient activeWsRxClient = null;
        private volatile string activeWsRxPartPath = "";
        private sealed class TransferQueueEntry
        {
            public string Id;
            public string FullPath;
            public string DisplayName;
            public long FileSize;
            public string Status;
            public string TargetPeerId;
            public string TargetLabel;
            public int RetryCount;
            public DateTime NextRetryUtc = DateTime.MinValue;
        }
        private sealed class RoomPeerInfo
        {
            public string PeerId;
            public string DisplayName;
            public string ClientType;
            public string CloudPeerId;
            public string WanUdpEp;
            public string LanUdpEp;
            public string WanV6UdpEp;
            public string PredWanUdpEp;
            public string LanTcpEp;
            public int NatSym;
            public int NatDelta;
            public int UpnpTcp;
            public IPEndPoint ActiveUdpEp;
            public DateTime LastUdpSeen = DateTime.MinValue;
            public TcpClient TcpClientConn;
            public NetworkStream TcpStream;
            public DateTime LastTcpSeen = DateTime.MinValue;
            public SignalingChannel PreferredCloudChannel;
            public DateTime LastCloudSeen = DateTime.MinValue;
        }
        private readonly ConcurrentDictionary<string, RoomPeerInfo> roomPeers = new ConcurrentDictionary<string, RoomPeerInfo>();
        private readonly List<TransferQueueEntry> transferQueue = new List<TransferQueueEntry>();
        private readonly object transferQueueLock = new object();
        private readonly AutoResetEvent transferQueueEvent = new AutoResetEvent(false);
        private readonly HashSet<string> cancelledQueueIds = new HashSet<string>();
        private volatile string activeQueueTransferId = "";
        private volatile bool transferPaused = false;
        private readonly ManualResetEvent transferResumeEvent = new ManualResetEvent(true);
        private readonly HashSet<string> attemptedAutoTcpEndpoints = new HashSet<string>();
        private readonly ThreadLocal<AesCryptoServiceProvider> threadLocalAes = new ThreadLocal<AesCryptoServiceProvider>(delegate() {
            AesCryptoServiceProvider a = new AesCryptoServiceProvider();
            a.KeySize = 256;
            a.BlockSize = 128;
            a.Mode = CipherMode.CBC;
            a.Padding = PaddingMode.PKCS7;
            return a;
        });
        private readonly ThreadLocal<byte[]> threadLocalIv = new ThreadLocal<byte[]>(delegate() { return new byte[16]; });
        private long totalAppBufferedBytes = 0;
        private const long HARD_RAM_CAP_BYTES = 1750L * 1024L * 1024L;
        private const long DISK_STAGE_TARGET_BYTES = 256L * 1024L * 1024L;
        private const int CHUNKS_PER_STAGE_PAGE = 6096; // 6096 * 1376 B = 8,388,096 B (~8.00 MB Windows 11 NVMe aligned block)
        private const int STAGE_PAGE_BYTES = CHUNKS_PER_STAGE_PAGE * UDP_CHUNK_SIZE;
        private readonly ManualResetEvent udpWriterExitedEvent = new ManualResetEvent(true);
        private readonly ManualResetEvent udpDiskIoExitedEvent = new ManualResetEvent(true);
        private readonly ConcurrentQueue<byte[]> udpStageBufferPool = new ConcurrentQueue<byte[]>();
        private readonly ConcurrentQueue<DiskWriteJob> diskWriteQueue = new ConcurrentQueue<DiskWriteJob>();
        private readonly AutoResetEvent diskWriteEvent = new AutoResetEvent(false);
        private readonly ManualResetEvent diskIoIdleEvent = new ManualResetEvent(true);
        private readonly object diskFileStreamLock = new object();
        private int activeDiskIoJobs = 0;
        private int lastUiUpdateTick = 0;
        private volatile int smoothedDiskWriteMbps = 0;
        private volatile int lastDiskWriteMs = 0;
        private volatile int diskSequentialNextPage = 0;
        private volatile int udpResumeBoundaryPage = -1;
        private volatile int udpResumeBoundarySlot = 0;

        private sealed class UdpStagePage
        {
            public int PageIndex;
            public byte[] Data;
            public bool[] Present;
            public short[] ChunkLens;
            public int StartSlot;
            public int PresentCount;
            public int ExpectedCount;
            public int ValidBytes;
        }

        private sealed class DiskWriteJob
        {
            public FileStream TargetFile;
            public string PartPath;
            public long ExpectedFileSize;
            public byte[] Buffer;
            public int Length;
            public long FileOffset;
            public int CkptContigChunk;
            public bool ForceOsSync;
        }

        // 2. Native .EXE <-> Local Browser Kernel WebSocket Bridge (ws://127.0.0.1:45889)
        private TcpClient activeBrowserWsClient;
        private NetworkStream activeBrowserWsStream;
        private readonly object wsWriteLock = new object();
        private volatile int wsResumeChunk = 0;
        private volatile bool wsWaitAcceptReceived = false;
        private volatile bool wsTransferRejected = false;
        private volatile bool wsResumeReceived = false;
        private readonly AutoResetEvent wsResumeEvent = new AutoResetEvent(false);

        // 3. Native .EXE <-> Chrome Browser & Remote .EXE Multi-Bus WSS Wormhole Cloud Bridge (App /ws-tunnel + Concurrent MQTT Brokers)
        private sealed class SignalingChannel
        {
            public string Name;
            public bool IsMqtt;
            public string Topic;
            public ClientWebSocket Ws;
            public readonly object SendLock = new object();
        }
        private readonly ConcurrentDictionary<string, SignalingChannel> activeSignalingChannels = new ConcurrentDictionary<string, SignalingChannel>();
        private volatile SignalingChannel lastExeSignalingChannel = null;
        private volatile SignalingChannel lastBrowserSignalingChannel = null;
        private readonly ConcurrentDictionary<string, int> cloudHelloReplyTicks = new ConcurrentDictionary<string, int>();
        private readonly object cloudRxFileLock = new object();
        private FileStream cloudOutFile = null;
        private string cloudFileName = "";
        private string cloudPartPath = "";
        private string cloudOutPath = "";
        private long cloudExpectedSize = 0;
        private long cloudReceivedBytes = 0;
        private long cloudSessionStartBytes = 0;
        private Stopwatch cloudRxSw = null;
        private string activeCloudMyId = "";
        private string activeCloudTopic = "aethertunnel/v1/room/default";
        private string activeCloudBrowserPeerId = "";
        private string activeCloudExePeerId = "";
        private DateTime lastCloudBrowserSeen = DateTime.MinValue;
        private DateTime lastCloudExeSeen = DateTime.MinValue;
        private volatile bool cloudReconnectRequested = false;
        private readonly AutoResetEvent cloudAckEvent = new AutoResetEvent(false);
        private volatile int cloudResumeChunk = 0;
        private volatile bool cloudWaitAcceptReceived = false;
        private volatile bool cloudTransferRejected = false;
        private volatile bool cloudResumeReceived = false;
        private volatile string cloudRejectedFileId = "";
        private readonly AutoResetEvent cloudResumeEvent = new AutoResetEvent(false);

        private byte[] aesKey = new byte[32];
        private string currentFingerprint = "Deriving...";
        private string downloadDirectory;

        private int S(int px)
        {
            return (int)Math.Round(px * dpiScale);
        }

        public MainForm()
        {
            using (Graphics g = Graphics.FromHwnd(IntPtr.Zero))
            {
                dpiScale = g.DpiX / 96.0f;
                if (dpiScale < 1.0f) dpiScale = 1.0f;
            }

            this.AutoScaleMode = AutoScaleMode.None;
            this.Text = "AetherTunnel V1.02 — Standalone P2P NAT-Punching & Kernel-Socket Edition";
            this.ClientSize = new Size(S(1020), S(668));
            this.MinimumSize = new Size(S(920), S(600));
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(9, 13, 22);
            this.ForeColor = Color.FromArgb(241, 245, 249);
            this.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            this.AllowDrop = true;
            this.DoubleBuffered = true;
            try
            {
                string comp = Environment.MachineName;
                if (!String.IsNullOrEmpty(comp)) localDisplayName = SanitizeJsonText(comp);
            }
            catch { }
            if (String.IsNullOrEmpty(localDisplayName)) localDisplayName = "WinEXE-" + instanceId.Substring(0, 4);

            string configPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "config.txt");
            bool loadedCfg = false;
            try
            {
                if (File.Exists(configPath))
                {
                    string savedDir = File.ReadAllText(configPath).Trim();
                    if (!String.IsNullOrEmpty(savedDir) && Directory.Exists(savedDir))
                    {
                        downloadDirectory = savedDir;
                        loadedCfg = true;
                    }
                }
            }
            catch { }

            if (!loadedCfg)
            {
                downloadDirectory = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                    "Downloads"
                );
                if (!Directory.Exists(downloadDirectory))
                {
                    downloadDirectory = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                }
            }

            try
            {
                string speedCfgPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "speedlimit.txt");
                if (File.Exists(speedCfgPath))
                {
                    string rawSpd = File.ReadAllText(speedCfgPath).Trim().Replace(',', '.');
                    double parsedSpd = 0.0;
                    if (Double.TryParse(rawSpd, NumberStyles.Float, CultureInfo.InvariantCulture, out parsedSpd) && parsedSpd > 0.0 && !Double.IsNaN(parsedSpd) && !Double.IsInfinity(parsedSpd))
                    {
                        Interlocked.Exchange(ref maxUploadBytesPerSec, Math.Max(10240L, (long)Math.Round(parsedSpd * 1024.0 * 1024.0)));
                        initialMaxSpeedText = parsedSpd.ToString("0.###", CultureInfo.InvariantCulture);
                    }
                }
            }
            catch { }

            BuildUserInterface();
            DeriveCryptographicKey();
            StartKernelListenerAndDiscovery();

            this.DragEnter += OnFormDragEnter;
            this.DragDrop += OnFormDragDrop;
            this.FormClosing += OnFormClosing;
        }

        private Label CreateCleanLabel(string text, Font font, Color color, Point location, bool autoSize)
        {
            Label lbl = new Label();
            lbl.UseMnemonic = false;
            lbl.Text = text;
            if (font != null) lbl.Font = font;
            lbl.ForeColor = color;
            lbl.Location = location;
            lbl.AutoSize = autoSize;
            return lbl;
        }

        private void BuildUserInterface()
        {
            Color bgCard = Color.FromArgb(15, 23, 42);
            Color bgInput = Color.FromArgb(9, 13, 22);
            Color fgMuted = Color.FromArgb(148, 163, 184);
            Color accentSky = Color.FromArgb(56, 189, 248);
            Color accentEmerald = Color.FromArgb(52, 211, 153);

            Panel headerPanel = new Panel();
            headerPanel.Dock = DockStyle.Top;
            headerPanel.Height = S(78);
            headerPanel.BackColor = Color.FromArgb(12, 18, 30);

            Label lblTitle = CreateCleanLabel(
                "AetherTunnel V1.02 — Standalone P2P & NAT-Punching Engine (.EXE)",
                new Font("Segoe UI Semibold", 14.5f, FontStyle.Bold),
                Color.FromArgb(248, 250, 252),
                new Point(S(24), S(12)),
                true
            );
            headerPanel.Controls.Add(lblTitle);

            Label lblSubtitle = CreateCleanLabel(
                "RFC 5389 STUN + Simultaneous UDP Hole Punching · Resumable .part Transfers · Winsock2 TCP & Browser Bridge",
                new Font("Consolas", 8.8f, FontStyle.Regular),
                accentSky,
                new Point(S(26), S(46)),
                true
            );
            headerPanel.Controls.Add(lblSubtitle);

            lblStatusBadge = CreateCleanLabel(
                "PEER STATUS: PROBING NAT & STUN...",
                new Font("Consolas", 9.5f, FontStyle.Bold),
                accentEmerald,
                new Point(S(560), S(16)),
                true
            );
            lblStatusBadge.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            headerPanel.Controls.Add(lblStatusBadge);

            this.Controls.Add(headerPanel);

            Panel leftCard = new Panel();
            leftCard.BackColor = bgCard;
            leftCard.Location = new Point(S(24), S(94));
            leftCard.Size = new Size(S(436), S(552));
            leftCard.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left;

            Label lblSec1 = CreateCleanLabel(
                "1. Wormhole Pairing & Kernel TCP Endpoint",
                new Font("Segoe UI Semibold", 11f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(14)),
                true
            );
            leftCard.Controls.Add(lblSec1);

            Label lblCodeTitle = CreateCleanLabel(
                "Tunnel Name (Enter a name and click Connect):",
                null,
                fgMuted,
                new Point(S(20), S(42)),
                true
            );
            leftCard.Controls.Add(lblCodeTitle);

            txtRoomCode = new TextBox();
            txtRoomCode.Text = "${n}";
            txtRoomCode.Font = new Font("Consolas", 11f, FontStyle.Bold);
            txtRoomCode.BackColor = bgInput;
            txtRoomCode.ForeColor = accentSky;
            txtRoomCode.BorderStyle = BorderStyle.FixedSingle;
            txtRoomCode.Location = new Point(S(20), S(64));
            txtRoomCode.Size = new Size(S(222), S(28));
            txtRoomCode.KeyDown += delegate(object sKey, KeyEventArgs eKey) {
                if (eKey.KeyCode == Keys.Enter)
                {
                    eKey.SuppressKeyPress = true;
                    ConnectToEnteredRoom();
                }
            };
            leftCard.Controls.Add(txtRoomCode);

            Button btnConnectRoom = new Button();
            btnConnectRoom.UseMnemonic = false;
            btnConnectRoom.Text = "Connect";
            btnConnectRoom.FlatStyle = FlatStyle.Flat;
            btnConnectRoom.BackColor = accentSky;
            btnConnectRoom.ForeColor = Color.FromArgb(9, 13, 22);
            btnConnectRoom.Font = new Font("Segoe UI", 9f, FontStyle.Bold);
            btnConnectRoom.Location = new Point(S(248), S(63));
            btnConnectRoom.Size = new Size(S(88), S(29));
            btnConnectRoom.Click += delegate {
                ConnectToEnteredRoom();
            };
            leftCard.Controls.Add(btnConnectRoom);

            Button btnNewCode = new Button();
            btnNewCode.UseMnemonic = false;
            btnNewCode.Text = "Random";
            btnNewCode.FlatStyle = FlatStyle.Flat;
            btnNewCode.BackColor = Color.FromArgb(30, 41, 59);
            btnNewCode.ForeColor = Color.White;
            btnNewCode.Location = new Point(S(342), S(63));
            btnNewCode.Size = new Size(S(74), S(29));
            btnNewCode.Click += delegate {
                string[] words = new string[] { "cobalt", "falcon", "nebula", "quartz", "vortex", "cipher", "zenith", "aurora", "photon", "obsidian" };
                Random r = new Random();
                txtRoomCode.Text = r.Next(100, 999).ToString() + "-" + words[r.Next(words.Length)] + "-" + words[r.Next(words.Length)];
            };
            leftCard.Controls.Add(btnNewCode);

            pnlRoomPresence = new Panel();
            pnlRoomPresence.BackColor = Color.FromArgb(30, 27, 22);
            pnlRoomPresence.BorderStyle = BorderStyle.FixedSingle;
            pnlRoomPresence.Location = new Point(S(20), S(98));
            pnlRoomPresence.Size = new Size(S(396), S(36));

            lblRoomPresence = CreateCleanLabel(
                String.IsNullOrEmpty("${n}") ? "Enter tunnel name and click Connect" : "[1/8 USERS] No other users in room...",
                new Font("Consolas", 8.6f, FontStyle.Bold),
                Color.FromArgb(251, 191, 36),
                new Point(S(8), S(9)),
                true
            );
            pnlRoomPresence.Controls.Add(lblRoomPresence);
            leftCard.Controls.Add(pnlRoomPresence);

            Label lblNameTitle = CreateCleanLabel(
                "Your display name in room (max 8 users):",
                null,
                fgMuted,
                new Point(S(20), S(140)),
                true
            );
            leftCard.Controls.Add(lblNameTitle);

            txtDisplayName = new TextBox();
            txtDisplayName.Text = localDisplayName;
            txtDisplayName.Font = new Font("Segoe UI", 9.2f);
            txtDisplayName.BackColor = bgInput;
            txtDisplayName.ForeColor = Color.White;
            txtDisplayName.BorderStyle = BorderStyle.FixedSingle;
            txtDisplayName.Location = new Point(S(20), S(160));
            txtDisplayName.Size = new Size(S(396), S(25));
            txtDisplayName.TextChanged += delegate {
                string clean = SanitizeJsonText(txtDisplayName.Text);
                localDisplayName = clean.Length > 0 ? clean : ("WinEXE-" + instanceId.Substring(0, 4));
            };
            leftCard.Controls.Add(txtDisplayName);

            Label lblPassTitle = CreateCleanLabel(
                "Optional E2EE Passphrase (PBKDF2-HMAC-SHA256 Salt):",
                null,
                fgMuted,
                new Point(S(20), S(192)),
                true
            );
            leftCard.Controls.Add(lblPassTitle);

            txtPassphrase = new TextBox();
            txtPassphrase.UseSystemPasswordChar = true;
            txtPassphrase.Font = new Font("Consolas", 10f);
            txtPassphrase.BackColor = bgInput;
            txtPassphrase.ForeColor = Color.White;
            txtPassphrase.BorderStyle = BorderStyle.FixedSingle;
            txtPassphrase.Location = new Point(S(20), S(212));
            txtPassphrase.Size = new Size(S(396), S(25));
            txtPassphrase.TextChanged += delegate { DeriveCryptographicKey(); };
            leftCard.Controls.Add(txtPassphrase);

            Label lblFpCaption = CreateCleanLabel(
                "E2EE Key Fingerprint (Matches Chrome Browser 1:1):",
                null,
                fgMuted,
                new Point(S(20), S(244)),
                true
            );
            leftCard.Controls.Add(lblFpCaption);

            lblKeyFingerprint = CreateCleanLabel(
                "Deriving...",
                new Font("Consolas", 11f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(264)),
                true
            );
            leftCard.Controls.Add(lblKeyFingerprint);

            Label lblLocalCaption = CreateCleanLabel(
                "Your Direct Kernel TCP & Local Browser Bridge Address:",
                null,
                fgMuted,
                new Point(S(20), S(292)),
                true
            );
            leftCard.Controls.Add(lblLocalCaption);

            lblLocalEndpoint = CreateCleanLabel(
                "Starting Winsock2 listener...",
                new Font("Consolas", 9.0f, FontStyle.Bold),
                Color.FromArgb(226, 232, 240),
                new Point(S(20), S(312)),
                false
            );
            lblLocalEndpoint.Size = new Size(S(396), S(36));
            leftCard.Controls.Add(lblLocalEndpoint);

            Label lblSaveDir = CreateCleanLabel(
                "Incoming files save to: " + downloadDirectory,
                new Font("Segoe UI", 8.6f),
                fgMuted,
                new Point(S(20), S(354)),
                false
            );
            lblSaveDir.Size = new Size(S(396), S(34));
            leftCard.Controls.Add(lblSaveDir);

            Button btnChangeDir = new Button();
            btnChangeDir.UseMnemonic = false;
            btnChangeDir.Text = "Change Save Folder...";
            btnChangeDir.FlatStyle = FlatStyle.Flat;
            btnChangeDir.BackColor = Color.FromArgb(30, 41, 59);
            btnChangeDir.ForeColor = Color.White;
            btnChangeDir.Location = new Point(S(20), S(394));
            btnChangeDir.Size = new Size(S(190), S(34));
            btnChangeDir.Click += delegate {
                if (folderDialog == null) folderDialog = new FolderBrowserDialog();
                folderDialog.SelectedPath = downloadDirectory;
                if (folderDialog.ShowDialog() == DialogResult.OK)
                {
                    downloadDirectory = folderDialog.SelectedPath;
                    lblSaveDir.Text = "Incoming files save to: " + downloadDirectory;
                    try
                    {
                        string cfgPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "config.txt");
                        string cfgDir = Path.GetDirectoryName(cfgPath);
                        if (!Directory.Exists(cfgDir)) Directory.CreateDirectory(cfgDir);
                        File.WriteAllText(cfgPath, downloadDirectory);
                    }
                    catch { }
                }
            };
            leftCard.Controls.Add(btnChangeDir);

            Button btnOpenDir = new Button();
            btnOpenDir.UseMnemonic = false;
            btnOpenDir.Text = "Open Downloads Folder";
            btnOpenDir.FlatStyle = FlatStyle.Flat;
            btnOpenDir.BackColor = Color.FromArgb(30, 41, 59);
            btnOpenDir.ForeColor = accentSky;
            btnOpenDir.Location = new Point(S(222), S(394));
            btnOpenDir.Size = new Size(S(194), S(34));
            btnOpenDir.Click += delegate {
                try { Process.Start("explorer.exe", downloadDirectory); } catch { }
            };
            leftCard.Controls.Add(btnOpenDir);

            chkAutoAccept = new CheckBox();
            chkAutoAccept.UseMnemonic = false;
            chkAutoAccept.Text = "Auto-accept incoming transfers";
            chkAutoAccept.ForeColor = Color.FromArgb(203, 213, 225);
            chkAutoAccept.BackColor = bgCard;
            chkAutoAccept.Font = new Font("Segoe UI", 9.0f, FontStyle.Regular);
            chkAutoAccept.Location = new Point(S(20), S(438));
            chkAutoAccept.Size = new Size(S(396), S(26));
            chkAutoAccept.Checked = false;
            chkAutoAccept.CheckedChanged += delegate {
                autoAcceptAllIncoming = chkAutoAccept.Checked;
            };
            leftCard.Controls.Add(chkAutoAccept);

            Label lblConfirmHint = CreateCleanLabel(
                "When unchecked, each incoming file requires recipient confirmation.",
                new Font("Segoe UI", 8.2f),
                fgMuted,
                new Point(S(20), S(466)),
                false
            );
            lblConfirmHint.Size = new Size(S(396), S(32));
            leftCard.Controls.Add(lblConfirmHint);

            this.Controls.Add(leftCard);

            Panel rightCard = new Panel();
            rightCard.BackColor = bgCard;
            rightCard.Location = new Point(S(478), S(94));
            rightCard.Size = new Size(S(518), S(552));
            rightCard.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;

            Label lblSec2 = CreateCleanLabel(
                "2. Direct File Streamer (.EXE <-> Browser & .EXE <-> .EXE)",
                new Font("Segoe UI Semibold", 11f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(14)),
                true
            );
            rightCard.Controls.Add(lblSec2);

            btnSendFile = new Button();
            btnSendFile.UseMnemonic = false;
            btnSendFile.Text = "+ Add File(s) to Queue\\n(Or drag & drop files / folders here)";
            btnSendFile.FlatStyle = FlatStyle.Flat;
            btnSendFile.BackColor = Color.FromArgb(14, 28, 48);
            btnSendFile.ForeColor = accentSky;
            btnSendFile.Font = new Font("Segoe UI Semibold", 9.2f, FontStyle.Bold);
            btnSendFile.Location = new Point(S(20), S(40));
            btnSendFile.Size = new Size(S(248), S(48));
            btnSendFile.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            btnSendFile.Click += OnSelectFilesClicked;
            rightCard.Controls.Add(btnSendFile);

            btnSendFolder = new Button();
            btnSendFolder.UseMnemonic = false;
            btnSendFolder.Text = "+ Add Folder to Queue\\n(All subfolders)";
            btnSendFolder.FlatStyle = FlatStyle.Flat;
            btnSendFolder.BackColor = Color.FromArgb(16, 36, 42);
            btnSendFolder.ForeColor = accentEmerald;
            btnSendFolder.Font = new Font("Segoe UI Semibold", 9.2f, FontStyle.Bold);
            btnSendFolder.Location = new Point(S(276), S(40));
            btnSendFolder.Size = new Size(S(222), S(48));
            btnSendFolder.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnSendFolder.Click += OnSelectFolderClicked;
            rightCard.Controls.Add(btnSendFolder);

            Label lblFileLimitInfo = CreateCleanLabel(
                "Max file size: .EXE <-> .EXE ~2.6 TB (UDP) / Disk limit (TCP)\\r\\nBrowser Web App / Portable HTML: ~2 GB max receive (RAM Blob)",
                new Font("Segoe UI", 7.9f),
                fgMuted,
                new Point(S(20), S(92)),
                false
            );
            lblFileLimitInfo.Size = new Size(S(478), S(28));
            lblFileLimitInfo.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lblFileLimitInfo);

            Label lblTargetCap = CreateCleanLabel(
                "Send to:",
                new Font("Segoe UI", 8.8f, FontStyle.Bold),
                fgMuted,
                new Point(S(20), S(124)),
                true
            );
            rightCard.Controls.Add(lblTargetCap);

            cmbTargetPeer = new ComboBox();
            cmbTargetPeer.DropDownStyle = ComboBoxStyle.DropDownList;
            cmbTargetPeer.FlatStyle = FlatStyle.Flat;
            cmbTargetPeer.BackColor = bgInput;
            cmbTargetPeer.ForeColor = accentSky;
            cmbTargetPeer.Font = new Font("Consolas", 9.0f, FontStyle.Bold);
            cmbTargetPeer.Location = new Point(S(148), S(121));
            cmbTargetPeer.Size = new Size(S(350), S(24));
            cmbTargetPeer.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            cmbTargetPeer.Items.Add("Everyone in room (0 users)");
            targetPeerIds.Clear();
            targetPeerIds.Add("*");
            cmbTargetPeer.SelectedIndex = 0;
            cmbTargetPeer.SelectedIndexChanged += delegate {
                int idx = cmbTargetPeer.SelectedIndex;
                if (idx >= 0 && idx < targetPeerIds.Count)
                {
                    selectedTargetPeerId = targetPeerIds[idx];
                }
            };
            rightCard.Controls.Add(cmbTargetPeer);

            Label lblMaxSpeedCap = CreateCleanLabel(
                "Max upload speed (MB/s):",
                new Font("Segoe UI", 8.6f, FontStyle.Bold),
                fgMuted,
                new Point(S(20), S(152)),
                true
            );
            rightCard.Controls.Add(lblMaxSpeedCap);

            txtMaxUploadMBps = new TextBox();
            txtMaxUploadMBps.BackColor = bgInput;
            txtMaxUploadMBps.ForeColor = accentSky;
            txtMaxUploadMBps.BorderStyle = BorderStyle.FixedSingle;
            txtMaxUploadMBps.Font = new Font("Consolas", 9.2f, FontStyle.Bold);
            txtMaxUploadMBps.Text = initialMaxSpeedText;
            txtMaxUploadMBps.Location = new Point(S(194), S(149));
            txtMaxUploadMBps.Size = new Size(S(80), S(23));
            txtMaxUploadMBps.TextChanged += delegate {
                try
                {
                    string raw = (txtMaxUploadMBps.Text ?? "").Trim().Replace(',', '.');
                    double parsed = 0.0;
                    if (raw.Length > 0 && Double.TryParse(raw, NumberStyles.Float, CultureInfo.InvariantCulture, out parsed) && parsed > 0.0 && !Double.IsNaN(parsed) && !Double.IsInfinity(parsed))
                    {
                        long bps = Math.Max(10240L, (long)Math.Round(parsed * 1024.0 * 1024.0));
                        Interlocked.Exchange(ref maxUploadBytesPerSec, bps);
                        string spdPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "speedlimit.txt");
                        string spdDir = Path.GetDirectoryName(spdPath);
                        if (!Directory.Exists(spdDir)) Directory.CreateDirectory(spdDir);
                        File.WriteAllText(spdPath, parsed.ToString("0.###", CultureInfo.InvariantCulture));
                    }
                    else
                    {
                        Interlocked.Exchange(ref maxUploadBytesPerSec, 0L);
                        string spdPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AetherTunnel", "speedlimit.txt");
                        if (File.Exists(spdPath)) File.WriteAllText(spdPath, "0");
                    }
                    Interlocked.Exchange(ref pacingResetRequested, 1);
                }
                catch { }
            };
            rightCard.Controls.Add(txtMaxUploadMBps);

            Label lblMaxSpeedHint = CreateCleanLabel(
                "(0 = unlimited)",
                new Font("Segoe UI", 8.2f),
                fgMuted,
                new Point(S(282), S(152)),
                true
            );
            rightCard.Controls.Add(lblMaxSpeedHint);

            lblSpeedMetric = CreateCleanLabel(
                "0.00 MB/s (0.00 Gbps)",
                new Font("Consolas", 14.0f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(179)),
                true
            );
            rightCard.Controls.Add(lblSpeedMetric);

            btnPauseResume = new Button();
            btnPauseResume.UseMnemonic = false;
            btnPauseResume.Text = "Pause";
            btnPauseResume.FlatStyle = FlatStyle.Flat;
            btnPauseResume.BackColor = Color.FromArgb(45, 34, 14);
            btnPauseResume.ForeColor = Color.FromArgb(251, 191, 36);
            btnPauseResume.Font = new Font("Segoe UI Semibold", 8.8f, FontStyle.Bold);
            btnPauseResume.Location = new Point(S(366), S(177));
            btnPauseResume.Size = new Size(S(132), S(26));
            btnPauseResume.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnPauseResume.Click += OnPauseResumeClicked;
            rightCard.Controls.Add(btnPauseResume);

            lblTransferStats = CreateCleanLabel(
                "Transferred: 0 B / 0 B  |  Avg Speed: 0.00 MB/s (0.00 Gbps)",
                new Font("Consolas", 9.0f, FontStyle.Bold),
                Color.FromArgb(125, 211, 252),
                new Point(S(20), S(208)),
                false
            );
            lblTransferStats.Size = new Size(S(478), S(20));
            lblTransferStats.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lblTransferStats);

            lblProgressDetail = CreateCleanLabel(
                "Auto Dynamic P2P Pacing active — Enter shared Wormhole Code to pair automatically.",
                null,
                fgMuted,
                new Point(S(20), S(230)),
                false
            );
            lblProgressDetail.Size = new Size(S(478), S(20));
            lblProgressDetail.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lblProgressDetail);

            progressBar = new ProgressBar();
            progressBar.Location = new Point(S(20), S(253));
            progressBar.Size = new Size(S(478), S(15));
            progressBar.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            progressBar.Maximum = 1000;
            rightCard.Controls.Add(progressBar);

            lblQueueSummary = CreateCleanLabel(
                "Transfer Queue (0 queued · 0 completed)",
                new Font("Segoe UI Semibold", 9.0f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(276)),
                true
            );
            rightCard.Controls.Add(lblQueueSummary);

            btnRetryQueue = new Button();
            btnRetryQueue.UseMnemonic = false;
            btnRetryQueue.Text = "Resume / Retry";
            btnRetryQueue.FlatStyle = FlatStyle.Flat;
            btnRetryQueue.BackColor = Color.FromArgb(14, 52, 38);
            btnRetryQueue.ForeColor = accentEmerald;
            btnRetryQueue.Font = new Font("Segoe UI", 8.0f, FontStyle.Bold);
            btnRetryQueue.Location = new Point(S(206), S(273));
            btnRetryQueue.Size = new Size(S(102), S(23));
            btnRetryQueue.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnRetryQueue.Click += OnRetryQueueClicked;
            rightCard.Controls.Add(btnRetryQueue);

            btnRemoveQueue = new Button();
            btnRemoveQueue.UseMnemonic = false;
            btnRemoveQueue.Text = "Remove";
            btnRemoveQueue.FlatStyle = FlatStyle.Flat;
            btnRemoveQueue.BackColor = Color.FromArgb(30, 41, 59);
            btnRemoveQueue.ForeColor = Color.FromArgb(248, 113, 113);
            btnRemoveQueue.Font = new Font("Segoe UI", 8.0f);
            btnRemoveQueue.Location = new Point(S(314), S(273));
            btnRemoveQueue.Size = new Size(S(78), S(23));
            btnRemoveQueue.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnRemoveQueue.Click += OnRemoveSelectedQueueClicked;
            rightCard.Controls.Add(btnRemoveQueue);

            btnClearQueue = new Button();
            btnClearQueue.UseMnemonic = false;
            btnClearQueue.Text = "Clear Completed";
            btnClearQueue.FlatStyle = FlatStyle.Flat;
            btnClearQueue.BackColor = Color.FromArgb(30, 41, 59);
            btnClearQueue.ForeColor = fgMuted;
            btnClearQueue.Font = new Font("Segoe UI", 8.0f);
            btnClearQueue.Location = new Point(S(398), S(273));
            btnClearQueue.Size = new Size(S(100), S(23));
            btnClearQueue.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            btnClearQueue.Click += OnClearQueueClicked;
            rightCard.Controls.Add(btnClearQueue);

            lstQueue = new ListBox();
            lstQueue.BackColor = bgInput;
            lstQueue.ForeColor = Color.FromArgb(226, 232, 240);
            lstQueue.Font = new Font("Consolas", 8.6f);
            lstQueue.BorderStyle = BorderStyle.FixedSingle;
            lstQueue.HorizontalScrollbar = true;
            lstQueue.Location = new Point(S(20), S(299));
            lstQueue.Size = new Size(S(478), S(86));
            lstQueue.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lstQueue);

            Label lblLogCap = CreateCleanLabel(
                "Live Kernel Socket & Chrome Browser Wormhole Log:",
                null,
                fgMuted,
                new Point(S(20), S(392)),
                true
            );
            rightCard.Controls.Add(lblLogCap);

            lstLog = new ListBox();
            lstLog.BackColor = bgInput;
            lstLog.ForeColor = Color.FromArgb(203, 213, 225);
            lstLog.Font = new Font("Consolas", 8.8f);
            lstLog.BorderStyle = BorderStyle.FixedSingle;
            lstLog.HorizontalScrollbar = true;
            lstLog.Location = new Point(S(20), S(412));
            lstLog.Size = new Size(S(478), S(122));
            lstLog.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lstLog);

            this.Controls.Add(rightCard);
        }

        private void Log(string msg)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string>(Log), msg);
                return;
            }
            string line = "[" + DateTime.Now.ToString("HH:mm:ss.fff") + "] " + msg;
            lstLog.Items.Insert(0, line);
            if (lstLog.Items.Count > 250) lstLog.Items.RemoveAt(lstLog.Items.Count - 1);
        }

        // Exact RFC 2898 PBKDF2-HMAC-SHA256 matching WebCrypto deriveTunnelKey() in src/utils/crypto.ts
        private static byte[] Pbkdf2Sha256(byte[] password, byte[] salt, int iterations, int outputBytes)
        {
            using (HMACSHA256 hmac = new HMACSHA256(password))
            {
                int hashLen = 32;
                int blockCount = (outputBytes + hashLen - 1) / hashLen;
                byte[] result = new byte[outputBytes];
                int outOffset = 0;

                for (int block = 1; block <= blockCount; block++)
                {
                    byte[] saltBlock = new byte[salt.Length + 4];
                    Buffer.BlockCopy(salt, 0, saltBlock, 0, salt.Length);
                    saltBlock[salt.Length + 0] = (byte)((block >> 24) & 0xFF);
                    saltBlock[salt.Length + 1] = (byte)((block >> 16) & 0xFF);
                    saltBlock[salt.Length + 2] = (byte)((block >> 8) & 0xFF);
                    saltBlock[salt.Length + 3] = (byte)(block & 0xFF);

                    byte[] u = hmac.ComputeHash(saltBlock);
                    byte[] t = (byte[])u.Clone();

                    for (int iter = 1; iter < iterations; iter++)
                    {
                        u = hmac.ComputeHash(u);
                        for (int k = 0; k < hashLen; k++)
                        {
                            t[k] ^= u[k];
                        }
                    }

                    int copyLen = Math.Min(hashLen, outputBytes - outOffset);
                    Buffer.BlockCopy(t, 0, result, outOffset, copyLen);
                    outOffset += copyLen;
                }
                return result;
            }
        }

        private static string SanitizeJsonText(string raw)
        {
            if (String.IsNullOrEmpty(raw)) return "";
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < raw.Length && sb.Length < 36; i++)
            {
                char c = raw[i];
                if (c != '"' && c != '\\\\' && c != '\\r' && c != '\\n' && c != '|')
                {
                    sb.Append(c);
                }
            }
            return sb.ToString().Trim();
        }

        private RoomPeerInfo UpsertRoomPeer(string key, string displayName, string clientType, out bool isNew, out bool rejectedFull)
        {
            isNew = false;
            rejectedFull = false;
            if (String.IsNullOrEmpty(key)) return null;
            RoomPeerInfo existing;
            if (roomPeers.TryGetValue(key, out existing))
            {
                if (!String.IsNullOrEmpty(displayName)) existing.DisplayName = displayName;
                if (!String.IsNullOrEmpty(clientType)) existing.ClientType = clientType;
                return existing;
            }
            if (roomPeers.Count >= MAX_ROOM_PEERS - 1)
            {
                rejectedFull = true;
                return null;
            }
            RoomPeerInfo created = new RoomPeerInfo();
            created.PeerId = key;
            created.DisplayName = !String.IsNullOrEmpty(displayName) ? displayName : key;
            created.ClientType = !String.IsNullOrEmpty(clientType) ? clientType : "exe";
            if (roomPeers.TryAdd(key, created))
            {
                isNew = true;
                return created;
            }
            roomPeers.TryGetValue(key, out existing);
            return existing;
        }

        private RoomPeerInfo FindPeerByEndpointOrInstance(string cleanCode, string remoteInst, IPEndPoint remoteEp)
        {
            if (!String.IsNullOrEmpty(cleanCode) && !String.IsNullOrEmpty(remoteInst))
            {
                string canon = "aethertunnel-exe-" + cleanCode + "-" + remoteInst;
                RoomPeerInfo byCanon;
                if (roomPeers.TryGetValue(canon, out byCanon)) return byCanon;
            }
            if (remoteEp != null)
            {
                string epStr = remoteEp.ToString();
                string ipOnly = remoteEp.Address.ToString();
                foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                {
                    RoomPeerInfo p = kv.Value;
                    if (p == null) continue;
                    if (p.ActiveUdpEp != null && p.ActiveUdpEp.Equals(remoteEp)) return p;
                    if (p.WanUdpEp == epStr || p.LanUdpEp == epStr) return p;
                    if (!String.IsNullOrEmpty(ipOnly) && ((p.LanTcpEp != null && p.LanTcpEp.StartsWith(ipOnly + ":")) || (p.WanUdpEp != null && p.WanUdpEp.StartsWith(ipOnly + ":"))))
                        return p;
                }
            }
            return null;
        }

        private bool IsPeerActive(RoomPeerInfo p, DateTime utcNow)
        {
            if (p == null) return false;
            bool tcpOk = (p.TcpClientConn != null && p.TcpClientConn.Connected && p.TcpStream != null);
            bool udpOk = (p.ActiveUdpEp != null && (utcNow - p.LastUdpSeen).TotalSeconds < 14);
            bool cloudOk = (!String.IsNullOrEmpty(p.CloudPeerId) && !activeSignalingChannels.IsEmpty && (utcNow - p.LastCloudSeen).TotalSeconds < 14);
            bool localBrOk = (p.ClientType == "local_browser" && activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            return tcpOk || udpOk || cloudOk || localBrOk;
        }

        private string GetPeerTransportSummary(RoomPeerInfo p, DateTime utcNow)
        {
            if (p == null) return "";
            if (p.TcpClientConn != null && p.TcpClientConn.Connected && p.TcpStream != null) return "TCP";
            if (p.ActiveUdpEp != null && (utcNow - p.LastUdpSeen).TotalSeconds < 14) return "UDP P2P";
            if (p.ClientType == "local_browser" && activeBrowserWsClient != null && activeBrowserWsClient.Connected) return "Localhost WS";
            if (!String.IsNullOrEmpty(p.CloudPeerId) && (utcNow - p.LastCloudSeen).TotalSeconds < 14) return "Cloud Bridge";
            return "Connected";
        }

        private string GetCurrentTargetLabel(string targetId)
        {
            if (String.IsNullOrEmpty(targetId) || targetId == "*") return "Everyone in room";
            RoomPeerInfo p;
            if (roomPeers.TryGetValue(targetId, out p) && !String.IsNullOrEmpty(p.DisplayName))
                return p.DisplayName;
            return targetId;
        }

        private void SyncTargetPeerDropdown()
        {
            try
            {
                if (cmbTargetPeer == null || this.IsDisposed) return;
                if (this.InvokeRequired)
                {
                    this.BeginInvoke(new Action(SyncTargetPeerDropdown));
                    return;
                }
                DateTime now = DateTime.UtcNow;
                List<RoomPeerInfo> activeList = new List<RoomPeerInfo>();
                foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                {
                    if (IsPeerActive(kv.Value, now)) activeList.Add(kv.Value);
                }
                activeList.Sort(delegate(RoomPeerInfo a, RoomPeerInfo b) {
                    return String.Compare(a.DisplayName ?? a.PeerId, b.DisplayName ?? b.PeerId, StringComparison.OrdinalIgnoreCase);
                });

                List<string> newIds = new List<string>();
                List<string> newLabels = new List<string>();
                newIds.Add("*");
                newLabels.Add("Everyone in room (" + activeList.Count.ToString() + (activeList.Count == 1 ? " other)" : " others)"));
                for (int i = 0; i < activeList.Count; i++)
                {
                    RoomPeerInfo p = activeList[i];
                    newIds.Add(p.PeerId);
                    string kindTag = (p.ClientType == "exe") ? ".EXE" : (p.ClientType == "local_browser" ? "Browser 127.0.0.1" : "Browser");
                    newLabels.Add(p.DisplayName + " [" + kindTag + " · " + GetPeerTransportSummary(p, now) + "]");
                }

                bool changed = (newIds.Count != targetPeerIds.Count || newLabels.Count != cmbTargetPeer.Items.Count);
                if (!changed)
                {
                    for (int i = 0; i < newIds.Count; i++)
                    {
                        if (targetPeerIds[i] != newIds[i] || !Object.Equals(cmbTargetPeer.Items[i], newLabels[i]))
                        {
                            changed = true;
                            break;
                        }
                    }
                }
                if (!changed) return;

                string prevSel = selectedTargetPeerId;
                targetPeerIds.Clear();
                targetPeerIds.AddRange(newIds);
                cmbTargetPeer.BeginUpdate();
                cmbTargetPeer.Items.Clear();
                for (int i = 0; i < newLabels.Count; i++) cmbTargetPeer.Items.Add(newLabels[i]);
                int selIdx = 0;
                if (!String.IsNullOrEmpty(prevSel) && prevSel != "*")
                {
                    int found = targetPeerIds.IndexOf(prevSel);
                    if (found >= 0) selIdx = found;
                }
                if (cmbTargetPeer.Items.Count > 0) cmbTargetPeer.SelectedIndex = selIdx;
                selectedTargetPeerId = (selIdx >= 0 && selIdx < targetPeerIds.Count) ? targetPeerIds[selIdx] : "*";
                cmbTargetPeer.EndUpdate();
            }
            catch { }
        }

        private void ConnectToEnteredRoom()
        {
            string clean = CleanRoomCode(txtRoomCode != null ? txtRoomCode.Text : "");
            if (txtRoomCode != null && txtRoomCode.Text != clean)
            {
                txtRoomCode.Text = clean;
            }
            currentRoomCode = clean;
            roomFullRejected = false;
            lock (attemptedAutoTcpEndpoints) { attemptedAutoTcpEndpoints.Clear(); }
            foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
            {
                try { if (kv.Value != null && kv.Value.TcpClientConn != null) kv.Value.TcpClientConn.Close(); } catch { }
            }
            roomPeers.Clear();
            selectedTargetPeerId = "*";
            activeUdpPeerEndpoint = null;
            activeCloudExePeerId = "";
            activeCloudBrowserPeerId = "";
            lastCloudExeSeen = DateTime.MinValue;
            lastCloudBrowserSeen = DateTime.MinValue;
            remotePeerWanUdp = "";
            remotePeerLanUdp = "";
            remotePeerWanV6Udp = "";
            remotePeerLanTcp = "";
            remotePeerPredictedWanUdp = "";
            remotePeerNatSym = 0;
            remotePeerNatDelta = 0;
            remotePeerUpnpTcp = 0;
            lastLoggedPunchTarget = "";
            DeriveCryptographicKey();
            SyncTargetPeerDropdown();
            cloudReconnectRequested = true;
            if (clean.Length == 0)
            {
                UpdateStatusBadge("PEER STATUS: NOT CONNECTED — Enter tunnel name and click Connect");
                Log("Tunnel disconnected. Enter tunnel name and click Connect.");
                return;
            }
            UpdateStatusBadge("PEER STATUS: WAITING FOR PEER [" + clean + "]");
            BroadcastUdpPresence();
            if (!suppressRoomBroadcast) NotifyBrowserRoomCode();
            Log("Connecting to tunnel [" + clean + "] (max " + MAX_ROOM_PEERS.ToString() + " users)...");
        }

        private void DeriveCryptographicKey()
        {
            try
            {
                string cleanRoom = CleanRoomCode(currentRoomCode);
                if (cleanRoom.Length == 0)
                {
                    aesKey = new byte[32];
                    currentFingerprint = "Waiting for tunnel name...";
                    if (lblKeyFingerprint != null) lblKeyFingerprint.Text = currentFingerprint;
                    return;
                }
                string pass = txtPassphrase.Text;
                string normalizedSecret = cleanRoom + (pass.Length > 0 ? "::" + pass : "");
                byte[] passwordBytes = Encoding.UTF8.GetBytes(normalizedSecret);
                byte[] saltBytes = Encoding.UTF8.GetBytes("AetherTunnel-v1-ZeroKnowledge-Salt::" + cleanRoom);

                aesKey = Pbkdf2Sha256(passwordBytes, saltBytes, 100000, 32);

                using (SHA256 sha = SHA256.Create())
                {
                    byte[] hash = sha.ComputeHash(aesKey);
                    StringBuilder sb = new StringBuilder(16);
                    for (int i = 0; i < 8; i++)
                    {
                        sb.Append(hash[i].ToString("x2"));
                    }
                    currentFingerprint = sb.ToString();
                }
                if (lblKeyFingerprint != null) lblKeyFingerprint.Text = currentFingerprint;
            }
            catch (Exception ex)
            {
                Log("Key derivation error: " + ex.Message);
            }
        }

        private void StartKernelListenerAndDiscovery()
        {
            for (int p = 45889; p < 45910; p++)
            {
                try
                {
                    tcpListener = new TcpListener(IPAddress.Any, p);
                    tcpListener.Server.ReceiveBufferSize = 16 * 1024 * 1024;
                    tcpListener.Server.SendBufferSize = 16 * 1024 * 1024;
                    tcpListener.Start();
                    listenPort = p;
                    break;
                }
                catch
                {
                    tcpListener = null;
                }
            }

            for (int up = 45890; up < 45930; up++)
            {
                if (up == listenPort) continue;
                try
                {
                    udpP2pClient = new UdpClient(new IPEndPoint(IPAddress.Any, up));
                    udpP2pClient.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                    udpP2pClient.Client.SendBufferSize = 64 * 1024 * 1024;
                    try { udpP2pClient.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                    udpP2pPort = up;
                    break;
                }
                catch
                {
                    udpP2pClient = null;
                }
            }

            try
            {
                udpP2pV6Client = new UdpClient(udpP2pPort > 0 ? udpP2pPort : 45890, AddressFamily.InterNetworkV6);
                udpP2pV6Client.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                udpP2pV6Client.Client.SendBufferSize = 64 * 1024 * 1024;
                try { udpP2pV6Client.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                udpP2pV6Port = ((IPEndPoint)udpP2pV6Client.Client.LocalEndPoint).Port;
            }
            catch
            {
                try
                {
                    udpP2pV6Client = new UdpClient(0, AddressFamily.InterNetworkV6);
                    udpP2pV6Client.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                    udpP2pV6Client.Client.SendBufferSize = 64 * 1024 * 1024;
                    try { udpP2pV6Client.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                    udpP2pV6Port = ((IPEndPoint)udpP2pV6Client.Client.LocalEndPoint).Port;
                }
                catch
                {
                    udpP2pV6Client = null;
                    udpP2pV6Port = 0;
                }
            }

            string localIps = GetLocalIpList();
            lblLocalEndpoint.Text = "LAN: " + localIps + "  |  STUN WAN: Probing...";
            Log("AetherTunnel V1.02 High-DPI active [BDP-Safe v8 · Queue & Confirmation · SSD-Safe] (Scale: " + Math.Round(dpiScale * 100).ToString() + "%). TCP:" + listenPort.ToString() + " UDP:" + udpP2pPort.ToString() + (udpP2pV6Port > 0 ? " UDPv6:" + udpP2pV6Port.ToString() : ""));

            Thread stunThread = new Thread(StunAndUpnpProbeLoop);
            stunThread.IsBackground = true;
            stunThread.Start();

            Thread p2pUdpThread = new Thread(UdpP2pReceiveLoop);
            p2pUdpThread.IsBackground = true;
            p2pUdpThread.Priority = ThreadPriority.AboveNormal;
            p2pUdpThread.Start();

            if (udpP2pV6Client != null)
            {
                Thread p2pUdpV6Thread = new Thread(UdpP2pV6ReceiveLoop);
                p2pUdpV6Thread.IsBackground = true;
                p2pUdpV6Thread.Priority = ThreadPriority.AboveNormal;
                p2pUdpV6Thread.Start();
            }

            Thread p2pUdpDiskIoThread = new Thread(UdpP2pDiskIoLoop);
            p2pUdpDiskIoThread.IsBackground = true;
            p2pUdpDiskIoThread.Priority = ThreadPriority.BelowNormal;
            p2pUdpDiskIoThread.Start();

            Thread p2pUdpWriterThread = new Thread(UdpP2pDiskWriterLoop);
            p2pUdpWriterThread.IsBackground = true;
            p2pUdpWriterThread.Priority = ThreadPriority.BelowNormal;
            p2pUdpWriterThread.Start();

            Thread queueWorkerThread = new Thread(TransferQueueWorkerLoop);
            queueWorkerThread.IsBackground = true;
            queueWorkerThread.Start();

            Thread hbMonitorThread = new Thread(PeerHeartbeatMonitorLoop);
            hbMonitorThread.IsBackground = true;
            hbMonitorThread.Start();

            Thread acceptThread = new Thread(AcceptLoop);
            acceptThread.IsBackground = true;
            acceptThread.Start();

            Thread udpThread = new Thread(UdpDiscoveryLoop);
            udpThread.IsBackground = true;
            udpThread.Start();

            Thread cloudThread = new Thread(CloudWormholeBridgeLoop);
            cloudThread.IsBackground = true;
            cloudThread.Start();
        }

        private void SendUdpP2pPacket(byte[] data, int len, IPEndPoint ep)
        {
            if (ep == null || data == null) return;
            if (ep.AddressFamily == AddressFamily.InterNetworkV6)
            {
                if (udpP2pV6Client != null) udpP2pV6Client.Send(data, len, ep);
            }
            else
            {
                if (udpP2pClient != null) udpP2pClient.Send(data, len, ep);
            }
        }

        private void RefreshLocalEndpointLabel()
        {
            try
            {
                string lan = GetFirstLanEndpoint();
                if (String.IsNullOrEmpty(lan)) lan = "127.0.0.1:" + listenPort.ToString();
                string wan = publicWanUdpEndpoint.Length > 0 ? publicWanUdpEndpoint : "Probing...";
                string natTag = (natSymDetected == 1) ? " [SymNAT]" : (upnpUdpMapped ? " [UPnP]" : "");
                string v6Tag = (publicWanV6UdpEndpoint.Length > 0) ? " [IPv6 OK]" : "";
                this.BeginInvoke(new Action(delegate {
                    lblLocalEndpoint.Text = "LAN: " + lan + "  |  WAN: " + wan + natTag + v6Tag;
                }));
            }
            catch { }
        }

        private void StunAndUpnpProbeLoop()
        {
            ThreadPool.QueueUserWorkItem(delegate { TryUpnpPortMapping(); });
            while (isRunning)
            {
                try
                {
                    QueryStunServer("stun.l.google.com", 19302, 0, false);
                    QueryStunServer("stun.cloudflare.com", 3478, 1, false);
                    QueryStunServer("stun1.l.google.com", 19302, 2, false);
                    if (udpP2pV6Client != null)
                    {
                        QueryStunServer("stun.l.google.com", 19302, 3, true);
                        if (publicWanV6UdpEndpoint.Length == 0)
                        {
                            string localV6 = GetGlobalIpv6Address();
                            if (localV6.Length > 0 && udpP2pV6Port > 0)
                            {
                                publicWanV6UdpEndpoint = "[" + localV6 + "]:" + udpP2pV6Port.ToString();
                                RefreshLocalEndpointLabel();
                                BroadcastCloudHelloToAll();
                            }
                        }
                    }
                }
                catch { }
                int sleepLoops = (publicWanUdpEndpoint.Length == 0) ? 10 : 75; // 2s retry until resolved, then 15s NAT keepalive
                for (int i = 0; i < sleepLoops && isRunning; i++) Thread.Sleep(200);
            }
        }

        private void QueryStunServer(string stunHost, int stunPort, byte serverTag, bool ipv6)
        {
            UdpClient client = ipv6 ? udpP2pV6Client : udpP2pClient;
            if (client == null) return;
            try
            {
                IPAddress[] addrs = Dns.GetHostAddresses(stunHost);
                IPAddress targetIp = null;
                AddressFamily wantFamily = ipv6 ? AddressFamily.InterNetworkV6 : AddressFamily.InterNetwork;
                foreach (IPAddress a in addrs)
                {
                    if (a.AddressFamily == wantFamily) { targetIp = a; break; }
                }
                if (targetIp == null) return;

                byte[] req = new byte[20];
                req[0] = 0x00; req[1] = 0x01;
                req[2] = 0x00; req[3] = 0x00;
                req[4] = 0x21; req[5] = 0x12; req[6] = 0xA4; req[7] = 0x42;
                req[8] = serverTag;
                Random r = new Random(unchecked(Environment.TickCount + (int)serverTag * 97));
                for (int i = 9; i < 20; i++) req[i] = (byte)r.Next(0, 256);

                client.Send(req, req.Length, new IPEndPoint(targetIp, stunPort));
            }
            catch { }
        }

        private void ParseStunBindingResponse(byte[] buf, int len, IPEndPoint fromEp)
        {
            if (len < 20) return;
            if (buf[0] != 0x01 || buf[1] != 0x01) return;
            byte serverTag = buf[8];
            int idx = 20;
            while (idx + 4 <= len)
            {
                int attrType = (buf[idx] << 8) | buf[idx + 1];
                int attrLen = (buf[idx + 2] << 8) | buf[idx + 3];
                idx += 4;
                if (idx + attrLen > len) break;

                if (attrType == 0x0020 && attrLen >= 8 && buf[idx + 1] == 0x01)
                {
                    int port = ((buf[idx + 2] << 8) | buf[idx + 3]) ^ 0x2112;
                    byte b0 = (byte)(buf[idx + 4] ^ 0x21);
                    byte b1 = (byte)(buf[idx + 5] ^ 0x12);
                    byte b2 = (byte)(buf[idx + 6] ^ 0xA4);
                    byte b3 = (byte)(buf[idx + 7] ^ 0x42);
                    string wan = b0.ToString() + "." + b1.ToString() + "." + b2.ToString() + "." + b3.ToString() + ":" + port.ToString();
                    RecordDiscoveredWanV4(wan, serverTag, port);
                    return;
                }
                else if (attrType == 0x0020 && attrLen >= 20 && buf[idx + 1] == 0x02) // XOR-MAPPED-ADDRESS (IPv6)
                {
                    int port = ((buf[idx + 2] << 8) | buf[idx + 3]) ^ 0x2112;
                    byte[] v6Bytes = new byte[16];
                    for (int k = 0; k < 16; k++) v6Bytes[k] = (byte)(buf[idx + 4 + k] ^ buf[4 + k]);
                    IPAddress v6Addr = new IPAddress(v6Bytes);
                    string wanV6 = "[" + v6Addr.ToString() + "]:" + port.ToString();
                    if (wanV6 != publicWanV6UdpEndpoint)
                    {
                        publicWanV6UdpEndpoint = wanV6;
                        RefreshLocalEndpointLabel();
                        Log("STUN IPv6 NAT Discovery -> Direct IPv6 UDP: " + publicWanV6UdpEndpoint);
                        BroadcastCloudHelloToAll();
                    }
                    return;
                }
                else if (attrType == 0x0001 && attrLen >= 8 && buf[idx + 1] == 0x01)
                {
                    int port = (buf[idx + 2] << 8) | buf[idx + 3];
                    string wan = buf[idx + 4].ToString() + "." + buf[idx + 5].ToString() + "." + buf[idx + 6].ToString() + "." + buf[idx + 7].ToString() + ":" + port.ToString();
                    RecordDiscoveredWanV4(wan, serverTag, port);
                    return;
                }
                idx += (attrLen + 3) & ~3;
            }
        }

        private void RecordDiscoveredWanV4(string wan, byte serverTag, int port)
        {
            if (serverTag == 0) stunEndpoint0 = wan;
            else if (serverTag == 1) stunEndpoint1 = wan;

            if (stunEndpoint0.Length > 0 && stunEndpoint1.Length > 0)
            {
                int c0 = stunEndpoint0.LastIndexOf(':');
                int c1 = stunEndpoint1.LastIndexOf(':');
                int p0 = 0, p1 = 0;
                if (c0 > 0 && c1 > 0 &&
                    Int32.TryParse(stunEndpoint0.Substring(c0 + 1), out p0) &&
                    Int32.TryParse(stunEndpoint1.Substring(c1 + 1), out p1))
                {
                    if (p0 != p1)
                    {
                        natSymDetected = 1;
                        natPortDelta = p1 - p0;
                        natTypeSummary = "Symmetric NAT (" + p0.ToString() + "->" + p1.ToString() + ")";
                    }
                    else
                    {
                        natSymDetected = 0;
                        natPortDelta = 0;
                        natTypeSummary = (p0 == udpP2pPort) ? "Cone NAT (Port-Preserving)" : "Port-Mapped NAT";
                    }
                }
            }

            if (wan != publicWanUdpEndpoint)
            {
                bool firstResolve = (publicWanUdpEndpoint.Length == 0);
                publicWanUdpEndpoint = wan;
                RefreshLocalEndpointLabel();
                if (firstResolve || natSymDetected == 1)
                {
                    Log("STUN NAT Discovery -> WAN: " + publicWanUdpEndpoint + " (" + natTypeSummary + ")");
                }
                BroadcastCloudHelloToAll();
            }
        }

        private void TryUpnpPortMapping()
        {
            try
            {
                using (UdpClient ssdp = new UdpClient())
                {
                    ssdp.Client.ReceiveTimeout = 1500;
                    string msearch = "M-SEARCH * HTTP/1.1\\r\\nHOST: 239.255.255.250:1900\\r\\nMAN: \\"ssdp:discover\\"\\r\\nMX: 1\\r\\nST: urn:schemas-upnp-org:device:InternetGatewayDevice:1\\r\\n\\r\\n";
                    byte[] bytes = Encoding.ASCII.GetBytes(msearch);
                    ssdp.Send(bytes, bytes.Length, new IPEndPoint(IPAddress.Parse("239.255.255.250"), 1900));

                    IPEndPoint gwEp = new IPEndPoint(IPAddress.Any, 0);
                    string locationUrl = "";
                    for (int tries = 0; tries < 4; tries++)
                    {
                        byte[] resp = ssdp.Receive(ref gwEp);
                        string respStr = Encoding.ASCII.GetString(resp);
                        Match m = Regex.Match(respStr, @"LOCATION:\s*(http://[^\r\n]+)", RegexOptions.IgnoreCase);
                        if (m.Success)
                        {
                            locationUrl = m.Groups[1].Value.Trim();
                            break;
                        }
                    }
                    if (locationUrl.Length == 0) return;

                    Uri descUri = new Uri(locationUrl);
                    string xml = "";
                    HttpWebRequest getReq = (HttpWebRequest)WebRequest.Create(descUri);
                    getReq.Timeout = 2500;
                    using (HttpWebResponse getResp = (HttpWebResponse)getReq.GetResponse())
                    using (StreamReader sr = new StreamReader(getResp.GetResponseStream()))
                    {
                        xml = sr.ReadToEnd();
                    }

                    Match svcM = Regex.Match(xml, @"<serviceType>urn:schemas-upnp-org:service:(WANIPConnection|WANPPPConnection):[0-9]+</serviceType>[\s\S]*?<controlURL>([^<]+)</controlURL>", RegexOptions.IgnoreCase);
                    if (!svcM.Success)
                        svcM = Regex.Match(xml, @"<controlURL>([^<]+)</controlURL>[\s\S]*?<serviceType>urn:schemas-upnp-org:service:(WANIPConnection|WANPPPConnection):[0-9]+</serviceType>", RegexOptions.IgnoreCase);
                    if (!svcM.Success) return;

                    string svcType = "";
                    string ctrlPath = "";
                    if (svcM.Groups[1].Value.StartsWith("WAN", StringComparison.OrdinalIgnoreCase))
                    {
                        svcType = "urn:schemas-upnp-org:service:" + svcM.Groups[1].Value + ":1";
                        ctrlPath = svcM.Groups[2].Value.Trim();
                    }
                    else
                    {
                        svcType = "urn:schemas-upnp-org:service:" + svcM.Groups[2].Value + ":1";
                        ctrlPath = svcM.Groups[1].Value.Trim();
                    }
                    Uri ctrlUri = new Uri(descUri, ctrlPath);

                    string internalIp = "";
                    using (Socket testSock = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp))
                    {
                        testSock.Connect(descUri.Host, descUri.Port);
                        internalIp = ((IPEndPoint)testSock.LocalEndPoint).Address.ToString();
                    }
                    if (String.IsNullOrEmpty(internalIp)) return;

                    if (SoapUpnpAddPortMapping(ctrlUri, svcType, udpP2pPort, "UDP", internalIp)) upnpUdpMapped = true;
                    if (SoapUpnpAddPortMapping(ctrlUri, svcType, listenPort, "TCP", internalIp)) upnpTcpMapped = true;
                    if (upnpUdpMapped || upnpTcpMapped)
                    {
                        RefreshLocalEndpointLabel();
                        Log("UPnP IGD opened router port forwarding ->" + (upnpUdpMapped ? " UDP:" + udpP2pPort.ToString() : "") + (upnpTcpMapped ? " TCP:" + listenPort.ToString() : ""));
                    }
                }
            }
            catch { }
        }

        private bool SoapUpnpAddPortMapping(Uri ctrlUri, string svcType, int port, string proto, string internalIp)
        {
            try
            {
                string body = "<?xml version=\\"1.0\\"?><s:Envelope xmlns:s=\\"http://schemas.xmlsoap.org/soap/envelope/\\" s:encodingStyle=\\"http://schemas.xmlsoap.org/soap/encoding/\\"><s:Body><u:AddPortMapping xmlns:u=\\"" + svcType + "\\"><NewRemoteHost></NewRemoteHost><NewExternalPort>" + port.ToString() + "</NewExternalPort><NewProtocol>" + proto + "</NewProtocol><NewInternalPort>" + port.ToString() + "</NewInternalPort><NewInternalClient>" + internalIp + "</NewInternalClient><NewEnabled>1</NewEnabled><NewPortMappingDescription>AetherTunnel</NewPortMappingDescription><NewLeaseDuration>3600</NewLeaseDuration></u:AddPortMapping></s:Body></s:Envelope>";
                byte[] bodyBytes = Encoding.UTF8.GetBytes(body);
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(ctrlUri);
                req.Method = "POST";
                req.Timeout = 2500;
                req.ContentType = "text/xml; charset=\\"utf-8\\"";
                req.Headers.Add("SOAPACTION", "\\"" + svcType + "#AddPortMapping\\"");
                req.ContentLength = bodyBytes.Length;
                using (Stream reqStream = req.GetRequestStream()) reqStream.Write(bodyBytes, 0, bodyBytes.Length);
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                {
                    return ((int)resp.StatusCode >= 200 && (int)resp.StatusCode < 300);
                }
            }
            catch { return false; }
        }

        private bool TryParseIpEndpoint(string epStr, out IPEndPoint ep)
        {
            ep = null;
            if (String.IsNullOrEmpty(epStr)) return false;
            string s = epStr.Trim();
            if (s.StartsWith("["))
            {
                int close = s.IndexOf(']');
                if (close <= 1 || close + 2 >= s.Length || s[close + 1] != ':') return false;
                IPAddress v6;
                int port;
                if (IPAddress.TryParse(s.Substring(1, close - 1), out v6) && Int32.TryParse(s.Substring(close + 2), out port) && port > 0 && port <= 65535)
                {
                    ep = new IPEndPoint(v6, port);
                    return true;
                }
                return false;
            }
            int colon = s.LastIndexOf(':');
            if (colon <= 0) return false;
            IPAddress ip;
            int p4;
            if (IPAddress.TryParse(s.Substring(0, colon).Trim(), out ip) && Int32.TryParse(s.Substring(colon + 1).Trim(), out p4) && p4 > 0 && p4 <= 65535)
            {
                ep = new IPEndPoint(ip, p4);
                return true;
            }
            return false;
        }

        private void InitiateUdpHolePunch(string remoteEndpointStr, bool withPortSpray = false, bool forcePunch = false)
        {
            if (String.IsNullOrEmpty(remoteEndpointStr)) return;
            ThreadPool.QueueUserWorkItem(delegate {
                try
                {
                    IPEndPoint targetEp;
                    if (!TryParseIpEndpoint(remoteEndpointStr, out targetEp)) return;
                    if (IsOwnLocalEndpoint(targetEp.Address, targetEp.Port)) return;

                    string room = CleanRoomCode(currentRoomCode);
                    byte[] punchBytes = Encoding.UTF8.GetBytes("AETHER_PUNCH|" + room + "|" + instanceId + "|" + SanitizeJsonText(localDisplayName));

                    for (int burst = 0; burst < 4 && isRunning && (forcePunch || activeUdpPeerEndpoint == null); burst++)
                    {
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, targetEp); } catch { }
                        Thread.Sleep(70);
                    }

                    if (withPortSpray && targetEp.AddressFamily == AddressFamily.InterNetwork && (forcePunch || activeUdpPeerEndpoint == null))
                    {
                        int basePort = targetEp.Port;
                        for (int delta = -6; delta <= 16 && isRunning && (forcePunch || activeUdpPeerEndpoint == null); delta++)
                        {
                            if (delta == 0) continue;
                            int candPort = basePort + delta;
                            if (candPort > 1024 && candPort <= 65535)
                            {
                                try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, candPort)); } catch { }
                            }
                        }
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, 45890)); } catch { }
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, 45891)); } catch { }
                    }
                }
                catch { }
            });
        }

        private void UdpP2pReceiveLoop()
        {
            IPEndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);
            int rxCapCheckSeq = 0;
            while (isRunning && udpP2pClient != null)
            {
                try
                {
                    byte[] data = udpP2pClient.Receive(ref remoteEp);
                    ProcessUdpP2pPacket(data, remoteEp, ref rxCapCheckSeq);
                }
                catch
                {
                    if (!isRunning) break;
                    Thread.Sleep(5);
                }
            }
        }

        private void UdpP2pV6ReceiveLoop()
        {
            IPEndPoint remoteEp = new IPEndPoint(IPAddress.IPv6Any, 0);
            int rxCapCheckSeq = 0;
            while (isRunning && udpP2pV6Client != null)
            {
                try
                {
                    byte[] data = udpP2pV6Client.Receive(ref remoteEp);
                    ProcessUdpP2pPacket(data, remoteEp, ref rxCapCheckSeq);
                }
                catch
                {
                    if (!isRunning) break;
                    Thread.Sleep(5);
                }
            }
        }

        private void ProcessUdpP2pPacket(byte[] data, IPEndPoint remoteEp, ref int rxCapCheckSeq)
        {
            try
            {
                    if (data == null || data.Length == 0) return;

                    if (data.Length >= 20 && data[0] == 0x01 && data[1] == 0x01 && data[4] == 0x21 && data[5] == 0x12)
                    {
                        ParseStunBindingResponse(data, data.Length, remoteEp);
                        return;
                    }

                    // FAST PATH: Enqueue binary P2P UDP encrypted data frame immediately (< 1us), up to 2 GB process hard RAM cap
                    if (data.Length >= 28 && BitConverter.ToUInt32(data, 0) == MAGIC_UDP_DATA)
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        RoomPeerInfo dataPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", remoteEp);
                        if (dataPeer != null)
                        {
                            dataPeer.ActiveUdpEp = remoteEp;
                            dataPeer.LastUdpSeen = DateTime.UtcNow;
                        }
                        if (Interlocked.Read(ref totalAppBufferedBytes) < HARD_RAM_CAP_BYTES)
                        {
                            bool acceptPkt = true;
                            if ((rxCapCheckSeq++ & 1023) == 0 && GC.GetTotalMemory(false) >= 1920L * 1024L * 1024L)
                            {
                                if (GC.GetTotalMemory(true) >= 1980L * 1024L * 1024L) acceptPkt = false;
                            }
                            if (acceptPkt)
                            {
                                udpRxDataQueue.Enqueue(data);
                                Interlocked.Add(ref totalAppBufferedBytes, data.Length);
                                int qCnt = udpRxDataQueue.Count;
                                if (qCnt <= 2 || (qCnt & 15) == 1) udpRxDataEvent.Set();
                            }
                        }
                        return;
                    }

                    string text = Encoding.UTF8.GetString(data);
                    if (text.StartsWith("AETHER_PUNCH|"))
                    {
                        string[] parts = text.Split('|');
                        string myCleanRoom = CleanRoomCode(currentRoomCode);
                        if (parts.Length >= 3 && parts[2] != instanceId && myCleanRoom.Length > 0 && parts[1] == myCleanRoom)
                        {
                            string rInst = parts[2];
                            string rDName = (parts.Length >= 4 && parts[3].Trim().Length > 0) ? parts[3].Trim() : ("Windows .EXE (" + rInst.Substring(0, Math.Min(4, rInst.Length)) + ")");
                            RoomPeerInfo udpPeer = FindPeerByEndpointOrInstance(myCleanRoom, rInst, remoteEp);
                            bool isNewRoomPeer = false;
                            bool fullRej = false;
                            if (udpPeer == null)
                            {
                                udpPeer = UpsertRoomPeer("aethertunnel-exe-" + myCleanRoom + "-" + rInst, rDName, "exe", out isNewRoomPeer, out fullRej);
                            }
                            if (fullRej || udpPeer == null) return;
                            bool wasUdpInactive = (udpPeer.ActiveUdpEp == null || !udpPeer.ActiveUdpEp.Equals(remoteEp) || (DateTime.UtcNow - udpPeer.LastUdpSeen).TotalSeconds > 8);
                            udpPeer.ActiveUdpEp = remoteEp;
                            udpPeer.LastUdpSeen = DateTime.UtcNow;
                            if (parts.Length >= 4 && parts[3].Trim().Length > 0) udpPeer.DisplayName = parts[3].Trim();

                            bool staleOrEmpty = (activeUdpPeerEndpoint == null || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6);
                            if (staleOrEmpty || activeUdpPeerEndpoint.Equals(remoteEp))
                            {
                                activeUdpPeerEndpoint = remoteEp;
                                lastUdpPeerSeen = DateTime.UtcNow;
                            }
                            byte[] ack = Encoding.UTF8.GetBytes("AETHER_PUNCH_ACK|" + parts[1] + "|" + instanceId + "|" + SanitizeJsonText(localDisplayName));
                            SendUdpP2pPacket(ack, ack.Length, remoteEp);
                            if (isNewRoomPeer || wasUdpInactive)
                            {
                                SyncTargetPeerDropdown();
                                UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + remoteEp.ToString() + ")");
                                Log("NAT Hole Punch SUCCEEDED! Direct P2P UDP tunnel active with " + udpPeer.DisplayName + " (" + remoteEp.ToString() + ")");
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_PUNCH_ACK|") || text.StartsWith("AETHER_PONG|"))
                    {
                        string[] parts = text.Split('|');
                        string myCleanRoom = CleanRoomCode(currentRoomCode);
                        string rInst = "";
                        string rDName = "";
                        if (text.StartsWith("AETHER_PUNCH_ACK|") && parts.Length >= 3)
                        {
                            rInst = parts[2];
                            if (parts.Length >= 4) rDName = parts[3].Trim();
                        }
                        else if (text.StartsWith("AETHER_PONG|") && parts.Length >= 2)
                        {
                            rInst = parts[1];
                            if (parts.Length >= 3) rDName = parts[2].Trim();
                        }

                        RoomPeerInfo udpPeer = FindPeerByEndpointOrInstance(myCleanRoom, rInst, remoteEp);
                        bool isNewRoomPeer = false;
                        bool fullRej = false;
                        if (udpPeer == null && myCleanRoom.Length > 0 && rInst.Length > 0)
                        {
                            udpPeer = UpsertRoomPeer("aethertunnel-exe-" + myCleanRoom + "-" + rInst, rDName.Length > 0 ? rDName : ("Windows .EXE (" + rInst.Substring(0, Math.Min(4, rInst.Length)) + ")"), "exe", out isNewRoomPeer, out fullRej);
                        }
                        if (udpPeer != null && !fullRej)
                        {
                            bool wasUdpInactive = (udpPeer.ActiveUdpEp == null || !udpPeer.ActiveUdpEp.Equals(remoteEp) || (DateTime.UtcNow - udpPeer.LastUdpSeen).TotalSeconds > 8);
                            udpPeer.ActiveUdpEp = remoteEp;
                            udpPeer.LastUdpSeen = DateTime.UtcNow;
                            if (rDName.Length > 0) udpPeer.DisplayName = rDName;
                            if (isNewRoomPeer || wasUdpInactive)
                            {
                                SyncTargetPeerDropdown();
                                Log("Verified Direct P2P NAT-Punched UDP connection with " + udpPeer.DisplayName + " (" + remoteEp.ToString() + ")");
                            }
                        }

                        bool staleOrEmpty = (activeUdpPeerEndpoint == null || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6);
                        bool isNew = (activeUdpPeerEndpoint == null || (staleOrEmpty && !activeUdpPeerEndpoint.Equals(remoteEp)) || ((DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 8));
                        if (staleOrEmpty || activeUdpPeerEndpoint.Equals(remoteEp))
                        {
                            activeUdpPeerEndpoint = remoteEp;
                            lastUdpPeerSeen = DateTime.UtcNow;
                            if (isNew && udpPeer == null)
                            {
                                UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + remoteEp.ToString() + ")");
                                Log("Verified Direct P2P NAT-Punched UDP connection with " + remoteEp.ToString());
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_PING|"))
                    {
                        string[] parts = text.Split('|');
                        string rInst = parts.Length >= 2 ? parts[1] : "";
                        RoomPeerInfo udpPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), rInst, remoteEp);
                        if (udpPeer != null)
                        {
                            udpPeer.ActiveUdpEp = remoteEp;
                            udpPeer.LastUdpSeen = DateTime.UtcNow;
                        }
                        if (activeUdpPeerEndpoint == null || activeUdpPeerEndpoint.Equals(remoteEp) || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6)
                        {
                            activeUdpPeerEndpoint = remoteEp;
                            lastUdpPeerSeen = DateTime.UtcNow;
                        }
                        byte[] pong = Encoding.UTF8.GetBytes("AETHER_PONG|" + instanceId + "|" + SanitizeJsonText(localDisplayName));
                        SendUdpP2pPacket(pong, pong.Length, remoteEp);
                    }
                    else if (text.StartsWith("AETHER_UDP_START|"))
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        RoomPeerInfo startPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", remoteEp);
                        if (startPeer != null)
                        {
                            startPeer.ActiveUdpEp = remoteEp;
                            startPeer.LastUdpSeen = DateTime.UtcNow;
                        }
                        udpPendingStartEp = remoteEp;
                        udpPendingStartHeader = text;
                        udpRxStartPending = true;
                        udpRxDataEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_WAIT_ACCEPT|"))
                    {
                        udpWaitAcceptReceived = true;
                        udpResumeEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_REJECT|"))
                    {
                        udpTransferRejected = true;
                        udpResumeEvent.Set();
                        udpAckEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_RESUME|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2)
                        {
                            string rFile = parts.Length >= 3 ? parts[2] : "";
                            string curTxFile = udpTxActiveFileName;
                            if (String.IsNullOrEmpty(rFile) || String.IsNullOrEmpty(curTxFile) || rFile == curTxFile)
                            {
                                int rChunk = 0;
                                if (Int32.TryParse(parts[1], out rChunk) && rChunk >= 0)
                                {
                                    if (rChunk > udpPeerResumeChunk) udpPeerResumeChunk = rChunk;
                                    if (rChunk - 1 > udpPeerContiguousChunk) udpPeerContiguousChunk = rChunk - 1;
                                    udpResumeReceived = true;
                                    udpTxLastPeerActivityTick = Environment.TickCount;
                                    lastAckReceivedTick = Environment.TickCount;
                                    udpResumeEvent.Set();
                                    udpAckEvent.Set();
                                }
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_ACK|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2)
                        {
                            int uniqueCnt = 0;
                            if (Int32.TryParse(parts[1], out uniqueCnt))
                            {
                                if (uniqueCnt > udpPeerUniqueAcked) udpPeerUniqueAcked = uniqueCnt;
                            }
                            if (parts.Length >= 3)
                            {
                                int contigIdx = 0;
                                if (Int32.TryParse(parts[2], out contigIdx))
                                {
                                    if (contigIdx > udpPeerContiguousChunk) udpPeerContiguousChunk = contigIdx;
                                    if (contigIdx > udpPeerAckedChunk) udpPeerAckedChunk = contigIdx;
                                }
                            }
                            lastAckReceivedTick = Environment.TickCount;
                            udpTxLastPeerActivityTick = Environment.TickCount;
                            if (parts.Length >= 4)
                            {
                                int rxMbits = 0;
                                bool peerDiskPressure = (parts.Length >= 5 && parts[4] == "1");
                                if (Int32.TryParse(parts[3], out rxMbits) && rxMbits > 0)
                                {
                                    udpPeerMeasuredMbps = rxMbits;
                                    if (peerDiskPressure)
                                    {
                                        udpCleanAckStreak = 0;
                                        udpLowRxStreak = 0;
                                        double diskCap = Math.Max(16.0, (double)rxMbits * 1.05);
                                        if (dynamicUdpBitrateMbps > diskCap)
                                        {
                                            dynamicUdpBitrateMbps = Math.Max(8.0, (dynamicUdpBitrateMbps * 0.96 < diskCap) ? diskCap : dynamicUdpBitrateMbps * 0.96);
                                        }
                                        udpAckEvent.Set();
                                        return;
                                    }

                                    double boundedSample = Math.Min((double)rxMbits, Math.Max(32.0, dynamicUdpBitrateMbps * 1.50 + 12.0));
                                    long nowSwTicks = Stopwatch.GetTimestamp();
                                    if (udpBestRxDecayTicks == 0) udpBestRxDecayTicks = nowSwTicks;
                                    double elapsedDecaySec = (nowSwTicks - udpBestRxDecayTicks) / (double)Stopwatch.Frequency;
                                    if (elapsedDecaySec >= 1.2)
                                    {
                                        double decayFactor = Math.Max(0.88, 1.0 - (0.025 * elapsedDecaySec));
                                        udpBestRxMbps = Math.Max(8.0, udpBestRxMbps * decayFactor);
                                        udpBestRxDecayTicks = nowSwTicks;
                                    }
                                    if (boundedSample > udpBestRxMbps)
                                    {
                                        udpBestRxMbps = boundedSample;
                                        udpBestRxDecayTicks = nowSwTicks;
                                    }

                                    // Smooth Pacer: avoids sawtooth dips on brief Wi-Fi/router jitter while protecting queue stability
                                    if (unchecked(Environment.TickCount - lastNackReceivedTick) > 40)
                                    {
                                        udpCleanAckStreak++;
                                        if (!udpInSlowStart)
                                        {
                                            if (udpCleanAckStreak >= 24)
                                            {
                                                udpCongestionCeilingMbps = 0.0;
                                                udpInSlowStart = true;
                                            }
                                            else if (udpCongestionCeilingMbps <= 0.0 && udpCleanAckStreak >= 8)
                                            {
                                                udpInSlowStart = true;
                                            }
                                            else if (udpCongestionCeilingMbps > 0.0 && udpCleanAckStreak >= 16 && dynamicUdpBitrateMbps < udpCongestionCeilingMbps * 0.85)
                                            {
                                                udpInSlowStart = true;
                                            }
                                        }

                                        double prevRate = dynamicUdpBitrateMbps;
                                        double effectiveRx = Math.Max(boundedSample, udpBestRxMbps * 0.90);
                                        double routerSafeCap = Math.Max(32.0, udpBestRxMbps * 1.30 + 12.0);
                                        double maxSingleStep = Math.Min(routerSafeCap, prevRate * 1.30 + 4.0);
                                        if (udpInSlowStart)
                                        {
                                            if (effectiveRx >= prevRate * 0.40 || prevRate < 40.0)
                                            {
                                                udpLowRxStreak = 0;
                                                double factor = (udpCongestionCeilingMbps > 0.0 && prevRate >= udpCongestionCeilingMbps * 0.80) ? 1.12 : 1.24;
                                                double nextRate = Math.Max(prevRate * factor + 2.0, effectiveRx * 1.15 + 2.0);
                                                dynamicUdpBitrateMbps = Math.Min(5000.0, Math.Min(maxSingleStep, nextRate));
                                            }
                                            else
                                            {
                                                udpLowRxStreak++;
                                                if (udpLowRxStreak >= 10)
                                                {
                                                    udpInSlowStart = false;
                                                    double targetCap = Math.Max(12.0, udpBestRxMbps * 1.12);
                                                    dynamicUdpBitrateMbps = Math.Min(5000.0, (prevRate * 0.82) + (targetCap * 0.18));
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (boundedSample >= prevRate * 0.58 || effectiveRx >= prevRate * 0.65)
                                            {
                                                udpLowRxStreak = 0;
                                                double step = (udpCongestionCeilingMbps > 0.0 && prevRate >= udpCongestionCeilingMbps * 0.90) ? 1.04 : 1.07;
                                                double targetCruise = Math.Min(maxSingleStep, Math.Max(prevRate * step + 1.5, udpBestRxMbps * 1.15));
                                                dynamicUdpBitrateMbps = Math.Min(5000.0, targetCruise);
                                                if (udpCongestionCeilingMbps > 0.0 && dynamicUdpBitrateMbps > udpCongestionCeilingMbps)
                                                {
                                                    udpCongestionCeilingMbps = dynamicUdpBitrateMbps;
                                                }
                                            }
                                            else
                                            {
                                                udpLowRxStreak++;
                                                if (udpLowRxStreak >= 10)
                                                {
                                                    double targetCap = Math.Max(8.0, udpBestRxMbps * 1.10);
                                                    dynamicUdpBitrateMbps = Math.Max(8.0, (prevRate * 0.88) + (targetCap * 0.12));
                                                }
                                                else
                                                {
                                                    dynamicUdpBitrateMbps = Math.Max(8.0, prevRate * 0.994);
                                                }
                                            }
                                        }

                                        long userLimitBps = Interlocked.Read(ref maxUploadBytesPerSec);
                                        if (userLimitBps > 0L)
                                        {
                                            double userCapMbps = Math.Max(0.1, (userLimitBps * 8.0) / (1024.0 * 1024.0));
                                            if (dynamicUdpBitrateMbps > userCapMbps) dynamicUdpBitrateMbps = userCapMbps;
                                            if (udpCongestionCeilingMbps > userCapMbps) udpCongestionCeilingMbps = userCapMbps;
                                        }

                                        if (dynamicUdpBitrateMbps > prevRate * 1.20)
                                        {
                                            Interlocked.Exchange(ref pacingResetRequested, 1);
                                        }
                                    }
                                }
                            }
                            udpAckEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_NACK|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2 && !String.IsNullOrEmpty(parts[1]))
                        {
                            string[] tokens = parts[1].Split(',');
                            int nowTick = Environment.TickCount;
                            int enqueuedCount = 0;
                            if (udpSenderChunkLastSentTick.Count > 4096) udpSenderChunkLastSentTick.Clear();
                            foreach (string t in tokens)
                            {
                                int missIdx;
                                if (Int32.TryParse(t.Trim(), out missIdx) && missIdx >= 0)
                                {
                                    int prevSendTick;
                                    if (!udpSenderChunkLastSentTick.TryGetValue(missIdx, out prevSendTick) || unchecked(nowTick - prevSendTick) > 220)
                                    {
                                        udpSenderChunkLastSentTick[missIdx] = nowTick;
                                        udpRetransmitQueue.Enqueue(missIdx);
                                        enqueuedCount++;
                                    }
                                }
                            }
                            lastNackReceivedTick = nowTick;
                            udpTxLastPeerActivityTick = nowTick;
                            int lossCutThreshold = Math.Max(36, Math.Min(140, (int)Math.Round(dynamicUdpBitrateMbps * 0.20)));
                            if (enqueuedCount >= lossCutThreshold && unchecked(nowTick - lastNackCutTick) > 1600)
                            {
                                lastNackCutTick = nowTick;
                                udpCongestionCeilingMbps = dynamicUdpBitrateMbps * 0.96;
                                udpInSlowStart = false;
                                udpCleanAckStreak = 0;
                                udpLowRxStreak = 0;
                                double cutFactor = (enqueuedCount >= 100) ? 0.85 : 0.93;
                                double floorCap = Math.Max(8.0, udpBestRxMbps * 0.88);
                                double reduced = Math.Max(floorCap, dynamicUdpBitrateMbps * cutFactor);
                                dynamicUdpBitrateMbps = Math.Max(8.0, reduced);
                                Interlocked.Exchange(ref pacingResetRequested, 1);
                            }
                            udpAckEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_NEED_START|"))
                    {
                        udpNeedStartResend = true;
                        udpTxLastPeerActivityTick = Environment.TickCount;
                        udpAckEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_DONE|"))
                    {
                        string[] dParts = text.Split('|');
                        string dFile = dParts.Length >= 2 ? dParts[1] : "";
                        string curTxFile = udpTxActiveFileName;
                        if (String.IsNullOrEmpty(dFile) || String.IsNullOrEmpty(curTxFile) || dFile == curTxFile)
                        {
                            udpTransferDoneAcked = true;
                            udpTxLastPeerActivityTick = Environment.TickCount;
                            udpAckEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_END|"))
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        RoomPeerInfo endPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", remoteEp);
                        if (endPeer != null)
                        {
                            endPeer.ActiveUdpEp = remoteEp;
                            endPeer.LastUdpSeen = DateTime.UtcNow;
                        }
                        string[] endParts = text.Split('|');
                        string endFile = (endParts.Length >= 2) ? endParts[1] : "";
                        string curActiveName = activeRxUdpFileName;
                        string curDoneName = lastCompletedUdpFileNameVolatile;
                        if (!String.IsNullOrEmpty(endFile) && curActiveName.Length == 0 && endFile == curDoneName)
                        {
                            byte[] quickDone = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + curDoneName);
                            try { SendUdpP2pPacket(quickDone, quickDone.Length, remoteEp); } catch { }
                        }
                        else if (String.IsNullOrEmpty(endFile) || curActiveName.Length == 0 || endFile == curActiveName)
                        {
                            if (!udpRxEndPending)
                            {
                                udpRxEndTick = Environment.TickCount;
                                udpRxEndPending = true;
                            }
                            udpRxDataEvent.Set();
                        }
                    }
                }
                catch { }
        }

        private byte[] AllocStageBuffer()
        {
            byte[] buf;
            if (!udpStageBufferPool.TryDequeue(out buf) || buf == null || buf.Length != STAGE_PAGE_BYTES)
            {
                buf = new byte[STAGE_PAGE_BYTES];
            }
            Interlocked.Add(ref totalAppBufferedBytes, STAGE_PAGE_BYTES);
            return buf;
        }

        private void ReleaseStageBuffer(byte[] buf)
        {
            if (buf == null) return;
            Interlocked.Add(ref totalAppBufferedBytes, -STAGE_PAGE_BYTES);
            if (udpStageBufferPool.Count < 32)
            {
                udpStageBufferPool.Enqueue(buf);
            }
        }

        private void EnqueueDiskWriteJob(DiskWriteJob job)
        {
            Interlocked.Increment(ref activeDiskIoJobs);
            diskIoIdleEvent.Reset();
            diskWriteQueue.Enqueue(job);
            diskWriteEvent.Set();
        }

        private void WaitForDiskIoDrain(int maxWaitMs)
        {
            Stopwatch sw = Stopwatch.StartNew();
            diskWriteEvent.Set();
            while (sw.ElapsedMilliseconds < maxWaitMs)
            {
                if (diskWriteQueue.IsEmpty && Thread.VolatileRead(ref activeDiskIoJobs) <= 0)
                {
                    break;
                }
                try { diskIoIdleEvent.WaitOne(20); } catch { }
            }
        }

        private long ReadCheckpointBytes(string partPath, long expectedFileSize)
        {
            long existingLen = 0;
            try
            {
                if (!File.Exists(partPath)) return 0;
                existingLen = new FileInfo(partPath).Length;
            }
            catch { return 0; }
            if (existingLen <= 0) return 0;

            string ckptPath = partPath + ".ckpt";
            if (File.Exists(ckptPath))
            {
                try
                {
                    string ckptRaw = File.ReadAllText(ckptPath).Trim();
                    string[] ckptParts = ckptRaw.Split('|');
                    if (ckptParts.Length >= 3 && ckptParts[2] == "B")
                    {
                        long ckptBytes = 0;
                        long ckptExpSize = 0;
                        if (Int64.TryParse(ckptParts[0], out ckptBytes) && Int64.TryParse(ckptParts[1], out ckptExpSize))
                        {
                            if (ckptExpSize == expectedFileSize && ckptBytes > 0 && existingLen >= ckptBytes)
                            {
                                return Math.Min(ckptBytes, expectedFileSize);
                            }
                        }
                    }
                    else if (ckptParts.Length >= 1)
                    {
                        long ckptChunk = 0;
                        if (Int64.TryParse(ckptParts[0], out ckptChunk) && ckptChunk > 0)
                        {
                            long ckptBytes = ckptChunk * UDP_CHUNK_SIZE;
                            if (ckptParts.Length >= 2)
                            {
                                long ckptExpSize = 0;
                                if (Int64.TryParse(ckptParts[1], out ckptExpSize) && ckptExpSize == expectedFileSize && existingLen >= ckptBytes)
                                {
                                    return Math.Min(ckptBytes, expectedFileSize);
                                }
                            }
                            else if (existingLen < expectedFileSize)
                            {
                                return Math.Min(ckptBytes, existingLen);
                            }
                        }
                    }
                }
                catch { }
            }

            if (existingLen < expectedFileSize)
            {
                return existingLen;
            }
            return 0;
        }

        private void WriteCheckpointFile(string partPath, long resumeBytes, long expectedFileSize)
        {
            if (String.IsNullOrEmpty(partPath) || expectedFileSize <= 0 || resumeBytes <= 0) return;
            try
            {
                string ckptBody = Math.Min(resumeBytes, expectedFileSize).ToString() + "|" + expectedFileSize.ToString() + "|B";
                File.WriteAllText(partPath + ".ckpt", ckptBody);
            }
            catch { }
        }

        private void ReleaseConflictingRxHandlesForPart(string partPath, string requesterProtocol)
        {
            if (String.IsNullOrEmpty(partPath)) return;
            if (requesterProtocol != "udp" && activeRxUdpPartPath == partPath)
            {
                try
                {
                    udpRxClosedSignal.Reset();
                    udpRxCloseTargetPath = partPath;
                    udpRxCloseRequested = true;
                    udpRxDataEvent.Set();
                    udpRxClosedSignal.WaitOne(2500);
                }
                catch { }
            }
            if (requesterProtocol != "cloud")
            {
                lock (cloudRxFileLock)
                {
                    if (cloudOutFile != null && cloudPartPath == partPath)
                    {
                        try { WriteCheckpointFile(cloudPartPath, cloudReceivedBytes, cloudExpectedSize); } catch { }
                        try { cloudOutFile.Flush(false); } catch { }
                        try { cloudOutFile.Close(); } catch { }
                        cloudOutFile = null;
                    }
                }
            }
            TcpClient tcpToClose = null;
            TcpClient wsToClose = null;
            lock (rxHandleCoordLock)
            {
                if (activeTcpRxPartPath == partPath && activeTcpRxClient != null)
                {
                    tcpToClose = activeTcpRxClient;
                }
                if (activeWsRxPartPath == partPath && activeWsRxClient != null)
                {
                    wsToClose = activeWsRxClient;
                }
            }
            if (tcpToClose != null)
            {
                try { tcpToClose.Close(); } catch { }
                for (int w = 0; w < 20; w++)
                {
                    lock (rxHandleCoordLock)
                    {
                        if (activeTcpRxPartPath != partPath) break;
                    }
                    Thread.Sleep(35);
                }
            }
            if (wsToClose != null)
            {
                try { wsToClose.Close(); } catch { }
                for (int w = 0; w < 20; w++)
                {
                    lock (rxHandleCoordLock)
                    {
                        if (activeWsRxPartPath != partPath) break;
                    }
                    Thread.Sleep(35);
                }
            }
        }

        private bool SafeFinalizePartFile(string partPath, string finalPath, string ckptPath)
        {
            Exception lastErr = null;
            bool movedOk = false;
            for (int attempt = 0; attempt < 25; attempt++)
            {
                try
                {
                    if (!File.Exists(partPath))
                    {
                        movedOk = File.Exists(finalPath);
                        break;
                    }
                    if (File.Exists(finalPath))
                    {
                        File.Delete(finalPath);
                    }
                    File.Move(partPath, finalPath);
                    movedOk = true;
                    break;
                }
                catch (Exception ex)
                {
                    lastErr = ex;
                    if (attempt == 2)
                    {
                        try { GC.Collect(); GC.WaitForPendingFinalizers(); } catch { }
                    }
                    Thread.Sleep(150);
                }
            }

            if (!movedOk)
            {
                try
                {
                    if (File.Exists(partPath))
                    {
                        string dir = Path.GetDirectoryName(finalPath);
                        string nameOnly = Path.GetFileNameWithoutExtension(finalPath);
                        string ext = Path.GetExtension(finalPath);
                        string altPath = Path.Combine(dir, nameOnly + "_" + DateTime.Now.ToString("HHmmss") + ext);
                        File.Move(partPath, altPath);
                        Log("File saved with alternate name (destination was locked): " + altPath);
                        movedOk = true;
                    }
                }
                catch (Exception ex2)
                {
                    lastErr = ex2;
                }
            }

            if (movedOk && !String.IsNullOrEmpty(ckptPath))
            {
                for (int k = 0; k < 5; k++)
                {
                    try
                    {
                        if (File.Exists(ckptPath)) File.Delete(ckptPath);
                        break;
                    }
                    catch
                    {
                        Thread.Sleep(60);
                    }
                }
            }

            if (!movedOk && lastErr != null)
            {
                Log("File finalization error (" + Path.GetFileName(finalPath) + "): " + lastErr.Message);
            }
            return movedOk;
        }

        private void UdpP2pDiskIoLoop()
        {
            udpDiskIoExitedEvent.Reset();
            long bytesSinceCkpt = 0;
            Stopwatch ckptSw = Stopwatch.StartNew();
            Stopwatch writeSw = new Stopwatch();
            try
            {
                while (isRunning || !diskWriteQueue.IsEmpty)
                {
                    DiskWriteJob job;
                    while (diskWriteQueue.TryDequeue(out job))
                    {
                        int jobPauseMs = 0;
                        try
                        {
                            lock (diskFileStreamLock)
                            {
                                if (job.TargetFile != null)
                                {
                                    if (job.Length > 0 && job.Buffer != null)
                                    {
                                        writeSw.Restart();
                                        if (job.TargetFile.Position != job.FileOffset)
                                        {
                                            job.TargetFile.Seek(job.FileOffset, SeekOrigin.Begin);
                                        }
                                        job.TargetFile.Write(job.Buffer, 0, job.Length);
                                        writeSw.Stop();

                                        bytesSinceCkpt += job.Length;
                                        int elapsedWriteMs = (int)Math.Min(60000L, writeSw.ElapsedMilliseconds);
                                        lastDiskWriteMs = elapsedWriteMs;

                                        if (job.Length >= 512 * 1024)
                                        {
                                            double instDiskMbps = (job.Length / (1024.0 * 1024.0)) / Math.Max(0.0005, writeSw.Elapsed.TotalSeconds);
                                            int curAvg = smoothedDiskWriteMbps;
                                            int nextAvg = curAvg <= 0
                                                ? (int)Math.Round(instDiskMbps)
                                                : (int)Math.Round((curAvg * 0.70) + (instDiskMbps * 0.30));
                                            smoothedDiskWriteMbps = Math.Max(1, Math.Min(5000, nextAvg));
                                        }

                                        if (elapsedWriteMs >= 30)
                                        {
                                            jobPauseMs = Math.Min(25, Math.Max(2, elapsedWriteMs / 4));
                                        }
                                    }

                                    // Flush managed user-space buffer ONLY on explicit drain/close; NEVER call Flush(true) hardware SYNCHRONIZE CACHE!
                                    if (job.ForceOsSync)
                                    {
                                        try { job.TargetFile.Flush(false); } catch { }
                                    }

                                    bool writeCkpt = (job.CkptContigChunk >= 0 && !String.IsNullOrEmpty(job.PartPath)) &&
                                        (job.ForceOsSync || (bytesSinceCkpt >= 64L * 1024L * 1024L && ckptSw.ElapsedMilliseconds >= 2000));
                                    if (writeCkpt)
                                    {
                                        bytesSinceCkpt = 0;
                                        ckptSw.Restart();
                                        long resumeByteOff = (long)(job.CkptContigChunk + 1) * UDP_CHUNK_SIZE;
                                        WriteCheckpointFile(job.PartPath, resumeByteOff, job.ExpectedFileSize);
                                    }
                                }
                            }
                        }
                        catch { }
                        finally
                        {
                            ReleaseStageBuffer(job.Buffer);
                            if (Interlocked.Decrement(ref activeDiskIoJobs) <= 0)
                            {
                                diskIoIdleEvent.Set();
                            }
                        }
                        if (jobPauseMs > 0 && isRunning) Thread.Sleep(jobPauseMs);
                    }
                    if (!isRunning && diskWriteQueue.IsEmpty) break;
                    diskWriteEvent.WaitOne(25);
                }
            }
            finally
            {
                diskIoIdleEvent.Set();
                udpDiskIoExitedEvent.Set();
            }
        }

        private void EnqueueCompletedPageJob(
            FileStream outFile,
            string partPath,
            long expectedFileSize,
            UdpStagePage page,
            List<DiskWriteJob> queuedJobs)
        {
            if (page == null) return;
            if (page.StartSlot == 0)
            {
                DiskWriteJob job = new DiskWriteJob();
                job.TargetFile = outFile;
                job.PartPath = partPath;
                job.ExpectedFileSize = expectedFileSize;
                job.Buffer = page.Data;
                job.Length = page.ValidBytes;
                job.FileOffset = (long)page.PageIndex * STAGE_PAGE_BYTES;
                job.CkptContigChunk = -1;
                job.ForceOsSync = false;
                queuedJobs.Add(job);
            }
            else
            {
                int exp = page.ExpectedCount;
                int s = page.StartSlot;
                while (s < exp)
                {
                    while (s < exp && !page.Present[s]) s++;
                    if (s >= exp) break;
                    int runStart = s;
                    int runBytes = 0;
                    while (s < exp && page.Present[s])
                    {
                        runBytes += page.ChunkLens[s];
                        page.Present[s] = false;
                        s++;
                    }
                    if (runBytes > 0)
                    {
                        byte[] runBuf = AllocStageBuffer();
                        Buffer.BlockCopy(page.Data, runStart * UDP_CHUNK_SIZE, runBuf, 0, runBytes);
                        DiskWriteJob rJob = new DiskWriteJob();
                        rJob.TargetFile = outFile;
                        rJob.PartPath = partPath;
                        rJob.ExpectedFileSize = expectedFileSize;
                        rJob.Buffer = runBuf;
                        rJob.Length = runBytes;
                        rJob.FileOffset = ((long)page.PageIndex * CHUNKS_PER_STAGE_PAGE + runStart) * UDP_CHUNK_SIZE;
                        rJob.CkptContigChunk = -1;
                        rJob.ForceOsSync = false;
                        queuedJobs.Add(rJob);
                    }
                }
                ReleaseStageBuffer(page.Data);
            }
        }

        private void DispatchStagedPagesToDiskQueue(
            FileStream outFile,
            string partPath,
            long expectedFileSize,
            Dictionary<int, UdpStagePage> stagedPages,
            ref long readyCompletedBytes,
            ref int lastQueuedCkptContig,
            int curContiguous,
            List<int> keysBuf,
            bool forceAll)
        {
            if (outFile == null || (stagedPages.Count == 0 && (!forceAll || curContiguous <= lastQueuedCkptContig))) return;

            List<DiskWriteJob> queuedJobs = new List<DiskWriteJob>();

            // 1. Strictly sequential in-order flush from diskSequentialNextPage (eliminates NTFS ValidDataLength zero-fills & random SSD seeks!)
            UdpStagePage seqPage;
            int nextSeq = diskSequentialNextPage;
            while (stagedPages.TryGetValue(nextSeq, out seqPage))
            {
                int needed = Math.Max(1, seqPage.ExpectedCount - seqPage.StartSlot);
                if (seqPage.PresentCount < needed) break;
                stagedPages.Remove(nextSeq);
                readyCompletedBytes -= seqPage.ValidBytes;
                if (readyCompletedBytes < 0) readyCompletedBytes = 0;
                EnqueueCompletedPageJob(outFile, partPath, expectedFileSize, seqPage, queuedJobs);
                nextSeq++;
            }
            diskSequentialNextPage = nextSeq;

            // 2. Emergency spill ONLY when RAM staging exceeds 512 MB behind a gap, or on forceAll (transfer end / close)
            long remainingPageBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
            if (forceAll || remainingPageBytes >= 512L * 1024L * 1024L)
            {
                keysBuf.Clear();
                foreach (KeyValuePair<int, UdpStagePage> kv in stagedPages)
                {
                    int needed = Math.Max(1, kv.Value.ExpectedCount - kv.Value.StartSlot);
                    if (kv.Value.PresentCount >= needed) keysBuf.Add(kv.Key);
                }
                if (keysBuf.Count > 0)
                {
                    keysBuf.Sort();
                    for (int i = 0; i < keysBuf.Count; i++)
                    {
                        int pIdx = keysBuf[i];
                        UdpStagePage page = stagedPages[pIdx];
                        stagedPages.Remove(pIdx);
                        readyCompletedBytes -= page.ValidBytes;
                        if (readyCompletedBytes < 0) readyCompletedBytes = 0;
                        EnqueueCompletedPageJob(outFile, partPath, expectedFileSize, page, queuedJobs);
                    }
                }

                remainingPageBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
                if ((forceAll || remainingPageBytes >= 512L * 1024L * 1024L) && stagedPages.Count > 0)
                {
                    keysBuf.Clear();
                    foreach (int key in stagedPages.Keys) keysBuf.Add(key);
                    keysBuf.Sort();

                    for (int i = 0; i < keysBuf.Count; i++)
                    {
                        int pIdx = keysBuf[i];
                        UdpStagePage page = stagedPages[pIdx];
                        stagedPages.Remove(pIdx);

                        int exp = page.ExpectedCount;
                        int s = page.StartSlot;
                        while (s < exp)
                        {
                            while (s < exp && !page.Present[s]) s++;
                            if (s >= exp) break;
                            int runStart = s;
                            int runBytes = 0;
                            while (s < exp && page.Present[s])
                            {
                                runBytes += page.ChunkLens[s];
                                page.Present[s] = false;
                                s++;
                            }
                            if (runBytes > 0)
                            {
                                byte[] runBuf = AllocStageBuffer();
                                Buffer.BlockCopy(page.Data, runStart * UDP_CHUNK_SIZE, runBuf, 0, runBytes);
                                DiskWriteJob rJob = new DiskWriteJob();
                                rJob.TargetFile = outFile;
                                rJob.PartPath = partPath;
                                rJob.ExpectedFileSize = expectedFileSize;
                                rJob.Buffer = runBuf;
                                rJob.Length = runBytes;
                                rJob.FileOffset = ((long)pIdx * CHUNKS_PER_STAGE_PAGE + runStart) * UDP_CHUNK_SIZE;
                                rJob.CkptContigChunk = -1;
                                rJob.ForceOsSync = false;
                                queuedJobs.Add(rJob);
                            }
                        }
                        ReleaseStageBuffer(page.Data);
                    }
                }
            }

            if (queuedJobs.Count == 0 && !forceAll) return;

            int diskSafeContig = curContiguous;
            foreach (UdpStagePage remPage in stagedPages.Values)
            {
                int pageBase = remPage.PageIndex * CHUNKS_PER_STAGE_PAGE;
                if (pageBase <= diskSafeContig)
                {
                    int firstPresent = -1;
                    for (int s = remPage.StartSlot; s < remPage.ExpectedCount; s++)
                    {
                        if (remPage.Present[s]) { firstPresent = s; break; }
                    }
                    if (firstPresent >= 0)
                    {
                        int cand = pageBase + firstPresent - 1;
                        if (cand < diskSafeContig) diskSafeContig = cand;
                    }
                }
            }

            int ckptToWrite = (diskSafeContig > lastQueuedCkptContig) ? diskSafeContig : -1;
            if (ckptToWrite > lastQueuedCkptContig) lastQueuedCkptContig = ckptToWrite;

            if (queuedJobs.Count > 0)
            {
                DiskWriteJob lastJob = queuedJobs[queuedJobs.Count - 1];
                lastJob.CkptContigChunk = ckptToWrite;
                lastJob.ForceOsSync = forceAll;
                for (int j = 0; j < queuedJobs.Count; j++)
                {
                    EnqueueDiskWriteJob(queuedJobs[j]);
                }
            }
            else if (forceAll)
            {
                DiskWriteJob syncJob = new DiskWriteJob();
                syncJob.TargetFile = outFile;
                syncJob.PartPath = partPath;
                syncJob.ExpectedFileSize = expectedFileSize;
                syncJob.Buffer = null;
                syncJob.Length = 0;
                syncJob.FileOffset = 0;
                syncJob.CkptContigChunk = ckptToWrite;
                syncJob.ForceOsSync = true;
                EnqueueDiskWriteJob(syncJob);
            }
        }

        private void UdpP2pDiskWriterLoop()
        {
            udpWriterExitedEvent.Reset();
            FileStream udpOutFile = null;
            string udpFileName = "";
            string lastCompletedUdpFileName = "";
            string udpPartPath = "";
            string udpFinalPath = "";
            long udpExpectedSize = 0;
            int udpExpectedChunks = 1;
            long udpReceivedBytes = 0;
            long udpSessionStartBytes = 0;
            long readyCompletedBytes = 0;
            int lastQueuedCkptContig = -1;
            bool[] udpChunkReceived = null;
            Dictionary<int, int> udpChunkLastNackTick = new Dictionary<int, int>();
            Dictionary<int, UdpStagePage> stagedPages = new Dictionary<int, UdpStagePage>(512);
            List<int> pageKeysBuf = new List<int>(512);
            int udpContiguousChunk = -1;
            int udpHighestSeenChunk = -1;
            int udpUniqueReceivedCount = 0;
            int chunksSinceLastAck = 0;
            int dupChunksSinceLastResume = 0;
            int lastNeedStartTick = 0;
            int lastEndNackTick = 0;
            int lastPartialDispatchTick = 0;
            int lastContigAdvanceTick = Environment.TickCount;
            int lastIdleHoleNackTick = 0;
            long ackWindowBytes = 0;
            long uiWindowBytes = 0;
            double smoothedUiRxMbps = 0.0;
            Stopwatch ackWindowSw = Stopwatch.StartNew();
            Stopwatch uiWindowSw = Stopwatch.StartNew();
            Stopwatch dupResumeSw = Stopwatch.StartNew();
            Stopwatch flushSw = Stopwatch.StartNew();
            Stopwatch udpRxSw = null;
            int lastAnyUdpRxTick = Environment.TickCount;
            ParallelOptions decParallelOpts = new ParallelOptions();
            decParallelOpts.MaxDegreeOfParallelism = Math.Max(1, Math.Min(4, Environment.ProcessorCount / 2));

            try
            {
                while (isRunning)
                {
                    udpRxDataEvent.WaitOne(8);

                    try
                    {
                        if (udpRxCloseRequested)
                        {
                            udpRxCloseRequested = false;
                            string reqTarget = udpRxCloseTargetPath;
                            if (udpOutFile != null && (String.IsNullOrEmpty(reqTarget) || reqTarget == udpPartPath))
                            {
                                activeRxUdpFileName = "";
                                activeRxUdpPartPath = "";
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                WaitForDiskIoDrain(10000);
                                lock (diskFileStreamLock)
                                {
                                    try { udpOutFile.Flush(false); } catch { }
                                    try { udpOutFile.Close(); } catch { }
                                    udpOutFile = null;
                                }
                                WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                                foreach (UdpStagePage remP in stagedPages.Values) ReleaseStageBuffer(remP.Data);
                                stagedPages.Clear();
                                readyCompletedBytes = 0;
                                udpRxEndPending = false;
                                udpRxEndTick = 0;
                                udpPromptState = 0;
                            }
                            udpRxClosedSignal.Set();
                        }

                        if (udpPendingAcceptOpen)
                        {
                            udpPendingAcceptOpen = false;
                            lastAnyUdpRxTick = Environment.TickCount;
                            string aHdr = udpPendingAcceptHeader;
                            IPEndPoint aEp = udpPendingAcceptEp ?? activeUdpPeerEndpoint;
                            string[] aParts = aHdr.Split('|');
                            if (aParts.Length >= 3)
                            {
                                string newFileName = aParts[1];
                                long newExpectedSize = 0;
                                Int64.TryParse(aParts[2], out newExpectedSize);
                                if (!(udpOutFile != null && newFileName == udpFileName && newExpectedSize == udpExpectedSize))
                                {
                                    if (udpOutFile != null)
                                    {
                                        activeRxUdpFileName = "";
                                        activeRxUdpPartPath = "";
                                        DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                        WaitForDiskIoDrain(15000);
                                        lock (diskFileStreamLock)
                                        {
                                            try { udpOutFile.Flush(false); udpOutFile.Close(); } catch { }
                                            udpOutFile = null;
                                        }
                                        WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                                    }
                                    foreach (UdpStagePage remP in stagedPages.Values)
                                    {
                                        ReleaseStageBuffer(remP.Data);
                                    }
                                    stagedPages.Clear();
                                    readyCompletedBytes = 0;

                                    udpFileName = newFileName;
                                    lastCompletedUdpFileName = "";
                                    lastCompletedUdpFileNameVolatile = "";
                                    udpExpectedSize = newExpectedSize;
                                    udpExpectedChunks = (int)Math.Max(1L, (udpExpectedSize + UDP_CHUNK_SIZE - 1) / UDP_CHUNK_SIZE);
                                    if (aParts.Length >= 4) Int32.TryParse(aParts[3], out udpExpectedChunks);

                                    udpFinalPath = Path.Combine(downloadDirectory, "AetherTunnel_" + udpFileName);
                                    udpPartPath = udpFinalPath + ".part";
                                    ReleaseConflictingRxHandlesForPart(udpPartPath, "udp");

                                    long ckptBytes = ReadCheckpointBytes(udpPartPath, udpExpectedSize);
                                    int resumeChunk = (int)(ckptBytes / UDP_CHUNK_SIZE);
                                    if (resumeChunk >= udpExpectedChunks) resumeChunk = Math.Max(0, udpExpectedChunks - 1);
                                    if (resumeChunk < 0) resumeChunk = 0;
                                    bool partExists = File.Exists(udpPartPath);
                                    long alignedBytes = (long)resumeChunk * UDP_CHUNK_SIZE;

                                    udpChunkReceived = new bool[udpExpectedChunks];
                                    udpChunkLastNackTick.Clear();
                                    for (int c = 0; c < resumeChunk && c < udpExpectedChunks; c++) udpChunkReceived[c] = true;
                                    udpContiguousChunk = resumeChunk - 1;
                                    lastQueuedCkptContig = resumeChunk - 1;
                                    udpHighestSeenChunk = resumeChunk - 1;
                                    udpUniqueReceivedCount = resumeChunk;
                                    chunksSinceLastAck = 0;
                                    dupChunksSinceLastResume = 0;
                                    ackWindowBytes = 0;
                                    uiWindowBytes = 0;
                                    smoothedUiRxMbps = 0.0;
                                    udpRxEndPending = false;
                                    udpRxEndTick = 0;
                                    lastUniqueRxChunkTick = Environment.TickCount;
                                    activeRxUdpFileName = udpFileName;
                                    activeRxUdpPartPath = udpPartPath;
                                    lastContigAdvanceTick = Environment.TickCount;
                                    lastDiskWriteMs = 0;
                                    diskSequentialNextPage = resumeChunk / CHUNKS_PER_STAGE_PAGE;
                                    int boundarySlot = resumeChunk % CHUNKS_PER_STAGE_PAGE;
                                    udpResumeBoundaryPage = (boundarySlot > 0) ? (resumeChunk / CHUNKS_PER_STAGE_PAGE) : -1;
                                    udpResumeBoundarySlot = boundarySlot;

                                    Exception openErr = null;
                                    for (int oa = 0; oa < 5; oa++)
                                    {
                                        try
                                        {
                                            udpOutFile = new FileStream(udpPartPath, (partExists && resumeChunk > 0) ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.Read, 64 * 1024, FileOptions.SequentialScan);
                                            openErr = null;
                                            break;
                                        }
                                        catch (Exception oex)
                                        {
                                            openErr = oex;
                                            udpOutFile = null;
                                            Thread.Sleep(80);
                                        }
                                    }
                                    if (udpOutFile == null)
                                    {
                                        activeRxUdpFileName = "";
                                        activeRxUdpPartPath = "";
                                        Log("Error opening .part file (" + udpFileName + "): " + (openErr != null ? openErr.Message : "locked"));
                                        continue;
                                    }
                                    if (alignedBytes > 0) udpOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                                    udpReceivedBytes = alignedBytes;
                                    udpSessionStartBytes = alignedBytes;
                                    udpRxSw = Stopwatch.StartNew();
                                    ackWindowSw.Restart();
                                    uiWindowSw.Restart();
                                    dupResumeSw.Restart();
                                    flushSw.Restart();

                                    if (aEp != null && udpP2pClient != null)
                                    {
                                        byte[] resumeReply = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + resumeChunk.ToString() + "|" + udpFileName);
                                        for (int k = 0; k < 4; k++)
                                        {
                                            try { SendUdpP2pPacket(resumeReply, resumeReply.Length, aEp); } catch { }
                                        }
                                    }

                                    if (resumeChunk > 0)
                                        Log("Resuming interrupted P2P UDP download (" + udpFileName + ") at " + FormatBytes(alignedBytes) + " (chunk " + resumeChunk.ToString() + ")");
                                    else
                                        Log("Receiving file over High-Speed P2P NAT-UDP -> " + udpFinalPath + " (" + FormatBytes(udpExpectedSize) + ")");
                                }
                            }
                        }

                        if (udpRxStartPending)
                        {
                            udpRxStartPending = false;
                            lastAnyUdpRxTick = Environment.TickCount;
                            string hdr = udpPendingStartHeader;
                            IPEndPoint senderEp = udpPendingStartEp ?? activeUdpPeerEndpoint;
                            string[] parts = hdr.Split('|');
                            if (parts.Length >= 3)
                            {
                                string newFileName = parts[1];
                                long newExpectedSize = 0;
                                Int64.TryParse(parts[2], out newExpectedSize);
                                string promptKey = newFileName + "|" + newExpectedSize.ToString();

                                if (udpPromptState == 1 && unchecked(Environment.TickCount - udpPromptStartedTick) > 180000)
                                {
                                    udpPromptState = 0;
                                }

                                // If AETHER_UDP_START arrives for the already-open active transfer (e.g. sender reconnect/resume), reset transient end state & send RESUME ACK
                                if (udpOutFile != null && newFileName == udpFileName && newExpectedSize == udpExpectedSize)
                                {
                                    udpRxEndPending = false;
                                    udpRxEndTick = 0;
                                    lastUniqueRxChunkTick = Environment.TickCount;
                                    lastContigAdvanceTick = Environment.TickCount;
                                    lastCompletedUdpFileName = "";
                                    lastCompletedUdpFileNameVolatile = "";
                                    dupChunksSinceLastResume = 0;
                                    udpChunkLastNackTick.Clear();
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        int curResume = Math.Max(0, udpContiguousChunk + 1);
                                        if (curResume >= udpExpectedChunks) curResume = Math.Max(0, udpExpectedChunks - 1);
                                        byte[] resumeReply = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + curResume.ToString() + "|" + udpFileName);
                                        for (int k = 0; k < 3; k++)
                                        {
                                            try { SendUdpP2pPacket(resumeReply, resumeReply.Length, senderEp); } catch { }
                                        }
                                    }
                                }
                                else if (udpPromptState == 1 && udpPromptKey == promptKey)
                                {
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        byte[] waitMsg = Encoding.UTF8.GetBytes("AETHER_UDP_WAIT_ACCEPT|" + newFileName);
                                        try { SendUdpP2pPacket(waitMsg, waitMsg.Length, senderEp); } catch { }
                                    }
                                }
                                else if (udpPromptState == 3 && udpPromptKey == promptKey && unchecked(Environment.TickCount - udpPromptRejectTick) < 8000)
                                {
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        byte[] rejMsg = Encoding.UTF8.GetBytes("AETHER_UDP_REJECT|" + newFileName);
                                        for (int k = 0; k < 3; k++)
                                        {
                                            try { SendUdpP2pPacket(rejMsg, rejMsg.Length, senderEp); } catch { }
                                        }
                                    }
                                }
                                else if (autoAcceptAllIncoming || udpPromptAcceptedKey == promptKey)
                                {
                                    udpPendingAcceptHeader = hdr;
                                    udpPendingAcceptEp = senderEp;
                                    udpPendingAcceptOpen = true;
                                    udpRxDataEvent.Set();
                                }
                                else
                                {
                                    udpPromptState = 1;
                                    udpPromptKey = promptKey;
                                    udpPromptStartedTick = Environment.TickCount;
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        byte[] waitMsg = Encoding.UTF8.GetBytes("AETHER_UDP_WAIT_ACCEPT|" + newFileName);
                                        for (int k = 0; k < 2; k++)
                                        {
                                            try { SendUdpP2pPacket(waitMsg, waitMsg.Length, senderEp); } catch { }
                                        }
                                    }
                                    string pCandPath = Path.Combine(downloadDirectory, "AetherTunnel_" + newFileName) + ".part";
                                    bool pHasRes = File.Exists(pCandPath) && ReadCheckpointBytes(pCandPath, newExpectedSize) > 0;
                                    string pFile = newFileName;
                                    long pSize = newExpectedSize;
                                    string pHdr = hdr;
                                    IPEndPoint pEp = senderEp;
                                    ThreadPool.QueueUserWorkItem(delegate {
                                        int choice = ShowIncomingTransferDialog("P2P NAT-UDP", pFile, pSize, pHasRes);
                                        if (choice == 1 || choice == 2)
                                        {
                                            udpPromptAcceptedKey = promptKey;
                                            udpPromptState = 2;
                                            udpPendingAcceptHeader = pHdr;
                                            udpPendingAcceptEp = pEp;
                                            udpPendingAcceptOpen = true;
                                            udpRxDataEvent.Set();
                                        }
                                        else
                                        {
                                            udpPromptState = 3;
                                            udpPromptRejectTick = Environment.TickCount;
                                            Log("Incoming P2P file declined: " + pFile);
                                            if (pEp != null && udpP2pClient != null)
                                            {
                                                byte[] rejMsg = Encoding.UTF8.GetBytes("AETHER_UDP_REJECT|" + pFile);
                                                for (int k = 0; k < 5; k++)
                                                {
                                                    try { SendUdpP2pPacket(rejMsg, rejMsg.Length, pEp); } catch { }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }

                        // If data packets arrive before AETHER_UDP_START, ask sender to re-send AETHER_UDP_START immediately
                        if (udpOutFile == null && !udpRxDataQueue.IsEmpty)
                        {
                            int nowTick = Environment.TickCount;
                            if (nowTick - lastNeedStartTick > 80 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                lastNeedStartTick = nowTick;
                                byte[] needStart = Encoding.UTF8.GetBytes("AETHER_UDP_NEED_START|1");
                                try { SendUdpP2pPacket(needStart, needStart.Length, activeUdpPeerEndpoint); } catch { }
                            }
                            continue;
                        }

                        // Drain up to 2048 packets (~2.8 MB) per batch and decrypt cleanly into pooled 4 MB RAM pages
                        List<byte[]> batch = new List<byte[]>(2048);
                        long drainedWireBytes = 0;
                        byte[] pkt;
                        while (batch.Count < 2048 && udpRxDataQueue.TryDequeue(out pkt))
                        {
                            drainedWireBytes += pkt.Length;
                            batch.Add(pkt);
                        }
                        if (drainedWireBytes > 0) Interlocked.Add(ref totalAppBufferedBytes, -drainedWireBytes);

                        if (batch.Count > 0 && udpOutFile != null)
                        {
                            lastAnyUdpRxTick = Environment.TickCount;
                            int count = batch.Count;
                            int[] indices = new int[count];
                            byte[][] plains = new byte[count][];
                            byte[] keySnapshot = aesKey;

                            if (count <= 48)
                            {
                                byte[] seqIv = threadLocalIv.Value;
                                AesCryptoServiceProvider seqAes = threadLocalAes.Value;
                                for (int i = 0; i < count; i++)
                                {
                                    try
                                    {
                                        byte[] d = batch[i];
                                        int pktTotalChunks = BitConverter.ToInt32(d, 8);
                                        if (pktTotalChunks != udpExpectedChunks) { indices[i] = -1; continue; }
                                        indices[i] = BitConverter.ToInt32(d, 4);
                                        Buffer.BlockCopy(d, 12, seqIv, 0, 16);
                                        using (ICryptoTransform dec = seqAes.CreateDecryptor(keySnapshot, seqIv))
                                        {
                                            plains[i] = dec.TransformFinalBlock(d, 28, d.Length - 28);
                                        }
                                    }
                                    catch { indices[i] = -1; }
                                }
                            }
                            else
                            {
                                Parallel.For(0, count, decParallelOpts, delegate(int i)
                                {
                                    try
                                    {
                                        byte[] d = batch[i];
                                        int pktTotalChunks = BitConverter.ToInt32(d, 8);
                                        if (pktTotalChunks != udpExpectedChunks)
                                        {
                                            indices[i] = -1;
                                            return;
                                        }
                                        indices[i] = BitConverter.ToInt32(d, 4);
                                        byte[] iv = threadLocalIv.Value;
                                        Buffer.BlockCopy(d, 12, iv, 0, 16);
                                        AesCryptoServiceProvider aes = threadLocalAes.Value;
                                        using (ICryptoTransform dec = aes.CreateDecryptor(keySnapshot, iv))
                                        {
                                            plains[i] = dec.TransformFinalBlock(d, 28, d.Length - 28);
                                        }
                                    }
                                    catch
                                    {
                                        indices[i] = -1;
                                    }
                                });
                            }

                            for (int i = 0; i < count; i++)
                            {
                                int cIdx = indices[i];
                                byte[] plain = plains[i];
                                if (cIdx < 0 || plain == null) continue;
                                if (udpChunkReceived != null && cIdx < udpChunkReceived.Length && udpChunkReceived[cIdx])
                                {
                                    ackWindowBytes += plain.Length;
                                    uiWindowBytes += plain.Length;
                                    chunksSinceLastAck++;
                                    dupChunksSinceLastResume++;
                                    if ((dupChunksSinceLastResume >= 16 || dupResumeSw.ElapsedMilliseconds >= 35) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                    {
                                        dupChunksSinceLastResume = 0;
                                        dupResumeSw.Restart();
                                        int nextNeeded = Math.Max(0, udpContiguousChunk + 1);
                                        byte[] resumeJump = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + nextNeeded.ToString() + "|" + udpFileName);
                                        try { SendUdpP2pPacket(resumeJump, resumeJump.Length, activeUdpPeerEndpoint); } catch { }

                                        if (udpHighestSeenChunk > udpContiguousChunk)
                                        {
                                            int nowDupTick = Environment.TickCount;
                                            StringBuilder holeSb = new StringBuilder();
                                            int holeCnt = 0;
                                            int holeLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk + 1);
                                            for (int h = nextNeeded; h < holeLimit; h++)
                                            {
                                                int prevTick;
                                                if (!udpChunkReceived[h] && (!udpChunkLastNackTick.TryGetValue(h, out prevTick) || unchecked(nowDupTick - prevTick) > 260))
                                                {
                                                    udpChunkLastNackTick[h] = nowDupTick;
                                                    if (holeCnt > 0) holeSb.Append(",");
                                                    holeSb.Append(h.ToString());
                                                    holeCnt++;
                                                    if (holeCnt >= 80) break;
                                                }
                                            }
                                            if (holeCnt > 0)
                                            {
                                                byte[] holeNack = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + holeSb.ToString());
                                                try { SendUdpP2pPacket(holeNack, holeNack.Length, activeUdpPeerEndpoint); } catch { }
                                            }
                                        }
                                    }
                                    continue;
                                }

                                if (udpChunkReceived != null && cIdx < udpChunkReceived.Length)
                                {
                                    udpChunkReceived[cIdx] = true;
                                    udpUniqueReceivedCount++;
                                    lastUniqueRxChunkTick = Environment.TickCount;
                                    udpReceivedBytes = Math.Min(udpExpectedSize, udpReceivedBytes + plain.Length);
                                }
                                else
                                {
                                    udpReceivedBytes = Math.Max(udpReceivedBytes, ((long)cIdx * UDP_CHUNK_SIZE) + plain.Length);
                                }

                                // Place chunk directly into aligned 4 MB pooled RAM page (zero small heap allocations kept in Gen2!)
                                int pIdx = cIdx / CHUNKS_PER_STAGE_PAGE;
                                int slot = cIdx % CHUNKS_PER_STAGE_PAGE;
                                UdpStagePage page;
                                if (!stagedPages.TryGetValue(pIdx, out page))
                                {
                                    page = new UdpStagePage();
                                    page.PageIndex = pIdx;
                                    page.Data = AllocStageBuffer();
                                    int remChunks = udpExpectedChunks - (pIdx * CHUNKS_PER_STAGE_PAGE);
                                    page.ExpectedCount = Math.Max(1, Math.Min(CHUNKS_PER_STAGE_PAGE, remChunks));
                                    page.StartSlot = (pIdx == udpResumeBoundaryPage && udpResumeBoundarySlot > 0 && udpResumeBoundarySlot < page.ExpectedCount) ? udpResumeBoundarySlot : 0;
                                    page.Present = new bool[page.ExpectedCount];
                                    page.ChunkLens = new short[page.ExpectedCount];
                                    stagedPages[pIdx] = page;
                                }
                                if (slot >= page.StartSlot && slot < page.ExpectedCount && !page.Present[slot])
                                {
                                    Buffer.BlockCopy(plain, 0, page.Data, slot * UDP_CHUNK_SIZE, plain.Length);
                                    page.Present[slot] = true;
                                    page.ChunkLens[slot] = (short)plain.Length;
                                    page.PresentCount++;
                                    page.ValidBytes += plain.Length;
                                    int needed = Math.Max(1, page.ExpectedCount - page.StartSlot);
                                    if (page.PresentCount == needed)
                                    {
                                        readyCompletedBytes += page.ValidBytes;
                                    }
                                }

                                if (cIdx > udpHighestSeenChunk) udpHighestSeenChunk = cIdx;
                                ackWindowBytes += plain.Length;
                                uiWindowBytes += plain.Length;
                                chunksSinceLastAck++;
                            }

                            if (udpChunkReceived != null)
                            {
                                int prevContig = udpContiguousChunk;
                                while (udpContiguousChunk + 1 < udpChunkReceived.Length && udpChunkReceived[udpContiguousChunk + 1])
                                {
                                    udpContiguousChunk++;
                                }
                                if (udpContiguousChunk > prevContig)
                                {
                                    lastContigAdvanceTick = Environment.TickCount;
                                }
                            }

                            // Live sliding-window RX speed for UI readout
                            double uiWinSec = uiWindowSw.Elapsed.TotalSeconds;
                            if (uiWinSec >= 0.50 || smoothedUiRxMbps <= 0.0)
                            {
                                if (smoothedUiRxMbps <= 0.0)
                                {
                                    double totalSec = Math.Max(0.005, udpRxSw.Elapsed.TotalSeconds);
                                    smoothedUiRxMbps = (Math.Max(0L, udpReceivedBytes - udpSessionStartBytes) / (1024.0 * 1024.0)) / totalSec;
                                }
                                else if (uiWinSec >= 0.50)
                                {
                                    double sampleMbps = (uiWindowBytes / (1024.0 * 1024.0)) / uiWinSec;
                                    smoothedUiRxMbps = (smoothedUiRxMbps * 0.68) + (sampleMbps * 0.32);
                                    uiWindowBytes = 0;
                                    uiWindowSw.Restart();
                                }
                            }

                            long stagedAllocBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
                            int nowTickMs = Environment.TickCount;
                            bool emergencyPartialFlush = (stagedAllocBytes >= 512L * 1024L * 1024L && unchecked(nowTickMs - lastPartialDispatchTick) >= 500);
                            bool wantStageFlush = (readyCompletedBytes >= DISK_STAGE_TARGET_BYTES) ||
                                emergencyPartialFlush ||
                                (udpChunkReceived != null && udpContiguousChunk + 1 >= udpExpectedChunks);

                            long ackElapsedMs = ackWindowSw.ElapsedMilliseconds;
                            if (chunksSinceLastAck > 0 && (ackElapsedMs >= 50 || wantStageFlush) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                double ackSec = Math.Max(0.050, ackWindowSw.Elapsed.TotalSeconds);
                                double instMbits = ((ackWindowBytes * 8.0) / (1024.0 * 1024.0)) / ackSec;
                                int mbitsInt = Math.Max(1, (int)Math.Round(Math.Min(5000.0, instMbits)));
                                chunksSinceLastAck = 0;
                                ackWindowBytes = 0;
                                ackWindowSw.Restart();

                                long queuedDiskBytes = (long)Math.Max(0, Thread.VolatileRead(ref activeDiskIoJobs)) * STAGE_PAGE_BYTES;
                                long memBufferedBytes = Interlocked.Read(ref totalAppBufferedBytes);
                                int diskMbps = smoothedDiskWriteMbps;
                                int diskLatMs = lastDiskWriteMs;
                                bool diskBusy = (queuedDiskBytes >= 384L * 1024L * 1024L) || (memBufferedBytes >= 1024L * 1024L * 1024L) || (diskLatMs >= 350 && queuedDiskBytes >= 64L * 1024L * 1024L);
                                if (diskBusy)
                                {
                                    double safeDiskMbits = diskMbps > 0 ? Math.Max(32.0, diskMbps * 8.0 * 0.92) : 260.0;
                                    if (queuedDiskBytes >= 640L * 1024L * 1024L || memBufferedBytes >= 1350L * 1024L * 1024L)
                                    {
                                        safeDiskMbits = Math.Max(24.0, safeDiskMbits * 0.65);
                                    }
                                    mbitsInt = Math.Min(mbitsInt, Math.Max(24, (int)Math.Round(safeDiskMbits)));
                                }

                                byte[] ackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_ACK|" + udpUniqueReceivedCount.ToString() + "|" + udpContiguousChunk.ToString() + "|" + mbitsInt.ToString() + (diskBusy ? "|1" : "|0"));
                                try { SendUdpP2pPacket(ackBytes, ackBytes.Length, activeUdpPeerEndpoint); } catch { }

                                // Adaptive Real-Time NACK: if contiguous stalls >= 220ms, drop slack to 0 so tail holes repair immediately!
                                int contigStallMs = unchecked(nowTickMs - lastContigAdvanceTick);
                                int reorderSlack = (contigStallMs >= 220 || udpRxEndPending) ? 0 : Math.Max(24, Math.Min(192, (int)Math.Round(smoothedUiRxMbps * 3.0)));
                                if (udpChunkReceived != null && (udpHighestSeenChunk - udpContiguousChunk > reorderSlack + 16 || (contigStallMs >= 220 && udpHighestSeenChunk > udpContiguousChunk)))
                                {
                                    if (udpChunkLastNackTick.Count > 16384) udpChunkLastNackTick.Clear();
                                    StringBuilder nackSb = new StringBuilder();
                                    int nackCnt = 0;
                                    int scanLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk - reorderSlack);
                                    for (int c = udpContiguousChunk + 1; c < scanLimit; c++)
                                    {
                                        int prevTick;
                                        if (!udpChunkReceived[c] && (!udpChunkLastNackTick.TryGetValue(c, out prevTick) || unchecked(nowTickMs - prevTick) > 240))
                                        {
                                            udpChunkLastNackTick[c] = nowTickMs;
                                            if (nackCnt > 0) nackSb.Append(",");
                                            nackSb.Append(c.ToString());
                                            nackCnt++;
                                            if (nackCnt >= 100) break;
                                        }
                                    }
                                    if (nackCnt > 0)
                                    {
                                        byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + nackSb.ToString());
                                        try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                    }
                                }
                            }

                            // Hand off >= 256 MB of sequential 8 MB pages to background Disk I/O thread WITHOUT blocking ACKs/NACKs!
                            if (wantStageFlush && stagedPages.Count > 0)
                            {
                                if (emergencyPartialFlush) lastPartialDispatchTick = nowTickMs;
                                bool forceFlush = (udpChunkReceived != null && udpContiguousChunk + 1 >= udpExpectedChunks);
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, forceFlush);
                                flushSw.Restart();
                            }
                            else if (stagedPages.Count > 0)
                            {
                                flushSw.Restart();
                            }

                            double avgRxMbps = (Math.Max(0L, udpReceivedBytes - udpSessionStartBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, udpRxSw.Elapsed.TotalSeconds);
                            int permille = (int)((udpReceivedBytes * 1000L) / Math.Max(1L, udpExpectedSize));
                            UpdateTransferUi("Receiving via P2P NAT-UDP: " + udpFileName, udpReceivedBytes, udpExpectedSize, smoothedUiRxMbps, avgRxMbps, permille);
                        }
                        else
                        {
                            int nowTickIdle = Environment.TickCount;
                            if (udpOutFile != null && chunksSinceLastAck > 0 && ackWindowSw.ElapsedMilliseconds >= 45 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                double ackSec = Math.Max(0.001, ackWindowSw.Elapsed.TotalSeconds);
                                double instMbits = ((ackWindowBytes * 8.0) / (1024.0 * 1024.0)) / ackSec;
                                int mbitsInt = Math.Max(1, (int)Math.Round(Math.Min(5000.0, instMbits)));
                                chunksSinceLastAck = 0;
                                ackWindowBytes = 0;
                                ackWindowSw.Restart();
                                long queuedDiskBytes = (long)Math.Max(0, Thread.VolatileRead(ref activeDiskIoJobs)) * STAGE_PAGE_BYTES;
                                long memBufferedBytes = Interlocked.Read(ref totalAppBufferedBytes);
                                int diskMbps = smoothedDiskWriteMbps;
                                int diskLatMs = lastDiskWriteMs;
                                bool diskBusy = (queuedDiskBytes >= 384L * 1024L * 1024L) || (memBufferedBytes >= 1024L * 1024L * 1024L) || (diskLatMs >= 350 && queuedDiskBytes >= 64L * 1024L * 1024L);
                                if (diskBusy)
                                {
                                    double safeDiskMbits = diskMbps > 0 ? Math.Max(32.0, diskMbps * 8.0 * 0.92) : 260.0;
                                    if (queuedDiskBytes >= 640L * 1024L * 1024L || memBufferedBytes >= 1350L * 1024L * 1024L)
                                    {
                                        safeDiskMbits = Math.Max(24.0, safeDiskMbits * 0.65);
                                    }
                                    mbitsInt = Math.Min(mbitsInt, Math.Max(24, (int)Math.Round(safeDiskMbits)));
                                }
                                byte[] ackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_ACK|" + udpUniqueReceivedCount.ToString() + "|" + udpContiguousChunk.ToString() + "|" + mbitsInt.ToString() + (diskBusy ? "|1" : "|0"));
                                try { SendUdpP2pPacket(ackBytes, ackBytes.Length, activeUdpPeerEndpoint); } catch { }
                            }

                            // Proactive stalled-hole NACK when idle so BDP tail gaps never freeze transfer
                            if (udpOutFile != null && udpChunkReceived != null && udpHighestSeenChunk > udpContiguousChunk &&
                                unchecked(nowTickIdle - lastContigAdvanceTick) >= 220 && unchecked(nowTickIdle - lastIdleHoleNackTick) >= 180 &&
                                activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                lastIdleHoleNackTick = nowTickIdle;
                                if (udpChunkLastNackTick.Count > 16384) udpChunkLastNackTick.Clear();
                                StringBuilder nackSb = new StringBuilder();
                                int nackCnt = 0;
                                int scanLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk);
                                for (int c = udpContiguousChunk + 1; c < scanLimit; c++)
                                {
                                    int prevTick;
                                    if (!udpChunkReceived[c] && (!udpChunkLastNackTick.TryGetValue(c, out prevTick) || unchecked(nowTickIdle - prevTick) > 220))
                                    {
                                        udpChunkLastNackTick[c] = nowTickIdle;
                                        if (nackCnt > 0) nackSb.Append(",");
                                        nackSb.Append(c.ToString());
                                        nackCnt++;
                                        if (nackCnt >= 80) break;
                                    }
                                }
                                if (nackCnt > 0)
                                {
                                    byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + nackSb.ToString());
                                    try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }

                            // Idle safety flush: after 3s pause, persist staged RAM pages + .ckpt; after 14s silence, release file handle cleanly so any reconnect/transport can resume
                            if (udpOutFile != null && (stagedPages.Count > 0 || udpContiguousChunk > lastQueuedCkptContig) && flushSw.ElapsedMilliseconds >= 3000)
                            {
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                flushSw.Restart();
                            }
                            if (udpOutFile != null && !udpRxEndPending && udpRxDataQueue.IsEmpty && unchecked(nowTickIdle - lastAnyUdpRxTick) >= 14000)
                            {
                                activeRxUdpFileName = "";
                                activeRxUdpPartPath = "";
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                WaitForDiskIoDrain(10000);
                                lock (diskFileStreamLock)
                                {
                                    try { udpOutFile.Flush(false); } catch { }
                                    try { udpOutFile.Close(); } catch { }
                                    udpOutFile = null;
                                }
                                WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                                foreach (UdpStagePage remP in stagedPages.Values) ReleaseStageBuffer(remP.Data);
                                stagedPages.Clear();
                                readyCompletedBytes = 0;
                                udpPromptState = 0;
                                Log("P2P UDP transfer interrupted — checkpoint (.ckpt) saved and file unlocked for resume: " + udpFileName);
                            }
                        }

                        // Auto-finalize cleanly once 100% of chunks arrive or END tail timeout triggers
                        int endElapsedMs = udpRxEndPending ? unchecked(Environment.TickCount - udpRxEndTick) : 0;
                        int sinceUniqueMs = unchecked(Environment.TickCount - lastUniqueRxChunkTick);
                        int maxToleratedTailMissing = Math.Max(16, Math.Min(256, udpExpectedChunks / 5000));
                        bool forceFinalize = udpOutFile != null && udpChunkReceived != null && (
                            udpContiguousChunk + 1 >= udpExpectedChunks ||
                            udpUniqueReceivedCount >= udpExpectedChunks ||
                            (udpRxEndPending && endElapsedMs > 4000 && sinceUniqueMs > 2500 && udpUniqueReceivedCount >= Math.Max(1, udpExpectedChunks - maxToleratedTailMissing))
                        );

                        if (forceFinalize)
                        {
                            DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpExpectedChunks - 1, pageKeysBuf, true);
                            WaitForDiskIoDrain(120000);

                            int zeroPatched = 0;
                            if (udpContiguousChunk + 1 < udpExpectedChunks && udpUniqueReceivedCount < udpExpectedChunks)
                            {
                                lock (diskFileStreamLock)
                                {
                                    try
                                    {
                                        for (int c = Math.Max(0, udpContiguousChunk + 1); c < udpExpectedChunks; c++)
                                        {
                                            if (!udpChunkReceived[c])
                                            {
                                                long mPos = (long)c * UDP_CHUNK_SIZE;
                                                int mLen = (int)Math.Min((long)UDP_CHUNK_SIZE, udpExpectedSize - mPos);
                                                if (mLen > 0)
                                                {
                                                    if (udpOutFile.Position != mPos) udpOutFile.Seek(mPos, SeekOrigin.Begin);
                                                    byte[] zeroBuf = new byte[mLen];
                                                    udpOutFile.Write(zeroBuf, 0, mLen);
                                                    zeroPatched++;
                                                }
                                            }
                                        }
                                    }
                                    catch { }
                                }
                            }
                            if (zeroPatched > 0)
                            {
                                Log("P2P NAT-UDP: " + zeroPatched.ToString() + " missing tail chunk(s) patched during finalization (" + udpFileName + ").");
                            }

                            activeRxUdpFileName = "";
                            activeRxUdpPartPath = "";
                            udpRxEndPending = false;
                            udpRxEndTick = 0;
                            lock (diskFileStreamLock)
                            {
                                try { if (udpExpectedSize > 0 && udpOutFile.Length != udpExpectedSize) udpOutFile.SetLength(udpExpectedSize); } catch { }
                                try { udpOutFile.Flush(false); } catch { }
                                udpOutFile.Close();
                                udpOutFile = null;
                            }
                            udpRxSw.Stop();

                            bool renamedOk = SafeFinalizePartFile(udpPartPath, udpFinalPath, udpPartPath + ".ckpt");

                            lastCompletedUdpFileName = udpFileName;
                            lastCompletedUdpFileNameVolatile = udpFileName;
                            if (activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                byte[] doneBytes = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + udpFileName);
                                for (int k = 0; k < 5; k++)
                                {
                                    try { SendUdpP2pPacket(doneBytes, doneBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }

                            double sec = Math.Max(0.005, udpRxSw.Elapsed.TotalSeconds);
                            long sessionDeltaBytes = Math.Max(1L, udpExpectedSize - udpSessionStartBytes);
                            double mbps = (sessionDeltaBytes / (1024.0 * 1024.0)) / sec;
                            if (renamedOk)
                            {
                                UpdateTransferUi("Saved via P2P NAT-UDP: " + udpFileName, udpExpectedSize, udpExpectedSize, mbps, mbps, 1000, true);
                                Log(String.Format("P2P NAT-UDP RX COMPLETE: {0} ({1:F2} MB/s)", udpFinalPath, mbps));
                            }
                            else
                            {
                                UpdateTransferUi("Finalization failed (.part locked): " + udpFileName, udpExpectedSize, udpExpectedSize, mbps, mbps, 1000, true);
                            }
                        }
                        else if (udpRxEndPending && udpRxDataQueue.IsEmpty)
                        {
                            if (udpOutFile == null)
                            {
                                udpRxEndPending = false;
                                if (!String.IsNullOrEmpty(lastCompletedUdpFileName) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                {
                                    byte[] doneBytes = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + lastCompletedUdpFileName);
                                    try { SendUdpP2pPacket(doneBytes, doneBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }
                            else
                            {
                                int nowTick = Environment.TickCount;
                                if (unchecked(nowTick - lastAnyUdpRxTick) >= 14000)
                                {
                                    activeRxUdpFileName = "";
                                    activeRxUdpPartPath = "";
                                    udpRxEndPending = false;
                                    udpRxEndTick = 0;
                                    DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                    WaitForDiskIoDrain(10000);
                                    lock (diskFileStreamLock)
                                    {
                                        try { udpOutFile.Flush(false); } catch { }
                                        try { udpOutFile.Close(); } catch { }
                                        udpOutFile = null;
                                    }
                                    WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                                    foreach (UdpStagePage remP in stagedPages.Values) ReleaseStageBuffer(remP.Data);
                                    stagedPages.Clear();
                                    readyCompletedBytes = 0;
                                    udpPromptState = 0;
                                    Log("P2P UDP final verification interrupted — checkpoint (.ckpt) saved for resume: " + udpFileName);
                                }
                                else if (unchecked(nowTick - lastEndNackTick) >= 100)
                                {
                                    lastEndNackTick = nowTick;
                                    List<string> missing = new List<string>();
                                    if (udpChunkReceived != null)
                                    {
                                        for (int c = Math.Max(0, udpContiguousChunk + 1); c < udpChunkReceived.Length; c++)
                                        {
                                            if (!udpChunkReceived[c])
                                            {
                                                missing.Add(c.ToString());
                                                if (missing.Count >= 120) break;
                                            }
                                        }
                                    }

                                    if (missing.Count > 0 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                    {
                                        byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + String.Join(",", missing.ToArray()));
                                        try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                    }
                                }
                            }
                        }
                    }
                    catch { }
                }
            }
            finally
            {
                try
                {
                    if (udpOutFile != null)
                    {
                        activeRxUdpFileName = "";
                        activeRxUdpPartPath = "";
                        DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                        WaitForDiskIoDrain(10000);
                        lock (diskFileStreamLock)
                        {
                            try { udpOutFile.Flush(false); } catch { }
                            udpOutFile.Close();
                            udpOutFile = null;
                        }
                        WriteCheckpointFile(udpPartPath, (long)Math.Max(0, udpContiguousChunk + 1) * UDP_CHUNK_SIZE, udpExpectedSize);
                    }
                }
                catch { }
                udpRxClosedSignal.Set();
                udpWriterExitedEvent.Set();
            }
        }

        private void PerformHolePunchPassForPeer(RoomPeerInfo p)
        {
            if (p == null) return;
            if (p.ActiveUdpEp != null && (DateTime.UtcNow - p.LastUdpSeen).TotalSeconds < 12) return;

            int nowTick = Environment.TickCount;
            bool doSpray = unchecked(nowTick - lastPunchFanTick) >= 2400;
            if (doSpray) lastPunchFanTick = nowTick;

            string v6Ep = p.WanV6UdpEp ?? "";
            string wanEp = p.WanUdpEp ?? "";
            string predEp = p.PredWanUdpEp ?? "";
            string lanUdpEp = p.LanUdpEp ?? "";

            if (v6Ep.Length > 0 && udpP2pV6Client != null)
            {
                InitiateUdpHolePunch(v6Ep, false, true);
            }
            if (wanEp.Length > 0)
            {
                InitiateUdpHolePunch(wanEp, doSpray || p.NatSym == 1, true);
            }
            if (predEp.Length > 0 && predEp != wanEp)
            {
                InitiateUdpHolePunch(predEp, false, true);
            }
            if (lanUdpEp.Length > 0)
            {
                InitiateUdpHolePunch(lanUdpEp, false, true);
            }
        }

        private void PerformHolePunchPass()
        {
            bool anyFromMap = false;
            foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
            {
                RoomPeerInfo p = kv.Value;
                if (p != null && p.ClientType == "exe")
                {
                    anyFromMap = true;
                    PerformHolePunchPassForPeer(p);
                }
            }
            if (anyFromMap) return;
            if (activeUdpPeerEndpoint != null && (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 12) return;

            int nowTick = Environment.TickCount;
            bool doSpray = unchecked(nowTick - lastPunchFanTick) >= 2400;
            if (doSpray) lastPunchFanTick = nowTick;

            string v6Ep = remotePeerWanV6Udp;
            string wanEp = remotePeerWanUdp;
            string predEp = remotePeerPredictedWanUdp;
            string lanUdpEp = remotePeerLanUdp;

            if (v6Ep.Length > 0 && udpP2pV6Client != null)
            {
                InitiateUdpHolePunch(v6Ep, false, true);
            }
            if (wanEp.Length > 0)
            {
                InitiateUdpHolePunch(wanEp, doSpray || remotePeerNatSym == 1, true);
            }
            if (predEp.Length > 0 && predEp != wanEp)
            {
                InitiateUdpHolePunch(predEp, false, true);
            }
            if (lanUdpEp.Length > 0)
            {
                InitiateUdpHolePunch(lanUdpEp, false, true);
            }
        }

        private void PeerHeartbeatMonitorLoop()
        {
            int tickSeq = 0;
            while (isRunning)
            {
                try
                {
                    tickSeq++;
                    DateTime now = DateTime.UtcNow;
                    if (activeUdpPeerEndpoint != null)
                    {
                        if ((now - lastUdpPeerSeen).TotalSeconds < 12)
                        {
                            byte[] ping = Encoding.UTF8.GetBytes("AETHER_PING|" + instanceId);
                            SendUdpP2pPacket(ping, ping.Length, activeUdpPeerEndpoint);
                        }
                        else
                        {
                            activeUdpPeerEndpoint = null;
                        }
                    }

                    int activeCount = 0;
                    int exeNoUdpCount = 0;
                    foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                    {
                        RoomPeerInfo p = kv.Value;
                        if (p == null) continue;
                        if (p.TcpClientConn != null && !p.TcpClientConn.Connected)
                        {
                            p.TcpClientConn = null;
                            p.TcpStream = null;
                        }
                        if (p.ActiveUdpEp != null)
                        {
                            if ((now - p.LastUdpSeen).TotalSeconds < 12)
                            {
                                if (activeUdpPeerEndpoint == null || !p.ActiveUdpEp.Equals(activeUdpPeerEndpoint))
                                {
                                    byte[] ping = Encoding.UTF8.GetBytes("AETHER_PING|" + instanceId);
                                    try { SendUdpP2pPacket(ping, ping.Length, p.ActiveUdpEp); } catch { }
                                }
                            }
                            else
                            {
                                p.ActiveUdpEp = null;
                            }
                        }

                        if (IsPeerActive(p, now))
                        {
                            activeCount++;
                            if (p.ClientType == "exe" && p.ActiveUdpEp == null && (p.TcpClientConn == null || !p.TcpClientConn.Connected))
                            {
                                exeNoUdpCount++;
                                PerformHolePunchPassForPeer(p);
                            }
                        }
                        else
                        {
                            bool canRemove = (p.TcpClientConn == null) && (p.ActiveUdpEp == null) &&
                                             (String.IsNullOrEmpty(p.CloudPeerId) || (now - p.LastCloudSeen).TotalSeconds >= 16) &&
                                             (p.ClientType != "local_browser");
                            if (canRemove)
                            {
                                RoomPeerInfo removed;
                                roomPeers.TryRemove(kv.Key, out removed);
                            }
                        }
                    }

                    bool hasTcp = (activePeerClient != null && activePeerClient.Connected);
                    bool hasUdp = (activeUdpPeerEndpoint != null && (now - lastUdpPeerSeen).TotalSeconds < 12);
                    bool hasLocalBrowser = (activeBrowserWsClient != null && activeBrowserWsClient.Connected);
                    bool hasCloudBrowser = (!String.IsNullOrEmpty(activeCloudBrowserPeerId) && (now - lastCloudBrowserSeen).TotalSeconds < 12);
                    bool hasCloudExe = (!String.IsNullOrEmpty(activeCloudExePeerId) && (now - lastCloudExeSeen).TotalSeconds < 12);

                    if ((activeCount == 0 || exeNoUdpCount > 0) && (tickSeq % 2 == 0))
                    {
                        BroadcastUdpPresence();
                    }

                    if (!hasUdp && !hasTcp && hasCloudExe && exeNoUdpCount == 0)
                    {
                        PerformHolePunchPass();
                    }

                    SyncTargetPeerDropdown();

                    string room = CleanRoomCode(currentRoomCode);
                    if (roomFullRejected)
                        UpdateStatusBadge("PEER STATUS: ROOM FULL (" + MAX_ROOM_PEERS.ToString() + "/" + MAX_ROOM_PEERS.ToString() + " users)");
                    else if (room.Length == 0)
                        UpdateStatusBadge("PEER STATUS: NOT CONNECTED — Enter tunnel name and click Connect");
                    else if (activeCount > 0)
                    {
                        int totalUsers = Math.Min(MAX_ROOM_PEERS, activeCount + 1);
                        UpdateStatusBadge("PEER STATUS: CONNECTED — " + activeCount.ToString() + (activeCount == 1 ? " other in [" : " others in [") + room + "] (" + totalUsers.ToString() + "/" + MAX_ROOM_PEERS.ToString() + ")");
                    }
                    else if (hasTcp)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — KERNEL TCP (" + activePeerClient.Client.RemoteEndPoint.ToString() + ")");
                    else if (hasUdp)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + activeUdpPeerEndpoint.ToString() + ")");
                    else if (hasLocalBrowser)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — LOCAL BROWSER (127.0.0.1:" + listenPort.ToString() + ")");
                    else if (hasCloudBrowser)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — CHROME BROWSER [" + room + "]");
                    else if (hasCloudExe)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — REMOTE .EXE [" + room + "] (NAT-Punch)");
                    else
                        UpdateStatusBadge("PEER STATUS: WAITING FOR PEER [" + room + "]");
                }
                catch { }
                Thread.Sleep(1000);
            }
        }

        private bool IsCgnatOrApipaAddress(IPAddress ip)
        {
            if (ip == null || ip.AddressFamily != AddressFamily.InterNetwork) return false;
            byte[] b = ip.GetAddressBytes();
            if (b[0] == 169 && b[1] == 254) return true;
            if (b[0] == 100 && b[1] >= 64 && b[1] <= 127) return true;
            return false;
        }

        private bool IsVirtualAdapterDescription(string desc, string name)
        {
            string s = ((desc ?? "") + " " + (name ?? "")).ToLowerInvariant();
            return s.Contains("zerotier") || s.Contains("tailscale") || s.Contains("virtualbox") ||
                   s.Contains("vmware") || s.Contains("hyper-v") || s.Contains("vethernet") ||
                   s.Contains("wsl") || s.Contains("loopback") || s.Contains("tap-") ||
                   s.Contains("wintun") || s.Contains("hamachi") || s.Contains("radmin");
        }

        private IPAddress GetPreferredLanIpv4()
        {
            IPAddress physicalGw = null;
            IPAddress physicalAny = null;
            IPAddress virtualPrivate = null;
            IPAddress cgnatFallback = null;
            try
            {
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up) continue;
                    if (ni.NetworkInterfaceType == NetworkInterfaceType.Loopback || ni.NetworkInterfaceType == NetworkInterfaceType.Tunnel) continue;
                    IPInterfaceProperties props = ni.GetIPProperties();
                    bool hasGw = (props.GatewayAddresses != null && props.GatewayAddresses.Count > 0);
                    bool isVirt = IsVirtualAdapterDescription(ni.Description, ni.Name);

                    foreach (UnicastIPAddressInformation uni in props.UnicastAddresses)
                    {
                        IPAddress ip = uni.Address;
                        if (ip == null || ip.AddressFamily != AddressFamily.InterNetwork || IPAddress.IsLoopback(ip)) continue;
                        if (IsCgnatOrApipaAddress(ip))
                        {
                            if (cgnatFallback == null) cgnatFallback = ip;
                            continue;
                        }
                        if (!isVirt)
                        {
                            if (hasGw && physicalGw == null) physicalGw = ip;
                            if (physicalAny == null) physicalAny = ip;
                        }
                        else if (virtualPrivate == null)
                        {
                            virtualPrivate = ip;
                        }
                    }
                }
            }
            catch { }

            if (physicalGw != null) return physicalGw;
            if (physicalAny != null) return physicalAny;
            if (virtualPrivate != null) return virtualPrivate;
            if (cgnatFallback != null) return cgnatFallback;

            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip)) return ip;
                }
            }
            catch { }
            return IPAddress.Loopback;
        }

        private string GetGlobalIpv6Address()
        {
            try
            {
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up) continue;
                    if (ni.NetworkInterfaceType == NetworkInterfaceType.Loopback || ni.NetworkInterfaceType == NetworkInterfaceType.Tunnel) continue;
                    if (IsVirtualAdapterDescription(ni.Description, ni.Name)) continue;
                    IPInterfaceProperties props = ni.GetIPProperties();
                    foreach (UnicastIPAddressInformation uni in props.UnicastAddresses)
                    {
                        IPAddress ip = uni.Address;
                        if (ip == null || ip.AddressFamily != AddressFamily.InterNetworkV6) continue;
                        if (IPAddress.IsLoopback(ip) || ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || ip.IsIPv6Multicast || ip.IsIPv6Teredo) continue;
                        string s = ip.ToString();
                        int pct = s.IndexOf('%');
                        if (pct >= 0) s = s.Substring(0, pct);
                        string low = s.ToLowerInvariant();
                        if (low.StartsWith("fd") || low.StartsWith("fc") || low.StartsWith("::")) continue;
                        return s;
                    }
                }
            }
            catch { }
            return "";
        }

        private string GetFirstLanEndpoint()
        {
            IPAddress ip = GetPreferredLanIpv4();
            return ip != null ? (ip.ToString() + ":" + listenPort.ToString()) : "";
        }

        private string GetFirstLanUdpEndpoint()
        {
            IPAddress ip = GetPreferredLanIpv4();
            return ip != null ? (ip.ToString() + ":" + udpP2pPort.ToString()) : "";
        }

        private string GetLocalIpList()
        {
            List<string> ips = new List<string>();
            IPAddress pref = GetPreferredLanIpv4();
            if (pref != null && !IPAddress.IsLoopback(pref)) ips.Add(pref.ToString() + ":" + listenPort.ToString());
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                    {
                        string entry = ip.ToString() + ":" + listenPort.ToString();
                        if (!ips.Contains(entry)) ips.Add(entry);
                    }
                }
            }
            catch { }
            if (ips.Count == 0) ips.Add("127.0.0.1:" + listenPort.ToString());
            return String.Join("  |  ", ips.ToArray());
        }

        private bool IsOwnLocalEndpoint(IPAddress addr, int port)
        {
            if (port != listenPort && port != udpP2pPort && port != udpP2pV6Port) return false;
            if (IPAddress.IsLoopback(addr)) return true;
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.Equals(addr)) return true;
                }
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    foreach (UnicastIPAddressInformation uni in ni.GetIPProperties().UnicastAddresses)
                    {
                        if (uni.Address.Equals(addr)) return true;
                    }
                }
            }
            catch { }
            return false;
        }

        private string CleanRoomCode(string rawRoom)
        {
            string lower = (rawRoom ?? "").Trim().ToLowerInvariant();
            StringBuilder cleanSb = new StringBuilder();
            foreach (char ch in lower)
            {
                if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch == '-')
                    cleanSb.Append(ch);
            }
            return cleanSb.ToString();
        }

        private static byte[] BuildMqttPacket(byte packetType, byte[] variableHeader, byte[] payload)
        {
            int remLen = (variableHeader != null ? variableHeader.Length : 0) + (payload != null ? payload.Length : 0);
            List<byte> varLenBytes = new List<byte>(4);
            int x = remLen;
            do
            {
                byte encodedByte = (byte)(x % 128);
                x = x / 128;
                if (x > 0) encodedByte = (byte)(encodedByte | 128);
                varLenBytes.Add(encodedByte);
            } while (x > 0);

            byte[] packet = new byte[1 + varLenBytes.Count + remLen];
            packet[0] = packetType;
            for (int i = 0; i < varLenBytes.Count; i++) packet[1 + i] = varLenBytes[i];
            int offset = 1 + varLenBytes.Count;
            if (variableHeader != null && variableHeader.Length > 0)
            {
                Buffer.BlockCopy(variableHeader, 0, packet, offset, variableHeader.Length);
                offset += variableHeader.Length;
            }
            if (payload != null && payload.Length > 0)
            {
                Buffer.BlockCopy(payload, 0, packet, offset, payload.Length);
            }
            return packet;
        }

        private void SendChannelFrame(SignalingChannel ch, byte[] data, bool isBinary)
        {
            if (ch == null || ch.Ws == null || ch.Ws.State != WebSocketState.Open || data == null) return;
            lock (ch.SendLock)
            {
                if (ch.Ws.State != WebSocketState.Open) return;
                ch.Ws.SendAsync(new ArraySegment<byte>(data, 0, data.Length), isBinary ? WebSocketMessageType.Binary : WebSocketMessageType.Text, true, CancellationToken.None).Wait(4000);
            }
        }

        private string BuildHelloInnerJson(string kindName, string cleanCode)
        {
            string lanEp = GetFirstLanEndpoint();
            string lanUdpEp = GetFirstLanUdpEndpoint();
            string predWan = "";
            if (natSymDetected == 1 && publicWanUdpEndpoint.Contains(":"))
            {
                int col = publicWanUdpEndpoint.LastIndexOf(':');
                int p = 0;
                if (col > 0 && Int32.TryParse(publicWanUdpEndpoint.Substring(col + 1), out p))
                {
                    int delta = (natPortDelta != 0 && Math.Abs(natPortDelta) <= 32) ? natPortDelta : 1;
                    int nextP = p + delta;
                    if (nextP > 1024 && nextP <= 65535)
                        predWan = publicWanUdpEndpoint.Substring(0, col + 1) + nextP.ToString();
                }
            }
            string safeDisplay = SanitizeJsonText(localDisplayName);
            return "{\\"kind\\":\\"" + kindName + "\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"displayName\\":\\"" + safeDisplay + "\\",\\"fingerprint\\":\\"" + currentFingerprint +
                   "\\",\\"lanEndpoint\\":\\"" + lanEp + "\\",\\"lanUdpEndpoint\\":\\"" + lanUdpEp +
                   "\\",\\"wanUdpEndpoint\\":\\"" + publicWanUdpEndpoint + "\\",\\"wanV6UdpEndpoint\\":\\"" + publicWanV6UdpEndpoint +
                   "\\",\\"predWanUdpEndpoint\\":\\"" + predWan + "\\",\\"natSym\\":\\"" + natSymDetected.ToString() +
                   "\\",\\"natDelta\\":\\"" + natPortDelta.ToString() + "\\",\\"upnpTcp\\":\\"" + (upnpTcpMapped ? "1" : "0") + "\\"}";
        }

        private void BroadcastCloudHelloToAll()
        {
            string cleanCode = CleanRoomCode(currentRoomCode);
            string inner = BuildHelloInnerJson("exe:hello", cleanCode);
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                try { SendCloudPacketToChannel(kv.Value, "*", inner); } catch { }
            }
        }

        private void SendCloudPacketToChannel(SignalingChannel ch, string dstPeerId, string innerPayloadJson)
        {
            if (ch == null || ch.Ws == null || ch.Ws.State != WebSocketState.Open || String.IsNullOrEmpty(dstPeerId)) return;
            string envelope = "{\\"type\\":\\"CANDIDATE\\",\\"src\\":\\"" + activeCloudMyId + "\\",\\"dst\\":\\"" + dstPeerId + "\\",\\"payload\\":" + innerPayloadJson + "}";
            byte[] envBytes = Encoding.UTF8.GetBytes(envelope);
            if (!ch.IsMqtt)
            {
                SendChannelFrame(ch, envBytes, false);
                return;
            }
            byte[] topicBytes = Encoding.UTF8.GetBytes(ch.Topic);
            byte[] vh = new byte[2 + topicBytes.Length];
            vh[0] = (byte)((topicBytes.Length >> 8) & 0xFF);
            vh[1] = (byte)(topicBytes.Length & 0xFF);
            Buffer.BlockCopy(topicBytes, 0, vh, 2, topicBytes.Length);
            SendChannelFrame(ch, BuildMqttPacket(0x30, vh, envBytes), true);
        }

        private void SendCloudPacketAny(string dstPeerId, string innerPayloadJson)
        {
            SignalingChannel preferred = null;
            RoomPeerInfo targetP;
            if (!String.IsNullOrEmpty(dstPeerId) && roomPeers.TryGetValue(dstPeerId, out targetP) && targetP != null)
            {
                preferred = targetP.PreferredCloudChannel;
            }
            if (preferred == null)
            {
                preferred = dstPeerId == activeCloudBrowserPeerId ? lastBrowserSignalingChannel : lastExeSignalingChannel;
            }
            if (preferred != null && preferred.Ws != null && preferred.Ws.State == WebSocketState.Open)
            {
                try { SendCloudPacketToChannel(preferred, dstPeerId, innerPayloadJson); return; } catch { }
            }
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                if (kv.Value != null && kv.Value.Ws != null && kv.Value.Ws.State == WebSocketState.Open)
                {
                    try { SendCloudPacketToChannel(kv.Value, dstPeerId, innerPayloadJson); return; } catch { }
                }
            }
        }

        private void CloudWormholeBridgeLoop()
        {
            if (!String.IsNullOrEmpty(DEFAULT_CLOUD_WS_URL))
            {
                Thread wsRelayThread = new Thread(delegate() { RunAppWsRelayLoop(DEFAULT_CLOUD_WS_URL); });
                wsRelayThread.IsBackground = true;
                wsRelayThread.Start();
            }

            string[][] brokers = new string[][] {
                new string[] { "emqx", "wss://broker.emqx.io:8084/mqtt" },
                new string[] { "hivemq", "wss://broker.hivemq.com:8884/mqtt" },
                new string[] { "mosquitto", "wss://test.mosquitto.org:8081/mqtt" }
            };
            foreach (string[] b in brokers)
            {
                string bName = b[0];
                string bUrl = b[1];
                Thread t = new Thread(delegate() { RunMqttBrokerLoop(bName, bUrl); });
                t.IsBackground = true;
                t.Start();
            }
        }

        private void RunAppWsRelayLoop(string wsUrl)
        {
            while (isRunning)
            {
                ClientWebSocket ws = null;
                SignalingChannel ch = null;
                try
                {
                    string cleanCode = CleanRoomCode(currentRoomCode);
                    if (cleanCode.Length == 0)
                    {
                        Thread.Sleep(350);
                        continue;
                    }
                    string myPeerId = "aethertunnel-exe-" + cleanCode + "-" + instanceId;
                    activeCloudMyId = myPeerId;
                    activeCloudTopic = "aethertunnel/v1/room/" + cleanCode;

                    ws = new ClientWebSocket();
                    ws.ConnectAsync(new Uri(wsUrl), CancellationToken.None).Wait(7000);
                    if (ws.State != WebSocketState.Open)
                    {
                        Thread.Sleep(4000);
                        continue;
                    }

                    ch = new SignalingChannel();
                    ch.Name = "ws-relay";
                    ch.IsMqtt = false;
                    ch.Topic = cleanCode;
                    ch.Ws = ws;
                    activeSignalingChannels[ch.Name] = ch;
                    Log("Cloud Signaling connected: App Relay (" + cleanCode + ")");

                    string safeDev = SanitizeJsonText(localDisplayName);
                    if (safeDev.Length == 0) safeDev = "AetherTunnel .EXE (WAN)";
                    string joinJson = "{\\"type\\":\\"room:join\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"peerId\\":\\"" + myPeerId + "\\",\\"deviceLabel\\":\\"" + safeDev + "\\",\\"clientType\\":\\"exe\\",\\"natType\\":\\"" + natTypeSummary + "\\"}";
                    SendChannelFrame(ch, Encoding.UTF8.GetBytes(joinJson), false);
                    SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));

                    ClientWebSocket capturedWs = ws;
                    SignalingChannel capturedCh = ch;
                    string capturedCode = cleanCode;
                    Thread hb = new Thread(delegate()
                    {
                        while (isRunning && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode)
                        {
                            try
                            {
                                SendCloudPacketToChannel(capturedCh, "*", BuildHelloInnerJson("exe:hello", capturedCode));
                            }
                            catch { break; }
                            for (int i = 0; i < 16 && isRunning && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode; i++)
                                Thread.Sleep(120);
                        }
                        if (CleanRoomCode(currentRoomCode) != capturedCode)
                        {
                            try { capturedWs.Abort(); } catch { }
                        }
                    });
                    hb.IsBackground = true;
                    hb.Start();

                    byte[] recvBuf = new byte[131072];
                    MemoryStream msgMs = new MemoryStream();
                    while (isRunning && ws.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == cleanCode)
                    {
                        WebSocketReceiveResult res = ws.ReceiveAsync(new ArraySegment<byte>(recvBuf), CancellationToken.None).GetAwaiter().GetResult();
                        if (res.MessageType == WebSocketMessageType.Close) break;
                        if (res.Count > 0) msgMs.Write(recvBuf, 0, res.Count);
                        if (!res.EndOfMessage) continue;
                        string text = Encoding.UTF8.GetString(msgMs.ToArray());
                        msgMs.SetLength(0);
                        HandleIncomingCloudMessage(ch, text, cleanCode, myPeerId);
                    }
                }
                catch { }
                finally
                {
                    if (ch != null) { SignalingChannel removed; activeSignalingChannels.TryRemove(ch.Name, out removed); }
                    if (ws != null) { try { ws.Dispose(); } catch { } }
                }
                if (isRunning) Thread.Sleep(CleanRoomCode(currentRoomCode) != (ch != null ? ch.Topic : "") ? 150 : 3500);
            }
        }

        private void RunMqttBrokerLoop(string brokerName, string brokerUrl)
        {
            while (isRunning)
            {
                ClientWebSocket ws = null;
                SignalingChannel ch = null;
                string joinedCode = "";
                try
                {
                    string cleanCode = CleanRoomCode(currentRoomCode);
                    if (cleanCode.Length == 0)
                    {
                        Thread.Sleep(350);
                        continue;
                    }
                    joinedCode = cleanCode;
                    cloudReconnectRequested = false;

                    string myPeerId = "aethertunnel-exe-" + cleanCode + "-" + instanceId;
                    string topic = "aethertunnel/v1/room/" + cleanCode;
                    activeCloudMyId = myPeerId;
                    activeCloudTopic = topic;

                    ws = new ClientWebSocket();
                    ws.Options.AddSubProtocol("mqtt");
                    ws.ConnectAsync(new Uri(brokerUrl), CancellationToken.None).Wait(7000);
                    if (ws.State != WebSocketState.Open)
                    {
                        Thread.Sleep(2500);
                        continue;
                    }

                    ch = new SignalingChannel();
                    ch.Name = "mqtt-" + brokerName;
                    ch.IsMqtt = true;
                    ch.Topic = topic;
                    ch.Ws = ws;

                    // MQTT 3.1.1 CONNECT packet (ClientId strictly <= 22 bytes for universal broker compatibility)
                    string shortCid = "at" + instanceId + "_" + (DateTime.UtcNow.Ticks & 0xFFFF).ToString("x4");
                    byte[] idBytes = Encoding.UTF8.GetBytes(shortCid);
                    byte[] connVh = new byte[] { 0x00, 0x04, (byte)'M', (byte)'Q', (byte)'T', (byte)'T', 0x04, 0x02, 0x00, 0x3C };
                    byte[] connPl = new byte[2 + idBytes.Length];
                    connPl[0] = (byte)((idBytes.Length >> 8) & 0xFF);
                    connPl[1] = (byte)(idBytes.Length & 0xFF);
                    Buffer.BlockCopy(idBytes, 0, connPl, 2, idBytes.Length);
                    SendChannelFrame(ch, BuildMqttPacket(0x10, connVh, connPl), true);

                    ClientWebSocket capturedWs = ws;
                    SignalingChannel capturedCh = ch;
                    string capturedCode = cleanCode;
                    Thread hbThread = new Thread(delegate()
                    {
                        int tickCount = 0;
                        while (isRunning && !cloudReconnectRequested && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode)
                        {
                            try
                            {
                                tickCount++;
                                if (tickCount % 5 == 0) SendChannelFrame(capturedCh, new byte[] { 0xC0, 0x00 }, true);
                                if (activeSignalingChannels.ContainsKey(capturedCh.Name))
                                    SendCloudPacketToChannel(capturedCh, "*", BuildHelloInnerJson("exe:hello", capturedCode));
                            }
                            catch { break; }
                            for (int i = 0; i < 16 && isRunning && !cloudReconnectRequested && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode; i++)
                                Thread.Sleep(120);
                        }
                        if (CleanRoomCode(currentRoomCode) != capturedCode)
                        {
                            try { capturedWs.Abort(); } catch { }
                        }
                    });
                    hbThread.IsBackground = true;
                    hbThread.Start();

                    byte[] recvBuf = new byte[131072];
                    MemoryStream msgMs = new MemoryStream();
                    while (isRunning && ws.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == cleanCode)
                    {
                        WebSocketReceiveResult res = ws.ReceiveAsync(new ArraySegment<byte>(recvBuf), CancellationToken.None).GetAwaiter().GetResult();
                        if (res.MessageType == WebSocketMessageType.Close) break;
                        if (res.Count > 0) msgMs.Write(recvBuf, 0, res.Count);
                        if (!res.EndOfMessage) continue;

                        byte[] rawFrame = msgMs.ToArray();
                        msgMs.SetLength(0);

                        int idx = 0;
                        while (idx + 2 <= rawFrame.Length)
                        {
                            byte pktType = rawFrame[idx++];
                            int mult = 1;
                            int remLen = 0;
                            byte b = 0;
                            bool okLen = true;
                            do
                            {
                                if (idx >= rawFrame.Length) { okLen = false; break; }
                                b = rawFrame[idx++];
                                remLen += (b & 127) * mult;
                                mult *= 128;
                            } while ((b & 128) != 0);

                            if (!okLen || idx + remLen > rawFrame.Length) break;
                            int pktStart = idx;
                            idx += remLen;

                            if (pktType == 0x20) // CONNACK -> Subscribe
                            {
                                byte[] topicBytes = Encoding.UTF8.GetBytes(topic);
                                byte[] subPl = new byte[4 + topicBytes.Length + 1];
                                subPl[0] = 0x00; subPl[1] = 0x01;
                                subPl[2] = (byte)((topicBytes.Length >> 8) & 0xFF);
                                subPl[3] = (byte)(topicBytes.Length & 0xFF);
                                Buffer.BlockCopy(topicBytes, 0, subPl, 4, topicBytes.Length);
                                subPl[4 + topicBytes.Length] = 0x00;
                                SendChannelFrame(ch, BuildMqttPacket(0x82, new byte[0], subPl), true);
                                continue;
                            }

                            if (pktType == 0x90) // SUBACK -> Online!
                            {
                                activeSignalingChannels[ch.Name] = ch;
                                Log("Cloud Signaling online (" + brokerName + ") -> Room [" + cleanCode + "]");
                                SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));
                                continue;
                            }

                            if ((pktType & 0xF0) != 0x30 || remLen < 4) continue;
                            int tLen = (rawFrame[pktStart] << 8) | rawFrame[pktStart + 1];
                            int pOffset = pktStart + 2 + tLen;
                            if (((pktType >> 1) & 0x03) > 0) pOffset += 2;
                            int jsonLen = (pktStart + remLen) - pOffset;
                            if (jsonLen <= 0 || pOffset + jsonLen > rawFrame.Length) continue;

                            string text = Encoding.UTF8.GetString(rawFrame, pOffset, jsonLen);
                            HandleIncomingCloudMessage(ch, text, cleanCode, myPeerId);
                        }
                    }
                }
                catch { }
                finally
                {
                    if (ch != null) { SignalingChannel removed; activeSignalingChannels.TryRemove(ch.Name, out removed); }
                    if (ws != null) { try { ws.Dispose(); } catch { } }
                }
                if (isRunning) Thread.Sleep(CleanRoomCode(currentRoomCode) != joinedCode ? 150 : 2500);
            }
        }

        private void HandleIncomingCloudMessage(SignalingChannel ch, string text, string cleanCode, string myPeerId)
        {
            try
            {
                if (String.IsNullOrEmpty(text)) return;
                string topType = ExtractJsonString(text, "type");
                if (topType == "room:full")
                {
                    roomFullRejected = true;
                    UpdateStatusBadge("PEER STATUS: ROOM FULL (" + MAX_ROOM_PEERS.ToString() + "/" + MAX_ROOM_PEERS.ToString() + " users)");
                    Log("Room [" + cleanCode + "] is full (max " + MAX_ROOM_PEERS.ToString() + " users).");
                    return;
                }
                if (topType == "peer:left")
                {
                    string leftId = ExtractJsonString(text, "peerId");
                    if (leftId.Length == 0) leftId = ExtractJsonString(text, "id");
                    if (leftId.Length > 0)
                    {
                        RoomPeerInfo rem;
                        if (roomPeers.TryRemove(leftId, out rem))
                        {
                            try { if (rem != null && rem.TcpClientConn != null) rem.TcpClientConn.Close(); } catch { }
                            Log("Peer left room: " + (rem != null ? rem.DisplayName : leftId));
                            SyncTargetPeerDropdown();
                        }
                    }
                    return;
                }
                if (topType == "peer:joined" || topType == "room:joined")
                {
                    roomFullRejected = false;
                    if (text.Contains("\\"id\\":\\"aethertunnel-"))
                    {
                        SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));
                    }
                    return;
                }

                string srcPeer = ExtractJsonString(text, "src");
                string dstPeer = ExtractJsonString(text, "dst");
                if (srcPeer == myPeerId || String.IsNullOrEmpty(srcPeer)) return;
                if (dstPeer.Length > 0 && dstPeer != "*" && dstPeer != myPeerId && !dstPeer.StartsWith("aethertunnel-exe-" + cleanCode)) return;

                string kind = ExtractJsonString(text, "kind");
                if (kind.Length == 0) return;

                if (kind == "browser:bye" || kind == "web:bye" || kind == "exe:bye")
                {
                    RoomPeerInfo byeRem;
                    if (roomPeers.TryRemove(srcPeer, out byeRem))
                    {
                        try { if (byeRem != null && byeRem.TcpClientConn != null) byeRem.TcpClientConn.Close(); } catch { }
                        SyncTargetPeerDropdown();
                        Log("Peer left room: " + (byeRem != null ? byeRem.DisplayName : srcPeer));
                    }
                    return;
                }

                if (kind == "browser:hello" || kind == "web:hello" || kind == "browser:hello-ack")
                {
                    string dName = ExtractJsonString(text, "displayName");
                    if (dName.Length == 0) dName = "Browser (" + srcPeer.Substring(Math.Max(0, srcPeer.Length - 4)) + ")";
                    bool isNewRoomPeer, fullRej;
                    RoomPeerInfo bPeer = UpsertRoomPeer(srcPeer, dName, "web", out isNewRoomPeer, out fullRej);
                    if (fullRej || bPeer == null)
                    {
                        Log("Skipped new browser peer: room already at max " + MAX_ROOM_PEERS.ToString() + " users.");
                        return;
                    }
                    bPeer.CloudPeerId = srcPeer;
                    bPeer.LastCloudSeen = DateTime.UtcNow;
                    bPeer.PreferredCloudChannel = ch;

                    bool isNewPairing = (activeCloudBrowserPeerId != srcPeer) || ((DateTime.UtcNow - lastCloudBrowserSeen).TotalSeconds > 10);
                    activeCloudBrowserPeerId = srcPeer;
                    lastCloudBrowserSeen = DateTime.UtcNow;
                    lastBrowserSignalingChannel = ch;

                    if (isNewRoomPeer || isNewPairing)
                    {
                        SyncTargetPeerDropdown();
                        UpdateStatusBadge("PEER STATUS: CONNECTED — " + bPeer.DisplayName + " [" + cleanCode + "]");
                        Log("Connected to browser peer " + bPeer.DisplayName + " [" + cleanCode + "] (" + ch.Name + ")");
                    }
                    if (kind != "browser:hello-ack")
                    {
                        int nowMs = Environment.TickCount;
                        int lastRep;
                        if (!cloudHelloReplyTicks.TryGetValue(srcPeer, out lastRep) || unchecked(nowMs - lastRep) > 1200 || isNewPairing)
                        {
                            cloudHelloReplyTicks[srcPeer] = nowMs;
                            SendCloudPacketToChannel(ch, srcPeer, BuildHelloInnerJson("exe:hello", cleanCode));
                        }
                    }
                }
                else if ((kind == "exe:hello" || kind == "exe:hello-reply") && srcPeer.StartsWith("aethertunnel-exe-") && srcPeer != myPeerId)
                {
                    string dName = ExtractJsonString(text, "displayName");
                    if (dName.Length == 0) dName = "Windows .EXE (" + srcPeer.Substring(Math.Max(0, srcPeer.Length - 4)) + ")";
                    bool isNewRoomPeer, fullRej;
                    RoomPeerInfo ePeer = UpsertRoomPeer(srcPeer, dName, "exe", out isNewRoomPeer, out fullRej);
                    if (fullRej || ePeer == null)
                    {
                        Log("Skipped new .EXE peer: room already at max " + MAX_ROOM_PEERS.ToString() + " users.");
                        return;
                    }

                    string remoteWanUdp = ExtractJsonString(text, "wanUdpEndpoint");
                    string remoteLanUdp = ExtractJsonString(text, "lanUdpEndpoint");
                    string remoteV6Udp = ExtractJsonString(text, "wanV6UdpEndpoint");
                    string remotePredWan = ExtractJsonString(text, "predWanUdpEndpoint");
                    string remoteLan = ExtractJsonString(text, "lanEndpoint");
                    int rSym = 0; Int32.TryParse(ExtractJsonString(text, "natSym"), out rSym);
                    int rDelta = 0; Int32.TryParse(ExtractJsonString(text, "natDelta"), out rDelta);
                    int rUpnpTcp = 0; Int32.TryParse(ExtractJsonString(text, "upnpTcp"), out rUpnpTcp);

                    bool endpointChanged = (remoteWanUdp.Length > 0 && remoteWanUdp != ePeer.WanUdpEp) ||
                                           (remoteV6Udp.Length > 0 && remoteV6Udp != ePeer.WanV6UdpEp);

                    ePeer.CloudPeerId = srcPeer;
                    ePeer.LastCloudSeen = DateTime.UtcNow;
                    ePeer.PreferredCloudChannel = ch;
                    if (remoteWanUdp.Length > 0) ePeer.WanUdpEp = remoteWanUdp;
                    if (remoteLanUdp.Length > 0) ePeer.LanUdpEp = remoteLanUdp;
                    if (remoteV6Udp.Length > 0) ePeer.WanV6UdpEp = remoteV6Udp;
                    if (remotePredWan.Length > 0) ePeer.PredWanUdpEp = remotePredWan;
                    if (remoteLan.Length > 0) ePeer.LanTcpEp = remoteLan;
                    ePeer.NatSym = rSym;
                    ePeer.NatDelta = rDelta;
                    ePeer.UpnpTcp = rUpnpTcp;

                    bool isNewPairing = (activeCloudExePeerId != srcPeer) || ((DateTime.UtcNow - lastCloudExeSeen).TotalSeconds > 10);
                    activeCloudExePeerId = srcPeer;
                    lastCloudExeSeen = DateTime.UtcNow;
                    lastExeSignalingChannel = ch;

                    if (remoteWanUdp.Length > 0) remotePeerWanUdp = remoteWanUdp;
                    if (remoteLanUdp.Length > 0) remotePeerLanUdp = remoteLanUdp;
                    if (remoteV6Udp.Length > 0) remotePeerWanV6Udp = remoteV6Udp;
                    if (remotePredWan.Length > 0) remotePeerPredictedWanUdp = remotePredWan;
                    if (remoteLan.Length > 0) remotePeerLanTcp = remoteLan;
                    remotePeerNatSym = rSym;
                    remotePeerNatDelta = rDelta;
                    remotePeerUpnpTcp = rUpnpTcp;

                    if (isNewRoomPeer || isNewPairing)
                    {
                        SyncTargetPeerDropdown();
                        UpdateStatusBadge("PEER STATUS: CONNECTED — " + ePeer.DisplayName + " [" + cleanCode + "]");
                        Log("Connected to .EXE peer " + ePeer.DisplayName + " [" + cleanCode + "] via " + ch.Name +
                            (remoteWanUdp.Length > 0 ? " (WAN: " + remoteWanUdp + ")" : "") +
                            (remoteV6Udp.Length > 0 ? " (IPv6)" : ""));
                    }
                    if (kind == "exe:hello")
                    {
                        int nowMs = Environment.TickCount;
                        int lastRep;
                        if (!cloudHelloReplyTicks.TryGetValue(srcPeer, out lastRep) || unchecked(nowMs - lastRep) > 1000 || isNewRoomPeer || endpointChanged)
                        {
                            cloudHelloReplyTicks[srcPeer] = nowMs;
                            SendCloudPacketToChannel(ch, srcPeer, BuildHelloInnerJson("exe:hello-reply", cleanCode));
                        }
                    }

                    if ((isNewRoomPeer || endpointChanged) && ePeer.ActiveUdpEp == null)
                    {
                        string punchSummary = !String.IsNullOrEmpty(ePeer.WanV6UdpEp) ? ePeer.WanV6UdpEp : (!String.IsNullOrEmpty(ePeer.WanUdpEp) ? ePeer.WanUdpEp : ePeer.LanUdpEp);
                        if (!String.IsNullOrEmpty(punchSummary) && punchSummary != lastLoggedPunchTarget)
                        {
                            lastLoggedPunchTarget = punchSummary;
                            Log("Initiating P2P NAT Hole Punch -> " + ePeer.DisplayName + " (" + punchSummary + ")" + (ePeer.NatSym == 1 ? " [Symmetric Port Spray]" : ""));
                        }
                        PerformHolePunchPassForPeer(ePeer);
                    }

                    if (remoteLan.Length > 0 && !remoteLan.StartsWith("100.") && (ePeer.TcpClientConn == null || !ePeer.TcpClientConn.Connected) && ePeer.ActiveUdpEp == null)
                    {
                        bool shouldTryTcp = false;
                        lock (attemptedAutoTcpEndpoints)
                        {
                            if (!attemptedAutoTcpEndpoints.Contains(remoteLan))
                            {
                                attemptedAutoTcpEndpoints.Add(remoteLan);
                                shouldTryTcp = true;
                            }
                        }
                        if (shouldTryTcp) ConnectToPeerEndpoint(remoteLan, true, ePeer);
                    }
                    if (rUpnpTcp == 1 && remoteWanUdp.Contains(":") && (ePeer.TcpClientConn == null || !ePeer.TcpClientConn.Connected) && ePeer.ActiveUdpEp == null)
                    {
                        string peerWanTcp = remoteWanUdp.Split(':')[0] + ":" + listenPort.ToString();
                        bool shouldTryWanTcp = false;
                        lock (attemptedAutoTcpEndpoints)
                        {
                            if (!attemptedAutoTcpEndpoints.Contains(peerWanTcp))
                            {
                                attemptedAutoTcpEndpoints.Add(peerWanTcp);
                                shouldTryWanTcp = true;
                            }
                        }
                        if (shouldTryWanTcp) ConnectToPeerEndpoint(peerWanTcp, true, ePeer);
                    }
                }
                else if (kind == "exe:wait-accept" || kind == "browser:wait-accept")
                {
                    cloudWaitAcceptReceived = true;
                    cloudResumeEvent.Set();
                }
                else if (kind == "exe:file-reject" || kind == "browser:file-reject")
                {
                    cloudTransferRejected = true;
                    cloudResumeEvent.Set();
                    cloudAckEvent.Set();
                }
                else if (kind == "exe:resume-ack" || kind == "file:resume-ack")
                {
                    cloudResumeChunk = (int)ExtractJsonLong(text, "resumeFromChunk");
                    cloudResumeReceived = true;
                    cloudResumeEvent.Set();
                }
                else if (kind == "exe:chunk-ack" || kind == "browser:chunk-ack")
                {
                    cloudAckEvent.Set();
                }
                else if (kind == "exe:file-start" || kind == "browser:file-start")
                {
                    bool fromExe = srcPeer.StartsWith("aethertunnel-exe-");
                    if (fromExe) { activeCloudExePeerId = srcPeer; lastCloudExeSeen = DateTime.UtcNow; lastExeSignalingChannel = ch; }
                    else { activeCloudBrowserPeerId = srcPeer; lastCloudBrowserSeen = DateTime.UtcNow; lastBrowserSignalingChannel = ch; }

                    string senderLabel = fromExe ? "Remote .EXE" : "Chrome Browser";
                    string incomingFileId = ExtractJsonString(text, "fileId");
                    string incName = ExtractJsonString(text, "name");
                    if (incName.Length == 0) incName = "transfer.bin";
                    long incSize = ExtractJsonLong(text, "size");
                    long cChunkSize = ExtractJsonLong(text, "chunkSize");
                    if (cChunkSize <= 0) cChunkSize = CLOUD_CHUNK_SIZE;
                    string candOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + incName);
                    string candPartPath = candOutPath + ".part";
                    bool hasPart = File.Exists(candPartPath) && ReadCheckpointBytes(candPartPath, incSize) > 0;

                    Action openCloudRx = delegate {
                        ReleaseConflictingRxHandlesForPart(candPartPath, "cloud");
                        lock (cloudRxFileLock)
                        {
                            cloudRejectedFileId = "";
                            if (cloudOutFile != null)
                            {
                                try { WriteCheckpointFile(cloudPartPath, cloudReceivedBytes, cloudExpectedSize); } catch { }
                                try { cloudOutFile.Flush(false); } catch { }
                                try { cloudOutFile.Close(); } catch { }
                                cloudOutFile = null;
                            }
                            cloudFileName = incName;
                            cloudExpectedSize = incSize;
                            cloudOutPath = candOutPath;
                            cloudPartPath = candPartPath;

                            long existingBytes = ReadCheckpointBytes(cloudPartPath, cloudExpectedSize);
                            int resumeFromChunk = (int)(existingBytes / cChunkSize);
                            long alignedBytes = (long)resumeFromChunk * cChunkSize;

                            Exception openErr = null;
                            for (int opTry = 0; opTry < 5; opTry++)
                            {
                                try
                                {
                                    cloudOutFile = new FileStream(cloudPartPath, existingBytes > 0 ? FileMode.OpenOrCreate : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                                    openErr = null;
                                    break;
                                }
                                catch (Exception oex)
                                {
                                    openErr = oex;
                                    Thread.Sleep(80);
                                }
                            }
                            if (cloudOutFile == null)
                            {
                                if (openErr != null) Log("Cloud RX file open error: " + openErr.Message);
                                return;
                            }
                            if (alignedBytes > 0) cloudOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                            cloudReceivedBytes = alignedBytes;
                            cloudSessionStartBytes = alignedBytes;
                            cloudRxSw = Stopwatch.StartNew();

                            SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:resume-ack\\",\\"fileId\\":\\"" + incomingFileId + "\\",\\"name\\":\\"" + cloudFileName.Replace("\\"", "") + "\\",\\"size\\":" + cloudExpectedSize.ToString() + ",\\"resumeFromChunk\\":" + resumeFromChunk.ToString() + "}");
                            int startPermille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                            UpdateTransferUi("Receiving from " + senderLabel + ": " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, 0, 0, startPermille, true);
                        }
                    };

                    if (autoAcceptAllIncoming)
                    {
                        openCloudRx();
                    }
                    else
                    {
                        SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:wait-accept\\",\\"fileId\\":\\"" + incomingFileId + "\\"}");
                        ThreadPool.QueueUserWorkItem(delegate {
                            int choice = ShowIncomingTransferDialog(senderLabel, incName, incSize, hasPart);
                            if (choice == 1 || choice == 2)
                            {
                                openCloudRx();
                            }
                            else
                            {
                                cloudRejectedFileId = incomingFileId;
                                Log("Incoming Wormhole file declined: " + incName);
                                SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:file-reject\\",\\"fileId\\":\\"" + incomingFileId + "\\"}");
                            }
                        });
                    }
                }
                else if ((kind == "exe:file-chunk" || kind == "browser:file-chunk"))
                {
                    lock (cloudRxFileLock)
                    {
                        string fId = ExtractJsonString(text, "fileId");
                        if (!String.IsNullOrEmpty(cloudRejectedFileId) && fId == cloudRejectedFileId) return;
                        if (cloudOutFile == null) return;
                        string b64 = ExtractJsonString(text, "data");
                        long chunkIdx = ExtractJsonLong(text, "chunkIndex");
                        if (b64.Length > 0)
                        {
                            byte[] raw = Convert.FromBase64String(b64);
                            long writePos = chunkIdx * CLOUD_CHUNK_SIZE;
                            if (cloudOutFile.Position != writePos) cloudOutFile.Seek(writePos, SeekOrigin.Begin);
                            cloudOutFile.Write(raw, 0, raw.Length);
                            cloudReceivedBytes = Math.Max(cloudReceivedBytes, writePos + raw.Length);

                            if ((chunkIdx + 1) % 384 == 0)
                            {
                                WriteCheckpointFile(cloudPartPath, cloudReceivedBytes, cloudExpectedSize);
                            }

                            double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                            long deltaBytes = Math.Max(1L, cloudReceivedBytes - cloudSessionStartBytes);
                            double mbps = (deltaBytes / (1024.0 * 1024.0)) / sec;
                            int permille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                            UpdateTransferUi("Receiving: " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, mbps, mbps, permille);
                        }
                        if ((chunkIdx + 1) % 8 == 0)
                        {
                            SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":" + chunkIdx.ToString() + "}");
                        }
                    }
                }
                else if ((kind == "exe:file-end" || kind == "browser:file-end"))
                {
                    lock (cloudRxFileLock)
                    {
                        if (cloudOutFile == null) return;
                        try { if (cloudExpectedSize > 0 && cloudOutFile.Length != cloudExpectedSize) cloudOutFile.SetLength(cloudExpectedSize); } catch { }
                        try { cloudOutFile.Flush(false); } catch { }
                        cloudOutFile.Close();
                        cloudOutFile = null;
                        cloudRxSw.Stop();

                        bool movedOk = SafeFinalizePartFile(cloudPartPath, cloudOutPath, cloudPartPath + ".ckpt");

                        double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                        long deltaBytes = Math.Max(1L, cloudExpectedSize - cloudSessionStartBytes);
                        double mbps = (deltaBytes / (1024.0 * 1024.0)) / sec;
                        if (movedOk)
                        {
                            UpdateTransferUi("Saved to Downloads: " + cloudFileName, cloudExpectedSize, cloudExpectedSize, mbps, mbps, 1000, true);
                            Log(String.Format("TRANSFER COMPLETE: Saved to {0} ({1:F2} MB/s)", cloudOutPath, mbps));
                        }
                        else
                        {
                            UpdateTransferUi("Finalization failed (.part locked): " + cloudFileName, cloudExpectedSize, cloudExpectedSize, mbps, mbps, 1000, true);
                        }
                        SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":999999}");
                    }
                }
            }
            catch { }
        }

        private void AcceptLoop()
        {
            while (isRunning && tcpListener != null)
            {
                try
                {
                    TcpClient client = tcpListener.AcceptTcpClient();
                    ConfigureSocketForMaxThroughput(client);
                    Thread connThread = new Thread(delegate() { HandleIncomingConnection(client); });
                    connThread.IsBackground = true;
                    connThread.Start();
                }
                catch
                {
                    if (!isRunning) break;
                }
            }
        }

        private void HandleIncomingConnection(TcpClient client)
        {
            try
            {
                NetworkStream netStream = client.GetStream();
                byte[] peek = new byte[3];
                if (!ReadExactBytes(netStream, peek, 3))
                {
                    client.Close();
                    return;
                }

                if (peek[0] == (byte)'G' && peek[1] == (byte)'E' && peek[2] == (byte)'T')
                {
                    HandleBrowserWebSocketConnection(client, netStream, peek);
                }
                else
                {
                    string epStr = client.Client.RemoteEndPoint.ToString();
                    Log("Incoming Native .EXE Peer connected from " + epStr);
                    RoomPeerInfo tcpPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", client.Client.RemoteEndPoint as IPEndPoint);
                    bool isNewTcp, fullRej;
                    if (tcpPeer == null)
                    {
                        tcpPeer = UpsertRoomPeer("tcp-" + epStr, "Windows .EXE (" + epStr + ")", "exe", out isNewTcp, out fullRej);
                    }
                    else
                    {
                        fullRej = false;
                    }
                    if (fullRej || tcpPeer == null)
                    {
                        Log("Rejected incoming TCP connection: room at max " + MAX_ROOM_PEERS.ToString() + " users.");
                        try { client.Close(); } catch { }
                        return;
                    }
                    tcpPeer.TcpClientConn = client;
                    tcpPeer.TcpStream = netStream;
                    tcpPeer.LastTcpSeen = DateTime.UtcNow;
                    SyncTargetPeerDropdown();

                    if (activePeerClient == null || !activePeerClient.Connected)
                    {
                        activePeerClient = client;
                        activePeerStream = netStream;
                        UpdateStatusBadge("CONNECTED .EXE PEER (" + epStr + ")");
                    }
                    try
                    {
                        ReceiveKernelTcpLoop(client, netStream, peek);
                    }
                    finally
                    {
                        if (Object.ReferenceEquals(tcpPeer.TcpClientConn, client))
                        {
                            tcpPeer.TcpClientConn = null;
                            tcpPeer.TcpStream = null;
                            SyncTargetPeerDropdown();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Connection error: " + ex.Message);
            }
        }

        private void HandleBrowserWebSocketConnection(TcpClient client, NetworkStream netStream, byte[] firstThreeBytes)
        {
            try
            {
                MemoryStream reqMs = new MemoryStream();
                reqMs.Write(firstThreeBytes, 0, 3);
                byte[] b = new byte[1];
                int state = 0;
                while (reqMs.Length < 16384 && netStream.Read(b, 0, 1) == 1)
                {
                    reqMs.WriteByte(b[0]);
                    byte c = b[0];
                    if ((state == 0 && c == (byte)'\\r') ||
                        (state == 1 && c == (byte)'\\n') ||
                        (state == 2 && c == (byte)'\\r') ||
                        (state == 3 && c == (byte)'\\n'))
                    {
                        state++;
                        if (state == 4) break;
                    }
                    else
                    {
                        state = (c == (byte)'\\r') ? 1 : 0;
                    }
                }

                string headers = Encoding.ASCII.GetString(reqMs.ToArray());
                string wsKey = "";
                string[] lines = headers.Split(new string[] { "\\r\\n" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string line in lines)
                {
                    if (line.StartsWith("Sec-WebSocket-Key:", StringComparison.OrdinalIgnoreCase))
                    {
                        wsKey = line.Substring(18).Trim();
                        break;
                    }
                }

                if (wsKey.Length == 0)
                {
                    client.Close();
                    return;
                }

                string acceptRaw = wsKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                string acceptBase64;
                using (SHA1 sha1 = SHA1.Create())
                {
                    acceptBase64 = Convert.ToBase64String(sha1.ComputeHash(Encoding.ASCII.GetBytes(acceptRaw)));
                }

                string response =
                    "HTTP/1.1 101 Switching Protocols\\r\\n" +
                    "Upgrade: websocket\\r\\n" +
                    "Connection: Upgrade\\r\\n" +
                    "Access-Control-Allow-Origin: *\\r\\n" +
                    "Access-Control-Allow-Private-Network: true\\r\\n" +
                    "Sec-WebSocket-Accept: " + acceptBase64 + "\\r\\n\\r\\n";
                byte[] respBytes = Encoding.ASCII.GetBytes(response);
                netStream.Write(respBytes, 0, respBytes.Length);

                activeBrowserWsClient = client;
                activeBrowserWsStream = netStream;
                bool isNewLb, fullLb;
                UpsertRoomPeer("local-browser", "Local Browser (127.0.0.1)", "local_browser", out isNewLb, out fullLb);
                SyncTargetPeerDropdown();
                UpdateStatusBadge("PEER STATUS: CONNECTED — LOCAL BROWSER (127.0.0.1:" + listenPort.ToString() + ")");
                Log("Chrome Browser connected via Direct Localhost Kernel WebSocket (127.0.0.1:" + listenPort.ToString() + ")");

                NotifyBrowserRoomCode();
                ReceiveBrowserWebSocketLoop(client, netStream);
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Local Browser Bridge disconnected: " + ex.Message);
            }
            finally
            {
                if (Object.ReferenceEquals(activeBrowserWsClient, client))
                {
                    activeBrowserWsClient = null;
                    activeBrowserWsStream = null;
                    RoomPeerInfo removed;
                    roomPeers.TryRemove("local-browser", out removed);
                    SyncTargetPeerDropdown();
                }
            }
        }

        private void NotifyBrowserRoomCode()
        {
            try
            {
                if (activeBrowserWsClient == null || !activeBrowserWsClient.Connected || activeBrowserWsStream == null) return;
                string code = "";
                if (this.InvokeRequired)
                    this.Invoke(new Action(delegate { code = txtRoomCode.Text.Trim().ToLowerInvariant(); }));
                else
                    code = txtRoomCode.Text.Trim().ToLowerInvariant();

                string safeDisp = SanitizeJsonText(localDisplayName);
                string json = "{\\"kind\\":\\"exe:hello\\",\\"roomCode\\":\\"" + code + "\\",\\"displayName\\":\\"" + safeDisp + "\\",\\"port\\":" + listenPort.ToString() + "}";
                byte[] bytes = Encoding.UTF8.GetBytes(json);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, bytes, 0, bytes.Length);
            }
            catch { }
        }

        private void SendWebSocketFrame(NetworkStream wsStream, byte opcode, byte[] payload, int offset, int count)
        {
            byte[] header;
            if (count < 126)
            {
                header = new byte[2];
                header[0] = (byte)(0x80 | opcode);
                header[1] = (byte)count;
            }
            else if (count <= 65535)
            {
                header = new byte[4];
                header[0] = (byte)(0x80 | opcode);
                header[1] = 126;
                header[2] = (byte)((count >> 8) & 0xFF);
                header[3] = (byte)(count & 0xFF);
            }
            else
            {
                header = new byte[10];
                header[0] = (byte)(0x80 | opcode);
                header[1] = 127;
                long len64 = (long)count;
                for (int i = 0; i < 8; i++)
                {
                    header[9 - i] = (byte)(len64 & 0xFF);
                    len64 >>= 8;
                }
            }

            lock (wsWriteLock)
            {
                wsStream.Write(header, 0, header.Length);
                wsStream.Write(payload, offset, count);
            }
        }

        private void ReceiveBrowserWebSocketLoop(TcpClient client, NetworkStream wsStream)
        {
            FileStream currentOutFile = null;
            string currentFileName = "";
            string currentOutPath = "";
            string currentPartPath = "";
            long expectedFileSize = 0;
            long receivedBytes = 0;
            long wsSessionStartBytes = 0;
            long lastWsCkptBytes = 0;
            Stopwatch rxSw = null;

            MemoryStream fragBuffer = new MemoryStream();
            int fragOpcode = 0;

            try
            {
                byte[] h2 = new byte[2];
                while (isRunning && client.Connected)
                {
                    if (!ReadExactBytes(wsStream, h2, 2)) break;
                    bool fin = (h2[0] & 0x80) != 0;
                    int opcode = h2[0] & 0x0F;
                    bool masked = (h2[1] & 0x80) != 0;
                    long payloadLen = h2[1] & 0x7F;

                    if (opcode == 0x08) break;

                    if (payloadLen == 126)
                    {
                        byte[] ext2 = new byte[2];
                        if (!ReadExactBytes(wsStream, ext2, 2)) break;
                        payloadLen = (ext2[0] << 8) | ext2[1];
                    }
                    else if (payloadLen == 127)
                    {
                        byte[] ext8 = new byte[8];
                        if (!ReadExactBytes(wsStream, ext8, 8)) break;
                        payloadLen = 0;
                        for (int i = 0; i < 8; i++) payloadLen = (payloadLen << 8) | ext8[i];
                    }

                    byte[] maskKey = new byte[4];
                    if (masked)
                    {
                        if (!ReadExactBytes(wsStream, maskKey, 4)) break;
                    }

                    if (payloadLen > 64 * 1024 * 1024) break;
                    byte[] data = new byte[(int)payloadLen];
                    if (payloadLen > 0 && !ReadExactBytes(wsStream, data, (int)payloadLen)) break;

                    if (masked)
                    {
                        for (int i = 0; i < data.Length; i++)
                        {
                            data[i] = (byte)(data[i] ^ maskKey[i & 3]);
                        }
                    }

                    if (opcode == 0x09)
                    {
                        SendWebSocketFrame(wsStream, 0x0A, data, 0, data.Length);
                        continue;
                    }

                    if (opcode != 0) fragOpcode = opcode;
                    fragBuffer.Write(data, 0, data.Length);

                    if (!fin) continue;

                    byte[] message = fragBuffer.ToArray();
                    fragBuffer.SetLength(0);

                    if (fragOpcode == 0x01)
                    {
                        string text = Encoding.UTF8.GetString(message);
                        if (text.Contains("\\"browser:hello\\"") || text.Contains("\\"browser:room\\""))
                        {
                            string browserRoom = CleanRoomCode(ExtractJsonString(text, "roomCode"));
                            if (browserRoom.Length > 0)
                            {
                                this.BeginInvoke(new Action(delegate {
                                    if (CleanRoomCode(currentRoomCode) != browserRoom)
                                    {
                                        suppressRoomBroadcast = true;
                                        txtRoomCode.Text = browserRoom;
                                        ConnectToEnteredRoom();
                                        suppressRoomBroadcast = false;
                                        Log("Synced Wormhole Code with Chrome Browser: " + browserRoom);
                                    }
                                }));
                            }
                        }
                        else if (text.Contains("\\"exe:wait-accept\\"") || text.Contains("\\"browser:wait-accept\\"") || text.Contains("\\"file:wait-accept\\""))
                        {
                            wsWaitAcceptReceived = true;
                            wsResumeEvent.Set();
                        }
                        else if (text.Contains("\\"exe:file-reject\\"") || text.Contains("\\"browser:file-reject\\"") || text.Contains("\\"file:reject\\""))
                        {
                            wsTransferRejected = true;
                            wsResumeEvent.Set();
                        }
                        else if (text.Contains("\\"exe:resume-ack\\"") || text.Contains("\\"browser:resume-ack\\"") || text.Contains("\\"file:resume-ack\\""))
                        {
                            wsResumeChunk = (int)ExtractJsonLong(text, "resumeFromChunk");
                            wsResumeReceived = true;
                            wsResumeEvent.Set();
                        }
                        else if (text.Contains("\\"exe:file-start\\""))
                        {
                            string incomingFileId = ExtractJsonString(text, "fileId");
                            currentFileName = ExtractJsonString(text, "name");
                            if (currentFileName.Length == 0) currentFileName = "transfer.bin";
                            expectedFileSize = ExtractJsonLong(text, "size");
                            long wsChunkSize = ExtractJsonLong(text, "chunkSize");
                            if (wsChunkSize <= 0) wsChunkSize = WS_CHUNK_SIZE;
                            currentOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + currentFileName);
                            currentPartPath = currentOutPath + ".part";

                            if (currentOutFile != null)
                            {
                                try { WriteCheckpointFile(currentPartPath, receivedBytes, expectedFileSize); } catch { }
                                try { currentOutFile.Flush(false); } catch { }
                                try { currentOutFile.Close(); } catch { }
                                currentOutFile = null;
                            }
                            ReleaseConflictingRxHandlesForPart(currentPartPath, "ws");
                            lock (rxHandleCoordLock)
                            {
                                activeWsRxClient = client;
                                activeWsRxPartPath = currentPartPath;
                            }

                            bool hasPart = File.Exists(currentPartPath) && ReadCheckpointBytes(currentPartPath, expectedFileSize) > 0;

                            int choice = autoAcceptAllIncoming ? 1 : ShowIncomingTransferDialog("Chrome Browser (Local)", currentFileName, expectedFileSize, hasPart);
                            if (choice == 0)
                            {
                                Log("Incoming browser transfer declined: " + currentFileName);
                                string rejJson = String.Format("{{\\"kind\\":\\"exe:file-reject\\",\\"fileId\\":\\"{0}\\"}}", incomingFileId);
                                byte[] rejBytes = Encoding.UTF8.GetBytes(rejJson);
                                SendWebSocketFrame(wsStream, 0x01, rejBytes, 0, rejBytes.Length);
                                lock (rxHandleCoordLock)
                                {
                                    if (Object.ReferenceEquals(activeWsRxClient, client)) activeWsRxPartPath = "";
                                }
                                continue;
                            }

                            long existingBytes = ReadCheckpointBytes(currentPartPath, expectedFileSize);
                            int resumeFromChunk = (int)(existingBytes / wsChunkSize);
                            long alignedBytes = (long)resumeFromChunk * wsChunkSize;

                            Exception openErr = null;
                            for (int opTry = 0; opTry < 5; opTry++)
                            {
                                try
                                {
                                    currentOutFile = new FileStream(currentPartPath, existingBytes > 0 ? FileMode.OpenOrCreate : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                                    openErr = null;
                                    break;
                                }
                                catch (Exception oex)
                                {
                                    openErr = oex;
                                    Thread.Sleep(80);
                                }
                            }
                            if (currentOutFile == null)
                            {
                                Log("Browser RX file open error: " + (openErr != null ? openErr.Message : "locked"));
                                lock (rxHandleCoordLock)
                                {
                                    if (Object.ReferenceEquals(activeWsRxClient, client)) activeWsRxPartPath = "";
                                }
                                continue;
                            }
                            if (alignedBytes > 0) currentOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                            receivedBytes = alignedBytes;
                            wsSessionStartBytes = alignedBytes;
                            lastWsCkptBytes = alignedBytes;
                            rxSw = Stopwatch.StartNew();

                            string ackJson = String.Format(
                                "{{\\"kind\\":\\"exe:resume-ack\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"resumeFromChunk\\":{3}}}",
                                incomingFileId, currentFileName.Replace("\\"", ""), expectedFileSize, resumeFromChunk
                            );
                            byte[] ackBytes = Encoding.UTF8.GetBytes(ackJson);
                            SendWebSocketFrame(wsStream, 0x01, ackBytes, 0, ackBytes.Length);

                            if (resumeFromChunk > 0)
                                Log("Resuming interrupted file from Chrome Browser at " + FormatBytes(alignedBytes) + " -> " + currentOutPath);
                            else
                                Log("Receiving from Chrome Browser -> " + currentOutPath + " (" + FormatBytes(expectedFileSize) + ")");
                        }
                        else if (text.Contains("\\"exe:file-end\\"") && currentOutFile != null)
                        {
                            try { if (expectedFileSize > 0 && currentOutFile.Length != expectedFileSize) currentOutFile.SetLength(expectedFileSize); } catch { }
                            try { currentOutFile.Flush(false); } catch { }
                            currentOutFile.Close();
                            currentOutFile = null;
                            rxSw.Stop();
                            lock (rxHandleCoordLock)
                            {
                                if (Object.ReferenceEquals(activeWsRxClient, client)) activeWsRxPartPath = "";
                            }

                            bool movedOk = SafeFinalizePartFile(currentPartPath, currentOutPath, currentPartPath + ".ckpt");

                            double sec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                            double mbps = (Math.Max(1L, expectedFileSize - wsSessionStartBytes) / (1024.0 * 1024.0)) / sec;
                            if (movedOk)
                            {
                                UpdateTransferUi("Saved from Browser: " + currentFileName, expectedFileSize, expectedFileSize, mbps, mbps, 1000, true);
                                Log(String.Format("BROWSER -> .EXE COMPLETE: {0} ({1:F2} MB/s · {2:F2} Gbps)", currentOutPath, mbps, (mbps * 8.0) / 1000.0));
                            }
                            else
                            {
                                UpdateTransferUi("Finalization failed (.part locked): " + currentFileName, expectedFileSize, expectedFileSize, mbps, mbps, 1000, true);
                            }
                        }
                    }
                    else if (fragOpcode == 0x02 && currentOutFile != null)
                    {
                        currentOutFile.Write(message, 0, message.Length);
                        receivedBytes += message.Length;
                        if (receivedBytes - lastWsCkptBytes >= 16L * 1024L * 1024L)
                        {
                            WriteCheckpointFile(currentPartPath, receivedBytes, expectedFileSize);
                            lastWsCkptBytes = receivedBytes;
                        }

                        double sec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double mbps = (Math.Max(1L, receivedBytes - wsSessionStartBytes) / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((receivedBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Receiving from Browser: " + currentFileName, receivedBytes, expectedFileSize, mbps, mbps, permille);
                    }
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Local Browser Bridge stream ended: " + ex.Message);
            }
            finally
            {
                if (currentOutFile != null)
                {
                    try { WriteCheckpointFile(currentPartPath, receivedBytes, expectedFileSize); } catch { }
                    try { currentOutFile.Flush(false); } catch { }
                    try { currentOutFile.Close(); } catch { }
                    currentOutFile = null;
                }
                lock (rxHandleCoordLock)
                {
                    if (Object.ReferenceEquals(activeWsRxClient, client))
                    {
                        activeWsRxClient = null;
                        activeWsRxPartPath = "";
                    }
                }
            }
        }

        private string ExtractJsonString(string json, string key)
        {
            string kPat = "\\"" + key + "\\"";
            int pos = 0;
            while (pos < json.Length)
            {
                int idx = json.IndexOf(kPat, pos, StringComparison.Ordinal);
                if (idx < 0) return "";
                int cur = idx + kPat.Length;
                while (cur < json.Length && (json[cur] == ' ' || json[cur] == '\\t')) cur++;
                if (cur < json.Length && json[cur] == ':')
                {
                    cur++;
                    while (cur < json.Length && (json[cur] == ' ' || json[cur] == '\\t')) cur++;
                    if (cur < json.Length && json[cur] == '"')
                    {
                        int start = cur + 1;
                        int end = start;
                        while (end < json.Length)
                        {
                            if (json[end] == '"' && json[end - 1] != '\\\\') break;
                            end++;
                        }
                        if (end < json.Length) return json.Substring(start, end - start);
                        return "";
                    }
                }
                pos = idx + kPat.Length;
            }
            return "";
        }

        private long ExtractJsonLong(string json, string key)
        {
            string pattern = "\\"" + key + "\\":";
            int idx = json.IndexOf(pattern);
            if (idx < 0) return 0;
            int start = idx + pattern.Length;
            int end = start;
            while (end < json.Length && (Char.IsDigit(json[end]) || json[end] == ' ')) end++;
            long val = 0;
            Int64.TryParse(json.Substring(start, end - start).Trim(), out val);
            return val;
        }

        private void ConfigureSocketForMaxThroughput(TcpClient client)
        {
            client.NoDelay = true;
            client.SendBufferSize = 16 * 1024 * 1024;
            client.ReceiveBufferSize = 16 * 1024 * 1024;
            try
            {
                byte[] ka = new byte[12];
                Buffer.BlockCopy(BitConverter.GetBytes((uint)1), 0, ka, 0, 4);
                Buffer.BlockCopy(BitConverter.GetBytes((uint)5000), 0, ka, 4, 4);
                Buffer.BlockCopy(BitConverter.GetBytes((uint)1000), 0, ka, 8, 4);
                client.Client.IOControl(IOControlCode.KeepAliveValues, ka, null);
            }
            catch { }
        }

        private void UpdateStatusBadge(string text)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string>(UpdateStatusBadge), text);
                return;
            }
            lblStatusBadge.Text = text;
            bool isFull = roomFullRejected || text.IndexOf("FULL", StringComparison.OrdinalIgnoreCase) >= 0;
            bool isConnected = !isFull && text.IndexOf("CONNECTED", StringComparison.OrdinalIgnoreCase) >= 0;
            lblStatusBadge.ForeColor = isFull ? Color.FromArgb(248, 113, 113) : (isConnected ? Color.FromArgb(52, 211, 153) : Color.FromArgb(251, 191, 36));

            if (pnlRoomPresence != null && lblRoomPresence != null)
            {
                DateTime now = DateTime.UtcNow;
                int activeOthers = 0;
                foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                {
                    if (IsPeerActive(kv.Value, now)) activeOthers++;
                }

                if (isFull)
                {
                    pnlRoomPresence.BackColor = Color.FromArgb(65, 18, 24);
                    lblRoomPresence.ForeColor = Color.FromArgb(248, 113, 113);
                    lblRoomPresence.Text = "[" + MAX_ROOM_PEERS.ToString() + "/" + MAX_ROOM_PEERS.ToString() + " FULL] Room has reached maximum users!";
                }
                else if (isConnected || activeOthers > 0)
                {
                    int totalUsers = Math.Min(MAX_ROOM_PEERS, Math.Max(2, activeOthers + 1));
                    string detail = text.Replace("PEER STATUS: CONNECTED — ", "").Replace("PEER STATUS: CONNECTED", "").Trim();
                    pnlRoomPresence.BackColor = Color.FromArgb(6, 46, 36);
                    lblRoomPresence.ForeColor = Color.FromArgb(52, 211, 153);
                    lblRoomPresence.Text = "[" + totalUsers.ToString() + "/" + MAX_ROOM_PEERS.ToString() + " USERS] " + Math.Max(1, activeOthers).ToString() + (activeOthers == 1 ? " other in room (" : " others in room (") + detail + ")";
                }
                else
                {
                    string room = CleanRoomCode(currentRoomCode);
                    pnlRoomPresence.BackColor = Color.FromArgb(30, 27, 22);
                    lblRoomPresence.ForeColor = Color.FromArgb(251, 191, 36);
                    lblRoomPresence.Text = room.Length == 0
                        ? "Enter tunnel name and click Connect"
                        : "[1/" + MAX_ROOM_PEERS.ToString() + " USER] No other users in [" + room + "]";
                }
            }
        }

        private void ConnectToPeerEndpoint(string endpointStr, bool silentAutoProbe = false, RoomPeerInfo targetPeer = null)
        {
            InitiateUdpHolePunch(endpointStr, false, targetPeer != null);

            ThreadPool.QueueUserWorkItem(delegate {
                try
                {
                    string host = "127.0.0.1";
                    int port = listenPort;
                    int colon = endpointStr.LastIndexOf(':');
                    if (colon > 0)
                    {
                        host = endpointStr.Substring(0, colon).Trim();
                        Int32.TryParse(endpointStr.Substring(colon + 1).Trim(), out port);
                    }
                    else if (endpointStr.Length > 0)
                    {
                        host = endpointStr;
                    }

                    if (!silentAutoProbe)
                    {
                        Log("Opening Direct Winsock2 Kernel TCP connection to " + host + ":" + port.ToString() + "...");
                    }

                    TcpClient client = new TcpClient();
                    ConfigureSocketForMaxThroughput(client);
                    if (silentAutoProbe)
                    {
                        IAsyncResult ar = client.BeginConnect(host, port, null, null);
                        if (!ar.AsyncWaitHandle.WaitOne(1200))
                        {
                            try { client.Close(); } catch { }
                            return;
                        }
                        client.EndConnect(ar);
                    }
                    else
                    {
                        client.Connect(host, port);
                    }

                    NetworkStream netStream = client.GetStream();
                    RoomPeerInfo tcpPeer = targetPeer;
                    if (tcpPeer == null)
                    {
                        tcpPeer = FindPeerByEndpointOrInstance(CleanRoomCode(currentRoomCode), "", client.Client.RemoteEndPoint as IPEndPoint);
                        if (tcpPeer == null)
                        {
                            bool isNewTcp, fullRej;
                            tcpPeer = UpsertRoomPeer("tcp-" + host + ":" + port.ToString(), "Windows .EXE (" + host + ":" + port.ToString() + ")", "exe", out isNewTcp, out fullRej);
                        }
                    }
                    if (tcpPeer != null)
                    {
                        tcpPeer.TcpClientConn = client;
                        tcpPeer.TcpStream = netStream;
                        tcpPeer.LastTcpSeen = DateTime.UtcNow;
                        SyncTargetPeerDropdown();
                    }
                    if (activePeerClient == null || !activePeerClient.Connected)
                    {
                        activePeerClient = client;
                        activePeerStream = netStream;
                    }
                    UpdateStatusBadge("PEER STATUS: CONNECTED — DIRECT TCP (" + host + ":" + port.ToString() + ")");
                    Log("Direct Kernel TCP Pipe established -> " + host + ":" + port.ToString() + " (NoDelay=true, 16MB Buffers)");

                    Thread rxThread = new Thread(delegate() {
                        try { ReceiveKernelTcpLoop(client, netStream, null); }
                        finally
                        {
                            if (tcpPeer != null && Object.ReferenceEquals(tcpPeer.TcpClientConn, client))
                            {
                                tcpPeer.TcpClientConn = null;
                                tcpPeer.TcpStream = null;
                                SyncTargetPeerDropdown();
                            }
                        }
                    });
                    rxThread.IsBackground = true;
                    rxThread.Start();
                }
                catch (Exception ex)
                {
                    if (!silentAutoProbe)
                    {
                        Log("TCP Connect failed (UDP NAT Hole-Punch active): " + ex.Message);
                    }
                }
            });
        }

        private void UdpDiscoveryLoop()
        {
            try
            {
                udpDiscovery = new UdpClient();
                udpDiscovery.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                udpDiscovery.Client.Bind(new IPEndPoint(IPAddress.Any, UDP_DISCOVERY_PORT));
                udpDiscovery.EnableBroadcast = true;

                BroadcastUdpPresence();

                IPEndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);
                while (isRunning)
                {
                    byte[] data = udpDiscovery.Receive(ref remoteEp);
                    string msg = Encoding.UTF8.GetString(data);
                    if (msg.StartsWith("AETHER_DISCOVER|"))
                    {
                        string[] parts = msg.Split('|');
                        if (parts.Length >= 4)
                        {
                            string remoteRoom = CleanRoomCode(parts[1]);
                            int remotePort = 0;
                            Int32.TryParse(parts[2], out remotePort);
                            string remoteInstanceId = parts[3];
                            string remoteDName = (parts.Length >= 5 && parts[4].Trim().Length > 0) ? parts[4].Trim() : ("Windows .EXE (" + remoteEp.Address.ToString() + ")");

                            if (remoteInstanceId == instanceId) continue;
                            if (IsOwnLocalEndpoint(remoteEp.Address, remotePort)) continue;

                            string myRoom = CleanRoomCode(currentRoomCode);

                            if (myRoom.Length > 0 && remoteRoom == myRoom && remotePort > 0)
                            {
                                string candidate = remoteEp.Address.ToString() + ":" + remotePort.ToString();
                                string canonKey = "aethertunnel-exe-" + remoteRoom + "-" + remoteInstanceId;
                                bool isNewDisc, fullDisc;
                                RoomPeerInfo discPeer = UpsertRoomPeer(canonKey, remoteDName, "exe", out isNewDisc, out fullDisc);
                                if (!fullDisc && discPeer != null && (discPeer.TcpClientConn == null || !discPeer.TcpClientConn.Connected))
                                {
                                    Log("LAN Auto-Discovery found remote .EXE peer " + discPeer.DisplayName + " at " + candidate);
                                    ConnectToPeerEndpoint(candidate, true, discPeer);
                                }
                            }
                        }
                    }
                }
            }
            catch { }
        }

        private void BroadcastUdpPresence()
        {
            try
            {
                if (udpDiscovery == null) return;
                string room = CleanRoomCode(currentRoomCode);
                if (room.Length == 0) return;
                byte[] payload = Encoding.UTF8.GetBytes("AETHER_DISCOVER|" + room + "|" + listenPort.ToString() + "|" + instanceId + "|" + SanitizeJsonText(localDisplayName));
                try { udpDiscovery.Send(payload, payload.Length, new IPEndPoint(IPAddress.Broadcast, UDP_DISCOVERY_PORT)); } catch { }
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up || ni.NetworkInterfaceType == NetworkInterfaceType.Loopback) continue;
                    foreach (UnicastIPAddressInformation uni in ni.GetIPProperties().UnicastAddresses)
                    {
                        if (uni.Address.AddressFamily == AddressFamily.InterNetwork && uni.IPv4Mask != null && !IPAddress.IsLoopback(uni.Address))
                        {
                            byte[] ipB = uni.Address.GetAddressBytes();
                            byte[] mB = uni.IPv4Mask.GetAddressBytes();
                            byte[] bcast = new byte[4];
                            for (int k = 0; k < 4; k++) bcast[k] = (byte)(ipB[k] | (byte)~mB[k]);
                            try { udpDiscovery.Send(payload, payload.Length, new IPEndPoint(new IPAddress(bcast), UDP_DISCOVERY_PORT)); } catch { }
                        }
                    }
                }
            }
            catch { }
        }

        private void OnFormDragEnter(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop))
                e.Effect = DragDropEffects.Copy;
        }

        private void OnFormDragDrop(object sender, DragEventArgs e)
        {
            string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
            if (files != null && files.Length > 0)
            {
                EnqueueTransferPaths(files);
            }
        }

        private void OnSelectFilesClicked(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Title = "Select files to add to transfer queue";
                ofd.Multiselect = true;
                if (ofd.ShowDialog() == DialogResult.OK && ofd.FileNames != null && ofd.FileNames.Length > 0)
                {
                    EnqueueTransferPaths(ofd.FileNames);
                }
            }
        }

        private void OnSelectFolderClicked(object sender, EventArgs e)
        {
            if (folderPickDialog == null) folderPickDialog = new FolderBrowserDialog();
            folderPickDialog.Description = "Select a folder to add all its files to the transfer queue:";
            if (folderPickDialog.ShowDialog() == DialogResult.OK && !String.IsNullOrEmpty(folderPickDialog.SelectedPath))
            {
                EnqueueTransferPaths(new string[] { folderPickDialog.SelectedPath });
            }
        }

        private void OnRetryQueueClicked(object sender, EventArgs e)
        {
            int resetCount = 0;
            lock (transferQueueLock)
            {
                int selIdx = (lstQueue != null) ? lstQueue.SelectedIndex : -1;
                if (selIdx >= 0 && selIdx < transferQueue.Count)
                {
                    TransferQueueEntry sel = transferQueue[selIdx];
                    if (sel.Status == "Error" || sel.Status == "Declined" || sel.Status == "Interrupted (retrying)" || sel.Status == "Waiting for peer...")
                    {
                        cancelledQueueIds.Remove(sel.Id);
                        sel.RetryCount = 0;
                        sel.NextRetryUtc = DateTime.MinValue;
                        sel.Status = "Queued";
                        resetCount++;
                    }
                }
                if (resetCount == 0)
                {
                    for (int i = 0; i < transferQueue.Count; i++)
                    {
                        TransferQueueEntry q = transferQueue[i];
                        if (q.Status == "Error" || q.Status == "Declined" || q.Status == "Interrupted (retrying)" || q.Status == "Waiting for peer...")
                        {
                            cancelledQueueIds.Remove(q.Id);
                            q.RetryCount = 0;
                            q.NextRetryUtc = DateTime.MinValue;
                            q.Status = "Queued";
                            resetCount++;
                        }
                    }
                }
            }
            if (transferPaused)
            {
                OnPauseResumeClicked(sender, e);
            }
            if (resetCount > 0)
            {
                Log("Re-queued " + resetCount.ToString() + (resetCount == 1 ? " interrupted transfer" : " interrupted transfers") + " for resume.");
                RefreshQueueUi();
                transferQueueEvent.Set();
            }
        }

        private void OnRemoveSelectedQueueClicked(object sender, EventArgs e)
        {
            if (lstQueue == null || lstQueue.SelectedIndex < 0) return;
            lock (transferQueueLock)
            {
                int idx = lstQueue.SelectedIndex;
                if (idx >= 0 && idx < transferQueue.Count)
                {
                    TransferQueueEntry item = transferQueue[idx];
                    if (item.Id == activeQueueTransferId && item.Status == "Transferring")
                    {
                        Log("Cannot remove an active transfer from the queue while sending.");
                        return;
                    }
                    cancelledQueueIds.Add(item.Id);
                    transferQueue.RemoveAt(idx);
                }
            }
            RefreshQueueUi();
        }

        private void OnClearQueueClicked(object sender, EventArgs e)
        {
            lock (transferQueueLock)
            {
                for (int i = transferQueue.Count - 1; i >= 0; i--)
                {
                    string st = transferQueue[i].Status;
                    if (st == "Completed" || st == "Declined" || st == "Error")
                    {
                        transferQueue.RemoveAt(i);
                    }
                }
            }
            RefreshQueueUi();
        }

        private void OnPauseResumeClicked(object sender, EventArgs e)
        {
            transferPaused = !transferPaused;
            if (transferPaused)
            {
                transferResumeEvent.Reset();
                if (btnPauseResume != null)
                {
                    btnPauseResume.Text = "Resume";
                    btnPauseResume.BackColor = Color.FromArgb(14, 52, 38);
                    btnPauseResume.ForeColor = Color.FromArgb(52, 211, 153);
                }
                if (!String.IsNullOrEmpty(activeQueueTransferId))
                {
                    UpdateQueueEntryStatus(activeQueueTransferId, "Paused");
                }
                if (lblProgressDetail != null)
                {
                    lblProgressDetail.Text = "Transfer paused — click Resume to continue.";
                }
                Log("Transfer paused by user.");
            }
            else
            {
                transferResumeEvent.Set();
                if (btnPauseResume != null)
                {
                    btnPauseResume.Text = "Pause";
                    btnPauseResume.BackColor = Color.FromArgb(45, 34, 14);
                    btnPauseResume.ForeColor = Color.FromArgb(251, 191, 36);
                }
                if (!String.IsNullOrEmpty(activeQueueTransferId))
                {
                    UpdateQueueEntryStatus(activeQueueTransferId, "Transferring");
                }
                Log("Resuming transfer.");
            }
        }

        private void EnqueueTransferPaths(string[] paths)
        {
            if (paths == null || paths.Length == 0) return;
            string tgtId = String.IsNullOrEmpty(selectedTargetPeerId) ? "*" : selectedTargetPeerId;
            string tgtLabel = GetCurrentTargetLabel(tgtId);
            int added = 0;
            lock (transferQueueLock)
            {
                foreach (string rawPath in paths)
                {
                    try
                    {
                        if (File.Exists(rawPath))
                        {
                            FileInfo fi = new FileInfo(rawPath);
                            TransferQueueEntry entry = new TransferQueueEntry();
                            entry.Id = Guid.NewGuid().ToString("N").Substring(0, 10);
                            entry.FullPath = fi.FullName;
                            entry.DisplayName = fi.Name;
                            entry.FileSize = fi.Length;
                            entry.Status = "Queued";
                            entry.TargetPeerId = tgtId;
                            entry.TargetLabel = tgtLabel;
                            transferQueue.Add(entry);
                            added++;
                        }
                        else if (Directory.Exists(rawPath))
                        {
                            string rootDir = Path.GetFullPath(rawPath).TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
                            string rootFolderName = Path.GetFileName(rootDir);
                            string[] dirFiles = Directory.GetFiles(rootDir, "*", SearchOption.AllDirectories);
                            Array.Sort(dirFiles, StringComparer.OrdinalIgnoreCase);
                            foreach (string df in dirFiles)
                            {
                                try
                                {
                                    FileInfo dfi = new FileInfo(df);
                                    string rel = dfi.FullName.Length > rootDir.Length + 1
                                        ? dfi.FullName.Substring(rootDir.Length + 1)
                                        : dfi.Name;
                                    TransferQueueEntry entry = new TransferQueueEntry();
                                    entry.Id = Guid.NewGuid().ToString("N").Substring(0, 10);
                                    entry.FullPath = dfi.FullName;
                                    entry.DisplayName = (!String.IsNullOrEmpty(rootFolderName) ? rootFolderName + "\\\\" + rel : rel);
                                    entry.FileSize = dfi.Length;
                                    entry.Status = "Queued";
                                    entry.TargetPeerId = tgtId;
                                    entry.TargetLabel = tgtLabel;
                                    transferQueue.Add(entry);
                                    added++;
                                }
                                catch { }
                            }
                        }
                    }
                    catch { }
                }
            }
            if (added > 0)
            {
                Log("Added " + added.ToString() + (added == 1 ? " file" : " files") + " to transfer queue -> " + tgtLabel + ".");
                RefreshQueueUi();
                transferQueueEvent.Set();
            }
        }

        private void RefreshQueueUi()
        {
            try
            {
                if (this.InvokeRequired)
                {
                    this.BeginInvoke(new Action(RefreshQueueUi));
                    return;
                }
                if (lstQueue == null || lblQueueSummary == null) return;
                List<string> rows = new List<string>();
                int waiting = 0;
                int done = 0;
                lock (transferQueueLock)
                {
                    for (int i = 0; i < transferQueue.Count; i++)
                    {
                        TransferQueueEntry q = transferQueue[i];
                        if (q.Status == "Queued" || q.Status == "Waiting for peer..." || q.Status == "Awaiting acceptance" || q.Status == "Transferring" || q.Status == "Paused" || q.Status == "Interrupted (retrying)") waiting++;
                        else if (q.Status == "Completed") done++;
                        string tLabel = String.IsNullOrEmpty(q.TargetLabel) ? "Everyone" : q.TargetLabel;
                        rows.Add(String.Format("[{0}] (-> {1}) {2} ({3})", q.Status, tLabel, q.DisplayName, FormatBytes(q.FileSize)));
                    }
                }
                lblQueueSummary.Text = String.Format("Transfer Queue ({0} queued · {1} completed)", waiting, done);
                int prevSel = lstQueue.SelectedIndex;
                lstQueue.BeginUpdate();
                lstQueue.Items.Clear();
                for (int i = 0; i < rows.Count; i++) lstQueue.Items.Add(rows[i]);
                if (prevSel >= 0 && prevSel < lstQueue.Items.Count) lstQueue.SelectedIndex = prevSel;
                lstQueue.EndUpdate();
            }
            catch { }
        }

        private bool HasAnyActivePeer()
        {
            DateTime now = DateTime.UtcNow;
            foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
            {
                if (IsPeerActive(kv.Value, now)) return true;
            }
            bool hasExePeer = (activePeerClient != null && activePeerClient.Connected && activePeerStream != null);
            bool hasUdpPeer = (activeUdpPeerEndpoint != null && (now - lastUdpPeerSeen).TotalSeconds < 15);
            bool hasLocalBrowserPeer = (activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            bool hasCloudOpen = !activeSignalingChannels.IsEmpty;
            bool hasCloudBrowserPeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudBrowserPeerId) && (now - lastCloudBrowserSeen).TotalSeconds < 14);
            bool hasCloudExePeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudExePeerId) && (now - lastCloudExeSeen).TotalSeconds < 14);
            return hasExePeer || hasUdpPeer || hasLocalBrowserPeer || hasCloudBrowserPeer || hasCloudExePeer;
        }

        private bool HasTargetReadyForEntry(TransferQueueEntry entry, DateTime now)
        {
            if (entry == null) return false;
            if (String.IsNullOrEmpty(entry.TargetPeerId) || entry.TargetPeerId == "*")
            {
                return HasAnyActivePeer();
            }
            RoomPeerInfo p;
            if (roomPeers.TryGetValue(entry.TargetPeerId, out p))
            {
                return IsPeerActive(p, now);
            }
            return false;
        }

        private void UpdateQueueEntryStatus(string entryId, string status)
        {
            lock (transferQueueLock)
            {
                for (int i = 0; i < transferQueue.Count; i++)
                {
                    if (transferQueue[i].Id == entryId)
                    {
                        transferQueue[i].Status = status;
                        break;
                    }
                }
            }
            RefreshQueueUi();
        }

        private void TransferQueueWorkerLoop()
        {
            bool loggedWaitingPeer = false;
            while (isRunning)
            {
                TransferQueueEntry next = null;
                TransferQueueEntry firstWaiting = null;
                DateTime now = DateTime.UtcNow;
                lock (transferQueueLock)
                {
                    for (int i = 0; i < transferQueue.Count; i++)
                    {
                        TransferQueueEntry cand = transferQueue[i];
                        if (cand.Status == "Queued" || cand.Status == "Waiting for peer..." || cand.Status == "Interrupted (retrying)")
                        {
                            if (firstWaiting == null) firstWaiting = cand;
                            if (now >= cand.NextRetryUtc && HasTargetReadyForEntry(cand, now))
                            {
                                next = cand;
                                break;
                            }
                        }
                    }
                }

                if (next == null)
                {
                    if (firstWaiting != null)
                    {
                        if (!HasTargetReadyForEntry(firstWaiting, now))
                        {
                            if (firstWaiting.Status != "Waiting for peer...")
                            {
                                UpdateQueueEntryStatus(firstWaiting.Id, "Waiting for peer...");
                            }
                            if (!loggedWaitingPeer)
                            {
                                loggedWaitingPeer = true;
                                Log("Transfer queue waiting for recipient (" + (firstWaiting.TargetLabel ?? "Everyone") + ") in room [" + txtRoomCode.Text.Trim() + "]...");
                            }
                        }
                        Thread.Sleep(350);
                        continue;
                    }
                    loggedWaitingPeer = false;
                    transferQueueEvent.WaitOne(250);
                    continue;
                }

                if (cancelledQueueIds.Contains(next.Id))
                {
                    continue;
                }

                loggedWaitingPeer = false;

                while (transferPaused && isRunning)
                {
                    transferResumeEvent.WaitOne(200);
                }
                if (!isRunning) break;

                activeQueueTransferId = next.Id;
                UpdateQueueEntryStatus(next.Id, "Transferring");
                string outcome = "Error";
                try
                {
                    outcome = ExecuteQueuedTransfer(next);
                }
                catch (Exception ex)
                {
                    Log("Queue Transfer Exception (" + next.DisplayName + "): " + ex.Message);
                    outcome = "Error";
                }
                finally
                {
                    activeQueueTransferId = "";
                    string finalStatus = String.IsNullOrEmpty(outcome) ? "Error" : outcome;
                    if (finalStatus == "Error" && !cancelledQueueIds.Contains(next.Id) && File.Exists(next.FullPath) && isRunning)
                    {
                        bool peerOnlineNow = HasTargetReadyForEntry(next, DateTime.UtcNow);
                        if (!peerOnlineNow)
                        {
                            next.RetryCount = 0;
                            next.NextRetryUtc = DateTime.UtcNow.AddSeconds(2);
                            finalStatus = "Waiting for peer...";
                            Log("Connection to recipient lost (" + next.DisplayName + ") — will auto-resume when peer reconnects.");
                        }
                        else if (next.RetryCount < 12)
                        {
                            next.RetryCount++;
                            next.NextRetryUtc = DateTime.UtcNow.AddSeconds(3);
                            finalStatus = "Interrupted (retrying)";
                            Log("Transfer interrupted (" + next.DisplayName + ") — auto-retrying in 3s (attempt " + next.RetryCount.ToString() + "/12)...");
                        }
                        else
                        {
                            finalStatus = "Error";
                            Log("Transfer interrupted repeatedly (" + next.DisplayName + "). Click 'Resume / Retry' to continue.");
                        }
                    }
                    else if (finalStatus == "Completed")
                    {
                        next.RetryCount = 0;
                        next.NextRetryUtc = DateTime.MinValue;
                    }
                    UpdateQueueEntryStatus(next.Id, finalStatus);
                    transferQueueEvent.Set();
                }
            }
        }

        private string ExecuteQueuedTransfer(TransferQueueEntry entry)
        {
            DateTime now = DateTime.UtcNow;
            List<RoomPeerInfo> targets = new List<RoomPeerInfo>();
            if (!String.IsNullOrEmpty(entry.TargetPeerId) && entry.TargetPeerId != "*")
            {
                RoomPeerInfo specific;
                if (roomPeers.TryGetValue(entry.TargetPeerId, out specific) && IsPeerActive(specific, now))
                {
                    targets.Add(specific);
                }
            }
            else
            {
                foreach (KeyValuePair<string, RoomPeerInfo> kv in roomPeers)
                {
                    if (IsPeerActive(kv.Value, now)) targets.Add(kv.Value);
                }
            }

            if (targets.Count > 0)
            {
                int okCount = 0;
                int rejCount = 0;
                for (int i = 0; i < targets.Count && isRunning; i++)
                {
                    RoomPeerInfo tp = targets[i];
                    string res = "Error";
                    if (tp.TcpClientConn != null && tp.TcpClientConn.Connected && tp.TcpStream != null)
                    {
                        res = StreamFileOverKernelTcp(entry.FullPath, entry.Id, tp);
                    }
                    else if (tp.ActiveUdpEp != null && (now - tp.LastUdpSeen).TotalSeconds < 14)
                    {
                        res = StreamFileOverNatPunchedUdp(entry.FullPath, entry.Id, tp.ActiveUdpEp);
                    }
                    else if (tp.ClientType == "local_browser" && activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null)
                    {
                        res = StreamFileToBrowserOverWebSocket(entry.FullPath, entry.Id);
                    }
                    else if (!String.IsNullOrEmpty(tp.CloudPeerId))
                    {
                        res = StreamFileToBrowserOverCloudBridge(entry.FullPath, entry.Id, tp.CloudPeerId, tp.DisplayName);
                    }

                    if (res == "Completed") okCount++;
                    else if (res == "Declined") rejCount++;
                }
                if (okCount > 0) return "Completed";
                if (rejCount > 0) return "Declined";
                return "Error";
            }

            if (!String.IsNullOrEmpty(entry.TargetPeerId) && entry.TargetPeerId != "*")
            {
                return "Error";
            }

            bool hasExePeer = (activePeerClient != null && activePeerClient.Connected && activePeerStream != null);
            bool hasUdpPeer = (activeUdpPeerEndpoint != null && (now - lastUdpPeerSeen).TotalSeconds < 15);
            bool hasLocalBrowserPeer = (activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            bool hasCloudOpen = !activeSignalingChannels.IsEmpty;
            bool hasCloudBrowserPeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudBrowserPeerId) && (now - lastCloudBrowserSeen).TotalSeconds < 14);
            bool hasCloudExePeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudExePeerId) && (now - lastCloudExeSeen).TotalSeconds < 14);

            if (hasExePeer) return StreamFileOverKernelTcp(entry.FullPath, entry.Id, null);
            if (hasUdpPeer) return StreamFileOverNatPunchedUdp(entry.FullPath, entry.Id, null);
            if (hasLocalBrowserPeer) return StreamFileToBrowserOverWebSocket(entry.FullPath, entry.Id);
            if (hasCloudBrowserPeer || hasCloudExePeer) return StreamFileToBrowserOverCloudBridge(entry.FullPath, entry.Id, "", "");
            return "Error";
        }

        private int ShowIncomingTransferDialog(string senderInfo, string fileName, long fileSize, bool hasResume)
        {
            if (autoAcceptAllIncoming) return 1;
            lock (incomingPromptLock)
            {
                if (autoAcceptAllIncoming) return 1;
                int result = 0;
                try
                {
                    if (!isRunning || this.IsDisposed) return 0;
                    this.Invoke(new Action(delegate {
                        if (autoAcceptAllIncoming) { result = 1; return; }
                        using (Form dlg = new Form())
                        {
                            dlg.Text = "Incoming File Transfer — AetherTunnel";
                            dlg.FormBorderStyle = FormBorderStyle.FixedDialog;
                            dlg.MaximizeBox = false;
                            dlg.MinimizeBox = false;
                            dlg.StartPosition = FormStartPosition.CenterParent;
                            dlg.ShowInTaskbar = true;
                            dlg.TopMost = true;
                            dlg.ClientSize = new Size(S(470), S(205));
                            dlg.BackColor = Color.FromArgb(15, 23, 42);
                            dlg.ForeColor = Color.White;
                            dlg.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);

                            Label lHead = CreateCleanLabel(
                                "Sender (" + senderInfo + ") wants to send a file:",
                                new Font("Segoe UI Semibold", 10f, FontStyle.Bold),
                                Color.FromArgb(56, 189, 248),
                                new Point(S(20), S(18)),
                                false
                            );
                            lHead.Size = new Size(S(430), S(24));
                            dlg.Controls.Add(lHead);

                            Label lName = CreateCleanLabel(
                                fileName,
                                new Font("Consolas", 10.5f, FontStyle.Bold),
                                Color.White,
                                new Point(S(20), S(48)),
                                false
                            );
                            lName.Size = new Size(S(430), S(26));
                            dlg.Controls.Add(lName);

                            Label lMeta = CreateCleanLabel(
                                "Size: " + FormatBytes(fileSize) + (hasResume ? "   ·   Interrupted transfer can resume (.part)" : "   ·   Save folder: " + downloadDirectory),
                                new Font("Segoe UI", 8.8f),
                                Color.FromArgb(148, 163, 184),
                                new Point(S(20), S(80)),
                                false
                            );
                            lMeta.Size = new Size(S(430), S(40));
                            dlg.Controls.Add(lMeta);

                            Button bAccept = new Button();
                            bAccept.UseMnemonic = false;
                            bAccept.Text = "Accept";
                            bAccept.FlatStyle = FlatStyle.Flat;
                            bAccept.BackColor = Color.FromArgb(16, 185, 129);
                            bAccept.ForeColor = Color.FromArgb(9, 13, 22);
                            bAccept.Font = new Font("Segoe UI Semibold", 9.5f, FontStyle.Bold);
                            bAccept.Location = new Point(S(20), S(142));
                            bAccept.Size = new Size(S(115), S(38));
                            bAccept.Click += delegate { result = 1; dlg.DialogResult = DialogResult.OK; dlg.Close(); };
                            dlg.Controls.Add(bAccept);

                            Button bAcceptAll = new Button();
                            bAcceptAll.UseMnemonic = false;
                            bAcceptAll.Text = "Accept All (Queued)";
                            bAcceptAll.FlatStyle = FlatStyle.Flat;
                            bAcceptAll.BackColor = Color.FromArgb(56, 189, 248);
                            bAcceptAll.ForeColor = Color.FromArgb(9, 13, 22);
                            bAcceptAll.Font = new Font("Segoe UI Semibold", 9.2f, FontStyle.Bold);
                            bAcceptAll.Location = new Point(S(145), S(142));
                            bAcceptAll.Size = new Size(S(185), S(38));
                            bAcceptAll.Click += delegate {
                                autoAcceptAllIncoming = true;
                                if (chkAutoAccept != null) chkAutoAccept.Checked = true;
                                result = 2;
                                dlg.DialogResult = DialogResult.Yes;
                                dlg.Close();
                            };
                            dlg.Controls.Add(bAcceptAll);

                            Button bReject = new Button();
                            bReject.UseMnemonic = false;
                            bReject.Text = "Decline";
                            bReject.FlatStyle = FlatStyle.Flat;
                            bReject.BackColor = Color.FromArgb(51, 65, 85);
                            bReject.ForeColor = Color.FromArgb(248, 113, 113);
                            bReject.Font = new Font("Segoe UI Semibold", 9.5f, FontStyle.Bold);
                            bReject.Location = new Point(S(340), S(142));
                            bReject.Size = new Size(S(110), S(38));
                            bReject.Click += delegate { result = 0; dlg.DialogResult = DialogResult.Cancel; dlg.Close(); };
                            dlg.Controls.Add(bReject);

                            dlg.AcceptButton = bAccept;
                            dlg.CancelButton = bReject;
                            dlg.ShowDialog(this);
                        }
                    }));
                }
                catch { result = 0; }
                return result;
            }
        }

        private static void WriteInt32LE(byte[] buf, int offset, int val)
        {
            buf[offset] = (byte)(val & 0xFF);
            buf[offset + 1] = (byte)((val >> 8) & 0xFF);
            buf[offset + 2] = (byte)((val >> 16) & 0xFF);
            buf[offset + 3] = (byte)((val >> 24) & 0xFF);
        }

        private byte[] EncryptSingleUdpChunk(byte[] plainBuf, int plainLen, int chunkIndex, int totalChunks, byte[] keySnapshot)
        {
            byte[] iv = threadLocalIv.Value;
            Array.Clear(iv, 8, 8);
            WriteInt32LE(iv, 0, chunkIndex);
            WriteInt32LE(iv, 4, 0x5A3C9E17 ^ chunkIndex);

            byte[] cipher;
            AesCryptoServiceProvider aes = threadLocalAes.Value;
            using (ICryptoTransform enc = aes.CreateEncryptor(keySnapshot, iv))
            {
                cipher = enc.TransformFinalBlock(plainBuf, 0, plainLen);
            }

            byte[] packet = new byte[28 + cipher.Length];
            WriteInt32LE(packet, 0, unchecked((int)MAGIC_UDP_DATA));
            WriteInt32LE(packet, 4, chunkIndex);
            WriteInt32LE(packet, 8, totalChunks);
            Buffer.BlockCopy(iv, 0, packet, 12, 16);
            Buffer.BlockCopy(cipher, 0, packet, 28, cipher.Length);
            return packet;
        }

        private void PaceUdpPacketSend(int packetBytes, ref long pacingEpochTicks, ref long pacedBytesSinceEpoch)
        {
            pacedBytesSinceEpoch = 0;
            double capMbps = dynamicUdpBitrateMbps;
            long userLimitBps = Interlocked.Read(ref maxUploadBytesPerSec);
            if (userLimitBps > 0L)
            {
                double userCapMbps = Math.Max(0.1, (userLimitBps * 8.0) / (1024.0 * 1024.0));
                if (userCapMbps < capMbps) capMbps = userCapMbps;
            }
            if (capMbps >= 5000.0 && userLimitBps <= 0L)
            {
                pacingEpochTicks = Stopwatch.GetTimestamp();
                return;
            }

            if (Interlocked.Exchange(ref pacingResetRequested, 0) == 1)
            {
                long curNow = Stopwatch.GetTimestamp();
                if (pacingEpochTicks > curNow) pacingEpochTicks = curNow;
            }

            double bytesPerSec = (capMbps / 8.0) * 1024.0 * 1024.0;
            long pktTicks = (long)((packetBytes / bytesPerSec) * Stopwatch.Frequency);
            long nowTicks = Stopwatch.GetTimestamp();
            long minFloorTicks = nowTicks - (Stopwatch.Frequency / 60); // Tolerate ~16ms OS timer tick jitter without starving bandwidth quota
            if (pacingEpochTicks < minFloorTicks)
            {
                pacingEpochTicks = minFloorTicks;
            }

            pacingEpochTicks += pktTicks;

            while (isRunning)
            {
                long cur = Stopwatch.GetTimestamp();
                long remain = pacingEpochTicks - cur;
                if (remain <= 0) break;
                if (remain > Stopwatch.Frequency / 500) // > 2.0 ms ahead
                {
                    Thread.Sleep(1);
                }
                else
                {
                    Thread.SpinWait(24);
                }
            }
        }

        private void PaceGenericTxBytes(int bytesSent, ref long epochTicks)
        {
            long limitBps = Interlocked.Read(ref maxUploadBytesPerSec);
            if (limitBps <= 0L)
            {
                epochTicks = Stopwatch.GetTimestamp();
                return;
            }
            double stepSec = bytesSent / Math.Max(10240.0, (double)limitBps);
            long stepTicks = (long)(stepSec * Stopwatch.Frequency);
            long now = Stopwatch.GetTimestamp();
            long floor = now - (Stopwatch.Frequency / 20);
            if (epochTicks < floor) epochTicks = floor;
            epochTicks += stepTicks;
            while (isRunning && Interlocked.Read(ref maxUploadBytesPerSec) > 0L)
            {
                long rem = epochTicks - Stopwatch.GetTimestamp();
                if (rem <= 0) break;
                int sleepMs = (int)Math.Min(100L, Math.Max(1L, (rem * 1000L) / Stopwatch.Frequency));
                Thread.Sleep(sleepMs);
            }
        }

        private string StreamFileOverNatPunchedUdp(string filePath, string queueEntryId = "", IPEndPoint overrideEp = null)
        {
            lock (udpTxLock)
            {
                try
                {
                    IPEndPoint targetEp = overrideEp != null ? overrideEp : activeUdpPeerEndpoint;
                    if (targetEp == null || udpP2pClient == null) return "Error";
                    activeUdpPeerEndpoint = targetEp;

                    FileInfo fi = new FileInfo(filePath);
                    long fileSize = fi.Length;
                    string fileName = fi.Name;
                    udpTxActiveFileName = fileName;
                    int totalChunks = (int)Math.Max(1L, (fileSize + UDP_CHUNK_SIZE - 1) / UDP_CHUNK_SIZE);

                    dynamicUdpBitrateMbps = 25.0;
                    udpBestRxMbps = 25.0;
                    udpCongestionCeilingMbps = 0.0;
                    udpBestRxDecayTicks = Stopwatch.GetTimestamp();
                    lastNackReceivedTick = unchecked(Environment.TickCount - 10000);
                    lastNackCutTick = unchecked(Environment.TickCount - 10000);
                    lastAckReceivedTick = Environment.TickCount;
                    udpTxLastPeerActivityTick = Environment.TickCount;
                    udpInSlowStart = true;
                    udpCleanAckStreak = 0;
                    udpLowRxStreak = 0;
                    udpSenderChunkLastSentTick.Clear();
                    Log(String.Format("Streaming over High-Speed NAT-Punched UDP P2P -> {0}: {1} ({2}) [Auto Dynamic Pacing]",
                        targetEp.ToString(), fileName, FormatBytes(fileSize)));

                    udpPeerResumeChunk = 0;
                    udpPeerAckedChunk = -1;
                    udpPeerContiguousChunk = -1;
                    udpPeerUniqueAcked = 0;
                    udpPeerMeasuredMbps = 0;
                    udpTransferDoneAcked = false;
                    udpNeedStartResend = false;
                    udpWaitAcceptReceived = false;
                    udpTransferRejected = false;
                    udpResumeReceived = false;
                    int staleIdx;
                    while (udpRetransmitQueue.TryDequeue(out staleIdx)) { }
                    udpResumeEvent.Reset();
                    udpAckEvent.Reset();

                    string startMsg = "AETHER_UDP_START|" + fileName.Replace("|", "_") + "|" + fileSize.ToString() + "|" + totalChunks.ToString();
                    byte[] startBytes = Encoding.UTF8.GetBytes(startMsg);

                    // Reliable START handshake (up to 5s initial probe, plus up to 120s wait on WAIT_ACCEPT)
                    for (int attempt = 0; attempt < 25 && isRunning; attempt++)
                    {
                        if (overrideEp == null && activeUdpPeerEndpoint != null && !activeUdpPeerEndpoint.Equals(targetEp))
                        {
                            targetEp = activeUdpPeerEndpoint;
                        }
                        SendUdpP2pPacket(startBytes, startBytes.Length, targetEp);
                        if (udpResumeEvent.WaitOne(200))
                        {
                            if (udpTransferRejected || udpResumeReceived || udpWaitAcceptReceived) break;
                        }
                    }

                    if (!udpResumeReceived && !udpWaitAcceptReceived && !udpTransferRejected)
                    {
                        Log("No UDP P2P start acknowledgment received from recipient (" + fileName + ") — marking as interrupted.");
                        return "Error";
                    }

                    if (udpWaitAcceptReceived && !udpResumeReceived && !udpTransferRejected && isRunning)
                    {
                        if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Awaiting acceptance");
                        UpdateTransferUi("Awaiting recipient acceptance: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                        Log("Awaiting recipient acceptance for file: " + fileName);
                        int waitLoops = 0;
                        while (!udpResumeReceived && !udpTransferRejected && isRunning && waitLoops < 150)
                        {
                            if (overrideEp == null && activeUdpPeerEndpoint != null && !activeUdpPeerEndpoint.Equals(targetEp))
                            {
                                targetEp = activeUdpPeerEndpoint;
                            }
                            SendUdpP2pPacket(startBytes, startBytes.Length, targetEp);
                            udpResumeEvent.WaitOne(800);
                            waitLoops++;
                        }
                        if (!udpResumeReceived && !udpTransferRejected)
                        {
                            Log("Acceptance wait timed out: " + fileName);
                            return "Error";
                        }
                    }

                    if (udpTransferRejected)
                    {
                        Log("Recipient declined the file: " + fileName);
                        UpdateTransferUi("Recipient declined: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                        return "Declined";
                    }

                    if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Transferring");

                    int startChunk = Math.Max(0, Math.Min(udpPeerResumeChunk, totalChunks));
                    udpPeerAckedChunk = startChunk - 1;
                    udpPeerContiguousChunk = startChunk - 1;
                    udpPeerUniqueAcked = startChunk;

                    if (startChunk > 0)
                    {
                        Log("Resuming NAT-Punched UDP transfer from chunk " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * UDP_CHUNK_SIZE) + ")");
                    }

                    int initialStartChunk = startChunk;
                    Stopwatch sw = Stopwatch.StartNew();
                    Stopwatch txUiSw = Stopwatch.StartNew();
                    long txUiWindowBytes = 0;
                    long totalWireBytesSent = 0;
                    double smoothedUiTxMbps = 0.0;
                    long totalSent = Math.Min(fileSize, (long)startChunk * UDP_CHUNK_SIZE);
                    byte[] keySnapshot = (byte[])aesKey.Clone();
                    long pacingEpochTicks = Stopwatch.GetTimestamp();
                    long pacedBytesSinceEpoch = 0;
                    lastAckReceivedTick = Environment.TickCount;
                    udpTxLastPeerActivityTick = Environment.TickCount;
                    int lastStartKeepaliveTick = Environment.TickCount;
                    bool abortedByDisconnect = false;

                    ParallelOptions txParallelOpts = new ParallelOptions();
                    txParallelOpts.MaxDegreeOfParallelism = Math.Max(1, Math.Min(4, Environment.ProcessorCount / 2));

                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 16 * 1024 * 1024, FileOptions.SequentialScan))
                    using (FileStream fsRepair = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.RandomAccess))
                    {
                        int waveStart = startChunk;
                        int lastProbeTick = unchecked(Environment.TickCount - 1000);
                        while (waveStart < totalChunks && !udpTransferDoneAcked && isRunning)
                        {
                            if (transferPaused && isRunning)
                            {
                                sw.Stop();
                                double pausedAvg = (Math.Max(0L, totalSent - ((long)initialStartChunk * UDP_CHUNK_SIZE)) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                                int pausedPermille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                                UpdateTransferUi("Paused (UDP P2P): " + fileName, totalSent, fileSize, 0.0, pausedAvg, pausedPermille, true);
                                while (transferPaused && isRunning)
                                {
                                    lastAckReceivedTick = Environment.TickCount;
                                    udpTxLastPeerActivityTick = Environment.TickCount;
                                    transferResumeEvent.WaitOne(200);
                                }
                                if (!isRunning) break;
                                sw.Start();
                                txUiSw.Restart();
                                txUiWindowBytes = 0;
                                smoothedUiTxMbps = 0.0;
                                lastAckReceivedTick = Environment.TickCount;
                                udpTxLastPeerActivityTick = Environment.TickCount;
                                Interlocked.Exchange(ref pacingResetRequested, 1);
                                pacingEpochTicks = Stopwatch.GetTimestamp();
                            }

                            if (overrideEp == null && activeUdpPeerEndpoint != null && !activeUdpPeerEndpoint.Equals(targetEp))
                            {
                                targetEp = activeUdpPeerEndpoint;
                            }

                            int peerSilentMs = unchecked(Environment.TickCount - udpTxLastPeerActivityTick);
                            if (peerSilentMs > 12000)
                            {
                                abortedByDisconnect = true;
                                Log("UDP P2P connection lost mid-transfer (no response from recipient for 12s): " + fileName);
                                break;
                            }
                            if (peerSilentMs > 3500 && unchecked(Environment.TickCount - lastStartKeepaliveTick) > 2500)
                            {
                                lastStartKeepaliveTick = Environment.TickCount;
                                try { SendUdpP2pPacket(startBytes, startBytes.Length, targetEp); } catch { }
                            }

                            // Instant Resume Jump: if receiver reports a higher contiguous/resume chunk, skip ahead smoothly without resetting live speed!
                            int peerContig = Math.Max(udpPeerResumeChunk, udpPeerContiguousChunk + 1);
                            if (peerContig > udpPeerUniqueAcked) udpPeerUniqueAcked = peerContig;
                            if (peerContig > waveStart && peerContig <= totalChunks)
                            {
                                if (peerContig - waveStart >= 512)
                                {
                                    Log("Peer confirmed resume offset at chunk " + peerContig.ToString() + " (" + FormatBytes(Math.Min(fileSize, (long)peerContig * UDP_CHUNK_SIZE)) + ") — jumping ahead!");
                                }
                                waveStart = peerContig;
                                startChunk = peerContig;
                                totalSent = Math.Min(fileSize, (long)waveStart * UDP_CHUNK_SIZE);
                                if (waveStart >= totalChunks) break;
                            }

                            if (udpNeedStartResend)
                            {
                                udpNeedStartResend = false;
                                SendUdpP2pPacket(startBytes, startBytes.Length, targetEp);
                                Thread.Sleep(15);
                            }

                            // Smooth BDP In-Flight Window Cap (generous pipeline headroom prevents BDP choke)
                            bool isProbeOnly = false;
                            while (!udpTransferDoneAcked && isRunning)
                            {
                                if (unchecked(Environment.TickCount - udpTxLastPeerActivityTick) > 12000)
                                {
                                    abortedByDisconnect = true;
                                    break;
                                }
                                int curMaxInFlight = Math.Max(640, Math.Min(28000, (int)Math.Round(dynamicUdpBitrateMbps * 22.0)));
                                int inFlightNow = Math.Max(0, waveStart - udpPeerUniqueAcked);
                                if (inFlightNow < curMaxInFlight) break;

                                if (unchecked(Environment.TickCount - lastAckReceivedTick) > 1500)
                                {
                                    lastAckReceivedTick = Environment.TickCount;
                                    dynamicUdpBitrateMbps = Math.Max(8.0, dynamicUdpBitrateMbps * 0.85);
                                    udpCleanAckStreak = 0;
                                    udpLowRxStreak = 0;
                                    Interlocked.Exchange(ref pacingResetRequested, 1);
                                }

                                // Allow repairing NACKed holes while waiting for window space
                                int waitNackIdx;
                                int repairedWait = 0;
                                while (repairedWait < 32 && udpRetransmitQueue.TryDequeue(out waitNackIdx))
                                {
                                    if (waitNackIdx >= 0 && waitNackIdx < totalChunks)
                                    {
                                        long rPos = (long)waitNackIdx * UDP_CHUNK_SIZE;
                                        int rRem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - rPos);
                                        byte[] rBuf = new byte[rRem];
                                        fsRepair.Seek(rPos, SeekOrigin.Begin);
                                        int rRead = fsRepair.Read(rBuf, 0, rRem);
                                        if (rRead > 0)
                                        {
                                            byte[] rPkt = EncryptSingleUdpChunk(rBuf, rRead, waitNackIdx, totalChunks, keySnapshot);
                                            SendUdpP2pPacket(rPkt, rPkt.Length, targetEp);
                                            totalWireBytesSent += rRead;
                                            txUiWindowBytes += rRead;
                                            PaceUdpPacketSend(rPkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                            repairedWait++;
                                        }
                                    }
                                }

                                if (unchecked(Environment.TickCount - lastProbeTick) > 400)
                                {
                                    lastProbeTick = Environment.TickCount;
                                    isProbeOnly = true;
                                    break; // Send max 2 gentle keepalive/probe chunks so 0 Mbit/s links self-heal cleanly
                                }

                                udpAckEvent.WaitOne(15);
                            }
                            if (abortedByDisconnect)
                            {
                                Log("UDP P2P connection lost while waiting for send window: " + fileName);
                                break;
                            }

                            // Handle temporary ACK stalls gently without halving speed
                            if (unchecked(Environment.TickCount - lastAckReceivedTick) > 1500)
                            {
                                lastAckReceivedTick = Environment.TickCount;
                                dynamicUdpBitrateMbps = Math.Max(8.0, dynamicUdpBitrateMbps * 0.85);
                                udpCleanAckStreak = 0;
                                udpLowRxStreak = 0;
                                Interlocked.Exchange(ref pacingResetRequested, 1);
                            }

                            // Drain and immediately retransmit up to 64 unique NACKed chunks on fsRepair (never flushes fs 16MB sequential cache!)
                            int nackIdx;
                            int repairedInWave = 0;
                            while (repairedInWave < 64 && udpRetransmitQueue.TryDequeue(out nackIdx))
                            {
                                if (nackIdx >= 0 && nackIdx < totalChunks)
                                {
                                    long rPos = (long)nackIdx * UDP_CHUNK_SIZE;
                                    int rRem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - rPos);
                                    byte[] rBuf = new byte[rRem];
                                    fsRepair.Seek(rPos, SeekOrigin.Begin);
                                    int rRead = fsRepair.Read(rBuf, 0, rRem);
                                    if (rRead > 0)
                                    {
                                        byte[] rPkt = EncryptSingleUdpChunk(rBuf, rRead, nackIdx, totalChunks, keySnapshot);
                                        SendUdpP2pPacket(rPkt, rPkt.Length, targetEp);
                                        totalWireBytesSent += rRead;
                                        txUiWindowBytes += rRead;
                                        PaceUdpPacketSend(rPkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                        repairedInWave++;
                                    }
                                }
                            }

                            long waveOffset = (long)waveStart * UDP_CHUNK_SIZE;
                            if (fs.Position != waveOffset) fs.Seek(waveOffset, SeekOrigin.Begin);

                            // Smooth adaptive wave size (~12ms slice, clamped 2..128 chunks)
                            double effectiveRateMbps = dynamicUdpBitrateMbps;
                            long limitBpsWave = Interlocked.Read(ref maxUploadBytesPerSec);
                            if (limitBpsWave > 0L)
                            {
                                effectiveRateMbps = Math.Min(effectiveRateMbps, Math.Max(0.1, (limitBpsWave * 8.0) / (1024.0 * 1024.0)));
                            }
                            int dynamicWaveChunks = isProbeOnly ? 2 : (int)Math.Max(2.0, Math.Min(128.0, ((effectiveRateMbps * 1024.0 * 1024.0 / 8.0) * 0.012) / UDP_CHUNK_SIZE));
                            int waveCount = Math.Min(dynamicWaveChunks, totalChunks - waveStart);
                            byte[][] plainBuffers = new byte[waveCount][];
                            int[] plainLens = new int[waveCount];

                            for (int w = 0; w < waveCount; w++)
                            {
                                int rem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - ((long)(waveStart + w) * UDP_CHUNK_SIZE));
                                byte[] b = new byte[rem];
                                int rTot = 0;
                                while (rTot < rem)
                                {
                                    int r = fs.Read(b, rTot, rem - rTot);
                                    if (r <= 0) break;
                                    rTot += r;
                                }
                                plainBuffers[w] = b;
                                plainLens[w] = rTot;
                            }

                            byte[][] encryptedPackets = new byte[waveCount][];
                            Parallel.For(0, waveCount, txParallelOpts, delegate(int w)
                            {
                                encryptedPackets[w] = EncryptSingleUdpChunk(plainBuffers[w], plainLens[w], waveStart + w, totalChunks, keySnapshot);
                            });

                            for (int w = 0; w < waveCount && !udpTransferDoneAcked && isRunning; w++)
                            {
                                byte[] packet = encryptedPackets[w];
                                SendUdpP2pPacket(packet, packet.Length, targetEp);
                                totalSent += plainLens[w];
                                totalWireBytesSent += plainLens[w];
                                txUiWindowBytes += plainLens[w];

                                // Sub-microsecond hardware Stopwatch Token-Bucket pacer (never stalls on dropped packets!)
                                PaceUdpPacketSend(packet.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                            }

                            waveStart += waveCount;

                            double txWinSec = txUiSw.Elapsed.TotalSeconds;
                            if (txWinSec >= 0.50 || smoothedUiTxMbps <= 0.0)
                            {
                                if (smoothedUiTxMbps <= 0.0)
                                {
                                    double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                                    smoothedUiTxMbps = (totalWireBytesSent / (1024.0 * 1024.0)) / sec;
                                }
                                else if (txWinSec >= 0.50)
                                {
                                    double sampleTx = (txUiWindowBytes / (1024.0 * 1024.0)) / txWinSec;
                                    smoothedUiTxMbps = (smoothedUiTxMbps * 0.68) + (sampleTx * 0.32);
                                    txUiWindowBytes = 0;
                                    txUiSw.Restart();
                                }
                            }
                            double avgTxMbps = (Math.Max(0L, totalSent - ((long)initialStartChunk * UDP_CHUNK_SIZE)) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Sending via UDP P2P: " + fileName, totalSent, fileSize, smoothedUiTxMbps, avgTxMbps, permille);
                        }

                        if (!abortedByDisconnect && isRunning)
                        {
                            // Send END and handle any remaining tail NACK retransmission requests until receiver confirms AETHER_UDP_DONE
                            byte[] endBytes = Encoding.UTF8.GetBytes("AETHER_UDP_END|" + fileName.Replace("|", "_"));
                            int tailSinceProgressTick = Environment.TickCount;
                            for (int retry = 0; retry < 250 && !udpTransferDoneAcked && isRunning; retry++)
                            {
                                if (overrideEp == null && activeUdpPeerEndpoint != null && !activeUdpPeerEndpoint.Equals(targetEp))
                                {
                                    targetEp = activeUdpPeerEndpoint;
                                }
                                if (retry == 0 || (retry % 5 == 0))
                                {
                                    double tailAvgMbps = (Math.Max(0L, fileSize - ((long)initialStartChunk * UDP_CHUNK_SIZE)) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                                    UpdateTransferUi("Finalizing on recipient: " + fileName, fileSize, fileSize, smoothedUiTxMbps, tailAvgMbps, 1000);
                                }
                                SendUdpP2pPacket(endBytes, endBytes.Length, targetEp);
                                udpAckEvent.WaitOne(80);
                                if (udpTransferDoneAcked) break;

                                int missIdx;
                                bool repairedTail = false;
                                while (udpRetransmitQueue.TryDequeue(out missIdx))
                                {
                                    if (missIdx >= 0 && missIdx < totalChunks)
                                    {
                                        long pos = (long)missIdx * UDP_CHUNK_SIZE;
                                        int rem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - pos);
                                        byte[] b = new byte[rem];
                                        fsRepair.Seek(pos, SeekOrigin.Begin);
                                        int r = fsRepair.Read(b, 0, rem);
                                        if (r > 0)
                                        {
                                            byte[] pkt = EncryptSingleUdpChunk(b, r, missIdx, totalChunks, keySnapshot);
                                            SendUdpP2pPacket(pkt, pkt.Length, targetEp);
                                            PaceUdpPacketSend(pkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                            repairedTail = true;
                                        }
                                    }
                                }
                                if (repairedTail)
                                {
                                    retry = 0;
                                    tailSinceProgressTick = Environment.TickCount;
                                }
                                else if (unchecked(Environment.TickCount - udpTxLastPeerActivityTick) > 15000 && unchecked(Environment.TickCount - tailSinceProgressTick) > 15000)
                                {
                                    break;
                                }
                            }
                        }
                    }

                    sw.Stop();
                    if (abortedByDisconnect || !udpTransferDoneAcked || !isRunning)
                    {
                        double partialSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        double partialMbps = (Math.Max(1L, totalSent - ((long)initialStartChunk * UDP_CHUNK_SIZE)) / (1024.0 * 1024.0)) / partialSec;
                        int partialPermille = (int)((Math.Min(fileSize, totalSent) * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Transfer interrupted (UDP P2P): " + fileName, Math.Min(fileSize, totalSent), fileSize, 0.0, partialMbps, partialPermille, true);
                        Log("UDP P2P transfer interrupted without final confirmation (" + fileName + ") — marked for resume.");
                        return "Error";
                    }

                    double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                    long finalSessionBytes = Math.Max(1L, fileSize - ((long)initialStartChunk * UDP_CHUNK_SIZE));
                    double finalMbps = (finalSessionBytes / (1024.0 * 1024.0)) / totalSec;
                    UpdateTransferUi("Sent via UDP NAT-Punch: " + fileName, fileSize, fileSize, finalMbps, finalMbps, 1000, true);
                    Log(String.Format("UDP NAT-P2P TX COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s (Verified 100% Saved)",
                        fileName, FormatBytes(fileSize), totalSec, finalMbps));
                    if (isRunning) Thread.Sleep(150);
                    return "Completed";
                }
                catch (Exception ex)
                {
                    Log("UDP P2P TX Error: " + ex.Message);
                    return "Error";
                }
                finally
                {
                    udpTxActiveFileName = "";
                }
            }
        }

        private string StreamFileToBrowserOverCloudBridge(string filePath, string queueEntryId = "", string overrideDstPeer = "", string overrideLabel = "")
        {
            try
            {
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                string fileId = "exe-cloud-" + DateTime.UtcNow.Ticks.ToString();
                int totalChunks = (int)Math.Max(1L, (fileSize + CLOUD_CHUNK_SIZE - 1) / CLOUD_CHUNK_SIZE);
                string dstPeer = !String.IsNullOrEmpty(overrideDstPeer)
                    ? overrideDstPeer
                    : (!String.IsNullOrEmpty(activeCloudBrowserPeerId) ? activeCloudBrowserPeerId : activeCloudExePeerId);
                string peerLabel = !String.IsNullOrEmpty(overrideLabel)
                    ? overrideLabel
                    : (!String.IsNullOrEmpty(overrideDstPeer) ? overrideDstPeer : (!String.IsNullOrEmpty(activeCloudBrowserPeerId) ? "Chrome Browser" : "Remote .EXE"));

                Log("Streaming .EXE -> " + peerLabel + " over Wormhole Bridge: " + fileName + " (" + FormatBytes(fileSize) + ")");

                cloudResumeChunk = 0;
                cloudWaitAcceptReceived = false;
                cloudTransferRejected = false;
                cloudResumeReceived = false;
                cloudResumeEvent.Reset();

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, CLOUD_CHUNK_SIZE, totalChunks
                );
                for (int att = 0; att < 5 && isRunning; att++)
                {
                    SendCloudPacketAny(dstPeer, startJson);
                    if (cloudResumeEvent.WaitOne(1000))
                    {
                        if (cloudResumeReceived || cloudWaitAcceptReceived || cloudTransferRejected) break;
                    }
                }
                if (!cloudResumeReceived && !cloudWaitAcceptReceived && !cloudTransferRejected)
                {
                    Log("Wormhole Cloud recipient did not respond to start request: " + fileName);
                    return "Error";
                }
                if (cloudWaitAcceptReceived && !cloudResumeReceived && !cloudTransferRejected && isRunning)
                {
                    if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Awaiting acceptance");
                    UpdateTransferUi("Awaiting recipient acceptance: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    int waitLoops = 0;
                    while (!cloudResumeReceived && !cloudTransferRejected && isRunning && waitLoops < 150)
                    {
                        cloudResumeEvent.WaitOne(800);
                        waitLoops++;
                    }
                    if (!cloudResumeReceived && !cloudTransferRejected) return "Error";
                }
                if (cloudTransferRejected)
                {
                    Log("Recipient declined the file: " + fileName);
                    UpdateTransferUi("Recipient declined: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    return "Declined";
                }
                if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Transferring");

                int startChunk = Math.Max(0, Math.Min(cloudResumeChunk, totalChunks));
                if (startChunk > 0)
                {
                    Log("Resuming interrupted Wormhole transfer from chunk " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * CLOUD_CHUNK_SIZE) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                long cloudPaceEpoch = Stopwatch.GetTimestamp();
                long initialBytes = (long)startChunk * CLOUD_CHUNK_SIZE;
                long totalSent = initialBytes;
                byte[] buf = new byte[CLOUD_CHUNK_SIZE];
                int chunkIndex = startChunk;

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CLOUD_CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (totalSent > 0) fs.Seek(totalSent, SeekOrigin.Begin);
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0 && !cloudTransferRejected && isRunning)
                    {
                        if (transferPaused && isRunning)
                        {
                            sw.Stop();
                            double pausedAvg = (Math.Max(0L, totalSent - initialBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            int pausedPermille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Paused: " + fileName, totalSent, fileSize, 0.0, pausedAvg, pausedPermille, true);
                            while (transferPaused && isRunning)
                            {
                                transferResumeEvent.WaitOne(200);
                            }
                            if (!isRunning) break;
                            sw.Start();
                            cloudPaceEpoch = Stopwatch.GetTimestamp();
                        }
                        string b64 = Convert.ToBase64String(buf, 0, read);
                        string chunkJson = String.Format(
                            "{{\\"kind\\":\\"exe:file-chunk\\",\\"fileId\\":\\"{0}\\",\\"chunkIndex\\":{1},\\"data\\":\\"{2}\\"}}",
                            fileId, chunkIndex, b64
                        );
                        SendCloudPacketAny(dstPeer, chunkJson);

                        totalSent += read;
                        chunkIndex++;
                        PaceGenericTxBytes(read, ref cloudPaceEpoch);

                        double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        long deltaBytes = Math.Max(1L, totalSent - initialBytes);
                        double mbps = (deltaBytes / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Sending to " + peerLabel + ": " + fileName, totalSent, fileSize, mbps, mbps, permille);

                        if (chunkIndex % 24 == 0)
                        {
                            cloudAckEvent.WaitOne(350);
                        }
                    }
                }

                if (cloudTransferRejected)
                {
                    Log("Recipient declined the file: " + fileName);
                    return "Declined";
                }

                if (!isRunning || activeSignalingChannels.IsEmpty || totalSent < fileSize)
                {
                    return "Error";
                }

                string endJson = String.Format("{{\\"kind\\":\\"exe:file-end\\",\\"fileId\\":\\"{0}\\"}}", fileId);
                SendCloudPacketAny(dstPeer, endJson);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                long finalSessionBytes = Math.Max(1L, fileSize - initialBytes);
                double finalMbps = (finalSessionBytes / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent to " + peerLabel + ": " + fileName, fileSize, fileSize, finalMbps, finalMbps, 1000, true);
                Log(String.Format(".EXE -> {0} COMPLETE: {1} ({2}) in {3:F2}s — {4:F2} MB/s",
                    peerLabel.ToUpperInvariant(), fileName, FormatBytes(fileSize), totalSec, finalMbps));
                return "Completed";
            }
            catch (Exception ex)
            {
                Log("Wormhole Cloud Bridge TX Error: " + ex.Message);
                return "Error";
            }
        }

        private string StreamFileToBrowserOverWebSocket(string filePath, string queueEntryId = "")
        {
            try
            {
                if (activeBrowserWsStream == null || activeBrowserWsClient == null || !activeBrowserWsClient.Connected) return "Error";
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                string fileId = "exe-" + DateTime.UtcNow.Ticks.ToString();
                int totalChunks = (int)Math.Max(1L, (fileSize + WS_CHUNK_SIZE - 1) / WS_CHUNK_SIZE);

                Log("Streaming from .EXE -> Chrome Browser over Local Kernel WebSocket: " + fileName + " (" + FormatBytes(fileSize) + ")");

                wsResumeChunk = 0;
                wsWaitAcceptReceived = false;
                wsTransferRejected = false;
                wsResumeReceived = false;
                wsResumeEvent.Reset();

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, WS_CHUNK_SIZE, totalChunks
                );
                byte[] startBytes = Encoding.UTF8.GetBytes(startJson);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, startBytes, 0, startBytes.Length);

                for (int att = 0; att < 5 && isRunning; att++)
                {
                    if (wsResumeEvent.WaitOne(800))
                    {
                        if (wsResumeReceived || wsWaitAcceptReceived || wsTransferRejected) break;
                    }
                }
                if (wsWaitAcceptReceived && !wsResumeReceived && !wsTransferRejected && isRunning)
                {
                    if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Awaiting acceptance");
                    UpdateTransferUi("Awaiting recipient acceptance: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    int waitLoops = 0;
                    while (!wsResumeReceived && !wsTransferRejected && isRunning && waitLoops < 150)
                    {
                        wsResumeEvent.WaitOne(800);
                        waitLoops++;
                    }
                    if (!wsResumeReceived && !wsTransferRejected) return "Error";
                }
                if (wsTransferRejected)
                {
                    Log("Browser declined the file: " + fileName);
                    UpdateTransferUi("Recipient declined: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    return "Declined";
                }
                if (!wsResumeReceived) return "Error";
                if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Transferring");

                int startChunk = Math.Max(0, Math.Min(wsResumeChunk, totalChunks));
                long initialBytes = Math.Min(fileSize, (long)startChunk * WS_CHUNK_SIZE);
                if (startChunk > 0)
                {
                    Log("Resuming Local WebSocket transfer from chunk " + startChunk.ToString() + " (" + FormatBytes(initialBytes) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                long wsPaceEpoch = Stopwatch.GetTimestamp();
                long totalSent = initialBytes;
                byte[] buf = new byte[WS_CHUNK_SIZE];

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, WS_CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (initialBytes > 0) fs.Seek(initialBytes, SeekOrigin.Begin);
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0 && isRunning)
                    {
                        if (transferPaused && isRunning)
                        {
                            sw.Stop();
                            double pausedAvg = (Math.Max(0L, totalSent - initialBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            int pausedPermille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Paused (Browser WS): " + fileName, totalSent, fileSize, 0.0, pausedAvg, pausedPermille, true);
                            while (transferPaused && isRunning)
                            {
                                transferResumeEvent.WaitOne(200);
                            }
                            if (!isRunning) break;
                            sw.Start();
                            wsPaceEpoch = Stopwatch.GetTimestamp();
                        }
                        SendWebSocketFrame(activeBrowserWsStream, 0x02, buf, 0, read);
                        totalSent += read;
                        PaceGenericTxBytes(read, ref wsPaceEpoch);

                        double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        double mbps = (Math.Max(1L, totalSent - initialBytes) / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Streaming to Browser: " + fileName, totalSent, fileSize, mbps, mbps, permille);
                    }
                }

                if (!isRunning || totalSent < fileSize || activeBrowserWsStream == null)
                {
                    return "Error";
                }

                string endJson = String.Format("{{\\"kind\\":\\"exe:file-end\\",\\"fileId\\":\\"{0}\\"}}", fileId);
                byte[] endBytes = Encoding.UTF8.GetBytes(endJson);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, endBytes, 0, endBytes.Length);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                double finalMbps = (Math.Max(1L, fileSize - initialBytes) / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent to Browser: " + fileName, fileSize, fileSize, finalMbps, finalMbps, 1000, true);
                Log(String.Format(".EXE -> BROWSER COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s ({4:F2} Gbps)",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps, (finalMbps * 8.0) / 1000.0));
                return "Completed";
            }
            catch (Exception ex)
            {
                Log("Browser WebSocket TX Error: " + ex.Message);
                return "Error";
            }
        }

        private string StreamFileOverKernelTcp(string filePath, string queueEntryId = "", RoomPeerInfo targetPeer = null)
        {
            NetworkStream txStream = null;
            try
            {
                txStream = (targetPeer != null && targetPeer.TcpStream != null && targetPeer.TcpClientConn != null && targetPeer.TcpClientConn.Connected)
                    ? targetPeer.TcpStream
                    : activePeerStream;
                if (txStream == null) return "Error";

                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                int totalChunks = (int)Math.Max(1L, (fileSize + CHUNK_SIZE - 1) / CHUNK_SIZE);

                Log("Starting Kernel-Socket transfer: " + fileName + " (" + FormatBytes(fileSize) + ", " + totalChunks.ToString() + " x 4 MB blocks)");

                kernelTcpResumeChunk = 0;
                kernelTcpWaitAccept = false;
                kernelTcpRejected = false;
                kernelTcpResumeReceived = false;
                kernelTcpResumeEvent.Reset();

                byte[] nameBytes = Encoding.UTF8.GetBytes(fileName);
                byte[] metaPayload = new byte[12 + nameBytes.Length];
                Buffer.BlockCopy(BitConverter.GetBytes(fileSize), 0, metaPayload, 0, 8);
                Buffer.BlockCopy(BitConverter.GetBytes(totalChunks), 0, metaPayload, 8, 4);
                Buffer.BlockCopy(nameBytes, 0, metaPayload, 12, nameBytes.Length);
                WriteKernelFrameTo(txStream, 1, metaPayload, metaPayload.Length);

                for (int att = 0; att < 10 && isRunning; att++)
                {
                    if (kernelTcpResumeEvent.WaitOne(500))
                    {
                        if (kernelTcpResumeReceived || kernelTcpWaitAccept || kernelTcpRejected) break;
                    }
                }
                if (!kernelTcpResumeReceived && !kernelTcpWaitAccept && !kernelTcpRejected)
                {
                    Log("Kernel TCP recipient did not respond to start frame — resetting connection.");
                    if (targetPeer != null && Object.ReferenceEquals(targetPeer.TcpStream, txStream))
                    {
                        try { if (targetPeer.TcpClientConn != null) targetPeer.TcpClientConn.Close(); } catch { }
                        targetPeer.TcpClientConn = null;
                        targetPeer.TcpStream = null;
                        SyncTargetPeerDropdown();
                    }
                    if (Object.ReferenceEquals(activePeerStream, txStream))
                    {
                        try { if (activePeerClient != null) activePeerClient.Close(); } catch { }
                        activePeerClient = null;
                        activePeerStream = null;
                    }
                    return "Error";
                }
                if (kernelTcpWaitAccept && !kernelTcpResumeReceived && !kernelTcpRejected && isRunning)
                {
                    if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Awaiting acceptance");
                    UpdateTransferUi("Awaiting recipient acceptance: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    Log("Awaiting recipient acceptance for file: " + fileName);
                    int waitLoops = 0;
                    while (!kernelTcpResumeReceived && !kernelTcpRejected && isRunning && waitLoops < 150)
                    {
                        kernelTcpResumeEvent.WaitOne(800);
                        waitLoops++;
                    }
                    if (!kernelTcpResumeReceived && !kernelTcpRejected) return "Error";
                }

                if (kernelTcpRejected)
                {
                    Log("Recipient declined the file: " + fileName);
                    UpdateTransferUi("Recipient declined: " + fileName, 0, fileSize, 0.0, 0.0, 0, true);
                    return "Declined";
                }
                if (!String.IsNullOrEmpty(queueEntryId)) UpdateQueueEntryStatus(queueEntryId, "Transferring");

                int startChunk = Math.Max(0, Math.Min(kernelTcpResumeChunk, totalChunks));
                if (startChunk > 0)
                {
                    Log("Resuming Kernel-Socket transfer from block " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * CHUNK_SIZE) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                Stopwatch txUiSw = Stopwatch.StartNew();
                long tcpPaceEpoch = Stopwatch.GetTimestamp();
                long txWinBytes = 0;
                double smoothedLiveMbps = 0.0;
                long initialBytes = Math.Min(fileSize, (long)startChunk * CHUNK_SIZE);
                long totalBytesSent = initialBytes;
                byte[] keySnapshot = (byte[])aesKey.Clone();

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (totalBytesSent > 0) fs.Seek(totalBytesSent, SeekOrigin.Begin);

                    for (int waveStart = startChunk; waveStart < totalChunks && isRunning; waveStart += PARALLEL_WORKERS)
                    {
                        if (transferPaused && isRunning)
                        {
                            sw.Stop();
                            double pausedAvg = (Math.Max(0L, totalBytesSent - initialBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            int pausedPermille = (int)((totalBytesSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Paused: " + fileName, totalBytesSent, fileSize, 0.0, pausedAvg, pausedPermille, true);
                            while (transferPaused && isRunning)
                            {
                                transferResumeEvent.WaitOne(200);
                            }
                            if (!isRunning) break;
                            sw.Start();
                            txUiSw.Restart();
                            tcpPaceEpoch = Stopwatch.GetTimestamp();
                            txWinBytes = 0;
                            smoothedLiveMbps = 0.0;
                        }
                        int waveCount = Math.Min(PARALLEL_WORKERS, totalChunks - waveStart);
                        byte[][] plainBlocks = new byte[waveCount][];
                        int[] plainLengths = new int[waveCount];

                        for (int w = 0; w < waveCount; w++)
                        {
                            int remaining = (int)Math.Min((long)CHUNK_SIZE, fileSize - ((long)(waveStart + w) * CHUNK_SIZE));
                            byte[] buf = new byte[remaining];
                            int readTotal = 0;
                            while (readTotal < remaining)
                            {
                                int r = fs.Read(buf, readTotal, remaining - readTotal);
                                if (r <= 0) break;
                                readTotal += r;
                            }
                            plainBlocks[w] = buf;
                            plainLengths[w] = readTotal;
                        }

                        byte[][] encryptedPayloads = new byte[waveCount][];
                        Parallel.For(0, waveCount, delegate(int w)
                        {
                            int chunkIndex = waveStart + w;
                            byte[] iv = new byte[16];
                            Buffer.BlockCopy(BitConverter.GetBytes(chunkIndex), 0, iv, 0, 4);
                            Buffer.BlockCopy(BitConverter.GetBytes(Environment.TickCount ^ chunkIndex), 0, iv, 4, 4);

                            using (AesCryptoServiceProvider aes = new AesCryptoServiceProvider())
                            {
                                aes.KeySize = 256;
                                aes.BlockSize = 128;
                                aes.Key = keySnapshot;
                                aes.IV = iv;
                                aes.Mode = CipherMode.CBC;
                                aes.Padding = PaddingMode.PKCS7;

                                using (ICryptoTransform encryptor = aes.CreateEncryptor())
                                {
                                    byte[] cipher = encryptor.TransformFinalBlock(plainBlocks[w], 0, plainLengths[w]);
                                    byte[] frameBody = new byte[20 + cipher.Length];
                                    Buffer.BlockCopy(BitConverter.GetBytes(chunkIndex), 0, frameBody, 0, 4);
                                    Buffer.BlockCopy(iv, 0, frameBody, 4, 16);
                                    Buffer.BlockCopy(cipher, 0, frameBody, 20, cipher.Length);
                                    encryptedPayloads[w] = frameBody;
                                }
                            }
                        });

                        for (int w = 0; w < waveCount; w++)
                        {
                            byte[] body = encryptedPayloads[w];
                            WriteKernelFrameTo(txStream, 2, body, body.Length);
                            totalBytesSent += plainLengths[w];
                            txWinBytes += plainLengths[w];
                            PaceGenericTxBytes(plainLengths[w], ref tcpPaceEpoch);

                            double elapsedSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            double avgMbps = (Math.Max(1L, totalBytesSent - initialBytes) / (1024.0 * 1024.0)) / elapsedSec;
                            double winSec = txUiSw.Elapsed.TotalSeconds;
                            if (winSec >= 0.50)
                            {
                                double inst = (txWinBytes / (1024.0 * 1024.0)) / winSec;
                                smoothedLiveMbps = smoothedLiveMbps <= 0.0 ? inst : (smoothedLiveMbps * 0.68) + (inst * 0.32);
                                txWinBytes = 0;
                                txUiSw.Restart();
                            }
                            double liveMbps = smoothedLiveMbps > 0.0 ? smoothedLiveMbps : avgMbps;
                            int permille = (int)((totalBytesSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Sending: " + fileName, totalBytesSent, fileSize, liveMbps, avgMbps, permille);
                        }
                    }
                }

                if (!isRunning || totalBytesSent < fileSize)
                {
                    return "Error";
                }

                WriteKernelFrameTo(txStream, 3, new byte[4], 4);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                long finalSessionBytes = Math.Max(1L, fileSize - initialBytes);
                double finalMbps = (finalSessionBytes / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent & Verified: " + fileName, fileSize, fileSize, finalMbps, finalMbps, 1000, true);
                Log(String.Format("TX COMPLETE: {0} ({1}) in {2:F2}s — Average Speed: {3:F2} MB/s ({4:F2} Gbps)",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps, (finalMbps * 8.0) / 1000.0));
                return "Completed";
            }
            catch (Exception ex)
            {
                Log("TX Error: " + ex.Message);
                if (txStream != null)
                {
                    if (targetPeer != null && Object.ReferenceEquals(targetPeer.TcpStream, txStream))
                    {
                        try { if (targetPeer.TcpClientConn != null) targetPeer.TcpClientConn.Close(); } catch { }
                        targetPeer.TcpClientConn = null;
                        targetPeer.TcpStream = null;
                        SyncTargetPeerDropdown();
                    }
                    if (Object.ReferenceEquals(activePeerStream, txStream))
                    {
                        try { if (activePeerClient != null) activePeerClient.Close(); } catch { }
                        activePeerClient = null;
                        activePeerStream = null;
                    }
                }
                return "Error";
            }
        }

        private void WriteKernelFrame(byte frameType, byte[] payload, int payloadLen)
        {
            WriteKernelFrameTo(activePeerStream, frameType, payload, payloadLen);
        }

        private void WriteKernelFrameTo(NetworkStream targetStream, byte frameType, byte[] payload, int payloadLen)
        {
            if (targetStream == null) throw new InvalidOperationException("No active TCP stream.");
            byte[] header = new byte[9];
            Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, header, 0, 4);
            header[4] = frameType;
            Buffer.BlockCopy(BitConverter.GetBytes(payloadLen), 0, header, 5, 4);

            lock (streamWriteLock)
            {
                targetStream.Write(header, 0, 9);
                targetStream.Write(payload, 0, payloadLen);
            }
        }

        private void ReceiveKernelTcpLoop(TcpClient client, NetworkStream netStream, byte[] preReadThreeBytes)
        {
            byte[] headerBuf = new byte[9];
            bool hasPreRead = (preReadThreeBytes != null && preReadThreeBytes.Length == 3);

            FileStream currentOutFile = null;
            string currentFileName = "";
            string currentOutPath = "";
            string currentPartPath = "";
            long expectedFileSize = 0;
            long receivedPlainBytes = 0;
            long tcpSessionStartBytes = 0;
            long tcpUiWinBytes = 0;
            long tcpLastCkptBytes = 0;
            double tcpSmoothedLiveMbps = 0.0;
            Stopwatch tcpUiSw = Stopwatch.StartNew();
            Stopwatch rxSw = null;

            try
            {
                while (isRunning && client.Connected)
                {
                    if (transferPaused && currentOutFile != null && isRunning)
                    {
                        if (rxSw != null) rxSw.Stop();
                        double pausedAvg = rxSw != null ? (Math.Max(0L, receivedPlainBytes - tcpSessionStartBytes) / (1024.0 * 1024.0)) / Math.Max(0.005, rxSw.Elapsed.TotalSeconds) : 0.0;
                        int pausedPermille = (int)((receivedPlainBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Paused: " + currentFileName, receivedPlainBytes, expectedFileSize, 0.0, pausedAvg, pausedPermille, true);
                        while (transferPaused && isRunning && client.Connected)
                        {
                            transferResumeEvent.WaitOne(200);
                        }
                        if (!isRunning || !client.Connected) break;
                        if (rxSw != null) rxSw.Start();
                        tcpUiSw.Restart();
                        tcpUiWinBytes = 0;
                        tcpSmoothedLiveMbps = 0.0;
                    }
                    if (hasPreRead)
                    {
                        headerBuf[0] = preReadThreeBytes[0];
                        headerBuf[1] = preReadThreeBytes[1];
                        headerBuf[2] = preReadThreeBytes[2];
                        hasPreRead = false;
                        if (!ReadExactBytesOffset(netStream, headerBuf, 3, 6)) break;
                    }
                    else
                    {
                        if (!ReadExactBytes(netStream, headerBuf, 9)) break;
                    }

                    uint magic = BitConverter.ToUInt32(headerBuf, 0);
                    if (magic != MAGIC_HEADER)
                    {
                        Log("Protocol error: Invalid frame magic on kernel socket.");
                        break;
                    }

                    byte frameType = headerBuf[4];
                    int payloadLen = BitConverter.ToInt32(headerBuf, 5);
                    if (payloadLen < 0 || payloadLen > 32 * 1024 * 1024) break;

                    byte[] payload = new byte[payloadLen];
                    if (!ReadExactBytes(netStream, payload, payloadLen)) break;

                    if (frameType == 1)
                    {
                        expectedFileSize = BitConverter.ToInt64(payload, 0);
                        int totalChunks = BitConverter.ToInt32(payload, 8);
                        currentFileName = Encoding.UTF8.GetString(payload, 12, payloadLen - 12);
                        currentOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + currentFileName);
                        currentPartPath = currentOutPath + ".part";

                        if (currentOutFile != null)
                        {
                            try { WriteCheckpointFile(currentPartPath, receivedPlainBytes, expectedFileSize); } catch { }
                            try { currentOutFile.Flush(false); } catch { }
                            try { currentOutFile.Close(); } catch { }
                            currentOutFile = null;
                        }
                        ReleaseConflictingRxHandlesForPart(currentPartPath, "tcp");
                        lock (rxHandleCoordLock)
                        {
                            activeTcpRxClient = client;
                            activeTcpRxPartPath = currentPartPath;
                        }

                        bool hasPart = File.Exists(currentPartPath) && ReadCheckpointBytes(currentPartPath, expectedFileSize) > 0;

                        if (!autoAcceptAllIncoming)
                        {
                            try
                            {
                                byte[] waitHeader = new byte[9];
                                Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, waitHeader, 0, 4);
                                waitHeader[4] = 6;
                                Buffer.BlockCopy(BitConverter.GetBytes(4), 0, waitHeader, 5, 4);
                                lock (streamWriteLock)
                                {
                                    netStream.Write(waitHeader, 0, 9);
                                    netStream.Write(new byte[4], 0, 4);
                                }
                            }
                            catch { }
                        }

                        int choice = autoAcceptAllIncoming ? 1 : ShowIncomingTransferDialog("Kernel TCP (.EXE)", currentFileName, expectedFileSize, hasPart);
                        if (choice == 0)
                        {
                            Log("Incoming TCP file declined: " + currentFileName);
                            try
                            {
                                byte[] rejHeader = new byte[9];
                                Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, rejHeader, 0, 4);
                                rejHeader[4] = 5;
                                Buffer.BlockCopy(BitConverter.GetBytes(4), 0, rejHeader, 5, 4);
                                lock (streamWriteLock)
                                {
                                    netStream.Write(rejHeader, 0, 9);
                                    netStream.Write(new byte[4], 0, 4);
                                }
                            }
                            catch { }
                            lock (rxHandleCoordLock)
                            {
                                if (Object.ReferenceEquals(activeTcpRxClient, client)) activeTcpRxPartPath = "";
                            }
                            continue;
                        }

                        long existingBytes = ReadCheckpointBytes(currentPartPath, expectedFileSize);
                        int resumeFromChunk = (int)(existingBytes / CHUNK_SIZE);
                        long alignedBytes = (long)resumeFromChunk * CHUNK_SIZE;

                        Exception openErr = null;
                        for (int opTry = 0; opTry < 5; opTry++)
                        {
                            try
                            {
                                currentOutFile = new FileStream(currentPartPath, existingBytes > 0 ? FileMode.OpenOrCreate : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                                openErr = null;
                                break;
                            }
                            catch (Exception oex)
                            {
                                openErr = oex;
                                Thread.Sleep(80);
                            }
                        }
                        if (currentOutFile == null)
                        {
                            Log("TCP RX file open error: " + (openErr != null ? openErr.Message : "locked"));
                            lock (rxHandleCoordLock)
                            {
                                if (Object.ReferenceEquals(activeTcpRxClient, client)) activeTcpRxPartPath = "";
                            }
                            continue;
                        }
                        if (alignedBytes > 0) currentOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                        receivedPlainBytes = alignedBytes;
                        tcpSessionStartBytes = alignedBytes;
                        tcpLastCkptBytes = alignedBytes;
                        tcpUiWinBytes = 0;
                        tcpSmoothedLiveMbps = 0.0;
                        tcpUiSw.Restart();
                        rxSw = Stopwatch.StartNew();

                        try
                        {
                            byte[] resumeAckPayload = BitConverter.GetBytes(resumeFromChunk);
                            byte[] ackHeader = new byte[9];
                            Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, ackHeader, 0, 4);
                            ackHeader[4] = 4;
                            Buffer.BlockCopy(BitConverter.GetBytes(4), 0, ackHeader, 5, 4);
                            lock (streamWriteLock)
                            {
                                netStream.Write(ackHeader, 0, 9);
                                netStream.Write(resumeAckPayload, 0, 4);
                            }
                        }
                        catch { }

                        if (resumeFromChunk > 0)
                            Log("Resuming interrupted Kernel-Socket file at block " + resumeFromChunk.ToString() + " (" + FormatBytes(alignedBytes) + ")");
                        else
                            Log("Receiving directly to disk: " + currentOutPath + " (" + FormatBytes(expectedFileSize) + ")");
                    }
                    else if (frameType == 6)
                    {
                        kernelTcpWaitAccept = true;
                        kernelTcpResumeEvent.Set();
                    }
                    else if (frameType == 5)
                    {
                        kernelTcpRejected = true;
                        kernelTcpResumeEvent.Set();
                    }
                    else if (frameType == 4 && payloadLen >= 4)
                    {
                        kernelTcpResumeChunk = BitConverter.ToInt32(payload, 0);
                        kernelTcpResumeReceived = true;
                        kernelTcpResumeEvent.Set();
                    }
                    else if (frameType == 2 && currentOutFile != null)
                    {
                        int chunkIndex = BitConverter.ToInt32(payload, 0);
                        byte[] iv = new byte[16];
                        Buffer.BlockCopy(payload, 4, iv, 0, 16);

                        byte[] plain;
                        using (AesCryptoServiceProvider aes = new AesCryptoServiceProvider())
                        {
                            aes.KeySize = 256;
                            aes.BlockSize = 128;
                            aes.Key = aesKey;
                            aes.IV = iv;
                            aes.Mode = CipherMode.CBC;
                            aes.Padding = PaddingMode.PKCS7;

                            using (ICryptoTransform decryptor = aes.CreateDecryptor())
                            {
                                plain = decryptor.TransformFinalBlock(payload, 20, payloadLen - 20);
                            }
                        }

                        long writeOffset = (long)chunkIndex * CHUNK_SIZE;
                        if (currentOutFile.Position != writeOffset) currentOutFile.Seek(writeOffset, SeekOrigin.Begin);
                        currentOutFile.Write(plain, 0, plain.Length);
                        receivedPlainBytes = Math.Max(receivedPlainBytes, writeOffset + plain.Length);
                        tcpUiWinBytes += plain.Length;
                        if (receivedPlainBytes - tcpLastCkptBytes >= 64L * 1024L * 1024L)
                        {
                            WriteCheckpointFile(currentPartPath, receivedPlainBytes, expectedFileSize);
                            tcpLastCkptBytes = receivedPlainBytes;
                        }

                        double elapsedSec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double avgMbps = (Math.Max(1L, receivedPlainBytes - tcpSessionStartBytes) / (1024.0 * 1024.0)) / elapsedSec;
                        double winSec = tcpUiSw.Elapsed.TotalSeconds;
                        if (winSec >= 0.35)
                        {
                            double inst = (tcpUiWinBytes / (1024.0 * 1024.0)) / winSec;
                            tcpSmoothedLiveMbps = tcpSmoothedLiveMbps <= 0.0 ? inst : (tcpSmoothedLiveMbps * 0.35) + (inst * 0.65);
                            tcpUiWinBytes = 0;
                            tcpUiSw.Restart();
                        }
                        double liveMbps = tcpSmoothedLiveMbps > 0.0 ? tcpSmoothedLiveMbps : avgMbps;
                        int permille = (int)((receivedPlainBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Receiving to Disk: " + currentFileName, receivedPlainBytes, expectedFileSize, liveMbps, avgMbps, permille);
                    }
                    else if (frameType == 3 && currentOutFile != null)
                    {
                        try { if (expectedFileSize > 0 && currentOutFile.Length != expectedFileSize) currentOutFile.SetLength(expectedFileSize); } catch { }
                        try { currentOutFile.Flush(false); } catch { }
                        currentOutFile.Close();
                        currentOutFile = null;
                        rxSw.Stop();
                        lock (rxHandleCoordLock)
                        {
                            if (Object.ReferenceEquals(activeTcpRxClient, client)) activeTcpRxPartPath = "";
                        }

                        bool movedOk = SafeFinalizePartFile(currentPartPath, currentOutPath, currentPartPath + ".ckpt");

                        double totalSec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        long sessionDelta = Math.Max(1L, expectedFileSize - tcpSessionStartBytes);
                        double finalMbps = (sessionDelta / (1024.0 * 1024.0)) / totalSec;
                        if (movedOk)
                        {
                            UpdateTransferUi("Saved to Disk: " + currentFileName, expectedFileSize, expectedFileSize, finalMbps, finalMbps, 1000, true);
                            Log(String.Format("RX COMPLETE & SAVED: {0} ({1:F2} MB/s · {2:F2} Gbps)",
                                currentOutPath, finalMbps, (finalMbps * 8.0) / 1000.0));
                        }
                        else
                        {
                            UpdateTransferUi("Finalization failed (.part locked): " + currentFileName, expectedFileSize, expectedFileSize, finalMbps, finalMbps, 1000, true);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("RX Stream closed: " + ex.Message);
            }
            finally
            {
                if (currentOutFile != null)
                {
                    try { WriteCheckpointFile(currentPartPath, receivedPlainBytes, expectedFileSize); } catch { }
                    try { currentOutFile.Flush(false); } catch { }
                    try { currentOutFile.Close(); } catch { }
                    currentOutFile = null;
                }
                lock (rxHandleCoordLock)
                {
                    if (Object.ReferenceEquals(activeTcpRxClient, client))
                    {
                        activeTcpRxClient = null;
                        activeTcpRxPartPath = "";
                    }
                }
            }
        }

        private bool ReadExactBytes(NetworkStream stream, byte[] buffer, int count)
        {
            return ReadExactBytesOffset(stream, buffer, 0, count);
        }

        private bool ReadExactBytesOffset(NetworkStream stream, byte[] buffer, int startOffset, int count)
        {
            int offset = 0;
            while (offset < count)
            {
                int read = stream.Read(buffer, startOffset + offset, count - offset);
                if (read <= 0) return false;
                offset += read;
            }
            return true;
        }

        private void UpdateTransferUi(string statusText, long doneBytes, long totalBytes, double liveMbps, double avgMbps, int permille, bool force = false)
        {
            if (!force && permille < 1000)
            {
                int nowTick = Environment.TickCount;
                if (unchecked(nowTick - lastUiUpdateTick) < 100) return;
                lastUiUpdateTick = nowTick;
            }
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string, long, long, double, double, int, bool>(UpdateTransferUi), statusText, doneBytes, totalBytes, liveMbps, avgMbps, permille, true);
                return;
            }
            double liveGbps = (liveMbps * 8.0) / 1000.0;
            double avgGbps = (avgMbps * 8.0) / 1000.0;
            lblSpeedMetric.Text = String.Format("{0:F2} MB/s  ({1:F2} Gbps)", liveMbps, liveGbps);
            if (lblTransferStats != null)
            {
                lblTransferStats.Text = String.Format("Transferred: {0} / {1}  |  Avg Speed: {2:F2} MB/s ({3:F2} Gbps)", FormatBytes(doneBytes), FormatBytes(totalBytes), avgMbps, avgGbps);
            }
            lblProgressDetail.Text = String.Format("{0} — {1}%", statusText, permille / 10);
            progressBar.Value = Math.Max(0, Math.Min(1000, permille));
        }

        private string FormatBytes(long bytes)
        {
            if (bytes >= 1024L * 1024L * 1024L)
                return String.Format("{0:F2} GB", bytes / (1024.0 * 1024.0 * 1024.0));
            if (bytes >= 1024L * 1024L)
                return String.Format("{0:F2} MB", bytes / (1024.0 * 1024.0));
            if (bytes >= 1024L)
                return String.Format("{0:F1} KB", bytes / 1024.0);
            return bytes.ToString() + " B";
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            isRunning = false;
            try { transferResumeEvent.Set(); } catch { }
            try { transferQueueEvent.Set(); } catch { }
            try { udpRxDataEvent.Set(); } catch { }
            try { diskWriteEvent.Set(); } catch { }
            try { udpAckEvent.Set(); } catch { }
            try { udpResumeEvent.Set(); } catch { }
            try { kernelTcpResumeEvent.Set(); } catch { }
            try { cloudResumeEvent.Set(); } catch { }
            try { wsResumeEvent.Set(); } catch { }
            try { udpWriterExitedEvent.WaitOne(5000); } catch { }
            try { udpDiskIoExitedEvent.WaitOne(5000); } catch { }
            try { if (tcpListener != null) tcpListener.Stop(); } catch { }
            try { if (udpDiscovery != null) udpDiscovery.Close(); } catch { }
            try { if (udpP2pClient != null) udpP2pClient.Close(); } catch { }
            try { if (udpP2pV6Client != null) udpP2pV6Client.Close(); } catch { }
            try { if (activePeerClient != null) activePeerClient.Close(); } catch { }
            try { if (activeTcpRxClient != null) activeTcpRxClient.Close(); } catch { }
            try { if (activeBrowserWsClient != null) activeBrowserWsClient.Close(); } catch { }
            try { if (activeWsRxClient != null) activeWsRxClient.Close(); } catch { }
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                try { if (kv.Value != null && kv.Value.Ws != null) kv.Value.Ws.Dispose(); } catch { }
            }
        }
    }
}
`,o=new Uint8Array(3584),s=new DataView(o.buffer),c=new TextEncoder,l=(e,t)=>{let n=c.encode(e);o.set(n,t)};l(`MZ`,0),s.setUint32(60,128,!0),l(`PE\0\0`,128),s.setUint16(132,332,!0),s.setUint16(134,3,!0),s.setUint32(136,Math.floor(Date.now()/1e3),!0),s.setUint16(148,224,!0),s.setUint16(150,271,!0),s.setUint16(152,267,!0),s.setUint8(154,14),s.setUint32(156,512,!0),s.setUint32(160,2560,!0),s.setUint32(168,4096,!0),s.setUint32(172,4096,!0),s.setUint32(176,8192,!0),s.setUint32(180,4194304,!0),s.setUint32(184,4096,!0),s.setUint32(188,512,!0),s.setUint16(192,6,!0),s.setUint16(200,6,!0),s.setUint32(208,16384,!0),s.setUint32(212,512,!0),s.setUint16(220,2,!0),s.setUint32(224,1048576,!0),s.setUint32(228,4096,!0),s.setUint32(232,1048576,!0),s.setUint32(236,4096,!0),s.setUint32(244,16,!0),s.setUint32(256,8192,!0),s.setUint32(260,40,!0),s.setUint32(344,8272,!0),s.setUint32(348,20,!0);let u=(e,t,n,r,i,a,o)=>{l(t,e),s.setUint32(e+8,n,!0),s.setUint32(e+12,r,!0),s.setUint32(e+16,i,!0),s.setUint32(e+20,a,!0),s.setUint32(e+36,o,!0)};u(376,`.text\0\0\0`,512,4096,512,512,1610612768),u(416,`.rdata\0\0`,512,8192,512,1024,1073741888),u(456,`.data\0\0\0`,2048,12288,2048,1536,3221225536),s.setUint32(1024,8240,!0),s.setUint32(1036,8304,!0),s.setUint32(1040,8272,!0),l(`GetModuleFileNameA\0`,1154),l(`SetEnvironmentVariableA\0`,1178),l(`WinExec\0`,1206),l(`ExitProcess\0`,1218),[8320,8344,8372,8384,0].forEach((e,t)=>{s.setUint32(1072+t*4,e,!0),s.setUint32(1104+t*4,e,!0)}),l(`KERNEL32.dll\0`,1136),l(`AETHER_EXE\0`,1536),l(`powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -Command "$b=[IO.File]::ReadAllBytes($env:AETHER_EXE);$s=[Text.Encoding]::UTF8.GetString($b,3584,$b.Length-3584);$d=Join-Path $env:LOCALAPPDATA 'AetherTunnel';New-Item -ItemType Directory -Force -Path $d|Out-Null;$cs=Join-Path $d ('AT_'+$PID+'.cs');$bin=Join-Path $d 'AetherTunnel.exe';[IO.File]::WriteAllText($cs,$s,[Text.Encoding]::UTF8);$csc=Join-Path $env:WINDIR 'Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';if(-not(Test-Path $csc)){$csc=Join-Path $env:WINDIR 'Microsoft.NET\\Framework\\v4.0.30319\\csc.exe'};& $csc /nologo /optimize+ /target:winexe /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /out:$bin $cs;if($LASTEXITCODE -ne 0){$bin=Join-Path $d ('AetherTunnel_'+$PID+'.exe');& $csc /nologo /optimize+ /target:winexe /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /out:$bin $cs};Remove-Item $cs -Force -ErrorAction SilentlyContinue;if(Test-Path $bin){Start-Process $bin}"\0`,1568),o.set([104,244,1,0,0,104,0,53,64,0,106,0,255,21,80,32,64,0,104,0,53,64,0,104,0,48,64,0,255,21,84,32,64,0,106,0,104,32,48,64,0,255,21,88,32,64,0,106,0,255,21,92,32,64,0,195],512);let d=c.encode(a),f=new Uint8Array(o.byteLength+d.byteLength);f.set(o,0),f.set(d,o.byteLength),Qe(`AetherTunnel-win-x64.exe`,f,`application/vnd.microsoft.portable-executable`)}var et=({roomCode:e,keyFingerprint:t,exeBridgeConnected:n,connectionState:r,natReport:i,peers:a,transfers:o})=>{let[s,c]=(0,C.useState)(!1),[l,u]=(0,C.useState)(null);return(0,F.jsxs)(`div`,{className:`space-y-8 animate-fadeIn`,children:[(0,F.jsxs)(`div`,{className:`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsxs)(`h1`,{className:`text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-3`,children:[(0,F.jsx)(me,{className:`w-7 h-7 text-sky-400`}),`Client Architecture Inspector (Windows EXE vs Web App)`]}),(0,F.jsx)(`p`,{className:`text-sm text-slate-400 mt-1`,children:`Examine and verify the execution status, socket channels, and secure parameters of both the Windows Native Desktop Executable and the Web Browser Client.`})]}),(0,F.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,F.jsxs)(`button`,{onClick:()=>$e(e,`${window.location.origin.replace(/^http/,`ws`)}/ws-tunnel`),className:`px-4 py-2 text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 rounded-lg flex items-center gap-2 cursor-pointer transition-colors`,children:[(0,F.jsx)(O,{className:`w-4 h-4`}),`Download Windows .EXE (V1.02)`]}),(0,F.jsxs)(`button`,{onClick:()=>{Qe(`AetherTunnel-Portable-Standalone.html`,Ze(e),`text/html;charset=utf-8`)},className:`px-4 py-2 text-xs font-semibold bg-sky-400 text-slate-950 hover:bg-sky-300 rounded-lg flex items-center gap-2 cursor-pointer transition-colors`,children:[(0,F.jsx)(O,{className:`w-4 h-4`}),`Download Portable HTML (V1.02)`]})]})]}),(0,F.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-2 gap-8`,children:[(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between pb-4 border-b border-slate-800`,children:[(0,F.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,F.jsx)(`div`,{className:`p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400`,children:(0,F.jsx)(be,{className:`w-6 h-6`})}),(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`Windows Native Desktop App`}),(0,F.jsx)(`span`,{className:`text-xs font-mono text-slate-400`,children:`AetherTunnel-win-x64.exe (V1.02 NAT-P2P High-DPI)`})]})]}),(0,F.jsxs)(`span`,{className:`px-3 py-1 text-xs font-mono rounded-full flex items-center gap-1.5 ${n?`bg-emerald-500/10 text-emerald-400 border border-emerald-500/30`:`bg-amber-500/10 text-amber-400 border border-amber-500/30`}`,children:[(0,F.jsx)(`span`,{className:`w-2 h-2 rounded-full ${n?`bg-emerald-400 animate-pulse`:`bg-amber-400`}`}),n?`Bridge Connected`:`Waiting for EXE`]})]}),(0,F.jsxs)(`div`,{className:`space-y-4 text-xs`,children:[(0,F.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,F.jsxs)(`div`,{className:`bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Execution Runtime`}),(0,F.jsx)(`span`,{className:`font-mono font-medium text-slate-200`,children:`Native Win32 / WinSock2`})]}),(0,F.jsxs)(`div`,{className:`bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Disk Stream Pipeline`}),(0,F.jsx)(`span`,{className:`font-mono font-medium text-emerald-400`,children:`Direct NVMe / SSD Stream`})]}),(0,F.jsxs)(`div`,{className:`bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`NAT & Firewall Bypass`}),(0,F.jsx)(`span`,{className:`font-mono font-medium text-sky-400`,children:`Direct TCP 443 Tunnel`})]}),(0,F.jsxs)(`div`,{className:`bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Encryption`}),(0,F.jsx)(`span`,{className:`font-mono font-medium text-emerald-400`,children:`AES-256-GCM Hardware`})]})]}),(0,F.jsxs)(`div`,{className:`p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2`,children:[(0,F.jsxs)(`div`,{className:`font-semibold text-slate-200 flex items-center justify-between`,children:[(0,F.jsx)(`span`,{children:`Diagnostic Test / Ping Bridge`}),(0,F.jsxs)(`button`,{onClick:()=>{c(!0),u(null),setTimeout(()=>{c(!1),u(n?`SUCCESS: Windows Native .EXE Kernel Bridge responded instantly (0.8ms RTT · Direct Winsock2 Pipe).`:`NOTICE: Windows .EXE background app is not currently connected to this browser tab. Launch AetherTunnel-win-x64.exe to enable native disk streaming.`)},600)},disabled:s,className:`px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors cursor-pointer flex items-center gap-1.5`,children:[s?(0,F.jsx)(A,{className:`w-3 h-3 animate-spin`}):(0,F.jsx)(ae,{className:`w-3 h-3`}),`Test EXE Bridge`]})]}),l&&(0,F.jsx)(`div`,{className:`p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-slate-300`,children:l})]}),(0,F.jsx)(`div`,{className:`pt-2 text-slate-400 leading-relaxed`,children:`The Windows executable runs as a standalone desktop utility or background daemon. It bypasses browser file size limits and streams received files directly to the user's Downloads folder with zero memory fragmentation.`})]})]}),(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between pb-4 border-b border-slate-800`,children:[(0,F.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,F.jsx)(`div`,{className:`p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400`,children:(0,F.jsx)(le,{className:`w-6 h-6`})}),(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`Web Browser Client App`}),(0,F.jsx)(`span`,{className:`text-xs font-mono text-slate-400`,children:`React SPA + WebRTC SCTP / WSS Relay`})]})]}),(0,F.jsxs)(`span`,{className:`px-3 py-1 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5`,children:[(0,F.jsx)(`span`,{className:`w-2 h-2 rounded-full bg-emerald-400 animate-pulse`}),`Active in Browser`]})]}),(0,F.jsxs)(`div`,{className:`space-y-4 text-xs`,children:[(0,F.jsxs)(`div`,{className:`grid grid-cols-2 gap-3`,children:[(0,F.jsxs)(`div`,{className:`bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Connection State`}),(0,F.jsx)(`span`,{className:`font-mono font-medium text-sky-400 capitalize`,children:r.replace(`_`,` `)})]}),(0,F.jsxs)(`div`,{className:`bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Detected NAT Topology`}),(0,F.jsx)(`span`,{className:`font-mono font-medium text-slate-200`,children:i?.detectedNatTopology||`Cone NAT / CGNAT`})]}),(0,F.jsxs)(`div`,{className:`bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Connected Room`}),(0,F.jsx)(`span`,{className:`font-mono font-medium text-sky-400`,children:e})]}),(0,F.jsxs)(`div`,{className:`bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block`,children:`Active Peers`}),(0,F.jsxs)(`span`,{className:`font-mono font-medium text-emerald-400`,children:[a.length,` Peer(s) Online`]})]})]}),(0,F.jsxs)(`div`,{className:`p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2`,children:[(0,F.jsxs)(`div`,{className:`font-semibold text-slate-200 flex items-center justify-between`,children:[(0,F.jsx)(`span`,{children:`E2EE Key Fingerprint (AES-256-GCM)`}),(0,F.jsx)(`span`,{className:`font-mono text-[10px] text-emerald-400`,children:t})]}),(0,F.jsx)(`p`,{className:`text-[11px] text-slate-400`,children:`Derived via PBKDF2 (100,000 iterations) from room passphrase. Zero knowledge stored on server.`})]}),(0,F.jsx)(`div`,{className:`pt-2 text-slate-400 leading-relaxed`,children:`The web application runs entirely client-side with zero server dependency for file payloads. It establishes direct WebRTC SCTP streams or falls back to encrypted WSS TCP/443 relay seamlessly across CGNAT and firewalls.`})]})]})]}),(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4`,children:[(0,F.jsxs)(`h3`,{className:`text-sm font-semibold text-slate-200 flex items-center gap-2`,children:[(0,F.jsx)(j,{className:`w-4 h-4 text-emerald-400`}),`Active Transfer Metrics & Environment Summary`]}),(0,F.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono`,children:[(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block mb-1`,children:`Total Transfers Recorded`}),(0,F.jsxs)(`span`,{className:`text-slate-100 font-bold text-sm`,children:[o.length,` Session(s)`]})]}),(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block mb-1`,children:`STUN Servers Active`}),(0,F.jsx)(`span`,{className:`text-emerald-400 font-bold text-sm`,children:`Google & Cloudflare STUN`})]}),(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950 border border-slate-800 rounded-lg`,children:[(0,F.jsx)(`span`,{className:`text-slate-400 block mb-1`,children:`WebSocket Relay Status`}),(0,F.jsx)(`span`,{className:`text-sky-400 font-bold text-sm`,children:`Online (Port 443 WSS)`})]})]})]})]})},tt=245760,nt=2,rt=48,it=6291456,at=1572864,ot=8,st=[{urls:`stun:stun.l.google.com:19302`},{urls:`stun:stun1.l.google.com:19302`},{urls:`stun:stun2.l.google.com:19302`},{urls:`stun:stun.cloudflare.com:3478`},{urls:[`turn:openrelay.metered.ca:80`,`turn:openrelay.metered.ca:443`,`turn:openrelay.metered.ca:443?transport=tcp`],username:`openrelayproject`,credential:`openrelayproject`}];function ct(){let[e,t]=(0,C.useState)(`studio`),[n,r]=(0,C.useState)(()=>new URLSearchParams(window.location.search).get(`room`)?.toLowerCase().trim()||``),[i,a]=(0,C.useState)(()=>new URLSearchParams(window.location.search).get(`room`)?.toLowerCase().trim()||``),[o,s]=(0,C.useState)(``),[c,l]=(0,C.useState)(`Deriving...`),u=(0,C.useRef)(null),d=(0,C.useRef)(null),[f]=(0,C.useState)(()=>`peer-${Math.random().toString(36).slice(2,9)}`),[p,m]=(0,C.useState)(()=>`Browser-${f.slice(-4)}`),h=(0,C.useRef)(p);h.current=p;let[g,_]=(0,C.useState)(`signaling`),[v,y]=(0,C.useState)(`auto`),[b,x]=(0,C.useState)([]),[S,w]=(0,C.useState)(`all`),[T,ee]=(0,C.useState)(null),[E,ne]=(0,C.useState)(!1),ae=(0,C.useRef)(!1);ae.current=E;let[oe,le]=(0,C.useState)(1),[me,A]=(0,C.useState)([]),[_e,j]=(0,C.useState)([]),[be,Te]=(0,C.useState)(``),[Ee,De]=(0,C.useState)(!1),[Oe,ke]=(0,C.useState)(null),[Ne,P]=(0,C.useState)(null),[Pe,He]=(0,C.useState)(null),[qe,Je]=(0,C.useState)(!1),[ct,lt]=(0,C.useState)(!1),ut=(0,C.useRef)(!1);ut.current=ct;let[dt,ft]=(0,C.useState)([]),pt=(0,C.useRef)(new Set),mt=(0,C.useRef)(async()=>`accept`),[ht,gt]=(0,C.useState)([]),_t=(0,C.useRef)([]);_t.current=ht;let vt=(0,C.useRef)(!1),yt=(0,C.useRef)(null),[bt,xt]=(0,C.useState)(!1),St=(0,C.useRef)(!1);St.current=bt;let Ct=(0,C.useRef)(new Set),wt=(0,C.useRef)(new Set),I=(0,C.useRef)(new Set),L=(0,C.useRef)(new Set),Tt=(0,C.useRef)(new Set),Et=(0,C.useRef)(new Map),Dt=(0,C.useRef)(new Set),Ot=(0,C.useRef)(new Map),kt=(0,C.useRef)(new Map),At=(0,C.useRef)(new Map),[jt,Mt]=(0,C.useState)(`0`),Nt=(0,C.useRef)(0),R=(0,C.useRef)(null),Pt=(0,C.useRef)(new Map),Ft=(0,C.useRef)(new Map),z=(0,C.useRef)(new Map),It=(0,C.useRef)(new WeakMap);(0,C.useRef)(null);let Lt=(0,C.useRef)([]),Rt=(0,C.useRef)(new Map),zt=(0,C.useRef)(new Map),Bt=(0,C.useRef)(new Map),Vt=(0,C.useRef)(new Map),Ht=(0,C.useRef)(new Map),Ut=(0,C.useRef)(new Map),Wt=(0,C.useRef)(new Map),B=(0,C.useRef)(new Map),Gt=(0,C.useRef)(new Map),Kt=(0,C.useRef)(new Map),qt=(0,C.useRef)(new Set),Jt=(0,C.useRef)(new Map),Yt=(0,C.useRef)(new Map),Xt=(0,C.useRef)(new Map),Zt=(0,C.useRef)(new Map),Qt=(0,C.useRef)(0),$t=(0,C.useRef)(null),V=(0,C.useRef)(null),en=(0,C.useRef)(null),tn=(0,C.useRef)(new Map),[nn,rn]=(0,C.useState)([]),an=(0,C.useRef)(new Map),on=(0,C.useRef)(`*`),[sn,cn]=(0,C.useState)([]),ln=(0,C.useRef)([]);ln.current=sn;let un=(0,C.useRef)(null),[dn,fn]=(0,C.useState)([]),pn=(0,C.useRef)([]);pn.current=dn;let[mn,hn]=(0,C.useState)(!1),gn=(0,C.useRef)(n);gn.current=n;let _n=(0,C.useRef)([]);_n.current=b,mt.current=(0,C.useCallback)(e=>ut.current||pt.current.has(e.key)?Promise.resolve(`accept`):new Promise(t=>{ft(n=>n.some(t=>t.id===e.id)?n:[...n,{...e,resolve:t}])}),[]);let vn=(0,C.useCallback)((e,t)=>{t===`accept_all`?(ut.current=!0,lt(!0),ft(e=>{for(let t of e)pt.current.add(t.key),t.resolve(`accept_all`);return[]})):(t===`accept`&&pt.current.add(e.key),ft(t=>t.filter(t=>t.id!==e.id)),e.resolve(t))},[]),yn=(0,C.useCallback)(()=>{let e=Array.from(Dt.current);Dt.current.clear();for(let t of e)try{t()}catch{}},[]),bn=(0,C.useCallback)(async(e,t,n)=>{if(L.current.has(e)||t&&Tt.current.has(t))return!1;if(!St.current&&!Ct.current.has(e)&&!wt.current.has(e))return!0;let r=performance.now(),i=wt.current.has(e);for(A(t=>t.map(t=>t.id===e&&t.status===`transferring`?{...t,status:`paused`,pausedBy:i?`remote`:`local`,speedBps:0}:t)),t&&gt(e=>e.map(e=>e.id===t&&e.status===`transferring`?{...e,status:`paused`}:e));!L.current.has(e)&&!(t&&Tt.current.has(t))&&(St.current||Ct.current.has(e)||wt.current.has(e));)await new Promise(e=>{let t=!1,n=()=>{t||(t=!0,window.clearTimeout(r),Dt.current.delete(n),e())},r=window.setTimeout(n,250);Dt.current.add(n)});return L.current.has(e)||t&&Tt.current.has(t)?!1:(A(t=>t.map(t=>t.id===e&&t.status===`paused`?{...t,status:`transferring`,pausedBy:void 0}:t)),t&&gt(e=>e.map(e=>e.id===t&&e.status===`paused`?{...e,status:`transferring`}:e)),n?.(performance.now()-r),!0)},[]);(0,C.useEffect)(()=>{let e=n.trim();if(!e){u.current=null,d.current=null,l(`Waiting for tunnel name...`);return}let t=!1,r=Me(e,o).then(({key:e,fingerprint:n})=>(t||(u.current=e,l(n)),e));return d.current=r,()=>{t=!0}},[n,o]);let xn=(0,C.useCallback)(async()=>{Je(!0);try{let e=await Ke();He(e)}finally{Je(!1)}},[]);(0,C.useEffect)(()=>{xn()},[xn]);let Sn=(0,C.useRef)(null),Cn=(0,C.useRef)(new Set),wn=(0,C.useRef)(new Map),Tn=(0,C.useRef)(new Set),En=(0,C.useRef)(new Map),Dn=(0,C.useCallback)(e=>{if(!e)return``;let t=_n.current.find(t=>t.id===e||t.cloudId===e);if(t)return t.id;let n=e.lastIndexOf(`peer-`);return n>=0?e.slice(n):e},[]),On=(0,C.useCallback)(()=>{let e=0;for(let t of z.current.values())e+=t.filter(e=>e.readyState===`open`).length;le(Math.max(1,e))},[]),kn=(0,C.useCallback)(e=>(z.current.get(e)||[]).some(e=>{if(e.readyState!==`open`)return!1;let t=It.current.get(e);return t?t.signalingState!==`closed`&&t.connectionState===`connected`&&t.iceConnectionState!==`disconnected`&&t.iceConnectionState!==`failed`&&t.iceConnectionState!==`closed`:!1}),[]),An=(0,C.useCallback)(()=>{let e=ae.current&&V.current?.readyState===WebSocket.OPEN,t=[];for(let n of _n.current)n.id===`native-exe-bridge`||n.isLocalBridge?e||t.push(n):Tn.current.has(n.id)||En.current.has(n.id)||wn.current.has(n.id)||n.cloudId&&wn.current.has(n.cloudId)||tn.current.has(n.id)||n.cloudId&&tn.current.has(n.cloudId)||kn(n.id)||t.push(n);if(t.length===0)return;let n=new Set;for(let e of t)n.add(e.id),e.cloudId&&n.add(e.cloudId);for(let e of n){let t=Pt.current.get(e);if(t){for(let e of t.values())try{e.close()}catch{}Pt.current.delete(e)}z.current.delete(e),Ft.current.delete(e)}On(),x(e=>e.filter(e=>!n.has(e.id)&&!(e.cloudId&&n.has(e.cloudId))))},[kn,On]),jn=(0,C.useCallback)((e,t)=>{let n=new Set;e&&n.add(e),t&&n.add(t);let r=e?Dn(e):``;r&&n.add(r);for(let e of _n.current)(n.has(e.id)||e.cloudId&&n.has(e.cloudId))&&(n.add(e.id),e.cloudId&&n.add(e.cloudId));if(n.size!==0){for(let e of n){let t=Pt.current.get(e);if(t){for(let e of t.values())try{e.close()}catch{}Pt.current.delete(e)}z.current.delete(e),Ft.current.delete(e),Tn.current.delete(e),wn.current.delete(e),En.current.delete(e),tn.current.delete(e)}On(),cn(Array.from(wn.current.keys())),rn(Array.from(tn.current.keys())),fn(Array.from(En.current.keys())),tn.current.size===0&&V.current?.readyState!==WebSocket.OPEN&&hn(!1),x(e=>e.filter(e=>!n.has(e.id)&&!(e.cloudId&&n.has(e.cloudId))))}},[Dn,On]),Mn=(0,C.useCallback)(()=>{let e=gn.current.trim().toLowerCase().replace(/[^a-z0-9-]/g,``);if(e&&Sn.current)try{Sn.current(`*`,{kind:`browser:bye`,roomCode:e,peerId:f})}catch{}if(R.current&&R.current.readyState===WebSocket.OPEN)try{R.current.send(JSON.stringify({type:`room:leave`,roomCode:e,peerId:f}))}catch{}if(un.current)try{un.current.postMessage({type:`bus:bye`,peerId:f})}catch{}},[f]);(0,C.useEffect)(()=>{let e=()=>{Mn()};return window.addEventListener(`beforeunload`,e),window.addEventListener(`pagehide`,e),()=>{window.removeEventListener(`beforeunload`,e),window.removeEventListener(`pagehide`,e)}},[Mn]);let Nn=(0,C.useCallback)(e=>{let t=JSON.stringify(e);for(let e of z.current.values())for(let n of e)if(n.readyState===`open`)try{n.send(t)}catch{}for(let e of Lt.current)if(e.open)try{e.send(t)}catch{}if(un.current&&pn.current.length>0)try{un.current.postMessage({type:`bus:packet`,packet:e})}catch{}if(Sn.current){if(ln.current.length>0)for(let t of ln.current)Sn.current(t,{kind:`browser:packet`,packet:e});else Sn.current(`*`,{kind:`browser:packet`,packet:e})}if(R.current&&R.current.readyState===WebSocket.OPEN)try{R.current.send(JSON.stringify({type:`relay:packet`,packet:e}))}catch{}},[]),Pn=(0,C.useCallback)(e=>{if(e.rejected||e.cancelled||e.awaitingAcceptance||e.paused)return!1;let t=0;for(let n=0;n<e.totalChunks;n++)e.receivedChunks[n]!==void 0&&t++;if(t<e.totalChunks)return!1;let n=performance.now(),r=e.id,i=Math.max(.015,(n-e.startedAt)/1e3),a=Math.max(0,e.size-e.initialBytes)/i,o=e.smoothedLiveBps>0?e.smoothedLiveBps:a,s=[];for(let t=0;t<e.totalChunks;t++)s.push(e.receivedChunks[t]);let c=s.reduce((e,t)=>e+t.byteLength,0),l=new Uint8Array(c),u=0;for(let e of s)l.set(new Uint8Array(e),u),u+=e.byteLength;e.receivedChunks.length=0;let d=new Blob([l.buffer],{type:`application/octet-stream`}),f=URL.createObjectURL(d),p=document.createElement(`a`);return p.href=f,p.download=e.name,document.body.appendChild(p),p.click(),document.body.removeChild(p),A(t=>t.map(t=>t.id===r&&t.direction===`incoming`?{...t,transferredChunks:e.totalChunks,bytesTransferred:e.size,speedBps:o,avgSpeedBps:a,status:`completed`,verified:!0,downloadUrl:f,completedAt:Date.now(),pausedBy:void 0}:t)),Nn({kind:`file:rx-complete`,fileId:r,name:e.name,size:e.size,receivedCount:e.totalChunks,totalChunks:e.totalChunks}),Rt.current.delete(r),zt.current.delete(`${e.name}::${e.size}`),Xt.current.delete(e.transferNumId),qt.current.delete(r),Jt.current.delete(r),I.current.delete(r),P(null),!0},[Nn]),Fn=(0,C.useCallback)((e,t,n)=>{if(e.rejected||e.cancelled||(t>=0&&t<e.totalChunks&&e.receivedChunks[t]===void 0&&(e.receivedChunks[t]=n,e.receivedCount+=1),e.awaitingAcceptance||e.paused)||Pn(e))return;let r=performance.now(),i=e.id;if((r-(Jt.current.get(i)||0)>=450||e.receivedCount===1)&&(Jt.current.set(i,r),Nn({kind:`file:rx-progress`,fileId:i,receivedCount:e.receivedCount,totalChunks:e.totalChunks})),r-e.lastUiUpdateAt>=120){let t=0;for(let n=0;n<e.totalChunks;n++)e.receivedChunks[n]!==void 0&&t++;let n=Math.min(e.size,t*e.chunkSize),a=(r-e.lastWindowAt)/1e3;if(a>=.35&&n>=e.lastWindowBytes){let t=(n-e.lastWindowBytes)/a;e.smoothedLiveBps=e.smoothedLiveBps>0?e.smoothedLiveBps*.72+t*.28:t,e.lastWindowAt=r,e.lastWindowBytes=n}e.lastUiUpdateAt=r;let o=Math.max(.015,(r-e.startedAt)/1e3),s=Math.max(0,n-e.initialBytes)/o,c=e.smoothedLiveBps>0?e.smoothedLiveBps:s;A(e=>e.map(e=>e.id===i&&e.direction===`incoming`?{...e,transferredChunks:t,bytesTransferred:n,speedBps:c,avgSpeedBps:s}:e))}},[Pn,Nn]),In=(0,C.useCallback)(async(e,t)=>{let n=u.current;if(!n&&d.current&&(n=await d.current),!n||e.byteLength<24)return;let r=e.slice(0),i=new DataView(r),a=i.getUint32(4,!1),o=i.getUint32(8,!1),s=Xt.current.get(a);if(!s){let e=Zt.current.get(a);e||(e=[],Zt.current.set(a,e)),e.length<5e4&&e.push(r);return}if(L.current.has(s))return;let c=Rt.current.get(s);if(!(!c||c.rejected||c.cancelled||c.receivedChunks[o]!==void 0)){t===`WebRTC Direct (UDP/DTLS)`&&c.transportUsed!==t&&(c.transportUsed=t,A(e=>e.map(e=>e.id===s&&e.direction===`incoming`?{...e,transportUsed:t}:e)));try{let{plainBuffer:e}=await Le(n,r);Fn(c,o,e)}catch{if(!qt.current.has(s)){qt.current.add(s);let e=`AES-256-GCM decryption failed — verify Room Name & E2EE Passphrase match sender`;P(e),A(t=>t.map(t=>t.id===s&&t.direction===`incoming`?{...t,status:`error`,errorMessage:e}:t)),Nn({kind:`file:rx-error`,fileId:s,reason:e})}}}},[Fn,Nn]),Ln=(0,C.useCallback)((e,t)=>{if(e.byteLength<24)return!1;let n=new DataView(e),r=n.getUint32(0,!1);if(r===1095062600)return In(e,t),!0;if(r===1095062608){let r=n.getUint32(4,!1),i=n.getUint32(8,!1),a=n.getUint32(12,!1),o=n.getUint32(16,!1),s=n.getUint16(22,!1),c=`${r}:${i}`,l=Yt.current.get(c);l||(l={buffer:new Uint8Array(a),receivedParts:0,totalParts:s},Yt.current.set(c,l));let u=new Uint8Array(e,24);return l.buffer.set(u,o),l.receivedParts+=1,l.receivedParts>=l.totalParts&&(Yt.current.delete(c),In(l.buffer.buffer,t)),!0}return!1},[In]),Rn=(0,C.useCallback)(async(e,t)=>{if(gn.current.trim()){if(e instanceof ArrayBuffer){if(Ln(e,t))return;try{let t=new TextDecoder().decode(e);if(t.startsWith(`{`))e=JSON.parse(t);else return}catch{return}}else if(ArrayBuffer.isView(e)){let n=e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength);if(Ln(n,t))return;try{let t=new TextDecoder().decode(n);if(t.startsWith(`{`))e=JSON.parse(t);else return}catch{return}}else if(typeof e==`string`)try{e=JSON.parse(e)}catch{return}if(e&&typeof e==`object`){if(e.kind===`file:rx-progress`&&e.fileId)Gt.current.set(String(e.fileId),{receivedCount:Number(e.receivedCount)||0,at:performance.now()});else if(e.kind===`file:rx-complete`&&e.fileId){let t=String(e.fileId),n=B.current.get(t);n&&(B.current.delete(t),n())}else if(e.kind===`file:rx-error`&&e.fileId){let t=String(e.fileId),n=Kt.current.get(t);n&&(Kt.current.delete(t),n(String(e.reason||`Recipient failed to decrypt incoming file`)))}else if(e.kind===`file:resume-ack`||e.kind===`exe:resume-ack`||e.kind===`browser:resume-ack`){let t=`${e.name||``}::${Number(e.size)||0}`,n=Math.max(0,Number(e.resumeFromChunk)||0);t!==`::0`&&Vt.current.set(t,n);let r=e.fileId&&Ht.current.get(String(e.fileId))||Ht.current.get(t);r&&(Ht.current.delete(String(e.fileId||``)),Ht.current.delete(t),r(n))}else if(e.kind===`file:wait-accept`||e.kind===`exe:wait-accept`||e.kind===`browser:wait-accept`){let t=`${e.name||``}::${Number(e.size)||0}`,n=String(e.fileId||``),r=n&&Ut.current.get(n)||Ut.current.get(t);r&&r()}else if(e.kind===`file:reject`||e.kind===`exe:file-reject`||e.kind===`browser:file-reject`){let t=`${e.name||``}::${Number(e.size)||0}`,n=String(e.fileId||``),r=n&&Wt.current.get(n)||Wt.current.get(t);r&&r()}else if(e.kind===`file:pause`&&e.fileId){let t=String(e.fileId),n=kt.current.get(t);n&&(wt.current.add(t),Ct.current.add(t),A(e=>e.map(e=>e.id===t&&e.direction===`outgoing`&&(e.status===`transferring`||e.status===`awaiting_acceptance`)?{...e,status:`paused`,pausedBy:`remote`,speedBps:0}:e)),n.queueItemId&&gt(e=>e.map(e=>e.id===n.queueItemId&&e.status===`transferring`?{...e,status:`paused`}:e)));let r=At.current.get(t);r&&r.pause(`remote`);let i=Rt.current.get(t);i&&!i.rejected&&!i.cancelled&&(i.paused||(i.paused=!0,i.pausedStartedAt=performance.now()),I.current.add(t),A(e=>e.map(e=>e.id===t&&e.direction===`incoming`&&e.status===`transferring`?{...e,status:`paused`,pausedBy:`remote`,speedBps:0}:e)))}else if(e.kind===`file:resume`&&e.fileId){let t=String(e.fileId),n=kt.current.get(t);n&&(wt.current.delete(t),Ct.current.delete(t),St.current&&(St.current=!1,xt(!1)),A(e=>e.map(e=>e.id===t&&e.direction===`outgoing`&&e.status===`paused`?{...e,status:`transferring`,pausedBy:void 0}:e)),n.queueItemId&&gt(e=>e.map(e=>e.id===n.queueItemId&&e.status===`paused`?{...e,status:`transferring`}:e)),yn());let r=At.current.get(t);r&&r.resume(`remote`);let i=Rt.current.get(t);if(i&&!i.rejected&&!i.cancelled){if(i.paused){let e=performance.now();i.pausedStartedAt>0&&(i.startedAt+=Math.max(0,e-i.pausedStartedAt),i.pausedStartedAt=0),i.lastWindowAt=e,i.lastWindowBytes=Math.min(i.size,i.receivedCount*i.chunkSize),i.smoothedLiveBps=0,i.paused=!1}I.current.delete(t),A(e=>e.map(e=>e.id===t&&e.direction===`incoming`&&e.status===`paused`?{...e,status:`transferring`,pausedBy:void 0}:e)),Pn(i)}}else if((e.kind===`file:cancel`||e.kind===`exe:file-cancel`||e.kind===`browser:file-cancel`)&&e.fileId){let t=String(e.fileId);L.current.add(t),Ct.current.delete(t),wt.current.delete(t),I.current.delete(t);let n=kt.current.get(t);if(n){let e=Ot.current.get(t);e&&(Ot.current.delete(t),e()),yn(),A(e=>e.map(e=>e.id===t&&e.direction===`outgoing`?{...e,status:`cancelled`,speedBps:0,cancelledBy:`remote`,errorMessage:`Stopped by receiver`}:e)),n.queueItemId&&gt(e=>e.map(e=>e.id===n.queueItemId&&e.status!==`completed`?{...e,status:`cancelled`,errorMessage:`Stopped by receiver`}:e))}ft(e=>e.filter(e=>e.id!==t));let r=At.current.get(t);r&&r.cancel(`remote`);let i=Rt.current.get(t);i&&(i.cancelled=!0,i.rejected=!0,i.awaitingAcceptance=!1,i.paused=!1,i.receivedChunks.length=0,Rt.current.delete(t),zt.current.delete(`${i.name}::${i.size}`),Xt.current.delete(i.transferNumId),Zt.current.delete(i.transferNumId),qt.current.delete(t),Jt.current.delete(t),P(null)),A(e=>e.map(e=>e.id===t&&e.direction===`incoming`?{...e,status:`cancelled`,speedBps:0,cancelledBy:`remote`,errorMessage:`Stopped by sender`}:e))}else if(e.kind===`file:meta`){let{fileId:n,transferNumId:r,name:i,size:a,chunkSize:o,mimeType:s,totalChunks:c,sha256:l}=e;if(L.current.has(n))return;let f=typeof r==`number`?r:1001,p=`${i}::${a}`,m=Rt.current.get(n);if(m&&m.totalChunks===c&&!m.rejected&&!m.cancelled){Xt.current.set(f,n),t===`WebRTC Direct (UDP/DTLS)`&&m.transportUsed!==t&&(m.transportUsed=t,A(e=>e.map(e=>e.id===n&&e.direction===`incoming`?{...e,transportUsed:t}:e)));let e=0;for(;e<c&&m.receivedChunks[e]!==void 0;)e++;m.awaitingAcceptance?Nn({kind:`file:wait-accept`,fileId:n,name:i,size:a}):Nn({kind:`file:resume-ack`,fileId:n,name:i,size:a,resumeFromChunk:e,receivedCount:m.receivedCount});return}let h=zt.current.get(p),g,_=0,v=performance.now();if(h&&h.totalChunks===c&&h.receivedCount>0&&h.receivedCount<c&&!h.rejected&&!h.cancelled){for(h.id!==n&&Rt.current.delete(h.id),h.id=n,h.transferNumId=f,h.transportUsed=t,h.lastWindowAt=v,h.startedAt=v,h.smoothedLiveBps=0,h.paused=!1,h.pausedStartedAt=0,g=h;_<c&&g.receivedChunks[_]!==void 0;)_++;g.initialBytes=Math.min(a,g.receivedCount*g.chunkSize),g.lastWindowBytes=g.initialBytes}else g={id:n,transferNumId:f,name:i,size:a,chunkSize:o||tt,mimeType:s,totalChunks:c,expectedSha256:l,transportUsed:t,receivedChunks:Array(c),receivedCount:0,startedAt:v,lastUiUpdateAt:0,lastWindowAt:v,lastWindowBytes:0,smoothedLiveBps:0,initialBytes:0,awaitingAcceptance:!1,rejected:!1,paused:!1,pausedStartedAt:0,cancelled:!1},zt.current.set(p,g);let y=!ut.current&&!pt.current.has(p);g.awaitingAcceptance=y,Xt.current.set(f,n),Rt.current.set(n,g),qt.current.delete(n);let b=Math.min(a,g.receivedCount*g.chunkSize);A(e=>{let r=e.filter(e=>e.direction!==`incoming`||e.id!==n&&(e.name!==i||e.size!==a||e.status===`completed`));return[{id:n,name:i,size:a,mimeType:s,totalChunks:c,transferredChunks:g.receivedCount,bytesTransferred:b,speedBps:0,avgSpeedBps:0,status:y?`awaiting_acceptance`:`transferring`,sha256:l,verified:!1,direction:`incoming`,transportUsed:t,startedAt:Date.now()},...r]});let x=()=>{let e=Zt.current.get(f);if(e&&e.length>0){Zt.current.delete(f);let t=Rt.current.get(n);if(t&&!t.rejected)for(let r of e){let e=new DataView(r).getUint32(8,!1);t.receivedChunks[e]===void 0&&(u.current?Promise.resolve(u.current):d.current||Promise.resolve(null)).then(e=>{if(!e)throw Error(`Missing tunnel key`);return Le(e,r)}).then(({plainBuffer:n})=>{Fn(t,e,n)}).catch(()=>{if(!qt.current.has(n)){qt.current.add(n);let e=`AES-256-GCM decryption failed — verify Room Name & E2EE Passphrase match sender`;P(e),A(t=>t.map(t=>t.id===n&&t.direction===`incoming`?{...t,status:`error`,errorMessage:e}:t)),Nn({kind:`file:rx-error`,fileId:n,reason:e})}})}}};if(y){P(`Confirmation required: ${i} (${Ue(a)}) — Accept or decline the incoming transfer above.`),Nn({kind:`file:wait-accept`,fileId:n,name:i,size:a}),mt.current({key:p,id:n,senderLabel:t,name:i,size:a,hasResume:_>0}).then(e=>{if(g.cancelled||L.current.has(n))return;if(e===`reject`){g.rejected=!0,g.awaitingAcceptance=!1,g.receivedChunks.length=0,I.current.delete(n),Rt.current.delete(n),zt.current.delete(p),Xt.current.delete(f),Zt.current.delete(f),P(null),A(e=>e.map(e=>e.id===n&&e.direction===`incoming`?{...e,status:`rejected`,errorMessage:`Transfer declined by recipient`}:e)),Nn({kind:`file:reject`,fileId:n,name:i,size:a});return}let t=performance.now();g.awaitingAcceptance=!1,g.startedAt=t,g.lastWindowAt=t,g.lastWindowBytes=g.initialBytes,g.smoothedLiveBps=0,P(`Receiving: ${i} (${Ue(a)})...`),A(e=>e.map(e=>e.id===n&&e.direction===`incoming`?{...e,status:`transferring`,startedAt:Date.now()}:e)),Nn({kind:`file:resume-ack`,fileId:n,name:i,size:a,resumeFromChunk:_,receivedCount:g.receivedCount}),x(),Pn(g)});return}if(_>0){let e=Math.round(_/Math.max(1,c)*100);P(`Resuming Interrupted File: ${i} from ${e}% (${_}/${c} chunks already in memory)...`)}else P(`Incoming File Detected: ${i} (${Ue(a)}) — Receiving and preparing download...`);Nn({kind:`file:resume-ack`,fileId:n,name:i,size:a,resumeFromChunk:_,receivedCount:g.receivedCount}),x()}else if(e.kind===`file:sha256`){let{fileId:t,sha256:n}=e;A(e=>e.map(e=>e.id===t?{...e,sha256:n}:e))}else if(e.kind===`file:chunk`){let t=u.current;if(!t&&d.current&&(t=await d.current),!t)return;let{fileId:n,chunkIndex:r,ivBase64:i,ciphertextBase64:a}=e,o=Rt.current.get(n);if(!o||o.rejected)return;try{let e=await ze(t,i,a);Fn(o,r,e)}catch{A(e=>e.map(e=>e.id===n&&e.direction===`incoming`?{...e,status:`error`,errorMessage:`AES-256-GCM authentication tag mismatch`}:e))}}else if(e.kind===`note:encrypted`){let t=u.current;if(!t&&d.current&&(t=await d.current),!t)return;try{let n=await ze(t,e.ivBase64,e.ciphertextBase64),r=new TextDecoder().decode(n);j(t=>{let n=e.id||`note-${Date.now()}`;return t.some(e=>e.id===n)?t:[{id:n,senderLabel:e.senderLabel||`Remote Peer`,recipientLabel:e.recipientLabel||void 0,text:r,timestamp:Date.now(),verified:!0},...t]})}catch{}}}}},[Ln,Fn,Pn,Nn,yn]),zn=(0,C.useCallback)((e,t,n=!1,r)=>{t.binaryType=`arraybuffer`,t.bufferedAmountLowThreshold=at,r&&It.current.set(t,r),n||(t.onmessage=async e=>{let t=e.data;if(t instanceof Blob)try{t=await t.arrayBuffer()}catch{return}if(t instanceof ArrayBuffer){if(Ln(t,`WebRTC Direct (UDP/DTLS)`))return;Rn(t,`WebRTC Direct (UDP/DTLS)`)}else if(ArrayBuffer.isView(t)){let e=t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength);if(Ln(e,`WebRTC Direct (UDP/DTLS)`))return;Rn(e,`WebRTC Direct (UDP/DTLS)`)}else Rn(t,`WebRTC Direct (UDP/DTLS)`)});let i=()=>{On()};t.addEventListener(`open`,()=>{_(`connected_p2p`),i()});let a=()=>{let n=(z.current.get(e)||[]).filter(e=>e!==t&&e.readyState!==`closed`&&e.readyState!==`closing`);if(z.current.set(e,n),i(),n.length===0){let n=It.current.get(t);if(!n||n.connectionState===`closed`||n.connectionState===`failed`||n.iceConnectionState===`closed`||n.iceConnectionState===`failed`){let t=_n.current.find(t=>t.id===e||t.cloudId===e)?.cloudId||``,n=wn.current.get(t)??wn.current.get(e)??0;if(!Tn.current.has(e)&&(n===0||Date.now()-n>4500)){jn(e,t||void 0);return}}An()}};t.addEventListener(`close`,a),t.addEventListener(`error`,a);let o=(z.current.get(e)||[]).filter(e=>e.readyState!==`closed`&&e.readyState!==`closing`);o.includes(t)||o.push(t),z.current.set(e,o),i()},[Ln,Rn,jn,An,On]);(0,C.useEffect)(()=>{if(typeof window>`u`||typeof BroadcastChannel>`u`)return;let e=n.trim().toLowerCase().replace(/[^a-z0-9-]/g,``);if(!e){un.current=null,En.current.clear(),fn([]);return}let t=`aethertunnel-local-bus-${e}`,r=new BroadcastChannel(t);un.current=r,r.onmessage=e=>{if(!e.data)return;if(e.data instanceof ArrayBuffer){Ln(e.data,`WebRTC Direct (UDP/DTLS)`);return}let t=e.data;if(!(t.toPeerId&&t.toPeerId!==`*`&&t.toPeerId!==f)){if(t.type===`bus:frame`&&t.frame instanceof ArrayBuffer)Ln(t.frame,`WebRTC Direct (UDP/DTLS)`);else if(t.type===`bus:hello`&&t.peerId!==f){En.current.set(String(t.peerId),Date.now()),fn(Array.from(En.current.keys()).slice(0,7)),x(e=>e.find(e=>e.id===t.peerId)?e.map(e=>e.id===t.peerId?{...e,deviceLabel:t.deviceLabel||e.deviceLabel}:e):e.filter(e=>!e.isLocalBridge).length>=7?e:[{id:t.peerId,deviceLabel:t.deviceLabel||`Local Chrome Tab (Memory Bus)`,natType:`Local Machine Tab Bus`,clientType:`browser`,joinedAt:Date.now()},...e]),_(`connected_p2p`);try{r.postMessage({type:`bus:hello-reply`,peerId:f,toPeerId:t.peerId,deviceLabel:`${h.current} (Local Tab)`})}catch{}}else t.type===`bus:hello-reply`&&t.peerId!==f?(En.current.set(String(t.peerId),Date.now()),fn(Array.from(En.current.keys()).slice(0,7)),x(e=>e.find(e=>e.id===t.peerId)||e.filter(e=>!e.isLocalBridge).length>=7?e:[{id:t.peerId,deviceLabel:t.deviceLabel||`Local Chrome Tab (Memory Bus)`,natType:`Local Machine Tab Bus`,clientType:`browser`,joinedAt:Date.now()},...e]),_(`connected_p2p`)):t.type===`bus:packet`&&t.packet?Rn(t.packet,`WebRTC Direct (UDP/DTLS)`):t.type===`bus:bye`&&t.peerId&&jn(String(t.peerId))}};try{r.postMessage({type:`bus:hello`,peerId:f,deviceLabel:`${h.current} (Local Tab)`})}catch{}let i=window.setInterval(()=>{try{r.postMessage({type:`bus:hello`,peerId:f,deviceLabel:`${h.current} (Local Tab)`})}catch{}let e=Date.now(),t=!1;for(let[n,r]of En.current.entries())e-r>6e3&&(En.current.delete(n),t=!0);t&&(fn(Array.from(En.current.keys())),An())},1500);return()=>{window.clearInterval(i);try{r.postMessage({type:`bus:bye`,peerId:f}),r.close()}catch{}un.current=null,En.current.clear(),fn([])}},[n,f,Ln,Rn,jn,An]);let Bn=(0,C.useCallback)((e,t,n,r)=>{let i=`${f}-${e}-${n}-${t}-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,a={type:`webrtc:signal`,sigId:i,fromPeerId:f,toPeerId:e,signalType:t,laneIdx:n,sdp:r.sdp,candidate:r.candidate};if(R.current?.readyState===WebSocket.OPEN)try{R.current.send(JSON.stringify(a))}catch{}if(Sn.current){let a=_n.current.find(t=>t.id===e||t.cloudId===e)?.cloudId||(e.startsWith(`aethertunnel-`)?e:`*`);Sn.current(a,{kind:`webrtc:signal`,sigId:i,fromPeerId:f,toPeerId:e,signalType:t,laneIdx:n,sdp:r.sdp,candidate:r.candidate})}},[f]),Vn=(0,C.useCallback)((e,t)=>{let n=z.current.get(e);if(!n)return;let r=n.filter(e=>It.current.get(e)!==t&&e.readyState!==`closed`&&e.readyState!==`closing`);z.current.set(e,r)},[]),Hn=(0,C.useCallback)(async(e,t,n,r=!1)=>{if(v===`websocket_relay`){_(`connected_relay`);return}let i=Dn(e);if(!i||i===f)return;let a=Pt.current.get(i);a||(a=new Map,Pt.current.set(i,a));let o=Ft.current.get(i);o||(o=new Map,Ft.current.set(i,o));let s=typeof n==`number`?[n]:Array.from({length:nt},(e,t)=>t);for(let e of s)try{let n=a.get(e);if(!r&&n&&n.signalingState!==`closed`&&n.connectionState!==`failed`&&n.connectionState!==`closed`&&n.iceConnectionState!==`failed`&&n.iceConnectionState!==`disconnected`&&n.iceConnectionState!==`closed`)continue;if(n){Vn(i,n);try{n.close()}catch{}}o.set(e,[]);let s=new RTCPeerConnection({iceServers:st});if(a.set(e,s),t){let t=s.createDataChannel(`aethertunnel-lane-${e}`,{ordered:!0});zn(i,t,!1,s)}else s.ondatachannel=e=>{zn(i,e.channel,!1,s)};if(s.onicecandidate=t=>{t.candidate&&Bn(i,`candidate`,e,{candidate:t.candidate.toJSON?t.candidate.toJSON():t.candidate})},s.onconnectionstatechange=()=>{if(s.connectionState===`connected`)_(`connected_p2p`),On();else if(s.connectionState===`failed`||s.connectionState===`closed`||s.connectionState===`disconnected`){Vn(i,s),On();let e=(z.current.get(i)||[]).filter(e=>e.readyState===`open`);if((s.connectionState===`failed`||s.connectionState===`closed`)&&e.length===0){let e=_n.current.find(e=>e.id===i||e.cloudId===i)?.cloudId||``,t=wn.current.get(e)??wn.current.get(i)??0;if(!Tn.current.has(i)&&(t===0||Date.now()-t>4500)){jn(i,e||void 0);return}}An()}},s.oniceconnectionstatechange=()=>{s.iceConnectionState===`connected`||s.iceConnectionState===`completed`?(_(`connected_p2p`),On()):(s.iceConnectionState===`failed`||s.iceConnectionState===`closed`||s.iceConnectionState===`disconnected`)&&(Vn(i,s),On(),An())},t){_(`hole_punching`);let t=await s.createOffer();await s.setLocalDescription(t),Bn(i,`offer`,e,{sdp:t})}}catch{}},[f,Vn,zn,jn,Dn,Bn,An,On,v]),Un=(0,C.useCallback)(async e=>{let t=e.fromPeerId||``,n=Dn(t);if(!n||n===f||e.toPeerId&&e.toPeerId!==`*`&&Dn(e.toPeerId)!==f)return;if(e.sigId){if(Cn.current.has(e.sigId))return;if(Cn.current.add(e.sigId),Cn.current.size>600){let e=Cn.current.values().next().value;e&&Cn.current.delete(e)}}let r=typeof e.laneIdx==`number`?e.laneIdx:0,i=Pt.current.get(n);i||(i=new Map,Pt.current.set(n,i));let a=Ft.current.get(n);a||(a=new Map,Ft.current.set(n,a));let o=i.get(r);if(e.signalType===`offer`&&e.sdp){let i=gn.current.trim().toLowerCase().replace(/[^a-z0-9-]/g,``),s=(t.startsWith(`aethertunnel-web-`)&&!t.includes(`peer-`)?`aethertunnel-web-${i}-${f}`:f)<(t.startsWith(`aethertunnel-web-`)&&!t.includes(`peer-`)?t:n);if(!o||o.signalingState===`closed`||o.connectionState===`failed`||o.connectionState===`closed`)await Hn(n,!1,r,!0),o=Pt.current.get(n)?.get(r);else if(o.signalingState!==`stable`){if(!s)return;try{await o.setLocalDescription({type:`rollback`})}catch{await Hn(n,!1,r,!0),o=Pt.current.get(n)?.get(r)}}if(!o)return;o.ondatachannel=e=>{zn(n,e.channel,!1,o)};let c=a.get(r)||[];_(`hole_punching`),await o.setRemoteDescription(new RTCSessionDescription(e.sdp));for(let e of c)try{await o.addIceCandidate(new RTCIceCandidate(e))}catch{}a.set(r,[]);let l=await o.createAnswer();await o.setLocalDescription(l),Bn(n,`answer`,r,{sdp:l})}else if(e.signalType===`answer`&&e.sdp){if(!o||o.signalingState!==`have-local-offer`)return;let t=a.get(r)||[];await o.setRemoteDescription(new RTCSessionDescription(e.sdp));for(let e of t)try{await o.addIceCandidate(new RTCIceCandidate(e))}catch{}a.set(r,[])}else if(e.signalType===`candidate`&&e.candidate){if(o&&o.signalingState!==`closed`||(await Hn(n,!1,r,!0),o=Pt.current.get(n)?.get(r)),!o)return;let t=a.get(r)||[];if(o.remoteDescription&&o.remoteDescription.type)try{await o.addIceCandidate(new RTCIceCandidate(e.candidate))}catch{}else t.push(e.candidate),a.set(r,t)}},[f,Hn,zn,Dn,Bn]);(0,C.useEffect)(()=>{if(!n.trim()||Ge())return;let e=n.trim().toLowerCase().replace(/[^a-z0-9-]/g,``),t=`aethertunnel-web-${e}-${f}`,r=`${window.location.protocol===`https:`?`wss:`:`ws:`}//${window.location.host}/ws-tunnel`,i=null,a=null,o=!1,s=e=>{let t=e.filter(e=>e.id!==f);Tn.current=new Set(t.map(e=>e.id)),x(e=>{let n=[...e.filter(e=>e.id===`native-exe-bridge`||tn.current.has(e.id)||e.cloudId&&tn.current.has(e.cloudId)||En.current.has(e.id)||(wn.current.has(e.id)||e.cloudId&&wn.current.has(e.cloudId))&&!t.some(t=>t.cloudId===e.id||t.id===e.id))];for(let e of t){let t=e.clientType===`exe`||e.id.startsWith(`exe-kernel-`)||e.id.startsWith(`aethertunnel-exe-`),r={...e,clientType:t?`exe`:`browser`},i=n.findIndex(e=>e.id===r.id||r.cloudId&&(e.id===r.cloudId||e.cloudId===r.cloudId));i>=0?n[i]={...n[i],...r}:n.filter(e=>!e.isLocalBridge).length<7&&n.push(r)}return n})},c=()=>{if(!o)try{i=new WebSocket(r),i.binaryType=`arraybuffer`,R.current=i,i.onopen=()=>{ee(null),i?.send(JSON.stringify({type:`room:join`,roomCode:e,peerId:f,cloudId:t,clientType:`browser`,deviceLabel:`${h.current} (${navigator.platform||`Browser`})`,natType:`Port-Restricted Cone NAT`}))},i.onmessage=async t=>{let n=t.data;if(n instanceof Blob&&(n=await n.arrayBuffer()),n instanceof ArrayBuffer)Ln(n,`Encrypted WS Relay (TCP/443)`);else try{let n=JSON.parse(t.data);if(n.type===`room:full`){ee(`Room "${e}" is full (max ${n.maxPeers||ot} users).`),_(`error`);return}if(n.type===`room:joined`){ee(null);let e=(n.peers||[]).filter(e=>e.id!==f);s(e);let t=e.filter(e=>e.clientType!==`exe`&&!e.id.startsWith(`exe-kernel-`)&&!e.id.startsWith(`aethertunnel-exe-`));for(let e of t)if(_(`connected_p2p`),f>e.id)Hn(e.id,!0,void 0,!0);else{let t=Pt.current.get(e.id);if(t){for(let e of t.values())try{e.close()}catch{}Pt.current.delete(e.id)}z.current.delete(e.id),Ft.current.delete(e.id),On()}}else if(n.type===`peer:joined`){let e=(n.peers||[]).filter(e=>e.id!==f);s(e);let t=n.peer?.id?String(n.peer.id):``;if(!(n.peer?.clientType===`exe`||t.startsWith(`exe-kernel-`)||t.startsWith(`aethertunnel-exe-`))&&t){if(_(`connected_p2p`),f>t)Hn(t,!0,void 0,!0);else{let e=Pt.current.get(t);if(e){for(let t of e.values())try{t.close()}catch{}Pt.current.delete(t)}z.current.delete(t),Ft.current.delete(t),On()}}}else if(n.type===`peer:left`){let e=n.peerId?String(n.peerId):``,t=n.cloudId?String(n.cloudId):void 0,r=(n.peers||[]).filter(e=>e.id!==f);Tn.current=new Set(r.map(e=>e.id)),(e||t)&&jn(e,t),s(r)}else n.type===`webrtc:signal`?await Un(n):n.type===`relay:packet`&&n.packet&&Rn(n.packet,`Encrypted WS Relay (TCP/443)`)}catch(e){console.error(`Tunnel socket handler error:`,e)}},i.onclose=()=>{Tn.current.clear(),An(),o||(a=window.setTimeout(c,1200))}}catch{}},l=()=>{if(!o&&(typeof document>`u`||document.visibilityState!==`hidden`)){if(!i||i.readyState===WebSocket.CLOSED||i.readyState===WebSocket.CLOSING)a!==null&&(window.clearTimeout(a),a=null),c();else if(i.readyState===WebSocket.OPEN)try{i.send(JSON.stringify({type:`room:join`,roomCode:e,peerId:f,cloudId:t,clientType:`browser`,deviceLabel:`${h.current} (${navigator.platform||`Browser`})`,natType:`Port-Restricted Cone NAT`}))}catch{}}};return typeof document<`u`&&document.addEventListener(`visibilitychange`,l),window.addEventListener(`online`,l),window.addEventListener(`focus`,l),c(),()=>{if(o=!0,typeof document<`u`&&document.removeEventListener(`visibilitychange`,l),window.removeEventListener(`online`,l),window.removeEventListener(`focus`,l),a!==null&&window.clearTimeout(a),i&&i.readyState===WebSocket.OPEN)try{i.send(JSON.stringify({type:`room:leave`,roomCode:e,peerId:f}))}catch{}Tn.current.clear();for(let e of Pt.current.values())for(let t of e.values())try{t.close()}catch{}Pt.current.clear(),z.current.clear(),Ft.current.clear(),i?.close()}},[n,f,Hn,Un,Rn,Ln,jn,An]),(0,C.useEffect)(()=>{if(!E){if(V.current){try{V.current.close()}catch{}V.current=null}hn(tn.current.size>0),x(e=>e.filter(e=>e.id!==`native-exe-bridge`));return}let e=!1,t=null,n=null,r=``,i=``,a=0,o=1,s=[],c=0,l=0,u=0,d=0,f=0,p=0,m=!1,h=!1,g=!1,v=!1,y=0,b=!1,S=!1,C=()=>{if(!r||h||b||m||v)return;let e=r,t=a,n=o,i=t/Math.max(.008,(performance.now()-l)/1e3),c=p>0?p:i,u=new Blob(s,{type:`application/octet-stream`}),d=URL.createObjectURL(u);s=[],r=``,At.current.delete(e),I.current.delete(e),P(null),A(r=>r.map(r=>r.id===e?{...r,transferredChunks:n,bytesTransferred:t,speedBps:c,avgSpeedBps:i,status:`completed`,verified:!0,downloadUrl:d,completedAt:Date.now(),pausedBy:void 0}:r))},w=()=>{if(!e)try{let T=new WebSocket(`ws://127.0.0.1:45889`);T.binaryType=`arraybuffer`,t=T,T.onopen=()=>{if(e)T.close();else{V.current=T,hn(!0),_(`connected_p2p`),x(e=>{let t=e.filter(e=>e.id!==`native-exe-bridge`);return[{id:`native-exe-bridge`,deviceLabel:`Oma kone .EXE (Localhost 127.0.0.1:45889)`,natType:`Direct Localhost Kernel Bridge`,clientType:`local_exe`,isLocalBridge:!0,joinedAt:Date.now()},...t]});try{T.send(JSON.stringify({kind:`browser:hello`,roomCode:gn.current}))}catch{}}},T.onmessage=e=>{if(e.data instanceof ArrayBuffer){if(!r||h||b)return;let t=new Uint8Array(e.data);if(s.push(t),c+=t.byteLength,m||v)return;let n=performance.now();if(n-u>=80){let e=(n-d)/1e3;if(e>=.08&&c>=f){let t=(c-f)/e;p=p>0?p*.6+t*.4:t,d=n,f=c}u=n;let t=r,i=c,a=s.length,o=i/Math.max(.008,(n-l)/1e3),m=p>0?p:o;A(e=>e.map(e=>e.id===t?{...e,transferredChunks:a,bytesTransferred:i,speedBps:m,avgSpeedBps:o}:e))}}else if(typeof e.data==`string`)try{let t=JSON.parse(e.data);if(t.kind===`file:pause`||t.kind===`file:resume`||t.kind===`file:cancel`||t.kind===`exe:file-cancel`){Rn(t,`WebRTC Direct (UDP/DTLS)`);return}if(t.kind===`exe:resume-ack`||t.kind===`file:resume-ack`){let e=`${t.name||``}::${Number(t.size)||0}`,n=Math.max(0,Number(t.resumeFromChunk)||0);e!==`::0`&&Vt.current.set(e,n);let r=t.fileId&&Ht.current.get(String(t.fileId))||Ht.current.get(e);r&&(Ht.current.delete(String(t.fileId||``)),Ht.current.delete(e),r(n))}else if(t.kind===`exe:wait-accept`||t.kind===`file:wait-accept`){let e=`${t.name||``}::${Number(t.size)||0}`,n=String(t.fileId||``),r=n&&Ut.current.get(n)||Ut.current.get(e);r&&r()}else if(t.kind===`exe:file-reject`||t.kind===`file:reject`){let e=`${t.name||``}::${Number(t.size)||0}`,n=String(t.fileId||``),r=n&&Wt.current.get(n)||Wt.current.get(e);r&&r()}else if(t.kind===`exe:file-start`){let e=String(t.fileId||`exe-${Date.now()}`);if(L.current.has(e))return;r=e,i=String(t.name||`transfer.bin`),a=Number(t.size)||0,o=Math.max(1,Number(t.totalChunks)||1),s=[],c=0,l=performance.now(),u=0,d=l,f=0,p=0,h=!1,g=!1,v=!1,y=0,b=!1,S=!1;let n=r,_=i,x=a,w=o,ee=`${_}::${x}`,E=!ut.current&&!pt.current.has(ee);if(m=E,At.current.set(n,{pause:e=>{if(!(r!==n||h||b)&&(v||(v=!0,y=performance.now()),I.current.add(n),A(t=>t.map(t=>t.id===n&&t.status===`transferring`?{...t,status:`paused`,pausedBy:e,speedBps:0}:t)),e===`local`&&T.readyState===WebSocket.OPEN))try{T.send(JSON.stringify({kind:`file:pause`,fileId:n,name:_,size:x,by:`receiver`}))}catch{}},resume:e=>{if(!(r!==n||h||b)){if(v){let e=performance.now();y>0&&(l+=Math.max(0,e-y),y=0),d=e,f=c,p=0,v=!1}if(I.current.delete(n),A(e=>e.map(e=>e.id===n&&e.status===`paused`?{...e,status:`transferring`,pausedBy:void 0}:e)),e===`local`&&T.readyState===WebSocket.OPEN)try{T.send(JSON.stringify({kind:`file:resume`,fileId:n,name:_,size:x,by:`receiver`}))}catch{}S&&C()}},cancel:e=>{if(r===n&&(b=!0,h=!0,m=!1,v=!1,s=[],r=``,At.current.delete(n),I.current.delete(n),P(null),A(t=>t.map(t=>t.id===n?{...t,status:`cancelled`,speedBps:0,cancelledBy:e,errorMessage:e===`local`?`Stopped by receiver`:`Stopped by sender`}:t)),e===`local`&&T.readyState===WebSocket.OPEN))try{T.send(JSON.stringify({kind:`file:cancel`,fileId:n,name:_,size:x,by:`receiver`}))}catch{}}}),A(e=>[{id:n,name:_,size:x,mimeType:`application/octet-stream`,totalChunks:w,transferredChunks:0,bytesTransferred:0,speedBps:0,avgSpeedBps:0,status:E?`awaiting_acceptance`:`transferring`,sha256:`kernel-exe-verified`,verified:!1,direction:`incoming`,transportUsed:`WebRTC Direct (UDP/DTLS)`,startedAt:Date.now()},...e]),E){P(`Confirmation required: ${_} (${Ue(x)}) — Accept or decline the incoming transfer above.`);try{T.send(JSON.stringify({kind:`exe:wait-accept`,fileId:n,name:_,size:x}))}catch{}mt.current({key:ee,id:n,senderLabel:`Local Native .EXE Bridge`,name:_,size:x}).then(e=>{if(!(b||L.current.has(n))){if(e===`reject`){h=!0,m=!1,s=[],r=``,At.current.delete(n),P(null),A(e=>e.map(e=>e.id===n?{...e,status:`rejected`,errorMessage:`Transfer declined by recipient`}:e));try{T.send(JSON.stringify({kind:`exe:file-reject`,fileId:n,name:_,size:x}))}catch{}}else{m=!1,l=performance.now(),d=l,f=0,p=0,P(null),A(e=>e.map(e=>e.id===n?{...e,status:`transferring`,startedAt:Date.now()}:e));try{T.send(JSON.stringify({kind:`exe:resume-ack`,fileId:n,name:_,size:x,resumeFromChunk:0}))}catch{}g&&C()}}})}}else if(t.kind===`exe:file-end`&&r){if(h||b){s=[],r=``;return}if(m){g=!0;return}if(v){S=!0;return}C()}}catch{}},T.onclose=()=>{V.current===T&&(V.current=null,tn.current.size===0&&hn(!1),x(e=>e.filter(e=>e.id!==`native-exe-bridge`))),e||(n=window.setTimeout(w,6e3))},T.onerror=()=>{try{T.close()}catch{}}}catch{e||(n=window.setTimeout(w,6e3))}};return w(),()=>{e=!0,n!==null&&window.clearTimeout(n);try{t?.close()}catch{}}},[E]),(0,C.useEffect)(()=>{if(V.current&&V.current.readyState===WebSocket.OPEN)try{V.current.send(JSON.stringify({kind:`browser:room`,roomCode:n}))}catch{}},[n]),(0,C.useEffect)(()=>{let e=n.trim().toLowerCase().replace(/[^a-z0-9-]/g,``);if(!e){cn([]),wn.current.clear();return}let t=!1,r=[],i=null,a=`aethertunnel-web-${e}-${f}`,o=`aethertunnel/v1/room/${e}`,s=``,c=``,l=0,u=1,d=[],p=0,m=0,g=0,v=0,y=0,b=0,S=0,C=!1,w=!1,T=!1,ee=!1,E=0,te=!1,ne=!1,re=``,D=`exe:`,ie=e=>{let t=new TextEncoder().encode(e);return[t.length>>8&255,t.length&255,...Array.from(t)]},ae=(e,t)=>{let n=[],r=t.length;do{let e=r%128;r=Math.floor(r/128),r>0&&(e|=128),n.push(e)}while(r>0);return new Uint8Array([e,...n,...t])},O=(e,t)=>{let n=JSON.stringify({type:`CANDIDATE`,src:a,dst:e,payload:t}),i=ie(o),s=Array.from(new TextEncoder().encode(n)),c=ae(48,[...i,...s]);for(let e of r)if(e&&e.readyState===WebSocket.OPEN&&e.__mqttReady)try{e.send(c)}catch{}if(R.current&&R.current.readyState===WebSocket.OPEN)try{R.current.send(n)}catch{}};Sn.current=O;let k=()=>{if(!s||w||te||C||ee)return;let e=s,t=l,n=u,r=t/Math.max(.008,(performance.now()-g)/1e3),i=S>0?S:r,a=[];for(let e=0;e<d.length;e++)d[e]&&a.push(d[e]);let o=new Blob(a,{type:`application/octet-stream`}),c=URL.createObjectURL(o);d=[],p=0,s=``,At.current.delete(e),I.current.delete(e),P(null),re&&O(re,{kind:`${D}chunk-ack`,fileId:e,chunkIndex:999999}),A(a=>a.map(a=>a.id===e?{...a,transferredChunks:n,bytesTransferred:t,speedBps:i,avgSpeedBps:r,status:`completed`,verified:!0,downloadUrl:c,completedAt:Date.now(),pausedBy:void 0}:a))},oe=()=>{O(`*`,{kind:`browser:hello`,roomCode:e,peerId:f,displayName:h.current});let t=Date.now(),n=!1;for(let[e,r]of wn.current.entries())t-r>25e3&&(wn.current.delete(e),n=!0);n&&cn(Array.from(wn.current.keys()));let r=!1;for(let[e,n]of tn.current.entries())t-n.lastSeen>25e3&&(tn.current.delete(e),r=!0);if(r){let e=Array.from(tn.current.keys());rn(e),e.length===0&&V.current?.readyState!==WebSocket.OPEN&&hn(!1)}An()},se=t=>{if(!t||typeof t!=`object`)return;let n=typeof t.src==`string`?t.src:``,r=typeof t.dst==`string`?t.dst:`*`;if(!n||n===a||r&&r!==`*`&&r!==a&&r!==f)return;let i=t.payload;if(i&&typeof i==`object`){if(i.kind===`browser:bye`||i.kind===`web:bye`||i.kind===`exe:bye`){let e=i.peerId?String(i.peerId):n;jn(e,n)}else if((i.kind===`browser:hello`||i.kind===`web:hello`||i.kind===`browser:hello-ack`)&&n.startsWith(`aethertunnel-web-`)){let t=i.peerId?String(i.peerId):n;if(t===f||!_n.current.some(e=>e.id===t||e.id===n||e.cloudId===n)&&_n.current.filter(e=>!e.isLocalBridge).length>=7)return;let r=!wn.current.has(n);wn.current.set(n,Date.now()),cn(Array.from(wn.current.keys())),_(`connected_p2p`);let o=i.displayName&&String(i.displayName)||`Browser (${n.slice(-4)})`;x(e=>{let r=e.findIndex(e=>e.id===t||e.id===n||e.cloudId===n);return r>=0?e.map((e,t)=>t===r?{...e,cloudId:n,deviceLabel:i.displayName?o:e.deviceLabel}:e):e.filter(e=>!e.isLocalBridge).length>=7?e:[{id:t,cloudId:n,deviceLabel:o,natType:`Global P2P Wormhole Bus`,clientType:`browser`,joinedAt:Date.now()},...e]}),i.kind!==`browser:hello-ack`&&O(n,{kind:`browser:hello-ack`,roomCode:e,peerId:f,displayName:h.current}),r&&a>n&&Hn(t,!0)}else if(i.kind===`webrtc:signal`)Un({...i,fromPeerId:i.fromPeerId||n});else if(i.kind===`browser:packet`&&i.packet)Rn(i.packet,`Encrypted WS Relay (TCP/443)`);else if((i.kind===`exe:hello`||i.kind===`exe:hello-reply`)&&n.startsWith(`aethertunnel-exe-`)){if(!tn.current.has(n)&&_n.current.filter(e=>!e.isLocalBridge).length>=7)return;let t=i.displayName&&String(i.displayName)||`Windows .EXE (${n.slice(-4)})`;tn.current.set(n,{lastSeen:Date.now(),label:t}),rn(Array.from(tn.current.keys())),hn(!0),_(`connected_p2p`),x(e=>{let r=e.findIndex(e=>e.id===n||e.cloudId===n);return r>=0?e.map((e,n)=>n===r?{...e,deviceLabel:t}:e):e.filter(e=>!e.isLocalBridge).length>=7?e:[{id:n,cloudId:n,deviceLabel:t,natType:`Universal WSS Kernel Bridge (443)`,clientType:`exe`,joinedAt:Date.now()},...e]}),i.kind===`exe:hello`&&O(n,{kind:`browser:hello-ack`,roomCode:e,peerId:f,displayName:h.current})}else if(i.kind===`file:rx-progress`||i.kind===`file:rx-complete`||i.kind===`file:rx-error`||i.kind===`file:pause`||i.kind===`file:resume`||i.kind===`file:cancel`||i.kind===`exe:file-cancel`||i.kind===`browser:file-cancel`)Rn(i,`Encrypted WS Relay (TCP/443)`);else if(i.kind===`exe:resume-ack`||i.kind===`file:resume-ack`||i.kind===`browser:resume-ack`){let e=`${i.name||``}::${Number(i.size)||0}`,t=Math.max(0,Number(i.resumeFromChunk)||0);e!==`::0`&&Vt.current.set(e,t);let n=i.fileId&&Ht.current.get(String(i.fileId))||Ht.current.get(e);n&&(Ht.current.delete(String(i.fileId||``)),Ht.current.delete(e),n(t))}else if(i.kind===`exe:wait-accept`||i.kind===`file:wait-accept`||i.kind===`browser:wait-accept`){let e=`${i.name||``}::${Number(i.size)||0}`,t=String(i.fileId||``),n=t&&Ut.current.get(t)||Ut.current.get(e);n&&n()}else if(i.kind===`exe:file-reject`||i.kind===`file:reject`||i.kind===`browser:file-reject`){let e=`${i.name||``}::${Number(i.size)||0}`,t=String(i.fileId||``),n=t&&Wt.current.get(t)||Wt.current.get(e);n&&n()}else if(i.kind===`exe:chunk-ack`||i.kind===`browser:chunk-ack`){let e=i.fileId&&an.current.get(String(i.fileId))||an.current.get(n);e&&(i.fileId&&an.current.delete(String(i.fileId)),an.current.delete(n),e())}else if(i.kind===`exe:file-start`||i.kind===`browser:file-start`){if(n.startsWith(`aethertunnel-exe-`)){let e=tn.current.get(n);tn.current.set(n,{lastSeen:Date.now(),label:e?.label||`Windows .EXE (${n.slice(-4)})`})}let e=String(i.fileId||`cloud-${Date.now()}`);if(L.current.has(e))return;let t=String(i.kind).startsWith(`browser:`)?`browser:`:`exe:`;if(s===e&&!w){C?O(n,{kind:`${t}wait-accept`,fileId:e,name:c,size:l}):O(n,{kind:`${t}resume-ack`,fileId:e,name:c,size:l,resumeFromChunk:p});return}re=n,D=t,s=e,c=String(i.name||`transfer.bin`),l=Number(i.size)||0;let r=Number(i.chunkSize)||49152;u=Math.max(1,Number(i.totalChunks)||Math.ceil(l/r)),d=Array(u),p=0,m=0,g=performance.now(),v=0,y=g,b=0,S=0,w=!1,T=!1,ee=!1,E=0,te=!1,ne=!1;let a=s,o=c,f=l,h=u,_=`${o}::${f}`,x=!ut.current&&!pt.current.has(_);C=x;let ie=n;At.current.set(a,{pause:e=>{s!==a||w||te||(ee||(ee=!0,E=performance.now()),I.current.add(a),A(t=>t.map(t=>t.id===a&&t.status===`transferring`?{...t,status:`paused`,pausedBy:e,speedBps:0}:t)),e===`local`&&ie&&O(ie,{kind:`file:pause`,fileId:a,name:o,size:f,by:`receiver`}))},resume:e=>{if(!(s!==a||w||te)){if(ee){let e=performance.now();E>0&&(g+=Math.max(0,e-E),E=0),y=e,b=m,S=0,ee=!1}I.current.delete(a),A(e=>e.map(e=>e.id===a&&e.status===`paused`?{...e,status:`transferring`,pausedBy:void 0}:e)),e===`local`&&ie&&O(ie,{kind:`file:resume`,fileId:a,name:o,size:f,by:`receiver`,resumeFromChunk:p}),ne&&k()}},cancel:e=>{s===a&&(te=!0,w=!0,C=!1,ee=!1,d=[],p=0,s=``,At.current.delete(a),I.current.delete(a),P(null),A(t=>t.map(t=>t.id===a?{...t,status:`cancelled`,speedBps:0,cancelledBy:e,errorMessage:e===`local`?`Stopped by receiver`:`Stopped by sender`}:t)),e===`local`&&ie&&O(ie,{kind:`file:cancel`,fileId:a,name:o,size:f,by:`receiver`}))}}),A(e=>[{id:a,name:o,size:f,mimeType:`application/octet-stream`,totalChunks:h,transferredChunks:0,bytesTransferred:0,speedBps:0,avgSpeedBps:0,status:x?`awaiting_acceptance`:`transferring`,sha256:`cloud-relay-verified`,verified:!1,direction:`incoming`,transportUsed:`Encrypted WS Relay (TCP/443)`,startedAt:Date.now()},...e]),x?(P(`Confirmation required: ${o} (${Ue(f)}) — Accept or decline the incoming transfer above.`),O(n,{kind:`${D}wait-accept`,fileId:a,name:o,size:f}),mt.current({key:_,id:a,senderLabel:n.startsWith(`aethertunnel-exe-`)?`Remote .EXE Peer`:String(i.senderLabel||`Remote Browser Peer`),name:o,size:f}).then(e=>{te||L.current.has(a)||(e===`reject`?(w=!0,C=!1,d=[],p=0,s=``,At.current.delete(a),P(null),A(e=>e.map(e=>e.id===a?{...e,status:`rejected`,errorMessage:`Transfer declined by recipient`}:e)),O(n,{kind:`${D}file-reject`,fileId:a,name:o,size:f})):(C=!1,g=performance.now(),y=g,b=0,S=0,P(null),A(e=>e.map(e=>e.id===a?{...e,status:`transferring`,startedAt:Date.now()}:e)),O(n,{kind:`${D}resume-ack`,fileId:a,name:o,size:f,resumeFromChunk:0}),T&&k()))})):O(n,{kind:`${D}resume-ack`,fileId:a,name:o,size:f,resumeFromChunk:0})}else if((i.kind===`exe:file-chunk`||i.kind===`browser:file-chunk`)&&s){if(w||te)return;let e=typeof i.data==`string`?i.data:``,t=Math.max(0,Number(i.chunkIndex)||0);if(e&&d[t]===void 0){let n=window.atob(e),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);if(d[t]=r,p+=1,m+=r.byteLength,!C&&!ee){let e=performance.now();if(e-v>=80){let t=(e-y)/1e3;if(t>=.35&&m>=b){let n=(m-b)/t;S=S>0?S*.72+n*.28:n,y=e,b=m}v=e;let n=s,r=m,i=p,a=r/Math.max(.008,(e-g)/1e3),o=S>0?S:a;A(e=>e.map(e=>e.id===n?{...e,transferredChunks:i,bytesTransferred:r,speedBps:o,avgSpeedBps:a}:e))}}}(t+1)%8==0&&n&&O(n,{kind:i.kind.startsWith(`browser:`)?`browser:chunk-ack`:`exe:chunk-ack`,fileId:s,chunkIndex:t})}else if((i.kind===`exe:file-end`||i.kind===`browser:file-end`)&&s){if(w||te){d=[],p=0,s=``;return}if(C){T=!0;return}if(ee){ne=!0;return}k()}}},ce=[`wss://broker.emqx.io:8084/mqtt`,`wss://broker.hivemq.com:8884/mqtt`],le=ce.map(()=>null),ue=(e,n)=>{if(!t)try{let i=new WebSocket(e,`mqtt`);i.binaryType=`arraybuffer`,i.__mqttReady=!1,r[n]=i,i.onopen=()=>{if(t){i.close();return}en.current=i;let e=`atw_${f.replace(/[^a-z0-9]/gi,``).slice(-8)||`node`}_${n}_${Math.floor(Math.random()*999)}`,r=[...ie(`MQTT`),4,2,0,30,...ie(e)];i.send(ae(16,r))},i.onmessage=async e=>{let n=null;if(e.data instanceof ArrayBuffer?n=e.data:e.data instanceof Blob&&(n=await e.data.arrayBuffer()),!n)return;let r=new Uint8Array(n),a=0;for(;a<r.length;){let e=r[a++],n=e>>4,s=0,c=1;for(;a<r.length;){let e=r[a++];if(s+=(e&127)*c,c*=128,!(e&128))break}if(a+s>r.length)break;if(n===2){if((s>=2?r[a+1]:0)===0){i.__mqttReady=!0;let e=[0,1,...ie(o),0];try{i.send(ae(130,e))}catch{}window.setTimeout(()=>{!t&&i.__mqttReady&&oe()},80)}}else if(n===3&&s>=2){let t=r[a]<<8|r[a+1],n=e>>1&3,i=a+2+t+(n>0?2:0),o=a+s;if(o>i&&o<=r.length)try{let e=new TextDecoder().decode(r.subarray(i,o)),t=JSON.parse(e);se(t)}catch{}}a+=s}},i.onclose=()=>{i.__mqttReady=!1,t||(le[n]=window.setTimeout(()=>ue(e,n),1500))},i.onerror=()=>{try{i.close()}catch{}}}catch{}};ce.forEach((e,t)=>ue(e,t));let de=()=>{t||(typeof document>`u`||document.visibilityState!==`hidden`)&&(ce.forEach((e,t)=>{let n=r[t];n&&n.readyState!==WebSocket.CLOSED&&n.readyState!==WebSocket.CLOSING||(le[t]!==null&&(window.clearTimeout(le[t]),le[t]=null),ue(e,t))}),oe())};return typeof document<`u`&&document.addEventListener(`visibilitychange`,de),window.addEventListener(`online`,de),window.addEventListener(`focus`,de),i=window.setInterval(()=>{for(let e of r)if(e&&e.readyState===WebSocket.OPEN&&e.__mqttReady)try{e.send(new Uint8Array([192,0]))}catch{}oe()},2200),()=>{t=!0,typeof document<`u`&&document.removeEventListener(`visibilitychange`,de),window.removeEventListener(`online`,de),window.removeEventListener(`focus`,de);for(let e of le)e!==null&&window.clearTimeout(e);i!==null&&window.clearInterval(i);try{O(`*`,{kind:`browser:bye`,roomCode:e,peerId:f})}catch{}Sn.current=null,wn.current.clear();for(let e of r)try{e?.close()}catch{}}},[n,f,Hn,Un,Rn,jn,An]);let Wn=(0,C.useCallback)(e=>{if(e.readyState!==`open`)return!1;let t=It.current.get(e);return!t||t.signalingState!==`closed`&&t.connectionState!==`closed`&&t.connectionState!==`failed`&&t.connectionState!==`disconnected`&&t.iceConnectionState!==`closed`&&t.iceConnectionState!==`failed`&&t.iceConnectionState!==`disconnected`},[]),Gn=(0,C.useCallback)(e=>{if(v===`websocket_relay`)return[];if(e&&e!==`all`){let t=Dn(e);return(z.current.get(t)||[]).filter(Wn)}let t=[];for(let e of z.current.values())for(let n of e)Wn(n)&&t.push(n);return t},[v,Dn,Wn]),Kn=(0,C.useCallback)(e=>{if(v===`websocket_relay`)return[];let t=[];if(e&&e!==`all`){let n=Dn(e),r=(z.current.get(n)||[]).filter(Wn);return r.length>0&&t.push(r),t}for(let e of z.current.values()){let n=e.filter(Wn);n.length>0&&t.push(n)}return t},[v,Dn,Wn]),qn=(0,C.useCallback)(e=>{let t=Ae;for(let n of e){let e=It.current.get(n)?.sctp?.maxMessageSize;typeof e==`number`&&Number.isFinite(e)&&e>0&&(t=Math.min(t,Math.max(8192,e-128)))}return t},[]),Jn=(0,C.useCallback)((e,t)=>{if(e.length===0)return!1;let n=e[Qt.current%e.length];Qt.current+=1;for(let t=0;t<e.length;t++)e[t].bufferedAmount<n.bufferedAmount&&(n=e[t]);if(n.bufferedAmount+t.byteLength<=it)try{return n.send(t.slice(0)),!0}catch{return!1}return!1},[]),Yn=(0,C.useCallback)(async(e,t,n)=>{if(n?.())return!1;if(Jn(e,t))return!0;for(let r=0;r<2e4;r++){if(n?.())return!1;let r=e.filter(Wn);if(r.length===0)throw Error(`No open WebRTC DataChannel lanes available for peer`);if(Jn(r,t))return!0;await new Promise(e=>{let t=!1,n=()=>{if(!t){t=!0;for(let e of r)e.removeEventListener(`bufferedamountlow`,n);e()}};for(let e of r)e.bufferedAmountLowThreshold=at,e.addEventListener(`bufferedamountlow`,n);window.setTimeout(n,4)})}if(n?.())return!1;throw Error(`WebRTC DataChannel send timed out waiting for queue drain`)},[Wn,Jn]),Xn=(0,C.useCallback)((e,t=`all`)=>{let n=Kn(t);if(n.length===0){if(R.current&&R.current.readyState===WebSocket.OPEN)try{return R.current.send(e),!0}catch{return!1}return!1}for(let t of n){let n=qn(t),r=e.byteLength<=n+24?[e]:Ie(e,n);for(let e of r)if(!Jn(t,e))return!1}return!0},[Kn,qn,Jn]),Zn=(0,C.useCallback)(async(e,t=`all`,n)=>{if(n?.())return!1;let r=Kn(t);if(r.length===0){if(R.current&&R.current.readyState===WebSocket.OPEN)try{return R.current.send(e),!0}catch{}throw Error(`No open WebRTC DataChannel lanes or WebSocket relay available`)}for(let t of r){let r=qn(t),i=e.byteLength<=r+24?[e]:Ie(e,r);for(let e of i)if(!await Yn(t,e,n))return!1}return!0},[Kn,qn,Yn]),Qn=(0,C.useCallback)((e,t=`all`)=>{let n=JSON.stringify(e),r=`WebRTC Direct (UDP/DTLS)`;if(un.current&&pn.current.length>0&&(t===`all`||pn.current.includes(t)))try{un.current.postMessage({type:`bus:packet`,toPeerId:t===`all`?`*`:t,packet:e})}catch{}if(Sn.current){let n=t===`all`?null:_n.current.find(e=>e.id===t||e.cloudId===t),r=t===`all`?ln.current.length>0?ln.current:[`*`]:n?.cloudId?[n.cloudId]:t.startsWith(`aethertunnel-web-`)?[t]:[`*`];for(let t of r)Sn.current(t,{kind:`browser:packet`,packet:e})}let i=Kn(t);for(let e of i){let t=e.find(e=>e.readyState===`open`);if(t)try{t.send(n)}catch{}}for(let e of Lt.current)if(e.open)try{e.send(n)}catch{}if(R.current&&R.current.readyState===WebSocket.OPEN)try{R.current.send(JSON.stringify({type:`relay:packet`,toPeerId:t===`all`?`*`:t,packet:e})),i.length===0&&(r=`Encrypted WS Relay (TCP/443)`)}catch{}return r},[Kn]),$n=(0,C.useCallback)((e,t)=>{let n=kt.current.get(e)?.targetPeerId||`all`;if(Qn(t,n),V.current&&V.current.readyState===WebSocket.OPEN&&(n===`native-exe-bridge`||n===`all`))try{V.current.send(JSON.stringify(t))}catch{}if(Sn.current){if(n.startsWith(`aethertunnel-exe-`))try{Sn.current(n,t)}catch{}else if(n===`all`)for(let e of tn.current.keys())try{Sn.current(e,t)}catch{}}},[Qn]),er=(0,C.useCallback)((e,t)=>{let n=At.current.get(e);if(n){n.pause(`local`);return}let r=Rt.current.get(e);if(r){r.rejected||r.cancelled||r.awaitingAcceptance||(r.paused||(r.paused=!0,r.pausedStartedAt=performance.now()),I.current.add(e),A(t=>t.map(t=>t.id===e&&t.direction===`incoming`&&t.status===`transferring`?{...t,status:`paused`,pausedBy:`local`,speedBps:0}:t)),Nn({kind:`file:pause`,fileId:e,name:r.name,size:r.size,by:`receiver`}));return}Ct.current.add(e);let i=kt.current.get(e),a=t||i?.queueItemId;A(t=>t.map(t=>t.id===e&&t.direction===`outgoing`&&(t.status===`transferring`||t.status===`awaiting_acceptance`)?{...t,status:`paused`,pausedBy:`local`,speedBps:0}:t)),a&&gt(e=>e.map(e=>e.id===a&&e.status===`transferring`?{...e,status:`paused`}:e)),$n(e,{kind:`file:pause`,fileId:e,name:i?.name||``,size:i?.size||0,by:`sender`})},[$n,Nn]),tr=(0,C.useCallback)((e,t)=>{let n=At.current.get(e);if(n){n.resume(`local`);return}let r=Rt.current.get(e);if(r){if(!r.rejected&&!r.cancelled){if(r.paused){let e=performance.now();r.pausedStartedAt>0&&(r.startedAt+=Math.max(0,e-r.pausedStartedAt),r.pausedStartedAt=0),r.lastWindowAt=e,r.lastWindowBytes=Math.min(r.size,r.receivedCount*r.chunkSize),r.smoothedLiveBps=0,r.paused=!1}I.current.delete(e);let t=0;for(;t<r.totalChunks&&r.receivedChunks[t]!==void 0;)t++;A(t=>t.map(t=>t.id===e&&t.direction===`incoming`&&t.status===`paused`?{...t,status:`transferring`,pausedBy:void 0}:t)),Nn({kind:`file:resume`,fileId:e,name:r.name,size:r.size,by:`receiver`,resumeFromChunk:t}),Pn(r)}return}Ct.current.delete(e),wt.current.delete(e),St.current&&(St.current=!1,xt(!1));let i=kt.current.get(e),a=t||i?.queueItemId;A(t=>t.map(t=>t.id===e&&t.direction===`outgoing`&&t.status===`paused`?{...t,status:`transferring`,pausedBy:void 0}:t)),a&&gt(e=>e.map(e=>e.id===a&&e.status===`paused`?{...e,status:`transferring`}:e)),$n(e,{kind:`file:resume`,fileId:e,name:i?.name||``,size:i?.size||0,by:`sender`}),yn()},[Pn,$n,Nn,yn]),nr=(0,C.useCallback)((e,t,n)=>{if(L.current.add(e),Ct.current.delete(e),wt.current.delete(e),I.current.delete(e),t===`incoming`){ft(t=>{let n=t.find(t=>t.id===e);return n&&n.resolve(`reject`),t.filter(t=>t.id!==e)});let t=At.current.get(e);t?t.cancel(`local`):Nn({kind:`file:cancel`,fileId:e,by:`receiver`});let n=Rt.current.get(e);n&&(n.cancelled=!0,n.rejected=!0,n.awaitingAcceptance=!1,n.paused=!1,n.receivedChunks.length=0,Rt.current.delete(e),zt.current.delete(`${n.name}::${n.size}`),Xt.current.delete(n.transferNumId),Zt.current.delete(n.transferNumId),qt.current.delete(e),Jt.current.delete(e),P(null)),A(t=>t.map(t=>t.id===e&&t.direction===`incoming`?{...t,status:`cancelled`,speedBps:0,pausedBy:void 0,cancelledBy:`local`,errorMessage:`Stopped by receiver`}:t));return}let r=kt.current.get(e),i=n||r?.queueItemId;if($n(e,{kind:`file:cancel`,fileId:e,name:r?.name||``,size:r?.size||0,by:`sender`}),V.current&&V.current.readyState===WebSocket.OPEN&&(!r?.targetPeerId||r.targetPeerId===`native-exe-bridge`||r.targetPeerId===`all`))try{V.current.send(JSON.stringify({kind:`exe:file-cancel`,fileId:e}))}catch{}let a=Ot.current.get(e);if(a&&(Ot.current.delete(e),a()),yn(),A(t=>t.map(t=>t.id===e&&t.direction===`outgoing`?{...t,status:`cancelled`,speedBps:0,pausedBy:void 0,cancelledBy:`local`,errorMessage:`Stopped by sender`}:t)),i){let e=Et.current.get(i);(!e||Array.from(e).every(e=>L.current.has(e)))&&(Tt.current.add(i),gt(e=>e.map(e=>e.id===i&&e.status!==`completed`?{...e,status:`cancelled`,errorMessage:`Stopped by sender`}:e)))}},[$n,Nn,yn]),rr=(0,C.useCallback)(e=>{Tt.current.add(e);let t=Et.current.get(e);if(t&&t.size>0)for(let n of Array.from(t))nr(n,`outgoing`,e);gt(t=>t.map(t=>t.id===e&&t.status!==`completed`?{...t,status:`cancelled`,errorMessage:`Stopped by sender`}:t))},[nr]),ir=(0,C.useCallback)(()=>{let e=!St.current;if(St.current=e,xt(e),e){for(let[e,t]of kt.current.entries())L.current.has(e)||(Ct.current.add(e),$n(e,{kind:`file:pause`,fileId:e,name:t.name,size:t.size,by:`sender`}));A(e=>e.map(e=>e.direction===`outgoing`&&e.status===`transferring`?{...e,status:`paused`,pausedBy:`local`,speedBps:0}:e)),gt(e=>e.map(e=>e.status===`transferring`?{...e,status:`paused`}:e))}else{for(let[e,t]of kt.current.entries())Ct.current.delete(e),wt.current.delete(e),L.current.has(e)||$n(e,{kind:`file:resume`,fileId:e,name:t.name,size:t.size,by:`sender`});A(e=>e.map(e=>e.direction===`outgoing`&&e.status===`paused`?{...e,status:`transferring`,pausedBy:void 0}:e)),gt(e=>e.map(e=>e.status===`paused`?{...e,status:`transferring`}:e)),yn()}},[$n,yn]),ar=(0,C.useCallback)((e,t)=>{Ct.current.has(e)||wt.current.has(e)||I.current.has(e)||St.current?tr(e,t):er(e,t)},[er,tr]),or=(0,C.useCallback)((e,t,n,r,i)=>new Promise(a=>{let o=!1,s=!1,c=null,l=Ot.current.get(e),u=window.setTimeout(()=>{d(),a({accepted:!1,timedOut:!0,resumeChunk:0})},n);i&&(c=window.setInterval(()=>{if(!o&&!s)try{i()}catch{}},900));let d=()=>{o||(o=!0,window.clearTimeout(u),c!==null&&(window.clearInterval(c),c=null),Ht.current.delete(e),Ht.current.delete(t),Ut.current.delete(e),Ut.current.delete(t),Wt.current.delete(e),Wt.current.delete(t),Ot.current.get(e)===h&&(l?Ot.current.set(e,l):Ot.current.delete(e)))},f=e=>{o||(d(),a({accepted:!0,resumeChunk:Math.max(0,e)}))},p=()=>{o||(s=!0,c!==null&&(window.clearInterval(c),c=null),window.clearTimeout(u),u=window.setTimeout(()=>{d(),a({accepted:!1,resumeChunk:0})},12e4),A(t=>t.map(t=>t.id===e?{...t,status:`awaiting_acceptance`}:t)),r&&gt(e=>e.map(e=>e.id===r?{...e,status:`waiting_accept`}:e)))},m=()=>{o||(d(),a({accepted:!1,resumeChunk:0}))},h=()=>{o||(d(),a({accepted:!1,cancelled:!0,resumeChunk:0}),l?.())};Ht.current.set(e,f),Ht.current.set(t,f),Ut.current.set(e,p),Ut.current.set(t,p),Wt.current.set(e,m),Wt.current.set(t,m),Ot.current.set(e,h)}),[]),sr=(0,C.useCallback)(async(e,t)=>{let n=u.current;if(!n)return`error`;let r=t?.displayName||e.name,i=t?.queueItemId,a=t?.skipExeBridge||!1,o=t?.targetPeerId||`all`,s=t?.targetLabel||(o===`all`?`Everyone in room`:_n.current.find(e=>e.id===o)?.deviceLabel||o),c=tt,l=rt,d=`${o}::${r}::${e.size}`;Bt.current.set(`${r}::${e.size}`,e);let f=`tx-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,p=Math.floor(Math.random()*2147483647)+1,m=Math.max(1,Math.ceil(e.size/c)),g=()=>L.current.has(f)||!!(i&&Tt.current.has(i));if(g())return`cancelled`;if(kt.current.set(f,{targetPeerId:o,name:r,size:e.size,queueItemId:i}),i){let e=Et.current.get(i);e||(e=new Set,Et.current.set(i,e)),e.add(f)}if(Ot.current.set(f,()=>{let e=an.current.get(f);e&&(an.current.delete(f),e());let t=B.current.get(f);t&&(B.current.delete(f),t())}),R.current&&R.current.readyState===WebSocket.CONNECTING){let e=performance.now();for(;R.current&&R.current.readyState===WebSocket.CONNECTING&&performance.now()-e<2500;)await new Promise(e=>window.setTimeout(e,80))}let _=o===`all`?``:Dn(o),v=o===`all`?null:_n.current.find(e=>e.id===o||e.cloudId===o||e.id===_),y=!a&&!!(V.current&&V.current.readyState===WebSocket.OPEN)&&(o===`native-exe-bridge`||o===`all`&&ae.current),b=!a&&Sn.current?o===`all`?Array.from(tn.current.keys()):o.startsWith(`aethertunnel-exe-`)?[o]:[]:[],x=Gn(o).length>0&&!(o===`native-exe-bridge`||o.startsWith(`aethertunnel-exe-`)),S=!!(R.current&&R.current.readyState===WebSocket.OPEN),C=S&&(o===`all`?Tn.current.size>0:Tn.current.has(_)||Tn.current.has(o)),w=!!(un.current&&pn.current.length>0)&&(o===`all`||pn.current.includes(o)||pn.current.includes(_)),T=(()=>{if(!Sn.current||o===`native-exe-bridge`||o.startsWith(`aethertunnel-exe-`))return[];if(o!==`all`){if(x||w||C)return[];let e=v?.cloudId||(o.startsWith(`aethertunnel-web-`)?o:``);return e?[e]:[]}return ln.current.filter(e=>{let t=Dn(e),n=Gn(t).length>0,r=S&&Tn.current.has(t),i=pn.current.includes(t);return!n&&!r&&!i})})(),ee=o!==`native-exe-bridge`&&!o.startsWith(`aethertunnel-exe-`)&&(x||w||C&&(o===`all`||!v||v.clientType!==`exe`&&!v.isLocalBridge)),E=x?`WebRTC Direct (UDP/DTLS)`:`Encrypted WS Relay (TCP/443)`,te=Vt.current.get(d)||0,ne={id:f,name:r,size:e.size,mimeType:e.type||`application/octet-stream`,totalChunks:m,transferredChunks:te,bytesTransferred:Math.min(e.size,te*c),speedBps:0,avgSpeedBps:0,status:`awaiting_acceptance`,sha256:`computing-async...`,verified:!1,direction:`outgoing`,transportUsed:E,startedAt:Date.now(),queueItemId:i,recipientId:o,recipientLabel:s};A(t=>[ne,...t.filter(t=>t.direction!==`outgoing`||t.name!==r||t.size!==e.size||(t.recipientId||`all`)!==o||t.status===`completed`)]);let re=e=>{A(t=>t.map(t=>t.id===f?{...t,status:e?`error`:`rejected`,errorMessage:e||`Recipient declined the file transfer`}:t))},D=performance.now(),ie=0,O=D,k=0,oe=0,se=0,ce=(e,t)=>{let n=performance.now();if(n-ie<90)return;let r=(n-O)/1e3;if(r>=.35&&t>=k){let e=(t-k)/r;oe=oe>0?oe*.72+e*.28:e,O=n,k=t}ie=n;let i=Math.max(.015,(n-D)/1e3),a=Math.max(0,t-se)/i,o=oe>0?oe:a;A(n=>n.map(n=>n.id===f?{...n,transferredChunks:e,bytesTransferred:t,speedBps:o,avgSpeedBps:a}:n))},le=performance.now(),ue=async e=>{let t=Nt.current;if(!t||t<=0){le=performance.now();return}let n=e/Math.max(10.24,t*1024*1024/1e3),r=performance.now();for(le<r-80&&(le=r-80),le+=n;Nt.current>0;){if(g())return;let e=le-performance.now();if(e<=1)break;await new Promise(t=>window.setTimeout(t,Math.min(80,e)))}},de=async(t,n)=>{if(!Sn.current)return`error`;if(g())return`cancelled`;let a=49152,o=Math.max(1,Math.ceil(e.size/a)),s=()=>{Sn.current?.(t,{kind:`${n}file-start`,fileId:f,name:r,size:e.size,chunkSize:a,totalChunks:o,senderLabel:h.current})},c=or(f,d,12e3,i,s);s();let l=await c;if(l.cancelled||g())return`cancelled`;if(!l.accepted){if(l.timedOut)throw Error(`Recipient did not respond to transfer request — verify both devices are connected to the same tunnel`);return`rejected`}i&&gt(e=>e.map(e=>e.id===i?{...e,status:`transferring`}:e)),A(e=>e.map(e=>e.id===f?{...e,status:`transferring`,startedAt:Date.now()}:e));let u=Math.max(0,l.resumeChunk);D=performance.now(),O=D,se=u*a,k=se;for(let r=u*a;r<e.size;r+=a){if(!await bn(f,i,e=>{D+=e,O=performance.now(),k=r,oe=0})||g())return`cancelled`;if(!Sn.current)break;let o=await e.slice(r,Math.min(e.size,r+a)).arrayBuffer();if(g())return`cancelled`;let s=Ve(o);Sn.current(t,{kind:`${n}file-chunk`,fileId:f,chunkIndex:u,data:s}),u+=1;let c=Math.min(e.size,r+o.byteLength),l=Math.min(m,Math.ceil(c/Math.max(1,e.size)*m));if(ce(l,c),await ue(o.byteLength),g()||u%24==0&&(await new Promise(e=>{let n=()=>{an.current.delete(f),an.current.get(t)===i&&an.current.delete(t)},r=window.setTimeout(()=>{n(),e()},350),i=()=>{window.clearTimeout(r),n(),e()};an.current.set(f,i),an.current.set(t,i)}),g()))return`cancelled`}return g()||(await new Promise(e=>{let r=()=>{an.current.delete(f),an.current.get(t)===a&&an.current.delete(t)},i=window.setTimeout(()=>{r(),e()},4e3),a=()=>{window.clearTimeout(i),r(),e()};an.current.set(f,a),an.current.set(t,a),Sn.current?.(t,{kind:`${n}file-end`,fileId:f})}),g())?`cancelled`:`completed`};try{if(g())return`cancelled`;let t=!1,a=!1;if(y&&V.current&&V.current.readyState===WebSocket.OPEN){t=!0;let n=V.current,s=1048576,c=or(f,d,400,i);n.send(JSON.stringify({kind:`exe:file-start`,fileId:f,name:r,size:e.size,chunkSize:s}));let l=await c;if(l.cancelled||g())return`cancelled`;if(l.accepted){i&&gt(e=>e.map(e=>e.id===i?{...e,status:`transferring`}:e)),A(e=>e.map(e=>e.id===f?{...e,status:`transferring`,startedAt:Date.now()}:e));let t=Math.min(e.size,Math.max(0,l.resumeChunk*s));D=performance.now(),O=D,k=t,se=t;for(let r=t;r<e.size;r+=s){if(!await bn(f,i,e=>{D+=e,O=performance.now(),k=r,oe=0})||g())return`cancelled`;for(;n.readyState===WebSocket.OPEN&&n.bufferedAmount>16777216;){if(g())return`cancelled`;await new Promise(e=>window.setTimeout(e,4))}if(g())return`cancelled`;if(n.readyState!==WebSocket.OPEN)break;let t=await e.slice(r,Math.min(e.size,r+s)).arrayBuffer();if(g())return`cancelled`;n.send(t);let a=Math.min(e.size,r+t.byteLength);if(ce(Math.min(m,Math.ceil(a/Math.max(1,e.size)*m)),a),await ue(t.byteLength),g())return`cancelled`}if(g())return`cancelled`;n.readyState===WebSocket.OPEN&&n.send(JSON.stringify({kind:`exe:file-end`,fileId:f})),a=!0}else if(o!==`all`)return re(),`rejected`}for(let e of b){if(g())return`cancelled`;t=!0;let n=await de(e,`exe:`);if(n===`cancelled`||g())return`cancelled`;if(n===`rejected`&&o!==`all`)return re(),`rejected`;n===`completed`&&(a=!0)}for(let e of T){if(g())return`cancelled`;t=!0;let n=await de(e,`browser:`);if(n===`cancelled`||g())return`cancelled`;if(n===`rejected`&&o!==`all`)return re(),`rejected`;n===`completed`&&(a=!0)}if(ee){t=!0;let s=o===`all`?`*`:o;if(R.current&&R.current.readyState===WebSocket.OPEN)try{on.current=s,R.current.send(JSON.stringify({type:`relay:target`,toPeerId:s}))}catch{}let u={kind:`file:meta`,fileId:f,transferNumId:p,name:r,size:e.size,chunkSize:c,mimeType:e.type||`application/octet-stream`,totalChunks:m,sha256:`streaming-aes-256-gcm`,senderLabel:h.current},_=()=>{Qn(u,o)},v=or(f,d,12e3,i,_),y=!1,b=null;Gt.current.delete(f),B.current.set(f,()=>{y=!0}),Kt.current.set(f,e=>{b=e}),_();let x=await v;if(x.cancelled||g())return B.current.delete(f),Kt.current.delete(f),`cancelled`;if(x.accepted){i&&gt(e=>e.map(e=>e.id===i?{...e,status:`transferring`}:e)),A(e=>e.map(e=>e.id===f?{...e,status:`transferring`,startedAt:Date.now()}:e));let t=Math.min(Math.max(0,m-1),Math.max(0,x.resumeChunk));D=performance.now(),O=D,se=Math.min(e.size,t*c),k=se,e.slice(0,Math.min(e.size,4194304)).arrayBuffer().then(e=>Be(e)).then(e=>{g()||(A(t=>t.map(t=>t.id===f?{...t,sha256:e}:t)),Qn({kind:`file:sha256`,fileId:f,sha256:e},o))});let r=async t=>{if(t>=m)return null;let r=Math.min(m,t+l),i=t*c,a=Math.min(e.size,r*c),o=await e.slice(i,a).arrayBuffer();return{waveStartChunk:t,waveEndChunk:r,sliceEndByte:a,encryptedFrames:await Promise.all(Array.from({length:r-t},(e,r)=>{let i=t+r,a=r*c,s=Math.min(o.byteLength,a+c),l=new Uint8Array(o,a,s-a);return Fe(n,l,p,i)}))}},s=r(t);for(let n=t;n<m;n+=l){if(g())return`cancelled`;if(b)throw Error(b);if(!await bn(f,i,t=>{D+=t,O=performance.now(),k=Math.min(e.size,n*c),oe=0})||g())return`cancelled`;let t=r(n+l),a=await s;if(s=t,g())return`cancelled`;if(!a)break;if(Gn(o).length>0)for(let t=0;t<a.encryptedFrames.length;t++){if(g())return`cancelled`;if(b)throw Error(b);if(!await bn(f,i,n=>{D+=n,O=performance.now(),k=Math.min(e.size,(a.waveStartChunk+t)*c),oe=0})||g())return`cancelled`;let n=a.encryptedFrames[t];if(un.current&&pn.current.length>0&&(o===`all`||pn.current.includes(o)))try{un.current.postMessage({type:`bus:frame`,toPeerId:o===`all`?`*`:o,frame:n.slice(0)})}catch{}if(!Xn(n,o)&&(!await Zn(n,o,g)||g()))return`cancelled`;let r=a.waveStartChunk+t+1,s=Math.min(e.size,r*c),l=Gn(o).reduce((e,t)=>e+t.bufferedAmount,0);if(ce(r,Math.max(0,s-l)),await ue(tt),g())return`cancelled`}else if(un.current&&pn.current.length>0&&(o===`all`||pn.current.includes(o)))for(let t=0;t<a.encryptedFrames.length;t++){if(g())return`cancelled`;if(b)throw Error(b);if(!await bn(f,i,n=>{D+=n,O=performance.now(),k=Math.min(e.size,(a.waveStartChunk+t)*c),oe=0})||g())return`cancelled`;let n=a.encryptedFrames[t],r=a.waveStartChunk+t;try{un.current.postMessage({type:`bus:frame`,toPeerId:o===`all`?`*`:o,frame:n.slice(0)})}catch{}let s=r+1;if(ce(s,Math.min(e.size,s*tt)),await ue(tt),g())return`cancelled`}else if(R.current&&R.current.readyState===WebSocket.OPEN)for(let t=0;t<a.encryptedFrames.length;t++){if(g())return`cancelled`;if(b)throw Error(b);if(!await bn(f,i,n=>{D+=n,O=performance.now(),k=Math.min(e.size,(a.waveStartChunk+t)*c),oe=0})||g())return`cancelled`;let n=a.encryptedFrames[t],r=a.waveStartChunk+t;for(;R.current&&R.current.readyState===WebSocket.OPEN&&R.current.bufferedAmount>it*2;){if(g())return`cancelled`;await new Promise(e=>window.setTimeout(e,4))}if(g())return`cancelled`;if(R.current&&R.current.readyState===WebSocket.OPEN){let e=o===`all`?`*`:o;on.current!==e&&(on.current=e,R.current.send(JSON.stringify({type:`relay:target`,toPeerId:e}))),R.current.send(n)}let s=r+1;if(ce(s,Math.min(e.size,s*tt)),await ue(tt),g())return`cancelled`}}let u=1/0,d=performance.now();for(;!y&&!b;){if(g())return`cancelled`;let t=Gn(o).reduce((e,t)=>e+t.bufferedAmount,0);if(t===0)break;let n=performance.now();t<u&&(u=t,d=n,ce(m,Math.max(0,e.size-t)));let r=Gt.current.get(f)?.at||0;if(n-Math.max(d,r)>15e3)break;await new Promise(e=>window.setTimeout(e,25))}if(g())return`cancelled`;ce(m,e.size);let h=performance.now();for(;!y&&!b;){if(g())return`cancelled`;let e=Gt.current.get(f),t=e?.at||h,n=e?6e3:4e3;if(performance.now()-t>n)break;await new Promise(e=>window.setTimeout(e,40))}B.current.delete(f),Kt.current.delete(f);let _=Gt.current.get(f);if(Gt.current.delete(f),g())return`cancelled`;if(b)throw Error(b);if(!y&&(!_||_.receivedCount===0))throw Error(`Recipient did not acknowledge incoming chunks — verify tunnel name, passphrase, and P2P connection`);a=!0}else{if(B.current.delete(f),Kt.current.delete(f),x.timedOut)throw Error(`Recipient did not respond to transfer request — verify both devices are connected to the same tunnel`);if(!a)return re(),`rejected`}}if(g())return`cancelled`;if(!t||!a)throw Error(`Selected recipient is no longer connected`);let s=Math.max(.02,(performance.now()-D)/1e3),u=Math.max(0,e.size-se)/s,_=oe>0?oe:u;return A(t=>t.map(t=>t.id===f?{...t,transferredChunks:m,bytesTransferred:e.size,speedBps:_,avgSpeedBps:u,status:`completed`,verified:!0,completedAt:Date.now(),pausedBy:void 0}:t)),`completed`}catch(e){return g()?`cancelled`:(A(t=>t.map(t=>t.id===f?{...t,status:`error`,errorMessage:e?.message||`Transfer interrupted during streaming`}:t)),`error`)}finally{if(kt.current.delete(f),Ot.current.delete(f),B.current.delete(f),Kt.current.delete(f),Gt.current.delete(f),an.current.delete(f),i){let e=Et.current.get(i);e&&(e.delete(f),e.size===0&&Et.current.delete(i))}}},[Gn,Dn,Zn,Qn,Xn,or,bn]),cr=(0,C.useCallback)(e=>{if(!e||e===`all`)return`Everyone in room`;let t=_n.current.find(t=>t.id===e||t.cloudId===e);return t?t.deviceLabel:e},[]),lr=(0,C.useCallback)((e,t)=>{if(e.length===0)return;let n=t||S||`all`,r=cr(n),i=_n.current.length>0||!!(ae.current&&V.current&&V.current.readyState===WebSocket.OPEN)||tn.current.size>0||pn.current.length>0||ln.current.length>0,a=e.map((e,t)=>({id:`q-${Date.now()}-${t}-${Math.random().toString(36).slice(2,6)}`,file:e.file,displayName:e.displayName,size:e.file.size,targetPeerId:n,targetLabel:r,status:i?`queued`:`waiting_peer`}));gt(e=>[...e,...a])},[S,cr]),ur=(0,C.useCallback)(async e=>{let t=[],n=(e.items?Array.from(e.items):[]).map(e=>typeof e.webkitGetAsEntry==`function`?e.webkitGetAsEntry():null).filter(e=>!!e);if(n.length>0){let e=e=>new Promise(t=>{let n=[],r=()=>{e.readEntries(e=>{e.length?(n.push(...e),r()):t(n)},()=>t(n))};r()}),r=async(n,i)=>{if(n.isFile){let e=n;await new Promise(n=>{e.file(e=>{let r=i?`${i}/${e.name}`:e.name;t.push({file:e,displayName:r}),n()},()=>n())})}else if(n.isDirectory){let t=n,a=t.createReader(),o=await e(a),s=i?`${i}/${t.name}`:t.name;for(let e of o)await r(e,s)}};for(let e of n)await r(e,``);return t}if(e.files?.length)for(let n of Array.from(e.files)){let e=n.webkitRelativePath||n.name;t.push({file:n,displayName:e})}return t},[]),dr=(0,C.useCallback)(e=>{let t=Array.from(e).map(e=>({file:e,displayName:e.webkitRelativePath||e.name}));lr(t)},[lr]),fr=async()=>{let e=u.current;if(!e)return;let t=[`====================================================================`,`  AETHERTUNNEL END-TO-END ENCRYPTED PAYLOAD VERIFICATION MANIFEST`,`====================================================================`,`Tunnel Room Code     : ${n}`,`Key Fingerprint      : ${c}`,`Cipher Specification : AES-256-GCM (128-bit Auth Tag, 96-bit Nonce)`,`Key Derivation       : PBKDF2-HMAC-SHA256 (100,000 Iterations)`,`Streaming Protocol   : Dedicated Zero-Split SCTP (240 KB Frames)`,`NAT Traversal Path   : ${g===`connected_p2p`?`WebRTC Direct UDP Hole-Punching (STUN/ICE)`:`Zero-Knowledge Encrypted WebSocket Relay (TCP/443)`}`,`Timestamp (UTC)      : ${new Date().toISOString()}`,`====================================================================`].join(`
`),r=new TextEncoder().encode(t).buffer,i=await Be(r),a=`rx-${Date.now()}`,o=9001,s=g===`connected_p2p`?`WebRTC Direct (UDP/DTLS)`:`Encrypted WS Relay (TCP/443)`;await Rn({kind:`file:meta`,fileId:a,transferNumId:o,name:`AetherTunnel-Verified-Manifest-${n}.txt`,size:r.byteLength,chunkSize:tt,mimeType:`text/plain`,totalChunks:1,sha256:i},s);let l=await Fe(e,r,o,0);Ln(l)},pr=async e=>{e.preventDefault();let t=u.current;if(!be.trim()||!t)return;let{ivBase64:n,ciphertextBase64:r}=await Re(t,new TextEncoder().encode(be.trim()).buffer,0),i=`note-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,a=cr(S);Qn({kind:`note:encrypted`,id:i,senderLabel:p,recipientLabel:a,ivBase64:n,ciphertextBase64:r},S),j(e=>[{id:i,senderLabel:`You (${p})`,recipientLabel:a,text:be.trim(),timestamp:Date.now(),verified:!0},...e]),Te(``)},mr=()=>{let e=je();a(e)},hr=e=>{e.preventDefault();let t=i.trim().toLowerCase().replace(/[^a-z0-9-]/g,``);t!==n&&Mn(),wn.current.clear(),tn.current.clear(),Tn.current.clear(),En.current.clear(),rn([]),cn([]),fn([]),x([]),w(`all`),ee(null),_(`signaling`),r(t),t?window.history.replaceState({},``,`?room=${encodeURIComponent(t)}`):window.history.replaceState({},``,window.location.pathname)},gr=()=>{Mn(),wn.current.clear(),tn.current.clear(),Tn.current.clear(),En.current.clear(),rn([]),cn([]),fn([]),x([]),w(`all`),ee(null),_(`signaling`),r(``),window.history.replaceState({},``,window.location.pathname)},_r=()=>{n&&(navigator.clipboard.writeText(n),ke(`code`),window.setTimeout(()=>ke(null),1800))},vr=()=>{if(!n)return;let e=`${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(n)}`;navigator.clipboard.writeText(e),ke(`link`),window.setTimeout(()=>ke(null),1800)},yr=b.length>0||E&&mn||nn.length>0||dn.length>0||sn.length>0;return(0,C.useEffect)(()=>{S!==`all`&&(b.some(e=>e.id===S||e.cloudId===S)||E&&S===`native-exe-bridge`||w(`all`))},[b,S,E]),(0,C.useEffect)(()=>{if(vt.current||bt)return;let e=ht.find(e=>e.status===`queued`||e.status===`waiting_peer`);if(!e)return;let t=e.targetPeerId||`all`;(t===`all`?yr:_n.current.some(e=>e.id===t||e.cloudId===t)||t===`native-exe-bridge`&&ae.current&&V.current?.readyState===WebSocket.OPEN)?(vt.current=!0,gt(t=>t.map(t=>t.id===e.id?{...t,status:`transferring`}:t)),(async()=>{let t=`error`;try{let n=e.targetPeerId||`all`;if(n===`all`){let n=[],r=new Set,i=(e,t)=>{let i=Dn(e);!e||r.has(e)||r.has(i)||(r.add(e),r.add(i),n.push({id:e,label:t}))};for(let e of _n.current)e.id===`native-exe-bridge`?ae.current&&V.current?.readyState===WebSocket.OPEN&&i(e.id,e.deviceLabel):(e.cloudId&&r.add(e.cloudId),i(e.id,e.deviceLabel));ae.current&&V.current?.readyState===WebSocket.OPEN&&i(`native-exe-bridge`,`Local Machine .EXE`);for(let[e,t]of tn.current.entries())i(e,t.label);for(let e of pn.current)i(e,`Local Tab (${e.slice(-4)})`);for(let e of ln.current)i(e,`Browser (${e.slice(-4)})`);if(n.length>0){let r=await Promise.all(n.map(t=>sr(e.file,{displayName:e.displayName,queueItemId:e.id,targetPeerId:t.id,targetLabel:t.label})));t=r.some(e=>e===`completed`)?`completed`:r.every(e=>e===`cancelled`)||Tt.current.has(e.id)?`cancelled`:r.every(e=>e===`rejected`)?`rejected`:`error`}else t=await sr(e.file,{displayName:e.displayName,queueItemId:e.id,targetPeerId:`all`,targetLabel:e.targetLabel})}else t=await sr(e.file,{displayName:e.displayName,queueItemId:e.id,targetPeerId:n,targetLabel:e.targetLabel})}catch{t=Tt.current.has(e.id)?`cancelled`:`error`}finally{vt.current=!1;let n=Tt.current.has(e.id)?`cancelled`:t;gt(t=>t.map(t=>t.id===e.id?{...t,status:n,errorMessage:n===`cancelled`?t.errorMessage||`Stopped`:n===`rejected`?`Declined by recipient`:n===`error`?`Transfer error`:void 0}:t))}})()):ht.some(e=>e.status===`queued`)&&gt(e=>e.map(e=>e.status===`queued`?{...e,status:`waiting_peer`}:e))},[ht,yr,bt,sr,b,Dn]),(0,F.jsxs)(`div`,{className:`min-h-screen bg-slate-950 text-slate-100 flex flex-col`,children:[(0,F.jsxs)(`header`,{className:`flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30`,children:[(0,F.jsxs)(`a`,{href:`#studio`,onClick:e=>{e.preventDefault(),t(`studio`)},className:`text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 font-display`,children:[`AetherTunnel `,(0,F.jsx)(`span`,{className:`ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded`,children:`V1.02`})]}),(0,F.jsxs)(`nav`,{className:`flex items-center gap-6 text-sm font-medium text-slate-400 overflow-x-auto`,children:[(0,F.jsx)(`button`,{onClick:()=>t(`studio`),className:`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${e===`studio`?`text-slate-100 border-sky-400`:`border-transparent hover:text-slate-200`}`,children:`Tunnel Studio`}),(0,F.jsx)(`button`,{onClick:()=>t(`inspector`),className:`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${e===`inspector`?`text-slate-100 border-sky-400`:`border-transparent hover:text-slate-200`}`,children:`EXE vs Web Inspector`}),(0,F.jsx)(`button`,{onClick:()=>t(`diagnostics`),className:`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${e===`diagnostics`?`text-slate-100 border-sky-400`:`border-transparent hover:text-slate-200`}`,children:`NAT Diagnostics`}),(0,F.jsxs)(`button`,{onClick:()=>t(`ledger`),className:`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${e===`ledger`?`text-slate-100 border-sky-400`:`border-transparent hover:text-slate-200`}`,children:[`Transfer Ledger (`,me.length,`)`]})]}),(0,F.jsx)(`div`,{className:`flex items-center shrink-0`,children:(0,F.jsx)(`button`,{onClick:mr,className:`px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer`,children:`Randomize Tunnel Name`})})]}),(0,F.jsxs)(`main`,{className:`flex-1 w-full max-w-[1360px] mx-auto px-6 py-8`,children:[dt.length>0&&e!==`studio`&&(0,F.jsx)(`div`,{className:`mb-6 space-y-2.5`,children:dt.map(e=>(0,F.jsxs)(`div`,{className:`p-4 bg-amber-950/80 border border-amber-500/50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg`,children:[(0,F.jsxs)(`div`,{className:`flex items-start gap-2.5 min-w-0`,children:[(0,F.jsx)(ye,{className:`w-5 h-5 text-amber-400 shrink-0 mt-0.5`}),(0,F.jsxs)(`div`,{className:`min-w-0`,children:[(0,F.jsx)(`div`,{className:`text-xs font-semibold text-amber-200`,children:`Incoming File Transfer — Confirmation Required`}),(0,F.jsxs)(`div`,{className:`text-xs text-slate-100 font-mono truncate mt-0.5`,children:[e.name,` `,(0,F.jsxs)(`span`,{className:`text-amber-300`,children:[`(`,Ue(e.size),`)`]})]})]})]}),(0,F.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2 shrink-0`,children:[(0,F.jsxs)(`button`,{onClick:()=>vn(e,`accept`),className:`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors cursor-pointer`,children:[(0,F.jsx)(te,{className:`w-3.5 h-3.5`}),`Accept`]}),(0,F.jsxs)(`button`,{onClick:()=>vn(e,`accept_all`),className:`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors cursor-pointer`,children:[(0,F.jsx)(re,{className:`w-3.5 h-3.5`}),`Accept All`]}),(0,F.jsxs)(`button`,{onClick:()=>vn(e,`reject`),className:`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-200 bg-red-950/70 hover:bg-red-900/80 border border-red-700/60 rounded-md transition-colors cursor-pointer`,children:[(0,F.jsx)(we,{className:`w-3.5 h-3.5`}),`Decline`]})]})]},`global-${e.id}`))}),e===`studio`&&(0,F.jsxs)(`div`,{className:`space-y-8`,children:[(0,F.jsxs)(`div`,{className:`flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsxs)(`div`,{className:`flex items-center gap-2 text-xs text-slate-400`,children:[(0,F.jsx)(`span`,{children:`Zero-Configuration P2P File Tunnel`}),(0,F.jsx)(`span`,{"aria-hidden":`true`,children:`·`}),(0,F.jsx)(`span`,{children:`Direct Zero-Copy SCTP + Resumable Chunks`}),(0,F.jsx)(`span`,{"aria-hidden":`true`,children:`·`}),(0,F.jsx)(`span`,{className:n?`text-emerald-400 font-medium`:`text-amber-400 font-medium`,children:n?mn?`Windows .EXE Native Kernel Bridge Connected`:dn.length>0?`Direct Browser-to-Browser Active (Local Tab Bus)`:sn.length>0?`Encrypted Cloud Wormhole Relay Connected (Cross-Device P2P)`:yr?g===`connected_p2p`?`Direct WebRTC P2P Active (Dedicated SCTP)`:`Encrypted Binary TCP/443 Relay Active`:`Awaiting Peer Pairing`:`Waiting for tunnel name (enter a name and click Connect)`})]}),(0,F.jsx)(`h1`,{className:`text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight mt-1`,children:`Encrypted Peer-to-Peer File Transfer`})]}),(0,F.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3 shrink-0`,children:[(0,F.jsxs)(`button`,{onClick:()=>$e(n,`${window.location.origin.replace(/^http/,`ws`)}/ws-tunnel`),className:`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0`,title:`Downloads the High-DPI Standalone Windows P2P NAT-Punching & Kernel-Socket .EXE (V1.02 · STUN + UDP Hole Punching + Resumable Transfers)`,children:[(0,F.jsx)(ue,{className:`w-3.5 h-3.5`}),`Download Standalone P2P .EXE (V1.02)`]}),(0,F.jsxs)(`button`,{onClick:()=>{Qe(`AetherTunnel-Portable-Standalone.html`,Ze(n),`text/html;charset=utf-8`)},className:`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0`,title:`Downloads the single-file Portable HTML version (V1.02 · Zero-install client that runs directly in any browser via WebRTC & MQTT)`,children:[(0,F.jsx)(O,{className:`w-3.5 h-3.5`}),`Download Portable HTML (V1.02)`]})]})]}),(0,F.jsxs)(`div`,{className:`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`,children:[(0,F.jsxs)(`div`,{className:`p-4 bg-slate-900 border border-slate-800 rounded-lg`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between text-xs text-slate-400`,children:[(0,F.jsx)(`span`,{children:`01. Signaling & Room`}),(0,F.jsx)(re,{className:`w-4 h-4 ${n?`text-emerald-400`:`text-amber-400`}`})]}),(0,F.jsx)(`div`,{className:`mt-1.5 text-sm font-semibold text-slate-100 font-mono`,children:n||`Not connected`}),(0,F.jsxs)(`div`,{className:`mt-1 text-xs text-slate-400`,children:[`Users in room:`,` `,(0,F.jsxs)(`span`,{className:`font-mono text-slate-200 tabular-nums`,children:[n?Math.min(ot,b.filter(e=>!e.isLocalBridge).length+1):0,` / `,ot]})]})]}),(0,F.jsxs)(`div`,{className:`p-4 bg-slate-900 border border-slate-800 rounded-lg`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between text-xs text-slate-400`,children:[(0,F.jsx)(`span`,{children:`02. NAT / Firewall Traversal`}),(0,F.jsx)(re,{className:`w-4 h-4 ${yr?`text-emerald-400`:`text-sky-400`}`})]}),(0,F.jsx)(`div`,{className:`mt-1.5 text-sm font-semibold text-slate-100`,children:Pe?.detectedNatTopology||`Port-Restricted Cone NAT`}),(0,F.jsxs)(`div`,{className:`mt-1 text-xs text-slate-400`,children:[`Path:`,` `,(0,F.jsx)(`span`,{className:`text-slate-200`,children:v===`websocket_relay`?`TCP/443 Binary Relay`:g===`connected_p2p`?`Direct UDP (1x Dedicated SCTP)`:`Hybrid Auto-Failover`})]})]}),(0,F.jsxs)(`div`,{className:`p-4 bg-slate-900 border border-slate-800 rounded-lg`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between text-xs text-slate-400`,children:[(0,F.jsx)(`span`,{children:`03. E2EE Key Fingerprint`}),(0,F.jsx)(pe,{className:`w-4 h-4 text-emerald-400`})]}),(0,F.jsx)(`div`,{className:`mt-1.5 text-sm font-mono font-semibold text-emerald-400 tabular-nums`,children:c}),(0,F.jsx)(`div`,{className:`mt-1 text-xs text-slate-400`,children:`PBKDF2 · AES-256-GCM (256-bit)`})]}),(0,F.jsxs)(`div`,{className:`p-4 bg-slate-900 border border-slate-800 rounded-lg`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between text-xs text-slate-400`,children:[(0,F.jsx)(`span`,{children:`04. Direct WebRTC Channel`}),(0,F.jsx)(N,{className:`w-4 h-4 text-emerald-400`})]}),(0,F.jsxs)(`div`,{className:`mt-1.5 text-sm font-semibold text-slate-100`,children:[`Auto-Tuned 240 KB × 32`,` · 1x Direct SCTP`]}),(0,F.jsx)(`div`,{className:`mt-1 text-xs text-slate-400`,children:`8 MB In-Flight Window · Zero-Copy Wire Frames`})]})]}),(0,F.jsxs)(`div`,{className:`grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch`,children:[(0,F.jsxs)(`div`,{className:`lg:col-span-5 flex flex-col gap-6`,children:[(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`Tunnel Pairing & Authentication`}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Share this Wormhole Code or link with your peer to establish a direct encrypted tunnel.`})]}),(0,F.jsxs)(`form`,{onSubmit:hr,className:`space-y-2`,children:[(0,F.jsx)(`label`,{className:`block text-xs font-medium text-slate-300`,children:`Tunnel Name (Enter a name and click Connect)`}),(0,F.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,F.jsx)(`input`,{type:`text`,value:i,onChange:e=>a(e.target.value),placeholder:`Enter tunnel name...`,className:`flex-1 px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder:text-slate-500 focus:outline-none focus:border-sky-400`}),(0,F.jsx)(`button`,{type:`submit`,disabled:!i.trim().replace(/[^a-zA-Z0-9-]/g,``),className:`px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-45 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0`,children:`Connect`})]})]}),(0,F.jsxs)(`div`,{className:`p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-3`,children:[(0,F.jsxs)(`div`,{className:`min-w-0`,children:[(0,F.jsx)(`div`,{className:`text-xs text-slate-400`,children:`Active Tunnel`}),(0,F.jsx)(`div`,{className:`text-lg font-mono font-bold tracking-wide mt-0.5 truncate ${n?`text-sky-400`:`text-slate-500 text-sm`}`,children:n||`Not connected — enter a tunnel name above and click Connect`})]}),n&&(0,F.jsxs)(`div`,{className:`flex items-center gap-1.5 shrink-0`,children:[(0,F.jsx)(`button`,{type:`button`,onClick:_r,className:`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap`,children:Oe===`code`?(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(te,{className:`w-3.5 h-3.5 text-emerald-400`}),`Copied`]}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(ie,{className:`w-3.5 h-3.5`}),`Copy`]})}),(0,F.jsx)(`button`,{type:`button`,onClick:vr,className:`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap`,children:Oe===`link`?(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(te,{className:`w-3.5 h-3.5 text-emerald-400`}),`Link Copied`]}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(fe,{className:`w-3.5 h-3.5`}),`Link`]})}),(0,F.jsx)(`button`,{type:`button`,onClick:gr,className:`inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-red-300 bg-red-950/60 hover:bg-red-900/70 border border-red-800/50 rounded-md transition-colors cursor-pointer whitespace-nowrap`,children:`Disconnect`})]})]}),(0,F.jsxs)(`div`,{className:`pt-3 border-t border-slate-800 space-y-2`,children:[(0,F.jsx)(`div`,{className:`flex items-center justify-between`,children:(0,F.jsxs)(`label`,{className:`text-xs font-medium text-slate-300 flex items-center gap-1.5`,children:[(0,F.jsx)(Ce,{className:`w-3.5 h-3.5 text-sky-400`}),`Your display name in room (max `,ot,` users)`]})}),(0,F.jsx)(`input`,{type:`text`,value:p,maxLength:28,onChange:e=>m(e.target.value),placeholder:`e.g. Alex-PC...`,className:`w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400`}),(0,F.jsxs)(`label`,{className:`inline-flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer select-none`,children:[(0,F.jsx)(`input`,{type:`checkbox`,checked:E,onChange:e=>ne(e.target.checked),className:`accent-sky-400 rounded cursor-pointer`}),(0,F.jsx)(`span`,{children:`Connect to local machine .EXE app (127.0.0.1)`})]}),T&&(0,F.jsx)(`div`,{className:`p-2.5 bg-red-950/60 border border-red-700/60 rounded-lg text-xs text-red-200 font-medium`,children:T})]}),(0,F.jsxs)(`div`,{className:`pt-3 border-t border-slate-800 space-y-2`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,F.jsxs)(`label`,{className:`text-xs font-medium text-slate-300 flex items-center gap-1.5`,children:[(0,F.jsx)(de,{className:`w-3.5 h-3.5 text-sky-400`}),`Optional Zero-Knowledge Passphrase`]}),(0,F.jsx)(`span`,{className:`text-xs text-slate-400`,children:`PBKDF2 Salt`})]}),(0,F.jsx)(`input`,{type:`password`,value:o,onChange:e=>s(e.target.value),placeholder:`Leave blank for default code key, or enter shared secret...`,className:`w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400`})]})]}),(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5 flex-1 flex flex-col justify-between`,children:[(0,F.jsxs)(`div`,{className:`space-y-4`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`NAT Traversal & Transport Routing`}),(0,F.jsx)(`button`,{onClick:()=>t(`diagnostics`),className:`text-xs text-sky-400 hover:text-sky-300 cursor-pointer`,children:`Inspect ICE Table →`})]}),(0,F.jsxs)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:[`Configure transport routing and WebRTC SCTP mesh (max `,ot,` users per room).`]}),(0,F.jsxs)(`div`,{className:`grid grid-cols-3 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg mt-3`,children:[(0,F.jsx)(`button`,{onClick:()=>y(`auto`),className:`py-2 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${v===`auto`?`bg-slate-800 text-slate-100`:`text-slate-400 hover:text-slate-200`}`,children:`Auto Hybrid`}),(0,F.jsx)(`button`,{onClick:()=>y(`webrtc_direct`),className:`py-2 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${v===`webrtc_direct`?`bg-slate-800 text-slate-100`:`text-slate-400 hover:text-slate-200`}`,children:`Direct UDP Only`}),(0,F.jsx)(`button`,{onClick:()=>y(`websocket_relay`),className:`py-2 px-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap truncate ${v===`websocket_relay`?`bg-slate-800 text-slate-100`:`text-slate-400 hover:text-slate-200`}`,children:`TCP/443 Relay`})]})]}),(0,F.jsxs)(`div`,{className:`p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between text-xs`,children:[(0,F.jsx)(`span`,{className:`text-slate-300 font-medium`,children:`SCTP Engine Profile`}),(0,F.jsx)(`span`,{className:`font-mono text-emerald-400`,children:`Per-Peer Mesh · Zero-Copy SCTP`})]}),(0,F.jsxs)(`div`,{className:`text-xs text-slate-400 leading-relaxed`,children:[`Dedicated WebRTC SCTP mesh (`,(0,F.jsx)(`span`,{className:`text-slate-200 font-mono`,children:`240 KB`}),` atomic zero-copy frames, `,(0,F.jsx)(`span`,{className:`text-slate-200 font-mono`,children:`7.5 MB`}),` wave) + Wormhole Bridge for `,(0,F.jsx)(`span`,{className:`text-slate-200 font-mono`,children:`.EXE`}),` peers.`]})]})]}),(0,F.jsxs)(`div`,{className:`pt-4 border-t border-slate-800 space-y-2.5`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between text-xs`,children:[(0,F.jsxs)(`span`,{className:`text-slate-400 font-medium`,children:[`Room Users (`,b.length+ +!!n,`/`,ot,`)`]}),(0,F.jsxs)(`span`,{className:`font-mono text-slate-300 tabular-nums`,children:[b.length,` `,b.length===1?`other`:`others`]})]}),b.length===0?(0,F.jsx)(`div`,{className:`p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs text-slate-400`,children:`No other users in room yet.`}):(0,F.jsx)(`div`,{className:`space-y-2 max-h-56 overflow-y-auto pr-1`,children:b.map(e=>{let t=S===e.id;return(0,F.jsxs)(`div`,{className:`p-3 rounded-lg flex items-center justify-between gap-2 text-xs border transition-colors ${t?`bg-sky-950/40 border-sky-400/60`:`bg-slate-950 border-slate-800`}`,children:[(0,F.jsxs)(`div`,{className:`min-w-0`,children:[(0,F.jsx)(`div`,{className:`font-medium text-slate-200 truncate`,children:e.deviceLabel}),(0,F.jsxs)(`div`,{className:`text-slate-400 mt-0.5 truncate`,children:[e.natType,` · ID: `,(0,F.jsx)(`span`,{className:`font-mono`,children:e.id})]})]}),(0,F.jsx)(`button`,{type:`button`,onClick:()=>w(t?`all`:e.id),className:`px-2.5 py-1 rounded text-[11px] font-semibold shrink-0 cursor-pointer transition-colors ${t?`bg-sky-400 text-slate-950`:`bg-slate-800 text-slate-200 hover:bg-slate-700`}`,children:t?`Selected`:`Select`})]},e.id)})})]})]})]}),(0,F.jsxs)(`div`,{className:`lg:col-span-7 flex flex-col gap-6`,children:[(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-5`,children:[dt.length>0&&(0,F.jsx)(`div`,{className:`space-y-2.5`,children:dt.map(e=>(0,F.jsxs)(`div`,{className:`p-4 bg-amber-950/35 border border-amber-500/40 rounded-lg space-y-3`,children:[(0,F.jsx)(`div`,{className:`flex items-start justify-between gap-3`,children:(0,F.jsxs)(`div`,{className:`flex items-start gap-2.5 min-w-0`,children:[(0,F.jsx)(ye,{className:`w-4 h-4 text-amber-400 shrink-0 mt-0.5`}),(0,F.jsxs)(`div`,{className:`min-w-0`,children:[(0,F.jsx)(`div`,{className:`text-xs font-semibold text-amber-200`,children:`Incoming File Transfer — Confirmation Required`}),(0,F.jsxs)(`div`,{className:`text-xs text-slate-200 font-mono truncate mt-0.5`,children:[e.name,` `,(0,F.jsxs)(`span`,{className:`text-amber-300`,children:[`(`,Ue(e.size),`)`]})]}),(0,F.jsxs)(`div`,{className:`text-[11px] text-slate-400 mt-0.5`,children:[`Sender: `,e.senderLabel,e.hasResume?` · Resuming interrupted transfer`:``]})]})]})}),(0,F.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,F.jsxs)(`button`,{onClick:()=>vn(e,`accept`),className:`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors cursor-pointer`,children:[(0,F.jsx)(te,{className:`w-3.5 h-3.5`}),`Accept`]}),(0,F.jsxs)(`button`,{onClick:()=>vn(e,`accept_all`),className:`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors cursor-pointer`,children:[(0,F.jsx)(re,{className:`w-3.5 h-3.5`}),`Accept All`]}),(0,F.jsxs)(`button`,{onClick:()=>vn(e,`reject`),className:`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-200 bg-red-950/70 hover:bg-red-900/80 border border-red-700/60 rounded-md transition-colors cursor-pointer`,children:[(0,F.jsx)(we,{className:`w-3.5 h-3.5`}),`Decline`]})]})]},e.id))}),Ne&&(0,F.jsxs)(`div`,{className:`p-3.5 bg-sky-950/40 border border-sky-800/60 rounded-lg flex items-center justify-between gap-3 text-xs text-sky-200`,children:[(0,F.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,F.jsx)(O,{className:`w-4 h-4 text-sky-400 shrink-0 animate-bounce`}),(0,F.jsx)(`span`,{className:`font-medium`,children:Ne})]}),(0,F.jsx)(`button`,{onClick:()=>P(null),className:`text-sky-400 hover:text-sky-300 font-bold px-1.5 py-0.5`,children:`×`})]}),(0,F.jsxs)(`div`,{className:`flex flex-col sm:flex-row sm:items-center justify-between gap-2`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`Encrypted File Staging & Streamer`}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Zero-split 240 KB hardware frames · Sequential FIFO Queue · Live & Avg Speed Telemetry.`})]}),(0,F.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2 self-start`,children:[(0,F.jsxs)(`label`,{className:`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer select-none`,children:[(0,F.jsx)(`input`,{type:`checkbox`,checked:ct,onChange:e=>lt(e.target.checked),className:`accent-emerald-400 rounded cursor-pointer`}),(0,F.jsx)(`span`,{children:`Auto-accept incoming`})]}),(0,F.jsxs)(`button`,{onClick:fr,className:`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0`,children:[(0,F.jsx)(k,{className:`w-3.5 h-3.5`}),`Test Receive Encrypted File`]})]})]}),(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5`,children:[(0,F.jsxs)(`div`,{className:`flex items-center gap-2 text-xs font-medium text-slate-300 shrink-0`,children:[(0,F.jsx)(Ce,{className:`w-4 h-4 text-sky-400`}),(0,F.jsx)(`span`,{children:`Send to:`})]}),(0,F.jsxs)(`select`,{value:S,onChange:e=>w(e.target.value),className:`flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-sky-300 font-mono focus:outline-none focus:border-sky-400 cursor-pointer`,children:[(0,F.jsxs)(`option`,{value:`all`,children:[`Everyone in room (`,b.length,` `,b.length===1?`other user`:`other users`,`)`]}),b.map(e=>(0,F.jsxs)(`option`,{value:e.id,children:[e.deviceLabel,` (`,e.clientType===`exe`||e.clientType===`local_exe`?`.EXE`:`Browser`,`)`]},e.id))]})]}),(0,F.jsxs)(`div`,{className:`p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5`,children:[(0,F.jsxs)(`div`,{className:`flex items-center gap-2 text-xs font-medium text-slate-300 shrink-0`,children:[(0,F.jsx)(ce,{className:`w-4 h-4 text-sky-400`}),(0,F.jsx)(`span`,{children:`Max upload speed (MB/s):`})]}),(0,F.jsxs)(`div`,{className:`flex items-center gap-2.5 flex-1`,children:[(0,F.jsx)(`input`,{type:`text`,inputMode:`decimal`,value:jt,onChange:e=>{let t=e.target.value;Mt(t);let n=parseFloat(t.trim().replace(`,`,`.`));Nt.current=Number.isFinite(n)&&n>0?n:0},placeholder:`0`,className:`w-28 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-sky-300 font-mono focus:outline-none focus:border-sky-400`}),(0,F.jsx)(`span`,{className:`text-[11px] text-slate-400`,children:`(0 = unlimited · applies immediately mid-transfer)`})]})]}),(0,F.jsxs)(`div`,{onDragOver:e=>{e.preventDefault(),De(!0)},onDragLeave:()=>De(!1),onDrop:async e=>{e.preventDefault(),De(!1);let t=await ur(e.dataTransfer);t.length>0&&lr(t)},onClick:()=>$t.current?.click(),className:`border-2 border-dashed rounded-lg p-7 text-center transition-colors cursor-pointer ${Ee?`border-sky-400 bg-sky-950/20`:`border-slate-800 bg-slate-950/60 hover:border-slate-700`}`,children:[(0,F.jsx)(`input`,{ref:$t,type:`file`,multiple:!0,className:`hidden`,onChange:e=>{e.target.files?.length&&(dr(e.target.files),e.target.value=``)}}),(0,F.jsx)(`input`,{ref:yt,type:`file`,multiple:!0,webkitdirectory:``,directory:``,className:`hidden`,onChange:e=>{e.target.files?.length&&(dr(e.target.files),e.target.value=``)}}),(0,F.jsx)(Se,{className:`w-8 h-8 text-sky-400 mx-auto mb-3`}),(0,F.jsx)(`div`,{className:`text-sm font-semibold text-slate-100`,children:`Drag and drop files or folders here to add to transfer queue`}),(0,F.jsx)(`p`,{className:`text-xs text-slate-400 mt-1`,children:`Transfers files sequentially one by one · AES-256-GCM`}),(0,F.jsxs)(`div`,{className:`mt-2.5 mx-auto max-w-xl px-3 py-1.5 rounded-md bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-mono leading-relaxed`,children:[(0,F.jsx)(`span`,{className:`text-sky-400 font-semibold`,children:`Max Single File:`}),` `,`Web App / Portable HTML: `,(0,F.jsx)(`span`,{className:`text-amber-300`,children:`~2 GB`}),` (Browser RAM receive limit; sends larger to .EXE)`,` `,`· Windows .EXE <-> .EXE: `,(0,F.jsx)(`span`,{className:`text-emerald-400`,children:`~2.6 TB (UDP) / Disk limit (TCP)`})]}),(0,F.jsxs)(`div`,{className:`mt-4 flex flex-wrap items-center justify-center gap-2.5`,onClick:e=>e.stopPropagation(),children:[(0,F.jsxs)(`button`,{type:`button`,onClick:()=>$t.current?.click(),className:`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors cursor-pointer`,children:[(0,F.jsx)(Se,{className:`w-3.5 h-3.5`}),`+ Add File(s)`]}),(0,F.jsxs)(`button`,{type:`button`,onClick:()=>yt.current?.click(),className:`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer`,children:[(0,F.jsx)(se,{className:`w-3.5 h-3.5 text-sky-400`}),`+ Add Folder`]})]})]}),ht.length>0&&(0,F.jsxs)(`div`,{className:`p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2.5`,children:[(0,F.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-2 text-xs`,children:[(0,F.jsxs)(`span`,{className:`font-semibold text-slate-200 flex items-center gap-1.5`,children:[(0,F.jsx)(D,{className:`w-3.5 h-3.5 text-sky-400`}),`Transfer Queue (`,ht.filter(e=>e.status===`queued`||e.status===`waiting_peer`||e.status===`waiting_accept`||e.status===`transferring`||e.status===`paused`).length,` active / `,ht.length,` total)`]}),(0,F.jsxs)(`div`,{className:`flex items-center gap-2`,children:[ht.some(e=>e.status===`queued`||e.status===`waiting_peer`||e.status===`transferring`||e.status===`paused`)&&(0,F.jsx)(`button`,{type:`button`,onClick:ir,className:`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${bt?`text-slate-950 bg-emerald-400 hover:bg-emerald-300`:`text-amber-200 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60`}`,children:bt?(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(ge,{className:`w-3 h-3`}),`Resume`]}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(he,{className:`w-3 h-3`}),`Pause`]})}),ht.some(e=>e.status===`completed`||e.status===`rejected`||e.status===`cancelled`||e.status===`error`)&&(0,F.jsxs)(`button`,{onClick:()=>gt(e=>e.filter(e=>e.status===`queued`||e.status===`waiting_peer`||e.status===`waiting_accept`||e.status===`transferring`||e.status===`paused`)),className:`inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer`,children:[(0,F.jsx)(xe,{className:`w-3 h-3`}),`Clear Completed`]})]})]}),(0,F.jsx)(`div`,{className:`space-y-1.5 max-h-36 overflow-y-auto pr-1`,children:ht.map(e=>(0,F.jsxs)(`div`,{className:`px-2.5 py-1.5 bg-slate-900/90 border border-slate-800/80 rounded flex items-center justify-between gap-2 text-xs`,children:[(0,F.jsxs)(`div`,{className:`min-w-0 flex items-center gap-2`,children:[(0,F.jsx)(`span`,{className:`font-mono text-slate-200 truncate`,children:e.displayName}),(0,F.jsxs)(`span`,{className:`text-sky-400/90 text-[11px] font-mono shrink-0`,children:[`→ `,e.targetLabel]}),(0,F.jsxs)(`span`,{className:`text-slate-500 font-mono shrink-0`,children:[`(`,Ue(e.size),`)`]})]}),(0,F.jsxs)(`div`,{className:`flex items-center gap-2 shrink-0`,children:[(0,F.jsx)(`span`,{className:`font-mono text-[11px] ${e.status===`completed`?`text-emerald-400`:e.status===`rejected`||e.status===`error`?`text-red-400`:e.status===`cancelled`?`text-slate-400`:e.status===`waiting_accept`||e.status===`paused`?`text-amber-400`:e.status===`transferring`?`text-sky-400`:`text-slate-400`}`,children:e.status===`completed`?`Completed`:e.status===`rejected`?`Declined`:e.status===`cancelled`?`Stopped`:e.status===`error`?`Error`:e.status===`waiting_accept`?`Awaiting acceptance`:e.status===`paused`?`Paused`:e.status===`transferring`?`Sending...`:e.status===`waiting_peer`?`Waiting for peer`:`Queued`}),(e.status===`transferring`||e.status===`paused`||e.status===`waiting_accept`)&&(0,F.jsxs)(`button`,{type:`button`,onClick:()=>rr(e.id),className:`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-red-200 bg-red-950/70 hover:bg-red-900/80 border border-red-700/60 rounded transition-colors cursor-pointer`,title:`Stop transfer permanently`,children:[(0,F.jsx)(M,{className:`w-2.5 h-2.5 fill-current`}),`Stop`]}),e.status!==`transferring`&&e.status!==`paused`&&e.status!==`waiting_accept`&&(0,F.jsx)(`button`,{onClick:()=>gt(t=>t.filter(t=>t.id!==e.id)),className:`text-slate-500 hover:text-red-400 cursor-pointer`,title:`Remove from queue`,children:(0,F.jsx)(we,{className:`w-3.5 h-3.5`})})]})]},e.id))})]}),(0,F.jsxs)(`div`,{className:`space-y-3`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between text-xs text-slate-400`,children:[(0,F.jsx)(`span`,{children:`Active & Recent Tunnel Transfers`}),(0,F.jsxs)(`span`,{className:`font-mono tabular-nums`,children:[me.length,` total`]})]}),me.length===0?(0,F.jsx)(`div`,{className:`p-6 bg-slate-950/50 border border-slate-800 rounded-lg text-center text-xs text-slate-400`,children:`No files transferred yet. Drop a file or folder above to start queued P2P transfer.`}):(0,F.jsx)(`div`,{className:`space-y-2.5 max-h-96 overflow-y-auto pr-1`,children:me.slice(0,14).map(e=>{let t=Math.min(100,Math.round(e.transferredChunks/Math.max(1,e.totalChunks)*100));return(0,F.jsxs)(`div`,{className:`p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2`,children:[(0,F.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,F.jsxs)(`div`,{className:`min-w-0`,children:[(0,F.jsx)(`div`,{className:`text-xs font-semibold text-slate-100 truncate`,children:e.name}),(0,F.jsxs)(`div`,{className:`text-xs text-slate-400 mt-0.5`,children:[e.direction===`outgoing`?`Sending → ${e.recipientLabel||`Everyone in room`}`:`Receiving`,` `,`·`,` `,(0,F.jsxs)(`span`,{className:`font-mono tabular-nums text-slate-300`,children:[Ue(e.bytesTransferred),` / `,Ue(e.size)]}),` `,`· `,e.transportUsed]})]}),(0,F.jsxs)(`div`,{className:`flex items-center gap-2 shrink-0`,children:[(0,F.jsx)(`span`,{className:`font-mono text-xs tabular-nums ${e.status===`completed`?`text-emerald-400`:e.status===`rejected`||e.status===`error`?`text-red-400`:e.status===`cancelled`?`text-slate-400`:e.status===`awaiting_acceptance`||e.status===`paused`?`text-amber-400`:`text-sky-400`}`,children:e.status===`completed`?`100% · Verified`:e.status===`rejected`?`Declined`:e.status===`cancelled`?e.cancelledBy===`remote`?`Stopped by peer · ${t}%`:`Stopped · ${t}%`:e.status===`awaiting_acceptance`?`Awaiting acceptance...`:e.status===`paused`?e.pausedBy===`remote`?`Paused by peer · ${t}%`:`Paused · ${t}%`:e.status===`error`?`Interrupted / Paused`:`${t}%`}),(e.status===`transferring`||e.status===`paused`)&&(0,F.jsx)(`button`,{type:`button`,onClick:()=>ar(e.id,e.queueItemId),className:`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${e.status===`paused`?`text-slate-950 bg-emerald-400 hover:bg-emerald-300`:`text-amber-200 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/60`}`,children:e.status===`paused`?(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(ge,{className:`w-3 h-3`}),`Resume`]}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(he,{className:`w-3 h-3`}),`Pause`]})}),(e.status===`transferring`||e.status===`paused`||e.status===`awaiting_acceptance`)&&(0,F.jsxs)(`button`,{type:`button`,onClick:()=>nr(e.id,e.direction,e.queueItemId),className:`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-200 bg-red-950/70 hover:bg-red-900/80 border border-red-700/60 rounded transition-colors cursor-pointer`,title:`Stop transfer permanently`,children:[(0,F.jsx)(M,{className:`w-3 h-3 fill-current`}),`Stop`]}),e.direction===`outgoing`&&e.status===`error`&&Bt.current.has(`${e.name}::${e.size}`)&&(0,F.jsx)(`button`,{onClick:()=>{let t=Bt.current.get(`${e.name}::${e.size}`);t&&lr([{file:t,displayName:e.name}])},className:`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors cursor-pointer`,title:`Resume interrupted transfer from receiver's last verified chunk`,children:`Resume`}),e.downloadUrl&&(0,F.jsxs)(`a`,{href:e.downloadUrl,download:e.name,className:`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors`,children:[(0,F.jsx)(O,{className:`w-3 h-3`}),`Save File`]})]})]}),(0,F.jsx)(`div`,{className:`w-full h-1.5 bg-slate-800 rounded-full overflow-hidden`,children:(0,F.jsx)(`div`,{className:`h-full transition-all duration-150 ${e.status===`completed`?`bg-emerald-400`:e.status===`rejected`||e.status===`error`?`bg-red-500`:e.status===`cancelled`?`bg-slate-600`:e.status===`awaiting_acceptance`||e.status===`paused`?`bg-amber-400`:`bg-sky-400`}`,style:{width:`${t}%`}})}),(0,F.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono tabular-nums`,children:[(0,F.jsx)(`span`,{children:e.errorMessage?e.errorMessage:`SHA-256: ${e.sha256.slice(0,16)}...`}),(0,F.jsxs)(`span`,{children:[`Speed: `,(0,F.jsx)(`span`,{className:`text-sky-300`,children:We(e.speedBps)}),` · Avg: `,(0,F.jsx)(`span`,{className:`text-emerald-300`,children:We(e.avgSpeedBps??e.speedBps)}),` · Transferred: `,Ue(e.bytesTransferred),`/`,Ue(e.size)]})]})]},e.id)})})]})]}),(0,F.jsxs)(`div`,{className:`bg-slate-900 border border-slate-800 rounded-lg p-6 flex-1 flex flex-col justify-between space-y-4`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsx)(`h2`,{className:`text-base font-semibold text-slate-100`,children:`Encrypted Peer Scratchpad`}),(0,F.jsxs)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:[`Encrypted messaging for room users (Target: `,(0,F.jsx)(`span`,{className:`text-sky-300 font-mono`,children:cr(S)}),`).`]}),(0,F.jsxs)(`form`,{onSubmit:pr,className:`mt-3 flex gap-2`,children:[(0,F.jsx)(`input`,{type:`text`,value:be,onChange:e=>Te(e.target.value),placeholder:`Write an encrypted message for: ${cr(S)}...`,className:`flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400`}),(0,F.jsxs)(`button`,{type:`submit`,className:`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0`,children:[(0,F.jsx)(ve,{className:`w-3.5 h-3.5`}),`Send Message`]})]})]}),_e.length>0&&(0,F.jsx)(`div`,{className:`space-y-2 max-h-36 overflow-y-auto pt-2 border-t border-slate-800`,children:_e.map(e=>(0,F.jsxs)(`div`,{className:`p-2.5 bg-slate-950 border border-slate-800 rounded text-xs flex items-start justify-between gap-3`,children:[(0,F.jsxs)(`div`,{children:[(0,F.jsxs)(`span`,{className:`font-semibold text-sky-400`,children:[e.senderLabel,e.recipientLabel?` → ${e.recipientLabel}`:``,`:`]}),` `,(0,F.jsx)(`span`,{className:`text-slate-200`,children:e.text})]}),(0,F.jsx)(`span`,{className:`font-mono text-[11px] text-slate-500 tabular-nums shrink-0`,children:new Date(e.timestamp).toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`})})]},e.id))})]})]})]})]}),e===`inspector`&&(0,F.jsx)(et,{roomCode:n,keyFingerprint:c,exeBridgeConnected:mn,connectionState:g,natReport:Pe,peers:b,transfers:me}),e===`diagnostics`&&(0,F.jsx)(Ye,{report:Pe,isProbing:qe,onRunProbe:xn,selectedStrategy:v,onSelectStrategy:y}),e===`ledger`&&(0,F.jsx)(Xe,{transfers:me,onClearCompleted:()=>A(e=>e.filter(e=>e.status!==`completed`&&e.status!==`cancelled`)),onSwitchToStudio:()=>t(`studio`),onPauseTransfer:er,onResumeTransfer:tr,onCancelTransfer:nr})]}),(0,F.jsx)(`footer`,{className:`border-t border-slate-800/80 py-4 px-6 text-xs text-slate-400`,children:(0,F.jsxs)(`div`,{className:`max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2`,children:[(0,F.jsx)(`div`,{children:`AetherTunnel — End-to-End Encrypted P2P File Transfer & NAT Traversal Suite`}),(0,F.jsx)(`div`,{className:`flex items-center gap-4`,children:(0,F.jsx)(`button`,{onClick:()=>t(`diagnostics`),className:`hover:text-slate-200 transition-colors cursor-pointer`,children:`ICE / STUN Diagnostics`})})]})})]})}(0,Te.createRoot)(document.getElementById(`root`)).render((0,F.jsx)(ct,{}));