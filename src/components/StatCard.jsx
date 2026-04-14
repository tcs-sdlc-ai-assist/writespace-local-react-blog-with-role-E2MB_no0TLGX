import PropTypes from "prop-types";

export function StatCard({ label, count, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl text-indigo-600">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  icon: PropTypes.node,
};

StatCard.defaultProps = {
  icon: null,
};