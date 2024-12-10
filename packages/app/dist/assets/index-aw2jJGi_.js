(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var V,Ue;class dt extends Error{}dt.prototype.name="InvalidTokenError";function ti(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ei(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ti(t)}catch{return atob(t)}}function cs(r,t){if(typeof r!="string")throw new dt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new dt(`Invalid token specified: missing part #${e+1}`);let i;try{i=ei(s)}catch(n){throw new dt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new dt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const si="mu:context",ee=`${si}:change`;class ii{constructor(t,e){this._proxy=ri(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class le extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ii(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ee,t),t}detach(t){this.removeEventListener(ee,t)}}function ri(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(ee,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function ni(r,t){const e=hs(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function hs(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return hs(r,i.host)}class oi extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function us(r="mu:message"){return(t,...e)=>t.dispatchEvent(new oi(e,r))}class ce{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ai(r){return t=>({...t,...r})}const se="mu:auth:jwt",ds=class ps extends ce{constructor(t,e){super((s,i)=>this.update(s,i),t,ps.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ci(s)),Jt(i);case"auth/signout":return e(hi()),Jt(this._redirectForLogin);case"auth/redirect":return Jt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ds.EVENT_TYPE="auth:message";let fs=ds;const ms=us(fs.EVENT_TYPE);function Jt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class li extends le{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=Z.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new fs(this.context,this.redirect).attach(this)}}class G{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(se),t}}class Z extends G{constructor(t){super();const e=cs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Z(t);return localStorage.setItem(se,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(se);return t?Z.authenticate(t):new G}}function ci(r){return ai({user:Z.authenticate(r),token:r})}function hi(){return r=>{const t=r.user;return{user:t&&t.authenticated?G.deauthenticate(t):t,token:""}}}function ui(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function di(r){return r.authenticated?cs(r.token||""):{}}const Q=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Z,Provider:li,User:G,dispatch:ms,headers:ui,payload:di},Symbol.toStringTag,{value:"Module"}));function Ct(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function ie(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const gs=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ie,relay:Ct},Symbol.toStringTag,{value:"Module"}));function vs(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const pi=new DOMParser;function j(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=pi.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ne(a);case"bigint":case"boolean":case"number":case"symbol":return Ne(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ne(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function It(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let fi=(V=class extends HTMLElement{constructor(){super(),this._state={},It(this).template(V.template).styles(V.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Ct(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},mi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},V.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,V.styles=vs`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,V);function mi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const gi=Object.freeze(Object.defineProperty({__proto__:null,Element:fi},Symbol.toStringTag,{value:"Module"})),ys=class _s extends ce{constructor(t){super((e,s)=>this.update(e,s),t,_s.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(yi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(_i(s,i));break}}}};ys.EVENT_TYPE="history:message";let he=ys;class Le extends le{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=vi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ue(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new he(this.context).attach(this)}}function vi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function yi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function _i(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const ue=us(he.EVENT_TYPE),$s=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Le,Provider:Le,Service:he,dispatch:ue},Symbol.toStringTag,{value:"Module"}));class I{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Me(this._provider,t);this._effects.push(i),e(i)}else ni(this._target,this._contextLabel).then(i=>{const n=new Me(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Me{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const bs=class ws extends HTMLElement{constructor(){super(),this._state={},this._user=new G,this._authObserver=new I(this,"blazing:auth"),It(this).template(ws.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;$i(i,this._state,e,this.authorization).then(n=>lt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&je(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&je(this.src,this.authorization).then(i=>{this._state=i,lt(i,this)});break;case"new":s&&(this._state={},lt({},this));break}}};bs.observedAttributes=["src","new","action"];bs.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function je(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function lt(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function $i(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const As=class Es extends ce{constructor(t,e){super(e,t,Es.EVENT_TYPE,!1)}};As.EVENT_TYPE="mu:message";let Ss=As;class bi extends le{constructor(t,e,s){super(e),this._user=new G,this._updateFn=t,this._authObserver=new I(this,s)}connectedCallback(){const t=new Ss(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const wi=Object.freeze(Object.defineProperty({__proto__:null,Provider:bi,Service:Ss},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zt=globalThis,de=zt.ShadowRoot&&(zt.ShadyCSS===void 0||zt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),Ie=new WeakMap;let xs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(de&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ie.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ie.set(e,t))}return t}toString(){return this.cssText}};const Ai=r=>new xs(typeof r=="string"?r:r+"",void 0,pe),Ei=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new xs(e,r,pe)},Si=(r,t)=>{if(de)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=zt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},He=de?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ai(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:xi,defineProperty:Pi,getOwnPropertyDescriptor:zi,getOwnPropertyNames:ki,getOwnPropertySymbols:Ci,getPrototypeOf:Oi}=Object,X=globalThis,De=X.trustedTypes,Ti=De?De.emptyScript:"",Fe=X.reactiveElementPolyfillSupport,pt=(r,t)=>r,Ot={toAttribute(r,t){switch(t){case Boolean:r=r?Ti:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},fe=(r,t)=>!xi(r,t),qe={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:fe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),X.litPropertyMetadata??(X.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=qe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Pi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=zi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??qe}static _$Ei(){if(this.hasOwnProperty(pt("elementProperties")))return;const t=Oi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(pt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(pt("properties"))){const e=this.properties,s=[...ki(e),...Ci(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(He(i))}else t!==void 0&&e.push(He(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Si(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ot).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ot;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??fe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[pt("elementProperties")]=new Map,Y[pt("finalized")]=new Map,Fe==null||Fe({ReactiveElement:Y}),(X.reactiveElementVersions??(X.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Rt=Tt.trustedTypes,Be=Rt?Rt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ps="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,zs="?"+z,Ri=`<${zs}>`,H=document,gt=()=>H.createComment(""),vt=r=>r===null||typeof r!="object"&&typeof r!="function",me=Array.isArray,Ui=r=>me(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ve=/-->/g,We=/>/g,U=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Ke=/"/g,ks=/^(?:script|style|textarea|title)$/i,Ni=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ht=Ni(1),tt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Je=new WeakMap,L=H.createTreeWalker(H,129);function Cs(r,t){if(!me(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Be!==void 0?Be.createHTML(t):t}const Li=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ct?f[1]==="!--"?o=Ve:f[1]!==void 0?o=We:f[2]!==void 0?(ks.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=U):f[3]!==void 0&&(o=U):o===U?f[0]===">"?(o=i??ct,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?U:f[3]==='"'?Ke:Ye):o===Ke||o===Ye?o=U:o===Ve||o===We?o=ct:(o=U,i=void 0);const h=o===U&&r[l+1].startsWith("/>")?" ":"";n+=o===ct?a+Ri:u>=0?(s.push(d),a.slice(0,u)+Ps+a.slice(u)+z+h):a+z+(u===-2?l:h)}return[Cs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let re=class Os{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Li(t,e);if(this.el=Os.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Ps)){const c=f[o++],h=i.getAttribute(u).split(z),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?ji:p[1]==="?"?Ii:p[1]==="@"?Hi:Ht}),i.removeAttribute(u)}else u.startsWith(z)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(ks.test(i.tagName)){const u=i.textContent.split(z),c=u.length-1;if(c>0){i.textContent=Rt?Rt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],gt()),L.nextNode(),a.push({type:2,index:++n});i.append(u[c],gt())}}}else if(i.nodeType===8)if(i.data===zs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(z,u+1))!==-1;)a.push({type:7,index:n}),u+=z.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function et(r,t,e=r,s){var i,n;if(t===tt)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=vt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=et(r,o._$AS(r,t.values),o,s)),t}class Mi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Di(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),vt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ui(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=re.createElement(Cs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Mi(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Je.get(t.strings);return e===void 0&&Je.set(t.strings,e=new re(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new wt(this.O(gt()),this.O(gt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ht{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=et(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==tt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=et(this,l[s+a],e,a),d===tt&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ji extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Ii extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Hi extends Ht{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??$)===tt)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Di{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const Ge=Tt.litHtmlPolyfillSupport;Ge==null||Ge(re,wt),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Fi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(gt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let J=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Fi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return tt}};J._$litElement$=!0,J.finalized=!0,(Ue=globalThis.litElementHydrateSupport)==null||Ue.call(globalThis,{LitElement:J});const Ze=globalThis.litElementPolyfillSupport;Ze==null||Ze({LitElement:J});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qi={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:fe},Bi=(r=qi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Ts(r){return(t,e)=>typeof e=="object"?Bi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Rs(r){return Ts({...r,state:!0,attribute:!1})}function Vi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Wi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Us={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,Bt){var A=y.length-1;switch(m){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,Bt="",A=0,Oe=0,Gs=2,Te=1,Zs=m.slice.call(arguments,1),_=Object.create(this.lexer),T={yy:{}};for(var Vt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Vt)&&(T.yy[Vt]=this.yy[Vt]);_.setInput(c,T.yy),T.yy.lexer=_,T.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Wt=_.yylloc;m.push(Wt);var Qs=_.options&&_.options.ranges;typeof T.yy.parseError=="function"?this.parseError=T.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Xs=function(){var B;return B=_.lex()||Te,typeof B!="number"&&(B=h.symbols_[B]||B),B},w,R,E,Yt,q={},xt,P,Re,Pt;;){if(R=p[p.length-1],this.defaultActions[R]?E=this.defaultActions[R]:((w===null||typeof w>"u")&&(w=Xs()),E=y[R]&&y[R][w]),typeof E>"u"||!E.length||!E[0]){var Kt="";Pt=[];for(xt in y[R])this.terminals_[xt]&&xt>Gs&&Pt.push("'"+this.terminals_[xt]+"'");_.showPosition?Kt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+Pt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Kt="Parse error on line "+(A+1)+": Unexpected "+(w==Te?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Kt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Wt,expected:Pt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+R+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(_.yytext),m.push(_.yylloc),p.push(E[1]),w=null,Oe=_.yyleng,Bt=_.yytext,A=_.yylineno,Wt=_.yylloc;break;case 2:if(P=this.productions_[E[1]][1],q.$=g[g.length-P],q._$={first_line:m[m.length-(P||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(P||1)].first_column,last_column:m[m.length-1].last_column},Qs&&(q._$.range=[m[m.length-(P||1)].range[0],m[m.length-1].range[1]]),Yt=this.performAction.apply(q,[Bt,Oe,A,T.yy,E[1],g,m].concat(Zs)),typeof Yt<"u")return Yt;P&&(p=p.slice(0,-1*P*2),g=g.slice(0,-1*P),m=m.slice(0,-1*P)),p.push(this.productions_[E[1]][0]),g.push(q.$),m.push(q._$),Re=y[p[p.length-2]][p[p.length-1]],p.push(Re);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Wi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Us);function W(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Ns={Root:W("Root"),Concat:W("Concat"),Literal:W("Literal"),Splat:W("Splat"),Param:W("Param"),Optional:W("Optional")},Ls=Us.parser;Ls.yy=Ns;var Yi=Ls,Ki=Object.keys(Ns);function Ji(r){return Ki.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Ms=Ji,Gi=Ms,Zi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function js(r){this.captures=r.captures,this.re=r.re}js.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Qi=Gi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Zi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new js({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Xi=Qi,tr=Ms,er=tr({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),sr=er,ir=Yi,rr=Xi,nr=sr;At.prototype=Object.create(null);At.prototype.match=function(r){var t=rr.visit(this.ast),e=t.match(r);return e||!1};At.prototype.reverse=function(r){return nr.visit(this.ast,r)};function At(r){var t;if(this?t=this:t=Object.create(At.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=ir.parse(r),t}var or=At,ar=or,lr=ar;const cr=Vi(lr);var hr=Object.defineProperty,Is=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&hr(t,e,i),i};const Hs=class extends J{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ht` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new cr(i.path)})),this._historyObserver=new I(this,e),this._authObserver=new I(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ht` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ms(this,"auth/redirect"),ht` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ht` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ht` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){ue(this,"history/redirect",{href:t})}};Hs.styles=Ei`
    :host,
    main {
      display: contents;
    }
  `;let Ut=Hs;Is([Rs()],Ut.prototype,"_user");Is([Rs()],Ut.prototype,"_match");const ur=Object.freeze(Object.defineProperty({__proto__:null,Element:Ut,Switch:Ut},Symbol.toStringTag,{value:"Module"})),dr=class Ds extends HTMLElement{constructor(){if(super(),It(this).template(Ds.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};dr.template=j`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const ge=class ne extends HTMLElement{constructor(){super(),this._array=[],It(this).template(ne.template).styles(ne.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Fs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ie(t,"button.add")?Ct(t,"input-array:add"):ie(t,"button.remove")&&Ct(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],fr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};ge.template=j`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;ge.styles=vs`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;let pr=ge;function fr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Fs(e)))}function Fs(r,t){const e=r===void 0?j`<input />`:j`<input value="${r}" />`;return j`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const mr=Object.freeze(Object.defineProperty({__proto__:null,Element:pr},Symbol.toStringTag,{value:"Module"}));function ve(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var gr=Object.defineProperty,vr=Object.getOwnPropertyDescriptor,yr=(r,t,e,s)=>{for(var i=vr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&gr(t,e,i),i};class ye extends J{constructor(t){super(),this._pending=[],this._observer=new I(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}yr([Ts()],ye.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,_e=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),Qe=new WeakMap;let qs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(_e&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Qe.set(e,t))}return t}toString(){return this.cssText}};const _r=r=>new qs(typeof r=="string"?r:r+"",void 0,$e),O=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new qs(e,r,$e)},$r=(r,t)=>{if(_e)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Xe=_e?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return _r(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:br,defineProperty:wr,getOwnPropertyDescriptor:Ar,getOwnPropertyNames:Er,getOwnPropertySymbols:Sr,getPrototypeOf:xr}=Object,C=globalThis,ts=C.trustedTypes,Pr=ts?ts.emptyScript:"",Zt=C.reactiveElementPolyfillSupport,ft=(r,t)=>r,Nt={toAttribute(r,t){switch(t){case Boolean:r=r?Pr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},be=(r,t)=>!br(r,t),es={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class K extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=es){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&wr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Ar(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??es}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=xr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...Er(e),...Sr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Xe(i))}else t!==void 0&&e.push(Xe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $r(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Nt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Nt;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??be)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ft("elementProperties")]=new Map,K[ft("finalized")]=new Map,Zt==null||Zt({ReactiveElement:K}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Lt=mt.trustedTypes,ss=Lt?Lt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Bs="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,Vs="?"+k,zr=`<${Vs}>`,D=document,yt=()=>D.createComment(""),_t=r=>r===null||typeof r!="object"&&typeof r!="function",we=Array.isArray,kr=r=>we(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,ut=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,is=/-->/g,rs=/>/g,N=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ns=/'/g,os=/"/g,Ws=/^(?:script|style|textarea|title)$/i,Cr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),v=Cr(1),st=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),as=new WeakMap,M=D.createTreeWalker(D,129);function Ys(r,t){if(!we(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ss!==void 0?ss.createHTML(t):t}const Or=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ut;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ut?f[1]==="!--"?o=is:f[1]!==void 0?o=rs:f[2]!==void 0?(Ws.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??ut,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?os:ns):o===os||o===ns?o=N:o===is||o===rs?o=ut:(o=N,i=void 0);const h=o===N&&r[l+1].startsWith("/>")?" ":"";n+=o===ut?a+zr:u>=0?(s.push(d),a.slice(0,u)+Bs+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[Ys(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class $t{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Or(t,e);if(this.el=$t.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=M.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Bs)){const c=f[o++],h=i.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Rr:p[1]==="?"?Ur:p[1]==="@"?Nr:Dt}),i.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Ws.test(i.tagName)){const u=i.textContent.split(k),c=u.length-1;if(c>0){i.textContent=Lt?Lt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],yt()),M.nextNode(),a.push({type:2,index:++n});i.append(u[c],yt())}}}else if(i.nodeType===8)if(i.data===Vs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=D.createElement("template");return s.innerHTML=t,s}}function it(r,t,e=r,s){var o,l;if(t===st)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=_t(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=it(r,i._$AS(r,t.values),i,s)),t}class Tr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??D).importNode(e,!0);M.currentNode=i;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Et(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Lr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=D,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Et{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),_t(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):kr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=$t.createElement(Ys(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Tr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=as.get(t.strings);return e===void 0&&as.set(t.strings,e=new $t(t)),e}k(t){we(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Et(this.O(yt()),this.O(yt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=it(this,t,e,0),o=!_t(t)||t!==this._$AH&&t!==st,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=it(this,l[s+a],e,a),d===st&&(d=this._$AH[a]),o||(o=!_t(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Rr extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ur extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Nr extends Dt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??b)===st)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Lr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}}const Xt=mt.litHtmlPolyfillSupport;Xt==null||Xt($t,Et),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.2.1");const Mr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Et(t.insertBefore(yt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let x=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Mr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}};var ls;x._$litElement$=!0,x.finalized=!0,(ls=globalThis.litElementHydrateSupport)==null||ls.call(globalThis,{LitElement:x});const te=globalThis.litElementPolyfillSupport;te==null||te({LitElement:x});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const jr=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ir={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:be},Hr=(r=Ir,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function S(r){return(t,e)=>typeof e=="object"?Hr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ae(r){return S({...r,state:!0,attribute:!1})}const Dr=O` 
* {
    margin: 0;
    box-sizing: border-box;
    padding: 2px;
  }
  body {
    line-height: 1.5;
  }
  img {
    max-width: 100%;
  }`,St={styles:Dr};var Fr=Object.defineProperty,Ks=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Fr(t,e,i),i};function qr(r){const e=r.target.checked;gs.relay(r,"dark-mode",{checked:e})}function Br(r){gs.relay(r,"auth:message",["auth/signout"])}const Se=class Se extends x{constructor(){super(...arguments),this.userid="anonymous",this.authenticated=!1,this._authObserver=new I(this,"puzzles:auth")}connectedCallback(){super.connectedCallback(),console.log("Connected"),this._authObserver.observe(({user:t})=>{if(console.log("User",t),t&&t.authenticated){this.userid=t.username,this.authenticated=!0;return}this.authenticated=!1,this.userid="anonymous"})}render(){return v`
    <div class="navbar">
      <h2> <a href="/app">Home </a></h2>
      <h2> <a href="/leaderboard">Leaderboard </a></h2>
      <h2><a href="/story">Story</a></h2>

      <label @change=${qr}>
                <input type="checkbox" />
                <h2> Dark Mode </h2>
              </label> 

      <h2><a href="/app/profile/${this.userid}">Edit Profile</a></h2>
       <h2><a href="#" @click=${Br}>Sign Out</a></h2>
    </div>
    `}static initializeOnce(){function t(e,s){e.classList.toggle("dark-mode",s)}document.body.addEventListener("dark-mode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}};Se.styles=[St.styles,O`
  :host {
    display: contents;
  }

  .navbar {
    --page-grids: 12;
    display: grid;
    grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];    
    gap: var(--size-spacing-small) var(--size-spacing-small);


    position: sticky;
    top: 0;
    background-color: var(--color-page-background);
    padding: var(--navbar-padding);
    grid-column: var(--grid-whole-span);
  }
  
  ::slotted(a), .navbar h2 a, h2, .navbar label{
    grid-column: auto / span 2;
    font-family: var(--font-family-body);
    color: var(--color-text-subheader); /* only unique color */
    text-decoration: none;
    margin: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .navbar h2 a:hover, ::slotted(a:hover) {
    text-decoration: underline;
}
  `];let rt=Se;Ks([S()],rt.prototype,"userid");Ks([S()],rt.prototype,"authenticated");const Vr=O`
body {
    background-color: var(--color-page-background);
    font-family: var(--font-family-display);
    font-weight: var(--font-weight);
}

/* Dark mode styles */
body.dark-mode {
    color: #ffffff;
}

.page {
    --page-grids: 12;
  
    display: grid;
    grid-template-columns: [start] repeat(var(--page-grids), 1fr) [end];    
    gap: var(--size-spacing-small) var(--size-spacing-small);
}

.navbar {
    display: grid;
    grid-template-columns: subgrid;
    position: sticky;
    top: 0;
    background-color: var(--color-page-background);
    padding: var(--navbar-padding);
    grid-column: var(--grid-whole-span);
  }
  .navbar h2 {
    font-family: var(--font-family-display);
    grid-column: auto / span 3;
    font-weight: bold;
  }

h1 {
    font-family: var(--font-family-display);
    color: var(--color-text-bigheader);
    padding: var(--border-padding);
    text-align: var(--text-center);
    font-size: var(--font-size);
    border: 5px solid var(--color-text-body);
    margin: var(--margin-center);
    grid-column: var(--header-span);
}
h2, h2 a {
    font-family: var(--font-family-body);
    color: var(--color-text-subheader); /* only unique color */
    text-decoration: underline;
    grid-column: var(--header-span);
    margin: 0;
}
h3 {
    font-family: var( --font-family-body);
    color: var(--color-text-body);
    grid-column: var(--header-span);
}
.inner-box {
    background-color: var(--color-page-innerbox);   
    padding: var(--border-padding-innerbox);          
    margin: var(--margin-padding-innerbox);       
    width: auto;
    height: auto;
    grid-column: var(--inner-box-span); /* Start at the first column and span 10 cols */
    display: grid;
}
.homepagetitle{
    display: flex;
}
.homepagetitle h1{
    font-family: var(--font-family-display);
    color: var(--color-text-bigheader);/*navy; /* only unique color */
    padding: var(--gap-padding);
    text-align: var(--text-center);
    font-size: var(--font-size);
    border: 5px solid var(--color-text-body);
    margin: var(--margin-center);
}

li a {
    font-family: var(--font-family-body);
    color: var(--color-text-body);
    font-style: italic;
}
/* Responsive behavior */
@media (max-width: 600px) {
    .icon {
        height: 8em;
        width: 6em; /* Shrinks icon size on smaller screens */
    }
}
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;   
    gap: var(--gap-padding);
    width: auto;
    height: auto;
}
.icon-container {
    width: auto;
    margin: var(--margin-center);
    display: flex; /* Use flexbox */
    justify-content: center; /* Center icons horizontally */
    gap: 10px; /* Space between icons */
}
svg.icon {
    flex-wrap: wrap; /* Allow wrapping of icons */
    width: 20%; /* Responsive width */
    max-width: 100px; /* Maximum width for each icon */
    height: auto; /* Maintain aspect ratio */
    fill: currentColor; /* Optional: Use current text color */
}

#answerInput {
    margin-top: 20px; /* Adds space above the input */
    font-size: 18px;
    grid-column: 5 / span 3;
    height: 50px; /* Adjust the height to make it taller */

    box-sizing: border-box; /* Include padding and border in dimensions */
    /* Border properties */
    border: 2px solid #000000;
     border-radius: 3px;
}
  
#submitButton {
    margin-top: 20px; /* Adds space above the input */
    grid-column: 8 / span 1;
}`,Ft={styles:Vr},xe=class xe extends x{constructor(){super(...arguments),this.src="",this._authObserver=new I(this,"puzzles:auth"),this._user=new Q.User}render(){return v`    
        <main class="page">
      <div class="inner-box">
    <!-- Container for centering SVG files -->

    <div class="homepagetitle" >
        <h1>Funny Puzzle Hunt :P</h1>
    </div>

    <div class="icon-container">
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-thinking" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
        <svg class="icon">
            <use href="/icons/puzzlepiece.svg#icon-piece" />
        </svg>
    </div>
    
    <div class="grid-container">
        <div class="grid-item">
            <h2>Level 1 Puzzles</h2>
            <ol>
                <li><a href="level-1/colors">Colors</a></li>
                <li><a href="level-1/answer-yoohoo">Just Look Up</a></li>
                <li><a href="level-1/aplusbequalsc">A+B=C</a></li>
                <li><a href="level-1/time">Time</a></li>
                <li><a href="level-1/1-3-puzzle">1/3 Puzzle</a></li>
            </ol>
        </div>
        <div class="grid-item">
            <h2>Level 2 Puzzles</h2>
            <ol>
                <li><a href= "level-2/not-without-precedent">Not Without Precedent</a></li>
                <li><a href="level-2/lunchable-gatorade">Lunchables Gatorade</a></li>
                <li><a href="level-2/nyc-subway">NYC Subway</a></li>
                <li><a href="level-2/blank-squares">Blank Squares</a></li>
                <li><a href="level-2/2-3-puzzle">2/3 Puzzle</a></li>
            </ol>
        </div>
        <div class="grid-item">
            <h2>Level 3 Puzzles</h3>
                <ol>
                    <li><a href="level-3/lele">LELE!</a></li>
                    <li><a href="level-3/extremely-good-puzzle">Extremely Good Puzzle</a></li>
                    <li><a href="level-3/three-crosses">Three Crosses</a></li>
                    <li><a href="level-3/blank-spaces">Blank Spaces</a></li>
                    <li><a href="level-3/list-of-really-really-really-stupid-article-ideas">List of really, really, really stupid article ideas</a></li>
                </ol>
        </div>
        <div class="grid-item">
            <h2>Level 4 Puzzles</h4>
                <ol>
                    <li><a href="level-4/unknown">□□□□□□</a></li>
                    <li><a href="level-4/path">Path</a></li>
                    <li><a href="level-4/painting">Painting</a></li>
                    <li><a href="level-4/mobel">Möbel</a></li>
                    <li><a href="level-4/50-50">50/50</a></li>
                </ol>
        </div>
    </div>
    </main>
    `}hydrate(t){fetch(t,{headers:Q.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{}).catch(e=>console.log("Failed to tour data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}};xe.styles=[St.styles,Ft.styles,O`
    :host {
      display: contents; /* Ensure the element behaves as a block-level element */
      width: 100%; /* Inherit full width from parent */
    }

    /* Ensure the main content respects parent styles */
    main {
      width: inherit;
    }
  `];let oe=xe;const Wr=O`
h1 {
    font-size: var(--font-size-medium);
    border: 3px solid var(--color-text-body);
    margin-top: 30px;
    margin-bottom: 30px;
}
h2, h2 a {
    text-align: center;
    text-decoration: none;
    font-style: italic;
    color: var(--color-text-body);
    font-size: var(--font-size-small);
    margin-bottom: var(--margin-spacing);
}
h3 {
    text-align: center;
    margin-bottom: var(--margin-spacing);
}
.page img {
    display: grid;          /* Make the image a block element */
    grid-column: var(--grid-whole-span);
    margin: 0 auto;          /* Center the image horizontally */
    width: auto;            /* Adjust the width as needed */
    height: auto;            /* Maintain the aspect ratio */
}`,Yr={styles:Wr};var Kr=Object.defineProperty,Jr=Object.getOwnPropertyDescriptor,Ee=(r,t,e,s)=>{for(var i=s>1?void 0:s?Jr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Kr(t,e,i),i};const Pe=class Pe extends ye{get puzzle(){return this.model.puzzle}render(){const{title:t,flavor_text:e,content:s,featured_image:i}=this.puzzle||{};return v`
            <main class="page">
              <h1>${t||"Puzzle"}</h1>
              ${e?v`<h2>${e}</h2>`:""}
              ${s?v`<h3>${s}</h3>`:""}
              ${i?v`<img src=${i} alt="Featured Image">`:""}
        
              <input type="text" id="answerInput" placeholder="Type your answer here">
              <button @click=${this._handleSubmit} id="submitButton">Submit</button>
              <p id="result"></p>
            </main>
          `}_handleSubmit(){var n,o,l,a;const t=(n=this.shadowRoot)==null?void 0:n.getElementById("answerInput"),e=(o=this.shadowRoot)==null?void 0:o.getElementById("result");if(!t||!e)return;const s=t.value.trim().toLowerCase(),i=(a=(l=this.puzzle)==null?void 0:l.answer)==null?void 0:a.trim().toLowerCase();s===i?(e.textContent="Correct! You've solved the puzzle!",e.className="correct"):(e.textContent="Incorrect answer. Try again!",e.className="incorrect")}constructor(){super("puzzles:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="puzzleid"&&e!==s&&s&&this.dispatchMessage(["puzzle/select",{puzzleid:s}])}};Pe.styles=[St.styles,Ft.styles,Yr.styles];let nt=Pe;Ee([S({attribute:"level",reflect:!0})],nt.prototype,"level",2);Ee([S({attribute:"puzzleid",reflect:!0})],nt.prototype,"puzzleid",2);Ee([Ae()],nt.prototype,"puzzle",1);var Gr=Object.defineProperty,Zr=Object.getOwnPropertyDescriptor,qt=(r,t,e,s)=>{for(var i=s>1?void 0:s?Zr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Gr(t,e,i),i};let F=class extends x{constructor(){super(...arguments),this.profiles=[],this.loading=!0,this.errorMessage=null}async connectedCallback(){super.connectedCallback(),await this.fetchLeaderboard()}async fetchLeaderboard(){this.loading=!0,this.errorMessage=null;try{const r=await fetch("/api/all-profiles");if(!r.ok)throw new Error("Failed to fetch leaderboard data");const t=await r.json();this.profiles=t.sort((e,s)=>s.puzzlessolved-e.puzzlessolved)}catch(r){console.error("Error loading leaderboard:",r),this.errorMessage="Failed to load leaderboard. Please try again later."}finally{this.loading=!1}}render(){return v`
      <main class="page">
        <h1>Leaderboard</h1>
        <div id="leaderboard-container">
          ${this.loading?v`<p>Loading...</p>`:this.errorMessage?v`<p class="error">${this.errorMessage}</p>`:v`
                <table id="leaderboard-table" class="leaderboard">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Display Name</th>
                      <th>Catchphrase</th>
                      <th>Puzzles Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.profiles.map(r=>v`
                        <tr>
                          <td>
                            <img
                              src="${r.avatar||"/images/default-avatar.png"}"
                              alt="Avatar"
                              class="avatar"
                            />
                          </td>
                          <td>${r.displayname||"Unknown"}</td>
                          <td>${r.catchphrase||"No catchphrase"}</td>
                          <td>${r.puzzlessolved||0}</td>
                        </tr>
                      `)}
                  </tbody>
                </table>
              `}
        </div>
      </main>
    `}};F.styles=[St.styles,Ft.styles,O`
    /* Add styles here */
    #leaderboard-container {
        grid-column: 1 / -1;
    }

    .leaderboard {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .leaderboard th,
    .leaderboard td {
      padding: 0.5rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .leaderboard img.avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .error {
      color: red;
      font-weight: bold;
    }
  `];qt([Ae()],F.prototype,"profiles",2);qt([S({type:Boolean})],F.prototype,"loading",2);qt([S({type:String})],F.prototype,"errorMessage",2);F=qt([jr("leaderboard-view")],F);var Qr=Object.defineProperty,Xr=Object.getOwnPropertyDescriptor,at=(r,t,e,s)=>{for(var i=s>1?void 0:s?Xr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Qr(t,e,i),i};const Js=O`
    * {
        margin: 0;
        box-sizing: border-box;
    }
    section {
        display: grid;
        grid-template-columns: [key] 2fr [value] 2fr [controls] 2fr [end];
        gap: var(--size-spacing-medium);
        align-items: end;
        margin: var(--size-spacing-medium) auto;
    }
    h1 {
        grid-row: 4;
        grid-column: value;
    }
    slot[name="avatar"] {
        display: grid;
        grid-row: 1/ span 4;
    }
    mu-form {
        grid-column: key / end;
        margin: 0;
    }
    dl {
        display: grid;
        grid-column: key / end;
        grid-template-columns: subgrid;
        gap: 0 var(--size-spacing-medium);
        align-items: baseline;
    }
    dt {
        grid-column: key;
        justify-self: end;
        color: var(--color-accent);
        font-family: var(--font-family-display);
    }
    dd {
        padding-left: var(--size-spacing-large);
        grid-column: value;
    }
  
    nav {
      grid-column: 3;
      grid-row: 4;
      display: grid;
      text-align: right;
      margin-top: var(--margin-size-med);
      justify-content: left;
    }
    nav > a {
      margin-top: var(--size-spacing-small);
      font-size: var(--font-size-body);
      color: var(--color-text);
      text-align: center;
    }
  
    nav > * {
      grid-column: controls;
    }
  
    ::slotted(ul) {
        list-style: none;
        display: flex;
        gap: var(--size-spacing-small);
    }

    ::slotted(img[slot="avatar"]) {
      width: 150px;
      height: 150px;
      border-radius: 50%;
    }
    `,ze=class ze extends x{render(){return console.log(this.userid),v`
        <section>
        <slot name="avatar">
        <img src="/avatars/${this.userid} || 'default'}.png" alt="Avatar" />
        </slot>
          <h1><slot name="userid"></slot></h1>
          <dl>
            <dt>Display Name</dt>
            <dd><slot name="displayname"></slot></dd>
            <dt>Catchphrase</dt>
            <dd><slot name="catchphrase"></slot></dd>
            <dt>Puzzles Solved </dt>
            <dd><slot name="puzzlessolved"></slot></dd>
          </dl>
          <nav>
            <a href="${this.userid}/edit" class="edit">Edit</a>
        </nav>
        </section>
      `}};ze.styles=[Js];let Mt=ze;at([S()],Mt.prototype,"userid",2);const jt=class jt extends x{render(){return v`
        <section>
          <slot name="avatar"></slot>
          <h1><slot name="name"></slot></h1>
          <mu-form .init=${this.init}>
            <label>
              <span>Username</span>
              <input disabled name="userid" />
            </label>
            <label>
              <span>Display Name</span>
              <input name="displayname" />
            </label>
            <label>
              <span>Catchphrase</span>
              <input name="catchphrase" />
            </label>
            <label>
            <span>Avatar</span>
            <input type="file" name="_avatar" @change=${t=>this._handleAvatarChange(t)}/>
          </label>
          </mu-form>
          <nav>
            <a class="close" href="../${this.userid}">Close</a>
          </nav>
        </section>
      `}_handleAvatarChange(t){const e=t.target;if(e.files&&e.files[0]){const s=new FileReader;s.onload=()=>{var o;const i=s.result,n=(o=this.shadowRoot)==null?void 0:o.querySelector("mu-form");n&&(n.init={...n.init,avatar:i})},s.readAsDataURL(e.files[0])}}};jt.uses=ve({"mu-form":gi.Element,"input-array":mr.Element}),jt.styles=[Js];let bt=jt;at([S()],bt.prototype,"userid",2);at([S({attribute:!1})],bt.prototype,"init",2);const ke=class ke extends ye{constructor(){super("puzzles:model"),this.edit=!1,this.userid="",this.addEventListener("mu-form:submit",t=>this._handleSubmit(t)),this.addEventListener("change",t=>{var s;const e=t.target;console.log("Change event triggered by:",e),(e==null?void 0:e.name)==="_avatar"&&((s=e.files)!=null&&s[0])&&this._handleAvatarChange(e.files[0])})}get profile(){return this.model.profile}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="userid"&&e!==s&&s&&(console.log("Profile Page:",s),this.dispatchMessage(["profile/select",{userid:s}]))}render(){const{userid:t,displayname:e,avatar:s,catchphrase:i,puzzlessolved:n}=this.profile||{};return this.edit?v`
            <profile-editor
              userid=${t}
              .init=${this.profile}
              @mu-form:submit=${o=>this._handleSubmit(o)}
            >
              <slot name="avatar">
                ${this._avatar?v`<img src=${this._avatar} alt="Avatar" />`:v`<img src=${s||"/default.png"} alt="Avatar" />`}
              </slot>
            </profile-editor>
          `:v`
            <profile-viewer userid=${t}>
              <span slot="displayname">${e}</span>
              <span slot="catchphrase">${i}</span>
              <img slot="avatar" src=${s||"/default.png"} alt="Avatar" />
              <span slot="puzzlessolved">${n}</span>
            </profile-viewer>
          `}_handleAvatarChange(t){const e=new FileReader;e.onload=()=>{this._avatar=e.result,this.requestUpdate()},e.onerror=s=>console.error("Error reading avatar file:",s),e.readAsDataURL(t)}_handleSubmit(t){console.log("Handling form submission",t.detail);const e={...t.detail,avatar:this._avatar||t.detail.avatar};console.log("Updated profile to save:",e),console.log("THE NEWEST ANSWER:",t.detail),this.dispatchMessage(["profile/save",{userid:this.userid,profile:e,onSuccess:()=>$s.dispatch(this,"history/navigate",{href:`/app/profile/${this.userid}`}),onFailure:s=>console.log("ERROR:",s)}])}};ke.uses=ve({"profile-viewer":Mt,"profile-editor":bt});let ot=ke;at([S({type:Boolean,reflect:!0})],ot.prototype,"edit",2);at([S({attribute:"userid",reflect:!0})],ot.prototype,"userid",2);at([Ae()],ot.prototype,"profile",1);const Ce=class Ce extends x{render(){return v`    
        <main class="page">

        <h1>Story</h1>
        <h2>Backstory</h2>
        <h3>Long ago, in a whimsical little town called Puzzleburg, the citizens thrived on one thing and one thing alone: solving puzzles! From sunrise to sunset, the streets were alive with the sound of gears turning and pens scratching as everyone worked on riddles, codes, and conundrums. You have been tasked
        by the almighty king to figure out the newest set of puzzles in order to feed the citizens and let the town thrive. But the main question is...are you up for it?</h3>
        <h2>_______</h2>
        <h2>What is a puzzlehunt?</h2>
        <h3>In a puzzlehunt, each puzzle has an underlying pattern or insight, which you need to figure out (somewhat like the theme of a crossword puzzle). Puzzles can come in many different forms; the only real commonality is that you usually receive no direct instructions, so it’s up to you to figure out how to make sense of the information you’re given.
        Each answer is a common English word or phrase (you will know the answer when you get it)</h3>
        <h2>_______</h2>
        <h2>What is and isn't allowed?</h2>
        <h3>You may not view source code, dump network packets, hack, or otherwise interact with the website in any unintended way. If you're not sure whether something is intended, then don't do it. The Internet is your best friend though and you are encouraged
        to look up information in order to solve the majority of these puzzles.</h3>
    </main>
    `}};Ce.styles=[St.styles,Ft.styles,O`
    :host {
      display: contents; /* Ensure the element behaves as a block-level element */
      width: 100%; /* Inherit full width from parent */
    }

    /* Ensure the main content respects parent styles */
    main {
      width: inherit;
    }
  `];let ae=Ce;const tn={};function en(r,t,e){switch(r[0]){case"profile/select":nn(r[1],e).then(s=>t(i=>({...i,profile:s})));break;case"puzzle/select":rn(r[1],e).then(s=>t(i=>({...i,puzzle:s})));break;case"profile/save":sn(r[1],e).then(s=>t(i=>({...i,profile:s}))).then(()=>{const{onSuccess:s}=r[1];s&&s()}).catch(s=>{const{onFailure:i}=r[1];i&&i(s)});break;default:throw new Error("Unhandled Auth message")}}function sn(r,t){return fetch(`/api/profiles/${r.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...Q.headers(t)},body:JSON.stringify(r.profile)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${r.userid}`)}).then(e=>{if(e)return e})}function rn(r,t){const e=`/api/puzzles/${r.puzzleid}`;return console.log("MY NEW THING:",e),fetch(e,{headers:Q.headers(t)}).then(s=>{if(s.status===200)return console.log(s.status),s.json()}).then(s=>{if(s)return console.log("Puzzle:",s),s})}async function nn(r,t){return fetch(`/api/profiles/${r.userid}`,{headers:Q.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Profile:",e),e})}const on=[{auth:"protected",path:"/:levelid/:puzzleid",view:r=>v`
      <puzzle-view level=${r.levelid} puzzleid=${r.puzzleid}></puzzle-view>
    `},{auth:"protected",path:"/app",view:()=>v`
      <home-view></home-view>
    `},{path:"/leaderboard",redirect:"/login",view:()=>v`
    <leaderboard-view></leaderboard-view>
    `},{path:"/story",redirect:"/login",view:()=>v`
    <story-view></story-view>
    `},{path:"/app/profile",view:()=>v`
      <profile-view></profile-view>
    `},{path:"/app/profile/:username",view:r=>v`
      <profile-view userid=${r.username}></profile-view>
    `},{path:"/app/profile/:username/edit",view:r=>v`
    <profile-view edit userid=${r.username}></profile-view>
  `},{path:"/",redirect:"/login"}];class an extends x{render(){return v`
    <mu-switch></mu-switch>
    `}connectedCallback(){super.connectedCallback(),rt.initializeOnce()}}ve({"mu-auth":Q.Provider,"mu-history":$s.Provider,"mu-store":class extends wi.Provider{constructor(){super(en,tn,"puzzles:auth")}},"mu-switch":class extends ur.Element{constructor(){super(on,"puzzles:history","puzzles:auth")}},"home-view":oe,"puzzles-app":an,"puzzle-view":nt,"nav-bar":rt,"profile-view":ot,"leaderboard-view":F,"story-view":ae});
