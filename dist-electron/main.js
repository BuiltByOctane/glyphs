var Rd = Object.defineProperty;
var Ni = (e) => {
  throw TypeError(e);
};
var Od = (e, t, r) => t in e ? Rd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var Jr = (e, t, r) => Od(e, typeof t != "symbol" ? t + "" : t, r), Ds = (e, t, r) => t.has(e) || Ni("Cannot " + r);
var W = (e, t, r) => (Ds(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Je = (e, t, r) => t.has(e) ? Ni("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Me = (e, t, r, n) => (Ds(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), mt = (e, t, r) => (Ds(e, t, "access private method"), r);
import il, { clipboard as Ar, ipcMain as at, nativeImage as cl, app as Er, globalShortcut as ll, Tray as Id, Menu as Td, BrowserWindow as ul } from "electron";
import { fileURLToPath as jd } from "node:url";
import ee from "node:path";
import fe from "node:process";
import { promisify as Ne, isDeepStrictEqual as Ri } from "node:util";
import Y from "node:fs";
import Wr, { randomFillSync as kd, randomUUID as Ad } from "node:crypto";
import Oi from "node:assert";
import dl from "node:os";
import "node:events";
import "node:stream";
import { exec as Cd } from "child_process";
const dr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, fl = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), hl = 1e6, Dd = (e) => e >= "0" && e <= "9";
function ml(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= hl;
  }
  return !1;
}
function Ms(e, t) {
  return fl.has(e) ? !1 : (e && ml(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function Md(e) {
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
        if (!Ms(r, t))
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
          if ((r || n === "property") && !Ms(r, t))
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
            const l = Number.parseInt(r, 10);
            !Number.isNaN(l) && Number.isFinite(l) && l >= 0 && l <= Number.MAX_SAFE_INTEGER && l <= hl && r === String(l) ? t.push(l) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !Dd(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!Ms(r, t))
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
function ms(e) {
  if (typeof e == "string")
    return Md(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (fl.has(n))
        return [];
      typeof n == "string" && ml(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function Ii(e, t, r) {
  if (!dr(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = ms(t);
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
function bn(e, t, r) {
  if (!dr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = ms(t);
  if (s.length === 0)
    return e;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      e[o] = r;
    else if (!dr(e[o])) {
      const c = typeof s[a + 1] == "number";
      e[o] = c ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function Vd(e, t) {
  if (!dr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ms(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !dr(e))
      return !1;
  }
}
function Vs(e, t) {
  if (!dr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = ms(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!dr(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const kt = dl.homedir(), Pa = dl.tmpdir(), { env: br } = fe, Ld = (e) => {
  const t = ee.join(kt, "Library");
  return {
    data: ee.join(t, "Application Support", e),
    config: ee.join(t, "Preferences", e),
    cache: ee.join(t, "Caches", e),
    log: ee.join(t, "Logs", e),
    temp: ee.join(Pa, e)
  };
}, Fd = (e) => {
  const t = br.APPDATA || ee.join(kt, "AppData", "Roaming"), r = br.LOCALAPPDATA || ee.join(kt, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ee.join(r, e, "Data"),
    config: ee.join(t, e, "Config"),
    cache: ee.join(r, e, "Cache"),
    log: ee.join(r, e, "Log"),
    temp: ee.join(Pa, e)
  };
}, zd = (e) => {
  const t = ee.basename(kt);
  return {
    data: ee.join(br.XDG_DATA_HOME || ee.join(kt, ".local", "share"), e),
    config: ee.join(br.XDG_CONFIG_HOME || ee.join(kt, ".config"), e),
    cache: ee.join(br.XDG_CACHE_HOME || ee.join(kt, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ee.join(br.XDG_STATE_HOME || ee.join(kt, ".local", "state"), e),
    temp: ee.join(Pa, t, e)
  };
};
function Ud(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), fe.platform === "darwin" ? Ld(e) : fe.platform === "win32" ? Fd(e) : zd(e);
}
const bt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    return e.apply(void 0, s).catch(r);
  };
}, pt = (e, t) => {
  const { onError: r } = t;
  return function(...s) {
    try {
      return e.apply(void 0, s);
    } catch (a) {
      return r(a);
    }
  };
}, qd = 250, St = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = s.interval ?? qd, l = Date.now() + a;
    return function c(...d) {
      return e.apply(void 0, d).catch((u) => {
        if (!r(u) || Date.now() >= l)
          throw u;
        const h = Math.round(o * Math.random());
        return h > 0 ? new Promise((g) => setTimeout(g, h)).then(() => c.apply(void 0, d)) : c.apply(void 0, d);
      });
    };
  };
}, Pt = (e, t) => {
  const { isRetriable: r } = t;
  return function(s) {
    const { timeout: a } = s, o = Date.now() + a;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (d) {
          if (!r(d) || Date.now() >= o)
            throw d;
          continue;
        }
    };
  };
}, Sr = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!Sr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Kd && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!Sr.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!Sr.isNodeError(e))
      throw e;
    if (!Sr.isChangeErrorOk(e))
      throw e;
  }
}, Sn = {
  onError: Sr.onChangeError
}, qe = {
  onError: () => {
  }
}, Kd = fe.getuid ? !fe.getuid() : !1, Re = {
  isRetriable: Sr.isRetriableError
}, Te = {
  attempt: {
    /* ASYNC */
    chmod: bt(Ne(Y.chmod), Sn),
    chown: bt(Ne(Y.chown), Sn),
    close: bt(Ne(Y.close), qe),
    fsync: bt(Ne(Y.fsync), qe),
    mkdir: bt(Ne(Y.mkdir), qe),
    realpath: bt(Ne(Y.realpath), qe),
    stat: bt(Ne(Y.stat), qe),
    unlink: bt(Ne(Y.unlink), qe),
    /* SYNC */
    chmodSync: pt(Y.chmodSync, Sn),
    chownSync: pt(Y.chownSync, Sn),
    closeSync: pt(Y.closeSync, qe),
    existsSync: pt(Y.existsSync, qe),
    fsyncSync: pt(Y.fsync, qe),
    mkdirSync: pt(Y.mkdirSync, qe),
    realpathSync: pt(Y.realpathSync, qe),
    statSync: pt(Y.statSync, qe),
    unlinkSync: pt(Y.unlinkSync, qe)
  },
  retry: {
    /* ASYNC */
    close: St(Ne(Y.close), Re),
    fsync: St(Ne(Y.fsync), Re),
    open: St(Ne(Y.open), Re),
    readFile: St(Ne(Y.readFile), Re),
    rename: St(Ne(Y.rename), Re),
    stat: St(Ne(Y.stat), Re),
    write: St(Ne(Y.write), Re),
    writeFile: St(Ne(Y.writeFile), Re),
    /* SYNC */
    closeSync: Pt(Y.closeSync, Re),
    fsyncSync: Pt(Y.fsyncSync, Re),
    openSync: Pt(Y.openSync, Re),
    readFileSync: Pt(Y.readFileSync, Re),
    renameSync: Pt(Y.renameSync, Re),
    statSync: Pt(Y.statSync, Re),
    writeSync: Pt(Y.writeSync, Re),
    writeFileSync: Pt(Y.writeFileSync, Re)
  }
}, Gd = "utf8", Ti = 438, Hd = 511, Xd = {}, Bd = fe.geteuid ? fe.geteuid() : -1, Jd = fe.getegid ? fe.getegid() : -1, Wd = 1e3, Yd = !!fe.getuid;
fe.getuid && fe.getuid();
const ji = 128, Qd = (e) => e instanceof Error && "code" in e, ki = (e) => typeof e == "string", Ls = (e) => e === void 0, Zd = fe.platform === "linux", pl = fe.platform === "win32", Na = ["SIGHUP", "SIGINT", "SIGTERM"];
pl || Na.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Zd && Na.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class xd {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (pl && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? fe.kill(fe.pid, "SIGTERM") : fe.kill(fe.pid, t));
      }
    }, this.hook = () => {
      fe.once("exit", () => this.exit());
      for (const t of Na)
        try {
          fe.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const ef = new xd(), tf = ef.register, je = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = je.truncate(t(e));
    return n in je.store ? je.get(e, t, r) : (je.store[n] = r, [n, () => delete je.store[n]]);
  },
  purge: (e) => {
    je.store[e] && (delete je.store[e], Te.attempt.unlink(e));
  },
  purgeSync: (e) => {
    je.store[e] && (delete je.store[e], Te.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in je.store)
      je.purgeSync(e);
  },
  truncate: (e) => {
    const t = ee.basename(e);
    if (t.length <= ji)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - ji;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
tf(je.purgeSyncAll);
function yl(e, t, r = Xd) {
  if (ki(r))
    return yl(e, t, { encoding: r });
  const s = { timeout: r.timeout ?? Wd };
  let a = null, o = null, l = null;
  try {
    const c = Te.attempt.realpathSync(e), d = !!c;
    e = c || e, [o, a] = je.get(e, r.tmpCreate || je.create, r.tmpPurge !== !1);
    const u = Yd && Ls(r.chown), h = Ls(r.mode);
    if (d && (u || h)) {
      const E = Te.attempt.statSync(e);
      E && (r = { ...r }, u && (r.chown = { uid: E.uid, gid: E.gid }), h && (r.mode = E.mode));
    }
    if (!d) {
      const E = ee.dirname(e);
      Te.attempt.mkdirSync(E, {
        mode: Hd,
        recursive: !0
      });
    }
    l = Te.retry.openSync(s)(o, "w", r.mode || Ti), r.tmpCreated && r.tmpCreated(o), ki(t) ? Te.retry.writeSync(s)(l, t, 0, r.encoding || Gd) : Ls(t) || Te.retry.writeSync(s)(l, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Te.retry.fsyncSync(s)(l) : Te.attempt.fsync(l)), Te.retry.closeSync(s)(l), l = null, r.chown && (r.chown.uid !== Bd || r.chown.gid !== Jd) && Te.attempt.chownSync(o, r.chown.uid, r.chown.gid), r.mode && r.mode !== Ti && Te.attempt.chmodSync(o, r.mode);
    try {
      Te.retry.renameSync(s)(o, e);
    } catch (E) {
      if (!Qd(E) || E.code !== "ENAMETOOLONG")
        throw E;
      Te.retry.renameSync(s)(o, je.truncate(e));
    }
    a(), o = null;
  } finally {
    l && Te.attempt.closeSync(l), o && je.purge(o);
  }
}
function $l(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var oa = { exports: {} }, gl = {}, tt = {}, Cr = {}, $n = {}, Q = {}, pn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
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
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), l(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(g(m));
  }
  e.stringify = E;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(pn);
var ia = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = pn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
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
  class l extends s {
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
      const E = this.toName(d), { prefix: g } = E, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, E);
      const $ = this._scope[g] || (this._scope[g] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: g, itemIndex: m }), E;
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
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const $ = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let v = u(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = E == null ? void 0 : E(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(ia);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = pn, r = ia;
  var n = pn;
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
  var s = ia;
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
      const b = i ? r.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${I};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = T(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return ae(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, b, I) {
      super(i, b, I), this.op = f;
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
      return this.code = T(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
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
      let I = b.length;
      for (; I--; ) {
        const j = b[I];
        j.optimizeNames(i, f) || (k(i, j.names), b.splice(I, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => H(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
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
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(V(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return ae(i, this.condition), this.else && H(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = T(this.iteration, i, f), this;
    }
    get names() {
      return H(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, b, I) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = I;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: I, to: j } = this;
      return `for(${f} ${b}=${I}; ${b}<${j}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = ae(super.names, this.from);
      return ae(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, b, I) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = I;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class K extends w {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class J extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  J.kind = "return";
  class de extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, I;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (I = this.finally) === null || I === void 0 || I.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && H(i, this.catch.names), this.finally && H(i, this.finally.names), i;
    }
  }
  class me extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  me.kind = "catch";
  class $e extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  $e.kind = "finally";
  class z {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
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
    _def(i, f, b, I) {
      const j = this._scope.toName(f);
      return b !== void 0 && I && (this._constants[j.str] = b), this._leafNode(new o(i, j, b)), j;
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
      return this._leafNode(new l(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, I] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== I || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, I));
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
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, I, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const F = this._scope.toName(i);
      return this._for(new R(j, F, f, b), () => I(F));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, I = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const F = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${F}.length`, (L) => {
          this.var(j, (0, t._)`${F}[${L}]`), b(j);
        });
      }
      return this._for(new O("of", I, j, f), () => b(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, I = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const j = this._scope.toName(i);
      return this._for(new O("in", I, j, f), () => b(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
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
      const f = new J();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const I = new de();
      if (this._blockNode(I), this.code(i), f) {
        const j = this.name("e");
        this._currNode = I.catch = new me(j), f(j);
      }
      return b && (this._currNode = I.finally = new $e(), this.code(b)), this._endBlockNode(me, $e);
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
    func(i, f = t.nil, b, I) {
      return this._blockNode(new K(i, f, b)), I && this.code(I).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
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
  e.CodeGen = z;
  function H(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function ae(y, i) {
    return i instanceof t._CodeOrName ? H(y, i.names) : y;
  }
  function T(y, i, f) {
    if (y instanceof t.Name)
      return b(y);
    if (!I(y))
      return y;
    return new t._Code(y._items.reduce((j, F) => (F instanceof t.Name && (F = b(F)), F instanceof t._Code ? j.push(...F._items) : j.push(F), j), []));
    function b(j) {
      const F = f[j.str];
      return F === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], F);
    }
    function I(j) {
      return j instanceof t._Code && j._items.some((F) => F instanceof t.Name && i[F.str] === 1 && f[F.str] !== void 0);
    }
  }
  function k(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function V(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = V;
  const D = p(e.operators.AND);
  function G(...y) {
    return y.reduce(D);
  }
  e.and = G;
  const M = p(e.operators.OR);
  function P(...y) {
    return y.reduce(M);
  }
  e.or = P;
  function p(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${y} ${S(f)}`;
  }
  function S(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(Q);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const oe = Q, rf = pn;
function nf(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = nf;
function sf(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (_l(e, t), !vl(t, e.self.RULES.all));
}
A.alwaysValidSchema = sf;
function _l(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || bl(e, `unknown keyword: "${a}"`);
}
A.checkUnknownRules = _l;
function vl(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = vl;
function af(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = af;
function of({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, oe._)`${r}`;
  }
  return (0, oe._)`${e}${t}${(0, oe.getProperty)(n)}`;
}
A.schemaRefOrVal = of;
function cf(e) {
  return wl(decodeURIComponent(e));
}
A.unescapeFragment = cf;
function lf(e) {
  return encodeURIComponent(Ra(e));
}
A.escapeFragment = lf;
function Ra(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = Ra;
function wl(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = wl;
function uf(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = uf;
function Ai({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof oe.Name ? (a instanceof oe.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof oe.Name ? (t(s, o, a), a) : r(a, o);
    return l === oe.Name && !(c instanceof oe.Name) ? n(s, c) : c;
  };
}
A.mergeEvaluated = {
  props: Ai({
    mergeNames: (e, t, r) => e.if((0, oe._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, oe._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, oe._)`${r} || {}`).code((0, oe._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, oe._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, oe._)`${r} || {}`), Oa(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: El
  }),
  items: Ai({
    mergeNames: (e, t, r) => e.if((0, oe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, oe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, oe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, oe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function El(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, oe._)`{}`);
  return t !== void 0 && Oa(e, r, t), r;
}
A.evaluatedPropsToName = El;
function Oa(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, oe._)`${t}${(0, oe.getProperty)(n)}`, !0));
}
A.setEvaluated = Oa;
const Ci = {};
function df(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Ci[t.code] || (Ci[t.code] = new rf._Code(t.code))
  });
}
A.useFunc = df;
var ca;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(ca || (A.Type = ca = {}));
function ff(e, t, r) {
  if (e instanceof oe.Name) {
    const n = t === ca.Num;
    return r ? n ? (0, oe._)`"[" + ${e} + "]"` : (0, oe._)`"['" + ${e} + "']"` : n ? (0, oe._)`"/" + ${e}` : (0, oe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, oe.getProperty)(e).toString() : "/" + Ra(e);
}
A.getErrorPath = ff;
function bl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = bl;
var Ke = {};
Object.defineProperty(Ke, "__esModule", { value: !0 });
const Oe = Q, hf = {
  // validation function arguments
  data: new Oe.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Oe.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Oe.Name("instancePath"),
  parentData: new Oe.Name("parentData"),
  parentDataProperty: new Oe.Name("parentDataProperty"),
  rootData: new Oe.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Oe.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Oe.Name("vErrors"),
  // null or array of validation errors
  errors: new Oe.Name("errors"),
  // counter of validation errors
  this: new Oe.Name("this"),
  // "globals"
  self: new Oe.Name("self"),
  scope: new Oe.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Oe.Name("json"),
  jsonPos: new Oe.Name("jsonPos"),
  jsonLen: new Oe.Name("jsonLen"),
  jsonPart: new Oe.Name("jsonPart")
};
Ke.default = hf;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Q, r = A, n = Ke;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, v, N) {
    const { it: R } = $, { gen: O, compositeRule: K, allErrors: J } = R, de = h($, m, v);
    N ?? (K || J) ? c(O, de) : d(R, (0, t._)`[${de}]`);
  }
  e.reportError = s;
  function a($, m = e.keywordError, v) {
    const { it: N } = $, { gen: R, compositeRule: O, allErrors: K } = N, J = h($, m, v);
    c(R, J), O || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: $, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = $.name("err");
    $.forRange("i", R, n.default.errors, (J) => {
      $.const(K, (0, t._)`${n.default.vErrors}[${J}]`), $.if((0, t._)`${K}.instancePath === undefined`, () => $.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), $.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && ($.assign((0, t._)`${K}.schema`, v), $.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = l;
  function c($, m) {
    const v = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: v, validateName: N, schemaEnv: R } = $;
    R.$async ? v.throw((0, t._)`new ${$.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
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
  function h($, m, v) {
    const { createErrors: N } = $.it;
    return N === !1 ? (0, t._)`{}` : E($, m, v);
  }
  function E($, m, v = {}) {
    const { gen: N, it: R } = $, O = [
      g(R, v),
      w($, v)
    ];
    return _($, m, O), N.object(...O);
  }
  function g({ errorPath: $ }, { instancePath: m }) {
    const v = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${$}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _($, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: K, it: J } = $, { opts: de, propertyName: me, topSchemaRef: $e, schemaPath: z } = J;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), de.messages && N.push([u.message, typeof v == "function" ? v($) : v]), de.verbose && N.push([u.schema, K], [u.parentSchema, (0, t._)`${$e}${z}`], [n.default.data, O]), me && N.push([u.propertyName, me]);
  }
})($n);
Object.defineProperty(Cr, "__esModule", { value: !0 });
Cr.boolOrEmptySchema = Cr.topBoolOrEmptySchema = void 0;
const mf = $n, pf = Q, yf = Ke, $f = {
  message: "boolean schema is false"
};
function gf(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Sl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(yf.default.data) : (t.assign((0, pf._)`${n}.errors`, null), t.return(!0));
}
Cr.topBoolOrEmptySchema = gf;
function _f(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Sl(e)) : r.var(t, !0);
}
Cr.boolOrEmptySchema = _f;
function Sl(e, t) {
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
  (0, mf.reportError)(s, $f, void 0, t);
}
var ge = {}, fr = {};
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.getRules = fr.isJSONType = void 0;
const vf = ["string", "number", "integer", "boolean", "null", "object", "array"], wf = new Set(vf);
function Ef(e) {
  return typeof e == "string" && wf.has(e);
}
fr.isJSONType = Ef;
function bf() {
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
fr.getRules = bf;
var $t = {};
Object.defineProperty($t, "__esModule", { value: !0 });
$t.shouldUseRule = $t.shouldUseGroup = $t.schemaHasRulesForType = void 0;
function Sf({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Pl(e, n);
}
$t.schemaHasRulesForType = Sf;
function Pl(e, t) {
  return t.rules.some((r) => Nl(e, r));
}
$t.shouldUseGroup = Pl;
function Nl(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
$t.shouldUseRule = Nl;
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.reportTypeError = ge.checkDataTypes = ge.checkDataType = ge.coerceAndCheckDataType = ge.getJSONTypes = ge.getSchemaTypes = ge.DataType = void 0;
const Pf = fr, Nf = $t, Rf = $n, Z = Q, Rl = A;
var Rr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Rr || (ge.DataType = Rr = {}));
function Of(e) {
  const t = Ol(e.type);
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
ge.getSchemaTypes = Of;
function Ol(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Pf.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ge.getJSONTypes = Ol;
function If(e, t) {
  const { gen: r, data: n, opts: s } = e, a = Tf(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, Nf.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = Ia(t, n, s.strictNumbers, Rr.Wrong);
    r.if(l, () => {
      a.length ? jf(e, t, a) : Ta(e);
    });
  }
  return o;
}
ge.coerceAndCheckDataType = If;
const Il = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Tf(e, t) {
  return t ? e.filter((r) => Il.has(r) || t === "array" && r === "array") : [];
}
function jf(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, Z._)`typeof ${s}`), l = n.let("coerced", (0, Z._)`undefined`);
  a.coerceTypes === "array" && n.if((0, Z._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Z._)`${s}[0]`).assign(o, (0, Z._)`typeof ${s}`).if(Ia(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, Z._)`${l} !== undefined`);
  for (const d of r)
    (Il.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Ta(e), n.endIf(), n.if((0, Z._)`${l} !== undefined`, () => {
    n.assign(s, l), kf(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Z._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, Z._)`"" + ${s}`).elseIf((0, Z._)`${s} === null`).assign(l, (0, Z._)`""`);
        return;
      case "number":
        n.elseIf((0, Z._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, Z._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Z._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, Z._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Z._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, Z._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, Z._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, Z._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, Z._)`[${s}]`);
    }
  }
}
function kf({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Z._)`${t} !== undefined`, () => e.assign((0, Z._)`${t}[${r}]`, n));
}
function la(e, t, r, n = Rr.Correct) {
  const s = n === Rr.Correct ? Z.operators.EQ : Z.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, Z._)`${t} ${s} null`;
    case "array":
      a = (0, Z._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, Z._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, Z._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, Z._)`typeof ${t} ${s} ${e}`;
  }
  return n === Rr.Correct ? a : (0, Z.not)(a);
  function o(l = Z.nil) {
    return (0, Z.and)((0, Z._)`typeof ${t} == "number"`, l, r ? (0, Z._)`isFinite(${t})` : Z.nil);
  }
}
ge.checkDataType = la;
function Ia(e, t, r, n) {
  if (e.length === 1)
    return la(e[0], t, r, n);
  let s;
  const a = (0, Rl.toHash)(e);
  if (a.array && a.object) {
    const o = (0, Z._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, Z._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = Z.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, Z.and)(s, la(o, t, r, n));
  return s;
}
ge.checkDataTypes = Ia;
const Af = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Z._)`{type: ${e}}` : (0, Z._)`{type: ${t}}`
};
function Ta(e) {
  const t = Cf(e);
  (0, Rf.reportError)(t, Af);
}
ge.reportTypeError = Ta;
function Cf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Rl.schemaRefOrVal)(e, n, "type");
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
var ps = {};
Object.defineProperty(ps, "__esModule", { value: !0 });
ps.assignDefaults = void 0;
const pr = Q, Df = A;
function Mf(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Di(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Di(e, a, s.default));
}
ps.assignDefaults = Mf;
function Di(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, pr._)`${a}${(0, pr.getProperty)(t)}`;
  if (s) {
    (0, Df.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, pr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, pr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, pr._)`${l} = ${(0, pr.stringify)(r)}`);
}
var ut = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const le = Q, ja = A, Nt = Ke, Vf = A;
function Lf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Aa(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, le._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = Lf;
function Ff({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, le.or)(...n.map((a) => (0, le.and)(Aa(e, t, a, r.ownProperties), (0, le._)`${s} = ${a}`)));
}
re.checkMissingProp = Ff;
function zf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = zf;
function Tl(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, le._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = Tl;
function ka(e, t, r) {
  return (0, le._)`${Tl(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = ka;
function Uf(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} !== undefined`;
  return n ? (0, le._)`${s} && ${ka(e, t, r)}` : s;
}
re.propertyInData = Uf;
function Aa(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} === undefined`;
  return n ? (0, le.or)(s, (0, le.not)(ka(e, t, r))) : s;
}
re.noPropertyInData = Aa;
function jl(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = jl;
function qf(e, t) {
  return jl(t).filter((r) => !(0, ja.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = qf;
function Kf({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, le._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Nt.default.instancePath, (0, le.strConcat)(Nt.default.instancePath, a)],
    [Nt.default.parentData, o.parentData],
    [Nt.default.parentDataProperty, o.parentDataProperty],
    [Nt.default.rootData, Nt.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Nt.default.dynamicAnchors, Nt.default.dynamicAnchors]);
  const E = (0, le._)`${u}, ${r.object(...h)}`;
  return c !== le.nil ? (0, le._)`${l}.call(${c}, ${E})` : (0, le._)`${l}(${E})`;
}
re.callValidateCode = Kf;
const Gf = (0, le._)`new RegExp`;
function Hf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, le._)`${s.code === "new RegExp" ? Gf : (0, Vf.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = Hf;
function Xf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, le._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: ja.Type.Num
      }, a), t.if((0, le.not)(a), l);
    });
  }
}
re.validateArray = Xf;
function Bf(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, ja.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, le._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, le.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
re.validateUnion = Bf;
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.validateKeywordUsage = ut.validSchemaType = ut.funcKeywordCode = ut.macroKeywordCode = void 0;
const ke = Q, tr = Ke, Jf = re, Wf = $n;
function Yf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = kl(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: ke.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
ut.macroKeywordCode = Yf;
function Qf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  xf(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = kl(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && Mi(e), $(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && Mi(e), $(() => Zf(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, ke._)`await `), (v) => n.assign(h, !1).if((0, ke._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, ke._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, ke._)`${u}.errors`;
    return n.assign(m, null), _(ke.nil), m;
  }
  function _(m = t.async ? (0, ke._)`await ` : ke.nil) {
    const v = c.opts.passContext ? tr.default.this : tr.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, ke._)`${m}${(0, Jf.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function $(m) {
    var v;
    n.if((0, ke.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
ut.funcKeywordCode = Qf;
function Mi(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, ke._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Zf(e, t) {
  const { gen: r } = e;
  r.if((0, ke._)`Array.isArray(${t})`, () => {
    r.assign(tr.default.vErrors, (0, ke._)`${tr.default.vErrors} === null ? ${t} : ${tr.default.vErrors}.concat(${t})`).assign(tr.default.errors, (0, ke._)`${tr.default.vErrors}.length`), (0, Wf.extendErrors)(e);
  }, () => e.error());
}
function xf({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function kl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, ke.stringify)(r) });
}
function eh(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
ut.validSchemaType = eh;
function th({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
ut.validateKeywordUsage = th;
var Vt = {};
Object.defineProperty(Vt, "__esModule", { value: !0 });
Vt.extendSubschemaMode = Vt.extendSubschemaData = Vt.getSubschema = void 0;
const ct = Q, Al = A;
function rh(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, ct._)`${e.schemaPath}${(0, ct.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, ct._)`${e.schemaPath}${(0, ct.getProperty)(t)}${(0, ct.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Al.escapeFragment)(r)}`
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
Vt.getSubschema = rh;
function nh(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, ct._)`${t.data}${(0, ct.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, ct.str)`${d}${(0, Al.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, ct._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof ct.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Vt.extendSubschemaData = nh;
function sh(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Vt.extendSubschemaMode = sh;
var Se = {}, ys = function e(t, r) {
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
}, Cl = { exports: {} }, Dt = Cl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Bn(t, n, s, e, "", e);
};
Dt.keywords = {
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
Dt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Dt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Dt.skipKeywords = {
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
function Bn(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Dt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Bn(e, t, r, h[E], s + "/" + u + "/" + E, a, s, u, n, E);
      } else if (u in Dt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Bn(e, t, r, h[g], s + "/" + u + "/" + ah(g), a, s, u, n, g);
      } else (u in Dt.keywords || e.allKeys && !(u in Dt.skipKeywords)) && Bn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function ah(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var oh = Cl.exports;
Object.defineProperty(Se, "__esModule", { value: !0 });
Se.getSchemaRefs = Se.resolveUrl = Se.normalizeId = Se._getFullPath = Se.getFullPath = Se.inlineRef = void 0;
const ih = A, ch = ys, lh = oh, uh = /* @__PURE__ */ new Set([
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
function dh(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ua(e) : t ? Dl(e) <= t : !1;
}
Se.inlineRef = dh;
const fh = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ua(e) {
  for (const t in e) {
    if (fh.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ua) || typeof r == "object" && ua(r))
      return !0;
  }
  return !1;
}
function Dl(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !uh.has(r) && (typeof e[r] == "object" && (0, ih.eachItem)(e[r], (n) => t += Dl(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Ml(e, t = "", r) {
  r !== !1 && (t = Or(t));
  const n = e.parse(t);
  return Vl(e, n);
}
Se.getFullPath = Ml;
function Vl(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Se._getFullPath = Vl;
const hh = /#\/?$/;
function Or(e) {
  return e ? e.replace(hh, "") : "";
}
Se.normalizeId = Or;
function mh(e, t, r) {
  return r = Or(r), e.resolve(t, r);
}
Se.resolveUrl = mh;
const ph = /^[a-z_][-a-z0-9._]*$/i;
function yh(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Or(e[r] || t), a = { "": s }, o = Ml(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return lh(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = o + E;
    let $ = a[w];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[E] = $;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Or($ ? R($, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== Or(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!ph.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !ch(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Se.getSchemaRefs = yh;
Object.defineProperty(tt, "__esModule", { value: !0 });
tt.getData = tt.KeywordCxt = tt.validateFunctionCode = void 0;
const Ll = Cr, Vi = ge, Ca = $t, as = ge, $h = ps, sn = ut, Fs = Vt, U = Q, X = Ke, gh = Se, gt = A, Yr = $n;
function _h(e) {
  if (Ul(e) && (ql(e), zl(e))) {
    Eh(e);
    return;
  }
  Fl(e, () => (0, Ll.topBoolOrEmptySchema)(e));
}
tt.validateFunctionCode = _h;
function Fl({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, U._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, U._)`"use strict"; ${Li(r, s)}`), wh(e, s), e.code(a);
  }) : e.func(t, (0, U._)`${X.default.data}, ${vh(s)}`, n.$async, () => e.code(Li(r, s)).code(a));
}
function vh(e) {
  return (0, U._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, U._)`, ${X.default.dynamicAnchors}={}` : U.nil}}={}`;
}
function wh(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, U._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, U._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, U._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, U._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, U._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, U._)`""`), e.var(X.default.parentData, (0, U._)`undefined`), e.var(X.default.parentDataProperty, (0, U._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, U._)`{}`);
  });
}
function Eh(e) {
  const { schema: t, opts: r, gen: n } = e;
  Fl(e, () => {
    r.$comment && t.$comment && Gl(e), Rh(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && bh(e), Kl(e), Th(e);
  });
}
function bh(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, U._)`${r}.evaluated`), t.if((0, U._)`${e.evaluated}.dynamicProps`, () => t.assign((0, U._)`${e.evaluated}.props`, (0, U._)`undefined`)), t.if((0, U._)`${e.evaluated}.dynamicItems`, () => t.assign((0, U._)`${e.evaluated}.items`, (0, U._)`undefined`));
}
function Li(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, U._)`/*# sourceURL=${r} */` : U.nil;
}
function Sh(e, t) {
  if (Ul(e) && (ql(e), zl(e))) {
    Ph(e, t);
    return;
  }
  (0, Ll.boolOrEmptySchema)(e, t);
}
function zl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function Ul(e) {
  return typeof e.schema != "boolean";
}
function Ph(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Gl(e), Oh(e), Ih(e);
  const a = n.const("_errs", X.default.errors);
  Kl(e, a), n.var(t, (0, U._)`${a} === ${X.default.errors}`);
}
function ql(e) {
  (0, gt.checkUnknownRules)(e), Nh(e);
}
function Kl(e, t) {
  if (e.opts.jtd)
    return Fi(e, [], !1, t);
  const r = (0, Vi.getSchemaTypes)(e.schema), n = (0, Vi.coerceAndCheckDataType)(e, r);
  Fi(e, r, !n, t);
}
function Nh(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, gt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function Rh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, gt.checkStrictMode)(e, "default is ignored in the schema root");
}
function Oh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, gh.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function Ih(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Gl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, U._)`${X.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, U.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, U._)`${X.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function Th(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, U._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, U._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, U._)`${n}.errors`, X.default.vErrors), a.unevaluated && jh(e), t.return((0, U._)`${X.default.errors} === 0`));
}
function jh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof U.Name && e.assign((0, U._)`${t}.props`, r), n instanceof U.Name && e.assign((0, U._)`${t}.items`, n);
}
function Fi(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, gt.schemaHasRulesButRef)(a, u))) {
    s.block(() => Bl(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || kh(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, Ca.shouldUseGroup)(a, E) && (E.type ? (s.if((0, as.checkDataType)(E.type, o, c.strictNumbers)), zi(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, as.reportTypeError)(e)), s.endIf()) : zi(e, E), l || s.if((0, U._)`${X.default.errors} === ${n || 0}`));
  }
}
function zi(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, $h.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Ca.shouldUseRule)(n, a) && Bl(e, a.keyword, a.definition, t.type);
  });
}
function kh(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (Ah(e, t), e.opts.allowUnionTypes || Ch(e, t), Dh(e, e.dataTypes));
}
function Ah(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Hl(e.dataTypes, r) || Da(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), Vh(e, t);
  }
}
function Ch(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Da(e, "use allowUnionTypes to allow union type keyword");
}
function Dh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Ca.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => Mh(t, o)) && Da(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Mh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Hl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function Vh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Hl(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Da(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, gt.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Xl = class {
  constructor(t, r, n) {
    if ((0, sn.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, gt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Jl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, sn.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", X.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, U.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, U.not)(t), void 0, r);
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
    this.fail((0, U._)`${r} !== undefined && (${(0, U.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Yr.reportExtraError : Yr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Yr.reportError)(this, this.def.$dataError || Yr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Yr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = U.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = U.nil, r = U.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, U.or)((0, U._)`${s} === undefined`, r)), t !== U.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== U.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, U.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof U.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, U._)`${(0, as.checkDataTypes)(c, r, a.opts.strictNumbers, as.DataType.Wrong)}`;
      }
      return U.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, U._)`!${c}(${r})`;
      }
      return U.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Fs.getSubschema)(this.it, t);
    (0, Fs.extendSubschemaData)(n, this.it, t), (0, Fs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return Sh(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = gt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = gt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, U.Name)), !0;
  }
};
tt.KeywordCxt = Xl;
function Bl(e, t, r, n) {
  const s = new Xl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, sn.funcKeywordCode)(s, r) : "macro" in r ? (0, sn.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, sn.funcKeywordCode)(s, r);
}
const Lh = /^\/(?:[^~]|~0|~1)*$/, Fh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Jl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!Lh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = X.default.rootData;
  } else {
    const d = Fh.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, U._)`${a}${(0, U.getProperty)((0, gt.unescapeJsonPointer)(d))}`, o = (0, U._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
tt.getData = Jl;
var gn = {};
Object.defineProperty(gn, "__esModule", { value: !0 });
class zh extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
gn.default = zh;
var Lr = {};
Object.defineProperty(Lr, "__esModule", { value: !0 });
const zs = Se;
class Uh extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, zs.resolveUrl)(t, r, n), this.missingSchema = (0, zs.normalizeId)((0, zs.getFullPath)(t, this.missingRef));
  }
}
Lr.default = Uh;
var Ce = {};
Object.defineProperty(Ce, "__esModule", { value: !0 });
Ce.resolveSchema = Ce.getCompilingSchema = Ce.resolveRef = Ce.compileSchema = Ce.SchemaEnv = void 0;
const We = Q, qh = gn, xt = Ke, xe = Se, Ui = A, Kh = tt;
let $s = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, xe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
Ce.SchemaEnv = $s;
function Ma(e) {
  const t = Wl.call(this, e);
  if (t)
    return t;
  const r = (0, xe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new We.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: qh.default,
    code: (0, We._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: xt.default.data,
    parentData: xt.default.parentData,
    parentDataProperty: xt.default.parentDataProperty,
    dataNames: [xt.default.data],
    dataPathArr: [We.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, We.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: We.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, We._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, Kh.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(xt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${xt.default.self}`, `${xt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof We.Name ? void 0 : w,
        items: _ instanceof We.Name ? void 0 : _,
        dynamicProps: w instanceof We.Name,
        dynamicItems: _ instanceof We.Name
      }, g.source && (g.source.evaluated = (0, We.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Ce.compileSchema = Ma;
function Gh(e, t, r) {
  var n;
  r = (0, xe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Bh.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new $s({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = Hh.call(this, a);
}
Ce.resolveRef = Gh;
function Hh(e) {
  return (0, xe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ma.call(this, e);
}
function Wl(e) {
  for (const t of this._compilations)
    if (Xh(t, e))
      return t;
}
Ce.getCompilingSchema = Wl;
function Xh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Bh(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || gs.call(this, e, t);
}
function gs(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, xe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, xe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Us.call(this, r, e);
  const a = (0, xe.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = gs.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Us.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Ma.call(this, o), a === (0, xe.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, xe.resolveUrl)(this.opts.uriResolver, s, d)), new $s({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return Us.call(this, r, o);
  }
}
Ce.resolveSchema = gs;
const Jh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Us(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, Ui.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !Jh.has(l) && d && (t = (0, xe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, Ui.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, xe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = gs.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new $s({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Wh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Yh = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Qh = "object", Zh = [
  "$data"
], xh = {
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
}, em = !1, tm = {
  $id: Wh,
  description: Yh,
  type: Qh,
  required: Zh,
  properties: xh,
  additionalProperties: em
};
var Va = {}, _s = { exports: {} };
const rm = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Yl = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function Ql(e) {
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
const nm = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function qi(e) {
  return e.length = 0, !0;
}
function sm(e, t, r) {
  if (e.length) {
    const n = Ql(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function am(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, l = sm;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (o = !0), !l(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!l(s, n, r))
          break;
        l = qi;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (l === qi ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Ql(s))), r.address = n.join(""), r;
}
function Zl(e) {
  if (om(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = am(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function om(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function im(e) {
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
function cm(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function lm(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Yl(r)) {
      const n = Zl(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var xl = {
  nonSimpleDomain: nm,
  recomposeAuthority: lm,
  normalizeComponentEncoding: cm,
  removeDotSegments: im,
  isIPv4: Yl,
  isUUID: rm,
  normalizeIPv6: Zl
};
const { isUUID: um } = xl, dm = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function eu(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function tu(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function ru(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function fm(e) {
  return e.secure = eu(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function hm(e) {
  if ((e.port === (eu(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function mm(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(dm);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = La(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function pm(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = La(s);
  a && (e = a.serialize(e, t));
  const o = e, l = e.nss;
  return o.path = `${n || t.nid}:${l}`, t.skipEscape = !0, o;
}
function ym(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !um(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function $m(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const nu = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: tu,
    serialize: ru
  }
), gm = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: nu.domainHost,
    parse: tu,
    serialize: ru
  }
), Jn = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: fm,
    serialize: hm
  }
), _m = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Jn.domainHost,
    parse: Jn.parse,
    serialize: Jn.serialize
  }
), vm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: mm,
    serialize: pm,
    skipNormalize: !0
  }
), wm = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: ym,
    serialize: $m,
    skipNormalize: !0
  }
), os = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: nu,
    https: gm,
    ws: Jn,
    wss: _m,
    urn: vm,
    "urn:uuid": wm
  }
);
Object.setPrototypeOf(os, null);
function La(e) {
  return e && (os[
    /** @type {SchemeName} */
    e
  ] || os[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var Em = {
  SCHEMES: os,
  getSchemeHandler: La
};
const { normalizeIPv6: bm, removeDotSegments: tn, recomposeAuthority: Sm, normalizeComponentEncoding: Pn, isIPv4: Pm, nonSimpleDomain: Nm } = xl, { SCHEMES: Rm, getSchemeHandler: su } = Em;
function Om(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  dt(wt(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  wt(dt(e, t), t)), e;
}
function Im(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = au(wt(e, n), wt(t, n), n, !0);
  return n.skipEscape = !0, dt(s, n);
}
function au(e, t, r, n) {
  const s = {};
  return n || (e = wt(dt(e, r), r), t = wt(dt(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = tn(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = tn(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = tn(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = tn(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function Tm(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = dt(Pn(wt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = dt(Pn(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = dt(Pn(wt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = dt(Pn(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function dt(e, t) {
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
  }, n = Object.assign({}, t), s = [], a = su(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = Sm(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (l = tn(l)), o === void 0 && l[0] === "/" && l[1] === "/" && (l = "/%2F" + l.slice(2)), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const jm = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function wt(e, t) {
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
  const a = e.match(jm);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host)
      if (Pm(n.host) === !1) {
        const c = bm(n.host);
        n.host = c.host.toLowerCase(), s = c.isIPV6;
      } else
        s = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const o = su(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!o || !o.unicodeSupport) && n.host && (r.domainHost || o && o.domainHost) && s === !1 && Nm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (l) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + l;
      }
    (!o || o && !o.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), o && o.parse && o.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Fa = {
  SCHEMES: Rm,
  normalize: Om,
  resolve: Im,
  resolveComponent: au,
  equal: Tm,
  serialize: dt,
  parse: wt
};
_s.exports = Fa;
_s.exports.default = Fa;
_s.exports.fastUri = Fa;
var ou = _s.exports;
Object.defineProperty(Va, "__esModule", { value: !0 });
const iu = ou;
iu.code = 'require("ajv/dist/runtime/uri").default';
Va.default = iu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = tt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = Q;
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
  const n = gn, s = Lr, a = fr, o = Ce, l = Q, c = Se, d = ge, u = A, h = tm, E = Va, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
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
  }, v = 200;
  function N(P) {
    var p, S, y, i, f, b, I, j, F, L, se, Ue, Ft, zt, Ut, qt, Kt, Gt, Ht, Xt, Bt, Jt, Wt, Yt, Qt;
    const Be = P.strict, Zt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Xr = Zt === !0 || Zt === void 0 ? 1 : Zt || 0, Br = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : g, Cs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : Be) !== null && b !== void 0 ? b : !0,
      strictNumbers: (j = (I = P.strictNumbers) !== null && I !== void 0 ? I : Be) !== null && j !== void 0 ? j : !0,
      strictTypes: (L = (F = P.strictTypes) !== null && F !== void 0 ? F : Be) !== null && L !== void 0 ? L : "log",
      strictTuples: (Ue = (se = P.strictTuples) !== null && se !== void 0 ? se : Be) !== null && Ue !== void 0 ? Ue : "log",
      strictRequired: (zt = (Ft = P.strictRequired) !== null && Ft !== void 0 ? Ft : Be) !== null && zt !== void 0 ? zt : !1,
      code: P.code ? { ...P.code, optimize: Xr, regExp: Br } : { optimize: Xr, regExp: Br },
      loopRequired: (Ut = P.loopRequired) !== null && Ut !== void 0 ? Ut : v,
      loopEnum: (qt = P.loopEnum) !== null && qt !== void 0 ? qt : v,
      meta: (Kt = P.meta) !== null && Kt !== void 0 ? Kt : !0,
      messages: (Gt = P.messages) !== null && Gt !== void 0 ? Gt : !0,
      inlineRefs: (Ht = P.inlineRefs) !== null && Ht !== void 0 ? Ht : !0,
      schemaId: (Xt = P.schemaId) !== null && Xt !== void 0 ? Xt : "$id",
      addUsedSchema: (Bt = P.addUsedSchema) !== null && Bt !== void 0 ? Bt : !0,
      validateSchema: (Jt = P.validateSchema) !== null && Jt !== void 0 ? Jt : !0,
      validateFormats: (Wt = P.validateFormats) !== null && Wt !== void 0 ? Wt : !0,
      unicodeRegExp: (Yt = P.unicodeRegExp) !== null && Yt !== void 0 ? Yt : !0,
      int32range: (Qt = P.int32range) !== null && Qt !== void 0 ? Qt : !0,
      uriResolver: Cs
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: y }), this.logger = H(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, $, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), p.formats && de.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && me.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), J.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const i = y(S);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(p, S) {
      const y = this._addSchema(p, S);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, p, S);
      async function i(L, se) {
        await f.call(this, L.$schema);
        const Ue = this._addSchema(L, se);
        return Ue.validate || b.call(this, Ue);
      }
      async function f(L) {
        L && !this.getSchema(L) && await i.call(this, { $ref: L }, !0);
      }
      async function b(L) {
        try {
          return this._compileSchemaEnv(L);
        } catch (se) {
          if (!(se instanceof s.default))
            throw se;
          return I.call(this, se), await j.call(this, se.missingSchema), b.call(this, L);
        }
      }
      function I({ missingSchema: L, missingRef: se }) {
        if (this.refs[L])
          throw new Error(`AnySchema ${L} is loaded but ${se} cannot be resolved`);
      }
      async function j(L) {
        const se = await F.call(this, L);
        this.refs[L] || await f.call(this, se.$schema), this.refs[L] || this.addSchema(se, L, S);
      }
      async function F(L) {
        const se = this._loading[L];
        if (se)
          return se;
        try {
          return await (this._loading[L] = y(L));
        } finally {
          delete this._loading[L];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, y, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, y, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, y, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, y = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, p);
      if (!i && S) {
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
      let S;
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: y } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (S = o.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
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
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let y = p[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let y;
      if (typeof p == "string")
        y = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = y);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, y = S.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, y, S), !S)
        return (0, u.eachItem)(y, (f) => k.call(this, f)), this;
      D.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)(y, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((b) => k.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const y of S.rules) {
        const i = y.rules.findIndex((f) => f.keyword === p);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const I of f)
          b = b[I];
        for (const I in y) {
          const j = y[I];
          if (typeof j != "object")
            continue;
          const { $data: F } = j.definition, L = b[I];
          F && L && (b[I] = M(L));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const y in p) {
        const i = p[y];
        (!S || S.test(y)) && (typeof i == "string" ? delete p[y] : i && !i.meta && (this._cache.delete(i.schema), delete p[y]));
      }
    }
    _addSchema(p, S, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: I } = this.opts;
      if (typeof p == "object")
        b = p[I];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      y = (0, c.normalizeId)(b || y);
      const F = c.getSchemaRefs.call(this, p, y);
      return j = new o.SchemaEnv({ schema: p, schemaId: I, meta: S, baseId: y, localRefs: F }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), i && this.validateSchema(p, !0), j;
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
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, y = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[y](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function J() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function de() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function me(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function $e() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function H(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ae = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, (y) => {
      if (S.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!ae.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(P, p, S) {
    var y;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: j }) => j === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[P] = !0, !p)
      return;
    const I = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? V.call(this, b, I, p.before) : b.rules.push(I), f.all[P] = I, (y = p.implements) === null || y === void 0 || y.forEach((j) => this.addKeyword(j));
  }
  function V(P, p, S) {
    const y = P.rules.findIndex((i) => i.keyword === S);
    y >= 0 ? P.rules.splice(y, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, G] };
  }
})(gl);
var za = {}, Ua = {}, qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
const km = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
qa.default = km;
var Et = {};
Object.defineProperty(Et, "__esModule", { value: !0 });
Et.callRef = Et.getValidate = void 0;
const Am = Lr, Ki = re, Le = Q, yr = Ke, Gi = Ce, Nn = A, Cm = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Gi.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new Am.default(n.opts.uriResolver, s, r);
    if (u instanceof Gi.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (a === d)
        return Wn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return Wn(e, (0, Le._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = cu(e, w);
      Wn(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, Le.stringify)(w) } : { ref: w }), $ = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Le.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function cu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Le._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
Et.getValidate = cu;
function Wn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? yr.default.this : Le.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Le._)`await ${(0, Ki.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Le._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), E(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, Ki.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Le._)`${w}.errors`;
    s.assign(yr.default.vErrors, (0, Le._)`${yr.default.vErrors} === null ? ${_} : ${yr.default.vErrors}.concat(${_})`), s.assign(yr.default.errors, (0, Le._)`${yr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const $ = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = Nn.mergeEvaluated.props(s, $.props, a.props));
      else {
        const m = s.var("props", (0, Le._)`${w}.evaluated.props`);
        a.props = Nn.mergeEvaluated.props(s, m, a.props, Le.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = Nn.mergeEvaluated.items(s, $.items, a.items));
      else {
        const m = s.var("items", (0, Le._)`${w}.evaluated.items`);
        a.items = Nn.mergeEvaluated.items(s, m, a.items, Le.Name);
      }
  }
}
Et.callRef = Wn;
Et.default = Cm;
Object.defineProperty(Ua, "__esModule", { value: !0 });
const Dm = qa, Mm = Et, Vm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  Dm.default,
  Mm.default
];
Ua.default = Vm;
var Ka = {}, Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const is = Q, Rt = is.operators, cs = {
  maximum: { okStr: "<=", ok: Rt.LTE, fail: Rt.GT },
  minimum: { okStr: ">=", ok: Rt.GTE, fail: Rt.LT },
  exclusiveMaximum: { okStr: "<", ok: Rt.LT, fail: Rt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Rt.GT, fail: Rt.LTE }
}, Lm = {
  message: ({ keyword: e, schemaCode: t }) => (0, is.str)`must be ${cs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, is._)`{comparison: ${cs[e].okStr}, limit: ${t}}`
}, Fm = {
  keyword: Object.keys(cs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Lm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, is._)`${r} ${cs[t].fail} ${n} || isNaN(${r})`);
  }
};
Ga.default = Fm;
var Ha = {};
Object.defineProperty(Ha, "__esModule", { value: !0 });
const an = Q, zm = {
  message: ({ schemaCode: e }) => (0, an.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, an._)`{multipleOf: ${e}}`
}, Um = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: zm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, an._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, an._)`${o} !== parseInt(${o})`;
    e.fail$data((0, an._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Ha.default = Um;
var Xa = {}, Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
function lu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Ba.default = lu;
lu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Xa, "__esModule", { value: !0 });
const rr = Q, qm = A, Km = Ba, Gm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, rr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, rr._)`{limit: ${e}}`
}, Hm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Gm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? rr.operators.GT : rr.operators.LT, o = s.opts.unicode === !1 ? (0, rr._)`${r}.length` : (0, rr._)`${(0, qm.useFunc)(e.gen, Km.default)}(${r})`;
    e.fail$data((0, rr._)`${o} ${a} ${n}`);
  }
};
Xa.default = Hm;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const Xm = re, Bm = A, Pr = Q, Jm = {
  message: ({ schemaCode: e }) => (0, Pr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Pr._)`{pattern: ${e}}`
}, Wm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Jm,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, l = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Pr._)`new RegExp` : (0, Bm.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, Pr._)`${d}(${a}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, Pr._)`!${u}`);
    } else {
      const c = (0, Xm.usePattern)(e, s);
      e.fail$data((0, Pr._)`!${c}.test(${r})`);
    }
  }
};
Ja.default = Wm;
var Wa = {};
Object.defineProperty(Wa, "__esModule", { value: !0 });
const on = Q, Ym = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, on.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, on._)`{limit: ${e}}`
}, Qm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Ym,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? on.operators.GT : on.operators.LT;
    e.fail$data((0, on._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Wa.default = Qm;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const Qr = re, cn = Q, Zm = A, xm = {
  message: ({ params: { missingProperty: e } }) => (0, cn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, cn._)`{missingProperty: ${e}}`
}, ep = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: xm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const $ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${$}" (strictRequired)`;
          (0, Zm.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(cn.nil, h);
      else
        for (const g of r)
          (0, Qr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, Qr.checkMissingProp)(e, r, g)), (0, Qr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Qr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, Qr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, cn.not)(w), () => {
          e.error(), t.break();
        });
      }, cn.nil);
    }
  }
};
Ya.default = ep;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const ln = Q, tp = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, ln.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, ln._)`{limit: ${e}}`
}, rp = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: tp,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? ln.operators.GT : ln.operators.LT;
    e.fail$data((0, ln._)`${r}.length ${s} ${n}`);
  }
};
Qa.default = rp;
var Za = {}, _n = {};
Object.defineProperty(_n, "__esModule", { value: !0 });
const uu = ys;
uu.code = 'require("ajv/dist/runtime/equal").default';
_n.default = uu;
Object.defineProperty(Za, "__esModule", { value: !0 });
const qs = ge, Ee = Q, np = A, sp = _n, ap = {
  message: ({ params: { i: e, j: t } }) => (0, Ee.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, Ee._)`{i: ${e}, j: ${t}}`
}, op = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: ap,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, qs.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, Ee._)`${o} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, Ee._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, Ee._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const $ = t.name("item"), m = (0, qs.checkDataTypes)(d, $, l.opts.strictNumbers, qs.DataType.Wrong), v = t.const("indices", (0, Ee._)`{}`);
      t.for((0, Ee._)`;${w}--;`, () => {
        t.let($, (0, Ee._)`${r}[${w}]`), t.if(m, (0, Ee._)`continue`), d.length > 1 && t.if((0, Ee._)`typeof ${$} == "string"`, (0, Ee._)`${$} += "_"`), t.if((0, Ee._)`typeof ${v}[${$}] == "number"`, () => {
          t.assign(_, (0, Ee._)`${v}[${$}]`), e.error(), t.assign(c, !1).break();
        }).code((0, Ee._)`${v}[${$}] = ${w}`);
      });
    }
    function g(w, _) {
      const $ = (0, np.useFunc)(t, sp.default), m = t.name("outer");
      t.label(m).for((0, Ee._)`;${w}--;`, () => t.for((0, Ee._)`${_} = ${w}; ${_}--;`, () => t.if((0, Ee._)`${$}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
Za.default = op;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const da = Q, ip = A, cp = _n, lp = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, da._)`{allowedValue: ${e}}`
}, up = {
  keyword: "const",
  $data: !0,
  error: lp,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, da._)`!${(0, ip.useFunc)(t, cp.default)}(${r}, ${s})`) : e.fail((0, da._)`${a} !== ${r}`);
  }
};
xa.default = up;
var eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const rn = Q, dp = A, fp = _n, hp = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, rn._)`{allowedValues: ${e}}`
}, mp = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: hp,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, dp.useFunc)(t, fp.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      u = (0, rn.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (g) => t.if((0, rn._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, rn._)`${d()}(${r}, ${g}[${w}])` : (0, rn._)`${r} === ${_}`;
    }
  }
};
eo.default = mp;
Object.defineProperty(Ka, "__esModule", { value: !0 });
const pp = Ga, yp = Ha, $p = Xa, gp = Ja, _p = Wa, vp = Ya, wp = Qa, Ep = Za, bp = xa, Sp = eo, Pp = [
  // number
  pp.default,
  yp.default,
  // string
  $p.default,
  gp.default,
  // object
  _p.default,
  vp.default,
  // array
  wp.default,
  Ep.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  bp.default,
  Sp.default
];
Ka.default = Pp;
var to = {}, Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.validateAdditionalItems = void 0;
const nr = Q, fa = A, Np = {
  message: ({ params: { len: e } }) => (0, nr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, nr._)`{limit: ${e}}`
}, Rp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Np,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, fa.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    du(e, n);
  }
};
function du(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, nr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, nr._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, fa.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, nr._)`${l} <= ${t.length}`);
    r.if((0, nr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: fa.Type.Num }, d), o.allErrors || r.if((0, nr.not)(d), () => r.break());
    });
  }
}
Fr.validateAdditionalItems = du;
Fr.default = Rp;
var ro = {}, zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.validateTuple = void 0;
const Hi = Q, Yn = A, Op = re, Ip = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return fu(e, "additionalItems", t);
    r.items = !0, !(0, Yn.alwaysValidSchema)(r, t) && e.ok((0, Op.validateArray)(e));
  }
};
function fu(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Yn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, Hi._)`${a}.length`);
  r.forEach((h, E) => {
    (0, Yn.alwaysValidSchema)(l, h) || (n.if((0, Hi._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const $ = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Yn.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
zr.validateTuple = fu;
zr.default = Ip;
Object.defineProperty(ro, "__esModule", { value: !0 });
const Tp = zr, jp = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, Tp.validateTuple)(e, "items")
};
ro.default = jp;
var no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
const Xi = Q, kp = A, Ap = re, Cp = Fr, Dp = {
  message: ({ params: { len: e } }) => (0, Xi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Xi._)`{limit: ${e}}`
}, Mp = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Dp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, kp.alwaysValidSchema)(n, t) && (s ? (0, Cp.validateAdditionalItems)(e, s) : e.ok((0, Ap.validateArray)(e)));
  }
};
no.default = Mp;
var so = {};
Object.defineProperty(so, "__esModule", { value: !0 });
const He = Q, Rn = A, Vp = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, He.str)`must contain at least ${e} valid item(s)` : (0, He.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, He._)`{minContains: ${e}}` : (0, He._)`{minContains: ${e}, maxContains: ${t}}`
}, Lp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Vp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, He._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, Rn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, Rn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Rn.alwaysValidSchema)(a, r)) {
      let _ = (0, He._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, He._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, He._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), $ = t.let("count", 0);
      g(_, () => t.if(_, () => w($)));
    }
    function g(_, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Rn.Type.Num,
          compositeRule: !0
        }, _), $();
      });
    }
    function w(_) {
      t.code((0, He._)`${_}++`), l === void 0 ? t.if((0, He._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, He._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, He._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
so.default = Lp;
var vs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Q, r = A, n = re;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
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
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(c[h]) ? d : u;
      E[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: E } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, w, E.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: E, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: E, schemaProp: _ }, w);
          c.mergeValidEvaluated($, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(vs);
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const hu = Q, Fp = A, zp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, hu._)`{propertyName: ${e.propertyName}}`
}, Up = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: zp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Fp.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, hu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
ao.default = Up;
var ws = {};
Object.defineProperty(ws, "__esModule", { value: !0 });
const On = re, Qe = Q, qp = Ke, In = A, Kp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Qe._)`{additionalProperty: ${e.additionalProperty}}`
}, Gp = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Kp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, In.alwaysValidSchema)(o, r))
      return;
    const d = (0, On.allSchemaProperties)(n.properties), u = (0, On.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Qe._)`${a} === ${qp.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? w($) : t.if(E($), () => w($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const v = (0, In.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, On.isOwnProperty)(t, v, $);
      } else d.length ? m = (0, Qe.or)(...d.map((v) => (0, Qe._)`${$} === ${v}`)) : m = Qe.nil;
      return u.length && (m = (0, Qe.or)(m, ...u.map((v) => (0, Qe._)`${(0, On.usePattern)(e, v)}.test(${$})`))), (0, Qe.not)(m);
    }
    function g($) {
      t.code((0, Qe._)`delete ${s}[${$}]`);
    }
    function w($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, In.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_($, m, !1), t.if((0, Qe.not)(m), () => {
          e.reset(), g($);
        })) : (_($, m), l || t.if((0, Qe.not)(m), () => t.break()));
      }
    }
    function _($, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: In.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
ws.default = Gp;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const Hp = tt, Bi = re, Ks = A, Ji = ws, Xp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Ji.default.code(new Hp.KeywordCxt(a, Ji.default, "additionalProperties"));
    const o = (0, Bi.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Ks.mergeEvaluated.props(t, (0, Ks.toHash)(o), a.props));
    const l = o.filter((h) => !(0, Ks.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Bi.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
oo.default = Xp;
var io = {};
Object.defineProperty(io, "__esModule", { value: !0 });
const Wi = re, Tn = Q, Yi = A, Qi = A, Bp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Wi.allSchemaProperties)(r), c = l.filter((_) => (0, Yi.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof Tn.Name) && (a.props = (0, Qi.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const _ of l)
        d && g(_), a.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const $ in d)
        new RegExp(_).test($) && (0, Yi.checkStrictMode)(a, `property ${$} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, ($) => {
        t.if((0, Tn._)`${(0, Wi.usePattern)(e, _)}.test(${$})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: $,
            dataPropType: Qi.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, Tn._)`${h}[${$}]`, !0) : !m && !a.allErrors && t.if((0, Tn.not)(u), () => t.break());
        });
      });
    }
  }
};
io.default = Bp;
var co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
const Jp = A, Wp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Jp.alwaysValidSchema)(n, r)) {
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
co.default = Wp;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const Yp = re, Qp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Yp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
lo.default = Qp;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const Qn = Q, Zp = A, xp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Qn._)`{passingSchemas: ${e.passing}}`
}, ey = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: xp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let E;
        (0, Zp.alwaysValidSchema)(s, u) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Qn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, Qn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), E && e.mergeEvaluated(E, Qn.Name);
        });
      });
    }
  }
};
uo.default = ey;
var fo = {};
Object.defineProperty(fo, "__esModule", { value: !0 });
const ty = A, ry = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, ty.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
fo.default = ry;
var ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
const ls = Q, mu = A, ny = {
  message: ({ params: e }) => (0, ls.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ls._)`{failingKeyword: ${e.ifClause}}`
}, sy = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: ny,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, mu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Zi(n, "then"), a = Zi(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, ls.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const E = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, ls._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Zi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, mu.alwaysValidSchema)(e, r);
}
ho.default = sy;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const ay = A, oy = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, ay.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
mo.default = oy;
Object.defineProperty(to, "__esModule", { value: !0 });
const iy = Fr, cy = ro, ly = zr, uy = no, dy = so, fy = vs, hy = ao, my = ws, py = oo, yy = io, $y = co, gy = lo, _y = uo, vy = fo, wy = ho, Ey = mo;
function by(e = !1) {
  const t = [
    // any
    $y.default,
    gy.default,
    _y.default,
    vy.default,
    wy.default,
    Ey.default,
    // object
    hy.default,
    my.default,
    fy.default,
    py.default,
    yy.default
  ];
  return e ? t.push(cy.default, uy.default) : t.push(iy.default, ly.default), t.push(dy.default), t;
}
to.default = by;
var po = {}, Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.dynamicAnchor = void 0;
const Gs = Q, Sy = Ke, xi = Ce, Py = Et, Ny = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => pu(e, e.schema)
};
function pu(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Gs._)`${Sy.default.dynamicAnchors}${(0, Gs.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : Ry(e);
  r.if((0, Gs._)`!${s}`, () => r.assign(s, a));
}
Ur.dynamicAnchor = pu;
function Ry(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: l } = t.root, { schemaId: c } = n.opts, d = new xi.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: l });
  return xi.compileSchema.call(n, d), (0, Py.getValidate)(e, d);
}
Ur.default = Ny;
var qr = {};
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.dynamicRef = void 0;
const ec = Q, Oy = Ke, tc = Et, Iy = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => yu(e, e.schema)
};
function yu(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const c = r.let("valid", !1);
    o(c), e.ok(c);
  }
  function o(c) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const d = r.let("_v", (0, ec._)`${Oy.default.dynamicAnchors}${(0, ec.getProperty)(a)}`);
      r.if(d, l(d, c), l(s.validateName, c));
    } else
      l(s.validateName, c)();
  }
  function l(c, d) {
    return d ? () => r.block(() => {
      (0, tc.callRef)(e, c), r.let(d, !0);
    }) : () => (0, tc.callRef)(e, c);
  }
}
qr.dynamicRef = yu;
qr.default = Iy;
var yo = {};
Object.defineProperty(yo, "__esModule", { value: !0 });
const Ty = Ur, jy = A, ky = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, Ty.dynamicAnchor)(e, "") : (0, jy.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
yo.default = ky;
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const Ay = qr, Cy = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, Ay.dynamicRef)(e, e.schema)
};
$o.default = Cy;
Object.defineProperty(po, "__esModule", { value: !0 });
const Dy = Ur, My = qr, Vy = yo, Ly = $o, Fy = [Dy.default, My.default, Vy.default, Ly.default];
po.default = Fy;
var go = {}, _o = {};
Object.defineProperty(_o, "__esModule", { value: !0 });
const rc = vs, zy = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: rc.error,
  code: (e) => (0, rc.validatePropertyDeps)(e)
};
_o.default = zy;
var vo = {};
Object.defineProperty(vo, "__esModule", { value: !0 });
const Uy = vs, qy = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, Uy.validateSchemaDeps)(e)
};
vo.default = qy;
var wo = {};
Object.defineProperty(wo, "__esModule", { value: !0 });
const Ky = A, Gy = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, Ky.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
wo.default = Gy;
Object.defineProperty(go, "__esModule", { value: !0 });
const Hy = _o, Xy = vo, By = wo, Jy = [Hy.default, Xy.default, By.default];
go.default = Jy;
var Eo = {}, bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
const Tt = Q, nc = A, Wy = Ke, Yy = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Tt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, Qy = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: Yy,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: l } = a;
    l instanceof Tt.Name ? t.if((0, Tt._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => c(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? c(h) : t.if(u(l, h), () => c(h))), a.props = !0, e.ok((0, Tt._)`${s} === ${Wy.default.errors}`);
    function c(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, nc.alwaysValidSchema)(a, r)) {
        const E = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: nc.Type.Str
        }, E), o || t.if((0, Tt.not)(E), () => t.break());
      }
    }
    function d(h, E) {
      return (0, Tt._)`!${h} || !${h}[${E}]`;
    }
    function u(h, E) {
      const g = [];
      for (const w in h)
        h[w] === !0 && g.push((0, Tt._)`${E} !== ${w}`);
      return (0, Tt.and)(...g);
    }
  }
};
bo.default = Qy;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
const sr = Q, sc = A, Zy = {
  message: ({ params: { len: e } }) => (0, sr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sr._)`{limit: ${e}}`
}, xy = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: Zy,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, sr._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, sr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, sc.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, sr._)`${o} <= ${a}`);
      t.if((0, sr.not)(c), () => l(c, a)), e.ok(c);
    }
    s.items = !0;
    function l(c, d) {
      t.forRange("i", d, o, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: sc.Type.Num }, c), s.allErrors || t.if((0, sr.not)(c), () => t.break());
      });
    }
  }
};
So.default = xy;
Object.defineProperty(Eo, "__esModule", { value: !0 });
const e$ = bo, t$ = So, r$ = [e$.default, t$.default];
Eo.default = r$;
var Po = {}, No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
const pe = Q, n$ = {
  message: ({ schemaCode: e }) => (0, pe.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, pe._)`{format: ${e}}`
}, s$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: n$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, pe._)`${w}[${o}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, pe._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign($, (0, pe._)`${_}.type || "string"`).assign(m, (0, pe._)`${_}.validate`), () => r.assign($, (0, pe._)`"string"`).assign(m, _)), e.fail$data((0, pe.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? pe.nil : (0, pe._)`${o} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, pe._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, pe._)`${m}(${n})`, O = (0, pe._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, pe._)`${m} && ${m} !== true && ${$} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, $, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const K = O instanceof RegExp ? (0, pe.regexpCode)(O) : c.code.formats ? (0, pe._)`${c.code.formats}${(0, pe.getProperty)(a)}` : void 0, J = r.scopeValue("formats", { key: a, ref: O, code: K });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, pe._)`${J}.validate`] : ["string", O, J];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, pe._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, pe._)`${m}(${n})` : (0, pe._)`${m}.test(${n})`;
      }
    }
  }
};
No.default = s$;
Object.defineProperty(Po, "__esModule", { value: !0 });
const a$ = No, o$ = [a$.default];
Po.default = o$;
var Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.contentVocabulary = Dr.metadataVocabulary = void 0;
Dr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Dr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(za, "__esModule", { value: !0 });
const i$ = Ua, c$ = Ka, l$ = to, u$ = po, d$ = go, f$ = Eo, h$ = Po, ac = Dr, m$ = [
  u$.default,
  i$.default,
  c$.default,
  (0, l$.default)(!0),
  h$.default,
  ac.metadataVocabulary,
  ac.contentVocabulary,
  d$.default,
  f$.default
];
za.default = m$;
var Ro = {}, Es = {};
Object.defineProperty(Es, "__esModule", { value: !0 });
Es.DiscrError = void 0;
var oc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(oc || (Es.DiscrError = oc = {}));
Object.defineProperty(Ro, "__esModule", { value: !0 });
const vr = Q, ha = Es, ic = Ce, p$ = Lr, y$ = A, $$ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === ha.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, vr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, g$ = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: $$,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, vr._)`${r}${(0, vr.getProperty)(l)}`);
    t.if((0, vr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: ha.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = E();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, vr._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: ha.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, vr.Name), w;
    }
    function E() {
      var g;
      const w = {}, _ = m(s);
      let $ = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, y$.schemaHasRulesButRef)(O, a.self.RULES)) {
          const J = O.$ref;
          if (O = ic.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, J), O instanceof ic.SchemaEnv && (O = O.schema), O === void 0)
            throw new p$.default(a.opts.uriResolver, a.baseId, J);
        }
        const K = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (_ || m(O)), v(K, R);
      }
      if (!$)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const K of R.enum)
            N(K, O);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
Ro.default = g$;
var Oo = {};
const _$ = "https://json-schema.org/draft/2020-12/schema", v$ = "https://json-schema.org/draft/2020-12/schema", w$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, E$ = "meta", b$ = "Core and Validation specifications meta-schema", S$ = [
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
], P$ = [
  "object",
  "boolean"
], N$ = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", R$ = {
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
}, O$ = {
  $schema: _$,
  $id: v$,
  $vocabulary: w$,
  $dynamicAnchor: E$,
  title: b$,
  allOf: S$,
  type: P$,
  $comment: N$,
  properties: R$
}, I$ = "https://json-schema.org/draft/2020-12/schema", T$ = "https://json-schema.org/draft/2020-12/meta/applicator", j$ = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, k$ = "meta", A$ = "Applicator vocabulary meta-schema", C$ = [
  "object",
  "boolean"
], D$ = {
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
}, M$ = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, V$ = {
  $schema: I$,
  $id: T$,
  $vocabulary: j$,
  $dynamicAnchor: k$,
  title: A$,
  type: C$,
  properties: D$,
  $defs: M$
}, L$ = "https://json-schema.org/draft/2020-12/schema", F$ = "https://json-schema.org/draft/2020-12/meta/unevaluated", z$ = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, U$ = "meta", q$ = "Unevaluated applicator vocabulary meta-schema", K$ = [
  "object",
  "boolean"
], G$ = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, H$ = {
  $schema: L$,
  $id: F$,
  $vocabulary: z$,
  $dynamicAnchor: U$,
  title: q$,
  type: K$,
  properties: G$
}, X$ = "https://json-schema.org/draft/2020-12/schema", B$ = "https://json-schema.org/draft/2020-12/meta/content", J$ = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, W$ = "meta", Y$ = "Content vocabulary meta-schema", Q$ = [
  "object",
  "boolean"
], Z$ = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, x$ = {
  $schema: X$,
  $id: B$,
  $vocabulary: J$,
  $dynamicAnchor: W$,
  title: Y$,
  type: Q$,
  properties: Z$
}, e0 = "https://json-schema.org/draft/2020-12/schema", t0 = "https://json-schema.org/draft/2020-12/meta/core", r0 = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, n0 = "meta", s0 = "Core vocabulary meta-schema", a0 = [
  "object",
  "boolean"
], o0 = {
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
}, i0 = {
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
}, c0 = {
  $schema: e0,
  $id: t0,
  $vocabulary: r0,
  $dynamicAnchor: n0,
  title: s0,
  type: a0,
  properties: o0,
  $defs: i0
}, l0 = "https://json-schema.org/draft/2020-12/schema", u0 = "https://json-schema.org/draft/2020-12/meta/format-annotation", d0 = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, f0 = "meta", h0 = "Format vocabulary meta-schema for annotation results", m0 = [
  "object",
  "boolean"
], p0 = {
  format: {
    type: "string"
  }
}, y0 = {
  $schema: l0,
  $id: u0,
  $vocabulary: d0,
  $dynamicAnchor: f0,
  title: h0,
  type: m0,
  properties: p0
}, $0 = "https://json-schema.org/draft/2020-12/schema", g0 = "https://json-schema.org/draft/2020-12/meta/meta-data", _0 = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, v0 = "meta", w0 = "Meta-data vocabulary meta-schema", E0 = [
  "object",
  "boolean"
], b0 = {
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
}, S0 = {
  $schema: $0,
  $id: g0,
  $vocabulary: _0,
  $dynamicAnchor: v0,
  title: w0,
  type: E0,
  properties: b0
}, P0 = "https://json-schema.org/draft/2020-12/schema", N0 = "https://json-schema.org/draft/2020-12/meta/validation", R0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, O0 = "meta", I0 = "Validation vocabulary meta-schema", T0 = [
  "object",
  "boolean"
], j0 = {
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
}, k0 = {
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
}, A0 = {
  $schema: P0,
  $id: N0,
  $vocabulary: R0,
  $dynamicAnchor: O0,
  title: I0,
  type: T0,
  properties: j0,
  $defs: k0
};
Object.defineProperty(Oo, "__esModule", { value: !0 });
const C0 = O$, D0 = V$, M0 = H$, V0 = x$, L0 = c0, F0 = y0, z0 = S0, U0 = A0, q0 = ["/properties"];
function K0(e) {
  return [
    C0,
    D0,
    M0,
    V0,
    L0,
    t(this, F0),
    z0,
    t(this, U0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, q0) : n;
  }
}
Oo.default = K0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = gl, n = za, s = Ro, a = Oo, o = "https://json-schema.org/draft/2020-12/schema";
  class l extends r.default {
    constructor(g = {}) {
      super({
        ...g,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: g, meta: w } = this.opts;
      w && (a.default.call(this, g), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var c = tt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = Q;
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
  var u = gn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Lr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(oa, oa.exports);
var G0 = oa.exports, ma = { exports: {} }, $u = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(z, H) {
    return { validate: z, compare: H };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), d),
    "date-time": t(E(!0), g),
    "iso-time": t(c(), u),
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
    regex: $e,
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
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: K },
    // signed 64 bit integer
    int64: { type: "number", validate: J },
    // C-type float
    float: { type: "number", validate: de },
    // C-type double
    double: { type: "number", validate: de },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
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
  function r(z) {
    return z % 4 === 0 && (z % 100 !== 0 || z % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(z) {
    const H = n.exec(z);
    if (!H)
      return !1;
    const ae = +H[1], T = +H[2], k = +H[3];
    return T >= 1 && T <= 12 && k >= 1 && k <= (T === 2 && r(ae) ? 29 : s[T]);
  }
  function o(z, H) {
    if (z && H)
      return z > H ? 1 : z < H ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(z) {
    return function(ae) {
      const T = l.exec(ae);
      if (!T)
        return !1;
      const k = +T[1], V = +T[2], D = +T[3], G = T[4], M = T[5] === "-" ? -1 : 1, P = +(T[6] || 0), p = +(T[7] || 0);
      if (P > 23 || p > 59 || z && !G)
        return !1;
      if (k <= 23 && V <= 59 && D < 60)
        return !0;
      const S = V - p * M, y = k - P * M - (S < 0 ? 1 : 0);
      return (y === 23 || y === -1) && (S === 59 || S === -1) && D < 61;
    };
  }
  function d(z, H) {
    if (!(z && H))
      return;
    const ae = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf(), T = (/* @__PURE__ */ new Date("2020-01-01T" + H)).valueOf();
    if (ae && T)
      return ae - T;
  }
  function u(z, H) {
    if (!(z && H))
      return;
    const ae = l.exec(z), T = l.exec(H);
    if (ae && T)
      return z = ae[1] + ae[2] + ae[3], H = T[1] + T[2] + T[3], z > H ? 1 : z < H ? -1 : 0;
  }
  const h = /t|\s/i;
  function E(z) {
    const H = c(z);
    return function(T) {
      const k = T.split(h);
      return k.length === 2 && a(k[0]) && H(k[1]);
    };
  }
  function g(z, H) {
    if (!(z && H))
      return;
    const ae = new Date(z).valueOf(), T = new Date(H).valueOf();
    if (ae && T)
      return ae - T;
  }
  function w(z, H) {
    if (!(z && H))
      return;
    const [ae, T] = z.split(h), [k, V] = H.split(h), D = o(ae, k);
    if (D !== void 0)
      return D || d(T, V);
  }
  const _ = /\/|:/, $ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(z) {
    return _.test(z) && $.test(z);
  }
  const v = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(z) {
    return v.lastIndex = 0, v.test(z);
  }
  const R = -2147483648, O = 2 ** 31 - 1;
  function K(z) {
    return Number.isInteger(z) && z <= O && z >= R;
  }
  function J(z) {
    return Number.isInteger(z);
  }
  function de() {
    return !0;
  }
  const me = /[^\\]\\Z/;
  function $e(z) {
    if (me.test(z))
      return !1;
    try {
      return new RegExp(z), !0;
    } catch {
      return !1;
    }
  }
})($u);
var gu = {}, pa = { exports: {} }, _u = {}, rt = {}, Mr = {}, vn = {}, te = {}, yn = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
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
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), l(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function E(m) {
    return new n(g(m));
  }
  e.stringify = E;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function $(m) {
    return new n(m.toString());
  }
  e.regexpCode = $;
})(yn);
var ya = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = yn;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
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
  class l extends s {
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
      const E = this.toName(d), { prefix: g } = E, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, E);
      const $ = this._scope[g] || (this._scope[g] = []), m = $.length;
      return $[m] = u.ref, E.setValue(u, { property: g, itemIndex: m }), E;
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
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const $ = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if ($.has(m))
            return;
          $.set(m, n.Started);
          let v = u(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = E == null ? void 0 : E(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          $.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(ya);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = yn, r = ya;
  var n = yn;
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
  var s = ya;
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
      const b = i ? r.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${b} ${this.name}${I};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(i, f, b) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = b;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = T(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return ae(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, b, I) {
      super(i, b, I), this.op = f;
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
      return this.code = T(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
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
      let I = b.length;
      for (; I--; ) {
        const j = b[I];
        j.optimizeNames(i, f) || (k(i, j.names), b.splice(I, 1));
      }
      return b.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => H(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
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
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(V(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var b;
      if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return ae(i, this.condition), this.else && H(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = T(this.iteration, i, f), this;
    }
    get names() {
      return H(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, b, I) {
      super(), this.varKind = i, this.name = f, this.from = b, this.to = I;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: b, from: I, to: j } = this;
      return `for(${f} ${b}=${I}; ${b}<${j}; ${b}++)` + super.render(i);
    }
    get names() {
      const i = ae(super.names, this.from);
      return ae(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, b, I) {
      super(), this.loop = i, this.varKind = f, this.name = b, this.iterable = I;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class K extends w {
    constructor(i, f, b) {
      super(), this.name = i, this.args = f, this.async = b;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class J extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  J.kind = "return";
  class de extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var b, I;
      return super.optimizeNames(i, f), (b = this.catch) === null || b === void 0 || b.optimizeNames(i, f), (I = this.finally) === null || I === void 0 || I.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && H(i, this.catch.names), this.finally && H(i, this.finally.names), i;
    }
  }
  class me extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  me.kind = "catch";
  class $e extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  $e.kind = "finally";
  class z {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
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
    _def(i, f, b, I) {
      const j = this._scope.toName(f);
      return b !== void 0 && I && (this._constants[j.str] = b), this._leafNode(new o(i, j, b)), j;
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
      return this._leafNode(new l(i, f, b));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new E(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [b, I] of i)
        f.length > 1 && f.push(","), f.push(b), (b !== I || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, I));
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
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, b, I, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const F = this._scope.toName(i);
      return this._for(new R(j, F, f, b), () => I(F));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, b, I = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const F = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${F}.length`, (L) => {
          this.var(j, (0, t._)`${F}[${L}]`), b(j);
        });
      }
      return this._for(new O("of", I, j, f), () => b(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, b, I = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, b);
      const j = this._scope.toName(i);
      return this._for(new O("in", I, j, f), () => b(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
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
      const f = new J();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(i, f, b) {
      if (!f && !b)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const I = new de();
      if (this._blockNode(I), this.code(i), f) {
        const j = this.name("e");
        this._currNode = I.catch = new me(j), f(j);
      }
      return b && (this._currNode = I.finally = new $e(), this.code(b)), this._endBlockNode(me, $e);
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
    func(i, f = t.nil, b, I) {
      return this._blockNode(new K(i, f, b)), I && this.code(I).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
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
  e.CodeGen = z;
  function H(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) + (i[f] || 0);
    return y;
  }
  function ae(y, i) {
    return i instanceof t._CodeOrName ? H(y, i.names) : y;
  }
  function T(y, i, f) {
    if (y instanceof t.Name)
      return b(y);
    if (!I(y))
      return y;
    return new t._Code(y._items.reduce((j, F) => (F instanceof t.Name && (F = b(F)), F instanceof t._Code ? j.push(...F._items) : j.push(F), j), []));
    function b(j) {
      const F = f[j.str];
      return F === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], F);
    }
    function I(j) {
      return j instanceof t._Code && j._items.some((F) => F instanceof t.Name && i[F.str] === 1 && f[F.str] !== void 0);
    }
  }
  function k(y, i) {
    for (const f in i)
      y[f] = (y[f] || 0) - (i[f] || 0);
  }
  function V(y) {
    return typeof y == "boolean" || typeof y == "number" || y === null ? !y : (0, t._)`!${S(y)}`;
  }
  e.not = V;
  const D = p(e.operators.AND);
  function G(...y) {
    return y.reduce(D);
  }
  e.and = G;
  const M = p(e.operators.OR);
  function P(...y) {
    return y.reduce(M);
  }
  e.or = P;
  function p(y) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${y} ${S(f)}`;
  }
  function S(y) {
    return y instanceof t.Name ? y : (0, t._)`(${y})`;
  }
})(te);
var C = {};
Object.defineProperty(C, "__esModule", { value: !0 });
C.checkStrictMode = C.getErrorPath = C.Type = C.useFunc = C.setEvaluated = C.evaluatedPropsToName = C.mergeEvaluated = C.eachItem = C.unescapeJsonPointer = C.escapeJsonPointer = C.escapeFragment = C.unescapeFragment = C.schemaRefOrVal = C.schemaHasRulesButRef = C.schemaHasRules = C.checkUnknownRules = C.alwaysValidSchema = C.toHash = void 0;
const ie = te, H0 = yn;
function X0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = X0;
function B0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (vu(e, t), !wu(t, e.self.RULES.all));
}
C.alwaysValidSchema = B0;
function vu(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || Su(e, `unknown keyword: "${a}"`);
}
C.checkUnknownRules = vu;
function wu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
C.schemaHasRules = wu;
function J0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
C.schemaHasRulesButRef = J0;
function W0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
C.schemaRefOrVal = W0;
function Y0(e) {
  return Eu(decodeURIComponent(e));
}
C.unescapeFragment = Y0;
function Q0(e) {
  return encodeURIComponent(Io(e));
}
C.escapeFragment = Q0;
function Io(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = Io;
function Eu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = Eu;
function Z0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = Z0;
function cc({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof ie.Name ? (a instanceof ie.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ie.Name ? (t(s, o, a), a) : r(a, o);
    return l === ie.Name && !(c instanceof ie.Name) ? n(s, c) : c;
  };
}
C.mergeEvaluated = {
  props: cc({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ie._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ie._)`${r} || {}`).code((0, ie._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ie._)`${r} || {}`), To(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: bu
  }),
  items: cc({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function bu(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && To(e, r, t), r;
}
C.evaluatedPropsToName = bu;
function To(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
C.setEvaluated = To;
const lc = {};
function x0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: lc[t.code] || (lc[t.code] = new H0._Code(t.code))
  });
}
C.useFunc = x0;
var $a;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})($a || (C.Type = $a = {}));
function eg(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === $a.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + Io(e);
}
C.getErrorPath = eg;
function Su(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = Su;
var ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
const Ie = te, tg = {
  // validation function arguments
  data: new Ie.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ie.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ie.Name("instancePath"),
  parentData: new Ie.Name("parentData"),
  parentDataProperty: new Ie.Name("parentDataProperty"),
  rootData: new Ie.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ie.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ie.Name("vErrors"),
  // null or array of validation errors
  errors: new Ie.Name("errors"),
  // counter of validation errors
  this: new Ie.Name("this"),
  // "globals"
  self: new Ie.Name("self"),
  scope: new Ie.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ie.Name("json"),
  jsonPos: new Ie.Name("jsonPos"),
  jsonLen: new Ie.Name("jsonLen"),
  jsonPart: new Ie.Name("jsonPart")
};
ht.default = tg;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = te, r = C, n = ht;
  e.keywordError = {
    message: ({ keyword: $ }) => (0, t.str)`must pass "${$}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: $, schemaType: m }) => m ? (0, t.str)`"${$}" keyword must be ${m} ($data)` : (0, t.str)`"${$}" keyword is invalid ($data)`
  };
  function s($, m = e.keywordError, v, N) {
    const { it: R } = $, { gen: O, compositeRule: K, allErrors: J } = R, de = h($, m, v);
    N ?? (K || J) ? c(O, de) : d(R, (0, t._)`[${de}]`);
  }
  e.reportError = s;
  function a($, m = e.keywordError, v) {
    const { it: N } = $, { gen: R, compositeRule: O, allErrors: K } = N, J = h($, m, v);
    c(R, J), O || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o($, m) {
    $.assign(n.default.errors, m), $.if((0, t._)`${n.default.vErrors} !== null`, () => $.if(m, () => $.assign((0, t._)`${n.default.vErrors}.length`, m), () => $.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: $, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = $.name("err");
    $.forRange("i", R, n.default.errors, (J) => {
      $.const(K, (0, t._)`${n.default.vErrors}[${J}]`), $.if((0, t._)`${K}.instancePath === undefined`, () => $.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), $.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && ($.assign((0, t._)`${K}.schema`, v), $.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = l;
  function c($, m) {
    const v = $.const("err", m);
    $.if((0, t._)`${n.default.vErrors} === null`, () => $.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), $.code((0, t._)`${n.default.errors}++`);
  }
  function d($, m) {
    const { gen: v, validateName: N, schemaEnv: R } = $;
    R.$async ? v.throw((0, t._)`new ${$.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
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
  function h($, m, v) {
    const { createErrors: N } = $.it;
    return N === !1 ? (0, t._)`{}` : E($, m, v);
  }
  function E($, m, v = {}) {
    const { gen: N, it: R } = $, O = [
      g(R, v),
      w($, v)
    ];
    return _($, m, O), N.object(...O);
  }
  function g({ errorPath: $ }, { instancePath: m }) {
    const v = m ? (0, t.str)`${$}${(0, r.getErrorPath)(m, r.Type.Str)}` : $;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: $, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${$}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _($, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: K, it: J } = $, { opts: de, propertyName: me, topSchemaRef: $e, schemaPath: z } = J;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m($) : m || (0, t._)`{}`]), de.messages && N.push([u.message, typeof v == "function" ? v($) : v]), de.verbose && N.push([u.schema, K], [u.parentSchema, (0, t._)`${$e}${z}`], [n.default.data, O]), me && N.push([u.propertyName, me]);
  }
})(vn);
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.boolOrEmptySchema = Mr.topBoolOrEmptySchema = void 0;
const rg = vn, ng = te, sg = ht, ag = {
  message: "boolean schema is false"
};
function og(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? Pu(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(sg.default.data) : (t.assign((0, ng._)`${n}.errors`, null), t.return(!0));
}
Mr.topBoolOrEmptySchema = og;
function ig(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), Pu(e)) : r.var(t, !0);
}
Mr.boolOrEmptySchema = ig;
function Pu(e, t) {
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
  (0, rg.reportError)(s, ag, void 0, t);
}
var _e = {}, hr = {};
Object.defineProperty(hr, "__esModule", { value: !0 });
hr.getRules = hr.isJSONType = void 0;
const cg = ["string", "number", "integer", "boolean", "null", "object", "array"], lg = new Set(cg);
function ug(e) {
  return typeof e == "string" && lg.has(e);
}
hr.isJSONType = ug;
function dg() {
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
hr.getRules = dg;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.shouldUseRule = _t.shouldUseGroup = _t.schemaHasRulesForType = void 0;
function fg({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && Nu(e, n);
}
_t.schemaHasRulesForType = fg;
function Nu(e, t) {
  return t.rules.some((r) => Ru(e, r));
}
_t.shouldUseGroup = Nu;
function Ru(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
_t.shouldUseRule = Ru;
Object.defineProperty(_e, "__esModule", { value: !0 });
_e.reportTypeError = _e.checkDataTypes = _e.checkDataType = _e.coerceAndCheckDataType = _e.getJSONTypes = _e.getSchemaTypes = _e.DataType = void 0;
const hg = hr, mg = _t, pg = vn, x = te, Ou = C;
var Ir;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Ir || (_e.DataType = Ir = {}));
function yg(e) {
  const t = Iu(e.type);
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
_e.getSchemaTypes = yg;
function Iu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(hg.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
_e.getJSONTypes = Iu;
function $g(e, t) {
  const { gen: r, data: n, opts: s } = e, a = gg(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, mg.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = jo(t, n, s.strictNumbers, Ir.Wrong);
    r.if(l, () => {
      a.length ? _g(e, t, a) : ko(e);
    });
  }
  return o;
}
_e.coerceAndCheckDataType = $g;
const Tu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function gg(e, t) {
  return t ? e.filter((r) => Tu.has(r) || t === "array" && r === "array") : [];
}
function _g(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, x._)`typeof ${s}`), l = n.let("coerced", (0, x._)`undefined`);
  a.coerceTypes === "array" && n.if((0, x._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, x._)`${s}[0]`).assign(o, (0, x._)`typeof ${s}`).if(jo(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, x._)`${l} !== undefined`);
  for (const d of r)
    (Tu.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), ko(e), n.endIf(), n.if((0, x._)`${l} !== undefined`, () => {
    n.assign(s, l), vg(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, x._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, x._)`"" + ${s}`).elseIf((0, x._)`${s} === null`).assign(l, (0, x._)`""`);
        return;
      case "number":
        n.elseIf((0, x._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, x._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, x._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, x._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, x._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, x._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, x._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, x._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, x._)`[${s}]`);
    }
  }
}
function vg({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, x._)`${t} !== undefined`, () => e.assign((0, x._)`${t}[${r}]`, n));
}
function ga(e, t, r, n = Ir.Correct) {
  const s = n === Ir.Correct ? x.operators.EQ : x.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, x._)`${t} ${s} null`;
    case "array":
      a = (0, x._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, x._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, x._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, x._)`typeof ${t} ${s} ${e}`;
  }
  return n === Ir.Correct ? a : (0, x.not)(a);
  function o(l = x.nil) {
    return (0, x.and)((0, x._)`typeof ${t} == "number"`, l, r ? (0, x._)`isFinite(${t})` : x.nil);
  }
}
_e.checkDataType = ga;
function jo(e, t, r, n) {
  if (e.length === 1)
    return ga(e[0], t, r, n);
  let s;
  const a = (0, Ou.toHash)(e);
  if (a.array && a.object) {
    const o = (0, x._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, x._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = x.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, x.and)(s, ga(o, t, r, n));
  return s;
}
_e.checkDataTypes = jo;
const wg = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, x._)`{type: ${e}}` : (0, x._)`{type: ${t}}`
};
function ko(e) {
  const t = Eg(e);
  (0, pg.reportError)(t, wg);
}
_e.reportTypeError = ko;
function Eg(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, Ou.schemaRefOrVal)(e, n, "type");
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
var bs = {};
Object.defineProperty(bs, "__esModule", { value: !0 });
bs.assignDefaults = void 0;
const $r = te, bg = C;
function Sg(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      uc(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => uc(e, a, s.default));
}
bs.assignDefaults = Sg;
function uc(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, $r._)`${a}${(0, $r.getProperty)(t)}`;
  if (s) {
    (0, bg.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, $r._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, $r._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, $r._)`${l} = ${(0, $r.stringify)(r)}`);
}
var ft = {}, ne = {};
Object.defineProperty(ne, "__esModule", { value: !0 });
ne.validateUnion = ne.validateArray = ne.usePattern = ne.callValidateCode = ne.schemaProperties = ne.allSchemaProperties = ne.noPropertyInData = ne.propertyInData = ne.isOwnProperty = ne.hasPropFunc = ne.reportMissingProp = ne.checkMissingProp = ne.checkReportMissingProp = void 0;
const ue = te, Ao = C, Ot = ht, Pg = C;
function Ng(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Do(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ue._)`${t}` }, !0), e.error();
  });
}
ne.checkReportMissingProp = Ng;
function Rg({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ue.or)(...n.map((a) => (0, ue.and)(Do(e, t, a, r.ownProperties), (0, ue._)`${s} = ${a}`)));
}
ne.checkMissingProp = Rg;
function Og(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ne.reportMissingProp = Og;
function ju(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ue._)`Object.prototype.hasOwnProperty`
  });
}
ne.hasPropFunc = ju;
function Co(e, t, r) {
  return (0, ue._)`${ju(e)}.call(${t}, ${r})`;
}
ne.isOwnProperty = Co;
function Ig(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} !== undefined`;
  return n ? (0, ue._)`${s} && ${Co(e, t, r)}` : s;
}
ne.propertyInData = Ig;
function Do(e, t, r, n) {
  const s = (0, ue._)`${t}${(0, ue.getProperty)(r)} === undefined`;
  return n ? (0, ue.or)(s, (0, ue.not)(Co(e, t, r))) : s;
}
ne.noPropertyInData = Do;
function ku(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ne.allSchemaProperties = ku;
function Tg(e, t) {
  return ku(t).filter((r) => !(0, Ao.alwaysValidSchema)(e, t[r]));
}
ne.schemaProperties = Tg;
function jg({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, ue._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Ot.default.instancePath, (0, ue.strConcat)(Ot.default.instancePath, a)],
    [Ot.default.parentData, o.parentData],
    [Ot.default.parentDataProperty, o.parentDataProperty],
    [Ot.default.rootData, Ot.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Ot.default.dynamicAnchors, Ot.default.dynamicAnchors]);
  const E = (0, ue._)`${u}, ${r.object(...h)}`;
  return c !== ue.nil ? (0, ue._)`${l}.call(${c}, ${E})` : (0, ue._)`${l}(${E})`;
}
ne.callValidateCode = jg;
const kg = (0, ue._)`new RegExp`;
function Ag({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ue._)`${s.code === "new RegExp" ? kg : (0, Pg.useFunc)(e, s)}(${r}, ${n})`
  });
}
ne.usePattern = Ag;
function Cg(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, ue._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: Ao.Type.Num
      }, a), t.if((0, ue.not)(a), l);
    });
  }
}
ne.validateArray = Cg;
function Dg(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, Ao.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, ue._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, ue.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
ne.validateUnion = Dg;
Object.defineProperty(ft, "__esModule", { value: !0 });
ft.validateKeywordUsage = ft.validSchemaType = ft.funcKeywordCode = ft.macroKeywordCode = void 0;
const Ae = te, ar = ht, Mg = ne, Vg = vn;
function Lg(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = Au(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Ae.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
ft.macroKeywordCode = Lg;
function Fg(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  Ug(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = Au(n, s, d), h = n.let("valid");
  e.block$data(h, E), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function E() {
    if (t.errors === !1)
      _(), t.modifying && dc(e), $(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && dc(e), $(() => zg(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Ae._)`await `), (v) => n.assign(h, !1).if((0, Ae._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Ae._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, Ae._)`${u}.errors`;
    return n.assign(m, null), _(Ae.nil), m;
  }
  function _(m = t.async ? (0, Ae._)`await ` : Ae.nil) {
    const v = c.opts.passContext ? ar.default.this : ar.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Ae._)`${m}${(0, Mg.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function $(m) {
    var v;
    n.if((0, Ae.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
ft.funcKeywordCode = Fg;
function dc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ae._)`${n.parentData}[${n.parentDataProperty}]`));
}
function zg(e, t) {
  const { gen: r } = e;
  r.if((0, Ae._)`Array.isArray(${t})`, () => {
    r.assign(ar.default.vErrors, (0, Ae._)`${ar.default.vErrors} === null ? ${t} : ${ar.default.vErrors}.concat(${t})`).assign(ar.default.errors, (0, Ae._)`${ar.default.vErrors}.length`), (0, Vg.extendErrors)(e);
  }, () => e.error());
}
function Ug({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Au(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ae.stringify)(r) });
}
function qg(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
ft.validSchemaType = qg;
function Kg({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
ft.validateKeywordUsage = Kg;
var Lt = {};
Object.defineProperty(Lt, "__esModule", { value: !0 });
Lt.extendSubschemaMode = Lt.extendSubschemaData = Lt.getSubschema = void 0;
const lt = te, Cu = C;
function Gg(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, lt._)`${e.schemaPath}${(0, lt.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, lt._)`${e.schemaPath}${(0, lt.getProperty)(t)}${(0, lt.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Cu.escapeFragment)(r)}`
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
Lt.getSubschema = Gg;
function Hg(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, E = l.let("data", (0, lt._)`${t.data}${(0, lt.getProperty)(r)}`, !0);
    c(E), e.errorPath = (0, lt.str)`${d}${(0, Cu.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, lt._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof lt.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Lt.extendSubschemaData = Hg;
function Xg(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Lt.extendSubschemaMode = Xg;
var Pe = {}, Du = { exports: {} }, Mt = Du.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Zn(t, n, s, e, "", e);
};
Mt.keywords = {
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
Mt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Mt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Mt.skipKeywords = {
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
function Zn(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in Mt.arrayKeywords)
          for (var E = 0; E < h.length; E++)
            Zn(e, t, r, h[E], s + "/" + u + "/" + E, a, s, u, n, E);
      } else if (u in Mt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Zn(e, t, r, h[g], s + "/" + u + "/" + Bg(g), a, s, u, n, g);
      } else (u in Mt.keywords || e.allKeys && !(u in Mt.skipKeywords)) && Zn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function Bg(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Jg = Du.exports;
Object.defineProperty(Pe, "__esModule", { value: !0 });
Pe.getSchemaRefs = Pe.resolveUrl = Pe.normalizeId = Pe._getFullPath = Pe.getFullPath = Pe.inlineRef = void 0;
const Wg = C, Yg = ys, Qg = Jg, Zg = /* @__PURE__ */ new Set([
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
function xg(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !_a(e) : t ? Mu(e) <= t : !1;
}
Pe.inlineRef = xg;
const e_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function _a(e) {
  for (const t in e) {
    if (e_.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(_a) || typeof r == "object" && _a(r))
      return !0;
  }
  return !1;
}
function Mu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Zg.has(r) && (typeof e[r] == "object" && (0, Wg.eachItem)(e[r], (n) => t += Mu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Vu(e, t = "", r) {
  r !== !1 && (t = Tr(t));
  const n = e.parse(t);
  return Lu(e, n);
}
Pe.getFullPath = Vu;
function Lu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Pe._getFullPath = Lu;
const t_ = /#\/?$/;
function Tr(e) {
  return e ? e.replace(t_, "") : "";
}
Pe.normalizeId = Tr;
function r_(e, t, r) {
  return r = Tr(r), e.resolve(t, r);
}
Pe.resolveUrl = r_;
const n_ = /^[a-z_][-a-z0-9._]*$/i;
function s_(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = Tr(e[r] || t), a = { "": s }, o = Vu(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Qg(e, { allKeys: !0 }, (h, E, g, w) => {
    if (w === void 0)
      return;
    const _ = o + E;
    let $ = a[w];
    typeof h[r] == "string" && ($ = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[E] = $;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = Tr($ ? R($, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== Tr(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!n_.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, E, g) {
    if (E !== void 0 && !Yg(h, E))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Pe.getSchemaRefs = s_;
Object.defineProperty(rt, "__esModule", { value: !0 });
rt.getData = rt.KeywordCxt = rt.validateFunctionCode = void 0;
const Fu = Mr, fc = _e, Mo = _t, us = _e, a_ = bs, un = ft, Hs = Lt, q = te, B = ht, o_ = Pe, vt = C, Zr = vn;
function i_(e) {
  if (qu(e) && (Ku(e), Uu(e))) {
    u_(e);
    return;
  }
  zu(e, () => (0, Fu.topBoolOrEmptySchema)(e));
}
rt.validateFunctionCode = i_;
function zu({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, q._)`${B.default.data}, ${B.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${hc(r, s)}`), l_(e, s), e.code(a);
  }) : e.func(t, (0, q._)`${B.default.data}, ${c_(s)}`, n.$async, () => e.code(hc(r, s)).code(a));
}
function c_(e) {
  return (0, q._)`{${B.default.instancePath}="", ${B.default.parentData}, ${B.default.parentDataProperty}, ${B.default.rootData}=${B.default.data}${e.dynamicRef ? (0, q._)`, ${B.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function l_(e, t) {
  e.if(B.default.valCxt, () => {
    e.var(B.default.instancePath, (0, q._)`${B.default.valCxt}.${B.default.instancePath}`), e.var(B.default.parentData, (0, q._)`${B.default.valCxt}.${B.default.parentData}`), e.var(B.default.parentDataProperty, (0, q._)`${B.default.valCxt}.${B.default.parentDataProperty}`), e.var(B.default.rootData, (0, q._)`${B.default.valCxt}.${B.default.rootData}`), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, q._)`${B.default.valCxt}.${B.default.dynamicAnchors}`);
  }, () => {
    e.var(B.default.instancePath, (0, q._)`""`), e.var(B.default.parentData, (0, q._)`undefined`), e.var(B.default.parentDataProperty, (0, q._)`undefined`), e.var(B.default.rootData, B.default.data), t.dynamicRef && e.var(B.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function u_(e) {
  const { schema: t, opts: r, gen: n } = e;
  zu(e, () => {
    r.$comment && t.$comment && Hu(e), p_(e), n.let(B.default.vErrors, null), n.let(B.default.errors, 0), r.unevaluated && d_(e), Gu(e), g_(e);
  });
}
function d_(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function hc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function f_(e, t) {
  if (qu(e) && (Ku(e), Uu(e))) {
    h_(e, t);
    return;
  }
  (0, Fu.boolOrEmptySchema)(e, t);
}
function Uu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function qu(e) {
  return typeof e.schema != "boolean";
}
function h_(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Hu(e), y_(e), $_(e);
  const a = n.const("_errs", B.default.errors);
  Gu(e, a), n.var(t, (0, q._)`${a} === ${B.default.errors}`);
}
function Ku(e) {
  (0, vt.checkUnknownRules)(e), m_(e);
}
function Gu(e, t) {
  if (e.opts.jtd)
    return mc(e, [], !1, t);
  const r = (0, fc.getSchemaTypes)(e.schema), n = (0, fc.coerceAndCheckDataType)(e, r);
  mc(e, r, !n, t);
}
function m_(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, vt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function p_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, vt.checkStrictMode)(e, "default is ignored in the schema root");
}
function y_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, o_.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function $_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Hu({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, q._)`${B.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, q.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, q._)`${B.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function g_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, q._)`${B.default.errors} === 0`, () => t.return(B.default.data), () => t.throw((0, q._)`new ${s}(${B.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, B.default.vErrors), a.unevaluated && __(e), t.return((0, q._)`${B.default.errors} === 0`));
}
function __({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function mc(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, vt.schemaHasRulesButRef)(a, u))) {
    s.block(() => Ju(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || v_(e, t), s.block(() => {
    for (const E of u.rules)
      h(E);
    h(u.post);
  });
  function h(E) {
    (0, Mo.shouldUseGroup)(a, E) && (E.type ? (s.if((0, us.checkDataType)(E.type, o, c.strictNumbers)), pc(e, E), t.length === 1 && t[0] === E.type && r && (s.else(), (0, us.reportTypeError)(e)), s.endIf()) : pc(e, E), l || s.if((0, q._)`${B.default.errors} === ${n || 0}`));
  }
}
function pc(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, a_.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Mo.shouldUseRule)(n, a) && Ju(e, a.keyword, a.definition, t.type);
  });
}
function v_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (w_(e, t), e.opts.allowUnionTypes || E_(e, t), b_(e, e.dataTypes));
}
function w_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Xu(e.dataTypes, r) || Vo(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), P_(e, t);
  }
}
function E_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Vo(e, "use allowUnionTypes to allow union type keyword");
}
function b_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Mo.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => S_(t, o)) && Vo(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function S_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Xu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function P_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Xu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Vo(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, vt.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Bu {
  constructor(t, r, n) {
    if ((0, un.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, vt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Wu(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, un.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", B.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, q.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, q.not)(t), void 0, r);
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
    this.fail((0, q._)`${r} !== undefined && (${(0, q.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Zr.reportExtraError : Zr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Zr.reportError)(this, this.def.$dataError || Zr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Zr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = q.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = q.nil, r = q.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), t !== q.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== q.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, q.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, us.checkDataTypes)(c, r, a.opts.strictNumbers, us.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${c}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Hs.getSubschema)(this.it, t);
    (0, Hs.extendSubschemaData)(n, this.it, t), (0, Hs.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return f_(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = vt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = vt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, q.Name)), !0;
  }
}
rt.KeywordCxt = Bu;
function Ju(e, t, r, n) {
  const s = new Bu(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, un.funcKeywordCode)(s, r) : "macro" in r ? (0, un.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, un.funcKeywordCode)(s, r);
}
const N_ = /^\/(?:[^~]|~0|~1)*$/, R_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Wu(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return B.default.rootData;
  if (e[0] === "/") {
    if (!N_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = B.default.rootData;
  } else {
    const d = R_.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, q._)`${a}${(0, q.getProperty)((0, vt.unescapeJsonPointer)(d))}`, o = (0, q._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
rt.getData = Wu;
var jn = {}, yc;
function Lo() {
  if (yc) return jn;
  yc = 1, Object.defineProperty(jn, "__esModule", { value: !0 });
  class e extends Error {
    constructor(r) {
      super("validation failed"), this.errors = r, this.ajv = this.validation = !0;
    }
  }
  return jn.default = e, jn;
}
var kn = {}, $c;
function Ss() {
  if ($c) return kn;
  $c = 1, Object.defineProperty(kn, "__esModule", { value: !0 });
  const e = Pe;
  class t extends Error {
    constructor(n, s, a, o) {
      super(o || `can't resolve reference ${a} from id ${s}`), this.missingRef = (0, e.resolveUrl)(n, s, a), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(n, this.missingRef));
    }
  }
  return kn.default = t, kn;
}
var ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
ze.resolveSchema = ze.getCompilingSchema = ze.resolveRef = ze.compileSchema = ze.SchemaEnv = void 0;
const Ye = te, O_ = Lo(), er = ht, et = Pe, gc = C, I_ = rt;
class Ps {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, et.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
ze.SchemaEnv = Ps;
function Fo(e) {
  const t = Yu.call(this, e);
  if (t)
    return t;
  const r = (0, et.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new Ye.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: O_.default,
    code: (0, Ye._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: er.default.data,
    parentData: er.default.parentData,
    parentDataProperty: er.default.parentDataProperty,
    dataNames: [er.default.data],
    dataPathArr: [Ye.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Ye.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: Ye.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Ye._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, I_.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(er.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${er.default.self}`, `${er.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof Ye.Name ? void 0 : w,
        items: _ instanceof Ye.Name ? void 0 : _,
        dynamicProps: w instanceof Ye.Name,
        dynamicItems: _ instanceof Ye.Name
      }, g.source && (g.source.evaluated = (0, Ye.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
ze.compileSchema = Fo;
function T_(e, t, r) {
  var n;
  r = (0, et.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = A_.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new Ps({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = j_.call(this, a);
}
ze.resolveRef = T_;
function j_(e) {
  return (0, et.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Fo.call(this, e);
}
function Yu(e) {
  for (const t of this._compilations)
    if (k_(t, e))
      return t;
}
ze.getCompilingSchema = Yu;
function k_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function A_(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || Ns.call(this, e, t);
}
function Ns(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, et._getFullPath)(this.opts.uriResolver, r);
  let s = (0, et.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Xs.call(this, r, e);
  const a = (0, et.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = Ns.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Xs.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Fo.call(this, o), a === (0, et.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, et.resolveUrl)(this.opts.uriResolver, s, d)), new Ps({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return Xs.call(this, r, o);
  }
}
ze.resolveSchema = Ns;
const C_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Xs(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, gc.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !C_.has(l) && d && (t = (0, et.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, gc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, et.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = Ns.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new Ps({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const D_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", M_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", V_ = "object", L_ = [
  "$data"
], F_ = {
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
}, z_ = !1, U_ = {
  $id: D_,
  description: M_,
  type: V_,
  required: L_,
  properties: F_,
  additionalProperties: z_
};
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
const Qu = ou;
Qu.code = 'require("ajv/dist/runtime/uri").default';
zo.default = Qu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = rt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = te;
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
  const n = Lo(), s = Ss(), a = hr, o = ze, l = te, c = Pe, d = _e, u = C, h = U_, E = zo, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
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
  }, v = 200;
  function N(P) {
    var p, S, y, i, f, b, I, j, F, L, se, Ue, Ft, zt, Ut, qt, Kt, Gt, Ht, Xt, Bt, Jt, Wt, Yt, Qt;
    const Be = P.strict, Zt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Xr = Zt === !0 || Zt === void 0 ? 1 : Zt || 0, Br = (y = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && y !== void 0 ? y : g, Cs = (i = P.uriResolver) !== null && i !== void 0 ? i : E.default;
    return {
      strictSchema: (b = (f = P.strictSchema) !== null && f !== void 0 ? f : Be) !== null && b !== void 0 ? b : !0,
      strictNumbers: (j = (I = P.strictNumbers) !== null && I !== void 0 ? I : Be) !== null && j !== void 0 ? j : !0,
      strictTypes: (L = (F = P.strictTypes) !== null && F !== void 0 ? F : Be) !== null && L !== void 0 ? L : "log",
      strictTuples: (Ue = (se = P.strictTuples) !== null && se !== void 0 ? se : Be) !== null && Ue !== void 0 ? Ue : "log",
      strictRequired: (zt = (Ft = P.strictRequired) !== null && Ft !== void 0 ? Ft : Be) !== null && zt !== void 0 ? zt : !1,
      code: P.code ? { ...P.code, optimize: Xr, regExp: Br } : { optimize: Xr, regExp: Br },
      loopRequired: (Ut = P.loopRequired) !== null && Ut !== void 0 ? Ut : v,
      loopEnum: (qt = P.loopEnum) !== null && qt !== void 0 ? qt : v,
      meta: (Kt = P.meta) !== null && Kt !== void 0 ? Kt : !0,
      messages: (Gt = P.messages) !== null && Gt !== void 0 ? Gt : !0,
      inlineRefs: (Ht = P.inlineRefs) !== null && Ht !== void 0 ? Ht : !0,
      schemaId: (Xt = P.schemaId) !== null && Xt !== void 0 ? Xt : "$id",
      addUsedSchema: (Bt = P.addUsedSchema) !== null && Bt !== void 0 ? Bt : !0,
      validateSchema: (Jt = P.validateSchema) !== null && Jt !== void 0 ? Jt : !0,
      validateFormats: (Wt = P.validateFormats) !== null && Wt !== void 0 ? Wt : !0,
      unicodeRegExp: (Yt = P.unicodeRegExp) !== null && Yt !== void 0 ? Yt : !0,
      int32range: (Qt = P.int32range) !== null && Qt !== void 0 ? Qt : !0,
      uriResolver: Cs
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: y } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: y }), this.logger = H(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, $, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), p.formats && de.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && me.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), J.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: y } = this.opts;
      let i = h;
      y === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[y], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let y;
      if (typeof p == "string") {
        if (y = this.getSchema(p), !y)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        y = this.compile(p);
      const i = y(S);
      return "$async" in y || (this.errors = y.errors), i;
    }
    compile(p, S) {
      const y = this._addSchema(p, S);
      return y.validate || this._compileSchemaEnv(y);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: y } = this.opts;
      return i.call(this, p, S);
      async function i(L, se) {
        await f.call(this, L.$schema);
        const Ue = this._addSchema(L, se);
        return Ue.validate || b.call(this, Ue);
      }
      async function f(L) {
        L && !this.getSchema(L) && await i.call(this, { $ref: L }, !0);
      }
      async function b(L) {
        try {
          return this._compileSchemaEnv(L);
        } catch (se) {
          if (!(se instanceof s.default))
            throw se;
          return I.call(this, se), await j.call(this, se.missingSchema), b.call(this, L);
        }
      }
      function I({ missingSchema: L, missingRef: se }) {
        if (this.refs[L])
          throw new Error(`AnySchema ${L} is loaded but ${se} cannot be resolved`);
      }
      async function j(L) {
        const se = await F.call(this, L);
        this.refs[L] || await f.call(this, se.$schema), this.refs[L] || this.addSchema(se, L, S);
      }
      async function F(L) {
        const se = this._loading[L];
        if (se)
          return se;
        try {
          return await (this._loading[L] = y(L));
        } finally {
          delete this._loading[L];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, y, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const b of p)
          this.addSchema(b, void 0, y, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: b } = this.opts;
        if (f = p[b], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${b} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, y, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, y = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, y), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let y;
      if (y = p.$schema, y !== void 0 && typeof y != "string")
        throw new Error("$schema must be a string");
      if (y = y || this.opts.defaultMeta || this.defaultMeta(), !y)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate(y, p);
      if (!i && S) {
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
      let S;
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: y } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: y });
        if (S = o.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
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
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let y = p[this.opts.schemaId];
          return y && (y = (0, c.normalizeId)(y), delete this.schemas[y], delete this.refs[y]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let y;
      if (typeof p == "string")
        y = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = y);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, y = S.keyword, Array.isArray(y) && !y.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, y, S), !S)
        return (0, u.eachItem)(y, (f) => k.call(this, f)), this;
      D.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)(y, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((b) => k.call(this, f, i, b))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const y of S.rules) {
        const i = y.rules.findIndex((f) => f.keyword === p);
        i >= 0 && y.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: y = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${y}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const y = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let b = p;
        for (const I of f)
          b = b[I];
        for (const I in y) {
          const j = y[I];
          if (typeof j != "object")
            continue;
          const { $data: F } = j.definition, L = b[I];
          F && L && (b[I] = M(L));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const y in p) {
        const i = p[y];
        (!S || S.test(y)) && (typeof i == "string" ? delete p[y] : i && !i.meta && (this._cache.delete(i.schema), delete p[y]));
      }
    }
    _addSchema(p, S, y, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let b;
      const { schemaId: I } = this.opts;
      if (typeof p == "object")
        b = p[I];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      y = (0, c.normalizeId)(b || y);
      const F = c.getSchemaRefs.call(this, p, y);
      return j = new o.SchemaEnv({ schema: p, schemaId: I, meta: S, baseId: y, localRefs: F }), this._cache.set(j.schema, j), f && !y.startsWith("#") && (y && this._checkUnique(y), this.refs[y] = j), i && this.validateSchema(p, !0), j;
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
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, y = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[y](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function J() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function de() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function me(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function $e() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function H(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const ae = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, (y) => {
      if (S.keywords[y])
        throw new Error(`Keyword ${y} is already defined`);
      if (!ae.test(y))
        throw new Error(`Keyword ${y} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(P, p, S) {
    var y;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let b = i ? f.post : f.rules.find(({ type: j }) => j === S);
    if (b || (b = { type: S, rules: [] }, f.rules.push(b)), f.keywords[P] = !0, !p)
      return;
    const I = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? V.call(this, b, I, p.before) : b.rules.push(I), f.all[P] = I, (y = p.implements) === null || y === void 0 || y.forEach((j) => this.addKeyword(j));
  }
  function V(P, p, S) {
    const y = P.rules.findIndex((i) => i.keyword === S);
    y >= 0 ? P.rules.splice(y, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, G] };
  }
})(_u);
var Uo = {}, qo = {}, Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const q_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
Ko.default = q_;
var mr = {};
Object.defineProperty(mr, "__esModule", { value: !0 });
mr.callRef = mr.getValidate = void 0;
const K_ = Ss(), _c = ne, Fe = te, gr = ht, vc = ze, An = C, G_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = vc.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new K_.default(n.opts.uriResolver, s, r);
    if (u instanceof vc.SchemaEnv)
      return E(u);
    return g(u);
    function h() {
      if (a === d)
        return xn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return xn(e, (0, Fe._)`${w}.validate`, d, d.$async);
    }
    function E(w) {
      const _ = Zu(e, w);
      xn(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, Fe.stringify)(w) } : { ref: w }), $ = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Fe.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, $);
      e.mergeEvaluated(m), e.ok($);
    }
  }
};
function Zu(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Fe._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
mr.getValidate = Zu;
function xn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? gr.default.this : Fe.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Fe._)`await ${(0, _c.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Fe._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), E(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, _c.callValidateCode)(e, t, d), () => g(t), () => E(t));
  }
  function E(w) {
    const _ = (0, Fe._)`${w}.errors`;
    s.assign(gr.default.vErrors, (0, Fe._)`${gr.default.vErrors} === null ? ${_} : ${gr.default.vErrors}.concat(${_})`), s.assign(gr.default.errors, (0, Fe._)`${gr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const $ = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if ($ && !$.dynamicProps)
        $.props !== void 0 && (a.props = An.mergeEvaluated.props(s, $.props, a.props));
      else {
        const m = s.var("props", (0, Fe._)`${w}.evaluated.props`);
        a.props = An.mergeEvaluated.props(s, m, a.props, Fe.Name);
      }
    if (a.items !== !0)
      if ($ && !$.dynamicItems)
        $.items !== void 0 && (a.items = An.mergeEvaluated.items(s, $.items, a.items));
      else {
        const m = s.var("items", (0, Fe._)`${w}.evaluated.items`);
        a.items = An.mergeEvaluated.items(s, m, a.items, Fe.Name);
      }
  }
}
mr.callRef = xn;
mr.default = G_;
Object.defineProperty(qo, "__esModule", { value: !0 });
const H_ = Ko, X_ = mr, B_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  H_.default,
  X_.default
];
qo.default = B_;
var Go = {}, Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
const ds = te, It = ds.operators, fs = {
  maximum: { okStr: "<=", ok: It.LTE, fail: It.GT },
  minimum: { okStr: ">=", ok: It.GTE, fail: It.LT },
  exclusiveMaximum: { okStr: "<", ok: It.LT, fail: It.GTE },
  exclusiveMinimum: { okStr: ">", ok: It.GT, fail: It.LTE }
}, J_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, ds.str)`must be ${fs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, ds._)`{comparison: ${fs[e].okStr}, limit: ${t}}`
}, W_ = {
  keyword: Object.keys(fs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: J_,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, ds._)`${r} ${fs[t].fail} ${n} || isNaN(${r})`);
  }
};
Ho.default = W_;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const dn = te, Y_ = {
  message: ({ schemaCode: e }) => (0, dn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, dn._)`{multipleOf: ${e}}`
}, Q_ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Y_,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, dn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, dn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, dn._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Xo.default = Q_;
var Bo = {}, Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
function xu(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Jo.default = xu;
xu.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Bo, "__esModule", { value: !0 });
const or = te, Z_ = C, x_ = Jo, ev = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, or.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, or._)`{limit: ${e}}`
}, tv = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: ev,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? or.operators.GT : or.operators.LT, o = s.opts.unicode === !1 ? (0, or._)`${r}.length` : (0, or._)`${(0, Z_.useFunc)(e.gen, x_.default)}(${r})`;
    e.fail$data((0, or._)`${o} ${a} ${n}`);
  }
};
Bo.default = tv;
var Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
const rv = ne, nv = C, Nr = te, sv = {
  message: ({ schemaCode: e }) => (0, Nr.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Nr._)`{pattern: ${e}}`
}, av = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: sv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e, l = o.opts.unicodeRegExp ? "u" : "";
    if (n) {
      const { regExp: c } = o.opts.code, d = c.code === "new RegExp" ? (0, Nr._)`new RegExp` : (0, nv.useFunc)(t, c), u = t.let("valid");
      t.try(() => t.assign(u, (0, Nr._)`${d}(${a}, ${l}).test(${r})`), () => t.assign(u, !1)), e.fail$data((0, Nr._)`!${u}`);
    } else {
      const c = (0, rv.usePattern)(e, s);
      e.fail$data((0, Nr._)`!${c}.test(${r})`);
    }
  }
};
Wo.default = av;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const fn = te, ov = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, fn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, fn._)`{limit: ${e}}`
}, iv = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: ov,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? fn.operators.GT : fn.operators.LT;
    e.fail$data((0, fn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Yo.default = iv;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const xr = ne, hn = te, cv = C, lv = {
  message: ({ params: { missingProperty: e } }) => (0, hn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, hn._)`{missingProperty: ${e}}`
}, uv = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: lv,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const $ = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${$}" (strictRequired)`;
          (0, cv.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(hn.nil, h);
      else
        for (const g of r)
          (0, xr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => E(g, w)), e.ok(w);
      } else
        t.if((0, xr.checkMissingProp)(e, r, g)), (0, xr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, xr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function E(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, xr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, hn.not)(w), () => {
          e.error(), t.break();
        });
      }, hn.nil);
    }
  }
};
Qo.default = uv;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const mn = te, dv = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, mn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, mn._)`{limit: ${e}}`
}, fv = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: dv,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? mn.operators.GT : mn.operators.LT;
    e.fail$data((0, mn._)`${r}.length ${s} ${n}`);
  }
};
Zo.default = fv;
var xo = {}, wn = {};
Object.defineProperty(wn, "__esModule", { value: !0 });
const ed = ys;
ed.code = 'require("ajv/dist/runtime/equal").default';
wn.default = ed;
Object.defineProperty(xo, "__esModule", { value: !0 });
const Bs = _e, be = te, hv = C, mv = wn, pv = {
  message: ({ params: { i: e, j: t } }) => (0, be.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, be._)`{i: ${e}, j: ${t}}`
}, yv = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: pv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Bs.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, be._)`${o} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, be._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, be._)`${w} > 1`, () => (h() ? E : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function E(w, _) {
      const $ = t.name("item"), m = (0, Bs.checkDataTypes)(d, $, l.opts.strictNumbers, Bs.DataType.Wrong), v = t.const("indices", (0, be._)`{}`);
      t.for((0, be._)`;${w}--;`, () => {
        t.let($, (0, be._)`${r}[${w}]`), t.if(m, (0, be._)`continue`), d.length > 1 && t.if((0, be._)`typeof ${$} == "string"`, (0, be._)`${$} += "_"`), t.if((0, be._)`typeof ${v}[${$}] == "number"`, () => {
          t.assign(_, (0, be._)`${v}[${$}]`), e.error(), t.assign(c, !1).break();
        }).code((0, be._)`${v}[${$}] = ${w}`);
      });
    }
    function g(w, _) {
      const $ = (0, hv.useFunc)(t, mv.default), m = t.name("outer");
      t.label(m).for((0, be._)`;${w}--;`, () => t.for((0, be._)`${_} = ${w}; ${_}--;`, () => t.if((0, be._)`${$}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
xo.default = yv;
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const va = te, $v = C, gv = wn, _v = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, va._)`{allowedValue: ${e}}`
}, vv = {
  keyword: "const",
  $data: !0,
  error: _v,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, va._)`!${(0, $v.useFunc)(t, gv.default)}(${r}, ${s})`) : e.fail((0, va._)`${a} !== ${r}`);
  }
};
ei.default = vv;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const nn = te, wv = C, Ev = wn, bv = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, nn._)`{allowedValues: ${e}}`
}, Sv = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: bv,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, wv.useFunc)(t, Ev.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      u = (0, nn.or)(...s.map((w, _) => E(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (g) => t.if((0, nn._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function E(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, nn._)`${d()}(${r}, ${g}[${w}])` : (0, nn._)`${r} === ${_}`;
    }
  }
};
ti.default = Sv;
Object.defineProperty(Go, "__esModule", { value: !0 });
const Pv = Ho, Nv = Xo, Rv = Bo, Ov = Wo, Iv = Yo, Tv = Qo, jv = Zo, kv = xo, Av = ei, Cv = ti, Dv = [
  // number
  Pv.default,
  Nv.default,
  // string
  Rv.default,
  Ov.default,
  // object
  Iv.default,
  Tv.default,
  // array
  jv.default,
  kv.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Av.default,
  Cv.default
];
Go.default = Dv;
var ri = {}, Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
Kr.validateAdditionalItems = void 0;
const ir = te, wa = C, Mv = {
  message: ({ params: { len: e } }) => (0, ir.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, ir._)`{limit: ${e}}`
}, Vv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: Mv,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, wa.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    td(e, n);
  }
};
function td(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, ir._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, ir._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, wa.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, ir._)`${l} <= ${t.length}`);
    r.if((0, ir.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: wa.Type.Num }, d), o.allErrors || r.if((0, ir.not)(d), () => r.break());
    });
  }
}
Kr.validateAdditionalItems = td;
Kr.default = Vv;
var ni = {}, Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.validateTuple = void 0;
const wc = te, es = C, Lv = ne, Fv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return rd(e, "additionalItems", t);
    r.items = !0, !(0, es.alwaysValidSchema)(r, t) && e.ok((0, Lv.validateArray)(e));
  }
};
function rd(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = es.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, wc._)`${a}.length`);
  r.forEach((h, E) => {
    (0, es.alwaysValidSchema)(l, h) || (n.if((0, wc._)`${d} > ${E}`, () => e.subschema({
      keyword: o,
      schemaProp: E,
      dataProp: E
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: E, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (E.strictTuples && !_) {
      const $ = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, es.checkStrictMode)(l, $, E.strictTuples);
    }
  }
}
Gr.validateTuple = rd;
Gr.default = Fv;
Object.defineProperty(ni, "__esModule", { value: !0 });
const zv = Gr, Uv = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, zv.validateTuple)(e, "items")
};
ni.default = Uv;
var si = {};
Object.defineProperty(si, "__esModule", { value: !0 });
const Ec = te, qv = C, Kv = ne, Gv = Kr, Hv = {
  message: ({ params: { len: e } }) => (0, Ec.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Ec._)`{limit: ${e}}`
}, Xv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: Hv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, qv.alwaysValidSchema)(n, t) && (s ? (0, Gv.validateAdditionalItems)(e, s) : e.ok((0, Kv.validateArray)(e)));
  }
};
si.default = Xv;
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const Xe = te, Cn = C, Bv = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Xe.str)`must contain at least ${e} valid item(s)` : (0, Xe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Xe._)`{minContains: ${e}}` : (0, Xe._)`{minContains: ${e}, maxContains: ${t}}`
}, Jv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Bv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, Xe._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, Cn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, Cn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, Cn.alwaysValidSchema)(a, r)) {
      let _ = (0, Xe._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, Xe._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Xe._)`${s}.length > 0`, E)) : (t.let(h, !1), E()), e.result(h, () => e.reset());
    function E() {
      const _ = t.name("_valid"), $ = t.let("count", 0);
      g(_, () => t.if(_, () => w($)));
    }
    function g(_, $) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: Cn.Type.Num,
          compositeRule: !0
        }, _), $();
      });
    }
    function w(_) {
      t.code((0, Xe._)`${_}++`), l === void 0 ? t.if((0, Xe._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Xe._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Xe._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
ai.default = Jv;
var nd = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = te, r = C, n = ne;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
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
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const E = Array.isArray(c[h]) ? d : u;
      E[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: E } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const $ = (0, n.propertyInData)(u, h, w, E.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), E.allErrors ? u.if($, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${$} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: E, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const $ = c.subschema({ keyword: E, schemaProp: _ }, w);
          c.mergeValidEvaluated($, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(nd);
var oi = {};
Object.defineProperty(oi, "__esModule", { value: !0 });
const sd = te, Wv = C, Yv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, sd._)`{propertyName: ${e.propertyName}}`
}, Qv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Yv,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Wv.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, sd.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
oi.default = Qv;
var Rs = {};
Object.defineProperty(Rs, "__esModule", { value: !0 });
const Dn = ne, Ze = te, Zv = ht, Mn = C, xv = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Ze._)`{additionalProperty: ${e.additionalProperty}}`
}, ew = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: xv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Mn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Dn.allSchemaProperties)(n.properties), u = (0, Dn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Ze._)`${a} === ${Zv.default.errors}`);
    function h() {
      t.forIn("key", s, ($) => {
        !d.length && !u.length ? w($) : t.if(E($), () => w($));
      });
    }
    function E($) {
      let m;
      if (d.length > 8) {
        const v = (0, Mn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Dn.isOwnProperty)(t, v, $);
      } else d.length ? m = (0, Ze.or)(...d.map((v) => (0, Ze._)`${$} === ${v}`)) : m = Ze.nil;
      return u.length && (m = (0, Ze.or)(m, ...u.map((v) => (0, Ze._)`${(0, Dn.usePattern)(e, v)}.test(${$})`))), (0, Ze.not)(m);
    }
    function g($) {
      t.code((0, Ze._)`delete ${s}[${$}]`);
    }
    function w($) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g($);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: $ }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Mn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_($, m, !1), t.if((0, Ze.not)(m), () => {
          e.reset(), g($);
        })) : (_($, m), l || t.if((0, Ze.not)(m), () => t.break()));
      }
    }
    function _($, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: $,
        dataPropType: Mn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
Rs.default = ew;
var ii = {};
Object.defineProperty(ii, "__esModule", { value: !0 });
const tw = rt, bc = ne, Js = C, Sc = Rs, rw = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Sc.default.code(new tw.KeywordCxt(a, Sc.default, "additionalProperties"));
    const o = (0, bc.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Js.mergeEvaluated.props(t, (0, Js.toHash)(o), a.props));
    const l = o.filter((h) => !(0, Js.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, bc.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
ii.default = rw;
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
const Pc = ne, Vn = te, Nc = C, Rc = C, nw = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Pc.allSchemaProperties)(r), c = l.filter((_) => (0, Nc.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof Vn.Name) && (a.props = (0, Rc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    E();
    function E() {
      for (const _ of l)
        d && g(_), a.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const $ in d)
        new RegExp(_).test($) && (0, Nc.checkStrictMode)(a, `property ${$} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, ($) => {
        t.if((0, Vn._)`${(0, Pc.usePattern)(e, _)}.test(${$})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: $,
            dataPropType: Rc.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, Vn._)`${h}[${$}]`, !0) : !m && !a.allErrors && t.if((0, Vn.not)(u), () => t.break());
        });
      });
    }
  }
};
ci.default = nw;
var li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
const sw = C, aw = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, sw.alwaysValidSchema)(n, r)) {
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
li.default = aw;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
const ow = ne, iw = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: ow.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
ui.default = iw;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
const ts = te, cw = C, lw = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, ts._)`{passingSchemas: ${e.passing}}`
}, uw = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: lw,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let E;
        (0, cw.alwaysValidSchema)(s, u) ? t.var(c, !0) : E = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, ts._)`${c} && ${o}`).assign(o, !1).assign(l, (0, ts._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), E && e.mergeEvaluated(E, ts.Name);
        });
      });
    }
  }
};
di.default = uw;
var fi = {};
Object.defineProperty(fi, "__esModule", { value: !0 });
const dw = C, fw = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, dw.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
fi.default = fw;
var hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
const hs = te, ad = C, hw = {
  message: ({ params: e }) => (0, hs.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, hs._)`{failingKeyword: ${e.ifClause}}`
}, mw = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: hw,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, ad.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = Oc(n, "then"), a = Oc(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, hs.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const E = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(E, o), h ? t.assign(h, (0, hs._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function Oc(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, ad.alwaysValidSchema)(e, r);
}
hi.default = mw;
var mi = {};
Object.defineProperty(mi, "__esModule", { value: !0 });
const pw = C, yw = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, pw.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
mi.default = yw;
Object.defineProperty(ri, "__esModule", { value: !0 });
const $w = Kr, gw = ni, _w = Gr, vw = si, ww = ai, Ew = nd, bw = oi, Sw = Rs, Pw = ii, Nw = ci, Rw = li, Ow = ui, Iw = di, Tw = fi, jw = hi, kw = mi;
function Aw(e = !1) {
  const t = [
    // any
    Rw.default,
    Ow.default,
    Iw.default,
    Tw.default,
    jw.default,
    kw.default,
    // object
    bw.default,
    Sw.default,
    Ew.default,
    Pw.default,
    Nw.default
  ];
  return e ? t.push(gw.default, vw.default) : t.push($w.default, _w.default), t.push(ww.default), t;
}
ri.default = Aw;
var pi = {}, yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
const ye = te, Cw = {
  message: ({ schemaCode: e }) => (0, ye.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, ye._)`{format: ${e}}`
}, Dw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: Cw,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? E() : g();
    function E() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, ye._)`${w}[${o}]`), $ = r.let("fType"), m = r.let("format");
      r.if((0, ye._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign($, (0, ye._)`${_}.type || "string"`).assign(m, (0, ye._)`${_}.validate`), () => r.assign($, (0, ye._)`"string"`).assign(m, _)), e.fail$data((0, ye.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? ye.nil : (0, ye._)`${o} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, ye._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, ye._)`${m}(${n})`, O = (0, ye._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, ye._)`${m} && ${m} !== true && ${$} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, $, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const K = O instanceof RegExp ? (0, ye.regexpCode)(O) : c.code.formats ? (0, ye._)`${c.code.formats}${(0, ye.getProperty)(a)}` : void 0, J = r.scopeValue("formats", { key: a, ref: O, code: K });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, ye._)`${J}.validate`] : ["string", O, J];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, ye._)`await ${m}(${n})`;
        }
        return typeof $ == "function" ? (0, ye._)`${m}(${n})` : (0, ye._)`${m}.test(${n})`;
      }
    }
  }
};
yi.default = Dw;
Object.defineProperty(pi, "__esModule", { value: !0 });
const Mw = yi, Vw = [Mw.default];
pi.default = Vw;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.contentVocabulary = Vr.metadataVocabulary = void 0;
Vr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Vr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Uo, "__esModule", { value: !0 });
const Lw = qo, Fw = Go, zw = ri, Uw = pi, Ic = Vr, qw = [
  Lw.default,
  Fw.default,
  (0, zw.default)(),
  Uw.default,
  Ic.metadataVocabulary,
  Ic.contentVocabulary
];
Uo.default = qw;
var $i = {}, Os = {};
Object.defineProperty(Os, "__esModule", { value: !0 });
Os.DiscrError = void 0;
var Tc;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Tc || (Os.DiscrError = Tc = {}));
Object.defineProperty($i, "__esModule", { value: !0 });
const wr = te, Ea = Os, jc = ze, Kw = Ss(), Gw = C, Hw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === Ea.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, wr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, Xw = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: Hw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, wr._)`${r}${(0, wr.getProperty)(l)}`);
    t.if((0, wr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: Ea.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = E();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, wr._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: Ea.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, wr.Name), w;
    }
    function E() {
      var g;
      const w = {}, _ = m(s);
      let $ = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, Gw.schemaHasRulesButRef)(O, a.self.RULES)) {
          const J = O.$ref;
          if (O = jc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, J), O instanceof jc.SchemaEnv && (O = O.schema), O === void 0)
            throw new Kw.default(a.opts.uriResolver, a.baseId, J);
        }
        const K = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        $ = $ && (_ || m(O)), v(K, R);
      }
      if (!$)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const K of R.enum)
            N(K, O);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
