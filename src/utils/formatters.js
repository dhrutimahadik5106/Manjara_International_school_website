export const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
};
