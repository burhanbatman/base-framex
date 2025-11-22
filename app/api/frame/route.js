import { decodeGrid, encodeGrid, renderGridToHtml, updateCell, newPuzzle } from '../../../lib/sudoku';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const row = parseInt(searchParams.get('row') || '-1', 10) - 1; // 0-based internally
  const col = parseInt(searchParams.get('col') || '-1', 10) - 1;
  const num = parseInt(searchParams.get('num') || '-1', 10);
  const gEncoded = searchParams.get('g');

  let grid = decodeGrid(gEncoded);

  // Apply an update action
  if (action === 'apply') {
    if (row >= 0 && col >= 0 && num >= 1 && num <= 9) {
      grid = updateCell(grid, row, col, num);
    }
    // Redirect to main view with updated grid encoded
    const newG = encodeGrid(grid);
    return new Response(JSON.stringify({
      type: 'frame',
      // show updated grid
      content: `<div style="padding:10px">${renderGridToHtml(grid)}<p style='margin-top:8px'>Cell updated: row ${row+1}, col ${col+1} → ${num}</p></div>`,
      buttons: [
        { label: 'Select Cell', uri: `/api/frame?action=select_row&g=${newG}` },
        { label: 'New Puzzle', uri: `/api/frame?action=new&g=${encodeGrid(newPuzzle())}` },
        { label: 'Reset', uri: `/api/frame?g=${encodeGrid(newPuzzle())}` }
      ]
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  // New puzzle
  if (action === 'new') {
    grid = newPuzzle();
    const newG = encodeGrid(grid);
    return new Response(JSON.stringify({
      type: 'frame',
      content: `<div style="padding:10px">${renderGridToHtml(grid)}<p style='margin-top:8px'>New puzzle generated.</p></div>`,
      buttons: [
        { label: 'Select Cell', uri: `/api/frame?action=select_row&g=${newG}` },
        { label: 'Reset', uri: `/api/frame?g=${newG}` }
      ]
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Row selection (paged: page 1 => rows 1-3, page 2 => 4-6, page 3 => 7-9)
  if (action === 'select_row') {
    const start = (Math.max(1, page) - 1) * 3 + 1;
    const buttons = [];
    for (let r = start; r < start + 3 && r <= 9; r++) {
      buttons.push({ label: `Row ${r}`, uri: `/api/frame?action=select_col&row=${r}&page=1&g=${encodeGrid(grid)}` });
    }
    if (page < 3) buttons.push({ label: 'More', uri: `/api/frame?action=select_row&page=${page+1}&g=${encodeGrid(grid)}` });

    return new Response(JSON.stringify({
      type: 'frame',
      content: `<div style="padding:10px"><p>Select a ROW (page ${page})</p></div>`,
      buttons
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Column selection (paged similar to rows)
  if (action === 'select_col') {
    const start = (Math.max(1, page) - 1) * 3 + 1;
    const buttons = [];
    for (let c = start; c < start + 3 && c <= 9; c++) {
      buttons.push({ label: `Col ${c}`, uri: `/api/frame?action=select_num&row=${row+1}&col=${c}&page=1&g=${encodeGrid(grid)}` });
    }
    if (page < 3) buttons.push({ label: 'More', uri: `/api/frame?action=select_col&row=${row+1}&page=${page+1}&g=${encodeGrid(grid)}` });

    return new Response(JSON.stringify({
      type: 'frame',
      content: `<div style="padding:10px"><p>Selected ROW ${row+1}. Now select a COLUMN (page ${page})</p></div>`,
      buttons
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Number selection (1-9 paged 3 per page)
  if (action === 'select_num') {
    const start = (Math.max(1, page) - 1) * 3 + 1;
    const buttons = [];
    for (let n = start; n < start + 3 && n <= 9; n++) {
      buttons.push({ label: `${n}`, uri: `/api/frame?action=apply&row=${row+1}&col=${col}&num=${n}&g=${encodeGrid(grid)}` });
    }
    if (page < 3) buttons.push({ label: 'More', uri: `/api/frame?action=select_num&row=${row+1}&col=${col}&page=${page+1}&g=${encodeGrid(grid)}` });

    return new Response(JSON.stringify({
      type: 'frame',
      content: `<div style="padding:10px"><p>Selected ROW ${row+1}, COL ${col}. Choose a NUMBER (page ${page})</p></div>`,
      buttons
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  // Default: show grid with main actions
  const g0 = encodeGrid(grid);
  return new Response(JSON.stringify({
    type: 'frame',
    content: `<div style="padding:10px">${renderGridToHtml(grid)}<p style='margin-top:8px'>Tap "Select Cell" to play — then choose row → column → number.</p></div>`,
    buttons: [
      { label: 'Select Cell', uri: `/api/frame?action=select_row&g=${g0}` },
      { label: 'New Puzzle', uri: `/api/frame?action=new&g=${encodeGrid(newPuzzle())}` },
      { label: 'Reset', uri: `/api/frame?g=${g0}` }
    ]
  }), { headers: { 'Content-Type': 'application/json' } });
}