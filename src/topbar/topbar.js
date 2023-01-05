import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Navbar,
  Alignment,
  NavbarDivider,
} from '@blueprintjs/core';
import styled from 'polotno/utils/styled';
import { useProject } from '../project';
import { FileMenu } from './file-menu';
import { DownloadButton } from './download-button';

const NavbarContainer = styled('div')`
  @media screen and (max-width: 500px) {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100vw;
  }
`;

const NavInner = styled('div')`
  @media screen and (max-width: 500px) {
    display: flex;
  }
`;

export default observer(({ store }) => {
  const project = useProject();

  return (
    <NavbarContainer className="bp4-navbar">
      <NavInner>
        <Navbar.Group align={Alignment.LEFT}>
          <h2>Canvas Studio for Milton</h2>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <FileMenu store={store} project={project} />
          <NavbarDivider />
          <DownloadButton store={store} />
        </Navbar.Group>
      </NavInner>
    </NavbarContainer>
  );
});
