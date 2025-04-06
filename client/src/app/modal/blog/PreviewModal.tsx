import { XIcon } from "lucide-react";

interface PreviewModalProps {
  handleCloseModal: () => void;
  previewContent: string;
  title: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  handleCloseModal,
  previewContent,
  title,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg lg:max-w-2xl w-full">
        <div className="flex flex-col justify-between">
          <div className="ml-auto">
            <XIcon
              className="p-1 rounded-full bg-blue-500 text-white cursor-pointer hover:bg-blue-600"
              onClick={handleCloseModal}
            />
          </div>
          {title ? (
            <div className="text-xl font-semibold mb-4">{title}</div>
          ) : (
            <div className="text-sm font-semibold mb-4 text-gray-200">
              Title not available
            </div>
          )}
        </div>
        {previewContent ? (
          <div
            className="p-4 border rounded-lg overflow-y-auto max-h-96"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        ) : (
          <div>
            <div className="text-sm font-semibold text-gray-200">
              Preview not available
            </div>
            <div className="text-xs text-gray-200">
              Please write something in editor.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
