var df = {}; 
var ds = {};
var proxy = "http://stanisci.web.cs.unibo.it/cgi-bin/pps.php5";
//var proxy = "http://stanisci.web.cs.unibo.it/cgi-bin/pps.php5?yws_path=";
var acds = {
hello: function(){alert("hello bello")},

dsCats: new Array("http://mtotaro.web.cs.unibo.it/xml/catalogo_ds.xml",
		  "http://ltw0807.web.cs.unibo.it/ds/catalog.xml" ,
	          "http://ltw0802.web.cs.unibo.it/DS/catalogo.xml"), 
init: function(){	
	for(var key in this.dsCats){

             var obi = {
		'url': proxy,
		'yws_path': this.dsCats[key],
		'onError': function(){alert("ds giu");},
		'onSuccess':function(parametro){
			var myNode = document.importNode(parametro.responseXML.documentElement, true);
            var name = Util.getStr(myNode, ".//nome");
			var qury = Util.getStr(myNode, ".//accesso/*[position()=1]");
			var sury = Util.getStr(myNode, ".//accesso/*[2]");
			var pippo = new DS(name);
			pippo.setQuri(qury);	
			pippo.setSuri(sury);
			ds[name] = pippo;}
						};
	
	AjaxRequest.get(obi);
			} //fine foreach
	
		
	}, //fine init
query: function(qDiv, funz, efunz){
		       var qform = divToForm(qDiv.parentNode);
		       var qstring = AjaxRequest.serializeForm(qform); //todo serve un form
		       
		       var obj = {'onSuccess': funz,
				  'url' : proxy,
				  'onError': efunz};
		       
       for(var i in ds){
		 obj['yws_path'] = ds[i].queryUri + "?" + qstring;
	     	 AjaxRequest.get(obj);}
	},
	
salva: function(schedaXml, dove){ 
	var uri = this.ds[dove].salvaUri;
	var par = {
//fixme capitolo aperto	'url': proxy + uri,
			'url': proxy,
			'yws_path': uri,
			'onError': function(){alert("salvataggio non riuscito");},
			'scheda': schedaXml   };
			
	AjaxRequest.post(par);
}
}; //fine acds
var acdf = {
		
		dfref: new Array(
		"http://ltw0802.web.cs.unibo.it/DF/catalogo.xml",
		"http://ltw0807.web.cs.unibo.it/df/xhtml/catalog.xml",	
		"http://ltw0807.web.cs.unibo.it/df/pdf/catalog.xml"
		),
		
		
		init: function(){
	for(key in this.dfref){
	//parametro per la get()
		var par = {
	'url': proxy,
	'yws_path': this.dfref[key],
	'onSuccess': function(parametro){
		var myNode = document.importNode(parametro.responseXML.documentElement, true);//todo provare con this
		var nome = Util.getStr(myNode, "./global/@name");
		var llay = Util.getStr(myNode, "./global/@list-layout")
		var frmtDoc = Util.getStr(myNode, './format/@*[starts-with(name(.), "doc")]'); //pos = 2
		var frmtFra = Util.getStr(myNode, './format/@*[starts-with(name(.), "frag")]'); // pos = 1
		var pdata = Util.getStr(myNode, "./format/@posted-data");
	//controllo tag speciali
	var set = document.evaluate("./format/specials/*", myNode, null, XPathResult.ANY_TYPE, null);
	var n = set.iterateNext();
	if(n) var spro = new Array();
		while(n){
			spro.push(n.nodeName);
			n = set.iterateNext();
				}
	var dfist = new DF(nome);	
	dfist.setSpec(spro); //todo debuggarlo
	dfist.setLayoUri(llay);
	dfist.setPdata(pdata);
	dfist.setDformUri(frmtDoc);
	dfist.setFformUri(frmtFra);
	df[nome] = dfist;
	clearTimeout(t);
	dfup();
		} //fine dichiarazione funzione onSuccess
			}; // fine oggetto da passare alla get
		AjaxRequest.get(par);
	}//fine perOgni
	
},//fine init().
		// funzione che aggiorna la lista dei layout di un df, TODO chiamare anche in fase di init
update: function(dfname){

	var layUpdateUri = df[dfname].layoutUri; //url da querare per ricevere elenco layouts/skin
	var parobj = {		
	'url': proxy,
	'yws_path': layUpdateUri,

	//setta la lista di skins e la lista di layouts
	//del DF dfname
	'onSuccess': function(parametro){
				var myNode = document.importNode(parametro.responseXML.documentElement, true);
				var laydomlist = document.evaluate("layout", myNode, null, XPathResult.ANY_TYPE, null);
				function proc(domlist){	
					var n = domlist.iterateNext();
	
					while(n){	
			
						var layNome = Util.getStr(n, "./@id");
						if(n.getElementsByTagName("skin").length > 0){
							var skidomlist = document.evaluate("skin", n, null, XPathResult.ANY_TYPE, null); 
							var inner = new Array();
							s = skidomlist.iterateNext();
						while(s){
			
							var skiNome = Util.getStr(s, "./@id");
							inner.push(skiNome);
							s = skidomlist.iterateNext();
										}
					outer[layNome] = inner;
								}
						else outer[laynome];
						n = domlist.iterateNext();}
			
				}//fine proc (interna di onSuccess)
			
	
				var outer = new Array(); //contiene la lista di tutti i ly relativi al DF
				proc(laydomlist);
				df[dfname].setLayout(outer);
								} //fine function onSuccess di update()			
						}; // fine costruzione oggetto parametro
AjaxRequest.get(parobj);
			
	},//fine dichiarazione metodo update().
		
		//formatta documento intero, vuole l'xml gia pronto, il nome del df e la funzione di callback
		formatFrag: function(frag, dove, funz){
		
var uri = df[dove].fformUri;
	
//creo il parametro per la post()
var parobj = {
'url': proxy,
'yws_path': uri,
'onError': function(){alert("errore con " + dove);},
'onSuccess': funz};

	parobj[df[dove].pdata] = frag;//inserisco l'xml nella variabile che il df ha specificato
	AjaxRequest.post(parobj);
			},
formatDoc: function(doc, dove, funz){

DFCORR = dove;		
var uri = df[dove].dformUri;
	
//creo il parametro per la post()
var parobj = {
	'url': proxy,
	'yws_path': uri,
	'onError': function(){alert("errore con " + dove);},
	'onSuccess': funz
	};
parobj[df[dove].pdata] = doc,
AjaxRequest.post(parobj);
	
},
		
		//funzione che costruisce l'intestazione dell'albero formatta.
		//prende layout ed opz. skin.Ritorna l'abero con l'elemento DATI
		//da completare con i/il documento desiderato
		//todo fornire un valore a framm se si vuole formattare un frammento
		assem: function(lay, skin, framm){
		
	var etw="http://ltw.web.cs.unibo.it/esempioErr";
	var p="http://vitali.web.cs.unibo.it/TechWeb08/SCHEMA/tag_speciali";
	var p1="http://www.w3.org/1999/xhtml";
	var p9="http://www.w3.org/1999/xhtml/datatypes/";
	var xsi="http://www.w3.org/2001/XMLSchema-instance";
	var sl="http://vitali.web.cs.unibo.it/TechWeb08/SCHEMA/formatta_XXX XXX.xsd";
	var df="http://vitali.web.cs.unibo.it/TechWeb08/SCHEMA/formatta_XXX";
	
	var regex = /XXX/g;		
	if(framm){sl = sl.replace(regex, "frammento");
		  df = df.replace(regex, "frammento");}
	
	else{sl = sl.replace(regex, "documento");
	df = df.replace(regex, "documento");}
	
	//costruzione della radice
//	var fdoc = document.implementation.createDocument(null,null,null);
//	doc.figlicidio();
	var formatta = doc.createElementNS(df, "df:formatta");
	formatta.setAttribute("xmlns:etw", etw);	
	formatta.setAttribute("xmlns:p", p);		
	formatta.setAttribute("xmlns:p1", p1);	
	formatta.setAttribute("xmlns:p9", p9);	
	formatta.setAttribute("xmlns:xsi", xsi);	
	formatta.setAttribute("xmlns:schemaLocation", sl);	
	var info = doc.createElement("info");
	formatta.appendChild(info);
	//cosfuntruzione nodo layout al quale appendere il nodo
	//attributo ID
	var layout = doc.createElement("layout");
	layout.setAttribute("id", lay);
	info.appendChild(layout);
	
	if(skin) {
		  var skinnode = doc.createElement("skin");
		  skinnode.setAttribute("id", skin);
		  info.appendChild(skinnode);
		  }
	//fine prima parte dell'albero
		
var dati = doc.createElement("dati");
formatta.appendChild(dati);
return formatta;
		}
		
	}; //fine oggetto
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