$i.default = Xw;
const Bw = "http://json-schema.org/draft-07/schema#", Jw = "http://json-schema.org/draft-07/schema#", Ww = "Core schema meta-schema", Yw = {
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
}, Qw = [
  "object",
  "boolean"
], Zw = {
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
}, xw = {
  $schema: Bw,
  $id: Jw,
  title: Ww,
  definitions: Yw,
  type: Qw,
  properties: Zw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = _u, n = Uo, s = $i, a = xw, o = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((w) => this.addVocabulary(w)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const w = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(w, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = rt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = te;
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
  var h = Lo();
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var E = Ss();
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return E.default;
  } });
})(pa, pa.exports);
var eE = pa.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = eE, r = te, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: l, schemaCode: c }) => (0, r.str)`should be ${s[l].okStr} ${c}`,
    params: ({ keyword: l, schemaCode: c }) => (0, r._)`{comparison: ${s[l].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(l) {
      const { gen: c, data: d, schemaCode: u, keyword: h, it: E } = l, { opts: g, self: w } = E;
      if (!g.validateFormats)
        return;
      const _ = new t.KeywordCxt(E, w.RULES.all.format.definition, "format");
      _.$data ? $() : m();
      function $() {
        const N = c.scopeValue("formats", {
          ref: w.formats,
          code: g.code.formats
        }), R = c.const("fmt", (0, r._)`${N}[${_.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${R} != "object"`, (0, r._)`${R} instanceof RegExp`, (0, r._)`typeof ${R}.compare != "function"`, v(R)));
      }
      function m() {
        const N = _.schema, R = w.formats[N];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const O = c.scopeValue("formats", {
          key: N,
          ref: R,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        l.fail$data(v(O));
      }
      function v(N) {
        return (0, r._)`${N}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = o;
})(gu);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = $u, n = gu, s = te, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return c(d, u, r.fullFormats, a), d;
    const [h, E] = u.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], g = u.formats || r.formatNames;
    return c(d, g, h, E), u.keywords && (0, n.default)(d), d;
  };
  l.get = (d, u = "full") => {
    const E = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!E)
      throw new Error(`Unknown format "${d}"`);
    return E;
  };
  function c(d, u, h, E) {
    var g, w;
    (g = (w = d.opts.code).formats) !== null && g !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${E}`);
    for (const _ of u)
      d.addFormat(_, h[_]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(ma, ma.exports);
var tE = ma.exports;
const rE = /* @__PURE__ */ $l(tE), nE = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !sE(s, a) && n || Object.defineProperty(e, r, a);
}, sE = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, aE = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, oE = (e, t) => `/* Wrapped ${e}*/
${t}`, iE = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), cE = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), lE = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = oE.bind(null, n, t.toString());
  Object.defineProperty(s, "name", cE);
  const { writable: a, enumerable: o, configurable: l } = iE;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: l });
};
function uE(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    nE(e, t, s, r);
  return aE(e, t), lE(e, t, n), e;
}
const kc = (e, t = {}) => {
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
  let o, l, c;
  const d = function(...u) {
    const h = this, E = () => {
      o = void 0, l && (clearTimeout(l), l = void 0), a && (c = e.apply(h, u));
    }, g = () => {
      l = void 0, o && (clearTimeout(o), o = void 0), a && (c = e.apply(h, u));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(E, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout(g, n)), w && (c = e.apply(h, u)), c;
  };
  return uE(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var ba = { exports: {} };
const dE = "2.0.0", od = 256, fE = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, hE = 16, mE = od - 6, pE = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Is = {
  MAX_LENGTH: od,
  MAX_SAFE_COMPONENT_LENGTH: hE,
  MAX_SAFE_BUILD_LENGTH: mE,
  MAX_SAFE_INTEGER: fE,
  RELEASE_TYPES: pE,
  SEMVER_SPEC_VERSION: dE,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const yE = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ts = yE;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = Is, a = Ts;
  t = e.exports = {};
  const o = t.re = [], l = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const E = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", s],
    [E, n]
  ], w = ($) => {
    for (const [m, v] of g)
      $ = $.split(`${m}*`).join(`${m}{0,${v}}`).split(`${m}+`).join(`${m}{1,${v}}`);
    return $;
  }, _ = ($, m, v) => {
    const N = w(m), R = h++;
    a($, R, m), u[$] = R, c[R] = m, d[R] = N, o[R] = new RegExp(m, v ? "g" : void 0), l[R] = new RegExp(N, v ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${E}*`), _("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${E}+`), _("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), _("FULL", `^${c[u.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), _("LOOSE", `^${c[u.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), _("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[u.COERCE], !0), _("COERCERTLFULL", c[u.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ba, ba.exports);
var En = ba.exports;
const $E = Object.freeze({ loose: !0 }), gE = Object.freeze({}), _E = (e) => e ? typeof e != "object" ? $E : e : gE;
var gi = _E;
const Ac = /^[0-9]+$/, id = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Ac.test(e), n = Ac.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, vE = (e, t) => id(t, e);
var cd = {
  compareIdentifiers: id,
  rcompareIdentifiers: vE
};
const Ln = Ts, { MAX_LENGTH: Cc, MAX_SAFE_INTEGER: Fn } = Is, { safeRe: zn, t: Un } = En, wE = gi, { compareIdentifiers: Ws } = cd;
let EE = class ot {
  constructor(t, r) {
    if (r = wE(r), t instanceof ot) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Cc)
      throw new TypeError(
        `version is longer than ${Cc} characters`
      );
    Ln("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? zn[Un.LOOSE] : zn[Un.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > Fn || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > Fn || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > Fn || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < Fn)
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
    if (Ln("SemVer.compare", this.version, this.options, t), !(t instanceof ot)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new ot(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof ot || (t = new ot(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof ot || (t = new ot(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (Ln("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ws(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof ot || (t = new ot(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Ln("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return Ws(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? zn[Un.PRERELEASELOOSE] : zn[Un.PRERELEASE]);
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
          n === !1 && (a = [r]), Ws(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var De = EE;
const Dc = De, bE = (e, t, r = !1) => {
  if (e instanceof Dc)
    return e;
  try {
    return new Dc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Hr = bE;
const SE = Hr, PE = (e, t) => {
  const r = SE(e, t);
  return r ? r.version : null;
};
var NE = PE;
const RE = Hr, OE = (e, t) => {
  const r = RE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var IE = OE;
const Mc = De, TE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Mc(
      e instanceof Mc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var jE = TE;
const Vc = Hr, kE = (e, t) => {
  const r = Vc(e, null, !0), n = Vc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, l = a ? n : r, c = !!o.prerelease.length;
  if (!!l.prerelease.length && !c) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(o) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const u = c ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var AE = kE;
const CE = De, DE = (e, t) => new CE(e, t).major;
var ME = DE;
const VE = De, LE = (e, t) => new VE(e, t).minor;
var FE = LE;
const zE = De, UE = (e, t) => new zE(e, t).patch;
var qE = UE;
const KE = Hr, GE = (e, t) => {
  const r = KE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var HE = GE;
const Lc = De, XE = (e, t, r) => new Lc(e, r).compare(new Lc(t, r));
var nt = XE;
const BE = nt, JE = (e, t, r) => BE(t, e, r);
var WE = JE;
const YE = nt, QE = (e, t) => YE(e, t, !0);
var ZE = QE;
const Fc = De, xE = (e, t, r) => {
  const n = new Fc(e, r), s = new Fc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var _i = xE;
const eb = _i, tb = (e, t) => e.sort((r, n) => eb(r, n, t));
var rb = tb;
const nb = _i, sb = (e, t) => e.sort((r, n) => nb(n, r, t));
var ab = sb;
const ob = nt, ib = (e, t, r) => ob(e, t, r) > 0;
var js = ib;
const cb = nt, lb = (e, t, r) => cb(e, t, r) < 0;
var vi = lb;
const ub = nt, db = (e, t, r) => ub(e, t, r) === 0;
var ld = db;
const fb = nt, hb = (e, t, r) => fb(e, t, r) !== 0;
var ud = hb;
const mb = nt, pb = (e, t, r) => mb(e, t, r) >= 0;
var wi = pb;
const yb = nt, $b = (e, t, r) => yb(e, t, r) <= 0;
var Ei = $b;
const gb = ld, _b = ud, vb = js, wb = wi, Eb = vi, bb = Ei, Sb = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return gb(e, r, n);
    case "!=":
      return _b(e, r, n);
    case ">":
      return vb(e, r, n);
    case ">=":
      return wb(e, r, n);
    case "<":
      return Eb(e, r, n);
    case "<=":
      return bb(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var dd = Sb;
const Pb = De, Nb = Hr, { safeRe: qn, t: Kn } = En, Rb = (e, t) => {
  if (e instanceof Pb)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? qn[Kn.COERCEFULL] : qn[Kn.COERCE]);
  else {
    const c = t.includePrerelease ? qn[Kn.COERCERTLFULL] : qn[Kn.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return Nb(`${n}.${s}.${a}${o}${l}`, t);
};
var Ob = Rb;
class Ib {
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
var Tb = Ib, Ys, zc;
function st() {
  if (zc) return Ys;
  zc = 1;
  const e = /\s+/g;
  class t {
    constructor(k, V) {
      if (V = s(V), k instanceof t)
        return k.loose === !!V.loose && k.includePrerelease === !!V.includePrerelease ? k : new t(k.raw, V);
      if (k instanceof a)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = V, this.loose = !!V.loose, this.includePrerelease = !!V.includePrerelease, this.raw = k.trim().replace(e, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((G) => !_(G[0])), this.set.length === 0)
          this.set = [D];
        else if (this.set.length > 1) {
          for (const G of this.set)
            if (G.length === 1 && $(G[0])) {
              this.set = [G];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let k = 0; k < this.set.length; k++) {
          k > 0 && (this.formatted += "||");
          const V = this.set[k];
          for (let D = 0; D < V.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += V[D].toString().trim();
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
    parseRange(k) {
      const D = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + k, G = n.get(D);
      if (G)
        return G;
      const M = this.options.loose, P = M ? c[d.HYPHENRANGELOOSE] : c[d.HYPHENRANGE];
      k = k.replace(P, H(this.options.includePrerelease)), o("hyphen replace", k), k = k.replace(c[d.COMPARATORTRIM], u), o("comparator trim", k), k = k.replace(c[d.TILDETRIM], h), o("tilde trim", k), k = k.replace(c[d.CARETTRIM], E), o("caret trim", k);
      let p = k.split(" ").map((f) => v(f, this.options)).join(" ").split(/\s+/).map((f) => z(f, this.options));
      M && (p = p.filter((f) => (o("loose invalid filter", f, this.options), !!f.match(c[d.COMPARATORLOOSE])))), o("range list", p);
      const S = /* @__PURE__ */ new Map(), y = p.map((f) => new a(f, this.options));
      for (const f of y) {
        if (_(f))
          return [f];
        S.set(f.value, f);
      }
      S.size > 1 && S.has("") && S.delete("");
      const i = [...S.values()];
      return n.set(D, i), i;
    }
    intersects(k, V) {
      if (!(k instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((D) => m(D, V) && k.set.some((G) => m(G, V) && D.every((M) => G.every((P) => M.intersects(P, V)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(k) {
      if (!k)
        return !1;
      if (typeof k == "string")
        try {
          k = new l(k, this.options);
        } catch {
          return !1;
        }
      for (let V = 0; V < this.set.length; V++)
        if (ae(this.set[V], k, this.options))
          return !0;
      return !1;
    }
  }
  Ys = t;
  const r = Tb, n = new r(), s = gi, a = ks(), o = Ts, l = De, {
    safeRe: c,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: E
  } = En, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = Is, _ = (T) => T.value === "<0.0.0-0", $ = (T) => T.value === "", m = (T, k) => {
    let V = !0;
    const D = T.slice();
    let G = D.pop();
    for (; V && D.length; )
      V = D.every((M) => G.intersects(M, k)), G = D.pop();
    return V;
  }, v = (T, k) => (T = T.replace(c[d.BUILD], ""), o("comp", T, k), T = K(T, k), o("caret", T), T = R(T, k), o("tildes", T), T = de(T, k), o("xrange", T), T = $e(T, k), o("stars", T), T), N = (T) => !T || T.toLowerCase() === "x" || T === "*", R = (T, k) => T.trim().split(/\s+/).map((V) => O(V, k)).join(" "), O = (T, k) => {
    const V = k.loose ? c[d.TILDELOOSE] : c[d.TILDE];
    return T.replace(V, (D, G, M, P, p) => {
      o("tilde", T, D, G, M, P, p);
      let S;
      return N(G) ? S = "" : N(M) ? S = `>=${G}.0.0 <${+G + 1}.0.0-0` : N(P) ? S = `>=${G}.${M}.0 <${G}.${+M + 1}.0-0` : p ? (o("replaceTilde pr", p), S = `>=${G}.${M}.${P}-${p} <${G}.${+M + 1}.0-0`) : S = `>=${G}.${M}.${P} <${G}.${+M + 1}.0-0`, o("tilde return", S), S;
    });
  }, K = (T, k) => T.trim().split(/\s+/).map((V) => J(V, k)).join(" "), J = (T, k) => {
    o("caret", T, k);
    const V = k.loose ? c[d.CARETLOOSE] : c[d.CARET], D = k.includePrerelease ? "-0" : "";
    return T.replace(V, (G, M, P, p, S) => {
      o("caret", T, G, M, P, p, S);
      let y;
      return N(M) ? y = "" : N(P) ? y = `>=${M}.0.0${D} <${+M + 1}.0.0-0` : N(p) ? M === "0" ? y = `>=${M}.${P}.0${D} <${M}.${+P + 1}.0-0` : y = `>=${M}.${P}.0${D} <${+M + 1}.0.0-0` : S ? (o("replaceCaret pr", S), M === "0" ? P === "0" ? y = `>=${M}.${P}.${p}-${S} <${M}.${P}.${+p + 1}-0` : y = `>=${M}.${P}.${p}-${S} <${M}.${+P + 1}.0-0` : y = `>=${M}.${P}.${p}-${S} <${+M + 1}.0.0-0`) : (o("no pr"), M === "0" ? P === "0" ? y = `>=${M}.${P}.${p}${D} <${M}.${P}.${+p + 1}-0` : y = `>=${M}.${P}.${p}${D} <${M}.${+P + 1}.0-0` : y = `>=${M}.${P}.${p} <${+M + 1}.0.0-0`), o("caret return", y), y;
    });
  }, de = (T, k) => (o("replaceXRanges", T, k), T.split(/\s+/).map((V) => me(V, k)).join(" ")), me = (T, k) => {
    T = T.trim();
    const V = k.loose ? c[d.XRANGELOOSE] : c[d.XRANGE];
    return T.replace(V, (D, G, M, P, p, S) => {
      o("xRange", T, D, G, M, P, p, S);
      const y = N(M), i = y || N(P), f = i || N(p), b = f;
      return G === "=" && b && (G = ""), S = k.includePrerelease ? "-0" : "", y ? G === ">" || G === "<" ? D = "<0.0.0-0" : D = "*" : G && b ? (i && (P = 0), p = 0, G === ">" ? (G = ">=", i ? (M = +M + 1, P = 0, p = 0) : (P = +P + 1, p = 0)) : G === "<=" && (G = "<", i ? M = +M + 1 : P = +P + 1), G === "<" && (S = "-0"), D = `${G + M}.${P}.${p}${S}`) : i ? D = `>=${M}.0.0${S} <${+M + 1}.0.0-0` : f && (D = `>=${M}.${P}.0${S} <${M}.${+P + 1}.0-0`), o("xRange return", D), D;
    });
  }, $e = (T, k) => (o("replaceStars", T, k), T.trim().replace(c[d.STAR], "")), z = (T, k) => (o("replaceGTE0", T, k), T.trim().replace(c[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), H = (T) => (k, V, D, G, M, P, p, S, y, i, f, b) => (N(D) ? V = "" : N(G) ? V = `>=${D}.0.0${T ? "-0" : ""}` : N(M) ? V = `>=${D}.${G}.0${T ? "-0" : ""}` : P ? V = `>=${V}` : V = `>=${V}${T ? "-0" : ""}`, N(y) ? S = "" : N(i) ? S = `<${+y + 1}.0.0-0` : N(f) ? S = `<${y}.${+i + 1}.0-0` : b ? S = `<=${y}.${i}.${f}-${b}` : T ? S = `<${y}.${i}.${+f + 1}-0` : S = `<=${S}`, `${V} ${S}`.trim()), ae = (T, k, V) => {
    for (let D = 0; D < T.length; D++)
      if (!T[D].test(k))
        return !1;
    if (k.prerelease.length && !V.includePrerelease) {
      for (let D = 0; D < T.length; D++)
        if (o(T[D].semver), T[D].semver !== a.ANY && T[D].semver.prerelease.length > 0) {
          const G = T[D].semver;
          if (G.major === k.major && G.minor === k.minor && G.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ys;
}
var Qs, Uc;
function ks() {
  if (Uc) return Qs;
  Uc = 1;
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
      this.operator = E[1] !== void 0 ? E[1] : "", this.operator === "=" && (this.operator = ""), E[2] ? this.semver = new l(E[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (o("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new l(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  Qs = t;
  const r = gi, { safeRe: n, t: s } = En, a = dd, o = Ts, l = De, c = st();
  return Qs;
}
const jb = st(), kb = (e, t, r) => {
  try {
    t = new jb(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var As = kb;
const Ab = st(), Cb = (e, t) => new Ab(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Db = Cb;
const Mb = De, Vb = st(), Lb = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new Vb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new Mb(n, r));
  }), n;
};
var Fb = Lb;
const zb = De, Ub = st(), qb = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new Ub(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new zb(n, r));
  }), n;
};
var Kb = qb;
const Zs = De, Gb = st(), qc = js, Hb = (e, t) => {
  e = new Gb(e, t);
  let r = new Zs("0.0.0");
  if (e.test(r) || (r = new Zs("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const l = new Zs(o.semver.version);
      switch (o.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!a || qc(l, a)) && (a = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || qc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var Xb = Hb;
const Bb = st(), Jb = (e, t) => {
  try {
    return new Bb(e, t).range || "*";
  } catch {
    return null;
  }
};
var Wb = Jb;
const Yb = De, fd = ks(), { ANY: Qb } = fd, Zb = st(), xb = As, Kc = js, Gc = vi, eS = Ei, tS = wi, rS = (e, t, r, n) => {
  e = new Yb(e, n), t = new Zb(t, n);
  let s, a, o, l, c;
  switch (r) {
    case ">":
      s = Kc, a = eS, o = Gc, l = ">", c = ">=";
      break;
    case "<":
      s = Gc, a = tS, o = Kc, l = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (xb(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, E = null;
    if (u.forEach((g) => {
      g.semver === Qb && (g = new fd(">=0.0.0")), h = h || g, E = E || g, s(g.semver, h.semver, n) ? h = g : o(g.semver, E.semver, n) && (E = g);
    }), h.operator === l || h.operator === c || (!E.operator || E.operator === l) && a(e, E.semver))
      return !1;
    if (E.operator === c && o(e, E.semver))
      return !1;
  }
  return !0;
};
var bi = rS;
const nS = bi, sS = (e, t, r) => nS(e, t, ">", r);
var aS = sS;
const oS = bi, iS = (e, t, r) => oS(e, t, "<", r);
var cS = iS;
const Hc = st(), lS = (e, t, r) => (e = new Hc(e, r), t = new Hc(t, r), e.intersects(t, r));
var uS = lS;
const dS = As, fS = nt;
var hS = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((u, h) => fS(u, h, r));
  for (const u of o)
    dS(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === o[0] ? l.push("*") : h ? u === o[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const c = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const Xc = st(), Si = ks(), { ANY: xs } = Si, en = As, Pi = nt, mS = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Xc(e, r), t = new Xc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = yS(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, pS = [new Si(">=0.0.0-0")], Bc = [new Si(">=0.0.0")], yS = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === xs) {
    if (t.length === 1 && t[0].semver === xs)
      return !0;
    r.includePrerelease ? e = pS : e = Bc;
  }
  if (t.length === 1 && t[0].semver === xs) {
    if (r.includePrerelease)
      return !0;
    t = Bc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = Jc(s, g, r) : g.operator === "<" || g.operator === "<=" ? a = Wc(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = Pi(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !en(g, String(s), r) || a && !en(g, String(a), r))
      return null;
    for (const w of t)
      if (!en(g, String(w), r))
        return !1;
    return !0;
  }
  let l, c, d, u, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, E = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (u = u || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (E && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === E.major && g.semver.minor === E.minor && g.semver.patch === E.patch && (E = !1), g.operator === ">" || g.operator === ">=") {
        if (l = Jc(s, g, r), l === g && l !== s)
          return !1;
      } else if (s.operator === ">=" && !en(s.semver, String(g), r))
        return !1;
    }
    if (a) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (c = Wc(a, g, r), c === g && c !== a)
          return !1;
      } else if (a.operator === "<=" && !en(a.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && u && !s && o !== 0 || E || h);
}, Jc = (e, t, r) => {
  if (!e)
    return t;
  const n = Pi(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Wc = (e, t, r) => {
  if (!e)
    return t;
  const n = Pi(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var $S = mS;
const ea = En, Yc = Is, gS = De, Qc = cd, _S = Hr, vS = NE, wS = IE, ES = jE, bS = AE, SS = ME, PS = FE, NS = qE, RS = HE, OS = nt, IS = WE, TS = ZE, jS = _i, kS = rb, AS = ab, CS = js, DS = vi, MS = ld, VS = ud, LS = wi, FS = Ei, zS = dd, US = Ob, qS = ks(), KS = st(), GS = As, HS = Db, XS = Fb, BS = Kb, JS = Xb, WS = Wb, YS = bi, QS = aS, ZS = cS, xS = uS, eP = hS, tP = $S;
var rP = {
  parse: _S,
  valid: vS,
  clean: wS,
  inc: ES,
  diff: bS,
  major: SS,
  minor: PS,
  patch: NS,
  prerelease: RS,
  compare: OS,
  rcompare: IS,
  compareLoose: TS,
  compareBuild: jS,
  sort: kS,
  rsort: AS,
  gt: CS,
  lt: DS,
  eq: MS,
  neq: VS,
  gte: LS,
  lte: FS,
  cmp: zS,
  coerce: US,
  Comparator: qS,
  Range: KS,
  satisfies: GS,
  toComparators: HS,
  maxSatisfying: XS,
  minSatisfying: BS,
  minVersion: JS,
  validRange: WS,
  outside: YS,
  gtr: QS,
  ltr: ZS,
  intersects: xS,
  simplifyRange: eP,
  subset: tP,
  SemVer: gS,
  re: ea.re,
  src: ea.src,
  tokens: ea.t,
  SEMVER_SPEC_VERSION: Yc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Yc.RELEASE_TYPES,
  compareIdentifiers: Qc.compareIdentifiers,
  rcompareIdentifiers: Qc.rcompareIdentifiers
};
const _r = /* @__PURE__ */ $l(rP), nP = Object.prototype.toString, sP = "[object Uint8Array]", aP = "[object ArrayBuffer]";
function hd(e, t, r) {
  return e ? e.constructor === t ? !0 : nP.call(e) === r : !1;
}
function md(e) {
  return hd(e, Uint8Array, sP);
}
function oP(e) {
  return hd(e, ArrayBuffer, aP);
}
function iP(e) {
  return md(e) || oP(e);
}
function cP(e) {
  if (!md(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function lP(e) {
  if (!iP(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function ta(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    cP(s), r.set(s, n), n += s.length;
  return r;
}
const Gn = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Hn(e, t = "utf8") {
  return lP(e), Gn[t] ?? (Gn[t] = new globalThis.TextDecoder(t)), Gn[t].decode(e);
}
function uP(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const dP = new globalThis.TextEncoder();
function ra(e) {
  return uP(e), dP.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Zc = "aes-256-cbc", pd = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), fP = (e) => typeof e == "string" && pd.has(e), yt = () => /* @__PURE__ */ Object.create(null), xc = (e) => e !== void 0, na = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, jt = "__internal__", sa = `${jt}.migrations.version`;
var At, Ct, cr, Ve, Ge, lr, ur, kr, it, ve, yd, $d, gd, _d, vd, wd, Ed, bd;
class hP {
  constructor(t = {}) {
    Je(this, ve);
    Jr(this, "path");
    Jr(this, "events");
    Je(this, At);
    Je(this, Ct);
    Je(this, cr);
    Je(this, Ve);
    Je(this, Ge, {});
    Je(this, lr, !1);
    Je(this, ur);
    Je(this, kr);
    Je(this, it);
    Jr(this, "_deserialize", (t) => JSON.parse(t));
    Jr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = mt(this, ve, yd).call(this, t);
    Me(this, Ve, r), mt(this, ve, $d).call(this, r), mt(this, ve, _d).call(this, r), mt(this, ve, vd).call(this, r), this.events = new EventTarget(), Me(this, Ct, r.encryptionKey), Me(this, cr, r.encryptionAlgorithm ?? Zc), this.path = mt(this, ve, wd).call(this, r), mt(this, ve, Ed).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (W(this, Ve).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${jt} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (na(a, o), W(this, Ve).accessPropertiesByDotNotation)
        bn(n, a, o);
      else {
        if (a === "__proto__" || a === "constructor" || a === "prototype")
          return;
        n[a] = o;
      }
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, l] of Object.entries(a))
        s(o, l);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return W(this, Ve).accessPropertiesByDotNotation ? Vs(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    na(t, r);
    const n = W(this, Ve).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
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
      xc(W(this, Ge)[r]) && this.set(r, W(this, Ge)[r]);
  }
  delete(t) {
    const { store: r } = this;
    W(this, Ve).accessPropertiesByDotNotation ? Vd(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = yt();
    for (const r of Object.keys(W(this, Ge)))
      xc(W(this, Ge)[r]) && (na(r, W(this, Ge)[r]), W(this, Ve).accessPropertiesByDotNotation ? bn(t, r, W(this, Ge)[r]) : t[r] = W(this, Ge)[r]);
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
      const r = Y.readFileSync(this.path, W(this, Ct) ? null : "utf8"), n = this._decryptData(r);
      return ((a) => {
        const o = this._deserialize(a);
        return W(this, lr) || this._validate(o), Object.assign(yt(), o);
      })(n);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), yt();
      if (W(this, Ve).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:") || n.message === "Failed to decrypt config data.")
          return yt();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Vs(t, jt))
      try {
        const r = Y.readFileSync(this.path, W(this, Ct) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        Vs(s, jt) && bn(t, jt, Ii(s, jt));
      } catch {
      }
    W(this, lr) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    W(this, ur) && (W(this, ur).close(), Me(this, ur, void 0)), W(this, kr) && (Y.unwatchFile(this.path), Me(this, kr, !1)), Me(this, it, void 0);
  }
  _decryptData(t) {
    const r = W(this, Ct);
    if (!r)
      return typeof t == "string" ? t : Hn(t);
    const n = W(this, cr), s = n === "aes-256-gcm" ? 16 : 0, a = ":".codePointAt(0), o = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(a !== void 0 && o === a)) {
      if (n === "aes-256-cbc")
        return typeof t == "string" ? t : Hn(t);
      throw new Error("Failed to decrypt config data.");
    }
    const c = (g) => {
      if (s === 0)
        return { ciphertext: g };
      const w = g.length - s;
      if (w < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: g.slice(0, w),
        authenticationTag: g.slice(w)
      };
    }, d = t.slice(0, 16), u = t.slice(17), h = typeof u == "string" ? ra(u) : u, E = (g) => {
      const { ciphertext: w, authenticationTag: _ } = c(h), $ = Wr.pbkdf2Sync(r, g, 1e4, 32, "sha512"), m = Wr.createDecipheriv(n, $, d);
      return _ && m.setAuthTag(_), Hn(ta([m.update(w), m.final()]));
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
      return typeof t == "string" ? t : Hn(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      Ri(a, s) || (r = a, t.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      Ri(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!W(this, At) || W(this, At).call(this, t) || !W(this, At).errors)
      return;
    const n = W(this, At).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Y.mkdirSync(ee.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    const n = W(this, Ct);
    if (n) {
      const s = Wr.randomBytes(16), a = Wr.pbkdf2Sync(n, s, 1e4, 32, "sha512"), o = Wr.createCipheriv(W(this, cr), a, s), l = ta([o.update(ra(r)), o.final()]), c = [s, ra(":"), l];
      W(this, cr) === "aes-256-gcm" && c.push(o.getAuthTag()), r = ta(c);
    }
    if (fe.env.SNAP)
      Y.writeFileSync(this.path, r, { mode: W(this, Ve).configFileMode });
    else
      try {
        yl(this.path, r, { mode: W(this, Ve).configFileMode });
      } catch (s) {
        if ((s == null ? void 0 : s.code) === "EXDEV") {
          Y.writeFileSync(this.path, r, { mode: W(this, Ve).configFileMode });
          return;
        }
        throw s;
      }
  }
  _watch() {
    if (this._ensureDirectory(), Y.existsSync(this.path) || this._write(yt()), fe.platform === "win32" || fe.platform === "darwin") {
      W(this, it) ?? Me(this, it, kc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ee.dirname(this.path), r = ee.basename(this.path);
      Me(this, ur, Y.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof W(this, it) == "function" && W(this, it).call(this);
      }));
    } else
      W(this, it) ?? Me(this, it, kc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), Y.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof W(this, it) == "function" && W(this, it).call(this);
      }), Me(this, kr, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(sa, "0.0.0");
    const a = Object.keys(t).filter((l) => this._shouldPerformMigration(l, s, r));
    let o = structuredClone(this.store);
    for (const l of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: l,
          finalVersion: r,
          versions: a
        });
        const c = t[l];
        c == null || c(this), this._set(sa, l), s = l, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        const d = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !_r.eq(s, r)) && this._set(sa, r);
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
    return t === jt || t.startsWith(`${jt}.`);
  }
  _isVersionInRangeFormat(t) {
    return _r.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && _r.satisfies(r, t) ? !1 : _r.satisfies(n, t) : !(_r.lte(t, r) || _r.gt(t, n));
  }
  _get(t, r) {
    return Ii(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    bn(n, t, r), this.store = n;
  }
}
At = new WeakMap(), Ct = new WeakMap(), cr = new WeakMap(), Ve = new WeakMap(), Ge = new WeakMap(), lr = new WeakMap(), ur = new WeakMap(), kr = new WeakMap(), it = new WeakMap(), ve = new WeakSet(), yd = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (r.encryptionAlgorithm ?? (r.encryptionAlgorithm = Zc), !fP(r.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...pd].join(", ")}`);
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = Ud(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, $d = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = rE.default, n = new G0.Ajv2020({
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
  Me(this, At, n.compile(s)), mt(this, ve, gd).call(this, t.schema);
}, gd = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (W(this, Ge)[n] = a);
  }
}, _d = function(t) {
  t.defaults && Object.assign(W(this, Ge), t.defaults);
}, vd = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, wd = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ee.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, Ed = function(t) {
  if (t.migrations) {
    mt(this, ve, bd).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(yt(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    Oi.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, bd = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Me(this, lr, !0);
    try {
      const s = this.store, a = Object.assign(yt(), t.defaults ?? {}, s);
      try {
        Oi.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Me(this, lr, !1);
    }
  }
};
const { app: rs, ipcMain: Sa, shell: mP } = il;
let el = !1;
const tl = () => {
  if (!Sa || !rs)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: rs.getPath("userData"),
    appVersion: rs.getVersion()
  };
  return el || (Sa.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), el = !0), e;
};
class pP extends hP {
  constructor(t) {
    let r, n;
    if (fe.type === "renderer") {
      const s = il.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else Sa && rs && ({ defaultCwd: r, appVersion: n } = tl());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ee.isAbsolute(t.cwd) ? t.cwd : ee.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    tl();
  }
  async openInEditor() {
    const t = await mP.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const he = new pP({
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
}), we = [];
for (let e = 0; e < 256; ++e)
  we.push((e + 256).toString(16).slice(1));
function yP(e, t = 0) {
  return (we[e[t + 0]] + we[e[t + 1]] + we[e[t + 2]] + we[e[t + 3]] + "-" + we[e[t + 4]] + we[e[t + 5]] + "-" + we[e[t + 6]] + we[e[t + 7]] + "-" + we[e[t + 8]] + we[e[t + 9]] + "-" + we[e[t + 10]] + we[e[t + 11]] + we[e[t + 12]] + we[e[t + 13]] + we[e[t + 14]] + we[e[t + 15]]).toLowerCase();
}
const ns = new Uint8Array(256);
let Xn = ns.length;
function $P() {
  return Xn > ns.length - 16 && (kd(ns), Xn = 0), ns.slice(Xn, Xn += 16);
}
const rl = { randomUUID: Ad };
function gP(e, t, r) {
  var s;
  e = e || {};
  const n = e.random ?? ((s = e.rng) == null ? void 0 : s.call(e)) ?? $P();
  if (n.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, yP(n);
}
function nl(e, t, r) {
  return rl.randomUUID && !e ? rl.randomUUID() : gP(e);
}
let sl = Ar.readText(), al = Ar.readImage().toDataURL(), jr = null;
function _P(e) {
  jr && clearInterval(jr), jr = setInterval(() => {
    try {
      const t = Ar.readText(), r = Ar.readImage(), n = r.isEmpty() ? "" : r.toDataURL();
      let s = !1, a = null, o = he.get("settings.maxHistorySize") || 100;
      if (t && t !== sl ? (sl = t, s = !0, a = {
        id: nl(),
        type: "text",
        content: t,
        timestamp: Date.now(),
        isPinned: !1
      }) : !r.isEmpty() && n !== al && (al = n, s = !0, a = {
        id: nl(),
        type: "image",
        content: n,
        timestamp: Date.now(),
        isPinned: !1
      }), s && a) {
        let l = he.get("history") || [];
        a.type === "text" && (l = l.filter((u) => u.content !== (a == null ? void 0 : a.content))), l.unshift(a);
        const c = l.filter((u) => u.isPinned);
        let d = l.filter((u) => !u.isPinned);
        l.length > o && (d = d.slice(
          0,
          Math.max(0, o - c.length)
        )), l = [...c, ...d], he.set("history", l), e.webContents.send("history-updated", l);
      }
    } catch (t) {
      console.error("Error in clipboard watcher:", t);
    }
  }, 500);
}
function vP() {
  jr && (clearInterval(jr), jr = null);
}
function wP(e) {
  at.handle("get-history", () => he.get("history") || []), at.handle("toggle-pin", (t, r) => {
    let n = he.get("history") || [];
    const s = n.findIndex((a) => a.id === r);
    return s !== -1 && (n[s].isPinned = !n[s].isPinned, he.set("history", n)), n;
  }), at.handle("delete-item", (t, r) => {
    let n = he.get("history") || [];
    return n = n.filter((s) => s.id !== r), he.set("history", n), n;
  }), at.handle("clear-history", () => {
    let t = he.get("history") || [];
    return t = t.filter((r) => r.isPinned), he.set("history", t), t;
  }), at.handle("paste-item", (t, r, n = !1) => {
    const a = (he.get("history") || []).find((o) => o.id === r);
    if (a) {
      if (a.type === "text")
        Ar.writeText(a.content);
      else if (a.type === "image") {
        if (n)
          return;
        const o = cl.createFromDataURL(a.content);
        Ar.writeImage(o);
      }
      e.hide(), setTimeout(() => {
        Cd(
          `osascript -e 'tell application "System Events" to keystroke "v" using command down'`,
          (o) => {
            o && console.error("Failed to execute AppleScript:", o);
          }
        );
      }, 100);
    }
  }), at.handle("get-groups", () => he.get("groups") || []), at.handle("add-group", (t, r) => {
    const n = he.get("groups") || [];
    return n.push(r), he.set("groups", n), n;
  }), at.handle("update-group", (t, r) => {
    const n = he.get("groups") || [], s = n.findIndex((a) => a.id === r.id);
    return s !== -1 && (n[s] = r, he.set("groups", n)), n;
  }), at.handle("delete-group", (t, r) => {
    let n = he.get("groups") || [];
    n = n.filter((o) => o.id !== r), he.set("groups", n);
    const s = he.get("history") || [];
    let a = !1;
    return s.forEach((o) => {
      o.groupId === r && (delete o.groupId, a = !0);
    }), a && (he.set("history", s), e.webContents.send("history-updated", s)), n;
  }), at.handle("set-item-group", (t, r, n) => {
    const s = he.get("history") || [], a = s.findIndex((o) => o.id === r);
    return a !== -1 && (n ? s[a].groupId = n : delete s[a].groupId, he.set("history", s), e.webContents.send("history-updated", s)), s;
  });
}
const Sd = ee.dirname(jd(import.meta.url));
process.env.APP_ROOT = ee.join(Sd, "..");
const ss = process.env.VITE_DEV_SERVER_URL, VP = ee.join(process.env.APP_ROOT, "dist-electron"), Pd = ee.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = ss ? ee.join(process.env.APP_ROOT, "public") : Pd;
let ce, aa;
function Nd() {
  ce = new ul({
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
    icon: ee.join(process.env.VITE_PUBLIC, "icon.png"),
    webPreferences: {
      preload: ee.join(Sd, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), ss && ce.webContents.openDevTools({ mode: "detach" }), _P(ce), wP(ce), ss ? ce.loadURL(ss) : ce.loadFile(ee.join(Pd, "index.html")), ce.on("blur", () => {
    ce != null && ce.webContents.isDevToolsOpened() || ce == null || ce.hide();
  });
}
function ol() {
  ce != null && ce.isVisible() ? ce.hide() : (ce == null || ce.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), ce == null || ce.show(), ce == null || ce.focus());
}
Er.on("will-quit", () => {
  vP(), ll.unregisterAll();
});
Er.whenReady().then(() => {
  Er.dock && Er.dock.hide(), Nd();
  const e = ee.join(process.env.VITE_PUBLIC, "icon.png"), t = cl.createFromPath(e).resize({ width: 18, height: 18 });
  aa = new Id(t), aa.setToolTip("Glyphs Clipboard");
  const r = Td.buildFromTemplate([
    { label: "Show Glyphs", click: () => ol() },
    { type: "separator" },
    { label: "Quit", click: () => Er.quit() }
  ]);
  aa.setContextMenu(r), ll.register("CommandOrControl+Shift+V", () => {
    ol();
  });
});
Er.on("activate", () => {
  ul.getAllWindows().length === 0 && Nd();
});
export {
  VP as MAIN_DIST,
  Pd as RENDERER_DIST,
  ss as VITE_DEV_SERVER_URL
};
