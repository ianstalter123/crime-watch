$(function() {


queryDict = {};
location.search.substr(1).split("&").forEach(function(item) {
queryDict[item.split("=")[0]] = item.split("=")[1]
})


$("#name").val(decodeURI(queryDict.q))
$("#image").val(decodeURI(queryDict.i))

console.log($("#name"))
})