// l'idea e' di tenere in questo file
// solo le funzioni di onsuccess e onerror
function getHome(){
var layout = randLay(DFCORR);
var skin = randSkin(DFCORR, layout);

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
<<<<<<< .mine

		//logo
		var logo = doc.createElement("logo");
		var img = doc.createElement("img"); img.setAttribute("src", "http://i210.photobucket.com/albums/bb51/pindeonthenet/richardbenson3.jpg");
		logo.appendChild(img);

		var figli = new Array(appendi, opzioni, logo);
		compose(tronco, "dati/speciali", figli); //qui ho il dom della home da mandare al formatto
		PGNCORR = tronco.getElementsByTagName("dati").item(0).cloneNode(true);
		var xml = serializza(tronco);
		acdf.formatDoc(xml, DFCORR, gambizza); //gambizza e' una funzione che sostitutisce l'html corrente
		
							}
var obi = {

	'url': "http://" + document.domain + "/home.xml", 
	
	'onSuccess': maneggiaHome	};
AjaxRequest.get(obi);

}


/*replyTo:
 * scheda-> e' un documento DOM, la scheda a cui si intende rispondere
 * reply-> contiene il body della risposta
 * 
 * dipende da util.js
 * 
 * option e' un array nominale che puo' contenere i seguenti elementi:
 * <expression>
      <eidentifier> -> settato dal DS (verra' sovrascritto)
      <ecreator> -> PARAMETRO, entita' che ha creato il documento
      <edate> -> settato dal DS (verra' sovrascritto)
      <edescription> -> PARAMETRO, Spiegazione del contenuto della risorsa 
      <elanguage> -> PARAMETRO, L'elenco di valori usabili e` "it" ed "en".
      <erelation> Punta ad un URI. Indica l'EXPRESSION di cui è una nuova versione,
      *           in una expression non dipendente da nessun altra deve venir lasciato vuoto.
      *           In questo caso lo prendo dall'e-identifier del parametro scheda
      <esource> Punta ad un URI. Indica il WORK di cui è un expression.
      *         In questo caso utilizzo l'esource del parametro scheda.
      <epublisher> -> settato dal DS (verra' sovrascritto)
      <esubject> [<folksonomia>] PARAMETRO: un array contenente le voci di folksonomia da inserire.
      <etitle> PARAMETRO (Re:??)
      <etype> risposta
   </expression>
 */

function replyTo (scheda, reply, option){

    // TODO verificare il tipo della variabile scheda.
    // myNode corrisponde alla scheda cui si intende rispondere 
	var tempNode = scheda.responseXML.documentElement;
    var myNode = document.importNode (tempNode, true);
    
    //variabili prese da myNode
    var schedaTitolo = Util.getStr (myNode, "//wtitle");
    var schedaSource = Util.getStr(myNode,"//esource");
    var schedaRelation = Util.getStr(myNode,"//eidentifier");
    
	var schedaWork = myNode.getElementsByTagName("work")[0];
	var expression = document.createElement("expression");
  
    //costruisco l'XML per l'expression della risposta
	build (expression, "ecreator", option.ecreator, "ecreator");
	build (expression, "edescription", option.edescription, "edescription");
	build (expression, "elanguage", option.elanguage, "it");
	build (expression, "erelation", schedaRelation);
	build (expression, "esource", schedaSource);
	build (expression, "epublisher", "epublisher");	

    //se non specificato, mette il titolo della scheda cui si risponde
	build (expression, "etitle", option.etitle, schedaTitolo); 
	build (expression, "etype", "risposta");
	
	//genero esubject con le folksonomie 
	var esubject = document.createElement("esubject");
	if (option.esubject){
		for (x in option.esubject){
			build (esubject,"folksonomia",option.esubject[x]);
		}
	}
	expression.appendChild(esubject);
      
	
	var toRet      = document.createElement("ds:scheda");
	var metadati   = document.createElement("metadati");
	var body       = document.createElement("body");
	
	body.appendChild (document.createTextNode(reply));
	metadati.appendChild(schedaWork);
	metadati.appendChild(expression);
	
	//aggrego il DOM finale toRet 
	toRet.appendChild(metadati);
	toRet.appendChild(body);
	
	//TODO definire completamente il namespace
	toRet.setAttribute("xmlns:ds","http://ltw.web.cs.unibo.it/esempio");
	
	console.info(toRet); //DEBUG
	return toRet;	
}

/**
 * build (addTo, addMe, txt, altTxt):
 * 
 * Funzione accessoria, che crea un nodo chiamato <addMe> e lo aggiunge come figlio
 * al nodo <addTo>
 * 
 * Il nodo <addMe> puo' avere come nodo figlio un nodo testo,  
 * specificato da <txt> o, nel caso <txt> non sia undefined, da <altTxt>. 
 * Se ne <txt> ne <altTxt> sono specificati, il nodo <addMe> non ha testo.
 */
function build (addTo, addMe, txt, altTxt){
    //se txt e' undefined o stringa vuota, utilizzo il valore alternativo
    if ( !txt && typeof altTxt != "undefined")
            txt = altTxt;
    
    var myNode = document.createElement(addMe);
    
    //se e' tra  i parametri, creo un nodo testo
    if (typeof txt != "undefined"){
       var textNode = document.createTextNode(txt);
       myNode.appendChild (textNode);
    }
    
    addTo.appendChild(myNode);
    
    return addTo;

