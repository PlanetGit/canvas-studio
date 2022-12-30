import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Dialog,
  Classes,
  Position,
  Menu,
  MenuItem,
  MenuDivider,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { downloadFile } from 'polotno/utils/download';

export const FileMenu = observer(({ store, project }) => {
  const inputRef = React.useRef();

  const [faqOpened, toggleFaq] = React.useState(false);
  return (
    <>
      <Popover2
        content={
          <Menu>
            <MenuItem
              icon="plus"
              text="Create new design"
              onClick={() => {
                const ids = store.pages
                  .map((page) => page.children.map((child) => child.id))
                  .flat();
                const hasObjects = ids?.length;
                if (hasObjects) {
                  if (!window.confirm('Remove all content for a new design?')) {
                    return;
                  }
                }
                const pagesIds = store.pages.map((p) => p.id);
                store.deletePages(pagesIds);
                store.addPage();
                project.id = '';
                project.save();
              }}
            />
            <MenuDivider />
            <MenuItem
              icon="folder-open"
              text="Open"
              onClick={() => {
                document.querySelector('#load-project').click();
              }}
            />
            <MenuItem
              icon="floppy-disk"
              text="Save as"
              onClick={() => {
                const json = store.toJSON();

                const url =
                  'data:text/json;base64,' +
                  window.btoa(
                    unescape(encodeURIComponent(JSON.stringify(json)))
                  );

                downloadFile(url, 'canvas.json');
              }}
            />

            <MenuDivider />
            <MenuItem
              text="About"
              icon="info-sign"
              onClick={() => {
                toggleFaq(true);
              }}
            />
          </Menu>
        }
        position={Position.BOTTOM_RIGHT}
      >
        <Button minimal text="File" />
      </Popover2>
      <input
        type="file"
        id="load-project"
        accept=".json,.polotno"
        ref={inputRef}
        style={{ width: '180px', display: 'none' }}
        onChange={(e) => {
          var input = e.target;

          if (!input.files.length) {
            return;
          }

          var reader = new FileReader();
          reader.onloadend = function () {
            var text = reader.result;
            let json;
            try {
              json = JSON.parse(text);
            } catch (e) {
              alert('Can not load the project.');
            }

            if (json) {
              store.loadJSON(json);
              input.value = '';
            }
          };
          reader.onerror = function () {
            alert('Can not load the project.');
          };
          reader.readAsText(input.files[0]);
        }}
      />
      <Dialog
        icon="info-sign"
        onClose={() => toggleFaq(false)}
        title="About Canvas Studio"
        isOpen={faqOpened}
        style={{
          width: '80%',
          maxWidth: '700px',
        }}
      >
        <div className={Classes.DIALOG_BODY}>
          <h2>Contact Us</h2>
          <p>
            Canvas Studio created by <a href="https://www.peopleperhour.com/site/register?rfrd=5560900.5" target="_blank" rel="noreferrer">
            Vladislav Novikov
            </a>{' '}
            and is powered by{' '}
            <a href="https://polotno.dev/" target="_blank" rel="noreferrer">
              Polotno SDK project
            </a>
            .
          </p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => toggleFaq(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
});
