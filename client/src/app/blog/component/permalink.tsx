import { useState, useEffect } from "react";

type PermalinkProps = {
  title: string; 
  value: string; 
  onChange: (value: string) => void; 
};

const Permalink = ({ title, value, onChange }: PermalinkProps) => {
  let newURL = value;

  const [linkType, setLinkType] = useState<"default" | "custom">(
    value ? "default" : "custom"
  );

  const generatePermalink = (input: string) => {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSlugChange = (input: string) => {
    const generatedSlug = generatePermalink(input);
    newURL = generatedSlug;
    onChange(generatedSlug);
  };

  useEffect(() => {
    if (linkType === "default") {
      const generatedSlug = generatePermalink(title);
      newURL = generatedSlug;
      onChange(generatedSlug);
    }
  }, [title, linkType, onChange]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full text-gray-500">
        <span>
          your-website/
          {linkType === "default" ? generatePermalink(title) : newURL}.com
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="linkType"
            value="default"
            checked={linkType === "default"}
            onChange={() => {
              setLinkType("default");
              const generatedSlug = generatePermalink(title);
              newURL = generatedSlug;
              onChange(generatedSlug);
            }}
            className="form-radio"
          />
          Default permalink
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="linkType"
            value="custom"
            checked={linkType === "custom"}
            onChange={() => setLinkType("custom")}
            className="form-radio"
          />
          Custom permalink
        </label>
      </div>

      {linkType === "custom" && (
        <div className="w-full">
          <input
            type="text"
            value={newURL}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="Enter custom slug..."
            className="w-full p-2 border-b-2 border-gray-500 outline-none focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default Permalink;
