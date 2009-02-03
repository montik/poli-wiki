//qui vi sono le variabili globali Logic
//var beccati_rss = '<script language="javascript">window.alert(33)</script>';
var rss_html = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:wfw="http://wellformedweb.org/CommentAPI/"> <xsl:output method="html"/> <xsl:template match="/"> <xsl:apply-templates select="/rss/channel"/> </xsl:template> <xsl:template match="/rss/channel"> <h3><xsl:value-of select="title"/></h3> <p><xsl:value-of select="description"/></p> <ul> <xsl:apply-templates select="item"/> </ul> </xsl:template> <xsl:template match="/rss/channel/item"> <li> <a href="{link}" title="{substring(pubDate, 0, 11)}"><xsl:value-of select="title"/></a> <p><xsl:value-of select="description" disable-output-escaping="yes" /></p> </li> </xsl:template></xsl:stylesheet>';

var corriere = "http://www.corriere.it/rss/politica.xml";

var queryLock;
var nuovoNid; // il nuovo numero casuale generato dalla query che sara' title del div della nuova ricerca
var PGNCORR; //xml corrente
var SCHEDA; // ultima scheda vista in DOM
var DFCORR; //data formatter di corrente
var DFPREC; //usato in caso di pdf
var DSCORR; //data source di corrente
var MIODS = 'Rupert_S';
var s; //skin corrente
var l; //layout corrente
var doc = document.implementation.createDocument(null, null, null);//sforna nodi xml
var logoUrl = "http://i210.photobucket.com/albums/bb51/pindeonthenet/richardbenson3.jpg"; //richy ben

//funzione forse inutile che controlla se la ricerca ha prodotto
//qualche risultato
function siono(){
if(!AjaxRequest.isActive()){
clearInterval(queryLock);
var divo = document.getElementById('rdiv');
var nid = divo.getAttribute('title');
var flagg = divo.childNodes.length;

if(nid != nuovoNid)
{ 
//TODO qui si deve rimpiazzare
var H1 = document.createElement('h3');
H1.textContent = Date() + ': La Ricerca Non Ha Prodotto Risultati';
var pidgeon = carica(PGNCORR);
var qwe = pidgeon.getElementsByTagName("response");
if(qwe.length) for(var rty=0; rty<qwe.length; rty++) qwe[rty].parentNode.removeChild(qwe[rty]);

var pirdic = pidgeon.evaluate('//*[@id="rdiv"]', pidgeon.documentElement, null, XPathResult.ANY_TYPE, null).iterateNext();
var pirdiclo = pirdic.cloneNode(false);
pirdiclo.appendChild(H1);
compose(pidgeon.documentElement, '//*[@id="rdiv"]', [pirdiclo], true);
PGNCORR = serializza(pidgeon);
var ildivo = divo.cloneNode(false);
ildivo.appendChild(H1);
divo.parentNode.replaceChild(ildivo, divo);	}

	}

else return;


}



// prende una lista di coppie (nomeDellAttributoName, descrizione)
// ritorna un array, facile da usare con compose(..)
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
if(addo == "Tigella") {DFPREC = DFCORR;}
DFCORR = addo;

var tronchetto = acdf.assem(la, sk);

//caricare l'xml
var manda = carica(PGNCORR).documentElement;
var appendi = new Array(manda); // dove PGNCORR punta al precedente elemento dati mandato al formatto
compose(tronchetto, "dati", appendi, true);
var xml = serializza(tronchetto);

acdf.formatDoc(xml, addo, gambizza);	}

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
//fixme non funziona dopo Tigella
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
sbutton.setAttribute("onclick", "acds.fquery(this, queryBuona)");
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
//todo controllio di Tigella
if(DFCORR == 'Tigella') {DFCORR = DFPREC; var pdf = window.open(); pdf.location.assign(domtot.responseText); return;}
var foresp = domtot.responseXML.documentElement; //response formattato
var neres = foresp.ownerDocument.evaluate('count(//*[@id="response"])', foresp, null, XPathResult.ANY_TYPE, null).numberValue;
if(neres){
var eres = foresp.ownerDocument.evaluate('//*[@id="response"]', foresp, null, XPathResult.ANY_TYPE, null);
compose(foresp, '//*[@id="rdiv"]', eres);
}
else { //controllo se si tratta di scheda
//var neres = foresp.ownerDocument.evaluate('count(//*[@id="scheda"])', foresp, null, XPathResult.ANY_TYPE, null).numberValue;
var neres = foresp.ownerDocument.getElementById('scheda');
if(neres){ 
var docOfra = domtot.parameters.yws_path;
var fr = /fra[gm]ment/;
if(fr.exec(docOfra)){
maneggioscheda(neres, false); return;}

else compose(foresp, '//*[@id="rdiv"]', maneggioscheda(neres, true));
}
		} 
var linux = document.importNode(foresp, true);
document.replaceChild(linux, document.documentElement);

		}





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
for(var a in df) if(a && a != "Tigella" && a != "rupert_s") {clearInterval(dfc); DFCORR = a; return;}
};

function dsCorr(){
for(var a in ds) if(a) {clearInterval(dsc); DSCORR = a; return;}
};

function salvaTorno(go){
//TODO attenzione si deve pulire il PGNCORR dal formino per postare
var pn = 'Salvataggio Corretto: ' + go.responseXML.documentElement.textContent; //nuovo uri


var ud = carica(PGNCORR);
<<<<<<< .mine
var ts = ud.createElement('H2');
ts.textContent = pn;
var bg = ud.evaluate('//div[@id="rdiv"]', ud.documentElement, null, XPathResult.ANY_TYPE, null).iterateNext();
var co = bg.cloneNode(false);
co.appendChild(ts);
bg.parentNode.replaceChild(co, bg); //sostituito in PGNCORR
PGNCORR = serializza(ud);
var mi = document.getElementById('rdiv');
var br = mi.cloneNode(false);
var lo = document.createElement('H2');
lo.textContent = pn;
br.appendChild(lo);


mi.parentNode.replaceChild(br, mi);






} //onsuccess di salva
