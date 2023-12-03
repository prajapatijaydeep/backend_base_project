function filterJson(data: object, listOfFields: string[]) {
  const finalReturn: object = {};

  for (let i = 0; i < listOfFields.length; i++) {
    const fieldName = listOfFields[i].trim();
    finalReturn[fieldName] = data[fieldName];
  }

  return finalReturn;
}

const removeExtraFields = async (type: string, data: Record<string, any>) => {
  let { _id, __v, ...rest } = data;

  return {
    [type + "Id"]: _id,
    ...rest,
  };
};

const objectToDotNotation = async (args) => {
  const setObject = {};
  Object.keys(args).forEach((key) => {
    if (Object.prototype.toString.call(args[key]) === "[object Array]") {
      setObject[key] = args[key];
    } else if (typeof args[key] === "object" && args[key]) {
      Object.keys(args[key]).forEach((subkey) => {
        setObject[`${key}.${subkey}`] = args[key][subkey];
      });
    } else {
      setObject[key] = args[key];
    }
  });
  return setObject;
};

export { filterJson, objectToDotNotation, removeExtraFields };
