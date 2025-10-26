import { Suspense } from 'react';
import { Button } from '@/components';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Home Page</h1>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button loading>Loading...</Button>
        </div>
        <div className="space-x-2">
          <button
            className="text-sm underline"
            onClick={() => document.documentElement.classList.toggle('dark')}
          >
            Toggle dark
          </button>
        </div>
      </div>
    </Suspense>
  );
}
