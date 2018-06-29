var TANGRAM = TANGRAM || {};

TANGRAM.settings = (function() {
  "use strict";

  var stringMap, languageList, colors;

  stringMap = {
    menu_title: ['Tangram', 'Tangram'],
    instruction: ['Please arrange the figures in the given shape.',
                  'Proszę ułożyć figury w podany wzór.'],
    shape_label_text: ['Shape', 'Kształt'],
    color_label_text: ['Colors', 'Kolory'],
    language_label_text: ['Language', 'Język'],
    language_english: ['English', 'angielski'],
    language_polish: ['Polish', 'polski'],
    menu_cancel_button: ['Cancel', 'Anuluj'],
    menu_ok_button: ['OK', 'Zatwierdź'],
    finished_dialog_title: ['Shape formed', 'Wzór ułożony'],
    finished_dialog_message: ['Congratulations!', 'Gratulacje!'],
    finished_dialog_ok_button: ['OK', 'Zatwierdź']
  };

  languageList = [
    stringMap.language_english,
    stringMap.language_polish
  ];

  colors = [
    {
      name : ['Standard', 'Standardowy'],
      t1: 'red',
      t2: 'fuchsia',
      t3: 'lime',
      t4: 'blue',
      t5: 'aqua',
      s:  'silver',
      p:  'yellow',
      // https://www.canva.com/learn/website-color-schemes/, scheme
      // 11,
      // fill: '#eac67a',  // warm yellow
      // fill: '#18121e',  // navy blue
      // fill: '#233237',  // gunmetal
      shape: '#1e392a'     // scheme 10, forest
    },
    {
      // The Hottest Spring Colors for 2018,
      // https://www.w3schools.com/colors/colors_trends.asp, 9 V 2018,
      // the first 7 colors.
      name : ['Spring', 'Wiosna'],
      t1: '#ecdb54',    // Meadowlark
      t2: '#e94b3c',    // Cherry Tomato
      t3: '#6f9fd8',    // Little Boy Blue
      t4: '#944743',    // Chili Oil
      t5: '#dbb1cd',    // Pink Lavender
      s:  '#ec9787',    // Blooming Dahlia
      p:  '#00a591',    // Arcadia
      shape: '#1e392a'
    },
    {
      // The Hottest Fall Colors for 2017,
      // https://www.w3schools.com/colors/colors_trends.asp, 9 V 2018,
      // a choice.
      name : ['Autumn', 'Jesień'],
      t1: '#dc4c46',    // Grenadine
      t2: '#672E3B',    // Tawny Port
      t3: '#c48f65',    // Butterum
      t4: '#223a5e',    // Navy Peony
      t5: '#005960',    // Shaded Spruce
      s:  '#9c9a40',    // Golden Lime
      p:  '#d2691e',    // Autumn Maple
      shape: '#1e392a'
    },
    {
      // https://www.canva.com/learn/100-color-combinations/, 9 V
      // 2018, a mixture of 01 and 11.
      name : ['Fresh', 'Świeżość'],
      t1: '#f98866',    // petal
      t2: '#ff420e',    // poppy
      t3: '#80bd9e',    // stem
      t4: '#89da59',    // spring green
      t5: '#4cb5f5',    // blue sky
      s:  '#34675c',    // pine
      p:  '#b3c100',    // fields
      shape: '#1e392a'
    },
    {
      name : ['Burgundy', 'Burgund'],
      t1: '#900020',
      t2: '#900020',
      t3: '#900020',
      t4: '#900020',
      t5: '#900020',
      s:  '#900020',
      p:  '#900020',
      shape: '#1e392a'
    },
    {
      name : ['Oxblood', 'Bycza krew'],
      t1: '#800020',
      t2: '#800020',
      t3: '#800020',
      t4: '#800020',
      t5: '#800020',
      s:  '#800020',
      p:  '#800020',
      shape: '#1e392a'
    }
    /*
    {
      name : ['?', '?'],
      t1: '',
      t2: '',
      t3: '',
      t4: '',
      t5: '',
      s:  '',
      p:  '',
      shape: '#1e392a'
    }
    */
  ];

  return {
    stringMap: stringMap,
    languageList: languageList,
    colors: colors
  };

}());
