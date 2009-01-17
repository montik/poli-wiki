// l'idea e' di tenere in questo file
// solo le funzioni di onsuccess e onerror

//sara' invocata da onclick su eidentifier
//scheda e' un uri
//function chiedoScheda(scheda) {


//} //con innerfunction che formatta
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
var etit = rsp.getElementsByTagName('etitle')[0];
etit.setAttribute("onclick", "AjaxRequest.get({url: \'" + proxy + "?yws_path=" + urino + "\', onSuccess: chiedoScheda})");
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

debugger;
var as = carica(PGNCORR);
var xyz = as.importNode(rsp, true);
var spc = as.getElementsByTagName("speciali")[0];
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

/*
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
    			}*/
    
