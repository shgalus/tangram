var TANGRAM = TANGRAM || {};

TANGRAM.ui = (function() {
  "use strict";

  var assert = TANGRAM.utils.assert,
      toPoints = TANGRAM.geometry.toPoints,
      polyinpoly = TANGRAM.geometry.pipw1h,
      polygons_intersect = TANGRAM.geometry.convex_polygons_intersect,
      stringMap = TANGRAM.settings.stringMap,
      shapeList = TANGRAM.shapes.shapeList,
      colorList = TANGRAM.settings.colors,
      languageList = TANGRAM.settings.languageList,
      scalePolygon,
      Tan,
      Shape,
      View;

  /*
   * Applies a homothety with the center at origin of coordinate
   * system (0, 0) and the ratio r to all coordinates of a polygon p =
   * [x_0, y_0, ..., x_{n - 1}, y_{n - 1}] and returns the new
   * polygon.
   */
  scalePolygon = function(p, r) {
    var n = p.length, q = new Array(n), i;
    for (i = 0; i < n; i++)
      q[i] = p[i] * r;
    return q;
  };

  /*
   * 4***************************************************************3
   * * *                                                           * *
   * *   *                                                       *   *
   * *     *                                                   *     *
   * *       *                                               *       *
   * *         *                                           *         *
   * *           *                  t2                   *           *
   * *             *                                   *             *
   * *               *                               2               *
   * *                 *                           * *               *
   * *                   *                       *   *               *
   * *                     *                   *     *               *
   * *                       *               *       *               *
   * *                         *           *         *       p       *
   * *                           *       *           *               *
   * *                             *   *             *               *
   * *           t1                  0        t4     *               1
   * *                             *   *             *             * *
   * *                           *       *           *           *   *
   * *                         *           *         *         *     *
   * *                       *               *       *       *       *
   * *                     *                   *     *     *         *
   * *                   *                       *   *   *           *
   * *                 5             s             * * *             *
   * *               *   *                           8               *
   * *             *       *                       *                 *
   * *           *           *                   *                   *
   * *         *               *               *           t3        *
   * *       *                   *           *                       *
   * *     *          t5           *       *                         *
   * *   *                           *   *                           *
   * * *                               *                             *
   * 6*********************************7*****************************9
   *
   * Coordinates of vertices:
   *
   * Vertex x-coordinate y-coordinate
   *    0   1/2          1/2
   *    1   1            1/2
   *    2   3/4          1/4
   *    3   1            0
   *    4   0            0
   *    5   1/4          3/4
   *    6   0            1
   *    7   1/2          1
   *    8   3/4          3/4
   *    9   1            1
   *
   * t1: sqrt(2)/2, sqrt(2)/2, 1
   * t2: sqrt(2)/2, sqrt(2)/2, 1
   * t3: 1/2, 1/2, sqrt(2)/2
   * t4: sqrt(2)/4, sqrt(2)/4, 1/2
   * t5: sqrt(2)/4, sqrt(2)/4, 1/2
   * s:  sqrt(2)/4
   * p:  sqrt(2)/4, 1/2, altitudes: sqrt(2)/4, 1/4
   */
  Tan = function(view, name, shape, scale_ratio, fill_color) {
    var h = scalePolygon(shape.control_vertices, scale_ratio);
    this.line = new Konva.Line({
      points:    scalePolygon(shape.vertices, scale_ratio),
      fill:      fill_color,
      closed:    true,
      draggable: true,
      name:      'tan ' + name
    });
    this.view = view;
    this.dragstartposition = {};
    this.control_vertices = toPoints(h);
    this.coordinates = toPoints(h);
    this.transform = false;
    this.line.on('mousedown', this.on_mouse_down.bind(this));
    this.line.on('dragend', this.on_drag_end.bind(this));
  };


  Tan.prototype.on_mouse_down = function() {
    if (this.view.shape_formed)
      return;
    this.dragstartposition.x = this.line.x();
    this.dragstartposition.y = this.line.y();
    this.line.moveToTop();
  };

  Tan.prototype.on_drag_end = function() {
    var v = this.view;
    if (v.shape_formed)
      return;
    if (!v.isvisible(this)) {
      this.x(this.dragstartposition.x);
      this.y(this.dragstartposition.y);
      v.tan_layer.draw();
    }
    v.check_finish(this);
  };

  Tan.prototype.update_coordinates = function() {
    var n = this.control_vertices.length,
        at = this.line.getAbsoluteTransform(),
        i, z;
    for (i = 0; i < n; i++) {
      z = at.point({
        x: this.control_vertices[i].x,
        y: this.control_vertices[i].y
      });
      this.coordinates[i].x = z.x;
      this.coordinates[i].y = z.y;
    }
  };

  /*
   * Shape is a simple closed polygon eventually minus a hole, which
   * is also a simple closed polygon inside the first one.
   */
  Shape = function(shape, scale_ratio) {
    var p = scalePolygon(shape.polygon, scale_ratio);
    this.pline = new Konva.Line({
      points: p,
      stroke: 'black',
      strokeWidth: 2,
      // fill: '#1e392a',  // scheme 10, forest
      // fill: 'black',
      // fill: '#552800', // knuth's foreground
      // http://www.eclipsecolorthemes.org/?view=theme&id=1842,
      // commentTaskTag
      fill: '#a57b61',
      closed : true
    });
    this.pcoordinates = toPoints(p);
    if (shape.hole === undefined)
      return;
    p = scalePolygon(shape.hole, scale_ratio);
    this.hline = new Konva.Line({
      points: p,
      stroke: 'black',
      strokeWidth: 2,
      // fill: '#c0c0c0',
      //fill: '#faf7e5', // porcelana
      // fill: '#fffff0', // kosc sloniowa
      // fill: '#f8f4e7', // knuth's background
      fill: 'white',
      closed : true
    });
    this.hcoordinates = toPoints(p);
  };

  Shape.prototype.move = function(change) {
    this.pline.move(change);
    if (this.hline !== undefined)
      this.hline.move(change);
  };

  Shape.prototype.update_coordinates = function() {
    var p = this.pline.points(),
        n = p.length,
        at = this.pline.getAbsoluteTransform(),
        i, j, z;
    for (i = 0, j = 0; i < n; i += 2, j++) {
      z = at.point({x: p[i], y: p[i + 1]});
      this.pcoordinates[j].x = z.x;
      this.pcoordinates[j].y = z.y;
    }
    if (this.hline === undefined)
      return;
    p = this.hline.points();
    n = p.length;
    at = this.hline.getAbsoluteTransform();
    for (i = 0, j = 0; i < n; i += 2, j++) {
      z = at.point({x: p[i], y: p[i + 1]});
      this.hcoordinates[j].x = z.x;
      this.hcoordinates[j].y = z.y;
    }
  };

  /*
   * Calculates bounding box coordinates of the shape. It returns an
   * object of minx, miny, maxx, maxy, so the coordinates of the
   * bounding box are:
   *
   * (minx, miny) - upper left vertex
   * (minx, maxy) - lower left vertex
   * (maxx, maxy) - lower right vertex
   * (maxx, miny) - upper right vertex
   */
  Shape.prototype.bounding_box = function() {
    var p = this.pline.points(),
        n = p.length,
        minx = p[0],
        maxx = minx,
        miny = p[1],
        maxy = miny,
        i, z;
    for (i = 2; i < n; i += 2) {
      z = p[i];
      if (z < minx)
        minx = z;
      else if (z > maxx)
        maxx = z;
      z = p[i + 1];
      if (z < miny)
        miny = z;
      else if (z > maxy)
        maxy = z;
    }
    return {minx: minx, miny: miny, maxx: maxx, maxy: maxy};
  };

  Shape.prototype.destroy = function() {
    if (this.hline !== undefined)
      this.hline.destroy();
    this.pline.destroy();
  };

  View = function(config) {

    this.config_map = function() {
      var m = {}, i;
      for (i in config)
        if (config.hasOwnProperty(i))
          m[i] = config[i];
      return m;
    }();

    this.id_map = function() {
      var m = {},
          prefix = '#' + this.config_map.container + '-',
          i;
      for (i in this.ID_MAP)
        if (this.ID_MAP.hasOwnProperty(i))
          m[i] =  prefix + this.ID_MAP[i];
      return m;
    }.call(this);

    $("#" + this.config_map.container).empty();
    $("#" + this.config_map.container).html(this.build_html());

    this.build_menu(this.config_map.language_nr);

    $('#tangram-language-select').change(
      this.language_change.bind(this));

    $(this.id_map.menu_dialog).dialog({autoOpen: false});
    $(this.id_map.finished_dialog).dialog({autoOpen: false});

    this.stage_minx = 0;
    this.stage_maxx = this.config_map.stage_width;
    this.stage_miny = 0;
    this.stage_maxy = this.config_map.stage_height;

    // Returns true iff the tan t is visible. It is visible if at
    // least one its vertex is inside visible area. Visible area is a
    // rectangle less than the stage by this.config_map.stage_margin
    // pixels.
    this.isvisible = (function(minx, maxx, miny, maxy) {
      return function(t) {
        var n = t.line.points().length,
            at = t.line.getAbsoluteTransform(),
            i, z;
        for (i = 0; i < n; i += 2) {
          z = at.point({
            x: t.line.points()[i],
            y: t.line.points()[i + 1]
          });
          if (minx <= z.x && z.x <= maxx &&
              miny <= z.y && z.y <= maxy)
            return true;
        }
        return false;
      };
    }(this.stage_minx + this.config_map.stage_margin,
      this.stage_maxx - this.config_map.stage_margin,
      this.stage_miny + this.config_map.stage_margin,
      this.stage_maxy - this.config_map.stage_margin));

    this.shape_formed = false;

    this.stage = new Konva.Stage({
      container: this.id_map.canvas,
      width: this.config_map.stage_width,
      height: this.config_map.stage_height
    });

    this.stage.on('click', this.stage_on_click.bind(this));
    this.control_layer = new Konva.Layer();
    this.shape_layer = new Konva.Layer();
    this.tan_layer = new Konva.Layer();

    this.menu_button = null;
    this.shape = null;
    this.tan_map = {
      t1: null,                 // the first big triangle
      t2: null,                 // the second big triangle
      t3: null,                 // medium triangle
      t4: null,                 // the first small triangle
      t5: null,                 // the second small triangle
      s: null,                  // square
      p: null                   // parallelogram
    };
    this.build_tans();
    this.tan_list = [this.tan_map.t1, this.tan_map.t2,
                     this.tan_map.t3, this.tan_map.t4,
                     this.tan_map.t5, this.tan_map.s,
                     this.tan_map.p];

    this.build_control_layer();
    this.build_shape_layer();
    this.build_tan_layer();

    this.stage.add(this.control_layer);
    this.stage.add(this.shape_layer);
    this.stage.add(this.tan_layer);
    this.stage.draw();
  };

  View.prototype.ID_MAP = {
    canvas: "canvas",
    menu_dialog: "menu-dialog",
    shape_select: "shape-select",
    shape_select_label: "shape-select-label",
    color_select: "color-select",
    color_select_label: "color-select-label",
    language_select: "language-select",
    language_select_label: "language-select-label",
    instruction: "instruction",
    menu_cancel_button: "menu-cancel-button",
    menu_ok_button: "menu-ok-button",
    finished_dialog: "finished-dialog"
  };

  View.prototype.language_change = function() {
    var s = $(this.id_map.shape_select).val(),
        c = $(this.id_map.color_select).val(),
        l = $(this.id_map.language_select).val();
    this.build_menu(l);
    $(this.id_map.shape_select).val(s);
    $(this.id_map.color_select).val(c);
    $(this.id_map.language_select).val(l);
    $(this.id_map.menu_cancel_button).button(
      'option', 'label',
      stringMap.menu_cancel_button[l]);
    $(this.id_map.menu_ok_button).button(
      'option', 'label',
      stringMap.menu_ok_button[l]);
    $(this.id_map.menu_dialog).dialog(
      {title: stringMap.menu_title[l]});
  };

  /*
   * Returns random integer from [a, b).
   */
  View.irand = function(a, b) {
    assert(a < b);
    return Math.floor(a + (b - a) * Math.random());
  };

  View.prototype.build_html = function() {
    var p = this.config_map.container + '-',
        d = this.ID_MAP,
        h = String()
        + '<div id="' + p + d.canvas + '"></div>\n'
        + '<div id="' + p + d.menu_dialog + '">\n'
        + '  <p class="tangram-instruction" id="' + p
        + d.instruction + '"></p>'
        + '  <fieldset class="tangram">\n'
        + '    <label class="tangram" id="' + p + d.shape_select_label
        +      '" for="' + p + d.shape_select + '"></label>\n'
        + '    <select id="' + p + d.shape_select + '"></select>\n'
        + '    <label class="tangram" id="' + p + d.color_select_label
        +      '" for="' + p + d.color_select + '"></label>\n'
        + '    <select id="' + p + d.color_select + '"></select>\n'
        + '    <label class="tangram" id="' + p
        + d.language_select_label
        +      '" for="' + p + d.language_select + '"></label>\n'
        + '    <select id="' + p + d.language_select + '"></select>\n'
        + '  </fieldset>\n'
        + '</div>\n'
        + '<div id="' + p + d.finished_dialog + '"></div>';
    return h;
  };

  /*
   * Sets labels and options for menu select widgets in given
   * language.
   */
  View.prototype.build_menu = function(language_nr) {
    var lnr = language_nr,
        im = this.id_map,
        i, n, a;

    function add(option) {
      a.push('<option value = "' + i + '">' + option + '</option>');
    }

    $(im.instruction).text(stringMap.instruction[lnr]);
    $(im.shape_select_label).text(stringMap.shape_label_text[lnr]);
    $(im.color_select_label).text(stringMap.color_label_text[lnr]);
    $(im.language_select_label).text(
      stringMap.language_label_text[lnr]);

    a = []; n = shapeList.length;
    for (i = 0; i < n; i++)
      add(shapeList[i].name[lnr]);
    $(im.shape_select).empty().append(a);

    a = []; n = colorList.length;
    for (i = 0; i < n; i++)
      add(colorList[i].name[lnr]);
    $(im.color_select).empty().append(a);

    a = []; n = languageList.length;
    for (i = 0; i < n; i++)
      add(languageList[i][lnr]);
    $(im.language_select).empty().append(a);
  };

  View.prototype.build_control_layer = function() {
    var r = 20, c = 'black';

    this.menu_button = new Konva.Text({
      x:          10,
      y:          10,
      text:       '\u2630',
      fontSize:   70,
      fontFamily: 'Times',
      fill:       '#a57b61'});

    this.control_layer.add(
      new Konva.Circle({
        x: this.stage_minx, y: this.stage_miny, radius: r, fill: c}),
      new Konva.Circle({
        x: this.stage_minx, y: this.stage_maxy, radius: r, fill: c}),
      new Konva.Circle({
        x: this.stage_maxx, y: this.stage_maxy, radius: r, fill: c}),
      new Konva.Circle({
        x: this.stage_maxx, y: this.stage_miny, radius: r, fill: c}),
      this.menu_button);
  };

  View.prototype.build_shape_layer = function() {
    var b, dx, dy;
    if (this.shape !== null)
      this.shape.destroy();
    this.shape = new Shape(shapeList[this.config_map.shape_nr],
                           this.config_map.hypotenuse);
    /*
     * Translate each point by (dx, dy) so that the center of the
     * bounding box is in the center of the stage.
     */
    b = this.shape.bounding_box();
    dx = Math.floor(0.5 * ((this.stage_minx + this.stage_maxx) -
                           (b.minx + b.maxx)));
    dy = Math.floor(0.5 * ((this.stage_miny + this.stage_maxy) -
                           (b.miny + b.maxy)));
    this.shape.move({x: dx, y: dy});
    this.shape.update_coordinates();
    this.shape_layer.add(this.shape.pline);
    if (this.shape.hline !== undefined)
      this.shape_layer.add(this.shape.hline);
    this.shape_layer.draw();
  };

  View.prototype.build_tans = function() {
    var c1 = 1 + Math.SQRT2,
        c2 = 1 - Math.SQRT2,
        h = this.config_map.control_margin,
        h1 = 1 - h,
        e1 = this.config_map.hypotenuse / 4,
        e2 = this.config_map.hypotenuse / (2 * Math.SQRT2),
        triangle = {
          vertices: [0, 0, 0, 1, 1, 0],
          control_vertices: [h, h, h, 1 - c1 * h, 1 - c1 * h, h]
        },
        square = {
          vertices: [0, 0, 0, 1, 1, 1, 1, 0],
          control_vertices: [h, h, h, h1, h1, h1, h1, h]
        },
        parallelogram = {
          vertices: [0, 1, 0, 3, 1, 2, 1, 0],
          control_vertices: [h, 1 - c2 * h,
                             h, 3 - c1 * h,
                             h1, 2 + c2 * h,
                             h1, c1 * h]
        },
        c = TANGRAM.settings.colors[this.config_map.colorset_nr];
    this.tan_map.t1 = new Tan(this, 't1', triangle, 2 * e2, c.t1);
    this.tan_map.t2 = new Tan(this, 't2', triangle, 2 * e2, c.t2);
    this.tan_map.t3 = new Tan(this, 't3', triangle, 2 * e1, c.t3);
    this.tan_map.t4 = new Tan(this, 't4', triangle, e2, c.t4);
    this.tan_map.t5 = new Tan(this, 't5', triangle, e2, c.t5);
    this.tan_map.s =  new Tan(this, 's',  square, e2, c.s);
    this.tan_map.p =  new Tan(this, 'p',  parallelogram, e1, c.p);
  };

  /*
   * Scatter all tans randomly on the stage.
   */
  View.prototype.scatter_tans = function() {
    var i, t, n = this.tan_list.length;
    for (i = 0; i < n; i++) {
      t = this.tan_list[i];
      do {
        t.line.position({
          x: View.irand(this.stage_minx, this.stage_maxx),
          y: View.irand(this.stage_miny, this.stage_maxy)});
        t.line.rotate(View.irand(0, 90));
      } while (!this.isvisible(t));
      t.update_coordinates();
    }
  };

  View.prototype.build_tan_layer = function() {
    var i, n = this.tan_list.length;
    this.scatter_tans();
    for (i = 0; i < n; i++)
      this.tan_layer.add(this.tan_list[i].line);
  };

  View.prototype.show_menu_dialog = function() {
    var that = this,
        im = this.id_map,
        cm = this.config_map;

    this.build_menu(cm.language_nr);

    $(im.shape_select).val(cm.shape_nr);
    $(im.color_select).val(cm.colorset_nr);
    $(im.language_select).val(cm.language_nr);

    $(im.menu_dialog).dialog({
      resizable: false,
      modal: true,
      title: stringMap.menu_title[cm.language_nr],
      height: 800,
      width: 800,
      buttons: [
        {
          id: im.menu_cancel_button.substr(1),
          text: stringMap.menu_cancel_button[cm.language_nr],
          click: function() {
            $(this).dialog("close");
          }
        },
        {
          id: im.menu_ok_button.substr(1),
          text: stringMap.menu_ok_button[cm.language_nr],
          click: function() {
            var c, i, n;
            n = +$(im.shape_select).val();
            if ((n !== cm.shape_nr) || that.shape_formed) {
              // start a new game with selected shape
              cm.shape_nr = n;
              that.build_shape_layer();
              that.scatter_tans();
              that.tan_layer.draw();
              n = that.tan_list.length;
              for (i = 0; i < n; i++)
                that.tan_list[i].line.draggable(true);
              that.shape_formed = false;
            }

            n = +$(im.color_select).val();
            if (n !== cm.colorset_nr) {
              // change colorset
              cm.colorset_nr = n;
              c = TANGRAM.settings.colors[cm.colorset_nr];
              that.tan_map.t1.line.fill(c.t1);
              that.tan_map.t2.line.fill(c.t2);
              that.tan_map.t3.line.fill(c.t3);
              that.tan_map.t4.line.fill(c.t4);
              that.tan_map.t5.line.fill(c.t5);
              that.tan_map.s.line.fill(c.s);
              that.tan_map.p.line.fill(c.p);
              that.tan_layer.draw();
            }
            n = +$(im.language_select).val();
            cm.language_nr = n;
            $(this).dialog("close");
          }
        }
      ],
    });
    $(im.menu_dialog).dialog('open');
  };

  View.prototype.check_finish = function(t) {
    var tt = this.tan_list,
        n = tt.length,
        i, j, intersect, inside, t1;

    assert(t.line.hasName('tan'));

    t.update_coordinates();
    console.log('Outside shape:');
    for (i = 0; i < n; i++) {
      inside = polyinpoly(tt[i].coordinates, this.shape.pcoordinates,
                          this.shape.hcoordinates);
      if (!inside)
        console.log(tt[i].line.name());
    }
    console.log('Intersect:');
    for (i = 0; i < n; i++) {
      for (j = i + 1; j < n; j++) {
        intersect = polygons_intersect(tt[i].coordinates,
                                       tt[j].coordinates);
        if (intersect)
          console.log(tt[i].line.name(), tt[j].line.name());
      }
    }
    for (i = 0; i < n; i++) {
      t1 = tt[i].coordinates;
      if (!polyinpoly(t1, this.shape.pcoordinates,
                      this.shape.hcoordinates))
        return;
      for (j = i + 1; j < n; j++)
        if (polygons_intersect(t1, tt[j].coordinates))
          return;
    }

    this.stage.find('Transformer').destroy();
    for (i = 0; i < n; i++)
      tt[i].line.draggable(false);
    this.tan_layer.draw();
    this.shape_formed = true;
    this.show_finished_dialog();
  };

  View.prototype.stage_on_click = function(e) {
    var t = e.target,
        tl = this.tan_list,
        n = tl.length,
        i, tr;

    console.log('In stage_on_click');
    if (this.shape_formed) {
      if (t === this.menu_button)
        this.show_menu_dialog();
      return;
    }
    for (i = 0; i < n; i++)
      if (tl[i].line.transform)
        break;
    if (i < n) {
      // The tan tl[i] has been transformed.
      tl[i].transform = false;
      this.stage.find('Transformer').destroy();
      this.tan_layer.draw();
      this.check_finish(tl[i]);
    }
    if (t === this.menu_button) {
      this.show_menu_dialog();
      return;
    }
    for (i = 0; i < n; i++)
      if (tl[i].line === t)
        break;
    if (i >= n)
      return;
    tr = new Konva.Transformer({resizeEnabled: false});
    this.tan_layer.add(tr);
    tr.attachTo(t);
    t.transform = true;
    t.moveToTop();
    this.tan_layer.draw();
  };

  View.prototype.show_finished_dialog = function() {
    var lnr = this.config_map.language_nr;

    $(this.id_map.finished_dialog).dialog({
      modal: true,
      title: stringMap.finished_dialog_title[lnr],
      buttons: [
        {
          text: stringMap.finished_dialog_ok_button[lnr],
          click: function() {
            $(this).dialog("close");
          }
        }
      ],
    });
    $(this.id_map.finished_dialog).html(
      '<p>' + stringMap.finished_dialog_message[lnr] + '</p>');
    $(this.id_map.finished_dialog).dialog('open');
  };

  return {
    View: View
  };

}());
