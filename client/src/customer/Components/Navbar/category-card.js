import React from 'react';

export function CategoryCard({ category, onNavigate }) {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow">
      <h2 className="text-lg font-bold mb-3 text-center text-gray-800">
        {category.name}
      </h2>
      {category.subcategories?.length > 0 && (
        <ul className="space-y-2">
          {category.subcategories.map((subcategory) => (
            <li key={subcategory._id} className="text-center">
              <button
                onClick={() => onNavigate(`/category/${category._id}/${subcategory._id}`)}
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm transition-colors"
              >
                {subcategory.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

