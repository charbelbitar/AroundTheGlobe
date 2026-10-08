export default function Pagination({
  page,
  totalPages,
  onPageChange
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">

      <button
        className="pagination-button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </button>

      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <button
              key={pageNumber}
              className={`pagination-number ${
                page === pageNumber ? 'active' : ''
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        className="pagination-button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>

    </div>
  );
}