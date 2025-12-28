import React from 'react';
import { FaFileAlt, FaFileUpload, FaExclamationCircle } from 'react-icons/fa';

const Documents = ({ documents = [], getStatusColor }) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto">
      {/* Documents Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/10">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white text-lg font-bold flex items-center gap-2">
              <FaFileUpload className="text-purple-600" />
              All Documents
            </h3>
            <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full">
              {documents.length} total
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[600px]">
          {documents.length > 0 ? (
            <div className="flex flex-col">
              {documents.map((doc, index) => (
                <div key={doc.id || index} className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <FaFileAlt className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>By: {doc.uploaded_by}</span>
                      <span>•</span>
                      <span>Type: {doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {doc.uploaded_at}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <FaExclamationCircle className="text-3xl text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No documents found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Documents will appear here when uploaded</p>
            </div>
          )}
        </div>
        {documents.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              View All Documents →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;