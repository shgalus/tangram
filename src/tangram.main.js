var TANGRAM = TANGRAM || {};

TANGRAM.main = (function() {
  "use strict";
  var View = TANGRAM.ui.View,
      version = "",
      buildDate = "",
      startTangram = function(config) {
        return new View(config);
      },
      sendReport = function() {
        $.post("report.php", {
          lang:    window.navigator.language || "",
          scrwdth: window.screen.width || "",
          scrhght: window.screen.height || "",
          innwdth: window.innerWidth || "",
          innhght: window.innerHeight || "",
          version: version
        });
      };

  return {
    version: version,
    buildDate: buildDate,
    sendReport: sendReport,
    startTangram: startTangram
  };
}());

/*
 * Options:
 *
 * container: id of HTML div element to contain the puzzle
 *
 * stage_width: canvas width in pixels
 *
 * stage_height: canvas height in pixels
 *
 * stage_margin: if a point lies less than stage_margin from the
 *               border of the canvas, it is considered unvisible
 *
 * hypotenuse: length of the hypotenuse of the biggest tangram
 *             triangle in pixels
 *
 * control_margin: if length of the hypotenuse of the biggest tangram
 *                 triangle is 1, control_margin is the distance
 *                 between edges and control edges of tans
 *
 * shape_nr: index of the first displayed shape in
 *           TANGRAM.shapes.shapes
 *
 * colorset_nr: index of the first displayed colorset in
 *              TANGRAM.settings.colors
 *
 * language_nr: index of the first displayed language
 *
 */
$(document).ready(function() {
  "use strict";
  var config = {
    container: "tangram",
    stage_width: window.innerWidth,
    stage_height: window.innerHeight,
    stage_margin: 50,
    hypotenuse: 400,
    control_margin: 0.025,
    shape_nr: 50,       // TODO: temporary changed to develop shapes
    colorset_nr: 0,
    language_nr: function() {
      var s;
      if (typeof navigator.language === "string") {
        s = navigator.language.substr(0, 2).toLowerCase();
        if (s === 'pl')
          return 1;
      }
      return 0;
    }()
  };
  if (location.protocol !== "file:")
    TANGRAM.main.sendReport();
  TANGRAM.main.startTangram(config);
});
