var BadNotations = (function () {
  
function gbi(illion) {
  const pref = {
    ones: {
      beforeTen: "kMBTqQsSon".split(""),
      afterTen: ["", ...("UDtqQsSon".split(""))]
    },
    tens: [, ["", ...("dVTqQsSON".split(""))], ",d,Vg,Tg,qg,Qg,sg,Sg,Og,Ng".split(","), ",d,V,T,qg,Qg,sg,Sg,O,N".split(",")],
    hundreds: [, ["", ...("CDtqQsSON".split(""))], ",Ce,Dc,tc,qG,QG,sc,Sc,OG,NG".split(","), ",Cen,DuC,TrC,qGe,QGe,sCe,SCe,OGe,NGe".split(",")]
  };
  let ones = illion % 10, tens = Math.floor(illion / 10) % 10, hundreds = Math.floor(illion / 100);
  if (illion % 100 == 0 && illion != 0) {
    return pref.hundreds[3][hundreds]
  } else if (illion > 100 && ones == 0) {
    return `${pref.tens[3][tens]}${pref.hundreds[2][hundreds]}`
  } else if (illion > 100 && illion % 100 < 10) {
    return `${pref.ones.afterTen[ones]}${pref.hundreds[2][hundreds]}`
  } else if (illion > 100 && illion % 100 > 10) {
    return `${pref.ones.afterTen[ones]}${pref.tens[1][tens]}${pref.hundreds[1][hundreds]}`
  } else if (illion >= 10 && ones == 0) {
    return pref.tens[2][tens]
  } else if (illion >= 10) {
    return `${pref.ones.afterTen[ones]}${pref.tens[1][tens]}`
  } else {
    return pref.ones.beforeTen[ones]
  }
}
function formatSci(n, decimals = 3) {
  return n.gte("1e1e21") ? n.toString() /* no */ : `${new Decimal("10").pow(n.log10().mod("1", true)).toFixed(decimals)}e${n.log10().floor()}`
}
function gbiAbbreviate(n) {
  if (Decimal.isNaN(n)) return "NaN";
  if (n.eq("-Infinity")) return "-Infinity";
  if (n.eq("Infinity")) return "Infinity";
  if (n.eq("0")) return "0";
  if (n.lt("0")) {
    return `-${gbiAbbreviate(n.neg())}`
  }
  let mantissa = new Decimal("10").pow(n.log10().mod("3", true));
  let mantissa2 = new Decimal("10").pow(n.log10().mod("1", true));
  if (n.lte("1e-12") || n.gte("1e3006")) {
    return n.gte("1e1e1e5") ? n.toString() /* no */ : `${mantissa2.toFixed(3)}e${Decimal.sign(n.log10()) == 1 ? "+" : ""}${n.log10().floor()}`
  } else if (n.gt("1e-12") && n.lt("1")) {
    return n.toFixed(n.log10().neg().div("2").floor().mul("2").add("3").toNumber())
  } else if (n.gte("1") && n.lte("1e3")) {
    return mantissa.toPrecision(4)
  } else {
    return `${mantissa.toPrecision(4)}${n.gte("1e3003") ? "MilN" : gbi(n.log10().div("3").floor().sub("1").toNumber())}` // hardcode for 1e3003+
  }
}
function ptsprAbbreviate(n) {
  const r = "T U U+ U++ A A+ A++ C C+ C++ S S+ S++ O O+ O++ N N+ N++ D D+ D++ L L+ L++ OP OP+ OP++ OP* OP** OP^ OP^^ i".split(" ");
  if (Decimal.isNaN(n)) return "NaN";
  if (n.eq("-Infinity")) return "-Infinity";
  if (n.eq("Infinity")) return "Infinity";
  if (n.eq("0")) return "0";
  if (n.lt("0")) {
    return `-${ptsprAbbreviate(n.neg())}`
  };
  if (n.lt("1e-10")) {
    return formatSci(n, 4)
  } else if (n.lt("1")) {
    return n.toPrecision(4)
  } else if (n.lt("1e12")) {
    let mantissa = n.div(new Decimal("1e3").pow(n.log10().div("3").floor()));
    return `${mantissa.toPrecision(4)}${n.gte("1e3") ? "kMB"[n.log10().div("3").sub("1").floor().toNumber()] : ""}`
  } else if (n.lt("1e204")) {
    let mantissa = n.div("1e12").div(new Decimal("1e6").pow(n.div("1e12").log10().div("6").floor()));
    return `${mantissa.gte("1e3") ? mantissa.floor().toNumber().toLocaleString("en-US") : mantissa.toPrecision(4)}${r[n.div("1e12").log10().div("6").floor().toNumber()]}`
  } else if (n.lt("1e213")) {
    let mantissa = n.div("1e204");
    return `${mantissa.gte("1e3") ? mantissa.floor().toNumber().toLocaleString("en-US") : mantissa.toPrecision(4)}i`
  } else {
    return formatSci(n, 2);
  }
}
function midNotationAbbreviate(n) {
  const r = [" k M B T Qd Qn Sx Sp Oc No", " a' b' c' d' e' f' g' h' i' j'", " A' B' C' D' E' F' G' H' I' J'", " [rb]k [rb]M [rb]B [rb]T [rb]Qd [rb]Qn [rb]Sx [rb]Sp [rb]Oc [rb]De", " Vt kVt MVt BVt TVt QdVt QnVt SxVt SpVt OcVt", "a b c d e f g h i j k l m n o p q r s t u v w x y z"].map(a => a.split(" "));
  if (Decimal.isNaN(n)) return "NaN";
  if (n.eq("-Infinity")) return "-Infinity";
  if (n.eq("Infinity")) return "Infinity";
  if (n.eq("0")) return "0";
  if (n.lt("0")) {
    return `-${midNotationAbbreviate(n.neg())}`
  };
  function rep(p, x, rev = false) {
    return x == 0 ? "" : x == 1 ? p : rev ? `(${Math.floor(x)}^${p})` : `(${p}^${Math.floor(x)})`
  }
  function prefX(p, x, x2, t) {
    let log = n.log10();
    return log.mod(x2).div(x).lt("1") ? "" : `${p[log.mod(x2).div(x).mod("10").floor()[tn]()]}${rep(p[10], log.mod(x2).div(x).div("10").floor()[tn]())}|${t} `
  }
  let a = n.log10().mod("1e3").div("3").floor(), tn = "toNumber";
  let mantissa = n.div(Decimal.pow("10", a.mul("3").add(Decimal.mul("1000", n.log10().div("1e3").floor())))).toPrecision(3);
  let pref = a == 0 ? "" : `${r[0][a.mod("10")[tn]()]}${rep("No", a.div("10").floor()[tn]())}|1`;
  if (n.lt("1e-10")) {
    return formatSci(n, 3)
  } else if (n.lt("1")) {
    return n.toPrecision(3)
  } else if (n.lt("1e1000")) {
    return `${mantissa} ${pref}`
  } else if (n.lt("1e1e38")) {
    let pre = `${prefX(r[4], "1e9", "1e12", 5)}${prefX(r[3], "1e7", "1e9", 4)}${prefX(r[2], "1e5", "1e7", 3)}${prefX(r[1], "1e3", "1e5", 2)}${pref}`.trim();
    if (n.gte("1e1e12")) {
      let t6 = [];
      let loglog = n.log10().log10();
      for (let i = n.gte("1e1e19") ? loglog.floor().sub("6") : new Decimal("12"); i.lte(loglog); i = i.add("1")) {
        t6pref = rep(r[5][i.sub("12").toNumber()], n.log10().div(Decimal.pow("10", i)).mod("10").floor().toNumber(), true);
        if (t6pref != "") {
          t6.push(t6pref);
        };
      };
      pre = `${t6.join("+")}|6 ${pre}`.trim();
    }
    return `${mantissa} ${pre.length >= 50 ? `${pre.slice(0, 47)}...` : pre}`
  } else {
    return formatSci(n);
  }
}
function ossn(illion, c = false) {
  const r = ["K,M,B,T,Qa,Qi,Sx,Sp,Oc,No", ",U,D,T,Q,Qi,S,Sp,O,N", ",De,Vi,Ti,Qg,Qqg,Sag,Stg,Otg,Nag", ",Cen,Ducen,Trucen,Qd,Qg,Sc,Spg,Og,Ng", ",C,Ducen,Trucen,Qd,Qg,Sc,Spg,Og,Ng", ",,Du,Tre,Qua,Qui,Sx,Sep,Oct,Non", ",Mi,Mc,Na,Pic,Fem,Att,Zp,Yc,Xo,Vc,Me,Duec,Trec,Tetrec,Pentec,Hexec,Heptec,Octec,Ennec,Icos,Meicos,Dueicos,Trioicos,Tetreicos,Penteicos,Hexeicos,Hepteicos,Octeicos,Enneicos,Triacont,Metriacont,Duetriacont,Triotriacont,Tetretriacont,Pentetriacont,Hexetriacont,Heptetriacont,Octetriacont,Ennetriacont,Tetracont,Metetracont,Duetetracont,Triotetracont,Tetretetracont,Pentetetracont,Hexetetracont,Heptetetracont,Octetetracont,Ennetetracont,Pentacont,Mepentacont,Duepentacont,Triopentacont,Tetrepentacont,Pentepentacont,Hexepentacont,Heptepentacont,Octepentacont,Ennepentacont,Hexacont,Mehexacont,Duehexacont,Triohexacont,Tetrehexacont,Pentehexacont,Hexehexacont,Heptehexacont,Octehexacont,Ennehexacont,Heptacont,Meheptacont,Dueheptacont,Trioheptacont,Tetreheptacont,Penteheptacont,Hexeheptacont,Hepteheptacont,Octeheptacont,Enneheptacont,Octacont,Meoctacont,Dueoctacont,Triooctacont,Tetreoctacont,Penteoctacont,Hexeoctacont,Hepteoctacont,Octeoctacont,Enneoctacont,Ennacont,Meennacont,Dueennacont,Trioennacont,Tetreennacont,Penteennacont,Hexeennacont,Hepteennacont,Octeennacont,Enneennacont,Hect,Mehect,Duehect,Triohect"].map(a => a.split(","));
  function x(str) {
    return str.length != 0 ? str[0].toUpperCase() + (str.slice(1) ?? "").toLowerCase() : "";
  }
  function rnd(d, m = false) {
    return illion.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  if (illion.lt("10")) {
    return r[c ? 5 : 0][nm];
  } else if (illion.eq("10")) {
    return "Dec";
  } else if (illion.eq("40")) {
    return "Qag";
  } else if (illion.lt("1e3")) {
    return `${r[1][rnd("0")]}${nm % 100 == 10 ? "Dec" : rnd("1") == 4 && nm > 100 ? "Qag" : r[2][rnd("1")]}${r[c ? 4 : 3][rnd("2")]}` // handle 1e1940 case
  } else if (Decimal.pow("1e3", illion.add("1")).log10().lt("1.7976931348623157e308")) {
    let l = Math.floor(Math.log10(nm) / 3), s = "";
    for (let i = (l > 6 ? l - 6 : 0); i <= l; i++) {
      let j = i * 3;
      if (i == 1) {
        s += `${x(rnd(3) != 0 ? `${r[5][rnd("3")]}${r[6][1]}`: "")}${x(rnd("4") != 0 ? `${r[5][rnd("4")]}My`: "")}${x(rnd(5) != 0 ? `${r[4][rnd("5")]}${r[6][1]}`: "")}`;
      } else if (i > 1) {
        s += rnd(j.toString(), 1) != 0 ? x(`${ossn(illion.div(new Decimal("10").pow(j)).floor().mod("1e3"), 1)}${r[6][i]}`) : ""
      } else {
        s += illion.mod(1e3).lt("10") ? r[1][rnd("0")] : ossn(illion.mod("1e3"));
      };
    };
    return s;
  } else {
    // use secondary notation????
    let n = Decimal.pow("1e3", illion.add("1")).log10();
    let mx = n.slog().sub("1.502198737548156").floor(); // slog_10(1.7976931348623157e308) - 1
    function rr(num) {
      return abbrevN(num, ossn, {separator: function(n) {
        if (n.gte("1e33")) {
          return " "
        };
        return ""
      }, truncLeft: true, max: "1e1.7976931348623157e308", maxChars: 32})
    };
    return `Max${mx.gte("2") ? `^${rr(mx)}` : ""}(${mx.gte("9e15") ? "10 ...TremyTrucenmiTtitrucenmcTrena" : rr(n.iteratedlog("10", mx.sub("1").toNumber()))})`
  }
}
function _179uc(illion) {
  const r = ["K M B T q Q s S o n", " u D T q Q s S o n", " d v t Qa Qq Sx Sp O N", " c Du Tr Qu Qi Ss Se Og Nn", " Mi Dm Ti Qd Qn sm Sm Ot Nn", " My"].map(a => a.split(" "));
  function rnd(d) {
    return illion.div(new Decimal("10").pow(d)).floor().mod("10").toNumber();
  }
  if (illion.lt("10")) {
    return r[0][illion.toNumber()];
  } else {
    return `${r[5][rnd("4")]}${r[4][rnd("3")]}${r[1][rnd("0")]}${r[2][rnd("1")]}${r[3][rnd("2")]}`;
  }
}
function dn(illion, c = false) {
  const r = ["K M B T Q P H S O N", " O B T Q F S H E N", " Te Tw Th Fo Fi Si Se Et Nt", " C DC TC QC FH SC SH EH NH", "K O B T Q F S H E N"].map(a => a.split(" "));
  function rnd(d, m = false) {
    return illion.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  if (illion.lt("10")) {
    return r[c ? 4 : 0][nm];
  } else if (illion.lt("1e3")) {
    return `${r[3][rnd("2")]}${r[2][rnd("1")]}${r[1][rnd("0")]}`;
  } else {
    const arr = [];
    let l = Math.floor(Math.log10(nm) / 3);
    for (let i = l; i >= 0; i--) {
      let j = i * 3;
      arr.push(dn(Decimal.fromNumber(rnd(j.toString(), 1)), 1));
    };
    return arr.join("-");
  }
}
function cs2(illion, c = false) {
  const r = ["k m b t q p h s o n", " m b t q p h s o n", " d i ʈ ɋ ƥ ħ š ö ɳ", " c ʙ ᴛ ɑ ᴘ ʜ ṡ ȯ ɴ"].map(a => a.split(" "));
  function rnd(d, m = false) {
    return illion.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  if (illion.lt("10")) {
    return r[0][nm];
  } else if (illion.lt("1e3")) {
    return `${r[3][rnd("2")]}${r[2][rnd("1")]}${r[1][rnd("0")]}`;
  } else {
    const arr = [];
    let l = Math.floor(Math.log10(nm) / 3);
    for (let i = l; i >= 0; i--) {
      let j = i * 3;
      arr.push(cs2(Decimal.fromNumber(rnd(j.toString(), 1))));
    };
    return arr.join("_");
  }
}
function cs2n(illion, c = false) {
  const r = ["k mi bi tri quadra penta hexta septa octa nona", " mi bi tri quadra penta hexta septa octa nova", " deca icosi triaconta quadraconta pentaconta hexaconta septaconta octaconta nonconta", " centi bicenti tricenti quadracenti pentacenti hexicenti septecenti octocenti noncenti", " mi bili trili quadra penta hexa septe octo nona", " deca icosi triconta quaconta penconta hexconta seconta oconta noconta", " centi bicenti tricenti quacenti pencenti hexcenti sepcenti occenti nocenti"].map(a => a.split(" "));
  let il = "";
  function rnd(d, m = false) {
    return illion.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  if (illion.lt("10")) {
    il = nm == 0 ? "thousand" : (c && nm == 0 ? "thousand" : r[c ? 4 : 0][nm]);
  } else if (illion.lt("1e3")) {
    il = `${r[c ? 6 : 3][rnd("2")]}${r[c ? 5 : 2][rnd("1")]}${r[c ? 4 : 1][rnd("0")]}`;
  } else {
    const arr = [];
    let l = Math.floor(Math.log10(nm) / 3);
    for (let i = l; i >= 0; i--) {
      let j = i * 3;
      arr.push(rnd(j.toString(), 1) == 0 ? "ki" : cs2n(Decimal.fromNumber(rnd(j.toString(), 1)), 1));
    };
    il = arr.join("");
  };
  il = il.replace(/aa/g, "a")
    .replace(/ee/g, "e")
    .replace(/ii/g, "i")
    .replace(/oo/g, "o")
    .replace(/uu/g, "u")
    .replace(/([aeiou])$/, c ? "$1" : "");
  return c || nm == 0 ? il : `${il}illion`;
}
function vsn(illion, c = false) {
  const r = ["K Mil Bil Til Qail Qill Sxil Spil Oil Nil Dec Undec", " Un Bil Till Qail Qiil Sxil Spil Oil Nil Dec Undec", " Dec Vg Tg Qdg Qtg Heg Hxg Og Ng", " Ct Dut Tgt Qat Qnt Sjt Txt Oct Not", " Mi Myc Pic Nan"].map(a => a.split(" "));
  function rnd(d, m = false) {
    return illion.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  if (illion.lt("12")) {
    return r[c ? 1 : 0][nm];
  } else if (illion.lt("1e3")) {
    return `${r[1][rnd("0")]}${r[2][rnd("1")]}${r[3][rnd("2")]}`;
  } else {
    let l = Math.floor(Math.log10(nm) / 3), s = "";
    for (let i = l; i >= 0; i--) {
      let j = i * 3;
      if (i >= 1) {
        s += rnd(j, 1) ? `${vsn(Decimal.fromNumber(rnd(j.toString(), 1) == 1 ? 0 : rnd(j.toString(), 1)), 1)}${r[4][i]}` : "";
      } else {
        s += vsn(illion.mod("1e3"), 1);
      }
    };
    return s;
  }
}
function nvsn(illion, c = false) {
  const r = ["K M B T Qua Qit Sx Sp O No Dc Undc", " Un B Till Qua Qiil Sx Sp O No Dc Undc", " Dc Vg Tg Qdg Qtg Heg Hxg Og Ng", " Ct Dut Tgt Qat Qnt Sjt Txt Oct Not", " Mi Myc Pic Nan"].map(a => a.split(" "));
  function rnd(d, m = false) {
    return illion.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  if (illion.lt("12")) {
    return r[c ? 1 : 0][nm];
  } else if (illion.lt("1e3")) {
    return `${r[1][rnd("0")]}${r[2][rnd("1")]}${r[3][rnd("2")]}`;
  } else {
    let l = Math.floor(Math.log10(nm) / 3), s = "";
    for (let i = l; i >= 0; i--) {
      let j = i * 3;
      if (i >= 1) {
        s += rnd(j, 1) ? `${nvsn(Decimal.fromNumber(rnd(j.toString(), 1) == 1 ? 0 : rnd(j.toString(), 1)), 1)}${r[4][i]}` : "";
      } else {
        s += nvsn(illion.mod("1e3"), 1);
      }
    };
    return s;
  }
}
function un(illion) {
  if (illion.gte("10")) {
    illion = illion.add("1")
  };
  const r = ["K Myr Bry Tyr Teycr Pyr Hyr Hyi Oyr Eyr De Mcy Dcy Tycr Tetyrc Pncyr Hxycr Hpycr Ocycr Enycr", " De Iycr Tcycr Tetcycr Pcnycr Hcxycr Hpcycr Oycycr Encycr", " Hycr Dhycr Tchycr Tetchycr Pnhycr Hxhycr Hphycr Ochycr Enhycr", " Miy Biy Triy Qaiy Qiy Siy Spiy Oiy Niy Deiy Unyi Deiy Trei Quaiy Quiy Sxiy Spy Ocy Noy", " Deiy Viy Teyi Qugiy Qigy Segy Sepiy Ogey Nogiy", " Cey Ducey Trucey Qucey Quycey Secey Sepcey Occey Nocey", " Ryil Dyril Tyril Gyil Cyil Biyl Pyil Utyil Omyil", " Ril Oryil Yiyil Gyil Cyil Biyl Pyil Utyil Omyil", " Esyil Zesyil Phyil Gaill Nyill Syxyll Sepyill Dyryill Oymyill", " Tetryill Sypryill Dyrpyill Rypryill Nypryill Hypryill Hepryill Opryrill Lysryill", " Fyrly Dyrly Tryly Qyrly Nyrly Syrly Xyrly Oyrly Eryly", " Fyri Byri Tryly Qyrly Nyrly Syrly Xyrly Oyrly Eryly", " Zyrly Dyriy Tyriy Pyriy Nyriy Hyriy Syriy Oyriy Eyriy", " Heiyr Beiyr Teyir Peyir Heyir Syrly Hepyir Oyriry Nyriyr"].map(a => a.split(" "));
  function rnd(d, m = false, n = illion) {
    return n.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  if (illion.lt("20")) {
    return r[0][nm];
  } else if (illion.lt("1e3")) {
    let er = nm % 100 == 0 ? "" : nm % 100 < 20 ? `${r[0][nm % 100]}` : `${r[0][rnd("0")]}${r[1][rnd("1")]}`;
    return `${er}${r[2][rnd("2")]}`;
  } else {
    let l = illion.log10().div("3").floor().toNumber(), s = "";
    let tier2ill = l, t2id = Decimal.fromNumber(tier2ill);
    for (let i = 0; i < (l > 1e3 ? 1 : l > 6 ? 6 : (l + 1)); i++) {
      let j = tier2ill * 3;
      let t4 = tier2ill > 1e6 ? `${r[tier2ill > 1e7 ? 11 : 10][rnd(6, 0, t2id)]}${r[12][rnd(7, 0, t2id)]}${r[13][rnd(8, 0, t2id)]}'` : "";
      let pref = tier2ill < 20 ? `${(tier2ill % 100) == 10 ? "" : r[3][tier2ill]}${r[4][rnd(1, 0, t2id)]}`: `${t4}${(tier2ill % 100) == 10 ? "" : r[3][rnd(0, rnd(1, 0, t2id) < 2, t2id) % 100]}${r[4][rnd(1, 0, t2id)]}${r[5][rnd(2, 0, t2id)]}${r[tier2ill > 1e4 ? 7 : 6][rnd(3, 0, t2id)]}${r[8][rnd(4, 0, t2id)]}${r[9][rnd(5, 0, t2id)]}`;
      if (tier2ill >= 1) {
        s += rnd(j.toString(), 1) != 0 ? `${rnd(j.toString(), 1) == 1 ? "" : un(Decimal.fromNumber(rnd(j.toString(), 1)))}${pref}` : ""
      } else {
        s += rnd("0", 1) == 0 ? "" : un(Decimal.fromNumber(rnd("0", 1)));
      };
      tier2ill--;
      t2id = Decimal.fromNumber(tier2ill);
    };
    return s;
  }
}
function ml(illion, c = false) {
  const r = ["K M B T Q q S s O N", " U D T Q q S s O N", " De V Tr QU qu Se Sp Og No", " C DC TC QC qC SC sC OC NC", " Mi Mc Na Pi Fm At Zp Yc Xo Ve Me Due Tre Tetr Pente Hexe Hepte Octe Enne Ic Mei Duei Trioi Tetrei Pentei Hexei Heptei Octei Ennei " + "Triacont,Metriacont,Duetriacont,Triotriacont,Tetretriacont,Pentetriacont,Hexetriacont,Heptetriacont,Octetriacont,Ennetriacont,Tetracont,Metetracont,Duetetracont,Triotetracont,Tetretetracont,Pentetetracont,Hexetetracont,Heptetetracont,Octetetracont,Ennetetracont,Pentacont,Mepentacont,Duepentacont,Triopentacont,Tetrepentacont,Pentepentacont,Hexepentacont,Heptepentacont,Octepentacont,Ennepentacont,Hexacont,Mehexacont,Duehexacont,Triohexacont,Tetrehexacont,Pentehexacont,Hexehexacont,Heptehexacont,Octehexacont,Ennehexacont,Heptacont,Meheptacont,Dueheptacont,Trioheptacont,Tetreheptacont,Penteheptacont,Hexeheptacont,Hepteheptacont,Octeheptacont,Enneheptacont,Octacont,Meoctacont,Dueoctacont,Triooctacont,Tetreoctacont,Penteoctacont,Hexeoctacont,Hepteoctacont,Octeoctacont,Enneoctacont,Ennacont,Meennacont,Dueennacont,Trioennacont,Tetreennacont,Penteennacont,Hexeennacont,Hepteennacont,Octeennacont,Enneennacont,Hect,Mehect,Duehect,Triohect".replace(/,/g, " ")].map(a => a.split(" "));
  function rnd(d, m = false) {
    return illion.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  if (illion.lt("10")) {
    return r[c ? 1 : 0][nm];
  } else if (illion.lt("1e3")) {
    return `${r[3][rnd("2")]}${r[1][rnd("0")]}${r[2][rnd("1")]}`;
  } else {
    let l = Math.floor(Math.log10(illion) / 3), s = "";
    for (let i = l; i >= 0; i--) {
      let j = i * 3;
      if (i >= 1) {
        s += rnd(j.toString(), 1) ? `${ml(Decimal.fromNumber(rnd(j.toString(), 1) == 1 ? 0 : rnd(j.toString(), 1)), 1)}${r[4][i]}` : "";
      } else {
        s += ml(Decimal.fromNumber(rnd("0", 1)), 1);
      };
    };
    return s;
  }
}
function cs(illion, c = false) {
  const r = [
    "k m b t qa q sa s o n", " u d t qa q sa s o n", " de ve te qe qf se sf oe ne", " cn dn tn qn qo sn so on nn",
    " mi mm ni pi fi ai zi yi ri qi mc dc tc td pc hc hd oc ec is mis dis tis trs pis his hps ois eis", " mc dc tc td pc hc hd oc ec", " qi is tt tr pt ht hr ot et", " hl dh th tl ph hh he ol el",
    " kq mq gq tq pq eq zq yq rq qq hk dk tk td pk ek zk yk nk ik ike ikd ikt itr ikp iex ikz iky ikr", " e d t tr p ex z y r", " dk ik to td po eo zo yo no", " hu bu tu tv pu eu zu yu nu",
    " kj mj gj aj lj fj jj sj bj gp gm sp vj mp pj gg kp oj pp hj", " gp gm bp gb ab lb fb jb sb bb", " hb mb gub aub lub fub jub sub bub",
    " hz oz nz dz uz ez fz sz bz", " gz ay hy ky py sy px ny zy", " aw bw gw dw tw iw kw lw sw",
    " hÞ dÞ tÞ tß aÞ sÞ sß cÞ nÞ eÞ að hð lð oð pð cð wð að gð oð tø sø lø jø gø iø xø wø mø hø", " eÞ oð hø uæ væ sæ tæ hæ næ aæ tœ iœ uœ qœ tſ bœ tƹ nœ zœ", " aæ nſ bſ kſ gſ pſ vſ uſ lſ",
    " eƹ zƹ dƹ vƹ fƹ sƹ sbƹ aƹ nƹ znƹ elƹ zwƹ dzƹ vzƹ fzƹ szƹ seƹ azƹ nzƹ", " znƹ zeƹ deƹ veƹ feƹ seƹ snƹ aeƹ neƹ", " htƹ ztƹ dtƹ vtƹ ftƹ stƹ skƹ atƹ ntƹ",
    " eƽ dƽ tƽ cƽ pƽ sƽ saƽ aƽ nƽ", " dsƽ vsƽ tsƽ csƽ psƽ smƽ slƽ asƽ nsƽ", " sqƽ dqƽ tqƽ cqƽ pqƽ stƽ soƽ aqƽ nqƽ",
    " yɣ eɣ sɣ sƿ wɣ lɣ qɣ bɣ jɣ sƾ syɣ eyɣ ssɣ sƿɣ wsɣ lsɣ qsɣ bsɣ jsɣ", " sƾ eɂ sɂ sǝ wɂ lɂ qɂ bɂ jɂ", " bʚ eʚ sʚ sᴐ wʚ lʚ qʚ bʚ jʚ",
    " mᴕ hᴕ bᴕ bʊ nᴕ sᴕ bɾ tᴕ cᴕ", " mʅ hʅ bʅ bɵ nʅ sʅ bɸ tʅ cʅ", " tƛ hƛ bƛ bȝ nƛ sƛ bƍ tȝ cƛ"
  ].map(a => a.split(" "));
  function rnd(d, m = false, n = illion) {
    return n.div(new Decimal("10").pow(d)).floor().mod(m ? "1e3" : "10").toNumber();
  }
  let nm = illion.toNumber();
  let td = Decimal.fromNumber;
  function x(f, f2, sp, t) {
    const s = [];
    let l = t.log10().div("3").floor(), tierXill = l;
    if (l.gte("1e9")) return f2(l);
    for (let i = 0; i < (l.gte("1e9") ? 1 : l.gte("1e3") ? 2 : l.gte("6") ? 6 : l.add("1").toNumber()); i++) {
      let j = tierXill.mul("3");
      let pref = f2(tierXill);
      if (tierXill.gte("1")) {
        if (rnd(j, 1, t) != 0) {
          s.push(`${f(td(rnd(j, 1, t) == 1 ? 0 : rnd(j, 1, t)))}${pref}`);
        }
      } else {
        let st = f(td(rnd("0", 1, t)));
        if (st !== "") {
          s.push(st);
        }
      };
      tierXill = tierXill.sub("1");
    };
    return s.join(sp)
  }
  function getT10(t10) {
    return `${r[32][rnd("2", 0, t10)]}${r[31][rnd("1", 0, t10)]}${r[30][rnd("0", 0, t10)]}`;
  }
  function getT9(t9) {
    if (t9.lt("20")) {
      return r[27][t9.toNumber()];
    } else if (t9.lt("100")) {
      return `${r[27][rnd("0", 0, t9)]}${r[28][rnd("1", 0, t9)]}`
    } else if (t9.lt("1e3")) {
      return `${getT9(t9.mod("100"))}${r[29][rnd("2", 0, t9)]}`
    } else {
      return x(getT9, getT10, "⊷", t9)
    }
  }
  function getT8(t8) {
    if (t8.lt("1e3")) {
      return `${r[24][rnd("0", 0, t8)]}${r[25][rnd("1", 0, t8)]}${r[26][rnd("2", 0, t8)]}`;
    } else {
      return x(getT8, getT9, "∀", t8);
    }
  }
  function getT7(t7) {
    if (t7.lt("20")) {
      return r[21][t7.toNumber()];
    } else if (t7.lt("100")) {
      return `${r[21][rnd("0", 0, t7)]}${r[22][rnd("1", 0, t7)]}`
    } else if (t7.lt("1e3")) {
      return `${getT7(t7.mod("100"))}${r[23][rnd("2", 0, t7)]}`
    } else {
      return x(getT7, getT8, "%", t7)
    }
  }
  function getT6(t6) {
    if (t6.lt("30")) {
      return r[18][t6.toNumber()];
    } else if (t6.lt("200")) {
      return `${r[19][t6.div("10").floor()]}${r[18][rnd("0", 0, t6)]}`
    } else if (t6.lt("1e3")) {
      return `${r[20][rnd("2", 0, t6)]}${getT6(t6.mod("100"))}`
    } else {
      return x(getT6, getT7, "§", t6)
    }
  }
  function getT5(t5) {
    if (t5.lt("1e3")) {
      return `${r[17][rnd("2", 0, t5)]}${r[16][rnd("1", 0, t5)]}${r[15][rnd("0", 0, t5)]}`;
    } else {
      return x(getT5, getT6, "€", t5);
    }
  }
  function getT4(t4) {
    if (t4.lt("20")) {
      return r[12][t4.toNumber()];
    } else if (t4.lt("1e3")) {
      return `${r[14][rnd("2", 0, t4)]}${t4.mod("100").lt("20") && t4.mod("100").gt("10") ? r[12][t4.mod("100").toNumber()] : `${r[13][rnd("1", 0, t4)]}${r[12][rnd("0", 0, t4)]}`}`;
    } else {
      return x(getT4, getT5, "!", t4);
    }
  }
  function getT3(t3) {
    if (t3.lt("30")) {
      return r[8][t3.toNumber()];
    } else if (t3.lt("1e3")) {
      return `${r[11][rnd("2", 0, t3)]}${t3.mod("100").lt("30") && t3.mod("100").gt("10") ? r[8][t3.mod("100").toNumber()] : `${r[10][rnd("1", 0, t3)]}${r[9][rnd("0", 0, t3)]}`}`;
    } else {
      return x(getT3, getT4, "?", t3);
    }
  }
  function getT2(t2, d = false) {
    if (d ? false : t2.lt("30")) {
      return r[4][t2.toNumber()];
    } else if (t2.lt("1e3")) {
      return `${t2.mod("100").lt("30") && t2.mod("100").gt("10") ? r[4][t2.mod("100").toNumber()] : `${r[5][rnd(0, 0, t2)]}${r[6][rnd(1, 0, t2)]}`}${r[7][rnd(2, 0, t2)]}`;
    } else {
      const s2 = [];
      let l2 = t2.log10().div("3").floor(), tier3ill = l2;
      if (l2.gte("1e9")) return getT3(l2);
      for (let i2 = 0; i2 < (l2.gte("1e9") ? 1 : l2.gte("1e3") ? 2 : l2.gte("6") ? 6 : l2.add("1").toNumber()); i2++) {
        let j2 = tier3ill.mul("3");
        let pref2 = getT3(tier3ill);
        if (tier3ill.gte("1")) {
          if (rnd(j2, 1, t2) != 0) {
            s2.push(`${getT2(td(rnd(j2, 1, t2) == 1 ? 0 : rnd(j2, 1, t2)))}${pref2}`);
          }
        } else {
          let st = getT2(td(rnd("0", 1, t2)), 1);
          if (st !== "") {
            s2.push(st);
          }
        };
        tier3ill = tier3ill.sub("1");
      };
      return s2.join("&");
    }
  }
  if (illion.lt("10")) {
    return r[c ? 1 : 0][nm];
  } else if (illion.lt("1e3")) {
    return `${r[1][rnd("0")]}${r[2][rnd("1")]}${r[3][rnd("2")]}`;
  } else if (illion.lt("(e^9)3e3")) {
    const s = [];
    let l = illion.log10().div("3").floor(), tier2ill = l;
    if (l.gte("1e9")) return getT2(l);
    for (let i = 0; i < (l.gte("1e9") ? 1 : l.gte("1e3") ? 2 : l.gte("6") ? 6 : l.add("1").toNumber()); i++) {
      let j = tier2ill.mul("3");
      let pref = getT2(tier2ill);
      if (tier2ill.gte("1")) {
        if (rnd(j, 1) != 0) {
          s.push(`${cs(td(rnd(j, 1) == 1 ? 0 : rnd(j, 1)), 1)}${pref}`);
        }
      } else {
        let st = cs(td(rnd("0", 1)), 1);
        if (st !== "") {
          s.push(st);
        }
      };
      tier2ill = tier2ill.sub("1");
    };
    return s.join("-");
  } else if (illion.lt("F4.5e15")) {
    let tt = illion.iteratedlog("1e3", illion.slog("1e3").floor()), tt2 = Decimal.pow("1e3", tt.mod("1")), ttn = tt.toNumber(), tier = illion.slog("1e3").floor().add("1");
    const s = [];
    for (let i = 0; i < Math.min(6, ttn); i++) {
      let r = tt2.mul(Decimal.pow("1e3", i)).mod("1e3").floor();
      if (r.neq("0")) {
        if (tt.gte("1")) {
          s.push(`${r.gte("2") ? `${r.toString()}≫` : ""}${tt.floor().toString()}⍍${abbrevN(tier, cs, {separator: " "})}`)
        } else {
          s.push(`${r}⍍${abbrevN(tier.sub("1"), cs, {separator: " "})}`)
        }
      }
      tt = tt.sub("1");
    }
    return s.join(`∈${abbrevN(tier, cs, {separator: " "})}∋`);
  } else {
    return `~1⍍${abbrevN(illion.slog("1e3").floor().add("1"), cs, {separator: " "})}`;
  }
}
function abbrevN(n, func, config) {
  if (n.sign == -1) {
    return `-${abbrevN(n.neg(), func, config)}`;
  };
  if (n.eq("0")) return "0";
  let defaults = {
    separator: "",              // Separator between the number and the prefix. (this can be a function)
    /* function example
    function(n) { // decimal (the current number)
      if (n.gte("1e303")) {
        return " "
      };
      return ""
    }
    */
    truncLeft: false,           // If true, truncate the prefix from the left of the prefix, otherwise truncate from the right.
    maxChars: 50,               // Maximum amount of characters before truncating.
    max: "Infinity",            // Maximum number to use standard.
    isPrecision: true,          // If true, the number will use .toPrecision() instead of .toFixed().
    decimals: 3,                // Amount of decimals. Do not set this below 0 (or 3 if config.isPrecision is true).
    min: "1e3",                 // Minimum number to use standard.
    base: "1000",               // The logarithm base to determine the illion number. Only used for Denutation.
    fallbackNotation: formatSci // Fallback notation to use if max < number.
  };
  for (let i in defaults) {
    config[i] = config[i] ?? defaults[i];
  };
  if (config.decimals < 0 || (config.isPrecision && config.decimals < 3)) {
    throw new RangeError("[BadNotations] config.decimals is not in range")
  }
  if (n.eq("Infinity")) { return "Infinity"; }
  else if (n.eq("-Infinity")) { return "-Infinity"; }
  else if (Decimal.isNaN(n)) { return "NaN"; }
  else {};
  let BASELOG = new Decimal(config.base).log10(), pref = n.lt(config.base) || n.gte(config.max) ? "" : func(n.log10().div(BASELOG).sub("1").floor());
  if (n.lt("1")) {
    if (n.lt("1e-10")) {
      return config.fallbackNotation(n, config.decimals);
    } else {
      return n.toFixed(n.log10().neg().floor().add(config.decimals));
    }
  } else {
    if (n.gte(config.max)) {
      return config.fallbackNotation(n, Number(config.decimals));
    } else {
      if (n.lt(config.min)) {
        let er2 = new Decimal("10").pow(Decimal.max("0", new Decimal(config.decimals).sub("1").sub(n.log10().floor())));
        let mantissa2 = n.mul(er2).floor().div(er2);
        return (config.isPrecision ? mantissa2 : n.mul(new Decimal("10").pow(config.decimals)).floor().div(new Decimal("10").pow(config.decimals))).toNumber().toLocaleString("en-US");
      } else {
        let er = new Decimal("10").pow(new Decimal(config.decimals).sub(n.log10().floor().mod(BASELOG)));
        let mantissa = new Decimal("10").pow(n.log10().mod(BASELOG)).mul(er).floor().div(er);
        let sep = typeof config.separator == "function" ? config.separator(n) : config.separator;
        // idk bro
        return `${config.isPrecision ? mantissa.toString().slice(0, Number(config.decimals) + 1).replace(/\.$/, "") : new Decimal("10").pow(n.log10().mod(BASELOG)).mul(new Decimal("10").pow(config.decimals)).floor().div(new Decimal("10").pow(config.decimals)).toString().slice(0, n.log10().mod(BASELOG).floor().toNumber() + Number(config.decimals) + 2).replace(/\.$/, "")}${sep}${pref.length > config.maxChars ? config.truncLeft ? `...${pref.slice(pref.length - (config.maxChars - 3))}` : `${pref.slice(0, (config.maxChars - 3))}...` : pref}`.replace(new RegExp(sep + "$"), "");
      }
    }
  }
}
function fmt(f, df) {
  return function(num, config) {
    if (typeof config === "undefined") return abbrevN(num, f, df);
    for (let i in df) {
      config[i] = config[i] ?? df[i];
    };
    return abbrevN(num, f, config);
  }
}
return {
  GrandButtonIncrementalStandard: {
    format: gbiAbbreviate
  },
  True179ucStandard: {
    format: fmt(_179uc, {max: "1e60003"})
  },
  OldSetsumiStandard: {
    format: fmt(ossn, {separator: function(n) {
      if (n.gte("1e33")) {
        return " "
      };
      return ""
    }, truncLeft: true, maxChars: 55})
  },
  VectorStandard: {
    format: fmt(vsn, {separator: " ", max: new Decimal("1e3e15").mul("1e3")})
  },
  NewVectorStandard: {
    format: fmt(nvsn, {separator: " ", max: new Decimal("1e3e15").mul("1e3")})
  },
  Ultimer: {
    format: fmt(un, {separator: " ", max: "1e3e3e9"})
  },
  MergingLegendsStandard: {
    format: fmt(ml, {separator: " ", min: "1e6", max: "1e1.7976931348623157e308"})
  },
  Denutation: {
    format: fmt(dn, {separator: " ", base: "10", min: "10", max: "1e1.7976931348623157e308" /* intentional */, maxChars: Infinity})
  },
  CrapStandard: {
    format: fmt(cs, {separator: " "})
  },
  PointsProgressionStandard: {
    format: ptsprAbbreviate
  },
  Mid: {
    format: midNotationAbbreviate
  },
  CrapStandard2: {
    format: fmt(cs2, {separator: " ", min: "10", max: "1e1.7976931348623157e308", maxChars: Infinity})
  },
  CrapStandard2Names: {
    format: fmt(cs2n, {separator: " ", min: "10", max: "1e1.7976931348623157e308", maxChars: Infinity})
  }
}

})()
