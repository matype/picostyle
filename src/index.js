var _id = 0
var sheet = document.head.appendChild(document.createElement("style")).sheet
var serialize = JSON.stringify.bind(null)

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase()
}

function insert(rule) {
  sheet.insertRule(rule, 0)
}
function createClassname(obj) {
  var classname = "p" + _id++;
  parse(obj, "." + classname);
  return classname;
}
function parse(obj, classname, isInsideObj, shouldWrap) {
  var string = "";
  isInsideObj = isInsideObj || 0;
  for (var prop in obj) {
    var value = obj[prop];
    prop = hyphenate(prop);
    var isMedia = /^@/.test(prop);
    if (typeof value == "object") {
      if (!isMedia && /:/.test(prop)) {
        prop = classname + prop;
      }
      var newString = prop + "{" + parse(value, classname, 1, isMedia) + "}";
      if (!isInsideObj) {
        insert(newString);
      } else {
        string = string + newString;
      }
    } else {
      string =
        string +
        (shouldWrap ? classname + "{" : "") +
        prop +
        ":" +
        value +
        ";" +
        (shouldWrap ? "}" : "");
    }
  }
  if (!isInsideObj) {
    string = classname + "{" + string + "}";
    insert(string);
  }
  return string;
}
export default function(h) {
  return function(nodeName) {
    var cache = {}
    return function(decls) {
      var isDeclsFunction = typeof decls === "function"

      return function(attributes, children) {
        attributes = attributes || {}
        children = attributes.children || children
        var key = serialize(attributes)
        cache[key] ||
          (cache[key] =
            (isDeclsFunction && createClassname(decls(attributes))) || createClassname(decls))
        var node = h(nodeName, attributes, children)
        node.attributes.class = [attributes.class, cache[key]]
          .filter(Boolean)
          .join(" ")
        return node
      }
    }
  }
}
