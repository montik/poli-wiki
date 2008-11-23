// ritorna un oggetto NET,
// per farla breve..un XMLHttpRequest

function net(){
var httpReqObject;
if (window.XMLHttpRequest){

	httpReqObject = new XMLHttpRequest(); }

else if (window.ActiveXObject("Microsoft.XMLHTTP")){

	httpReqObject = new ActiveXObjcet("Microsoft.XMLHTTP"); }

return httpReqObject;

}


/*
 
 Data Sources:

 - http://mtotaro.web.cs.unibo.it/xml/catalogo_ds.xml (Michele)
 - http://ltw0807.web.cs.unibo.it/ds/catalog.xml (Gruppo Cer+Ritucci, powerchiosco)
 - http://ltw0802.web.cs.unibo.it/DS/catalogo.xml (tilotta)

 ***************************************

 Data Formatters

 - http://ltw0807.web.cs.unibo.it/df/xhtml/catalog.xml,
   http://ltw0807.web.cs.unibo.it/df/pdf/catalog.xml
 - http://ltw0802.web.cs.unibo.it/DF/catalogo.xml
 - mail a umezzogo@cs.unibo.it
 */

