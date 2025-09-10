// utils.mjs

// get parameter from URL
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// store data in localStorage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// get data from localStorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}