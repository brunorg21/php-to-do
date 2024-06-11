export default function setHeaders(headers: HeadersInit) {
  if (localStorage.token) {
    return {
      ...headers,
      Authorization: `Bearer ${localStorage.token}`,
    };
  } else {
    return headers;
  }
}
