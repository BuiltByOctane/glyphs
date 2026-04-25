var Yu = Object.defineProperty;
var ui = (e) => {
  throw TypeError(e);
};
var Qu = (e, t, r) => t in e ? Yu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Fr = (e, t, r) => Qu(e, typeof t != "symbol" ? t + "" : t, r), Ps = (e, t, r) => t.has(e) || ui("Cannot " + r);
var ee = (e, t, r) => (Ps(e, t, "read from private field"), r ? r.call(e) : t.get(e)), xe = (e, t, r) => t.has(e) ? ui("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), qe = (e, t, r, n) => (Ps(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), gt = (e, t, r) => (Ps(e, t, "access private method"), r);
import Xc, { clipboard as Pr, ipcMain as ft, nativeImage as Jc, app as mr, globalShortcut as Wc, Tray as Zu, Menu as xu, BrowserWindow as Yc } from "electron";
import { fileURLToPath as ed } from "node:url";
import oe from "node:path";
import ye from "node:process";
import { promisify as Ae, isDeepStrictEqual as di } from "node:util";
import te from "node:fs";
import zr, { randomFillSync as td, randomUUID as rd } from "node:crypto";
import fi from "node:assert";
import Qc from "node:os";
import "node:events";
import "node:stream";
import { exec as nd } from "child_process";
const sr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Zc = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), xc = 1e6, sd = (e) => e >= "0" && e <= "9";
function el(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= xc;
  }
  return !1;
}
function Ns(e, t) {
  return Zc.has(e) ? !1 : (e && el(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function ad(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", s = !1, a = 0;
  for (const o of e) {
    if (a++, s) {
      r += o, s = !1;
      continue;
    }
    if (o === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${o}' in an index at position ${a}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${o}' after an index at position ${a}`);
      s = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (o) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Ns(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !Ns(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const c = Number.parseInt(r, 10);
            !Number.isNaN(c) && Number.isFinite(c) && c >= 0 && c <= Number.MAX_SAFE_INTEGER && c <= xc && r === String(c) ? t.push(c) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !sd(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!Ns(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function ss(e) {
  if (typeof e == "string")
    return ad(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (Zc.has(n))
        return [];
      typeof n == "string" && el(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function hi(e, t, r) {
  if (!sr(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = ss(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function hn(e, t, r) {
  if (!sr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = ss(t);
  if (s.length === 0)
    return e;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      e[o] = r;
    else if (!sr(e[o])) {
      const l = typeof s[a + 1] == "number";
      e[o] = l ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function od(e, t) {
  if (!sr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ss(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !sr(e))
      return !1;
  }
}
function Rs(e, t) {
  if (!sr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ss(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!sr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const Mt = Qc.homedir(), ma = Qc.tmpdir(), { env: pr } = ye, id = (e) => {
  const t = oe.join(Mt, "Library");
  return {
    data: oe.join(t, "Application Support", e),
    config: oe.join(t, "Preferences", e),
    cache: oe.join(t, "Caches", e),
    log: oe.join(t, "Logs", e),
    temp: oe.join(ma, e)
  };
}, cd = (e) => {
  const t = pr.APPDATA || oe.join(Mt, "AppData", "Roaming"), r = pr.LOCALAPPDATA || oe.join(Mt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: oe.join(r, e, "Data"),
    config: oe.join(t, e, "Config"),
    cache: oe.join(r, e, "Cache"),
    log: oe.join(r, e, "Log"),
    temp: oe.join(ma, e)
  };
}, ld = (e) => {
  const t = oe.basename(Mt);
  return {
    data: oe.join(pr.XDG_DATA_HOME || oe.join(Mt, ".local", "share"), e),
    config: oe.join(pr.XDG_CONFIG_HOME || oe.join(Mt, ".config"), e),
    cache: oe.join(pr.XDG_CACHE_HOME || oe.join(Mt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: oe.join(pr.XDG_STATE_HOME || oe.join(Mt, ".local", "state"), e),
    temp: oe.join(ma, t, e)
  };
};
function ud(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), ye.platform === "darwin" ? id(e) : ye.platform === "win32" ? cd(e) : ld(e);
}
const Ot = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, _t = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, dd = 250, It = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? dd, c = Date.now() + a;
    return function l(...d) {
      return e.apply(void 0, d).catch((u) => {
        if (!r(u) || Date.now() >= c)
          throw u;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise((y) => setTimeout(y, h)).then(() => l.apply(void 0, d)) : l.apply(void 0, d);
      });
    };
  };
}, Tt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = Date.now() + a;
    return function(...l) {
      for (; ; )
        try {
          return e.apply(void 0, l);
        } catch (d) {
          if (!r(d) || Date.now() >= o)
            throw d;
          continue;
        }
    };
  };
}, yr = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!yr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !fd && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!yr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!yr.isNodeError(e))
      throw e;
    if (!yr.isChangeErrorOk(e))
      throw e;
  }
}, mn = {
  onError: yr.onChangeError
}, Xe = {
  onError: () => {
  }
}, fd = ye.getuid ? !ye.getuid() : !1, Ce = {
  isRetriable: yr.isRetriableError
}, Me = {
  attempt: {
    /* ASYNC */
    chmod: Ot(Ae(te.chmod), mn),
    chown: Ot(Ae(te.chown), mn),
    close: Ot(Ae(te.close), Xe),
    fsync: Ot(Ae(te.fsync), Xe),
    mkdir: Ot(Ae(te.mkdir), Xe),
    realpath: Ot(Ae(te.realpath), Xe),
    stat: Ot(Ae(te.stat), Xe),
    unlink: Ot(Ae(te.unlink), Xe),
    /* SYNC */
    chmodSync: _t(te.chmodSync, mn),
    chownSync: _t(te.chownSync, mn),
    closeSync: _t(te.closeSync, Xe),
    existsSync: _t(te.existsSync, Xe),
    fsyncSync: _t(te.fsync, Xe),
    mkdirSync: _t(te.mkdirSync, Xe),
    realpathSync: _t(te.realpathSync, Xe),
    statSync: _t(te.statSync, Xe),
    unlinkSync: _t(te.unlinkSync, Xe)
  },
  retry: {
    /* ASYNC */
    close: It(Ae(te.close), Ce),
    fsync: It(Ae(te.fsync), Ce),
    open: It(Ae(te.open), Ce),
    readFile: It(Ae(te.readFile), Ce),
    rename: It(Ae(te.rename), Ce),
    stat: It(Ae(te.stat), Ce),
    write: It(Ae(te.write), Ce),
    writeFile: It(Ae(te.writeFile), Ce),
    /* SYNC */
    closeSync: Tt(te.closeSync, Ce),
    fsyncSync: Tt(te.fsyncSync, Ce),
    openSync: Tt(te.openSync, Ce),
    readFileSync: Tt(te.readFileSync, Ce),
    renameSync: Tt(te.renameSync, Ce),
    statSync: Tt(te.statSync, Ce),
    writeSync: Tt(te.writeSync, Ce),
    writeFileSync: Tt(te.writeFileSync, Ce)
  }
}, hd = "utf8", mi = 438, md = 511, pd = {}, yd = ye.geteuid ? ye.geteuid() : -1, $d = ye.getegid ? ye.getegid() : -1, gd = 1e3, _d = !!ye.getuid;
ye.getuid && ye.getuid();
const pi = 128, vd = (e) => e instanceof Error && "code" in e, yi = (e) => typeof e == "string", Os = (e) => e === void 0, wd = ye.platform === "linux", tl = ye.platform === "win32", pa = ["SIGHUP", "SIGINT", "SIGTERM"];
tl || pa.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
wd && pa.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Ed {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (tl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? ye.kill(ye.pid, "SIGTERM") : ye.kill(ye.pid, t));
      }
    }, this.hook = () => {
      ye.once("exit", () => this.exit());
      for (const t of pa)
        try {
          ye.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const bd = new Ed(), Sd = bd.register, Ve = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Ve.truncate(t(e));
    return n in Ve.store ? Ve.get(e, t, r) : (Ve.store[n] = r, [n, () => delete Ve.store[n]]);
  },
  purge: (e) => {
    Ve.store[e] && (delete Ve.store[e], Me.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Ve.store[e] && (delete Ve.store[e], Me.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Ve.store)
      Ve.purgeSync(e);
  },
  truncate: (e) => {
    const t = oe.basename(e);
    if (t.length <= pi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - pi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Sd(Ve.purgeSyncAll);
function rl(e, t, r = pd) {
  if (yi(r))
    return rl(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? gd };
  let a = null, o = null, c = null;
  try {
    const l = Me.attempt.realpathSync(e), d = !!l;
    e = l || e, [o, a] = Ve.get(e, r.tmpCreate || Ve.create, r.tmpPurge !== !1);
    const u = _d && Os(r.chown), h = Os(r.mode);
    if (d && (u || h)) {
      const E = Me.attempt.statSync(e);
      E && (r = { ...r }, u && (r.chown = { uid: E.uid, gid: E.gid }), h && (r.mode = E.mode));
    }
    if (!d) {
      const E = oe.dirname(e);
      Me.attempt.mkdirSync(E, {
        mode: md,
        recursive: !0
      });
    }
    c = Me.retry.openSync(s)(o, "w", r.mode || mi), r.tmpCreated && r.tmpCreated(o), yi(t) ? Me.retry.writeSync(s)(c, t, 0, r.encoding || hd) : Os(t) || Me.retry.writeSync(s)(c, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Me.retry.fsyncSync(s)(c) : Me.attempt.fsync(c)), Me.retry.closeSync(s)(c), c = null, r.chown && (r.chown.uid !== yd || r.chown.gid !== $d) && Me.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== mi && Me.attempt.chmodSync(o, r.mode);
    try {
      Me.retry.renameSync(s)(o, e);
    } catch (E) {
      if (!vd(E) || E.code !== "ENAMETOOLONG")
        throw E;
      Me.retry.renameSync(s)(o, Ve.truncate(e));
    }
    a(), o = null;
  } finally {
    c && Me.attempt.closeSync(c), o && Ve.purge(o);
  }
}
function nl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ws = { exports: {} }, sl = {}, it = {}, Nr = {}, on = {}, re = {}, sn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(_) {
      if (super(), !e.IDENTIFIER.test(_))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = _;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(_) {
      super(), this._items = typeof _ == "string" ? [_] : _;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const _ = this._items[0];
      return _ === "" || _ === '""';
    }
    get str() {
      var _;
      return (_ = this._str) !== null && _ !== void 0 ? _ : this._str = this._items.reduce((S, O) => `${S}${O}`, "");
    }
    get names() {
      var _;
      return (_ = this._names) !== null && _ !== void 0 ? _ : this._names = this._items.reduce((S, O) => (O instanceof r && (S[O.str] = (S[O.str] || 0) + 1), S), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ..._) {
    const S = [m[0]];
    let O = 0;
    for (; O < _.length; )
      c(S, _[O]), S.push(m[++O]);
    return new n(S);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ..._) {
    const S = [y(m[0])];
    let O = 0;
    for (; O < _.length; )
      S.push(a), c(S, _[O]), S.push(a, y(m[++O]));
    return l(S), new n(S);
  }
  e.str = o;
  function c(m, _) {
    _ instanceof n ? m.push(..._._items) : _ instanceof r ? m.push(_) : m.push(h(_));
  }
  e.addCodeArg = c;
  function l(m) {
    let _ = 1;
    for (; _ < m.length - 1; ) {
      if (m[_] === a) {
        const S = d(m[_ - 1], m[_ + 1]);
        if (S !== void 0) {
          m.splice(_ - 1, 3, S);
          continue;
        }
        m[_++] = "+";
      }
      _++;
    }
  }
  function d(m, _) {
    if (_ === '""')
      return m;
    if (m === '""')
      return _;
    if (typeof m == "string")
      return _ instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof _ != "string" ? `${m.slice(0, -1)}${_}"` : _[0] === '"' ? m.slice(0, -1) + _.slice(1) : void 0;
    if (typeof _ == "string" && _[0] === '"' && !(m instanceof r))
      return `"${m}${_.slice(1)}`;
  }
  function u(m, _) {
    return _.emptyStr() ? m : m.emptyStr() ? _ : o`${m}${_}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : y(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(y(m));
  }
  e.stringify = E;
  function y(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = y;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function g(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(sn);
var Ys = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = sn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(l) {
    l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class c extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: y } = E, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let g = this._values[y];
      if (g) {
        const _ = g.get(w);
        if (_)
          return _;
      } else
        g = this._values[y] = /* @__PURE__ */ new Map();
      g.set(w, E);
      const $ = this._scope[y] || (this._scope[y] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: y, itemIndex: m }), E;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, E) {
      let y = t.nil;
      for (const w in d) {
        const g = d[w];
        if (!g)
          continue;
        const $ = h[w] = h[w] || /* @__PURE__ */ new Map();
        g.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let _ = u(m);
          if (_) {
            const S = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            y = (0, t._)`${y}${S} ${m} = ${_};${this.opts._n}`;
          } else if (_ = E == null ? void 0 : E(m))
            y = (0, t._)`${y}${_}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return y;
    }
  }
  e.ValueScope = c;
})(Ys);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = sn, r = Ys;
  var n = sn;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = Ys;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, b) {
      super(), this.varKind = i, this.name = f, this.rhs = b;
    }
    render({ es5: i, _n: f }) {
      const b = i ? r.varKinds.var : this.varKind, k = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${k};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = j(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = j(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Q(i, this.rhs);
    }
  }
  class l extends c {
    constructor(i, f, b, k) {
      super(i, b, k), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class E extends a {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = j(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class y extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, b) => f + b.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const b = i[f].optimizeNodes();
        Array.isArray(b) ? i.splice(f, 1, ...b) : b ? i[f] = b : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: b } = this;
      let k = b.length;
      for (; k--; ) {
        const A = b[k];
        A.optimizeNames(i, f) || (D(i, A.names), b.splice(k, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => J(i, f.names), {});
    }
  }
  class w extends y {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class g extends y {
  }
  class $ extends w {
  }
  $.kind = "else";
  class m extends w {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new $(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(G(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = j(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return Q(i, this.condition), this.else && J(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class _ extends w {
  }
  _.kind = "for";
  class S extends _ {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = j(this.iteration, i, f), this;
    }
    get names() {
      return J(super.names, this.iteration.names);
    }
  }
  class O extends _ {
    constructor(i, f, b, k) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = k;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: k, to: A } = this;
      return `for(${f} ${b}=${k}; ${b}<${A}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = Q(super.names, this.from);
      return Q(i, this.to);
    }
  }
  class T extends _ {
    constructor(i, f, b, k) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = k;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = j(this.iterable, i, f), this;
    }
    get names() {
      return J(super.names, this.iterable.names);
    }
  }
  class V extends w {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  V.kind = "func";
  class K extends y {
    render(i) {
      return "return " + super.render(i);
    }
  }
  K.kind = "return";
  class ne extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, k;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (k = this.finally) === null || k === void 0 || k.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && J(i, this.catch.names), this.finally && J(i, this.finally.names), i;
    }
  }
  class le extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  le.kind = "catch";
  class ue extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ue.kind = "finally";
  class F {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const b = this._extScope.value(i, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, b, k) {
      const A = this._scope.toName(f);
      return b !== void 0 && k && (this._constants[A.str] = b), this._leafNode(new o(i, A, b)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, b) {
      return this._def(r.varKinds.const, i, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, b) {
      return this._def(r.varKinds.let, i, f, b);
    }
    // `var` declaration with optional assignment
    var(i, f, b) {
      return this._def(r.varKinds.var, i, f, b);
    }
    // assignment code
    assign(i, f, b) {
      return this._leafNode(new c(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new l(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, k] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== k || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, k));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, b) {
      if (this._blockNode(new m(i)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, $);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new S(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, k, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const B = this._scope.toName(i);
      return this._for(new O(A, B, f, b), () => k(B));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, k = r.varKinds.const) {
      const A = this._scope.toName(i);
      if (this.opts.es5) {
        const B = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${B}.length`, (H) => {
          this.var(A, (0, t._)`${B}[${H}]`), b(A);
        });
      }
      return this._for(new T("of", k, A, f), () => b(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, k = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const A = this._scope.toName(i);
      return this._for(new T("in", k, A, f), () => b(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(_);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new K();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(K);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const k = new ne();
      if (this._blockNode(k), this.code(i), f) {
        const A = this.name("e");
        this._currNode = k.catch = new le(A), f(A);
      }
      return b && (this._currNode = k.finally = new ue(), this.code(b)), this._endBlockNode(le, ue);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const b = this._nodes.length - f;
      if (b < 0 || i !== void 0 && b !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, b, k) {
      return this._blockNode(new V(i, f, b)), k && this.code(k).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(V);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const b = this._currNode;
      if (b instanceof i || f && b instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = F;
  function J(v, i) {
    for (const f in i)
      v[f] = (v[f] || 0) + (i[f] || 0);
    return v;
  }
  function Q(v, i) {
    return i instanceof t._CodeOrName ? J(v, i.names) : v;
  }
  function j(v, i, f) {
    if (v instanceof t.Name)
      return b(v);
    if (!k(v))
      return v;
    return new t._Code(v._items.reduce((A, B) => (B instanceof t.Name && (B = b(B)), B instanceof t._Code ? A.push(...B._items) : A.push(B), A), []));
    function b(A) {
      const B = f[A.str];
      return B === void 0 || i[A.str] !== 1 ? A : (delete i[A.str], B);
    }
    function k(A) {
      return A instanceof t._Code && A._items.some((B) => B instanceof t.Name && i[B.str] === 1 && f[B.str] !== void 0);
    }
  }
  function D(v, i) {
    for (const f in i)
      v[f] = (v[f] || 0) - (i[f] || 0);
  }
  function G(v) {
    return typeof v == "boolean" || typeof v == "number" || v === null ? !v : (0, t._)`!${P(v)}`;
  }
  e.not = G;
  const z = p(e.operators.AND);
  function W(...v) {
    return v.reduce(z);
  }
  e.and = W;
  const q = p(e.operators.OR);
  function N(...v) {
    return v.reduce(q);
  }
  e.or = N;
  function p(v) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${P(i)} ${v} ${P(f)}`;
  }
  function P(v) {
    return v instanceof t.Name ? v : (0, t._)`(${v})`;
  }
})(re);
var L = {};
Object.defineProperty(L, "__esModule", { value: !0 });
L.checkStrictMode = L.getErrorPath = L.Type = L.useFunc = L.setEvaluated = L.evaluatedPropsToName = L.mergeEvaluated = L.eachItem = L.unescapeJsonPointer = L.escapeJsonPointer = L.escapeFragment = L.unescapeFragment = L.schemaRefOrVal = L.schemaHasRulesButRef = L.schemaHasRules = L.checkUnknownRules = L.alwaysValidSchema = L.toHash = void 0;
const fe = re, Pd = sn;
function Nd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
L.toHash = Nd;
function Rd(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (al(e, t), !ol(t, e.self.RULES.all));
}
L.alwaysValidSchema = Rd;
function al(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || ll(e, `unknown keyword: "${a}"`);
}
L.checkUnknownRules = al;
function ol(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
L.schemaHasRules = ol;
function Od(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
L.schemaHasRulesButRef = Od;
function Id({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, fe._)`${r}`;
  }
  return (0, fe._)`${e}${t}${(0, fe.getProperty)(n)}`;
}
L.schemaRefOrVal = Id;
function Td(e) {
  return il(decodeURIComponent(e));
}
L.unescapeFragment = Td;
function jd(e) {
  return encodeURIComponent(ya(e));
}
L.escapeFragment = jd;
function ya(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
L.escapeJsonPointer = ya;
function il(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
L.unescapeJsonPointer = il;
function kd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
L.eachItem = kd;
function $i({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, c) => {
    const l = o === void 0 ? a : o instanceof fe.Name ? (a instanceof fe.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof fe.Name ? (t(s, o, a), a) : r(a, o);
    return c === fe.Name && !(l instanceof fe.Name) ? n(s, l) : l;
  };
}
L.mergeEvaluated = {
  props: $i({
    mergeNames: (e, t, r) => e.if((0, fe._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, fe._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, fe._)`${r} || {}`).code((0, fe._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, fe._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, fe._)`${r} || {}`), $a(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: cl
  }),
  items: $i({
    mergeNames: (e, t, r) => e.if((0, fe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, fe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, fe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, fe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function cl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, fe._)`{}`);
  return t !== void 0 && $a(e, r, t), r;
}
L.evaluatedPropsToName = cl;
function $a(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, fe._)`${t}${(0, fe.getProperty)(n)}`, !0));
}
L.setEvaluated = $a;
const gi = {};
function Ad(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: gi[t.code] || (gi[t.code] = new Pd._Code(t.code))
  });
}
L.useFunc = Ad;
var Qs;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Qs || (L.Type = Qs = {}));
function Cd(e, t, r) {
  if (e instanceof fe.Name) {
    const n = t === Qs.Num;
    return r ? n ? (0, fe._)`"[" + ${e} + "]"` : (0, fe._)`"['" + ${e} + "']"` : n ? (0, fe._)`"/" + ${e}` : (0, fe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, fe.getProperty)(e).toString() : "/" + ya(e);
}
L.getErrorPath = Cd;
function ll(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
L.checkStrictMode = ll;
var Je = {};
Object.defineProperty(Je, "__esModule", { value: !0 });
const De = re, Dd = {
  // validation function arguments
  data: new De.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new De.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new De.Name("instancePath"),
  parentData: new De.Name("parentData"),
  parentDataProperty: new De.Name("parentDataProperty"),
  rootData: new De.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new De.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new De.Name("vErrors"),
  // null or array of validation errors
  errors: new De.Name("errors"),
  // counter of validation errors
  this: new De.Name("this"),
  // "globals"
  self: new De.Name("self"),
  scope: new De.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new De.Name("json"),
  jsonPos: new De.Name("jsonPos"),
  jsonLen: new De.Name("jsonLen"),
  jsonPart: new De.Name("jsonPart")
};
Je.default = Dd;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = re, r = L, n = Je;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, _, S) {
    const { it: O } = $, { gen: T, compositeRule: V, allErrors: K } = O, ne = h($, m, _);
    S ?? (V || K) ? l(T, ne) : d(O, (0, t._)`[${ne}]`);
  }
  e.reportError = s;
  function a($, m = e.keywordError, _) {
    const { it: S } = $, { gen: O, compositeRule: T, allErrors: V } = S, K = h($, m, _);
    l(O, K), T || V || d(S, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function c({ gen: $, keyword: m, schemaValue: _, data: S, errsCount: O, it: T }) {
    if (O === void 0)
      throw new Error("ajv implementation error");
    const V = $.name("err");
    $.forRange("i", O, n.default.errors, (K) => {
      $.const(V, (0, t._)`${n.default.vErrors}[${K}]`), $.if((0, t._)`${V}.instancePath === undefined`, () => $.assign((0, t._)`${V}.instancePath`, (0, t.strConcat)(n.default.instancePath, T.errorPath))), $.assign((0, t._)`${V}.schemaPath`, (0, t.str)`${T.errSchemaPath}/${m}`), T.opts.verbose && ($.assign((0, t._)`${V}.schema`, _), $.assign((0, t._)`${V}.data`, S));
    });
  }
  e.extendErrors = c;
  function l($, m) {
    const _ = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${_}]`), (0, t._)`${n.default.vErrors}.push(${_})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: _, validateName: S, schemaEnv: O } = $;
    O.$async ? _.throw((0, t._)`new ${$.ValidationError}(${m})`) : (_.assign((0, t._)`${S}.errors`, m), _.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, m, _) {
    const { createErrors: S } = $.it;
    return S === !1 ? (0, t._)`{}` : E($, m, _);
  }
  function E($, m, _ = {}) {
    const { gen: S, it: O } = $, T = [
      y(O, _),
      w($, _)
    ];
    return g($, m, T), S.object(...T);
  }
  function y({ errorPath: $ }, { instancePath: m }) {
    const _ = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, _)];
  }
  function w({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: _, parentSchema: S }) {
    let O = S ? m : (0, t.str)`${m}/${$}`;
    return _ && (O = (0, t.str)`${O}${(0, r.getErrorPath)(_, r.Type.Str)}`), [u.schemaPath, O];
  }
  function g($, { params: m, message: _ }, S) {
    const { keyword: O, data: T, schemaValue: V, it: K } = $, { opts: ne, propertyName: le, topSchemaRef: ue, schemaPath: F } = K;
    S.push([u.keyword, O], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), ne.messages && S.push([u.message, typeof _ == "function" ? _($) : _]), ne.verbose && S.push([u.schema, V], [u.parentSchema, (0, t._)`${ue}${F}`], [n.default.data, T]), le && S.push([u.propertyName, le]);
  }
})(on);
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.boolOrEmptySchema = Nr.topBoolOrEmptySchema = void 0;
const Md = on, Vd = re, Ld = Je, Fd = {
  message: "boolean schema is false"
};
function zd(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? ul(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Ld.default.data) : (t.assign((0, Vd._)`${n}.errors`, null), t.return(!0));
}
Nr.topBoolOrEmptySchema = zd;
function Ud(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), ul(e)) : r.var(t, !0);
}
Nr.boolOrEmptySchema = Ud;
function ul(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Md.reportError)(s, Fd, void 0, t);
}
var Ee = {}, ar = {};
Object.defineProperty(ar, "__esModule", { value: !0 });
ar.getRules = ar.isJSONType = void 0;
const qd = ["string", "number", "integer", "boolean", "null", "object", "array"], Kd = new Set(qd);
function Gd(e) {
  return typeof e == "string" && Kd.has(e);
}
ar.isJSONType = Gd;
function Hd() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
ar.getRules = Hd;
var St = {};
Object.defineProperty(St, "__esModule", { value: !0 });
St.shouldUseRule = St.shouldUseGroup = St.schemaHasRulesForType = void 0;
function Bd({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && dl(e, n);
}
St.schemaHasRulesForType = Bd;
function dl(e, t) {
  return t.rules.some((r) => fl(e, r));
}
St.shouldUseGroup = dl;
function fl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
St.shouldUseRule = fl;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.reportTypeError = Ee.checkDataTypes = Ee.checkDataType = Ee.coerceAndCheckDataType = Ee.getJSONTypes = Ee.getSchemaTypes = Ee.DataType = void 0;
const Xd = ar, Jd = St, Wd = on, se = re, hl = L;
var _r;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(_r || (Ee.DataType = _r = {}));
function Yd(e) {
  const t = ml(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Ee.getSchemaTypes = Yd;
function ml(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Xd.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Ee.getJSONTypes = ml;
function Qd(e, t) {
  const { gen: r, data: n, opts: s } = e, a = Zd(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Jd.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const c = ga(t, n, s.strictNumbers, _r.Wrong);
    r.if(c, () => {
      a.length ? xd(e, t, a) : _a(e);
    });
  }
  return o;
}
Ee.coerceAndCheckDataType = Qd;
const pl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Zd(e, t) {
  return t ? e.filter((r) => pl.has(r) || t === "array" && r === "array") : [];
}
function xd(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, se._)`typeof ${s}`), c = n.let("coerced", (0, se._)`undefined`);
  a.coerceTypes === "array" && n.if((0, se._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, se._)`${s}[0]`).assign(o, (0, se._)`typeof ${s}`).if(ga(t, s, a.strictNumbers), () => n.assign(c, s))), n.if((0, se._)`${c} !== undefined`);
  for (const d of r)
    (pl.has(d) || d === "array" && a.coerceTypes === "array") && l(d);
  n.else(), _a(e), n.endIf(), n.if((0, se._)`${c} !== undefined`, () => {
    n.assign(s, c), ef(e, c);
  });
  function l(d) {
    switch (d) {
      case "string":
        n.elseIf((0, se._)`${o} == "number" || ${o} == "boolean"`).assign(c, (0, se._)`"" + ${s}`).elseIf((0, se._)`${s} === null`).assign(c, (0, se._)`""`);
        return;
      case "number":
        n.elseIf((0, se._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, se._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, se._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, se._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, se._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, se._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, se._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, se._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(c, (0, se._)`[${s}]`);
    }
  }
}
function ef({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, se._)`${t} !== undefined`, () => e.assign((0, se._)`${t}[${r}]`, n));
}
function Zs(e, t, r, n = _r.Correct) {
  const s = n === _r.Correct ? se.operators.EQ : se.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, se._)`${t} ${s} null`;
    case "array":
      a = (0, se._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, se._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, se._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, se._)`typeof ${t} ${s} ${e}`;
  }
  return n === _r.Correct ? a : (0, se.not)(a);
  function o(c = se.nil) {
    return (0, se.and)((0, se._)`typeof ${t} == "number"`, c, r ? (0, se._)`isFinite(${t})` : se.nil);
  }
}
Ee.checkDataType = Zs;
function ga(e, t, r, n) {
  if (e.length === 1)
    return Zs(e[0], t, r, n);
  let s;
  const a = (0, hl.toHash)(e);
  if (a.array && a.object) {
    const o = (0, se._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, se._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = se.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, se.and)(s, Zs(o, t, r, n));
  return s;
}
Ee.checkDataTypes = ga;
const tf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, se._)`{type: ${e}}` : (0, se._)`{type: ${t}}`
};
function _a(e) {
  const t = rf(e);
  (0, Wd.reportError)(t, tf);
}
Ee.reportTypeError = _a;
function rf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, hl.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var as = {};
Object.defineProperty(as, "__esModule", { value: !0 });
as.assignDefaults = void 0;
const cr = re, nf = L;
function sf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      _i(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => _i(e, a, s.default));
}
as.assignDefaults = sf;
function _i(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const c = (0, cr._)`${a}${(0, cr.getProperty)(t)}`;
  if (s) {
    (0, nf.checkStrictMode)(e, `default is ignored for: ${c}`);
    return;
  }
  let l = (0, cr._)`${c} === undefined`;
  o.useDefaults === "empty" && (l = (0, cr._)`${l} || ${c} === null || ${c} === ""`), n.if(l, (0, cr._)`${c} = ${(0, cr.stringify)(r)}`);
}
var yt = {}, ce = {};
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.validateUnion = ce.validateArray = ce.usePattern = ce.callValidateCode = ce.schemaProperties = ce.allSchemaProperties = ce.noPropertyInData = ce.propertyInData = ce.isOwnProperty = ce.hasPropFunc = ce.reportMissingProp = ce.checkMissingProp = ce.checkReportMissingProp = void 0;
const pe = re, va = L, jt = Je, af = L;
function of(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Ea(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, pe._)`${t}` }, !0), e.error();
  });
}
ce.checkReportMissingProp = of;
function cf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, pe.or)(...n.map((a) => (0, pe.and)(Ea(e, t, a, r.ownProperties), (0, pe._)`${s} = ${a}`)));
}
ce.checkMissingProp = cf;
function lf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ce.reportMissingProp = lf;
function yl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, pe._)`Object.prototype.hasOwnProperty`
  });
}
ce.hasPropFunc = yl;
function wa(e, t, r) {
  return (0, pe._)`${yl(e)}.call(${t}, ${r})`;
}
ce.isOwnProperty = wa;
function uf(e, t, r, n) {
  const s = (0, pe._)`${t}${(0, pe.getProperty)(r)} !== undefined`;
  return n ? (0, pe._)`${s} && ${wa(e, t, r)}` : s;
}
ce.propertyInData = uf;
function Ea(e, t, r, n) {
  const s = (0, pe._)`${t}${(0, pe.getProperty)(r)} === undefined`;
  return n ? (0, pe.or)(s, (0, pe.not)(wa(e, t, r))) : s;
}
ce.noPropertyInData = Ea;
function $l(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ce.allSchemaProperties = $l;
function df(e, t) {
  return $l(t).filter((r) => !(0, va.alwaysValidSchema)(e, t[r]));
}
ce.schemaProperties = df;
function ff({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, c, l, d) {
  const u = d ? (0, pe._)`${e}, ${t}, ${n}${s}` : t, h = [
    [jt.default.instancePath, (0, pe.strConcat)(jt.default.instancePath, a)],
    [jt.default.parentData, o.parentData],
    [jt.default.parentDataProperty, o.parentDataProperty],
    [jt.default.rootData, jt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([jt.default.dynamicAnchors, jt.default.dynamicAnchors]);
  const E = (0, pe._)`${u}, ${r.object(...h)}`;
  return l !== pe.nil ? (0, pe._)`${c}.call(${l}, ${E})` : (0, pe._)`${c}(${E})`;
}
ce.callValidateCode = ff;
const hf = (0, pe._)`new RegExp`;
function mf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, pe._)`${s.code === "new RegExp" ? hf : (0, af.useFunc)(e, s)}(${r}, ${n})`
  });
}
ce.usePattern = mf;
function pf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const c = t.let("valid", !0);
    return o(() => t.assign(c, !1)), c;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(c) {
    const l = t.const("len", (0, pe._)`${r}.length`);
    t.forRange("i", 0, l, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: va.Type.Num
      }, a), t.if((0, pe.not)(a), c);
    });
  }
}
ce.validateArray = pf;
function yf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((l) => (0, va.alwaysValidSchema)(s, l)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), c = t.name("_valid");
  t.block(() => r.forEach((l, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, c);
    t.assign(o, (0, pe._)`${o} || ${c}`), e.mergeValidEvaluated(u, c) || t.if((0, pe.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
ce.validateUnion = yf;
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.validateKeywordUsage = yt.validSchemaType = yt.funcKeywordCode = yt.macroKeywordCode = void 0;
const Fe = re, Wt = Je, $f = ce, gf = on;
function _f(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, c = t.macro.call(o.self, s, a, o), l = gl(r, n, c);
  o.opts.validateSchema !== !1 && o.self.validateSchema(c, !0);
  const d = r.name("valid");
  e.subschema({
    schema: c,
    schemaPath: Fe.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: l,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
yt.macroKeywordCode = _f;
function vf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: c, it: l } = e;
  Ef(l, t);
  const d = !c && t.compile ? t.compile.call(l.self, a, o, l) : t.validate, u = gl(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      g(), t.modifying && vi(e), $(() => e.error());
    else {
      const m = t.async ? y() : w();
      t.modifying && vi(e), $(() => wf(e, m));
    }
  }
  function y() {
    const m = n.let("ruleErrs", null);
    return n.try(() => g((0, Fe._)`await `), (_) => n.assign(h, !1).if((0, Fe._)`${_} instanceof ${l.ValidationError}`, () => n.assign(m, (0, Fe._)`${_}.errors`), () => n.throw(_))), m;
  }
  function w() {
    const m = (0, Fe._)`${u}.errors`;
    return n.assign(m, null), g(Fe.nil), m;
  }
  function g(m = t.async ? (0, Fe._)`await ` : Fe.nil) {
    const _ = l.opts.passContext ? Wt.default.this : Wt.default.self, S = !("compile" in t && !c || t.schema === !1);
    n.assign(h, (0, Fe._)`${m}${(0, $f.callValidateCode)(e, u, _, S)}`, t.modifying);
  }
  function $(m) {
    var _;
    n.if((0, Fe.not)((_ = t.valid) !== null && _ !== void 0 ? _ : h), m);
  }
}
yt.funcKeywordCode = vf;
function vi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Fe._)`${n.parentData}[${n.parentDataProperty}]`));
}
function wf(e, t) {
  const { gen: r } = e;
  r.if((0, Fe._)`Array.isArray(${t})`, () => {
    r.assign(Wt.default.vErrors, (0, Fe._)`${Wt.default.vErrors} === null ? ${t} : ${Wt.default.vErrors}.concat(${t})`).assign(Wt.default.errors, (0, Fe._)`${Wt.default.vErrors}.length`), (0, gf.extendErrors)(e);
  }, () => e.error());
}
function Ef({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function gl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Fe.stringify)(r) });
}
function bf(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
yt.validSchemaType = bf;
function Sf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((c) => !Object.prototype.hasOwnProperty.call(e, c)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const l = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(l);
    else
      throw new Error(l);
  }
}
yt.validateKeywordUsage = Sf;
var Ut = {};
Object.defineProperty(Ut, "__esModule", { value: !0 });
Ut.extendSubschemaMode = Ut.extendSubschemaData = Ut.getSubschema = void 0;
const pt = re, _l = L;
function Pf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const c = e.schema[t];
    return r === void 0 ? {
      schema: c,
      schemaPath: (0, pt._)`${e.schemaPath}${(0, pt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: c[r],
      schemaPath: (0, pt._)`${e.schemaPath}${(0, pt.getProperty)(t)}${(0, pt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, _l.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Ut.getSubschema = Pf;
function Nf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: c } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = c.let("data", (0, pt._)`${t.data}${(0, pt.getProperty)(r)}`, !0);
    l(E), e.errorPath = (0, pt.str)`${d}${(0, _l.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, pt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof pt.Name ? s : c.let("data", s, !0);
    l(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function l(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ut.extendSubschemaData = Nf;
function Rf(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ut.extendSubschemaMode = Rf;
var Te = {}, os = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, vl = { exports: {} }, Ft = vl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Ln(t, n, s, e, "", e);
};
Ft.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
Ft.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Ft.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Ft.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Ln(e, t, r, n, s, a, o, c, l, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, c, l, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Ft.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Ln(e, t, r, h[E], s + "/" + u + "/" + E, a, s, u, n, E);
      } else if (u in Ft.propsKeywords) {
        if (h && typeof h == "object")
          for (var y in h)
            Ln(e, t, r, h[y], s + "/" + u + "/" + Of(y), a, s, u, n, y);
      } else (u in Ft.keywords || e.allKeys && !(u in Ft.skipKeywords)) && Ln(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, c, l, d);
  }
}
function Of(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var If = vl.exports;
Object.defineProperty(Te, "__esModule", { value: !0 });
Te.getSchemaRefs = Te.resolveUrl = Te.normalizeId = Te._getFullPath = Te.getFullPath = Te.inlineRef = void 0;
const Tf = L, jf = os, kf = If, Af = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function Cf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !xs(e) : t ? wl(e) <= t : !1;
}
Te.inlineRef = Cf;
const Df = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function xs(e) {
  for (const t in e) {
    if (Df.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(xs) || typeof r == "object" && xs(r))
      return !0;
  }
  return !1;
}
function wl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Af.has(r) && (typeof e[r] == "object" && (0, Tf.eachItem)(e[r], (n) => t += wl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function El(e, t = "", r) {
  r !== !1 && (t = vr(t));
  const n = e.parse(t);
  return bl(e, n);
}
Te.getFullPath = El;
function bl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Te._getFullPath = bl;
const Mf = /#\/?$/;
function vr(e) {
  return e ? e.replace(Mf, "") : "";
}
Te.normalizeId = vr;
function Vf(e, t, r) {
  return r = vr(r), e.resolve(t, r);
}
Te.resolveUrl = Vf;
const Lf = /^[a-z_][-a-z0-9._]*$/i;
function Ff(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = vr(e[r] || t), a = { "": s }, o = El(n, s, !1), c = {}, l = /* @__PURE__ */ new Set();
  return kf(e, { allKeys: !0 }, (h, E, y, w) => {
    if (w === void 0)
      return;
    const g = o + E;
    let $ = a[w];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), _.call(this, h.$anchor), _.call(this, h.$dynamicAnchor), a[E] = $;
    function m(S) {
      const O = this.opts.uriResolver.resolve;
      if (S = vr($ ? O($, S) : S), l.has(S))
        throw u(S);
      l.add(S);
      let T = this.refs[S];
      return typeof T == "string" && (T = this.refs[T]), typeof T == "object" ? d(h, T.schema, S) : S !== vr(g) && (S[0] === "#" ? (d(h, c[S], S), c[S] = h) : this.refs[S] = g), S;
    }
    function _(S) {
      if (typeof S == "string") {
        if (!Lf.test(S))
          throw new Error(`invalid anchor "${S}"`);
        m.call(this, `#${S}`);
      }
    }
  }), c;
  function d(h, E, y) {
    if (E !== void 0 && !jf(h, E))
      throw u(y);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Te.getSchemaRefs = Ff;
Object.defineProperty(it, "__esModule", { value: !0 });
it.getData = it.KeywordCxt = it.validateFunctionCode = void 0;
const Sl = Nr, wi = Ee, ba = St, Yn = Ee, zf = as, Wr = yt, Is = Ut, Y = re, Z = Je, Uf = Te, Pt = L, Ur = on;
function qf(e) {
  if (Rl(e) && (Ol(e), Nl(e))) {
    Hf(e);
    return;
  }
  Pl(e, () => (0, Sl.topBoolOrEmptySchema)(e));
}
it.validateFunctionCode = qf;
function Pl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, Y._)`${Z.default.data}, ${Z.default.valCxt}`, n.$async, () => {
    e.code((0, Y._)`"use strict"; ${Ei(r, s)}`), Gf(e, s), e.code(a);
  }) : e.func(t, (0, Y._)`${Z.default.data}, ${Kf(s)}`, n.$async, () => e.code(Ei(r, s)).code(a));
}
function Kf(e) {
  return (0, Y._)`{${Z.default.instancePath}="", ${Z.default.parentData}, ${Z.default.parentDataProperty}, ${Z.default.rootData}=${Z.default.data}${e.dynamicRef ? (0, Y._)`, ${Z.default.dynamicAnchors}={}` : Y.nil}}={}`;
}
function Gf(e, t) {
  e.if(Z.default.valCxt, () => {
    e.var(Z.default.instancePath, (0, Y._)`${Z.default.valCxt}.${Z.default.instancePath}`), e.var(Z.default.parentData, (0, Y._)`${Z.default.valCxt}.${Z.default.parentData}`), e.var(Z.default.parentDataProperty, (0, Y._)`${Z.default.valCxt}.${Z.default.parentDataProperty}`), e.var(Z.default.rootData, (0, Y._)`${Z.default.valCxt}.${Z.default.rootData}`), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, Y._)`${Z.default.valCxt}.${Z.default.dynamicAnchors}`);
  }, () => {
    e.var(Z.default.instancePath, (0, Y._)`""`), e.var(Z.default.parentData, (0, Y._)`undefined`), e.var(Z.default.parentDataProperty, (0, Y._)`undefined`), e.var(Z.default.rootData, Z.default.data), t.dynamicRef && e.var(Z.default.dynamicAnchors, (0, Y._)`{}`);
  });
}
function Hf(e) {
  const { schema: t, opts: r, gen: n } = e;
  Pl(e, () => {
    r.$comment && t.$comment && Tl(e), Yf(e), n.let(Z.default.vErrors, null), n.let(Z.default.errors, 0), r.unevaluated && Bf(e), Il(e), xf(e);
  });
}
function Bf(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, Y._)`${r}.evaluated`), t.if((0, Y._)`${e.evaluated}.dynamicProps`, () => t.assign((0, Y._)`${e.evaluated}.props`, (0, Y._)`undefined`)), t.if((0, Y._)`${e.evaluated}.dynamicItems`, () => t.assign((0, Y._)`${e.evaluated}.items`, (0, Y._)`undefined`));
}
function Ei(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, Y._)`/*# sourceURL=${r} */` : Y.nil;
}
function Xf(e, t) {
  if (Rl(e) && (Ol(e), Nl(e))) {
    Jf(e, t);
    return;
  }
  (0, Sl.boolOrEmptySchema)(e, t);
}
function Nl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Rl(e) {
  return typeof e.schema != "boolean";
}
function Jf(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Tl(e), Qf(e), Zf(e);
  const a = n.const("_errs", Z.default.errors);
  Il(e, a), n.var(t, (0, Y._)`${a} === ${Z.default.errors}`);
}
function Ol(e) {
  (0, Pt.checkUnknownRules)(e), Wf(e);
}
function Il(e, t) {
  if (e.opts.jtd)
    return bi(e, [], !1, t);
  const r = (0, wi.getSchemaTypes)(e.schema), n = (0, wi.coerceAndCheckDataType)(e, r);
  bi(e, r, !n, t);
}
function Wf(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, Pt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Yf(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, Pt.checkStrictMode)(e, "default is ignored in the schema root");
}
function Qf(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Uf.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Zf(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Tl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, Y._)`${Z.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, Y.str)`${n}/$comment`, c = e.scopeValue("root", { ref: t.root });
    e.code((0, Y._)`${Z.default.self}.opts.$comment(${a}, ${o}, ${c}.schema)`);
  }
}
function xf(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, Y._)`${Z.default.errors} === 0`, () => t.return(Z.default.data), () => t.throw((0, Y._)`new ${s}(${Z.default.vErrors})`)) : (t.assign((0, Y._)`${n}.errors`, Z.default.vErrors), a.unevaluated && eh(e), t.return((0, Y._)`${Z.default.errors} === 0`));
}
function eh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof Y.Name && e.assign((0, Y._)`${t}.props`, r), n instanceof Y.Name && e.assign((0, Y._)`${t}.items`, n);
}
function bi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: c, opts: l, self: d } = e, { RULES: u } = d;
  if (a.$ref && (l.ignoreKeywordsWithRef || !(0, Pt.schemaHasRulesButRef)(a, u))) {
    s.block(() => Al(e, "$ref", u.all.$ref.definition));
    return;
  }
  l.jtd || th(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, ba.shouldUseGroup)(a, E) && (E.type ? (s.if((0, Yn.checkDataType)(E.type, o, l.strictNumbers)), Si(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, Yn.reportTypeError)(e)), s.endIf()) : Si(e, E), c || s.if((0, Y._)`${Z.default.errors} === ${n || 0}`));
  }
}
function Si(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, zf.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, ba.shouldUseRule)(n, a) && Al(e, a.keyword, a.definition, t.type);
  });
}
function th(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (rh(e, t), e.opts.allowUnionTypes || nh(e, t), sh(e, e.dataTypes));
}
function rh(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      jl(e.dataTypes, r) || Sa(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), oh(e, t);
  }
}
function nh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Sa(e, "use allowUnionTypes to allow union type keyword");
}
function sh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, ba.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => ah(t, o)) && Sa(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function ah(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function jl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function oh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    jl(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Sa(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, Pt.checkStrictMode)(e, t, e.opts.strictTypes);
}
class kl {
  constructor(t, r, n) {
    if ((0, Wr.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Pt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Cl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Wr.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", Z.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, Y.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, Y.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, Y._)`${r} !== undefined && (${(0, Y.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Ur.reportExtraError : Ur.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Ur.reportError)(this, this.def.$dataError || Ur.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ur.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = Y.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = Y.nil, r = Y.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, Y.or)((0, Y._)`${s} === undefined`, r)), t !== Y.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== Y.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, Y.or)(o(), c());
    function o() {
      if (n.length) {
        if (!(r instanceof Y.Name))
          throw new Error("ajv implementation error");
        const l = Array.isArray(n) ? n : [n];
        return (0, Y._)`${(0, Yn.checkDataTypes)(l, r, a.opts.strictNumbers, Yn.DataType.Wrong)}`;
      }
      return Y.nil;
    }
    function c() {
      if (s.validateSchema) {
        const l = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, Y._)`!${l}(${r})`;
      }
      return Y.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Is.getSubschema)(this.it, t);
    (0, Is.extendSubschemaData)(n, this.it, t), (0, Is.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Xf(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = Pt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = Pt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, Y.Name)), !0;
  }
}
it.KeywordCxt = kl;
function Al(e, t, r, n) {
  const s = new kl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Wr.funcKeywordCode)(s, r) : "macro" in r ? (0, Wr.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Wr.funcKeywordCode)(s, r);
}
const ih = /^\/(?:[^~]|~0|~1)*$/, ch = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Cl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return Z.default.rootData;
  if (e[0] === "/") {
    if (!ih.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = Z.default.rootData;
  } else {
    const d = ch.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(l("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(l("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const c = s.split("/");
  for (const d of c)
    d && (a = (0, Y._)`${a}${(0, Y.getProperty)((0, Pt.unescapeJsonPointer)(d))}`, o = (0, Y._)`${o} && ${a}`);
  return o;
  function l(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
it.getData = Cl;
var cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
class lh extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
cn.default = lh;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
const Ts = Te;
class uh extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ts.resolveUrl)(t, r, n), this.missingSchema = (0, Ts.normalizeId)((0, Ts.getFullPath)(t, this.missingRef));
  }
}
Ir.default = uh;
var ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.resolveSchema = ze.getCompilingSchema = ze.resolveRef = ze.compileSchema = ze.SchemaEnv = void 0;
const et = re, dh = cn, Bt = Je, at = Te, Pi = L, fh = it;
let is = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, at.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
ze.SchemaEnv = is;
function Pa(e) {
  const t = Dl.call(this, e);
  if (t)
    return t;
  const r = (0, at.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new et.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let c;
  e.$async && (c = o.scopeValue("Error", {
    ref: dh.default,
    code: (0, et._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const l = o.scopeName("validate");
  e.validateName = l;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Bt.default.data,
    parentData: Bt.default.parentData,
    parentDataProperty: Bt.default.parentDataProperty,
    dataNames: [Bt.default.data],
    dataPathArr: [et.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, et.stringify)(e.schema) } : { ref: e.schema }),
    validateName: l,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: et.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, et._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, fh.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Bt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const y = new Function(`${Bt.default.self}`, `${Bt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(l, { ref: y }), y.errors = null, y.schema = e.schema, y.schemaEnv = e, e.$async && (y.$async = !0), this.opts.code.source === !0 && (y.source = { validateName: l, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: g } = d;
      y.evaluated = {
        props: w instanceof et.Name ? void 0 : w,
        items: g instanceof et.Name ? void 0 : g,
        dynamicProps: w instanceof et.Name,
        dynamicItems: g instanceof et.Name
      }, y.source && (y.source.evaluated = (0, et.stringify)(y.evaluated));
    }
    return e.validate = y, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
ze.compileSchema = Pa;
function hh(e, t, r) {
  var n;
  r = (0, at.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = yh.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    o && (a = new is({ schema: o, schemaId: c, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = mh.call(this, a);
}
ze.resolveRef = hh;
function mh(e) {
  return (0, at.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Pa.call(this, e);
}
function Dl(e) {
  for (const t of this._compilations)
    if (ph(t, e))
      return t;
}
ze.getCompilingSchema = Dl;
function ph(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function yh(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || cs.call(this, e, t);
}
function cs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, at._getFullPath)(this.opts.uriResolver, r);
  let s = (0, at.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return js.call(this, r, e);
  const a = (0, at.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const c = cs.call(this, e, o);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : js.call(this, r, c);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Pa.call(this, o), a === (0, at.normalizeId)(t)) {
      const { schema: c } = o, { schemaId: l } = this.opts, d = c[l];
      return d && (s = (0, at.resolveUrl)(this.opts.uriResolver, s, d)), new is({ schema: c, schemaId: l, root: e, baseId: s });
    }
    return js.call(this, r, o);
  }
}
ze.resolveSchema = cs;
const $h = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function js(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const l = r[(0, Pi.unescapeFragment)(c)];
    if (l === void 0)
      return;
    r = l;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !$h.has(c) && d && (t = (0, at.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Pi.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, at.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = cs.call(this, n, c);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new is({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const gh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", _h = "Meta-schema for $data reference (JSON AnySchema extension proposal)", vh = "object", wh = [
  "$data"
], Eh = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, bh = !1, Sh = {
  $id: gh,
  description: _h,
  type: vh,
  required: wh,
  properties: Eh,
  additionalProperties: bh
};
var Na = {}, ls = { exports: {} };
const Ph = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Ml = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function Vl(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const Nh = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Ni(e) {
  return e.length = 0, !0;
}
function Rh(e, t, r) {
  if (e.length) {
    const n = Vl(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Oh(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, c = Rh;
  for (let l = 0; l < e.length; l++) {
    const d = e[l];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (o = !0), !c(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        l > 0 && e[l - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!c(s, n, r))
          break;
        c = Ni;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (c === Ni ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Vl(s))), r.address = n.join(""), r;
}
function Ll(e) {
  if (Ih(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Oh(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Ih(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Th(e) {
  let t = e;
  const r = [];
  let n = -1, s = 0;
  for (; s = t.length; ) {
    if (s === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (s === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function jh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function kh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Ml(r)) {
      const n = Ll(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Fl = {
  nonSimpleDomain: Nh,
  recomposeAuthority: kh,
  normalizeComponentEncoding: jh,
  removeDotSegments: Th,
  isIPv4: Ml,
  isUUID: Ph,
  normalizeIPv6: Ll
};
const { isUUID: Ah } = Fl, Ch = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function zl(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function Ul(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function ql(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Dh(e) {
  return e.secure = zl(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Mh(e) {
  if ((e.port === (zl(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Vh(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(Ch);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Ra(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Lh(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Ra(s);
  a && (e = a.serialize(e, t));
  const o = e, c = e.nss;
  return o.path = `${n || t.nid}:${c}`, t.skipEscape = !0, o;
}
function Fh(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Ah(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function zh(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Kl = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Ul,
    serialize: ql
  }
), Uh = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Kl.domainHost,
    parse: Ul,
    serialize: ql
  }
), Fn = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: Dh,
    serialize: Mh
  }
), qh = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Fn.domainHost,
    parse: Fn.parse,
    serialize: Fn.serialize
  }
), Kh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: Vh,
    serialize: Lh,
    skipNormalize: !0
  }
), Gh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: Fh,
    serialize: zh,
    skipNormalize: !0
  }
), Qn = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Kl,
    https: Uh,
    ws: Fn,
    wss: qh,
    urn: Kh,
    "urn:uuid": Gh
  }
);
Object.setPrototypeOf(Qn, null);
function Ra(e) {
  return e && (Qn[
    /** @type {SchemeName} */
    e
  ] || Qn[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var Hh = {
  SCHEMES: Qn,
  getSchemeHandler: Ra
};
const { normalizeIPv6: Bh, removeDotSegments: Br, recomposeAuthority: Xh, normalizeComponentEncoding: pn, isIPv4: Jh, nonSimpleDomain: Wh } = Fl, { SCHEMES: Yh, getSchemeHandler: Gl } = Hh;
function Qh(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  $t(Nt(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  Nt($t(e, t), t)), e;
}
function Zh(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = Hl(Nt(e, n), Nt(t, n), n, !0);
  return n.skipEscape = !0, $t(s, n);
}
function Hl(e, t, r, n) {
  const s = {};
  return n || (e = Nt($t(e, r), r), t = Nt($t(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Br(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Br(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = Br(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Br(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function xh(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = $t(pn(Nt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = $t(pn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = $t(pn(Nt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = $t(pn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function $t(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], a = Gl(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = Xh(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let c = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (c = Br(c)), o === void 0 && c[0] === "/" && c[1] === "/" && (c = "/%2F" + c.slice(2)), s.push(c);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const em = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Nt(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const a = e.match(em);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host)
      if (Jh(n.host) === !1) {
        const l = Bh(n.host);
        n.host = l.host.toLowerCase(), s = l.isIPV6;
      } else
        s = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const o = Gl(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!o || !o.unicodeSupport) && n.host && (r.domainHost || o && o.domainHost) && s === !1 && Wh(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (c) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + c;
      }
    (!o || o && !o.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), o && o.parse && o.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Oa = {
  SCHEMES: Yh,
  normalize: Qh,
  resolve: Zh,
  resolveComponent: Hl,
  equal: xh,
  serialize: $t,
  parse: Nt
};
ls.exports = Oa;
ls.exports.default = Oa;
ls.exports.fastUri = Oa;
var Bl = ls.exports;
Object.defineProperty(Na, "__esModule", { value: !0 });
const Xl = Bl;
Xl.code = 'require("ajv/dist/runtime/uri").default';
Na.default = Xl;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = it;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = re;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = cn, s = Ir, a = ar, o = ze, c = re, l = Te, d = Ee, u = L, h = Sh, E = Na, y = (N, p) => new RegExp(N, p);
  y.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, _ = 200;
  function S(N) {
    var p, P, v, i, f, b, k, A, B, H, R, I, C, M, X, x, ge, Le, Se, Pe, _e, dt, ke, Kt, Gt;
    const Ze = N.strict, Ht = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, Vr = Ht === !0 || Ht === void 0 ? 1 : Ht || 0, Lr = (v = (P = N.code) === null || P === void 0 ? void 0 : P.regExp) !== null && v !== void 0 ? v : y, Ss = (i = N.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = N.strictSchema) !== null && f !== void 0 ? f : Ze) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (k = N.strictNumbers) !== null && k !== void 0 ? k : Ze) !== null && A !== void 0 ? A : !0,
      strictTypes: (H = (B = N.strictTypes) !== null && B !== void 0 ? B : Ze) !== null && H !== void 0 ? H : "log",
      strictTuples: (I = (R = N.strictTuples) !== null && R !== void 0 ? R : Ze) !== null && I !== void 0 ? I : "log",
      strictRequired: (M = (C = N.strictRequired) !== null && C !== void 0 ? C : Ze) !== null && M !== void 0 ? M : !1,
      code: N.code ? { ...N.code, optimize: Vr, regExp: Lr } : { optimize: Vr, regExp: Lr },
      loopRequired: (X = N.loopRequired) !== null && X !== void 0 ? X : _,
      loopEnum: (x = N.loopEnum) !== null && x !== void 0 ? x : _,
      meta: (ge = N.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (Le = N.messages) !== null && Le !== void 0 ? Le : !0,
      inlineRefs: (Se = N.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = N.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (_e = N.addUsedSchema) !== null && _e !== void 0 ? _e : !0,
      validateSchema: (dt = N.validateSchema) !== null && dt !== void 0 ? dt : !0,
      validateFormats: (ke = N.validateFormats) !== null && ke !== void 0 ? ke : !0,
      unicodeRegExp: (Kt = N.unicodeRegExp) !== null && Kt !== void 0 ? Kt : !0,
      int32range: (Gt = N.int32range) !== null && Gt !== void 0 ? Gt : !0,
      uriResolver: Ss
    };
  }
  class O {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...S(p) };
      const { es5: P, lines: v } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: g, es5: P, lines: v }), this.logger = J(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), T.call(this, $, p, "NOT SUPPORTED"), T.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ue.call(this), p.formats && ne.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && le.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), K.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: P, schemaId: v } = this.opts;
      let i = h;
      v === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), P && p && this.addMetaSchema(i, i[v], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: P } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[P] || p : void 0;
    }
    validate(p, P) {
      let v;
      if (typeof p == "string") {
        if (v = this.getSchema(p), !v)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        v = this.compile(p);
      const i = v(P);
      return "$async" in v || (this.errors = v.errors), i;
    }
    compile(p, P) {
      const v = this._addSchema(p, P);
      return v.validate || this._compileSchemaEnv(v);
    }
    compileAsync(p, P) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: v } = this.opts;
      return i.call(this, p, P);
      async function i(H, R) {
        await f.call(this, H.$schema);
        const I = this._addSchema(H, R);
        return I.validate || b.call(this, I);
      }
      async function f(H) {
        H && !this.getSchema(H) && await i.call(this, { $ref: H }, !0);
      }
      async function b(H) {
        try {
          return this._compileSchemaEnv(H);
        } catch (R) {
          if (!(R instanceof s.default))
            throw R;
          return k.call(this, R), await A.call(this, R.missingSchema), b.call(this, H);
        }
      }
      function k({ missingSchema: H, missingRef: R }) {
        if (this.refs[H])
          throw new Error(`AnySchema ${H} is loaded but ${R} cannot be resolved`);
      }
      async function A(H) {
        const R = await B.call(this, H);
        this.refs[H] || await f.call(this, R.$schema), this.refs[H] || this.addSchema(R, H, P);
      }
      async function B(H) {
        const R = this._loading[H];
        if (R)
          return R;
        try {
          return await (this._loading[H] = v(H));
        } finally {
          delete this._loading[H];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, P, v, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, v, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return P = (0, l.normalizeId)(P || f), this._checkUnique(P), this.schemas[P] = this._addSchema(p, v, P, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, P, v = this.opts.validateSchema) {
      return this.addSchema(p, P, !0, v), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, P) {
      if (typeof p == "boolean")
        return !0;
      let v;
      if (v = p.$schema, v !== void 0 && typeof v != "string")
        throw new Error("$schema must be a string");
      if (v = v || this.opts.defaultMeta || this.defaultMeta(), !v)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(v, p);
      if (!i && P) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let P;
      for (; typeof (P = V.call(this, p)) == "string"; )
        p = P;
      if (P === void 0) {
        const { schemaId: v } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: v });
        if (P = o.resolveSchema.call(this, i, p), !P)
          return;
        this.refs[p] = P;
      }
      return P.validate || this._compileSchemaEnv(P);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const P = V.call(this, p);
          return typeof P == "object" && this._cache.delete(P.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const P = p;
          this._cache.delete(P);
          let v = p[this.opts.schemaId];
          return v && (v = (0, l.normalizeId)(v), delete this.schemas[v], delete this.refs[v]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const P of p)
        this.addKeyword(P);
      return this;
    }
    addKeyword(p, P) {
      let v;
      if (typeof p == "string")
        v = p, typeof P == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), P.keyword = v);
      else if (typeof p == "object" && P === void 0) {
        if (P = p, v = P.keyword, Array.isArray(v) && !v.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (j.call(this, v, P), !P)
        return (0, u.eachItem)(v, (f) => D.call(this, f)), this;
      z.call(this, P);
      const i = {
        ...P,
        type: (0, d.getJSONTypes)(P.type),
        schemaType: (0, d.getJSONTypes)(P.schemaType)
      };
      return (0, u.eachItem)(v, i.type.length === 0 ? (f) => D.call(this, f, i) : (f) => i.type.forEach((b) => D.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const P = this.RULES.all[p];
      return typeof P == "object" ? P.definition : !!P;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: P } = this;
      delete P.keywords[p], delete P.all[p];
      for (const v of P.rules) {
        const i = v.rules.findIndex((f) => f.keyword === p);
        i >= 0 && v.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, P) {
      return typeof P == "string" && (P = new RegExp(P)), this.formats[p] = P, this;
    }
    errorsText(p = this.errors, { separator: P = ", ", dataVar: v = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${v}${i.instancePath} ${i.message}`).reduce((i, f) => i + P + f);
    }
    $dataMetaSchema(p, P) {
      const v = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of P) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const k of f)
          b = b[k];
        for (const k in v) {
          const A = v[k];
          if (typeof A != "object")
            continue;
          const { $data: B } = A.definition, H = b[k];
          B && H && (b[k] = q(H));
        }
      }
      return p;
    }
    _removeAllSchemas(p, P) {
      for (const v in p) {
        const i = p[v];
        (!P || P.test(v)) && (typeof i == "string" ? delete p[v] : i && !i.meta && (this._cache.delete(i.schema), delete p[v]));
      }
    }
    _addSchema(p, P, v, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: k } = this.opts;
      if (typeof p == "object")
        b = p[k];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(p);
      if (A !== void 0)
        return A;
      v = (0, l.normalizeId)(b || v);
      const B = l.getSchemaRefs.call(this, p, v);
      return A = new o.SchemaEnv({ schema: p, schemaId: k, meta: P, baseId: v, localRefs: B }), this._cache.set(A.schema, A), f && !v.startsWith("#") && (v && this._checkUnique(v), this.refs[v] = A), i && this.validateSchema(p, !0), A;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const P = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = P;
      }
    }
  }
  O.ValidationError = n.default, O.MissingRefError = s.default, e.default = O;
  function T(N, p, P, v = "error") {
    for (const i in N) {
      const f = i;
      f in p && this.logger[v](`${P}: option ${i}. ${N[f]}`);
    }
  }
  function V(N) {
    return N = (0, l.normalizeId)(N), this.schemas[N] || this.refs[N];
  }
  function K() {
    const N = this.opts.schemas;
    if (N)
      if (Array.isArray(N))
        this.addSchema(N);
      else
        for (const p in N)
          this.addSchema(N[p], p);
  }
  function ne() {
    for (const N in this.opts.formats) {
      const p = this.opts.formats[N];
      p && this.addFormat(N, p);
    }
  }
  function le(N) {
    if (Array.isArray(N)) {
      this.addVocabulary(N);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in N) {
      const P = N[p];
      P.keyword || (P.keyword = p), this.addKeyword(P);
    }
  }
  function ue() {
    const N = { ...this.opts };
    for (const p of w)
      delete N[p];
    return N;
  }
  const F = { log() {
  }, warn() {
  }, error() {
  } };
  function J(N) {
    if (N === !1)
      return F;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function j(N, p) {
    const { RULES: P } = this;
    if ((0, u.eachItem)(N, (v) => {
      if (P.keywords[v])
        throw new Error(`Keyword ${v} is already defined`);
      if (!Q.test(v))
        throw new Error(`Keyword ${v} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function D(N, p, P) {
    var v;
    const i = p == null ? void 0 : p.post;
    if (P && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: A }) => A === P);
    if (b || (b = { type: P, rules: [] }, f.rules.push(b)), f.keywords[N] = !0, !p)
      return;
    const k = {
      keyword: N,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? G.call(this, b, k, p.before) : b.rules.push(k), f.all[N] = k, (v = p.implements) === null || v === void 0 || v.forEach((A) => this.addKeyword(A));
  }
  function G(N, p, P) {
    const v = N.rules.findIndex((i) => i.keyword === P);
    v >= 0 ? N.rules.splice(v, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${P} is not defined`));
  }
  function z(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = q(p)), N.validateSchema = this.compile(p, !0));
  }
  const W = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function q(N) {
    return { anyOf: [N, W] };
  }
})(sl);
var Ia = {}, Ta = {}, ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
const tm = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ja.default = tm;
var Rt = {};
Object.defineProperty(Rt, "__esModule", { value: !0 });
Rt.callRef = Rt.getValidate = void 0;
const rm = Ir, Ri = ce, Ge = re, lr = Je, Oi = ze, yn = L, nm = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: c, self: l } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Oi.resolveRef.call(l, d, s, r);
    if (u === void 0)
      throw new rm.default(n.opts.uriResolver, s, r);
    if (u instanceof Oi.SchemaEnv)
      return E(u);
    return y(u);
    function h() {
      if (a === d)
        return zn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return zn(e, (0, Ge._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const g = Jl(e, w);
      zn(e, g, w, w.$async);
    }
    function y(w) {
      const g = t.scopeValue("schema", c.code.source === !0 ? { ref: w, code: (0, Ge.stringify)(w) } : { ref: w }), $ = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Ge.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function Jl(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ge._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Rt.getValidate = Jl;
function zn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: c, opts: l } = a, d = l.passContext ? lr.default.this : Ge.nil;
  n ? u() : h();
  function u() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Ge._)`await ${(0, Ri.callValidateCode)(e, t, d)}`), y(t), o || s.assign(w, !0);
    }, (g) => {
      s.if((0, Ge._)`!(${g} instanceof ${a.ValidationError})`, () => s.throw(g)), E(g), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, Ri.callValidateCode)(e, t, d), () => y(t), () => E(t));
  }
  function E(w) {
    const g = (0, Ge._)`${w}.errors`;
    s.assign(lr.default.vErrors, (0, Ge._)`${lr.default.vErrors} === null ? ${g} : ${lr.default.vErrors}.concat(${g})`), s.assign(lr.default.errors, (0, Ge._)`${lr.default.vErrors}.length`);
  }
  function y(w) {
    var g;
    if (!a.opts.unevaluated)
      return;
    const $ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = yn.mergeEvaluated.props(s, $.props, a.props));
      else {
        const m = s.var("props", (0, Ge._)`${w}.evaluated.props`);
        a.props = yn.mergeEvaluated.props(s, m, a.props, Ge.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = yn.mergeEvaluated.items(s, $.items, a.items));
      else {
        const m = s.var("items", (0, Ge._)`${w}.evaluated.items`);
        a.items = yn.mergeEvaluated.items(s, m, a.items, Ge.Name);
      }
  }
}
Rt.callRef = zn;
Rt.default = nm;
Object.defineProperty(Ta, "__esModule", { value: !0 });
const sm = ja, am = Rt, om = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  sm.default,
  am.default
];
Ta.default = om;
var ka = {}, Aa = {};
Object.defineProperty(Aa, "__esModule", { value: !0 });
const Zn = re, kt = Zn.operators, xn = {
  maximum: { okStr: "<=", ok: kt.LTE, fail: kt.GT },
  minimum: { okStr: ">=", ok: kt.GTE, fail: kt.LT },
  exclusiveMaximum: { okStr: "<", ok: kt.LT, fail: kt.GTE },
  exclusiveMinimum: { okStr: ">", ok: kt.GT, fail: kt.LTE }
}, im = {
  message: ({ keyword: e, schemaCode: t }) => (0, Zn.str)`must be ${xn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Zn._)`{comparison: ${xn[e].okStr}, limit: ${t}}`
}, cm = {
  keyword: Object.keys(xn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: im,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Zn._)`${r} ${xn[t].fail} ${n} || isNaN(${r})`);
  }
};
Aa.default = cm;
var Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const Yr = re, lm = {
  message: ({ schemaCode: e }) => (0, Yr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Yr._)`{multipleOf: ${e}}`
}, um = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: lm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), c = a ? (0, Yr._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Yr._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Yr._)`(${n} === 0 || (${o} = ${r}/${n}, ${c}))`);
  }
};
Ca.default = um;
var Da = {}, Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
function Wl(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Ma.default = Wl;
Wl.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Da, "__esModule", { value: !0 });
const Yt = re, dm = L, fm = Ma, hm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, Yt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Yt._)`{limit: ${e}}`
}, mm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: hm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? Yt.operators.GT : Yt.operators.LT, o = s.opts.unicode === !1 ? (0, Yt._)`${r}.length` : (0, Yt._)`${(0, dm.useFunc)(e.gen, fm.default)}(${r})`;
    e.fail$data((0, Yt._)`${o} ${a} ${n}`);
  }
};
Da.default = mm;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
const pm = ce, ym = L, $r = re, $m = {
  message: ({ schemaCode: e }) => (0, $r.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, $r._)`{pattern: ${e}}`
}, gm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: $m,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, c = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: l } = o.opts.code, d = l.code === "new RegExp" ? (0, $r._)`new RegExp` : (0, ym.useFunc)(t, l), u = t.let("valid");
      t.try(() => t.assign(u, (0, $r._)`${d}(${a}, ${c}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, $r._)`!${u}`);
    } else {
      const l = (0, pm.usePattern)(e, s);
      e.fail$data((0, $r._)`!${l}.test(${r})`);
    }
  }
};
Va.default = gm;
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
const Qr = re, _m = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Qr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Qr._)`{limit: ${e}}`
}, vm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: _m,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Qr.operators.GT : Qr.operators.LT;
    e.fail$data((0, Qr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
La.default = vm;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const qr = ce, Zr = re, wm = L, Em = {
  message: ({ params: { missingProperty: e } }) => (0, Zr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Zr._)`{missingProperty: ${e}}`
}, bm = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Em,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: c } = o;
    if (!a && r.length === 0)
      return;
    const l = r.length >= c.loopRequired;
    if (o.allErrors ? d() : u(), c.strictRequired) {
      const y = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const g of r)
        if ((y == null ? void 0 : y[g]) === void 0 && !w.has(g)) {
          const $ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${g}" is not defined at "${$}" (strictRequired)`;
          (0, wm.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (l || a)
        e.block$data(Zr.nil, h);
      else
        for (const y of r)
          (0, qr.checkReportMissingProp)(e, y);
    }
    function u() {
      const y = t.let("missing");
      if (l || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(y, w)), e.ok(w);
      } else
        t.if((0, qr.checkMissingProp)(e, r, y)), (0, qr.reportMissingProp)(e, y), t.else();
    }
    function h() {
      t.forOf("prop", n, (y) => {
        e.setParams({ missingProperty: y }), t.if((0, qr.noPropertyInData)(t, s, y, c.ownProperties), () => e.error());
      });
    }
    function E(y, w) {
      e.setParams({ missingProperty: y }), t.forOf(y, n, () => {
        t.assign(w, (0, qr.propertyInData)(t, s, y, c.ownProperties)), t.if((0, Zr.not)(w), () => {
          e.error(), t.break();
        });
      }, Zr.nil);
    }
  }
};
Fa.default = bm;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const xr = re, Sm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, xr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, xr._)`{limit: ${e}}`
}, Pm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Sm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? xr.operators.GT : xr.operators.LT;
    e.fail$data((0, xr._)`${r}.length ${s} ${n}`);
  }
};
za.default = Pm;
var Ua = {}, ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
const Yl = os;
Yl.code = 'require("ajv/dist/runtime/equal").default';
ln.default = Yl;
Object.defineProperty(Ua, "__esModule", { value: !0 });
const ks = Ee, Oe = re, Nm = L, Rm = ln, Om = {
  message: ({ params: { i: e, j: t } }) => (0, Oe.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Oe._)`{i: ${e}, j: ${t}}`
}, Im = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Om,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: c } = e;
    if (!n && !s)
      return;
    const l = t.let("valid"), d = a.items ? (0, ks.getSchemaTypes)(a.items) : [];
    e.block$data(l, u, (0, Oe._)`${o} === false`), e.ok(l);
    function u() {
      const w = t.let("i", (0, Oe._)`${r}.length`), g = t.let("j");
      e.setParams({ i: w, j: g }), t.assign(l, !0), t.if((0, Oe._)`${w} > 1`, () => (h() ? E : y)(w, g));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, g) {
      const $ = t.name("item"), m = (0, ks.checkDataTypes)(d, $, c.opts.strictNumbers, ks.DataType.Wrong), _ = t.const("indices", (0, Oe._)`{}`);
      t.for((0, Oe._)`;${w}--;`, () => {
        t.let($, (0, Oe._)`${r}[${w}]`), t.if(m, (0, Oe._)`continue`), d.length > 1 && t.if((0, Oe._)`typeof ${$} == "string"`, (0, Oe._)`${$} += "_"`), t.if((0, Oe._)`typeof ${_}[${$}] == "number"`, () => {
          t.assign(g, (0, Oe._)`${_}[${$}]`), e.error(), t.assign(l, !1).break();
        }).code((0, Oe._)`${_}[${$}] = ${w}`);
      });
    }
    function y(w, g) {
      const $ = (0, Nm.useFunc)(t, Rm.default), m = t.name("outer");
      t.label(m).for((0, Oe._)`;${w}--;`, () => t.for((0, Oe._)`${g} = ${w}; ${g}--;`, () => t.if((0, Oe._)`${$}(${r}[${w}], ${r}[${g}])`, () => {
        e.error(), t.assign(l, !1).break(m);
      })));
    }
  }
};
Ua.default = Im;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const ea = re, Tm = L, jm = ln, km = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ea._)`{allowedValue: ${e}}`
}, Am = {
  keyword: "const",
  $data: !0,
  error: km,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ea._)`!${(0, Tm.useFunc)(t, jm.default)}(${r}, ${s})`) : e.fail((0, ea._)`${a} !== ${r}`);
  }
};
qa.default = Am;
var Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const Xr = re, Cm = L, Dm = ln, Mm = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Xr._)`{allowedValues: ${e}}`
}, Vm = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Mm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= o.opts.loopEnum;
    let l;
    const d = () => l ?? (l = (0, Cm.useFunc)(t, Dm.default));
    let u;
    if (c || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const y = t.const("vSchema", a);
      u = (0, Xr.or)(...s.map((w, g) => E(y, g)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (y) => t.if((0, Xr._)`${d()}(${r}, ${y})`, () => t.assign(u, !0).break()));
    }
    function E(y, w) {
      const g = s[w];
      return typeof g == "object" && g !== null ? (0, Xr._)`${d()}(${r}, ${y}[${w}])` : (0, Xr._)`${r} === ${g}`;
    }
  }
};
Ka.default = Vm;
Object.defineProperty(ka, "__esModule", { value: !0 });
const Lm = Aa, Fm = Ca, zm = Da, Um = Va, qm = La, Km = Fa, Gm = za, Hm = Ua, Bm = qa, Xm = Ka, Jm = [
  // number
  Lm.default,
  Fm.default,
  // string
  zm.default,
  Um.default,
  // object
  qm.default,
  Km.default,
  // array
  Gm.default,
  Hm.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Bm.default,
  Xm.default
];
ka.default = Jm;
var Ga = {}, Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.validateAdditionalItems = void 0;
const Qt = re, ta = L, Wm = {
  message: ({ params: { len: e } }) => (0, Qt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Qt._)`{limit: ${e}}`
}, Ym = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Wm,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, ta.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Ql(e, n);
  }
};
function Ql(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const c = r.const("len", (0, Qt._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, Qt._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, ta.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, Qt._)`${c} <= ${t.length}`);
    r.if((0, Qt.not)(d), () => l(d)), e.ok(d);
  }
  function l(d) {
    r.forRange("i", t.length, c, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: ta.Type.Num }, d), o.allErrors || r.if((0, Qt.not)(d), () => r.break());
    });
  }
}
Tr.validateAdditionalItems = Ql;
Tr.default = Ym;
var Ha = {}, jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.validateTuple = void 0;
const Ii = re, Un = L, Qm = ce, Zm = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Zl(e, "additionalItems", t);
    r.items = !0, !(0, Un.alwaysValidSchema)(r, t) && e.ok((0, Qm.validateArray)(e));
  }
};
function Zl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: c } = e;
  u(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = Un.mergeEvaluated.items(n, r.length, c.items));
  const l = n.name("valid"), d = n.const("len", (0, Ii._)`${a}.length`);
  r.forEach((h, E) => {
    (0, Un.alwaysValidSchema)(c, h) || (n.if((0, Ii._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, l)), e.ok(l));
  });
  function u(h) {
    const { opts: E, errSchemaPath: y } = c, w = r.length, g = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !g) {
      const $ = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${y}"`;
      (0, Un.checkStrictMode)(c, $, E.strictTuples);
    }
  }
}
jr.validateTuple = Zl;
jr.default = Zm;
Object.defineProperty(Ha, "__esModule", { value: !0 });
const xm = jr, ep = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, xm.validateTuple)(e, "items")
};
Ha.default = ep;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const Ti = re, tp = L, rp = ce, np = Tr, sp = {
  message: ({ params: { len: e } }) => (0, Ti.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Ti._)`{limit: ${e}}`
}, ap = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: sp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, tp.alwaysValidSchema)(n, t) && (s ? (0, np.validateAdditionalItems)(e, s) : e.ok((0, rp.validateArray)(e)));
  }
};
Ba.default = ap;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const Ye = re, $n = L, op = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ye.str)`must contain at least ${e} valid item(s)` : (0, Ye.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ye._)`{minContains: ${e}}` : (0, Ye._)`{minContains: ${e}, maxContains: ${t}}`
}, ip = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: op,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, c;
    const { minContains: l, maxContains: d } = n;
    a.opts.next ? (o = l === void 0 ? 1 : l, c = d) : o = 1;
    const u = t.const("len", (0, Ye._)`${s}.length`);
    if (e.setParams({ min: o, max: c }), c === void 0 && o === 0) {
      (0, $n.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && o > c) {
      (0, $n.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, $n.alwaysValidSchema)(a, r)) {
      let g = (0, Ye._)`${u} >= ${o}`;
      c !== void 0 && (g = (0, Ye._)`${g} && ${u} <= ${c}`), e.pass(g);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    c === void 0 && o === 1 ? y(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), c !== void 0 && t.if((0, Ye._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const g = t.name("_valid"), $ = t.let("count", 0);
      y(g, () => t.if(g, () => w($)));
    }
    function y(g, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: $n.Type.Num,
          compositeRule: !0
        }, g), $();
      });
    }
    function w(g) {
      t.code((0, Ye._)`${g}++`), c === void 0 ? t.if((0, Ye._)`${g} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Ye._)`${g} > ${c}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Ye._)`${g} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
Xa.default = ip;
var us = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = re, r = L, n = ce;
  e.error = {
    message: ({ params: { property: l, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${l} is present`;
    },
    params: ({ params: { property: l, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${l},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(l) {
      const [d, u] = a(l);
      o(l, d), c(l, u);
    }
  };
  function a({ schema: l }) {
    const d = {}, u = {};
    for (const h in l) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(l[h]) ? d : u;
      E[h] = l[h];
    }
    return [d, u];
  }
  function o(l, d = l.schema) {
    const { gen: u, data: h, it: E } = l;
    if (Object.keys(d).length === 0)
      return;
    const y = u.let("missing");
    for (const w in d) {
      const g = d[w];
      if (g.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, w, E.opts.ownProperties);
      l.setParams({
        property: w,
        depsCount: g.length,
        deps: g.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of g)
          (0, n.checkReportMissingProp)(l, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(l, g, y)})`), (0, n.reportMissingProp)(l, y), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function c(l, d = l.schema) {
    const { gen: u, data: h, keyword: E, it: y } = l, w = u.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)(y, d[g]) || (u.if(
        (0, n.propertyInData)(u, h, g, y.opts.ownProperties),
        () => {
          const $ = l.subschema({ keyword: E, schemaProp: g }, w);
          l.mergeValidEvaluated($, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), l.ok(w));
  }
  e.validateSchemaDeps = c, e.default = s;
})(us);
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const xl = re, cp = L, lp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, xl._)`{propertyName: ${e.propertyName}}`
}, up = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: lp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, cp.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, xl.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
Ja.default = up;
var ds = {};
Object.defineProperty(ds, "__esModule", { value: !0 });
const gn = ce, nt = re, dp = Je, _n = L, fp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, nt._)`{additionalProperty: ${e.additionalProperty}}`
}, hp = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: fp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: l } = o;
    if (o.props = !0, l.removeAdditional !== "all" && (0, _n.alwaysValidSchema)(o, r))
      return;
    const d = (0, gn.allSchemaProperties)(n.properties), u = (0, gn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, nt._)`${a} === ${dp.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? w($) : t.if(E($), () => w($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const _ = (0, _n.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, gn.isOwnProperty)(t, _, $);
      } else d.length ? m = (0, nt.or)(...d.map((_) => (0, nt._)`${$} === ${_}`)) : m = nt.nil;
      return u.length && (m = (0, nt.or)(m, ...u.map((_) => (0, nt._)`${(0, gn.usePattern)(e, _)}.test(${$})`))), (0, nt.not)(m);
    }
    function y($) {
      t.code((0, nt._)`delete ${s}[${$}]`);
    }
    function w($) {
      if (l.removeAdditional === "all" || l.removeAdditional && r === !1) {
        y($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, _n.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        l.removeAdditional === "failing" ? (g($, m, !1), t.if((0, nt.not)(m), () => {
          e.reset(), y($);
        })) : (g($, m), c || t.if((0, nt.not)(m), () => t.break()));
      }
    }
    function g($, m, _) {
      const S = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: _n.Type.Str
      };
      _ === !1 && Object.assign(S, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(S, m);
    }
  }
};
ds.default = hp;
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const mp = it, ji = ce, As = L, ki = ds, pp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && ki.default.code(new mp.KeywordCxt(a, ki.default, "additionalProperties"));
    const o = (0, ji.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = As.mergeEvaluated.props(t, (0, As.toHash)(o), a.props));
    const c = o.filter((h) => !(0, As.alwaysValidSchema)(a, r[h]));
    if (c.length === 0)
      return;
    const l = t.name("valid");
    for (const h of c)
      d(h) ? u(h) : (t.if((0, ji.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(l, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(l);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, l);
    }
  }
};
Wa.default = pp;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Ai = ce, vn = re, Ci = L, Di = L, yp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, c = (0, Ai.allSchemaProperties)(r), l = c.filter((g) => (0, Ci.alwaysValidSchema)(a, r[g]));
    if (c.length === 0 || l.length === c.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof vn.Name) && (a.props = (0, Di.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const g of c)
        d && y(g), a.allErrors ? w(g) : (t.var(u, !0), w(g), t.if(u));
    }
    function y(g) {
      for (const $ in d)
        new RegExp(g).test($) && (0, Ci.checkStrictMode)(a, `property ${$} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function w(g) {
      t.forIn("key", n, ($) => {
        t.if((0, vn._)`${(0, Ai.usePattern)(e, g)}.test(${$})`, () => {
          const m = l.includes(g);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: $,
            dataPropType: Di.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, vn._)`${h}[${$}]`, !0) : !m && !a.allErrors && t.if((0, vn.not)(u), () => t.break());
        });
      });
    }
  }
};
Ya.default = yp;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const $p = L, gp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, $p.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Qa.default = gp;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const _p = ce, vp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: _p.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Za.default = vp;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const qn = re, wp = L, Ep = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, qn._)`{passingSchemas: ${e.passing}}`
}, bp = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Ep,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), c = t.let("passing", null), l = t.name("_valid");
    e.setParams({ passing: c }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let E;
        (0, wp.alwaysValidSchema)(s, u) ? t.var(l, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, l), h > 0 && t.if((0, qn._)`${l} && ${o}`).assign(o, !1).assign(c, (0, qn._)`[${c}, ${h}]`).else(), t.if(l, () => {
          t.assign(o, !0), t.assign(c, h), E && e.mergeEvaluated(E, qn.Name);
        });
      });
    }
  }
};
xa.default = bp;
var eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const Sp = L, Pp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, Sp.alwaysValidSchema)(n, a))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
eo.default = Pp;
var to = {};
Object.defineProperty(to, "__esModule", { value: !0 });
const es = re, eu = L, Np = {
  message: ({ params: e }) => (0, es.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, es._)`{failingKeyword: ${e.ifClause}}`
}, Rp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: Np,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, eu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Mi(n, "then"), a = Mi(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), c = t.name("_valid");
    if (l(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(c, d("then", u), d("else", u));
    } else s ? t.if(c, d("then")) : t.if((0, es.not)(c), d("else"));
    e.pass(o, () => e.error(!0));
    function l() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const E = e.subschema({ keyword: u }, c);
        t.assign(o, c), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, es._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Mi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, eu.alwaysValidSchema)(e, r);
}
to.default = Rp;
var ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
const Op = L, Ip = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Op.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
ro.default = Ip;
Object.defineProperty(Ga, "__esModule", { value: !0 });
const Tp = Tr, jp = Ha, kp = jr, Ap = Ba, Cp = Xa, Dp = us, Mp = Ja, Vp = ds, Lp = Wa, Fp = Ya, zp = Qa, Up = Za, qp = xa, Kp = eo, Gp = to, Hp = ro;
function Bp(e = !1) {
  const t = [
    // any
    zp.default,
    Up.default,
    qp.default,
    Kp.default,
    Gp.default,
    Hp.default,
    // object
    Mp.default,
    Vp.default,
    Dp.default,
    Lp.default,
    Fp.default
  ];
  return e ? t.push(jp.default, Ap.default) : t.push(Tp.default, kp.default), t.push(Cp.default), t;
}
Ga.default = Bp;
var no = {}, kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.dynamicAnchor = void 0;
const Cs = re, Xp = Je, Vi = ze, Jp = Rt, Wp = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => tu(e, e.schema)
};
function tu(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Cs._)`${Xp.default.dynamicAnchors}${(0, Cs.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : Yp(e);
  r.if((0, Cs._)`!${s}`, () => r.assign(s, a));
}
kr.dynamicAnchor = tu;
function Yp(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: c } = t.root, { schemaId: l } = n.opts, d = new Vi.SchemaEnv({ schema: r, schemaId: l, root: s, baseId: a, localRefs: o, meta: c });
  return Vi.compileSchema.call(n, d), (0, Jp.getValidate)(e, d);
}
kr.default = Wp;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.dynamicRef = void 0;
const Li = re, Qp = Je, Fi = Rt, Zp = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => ru(e, e.schema)
};
function ru(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const l = r.let("valid", !1);
    o(l), e.ok(l);
  }
  function o(l) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const d = r.let("_v", (0, Li._)`${Qp.default.dynamicAnchors}${(0, Li.getProperty)(a)}`);
      r.if(d, c(d, l), c(s.validateName, l));
    } else
      c(s.validateName, l)();
  }
  function c(l, d) {
    return d ? () => r.block(() => {
      (0, Fi.callRef)(e, l), r.let(d, !0);
    }) : () => (0, Fi.callRef)(e, l);
  }
}
Ar.dynamicRef = ru;
Ar.default = Zp;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const xp = kr, ey = L, ty = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, xp.dynamicAnchor)(e, "") : (0, ey.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
so.default = ty;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const ry = Ar, ny = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, ry.dynamicRef)(e, e.schema)
};
ao.default = ny;
Object.defineProperty(no, "__esModule", { value: !0 });
const sy = kr, ay = Ar, oy = so, iy = ao, cy = [sy.default, ay.default, oy.default, iy.default];
no.default = cy;
var oo = {}, io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const zi = us, ly = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: zi.error,
  code: (e) => (0, zi.validatePropertyDeps)(e)
};
io.default = ly;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
const uy = us, dy = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, uy.validateSchemaDeps)(e)
};
co.default = dy;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const fy = L, hy = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, fy.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
lo.default = hy;
Object.defineProperty(oo, "__esModule", { value: !0 });
const my = io, py = co, yy = lo, $y = [my.default, py.default, yy.default];
oo.default = $y;
var uo = {}, fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
const Ct = re, Ui = L, gy = Je, _y = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Ct._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, vy = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: _y,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: c } = a;
    c instanceof Ct.Name ? t.if((0, Ct._)`${c} !== true`, () => t.forIn("key", n, (h) => t.if(d(c, h), () => l(h)))) : c !== !0 && t.forIn("key", n, (h) => c === void 0 ? l(h) : t.if(u(c, h), () => l(h))), a.props = !0, e.ok((0, Ct._)`${s} === ${gy.default.errors}`);
    function l(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, Ui.alwaysValidSchema)(a, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Ui.Type.Str
        }, E), o || t.if((0, Ct.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, Ct._)`!${h} || !${h}[${E}]`;
    }
    function u(h, E) {
      const y = [];
      for (const w in h)
        h[w] === !0 && y.push((0, Ct._)`${E} !== ${w}`);
      return (0, Ct.and)(...y);
    }
  }
};
fo.default = vy;
var ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
const Zt = re, qi = L, wy = {
  message: ({ params: { len: e } }) => (0, Zt.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Zt._)`{limit: ${e}}`
}, Ey = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: wy,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, Zt._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, Zt._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, qi.alwaysValidSchema)(s, r)) {
      const l = t.var("valid", (0, Zt._)`${o} <= ${a}`);
      t.if((0, Zt.not)(l), () => c(l, a)), e.ok(l);
    }
    s.items = !0;
    function c(l, d) {
      t.forRange("i", d, o, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: qi.Type.Num }, l), s.allErrors || t.if((0, Zt.not)(l), () => t.break());
      });
    }
  }
};
ho.default = Ey;
Object.defineProperty(uo, "__esModule", { value: !0 });
const by = fo, Sy = ho, Py = [by.default, Sy.default];
uo.default = Py;
var mo = {}, po = {};
Object.defineProperty(po, "__esModule", { value: !0 });
const ve = re, Ny = {
  message: ({ schemaCode: e }) => (0, ve.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ve._)`{format: ${e}}`
}, Ry = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Ny,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: c } = e, { opts: l, errSchemaPath: d, schemaEnv: u, self: h } = c;
    if (!l.validateFormats)
      return;
    s ? E() : y();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: l.code.formats
      }), g = r.const("fDef", (0, ve._)`${w}[${o}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, ve._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign($, (0, ve._)`${g}.type || "string"`).assign(m, (0, ve._)`${g}.validate`), () => r.assign($, (0, ve._)`"string"`).assign(m, g)), e.fail$data((0, ve.or)(_(), S()));
      function _() {
        return l.strictSchema === !1 ? ve.nil : (0, ve._)`${o} && !${m}`;
      }
      function S() {
        const O = u.$async ? (0, ve._)`(${g}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, ve._)`${m}(${n})`, T = (0, ve._)`(typeof ${m} == "function" ? ${O} : ${m}.test(${n}))`;
        return (0, ve._)`${m} && ${m} !== true && ${$} === ${t} && !${T}`;
      }
    }
    function y() {
      const w = h.formats[a];
      if (!w) {
        _();
        return;
      }
      if (w === !0)
        return;
      const [g, $, m] = S(w);
      g === t && e.pass(O());
      function _() {
        if (l.strictSchema === !1) {
          h.logger.warn(T());
          return;
        }
        throw new Error(T());
        function T() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function S(T) {
        const V = T instanceof RegExp ? (0, ve.regexpCode)(T) : l.code.formats ? (0, ve._)`${l.code.formats}${(0, ve.getProperty)(a)}` : void 0, K = r.scopeValue("formats", { key: a, ref: T, code: V });
        return typeof T == "object" && !(T instanceof RegExp) ? [T.type || "string", T.validate, (0, ve._)`${K}.validate`] : ["string", T, K];
      }
      function O() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, ve._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, ve._)`${m}(${n})` : (0, ve._)`${m}.test(${n})`;
      }
    }
  }
};
po.default = Ry;
Object.defineProperty(mo, "__esModule", { value: !0 });
const Oy = po, Iy = [Oy.default];
mo.default = Iy;
var Rr = {};
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.contentVocabulary = Rr.metadataVocabulary = void 0;
Rr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Rr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Ia, "__esModule", { value: !0 });
const Ty = Ta, jy = ka, ky = Ga, Ay = no, Cy = oo, Dy = uo, My = mo, Ki = Rr, Vy = [
  Ay.default,
  Ty.default,
  jy.default,
  (0, ky.default)(!0),
  My.default,
  Ki.metadataVocabulary,
  Ki.contentVocabulary,
  Cy.default,
  Dy.default
];
Ia.default = Vy;
var yo = {}, fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
fs.DiscrError = void 0;
var Gi;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Gi || (fs.DiscrError = Gi = {}));
Object.defineProperty(yo, "__esModule", { value: !0 });
const fr = re, ra = fs, Hi = ze, Ly = Ir, Fy = L, zy = {
  message: ({ params: { discrError: e, tagName: t } }) => e === ra.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, fr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Uy = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: zy,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const l = t.let("valid", !1), d = t.const("tag", (0, fr._)`${r}${(0, fr.getProperty)(c)}`);
    t.if((0, fr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: ra.DiscrError.Tag, tag: d, tagName: c })), e.ok(l);
    function u() {
      const y = E();
      t.if(!1);
      for (const w in y)
        t.elseIf((0, fr._)`${d} === ${w}`), t.assign(l, h(y[w]));
      t.else(), e.error(!1, { discrError: ra.DiscrError.Mapping, tag: d, tagName: c }), t.endIf();
    }
    function h(y) {
      const w = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: y }, w);
      return e.mergeEvaluated(g, fr.Name), w;
    }
    function E() {
      var y;
      const w = {}, g = m(s);
      let $ = !0;
      for (let O = 0; O < o.length; O++) {
        let T = o[O];
        if (T != null && T.$ref && !(0, Fy.schemaHasRulesButRef)(T, a.self.RULES)) {
          const K = T.$ref;
          if (T = Hi.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, K), T instanceof Hi.SchemaEnv && (T = T.schema), T === void 0)
            throw new Ly.default(a.opts.uriResolver, a.baseId, K);
        }
        const V = (y = T == null ? void 0 : T.properties) === null || y === void 0 ? void 0 : y[c];
        if (typeof V != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        $ = $ && (g || m(T)), _(V, O);
      }
      if (!$)
        throw new Error(`discriminator: "${c}" must be required`);
      return w;
      function m({ required: O }) {
        return Array.isArray(O) && O.includes(c);
      }
      function _(O, T) {
        if (O.const)
          S(O.const, T);
        else if (O.enum)
          for (const V of O.enum)
            S(V, T);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function S(O, T) {
        if (typeof O != "string" || O in w)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        w[O] = T;
      }
    }
  }
};
yo.default = Uy;
var $o = {};
const qy = "https://json-schema.org/draft/2020-12/schema", Ky = "https://json-schema.org/draft/2020-12/schema", Gy = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Hy = "meta", By = "Core and Validation specifications meta-schema", Xy = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], Jy = [
  "object",
  "boolean"
], Wy = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", Yy = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, Qy = {
  $schema: qy,
  $id: Ky,
  $vocabulary: Gy,
  $dynamicAnchor: Hy,
  title: By,
  allOf: Xy,
  type: Jy,
  $comment: Wy,
  properties: Yy
}, Zy = "https://json-schema.org/draft/2020-12/schema", xy = "https://json-schema.org/draft/2020-12/meta/applicator", e$ = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, t$ = "meta", r$ = "Applicator vocabulary meta-schema", n$ = [
  "object",
  "boolean"
], s$ = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, a$ = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, o$ = {
  $schema: Zy,
  $id: xy,
  $vocabulary: e$,
  $dynamicAnchor: t$,
  title: r$,
  type: n$,
  properties: s$,
  $defs: a$
}, i$ = "https://json-schema.org/draft/2020-12/schema", c$ = "https://json-schema.org/draft/2020-12/meta/unevaluated", l$ = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, u$ = "meta", d$ = "Unevaluated applicator vocabulary meta-schema", f$ = [
  "object",
  "boolean"
], h$ = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, m$ = {
  $schema: i$,
  $id: c$,
  $vocabulary: l$,
  $dynamicAnchor: u$,
  title: d$,
  type: f$,
  properties: h$
}, p$ = "https://json-schema.org/draft/2020-12/schema", y$ = "https://json-schema.org/draft/2020-12/meta/content", $$ = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, g$ = "meta", _$ = "Content vocabulary meta-schema", v$ = [
  "object",
  "boolean"
], w$ = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, E$ = {
  $schema: p$,
  $id: y$,
  $vocabulary: $$,
  $dynamicAnchor: g$,
  title: _$,
  type: v$,
  properties: w$
}, b$ = "https://json-schema.org/draft/2020-12/schema", S$ = "https://json-schema.org/draft/2020-12/meta/core", P$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, N$ = "meta", R$ = "Core vocabulary meta-schema", O$ = [
  "object",
  "boolean"
], I$ = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, T$ = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, j$ = {
  $schema: b$,
  $id: S$,
  $vocabulary: P$,
  $dynamicAnchor: N$,
  title: R$,
  type: O$,
  properties: I$,
  $defs: T$
}, k$ = "https://json-schema.org/draft/2020-12/schema", A$ = "https://json-schema.org/draft/2020-12/meta/format-annotation", C$ = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, D$ = "meta", M$ = "Format vocabulary meta-schema for annotation results", V$ = [
  "object",
  "boolean"
], L$ = {
  format: {
    type: "string"
  }
}, F$ = {
  $schema: k$,
  $id: A$,
  $vocabulary: C$,
  $dynamicAnchor: D$,
  title: M$,
  type: V$,
  properties: L$
}, z$ = "https://json-schema.org/draft/2020-12/schema", U$ = "https://json-schema.org/draft/2020-12/meta/meta-data", q$ = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, K$ = "meta", G$ = "Meta-data vocabulary meta-schema", H$ = [
  "object",
  "boolean"
], B$ = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, X$ = {
  $schema: z$,
  $id: U$,
  $vocabulary: q$,
  $dynamicAnchor: K$,
  title: G$,
  type: H$,
  properties: B$
}, J$ = "https://json-schema.org/draft/2020-12/schema", W$ = "https://json-schema.org/draft/2020-12/meta/validation", Y$ = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, Q$ = "meta", Z$ = "Validation vocabulary meta-schema", x$ = [
  "object",
  "boolean"
], e0 = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, t0 = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, r0 = {
  $schema: J$,
  $id: W$,
  $vocabulary: Y$,
  $dynamicAnchor: Q$,
  title: Z$,
  type: x$,
  properties: e0,
  $defs: t0
};
Object.defineProperty($o, "__esModule", { value: !0 });
const n0 = Qy, s0 = o$, a0 = m$, o0 = E$, i0 = j$, c0 = F$, l0 = X$, u0 = r0, d0 = ["/properties"];
function f0(e) {
  return [
    n0,
    s0,
    a0,
    o0,
    i0,
    t(this, c0),
    l0,
    t(this, u0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, d0) : n;
  }
}
$o.default = f0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = sl, n = Ia, s = yo, a = $o, o = "https://json-schema.org/draft/2020-12/schema";
  class c extends r.default {
    constructor(y = {}) {
      super({
        ...y,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((y) => this.addVocabulary(y)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: y, meta: w } = this.opts;
      w && (a.default.call(this, y), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = c, e.exports = t = c, e.exports.Ajv2020 = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var l = it;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return l.KeywordCxt;
  } });
  var d = re;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var u = cn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Ir;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Ws, Ws.exports);
var h0 = Ws.exports, na = { exports: {} }, nu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(F, J) {
    return { validate: F, compare: J };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(l(!0), d),
    "date-time": t(E(!0), y),
    "iso-time": t(l(), u),
    "iso-date-time": t(E(), w),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: ue,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: S,
    // signed 32 bit integer
    int32: { type: "number", validate: V },
    // signed 64 bit integer
    int64: { type: "number", validate: K },
    // C-type float
    float: { type: "number", validate: ne },
    // C-type double
    double: { type: "number", validate: ne },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, y),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, w),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(F) {
    return F % 4 === 0 && (F % 100 !== 0 || F % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(F) {
    const J = n.exec(F);
    if (!J)
      return !1;
    const Q = +J[1], j = +J[2], D = +J[3];
    return j >= 1 && j <= 12 && D >= 1 && D <= (j === 2 && r(Q) ? 29 : s[j]);
  }
  function o(F, J) {
    if (F && J)
      return F > J ? 1 : F < J ? -1 : 0;
  }
  const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function l(F) {
    return function(Q) {
      const j = c.exec(Q);
      if (!j)
        return !1;
      const D = +j[1], G = +j[2], z = +j[3], W = j[4], q = j[5] === "-" ? -1 : 1, N = +(j[6] || 0), p = +(j[7] || 0);
      if (N > 23 || p > 59 || F && !W)
        return !1;
      if (D <= 23 && G <= 59 && z < 60)
        return !0;
      const P = G - p * q, v = D - N * q - (P < 0 ? 1 : 0);
      return (v === 23 || v === -1) && (P === 59 || P === -1) && z < 61;
    };
  }
  function d(F, J) {
    if (!(F && J))
      return;
    const Q = (/* @__PURE__ */ new Date("2020-01-01T" + F)).valueOf(), j = (/* @__PURE__ */ new Date("2020-01-01T" + J)).valueOf();
    if (Q && j)
      return Q - j;
  }
  function u(F, J) {
    if (!(F && J))
      return;
    const Q = c.exec(F), j = c.exec(J);
    if (Q && j)
      return F = Q[1] + Q[2] + Q[3], J = j[1] + j[2] + j[3], F > J ? 1 : F < J ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(F) {
    const J = l(F);
    return function(j) {
      const D = j.split(h);
      return D.length === 2 && a(D[0]) && J(D[1]);
    };
  }
  function y(F, J) {
    if (!(F && J))
      return;
    const Q = new Date(F).valueOf(), j = new Date(J).valueOf();
    if (Q && j)
      return Q - j;
  }
  function w(F, J) {
    if (!(F && J))
      return;
    const [Q, j] = F.split(h), [D, G] = J.split(h), z = o(Q, D);
    if (z !== void 0)
      return z || d(j, G);
  }
  const g = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(F) {
    return g.test(F) && $.test(F);
  }
  const _ = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function S(F) {
    return _.lastIndex = 0, _.test(F);
  }
  const O = -2147483648, T = 2 ** 31 - 1;
  function V(F) {
    return Number.isInteger(F) && F <= T && F >= O;
  }
  function K(F) {
    return Number.isInteger(F);
  }
  function ne() {
    return !0;
  }
  const le = /[^\\]\\Z/;
  function ue(F) {
    if (le.test(F))
      return !1;
    try {
      return new RegExp(F), !0;
    } catch {
      return !1;
    }
  }
})(nu);
var su = {}, sa = { exports: {} }, au = {}, vt = {}, Xt = {}, un = {}, ie = {}, an = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(_) {
      if (super(), !e.IDENTIFIER.test(_))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = _;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(_) {
      super(), this._items = typeof _ == "string" ? [_] : _;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const _ = this._items[0];
      return _ === "" || _ === '""';
    }
    get str() {
      var _;
      return (_ = this._str) !== null && _ !== void 0 ? _ : this._str = this._items.reduce((S, O) => `${S}${O}`, "");
    }
    get names() {
      var _;
      return (_ = this._names) !== null && _ !== void 0 ? _ : this._names = this._items.reduce((S, O) => (O instanceof r && (S[O.str] = (S[O.str] || 0) + 1), S), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ..._) {
    const S = [m[0]];
    let O = 0;
    for (; O < _.length; )
      c(S, _[O]), S.push(m[++O]);
    return new n(S);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ..._) {
    const S = [y(m[0])];
    let O = 0;
    for (; O < _.length; )
      S.push(a), c(S, _[O]), S.push(a, y(m[++O]));
    return l(S), new n(S);
  }
  e.str = o;
  function c(m, _) {
    _ instanceof n ? m.push(..._._items) : _ instanceof r ? m.push(_) : m.push(h(_));
  }
  e.addCodeArg = c;
  function l(m) {
    let _ = 1;
    for (; _ < m.length - 1; ) {
      if (m[_] === a) {
        const S = d(m[_ - 1], m[_ + 1]);
        if (S !== void 0) {
          m.splice(_ - 1, 3, S);
          continue;
        }
        m[_++] = "+";
      }
      _++;
    }
  }
  function d(m, _) {
    if (_ === '""')
      return m;
    if (m === '""')
      return _;
    if (typeof m == "string")
      return _ instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof _ != "string" ? `${m.slice(0, -1)}${_}"` : _[0] === '"' ? m.slice(0, -1) + _.slice(1) : void 0;
    if (typeof _ == "string" && _[0] === '"' && !(m instanceof r))
      return `"${m}${_.slice(1)}`;
  }
  function u(m, _) {
    return _.emptyStr() ? m : m.emptyStr() ? _ : o`${m}${_}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : y(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(y(m));
  }
  e.stringify = E;
  function y(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = y;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function g(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = g;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(an);
var aa = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = an;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(l) {
    l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class c extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const E = this.toName(d), { prefix: y } = E, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let g = this._values[y];
      if (g) {
        const _ = g.get(w);
        if (_)
          return _;
      } else
        g = this._values[y] = /* @__PURE__ */ new Map();
      g.set(w, E);
      const $ = this._scope[y] || (this._scope[y] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: y, itemIndex: m }), E;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (E) => {
        if (E.value === void 0)
          throw new Error(`CodeGen: name "${E}" has no value`);
        return E.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, E) {
      let y = t.nil;
      for (const w in d) {
        const g = d[w];
        if (!g)
          continue;
        const $ = h[w] = h[w] || /* @__PURE__ */ new Map();
        g.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let _ = u(m);
          if (_) {
            const S = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            y = (0, t._)`${y}${S} ${m} = ${_};${this.opts._n}`;
          } else if (_ = E == null ? void 0 : E(m))
            y = (0, t._)`${y}${_}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return y;
    }
  }
  e.ValueScope = c;
})(aa);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = an, r = aa;
  var n = an;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = aa;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, b) {
      super(), this.varKind = i, this.name = f, this.rhs = b;
    }
    render({ es5: i, _n: f }) {
      const b = i ? r.varKinds.var : this.varKind, k = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${k};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = j(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class c extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = j(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Q(i, this.rhs);
    }
  }
  class l extends c {
    constructor(i, f, b, k) {
      super(i, b, k), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class E extends a {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = j(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class y extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, b) => f + b.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const b = i[f].optimizeNodes();
        Array.isArray(b) ? i.splice(f, 1, ...b) : b ? i[f] = b : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: b } = this;
      let k = b.length;
      for (; k--; ) {
        const A = b[k];
        A.optimizeNames(i, f) || (D(i, A.names), b.splice(k, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => J(i, f.names), {});
    }
  }
  class w extends y {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class g extends y {
  }
  class $ extends w {
  }
  $.kind = "else";
  class m extends w {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const b = f.optimizeNodes();
        f = this.else = Array.isArray(b) ? new $(b) : b;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(G(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = j(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return Q(i, this.condition), this.else && J(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class _ extends w {
  }
  _.kind = "for";
  class S extends _ {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = j(this.iteration, i, f), this;
    }
    get names() {
      return J(super.names, this.iteration.names);
    }
  }
  class O extends _ {
    constructor(i, f, b, k) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = k;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: k, to: A } = this;
      return `for(${f} ${b}=${k}; ${b}<${A}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = Q(super.names, this.from);
      return Q(i, this.to);
    }
  }
  class T extends _ {
    constructor(i, f, b, k) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = k;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = j(this.iterable, i, f), this;
    }
    get names() {
      return J(super.names, this.iterable.names);
    }
  }
  class V extends w {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  V.kind = "func";
  class K extends y {
    render(i) {
      return "return " + super.render(i);
    }
  }
  K.kind = "return";
  class ne extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, k;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (k = this.finally) === null || k === void 0 || k.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && J(i, this.catch.names), this.finally && J(i, this.finally.names), i;
    }
  }
  class le extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  le.kind = "catch";
  class ue extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  ue.kind = "finally";
  class F {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new g()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const b = this._extScope.value(i, f);
      return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, b, k) {
      const A = this._scope.toName(f);
      return b !== void 0 && k && (this._constants[A.str] = b), this._leafNode(new o(i, A, b)), A;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, b) {
      return this._def(r.varKinds.const, i, f, b);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, b) {
      return this._def(r.varKinds.let, i, f, b);
    }
    // `var` declaration with optional assignment
    var(i, f, b) {
      return this._def(r.varKinds.var, i, f, b);
    }
    // assignment code
    assign(i, f, b) {
      return this._leafNode(new c(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new l(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, k] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== k || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, k));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, b) {
      if (this._blockNode(new m(i)), f && b)
        this.code(f).else().code(b).endIf();
      else if (f)
        this.code(f).endIf();
      else if (b)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new $());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, $);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new S(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, k, A = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const B = this._scope.toName(i);
      return this._for(new O(A, B, f, b), () => k(B));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, k = r.varKinds.const) {
      const A = this._scope.toName(i);
      if (this.opts.es5) {
        const B = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${B}.length`, (H) => {
          this.var(A, (0, t._)`${B}[${H}]`), b(A);
        });
      }
      return this._for(new T("of", k, A, f), () => b(A));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, k = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const A = this._scope.toName(i);
      return this._for(new T("in", k, A, f), () => b(A));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(_);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new K();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(K);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const k = new ne();
      if (this._blockNode(k), this.code(i), f) {
        const A = this.name("e");
        this._currNode = k.catch = new le(A), f(A);
      }
      return b && (this._currNode = k.finally = new ue(), this.code(b)), this._endBlockNode(le, ue);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const b = this._nodes.length - f;
      if (b < 0 || i !== void 0 && b !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, b, k) {
      return this._blockNode(new V(i, f, b)), k && this.code(k).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(V);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const b = this._currNode;
      if (b instanceof i || f && b instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = F;
  function J(v, i) {
    for (const f in i)
      v[f] = (v[f] || 0) + (i[f] || 0);
    return v;
  }
  function Q(v, i) {
    return i instanceof t._CodeOrName ? J(v, i.names) : v;
  }
  function j(v, i, f) {
    if (v instanceof t.Name)
      return b(v);
    if (!k(v))
      return v;
    return new t._Code(v._items.reduce((A, B) => (B instanceof t.Name && (B = b(B)), B instanceof t._Code ? A.push(...B._items) : A.push(B), A), []));
    function b(A) {
      const B = f[A.str];
      return B === void 0 || i[A.str] !== 1 ? A : (delete i[A.str], B);
    }
    function k(A) {
      return A instanceof t._Code && A._items.some((B) => B instanceof t.Name && i[B.str] === 1 && f[B.str] !== void 0);
    }
  }
  function D(v, i) {
    for (const f in i)
      v[f] = (v[f] || 0) - (i[f] || 0);
  }
  function G(v) {
    return typeof v == "boolean" || typeof v == "number" || v === null ? !v : (0, t._)`!${P(v)}`;
  }
  e.not = G;
  const z = p(e.operators.AND);
  function W(...v) {
    return v.reduce(z);
  }
  e.and = W;
  const q = p(e.operators.OR);
  function N(...v) {
    return v.reduce(q);
  }
  e.or = N;
  function p(v) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${P(i)} ${v} ${P(f)}`;
  }
  function P(v) {
    return v instanceof t.Name ? v : (0, t._)`(${v})`;
  }
})(ie);
var U = {};
Object.defineProperty(U, "__esModule", { value: !0 });
U.checkStrictMode = U.getErrorPath = U.Type = U.useFunc = U.setEvaluated = U.evaluatedPropsToName = U.mergeEvaluated = U.eachItem = U.unescapeJsonPointer = U.escapeJsonPointer = U.escapeFragment = U.unescapeFragment = U.schemaRefOrVal = U.schemaHasRulesButRef = U.schemaHasRules = U.checkUnknownRules = U.alwaysValidSchema = U.toHash = void 0;
const he = ie, m0 = an;
function p0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
U.toHash = p0;
function y0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (ou(e, t), !iu(t, e.self.RULES.all));
}
U.alwaysValidSchema = y0;
function ou(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || uu(e, `unknown keyword: "${a}"`);
}
U.checkUnknownRules = ou;
function iu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
U.schemaHasRules = iu;
function $0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
U.schemaHasRulesButRef = $0;
function g0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, he._)`${r}`;
  }
  return (0, he._)`${e}${t}${(0, he.getProperty)(n)}`;
}
U.schemaRefOrVal = g0;
function _0(e) {
  return cu(decodeURIComponent(e));
}
U.unescapeFragment = _0;
function v0(e) {
  return encodeURIComponent(go(e));
}
U.escapeFragment = v0;
function go(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
U.escapeJsonPointer = go;
function cu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
U.unescapeJsonPointer = cu;
function w0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
U.eachItem = w0;
function Bi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, c) => {
    const l = o === void 0 ? a : o instanceof he.Name ? (a instanceof he.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof he.Name ? (t(s, o, a), a) : r(a, o);
    return c === he.Name && !(l instanceof he.Name) ? n(s, l) : l;
  };
}
U.mergeEvaluated = {
  props: Bi({
    mergeNames: (e, t, r) => e.if((0, he._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, he._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, he._)`${r} || {}`).code((0, he._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, he._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, he._)`${r} || {}`), _o(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: lu
  }),
  items: Bi({
    mergeNames: (e, t, r) => e.if((0, he._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, he._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, he._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, he._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function lu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, he._)`{}`);
  return t !== void 0 && _o(e, r, t), r;
}
U.evaluatedPropsToName = lu;
function _o(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, he._)`${t}${(0, he.getProperty)(n)}`, !0));
}
U.setEvaluated = _o;
const Xi = {};
function E0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Xi[t.code] || (Xi[t.code] = new m0._Code(t.code))
  });
}
U.useFunc = E0;
var oa;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(oa || (U.Type = oa = {}));
function b0(e, t, r) {
  if (e instanceof he.Name) {
    const n = t === oa.Num;
    return r ? n ? (0, he._)`"[" + ${e} + "]"` : (0, he._)`"['" + ${e} + "']"` : n ? (0, he._)`"/" + ${e}` : (0, he._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, he.getProperty)(e).toString() : "/" + go(e);
}
U.getErrorPath = b0;
function uu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
U.checkStrictMode = uu;
var wn = {}, Ji;
function qt() {
  if (Ji) return wn;
  Ji = 1, Object.defineProperty(wn, "__esModule", { value: !0 });
  const e = ie, t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return wn.default = t, wn;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ie, r = U, n = qt();
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, _, S) {
    const { it: O } = $, { gen: T, compositeRule: V, allErrors: K } = O, ne = h($, m, _);
    S ?? (V || K) ? l(T, ne) : d(O, (0, t._)`[${ne}]`);
  }
  e.reportError = s;
  function a($, m = e.keywordError, _) {
    const { it: S } = $, { gen: O, compositeRule: T, allErrors: V } = S, K = h($, m, _);
    l(O, K), T || V || d(S, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function c({ gen: $, keyword: m, schemaValue: _, data: S, errsCount: O, it: T }) {
    if (O === void 0)
      throw new Error("ajv implementation error");
    const V = $.name("err");
    $.forRange("i", O, n.default.errors, (K) => {
      $.const(V, (0, t._)`${n.default.vErrors}[${K}]`), $.if((0, t._)`${V}.instancePath === undefined`, () => $.assign((0, t._)`${V}.instancePath`, (0, t.strConcat)(n.default.instancePath, T.errorPath))), $.assign((0, t._)`${V}.schemaPath`, (0, t.str)`${T.errSchemaPath}/${m}`), T.opts.verbose && ($.assign((0, t._)`${V}.schema`, _), $.assign((0, t._)`${V}.data`, S));
    });
  }
  e.extendErrors = c;
  function l($, m) {
    const _ = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${_}]`), (0, t._)`${n.default.vErrors}.push(${_})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: _, validateName: S, schemaEnv: O } = $;
    O.$async ? _.throw((0, t._)`new ${$.ValidationError}(${m})`) : (_.assign((0, t._)`${S}.errors`, m), _.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h($, m, _) {
    const { createErrors: S } = $.it;
    return S === !1 ? (0, t._)`{}` : E($, m, _);
  }
  function E($, m, _ = {}) {
    const { gen: S, it: O } = $, T = [
      y(O, _),
      w($, _)
    ];
    return g($, m, T), S.object(...T);
  }
  function y({ errorPath: $ }, { instancePath: m }) {
    const _ = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, _)];
  }
  function w({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: _, parentSchema: S }) {
    let O = S ? m : (0, t.str)`${m}/${$}`;
    return _ && (O = (0, t.str)`${O}${(0, r.getErrorPath)(_, r.Type.Str)}`), [u.schemaPath, O];
  }
  function g($, { params: m, message: _ }, S) {
    const { keyword: O, data: T, schemaValue: V, it: K } = $, { opts: ne, propertyName: le, topSchemaRef: ue, schemaPath: F } = K;
    S.push([u.keyword, O], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), ne.messages && S.push([u.message, typeof _ == "function" ? _($) : _]), ne.verbose && S.push([u.schema, V], [u.parentSchema, (0, t._)`${ue}${F}`], [n.default.data, T]), le && S.push([u.propertyName, le]);
  }
})(un);
var Wi;
function S0() {
  if (Wi) return Xt;
  Wi = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.boolOrEmptySchema = Xt.topBoolOrEmptySchema = void 0;
  const e = un, t = ie, r = qt(), n = {
    message: "boolean schema is false"
  };
  function s(c) {
    const { gen: l, schema: d, validateName: u } = c;
    d === !1 ? o(c, !1) : typeof d == "object" && d.$async === !0 ? l.return(r.default.data) : (l.assign((0, t._)`${u}.errors`, null), l.return(!0));
  }
  Xt.topBoolOrEmptySchema = s;
  function a(c, l) {
    const { gen: d, schema: u } = c;
    u === !1 ? (d.var(l, !1), o(c)) : d.var(l, !0);
  }
  Xt.boolOrEmptySchema = a;
  function o(c, l) {
    const { gen: d, data: u } = c, h = {
      gen: d,
      keyword: "false schema",
      data: u,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(h, n, void 0, l);
  }
  return Xt;
}
var be = {}, or = {};
Object.defineProperty(or, "__esModule", { value: !0 });
or.getRules = or.isJSONType = void 0;
const P0 = ["string", "number", "integer", "boolean", "null", "object", "array"], N0 = new Set(P0);
function R0(e) {
  return typeof e == "string" && N0.has(e);
}
or.isJSONType = R0;
function O0() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
or.getRules = O0;
var wt = {}, Yi;
function du() {
  if (Yi) return wt;
  Yi = 1, Object.defineProperty(wt, "__esModule", { value: !0 }), wt.shouldUseRule = wt.shouldUseGroup = wt.schemaHasRulesForType = void 0;
  function e({ schema: n, self: s }, a) {
    const o = s.RULES.types[a];
    return o && o !== !0 && t(n, o);
  }
  wt.schemaHasRulesForType = e;
  function t(n, s) {
    return s.rules.some((a) => r(n, a));
  }
  wt.shouldUseGroup = t;
  function r(n, s) {
    var a;
    return n[s.keyword] !== void 0 || ((a = s.definition.implements) === null || a === void 0 ? void 0 : a.some((o) => n[o] !== void 0));
  }
  return wt.shouldUseRule = r, wt;
}
Object.defineProperty(be, "__esModule", { value: !0 });
be.reportTypeError = be.checkDataTypes = be.checkDataType = be.coerceAndCheckDataType = be.getJSONTypes = be.getSchemaTypes = be.DataType = void 0;
const I0 = or, T0 = du(), j0 = un, ae = ie, fu = U;
var wr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(wr || (be.DataType = wr = {}));
function k0(e) {
  const t = hu(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
be.getSchemaTypes = k0;
function hu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(I0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
be.getJSONTypes = hu;
function A0(e, t) {
  const { gen: r, data: n, opts: s } = e, a = C0(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, T0.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const c = vo(t, n, s.strictNumbers, wr.Wrong);
    r.if(c, () => {
      a.length ? D0(e, t, a) : wo(e);
    });
  }
  return o;
}
be.coerceAndCheckDataType = A0;
const mu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function C0(e, t) {
  return t ? e.filter((r) => mu.has(r) || t === "array" && r === "array") : [];
}
function D0(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, ae._)`typeof ${s}`), c = n.let("coerced", (0, ae._)`undefined`);
  a.coerceTypes === "array" && n.if((0, ae._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, ae._)`${s}[0]`).assign(o, (0, ae._)`typeof ${s}`).if(vo(t, s, a.strictNumbers), () => n.assign(c, s))), n.if((0, ae._)`${c} !== undefined`);
  for (const d of r)
    (mu.has(d) || d === "array" && a.coerceTypes === "array") && l(d);
  n.else(), wo(e), n.endIf(), n.if((0, ae._)`${c} !== undefined`, () => {
    n.assign(s, c), M0(e, c);
  });
  function l(d) {
    switch (d) {
      case "string":
        n.elseIf((0, ae._)`${o} == "number" || ${o} == "boolean"`).assign(c, (0, ae._)`"" + ${s}`).elseIf((0, ae._)`${s} === null`).assign(c, (0, ae._)`""`);
        return;
      case "number":
        n.elseIf((0, ae._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(c, (0, ae._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, ae._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(c, (0, ae._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, ae._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(c, !1).elseIf((0, ae._)`${s} === "true" || ${s} === 1`).assign(c, !0);
        return;
      case "null":
        n.elseIf((0, ae._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(c, null);
        return;
      case "array":
        n.elseIf((0, ae._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(c, (0, ae._)`[${s}]`);
    }
  }
}
function M0({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, ae._)`${t} !== undefined`, () => e.assign((0, ae._)`${t}[${r}]`, n));
}
function ia(e, t, r, n = wr.Correct) {
  const s = n === wr.Correct ? ae.operators.EQ : ae.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, ae._)`${t} ${s} null`;
    case "array":
      a = (0, ae._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, ae._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, ae._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, ae._)`typeof ${t} ${s} ${e}`;
  }
  return n === wr.Correct ? a : (0, ae.not)(a);
  function o(c = ae.nil) {
    return (0, ae.and)((0, ae._)`typeof ${t} == "number"`, c, r ? (0, ae._)`isFinite(${t})` : ae.nil);
  }
}
be.checkDataType = ia;
function vo(e, t, r, n) {
  if (e.length === 1)
    return ia(e[0], t, r, n);
  let s;
  const a = (0, fu.toHash)(e);
  if (a.array && a.object) {
    const o = (0, ae._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, ae._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = ae.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, ae.and)(s, ia(o, t, r, n));
  return s;
}
be.checkDataTypes = vo;
const V0 = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ae._)`{type: ${e}}` : (0, ae._)`{type: ${t}}`
};
function wo(e) {
  const t = L0(e);
  (0, j0.reportError)(t, V0);
}
be.reportTypeError = wo;
function L0(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, fu.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var Kr = {}, Qi;
function F0() {
  if (Qi) return Kr;
  Qi = 1, Object.defineProperty(Kr, "__esModule", { value: !0 }), Kr.assignDefaults = void 0;
  const e = ie, t = U;
  function r(s, a) {
    const { properties: o, items: c } = s.schema;
    if (a === "object" && o)
      for (const l in o)
        n(s, l, o[l].default);
    else a === "array" && Array.isArray(c) && c.forEach((l, d) => n(s, d, l.default));
  }
  Kr.assignDefaults = r;
  function n(s, a, o) {
    const { gen: c, compositeRule: l, data: d, opts: u } = s;
    if (o === void 0)
      return;
    const h = (0, e._)`${d}${(0, e.getProperty)(a)}`;
    if (l) {
      (0, t.checkStrictMode)(s, `default is ignored for: ${h}`);
      return;
    }
    let E = (0, e._)`${h} === undefined`;
    u.useDefaults === "empty" && (E = (0, e._)`${E} || ${h} === null || ${h} === ""`), c.if(E, (0, e._)`${h} = ${(0, e.stringify)(o)}`);
  }
  return Kr;
}
var tt = {}, de = {}, Zi;
function ct() {
  if (Zi) return de;
  Zi = 1, Object.defineProperty(de, "__esModule", { value: !0 }), de.validateUnion = de.validateArray = de.usePattern = de.callValidateCode = de.schemaProperties = de.allSchemaProperties = de.noPropertyInData = de.propertyInData = de.isOwnProperty = de.hasPropFunc = de.reportMissingProp = de.checkMissingProp = de.checkReportMissingProp = void 0;
  const e = ie, t = U, r = qt(), n = U;
  function s(_, S) {
    const { gen: O, data: T, it: V } = _;
    O.if(u(O, T, S, V.opts.ownProperties), () => {
      _.setParams({ missingProperty: (0, e._)`${S}` }, !0), _.error();
    });
  }
  de.checkReportMissingProp = s;
  function a({ gen: _, data: S, it: { opts: O } }, T, V) {
    return (0, e.or)(...T.map((K) => (0, e.and)(u(_, S, K, O.ownProperties), (0, e._)`${V} = ${K}`)));
  }
  de.checkMissingProp = a;
  function o(_, S) {
    _.setParams({ missingProperty: S }, !0), _.error();
  }
  de.reportMissingProp = o;
  function c(_) {
    return _.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  de.hasPropFunc = c;
  function l(_, S, O) {
    return (0, e._)`${c(_)}.call(${S}, ${O})`;
  }
  de.isOwnProperty = l;
  function d(_, S, O, T) {
    const V = (0, e._)`${S}${(0, e.getProperty)(O)} !== undefined`;
    return T ? (0, e._)`${V} && ${l(_, S, O)}` : V;
  }
  de.propertyInData = d;
  function u(_, S, O, T) {
    const V = (0, e._)`${S}${(0, e.getProperty)(O)} === undefined`;
    return T ? (0, e.or)(V, (0, e.not)(l(_, S, O))) : V;
  }
  de.noPropertyInData = u;
  function h(_) {
    return _ ? Object.keys(_).filter((S) => S !== "__proto__") : [];
  }
  de.allSchemaProperties = h;
  function E(_, S) {
    return h(S).filter((O) => !(0, t.alwaysValidSchema)(_, S[O]));
  }
  de.schemaProperties = E;
  function y({ schemaCode: _, data: S, it: { gen: O, topSchemaRef: T, schemaPath: V, errorPath: K }, it: ne }, le, ue, F) {
    const J = F ? (0, e._)`${_}, ${S}, ${T}${V}` : S, Q = [
      [r.default.instancePath, (0, e.strConcat)(r.default.instancePath, K)],
      [r.default.parentData, ne.parentData],
      [r.default.parentDataProperty, ne.parentDataProperty],
      [r.default.rootData, r.default.rootData]
    ];
    ne.opts.dynamicRef && Q.push([r.default.dynamicAnchors, r.default.dynamicAnchors]);
    const j = (0, e._)`${J}, ${O.object(...Q)}`;
    return ue !== e.nil ? (0, e._)`${le}.call(${ue}, ${j})` : (0, e._)`${le}(${j})`;
  }
  de.callValidateCode = y;
  const w = (0, e._)`new RegExp`;
  function g({ gen: _, it: { opts: S } }, O) {
    const T = S.unicodeRegExp ? "u" : "", { regExp: V } = S.code, K = V(O, T);
    return _.scopeValue("pattern", {
      key: K.toString(),
      ref: K,
      code: (0, e._)`${V.code === "new RegExp" ? w : (0, n.useFunc)(_, V)}(${O}, ${T})`
    });
  }
  de.usePattern = g;
  function $(_) {
    const { gen: S, data: O, keyword: T, it: V } = _, K = S.name("valid");
    if (V.allErrors) {
      const le = S.let("valid", !0);
      return ne(() => S.assign(le, !1)), le;
    }
    return S.var(K, !0), ne(() => S.break()), K;
    function ne(le) {
      const ue = S.const("len", (0, e._)`${O}.length`);
      S.forRange("i", 0, ue, (F) => {
        _.subschema({
          keyword: T,
          dataProp: F,
          dataPropType: t.Type.Num
        }, K), S.if((0, e.not)(K), le);
      });
    }
  }
  de.validateArray = $;
  function m(_) {
    const { gen: S, schema: O, keyword: T, it: V } = _;
    if (!Array.isArray(O))
      throw new Error("ajv implementation error");
    if (O.some((ue) => (0, t.alwaysValidSchema)(V, ue)) && !V.opts.unevaluated)
      return;
    const ne = S.let("valid", !1), le = S.name("_valid");
    S.block(() => O.forEach((ue, F) => {
      const J = _.subschema({
        keyword: T,
        schemaProp: F,
        compositeRule: !0
      }, le);
      S.assign(ne, (0, e._)`${ne} || ${le}`), _.mergeValidEvaluated(J, le) || S.if((0, e.not)(ne));
    })), _.result(ne, () => _.reset(), () => _.error(!0));
  }
  return de.validateUnion = m, de;
}
var xi;
function z0() {
  if (xi) return tt;
  xi = 1, Object.defineProperty(tt, "__esModule", { value: !0 }), tt.validateKeywordUsage = tt.validSchemaType = tt.funcKeywordCode = tt.macroKeywordCode = void 0;
  const e = ie, t = qt(), r = ct(), n = un;
  function s(E, y) {
    const { gen: w, keyword: g, schema: $, parentSchema: m, it: _ } = E, S = y.macro.call(_.self, $, m, _), O = d(w, g, S);
    _.opts.validateSchema !== !1 && _.self.validateSchema(S, !0);
    const T = w.name("valid");
    E.subschema({
      schema: S,
      schemaPath: e.nil,
      errSchemaPath: `${_.errSchemaPath}/${g}`,
      topSchemaRef: O,
      compositeRule: !0
    }, T), E.pass(T, () => E.error(!0));
  }
  tt.macroKeywordCode = s;
  function a(E, y) {
    var w;
    const { gen: g, keyword: $, schema: m, parentSchema: _, $data: S, it: O } = E;
    l(O, y);
    const T = !S && y.compile ? y.compile.call(O.self, m, _, O) : y.validate, V = d(g, $, T), K = g.let("valid");
    E.block$data(K, ne), E.ok((w = y.valid) !== null && w !== void 0 ? w : K);
    function ne() {
      if (y.errors === !1)
        F(), y.modifying && o(E), J(() => E.error());
      else {
        const Q = y.async ? le() : ue();
        y.modifying && o(E), J(() => c(E, Q));
      }
    }
    function le() {
      const Q = g.let("ruleErrs", null);
      return g.try(() => F((0, e._)`await `), (j) => g.assign(K, !1).if((0, e._)`${j} instanceof ${O.ValidationError}`, () => g.assign(Q, (0, e._)`${j}.errors`), () => g.throw(j))), Q;
    }
    function ue() {
      const Q = (0, e._)`${V}.errors`;
      return g.assign(Q, null), F(e.nil), Q;
    }
    function F(Q = y.async ? (0, e._)`await ` : e.nil) {
      const j = O.opts.passContext ? t.default.this : t.default.self, D = !("compile" in y && !S || y.schema === !1);
      g.assign(K, (0, e._)`${Q}${(0, r.callValidateCode)(E, V, j, D)}`, y.modifying);
    }
    function J(Q) {
      var j;
      g.if((0, e.not)((j = y.valid) !== null && j !== void 0 ? j : K), Q);
    }
  }
  tt.funcKeywordCode = a;
  function o(E) {
    const { gen: y, data: w, it: g } = E;
    y.if(g.parentData, () => y.assign(w, (0, e._)`${g.parentData}[${g.parentDataProperty}]`));
  }
  function c(E, y) {
    const { gen: w } = E;
    w.if((0, e._)`Array.isArray(${y})`, () => {
      w.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${y} : ${t.default.vErrors}.concat(${y})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, n.extendErrors)(E);
    }, () => E.error());
  }
  function l({ schemaEnv: E }, y) {
    if (y.async && !E.$async)
      throw new Error("async keyword in sync schema");
  }
  function d(E, y, w) {
    if (w === void 0)
      throw new Error(`keyword "${y}" failed to compile`);
    return E.scopeValue("keyword", typeof w == "function" ? { ref: w } : { ref: w, code: (0, e.stringify)(w) });
  }
  function u(E, y, w = !1) {
    return !y.length || y.some((g) => g === "array" ? Array.isArray(E) : g === "object" ? E && typeof E == "object" && !Array.isArray(E) : typeof E == g || w && typeof E > "u");
  }
  tt.validSchemaType = u;
  function h({ schema: E, opts: y, self: w, errSchemaPath: g }, $, m) {
    if (Array.isArray($.keyword) ? !$.keyword.includes(m) : $.keyword !== m)
      throw new Error("ajv implementation error");
    const _ = $.dependencies;
    if (_ != null && _.some((S) => !Object.prototype.hasOwnProperty.call(E, S)))
      throw new Error(`parent schema must have dependencies of ${m}: ${_.join(",")}`);
    if ($.validateSchema && !$.validateSchema(E[m])) {
      const O = `keyword "${m}" value is invalid at path "${g}": ` + w.errorsText($.validateSchema.errors);
      if (y.validateSchema === "log")
        w.logger.error(O);
      else
        throw new Error(O);
    }
  }
  return tt.validateKeywordUsage = h, tt;
}
var Et = {}, ec;
function U0() {
  if (ec) return Et;
  ec = 1, Object.defineProperty(Et, "__esModule", { value: !0 }), Et.extendSubschemaMode = Et.extendSubschemaData = Et.getSubschema = void 0;
  const e = ie, t = U;
  function r(a, { keyword: o, schemaProp: c, schema: l, schemaPath: d, errSchemaPath: u, topSchemaRef: h }) {
    if (o !== void 0 && l !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (o !== void 0) {
      const E = a.schema[o];
      return c === void 0 ? {
        schema: E,
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(o)}`,
        errSchemaPath: `${a.errSchemaPath}/${o}`
      } : {
        schema: E[c],
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(o)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${a.errSchemaPath}/${o}/${(0, t.escapeFragment)(c)}`
      };
    }
    if (l !== void 0) {
      if (d === void 0 || u === void 0 || h === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: l,
        schemaPath: d,
        topSchemaRef: h,
        errSchemaPath: u
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Et.getSubschema = r;
  function n(a, o, { dataProp: c, dataPropType: l, data: d, dataTypes: u, propertyName: h }) {
    if (d !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: E } = o;
    if (c !== void 0) {
      const { errorPath: w, dataPathArr: g, opts: $ } = o, m = E.let("data", (0, e._)`${o.data}${(0, e.getProperty)(c)}`, !0);
      y(m), a.errorPath = (0, e.str)`${w}${(0, t.getErrorPath)(c, l, $.jsPropertySyntax)}`, a.parentDataProperty = (0, e._)`${c}`, a.dataPathArr = [...g, a.parentDataProperty];
    }
    if (d !== void 0) {
      const w = d instanceof e.Name ? d : E.let("data", d, !0);
      y(w), h !== void 0 && (a.propertyName = h);
    }
    u && (a.dataTypes = u);
    function y(w) {
      a.data = w, a.dataLevel = o.dataLevel + 1, a.dataTypes = [], o.definedProperties = /* @__PURE__ */ new Set(), a.parentData = o.data, a.dataNames = [...o.dataNames, w];
    }
  }
  Et.extendSubschemaData = n;
  function s(a, { jtdDiscriminator: o, jtdMetadata: c, compositeRule: l, createErrors: d, allErrors: u }) {
    l !== void 0 && (a.compositeRule = l), d !== void 0 && (a.createErrors = d), u !== void 0 && (a.allErrors = u), a.jtdDiscriminator = o, a.jtdMetadata = c;
  }
  return Et.extendSubschemaMode = s, Et;
}
var je = {}, pu = { exports: {} }, zt = pu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Kn(t, n, s, e, "", e);
};
zt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
zt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
zt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
zt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Kn(e, t, r, n, s, a, o, c, l, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, c, l, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in zt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Kn(e, t, r, h[E], s + "/" + u + "/" + E, a, s, u, n, E);
      } else if (u in zt.propsKeywords) {
        if (h && typeof h == "object")
          for (var y in h)
            Kn(e, t, r, h[y], s + "/" + u + "/" + q0(y), a, s, u, n, y);
      } else (u in zt.keywords || e.allKeys && !(u in zt.skipKeywords)) && Kn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, c, l, d);
  }
}
function q0(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var K0 = pu.exports;
Object.defineProperty(je, "__esModule", { value: !0 });
je.getSchemaRefs = je.resolveUrl = je.normalizeId = je._getFullPath = je.getFullPath = je.inlineRef = void 0;
const G0 = U, H0 = os, B0 = K0, X0 = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function J0(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ca(e) : t ? yu(e) <= t : !1;
}
je.inlineRef = J0;
const W0 = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ca(e) {
  for (const t in e) {
    if (W0.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ca) || typeof r == "object" && ca(r))
      return !0;
  }
  return !1;
}
function yu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !X0.has(r) && (typeof e[r] == "object" && (0, G0.eachItem)(e[r], (n) => t += yu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function $u(e, t = "", r) {
  r !== !1 && (t = Er(t));
  const n = e.parse(t);
  return gu(e, n);
}
je.getFullPath = $u;
function gu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
je._getFullPath = gu;
const Y0 = /#\/?$/;
function Er(e) {
  return e ? e.replace(Y0, "") : "";
}
je.normalizeId = Er;
function Q0(e, t, r) {
  return r = Er(r), e.resolve(t, r);
}
je.resolveUrl = Q0;
const Z0 = /^[a-z_][-a-z0-9._]*$/i;
function x0(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Er(e[r] || t), a = { "": s }, o = $u(n, s, !1), c = {}, l = /* @__PURE__ */ new Set();
  return B0(e, { allKeys: !0 }, (h, E, y, w) => {
    if (w === void 0)
      return;
    const g = o + E;
    let $ = a[w];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), _.call(this, h.$anchor), _.call(this, h.$dynamicAnchor), a[E] = $;
    function m(S) {
      const O = this.opts.uriResolver.resolve;
      if (S = Er($ ? O($, S) : S), l.has(S))
        throw u(S);
      l.add(S);
      let T = this.refs[S];
      return typeof T == "string" && (T = this.refs[T]), typeof T == "object" ? d(h, T.schema, S) : S !== Er(g) && (S[0] === "#" ? (d(h, c[S], S), c[S] = h) : this.refs[S] = g), S;
    }
    function _(S) {
      if (typeof S == "string") {
        if (!Z0.test(S))
          throw new Error(`invalid anchor "${S}"`);
        m.call(this, `#${S}`);
      }
    }
  }), c;
  function d(h, E, y) {
    if (E !== void 0 && !H0(h, E))
      throw u(y);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
je.getSchemaRefs = x0;
var tc;
function hs() {
  if (tc) return vt;
  tc = 1, Object.defineProperty(vt, "__esModule", { value: !0 }), vt.getData = vt.KeywordCxt = vt.validateFunctionCode = void 0;
  const e = S0(), t = be, r = du(), n = be, s = F0(), a = z0(), o = U0(), c = ie, l = qt(), d = je, u = U, h = un;
  function E(R) {
    if (T(R) && (K(R), O(R))) {
      $(R);
      return;
    }
    y(R, () => (0, e.topBoolOrEmptySchema)(R));
  }
  vt.validateFunctionCode = E;
  function y({ gen: R, validateName: I, schema: C, schemaEnv: M, opts: X }, x) {
    X.code.es5 ? R.func(I, (0, c._)`${l.default.data}, ${l.default.valCxt}`, M.$async, () => {
      R.code((0, c._)`"use strict"; ${_(C, X)}`), g(R, X), R.code(x);
    }) : R.func(I, (0, c._)`${l.default.data}, ${w(X)}`, M.$async, () => R.code(_(C, X)).code(x));
  }
  function w(R) {
    return (0, c._)`{${l.default.instancePath}="", ${l.default.parentData}, ${l.default.parentDataProperty}, ${l.default.rootData}=${l.default.data}${R.dynamicRef ? (0, c._)`, ${l.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function g(R, I) {
    R.if(l.default.valCxt, () => {
      R.var(l.default.instancePath, (0, c._)`${l.default.valCxt}.${l.default.instancePath}`), R.var(l.default.parentData, (0, c._)`${l.default.valCxt}.${l.default.parentData}`), R.var(l.default.parentDataProperty, (0, c._)`${l.default.valCxt}.${l.default.parentDataProperty}`), R.var(l.default.rootData, (0, c._)`${l.default.valCxt}.${l.default.rootData}`), I.dynamicRef && R.var(l.default.dynamicAnchors, (0, c._)`${l.default.valCxt}.${l.default.dynamicAnchors}`);
    }, () => {
      R.var(l.default.instancePath, (0, c._)`""`), R.var(l.default.parentData, (0, c._)`undefined`), R.var(l.default.parentDataProperty, (0, c._)`undefined`), R.var(l.default.rootData, l.default.data), I.dynamicRef && R.var(l.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function $(R) {
    const { schema: I, opts: C, gen: M } = R;
    y(R, () => {
      C.$comment && I.$comment && Q(R), ue(R), M.let(l.default.vErrors, null), M.let(l.default.errors, 0), C.unevaluated && m(R), ne(R), j(R);
    });
  }
  function m(R) {
    const { gen: I, validateName: C } = R;
    R.evaluated = I.const("evaluated", (0, c._)`${C}.evaluated`), I.if((0, c._)`${R.evaluated}.dynamicProps`, () => I.assign((0, c._)`${R.evaluated}.props`, (0, c._)`undefined`)), I.if((0, c._)`${R.evaluated}.dynamicItems`, () => I.assign((0, c._)`${R.evaluated}.items`, (0, c._)`undefined`));
  }
  function _(R, I) {
    const C = typeof R == "object" && R[I.schemaId];
    return C && (I.code.source || I.code.process) ? (0, c._)`/*# sourceURL=${C} */` : c.nil;
  }
  function S(R, I) {
    if (T(R) && (K(R), O(R))) {
      V(R, I);
      return;
    }
    (0, e.boolOrEmptySchema)(R, I);
  }
  function O({ schema: R, self: I }) {
    if (typeof R == "boolean")
      return !R;
    for (const C in R)
      if (I.RULES.all[C])
        return !0;
    return !1;
  }
  function T(R) {
    return typeof R.schema != "boolean";
  }
  function V(R, I) {
    const { schema: C, gen: M, opts: X } = R;
    X.$comment && C.$comment && Q(R), F(R), J(R);
    const x = M.const("_errs", l.default.errors);
    ne(R, x), M.var(I, (0, c._)`${x} === ${l.default.errors}`);
  }
  function K(R) {
    (0, u.checkUnknownRules)(R), le(R);
  }
  function ne(R, I) {
    if (R.opts.jtd)
      return G(R, [], !1, I);
    const C = (0, t.getSchemaTypes)(R.schema), M = (0, t.coerceAndCheckDataType)(R, C);
    G(R, C, !M, I);
  }
  function le(R) {
    const { schema: I, errSchemaPath: C, opts: M, self: X } = R;
    I.$ref && M.ignoreKeywordsWithRef && (0, u.schemaHasRulesButRef)(I, X.RULES) && X.logger.warn(`$ref: keywords ignored in schema at path "${C}"`);
  }
  function ue(R) {
    const { schema: I, opts: C } = R;
    I.default !== void 0 && C.useDefaults && C.strictSchema && (0, u.checkStrictMode)(R, "default is ignored in the schema root");
  }
  function F(R) {
    const I = R.schema[R.opts.schemaId];
    I && (R.baseId = (0, d.resolveUrl)(R.opts.uriResolver, R.baseId, I));
  }
  function J(R) {
    if (R.schema.$async && !R.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function Q({ gen: R, schemaEnv: I, schema: C, errSchemaPath: M, opts: X }) {
    const x = C.$comment;
    if (X.$comment === !0)
      R.code((0, c._)`${l.default.self}.logger.log(${x})`);
    else if (typeof X.$comment == "function") {
      const ge = (0, c.str)`${M}/$comment`, Le = R.scopeValue("root", { ref: I.root });
      R.code((0, c._)`${l.default.self}.opts.$comment(${x}, ${ge}, ${Le}.schema)`);
    }
  }
  function j(R) {
    const { gen: I, schemaEnv: C, validateName: M, ValidationError: X, opts: x } = R;
    C.$async ? I.if((0, c._)`${l.default.errors} === 0`, () => I.return(l.default.data), () => I.throw((0, c._)`new ${X}(${l.default.vErrors})`)) : (I.assign((0, c._)`${M}.errors`, l.default.vErrors), x.unevaluated && D(R), I.return((0, c._)`${l.default.errors} === 0`));
  }
  function D({ gen: R, evaluated: I, props: C, items: M }) {
    C instanceof c.Name && R.assign((0, c._)`${I}.props`, C), M instanceof c.Name && R.assign((0, c._)`${I}.items`, M);
  }
  function G(R, I, C, M) {
    const { gen: X, schema: x, data: ge, allErrors: Le, opts: Se, self: Pe } = R, { RULES: _e } = Pe;
    if (x.$ref && (Se.ignoreKeywordsWithRef || !(0, u.schemaHasRulesButRef)(x, _e))) {
      X.block(() => k(R, "$ref", _e.all.$ref.definition));
      return;
    }
    Se.jtd || W(R, I), X.block(() => {
      for (const ke of _e.rules)
        dt(ke);
      dt(_e.post);
    });
    function dt(ke) {
      (0, r.shouldUseGroup)(x, ke) && (ke.type ? (X.if((0, n.checkDataType)(ke.type, ge, Se.strictNumbers)), z(R, ke), I.length === 1 && I[0] === ke.type && C && (X.else(), (0, n.reportTypeError)(R)), X.endIf()) : z(R, ke), Le || X.if((0, c._)`${l.default.errors} === ${M || 0}`));
    }
  }
  function z(R, I) {
    const { gen: C, schema: M, opts: { useDefaults: X } } = R;
    X && (0, s.assignDefaults)(R, I.type), C.block(() => {
      for (const x of I.rules)
        (0, r.shouldUseRule)(M, x) && k(R, x.keyword, x.definition, I.type);
    });
  }
  function W(R, I) {
    R.schemaEnv.meta || !R.opts.strictTypes || (q(R, I), R.opts.allowUnionTypes || N(R, I), p(R, R.dataTypes));
  }
  function q(R, I) {
    if (I.length) {
      if (!R.dataTypes.length) {
        R.dataTypes = I;
        return;
      }
      I.forEach((C) => {
        v(R.dataTypes, C) || f(R, `type "${C}" not allowed by context "${R.dataTypes.join(",")}"`);
      }), i(R, I);
    }
  }
  function N(R, I) {
    I.length > 1 && !(I.length === 2 && I.includes("null")) && f(R, "use allowUnionTypes to allow union type keyword");
  }
  function p(R, I) {
    const C = R.self.RULES.all;
    for (const M in C) {
      const X = C[M];
      if (typeof X == "object" && (0, r.shouldUseRule)(R.schema, X)) {
        const { type: x } = X.definition;
        x.length && !x.some((ge) => P(I, ge)) && f(R, `missing type "${x.join(",")}" for keyword "${M}"`);
      }
    }
  }
  function P(R, I) {
    return R.includes(I) || I === "number" && R.includes("integer");
  }
  function v(R, I) {
    return R.includes(I) || I === "integer" && R.includes("number");
  }
  function i(R, I) {
    const C = [];
    for (const M of R.dataTypes)
      v(I, M) ? C.push(M) : I.includes("integer") && M === "number" && C.push("integer");
    R.dataTypes = C;
  }
  function f(R, I) {
    const C = R.schemaEnv.baseId + R.errSchemaPath;
    I += ` at "${C}" (strictTypes)`, (0, u.checkStrictMode)(R, I, R.opts.strictTypes);
  }
  class b {
    constructor(I, C, M) {
      if ((0, a.validateKeywordUsage)(I, C, M), this.gen = I.gen, this.allErrors = I.allErrors, this.keyword = M, this.data = I.data, this.schema = I.schema[M], this.$data = C.$data && I.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, u.schemaRefOrVal)(I, this.schema, M, this.$data), this.schemaType = C.schemaType, this.parentSchema = I.schema, this.params = {}, this.it = I, this.def = C, this.$data)
        this.schemaCode = I.gen.const("vSchema", H(this.$data, I));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, C.schemaType, C.allowUndefined))
        throw new Error(`${M} value must be ${JSON.stringify(C.schemaType)}`);
      ("code" in C ? C.trackErrors : C.errors !== !1) && (this.errsCount = I.gen.const("_errs", l.default.errors));
    }
    result(I, C, M) {
      this.failResult((0, c.not)(I), C, M);
    }
    failResult(I, C, M) {
      this.gen.if(I), M ? M() : this.error(), C ? (this.gen.else(), C(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(I, C) {
      this.failResult((0, c.not)(I), void 0, C);
    }
    fail(I) {
      if (I === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(I), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(I) {
      if (!this.$data)
        return this.fail(I);
      const { schemaCode: C } = this;
      this.fail((0, c._)`${C} !== undefined && (${(0, c.or)(this.invalid$data(), I)})`);
    }
    error(I, C, M) {
      if (C) {
        this.setParams(C), this._error(I, M), this.setParams({});
        return;
      }
      this._error(I, M);
    }
    _error(I, C) {
      (I ? h.reportExtraError : h.reportError)(this, this.def.error, C);
    }
    $dataError() {
      (0, h.reportError)(this, this.def.$dataError || h.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, h.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(I) {
      this.allErrors || this.gen.if(I);
    }
    setParams(I, C) {
      C ? Object.assign(this.params, I) : this.params = I;
    }
    block$data(I, C, M = c.nil) {
      this.gen.block(() => {
        this.check$data(I, M), C();
      });
    }
    check$data(I = c.nil, C = c.nil) {
      if (!this.$data)
        return;
      const { gen: M, schemaCode: X, schemaType: x, def: ge } = this;
      M.if((0, c.or)((0, c._)`${X} === undefined`, C)), I !== c.nil && M.assign(I, !0), (x.length || ge.validateSchema) && (M.elseIf(this.invalid$data()), this.$dataError(), I !== c.nil && M.assign(I, !1)), M.else();
    }
    invalid$data() {
      const { gen: I, schemaCode: C, schemaType: M, def: X, it: x } = this;
      return (0, c.or)(ge(), Le());
      function ge() {
        if (M.length) {
          if (!(C instanceof c.Name))
            throw new Error("ajv implementation error");
          const Se = Array.isArray(M) ? M : [M];
          return (0, c._)`${(0, n.checkDataTypes)(Se, C, x.opts.strictNumbers, n.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function Le() {
        if (X.validateSchema) {
          const Se = I.scopeValue("validate$data", { ref: X.validateSchema });
          return (0, c._)`!${Se}(${C})`;
        }
        return c.nil;
      }
    }
    subschema(I, C) {
      const M = (0, o.getSubschema)(this.it, I);
      (0, o.extendSubschemaData)(M, this.it, I), (0, o.extendSubschemaMode)(M, I);
      const X = { ...this.it, ...M, items: void 0, props: void 0 };
      return S(X, C), X;
    }
    mergeEvaluated(I, C) {
      const { it: M, gen: X } = this;
      M.opts.unevaluated && (M.props !== !0 && I.props !== void 0 && (M.props = u.mergeEvaluated.props(X, I.props, M.props, C)), M.items !== !0 && I.items !== void 0 && (M.items = u.mergeEvaluated.items(X, I.items, M.items, C)));
    }
    mergeValidEvaluated(I, C) {
      const { it: M, gen: X } = this;
      if (M.opts.unevaluated && (M.props !== !0 || M.items !== !0))
        return X.if(C, () => this.mergeEvaluated(I, c.Name)), !0;
    }
  }
  vt.KeywordCxt = b;
  function k(R, I, C, M) {
    const X = new b(R, C, I);
    "code" in C ? C.code(X, M) : X.$data && C.validate ? (0, a.funcKeywordCode)(X, C) : "macro" in C ? (0, a.macroKeywordCode)(X, C) : (C.compile || C.validate) && (0, a.funcKeywordCode)(X, C);
  }
  const A = /^\/(?:[^~]|~0|~1)*$/, B = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function H(R, { dataLevel: I, dataNames: C, dataPathArr: M }) {
    let X, x;
    if (R === "")
      return l.default.rootData;
    if (R[0] === "/") {
      if (!A.test(R))
        throw new Error(`Invalid JSON-pointer: ${R}`);
      X = R, x = l.default.rootData;
    } else {
      const Pe = B.exec(R);
      if (!Pe)
        throw new Error(`Invalid JSON-pointer: ${R}`);
      const _e = +Pe[1];
      if (X = Pe[2], X === "#") {
        if (_e >= I)
          throw new Error(Se("property/index", _e));
        return M[I - _e];
      }
      if (_e > I)
        throw new Error(Se("data", _e));
      if (x = C[I - _e], !X)
        return x;
    }
    let ge = x;
    const Le = X.split("/");
    for (const Pe of Le)
      Pe && (x = (0, c._)`${x}${(0, c.getProperty)((0, u.unescapeJsonPointer)(Pe))}`, ge = (0, c._)`${ge} && ${x}`);
    return ge;
    function Se(Pe, _e) {
      return `Cannot access ${Pe} ${_e} levels up, current level is ${I}`;
    }
  }
  return vt.getData = H, vt;
}
var En = {}, rc;
function Eo() {
  if (rc) return En;
  rc = 1, Object.defineProperty(En, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return En.default = e, En;
}
var bn = {}, nc;
function ms() {
  if (nc) return bn;
  nc = 1, Object.defineProperty(bn, "__esModule", { value: !0 });
  const e = je;
  class t extends Error {
    constructor(n, s, a, o) {
      super(o || `can't resolve reference ${a} from id ${s}`), this.missingRef = (0, e.resolveUrl)(n, s, a), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(n, this.missingRef));
    }
  }
  return bn.default = t, bn;
}
var Be = {};
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.resolveSchema = Be.getCompilingSchema = Be.resolveRef = Be.compileSchema = Be.SchemaEnv = void 0;
const rt = ie, eg = Eo(), Jt = qt(), ot = je, sc = U, tg = hs();
class ps {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, ot.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Be.SchemaEnv = ps;
function bo(e) {
  const t = _u.call(this, e);
  if (t)
    return t;
  const r = (0, ot.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new rt.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let c;
  e.$async && (c = o.scopeValue("Error", {
    ref: eg.default,
    code: (0, rt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const l = o.scopeName("validate");
  e.validateName = l;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Jt.default.data,
    parentData: Jt.default.parentData,
    parentDataProperty: Jt.default.parentDataProperty,
    dataNames: [Jt.default.data],
    dataPathArr: [rt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, rt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: l,
    ValidationError: c,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: rt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, rt._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, tg.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Jt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const y = new Function(`${Jt.default.self}`, `${Jt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(l, { ref: y }), y.errors = null, y.schema = e.schema, y.schemaEnv = e, e.$async && (y.$async = !0), this.opts.code.source === !0 && (y.source = { validateName: l, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: g } = d;
      y.evaluated = {
        props: w instanceof rt.Name ? void 0 : w,
        items: g instanceof rt.Name ? void 0 : g,
        dynamicProps: w instanceof rt.Name,
        dynamicItems: g instanceof rt.Name
      }, y.source && (y.source.evaluated = (0, rt.stringify)(y.evaluated));
    }
    return e.validate = y, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Be.compileSchema = bo;
function rg(e, t, r) {
  var n;
  r = (0, ot.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = ag.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: c } = this.opts;
    o && (a = new ps({ schema: o, schemaId: c, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = ng.call(this, a);
}
Be.resolveRef = rg;
function ng(e) {
  return (0, ot.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : bo.call(this, e);
}
function _u(e) {
  for (const t of this._compilations)
    if (sg(t, e))
      return t;
}
Be.getCompilingSchema = _u;
function sg(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function ag(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ys.call(this, e, t);
}
function ys(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, ot._getFullPath)(this.opts.uriResolver, r);
  let s = (0, ot.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ds.call(this, r, e);
  const a = (0, ot.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const c = ys.call(this, e, o);
    return typeof (c == null ? void 0 : c.schema) != "object" ? void 0 : Ds.call(this, r, c);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || bo.call(this, o), a === (0, ot.normalizeId)(t)) {
      const { schema: c } = o, { schemaId: l } = this.opts, d = c[l];
      return d && (s = (0, ot.resolveUrl)(this.opts.uriResolver, s, d)), new ps({ schema: c, schemaId: l, root: e, baseId: s });
    }
    return Ds.call(this, r, o);
  }
}
Be.resolveSchema = ys;
const og = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ds(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const c of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const l = r[(0, sc.unescapeFragment)(c)];
    if (l === void 0)
      return;
    r = l;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !og.has(c) && d && (t = (0, ot.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, sc.schemaHasRulesButRef)(r, this.RULES)) {
    const c = (0, ot.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = ys.call(this, n, c);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new ps({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const ig = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", cg = "Meta-schema for $data reference (JSON AnySchema extension proposal)", lg = "object", ug = [
  "$data"
], dg = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, fg = !1, hg = {
  $id: ig,
  description: cg,
  type: lg,
  required: ug,
  properties: dg,
  additionalProperties: fg
};
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const vu = Bl;
vu.code = 'require("ajv/dist/runtime/uri").default';
So.default = vu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = hs();
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ie;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = Eo(), s = ms(), a = or, o = Be, c = ie, l = je, d = be, u = U, h = hg, E = So, y = (N, p) => new RegExp(N, p);
  y.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], g = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), $ = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, _ = 200;
  function S(N) {
    var p, P, v, i, f, b, k, A, B, H, R, I, C, M, X, x, ge, Le, Se, Pe, _e, dt, ke, Kt, Gt;
    const Ze = N.strict, Ht = (p = N.code) === null || p === void 0 ? void 0 : p.optimize, Vr = Ht === !0 || Ht === void 0 ? 1 : Ht || 0, Lr = (v = (P = N.code) === null || P === void 0 ? void 0 : P.regExp) !== null && v !== void 0 ? v : y, Ss = (i = N.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = N.strictSchema) !== null && f !== void 0 ? f : Ze) !== null && b !== void 0 ? b : !0,
      strictNumbers: (A = (k = N.strictNumbers) !== null && k !== void 0 ? k : Ze) !== null && A !== void 0 ? A : !0,
      strictTypes: (H = (B = N.strictTypes) !== null && B !== void 0 ? B : Ze) !== null && H !== void 0 ? H : "log",
      strictTuples: (I = (R = N.strictTuples) !== null && R !== void 0 ? R : Ze) !== null && I !== void 0 ? I : "log",
      strictRequired: (M = (C = N.strictRequired) !== null && C !== void 0 ? C : Ze) !== null && M !== void 0 ? M : !1,
      code: N.code ? { ...N.code, optimize: Vr, regExp: Lr } : { optimize: Vr, regExp: Lr },
      loopRequired: (X = N.loopRequired) !== null && X !== void 0 ? X : _,
      loopEnum: (x = N.loopEnum) !== null && x !== void 0 ? x : _,
      meta: (ge = N.meta) !== null && ge !== void 0 ? ge : !0,
      messages: (Le = N.messages) !== null && Le !== void 0 ? Le : !0,
      inlineRefs: (Se = N.inlineRefs) !== null && Se !== void 0 ? Se : !0,
      schemaId: (Pe = N.schemaId) !== null && Pe !== void 0 ? Pe : "$id",
      addUsedSchema: (_e = N.addUsedSchema) !== null && _e !== void 0 ? _e : !0,
      validateSchema: (dt = N.validateSchema) !== null && dt !== void 0 ? dt : !0,
      validateFormats: (ke = N.validateFormats) !== null && ke !== void 0 ? ke : !0,
      unicodeRegExp: (Kt = N.unicodeRegExp) !== null && Kt !== void 0 ? Kt : !0,
      int32range: (Gt = N.int32range) !== null && Gt !== void 0 ? Gt : !0,
      uriResolver: Ss
    };
  }
  class O {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...S(p) };
      const { es5: P, lines: v } = this.opts.code;
      this.scope = new c.ValueScope({ scope: {}, prefixes: g, es5: P, lines: v }), this.logger = J(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), T.call(this, $, p, "NOT SUPPORTED"), T.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = ue.call(this), p.formats && ne.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && le.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), K.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: P, schemaId: v } = this.opts;
      let i = h;
      v === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), P && p && this.addMetaSchema(i, i[v], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: P } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[P] || p : void 0;
    }
    validate(p, P) {
      let v;
      if (typeof p == "string") {
        if (v = this.getSchema(p), !v)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        v = this.compile(p);
      const i = v(P);
      return "$async" in v || (this.errors = v.errors), i;
    }
    compile(p, P) {
      const v = this._addSchema(p, P);
      return v.validate || this._compileSchemaEnv(v);
    }
    compileAsync(p, P) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: v } = this.opts;
      return i.call(this, p, P);
      async function i(H, R) {
        await f.call(this, H.$schema);
        const I = this._addSchema(H, R);
        return I.validate || b.call(this, I);
      }
      async function f(H) {
        H && !this.getSchema(H) && await i.call(this, { $ref: H }, !0);
      }
      async function b(H) {
        try {
          return this._compileSchemaEnv(H);
        } catch (R) {
          if (!(R instanceof s.default))
            throw R;
          return k.call(this, R), await A.call(this, R.missingSchema), b.call(this, H);
        }
      }
      function k({ missingSchema: H, missingRef: R }) {
        if (this.refs[H])
          throw new Error(`AnySchema ${H} is loaded but ${R} cannot be resolved`);
      }
      async function A(H) {
        const R = await B.call(this, H);
        this.refs[H] || await f.call(this, R.$schema), this.refs[H] || this.addSchema(R, H, P);
      }
      async function B(H) {
        const R = this._loading[H];
        if (R)
          return R;
        try {
          return await (this._loading[H] = v(H));
        } finally {
          delete this._loading[H];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, P, v, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, v, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return P = (0, l.normalizeId)(P || f), this._checkUnique(P), this.schemas[P] = this._addSchema(p, v, P, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, P, v = this.opts.validateSchema) {
      return this.addSchema(p, P, !0, v), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, P) {
      if (typeof p == "boolean")
        return !0;
      let v;
      if (v = p.$schema, v !== void 0 && typeof v != "string")
        throw new Error("$schema must be a string");
      if (v = v || this.opts.defaultMeta || this.defaultMeta(), !v)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(v, p);
      if (!i && P) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let P;
      for (; typeof (P = V.call(this, p)) == "string"; )
        p = P;
      if (P === void 0) {
        const { schemaId: v } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: v });
        if (P = o.resolveSchema.call(this, i, p), !P)
          return;
        this.refs[p] = P;
      }
      return P.validate || this._compileSchemaEnv(P);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const P = V.call(this, p);
          return typeof P == "object" && this._cache.delete(P.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const P = p;
          this._cache.delete(P);
          let v = p[this.opts.schemaId];
          return v && (v = (0, l.normalizeId)(v), delete this.schemas[v], delete this.refs[v]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const P of p)
        this.addKeyword(P);
      return this;
    }
    addKeyword(p, P) {
      let v;
      if (typeof p == "string")
        v = p, typeof P == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), P.keyword = v);
      else if (typeof p == "object" && P === void 0) {
        if (P = p, v = P.keyword, Array.isArray(v) && !v.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (j.call(this, v, P), !P)
        return (0, u.eachItem)(v, (f) => D.call(this, f)), this;
      z.call(this, P);
      const i = {
        ...P,
        type: (0, d.getJSONTypes)(P.type),
        schemaType: (0, d.getJSONTypes)(P.schemaType)
      };
      return (0, u.eachItem)(v, i.type.length === 0 ? (f) => D.call(this, f, i) : (f) => i.type.forEach((b) => D.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const P = this.RULES.all[p];
      return typeof P == "object" ? P.definition : !!P;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: P } = this;
      delete P.keywords[p], delete P.all[p];
      for (const v of P.rules) {
        const i = v.rules.findIndex((f) => f.keyword === p);
        i >= 0 && v.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, P) {
      return typeof P == "string" && (P = new RegExp(P)), this.formats[p] = P, this;
    }
    errorsText(p = this.errors, { separator: P = ", ", dataVar: v = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${v}${i.instancePath} ${i.message}`).reduce((i, f) => i + P + f);
    }
    $dataMetaSchema(p, P) {
      const v = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of P) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const k of f)
          b = b[k];
        for (const k in v) {
          const A = v[k];
          if (typeof A != "object")
            continue;
          const { $data: B } = A.definition, H = b[k];
          B && H && (b[k] = q(H));
        }
      }
      return p;
    }
    _removeAllSchemas(p, P) {
      for (const v in p) {
        const i = p[v];
        (!P || P.test(v)) && (typeof i == "string" ? delete p[v] : i && !i.meta && (this._cache.delete(i.schema), delete p[v]));
      }
    }
    _addSchema(p, P, v, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: k } = this.opts;
      if (typeof p == "object")
        b = p[k];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let A = this._cache.get(p);
      if (A !== void 0)
        return A;
      v = (0, l.normalizeId)(b || v);
      const B = l.getSchemaRefs.call(this, p, v);
      return A = new o.SchemaEnv({ schema: p, schemaId: k, meta: P, baseId: v, localRefs: B }), this._cache.set(A.schema, A), f && !v.startsWith("#") && (v && this._checkUnique(v), this.refs[v] = A), i && this.validateSchema(p, !0), A;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const P = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = P;
      }
    }
  }
  O.ValidationError = n.default, O.MissingRefError = s.default, e.default = O;
  function T(N, p, P, v = "error") {
    for (const i in N) {
      const f = i;
      f in p && this.logger[v](`${P}: option ${i}. ${N[f]}`);
    }
  }
  function V(N) {
    return N = (0, l.normalizeId)(N), this.schemas[N] || this.refs[N];
  }
  function K() {
    const N = this.opts.schemas;
    if (N)
      if (Array.isArray(N))
        this.addSchema(N);
      else
        for (const p in N)
          this.addSchema(N[p], p);
  }
  function ne() {
    for (const N in this.opts.formats) {
      const p = this.opts.formats[N];
      p && this.addFormat(N, p);
    }
  }
  function le(N) {
    if (Array.isArray(N)) {
      this.addVocabulary(N);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in N) {
      const P = N[p];
      P.keyword || (P.keyword = p), this.addKeyword(P);
    }
  }
  function ue() {
    const N = { ...this.opts };
    for (const p of w)
      delete N[p];
    return N;
  }
  const F = { log() {
  }, warn() {
  }, error() {
  } };
  function J(N) {
    if (N === !1)
      return F;
    if (N === void 0)
      return console;
    if (N.log && N.warn && N.error)
      return N;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Q = /^[a-z_$][a-z0-9_$:-]*$/i;
  function j(N, p) {
    const { RULES: P } = this;
    if ((0, u.eachItem)(N, (v) => {
      if (P.keywords[v])
        throw new Error(`Keyword ${v} is already defined`);
      if (!Q.test(v))
        throw new Error(`Keyword ${v} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function D(N, p, P) {
    var v;
    const i = p == null ? void 0 : p.post;
    if (P && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: A }) => A === P);
    if (b || (b = { type: P, rules: [] }, f.rules.push(b)), f.keywords[N] = !0, !p)
      return;
    const k = {
      keyword: N,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? G.call(this, b, k, p.before) : b.rules.push(k), f.all[N] = k, (v = p.implements) === null || v === void 0 || v.forEach((A) => this.addKeyword(A));
  }
  function G(N, p, P) {
    const v = N.rules.findIndex((i) => i.keyword === P);
    v >= 0 ? N.rules.splice(v, 0, p) : (N.rules.push(p), this.logger.warn(`rule ${P} is not defined`));
  }
  function z(N) {
    let { metaSchema: p } = N;
    p !== void 0 && (N.$data && this.opts.$data && (p = q(p)), N.validateSchema = this.compile(p, !0));
  }
  const W = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function q(N) {
    return { anyOf: [N, W] };
  }
})(au);
var Po = {}, No = {}, Ro = {};
Object.defineProperty(Ro, "__esModule", { value: !0 });
const mg = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Ro.default = mg;
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.callRef = ir.getValidate = void 0;
const pg = ms(), ac = ct(), He = ie, ur = qt(), oc = Be, Sn = U, yg = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: c, self: l } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = oc.resolveRef.call(l, d, s, r);
    if (u === void 0)
      throw new pg.default(n.opts.uriResolver, s, r);
    if (u instanceof oc.SchemaEnv)
      return E(u);
    return y(u);
    function h() {
      if (a === d)
        return Gn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return Gn(e, (0, He._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const g = wu(e, w);
      Gn(e, g, w, w.$async);
    }
    function y(w) {
      const g = t.scopeValue("schema", c.code.source === !0 ? { ref: w, code: (0, He.stringify)(w) } : { ref: w }), $ = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: He.nil,
        topSchemaRef: g,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function wu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, He._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
ir.getValidate = wu;
function Gn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: c, opts: l } = a, d = l.passContext ? ur.default.this : He.nil;
  n ? u() : h();
  function u() {
    if (!c.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, He._)`await ${(0, ac.callValidateCode)(e, t, d)}`), y(t), o || s.assign(w, !0);
    }, (g) => {
      s.if((0, He._)`!(${g} instanceof ${a.ValidationError})`, () => s.throw(g)), E(g), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, ac.callValidateCode)(e, t, d), () => y(t), () => E(t));
  }
  function E(w) {
    const g = (0, He._)`${w}.errors`;
    s.assign(ur.default.vErrors, (0, He._)`${ur.default.vErrors} === null ? ${g} : ${ur.default.vErrors}.concat(${g})`), s.assign(ur.default.errors, (0, He._)`${ur.default.vErrors}.length`);
  }
  function y(w) {
    var g;
    if (!a.opts.unevaluated)
      return;
    const $ = (g = r == null ? void 0 : r.validate) === null || g === void 0 ? void 0 : g.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = Sn.mergeEvaluated.props(s, $.props, a.props));
      else {
        const m = s.var("props", (0, He._)`${w}.evaluated.props`);
        a.props = Sn.mergeEvaluated.props(s, m, a.props, He.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = Sn.mergeEvaluated.items(s, $.items, a.items));
      else {
        const m = s.var("items", (0, He._)`${w}.evaluated.items`);
        a.items = Sn.mergeEvaluated.items(s, m, a.items, He.Name);
      }
  }
}
ir.callRef = Gn;
ir.default = yg;
Object.defineProperty(No, "__esModule", { value: !0 });
const $g = Ro, gg = ir, _g = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  $g.default,
  gg.default
];
No.default = _g;
var Oo = {}, Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const ts = ie, At = ts.operators, rs = {
  maximum: { okStr: "<=", ok: At.LTE, fail: At.GT },
  minimum: { okStr: ">=", ok: At.GTE, fail: At.LT },
  exclusiveMaximum: { okStr: "<", ok: At.LT, fail: At.GTE },
  exclusiveMinimum: { okStr: ">", ok: At.GT, fail: At.LTE }
}, vg = {
  message: ({ keyword: e, schemaCode: t }) => (0, ts.str)`must be ${rs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ts._)`{comparison: ${rs[e].okStr}, limit: ${t}}`
}, wg = {
  keyword: Object.keys(rs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: vg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ts._)`${r} ${rs[t].fail} ${n} || isNaN(${r})`);
  }
};
Io.default = wg;
var To = {};
Object.defineProperty(To, "__esModule", { value: !0 });
const en = ie, Eg = {
  message: ({ schemaCode: e }) => (0, en.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, en._)`{multipleOf: ${e}}`
}, bg = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Eg,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), c = a ? (0, en._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, en._)`${o} !== parseInt(${o})`;
    e.fail$data((0, en._)`(${n} === 0 || (${o} = ${r}/${n}, ${c}))`);
  }
};
To.default = bg;
var jo = {}, ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
function Eu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
ko.default = Eu;
Eu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(jo, "__esModule", { value: !0 });
const xt = ie, Sg = U, Pg = ko, Ng = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, xt._)`{limit: ${e}}`
}, Rg = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Ng,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? xt.operators.GT : xt.operators.LT, o = s.opts.unicode === !1 ? (0, xt._)`${r}.length` : (0, xt._)`${(0, Sg.useFunc)(e.gen, Pg.default)}(${r})`;
    e.fail$data((0, xt._)`${o} ${a} ${n}`);
  }
};
jo.default = Rg;
var Ao = {};
Object.defineProperty(Ao, "__esModule", { value: !0 });
const Og = ct(), Ig = U, gr = ie, Tg = {
  message: ({ schemaCode: e }) => (0, gr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, gr._)`{pattern: ${e}}`
}, jg = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Tg,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, c = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: l } = o.opts.code, d = l.code === "new RegExp" ? (0, gr._)`new RegExp` : (0, Ig.useFunc)(t, l), u = t.let("valid");
      t.try(() => t.assign(u, (0, gr._)`${d}(${a}, ${c}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, gr._)`!${u}`);
    } else {
      const l = (0, Og.usePattern)(e, s);
      e.fail$data((0, gr._)`!${l}.test(${r})`);
    }
  }
};
Ao.default = jg;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const tn = ie, kg = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, tn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, tn._)`{limit: ${e}}`
}, Ag = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: kg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? tn.operators.GT : tn.operators.LT;
    e.fail$data((0, tn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Co.default = Ag;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const Gr = ct(), rn = ie, Cg = U, Dg = {
  message: ({ params: { missingProperty: e } }) => (0, rn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, rn._)`{missingProperty: ${e}}`
}, Mg = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Dg,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: c } = o;
    if (!a && r.length === 0)
      return;
    const l = r.length >= c.loopRequired;
    if (o.allErrors ? d() : u(), c.strictRequired) {
      const y = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const g of r)
        if ((y == null ? void 0 : y[g]) === void 0 && !w.has(g)) {
          const $ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${g}" is not defined at "${$}" (strictRequired)`;
          (0, Cg.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (l || a)
        e.block$data(rn.nil, h);
      else
        for (const y of r)
          (0, Gr.checkReportMissingProp)(e, y);
    }
    function u() {
      const y = t.let("missing");
      if (l || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(y, w)), e.ok(w);
      } else
        t.if((0, Gr.checkMissingProp)(e, r, y)), (0, Gr.reportMissingProp)(e, y), t.else();
    }
    function h() {
      t.forOf("prop", n, (y) => {
        e.setParams({ missingProperty: y }), t.if((0, Gr.noPropertyInData)(t, s, y, c.ownProperties), () => e.error());
      });
    }
    function E(y, w) {
      e.setParams({ missingProperty: y }), t.forOf(y, n, () => {
        t.assign(w, (0, Gr.propertyInData)(t, s, y, c.ownProperties)), t.if((0, rn.not)(w), () => {
          e.error(), t.break();
        });
      }, rn.nil);
    }
  }
};
Do.default = Mg;
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
const nn = ie, Vg = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, nn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, nn._)`{limit: ${e}}`
}, Lg = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Vg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? nn.operators.GT : nn.operators.LT;
    e.fail$data((0, nn._)`${r}.length ${s} ${n}`);
  }
};
Mo.default = Lg;
var Vo = {}, dn = {};
Object.defineProperty(dn, "__esModule", { value: !0 });
const bu = os;
bu.code = 'require("ajv/dist/runtime/equal").default';
dn.default = bu;
Object.defineProperty(Vo, "__esModule", { value: !0 });
const Ms = be, Ie = ie, Fg = U, zg = dn, Ug = {
  message: ({ params: { i: e, j: t } }) => (0, Ie.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ie._)`{i: ${e}, j: ${t}}`
}, qg = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Ug,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: c } = e;
    if (!n && !s)
      return;
    const l = t.let("valid"), d = a.items ? (0, Ms.getSchemaTypes)(a.items) : [];
    e.block$data(l, u, (0, Ie._)`${o} === false`), e.ok(l);
    function u() {
      const w = t.let("i", (0, Ie._)`${r}.length`), g = t.let("j");
      e.setParams({ i: w, j: g }), t.assign(l, !0), t.if((0, Ie._)`${w} > 1`, () => (h() ? E : y)(w, g));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, g) {
      const $ = t.name("item"), m = (0, Ms.checkDataTypes)(d, $, c.opts.strictNumbers, Ms.DataType.Wrong), _ = t.const("indices", (0, Ie._)`{}`);
      t.for((0, Ie._)`;${w}--;`, () => {
        t.let($, (0, Ie._)`${r}[${w}]`), t.if(m, (0, Ie._)`continue`), d.length > 1 && t.if((0, Ie._)`typeof ${$} == "string"`, (0, Ie._)`${$} += "_"`), t.if((0, Ie._)`typeof ${_}[${$}] == "number"`, () => {
          t.assign(g, (0, Ie._)`${_}[${$}]`), e.error(), t.assign(l, !1).break();
        }).code((0, Ie._)`${_}[${$}] = ${w}`);
      });
    }
    function y(w, g) {
      const $ = (0, Fg.useFunc)(t, zg.default), m = t.name("outer");
      t.label(m).for((0, Ie._)`;${w}--;`, () => t.for((0, Ie._)`${g} = ${w}; ${g}--;`, () => t.if((0, Ie._)`${$}(${r}[${w}], ${r}[${g}])`, () => {
        e.error(), t.assign(l, !1).break(m);
      })));
    }
  }
};
Vo.default = qg;
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
const la = ie, Kg = U, Gg = dn, Hg = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, la._)`{allowedValue: ${e}}`
}, Bg = {
  keyword: "const",
  $data: !0,
  error: Hg,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, la._)`!${(0, Kg.useFunc)(t, Gg.default)}(${r}, ${s})`) : e.fail((0, la._)`${a} !== ${r}`);
  }
};
Lo.default = Bg;
var Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
const Jr = ie, Xg = U, Jg = dn, Wg = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Jr._)`{allowedValues: ${e}}`
}, Yg = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Wg,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const c = s.length >= o.opts.loopEnum;
    let l;
    const d = () => l ?? (l = (0, Xg.useFunc)(t, Jg.default));
    let u;
    if (c || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const y = t.const("vSchema", a);
      u = (0, Jr.or)(...s.map((w, g) => E(y, g)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (y) => t.if((0, Jr._)`${d()}(${r}, ${y})`, () => t.assign(u, !0).break()));
    }
    function E(y, w) {
      const g = s[w];
      return typeof g == "object" && g !== null ? (0, Jr._)`${d()}(${r}, ${y}[${w}])` : (0, Jr._)`${r} === ${g}`;
    }
  }
};
Fo.default = Yg;
Object.defineProperty(Oo, "__esModule", { value: !0 });
const Qg = Io, Zg = To, xg = jo, e_ = Ao, t_ = Co, r_ = Do, n_ = Mo, s_ = Vo, a_ = Lo, o_ = Fo, i_ = [
  // number
  Qg.default,
  Zg.default,
  // string
  xg.default,
  e_.default,
  // object
  t_.default,
  r_.default,
  // array
  n_.default,
  s_.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  a_.default,
  o_.default
];
Oo.default = i_;
var zo = {}, Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.validateAdditionalItems = void 0;
const er = ie, ua = U, c_ = {
  message: ({ params: { len: e } }) => (0, er.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, er._)`{limit: ${e}}`
}, l_ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: c_,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, ua.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Su(e, n);
  }
};
function Su(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const c = r.const("len", (0, er._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, er._)`${c} <= ${t.length}`);
  else if (typeof n == "object" && !(0, ua.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, er._)`${c} <= ${t.length}`);
    r.if((0, er.not)(d), () => l(d)), e.ok(d);
  }
  function l(d) {
    r.forRange("i", t.length, c, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: ua.Type.Num }, d), o.allErrors || r.if((0, er.not)(d), () => r.break());
    });
  }
}
Cr.validateAdditionalItems = Su;
Cr.default = l_;
var Uo = {}, Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.validateTuple = void 0;
const ic = ie, Hn = U, u_ = ct(), d_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Pu(e, "additionalItems", t);
    r.items = !0, !(0, Hn.alwaysValidSchema)(r, t) && e.ok((0, u_.validateArray)(e));
  }
};
function Pu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: c } = e;
  u(s), c.opts.unevaluated && r.length && c.items !== !0 && (c.items = Hn.mergeEvaluated.items(n, r.length, c.items));
  const l = n.name("valid"), d = n.const("len", (0, ic._)`${a}.length`);
  r.forEach((h, E) => {
    (0, Hn.alwaysValidSchema)(c, h) || (n.if((0, ic._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, l)), e.ok(l));
  });
  function u(h) {
    const { opts: E, errSchemaPath: y } = c, w = r.length, g = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !g) {
      const $ = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${y}"`;
      (0, Hn.checkStrictMode)(c, $, E.strictTuples);
    }
  }
}
Dr.validateTuple = Pu;
Dr.default = d_;
Object.defineProperty(Uo, "__esModule", { value: !0 });
const f_ = Dr, h_ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, f_.validateTuple)(e, "items")
};
Uo.default = h_;
var qo = {};
Object.defineProperty(qo, "__esModule", { value: !0 });
const cc = ie, m_ = U, p_ = ct(), y_ = Cr, $_ = {
  message: ({ params: { len: e } }) => (0, cc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, cc._)`{limit: ${e}}`
}, g_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: $_,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, m_.alwaysValidSchema)(n, t) && (s ? (0, y_.validateAdditionalItems)(e, s) : e.ok((0, p_.validateArray)(e)));
  }
};
qo.default = g_;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const Qe = ie, Pn = U, __ = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Qe.str)`must contain at least ${e} valid item(s)` : (0, Qe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Qe._)`{minContains: ${e}}` : (0, Qe._)`{minContains: ${e}, maxContains: ${t}}`
}, v_ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: __,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, c;
    const { minContains: l, maxContains: d } = n;
    a.opts.next ? (o = l === void 0 ? 1 : l, c = d) : o = 1;
    const u = t.const("len", (0, Qe._)`${s}.length`);
    if (e.setParams({ min: o, max: c }), c === void 0 && o === 0) {
      (0, Pn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (c !== void 0 && o > c) {
      (0, Pn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Pn.alwaysValidSchema)(a, r)) {
      let g = (0, Qe._)`${u} >= ${o}`;
      c !== void 0 && (g = (0, Qe._)`${g} && ${u} <= ${c}`), e.pass(g);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    c === void 0 && o === 1 ? y(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), c !== void 0 && t.if((0, Qe._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const g = t.name("_valid"), $ = t.let("count", 0);
      y(g, () => t.if(g, () => w($)));
    }
    function y(g, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Pn.Type.Num,
          compositeRule: !0
        }, g), $();
      });
    }
    function w(g) {
      t.code((0, Qe._)`${g}++`), c === void 0 ? t.if((0, Qe._)`${g} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Qe._)`${g} > ${c}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Qe._)`${g} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
Ko.default = v_;
var Nu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ie, r = U, n = ct();
  e.error = {
    message: ({ params: { property: l, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${l} is present`;
    },
    params: ({ params: { property: l, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${l},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(l) {
      const [d, u] = a(l);
      o(l, d), c(l, u);
    }
  };
  function a({ schema: l }) {
    const d = {}, u = {};
    for (const h in l) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(l[h]) ? d : u;
      E[h] = l[h];
    }
    return [d, u];
  }
  function o(l, d = l.schema) {
    const { gen: u, data: h, it: E } = l;
    if (Object.keys(d).length === 0)
      return;
    const y = u.let("missing");
    for (const w in d) {
      const g = d[w];
      if (g.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, w, E.opts.ownProperties);
      l.setParams({
        property: w,
        depsCount: g.length,
        deps: g.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of g)
          (0, n.checkReportMissingProp)(l, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(l, g, y)})`), (0, n.reportMissingProp)(l, y), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function c(l, d = l.schema) {
    const { gen: u, data: h, keyword: E, it: y } = l, w = u.name("valid");
    for (const g in d)
      (0, r.alwaysValidSchema)(y, d[g]) || (u.if(
        (0, n.propertyInData)(u, h, g, y.opts.ownProperties),
        () => {
          const $ = l.subschema({ keyword: E, schemaProp: g }, w);
          l.mergeValidEvaluated($, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), l.ok(w));
  }
  e.validateSchemaDeps = c, e.default = s;
})(Nu);
var Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
const Ru = ie, w_ = U, E_ = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Ru._)`{propertyName: ${e.propertyName}}`
}, b_ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: E_,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, w_.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Ru.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
Go.default = b_;
var $s = {};
Object.defineProperty($s, "__esModule", { value: !0 });
const Nn = ct(), st = ie, S_ = qt(), Rn = U, P_ = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, st._)`{additionalProperty: ${e.additionalProperty}}`
}, N_ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: P_,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: c, opts: l } = o;
    if (o.props = !0, l.removeAdditional !== "all" && (0, Rn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Nn.allSchemaProperties)(n.properties), u = (0, Nn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, st._)`${a} === ${S_.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? w($) : t.if(E($), () => w($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const _ = (0, Rn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Nn.isOwnProperty)(t, _, $);
      } else d.length ? m = (0, st.or)(...d.map((_) => (0, st._)`${$} === ${_}`)) : m = st.nil;
      return u.length && (m = (0, st.or)(m, ...u.map((_) => (0, st._)`${(0, Nn.usePattern)(e, _)}.test(${$})`))), (0, st.not)(m);
    }
    function y($) {
      t.code((0, st._)`delete ${s}[${$}]`);
    }
    function w($) {
      if (l.removeAdditional === "all" || l.removeAdditional && r === !1) {
        y($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), c || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Rn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        l.removeAdditional === "failing" ? (g($, m, !1), t.if((0, st.not)(m), () => {
          e.reset(), y($);
        })) : (g($, m), c || t.if((0, st.not)(m), () => t.break()));
      }
    }
    function g($, m, _) {
      const S = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: Rn.Type.Str
      };
      _ === !1 && Object.assign(S, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(S, m);
    }
  }
};
$s.default = N_;
var Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
const R_ = hs(), lc = ct(), Vs = U, uc = $s, O_ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && uc.default.code(new R_.KeywordCxt(a, uc.default, "additionalProperties"));
    const o = (0, lc.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Vs.mergeEvaluated.props(t, (0, Vs.toHash)(o), a.props));
    const c = o.filter((h) => !(0, Vs.alwaysValidSchema)(a, r[h]));
    if (c.length === 0)
      return;
    const l = t.name("valid");
    for (const h of c)
      d(h) ? u(h) : (t.if((0, lc.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(l, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(l);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, l);
    }
  }
};
Ho.default = O_;
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
const dc = ct(), On = ie, fc = U, hc = U, I_ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, c = (0, dc.allSchemaProperties)(r), l = c.filter((g) => (0, fc.alwaysValidSchema)(a, r[g]));
    if (c.length === 0 || l.length === c.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof On.Name) && (a.props = (0, hc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const g of c)
        d && y(g), a.allErrors ? w(g) : (t.var(u, !0), w(g), t.if(u));
    }
    function y(g) {
      for (const $ in d)
        new RegExp(g).test($) && (0, fc.checkStrictMode)(a, `property ${$} matches pattern ${g} (use allowMatchingProperties)`);
    }
    function w(g) {
      t.forIn("key", n, ($) => {
        t.if((0, On._)`${(0, dc.usePattern)(e, g)}.test(${$})`, () => {
          const m = l.includes(g);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: g,
            dataProp: $,
            dataPropType: hc.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, On._)`${h}[${$}]`, !0) : !m && !a.allErrors && t.if((0, On.not)(u), () => t.break());
        });
      });
    }
  }
};
Bo.default = I_;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const T_ = U, j_ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, T_.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Xo.default = j_;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const k_ = ct(), A_ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: k_.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Jo.default = A_;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const Bn = ie, C_ = U, D_ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Bn._)`{passingSchemas: ${e.passing}}`
}, M_ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: D_,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), c = t.let("passing", null), l = t.name("_valid");
    e.setParams({ passing: c }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let E;
        (0, C_.alwaysValidSchema)(s, u) ? t.var(l, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, l), h > 0 && t.if((0, Bn._)`${l} && ${o}`).assign(o, !1).assign(c, (0, Bn._)`[${c}, ${h}]`).else(), t.if(l, () => {
          t.assign(o, !0), t.assign(c, h), E && e.mergeEvaluated(E, Bn.Name);
        });
      });
    }
  }
};
Wo.default = M_;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const V_ = U, L_ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, V_.alwaysValidSchema)(n, a))
        return;
      const c = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(c);
    });
  }
};
Yo.default = L_;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const ns = ie, Ou = U, F_ = {
  message: ({ params: e }) => (0, ns.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ns._)`{failingKeyword: ${e.ifClause}}`
}, z_ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: F_,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Ou.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = mc(n, "then"), a = mc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), c = t.name("_valid");
    if (l(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(c, d("then", u), d("else", u));
    } else s ? t.if(c, d("then")) : t.if((0, ns.not)(c), d("else"));
    e.pass(o, () => e.error(!0));
    function l() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, c);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const E = e.subschema({ keyword: u }, c);
        t.assign(o, c), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, ns._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function mc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Ou.alwaysValidSchema)(e, r);
}
Qo.default = z_;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const U_ = U, q_ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, U_.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
Zo.default = q_;
Object.defineProperty(zo, "__esModule", { value: !0 });
const K_ = Cr, G_ = Uo, H_ = Dr, B_ = qo, X_ = Ko, J_ = Nu, W_ = Go, Y_ = $s, Q_ = Ho, Z_ = Bo, x_ = Xo, ev = Jo, tv = Wo, rv = Yo, nv = Qo, sv = Zo;
function av(e = !1) {
  const t = [
    // any
    x_.default,
    ev.default,
    tv.default,
    rv.default,
    nv.default,
    sv.default,
    // object
    W_.default,
    Y_.default,
    J_.default,
    Q_.default,
    Z_.default
  ];
  return e ? t.push(G_.default, B_.default) : t.push(K_.default, H_.default), t.push(X_.default), t;
}
zo.default = av;
var xo = {}, ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const we = ie, ov = {
  message: ({ schemaCode: e }) => (0, we.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, we._)`{format: ${e}}`
}, iv = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: ov,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: c } = e, { opts: l, errSchemaPath: d, schemaEnv: u, self: h } = c;
    if (!l.validateFormats)
      return;
    s ? E() : y();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: l.code.formats
      }), g = r.const("fDef", (0, we._)`${w}[${o}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, we._)`typeof ${g} == "object" && !(${g} instanceof RegExp)`, () => r.assign($, (0, we._)`${g}.type || "string"`).assign(m, (0, we._)`${g}.validate`), () => r.assign($, (0, we._)`"string"`).assign(m, g)), e.fail$data((0, we.or)(_(), S()));
      function _() {
        return l.strictSchema === !1 ? we.nil : (0, we._)`${o} && !${m}`;
      }
      function S() {
        const O = u.$async ? (0, we._)`(${g}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, we._)`${m}(${n})`, T = (0, we._)`(typeof ${m} == "function" ? ${O} : ${m}.test(${n}))`;
        return (0, we._)`${m} && ${m} !== true && ${$} === ${t} && !${T}`;
      }
    }
    function y() {
      const w = h.formats[a];
      if (!w) {
        _();
        return;
      }
      if (w === !0)
        return;
      const [g, $, m] = S(w);
      g === t && e.pass(O());
      function _() {
        if (l.strictSchema === !1) {
          h.logger.warn(T());
          return;
        }
        throw new Error(T());
        function T() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function S(T) {
        const V = T instanceof RegExp ? (0, we.regexpCode)(T) : l.code.formats ? (0, we._)`${l.code.formats}${(0, we.getProperty)(a)}` : void 0, K = r.scopeValue("formats", { key: a, ref: T, code: V });
        return typeof T == "object" && !(T instanceof RegExp) ? [T.type || "string", T.validate, (0, we._)`${K}.validate`] : ["string", T, K];
      }
      function O() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, we._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, we._)`${m}(${n})` : (0, we._)`${m}.test(${n})`;
      }
    }
  }
};
ei.default = iv;
Object.defineProperty(xo, "__esModule", { value: !0 });
const cv = ei, lv = [cv.default];
xo.default = lv;
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.contentVocabulary = Or.metadataVocabulary = void 0;
Or.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Or.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Po, "__esModule", { value: !0 });
const uv = No, dv = Oo, fv = zo, hv = xo, pc = Or, mv = [
  uv.default,
  dv.default,
  (0, fv.default)(),
  hv.default,
  pc.metadataVocabulary,
  pc.contentVocabulary
];
Po.default = mv;
var ti = {}, gs = {};
Object.defineProperty(gs, "__esModule", { value: !0 });
gs.DiscrError = void 0;
var yc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(yc || (gs.DiscrError = yc = {}));
Object.defineProperty(ti, "__esModule", { value: !0 });
const hr = ie, da = gs, $c = Be, pv = ms(), yv = U, $v = {
  message: ({ params: { discrError: e, tagName: t } }) => e === da.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, hr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, gv = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: $v,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const c = n.propertyName;
    if (typeof c != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const l = t.let("valid", !1), d = t.const("tag", (0, hr._)`${r}${(0, hr.getProperty)(c)}`);
    t.if((0, hr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: da.DiscrError.Tag, tag: d, tagName: c })), e.ok(l);
    function u() {
      const y = E();
      t.if(!1);
      for (const w in y)
        t.elseIf((0, hr._)`${d} === ${w}`), t.assign(l, h(y[w]));
      t.else(), e.error(!1, { discrError: da.DiscrError.Mapping, tag: d, tagName: c }), t.endIf();
    }
    function h(y) {
      const w = t.name("valid"), g = e.subschema({ keyword: "oneOf", schemaProp: y }, w);
      return e.mergeEvaluated(g, hr.Name), w;
    }
    function E() {
      var y;
      const w = {}, g = m(s);
      let $ = !0;
      for (let O = 0; O < o.length; O++) {
        let T = o[O];
        if (T != null && T.$ref && !(0, yv.schemaHasRulesButRef)(T, a.self.RULES)) {
          const K = T.$ref;
          if (T = $c.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, K), T instanceof $c.SchemaEnv && (T = T.schema), T === void 0)
            throw new pv.default(a.opts.uriResolver, a.baseId, K);
        }
        const V = (y = T == null ? void 0 : T.properties) === null || y === void 0 ? void 0 : y[c];
        if (typeof V != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${c}"`);
        $ = $ && (g || m(T)), _(V, O);
      }
      if (!$)
        throw new Error(`discriminator: "${c}" must be required`);
      return w;
      function m({ required: O }) {
        return Array.isArray(O) && O.includes(c);
      }
      function _(O, T) {
        if (O.const)
          S(O.const, T);
        else if (O.enum)
          for (const V of O.enum)
            S(V, T);
        else
          throw new Error(`discriminator: "properties/${c}" must have "const" or "enum"`);
      }
      function S(O, T) {
        if (typeof O != "string" || O in w)
          throw new Error(`discriminator: "${c}" values must be unique strings`);
        w[O] = T;
      }
    }
  }
};
ti.default = gv;
const _v = "http://json-schema.org/draft-07/schema#", vv = "http://json-schema.org/draft-07/schema#", wv = "Core schema meta-schema", Ev = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, bv = [
  "object",
  "boolean"
], Sv = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Pv = {
  $schema: _v,
  $id: vv,
  title: wv,
  definitions: Ev,
  type: bv,
  properties: Sv,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = au, n = Po, s = ti, a = Pv, o = ["/properties"], c = "http://json-schema.org/draft-07/schema";
  class l extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((w) => this.addVocabulary(w)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const w = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(w, c, !1), this.refs["http://json-schema.org/schema"] = c;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
    }
  }
  t.Ajv = l, e.exports = t = l, e.exports.Ajv = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var d = hs();
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = ie;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var h = Eo();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = ms();
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(sa, sa.exports);
var Nv = sa.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Nv, r = ie, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: c, schemaCode: l }) => (0, r.str)`should be ${s[c].okStr} ${l}`,
    params: ({ keyword: c, schemaCode: l }) => (0, r._)`{comparison: ${s[c].okStr}, limit: ${l}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(c) {
      const { gen: l, data: d, schemaCode: u, keyword: h, it: E } = c, { opts: y, self: w } = E;
      if (!y.validateFormats)
        return;
      const g = new t.KeywordCxt(E, w.RULES.all.format.definition, "format");
      g.$data ? $() : m();
      function $() {
        const S = l.scopeValue("formats", {
          ref: w.formats,
          code: y.code.formats
        }), O = l.const("fmt", (0, r._)`${S}[${g.schemaCode}]`);
        c.fail$data((0, r.or)((0, r._)`typeof ${O} != "object"`, (0, r._)`${O} instanceof RegExp`, (0, r._)`typeof ${O}.compare != "function"`, _(O)));
      }
      function m() {
        const S = g.schema, O = w.formats[S];
        if (!O || O === !0)
          return;
        if (typeof O != "object" || O instanceof RegExp || typeof O.compare != "function")
          throw new Error(`"${h}": format "${S}" does not define "compare" function`);
        const T = l.scopeValue("formats", {
          key: S,
          ref: O,
          code: y.code.formats ? (0, r._)`${y.code.formats}${(0, r.getProperty)(S)}` : void 0
        });
        c.fail$data(_(T));
      }
      function _(S) {
        return (0, r._)`${S}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (c) => (c.addKeyword(e.formatLimitDefinition), c);
  e.default = o;
})(su);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = nu, n = su, s = ie, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), c = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return l(d, u, r.fullFormats, a), d;
    const [h, E] = u.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], y = u.formats || r.formatNames;
    return l(d, y, h, E), u.keywords && (0, n.default)(d), d;
  };
  c.get = (d, u = "full") => {
    const E = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!E)
      throw new Error(`Unknown format "${d}"`);
    return E;
  };
  function l(d, u, h, E) {
    var y, w;
    (y = (w = d.opts.code).formats) !== null && y !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const g of u)
      d.addFormat(g, h[g]);
  }
  e.exports = t = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
})(na, na.exports);
var Rv = na.exports;
const Ov = /* @__PURE__ */ nl(Rv), Iv = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !Tv(s, a) && n || Object.defineProperty(e, r, a);
}, Tv = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, jv = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, kv = (e, t) => `/* Wrapped ${e}*/
${t}`, Av = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Cv = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Dv = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = kv.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Cv);
  const { writable: a, enumerable: o, configurable: c } = Av;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: c });
};
function Mv(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    Iv(e, t, s, r);
  return jv(e, t), Dv(e, t, n), e;
}
const gc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, c, l;
  const d = function(...u) {
    const h = this, E = () => {
      o = void 0, c && (clearTimeout(c), c = void 0), a && (l = e.apply(h, u));
    }, y = () => {
      c = void 0, o && (clearTimeout(o), o = void 0), a && (l = e.apply(h, u));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !c && (c = setTimeout(y, n)), w && (l = e.apply(h, u)), l;
  };
  return Mv(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), c && (clearTimeout(c), c = void 0);
  }, d;
};
var fa = { exports: {} };
const Vv = "2.0.0", Iu = 256, Lv = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Fv = 16, zv = Iu - 6, Uv = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var _s = {
  MAX_LENGTH: Iu,
  MAX_SAFE_COMPONENT_LENGTH: Fv,
  MAX_SAFE_BUILD_LENGTH: zv,
  MAX_SAFE_INTEGER: Lv,
  RELEASE_TYPES: Uv,
  SEMVER_SPEC_VERSION: Vv,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const qv = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var vs = qv;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = _s, a = vs;
  t = e.exports = {};
  const o = t.re = [], c = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const E = "[a-zA-Z0-9-]", y = [
    ["\\s", 1],
    ["\\d", s],
    [E, n]
  ], w = ($) => {
    for (const [m, _] of y)
      $ = $.split(`${m}*`).join(`${m}{0,${_}}`).split(`${m}+`).join(`${m}{1,${_}}`);
    return $;
  }, g = ($, m, _) => {
    const S = w(m), O = h++;
    a($, O, m), u[$] = O, l[O] = m, d[O] = S, o[O] = new RegExp(m, _ ? "g" : void 0), c[O] = new RegExp(S, _ ? "g" : void 0);
  };
  g("NUMERICIDENTIFIER", "0|[1-9]\\d*"), g("NUMERICIDENTIFIERLOOSE", "\\d+"), g("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), g("MAINVERSION", `(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})\\.(${l[u.NUMERICIDENTIFIER]})`), g("MAINVERSIONLOOSE", `(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})\\.(${l[u.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASEIDENTIFIER", `(?:${l[u.NONNUMERICIDENTIFIER]}|${l[u.NUMERICIDENTIFIER]})`), g("PRERELEASEIDENTIFIERLOOSE", `(?:${l[u.NONNUMERICIDENTIFIER]}|${l[u.NUMERICIDENTIFIERLOOSE]})`), g("PRERELEASE", `(?:-(${l[u.PRERELEASEIDENTIFIER]}(?:\\.${l[u.PRERELEASEIDENTIFIER]})*))`), g("PRERELEASELOOSE", `(?:-?(${l[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[u.PRERELEASEIDENTIFIERLOOSE]})*))`), g("BUILDIDENTIFIER", `${E}+`), g("BUILD", `(?:\\+(${l[u.BUILDIDENTIFIER]}(?:\\.${l[u.BUILDIDENTIFIER]})*))`), g("FULLPLAIN", `v?${l[u.MAINVERSION]}${l[u.PRERELEASE]}?${l[u.BUILD]}?`), g("FULL", `^${l[u.FULLPLAIN]}$`), g("LOOSEPLAIN", `[v=\\s]*${l[u.MAINVERSIONLOOSE]}${l[u.PRERELEASELOOSE]}?${l[u.BUILD]}?`), g("LOOSE", `^${l[u.LOOSEPLAIN]}$`), g("GTLT", "((?:<|>)?=?)"), g("XRANGEIDENTIFIERLOOSE", `${l[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), g("XRANGEIDENTIFIER", `${l[u.NUMERICIDENTIFIER]}|x|X|\\*`), g("XRANGEPLAIN", `[v=\\s]*(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:\\.(${l[u.XRANGEIDENTIFIER]})(?:${l[u.PRERELEASE]})?${l[u.BUILD]}?)?)?`), g("XRANGEPLAINLOOSE", `[v=\\s]*(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[u.XRANGEIDENTIFIERLOOSE]})(?:${l[u.PRERELEASELOOSE]})?${l[u.BUILD]}?)?)?`), g("XRANGE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAIN]}$`), g("XRANGELOOSE", `^${l[u.GTLT]}\\s*${l[u.XRANGEPLAINLOOSE]}$`), g("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), g("COERCE", `${l[u.COERCEPLAIN]}(?:$|[^\\d])`), g("COERCEFULL", l[u.COERCEPLAIN] + `(?:${l[u.PRERELEASE]})?(?:${l[u.BUILD]})?(?:$|[^\\d])`), g("COERCERTL", l[u.COERCE], !0), g("COERCERTLFULL", l[u.COERCEFULL], !0), g("LONETILDE", "(?:~>?)"), g("TILDETRIM", `(\\s*)${l[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", g("TILDE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAIN]}$`), g("TILDELOOSE", `^${l[u.LONETILDE]}${l[u.XRANGEPLAINLOOSE]}$`), g("LONECARET", "(?:\\^)"), g("CARETTRIM", `(\\s*)${l[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", g("CARET", `^${l[u.LONECARET]}${l[u.XRANGEPLAIN]}$`), g("CARETLOOSE", `^${l[u.LONECARET]}${l[u.XRANGEPLAINLOOSE]}$`), g("COMPARATORLOOSE", `^${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]})$|^$`), g("COMPARATOR", `^${l[u.GTLT]}\\s*(${l[u.FULLPLAIN]})$|^$`), g("COMPARATORTRIM", `(\\s*)${l[u.GTLT]}\\s*(${l[u.LOOSEPLAIN]}|${l[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", g("HYPHENRANGE", `^\\s*(${l[u.XRANGEPLAIN]})\\s+-\\s+(${l[u.XRANGEPLAIN]})\\s*$`), g("HYPHENRANGELOOSE", `^\\s*(${l[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[u.XRANGEPLAINLOOSE]})\\s*$`), g("STAR", "(<|>)?=?\\s*\\*"), g("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), g("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(fa, fa.exports);
var fn = fa.exports;
const Kv = Object.freeze({ loose: !0 }), Gv = Object.freeze({}), Hv = (e) => e ? typeof e != "object" ? Kv : e : Gv;
var ri = Hv;
const _c = /^[0-9]+$/, Tu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = _c.test(e), n = _c.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Bv = (e, t) => Tu(t, e);
var ju = {
  compareIdentifiers: Tu,
  rcompareIdentifiers: Bv
};
const In = vs, { MAX_LENGTH: vc, MAX_SAFE_INTEGER: Tn } = _s, { safeRe: jn, t: kn } = fn, Xv = ri, { compareIdentifiers: Ls } = ju;
let Jv = class ht {
  constructor(t, r) {
    if (r = Xv(r), t instanceof ht) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > vc)
      throw new TypeError(
        `version is longer than ${vc} characters`
      );
    In("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? jn[kn.LOOSE] : jn[kn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Tn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Tn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Tn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < Tn)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (In("SemVer.compare", this.version, this.options, t), !(t instanceof ht)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ht(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ht || (t = new ht(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ht || (t = new ht(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (In("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ls(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ht || (t = new ht(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (In("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ls(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? jn[kn.PRERELEASELOOSE] : jn[kn.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), Ls(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ue = Jv;
const wc = Ue, Wv = (e, t, r = !1) => {
  if (e instanceof wc)
    return e;
  try {
    return new wc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Mr = Wv;
const Yv = Mr, Qv = (e, t) => {
  const r = Yv(e, t);
  return r ? r.version : null;
};
var Zv = Qv;
const xv = Mr, ew = (e, t) => {
  const r = xv(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var tw = ew;
const Ec = Ue, rw = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Ec(
      e instanceof Ec ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var nw = rw;
const bc = Mr, sw = (e, t) => {
  const r = bc(e, null, !0), n = bc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, c = a ? n : r, l = !!o.prerelease.length;
  if (!!c.prerelease.length && !l) {
    if (!c.patch && !c.minor)
      return "major";
    if (c.compareMain(o) === 0)
      return c.minor && !c.patch ? "minor" : "patch";
  }
  const u = l ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var aw = sw;
const ow = Ue, iw = (e, t) => new ow(e, t).major;
var cw = iw;
const lw = Ue, uw = (e, t) => new lw(e, t).minor;
var dw = uw;
const fw = Ue, hw = (e, t) => new fw(e, t).patch;
var mw = hw;
const pw = Mr, yw = (e, t) => {
  const r = pw(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var $w = yw;
const Sc = Ue, gw = (e, t, r) => new Sc(e, r).compare(new Sc(t, r));
var lt = gw;
const _w = lt, vw = (e, t, r) => _w(t, e, r);
var ww = vw;
const Ew = lt, bw = (e, t) => Ew(e, t, !0);
var Sw = bw;
const Pc = Ue, Pw = (e, t, r) => {
  const n = new Pc(e, r), s = new Pc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var ni = Pw;
const Nw = ni, Rw = (e, t) => e.sort((r, n) => Nw(r, n, t));
var Ow = Rw;
const Iw = ni, Tw = (e, t) => e.sort((r, n) => Iw(n, r, t));
var jw = Tw;
const kw = lt, Aw = (e, t, r) => kw(e, t, r) > 0;
var ws = Aw;
const Cw = lt, Dw = (e, t, r) => Cw(e, t, r) < 0;
var si = Dw;
const Mw = lt, Vw = (e, t, r) => Mw(e, t, r) === 0;
var ku = Vw;
const Lw = lt, Fw = (e, t, r) => Lw(e, t, r) !== 0;
var Au = Fw;
const zw = lt, Uw = (e, t, r) => zw(e, t, r) >= 0;
var ai = Uw;
const qw = lt, Kw = (e, t, r) => qw(e, t, r) <= 0;
var oi = Kw;
const Gw = ku, Hw = Au, Bw = ws, Xw = ai, Jw = si, Ww = oi, Yw = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return Gw(e, r, n);
    case "!=":
      return Hw(e, r, n);
    case ">":
      return Bw(e, r, n);
    case ">=":
      return Xw(e, r, n);
    case "<":
      return Jw(e, r, n);
    case "<=":
      return Ww(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Cu = Yw;
const Qw = Ue, Zw = Mr, { safeRe: An, t: Cn } = fn, xw = (e, t) => {
  if (e instanceof Qw)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? An[Cn.COERCEFULL] : An[Cn.COERCE]);
  else {
    const l = t.includePrerelease ? An[Cn.COERCERTLFULL] : An[Cn.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", c = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Zw(`${n}.${s}.${a}${o}${c}`, t);
};
var eE = xw;
class tE {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var rE = tE, Fs, Nc;
function ut() {
  if (Nc) return Fs;
  Nc = 1;
  const e = /\s+/g;
  class t {
    constructor(D, G) {
      if (G = s(G), D instanceof t)
        return D.loose === !!G.loose && D.includePrerelease === !!G.includePrerelease ? D : new t(D.raw, G);
      if (D instanceof a)
        return this.raw = D.value, this.set = [[D]], this.formatted = void 0, this;
      if (this.options = G, this.loose = !!G.loose, this.includePrerelease = !!G.includePrerelease, this.raw = D.trim().replace(e, " "), this.set = this.raw.split("||").map((z) => this.parseRange(z.trim())).filter((z) => z.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const z = this.set[0];
        if (this.set = this.set.filter((W) => !g(W[0])), this.set.length === 0)
          this.set = [z];
        else if (this.set.length > 1) {
          for (const W of this.set)
            if (W.length === 1 && $(W[0])) {
              this.set = [W];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let D = 0; D < this.set.length; D++) {
          D > 0 && (this.formatted += "||");
          const G = this.set[D];
          for (let z = 0; z < G.length; z++)
            z > 0 && (this.formatted += " "), this.formatted += G[z].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(D) {
      const z = ((this.options.includePrerelease && y) | (this.options.loose && w)) + ":" + D, W = n.get(z);
      if (W)
        return W;
      const q = this.options.loose, N = q ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      D = D.replace(N, J(this.options.includePrerelease)), o("hyphen replace", D), D = D.replace(l[d.COMPARATORTRIM], u), o("comparator trim", D), D = D.replace(l[d.TILDETRIM], h), o("tilde trim", D), D = D.replace(l[d.CARETTRIM], E), o("caret trim", D);
      let p = D.split(" ").map((f) => _(f, this.options)).join(" ").split(/\s+/).map((f) => F(f, this.options));
      q && (p = p.filter((f) => (o("loose invalid filter", f, this.options), !!f.match(l[d.COMPARATORLOOSE])))), o("range list", p);
      const P = /* @__PURE__ */ new Map(), v = p.map((f) => new a(f, this.options));
      for (const f of v) {
        if (g(f))
          return [f];
        P.set(f.value, f);
      }
      P.size > 1 && P.has("") && P.delete("");
      const i = [...P.values()];
      return n.set(z, i), i;
    }
    intersects(D, G) {
      if (!(D instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((z) => m(z, G) && D.set.some((W) => m(W, G) && z.every((q) => W.every((N) => q.intersects(N, G)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(D) {
      if (!D)
        return !1;
      if (typeof D == "string")
        try {
          D = new c(D, this.options);
        } catch {
          return !1;
        }
      for (let G = 0; G < this.set.length; G++)
        if (Q(this.set[G], D, this.options))
          return !0;
      return !1;
    }
  }
  Fs = t;
  const r = rE, n = new r(), s = ri, a = Es(), o = vs, c = Ue, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = fn, { FLAG_INCLUDE_PRERELEASE: y, FLAG_LOOSE: w } = _s, g = (j) => j.value === "<0.0.0-0", $ = (j) => j.value === "", m = (j, D) => {
    let G = !0;
    const z = j.slice();
    let W = z.pop();
    for (; G && z.length; )
      G = z.every((q) => W.intersects(q, D)), W = z.pop();
    return G;
  }, _ = (j, D) => (j = j.replace(l[d.BUILD], ""), o("comp", j, D), j = V(j, D), o("caret", j), j = O(j, D), o("tildes", j), j = ne(j, D), o("xrange", j), j = ue(j, D), o("stars", j), j), S = (j) => !j || j.toLowerCase() === "x" || j === "*", O = (j, D) => j.trim().split(/\s+/).map((G) => T(G, D)).join(" "), T = (j, D) => {
    const G = D.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return j.replace(G, (z, W, q, N, p) => {
      o("tilde", j, z, W, q, N, p);
      let P;
      return S(W) ? P = "" : S(q) ? P = `>=${W}.0.0 <${+W + 1}.0.0-0` : S(N) ? P = `>=${W}.${q}.0 <${W}.${+q + 1}.0-0` : p ? (o("replaceTilde pr", p), P = `>=${W}.${q}.${N}-${p} <${W}.${+q + 1}.0-0`) : P = `>=${W}.${q}.${N} <${W}.${+q + 1}.0-0`, o("tilde return", P), P;
    });
  }, V = (j, D) => j.trim().split(/\s+/).map((G) => K(G, D)).join(" "), K = (j, D) => {
    o("caret", j, D);
    const G = D.loose ? l[d.CARETLOOSE] : l[d.CARET], z = D.includePrerelease ? "-0" : "";
    return j.replace(G, (W, q, N, p, P) => {
      o("caret", j, W, q, N, p, P);
      let v;
      return S(q) ? v = "" : S(N) ? v = `>=${q}.0.0${z} <${+q + 1}.0.0-0` : S(p) ? q === "0" ? v = `>=${q}.${N}.0${z} <${q}.${+N + 1}.0-0` : v = `>=${q}.${N}.0${z} <${+q + 1}.0.0-0` : P ? (o("replaceCaret pr", P), q === "0" ? N === "0" ? v = `>=${q}.${N}.${p}-${P} <${q}.${N}.${+p + 1}-0` : v = `>=${q}.${N}.${p}-${P} <${q}.${+N + 1}.0-0` : v = `>=${q}.${N}.${p}-${P} <${+q + 1}.0.0-0`) : (o("no pr"), q === "0" ? N === "0" ? v = `>=${q}.${N}.${p}${z} <${q}.${N}.${+p + 1}-0` : v = `>=${q}.${N}.${p}${z} <${q}.${+N + 1}.0-0` : v = `>=${q}.${N}.${p} <${+q + 1}.0.0-0`), o("caret return", v), v;
    });
  }, ne = (j, D) => (o("replaceXRanges", j, D), j.split(/\s+/).map((G) => le(G, D)).join(" ")), le = (j, D) => {
    j = j.trim();
    const G = D.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return j.replace(G, (z, W, q, N, p, P) => {
      o("xRange", j, z, W, q, N, p, P);
      const v = S(q), i = v || S(N), f = i || S(p), b = f;
      return W === "=" && b && (W = ""), P = D.includePrerelease ? "-0" : "", v ? W === ">" || W === "<" ? z = "<0.0.0-0" : z = "*" : W && b ? (i && (N = 0), p = 0, W === ">" ? (W = ">=", i ? (q = +q + 1, N = 0, p = 0) : (N = +N + 1, p = 0)) : W === "<=" && (W = "<", i ? q = +q + 1 : N = +N + 1), W === "<" && (P = "-0"), z = `${W + q}.${N}.${p}${P}`) : i ? z = `>=${q}.0.0${P} <${+q + 1}.0.0-0` : f && (z = `>=${q}.${N}.0${P} <${q}.${+N + 1}.0-0`), o("xRange return", z), z;
    });
  }, ue = (j, D) => (o("replaceStars", j, D), j.trim().replace(l[d.STAR], "")), F = (j, D) => (o("replaceGTE0", j, D), j.trim().replace(l[D.includePrerelease ? d.GTE0PRE : d.GTE0], "")), J = (j) => (D, G, z, W, q, N, p, P, v, i, f, b) => (S(z) ? G = "" : S(W) ? G = `>=${z}.0.0${j ? "-0" : ""}` : S(q) ? G = `>=${z}.${W}.0${j ? "-0" : ""}` : N ? G = `>=${G}` : G = `>=${G}${j ? "-0" : ""}`, S(v) ? P = "" : S(i) ? P = `<${+v + 1}.0.0-0` : S(f) ? P = `<${v}.${+i + 1}.0-0` : b ? P = `<=${v}.${i}.${f}-${b}` : j ? P = `<${v}.${i}.${+f + 1}-0` : P = `<=${P}`, `${G} ${P}`.trim()), Q = (j, D, G) => {
    for (let z = 0; z < j.length; z++)
      if (!j[z].test(D))
        return !1;
    if (D.prerelease.length && !G.includePrerelease) {
      for (let z = 0; z < j.length; z++)
        if (o(j[z].semver), j[z].semver !== a.ANY && j[z].semver.prerelease.length > 0) {
          const W = j[z].semver;
          if (W.major === D.major && W.minor === D.minor && W.patch === D.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Fs;
}
var zs, Rc;
function Es() {
  if (Rc) return zs;
  Rc = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, h) {
      if (h = r(h), u instanceof t) {
        if (u.loose === !!h.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), o("comparator", u, h), this.options = h, this.loose = !!h.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(u) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], E = u.match(h);
      if (!E)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new c(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (o("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new c(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new l(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  zs = t;
  const r = ri, { safeRe: n, t: s } = fn, a = Cu, o = vs, c = Ue, l = ut();
  return zs;
}
const nE = ut(), sE = (e, t, r) => {
  try {
    t = new nE(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var bs = sE;
const aE = ut(), oE = (e, t) => new aE(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var iE = oE;
const cE = Ue, lE = ut(), uE = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new lE(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new cE(n, r));
  }), n;
};
var dE = uE;
const fE = Ue, hE = ut(), mE = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new hE(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new fE(n, r));
  }), n;
};
var pE = mE;
const Us = Ue, yE = ut(), Oc = ws, $E = (e, t) => {
  e = new yE(e, t);
  let r = new Us("0.0.0");
  if (e.test(r) || (r = new Us("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const c = new Us(o.semver.version);
      switch (o.operator) {
        case ">":
          c.prerelease.length === 0 ? c.patch++ : c.prerelease.push(0), c.raw = c.format();
        case "":
        case ">=":
          (!a || Oc(c, a)) && (a = c);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Oc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var gE = $E;
const _E = ut(), vE = (e, t) => {
  try {
    return new _E(e, t).range || "*";
  } catch {
    return null;
  }
};
var wE = vE;
const EE = Ue, Du = Es(), { ANY: bE } = Du, SE = ut(), PE = bs, Ic = ws, Tc = si, NE = oi, RE = ai, OE = (e, t, r, n) => {
  e = new EE(e, n), t = new SE(t, n);
  let s, a, o, c, l;
  switch (r) {
    case ">":
      s = Ic, a = NE, o = Tc, c = ">", l = ">=";
      break;
    case "<":
      s = Tc, a = RE, o = Ic, c = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (PE(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, E = null;
    if (u.forEach((y) => {
      y.semver === bE && (y = new Du(">=0.0.0")), h = h || y, E = E || y, s(y.semver, h.semver, n) ? h = y : o(y.semver, E.semver, n) && (E = y);
    }), h.operator === c || h.operator === l || (!E.operator || E.operator === c) && a(e, E.semver))
      return !1;
    if (E.operator === l && o(e, E.semver))
      return !1;
  }
  return !0;
};
var ii = OE;
const IE = ii, TE = (e, t, r) => IE(e, t, ">", r);
var jE = TE;
const kE = ii, AE = (e, t, r) => kE(e, t, "<", r);
var CE = AE;
const jc = ut(), DE = (e, t, r) => (e = new jc(e, r), t = new jc(t, r), e.intersects(t, r));
var ME = DE;
const VE = bs, LE = lt;
var FE = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((u, h) => LE(u, h, r));
  for (const u of o)
    VE(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const c = [];
  for (const [u, h] of n)
    u === h ? c.push(u) : !h && u === o[0] ? c.push("*") : h ? u === o[0] ? c.push(`<=${h}`) : c.push(`${u} - ${h}`) : c.push(`>=${u}`);
  const l = c.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const kc = ut(), ci = Es(), { ANY: qs } = ci, Hr = bs, li = lt, zE = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new kc(e, r), t = new kc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = qE(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, UE = [new ci(">=0.0.0-0")], Ac = [new ci(">=0.0.0")], qE = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === qs) {
    if (t.length === 1 && t[0].semver === qs)
      return !0;
    r.includePrerelease ? e = UE : e = Ac;
  }
  if (t.length === 1 && t[0].semver === qs) {
    if (r.includePrerelease)
      return !0;
    t = Ac;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const y of e)
    y.operator === ">" || y.operator === ">=" ? s = Cc(s, y, r) : y.operator === "<" || y.operator === "<=" ? a = Dc(a, y, r) : n.add(y.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = li(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const y of n) {
    if (s && !Hr(y, String(s), r) || a && !Hr(y, String(a), r))
      return null;
    for (const w of t)
      if (!Hr(y, String(w), r))
        return !1;
    return !0;
  }
  let c, l, d, u, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const y of t) {
    if (u = u || y.operator === ">" || y.operator === ">=", d = d || y.operator === "<" || y.operator === "<=", s) {
      if (E && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === E.major && y.semver.minor === E.minor && y.semver.patch === E.patch && (E = !1), y.operator === ">" || y.operator === ">=") {
        if (c = Cc(s, y, r), c === y && c !== s)
          return !1;
      } else if (s.operator === ">=" && !Hr(s.semver, String(y), r))
        return !1;
    }
    if (a) {
      if (h && y.semver.prerelease && y.semver.prerelease.length && y.semver.major === h.major && y.semver.minor === h.minor && y.semver.patch === h.patch && (h = !1), y.operator === "<" || y.operator === "<=") {
        if (l = Dc(a, y, r), l === y && l !== a)
          return !1;
      } else if (a.operator === "<=" && !Hr(a.semver, String(y), r))
        return !1;
    }
    if (!y.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && u && !s && o !== 0 || E || h);
}, Cc = (e, t, r) => {
  if (!e)
    return t;
  const n = li(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Dc = (e, t, r) => {
  if (!e)
    return t;
  const n = li(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var KE = zE;
const Ks = fn, Mc = _s, GE = Ue, Vc = ju, HE = Mr, BE = Zv, XE = tw, JE = nw, WE = aw, YE = cw, QE = dw, ZE = mw, xE = $w, eb = lt, tb = ww, rb = Sw, nb = ni, sb = Ow, ab = jw, ob = ws, ib = si, cb = ku, lb = Au, ub = ai, db = oi, fb = Cu, hb = eE, mb = Es(), pb = ut(), yb = bs, $b = iE, gb = dE, _b = pE, vb = gE, wb = wE, Eb = ii, bb = jE, Sb = CE, Pb = ME, Nb = FE, Rb = KE;
var Ob = {
  parse: HE,
  valid: BE,
  clean: XE,
  inc: JE,
  diff: WE,
  major: YE,
  minor: QE,
  patch: ZE,
  prerelease: xE,
  compare: eb,
  rcompare: tb,
  compareLoose: rb,
  compareBuild: nb,
  sort: sb,
  rsort: ab,
  gt: ob,
  lt: ib,
  eq: cb,
  neq: lb,
  gte: ub,
  lte: db,
  cmp: fb,
  coerce: hb,
  Comparator: mb,
  Range: pb,
  satisfies: yb,
  toComparators: $b,
  maxSatisfying: gb,
  minSatisfying: _b,
  minVersion: vb,
  validRange: wb,
  outside: Eb,
  gtr: bb,
  ltr: Sb,
  intersects: Pb,
  simplifyRange: Nb,
  subset: Rb,
  SemVer: GE,
  re: Ks.re,
  src: Ks.src,
  tokens: Ks.t,
  SEMVER_SPEC_VERSION: Mc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Mc.RELEASE_TYPES,
  compareIdentifiers: Vc.compareIdentifiers,
  rcompareIdentifiers: Vc.rcompareIdentifiers
};
const dr = /* @__PURE__ */ nl(Ob), Ib = Object.prototype.toString, Tb = "[object Uint8Array]", jb = "[object ArrayBuffer]";
function Mu(e, t, r) {
  return e ? e.constructor === t ? !0 : Ib.call(e) === r : !1;
}
function Vu(e) {
  return Mu(e, Uint8Array, Tb);
}
function kb(e) {
  return Mu(e, ArrayBuffer, jb);
}
function Ab(e) {
  return Vu(e) || kb(e);
}
function Cb(e) {
  if (!Vu(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function Db(e) {
  if (!Ab(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Gs(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    Cb(s), r.set(s, n), n += s.length;
  return r;
}
const Dn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Mn(e, t = "utf8") {
  return Db(e), Dn[t] ?? (Dn[t] = new globalThis.TextDecoder(t)), Dn[t].decode(e);
}
function Mb(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const Vb = new globalThis.TextEncoder();
function Hs(e) {
  return Mb(e), Vb.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Lc = "aes-256-cbc", Lu = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), Lb = (e) => typeof e == "string" && Lu.has(e), bt = () => /* @__PURE__ */ Object.create(null), Fc = (e) => e !== void 0, Bs = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Dt = "__internal__", Xs = `${Dt}.migrations.version`;
var Vt, Lt, tr, Ke, We, rr, nr, Sr, mt, Ne, Fu, zu, Uu, qu, Ku, Gu, Hu, Bu;
class Fb {
  constructor(t = {}) {
    xe(this, Ne);
    Fr(this, "path");
    Fr(this, "events");
    xe(this, Vt);
    xe(this, Lt);
    xe(this, tr);
    xe(this, Ke);
    xe(this, We, {});
    xe(this, rr, !1);
    xe(this, nr);
    xe(this, Sr);
    xe(this, mt);
    Fr(this, "_deserialize", (t) => JSON.parse(t));
    Fr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = gt(this, Ne, Fu).call(this, t);
    qe(this, Ke, r), gt(this, Ne, zu).call(this, r), gt(this, Ne, qu).call(this, r), gt(this, Ne, Ku).call(this, r), this.events = new EventTarget(), qe(this, Lt, r.encryptionKey), qe(this, tr, r.encryptionAlgorithm ?? Lc), this.path = gt(this, Ne, Gu).call(this, r), gt(this, Ne, Hu).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (ee(this, Ke).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Dt} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (Bs(a, o), ee(this, Ke).accessPropertiesByDotNotation)
        hn(n, a, o);
      else {
        if (a === "__proto__" || a === "constructor" || a === "prototype")
          return;
        n[a] = o;
      }
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, c] of Object.entries(a))
        s(o, c);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return ee(this, Ke).accessPropertiesByDotNotation ? Rs(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    Bs(t, r);
    const n = ee(this, Ke).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      Fc(ee(this, We)[r]) && this.set(r, ee(this, We)[r]);
  }
  delete(t) {
    const { store: r } = this;
    ee(this, Ke).accessPropertiesByDotNotation ? od(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = bt();
    for (const r of Object.keys(ee(this, We)))
      Fc(ee(this, We)[r]) && (Bs(r, ee(this, We)[r]), ee(this, Ke).accessPropertiesByDotNotation ? hn(t, r, ee(this, We)[r]) : t[r] = ee(this, We)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = te.readFileSync(this.path, ee(this, Lt) ? null : "utf8"), n = this._decryptData(r);
      return ((a) => {
        const o = this._deserialize(a);
        return ee(this, rr) || this._validate(o), Object.assign(bt(), o);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), bt();
      if (ee(this, Ke).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return bt();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Rs(t, Dt))
      try {
        const r = te.readFileSync(this.path, ee(this, Lt) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        Rs(s, Dt) && hn(t, Dt, hi(s, Dt));
      } catch {
      }
    ee(this, rr) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ee(this, nr) && (ee(this, nr).close(), qe(this, nr, void 0)), ee(this, Sr) && (te.unwatchFile(this.path), qe(this, Sr, !1)), qe(this, mt, void 0);
  }
  _decryptData(t) {
    const r = ee(this, Lt);
    if (!r)
      return typeof t == "string" ? t : Mn(t);
    const n = ee(this, tr), s = n === "aes-256-gcm" ? 16 : 0, a = ":".codePointAt(0), o = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(a !== void 0 && o === a)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : Mn(t);
      throw new Error("Failed to decrypt config data.");
    }
    const l = (y) => {
      if (s === 0)
        return { ciphertext: y };
      const w = y.length - s;
      if (w < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: y.slice(0, w),
        authenticationTag: y.slice(w)
      };
    }, d = t.slice(0, 16), u = t.slice(17), h = typeof u == "string" ? Hs(u) : u, E = (y) => {
      const { ciphertext: w, authenticationTag: g } = l(h), $ = zr.pbkdf2Sync(r, y, 1e4, 32, "sha512"), m = zr.createDecipheriv(n, $, d);
      return g && m.setAuthTag(g), Mn(Gs([m.update(w), m.final()]));
    };
    try {
      return E(d);
    } catch {
      try {
        return E(d.toString());
      } catch {
      }
    }
    if (n === "aes-256-cbc")
      return typeof t == "string" ? t : Mn(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      di(a, s) || (r = a, t.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      di(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!ee(this, Vt) || ee(this, Vt).call(this, t) || !ee(this, Vt).errors)
      return;
    const n = ee(this, Vt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    te.mkdirSync(oe.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = ee(this, Lt);
    if (n) {
      const s = zr.randomBytes(16), a = zr.pbkdf2Sync(n, s, 1e4, 32, "sha512"), o = zr.createCipheriv(ee(this, tr), a, s), c = Gs([o.update(Hs(r)), o.final()]), l = [s, Hs(":"), c];
      ee(this, tr) === "aes-256-gcm" && l.push(o.getAuthTag()), r = Gs(l);
    }
    if (ye.env.SNAP)
      te.writeFileSync(this.path, r, { mode: ee(this, Ke).configFileMode });
    else
      try {
        rl(this.path, r, { mode: ee(this, Ke).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          te.writeFileSync(this.path, r, { mode: ee(this, Ke).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), te.existsSync(this.path) || this._write(bt()), ye.platform === "win32" || ye.platform === "darwin") {
      ee(this, mt) ?? qe(this, mt, gc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = oe.dirname(this.path), r = oe.basename(this.path);
      qe(this, nr, te.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof ee(this, mt) == "function" && ee(this, mt).call(this);
      }));
    } else
      ee(this, mt) ?? qe(this, mt, gc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), te.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof ee(this, mt) == "function" && ee(this, mt).call(this);
      }), qe(this, Sr, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(Xs, "0.0.0");
    const a = Object.keys(t).filter((c) => this._shouldPerformMigration(c, s, r));
    let o = structuredClone(this.store);
    for (const c of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: c,
          finalVersion: r,
          versions: a
        });
        const l = t[c];
        l == null || l(this), this._set(Xs, c), s = c, o = structuredClone(this.store);
      } catch (l) {
        this.store = o;
        const d = l instanceof Error ? l.message : String(l);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !dr.eq(s, r)) && this._set(Xs, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === Dt || t.startsWith(`${Dt}.`);
  }
  _isVersionInRangeFormat(t) {
    return dr.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && dr.satisfies(r, t) ? !1 : dr.satisfies(n, t) : !(dr.lte(t, r) || dr.gt(t, n));
  }
  _get(t, r) {
    return hi(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    hn(n, t, r), this.store = n;
  }
}
Vt = new WeakMap(), Lt = new WeakMap(), tr = new WeakMap(), Ke = new WeakMap(), We = new WeakMap(), rr = new WeakMap(), nr = new WeakMap(), Sr = new WeakMap(), mt = new WeakMap(), Ne = new WeakSet(), Fu = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = Lc), !Lb(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...Lu].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = ud(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, zu = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = Ov.default, n = new h0.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const s = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  qe(this, Vt, n.compile(s)), gt(this, Ne, Uu).call(this, t.schema);
}, Uu = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (ee(this, We)[n] = a);
  }
}, qu = function(t) {
  t.defaults && Object.assign(ee(this, We), t.defaults);
}, Ku = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, Gu = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return oe.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, Hu = function(t) {
  if (t.migrations) {
    gt(this, Ne, Bu).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(bt(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    fi.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, Bu = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    qe(this, rr, !0);
    try {
      const s = this.store, a = Object.assign(bt(), t.defaults ?? {}, s);
      try {
        fi.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      qe(this, rr, !1);
    }
  }
};
const { app: Xn, ipcMain: ha, shell: zb } = Xc;
let zc = !1;
const Uc = () => {
  if (!ha || !Xn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Xn.getPath("userData"),
    appVersion: Xn.getVersion()
  };
  return zc || (ha.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), zc = !0), e;
};
class Ub extends Fb {
  constructor(t) {
    let r, n;
    if (ye.type === "renderer") {
      const s = Xc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ha && Xn && ({ defaultCwd: r, appVersion: n } = Uc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = oe.isAbsolute(t.cwd) ? t.cwd : oe.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Uc();
  }
  async openInEditor() {
    const t = await zb.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const $e = new Ub({
  schema: {
    history: {
      type: "array",
      default: []
    },
    settings: {
      type: "object",
      default: {
        maxHistorySize: 100
      },
      properties: {
        maxHistorySize: {
          type: "number"
        }
      }
    },
    groups: {
      type: "array",
      default: []
    }
  }
}), Re = [];
for (let e = 0; e < 256; ++e)
  Re.push((e + 256).toString(16).slice(1));
function qb(e, t = 0) {
  return (Re[e[t + 0]] + Re[e[t + 1]] + Re[e[t + 2]] + Re[e[t + 3]] + "-" + Re[e[t + 4]] + Re[e[t + 5]] + "-" + Re[e[t + 6]] + Re[e[t + 7]] + "-" + Re[e[t + 8]] + Re[e[t + 9]] + "-" + Re[e[t + 10]] + Re[e[t + 11]] + Re[e[t + 12]] + Re[e[t + 13]] + Re[e[t + 14]] + Re[e[t + 15]]).toLowerCase();
}
const Jn = new Uint8Array(256);
let Vn = Jn.length;
function Kb() {
  return Vn > Jn.length - 16 && (td(Jn), Vn = 0), Jn.slice(Vn, Vn += 16);
}
const qc = { randomUUID: rd };
function Gb(e, t, r) {
  var s;
  e = e || {};
  const n = e.random ?? ((s = e.rng) == null ? void 0 : s.call(e)) ?? Kb();
  if (n.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, qb(n);
}
function Kc(e, t, r) {
  return qc.randomUUID && !e ? qc.randomUUID() : Gb(e);
}
let Gc = Pr.readText(), Hc = Pr.readImage().toDataURL(), br = null;
function Hb(e) {
  br && clearInterval(br), br = setInterval(() => {
    try {
      const t = Pr.readText(), r = Pr.readImage(), n = r.isEmpty() ? "" : r.toDataURL();
      let s = !1, a = null;
      const o = $e.get("settings.maxHistorySize") || 100;
      if (t && t !== Gc ? (Gc = t, s = !0, a = {
        id: Kc(),
        type: "text",
        content: t,
        timestamp: Date.now(),
        isPinned: !1
      }) : !r.isEmpty() && n !== Hc && (Hc = n, s = !0, a = {
        id: Kc(),
        type: "image",
        content: n,
        timestamp: Date.now(),
        isPinned: !1
      }), s && a) {
        let c = $e.get("history") || [];
        a.type === "text" && (c = c.filter((u) => u.content !== (a == null ? void 0 : a.content))), c.unshift(a);
        const l = c.filter((u) => u.isPinned);
        let d = c.filter((u) => !u.isPinned);
        c.length > o && (d = d.slice(
          0,
          Math.max(0, o - l.length)
        )), c = [...l, ...d], $e.set("history", c), e.webContents.send("history-updated", c);
      }
    } catch (t) {
      console.error("Error in clipboard watcher:", t);
    }
  }, 500);
}
function Bb() {
  br && (clearInterval(br), br = null);
}
function Xb(e) {
  ft.handle("get-history", () => $e.get("history") || []), ft.handle("toggle-pin", (t, r) => {
    const n = $e.get("history") || [], s = n.findIndex((a) => a.id === r);
    return s !== -1 && (n[s].isPinned = !n[s].isPinned, $e.set("history", n)), n;
  }), ft.handle("delete-item", (t, r) => {
    let n = $e.get("history") || [];
    return n = n.filter((s) => s.id !== r), $e.set("history", n), n;
  }), ft.handle("clear-history", () => {
    let t = $e.get("history") || [];
    return t = t.filter((r) => r.isPinned), $e.set("history", t), t;
  }), ft.handle("paste-item", (t, r, n = !1) => {
    const a = ($e.get("history") || []).find((o) => o.id === r);
    if (a) {
      if (a.type === "text")
        Pr.writeText(a.content);
      else if (a.type === "image") {
        if (n)
          return;
        const o = Jc.createFromDataURL(a.content);
        Pr.writeImage(o);
      }
      e.hide(), setTimeout(() => {
        nd(
          `osascript -e 'tell application "System Events" to keystroke "v" using command down'`,
          (o) => {
            o && console.error("Failed to execute AppleScript:", o);
          }
        );
      }, 100);
    }
  }), ft.handle("get-groups", () => $e.get("groups") || []), ft.handle("add-group", (t, r) => {
    const n = $e.get("groups") || [];
    return n.push(r), $e.set("groups", n), n;
  }), ft.handle("update-group", (t, r) => {
    const n = $e.get("groups") || [], s = n.findIndex((a) => a.id === r.id);
    return s !== -1 && (n[s] = r, $e.set("groups", n)), n;
  }), ft.handle("delete-group", (t, r) => {
    let n = $e.get("groups") || [];
    n = n.filter((o) => o.id !== r), $e.set("groups", n);
    const s = $e.get("history") || [];
    let a = !1;
    return s.forEach((o) => {
      o.groupId === r && (delete o.groupId, a = !0);
    }), a && ($e.set("history", s), e.webContents.send("history-updated", s)), n;
  }), ft.handle("set-item-group", (t, r, n) => {
    const s = $e.get("history") || [], a = s.findIndex((o) => o.id === r);
    return a !== -1 && (n ? s[a].groupId = n : delete s[a].groupId, $e.set("history", s), e.webContents.send("history-updated", s)), s;
  });
}
const Xu = oe.dirname(ed(import.meta.url));
process.env.APP_ROOT = oe.join(Xu, "..");
const Wn = process.env.VITE_DEV_SERVER_URL, cS = oe.join(process.env.APP_ROOT, "dist-electron"), Ju = oe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Wn ? oe.join(process.env.APP_ROOT, "public") : Ju;
let me, Js;
function Wu() {
  me = new Yc({
    width: 600,
    height: 450,
    show: !0,
    // Show clearly for debugging
    frame: !1,
    transparent: !0,
    vibrancy: "popover",
    visualEffectState: "active",
    backgroundColor: "#00000000",
    alwaysOnTop: !0,
    skipTaskbar: !0,
    autoHideMenuBar: !0,
    icon: oe.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: oe.join(Xu, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), Wn && me.webContents.openDevTools({ mode: "detach" }), Hb(me), Xb(me), Wn ? me.loadURL(Wn) : me.loadFile(oe.join(Ju, "index.html")), me.on("blur", () => {
    me != null && me.webContents.isDevToolsOpened() || me == null || me.hide();
  });
}
function Bc() {
  me != null && me.isVisible() ? me.hide() : (me == null || me.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), me == null || me.show(), me == null || me.focus());
}
mr.on("will-quit", () => {
  Bb(), Wc.unregisterAll();
});
mr.whenReady().then(() => {
  mr.dock && mr.dock.hide(), Wu();
  const e = oe.join(process.env.VITE_PUBLIC, "icon.png"), t = Jc.createFromPath(e).resize({ width: 18, height: 18 });
  Js = new Zu(t), Js.setToolTip("Glyphs Clipboard");
  const r = xu.buildFromTemplate([
    { label: "Show Glyphs", click: () => Bc() },
    { type: "separator" },
    { label: "Quit", click: () => mr.quit() }
  ]);
  Js.setContextMenu(r), Wc.register("CommandOrControl+Shift+V", () => {
    Bc();
  });
});
mr.on("activate", () => {
  Yc.getAllWindows().length === 0 && Wu();
});
export {
  cS as MAIN_DIST,
  Ju as RENDERER_DIST,
  Wn as VITE_DEV_SERVER_URL
};
