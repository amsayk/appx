import React, {} from 'react';

import memoize from 'lru-memoize';

export default memoize(10)(function createHighlighter(input){
  input = input.replace(/^[^\w]+|[^\w]+$/g, '').replace(/[^\w'\-]+/g, '|');

  const colors = ['#ff6', '#a0ffff', '#9f9', '#f99', '#f6f'];
  const wordColor = [];

  let colorIdx = 0;

  let regs = null;

  let re = '(' + input + ')';
  /* if(!openLeft)  */ re = '\\b' + re;
  // /* if(!openRight) */ re = re + '\\b';

  const matchRegex = new RegExp(re, 'i');

  return {
    highlight(nodeValue){
      if((regs = matchRegex.exec(nodeValue)) && regs[0]){

        if(!wordColor[regs[0].toLowerCase()]) {
          wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
        }

        const match = (
          <em style={{ backgroundColor: wordColor[regs[0].toLowerCase()], fontStyle: 'inherit', color: '#000', }}>{regs[0]}</em>
        );

        const before = nodeValue.substring(0, regs.index);
        const after = nodeValue.substring(regs[0].length);

        return (
          <span>
          {before}
          {match}
          {after}
          </span>
        );
      }

      return nodeValue;
    }
  }
});
