"use client";

import React, { useState } from "react";

interface KeywordsProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const Keywords: React.FC<KeywordsProps> = ({ value, onChange }) => {
  const [keyword, setKeyword] = useState<string>("");

  const addKeyword = () => {
    if (keyword.trim() !== "" && !value.includes(keyword.trim())) {
      const updatedKeywords = [...value, keyword.trim()];
      onChange(updatedKeywords);
      setKeyword("");
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    const updatedKeywords = value.filter((_, index) => index !== indexToRemove);
    onChange(updatedKeywords);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a keyword..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addKeyword}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((kw, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
          >
            <span>{kw}</span>
            <button
              onClick={() => removeKeyword(index)}
              className="text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keywords;
