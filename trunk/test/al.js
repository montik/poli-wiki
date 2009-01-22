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
SCHEDA = rm;
DSCORR = getStr(rm, '//epublisher');
compose(le, 'dati', [rm]); 
//significa che prendo l'elemento dati direttamente da PGNCORR

PGNCORR = serializza(ch);


var ta = serializza(le);
acdf.formatFrag(ta, DFCORR, gambizza);
	}

function maneggioscheda(dagambizza, intero){
// fase 2.
// this.parentNode e' rdiv, cartaEpenna dovra' aggiustarlo con un bel textarea piu inputtini vari, piu un pulsante di conferma
var ba = document.createElement('button');
ba.setAttribute('onclick', 'cartaEpenna(false)');
//ba.setAttribute('onclick', 'cartaEpenna(this.parentNode, false)');
//ba.setAttribute('class', 'marcatore-poliwiki');
ba.textContent = 'intervieni';

if(intero) return [dagambizza, doc.importNode(ba, true)]; //per fare la sostituzione dell'intero documento (lo fa gambizza())

//in questo caso procedo con la sostituzione del solo frammento
var is = document.getElementById('rdiv');
var fg = is.cloneNode(false); //nuovo rdiv ma con stesso nid (document)

//appendo il documento all rdiv (rimpiazzando il vecchio)
var br = document.importNode(dagambizza, true);
fg.appendChild(br);
fg.appendChild(ba);
//creo il bottone di risposta
//var sa = document.importNode(ba, true);
//fg.appendChild(sa);
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

   //scheda = false -> nuovo work 
	if(!scheda){	//genero io il meta/work
		var cn = [
			
		   {nome: "widentifier", val: '0', dove:"."}
		  ,{nome: "wcreator", val: option.ecreator, dove:"."}
		  ,{nome: "wcoverage", val: '2009', dove:"."}
		  ,{nome: "wtitle", val: option.etitle, dove:"."}
		  ,{nome: "wdate", val: '2001-05-24T07:30:00:00', dove:"."}
				
							];
		 var schedaWork = doc.createElement('work');		
		 var schedaSource = 'http://inter.net'
		 build(cn, schedaWork);

					}
	else {
	var schedaWork = scheda.getElementsByTagName("work")[0];  // va bene cosi' com e'
	var schedaSource = Util.getStr(scheda, "//eidentifier"); //sara' esource del documento appena creato
    }
	var expression = doc.createElement("expression");
  
    //costruisco l'XML per l'expression della risposta
	var ppp = [
		  {nome: "eidentifier", val: 0, dove:"."}
		, {nome: "ecreator", val: option.ecreator, dove: "."}
		, {nome: "econtributor", val: "aggiustare qua!", dove: "."}
		, {nome: "edate", val: "2001-05-24T07:30:00", dove:"."}
		, {nome: "edescription", val: option.edescription, dove: "."}
		, {nome: "elanguage", val: 'it', dove: "."} //si potrebbe cambiare
		, {nome: "erelation", val: 'undefined', dove: "."}
		, {nome: "esource", val: schedaSource, dove: "."}
		, {nome: "epublisher", val: 0, dove: "."}	
		, {nome: "esubject", val: null, dove: "."}	
		, {nome: "etitle", val: option.etitle, dove: "."}
		, {nome: "etype", val: "risposta", dove: "."}

];




		build(ppp, expression);
		var para = new Array();
		for (var x in option.esubject) //conterra' delle stringhette semplici
			para.push({nome: "folksonomia", val: option.esubject[x], dove: "//esubject"});
			
			build(para, expression); //ora ho metadati/expression pronto

	var toRet = doc.createElementNS('http://ltw.web.cs.unibo.it/esempio', "ds:scheda");
	toRet.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
	toRet.setAttribute('xsi:schemaLocation', 'http://ltw.web.cs.unibo.it/esempio http://vitali.web.cs.unibo.it/twiki/pub/TechWeb08/PagSchemaDS/schedaSchema.xsd');
	toRet.setAttribute('xmlns:bo', 'http://www.w3.org/1999/xhtml');
	var metadati   = doc.createElement("metadati");
	var body       = doc.createElement("body");
	var mi = doc.createElement('div');
	var co = doc.createElement('p');
	co.textContent = reply.textContent
	mi.appendChild(co);
	body.appendChild(mi);
	metadati.appendChild(schedaWork);
	metadati.appendChild(expression);
	
	//aggrego il DOM finale toRet 
	toRet.appendChild(metadati);
	toRet.appendChild(body);
	
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
//nuowork=true indica un nuovo work
function cartaEpenna(nuowork){
// per prima cosa devo generare l'insieme
// di inputs e textara da appendere a
// scrivania.

var dc = [
{'name': 'ecreator', 'descr': 'autore'},
{'name': 'etitle', 'descr': 'titolo'},
];

var sp = [{'name': 'folksonomia', 'descr': ''}]; //metterlo nel div col bottone repliMe

var sv = document.createElement('div');
sv.appendChild(formGen(sp, document)[0]);
sv.appendChild(document.createTextNode('argomento'));

var to = document.createElement('button'); to.setAttribute('onclick', 'duplifolk(this)');
to.textContent = '+';

var ri = formGen(dc, document);

var pg = document.createElement('textarea'); //edescription
pg.setAttribute('raws', 5);
pg.setAttribute('cols', 25);
pg.setAttribute('name', 'edescription');
pg.textContent = "";
var na = document.createElement('textarea');
na.setAttribute('raws', 30);
na.setAttribute('cols', 50);
na.textContent = 'scrivi il tuo articolo!';
if(nuowork)
{var pubblica = document.createElement('button'); pubblica.setAttribute('onclick', 'pubblica(false, MIODS)');}
else {var pubblica = document.createElement('button'); pubblica.setAttribute('onclick', 'pubblica(true, DSCORR)');}
// quando pubblica entrera' in azione avro' rdiv in PGNCORR da ripulire!!! FIXME FIXME
pubblica.textContent = 'Pubblica';
ri.push(sv, to, document.createElement('br'), pg, document.createTextNode('piccola descrizione'), document.createElement('br'), na, pubblica);

var ce = document.getElementById('rdiv');
var av = ce.cloneNode(false);
compose(av, '.', ri);

ce.parentNode.replaceChild(av, ce);

// adesso devo 'backup-are' il tutto su PGNCORR
// tutto il malloppone si trova in av
var rc = carica(PGNCORR);
var pa = rc.createElement('div');
pa.setAttribute('id', 'rdiv');
pa.setAttribute('title', av.getAttribute('title')); 
var kr = rc.importNode(av, true);
var me = kr.childNodes;

for(var tr=0; tr<me.length; tr++)
{
//qui mi trovo costretto a ricreare ogni elemento perche' altrimenti non verra' visualizzato (uppercase??)
// non posso avere elementi profondi qua
var nome = me[tr].nodeName;
var valore = me[tr].textContent;

if(nome == '#text') {var rg = rc.createTextNode('');}
else var rg = rc.createElement(nome.toLowerCase());

if(me[tr].hasAttributes())
{var en = me[tr].attributes;
 for(var tp=0; tp<en.length; tp++) 
rg.setAttribute(en[tp].name, en[tp].value);}

rg.textContent = valore;
pa.appendChild(rg);
}


//elimino la precedente scheda
var vv = rc.documentElement.getElementsByTagName('scheda')[0];
vv.parentNode.removeChild(vv);
compose(rc.documentElement, '//*[@id="rdiv"]', [pa], true);
PGNCORR = serializza(rc);
}


//woe = false -> nuovo work => chiamare replyTo(false, body, questeOptions)
function pubblica(woe, vb){
// carico la scheda a cui voglio rispondere
// quando sara' nuovo work saro io a generare meta/work

if(!woe){ //caso nuovo work
var pt = false; //sara' _scheda_ nella chiamata a replyTo
var bi = MIODS;}
//ora devo vedere quale' il nome del DS corrente
else{
var pt = SCHEDA;
for(var vc in ds){

var no = new RegExp(vb, 'i');
if(no.exec(vc)) var bi = vc;
else if(no.exec(ds[vc].cata)) var bi=vc;
		
				}

if(typeof(bi) == 'undefined') var bi = MIODS;
				
				}



// ora devo costruire l'oggetto option con i vari parametrini
var fi = document.getElementById('rdiv').getElementsByTagName('input'); //poi sara' la volta dei textarea
var ar = {};
var im = {}; //folk

// il turno dei textarea, un buon design vorrebbe una funzione
var lu = document.getElementById('rdiv').getElementsByTagName('textarea'); //poi sara' la volta dei textarea


//non credo serva un commento
function ms(po){
for(var si=0; si<po.length; si++){

var gr = po[si].name; // il nome dubli core
var li = po[si].value;

if(gr != 'folksonomia') ar[gr] = li;
else im[si] = li;

			}

}
ms(fi);
ar.esubject = im;
ar[lu[0].name] = lu[0].value; // edescription
			
// adesso che ho il mio array di valori posso
// chiamare la replyTo che mi costriusce il
// documento da mandare al ds
var ge =  replyTo(pt, lu[1], ar); //qui adesso posso quasi pensare al salvataggio
var lmx = serializza(ge);
acds.salva(lmx, bi, salvaTorno);

//ora si tratta che devo definire la onsuccess di acds.salva e magari la onerror




	}















