import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, InputGroup, Menu, HTMLSelect, Slider, Classes, Dialog } from '@blueprintjs/core';
import * as unit from 'polotno/utils/unit';
import { t } from 'polotno/utils/l10n';
import { downloadFile } from 'polotno/utils/download';

export const DownloadButton = observer(({ store }) => {
  const [saving, setSaving] = React.useState(false);
  const [quality, setQuality] = React.useState(1);
  const [type, setType] = React.useState('png');
  const inputRef = React.useRef();

  const getName = () => {
    const texts = [];
    store.pages.forEach((p) => {
      p.children.forEach((c) => {
        if (c.type === 'text') {
          texts.push(c.text);
        }
      });
    });
    const allWords = texts.join(' ').split(' ');
    const words = allWords.slice(0, 6);
    return words.join(' ').replace(/\s/g, '-').toLowerCase() || 'canvas';
  };

  const [faqOpened, toggleFaq] = React.useState(false);

  return (
    <>
      <Button
        icon="import"
        text={t('toolbar.download')}
        intent="primary"
        loading={saving}
        onClick={() => {
          toggleFaq(true);
        }}
      />

      <Dialog
        icon="floppy-disk"
        onClose={() => toggleFaq(false)}
        title="Save As"
        isOpen={faqOpened}
        style={{
          width: '80%',
          maxWidth: '700px',
        }}
      >
        <div className={Classes.DIALOG_BODY}>
          <Menu>
            <li className="bp4-menu-header">
              <h6 className="bp4-heading">File name</h6>
            </li>
            <InputGroup
              placeholder="Input file name..."
              style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}
              inputRef={inputRef}
            />

            <li className="bp4-menu-header">
              <h6 className="bp4-heading">File type</h6>
            </li>
            <HTMLSelect
              fill
              onChange={(e) => {
                setType(e.target.value);
                setQuality(1);
              }}
              value={type}
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
            </HTMLSelect>
            {type !== "json" ?
              <>
                <li className="bp4-menu-header">
                  <h6 className="bp4-heading">Size</h6>
                </li>
                <div style={{ padding: '10px' }}>
                  <Slider
                    value={quality}
                    labelRenderer={false}
                    // labelStepSize={0.4}
                    onChange={(quality) => {
                      setQuality(quality);
                    }}
                    stepSize={0.2}
                    min={0.2}
                    max={3}
                    showTrackFill={false}
                  />
                  {type === 'pdf' && (
                    <div>
                      {unit.pxToUnitRounded({
                        px: store.width,
                        dpi: store.dpi / quality,
                        precious: 0,
                        unit: 'mm',
                      })}{' '}
                      x{' '}
                      {unit.pxToUnitRounded({
                        px: store.height,
                        dpi: store.dpi / quality,
                        precious: 0,
                        unit: 'mm',
                      })}{' '}
                      mm
                    </div>
                  )}
                  {type !== 'pdf' && (
                    <div>
                      {Math.round(store.width * quality)} x{' '}
                      {Math.round(store.height * quality)} px
                    </div>
                  )}
                </div>
              </> : <div><br /></div>}
            <Button
              fill
              intent="primary"
              loading={saving}
              onClick={async () => {
                // Get custom file name
                const fileName = (inputRef.current.value) ? inputRef.current.value : getName();
                
                if (type === 'json') {
                  const json = store.toJSON();
                  const url =
                    'data:text/json;base64,' +
                    window.btoa(
                      unescape(encodeURIComponent(JSON.stringify(json)))
                    );

                  downloadFile(url, `${fileName}.json`);
                } else if (type === 'pdf') {
                  setSaving(true);
                  await store.saveAsPDF({
                    fileName: `${fileName}.pdf`,
                    dpi: store.dpi / quality,
                    pixelRatio: 2 * quality,
                  });
                  setSaving(false);
                } else {
                  store.pages.forEach((page, index) => {
                    // do not add index if we have just one page
                    const indexString =
                      store.pages.length > 1 ? '-' + (index + 1) : '';
                    store.saveAsImage({
                      pageId: page.id,
                      pixelRatio: quality,
                      mimeType: 'image/' + type,
                      fileName: `${fileName}${indexString}.${type}`,
                    });
                  });
                }
              }}
            >
              Download {type.toUpperCase()}
            </Button>
          </Menu>
        </div>
      </Dialog>
    </>
  );
});
