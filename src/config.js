export default process.env.NODE_ENV === 'production' ?
  {
    baseApiUrl: "$(baseApiUrl)"
  } :
  {
    baseApiUrl: "https://test.api.lod-misis.ru"
  };
