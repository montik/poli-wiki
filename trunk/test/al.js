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
 */
function replyTo (scheda, reply){
 //    alert (scheda.responseXML.documentElement);
    
    //var myNode = document.importNode(scheda.responseXML.documentElment, true);
    
	//var ecreator = Util.getStr(scheda, './metadati');
	var myNode = scheda.responseXML.documentElement;
	var yourNode = document.importNode (myNode, true);
	

	//var prova = document.evaluate("//ecreator", yourNode, null, XPathResult.STRING_TYPE, null);
	var prova = Util.getStr(yourNode, "//ecreator");
	debugger;
	alert (prova);
	
}
