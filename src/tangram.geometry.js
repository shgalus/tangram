var TANGRAM = TANGRAM || {};

TANGRAM.geometry = (function() {
  "use strict";

  var assert, Point, toPoints, segsegint,
      convex_polygons_intersect, cpicp, polyinpoly, polyoutpoly,
      pipwh, pipw1h, inpoly;
  var EPS = 4 * Number.MIN_VALUE;

  assert = function(condition, message) {
    if (!condition)
      throw new Error(message || "Assertion failed");
  };

  Point = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Point.prototype.equals = function(p) {
    return Math.abs(this.x - p.x) < EPS &&
      Math.abs(this.y - p.y) < EPS;
  };

  Point.prototype.assign = function(p) {
    this.x = p.x;
    this.y = p.y;
  };

  /*
   * [x1, y1, ..., xn, yn] --> [(x1, y1), ..., (xn, yn)]
   */
  toPoints = function(a) {
    assert(Array.isArray(a));
    assert(a.length % 2 === 0);
    var n = a.length / 2,
        b = new Array(n),
        i, j;
    for (i = 0, j = 0; i < n; i++, j += 2)
      b[i] = new Point(a[j], a[j + 1]);
    return b;
  };

  /*
   * Finds the point of intersection p between two closed segments ab
   * and cd. Returns p and a char with the following meaning:
   *    'e': The segments collinearly overlap, sharing a point.
   *    'v': An endpoint (vertex) of one segment is on the other
   *         segment, but 'e' doesn't hold.
   *    '1': The segments intersect properly (i.e., they share a point
   *         and neither 'v' nor 'e' holds).
   *    '0': The segments do not intersect (i.e., they share no
   *         points).
   * Note that two collinear segments that share just one point, an
   * endpoint of each, returns 'e' rather than 'v' as one might
   * expect.
   *
   * Source: Joseph O'Rourke, Computational geometry in C, second
   * edition, section 7.2.
   *
   * Source code available in April 2018 at
   * http://cs.smith.edu/~jorourke/CGCode/SecondEdition/Ccode2.tar.gz,
   * http://cs.smith.edu/~jorourke/books/ftp.html.
   */
  segsegint = function(a, b, c, d, p) {

    /** Handles the case when segments are parallel. */
    function parallelint(a, b, c, d, p) {

      /** Returns true iff a, b, c are collinear. */
      function collinear(a, b, c) {
        /** area2 is doubled signed area of the triangle abc. */
        var area2 =
            (b.x - a.x) * (c.y - a.y) -
            (c.x - a.x) * (b.y - a.y);
        return Math.abs(area2) < EPS;
      }

      /** Returns true iff c lies on the closed segment ab. Assumes
          that a, b, c are collinear. */
      function between(a, b, c) {
        if (a.x !== b.x)
          return a.x <= c.x && c.x <= b.x ||
          b.x <= c.x && c.x <= a.x;
        else
          return a.y <= c.y && c.y <= b.y ||
          b.y <= c.y && c.y <= a.y;
      }

      if (!collinear(a, b, c))
        return '0';
      if (between(a, b, c)) {
        p.assign(c);
        return 'e';
      }
      if (between(a, b, d)) {
        p.assign(d);
        return 'e';
      }
      if (between(c, d, a)) {
        p.assign(a);
        return 'e';
      }
      if (between(c, d, b)) {
        p.assign(b);
        return 'e';
      }
      return '0';
    }

    var s, t, num, denom, code;

    denom =
      a.x * (d.y - c.y) +
      b.x * (c.y - d.y) +
      c.x * (a.y - b.y) +
      d.x * (b.y - a.y);
    if (denom === 0)
      return parallelint(a, b, c, d, p);
    num =
      a.x * (d.y - c.y) +
      c.x * (a.y - d.y) +
      d.x * (c.y - a.y);
    if (num === 0 || num === denom)
      code = 'v';
    s = num / denom;
    num =
      a.x * (b.y - c.y) +
      b.x * (c.y - a.y) +
      c.x * (a.y - b.y);
    if (num === 0 || num === denom)
      code = 'v';
    t = num / denom;
    if (0.0 < s && s < 1.0 &&
        0.0 < t && t < 1.0)
      code = '1';
    else if (0.0 > s || s > 1.0 ||
             0.0 > t || t > 1.0)
      code = '0';
    p.x = a.x + s * (b.x - a.x);
    p.y = a.y + s * (b.y - a.y);
    return code;
  };

  /*
   * Returns true iff the convex closed polygons a and b have
   * non-empty intersection. a and b must be arrays of elements of
   * type Point, which contain consecutive vertices of the polygons.
   *
   * a = [p1, ..., pm], b = [p1, ..., pn]
   */
  convex_polygons_intersect = function(a, b) {
    var m = a.length,
        n = b.length,
        p = new Point(),
        i, j, sa, sb, sc, sd;

    /** Check if any pair of edges has non-empty intersection. If so,
        the polygons intersect. */
    for (i = 0; i < m; i++) {
      sa = a[i];
      sb = i + 1 < m ? a[i + 1] : a[0];
      for (j = 0; j < n; j++) {
        sc = b[j];
        sd = j + 1 < n ? b[j + 1] : b[0];
        if (segsegint(sa, sb, sc, sd, p) !== '0')
          return true;
      }
    }
    /** The edges do not cross. The polygons are either disjoint or
        one includes the other. */
    return inpoly(b[0], a) !== 'o' || inpoly(a[0], b) !== 'o';
  };

  /*
   * Returns true if a convex polygon a is inside a convex polygon b.
   */
  cpicp = function(a, b) {
    var n = a.length, i;
    /*
     * Check if each vertex a[i] of the polygon a belongs to the
     * polygon b.
     */
    for (i = 0; i < n; i++)
      if (inpoly(a[i], b) === 'o')
        return false;
    return true;
  };

  /*
   * Returns true if polygon a is inside polygon b.
   */
  polyinpoly = function(a, b) {
    var m = a.length,
        n = b.length,
        p = new Point(),
        i, j, sa, sb, sc, sd;

    /** Check if any pair of edges intersects properly. If so, a is
        not inside b. */
    for (i = 0; i < m; i++) {
      sa = a[i];
      sb = i + 1 < m ? a[i + 1] : a[0];
      for (j = 0; j < n; j++) {
        sc = b[j];
        sd = j + 1 < n ? b[j + 1] : b[0];
        if (segsegint(sa, sb, sc, sd, p) === '1')
          return false;
      }
    }
    /** The edges do not cross. a is inside b iff a[0] is inside b. */
    return inpoly(a[0], b) !== 'o';
  };

  /*
   * Returns true if polygon a is outside polygon b.
   */
  polyoutpoly = function(a, b) {
    var m = a.length,
        n = b.length,
        p = new Point(),
        i, j, sa, sb, sc, sd;

    /** Check if any pair of edges intersects properly. If so, a is
        not outside b. */
    for (i = 0; i < m; i++) {
      sa = a[i];
      sb = i + 1 < m ? a[i + 1] : a[0];
      for (j = 0; j < n; j++) {
        sc = b[j];
        sd = j + 1 < n ? b[j + 1] : b[0];
        if (segsegint(sa, sb, sc, sd, p) === '1')
          return false;
      }
    }
    /** The edges do not cross. a is outside b iff a[0] is outside
        b. */
    return inpoly(a[0], b) !== 'i';
  };

  /*
   * pipwh (polygon inside polygon with holes) returns true if a
   * polygon a is inside polygon b. Polygon b may have holes which are
   * polygons inside b.
   */
  pipwh = function(a, b, h) {
    var i, n;
    if (!polyinpoly(a, b))
      return false;
    if (h === undefined || (n = h.length) === 0)
      return true;      // there is no holes
    for (i = 0; i < n; i++)
      if (!polyoutpoly(a, h[i]))
        return false;
    return true;
  };

  /* as pipwh but with at most 1 hole */
  pipw1h  = function(a, b, h) {
    if (!polyinpoly(a, b))
      return false;
    if (h === undefined)
      return true;      // there is no holes
    if (!polyoutpoly(a, h))
      return false;
    return true;
  };

  /*
   * Examines the position of a point relative to the polygon.
   *
   * Input: q - point to check, p - polygon.
   * Output:
   * 'i' : q is strictly interior to P
   * 'o' : q is strictly exterior to P
   * 'v' : q is a vertex of P
   * 'e' : q lies on the relative interior of an edge of P
   *
   * Source: Joseph O'Rourke, Computational geometry in C, second
   * edition, section 7.5, function InPoly1 on page 244. There is no
   * shift of the polygon here so that q does not become the origin.
   */
  inpoly = function(q, p) {
    var n = p.length,
        n1 = n - 1,
        rcross = 0,
        lcross = 0,
        i, i1, x, rstrad, lstrad;

    for (i = 0; i < n; i++) {   // for each edge e = (i - 1, i)
      if (p[i].equals(q))       // if q is a vertex...
        return 'v';
      i1 = i === 0 ? n1 : i - 1;
      // check if the edge straddles the line y = q.y
      rstrad = (p[i].y > q.y) !== (p[i1].y > q.y);
      lstrad = (p[i].y < q.y) !== (p[i1].y < q.y);
      if (rstrad || lstrad) {
        // compute intersection of the edge with the line y = q.y
        x = ((p[i1].y - q.y) * p[i].x + (q.y - p[i].y) * p[i1].x)
          / (p[i1].y - p[i].y);
        if (rstrad && x > q.x)
          rcross++;
        if (lstrad && x < q.x)
          lcross++;
      }
    }
    if ((rcross % 2) !== (lcross % 2))
      return 'e';
    if (rcross % 2 === 1)
      return 'i';
    return 'o';
  };

  return {
    assert: assert,
    Point: Point,
    toPoints: toPoints,
    segsegint: segsegint,
    convex_polygons_intersect: convex_polygons_intersect,
    cpicp: cpicp,
    polyinpoly: polyinpoly,
    pipwh: pipwh,
    pipw1h: pipw1h,
    inpoly: inpoly
  };
}());

