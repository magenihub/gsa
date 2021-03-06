/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 Greenbone Networks GmbH
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

import moment from 'moment';

import {is_defined, is_empty} from '../utils.js';

import Model from '../model.js';

class Tag extends Model {

  static entity_type = 'tag';

  parseProperties(elem) {
    const ret = super.parseProperties(elem);
    ret.modified = moment(elem.modified);

    if (is_defined(elem.resource) && !is_empty(elem.resource._id)) {
      ret.resource = new Model(elem.resource, elem.resource.type);
    }
    else {
      delete ret.resource;
    }
    return ret;
  }
}

export default Tag;

// vim: set ts=2 sw=2 tw=80:
