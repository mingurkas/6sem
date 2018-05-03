SetComponent = {
    ext_lang: 'set_code',
    formats: ['format_set_json'],
    struct_support: true,

    factory: function(sandbox) {
        return new Window(sandbox);
    }
};

var Window = function(sandbox) { //это вьюшка

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    var labelOskar = '#set-tools-' + sandbox.container + " #labelOskar";
    var labelGoldGl = '#set-tools-' + sandbox.container + " #labelGoldGl";
    var labelRaspberry = '#set-tools-' + sandbox.container + " #labelRaspberry";
	var labelSezar = '#set-tools-' + sandbox.container + " #labelSezar";
	var labelMaska = '#set-tools-' + sandbox.container + " #labelMaska";
    var labelVetv = '#set-tools-' + sandbox.container + " #labelVetv";
	var labelBear = '#set-tools-' + sandbox.container + " #labelBear";
    var labelAnswer = '#set-tools-' + sandbox.container + " #labelAnswer";
    var title = '#set-tools-' + sandbox.container + " #labelTitle";
    var buttonFindActors = '#set-tools-' + sandbox.container + " #buttonFindActors";
    var keynodes = ['ui_oskar', 'ui_golden_globus', 'ui_raspberry', 'ui_sezar', 'ui_maska', 'ui_vetv', 'ui_bear', 'ui_answer', 'ui_title_text', 'ui_find_actor'];

    $('#' + sandbox.container).prepend('<div class="inputBox" id="set-tools-' + sandbox.container + '"></div>');
    $('#set-tools-' + sandbox.container).load('static/components/html/set-main-page.html', function() {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {


		var labelOskarText = idf[keynodes['ui_oskar']];
		var labelGoldGlText = idf[keynodes['ui_golden_globus']];
		var labelRaspberryText = idf[keynodes['ui_raspberry']];
		var labelSezarText = idf[keynodes['ui_sezar']];
		var labelMaskaText = idf[keynodes['ui_maska']];
		var labelVetvText = idf[keynodes['ui_vetv']];
		var labelBearText = idf[keynodes['ui_bear']];
		var labelAnswerText = idf[keynodes['ui_answer']];
		var titleText = idf[keynodes['ui_title_text']];
	    var buttonFindActorsText = idf[keynodes['ui_find_actor']];



        
		$(labelOskar).html(labelOskarText);
		$(labelGoldGl).html(labelGoldGlText);
		$(labelRaspberry).html(labelRaspberryText);
		$(labelSezar).html(labelSezarText);	
	    $(labelMaska).html(labelMaskaText);
		$(labelVetv).html(labelVetvText);
		$(labelBear).html(labelBearText);
        $(labelAnswer).text(labelAnswerText);
        $(title).html(titleText);
        $(buttonFindActors).html(buttonFindActorsText);
        
        

                //searchAllActors();

                $(buttonFindActors).click(function() {
                    searchAllActors();
                    setTimeout(find_Actors, 1000);
                });
            });
        });
    });

    this.applyTranslation = function(namesMap) {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {

		var labelOskarText = idf[keynodes['ui_oskar']];
		var labelGoldGlText = idf[keynodes['ui_golden_globus']];
		var labelRaspberryText = idf[keynodes['ui_raspberry']];
		var labelSezarText = idf[keynodes['ui_sezar']];
		var labelMaskaText = idf[keynodes['ui_maska']];
		var labelVetvText = idf[keynodes['ui_vetv']];
		var labelBearText = idf[keynodes['ui_bear']];
		var labelAnswerText = idf[keynodes['ui_answer']];
		var titleText = idf[keynodes['ui_title_text']];
        var buttonFindActorsText = idf[keynodes['ui_find_actor']];
        
        
        
        
        
		$(labelOskar).html(labelOskarText);
		$(labelGoldGl).html(labelGoldGlText);
		$(labelRaspberry).html(labelRaspberryText);
		$(labelSezar).html(labelSezarText);
		$(labelMaska).html(labelMaskaText);
		$(labelVetv).html(labelVetvText);
		$(labelBear).html(labelBearText);
        $(labelAnswer).text(labelAnswerText);
        $(title).html(titleText);
        $(buttonFindActors).html(buttonFindActorsText); 
             
                //searchAllActors();
            });
        });
    };
    this.sandbox.eventApplyTranslation = $.proxy(this.applyTranslation, this);

};

