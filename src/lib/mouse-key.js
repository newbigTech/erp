/*! hotkeys-js v3.2.0 | MIT (c) 2018 kenny wong <wowohoo@qq.com> | http://jaywcjlove.github.io/hotkeys */
"use strict";
var isff = "undefined" != typeof navigator && 0 < navigator.userAgent.toLowerCase().indexOf("firefox");

function addEvent(e, o, t) {
    e.addEventListener ? e.addEventListener(o, t, !1) : e.attachEvent && e.attachEvent("on" + o, function () {
        t(window.event)
    })
}

function getMods(e, o) {
    for (var t = o.slice(0, o.length - 1), n = 0; n < t.length; n++) t[n] = e[t[n].toLowerCase()];
    return t
}

function getKeys(e) {
    e || (e = "");
    for (var o = (e = e.replace(/\s/g, "")).split(","), t = o.lastIndexOf(""); 0 <= t;) o[t - 1] += ",", o.splice(t, 1), t = o.lastIndexOf("");
    return o
}

function compareArray(e, o) {
    for (var t = e.length < o.length ? o : e, n = e.length < o.length ? e : o, r = !0, s = 0; s < t.length; s++) -1 === n.indexOf(t[s]) && (r = !1);
    return r
}

for (var _keyMap = {
    backspace: 8,
    tab: 9,
    clear: 12,
    enter: 13,
    return: 13,
    esc: 27,
    escape: 27,
    space: 32,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    del: 46,
    delete: 46,
    ins: 45,
    insert: 45,
    home: 36,
    end: 35,
    pageup: 33,
    pagedown: 34,
    capslock: 20,
    "\u21ea": 20,
    ",": 188,
    ".": 190,
    "/": 191,
    "`": 192,
    "-": isff ? 173 : 189,
    "=": isff ? 61 : 187,
    ";": isff ? 59 : 186,
    "'": 222,
    "[": 219,
    "]": 221,
    "\\": 220
}, _modifier = {
    "\u21e7": 16,
    shift: 16,
    "\u2325": 18,
    alt: 18,
    option: 18,
    "\u2303": 17,
    ctrl: 17,
    control: 17,
    "\u2318": isff ? 224 : 91,
    cmd: isff ? 224 : 91,
    command: isff ? 224 : 91
}, _downKeys = [], modifierMap = {16: "shiftKey", 18: "altKey", 17: "ctrlKey"}, _mods = {
    16: !1,
    18: !1,
    17: !1
}, _handlers = {}, k = 1; k < 20; k++) _keyMap["f" + k] = 111 + k;
modifierMap[isff ? 224 : 91] = "metaKey";
var _scope = "all", isBindElement = _mods[isff ? 224 : 91] = !1, code = function (e) {
    return _keyMap[e.toLowerCase()] || e.toUpperCase().charCodeAt(0)
};

function setScope(e) {
    _scope = e || "all"
}

function getScope() {
    return _scope || "all"
}

function getPressedKeyCodes() {
    return _downKeys.slice(0)
}

function filter(e) {
    var o = e.target.tagName || e.srcElement.tagName;
    return !("INPUT" === o || "SELECT" === o || "TEXTAREA" === o)
}

function isPressed(e) {
    return "string" == typeof e && (e = code(e)), -1 !== _downKeys.indexOf(e)
}

function deleteScope(e, o) {
    var t = void 0, n = void 0;
    for (var r in e || (e = getScope()), _handlers) if (Object.prototype.hasOwnProperty.call(_handlers, r)) for (t = _handlers[r], n = 0; n < t.length;) t[n].scope === e ? t.splice(n, 1) : n++;
    getScope() === e && setScope(o || "all")
}

function clearModifier(e) {
    var o = _downKeys.indexOf(t), t = e.keyCode || e.which || e.charCode;
    if (o < 0 || _downKeys.splice(o, 1), 93 !== t && 224 !== t || (t = 91), t in _mods) for (var n in _mods[t] = !1, _modifier) _modifier[n] === t && (hotkeys[n] = !1)
}

function unbind(e, o) {
    for (var t = getKeys(e), n = void 0, r = [], s = void 0, i = 0; i < t.length; i++) {
        if (1 < (n = t[i].split("+")).length && (r = getMods(_modifier, n)), e = "*" === (e = n[n.length - 1]) ? "*" : code(e), o || (o = getScope()), !_handlers[e]) return;
        for (var d = 0; d < _handlers[e].length; d++) (s = _handlers[e][d]).scope === o && compareArray(s.mods, r) && (_handlers[e][d] = {})
    }
}

function eventHandler(e, o, t) {
    var n = void 0;
    if (o.scope === t || "all" === o.scope) {
        for (var r in n = 0 < o.mods.length, _mods) Object.prototype.hasOwnProperty.call(_mods, r) && (!_mods[r] && -1 < o.mods.indexOf(+r) || _mods[r] && -1 === o.mods.indexOf(+r)) && (n = !1);
        (0 !== o.mods.length || _mods[16] || _mods[18] || _mods[17] || _mods[91]) && !n && "*" !== o.shortcut || !1 === o.method(e, o) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation && e.stopPropagation(), e.cancelBubble && (e.cancelBubble = !0))
    }
}

function dispatch(e) {
    var o = _handlers["*"], t = e.keyCode || e.which || e.charCode;
    if (-1 === _downKeys.indexOf(t) && _downKeys.push(t), 93 !== t && 224 !== t || (t = 91), t in _mods) {
        for (var n in _mods[t] = !0, _modifier) _modifier[n] === t && (hotkeys[n] = !0);
        if (!o) return
    }
    for (var r in _mods) Object.prototype.hasOwnProperty.call(_mods, r) && (_mods[r] = e[modifierMap[r]]);
    if (hotkeys.filter.call(this, e)) {
        var s = getScope();
        if (o) for (var i = 0; i < o.length; i++) o[i].scope === s && eventHandler(e, o[i], s);
        if (t in _handlers) for (var d = 0; d < _handlers[t].length; d++) eventHandler(e, _handlers[t][d], s)
    }
}

function hotkeys(e, o, t) {
    var n = getKeys(e), r = [], s = "all", i = document, d = 0;
    for (void 0 === t && "function" == typeof o && (t = o), "[object Object]" === toString.call(o) && (o.scope && (s = o.scope), o.element && (i = o.element)), "string" == typeof o && (s = o); d < n.length; d++) r = [], 1 < (e = n[d].split("+")).length && (r = getMods(_modifier, e)), (e = "*" === (e = e[e.length - 1]) ? "*" : code(e)) in _handlers || (_handlers[e] = []), _handlers[e].push({
        scope: s,
        mods: r,
        shortcut: n[d],
        method: t,
        key: n[d]
    });
    void 0 === i || isBindElement || (isBindElement = !0, addEvent(i, "keydown", function (e) {
        dispatch(e)
    }), addEvent(i, "keyup", function (e) {
        clearModifier(e)
    }))
}

var _api = {
    setScope: setScope,
    getScope: getScope,
    deleteScope: deleteScope,
    getPressedKeyCodes: getPressedKeyCodes,
    isPressed: isPressed,
    filter: filter,
    unbind: unbind
};
for (var a in _api) Object.prototype.hasOwnProperty.call(_api, a) && (hotkeys[a] = _api[a]);
if ("undefined" != typeof window) {
    var _hotkeys = window.hotkeys;
    hotkeys.noConflict = function (e) {
        return e && window.hotkeys === hotkeys && (window.hotkeys = _hotkeys), hotkeys
    }, window.hotkeys = hotkeys
}
module.exports = hotkeys;