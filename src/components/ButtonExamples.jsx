import React, { useState } from 'react';
import Button from './Button';

/**
 * Examples demonstrating the Button component's various configurations
 * This file serves as both documentation and testing playground
 */
const ButtonExamples = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleLoadingDemo = async () => {
    setIsLoading(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleClick = () => {
    setClickCount(prev => prev + 1);
  };

  // Example icons using simple SVGs
  const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Button Component Examples</h1>
        <p className="text-gray-600 mb-8">
          Interactive examples of the Button component with different variants, sizes, and states.
          Click count: <span className="font-semibold text-blue-600">{clickCount}</span>
        </p>

        {/* Variants Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" onClick={handleClick}>
              Primary
            </Button>
            <Button variant="secondary" onClick={handleClick}>
              Secondary
            </Button>
            <Button variant="outline" onClick={handleClick}>
              Outline
            </Button>
            <Button variant="ghost" onClick={handleClick}>
              Ghost
            </Button>
            <Button variant="danger" onClick={handleClick}>
              Danger
            </Button>
            <Button variant="success" onClick={handleClick}>
              Success
            </Button>
          </div>
        </section>

        {/* Sizes Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="small" onClick={handleClick}>
              Small
            </Button>
            <Button size="medium" onClick={handleClick}>
              Medium
            </Button>
            <Button size="large" onClick={handleClick}>
              Large
            </Button>
            <Button size="xl" onClick={handleClick}>
              Extra Large
            </Button>
          </div>
        </section>

        {/* States Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Button States</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleClick}>
              Normal
            </Button>
            <Button disabled>
              Disabled
            </Button>
            <Button loading={isLoading} onClick={handleLoadingDemo}>
              {isLoading ? 'Loading...' : 'Click to Load'}
            </Button>
          </div>
        </section>

        {/* With Icons Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<PlusIcon />} onClick={handleClick}>
              Add Item
            </Button>
            <Button rightIcon={<ArrowIcon />} onClick={handleClick}>
              Continue
            </Button>
            <Button 
              leftIcon={<PlusIcon />} 
              rightIcon={<ArrowIcon />} 
              variant="outline"
              onClick={handleClick}
            >
              Both Icons
            </Button>
          </div>
        </section>

        {/* Full Width Section */}
        <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Full Width Buttons</h2>
          <div className="space-y-3">
            <Button fullWidth variant="primary" onClick={handleClick}>
              Full Width Primary
            </Button>
            <Button fullWidth variant="outline" onClick={handleClick}>
              Full Width Outline
            </Button>
          </div>
        </section>

        {/* Form Example */}
        <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">In Form Context</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleClick(); }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                Submit
              </Button>
              <Button type="button" variant="secondary" onClick={() => setClickCount(0)}>
                Reset Count
              </Button>
            </div>
          </form>
        </section>

        {/* Accessibility Notes */}
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Accessibility Features</h2>
          <ul className="text-blue-800 space-y-2">
            <li>• <strong>Keyboard Navigation:</strong> Full support for Enter and Space key activation</li>
            <li>• <strong>Focus Management:</strong> Clear focus indicators with proper ring colors</li>
            <li>• <strong>ARIA Attributes:</strong> Proper aria-disabled states for screen readers</li>
            <li>• <strong>Motion Preferences:</strong> Respects user's motion preferences</li>
            <li>• <strong>Color Contrast:</strong> WCAG AA compliant color combinations</li>
            <li>• <strong>Loading States:</strong> Clear feedback for async operations</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ButtonExamples;