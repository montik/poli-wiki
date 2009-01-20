// 260 sezione post
//// l'idea e' di tenere in questo file
// solo le funzioni di onsuccess e onerror

//sara' invocata da onclick su eidentifier
//scheda e' un uri
function chiedoScheda(scheda) { //scheda e' il response xml con la scheda
//cio che si deve fare e':
//1 aggiustare PGNCORR
//2 creare un nuovo rdiv per rimpiazzare il vecchio nella pagina corrente
//2a aggiungere un bottone per fare risposte.
//3formattare il frammento
//appenderlo al nuovo rdiv e appenderlo infine alla pagina
var ch = carica(PGNCORR);
var mt = ch.createElement('scheda'); //altremineti non vailda con tutti i NS
var aq = ch.importNode(scheda.responseXML.documentElement, true);


//aggiusto tutto senza NS
var pz = ch.evaluate('*', aq, null, XPathResult.ANY_TYPE, null);
compose(mt, '.', pz);

//gli elimino (a PGNCORR) tutti i figli response precedenti
var pe = ch.getElementsByTagName('response');
for(var te=0; te<pe.length; te++){
pe[te].parentNode.removeChild(pe[te]);}


//antepongo scheda a speciali (in PGNCORR) pena la non validazione
var cb = ch.getElementsByTagName('speciali')[0];
cb.parentNode.insertBefore(mt, cb);


//costruzione dell'albero formatta
var le = acdf.assem(l, s, true);
var rm = doc.importNode(mt, true);

compose(le, 'dati', [rm]); 
//significa che prendo l'elemento dati direttamente da PGNCORR

PGNCORR = serializza(ch);


var ta = serializza(le);
acdf.formatFrag(ta, DFCORR, gambizza);
	}

function maneggioscheda(dagambizza, intero){
//debugger;
// fase 2.
// this.parentNode e' rdiv, cartaEpenna dovra' aggiustarlo con un bel textarea piu inputtini vari, piu un pulsante di conferma
var ba = dagambizza.ownerDocument.createElement('button');
ba.setAttribute('onclick', 'javascript:alert("e l\'anno successivoo..")');
//ba.setAttribute('onclick', 'cartaEpenna(this.parentNode, false)');
ba.setAttribute('class', 'marcatore-poliwiki');
ba.textContent = 'intervieni';

if(intero) return [dagambizza, ba]; //per fare la sostituzione dell'intero documento (lo fa gambizza())

//in questo caso procedo con la sostituzione del solo frammento
var is = document.getElementById('rdiv');
var fg = is.cloneNode(false); //nuovo rdiv ma con stesso nid (document)

//appendo il documento all rdiv (rimpiazzando il vecchio)
var br = document.importNode(dagambizza, true);
fg.appendChild(br);
//creo il bottone di risposta
var sa = document.importNode(ba, true);
fg.appendChild(sa);
is.parentNode.replaceChild(fg, is);

}


//questa funzione entra in gioco quando si effettua una ricerca in caso di successo
//succ rappresenta il reponseXML
function queryBuona(succ){
//adesso devo impacchettare una bella richiesta di formattazione
// innanzitutto mi congelo il response in una variabilina
// controllo se c'e' almeno un risultato
var xx = succ.responseXML.getElementsByTagName('metadati')[0];
if(!xx) return;
var rsp = doc.createElement('response'); //serve a poter mandare la richiesta.Con le dichiarazioni di NS il DF non validava

var iRsp = doc.importNode(succ.responseXML.documentElement, true);
var a = doc.evaluate('*', iRsp, null, XPathResult.ANY_TYPE, null);
compose(rsp, '.', a);

//aggiusta i vari onclick dei vari elementi di response
//elencati in aa

function clickQuery(aa){ 
var g = rsp.getElementsByTagName(aa);
//questo loop deve estrarre valori e settare
//i vari onclick con una funzione che usa questo valore
for(var www=0; www<g.length; www++) //ora www contiene Element
{//TODO TODO super debug
var val = g[www].textContent;
var onclick = "acds.query(\'" + aa + "=" + val + "\', queryBuona)";
g[www].setAttribute("onclick", onclick);
	}

}
// arrangiamento con i vari onclick
var b = ['folksonomia', 'edate', 'ecreator'];
for(var o=0; o<b.length; o++) clickQuery(b[o]);
var urino = getStr(rsp, './/eidentifier');
var etit = rsp.getElementsByTagName('etitle');
for(var lt=0; lt<etit.length; lt++)
etit[lt].setAttribute("onclick", "AjaxRequest.get({url: \'" + proxy + "?yws_path=" + urino + "\', onSuccess: chiedoScheda})");
// adesso creo l'alberino formatta con i layout+skin correnti
var tronchetto = acdf.assem(l, s, true); //si ricorda che l ed s sono variabili globali dichiarate in utilogic.js
compose(tronchetto, 'dati', [rsp]); //..
// adesso non mi resta che inoltrare la richiesta al formatter 
// e in caso di successo modificare il dom della pagina corrente
var alberino = serializza(tronchetto);

function aggResp(xmlres){

var r = xmlres.responseXML.getElementById("response");
var junk = r.getElementsByTagName('h1')[0];
if(typeof(junk) != 'undefined') r.removeChild(junk);
var rr = document.importNode(r, true);
var k = document.getElementById('rdiv');
var vecchioNid = k.getAttribute('title');

var as = carica(PGNCORR);
var xyz = as.importNode(rsp, true);
var spc = as.getElementsByTagName("speciali")[0];
var lady = as.evaluate('//*[@id="rdiv"]', as.documentElement, null, XPathResult.ANY_TYPE, null).iterateNext();
lady.parentNode.replaceChild(lady.cloneNode(false), lady);

if(nuovoNid != vecchioNid) //e' una nuova ricerca, quindi rimpiazzo
{
var qwe = as.getElementsByTagName('response');
if(qwe.length) for(var rty=0; rty<qwe.length; rty++) qwe[rty].parentNode.removeChild(qwe[rty]);

var rdiv = document.createElement('div');
rdiv.setAttribute('id', 'rdiv');
rdiv.setAttribute('title', nuovoNid);
var testa = document.createElement('h2');
testa.textContent = 'La gente dice:';
rdiv.appendChild(testa);
rdiv.appendChild(rr);

k.parentNode.replaceChild(rdiv, k);
}
else k.appendChild(rr);//k lo leggo dall ambiente di queryBuona, altrimenti significa che non capisco quando leggo

spc.parentNode.insertBefore(xyz, spc);
PGNCORR = serializza(as);
	
	}
acdf.formatFrag(alberino, DFCORR, aggResp);

		}

