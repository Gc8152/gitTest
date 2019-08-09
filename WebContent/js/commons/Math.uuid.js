// Copyright (c) 2010 Robert Kieffer
//                      http://www.broofa.com
//                      mailto:robert@broofa.com
// Copyright (c) 2011 http://c4se.sakura.ne.jp/profile/ne.html
// Dual licensed under the MIT and GPL licenses.

(function() {
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
    random;

try {
    random = Xorshift;
} catch (err) {
    random = Math.random;
}

// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
function Math_uuid() {
  var _chars = CHARS, _random = random,
      i = 0, uuid = new Array(36), rnd = 0;
  
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  uuid[14] = '4';
  
  for (; i < 36; ++i) {
    if (i !== 8 && i !== 13 && i !== 18 && i !== 14 && i !== 23) {
      if (rnd <= 0x02) {
          rnd = 0x2000000 + (_random() * 0x1000000) | 0;
      }
      rnd >>= 4;
      uuid[i] = _chars[(i === 19) ? ((rnd & 0xf) & 0x3) | 0x8 : rnd & 0xf];
    }
  }
  return uuid.join('').toLowerCase();
}
Math.uuid = Math_uuid;
/**
 * 十九位随机数
 * @returns
 */
Math.Random19=function(){
		var radom19 = new Array(19);
		for(var i=0;i<19;i++){
			radom19[i]=parseInt(1+Math.random()*9);
		}
		return radom19.join('');
	};
Math.randomByNum=function(num){
	var s='';
	for(var i=0;i<num;i++){
		s+=parseInt(Math.random(1)*10);
	}
	return s;
};
})();


