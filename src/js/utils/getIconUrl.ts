const getIconUrl = (iconName: string = "") => {
  let iconUrl = "";

  import("../dynamic-import-test")
    .then(e => console.log(e))
    .catch(e => console.log(e));

  return iconUrl;
};

export default getIconUrl;
