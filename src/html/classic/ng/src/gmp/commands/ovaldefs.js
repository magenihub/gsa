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

import {is_defined} from '../../utils.js';

import {EntitiesCommand, EntityCommand, register_command} from '../command.js';

import {parse_collection_list, parse_info_entities,
  parse_info_counts} from '../parser.js';

import Ovaldef from '../models/ovaldef.js';

const info_filter = info => is_defined(info.ovaldef);

const parse_ovaldef_entities = (response, name, modelclass) => {
  return parse_info_entities(response, name, modelclass, info_filter);
};

export class OvaldefCommand extends EntityCommand {

  constructor(http) {
    super(http, 'info', Ovaldef);
    this.setParam('info_type', 'ovaldef');
  }
}

export class OvaldefsCommand extends EntitiesCommand {

  constructor(http) {
    super(http, 'info', Ovaldef);
    this.setParam('cmd', 'get_info');
    this.setParam('info_type', 'ovaldef');
  }

  getEntitiesResponse(root) {
    return root.get_info.get_info_response;
  }

  getCollectionListFromRoot(root) {
    let response = this.getEntitiesResponse(root);
    return parse_collection_list(response, this.name, this.clazz, 'info',
      parse_ovaldef_entities, parse_info_counts);
  }
}

register_command('ovaldef', OvaldefCommand);
register_command('ovaldefs', OvaldefsCommand);

// vim: set ts=2 sw=2 tw=80: