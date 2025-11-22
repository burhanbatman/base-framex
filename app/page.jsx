import React from 'react';
import { decodeGrid, renderGridToHtml } from '../lib/sudoku';

export default function Page({ searchParams }) {
  const g = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search).get('g') : (searchParams && searchParams.g) || undefined;
  const grid = decodeGrid(g);
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, Roboto, sans-serif' }}>
      <h1>Sudoku Frame — Web preview</h1>
      <div dangerouslySetInnerHTML={{ __html: renderGridToHtml(grid) }} />
      <p style={{ marginTop: 12 }}>This page is a web preview. For Farcaster Frame functionality, point your manifest to <code>/api/frame</code>.</p>
    </div>
  );
}