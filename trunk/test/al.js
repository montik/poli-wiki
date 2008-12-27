// l'idea e' di tenere in questo file
// solo le funzioni di onsuccess e onerror

//var doc = document.implementation.createDocument();//sforna nodi xml
/*
function getHome(){
    var obi = 
    {
        'url': document.location + "home.xml", 
        'onSuccess':function(rec)
        {
            var appendi = rec.responseXML.documentElement;
            var layout = randLay(DFCORR);
            var skin = randSkin(DFCORR, layout);
            var tronco = acdf.assem(layout, skin);
            compose(tronco, "formatta/dati", new Array(appendi)); //qui ho il dom della home da mandare al formatto
            var xml = serializza(tronco);
            acdf.formatDoc(xml, DFCORR, homeHandl)
        } //TODO homeHandl da definire. Deve rimpiazzare l'attuale body.
    
    }
AjaxRequest.get(obi);
};
*/

/*replyTo:
 * scheda-> e' un documento DOM, la scheda a cui si intende rispondere
 * reply-> contiene il body della risposta
 * 
 * dipende da util.js
 * 
 * Data necessaria:
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
      <esubject> [<folksonomia>] PARAMETRO
      <etitle> PARAMETRO (Re:??)
      <etype> risposta
   </expression>
 */

function replyTo (scheda, reply, ecreator, edescription, elanguage, etitle, esubject){

    // TODO verificare il tipo della variabile scheda. 
	var tempNode = scheda.responseXML.documentElement;
    var myNode = document.importNode (tempNode, true);
    
    var schedaTitolo = Util.getStr (myNode, "//wtitle");
    
    var schedaSource = Util.getStr(myNode,"//esource");
    var schedaRelation = Util.getStr(myNode,"//eidentifier");
    debugger;

	var schedaWork = myNode.getElementsByTagName("work")[0];
	var expression = document.createElement("expression");

	build (expression, "ecreator", ecreator, "ecreator");
	build (expression, "edescription", edescription, "edescription");
	build (expression, "elanguage", elanguage, "it");
	build (expression, "erelation", schedaRelation);
	build (expression, "esource", schedaSource);
	build (expression, "epublisher", "epublisher");
	
	

    //se non specificato, mette il titolo della scheda cui si risponde
	build (expression, "etitle", etitle, schedaTitolo); 
	build (expression, "etype", "risposta");
      
	
	var toRet      = document.createElement("ds:scheda");
	var metadati   = document.createElement("metadati");
	var body       = document.createElement("body");
	body.appendChild (document.createTextNode(reply));
	
	metadati.appendChild(schedaWork);
	metadati.appendChild(expression);
	
	toRet.appendChild(metadati);
	toRet.appendChild(body);
	//TODO definire completamente il namespace
	toRet.setAttribute("xmlns:ds","http://ltw.web.cs.unibo.it/esempio");
	console.info(toRet);
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
    if (typeof txt == "undefined" && typeof altTxt != "undefined")
            txt = altTxt;
    
    var myNode = document.createElement(addMe);
    
    //se e' tra  i parametri, creo un nodo testo
    if (typeof txt != "undefined"){
       var textNode = document.createTextNode(txt);
       myNode.appendChild (textNode);
    }
    addTo.appendChild(myNode);
    
    return addTo;
}