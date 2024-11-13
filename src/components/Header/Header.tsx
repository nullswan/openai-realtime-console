import React, { useState } from 'react';
import { Plus, X, Clipboard } from 'react-feather';
import { Button } from '../../@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://localhost:3000/g/${lastParameter}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isTellMeMoreRoute = location.pathname === '/tell-me-more';
  const isDiscoverRoute = location.pathname.includes('/discover');

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const lastParameter = location.pathname.split('/').pop();

  return (
    <header className="fixed top-0 left-0 right-0 w-screen bg-white h-fit flex items-center justify-between p-4 px-8">
      <div className="flex items-center gap-2" onClick={() => navigate('/')}>
        <img src="/logo.svg" alt="Discover logo" />
      </div>
      <div className="flex items-center gap-6">
        {isTellMeMoreRoute ? (
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800"
            onClick={() => navigate('/')}
          >
            Submit Knowledge
          </Button>
        ) : (
          <>
            {isDiscoverRoute && (
              <Button
                size="sm"
                className="gap-1 bg-black text-white hover:bg-black/90 rounded-full px-3"
                onClick={openModal}
              >
                Publish
              </Button>
            )}
            <Button
              size="sm"
              className="gap-1 bg-black text-white hover:bg-black/90 rounded-full px-3"
              onClick={() => navigate('/what-to-learn')}
            >
              <Plus className="h-4 w-4" />
              New
            </Button>
            <Button
              size="sm"
              className="text-white bg-green-500 hover:bg-green-600 rounded-full"
            >
              ET
            </Button>
          </>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md relative max-w-md mx-auto min-w-[40%] min-h-[20%]">
            <button
              className="absolute top-2 right-2"
              onClick={closeModal}
            >
              <X size={16} />
            </button>
            <h2 className="text-xl font-semibold">Published!</h2>
            <hr className="my-4" />
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-gray-100 p-2 rounded-md w-full flex items-center justify-center">
                <input
                  type="text"
                  readOnly
                  value={`https://localhost:3000/g/${lastParameter}`}
                  className="bg-transparent w-full text-center text-black"
                  onClick={handleCopy}
                />
                <Clipboard className="h-5 w-5 ml-2 cursor-pointer" onClick={handleCopy} />
              </div>
              <div className="flex space-x-4">
                <button
                  className="mt-4 bg-black text-white px-4 py-2 rounded-full"
                  onClick={() => window.open(`http://localhost:3000/g/${lastParameter}`, '_blank')} 
                >
                  Open It
                </button>
              </div>
            </div>
            {copied && <div className="text-green-500 mt-2">Link copied!</div>}
          </div>
        </div>
      )}
    </header>
  );
} 