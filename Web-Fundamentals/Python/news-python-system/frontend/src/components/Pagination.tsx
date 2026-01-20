interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // 处理总页数为0或1的情况
  if (totalPages <= 1) return null;
  
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 border rounded disabled:opacity-50 hover:not-disabled:bg-gray-100 transition-colors"
        aria-label="上一页"
      >
        上一页
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 mx-1 rounded transition-colors ${
            currentPage === page 
              ? 'bg-blue-500 text-white border-blue-600' 
              : 'bg-gray-200 hover:bg-gray-300 border-gray-300'
          }`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 border rounded disabled:opacity-50 hover:not-disabled:bg-gray-100 transition-colors"
        aria-label="下一页"
      >
        下一页
      </button>
    </div>
  );
};

export default Pagination;