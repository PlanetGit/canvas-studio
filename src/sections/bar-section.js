import React from 'react';
import { observer } from 'mobx-react-lite';
import { SectionTab } from 'polotno/side-panel';
import * as svg from 'polotno/utils/svg';
import FaBarcode from '@meronex/icons/fa/FaBarcode';
import { Button, InputGroup } from '@blueprintjs/core';
import { barcode} from 'pure-svg-code';

// create svg image for Bar code for input text
export function getBar(text) {
  const svgString = barcode(text, "code128", {width:'50', barWidth:1, barHeight:50, bgColor: 'white'});
  return svg.svgToURL(svgString);
}

// define the new custom section
export const BarSection = {
  name: 'bar',
  Tab: (props) => (
    <SectionTab name="Bar code" {...props}>
      <FaBarcode />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: observer(({ store }) => {
    const inputRef = React.useRef();

    return (
      <div>
        <h3 style={{ marginBottom: '10px', marginTop: '5px' }}>Bar code</h3>
        <p>Generate Bar code with any URL you want.</p>
        <InputGroup
          placeholder="Paste URL here"
          style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}
          inputRef={inputRef}
        />

        <Button
          onClick={() => {
            const src = getBar(inputRef.current.value);

            store.activePage.addElement({
              type: 'svg',
              name: 'bar',
              x: 50,
              y: 50,
              width: 200,
              height: 100,
              src,
            });
          }}
          fill
          intent="primary"
        >
          Add new Bar code
        </Button>
      </div>
    );
  }),
};
