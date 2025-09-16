// src/app/sign/[token]/page.tsx
'use client';

import { Suspense } from 'react';
import SigningFlow from './SigningFlow'; // Import the new component

function Page({ params }: { params: { token: string } }) {
  const { token } = params;
  return <SigningFlow token={token} />;
}


// Wrapper component to use Suspense
export default function SigningPageWrapper({ params }: { params: { token: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page params={params} />
    </Suspense>
  );
}
