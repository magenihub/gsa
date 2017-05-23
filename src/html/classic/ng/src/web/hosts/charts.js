/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2017 Greenbone Networks GmbH
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

import React from 'react';

import  _ from '../../locale.js';

import PropTypes from '../proptypes.js';

import DataSource from '../dashboard/datasource.js';
import Chart from '../dashboard/chart.js';

const HostCharts = ({filter, cache}) => {
  return (
    <div>
      <DataSource
        name="host-severity-count-source"
        cache={cache}
        group-column="severity"
        aggregate-type="host"
        filter={filter}>
        <Chart
          name="host-by-cvss"
          type="bar"
          title={_('Hosts by CVSS')}
          title-count="count"
          template="info_by_cvss"/>
        <Chart
          name="host-by-severity-class"
          type="donut"
          title={_('Hosts by Severity Class')}
          title-count="count"
          template="info_by_class"/>
      </DataSource>
      <DataSource
        name="host-most-vulnerable-source"
        cache={cache}
        aggregate-type="host"
        group-column="uuid"
        columns={['severity']}
        text-columns={['name', 'modified']}
        sort-fields={['severity', 'modified']}
        sort-orders={['descending', 'descending']}
        sort-stats={['max', 'value']}
        filter={filter}>
        <Chart
          name="host-by-most-vulnerable"
          type="horizontal_bar"
          x-field="name"
          y-fields={['severity_max']}
          z-fields={['severity_max']}
          gen-params={{
            empty_text: _('No vulnerable Hosts found'),
            extra_tooltip_field_1: "modified",
            extra_tooltip_label_1: "Updated",
          }}
          title={_('Most vulnerable hosts')}/>
      </DataSource>
      <DataSource
        name="host-counts-timeline-source"
        cache={cache}
        aggregate-type="host"
        group-column="modified"
        subgroup-column="severity_level"
        filter={filter}>
        <Chart
          name="host-by-modification-time"
          title={_('Hosts by modification time')}
          title-count="count"
          y-fields={['c_count', 'c_count[High]']}
          z-fields={['count', 'count[High]']}
          type="line"
          gen-params={{is_timeline: 1}}/>
      </DataSource>
      <DataSource
        name="host-topology-source"
        cache={cache}
        aggregate-type="host"
        type="host"
        filter={filter}>
        <Chart
          name="host-by-topology"
          title={_('Hosts topology')}
          type="topology"/>
      </DataSource>
    </div>
  );
};

HostCharts.propTypes = {
  cache: PropTypes.object,
  filter: PropTypes.filter,
};

export default HostCharts;

// vim: set ts=2 sw=2 tw=80: