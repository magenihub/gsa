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

import {classes} from 'gmp/utils.js';

import PropTypes from '../../utils/proptypes.js';

import Button from './button.js';

const SubmitButton = ({className, ...other}) => {
  className = classes('button-block', className);
  return (
    <Button
      {...other}
      type="submit"
      className={className}
    />
  );
};

SubmitButton.propTypes = {
  className: PropTypes.string,
};

export default SubmitButton;

// vim: set ts=2 sw=2 tw=80:
