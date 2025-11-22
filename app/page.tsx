import { Metadata } from 'next';
import Head from 'next/head';

const FRAME_BASE_URL = "https://sudoku-farcaster-frame-plum.vercel.app";


const SUDOKU_IMAGE_URL = `${FRAME_BASE_URL}/api/frame?state=start`;

export const metadata: Metadata = {
  title: 'Farcaster Sudoku Frame',
  description: 'The first playable Sudoku mini-app on Farcaster.',
  openGraph: {
    title: 'Farcaster Sudoku Frame',
    description: 'Start playing Sudoku now!',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': SUDOKU_IMAGE_URL,
    'fc:frame:post_url': `${FRAME_BASE_URL}/api/frame`,
    'fc:frame:button:1': '▶️ Start Game', // "Oyuna Başla"
    'fc:frame:button:1:action': 'post',
  },
};

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Sudoku Farcaster Mini-App</h1>
      <p>This is an interactive Sudoku game Frame playable on Warpcast. Click the "Start Game" button to begin playing.</p>
      <p>⚠️ REMEMBER: You must replace the `FRAME_BASE_URL` variable with your actual Vercel URL after deployment.</p>
    </div>
  );
}