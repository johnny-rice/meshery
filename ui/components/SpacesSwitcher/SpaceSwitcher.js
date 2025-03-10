import { useGetOrgsQuery } from '@/rtk-query/organization';
import { useNotification } from '@/utils/hooks/useNotification';
import { EVENT_TYPES } from '../../lib/event-types';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  styled,
  TextField,
  Typography,
  Select,
  useTheme,
} from '@layer5/sistent';
import { NoSsr } from '@layer5/sistent';
import { setKeys, setOrganization, setWorkspace } from '../../lib/store';
import { connect, Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import { store } from '../../store';
import { withRouter } from 'next/router';
import OrgOutlinedIcon from '@/assets/icons/OrgOutlinedIcon';
import { iconXLarge } from 'css/icons.styles';
import { useGetCurrentAbilities } from '@/rtk-query/ability';
import { useDynamicComponent } from '@/utils/context/dynamicContext';

import _ from 'lodash';

export const SlideInMenu = styled('div')(() => ({
  width: 0,
  overflow: 'hidden',
  transition: 'width 2s ease-in' /* Set transition properties */,
}));

export const SlideInMenuOpen = styled('div')(() => ({
  width: `${(props) => (props.open ? 'auto' : '0')}`,
  overflow: 'visible',
  transition: ' width 1s ease',
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  textAlign: 'center',
  fill: theme.palette.text.default,
}));
export const StyledSelect = styled(Select)(() => ({
  backgroundColor: 'transparent',
  '& .OrgClass': {
    display: 'none',
  },
  '& svg': {
    fill: '#eee',
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '40%',
  display: 'flex',
  marginBottom: '1.125rem', // 18px converted to rem
  marginRight: '0.625rem', // 10px converted to rem
  marginTop: '0.5rem', // 8px converted to rem
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.mode === 'dark' ? '#00B39F' : theme.palette.text.default, // change the color here
  },
}));

export const StyledHeader = styled(Typography)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  fontSize: '1.25rem',
  [theme.breakpoints.up('sm')]: { fontSize: '1.65rem' },
  color: theme.palette.common.white,
}));
export const StyledBetaHeader = styled('sup')(() => ({
  color: '#EEEEEE',
  fontWeight: '300',
  fontSize: '0.8125rem',
}));

const StyledSwitcher = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.5rem',
  userSelect: 'none',
  transition: 'width 2s ease-in',
  color: theme.palette.common.white,
}));

function OrgMenu(props) {
  const {
    data: orgsResponse,
    isSuccess: isOrgsSuccess,
    isError: isOrgsError,
    error: orgsError,
  } = useGetOrgsQuery({});
  let orgs = orgsResponse?.organizations || [];
  let uniqueOrgs = _.uniqBy(orgs, 'id');
  const { organization, setOrganization, open } = props;
  const { notify } = useNotification();
  useGetCurrentAbilities(organization, props.setKeys);
  useEffect(() => {
    if (isOrgsError) {
      notify({
        message: `There was an error fetching available data ${orgsError?.data}`,
        event_type: EVENT_TYPES.ERROR,
      });
    }
  }, [isOrgsError, notify, orgsError]);

  const handleOrgSelect = (e) => {
    const id = e.target.value;
    const selected = orgs.find((org) => org.id === id);
    setOrganization({ organization: selected });
  };
  const theme = useTheme();
  return (
    <NoSsr>
      {isOrgsSuccess && orgs && open && (
        <SlideInMenuOpen>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                key="SpacesPreferences"
                control={
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs={12} data-cy="mesh-adapter-url">
                      <StyledSelect
                        value={organization.id}
                        onChange={handleOrgSelect}
                        SelectDisplayProps={{
                          style: {
                            display: 'flex',
                            flexDirection: 'row',
                            fill: '#eee',
                            paddingBlock: '9px 8px',
                            paddingInline: '18px 34px',
                            color: theme.palette.background.constant.white,
                          },
                        }}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                          },
                          getContentAnchorEl: null,
                          style: {
                            fill: theme.palette.text.secondary,
                          },
                        }}
                      >
                        {uniqueOrgs?.map((org) => (
                          <StyledMenuItem key={org.id} value={org.id}>
                            <OrgOutlinedIcon
                              width="24"
                              height="24"
                              className="OrgClass"
                              style={{ marginRight: '1rem', color: theme.palette.icon.default }}
                            />
                            <span>{org.name}</span>
                          </StyledMenuItem>
                        ))}
                      </StyledSelect>
                    </Grid>
                  </Grid>
                }
              />
            </FormGroup>
          </FormControl>
        </SlideInMenuOpen>
      )}
    </NoSsr>
  );
}

