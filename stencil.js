joint.ui.Stencil = Backbone.View.extend({
    className: 'stencil',
    events: {
	'click .group-label': 'onGroupLabelClick',
	'touchstart .group-label': 'onGroupLabelClick',
	'input .search': 'onSearch'
    },
    options: {
	width: 200,
	height: 800
    },
    initialize: function (a) {
	this.options = _.extend({
	}, _.result(this, 'options'), a || {
	}),
		this.graphs = {
		},
		this.papers = {
		},
		this.$groups = {
		},
		_.bindAll(this, 'onDrag', 'onDragEnd'),
		$(document.body).on({
	    'mousemove.stencil touchmove.stencil': this.onDrag,
	    'mouseup.stencil touchend.stencil': this.onDragEnd
	}),
		this.onSearch = _.debounce(this.onSearch, 200)
    },
    render: function () {
	this.$el.html(joint.templates.stencil['stencil.html'](this.template)),
		this.$content = this.$('.content'),
		this.options.search && this.$el.addClass('searchable').prepend(joint.templates.stencil['search.html']());
	var a = {
	    width: this.options.width,
	    height: this.options.height,
	    interactive: !1
	};
	if (this.options.groups) {
	    var b = _.sortBy(_.pairs(this.options.groups), function (a) {
		return a[1].index
	    });
	    _.each(b, function (b) {
		var c = b[0],
			d = b[1],
			e = $(joint.templates.stencil['group.html']({
			    label: d.label || c
			}));
		e.attr('data-name', c),
			d.closed && e.addClass('closed'),
			e.append($(joint.templates.stencil['elements.html']())),
			this.$content.append(e),
			this.$groups[c] = e;
		var f = new joint.dia.Graph;
		this.graphs[c] = f;
		var g = new joint.dia.Paper(_.extend({
		}, a, {
		    el: e.find('.elements'),
		    model: f,
		    width: d.width || a.width,
		    height: d.height || a.height
		}));
		this.papers[c] = g
	    }, this)
	} else {
	    this.$content.append($(joint.templates.stencil['elements.html']()));
	    var c = new joint.dia.Graph;
	    this.graphs.__default__ = c;
	    var d = new joint.dia.Paper(_.extend(a, {
		el: this.$('.elements'),
		model: c
	    }));
	    this.papers.__default__ = d
	}
	return this._graphDrag = new joint.dia.Graph,
		this._paperDrag = new joint.dia.Paper({
		    el: this.$('.stencil-paper-drag'),
		    width: 1,
		    height: 1,
		    model: this._graphDrag
		}),
		_.each(this.papers, function (a) {
		    this.listenTo(a, 'cell:pointerdown', this.onDragStart)
		}, this),
		this
    },
    load: function (a, b) {
	var c = this.graphs[b || '__default__'];
	if (!c)
	    throw new Error('Stencil: group ' + b + ' does not exist.');
	c.resetCells(a);
	var d = this.options.height;
	b && this.options.groups[b] && (d = this.options.groups[b].height),
		d || this.papers[b || '__default__'].fitToContent(1, 1, this.options.paperPadding || 10)
    },
    getGraph: function (a) {
	return this.graphs[a || '__default__']
    },
    getPaper: function (a) {
	return this.papers[a || '__default__']
    },
    onDragStart: function (a, b) {
	this.$el.addClass('dragging'),
		this._paperDrag.$el.addClass('dragging'),
		$(document.body).append(this._paperDrag.$el),
		this._clone = a.model.clone(),
		this._cloneBbox = a.getBBox();
	var c = 5,
		d = g.point(this._cloneBbox.x - this._clone.get('position').x, this._cloneBbox.y - this._clone.get('position').y);
	this._clone.set('position', {
	    x: -d.x + c,
	    y: -d.y + c
	}),
		this._graphDrag.addCell(this._clone),
		this._paperDrag.setDimensions(this._cloneBbox.width + 2 * c, this._cloneBbox.height + 2 * c);
	var e = document.body.scrollTop || document.documentElement.scrollTop;
	this._paperDrag.$el.offset({
	    left: b.clientX - this._cloneBbox.width / 2,
	    top: b.clientY + e - this._cloneBbox.height / 2
	})
    },
    onDrag: function (a) {
	if (a = joint.util.normalizeEvent(a), this._clone) {
	    var b = document.body.scrollTop || document.documentElement.scrollTop;
	    this._paperDrag.$el.offset({
		left: a.clientX - this._cloneBbox.width / 2,
		top: a.clientY + b - this._cloneBbox.height / 2
	    })
	}
    },
    onDragEnd: function (a) {
	a = joint.util.normalizeEvent(a),
		this._clone && this._cloneBbox && (this.drop(a, this._clone.clone(), this._cloneBbox), this.$el.append(this._paperDrag.$el), this.$el.removeClass('dragging'), this._paperDrag.$el.removeClass('dragging'), this._clone.remove(), this._clone = void 0)
    },
    drop: function (a, b, c) {
	var d = this.options.paper,
		e = this.options.graph,
		f = d.$el.offset(),
		h = document.body.scrollTop || document.documentElement.scrollTop,
		i = document.body.scrollLeft || document.documentElement.scrollLeft,
		j = g.rect(f.left + parseInt(d.$el.css('border-left-width'), 10) - i, f.top + parseInt(d.$el.css('border-top-width'), 10) - h, d.$el.innerWidth(), d.$el.innerHeight()),
		k = d.svg.createSVGPoint();
	if (k.x = a.clientX, k.y = a.clientY, j.containsPoint(k)) {
	    var l = V('rect', {
		width: d.options.width,
		height: d.options.height,
		x: 0,
		y: 0,
		opacity: 0
	    });
	    V(d.svg).prepend(l);
	    var m = $(d.svg).offset();
	    l.remove(),
		    k.x += i - m.left,
		    k.y += h - m.top;
	    var n = k.matrixTransform(d.viewport.getCTM().inverse()),
		    o = b.getBBox();
	    n.x += o.x - c.width / 2,
		    n.y += o.y - c.height / 2,
		    b.set('position', {
			x: g.snapToGrid(n.x, d.options.gridSize),
			y: g.snapToGrid(n.y, d.options.gridSize)
		    }),
		    b.unset('z'),
		    e.addCell(b, {
			stencil: this.cid
		    })
	}
    },
    filter: function (a, b) {
	var c = a.toLowerCase() == a,
		d = _.reduce(this.papers, function (d, e, f) {
		    var g = e.model.get('cells').filter(function (d) {
			var f = e.findViewByModel(d),
				g = !a || _.some(b, function (b, e) {
				    if ('*' != e && d.get('type') != e)
					return !1;
				    var f = _.some(b, function (b) {
					var e = joint.util.getByPath(d.attributes, b, '/');
					return _.isUndefined(e) || _.isNull(e) ? !1 : (e = e.toString(), c && (e = e.toLowerCase()), e.indexOf(a) >= 0)
				    });
				    return f
				});
			return V(f.el).toggleClass('unmatched', !g),
				g
		    }, this),
			    h = !_.isEmpty(g),
			    i = (new joint.dia.Graph).resetCells(g);
		    return this.trigger('filter', i, f),
			    this.$groups[f] && this.$groups[f].toggleClass('unmatched', !h),
			    e.fitToContent(1, 1, this.options.paperPadding || 10),
			    d || h
		}, !1, this);
	this.$el.toggleClass('not-found', !d)
    },
    onSearch: function (a) {
	this.filter(a.target.value, this.options.search)
    },
    onGroupLabelClick: function (a) {
	a.preventDefault();
	var b = $(a.target).closest('.group');
	this.toggleGroup(b.data('name'))
    },
    toggleGroup: function (a) {
	this.$('.group[data-name="' + a + '"]').toggleClass('closed')
    },
    closeGroup: function (a) {
	this.$('.group[data-name="' + a + '"]').addClass('closed')
    },
    openGroup: function (a) {
	this.$('.group[data-name="' + a + '"]').removeClass('closed')
    },
    closeGroups: function () {
	this.$('.group').addClass('closed')
    },
    openGroups: function () {
	this.$('.group').removeClass('closed')
    },
    remove: function () {
	Backbone.View.prototype.remove.apply(this, arguments),
		$(document.body).off('.stencil', this.onDrag).off('.stencil', this.onDragEnd)
    }
});
