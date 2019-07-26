export const postUser = user => $.ajax({
  url: '/api/users',
  method: 'POST',
  data: { user },
});