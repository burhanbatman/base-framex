const presetPuzzle = [
  [5,3,null, null,7,null, null,null,null],
  [6,null,null, 1,9,5, null,null,null],
  [null,9,8, null,null,null, null,6,null],
  [8,null,null, null,6,null, null,null,3],
  [4,null,null, 8,null,3, null,null,1],
  [7,null,null, null,2,null, null,null,6],
  [null,6,null, null,null,null, 2,8,null],
  [null,null,null, 4,1,9, null,null,5],
  [null,null,null, null,8,null, null,7,9]
];

export function newPuzzle() {
  // For demo return a deep copy of preset. Replace with a generator for production.
  return presetPuzzle.map(row => row.map(c => c === null ? null : c));
}

export function cloneGrid(grid) {
  return grid.map(row => row.map(c => c === undefined ? null : c));
}

export function updateCell(grid, row, col, num) {
  const g = cloneGrid(grid);
  if (row < 0 || row > 8 || col < 0 || col > 8) return g;
  // allow overwrite for demo; you can add immutable preset checking
  g[row][col] = num;
  return g;
}

export function renderGridToHtml(grid) {
  let html = '<table style="border-collapse:collapse; border:3px solid #222; font-family:monospace;">';
  for (let r = 0; r < 9; r++) {
    html += '<tr>';
    for (let c = 0; c < 9; c++) {
      const val = grid && grid[r] && grid[r][c] !== null && grid[r][c] !== undefined ? grid[r][c] : '';
      const cellStyle = 'width:32px;height:32px;text-align:center;border:1px solid #999;';
      // Thicker borders for 3x3 boxes
      let extra = '';
      if (c % 3 === 0) extra += 'border-left:3px solid #222;';
      if (r % 3 === 0) extra += 'border-top:3px solid #222;';
      if (c === 8) extra += 'border-right:3px solid #222;';
      if (r === 8) extra += 'border-bottom:3px solid #222;';
      html += `<td style="${cellStyle}${extra}">${val}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  return html;
}

export function encodeGrid(grid) {
  try {
    const s = JSON.stringify(grid);
    return Buffer.from(s).toString('base64url');
  } catch (e) {
    return '';
  }
}

export function decodeGrid(encoded) {
  try {
    if (!encoded) return newPuzzle();
    const s = Buffer.from(encoded, 'base64url').toString();
    const g = JSON.parse(s);
    return cloneGrid(g);
  } catch (e) {
    return newPuzzle();
  }
}