TANGRAM.testgeometry = (function() {
  "use strict";
  var assert = TANGRAM.geometry.assert,
      Point = TANGRAM.geometry.Point,
      segsegint = TANGRAM.geometry.segsegint,
      convex_polygons_intersect =
      TANGRAM.geometry.convex_polygons_intersect,
      cpicp = TANGRAM.geometry.cpicp,
      polyinpoly = TANGRAM.geometry.polyinpoly,
      pipwh = TANGRAM.geometry.pipwh,
      inpoly = TANGRAM.geometry.inpoly;

  var test;

  function test_segsegint_basic() {
    var p = new Point(), code;
    code = segsegint(new Point(0, 0), new Point(1, 1),
                     new Point(1, 0), new Point(0, 1), p);
    assert(code === '1');
    assert(p.equals(new Point(0.5, 0.5)));
    code = segsegint(new Point(0, 0), new Point(1, 1),
                     new Point(1, 0), new Point(0.6, 0.4), p);
    assert(code === '0');
    code = segsegint(new Point(0, 0), new Point(1, 1),
                     new Point(1, 0), new Point(0.5, 0.5), p);
    assert(code === 'v');
    assert(p.equals(new Point(0.5, 0.5)));
    code = segsegint(new Point(0, 0), new Point(0.5, 0.5),
                     new Point(1, 0), new Point(0.5, 0.5), p);
    assert(code === 'v');
    assert(p.equals(new Point(0.5, 0.5)));
    code = segsegint(new Point(0, 0), new Point(1, 1),
                     new Point(1, 1), new Point(2, 2), p);
    assert(code === 'e');
    assert(p.equals(new Point(1, 1)));
    code = segsegint(new Point(0, 0), new Point(1, 1),
                     new Point(2, 2), new Point(1, 1), p);
    assert(code === 'e');
    assert(p.equals(new Point(1, 1)));
    code = segsegint(new Point(1, 1), new Point(2, 2),
                     new Point(0, 0), new Point(1, 1), p);
    assert(code === 'e');
    assert(p.equals(new Point(1, 1)));
    code = segsegint(new Point(2, 2), new Point(1, 1),
                     new Point(0, 0), new Point(1, 1), p);
    assert(code === 'e');
    assert(p.equals(new Point(1, 1)));
  }

  function test_convex_polygons_intersect() {
    var a = [new Point(0, 0), new Point(2, 0), new Point(1, 1)],
        b = [new Point(-1, -0.5),
             new Point(3, -0.5),
             new Point(1, 0.5)];
    assert(convex_polygons_intersect(a, b));
    assert(convex_polygons_intersect(b, a));

    // b is inside a
    a = [new Point(0, 0), new Point(2, 0), new Point(1, 1)];
    b = [new Point(0.8, 0.2), new Point(1.2, 0.2),
         new Point(1.2, 0.6), new Point(0.8, 0.6)];
    assert(convex_polygons_intersect(a, b));
    assert(convex_polygons_intersect(b, a));
  }

  function test_cpicp() {
    var t2 = [new Point(2, 2), new Point(4, 4), new Point(6, 2)];
    var pat = [new Point(2, 2), new Point(2, 6),
               new Point(6, 6), new Point(6, 2)];
    assert(cpicp(t2, pat));
    assert(!cpicp(pat, t2));
  }

  function test_polyinpoly() {
    var a,
        b = [new Point(0, 0), new Point(8, 0), new Point(8, 2),
             new Point(4, 2), new Point(4, 4), new Point(8, 4),
             new Point(8, 6), new Point(0, 6)];
    function mka(t) {
      a = [new Point(t, 1), new Point(t + 1, 1),
           new Point(t + 1, 5), new Point(t, 5)];

    }
    mka(1);
    assert(polyinpoly(a, b));
    mka(3);
    assert(polyinpoly(a, b));
    mka(5);
    assert(!polyinpoly(a, b));
  }

  function test_pipwh() {
    var a,
        b = [new Point(0, 0), new Point(2, 0),
             new Point(2, 2), new Point(0, 2)],
        h = [[new Point(1, 0), new Point(2, 1),
              new Point(1, 2), new Point(0, 1)]];
    function mka(t) {
      a = [new Point(t, 2), new Point(2, t), new Point(2, 2)];
    }
    mka(1 / 2);
    assert(!pipwh(a, b, h));
    assert(pipwh(a, b));
    assert(pipwh(a, b, []));
    mka(1);
    assert(pipwh(a, b, h));
    mka(3 / 2);
    assert(pipwh(a, b, h));
  }

  function test_inpoly() {
    var p, q, i;
    p = [new Point(0, 0), new Point(1, 0), new Point(0, 1)];
    assert(inpoly(new Point(0, 0), p) === 'v');
    assert(inpoly(new Point(1, 0), p) === 'v');
    assert(inpoly(new Point(0, 1), p) === 'v');
    assert(inpoly(new Point(0.25, 0.25), p) === 'i');
    assert(inpoly(new Point(0.5, 0.5), p) === 'e');
    assert(inpoly(new Point(1, 1), p) === 'o');

    /*
     * This is a polygon from figure 7.7 on page 240 of Joseph
     * O'Rourke's Computational geometry in C. The polygon p and test
     * points q are taken from the file i.28 of Ccode2.tar.gz, the
     * results are obtained by running inpoly < i.28.
     */
    p = [new Point(0, 0), new Point(2, 0),
         new Point(2, 2), new Point(3, 1),
         new Point(4, 2), new Point(5, 2),
         new Point(3, 3), new Point(3, 2),
         new Point(2, 4), new Point(6, 3),
         new Point(7, 4), new Point(7, 2),
         new Point(8, 5), new Point(8, 7),
         new Point(7, 7), new Point(8, 8),
         new Point(5, 9), new Point(6, 6),
         new Point(5, 7), new Point(4, 6),
         new Point(4, 8), new Point(3, 7),
         new Point(2, 7), new Point(3, 6),
         new Point(4, 4), new Point(0, 7),
         new Point(2, 3), new Point(0, 2)];
    q = [[0, 0, 'v'], [1, 0, 'e'], [2, 1, 'e'], [1, 2, 'i'],
         [0, 2, 'v'], [6, 2, 'o'], [2, 4, 'v'], [5, 4, 'i'],
         [1, 5, 'e'], [3, 5, 'o'], [6, 5, 'i'], [7, 6, 'i'],
         [8, 6, 'e'], [1, 7, 'o'], [2, 7, 'v'], [3, 7, 'v'],
         [4, 7, 'e'], [4, 8, 'v'], [5, 9, 'v']];
    for (i = 0; i < q.length; i++)
      assert(inpoly(new Point(q[i][0], q[i][1]), p) === q[i][2]);
  }

  test = function() {
    console.log('Testing geometry');
    test_segsegint_basic();
    test_convex_polygons_intersect();
    test_cpicp();
    test_polyinpoly();
    test_pipwh();
    test_inpoly();
  };

  return {
    test: test
  };
}());

TANGRAM.testgeometry.test();