// export function WorkspaceSwitcher({ organization, open, workspace, setWorkspace }) {
//   const [orgId, setOrgId] = useState('');
//   const { data: workspacesData, isError: isWorkspacesError } = useGetWorkspacesQuery(
//     {
//       page: 0,
//       pagesize: 10,
//       search: '',
//       order: '',
//       orgId: orgId,
//     },
//     {
//       skip: !orgId ? true : false,
//     },
//   );

//   const handleWorkspaceSelect = (e) => {
//     const id = e.target.value;
//     const selected = workspacesData.workspaces.find((org) => org.id === id);
//     setWorkspace({ workspace: selected });
//   };

//   useEffect(() => {
//     setOrgId(organization?.id);
//   }, [organization]);

//   if (!organization || !workspace) {
//     return null;
//   }

//   return (
//     <NoSsr>
//       {!isWorkspacesError && workspace && (
//         <div
//           style={{
//             width: open ? 'auto' : 0,
//             overflow: open ? '' : 'hidden',
//             transition: 'all 1s',
//           }}
//         >
//           <FormControl component="fieldset">
//             <FormGroup>
//               <FormControlLabel
//                 key="SpacesPreferences"
//                 control={
//                   <Grid container spacing={1} alignItems="flex-end">
//                     <Grid item xs={12} data-cy="mesh-adapter-url">
//                       <StyledSelect
//                         value={workspace.id}
//                         onChange={handleWorkspaceSelect}
//                         SelectDisplayProps={{ style: { display: 'flex', flexDirection: 'row' } }}
//                         MenuProps={{
//                           anchorOrigin: {
//                             vertical: 'bottom',
//                             horizontal: 'left',
//                           },
//                           transformOrigin: {
//                             vertical: 'top',
//                             horizontal: 'left',
//                           },
//                           getContentAnchorEl: null,
//                         }}
//                       >
//                         {workspacesData?.workspaces?.map((works) => (
//                           <MenuItem key={works.id} value={works.id}>
//                             <span>{works.name}</span>
//                           </MenuItem>
//                         ))}
//                       </StyledSelect>
//                     </Grid>
//                   </Grid>
//                 }
//               />
//             </FormGroup>
//           </FormControl>
//         </div>
//       )}
//     </NoSsr>
//   );
// }

// export const FileNameInput = ({
//   fileName,
//   handleFileNameChange,
//   handleFocus,
//   activateWalkthrough,
// }) => {
//   return (
//     <StyledTextField
//       id="design-name-textfield"
//       onChange={handleFileNameChange}
//       label="Name"
//       value={fileName || ''}
//       autoComplete="off"
//       size="small"
//       variant="standard"
//       onFocus={handleFocus}
//       onMouseEnter={() => activateWalkthrough && activateWalkthrough()}
//     />
//   );
// };

function DefaultHeader({ title, isBeta }) {
  return (
    <StyledHeader variant="h5" data-cy="headerPageTitle">
      {title}
      {isBeta ? <StyledBetaHeader>BETA</StyledBetaHeader> : ''}
    </StyledHeader>
  );
}

function SpaceSwitcher(props) {
  const [orgOpen, setOrgOpen] = useState(false);
  // const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const { DynamicComponent } = useDynamicComponent();
  return (
    <NoSsr>
      <Provider store={store}>
        <StyledSwitcher>
          <Button
            onClick={() => setOrgOpen(!orgOpen)}
            style={{ marginRight: orgOpen ? '1rem' : '0' }}
          >
            <OrgOutlinedIcon {...iconXLarge} fill={'#eee'} />
          </Button>
          <OrgMenu {...props} open={orgOpen} />/
          {/* /
          <Button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            style={{ marginRight: workspaceOpen ? '1rem' : '0' }}
          >
            <WorkspaceOutlinedIcon {...iconXLarge} />
          </Button>
          <WorkspaceSwitcher {...props} open={workspaceOpen} />/ */}
          <div id="meshery-dynamic-header" style={{ marginLeft: DynamicComponent ? '1rem' : '' }} />
          {!DynamicComponent && <DefaultHeader title={props.title} isBeta={props.isBeta} />}
        </StyledSwitcher>
      </Provider>
    </NoSsr>
  );
}

const mapStateToProps = (state) => {
  const organization = state.get('organization');
  const workspace = state.get('workspace');
  return {
    organization,
    workspace,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setOrganization: bindActionCreators(setOrganization, dispatch),
  setWorkspace: bindActionCreators(setWorkspace, dispatch),
  setKeys: bindActionCreators(setKeys, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SpaceSwitcher));
