import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageGallery from './components/ImageGallery';

function App() {
  return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <ImageGallery />
        </main>
        <Footer />
      </div>
  );
}

export default App;