SCWeb.core.ComponentManager.appendComponentInitialize(SetComponent);

function searchAllActors() { //функция поиска всех актёров
                while(actorsDropdown.firstChild) {
                    actorsDropdown.removeChild(actorsDropdown.firstChild);
                }
		SCWeb.core.Server.resolveScAddr(['concept_actor', 'nrel_inclusion'], function (keynodes) {
			var actor = keynodes['concept_actor'];
			var nrel_inclusion = keynodes['nrel_inclusion'];
			window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
 				actor,
 				sc_type_arc_common | sc_type_const,
 				sc_type_node,
 				sc_type_arc_pos_const_perm,
 				nrel_inclusion]).
                        done(function (res) {
                                                var langs = [];
                                                for (r in res) {
                                                    langs.push(res[r][2]);
                                                }
                                                SCWeb.core.Server.resolveIdentifiers(langs, function (idf) {
                                                    for(i in idf) {
                                                        var opt = document.createElement('option');
                                                        opt.innerHTML = idf[i];
                                                        opt.value = i;
                                                        opt.classList.add("actorCls");
                                                        actorsDropdown.appendChild(opt);
                                                    }
                                                });
                                            });
		});
}


function find_Actors() { //функция поиска из множества актёров только тех, у которых есть выбранная награда
        var array = [];
        while(actorsDropdown.firstChild) {
            var opt = actorsDropdown.removeChild(actorsDropdown.firstChild);
            array.push(opt);
        }
            SCWeb.core.Server.resolveScAddr(['nrel_awarded'], function (keynodes) {
                var nrel_release = keynodes['nrel_awarded'];
                for (var i = 0; i < array.length; i++) {
                    checkActor(array[i], nrel_release);
                }
                setTimeout(writeResult, 1000);
            });
}

function writeResult() { //вывод результата
   var s = "";
   while(actorsDropdown.firstChild) {
       var opt = actorsDropdown.removeChild(actorsDropdown.firstChild);
       s = s + opt.innerHTML + ";";
   }
   labelCurrAnswer.innerHTML = s; 
}

function checkActor(object, nrel_release) { //проверка актёров на наличие награды
console.log("Check actor");
var obj = object.value;
window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
   obj,
   sc_type_arc_common | sc_type_const,
   sc_type_node,
   sc_type_arc_pos_const_perm,
   nrel_release]).
       done(function (res) {
          var langs = [];
          for (r in res) { langs.push(res[r][2]); console.log(res[r][2]); }
          SCWeb.core.Server.resolveIdentifiers(langs, function (idf) {
          console.log("Resolving...");
          var x = true;
          console.log(idf);
              for (q in idf) {
              var nname = idf[q];          
              
              if(document.getElementById("oskarCheck").checked) {
                  if ((nname == "Оскар" || nname == "Oskar")) {
                  console.log("Found oskar");
                  actorsDropdown.appendChild(object);
                  } else x = false;
                }
              if(document.getElementById("goldGlCheck").checked) {
                  if ((nname == "Золотой глобус" || nname == "Globus")) {
                  console.log("Found globus");
                  actorsDropdown.appendChild(object);
                  } else x = false;
                }
              if(document.getElementById("raspberryCheck").checked) {
                  if ((nname == "Золотая малина" || nname == "Golden raspberry")) {
                  console.log("Found raspberry");
                  actorsDropdown.appendChild(object);
                  } else x = false;
                }
			  if(document.getElementById("sezarCheck").checked) {
                  if ((nname == "Сезар" || nname == "Sezar")) {
                  console.log("Found sezar");
                  actorsDropdown.appendChild(object);
                  } else x = false;
                }
			  if(document.getElementById("maskaCheck").checked) {
                  if ((nname == "Золотая маска" || nname == "Golden mask")) {
                  console.log("Found maska");
                  actorsDropdown.appendChild(object);
                  } else x = false;
                }
			  if(document.getElementById("vetvCheck").checked) {
                  if ((nname == "Золотая пальмовая ветвь" || nname == "Golden palm branch")) {
                  console.log("Found velv");
                  actorsDropdown.appendChild(object);
                  } else x = false;
                }
			  if(document.getElementById("bearCheck").checked) {
                  if ((nname == "Золотой медведь" || nname == "Golden bear")) {
                  console.log("Found bear");
                  actorsDropdown.appendChild(object);
                  } else x = false;
                }
        }
            x = true;
        });
    });
}
