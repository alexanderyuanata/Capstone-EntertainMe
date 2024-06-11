function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//function to check if parameter is an array and return the first element if so
function getFirstElement(data) {
  if (data == undefined) return undefined;

  return Array.isArray(data) ? data[0] : data;
}

//function for better encoding URI components
function customEncodeURIComponent(str) {
  // Replace all non-alphanumeric characters except spaces with an empty string
  let cleanedStr = str.replace(/[^a-zA-Z0-9 ]/g, "");
  // Replace spaces with '+'
  return cleanedStr.replace(/ /g, "+");
}

//function to delete a field from an object if it exists
function deleteObjectField(obj, field) {
  if (obj.hasOwnProperty(field)) {
      delete obj[field];
  }
}

module.exports = { getRandomIntInclusive, getFirstElement, customEncodeURIComponent, deleteObjectField }