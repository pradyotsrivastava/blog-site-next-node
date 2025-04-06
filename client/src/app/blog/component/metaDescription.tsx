"use client";

import { useEffect } from "react";

type MetaDescriptionProps = {
  value: string;
  onChange: (value: string) => void;
};

const MetaDescription = ({ value, onChange }: MetaDescriptionProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full">
        <input
          id="meta-description"
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder="Add meta description..."
          className="w-full p-2 outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default MetaDescription;
