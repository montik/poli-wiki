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
 */
function replyTo (scheda, reply){

}
