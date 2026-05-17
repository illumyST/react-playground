// filepath: react-playground/src/pages/HomePage.tsx
import { Button } from '@/components/primitives';

const HomePage = () => {
  return (
    <div className="p-xl space-y-lg">
      <h1 className="text-2xl font-bold">Button Playground</h1>
      
      <section className="space-y-md">
        <h2 className="text-lg font-semibold">Variants</h2>
        <div className="flex gap-sm flex-wrap">
          <Button variant="filled" color="primary">Filled</Button>
          <Button variant="outlined" color="primary">Outlined</Button>
          <Button variant="ghost" color="primary">Ghost</Button>
          <Button variant="text" color="primary">Text</Button>
        </div>
      </section>

      <section className="space-y-md">
        <h2 className="text-lg font-semibold">Colors</h2>
        <div className="flex gap-sm flex-wrap">
          <Button color="primary">Primary</Button>
          <Button color="product">Product</Button>
        </div>
      </section>

      <section className="space-y-md">
        <h2 className="text-lg font-semibold">Sizes</h2>
        <div className="flex gap-sm items-center flex-wrap">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </section>

      <section className="space-y-md">
        <h2 className="text-lg font-semibold">States</h2>
        <div className="flex gap-sm flex-wrap">
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;