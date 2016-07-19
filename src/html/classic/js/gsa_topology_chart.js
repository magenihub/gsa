/*
 * Greenbone Security Assistant
 * $Id$
 * Description: JavaScript for Topology charts in GSA.
 *
 * Authors:
 * Timo Pollmeier <timo.pollmeier@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

(function(global, window, d3, console, gsa) {
  'use strict';

  var gch = gsa.charts;
  gch.register_chart_generator('topology', TopologyChartGenerator);

  function default_bar_style(d) {
    return ('');
  }

  /* Main chart generator */
  function TopologyChartGenerator() {
    // call super constructor
    gch.AssetChartGenerator.call(this, 'topology');
  }

  TopologyChartGenerator.prototype =
    Object.create(gch.AssetChartGenerator.prototype);
  TopologyChartGenerator.prototype.constructor = TopologyChartGenerator;

  TopologyChartGenerator.prototype.init = function() {
    this.margin = {top: 10, right: 10, bottom: 10, left: 10};

    this.setTitleGenerator(gch.title_static(
      gsa._('Loading topology chart ...'), gsa._('Topology Chart')));
  };

  TopologyChartGenerator.prototype.evaluateParams = function(gen_params) {
    gch.AssetChartGenerator.prototype.evaluateParams.call(this, gen_params);

    if (gen_params.x_field) {
      this.x_field = gen_params.x_field;
    }

    if (gen_params.y_fields && gen_params.y_fields[0]) {
      this.y_field = gen_params.y_fields[0];
    }

    if (gsa.is_defined(gen_params.extra)) {


    }
  };

  TopologyChartGenerator.prototype.generate = function(svg, data, update) {
    var self = this;
    var topology = data.topology;

    // Setup display parameters
    var height = svg.attr('height');
    var width = svg.attr('width');

    if (svg.select('g').node() === null) {
      this.graph = svg.append('g');
    }

    if (update || !this.layout) {
      this.layout = d3.layout.force();
      this.layout
            .charge(function (n) { return -(10) })
            .gravity(0.01)
            .friction(0.95)
            .linkDistance(function (l) { return 20 + 10 * Math.sqrt (l.source.weight + l.target.weight) })
            .linkStrength(0.2)
            .nodes(topology.nodes)
            .links(topology.links)
            .size([width, height])
            .start();
      this.layout.drag().on('dragstart',
                            function () {
                              d3.event.sourceEvent.stopPropagation();
                            });
      this.scale = 1;
      this.translate = [0,0];
    }

    self.layout.size([width, height]);

    this.update_layout = function () {
      self.layout.tick();

      var circle_scale = (5 * self.scale >= 2) ? 1 : 2 / 5 / self.scale;

      self.graph.selectAll('.node-marker').data(self.layout.nodes())
        .attr('cx', function (d) { return d.x })
        .attr('cy', function (d) { return d.y })

      self.graph.selectAll('.node-label').data(self.layout.nodes())
        .attr('x', function (d) { return d.x })
        .attr('y', function (d) { return d.y + 5 * circle_scale })

      self.graph.selectAll('.link').data(self.layout.links())
        .attr('x1', function (d) { return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y });
    }

    this.resize_graph = function ()  {
      this.layout.size([width, height]);

      var circle_scale = (5 * self.scale >= 2) ? 1 : 2 / 5 / self.scale;
      var text_scale = Math.sqrt(1/self.scale);

      self.graph.selectAll('.node-marker').data(self.layout.nodes())
        .attr('r', 5 * circle_scale)

      self.graph.selectAll('.node-label').data(self.layout.nodes())
        .style('font-size', (8 * text_scale) + 'px')
        .style('display', self.scale >= 0.9 ? '' : 'none')

//       self.graph.selectAll('.link').data(self.layout.links())

      self.graph.attr ('transform',
                       'translate(' + self.translate + '),' +
                       'scale(' + self.scale + ')')
    }

    this.graph.selectAll('.link').data(this.layout.links()).enter()
      .append('line')
        .attr('class', 'link')
        .style('stroke', 'green')

    var color_scale = gch.severity_colors_gradient();

    this.graph.selectAll('.node').data(this.layout.nodes()).enter()
      .append('a')
        .classed('node', true)
        .attr('xlink:href',
              function (d) {
                  if (d.id === null)
                    return null;
                  return gch.details_page_url ('host', d.id, data.filter_info);
                })
        .append('circle')
          .classed('node-marker', true)
          .attr('r', 1.5)
          .style('fill', function(d) {
              if (d.id !== null)
                return color_scale(d.severity)
              else
                return 'white';
            })
          .style('stroke', function(d) {
              if (d.id !== null)
                return d3.hcl(color_scale(d.severity)).darker(2);
              else
                return 'grey';
            })
          .on('click', function (d) { console.debug (self.layout.alpha()) })
          .call(self.layout.drag);

    this.graph.selectAll('.node-label').data(this.layout.nodes()).enter()
      .append('text')
      .classed('node-label', true)
      .style('font-size', '8px')
      .style('font-weight', 'normal')
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'hanging')
      .style('fill', function (n) { return n.id !== null ? 'black' : 'grey' })
      .text(function (n) { return n.name });

    if (! gsa.is_defined(self.interval)) {
      self.interval = window.setInterval(self.update_layout, 0.0625)
    }
    var zoomed = function () {
      self.scale = d3.event.scale;
      self.translate = d3.event.translate;
      self.resize_graph();
    }

    var zoom = d3.behavior.zoom()
      .translate([0, 0])
      .scale(this.scale)
      .scaleExtent([0.125, 2])
      .on("zoom", zoomed);

    svg.call(zoom);

    self.resize_graph();
    if (update) {
      for (var i = 0; i < 1000; ++i) {
        self.layout.start();
        self.layout.tick();
      }
    }
    else {
      self.layout.resume();
    }
  };

  TopologyChartGenerator.prototype.generateCsvData = function(controller,
      data) {
    return  gch.csv_from_records (data.topology.nodes, 
                                  undefined /* column_info */,
                                  ['link_id', 'hostname', 'traceroute'],
                                  ['IP', 'Hostname', 'Route'],
                                  controller.display.getTitle());
  };

  TopologyChartGenerator.prototype.generateHtmlTableData = function(controller,
      data) {
    return gch.html_table_from_records (data.topology.nodes,
                                        undefined /* column_info */,
                                        ['link_id', 'hostname', 'traceroute'],
                                        ['IP', 'Hostname', 'Route'],
                                        controller.display.getTitle(),
                                        controller.data_src.getParam('filter'));
  };

  TopologyChartGenerator.prototype.generateLink = function(d, i, column, type,
      filter_info) {
    var value = d.value;

    if (column === 'uuid') {
      return gsa.details_page_url(type, value, filter_info);
    } else {
      return gsa.filtered_list_url(type, column, value, filter_info);
    }
  };

})(window, window, window.d3, window.console, window.gsa);

// vim: set ts=2 sw=2 tw=80:
