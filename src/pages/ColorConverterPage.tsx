import { useState } from 'react';
import { Input } from '@/components';

const hexRegex = /^#([A-Fa-f0-9]{6})$/i;
const rgbRegex =
  /^\s*(([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\s*,\s*){2}([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\s*$/;

const hexToRgb = (hex: string) => {
  if (!hexRegex.test(hex)) return null;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => {
    const hex = c.toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
};

const ColorConverterPage = (): React.ReactNode => {
  const [hex, setHex] = useState('#41382F');
  const [rgb, setRgb] = useState('65, 56, 47');

  const [hexError, setHexError] = useState(false);
  const [rgbError, setRgbError] = useState(false);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);
    if (hexRegex.test(val)) {
      setHexError(false);
      const converted = hexToRgb(val);
      if (converted) {
        setRgb(`${converted.r}, ${converted.g}, ${converted.b}`);
        setRgbError(false);
      } else {
        setHexError(true);
      }
    } else {
      setHexError(true);
    }
  };

  const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRgb(val);
    const cleaned = val.replace(/\s/g, '');
    if (rgbRegex.test(cleaned)) {
      const parts = cleaned.split(',').map((n) => parseInt(n, 10));
      if (parts.length === 3) {
        const hexStr = rgbToHex(parts[0], parts[1], parts[2]);
        setHex(hexStr);
        setHexError(false);
        setRgbError(false);
      } else {
        setRgbError(true);
      }
    } else {
      setRgbError(true);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setHex(val);
    setHexError(false);
    const converted = hexToRgb(val);
    if (converted) {
      setRgb(`${converted.r}, ${converted.g}, ${converted.b}`);
      setRgbError(false);
    }
  };

  const validHex = hexRegex.test(hex) ? hex : '#000000';

  return (
    <div className="space-y-xl">
      <h1 className="title-2xl">Color Converter</h1>

      <div className="flex flex-col gap-xl lg:flex-row">
        {/* Left Input Section */}
        <div className="flex-1 space-y-lg">
          <div className="space-y-sm">
            <label htmlFor="hex-input" className="text-base font-bold text-on-surface">
              Hex String
            </label>
            <Input
              id="hex-input"
              type="text"
              value={hex}
              onChange={handleHexChange}
              inputSize="large"
              className={hexError ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {hexError && (
              <p className="text-sm text-red-500">
                Invalid value! Please provide 6 hex characters.
              </p>
            )}
          </div>

          <div className="space-y-sm">
            <label htmlFor="rgb-input" className="text-base font-bold text-on-surface">
              RGB
            </label>
            <Input
              id="rgb-input"
              type="text"
              value={rgb}
              onChange={handleRgbChange}
              inputSize="large"
              className={rgbError ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {rgbError && (
              <p className="text-sm text-red-500">
                Invalid value! Remember to add ',' between 0-255 numbers.
              </p>
            )}
          </div>
        </div>

        {/* Right Picker Section */}
        <div className="relative flex flex-1 flex-col items-center justify-center rounded-md border border-outline bg-surface-1 p-lg">
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface-1 px-md py-sm font-bold text-on-surface shadow-light-down-2">
            {hexRegex.test(hex) ? hex : 'Invalid'}
          </div>
          <input
            type="color"
            value={validHex}
            onChange={handleColorPickerChange}
            className="aspect-square w-full max-w-[400px] cursor-pointer overflow-hidden rounded-xl border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-xl [&::-webkit-color-swatch]:border-none"
            style={{ minHeight: '250px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorConverterPage;
