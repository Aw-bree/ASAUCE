export const fetchAttributes = () => $.ajax({
  url: '/api/attributes',
  method: 'GET'
});