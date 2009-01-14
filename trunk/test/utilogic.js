//qui vi sono le variabili globali Logic
var nuovoNid;
var PGNCORR; //xml corrente
var DFCORR; //data formatter di corrente
var DSCORR; //data source di corrente
var s; //skin corrente
var l; //layout corrente
var doc = document.implementation.createDocument(null, null, null);//sforna nodi xml
var logoUrl = "http://i210.photobucket.com/albums/bb51/pindeonthenet/richardbenson3.jpg"; //richy ben

// prende una lista di coppie (nomeDellAttributoName, descrizione)
// ritorn un array, facile da usare con compose(..)
function formGen(lista, padre){

var a = new Array();

for each (var x in lista) {
	//x ha una prop. name e una descr.
	var i = padre.createElement("input");
	i.setAttribute("type", "text"); i.setAttribute("name", x.name);
	var d = padre.createTextNode(x.descr);
	var nl = padre.createElement("br");
//	i.textContent = x.descr;
	a.push(i, d, nl); 	}

return a;	};


function cambiapelle(la, sk, addo){
l = la;
s = sk;
var tronchetto = acdf.assem(la, sk);

//caricare l'xml
var manda = carica(PGNCORR).documentElement;
var appendi = new Array(manda); // dove PGNCORR punta al precedente elemento dati mandato al formatto
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

	for (var ll in df[dieffe].layout){ // per ogni layout nel df che sto scorrendo
		
		var lil = doc.createElement("li"); lil.textContent = ll;
		var lul = doc.createElement("ul");	
		
		for (var s in df[dieffe].layout[ll]) {//itero tutte le skin
			
		var sli = doc.createElement("li");
		sli.setAttribute("onclick", "cambiapelle(\'" + ll + "\', \'" + df[dieffe].layout[ll][s] + "\', \'" + dieffe + "\')");
		sli.textContent = df[dieffe].layout[ll][s];
		
		lul.appendChild(sli);	
							}
	
	lil.appendChild(lul);
	ulEst.appendChild(lil);
			}



					}
return ulEst;
			}


function piuCriteri(node){


var lista = [

	{'name': "wcreator", 'descr': "autore del work"},
	{'name': "wtitle", 'descr': "titolo del work"},
	{'name': "wdate", 'descr': "data del work"},
	{'name': "ecreator", 'descr': "autore dell' expression"},
	{'name': "edate", 'descr': "data creazione expression"},
	//manca l'aggiunta di folksonomia+bottone + bottone cerca

]
// creo il div delle folksonomie
var pgncaricato = carica(PGNCORR);

var folksonomia = formGen([{'name': "folksonomia[0]", 'descr': "folksonomia"}], pgncaricato);
var divf = pgncaricato.createElement("div");
divf.appendChild(folksonomia[0]); //[0] perche formGen ritorna un array
divf.appendChild(pgncaricato.createTextNode("Folksonomia"));

//creo il bottone che moltiplica il box folksonomia
var piuFolk = pgncaricato.createElement("button");
piuFolk.setAttribute("onclick", "duplifolk(this)");
piuFolk.textContent = "+Folk";

//creo il bottone di submit
var sbutton = pgncaricato.createElement("button");
sbutton.setAttribute("onclick", "acds.query(this, queryBuona)");
sbutton.textContent = "Cerca";
var arrayForm = formGen(lista, pgncaricato);
arrayForm.push(divf, piuFolk, sbutton);

//creo il sostituto del div boxino e vi appendo arrayForm
var newboxino = pgncaricato.createElement("div");
newboxino.setAttribute("id", "boxino");
//super debug..
compose(newboxino, ".", arrayForm); //adesso il boxino e' tutto bello farcito di inputs vari
var boxino = pgncaricato.evaluate('//div[@id="boxino"]', pgncaricato.documentElement, null, XPathResult.ANY_TYPE, null).iterateNext();
boxino.parentNode.replaceChild(newboxino, boxino);//qui lo sostituisco con l'ex boxino che aveva solo un campetto
//in PGNCORR e' tutto apposto 
//mando al formatto un frammento, quello che contiene il div#boxino
var radica = acdf.assem(l, s, true);
var iboxino = doc.importNode(newboxino, true); //lo importo per poi appenderlo

var speciali = doc.createElement("speciali");
var msg = doc.createElement("messaggio");
msg.appendChild(iboxino);
speciali.appendChild(msg);
compose(radica, 'dati', [speciali]);

//definisco la funzione che sostituira' il pezzettino boxino
function usaEgetta(f){
var nuovo = f.responseXML.getElementById("boxino");
//var nuovo = f.responseXML.evaluate('//div[@id="boxino"]', f.responseXML, null, XPathResult.ANY_TYPE, null).iterateNext();
var inuovo = document.importNode(nuovo, true);
var vecchio = document.getElementById("boxino");
vecchio.parentNode.replaceChild(inuovo, vecchio);
};



acdf.formatFrag(serializza(radica), DFCORR, usaEgetta);
//var speranza = pgncaricato.evaluate('//div[@id="boxino"]', pgncaricato, null, XPathResult.ANY_TYPE, null).iterateNext();
//speranza.innerHTML = inner;
PGNCORR = serializza(pgncaricato);
/*
var impnode = doc.importNode(node, true);
var dummy = new Array(impnode);
compose(PGNCORR, 'speciali/miv[@id="boxino"]', dummy, true)
*/
};

//sostituisce l'html attuale con uno nuovo
function gambizza(domtot){
var idomdot = document.importNode(domtot.responseXML.documentElement, true);
document.replaceChild(idomdot, document.documentElement);}





function previousNonTextSibling(nodo){
	if(nodo.nodeType != 3) return nodo;
	return previousNonTextSibling(nodo.previousSibling);
	};
	
	
function duplifolk(o){

repliMe(o);
var gemellodoc = carica(PGNCORR);
var gemello = gemellodoc.evaluate('//button[@onclick="duplifolk(this)"]', gemellodoc.documentElement, null, XPathResult.ANY_TYPE, null).iterateNext();
repliMe(gemello);
PGNCORR = serializza(gemellodoc);
//PGNCORR = serializza(gemellodoc).toLowerCase();

}	
//replica cio' che lo precede	
function repliMe(myThis){

	var myForm = myThis.parentNode; //punta a boxino
	var toclone = previousNonTextSibling(myThis.previousSibling).cloneNode(true); // punta alla folk da duplicare

	var cloNodo = toclone.getElementsByTagName("input")[0];
	var precNome = cloNodo.getAttribute("name"); 
        function incrementer(str, uno){
var intero = parseInt(uno);

return '[' + ++intero + ']';}

	var incrNome = precNome.replace(/\[(.+)\]/, incrementer);
	cloNodo.setAttribute("name", incrNome);
	myForm.insertBefore(toclone, myThis);};	

//prende un div e lo incapsula in form
function divToForm(div){

//var cloDiv = doc.importNode(div.cloneNode(true), true);//lo clono perche' altrimenti cambiando div cambierebbe anche la pagina corrente
var cloDiv = div.cloneNode(true);
//var form = doc.importNode(document.createElement("form").cloneNode(true), true);
var form = document.createElement("form");
//var inputs = cloDiv.getElementsByTagName("input");
var inputs = document.evaluate('//*[name(.)="input"]', cloDiv, null, XPathResult.ANY_TYPE, null);
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




