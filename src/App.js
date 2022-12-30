import React from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { useAuth0 } from '@auth0/auth0-react';

import { loadFile } from './file';
// import { QrSection } from './sections/qr-section';
import { IconsSection } from './sections/icons-section';
import { ShapesSection } from './sections/shapes-section';
import { MyDesignsSection } from './sections/my-designs-section';
import { useProject } from './project';

import { ImageRemoveBackground } from './background-remover';

import Topbar from './topbar/topbar';

// replace elements section with just shapes
DEFAULT_SECTIONS.splice(3, 1, ShapesSection);
// add icons
DEFAULT_SECTIONS.splice(3, 0, IconsSection);
// add two more sections
// DEFAULT_SECTIONS.push(QrSection);
DEFAULT_SECTIONS.unshift(MyDesignsSection);

const size = DEFAULT_SECTIONS.filter(v => v.name === 'size');
const rest = DEFAULT_SECTIONS.filter(v => v.name !== 'size');
const SECTIONS_LIST = [...size, ...rest];


const useHeight = () => {
  const [height, setHeight] = React.useState(window.innerHeight);
  React.useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(window.innerHeight);
    });
  }, []);
  return height;
};

const App = ({ store }) => {
  const project = useProject();
  const height = useHeight();

  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = () => {
    let url = new URL(window.location.href);
    // url example https://studio.polotno.com/design/5f9f1b0b
    const reg = new RegExp('design/([a-zA-Z0-9_-]+)').exec(url.pathname);
    const designId = (reg && reg[1]) || 'local';
    project.loadById(designId);
  };

  React.useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      getAccessTokenSilently()
        .then((token) => {
          project.authToken = token;
          load();
        })
        .catch((err) => {
          project.authToken = null;
          load();
          console.log(err);
        });
    } else {
      project.authToken = null;
      load();
    }
  }, [isAuthenticated, project, getAccessTokenSilently, isLoading, load]);

  const handleDrop = (ev) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    // skip the case if we dropped DOM element from side panel
    // in that case Safari will have more data in "items"
    if (ev.dataTransfer.files.length !== ev.dataTransfer.items.length) {
      return;
    }
    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      loadFile(ev.dataTransfer.files[i], store);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: height + 'px',
        display: 'flex',
        flexDirection: 'column',
      }}
      onDrop={handleDrop}
    >
      <Topbar store={store} />
      <div style={{ height: 'calc(100% - 50px)' }}>
        <PolotnoContainer className="polotno-app-container">
          <SidePanelWrap>
            <SidePanel store={store} sections={SECTIONS_LIST} />
          </SidePanelWrap>
          <WorkspaceWrap>
            <Toolbar
              store={store}
              components={{
                ImageRemoveBackground,
              }}
            />
            <Workspace store={store} />
            <ZoomButtons store={store} />
          </WorkspaceWrap>
        </PolotnoContainer>
      </div>
    </div>
  );
};

export default App;
