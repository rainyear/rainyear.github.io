// APA6 Format
// Authors + Year + Title + Journal + DOI
//
var log = function(msg){console.log(msg)};
var stglog = function(msg){console.log("====================\n"+msg+"\n====================\n")};
var warn = function(msg){console.warn("WARNING: \t" + msg)};
var isZero = function(v){
  if (v !== undefined && v.length != 0) {
    return false;
  }
  return true;
}

var _Config = {
  html: true,
  lang: "cn",
}

COMMOA = _Config.lang == "cn" ? "，" : ", ";
ETAL = _Config.lang == "cn" ? "等" : " et al. ";
LEFT_BRK = _Config.lang == "cn" ? "（" : " (";
RIGHT_BRK = _Config.lang == "cn" ? "）" : ")";
AND = _Config.lang == "cn" ? "和" : "and ";

var APA6 = function(raw){
  self = this;
  self.raw = raw;

  self.authors = [];
  self.title = "";
  self.journal = undefined;
  self.year = new Year();

  self.error = false;// Error might be logged out
  self.fatle = false;// Just skip this one!

  self.parse = function(){
    stglog(this.raw);
    this.year.parse(this.raw, self);

    if (self.error) {
      self.fatle = true;
      return false;
    }

    var splt = this.raw.split(this.year.raw);

    var auWords = splt[0].match(/\w+-\w+|\w+\ \w+|-?\w+/g);
    var author = "";
    for (var i in auWords) {
      if (auWords[i].length > 1 && auWords[i][0] != "-") {
        if (i > 0) {
          var auObj = new Author();
          this.authors.push(auObj.parse(author));
        }
        author = auWords[i] + "+";
      }else{
        author += auWords[i] + "+";
      }
    }
    var auObj = new Author();
    this.authors.push(auObj.parse(author));

    var titleAndJournal = splt[1].split(".");
    if (titleAndJournal[0].length < 5) {
      titleAndJournal = titleAndJournal.splice(1);
    }

    this.title = titleAndJournal[0].trim();

    this.journal = new Journal();
    this.journal.parse(titleAndJournal.slice(1).join("."), self);// parse journal
  }
  self.fmt = function () {
    if (this.fatle) {
      return this.raw;
    }
    // Reference style
    var fmtstr = "";

    // Author
    for (var i in this.authors) {
      if (i == this.authors.length - 1 && i > 0) {
        fmtstr += " & " + this.authors[i].fmt().slice(0, -1);
      }else{
        fmtstr += this.authors[i].fmt();
      }
    }

    // Year
    fmtstr += " " + this.year.fmt() + ". ";

    // Title
    fmtstr += this.title + ". ";

    // Journal
    fmtstr += this.journal.fmt();

    console.info(fmtstr);
    return fmtstr;
  }
  self._citeInBracket = function(isFirst){
      switch(this.authors.length){
        case 1:
          return "("+this.authors[0].familyname+ ", "+ this.year.fmt(1) +")";
        case 2:
          return "("+this.authors[0].familyname + " & "+ this.authors[1].familyname+", "+this.year.fmt(1)+")";
        case 3:case 4:case 5:
               if (isFirst) {
                  var str = "(";
                  for (var i in this.authors) {
                    if(i < this.authors.length-1){
                      str += this.authors[i].familyname + ", "
                    }else{
                      str += "& " + this.authors[i].familyname + ", "
                    }
                  }
                  return str += this.year.fmt(1) + ")"
               }else{
                 return "("+this.authors[0].familyname+" et al., "+this.year.fmt(1)+")";
               }
        default:
          return "("+this.authors[0].familyname +" et al., "+this.year.fmt(1)+")";
      }
  }
  self._citeInContext = function(isFirst){
    switch(this.authors.length){
      case 1:
         return ""+this.authors[0].familyname+LEFT_BRK+this.year.fmt(1)+RIGHT_BRK;
      case 2:
          return ""+this.authors[0].familyname+AND+this.authors[1].familyname+LEFT_BRK+this.year.fmt(1)+RIGHT_BRK;
      case 3:case 4:case 5:
        if (isFirst) {
          var str = "";
          for (var i in this.authors) {
            if(i < this.authors.length - 1){
              if (_Config.lang == "cn") {
                str += "" + this.authors[i].familyname + "、";
              }else{
                str += "" + this.authors[i].familyname + ", ";
              }
            }else{
              if (_Config.lang == "cn") {
                str = str.slice(0, -1);
              }
              str += AND+ this.authors[i].familyname + LEFT_BRK+this.year.fmt(1)+RIGHT_BRK;
            }
          }
          return str;
        }else{
          return ""+this.authors[0].familyname+ ETAL +"("+this.year.fmt(1)+")";
        }
      default:
          return ""+this.authors[0].familyname+ETAL+LEFT_BRK+this.year.fmt(1)+RIGHT_BRK;
    }
  }
  self.cite = function(isBracket, isFirst){
    if (this.fatle) {
      return "FATEL"
    }
    if (isBracket == "bracket") {
      return this._citeInBracket(isFirst);
    }else{
      return this._citeInContext(isFirst);
    }
  }

  // init parsing
  self.parse();

}
var Author = function(firstname, middlename, familyname){
  this.firstname = firstname;
  this.middlename = middlename;
  this.familyname = familyname;

  this.parse = function(raw){
    var ns = raw.split("+");
    this.familyname = ns[0];
    this.firstname = ns[1];
    if (ns.length > 3) {
      this.middlename = ns[3];
    }
    return this;
  };
  this.fmt = function(){
    if (isZero(this.firstname) || this.firstname.length !== 1) {
      warn("Author firstname wrong!");
      if (_Config.html) {
        this.firstname = "<span style='color:red;'>???</span>"
      }else{
        this.firstname = "???"
      }
    }
    var middle = isZero(this.middlename) ? "" : ". "+this.middlename;
    return ""+this.familyname+", "+this.firstname+middle+".,";
  }
}
var Journal = function(title, vol, no, pagex, pagey){
  this.title = title;
  this.vol = vol;
  this.no = no;
  this.pagex = pagex;
  this.pagey = pagey;
  this.parse = function(raw, apa){

    var titleWords = raw.match(/[a-zA-Z]+/g);
    this.title = titleWords.join(" ");

    var numbers = raw.match(/\d+/g);

    if (!numbers) {
      apa.fatle = true;
      return false;
    }

    switch(numbers.length){
      case 0:
        warn("Missing journal numbers!");
        apa.fatle = true;
        return false;
        break;
      case 1:
        this.vol = numbers[0];
        warn("Missing start page!");
        apa.error = true;
        break;
      case 2:
        this.vol = numbers[0];
        if (/\(|\)/.test(raw)) {
          this.no = numbers[1];
          warn("Missing start page!");
          apa.error = true;
        }else{
          this.pagex = numbers[1];
          warn("Missing end page!");
        }
        break;
      default://>=3
        this.vol = numbers[0];
        if (/\(|\)/.test(raw)) {
          this.no = numbers[1];
          this.pagex = numbers[2];
          this.pagey = numbers.length > 3 ? numbers[3] : undefined;
          if (!this.pagey) {
            warn("Missing end page!");
          }
        }else{
          this.pagex = numbers[1];
          this.pagey = numbers[2];
        }
        break;
    }
  };
  this.fmt = function(){
    var fmtstr = "";
    if (_Config.html) {
      fmtstr = "<i>" + this.title + "</i>, " + this.vol;
    }else{
      fmtstr = "" + this.title + ", " + this.vol;
    }

    if (!isZero(this.no)) {
      fmtstr += "("+this.no+")"
    }
    fmtstr += ", ";
    if (isZero(this.pagex)) {
      warn("Journal start page not found!");
      this.pagex = _Config.html ? "<span style='color:red'>???</span>" : "???";
    }
    fmtstr += this.pagex;
    if (!isZero(this.pagey)) {
      fmtstr += "-" + this.pagey
    }

    fmtstr += ".";

    return fmtstr;
  }
}
var Year = function(year, order){
  this.year = year||"";
  this.order = order||"";
  this.error = _Config.html ? "<span style='color:red'>????</span>" : "????";

  this.parse = function(raw, apa){
    re_year = /\(?\d{4}\w?\)?/i;
    if(!re_year.test(raw)){
      warn("Year Not found!");
      apa.error = true;
    }else{
      this.raw = raw.match(re_year)[0];
      this.year = this.raw.match(/\d{4}/)[0]
      if (/[a-z]/.test(this.raw)) {
        this.order = raw.match(/[a-z]/)[0];
      }
    }
  }
  this.fmt = function(ref){
    var output = this.year.length ? this.year : this.error;
    if (ref === undefined) {
      return "("+output+ this.order +")";
    }else{
      return ""+output+this.order;
    }
  }
}
var APA_COMP = function(a, b){
  for (var i=0; i < a.authors.length; ++i) {
    if (b.authors[i] === undefined) {
      return 1;
    }
    if (a.authors[i].familyname < b.authors[i].familyname) {
      return -1;
    }else if(a.authors[i].familyname > b.authors[i].familyname){
      return 1;
    }
  }

  return a.year.year - b.year.year;
}