function gethome(){
var layout = randLay(DFCORR);
l = layout;
var skin = randSkin(DFCORR, layout);
s = skin;
if(!skin || !layout) return;
clearInterval(gh);
function maneggiaHome(rec){
		var appendi = doc.importNode(rec.responseXML.documentElement, true); //dom della home
		var tronco = acdf.assem(layout, skin);
//		figlicidio();	
		var speciali = doc.createElement("speciali");	
		var ee = new Array(speciali);
		compose(tronco, "dati", ee);
		
		// lista delle skin
		var opzioni = doc.createElement("opzioni");
		opzioni.appendChild(stiListGen(df));

		//logo
		var logo = doc.createElement("logo");
		var img = doc.createElement("img"); img.setAttribute("src", logoUrl);
		logo.appendChild(img);


		var figli = new Array(appendi, opzioni, logo);
		compose(tronco, "dati/speciali", figli); //qui ho il dom della home da mandare al formatto
		PGNCORR = serializza(tronco.getElementsByTagName("dati").item(0));
		var xml = serializza(tronco);

		acdf.formatDoc(xml, DFCORR, gambizza); //gambizza e' una funzione che sostitutisce l'html corrente
		
							}
var obi = {

	'url': "http://" + document.domain + "/home.xml", 
	
	'onSuccess': maneggiaHome	};
AjaxRequest.get(obi);

}

// scheda: il dom della scheda a cui si sta rispondendo
// reply: il div 'corpo' della risposta
// option: un array con un po di valori a muzzo

function replyTo (scheda, reply, option){

    //variabili prese da myNode
    var schedaSource = Util.getStr(scheda, "//eidentifier"); //sara' esource del documento appena creato
    
	var schedaWork = myNode.getElementsByTagName("work")[0];  // va bene cosi' com e'
	var expression = doc.createElement("expression");
  
    //costruisco l'XML per l'expression della risposta
	var ppp = [ {nome: "ecreator", val: option.ecreator, dove: "//expression"}
		, {nome: "edescription", val: option.edescription, dove: "//expression"}
		, {nome: "elanguage", val: option.elanguage, dove: "//expression"}
		, {nome: "erelation", val: schedaRelation, dove: "//expression"}
		, {nome: "esource", val: schedaSource, dove: "//expression"}
		, {nome: "epublisher", val: "x", dove: "//expression"}	
		, {nome: "etitle", val: option.etitle, dove: "//expression"}
		, {nome: "etype", val: "risposta", dove: "//expression"}];

    //se non specificato, mette il titolo della scheda cui si risponde
	
	//genero esubject con le folksonomie 

	if (option.esubject){
		var para = new Array({nome: "esubject", val: "", dove: "//expression"});

		for (var x in option.esubject)
			para.push({nome: "folksonomia", val: option.esubject[x], dove: "//expression"});
			
			build(para, expression);
	}
	
	var toRet      = doc.createElement("scheda");
	var metadati   = doc.createElement("metadati");
	var body       = doc.createElement("body");
	
	body.appendChild(reply);
	metadati.appendChild(schedaWork);
	metadati.appendChild(expression);
	
	//aggrego il DOM finale toRet 
	toRet.appendChild(metadati);
	toRet.appendChild(body);
	
	//TODO definire completamente il namespace
	//toRet.setAttribute("xmlns:ds","http://ltw.web.cs.unibo.it/esempio");
	
	//console.info(toRet); //DEBUG
	return toRet;	
}

function build(NomeTxtDove, addTo){

for(var e=0; e<NomeTxtDove.length; e++){

var nd = doc.createElement(NomeTxtDove[e].nome);
nd.textContent = NomeTxtDove[e].val;
compose(addTo, NomeTxtDove[e].dove, [nd]);

}

    return addTo;
    			}
   //////////////////////////////////
   //sezione dedicata alle funzioni//
   //postatrici//////////////////////

//funzione che deve modificare sia il dom della pagina
//per creare un ambientino per scrivere, sia il PGNCORR
//per il cambio di skin, prende in input rdiv, cioe'
//la cornicetta che contiene(eva) la scheda appena letta.

function cartaEpenna(scrivania, nuowork){
debugger;
// per prima cosa devo generare l'insieme
// di inputs e textarea da appendere a
// scrivania.

var dc = [

{'name': 'ecreator', 'descr': 'autore'}

];

var ri = formGen(dc, doc);

var na = document.createElement('textarea');
ri.push(document.createElement('br'), na);

var ce = document.getElementById('rdiv');
var av = ce.cloneNode(false);
compose(av, '.', ri);

ce.parentNode.replaceChild(av, ce);





}


