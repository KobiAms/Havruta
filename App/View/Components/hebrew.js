export default function hebrew() {
    /*! @hebcal/core v3.25.1 */
    var hebcal = function (e) {
        "use strict";
        function t(e) {
            switch (e) {
                case 1:
                    return "א";
                case 2:
                    return "ב";
                case 3:
                    return "ג";
                case 4:
                    return "ד";
                case 5:
                    return "ה";
                case 6:
                    return "ו";
                case 7:
                    return "ז";
                case 8:
                    return "ח";
                case 9:
                    return "ט";
                case 10:
                    return "י";
                case 20:
                    return "כ";
                case 30:
                    return "ל";
                case 40:
                    return "מ";
                case 50:
                    return "נ";
                case 60:
                    return "ס";
                case 70:
                    return "ע";
                case 80:
                    return "פ";
                case 90:
                    return "צ";
                case 100:
                    return "ק";
                case 200:
                    return "ר";
                case 300:
                    return "ש";
                case 400:
                    return "ת";
                default:
                    return "*INVALID*";
            }
        }
        function r(e) {
            let r = parseInt(e, 10);
            if (!r)
                throw new TypeError("invalid parameter to gematriya ".concat(e));
            const a = [];
            for (r %= 1e3; r > 0;) {
                if (15 === r || 16 === r) {
                    a.push(9), a.push(r - 9);
                    break
                }
                let e, t = 100;
                for (e = 400; e > r; e -= t)
                    e === t && (t /= 10);
                a.push(e), r -= e
            }
            if (1 == a.length)
                return t(a[0]) + "׳";
            let n = "";
            for (let e = 0; e < a.length; e++)
                e + 1 === a.length && (n += "״"), n += t(a[e]);
            return n
        }
        const a = [[0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]];
        function n(e, t) {
            return e - t * Math.floor(e / t)
        }
        function s(e, t) {
            return Math.floor(e / t)
        }
        const o = {
            monthNames: ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            isLeapYear: function (e) {
                return !(e % 4 || !(e % 100) && e % 400)
            },
            daysInMonth: function (e, t) {
                return a[+this.isLeapYear(t)][e]
            },
            isDate: function (e) {
                return "object" == typeof e && Date.prototype === e.__proto__
            },
            dayOfYear: function (e) {
                if (!this.isDate(e)) throw new TypeError("Argument to greg.dayOfYear not a Date");
                let t = e.getDate() + 31 * e.getMonth();
                return e.getMonth() > 1 && (t -= Math.floor((4 * (e.getMonth() + 1) + 23) / 10),
                    this.isLeapYear(e.getFullYear()) && t++), t
            },
            greg2abs: function (e) {
                if (!this.isDate(e)) throw new TypeError("Argument to greg.greg2abs not a Date");
                const t = e.getFullYear() - 1;
                return this.dayOfYear(e) + 365 * t + (Math.floor(t / 4) - Math.floor(t / 100) + Math.floor(t / 400))
            },
            yearFromFixed: function (e) {
                const t = e - 1, r = s(t, 146097), a = n(t, 146097), o = s(a, 36524), i = n(a, 36524), h = s(i, 1461), c = s(n(i, 1461), 365), u = 400 * r + 100 * o + 4 * h + c;
                return 4 != o && 4 != c ? u + 1 : u
            },
            toFixed: function (e, t, r) { const a = e - 1; return 0 + 365 * a + s(a, 4) - s(a, 100) + s(a, 400) + s(367 * t - 362, 12) + Math.floor(t <= 2 ? 0 : this.isLeapYear(e) ? -1 : -2) + r }, abs2greg: function (e) {
                if ("number" != typeof e) throw new TypeError("Argument to greg.abs2greg not a Number"); const t = this.yearFromFixed(e), r = s(12 * (e - this.toFixed(t, 1, 1) + (e < this.toFixed(t, 3, 1) ? 0 : this.isLeapYear(t) ? 1 : 2)) + 373, 367), a = e - this.toFixed(t, r, 1) + 1, n = new Date(t, r - 1, a); return t < 100 && t >= 0 && n.setFullYear(t), n
            }
        }
            ,
            i = {
                headers: { "plural-forms": "nplurals=2; plural=(n!=1);" },
                contexts: { "": {} }
            },
            h = { h: "he", a: "ashkenazi", s: "en", "": "en" },
            c = {
                locales: Object.create(null),
                activeLocale: null,
                activeName: null,
                lookupTranslation: function (e, t) {
                    const r = ("string" == typeof t && this.locales[t] || this.activeLocale)[e];
                    if (r && r.length && r[0].length)
                        return r[0]
                },
                gettext: function (e, t) {
                    const r = this.lookupTranslation(e, t); return void 0 === r ? e : r
                },
                addLocale: function (e, t) {
                    if ("object" != typeof t.contexts || "object" != typeof t.contexts[""])
                        throw new Error("Locale '".concat(e, "' invalid compact format"));
                    this.locales[e.toLowerCase()] = t.contexts[""]
                },
                useLocale: function (e) {
                    const t = e.toLowerCase(), r = this.locales[t]; if (!r) throw new Error("Locale '".concat(e, "' not found")); return this.activeName = h[t] || t, this.activeLocale = r, this.activeLocale
                },
                getLocaleName: function () { return this.activeName },
                ordinal: function (e, t) { const r = t || this.activeName; return r && "en" !== r && "ashkenazi" !== r.substring(0, 9) ? "es" == r ? e + "º" : e + "." : this.getEnOrdinal(e) },
                getEnOrdinal: function (e) {
                    const t = ["th", "st", "nd", "rd"], r = e % 100; return e + (t[(r - 20) % 10] || t[r] || t[0])
                },
                hebrewStripNikkud: function (e) {
                    return e.replace(/[\u0590-\u05bd]/g, "").replace(/[\u05bf-\u05c7]/g, "")
                }
            }; c.addLocale("en", i), c.addLocale("s", i), c.addLocale("", i), c.useLocale("en"); const u = ["", "Nisan", "Iyyar", "Sivan", "Tamuz", "Av", "Elul", "Tishrei", "Cheshvan", "Kislev", "Tevet", "Sh'vat"], l = [u.concat(["Adar", "Nisan"]), u.concat(["Adar I", "Adar II", "Nisan"])]; function y(e) { throw new TypeError(e) } const d = Object.create(null), f = -1373428, m = "day", g = "week", p = "month", b = "year", w = { d: m, w: g, M: p, y: b }, M = { day: m, week: g, month: p, year: b }; class D { constructor(e, t, r) { if (2 == arguments.length || arguments.length > 3) throw new TypeError("HDate constructor requires 0, 1 or 3 arguments"); if (3 == arguments.length) { if (this.day = this.month = 1, this.year = +r, isNaN(this.year)) throw new TypeError("HDate called with bad year argument: ".concat(r)); if (this.setMonth(t), this.setDate(+e), isNaN(this.day)) throw new TypeError("HDate called with bad day argument: ".concat(e)) } else { void 0 === e && (e = new Date); const t = "number" != typeof e || isNaN(e) ? o.isDate(e) ? o.greg2abs(e) : D.isHDate(e) ? { dd: e.day, mm: e.month, yy: e.year } : y("HDate called with bad argument: ".concat(e)) : e, r = "number" == typeof t, a = r ? D.abs2hebrew(t) : t; this.day = a.dd, this.month = a.mm, this.year = a.yy, r && (this.abs0 = t) } } getFullYear() { return this.year } isLeapYear() { return D.isLeapYear(this.year) } getMonth() { return this.month } getTishreiMonth() { const e = D.monthsInYear(this.getFullYear()); return (this.getMonth() + e - 6) % e || e } daysInMonth() { return D.daysInMonth(this.getMonth(), this.getFullYear()) } getDate() { return this.day } getDay() { return (e = this.abs()) - (t = 7) * Math.floor(e / t); var e, t } setFullYear(e) { return this.year = e, I(this), this } setMonth(e) { return this.month = D.monthNum(e), I(this), this } setDate(e) { return this.day = e, I(this), this } greg() { return o.abs2greg(this.abs()) } abs() { return "number" != typeof this.abs0 && (this.abs0 = D.hebrew2abs(this.year, this.month, this.day)), this.abs0 } static hebrew2abs(e, t, r) { let a = r; if (t < 7) { for (let t = 7; t <= D.monthsInYear(e); t++)a += D.daysInMonth(t, e); for (let r = 1; r < t; r++)a += D.daysInMonth(r, e) } else for (let r = 7; r < t; r++)a += D.daysInMonth(r, e); return f + D.elapsedDays(e) + a - 1 } static newYear(e) { return f + D.elapsedDays(e) + D.newYearDelay(e) } static newYearDelay(e) { const t = D.elapsedDays(e); if (D.elapsedDays(e + 1) - t == 356) return 2; return t - D.elapsedDays(e - 1) == 382 ? 1 : 0 } static abs2hebrew(e) { if ("number" != typeof e || isNaN(e)) throw new TypeError("invalid parameter to abs2hebrew ".concat(e)); let t = 1 + Math.floor((e - f) / 365.24682220597794) - 1; for (; D.newYear(t) <= e;)++t; --t; let r = e < D.hebrew2abs(t, 1, 1) ? 7 : 1; for (; e > D.hebrew2abs(t, r, D.daysInMonth(r, t));)++r; return { yy: t, mm: r, dd: Math.floor(1 + e - D.hebrew2abs(t, r, 1)) } } getMonthName() { return D.getMonthName(this.getMonth(), this.getFullYear()) } render(e) { const t = e || c.getLocaleName(), r = this.getDate(), a = this.getFullYear(), n = c.gettext(this.getMonthName(), e), s = c.ordinal(r, t); let o = ""; if ("en" == t || "ashkenazi" == t.substring(0, 9)) o = " of"; else { const e = c.lookupTranslation("of", t); e && (o = " " + e) } return "".concat(s).concat(o, " ").concat(n, ", ").concat(a) } renderGematriya() { const e = this.getDate(), t = c.gettext(this.getMonthName(), "he"), a = this.getFullYear(); return r(e) + " " + t + " " + r(a) } before(e) { return v(e, this, -1) } onOrBefore(e) { return v(e, this, 0) } nearest(e) { return v(e, this, 3) } onOrAfter(e) { return v(e, this, 6) } after(e) { return v(e, this, 7) } next() { return new D(this.abs() + 1) } prev() { return new D(this.abs() - 1) } add(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "d"; if (!(e = parseInt(e, 10))) return new D(this); if (t = D.standardizeUnits(t), t === m) return new D(this.abs() + e); if (t === g) return new D(this.abs() + 7 * e); if (t === b) return new D(this.getDate(), this.getMonth(), this.getFullYear() + e); if (t === p) { let t = new D(this); const r = e > 0 ? 1 : -1; e = Math.abs(e); for (let a = 0; a < e; a++)t = new D(t.abs() + r * t.daysInMonth()); return t } } static standardizeUnits(e) { const t = w[e] || String(e || "").toLowerCase().replace(/s$/, ""); return M[t] || y("Invalid units '".concat(e, "'")) } subtract(e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "d"; return this.add(-1 * e, t) } deltaDays(e) { if (!D.isHDate(e)) throw new TypeError("Bad argument: ".concat(e)); return this.abs() - e.abs() } isSameDate(e) { return !!D.isHDate(e) && (this.year == e.year && this.month == e.month && this.day == e.day) } toString() { const e = this.getDate(), t = this.getFullYear(), r = this.getMonthName(); return "".concat(e, " ").concat(r, " ").concat(t) } static isLeapYear(e) { return (1 + 7 * e) % 19 < 7 } static monthsInYear(e) { return 12 + D.isLeapYear(e) } static daysInMonth(e, t) { return 2 == e || 4 == e || 6 == e || 10 == e || 13 == e || 12 == e && !D.isLeapYear(t) || 8 == e && !D.longCheshvan(t) || 9 == e && D.shortKislev(t) ? 29 : 30 } static getMonthName(e, t) { if ("number" != typeof e || e < 1 || e > 14) throw new TypeError("bad month argument ".concat(e)); return l[+D.isLeapYear(t)][e] } static monthNum(e) { return "number" == typeof e ? e : e.charCodeAt(0) >= 48 && e.charCodeAt(0) <= 57 ? parseInt(e, 10) : D.monthFromName(e) } static elapsedDays(e) { return d[e] = d[e] || D.elapsedDays0(e) } static elapsedDays0(e) { const t = e - 1, r = 235 * Math.floor(t / 19) + t % 19 * 12 + Math.floor((t % 19 * 7 + 1) / 19), a = 204 + r % 1080 * 793, n = 5 + 12 * r + 793 * Math.floor(r / 1080) + Math.floor(a / 1080), s = a % 1080 + n % 24 * 1080, o = 1 + 29 * r + Math.floor(n / 24), i = o + (s >= 19440 || 2 == o % 7 && s >= 9924 && !D.isLeapYear(e) || 1 == o % 7 && s >= 16789 && D.isLeapYear(t)); return i + (i % 7 == 0 || i % 7 == 3 || i % 7 == 5) } static daysInYear(e) { return D.elapsedDays(e + 1) - D.elapsedDays(e) } static longCheshvan(e) { return D.daysInYear(e) % 10 == 5 } static shortKislev(e) { return D.daysInYear(e) % 10 == 3 } static monthFromName(e) { if ("number" == typeof e) return e; const t = e.toLowerCase(); switch (t[0]) { case "n": case "נ": if ("o" == t[1]) break; return 1; case "i": return 2; case "e": return 6; case "c": case "ח": return 8; case "k": case "כ": return 9; case "s": switch (t[1]) { case "i": return 3; case "h": return 11 }case "t": switch (t[1]) { case "a": return 4; case "i": return 7; case "e": return 10 }break; case "a": switch (t[1]) { case "v": return 5; case "d": return /(1|[^i]i|a|א)$/i.test(e) ? 12 : 13 }break; case "ס": return 3; case "ט": return 10; case "ש": return 11; case "א": switch (t[1]) { case "ב": return 5; case "ד": return /(1|[^i]i|a|א)$/i.test(e) ? 12 : 13; case "י": return 2; case "ל": return 6 }break; case "ת": switch (t[1]) { case "מ": return 4; case "ש": return 7 } }throw new RangeError("Unable to parse month name: ".concat(e)) } static dayOnOrBefore(e, t) { return t - (t - e) % 7 } static isHDate(e) { return null !== e && "object" == typeof e && "number" == typeof e.year && "number" == typeof e.month && "number" == typeof e.day && "function" == typeof e.greg && "function" == typeof e.abs } } function I(e) {
                Y(e), function (e) {
                    e.day < 1 && (7 == e.month && (e.year -= 1), e.day += D.daysInMonth(e.month, e.year), e.month -= 1, I(e)); e.day > D.daysInMonth(e.month, e.year) && (6 == e.month && (e.year += 1), e.day -= D.daysInMonth(e.month, e.year), e.month += 1, I(e)); Y(e)
                }(e)
            } function Y(e) { 13 != e.month || e.isLeapYear() ? e.month < 1 ? (e.month += D.monthsInYear(e.year), e.year -= 1, I(e)) : e.month > D.monthsInYear(e.year) && (e.month -= D.monthsInYear(e.year), e.year += 1, I(e)) : (e.month -= 1, I(e)), delete e.abs0 } function v(e, t, r) { return new D(D.dayOnOrBefore(e, t.abs() + r)) } var L = { headers: { "plural-forms": "nplurals=2; plural=(n > 1);", language: "he" }, contexts: { "": { Adar: ["אַדָר"], "Adar I": ["אַדָר א׳"], "Adar II": ["אַדָר ב׳"], Av: ["אָב"], Cheshvan: ["חֶשְׁוָן"], Elul: ["אֱלוּל"], Iyyar: ["אִיָיר"], Kislev: ["כִּסְלֵו"], Nisan: ["נִיסָן"], "Sh'vat": ["שְׁבָט"], Sivan: ["סִיוָן"], Tamuz: ["תַּמּוּז"], Tevet: ["טֵבֵת"], Tishrei: ["תִשְׁרֵי"] } } }; return c.addLocale("he", L), c.addLocale("h", L), e.HDate = D, e.Locale = c, e.gematriya = r, e.greg = o, e.months = { NISAN: 1, IYYAR: 2, SIVAN: 3, TAMUZ: 4, AV: 5, ELUL: 6, TISHREI: 7, CHESHVAN: 8, KISLEV: 9, TEVET: 10, SHVAT: 11, ADAR_I: 12, ADAR_II: 13 }, e.version = "3.25.1", Object.defineProperty(e, "__esModule", { value: !0 }), e
    }({});

    /* 2021-09-23T15:56:24.532Z */

    var dt = new Date();
    var hd = new hebcal.HDate(dt);
    if (dt.getHours() > 19) {
        hd = hd.next();
    }
    var heInStr = 'בְּ';
    var monthInPrefix = {
        'Tamuz': 'בְּתַמּוּז',
        'Elul': 'בֶּאֱלוּל',
        'Tishrei': 'בְּתִשְׁרֵי',
        'Kislev': 'בְּכִסְלֵו',
        "Sh'vat": 'בִּשְׁבָט',
        'Adar': 'בַּאֲדָר',
        'Adar I': 'בַּאֲדָר א׳',
        'Adar II': 'בַּאֲדָר ב׳',
    };
    var dd = hd.getDate();
    var monthName = hd.getMonthName();
    var mm = monthInPrefix[monthName] || heInStr + hebcal.Locale.gettext(monthName, 'he');
    var yy = hd.getFullYear();
    var dateStr = hebcal.gematriya(dd) + ' ' + mm + ' ' + hebcal.gematriya(yy);
    return (dateStr);
}