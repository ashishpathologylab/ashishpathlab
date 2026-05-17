'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMove, FiType, FiImage, FiSave, FiRotateCcw, FiDownload } from 'react-icons/fi';
import Button from '@/components/ui/Button';

interface LetterheadElement {
  id: string;
  type: 'text' | 'logo' | 'line' | 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize?: number;
  fontColor?: string;
  bold?: boolean;
  alignment?: 'left' | 'center' | 'right';
  rotation?: number;
  opacity?: number;
}

interface DesignerPanelProps {
  initialElements?: LetterheadElement[];
  onSave: (elements: LetterheadElement[], previewUrl: string) => void;
  labName?: string;
  labAddress?: string;
}

export default function DesignerPanel({
  initialElements = [],
  onSave,
  labName = 'Your Lab Name',
  labAddress = 'Your Lab Address',
}: DesignerPanelProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<LetterheadElement[]>(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');

  const addText = () => {
    const newEl: LetterheadElement = {
      id: `el_${Date.now()}`,
      type: 'text',
      x: 50,
      y: 50,
      width: 200,
      height: 30,
      content: 'New Text',
      fontSize: 16,
      fontColor: '#000000',
      alignment: 'left',
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedId(newEl.id);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      const newEl: LetterheadElement = {
        id: `logo_${Date.now()}`,
        type: 'logo',
        x: 20,
        y: 20,
        width: 100,
        height: 100,
        content: url,
      };
      setElements((prev) => [...prev, newEl]);
    }
  };

  const updateElement = (id: string, updates: Partial<LetterheadElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const deleteSelected = () => {
    if (selectedId) {
      setElements((prev) => prev.filter((el) => el.id !== selectedId));
      setSelectedId(null);
    }
  };

  const selectedEl = elements.find((el) => el.id === selectedId);

  const handleSave = () => {
    const previewUrl = canvasRef.current ? 'data:image/svg+xml;base64,preview' : '';
    onSave(elements, previewUrl);
  };

  const handleDrag = (id: string, e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const el = elements.find((el) => el.id === id);
    if (!el) return;

    const handleMove = (me: MouseEvent) => {
      const dx = me.clientX - startX;
      const dy = me.clientY - startY;
      updateElement(id, { x: el.x + dx, y: el.y + dy });
    };

    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Toolbar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Elements</h3>
          <Button fullWidth size="sm" variant="outline" icon={<FiType className="h-4 w-4" />} onClick={addText}>Add Text</Button>
          <label className="block">
            <Button fullWidth size="sm" variant="outline" icon={<FiImage className="h-4 w-4" />}>
              Add Logo
            </Button>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>

        {selectedEl && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Properties</h3>
              <button onClick={deleteSelected} className="text-xs text-red-500 hover:text-red-700">Delete</button>
            </div>

            {selectedEl.type === 'text' && (
              <>
                <div>
                  <label className="text-xs text-gray-500">Content</label>
                  <input
                    type="text"
                    value={selectedEl.content}
                    onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs dark:bg-gray-700 dark:text-white mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Font Size</label>
                    <input
                      type="number"
                      value={selectedEl.fontSize || 16}
                      onChange={(e) => updateElement(selectedEl.id, { fontSize: parseInt(e.target.value) || 16 })}
                      className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs dark:bg-gray-700 dark:text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Color</label>
                    <input
                      type="color"
                      value={selectedEl.fontColor || '#000000'}
                      onChange={(e) => updateElement(selectedEl.id, { fontColor: e.target.value })}
                      className="w-full h-8 mt-1 cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Alignment</label>
                  <select
                    value={selectedEl.alignment || 'left'}
                    onChange={(e) => updateElement(selectedEl.id, { alignment: e.target.value as 'left' | 'center' | 'right' })}
                    className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-xs dark:bg-gray-700 dark:text-white mt-1"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </>
            )}

            {selectedEl.type === 'logo' && (
              <div>
                <label className="text-xs text-gray-500">Width</label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={selectedEl.width}
                  onChange={(e) => updateElement(selectedEl.id, { width: parseInt(e.target.value) })}
                  className="w-full mt-1"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">X: {selectedEl.x}</label>
                <input
                  type="range"
                  min="0"
                  max="800"
                  value={selectedEl.x}
                  onChange={(e) => updateElement(selectedEl.id, { x: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Y: {selectedEl.y}</label>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  value={selectedEl.y}
                  onChange={(e) => updateElement(selectedEl.id, { y: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button fullWidth icon={<FiSave className="h-4 w-4" />} onClick={handleSave}>Save</Button>
          <Button variant="ghost" icon={<FiRotateCcw className="h-4 w-4" />} onClick={() => setElements([])} />
        </div>
      </div>

      {/* Canvas */}
      <div className="lg:col-span-3">
        <div
          ref={canvasRef}
          className="relative bg-white rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-lg mx-auto"
          style={{
            width: '816px',
            height: '1056px',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Default header/footer */}
          <div className="absolute top-0 left-0 right-0 p-6 text-center border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{labName}</h2>
            <p className="text-xs text-gray-500 mt-1">{labAddress}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center border-t border-gray-200">
            <p className="text-xs text-gray-400">* This is a computer-generated report *</p>
          </div>

          {/* Draggable Elements */}
          {elements.map((el) => (
            <div
              key={el.id}
              onMouseDown={(e) => handleDrag(el.id, e)}
              onClick={() => setSelectedId(el.id)}
              className={`absolute cursor-move ${
                selectedId === el.id ? 'ring-2 ring-primary-500 ring-offset-2' : ''
              }`}
              style={{
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                opacity: el.opacity || 1,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
              }}
            >
              {el.type === 'text' && (
                <span
                  style={{
                    fontSize: el.fontSize || 16,
                    color: el.fontColor || '#000',
                    fontWeight: el.bold ? 'bold' : 'normal',
                    textAlign: el.alignment || 'left',
                    display: 'block',
                    width: '100%',
                  }}
                >
                  {el.content}
                </span>
              )}
              {el.type === 'logo' && el.content && (
                <img src={el.content} alt="logo" className="w-full h-full object-contain" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}