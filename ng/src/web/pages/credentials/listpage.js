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

import React from 'react';

import _ from 'gmp/locale.js';

import {CREDENTIALS_FILTER_FILTER} from 'gmp/models/filter.js';

import PropTypes from '../../utils/proptypes.js';
import withCapabilities from '../../utils/withCapabilities.js';

import EntitiesPage from '../../entities/page.js';
import withEntitiesContainer from '../../entities/withEntitiesContainer.js';

import HelpIcon from '../../components/icon/helpicon.js';
import NewIcon from '../../components/icon/newicon.js';

import IconDivider from '../../components/layout/icondivider.js';

import {createFilterDialog} from '../../components/powerfilter/dialog.js';

import CredentialComponent from './component.js';
import CredentialsTable, {SORT_FIELDS} from './table.js';

const ToolBarIcons = withCapabilities(({
  capabilities,
  onCredentialCreateClick,
}) => (
  <IconDivider>
    <HelpIcon
      page="credentials"
      title={_('Help: Credentials')}
    />
    {capabilities.mayCreate('credential') &&
      <NewIcon
        title={_('New Credential')}
        onClick={onCredentialCreateClick}
      />
    }
  </IconDivider>
));

ToolBarIcons.propTypes = {
  onCredentialCreateClick: PropTypes.func.isRequired,
};

const CredentialsFilterDialog = createFilterDialog({
  sortFields: SORT_FIELDS,
});

const CredentialsPage = ({
  onChanged,
  onDownloaded,
  onError,
  ...props
}) => (
  <CredentialComponent
    onCreated={onChanged}
    onSaved={onChanged}
    onCloned={onChanged}
    onCloneError={onError}
    onDeleted={onChanged}
    onDeleteError={onError}
    onDownloaded={onDownloaded}
    onDownloadError={onError}
    onInstallerDownloaded={onDownloaded}
    onInstallerDownloadError={onError}
  >{({
    clone,
    create,
    delete: delete_func,
    download,
    downloadinstaller,
    edit,
    save,
  }) => (
    <EntitiesPage
      {...props}
      filterEditDialog={CredentialsFilterDialog}
      sectionIcon="credential.svg"
      table={CredentialsTable}
      title={_('Credentials')}
      toolBarIcons={ToolBarIcons}
      onChanged={onChanged}
      onDownloaded={onDownloaded}
      onError={onError}
      onCredentialCloneClick={clone}
      onCredentialCreateClick={create}
      onCredentialDeleteClick={delete_func}
      onCredentialDownloadClick={download}
      onCredentialEditClick={edit}
      onCredentialSaveClick={save}
      onCredentialInstallerDownloadClick={downloadinstaller}
    />
  )}
  </CredentialComponent>
);

CredentialsPage.propTypes = {
  onChanged: PropTypes.func.isRequired,
  onDownloaded: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default withEntitiesContainer('credential', {
  filtersFilter: CREDENTIALS_FILTER_FILTER,
})(CredentialsPage);

// vim: set ts=2 sw=2 tw=80:
