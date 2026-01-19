import React from 'react';

const NewsList = ({ news, onEdit, onDelete }: any) => {
  return (
    <div className="mt-8">
      {news.map((item: any) => (
        <div key={item.id} className="p-6 mb-4 bg-white rounded-lg shadow-md flex justify-between items-start transition duration-200 hover:shadow-lg">
          <div className="w-4/5">
            <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
            <p className="text-gray-600 break-words">{item.content}</p>
          </div>
          <div className="flex-shrink-0 ml-4 flex flex-col space-y-2">
            <button
              onClick={() => onEdit(item)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-200"
            >
              编辑
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-200"
            >
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;