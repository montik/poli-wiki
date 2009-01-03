//qui vi sono le variabili globali Logic
var PGNCORR; //xml corrente
var DFCORR; //data formatter di corrente
var DSCORR; //data source di corrente
var s; //skin corrente
var l; //layout corrente
var doc = document.implementation.createDocument(null, null, null);//sforna nodi xml



function cambiaPelle(la, sk, addo){
l = la;
s = sk;
var tronchetto = acdf.assem(la, sk);
var appendi = new Array(PGNCORR); // dove PGNCORR punta al precedente elemento dati mandato al formatto
compose(tronchetto, "dati", appendi, true);
var xml = serializza(tronchetto);

acdf.formatDoc(xml, addo, gambizza);	}

function figlicidio(){ //funziona solo con doc

doc.removeChild(doc.documentElement);}

//genera al volo una lista profonda con le skin ecc ecc
function stiListGen(dfArray){

//figlicidio();
var ulEst = doc.createElement("ul");
ulEst.setAttribute("id", "li_STASTI_li");
for (var dieffe in df){ // per ogni data formatter

	for (var l in df[dieffe].layout){ // per ogni layout nel df che sto scorrendo
		
		var lil = doc.createElement("li"); lil.textContent = l;
		var lul = doc.createElement("ul");	
		
		for (var s in df[dieffe].layout[l]) {//itero tutte le skin
			
		var sli = doc.createElement("li");
		sli.setAttribute("onclick", "cambiaPelle(\'" + l + "\', \'" + df[dieffe].layout[l][s] + "\', \'" + dieffe + "\')");
		sli.textContent = df[dieffe].layout[l][s];
		
		lul.appendChild(sli);	
							}
	
	lil.appendChild(lul);
	ulEst.appendChild(lil);
			}



					}
return ulEst;
			}














function piuCriteri(node){
var inner = '<input type="text" name="wcreator" />autore del work<br /><input type="text" name="wtitle" />titolo work<br /><input type="text" name="wdate" />data work<br /><input type="text" name="ecreator" />autore expression<br /><input type="text" name="edate" />data expression<br /><div><input type="text" name="folksonomia[0]" />folksonomia</div><button onclick="repliMe(this)">+Folk</button><br /><input type="text" name="edescription" />nella descrizione<br /><button onclick="acds.query(this.parentNode, null)">Cerca</button>';

node.innerHTML = inner;
var dummy = new Array(node);
debugger;
compose(PGNCORR, 'speciali/messaggio//div[@id="boxino"]', dummy, true)
};

//sostituisce l'html attuale con uno nuovo
function gambizza(domtot){
var idomdot = document.importNode(domtot.responseXML.documentElement, true);
document.replaceChild(idomdot, document.documentElement);}





function previousNonTextSibling(nodo){
	if(nodo.nodeType != 3) return nodo;
	return previousNonTextSibling(nodo.previousSibling);
	};
	
	
	
//replica cio' che lo precede	
function repliMe(myThis){
	var myForm = myThis.parentNode; //
	var toclone = previousNonTextSibling(myThis.previousSibling).cloneNode(true);
/*todo incrementare l'indice dell'url_array
	var precNome = getStr(toclone, "input/@name");

	var priQua = precNome.indexOf("[");
	var secQua = precNome.indexOf("]");
	var precInd = precNome.slice(priQua + 1, secQua);
	var intIndi = parseInt(precInd);
debugger;
	var incrNome = precNome.replace(/\[(.+)\]/, "[" + ++intIndi + "]");
	toclone.setAttribute("name", incrNome);
*/
	myForm.insertBefore(toclone, myThis);};	

//prende un div e lo incapsula in form
function divToForm(div){

var cloDiv = doc.importNode(div.cloneNode(true), true);
var form = doc.importNode(document.createElement("form").cloneNode(true), true);
//var inputs = cloDiv.getElementsByTagName("input");
var inputs = doc.evaluate(".//input", cloDiv, null, XPathResult.ANY_TYPE, null);
compose(form, ".", inputs);
return form;	};

//ritorna una skin a caso
function randSkin(dataf, laYo){
if(s != null) return s;
var indice = 0; //todo mettere una meglio fatta funzione random
var rl = df[dataf].layout[laYo][indice];
if(rl) return rl;
return false;
};

function randLay(dataf){
if(typeof(l) != "undefined") return l;

for(var ll in df[dataf].layout){ 
if(ll) return ll;}
return false;
};


function dfCorr(){

for(var a in df) if(a) {clearInterval(dfc); DFCORR = a; return;}
};

function dsCorr(){

for(var a in ds) if(a) {clearInterval(dsc); DSCORR = a; return;}
};




