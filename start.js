document.addEventListener('DOMContentLoaded',function(){(function(d,b){
	var q = d.createElement('div');
	q.innerHTML = '<style>.bubble{position:absolute;background:rgba(255,255,255,0.1);border:thin solid rgba(75, 170, 218, 0.4);border-radius:8px;box-shadow: 0 0 1px 1px rgba(204, 242, 255, 0.2);}'+
	'.bubble:after{content:"";display:block;height:3px;width:3px;border-radius:2px;background:rgba(204, 242, 255, 0.2);}</style>';
	q.id = 'bubbleparticle';
	b.appendChild(q);
	q = document.getElementById('bubbleparticle');
	b.style.overflowX = 'hidden';
	var h = window.innerHeight;
	var u = document.documentElement.scrollTop || document.body.scrollTop;
	var e = u-10;
	var z = 9999;
	var t = new Array();
	var l = new Array();
	var y = new Array();
	var s = new Array();
	var g = new Array();
	var c = new Array();
	d.addEventListener('scroll',function(){u = document.documentElement.scrollTop || document.body.scrollTop;e = u-10;},false);
	for(var i=0;i<40;i++){
		var m = d.createElement('div');
		m.id = 'awa'+i;
		t[i] = Math.random()*(h+u)+u;
		l[i] = Math.random()*window.innerWidth;
		var p = Math.random()*8+6;
		m.setAttribute('style','z-index:'+(z+i)+';top:'+t[i]+'px;width:'+p+'px;height:'+p+'px;left:'+l+'px;');
		m.setAttribute('class','bubble');
		q.appendChild(m);
		y[i] = Math.random()*25+0.1;
		s[i] = Math.random()*5+0.5;
		g[i] = document.getElementById('awa'+i);
		c[i] = 0;
	}
	setInterval(function(){
		for(var i=0;i<40;i++){
			if(u<t[i]){
				if(y[i]>=c[i]){
					l[i] = l[i]+0.5+Math.random()*0.5;
				}else{
					l[i] = l[i]-0.5-Math.random()*0.5;
				}
				if((y[i]*2)<=c[i]){
					c[i] = 0;
				}
			}else{
				t[i] = u+h+10;
				l[i] = Math.random()*window.innerWidth;
			}
			t[i] = t[i]-s[i];
			g[i].style.top = t[i]+'px';
			g[i].style.left = l[i]+'px';
			c[i]++;
		}
	},50);
})(document,document.body);});