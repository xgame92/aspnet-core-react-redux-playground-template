﻿import React, { useCallback, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { Route } from 'react-router-dom';
import { IApplicationState } from '../store';
import { actionCreators } from '../store/auth';
import { spaNugetUrls } from '../config/constants';
import { RoutesConfig } from '../config/routes.config';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SettingsProps = { readonly isAuthenticated: boolean; } & typeof actionCreators;

const Settings: React.FC<SettingsProps> = ({ isAuthenticated, logoutUserRequest }) => {
  const [open, setOpen] = useState<boolean>(false);
  const settingsAnchorRef = useRef<HTMLAnchorElement | null>(null);

  const onOutsideClick = useCallback(() => {
    setOpen(false);
  }, []);

  const onInsideClick = useCallback(() => {
    setOpen(open => !open);
  }, []);

  useOnClickOutside(
    settingsAnchorRef,
    onOutsideClick,
    onInsideClick
  );

  const handleLogout = (history: History) => (): void => {
    const onLogoutCallbackFn = ((): void => history.push(RoutesConfig.Login.path));
    logoutUserRequest(onLogoutCallbackFn);
  };

  const menuContent: React.ReactNode = (isAuthenticated && open) && (
    <ul className='dropdown-menu'>
      <li className='header-title'>Settings</li>
      <li>
        <a
          role='button'
          rel='noopener'
          target='_blank'
          className='dropdown-item'
          href={spaNugetUrls.HEALTH_UI}
        >
          <FontAwesomeIcon icon='heart' /> Health Checks
        </a>
      </li>
      <li>
        <a
          role='button'
          rel='noopener'
          target='_blank'
          className='dropdown-item'
          href={spaNugetUrls.SWAGGER_DOCS}
        >
          <FontAwesomeIcon icon='file' /> Swagger API
        </a>
      </li>
      <li>
        <Route
          render={({ history }) => (
            <a
              role='button'
              className='dropdown-item'
              onClick={handleLogout(history)}
            >
              <FontAwesomeIcon icon={RoutesConfig.Login.icon as IconProp} />{' '}
              {RoutesConfig.Login.displayName}
            </a>
          )}
        />
      </li>
    </ul>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={(`fixed-plugin ${open ? 'fixed-plugin-active' : ''}`).trim()}>
      <div className='dropdown'>
        <a role='button' ref={settingsAnchorRef}>
          <FontAwesomeIcon icon='cog' size='3x' />
        </a>
        {menuContent}
      </div>
    </div>
  );
};

// Map only necessary IApplicationState to Settings props
const mapStateToProps = (state: IApplicationState) => ({
  isAuthenticated: state.auth.isAuthenticated
});

// Wire up the React component to the Redux store
export default connect(mapStateToProps, actionCreators)(Settings);