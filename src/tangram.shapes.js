var TANGRAM = TANGRAM || {};

TANGRAM.shapes = (function() {
  "use strict";

  var sqr = TANGRAM.utils.sqr,
      initModule,
      shapeList,
      sinpi8 = (1 / 2) * Math.sqrt(2 - Math.SQRT2),
      cospi8 = (1 / 2) * Math.sqrt(2 + Math.SQRT2);

  /*
   * Returns polygon for the sailboat shape.
   */
  function sailboat_polygon() {
    // Parameters:
    //
    // alpha - the angle between the lower edge of the big sail and
    // the level of the hull
    //
    // beta - the angle between the lower edge of the small sail and
    // the level of the hull
    //
    // x1 - x-coordinate of the leftmost point of the hull, there must
    // be x5 - (3 / 4) * Math.SQRT2 < x1 < ca
    //
    // The picture is made so that sails have one common point. x5 is
    // the point where the small sail touches the hull.
    var alpha = Math.PI / 32,
        beta = Math.PI / 64,
        sa = Math.sin(alpha),
        ca = Math.cos(alpha),
        sb = Math.sin(beta),
        cb = Math.cos(beta),
        x1 = 0.3,
        y1 = ca,
        x5 = sqr(ca) + (1 / 2) * Math.SQRT2 * (sb + sa * cb);
    return [
      x1, y1,
      x1 + (1 / 4) * Math.SQRT2, y1 + (1 / 4) * Math.SQRT2,
      x1 + (1 / 2) * Math.SQRT2, y1 + (1 / 4) * Math.SQRT2,
      x1 + (3 / 4) * Math.SQRT2, y1,
      x5, y1,
      x5 + (1 / 2) * Math.SQRT2 * cb, y1 - (1 / 2) * Math.SQRT2 * sb,
      x5 - (1 / 2) * Math.SQRT2 * sb, y1 - (1 / 2) * Math.SQRT2 * cb,
      x5, y1,
      ca, y1,
      ca + sa, 0,
      0, y1 - sa,
      ca, y1
    ];
  }

  /*
   * Shapes should be given in such a way that the upper left corner
   * of the bounding box (ie. minimum bounding rectangle) has
   * coordinates (0, 0) and the length of the hypotenuse of the
   * biggest triangle is 1.
   */
  shapeList = [
    {
      name: ["Square", "Kwadrat"],
      date: "01.05.2018",
      source: "egs, ryc. 1",
      polygon: [1, 0, 0, 0, 0, 1, 1, 1]
    },
    {
      name: ["Bird", "Ptak"],
      date: "02.05.2018",
      source: "?",
      polygon: [
        3 / 4, 0,
        3 / 4, 1 / 2,
        1 / 2, 1 / 4,
        0, 3 / 4,
        1 - (3 / 8) * Math.SQRT2, 3 / 4,
        1 - (1 / 8) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 + (1 / 8) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 + (3 / 8) * Math.SQRT2, 3 / 4,
        2, 3 / 4,
        3 / 2, 1 / 4,
        5 / 4, 1 / 2,
        5 / 4, 0,
        1, 1 / 4
      ]
    },
    {
      name: ["Triangle", "Trójkąt"],
      date: "02.05.2018",
      source: "egs, ryc. 3, poz. 1",
      polygon: [0, 1, 2, 1, 1, 0]
    },
    {
      name: ["Letter S", "Litera S"],
      date: "18.05.2018",
      source: "egs, ryc. 2, poz. 1",
      polygon: [
        0, 0,
        0, 3 / 2,
        1 / 2, 3 / 2,
        1 / 2, 3 / 2 + (1 / 4) * Math.SQRT2,
        1 / 2 - (1 / 4) * Math.SQRT2, 3 / 2 + (1 / 4) * Math.SQRT2,
        1 / 2 - (1 / 4) * Math.SQRT2, 3 / 2 + (1 / 2) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 3 / 2 + (1 / 2) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 3 / 2,
        1 / 2, 3 / 2,
        0, 1,
        1, 1
      ]
    },
    {
      name: ["Kite", "Latawiec"],
      date: "20.05.2018",
      source: "egs, ryc. 2, poz. 2",
      polygon: [
        0, 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 4, 1 / 2 + (1 / 2) * Math.SQRT2,
        1 / 2, 1 / 4 + (1 / 2) * Math.SQRT2,
        3 / 4, 1 / 2 + (1 / 2) * Math.SQRT2,
        5 / 4 - (1 / 2) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        5 / 4 - (1 / 2) * Math.SQRT2, 1 / 2 + Math.SQRT2,
        3 / 2, (1 / 4) + (1 / 2) * Math.SQRT2,
        5 / 4 - (1 / 2) * Math.SQRT2, 0,
        5 / 4 - (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        3 / 4, (1 / 2) * Math.SQRT2,
        1 / 2, 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 4, (1 / 2) * Math.SQRT2
      ]
    },
    {
      // Wypukle, wzor 2 obrocony
      name: ["Hexagon", "Szieściokąt"],
      date: "22.05.2018",
      source: "Wikipedia",
      polygon: [
        0, 0,
        0, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 0
      ]
    },
    {
      // Wypukle, wzor 3 obrocony
      name: ["Trapezoid", "Trapez"],
      date: "22.05.2018",
      source: "Wikipedia",
      polygon: [
        (1 / 2) * Math.SQRT2, 0,
        0, (1 / 2) * Math.SQRT2,
        (3 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, 0
      ]
    },
    {
      name: ["Cat", "Kot"],
      date: "26.05.2018",
      source: "egs, ryc. 2, poz. 9",
      polygon: [
        0, 0,
        0, 1 / 2,
        1/ 4, 3 / 4,
        1 / 2 - (1 / 4) * Math.SQRT2, 1 / 2 + (1 / 4) * Math.SQRT2,
        1 / 2, 1 / 2 + (1 / 2) * Math.SQRT2,
        1 / 2, 3 / 2,
        1 - (1 / 2) * Math.SQRT2, 1 + (1 / 2) * Math.SQRT2,
        1, 1 + (1 / 2) * Math.SQRT2,
        1 + (1 / 4) * Math.SQRT2, 1 + (1 / 2) * Math.SQRT2,
        1 + (1 / 2) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        1 + (1 / 4) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        1, 1 + (1 / 2) * Math.SQRT2,
        1, 1,
        1 / 2, 1 / 2,
        1 / 2, 0,
        1 /4, 1 / 4
      ]
    },
    {
      // Wypukle, wzor 4 obrocony
      name: ["Parallelogram", "Równoległobok"],
      date: "28.05.2018",
      source: "Wikipedia",
      polygon: [
        (1 / 2) * Math.SQRT2, 0,
        0, (1 / 2) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        (3 / 2) * Math.SQRT2, 0
      ]
    },
    {
      // Wypukle, wzor 5 obrocony
      name: ["Trapezoid", "Trapez"],
      date: "28.05.2018",
      source: "Wikipedia",
      polygon: [
        0, 0,
        0, (1 / 2) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (5 / 4) * Math.SQRT2, 0
      ]
    },
    {
      // Wypukle, wzor 6 obrocony
      name: ["Quadrilateral", "Czworokąt"],
      date: "28.05.2018",
      source: "Wikipedia",
      polygon: [
        0, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (5 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 0
      ]
    },
    {
      name: ["‘Square’ with a hole", "Dziurawy „kwadrat”"],
      date: "28.05.2018",
      source:
      "http://www.archimedes-lab.org/tangramagicus/pagetang1.html",
      polygon: [
        0, 0,
        0, 1,
        (3 / 4) * Math.SQRT2, 1,
        (3 / 4) * Math.SQRT2, 0
      ],
      hole: [
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        1 / 2, 1 / 2,
        (1 / 4) * Math.SQRT2, 1 - (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1 - (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2 - 1 / 2, 1 / 2,
        (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2
      ]
    },
    {
      name: ["Letter A", "Litera A"],
      date: "06.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, (3 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (5 / 8) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (5 / 8) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (5 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, 0,
        (1 / 2) * Math.SQRT2, 0,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2
      ],
      hole: [
        (1 / 2) * Math.SQRT2, (3 / 8) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (3 / 8) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2
      ]
    },
    {
      name: ["Letter B", "Litera B"],
      date: "07.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, Math.SQRT2,
        (1 / 2) * Math.SQRT2, Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, Math.SQRT2 - 1 / 4,
        5 / 4 - (1 / 4) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        5 / 4 - (1 / 4) * Math.SQRT2, 1 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 4) * Math.SQRT2, 1 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 4,
        (1 / 2) * Math.SQRT2, 0
      ],
      hole: [
        1 / 4, (1 / 2) * Math.SQRT2 - 1 / 4,
        1 / 4, (1 / 2) * Math.SQRT2 + 1 / 4,
        (1 / 2) * Math.SQRT2 - 1 / 4, Math.SQRT2 - 1 / 4,
        (1 / 2) * Math.SQRT2, Math.SQRT2 - 1 / 2,
        3 / 4 - (1 / 4) * Math.SQRT2, 1 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4, 1 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 4) * Math.SQRT2, 1 / 4,
        (1 / 2) * Math.SQRT2 - 1 / 4, 1 / 4
      ]
    },
    {
      name: ["Letter C", "Litera C"],
      date: "07.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, Math.SQRT2,
        (3 / 4) * Math.SQRT2, Math.SQRT2,
        (3 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, 0
      ]
    },
    {
      name: ["Letter D", "Litera D"],
      date: "07.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, Math.SQRT2,
        (1 / 2) * Math.SQRT2, Math.SQRT2,
        1 - (1 / 4) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        5 / 4 - (1 / 4) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 4,
        (1 / 2) * Math.SQRT2, 0
      ],
      hole: [
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        3 / 4 - (1 / 4) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 4) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1,
        (1 / 2) * Math.SQRT2, 1 / 2,
        (1 / 2) * Math.SQRT2 - 1 / 4, 1 / 4
      ]
    },
    {
      name: ["Letter E", "Litera E"],
      date: "08.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, Math.SQRT2,
        (3 / 4) * Math.SQRT2, Math.SQRT2,
        (1 / 2) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (5 / 8) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (5 / 8) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (3 / 8) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 8) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, 0
      ]
    },
    {
      name: ["Letter F", "Litera F"],
      date: "08.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, 1 + (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, 1 + (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        1 / 2, 1 / 2 + (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, 0
      ]
    },
    {
      name: ["Letter G", "Litera G"],
      date: "08.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 1 / 4,
        0, 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 2, 3 / 4 + (1 / 2) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 3 / 4 + (1 / 2) * Math.SQRT2,
        3 / 4 + (1 / 4) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        3 / 4 + (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        1 / 4 + (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 / 2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 / 2, (1 / 2) * Math.SQRT2 - 1 / 4,
        (1 / 2) * Math.SQRT2, 1 / 4,
        1, 1 / 4,
        3 / 4, 0,
        1 / 4, 0
      ]
    },
    {
      name: ["Letter H", "Litera H"],
      date: "09.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, Math.SQRT2,
        (3 / 4) * Math.SQRT2, 0,
        (1 / 2) * Math.SQRT2, 0,
        (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, 0
      ]
    },
    {
      name: ["Letter I", "Litera I"],
      date: "09.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        1 / 2 - (1 / 4) * Math.SQRT2, 1 / 2 - (1 / 4) * Math.SQRT2,
        1 / 2 - (1 / 4) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        0, 1 + (1 / 4) * Math.SQRT2,
        1, 1 + (1 / 4) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 1 / 2 - (1 / 4) * Math.SQRT2,
        1, 0
      ]
    },
    {
      name: ["Letter J", "Litera J"],
      date: "09.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, Math.SQRT2,
        1 / 2, 1 / 2 + Math.SQRT2,
        1, Math.SQRT2,
        1, (1 / 4) * Math.SQRT2,
        1 + (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        1 + (1 / 4) * Math.SQRT2, 0,
        1 - (1 / 2) * Math.SQRT2, 0,
        1 - (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        1 - (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        1 - (1 / 4) * Math.SQRT2, Math.SQRT2
      ]
    },
    {
      name: ["Letter K", "Litera K"],
      date: "09.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      // I assume the angle pi / 8 between the arms.
      polygon: [
        0, 0,
        0, Math.SQRT2,
        (1 / 4) * Math.SQRT2, Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2 + cospi8, (1 / 2) * Math.SQRT2 - sinpi8,
        (1 / 4) * Math.SQRT2 + (1 / 2) * Math.SQRT2 * sinpi8,
        (1 / 2) * Math.SQRT2 - (1 / 2) * Math.SQRT2 * cospi8,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, 0
      ]
    },
    {
      name: ["Letter L", "Litera L"],
      date: "13.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        1 / 2 - (1 / 4) * Math.SQRT2, 0,
        1 / 2 - (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        0, 1 / 2 + (1 / 2) * Math.SQRT2,
        1 / 2 - (1 / 4) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        1 / 2 - (1 / 4) * Math.SQRT2, 1 + (3 / 4) * Math.SQRT2,
        1 + (1 / 4) * Math.SQRT2, 1 + (3 / 4) * Math.SQRT2,
        5 / 4 + (1 / 4) * Math.SQRT2, 3 / 4 + (3 / 4) * Math.SQRT2,
        1 / 4 + (1 / 4) * Math.SQRT2, 3 / 4 + (3 / 4) * Math.SQRT2,
        1 / 2, 1 + (1 / 2) * Math.SQRT2,
        1 / 2, 0
      ]
    },
    {
      name: ["Letter M", "Litera M"],
      date: "13.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        Math.SQRT2, Math.SQRT2,
        Math.SQRT2, 0,
        (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2
      ]
    },
    {
      name: ["Letter N", "Litera N"],
      date: "13.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, 1,
        1 / 2, 1 / 2,
        1, 1,
        3 / 2, 1,
        3 / 2, 0,
        1, 1 / 2,
        1 / 2, 0
      ]
    },
    {
      name: ["Letter O", "Litera O"],
      date: "13.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, 1 / 2 + (1 / 2) * Math.SQRT2,
        1 / 4, 3 / 4 + (1 / 2) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 3 / 4 + (1 / 2) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 4,
        (1 / 2) * Math.SQRT2, 0
      ],
      hole: [
        1 / 4 , 1 / 2 * Math.SQRT2 - 1 / 4,
        1 / 4, 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 2, 1 / 2 + (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1,
        (1 / 2) * Math.SQRT2, 1 / 2,
        (1 / 2) * Math.SQRT2 - 1 / 4, 1 / 4
      ]
    },
    {
      name: ["Letter P", "Litera P"],
      date: "13.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, (5 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (5 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        1 / 4, 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 4,
        (1 / 2) * Math.SQRT2, 0
      ],
      // Can it be made without the hole?
      hole: [
        1 / 4, (1 / 2) * Math.SQRT2 - 1 / 4,
        1 / 4, 1 / 4 + (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1 / 2,
        (1 / 2) * Math.SQRT2 - 1 / 4, 1 / 4
      ]
    },
    {
      name: ["Letter Q", "Litera Q"],
      date: "13.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 1 / 4,
        0, 1 / 4 + (3 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1 / 4 + (3 / 4) * Math.SQRT2,
        (5 / 8) * Math.SQRT2, 1 / 4 + (7 / 8) * Math.SQRT2,
        (7 / 8) * Math.SQRT2, 1 / 4 + (7 / 8) * Math.SQRT2,
        (5 / 8) * Math.SQRT2, 1 / 4 + (5 / 8) * Math.SQRT2,
        (5 / 8) * Math.SQRT2, 1 / 4 + (3 / 8) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 0,
        1 / 4, 0
      ],
      hole: [
        1 / 4, 1 / 2,
        (1 / 4) * Math.SQRT2, 1 / 4 + (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, 1 / 4 + (1 / 2) * Math.SQRT2,
        (3 / 8) * Math.SQRT2, 1 / 4 + (5 / 8) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1 / 4 + (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, - 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 2, 1 / 4
      ]
    },
    {
      name: ["Letter R", "Litera R"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, Math.SQRT2,
        (1 / 2) * Math.SQRT2, Math.SQRT2,
        1 / 4, 1 / 4 + (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2 - 1 / 4, 3 / 4,
        1 / 4 + (1 / 4) * Math.SQRT2, 3 / 4,
        1 / 4 + (1 / 4) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 3 / 4 + (1 / 2) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 4) * Math.SQRT2, 3 / 4,
        1 / 4 + (1 / 2) * Math.SQRT2, 3 / 4,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 4,
        (1 / 2) * Math.SQRT2, 0
      ],
      hole: [
        (1 / 2) * Math.SQRT2 - 1 / 4, 1 / 4,
        1 / 4, - 1 / 4 + (1 / 2) * Math.SQRT2,
        1 / 2, (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1 / 2
      ]
    },
    {
      name: ["Letter S", "Litera S"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 1 / 2,
        1 / 2 + (1 / 4) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 2 - (1 / 4) * Math.SQRT2,
        1 / 2 - (1 / 4) * Math.SQRT2, 2 - (1 / 4) * Math.SQRT2,
        1 / 2, 2,
        1 / 2 + (1 / 4) * Math.SQRT2, 2,
        1 + (1 / 4) * Math.SQRT2, 3 / 2,
        1 / 2, 1 - (1 / 4) * Math.SQRT2,
        1 / 2, (1 / 4) * Math.SQRT2,
        1 / 2 + (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 0,
        1 / 2, 0
      ]
    },
    {
      name: ["Letter T", "Litera T"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 8) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 8) * Math.SQRT2, Math.SQRT2,
        (5 / 8) * Math.SQRT2, Math.SQRT2,
        (5 / 8) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, 0
      ]
    },
    {
      name: ["Letter U", "Litera U"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, 0,
        (3 / 4) * Math.SQRT2, 0,
        (3 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, 0
      ]
    },
    {
      name: ["Letter V", "Litera V"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, 0,
        (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2
      ]
    },
    {
      name: ["Letter W", "Litera W"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        (3 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        Math.SQRT2, (3 / 4) * Math.SQRT2,
        (7 / 4) * Math.SQRT2, 0,
        (5 / 4) * Math.SQRT2, 0,
        (5 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, 0,
        (3 / 4) * Math.SQRT2, 0,
        (3 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 0
      ]
    },
    {
      name: ["Letter X", "Litera X"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        0, Math.SQRT2,
        0, (5 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (5 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, Math.SQRT2,
        (1 / 2) * Math.SQRT2, Math.SQRT2,
        (1 / 2) * Math.SQRT2, (5 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (5 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, Math.SQRT2,
        (1 / 2) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, 0,
        (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2
      ]
    },
    {
      name: ["Letter Y", "Litera Y"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        0, 0,
        0, (1 / 2) * Math.SQRT2,
        (1 / 8) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (3 / 8) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (3 / 8) * Math.SQRT2, (5 / 4) * Math.SQRT2,
        (5 / 8) * Math.SQRT2, (5 / 4) * Math.SQRT2,
        (5 / 8) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (7 / 8) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, 0,
        (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2
      ]
    },
    {
      name: ["Letter Z", "Litera Z"],
      date: "16.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit",
      polygon: [
        1 / 4, (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1 / 4 + (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 3 / 4,
        0, 3 / 4 + (1 / 2) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, 3 / 4 + (1 / 2) * Math.SQRT2,
        Math.SQRT2, 3 / 4 + (1 / 4 ) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 3 / 4 + (1 / 4 ) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 2 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        1 / 4 + Math.SQRT2, 0,
        1 / 4 + (1 / 4) * Math.SQRT2, 0
      ]
    },
    {
      // wypukle, wz. 8 obrocony
      name: ["Convex 8", "Wypukły 8"],
      date: "19.06.2018",
      source: "Wikipedia",
      polygon: [
        0, (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        (5 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        Math.SQRT2, 0,
        (1 / 4) * Math.SQRT2, 0
      ]
    },
    {
      // wypukle, wz. 9
      name: ["Convex 9", "Wypukły 9"],
      date: "19.06.2018",
      source: "Wikipedia",
      polygon: [
        0, 0,
        0, (1 / 2) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        Math.SQRT2, 0
      ]
    },
    {
      // wypukle, wz. 10, pieciokat
      name: ["Convex 10", "Wypukły 10"],
      date: "19.06.2018",
      source: "Wikipedia",
      polygon: [
        0, 0,
        0, 1 / 2,
        1 / 4, 3 / 4,
        7 / 4, 3 / 4,
        1, 0
      ]
    },
    {
      // wypukle, wz. 11
      name: ["Convex 11", "Wypukły 11"],
      date: "19.06.2018",
      source: "Wikipedia",
      polygon: [
        0, (1 / 2) * Math.SQRT2,
        0, (3 / 4) * Math.SQRT2,
        Math.SQRT2, (3 / 4) * Math.SQRT2,
        Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 0
      ]
    },
    {
      // wypukle, wz. 12
      name: ["Convex 12", "Wypukły 12"],
      date: "19.06.2018",
      source: "Wikipedia",
      polygon: [
        0, (1 / 4) * Math.SQRT2,
        0, (3 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (3 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 0,
        (1 / 4) * Math.SQRT2, 0
      ]
    },
    {
      // wypukle, wz. 13, obrocony
      name: ["Convex 13", "Wypukły 13"],
      date: "19.06.2018",
      source: "Wikipedia",
      polygon: [
        0, 1 / 2,
        1 / 4, 3 / 4,
        5 / 4, 3 / 4,
        7 / 4, 1 / 4,
        3 / 2, 0,
        1 / 2, 0
      ]
    },
    {
      // przy literze H
      name: ["House", "Domek"],
      date: "19.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit, p. 28",
      polygon: [
        0, (1 / 2) * Math.SQRT2,
        (1 / 8) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        (1 / 8) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        1 + (1 / 8) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        1 + (1 / 8) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        1 + (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, (1 / 2) * Math.SQRT2 - 1 / 2,
        (1 / 2) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 0,
        (1 / 4) * Math.SQRT2, 0,
        (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2
      ]
    },
    {
      name: ["Undershirt", "Podkoszulek"],
      date: "19.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit, p. 32",
      polygon: [
        0, 1 - (1 / 2) * Math.SQRT2,
        1 / 4, 5 / 4 - (1 / 2) * Math.SQRT2,
        1 / 4, 5 / 4,
        1 - (1 / 2) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        1, 1 / 2 + (1 / 2) * Math.SQRT2,
        1, 1 / 2,
        5 / 4, 1 / 4,
        1, 0,
        1 / 4 + (1 / 2) * Math.SQRT2, 3 / 4 - (1 / 2) * Math.SQRT2,
        1 / 4, 3 / 4 - (1 / 2) * Math.SQRT2
      ]
    },
    {
      name: ["Camel", "Wielbłąd"],
      date: "19.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit, p. 27",
      polygon: [
        0, 3 / 4,
        0, 3 / 4 + (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2 - 1 / 4, 1,
        1 / 4 + (1 / 2) * Math.SQRT2, 3 / 2,
        1 / 4 + (1 / 2) * Math.SQRT2, 1,
        1 / 2 + (1 / 2) * Math.SQRT2, 3 / 4,
        1 / 2 + (1 / 2) * Math.SQRT2, 1 / 4,
        3 / 4 + (1 / 2) * Math.SQRT2, 0,
        1 / 4 + (1 / 2) * Math.SQRT2, 0,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 2,
        (1 / 2) * Math.SQRT2, 1 / 4,
        (1 / 2) * Math.SQRT2 - 1 / 4, 1 / 2,
        (1 / 4) * Math.SQRT2, 3 / 4 - (1 / 4) * Math.SQRT2
      ]
    },
    {
      name: ["Sailboat", "Żaglówka"],
      date: "22.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit, p. 31",
      polygon: sailboat_polygon()
    },
    {
      name: ["Dog", "Pies"],
      date: "22.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit, p. 27",
      polygon: [
        0, 1 / 2,
        1 / 4, 3 / 4,
        1 / 2, 1 / 2,
        1 / 2, 1,
        1 / 2 - (1 / 4) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        1 / 2, 1 + (1 / 4) * Math.SQRT2,
        1 / 2 + (1 / 4) * Math.SQRT2, 1,
        1 + (1 / 2) * Math.SQRT2, 1,
        1 + (1 / 2) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        5 / 4 + (1 / 2) * Math.SQRT2, 3 / 4 + (1 / 4) * Math.SQRT2,
        1 + (1 / 2) * Math.SQRT2, 1 / 2 + (1 / 4) * Math.SQRT2,
        1 + (1 / 2) * Math.SQRT2, 1 - (1 / 2) * Math.SQRT2,
        3 / 2, 1 / 2,
        1 / 2, 1 / 2,
        1 / 4, 1 / 4,
        3 / 4, 1 / 4,
        1 / 2, 0
      ]
    },
    {
      name: ["Iron", "Żelazko"],
      date: "22.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit, p. 29",
      polygon: [
        0, 1 / 4,
        1 / 4, 1 / 2,
        1 / 4, 1,
        7 / 4, 1,
        3 / 4 + (1 / 4) * Math.SQRT2, (1 / 4) * Math.SQRT2,
        3 / 4 + (1 / 4) * Math.SQRT2, 0,
        1 / 4, 0
      ],
      hole: [
        1 / 4, 1 / 2,
        3 / 4, 1 / 2,
        1, 1 / 4,
        1 / 2, 1 / 4
      ]
    },
    {
      name: ["Parrot", "Papuga"],
      date: "22.06.2018",
      source: "Susan Johnston, Tangrams. ABC Kit, p. 30",
      polygon: [
        0, 1 / 4,
        0, 1 / 4 + (1 / 4) * Math.SQRT2,
        (1 / 4) * Math.SQRT2, 1 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4, 1 / 2,
        (1 / 4) * Math.SQRT2, 1 / 2,
        (1 / 4) * Math.SQRT2, 1 / 2 + (1 / 4) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        (1 / 2) * Math.SQRT2, 3 / 2 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 7 / 4 + (1 / 4) * Math.SQRT2,
        1 / 4 + (1 / 2) * Math.SQRT2, 5 / 4 + (1 / 4) * Math.SQRT2,
        1 / 2 + (1 / 2) * Math.SQRT2, 1 + (1 / 4) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, 1 / 2 + (1 / 2) * Math.SQRT2,
        (3 / 4) * Math.SQRT2, 1 / 2,
        1 / 4 + (1 / 2) * Math.SQRT2, 1 / 2,
        1 / 4 + (1 / 4) * Math.SQRT2, 1 / 2 - (1 / 4) * Math.SQRT2,
        1 / 2, 1 / 4,
        1 / 4, 0
      ]
    }
  ];

  initModule = function() {};

  return {
    initModule: initModule,
    shapeList: shapeList
  };

}());
