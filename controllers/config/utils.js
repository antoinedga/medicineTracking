const {Config} = require('../../models');
const config = require('../../config');
const {configTypes} = require('./configTypes');


/**
 *
 * @param {string} name
 * @return {function(any,any): any} Request response function
 */
function setConfig(name) {
  return (req, res) => {
    if (!configTypes.has(name)) {
      return res
          .status(400)
          .json({
            response: false,
            message: `${name} is not a valid config`,
            content: undefined,
          });
    }
    const value = req.body.value;
    const validation = configTypes.get(name)(value);
    if (!validation.valid) {
      return res
          .status(400)
          .json({
            response: false,
            message: validation.error,
            content: value,
          });
    }
    saveConfig(name, value)
        .then(({successful, message, content}) => {
          if (!successful) {
            return res
                .status(400)
                .json({
                  response: false,
                  message: message,
                  content: content,
                });
          }
          if (!('custom' in config)) config.custom = {};
          config.custom[name] = content;

          return res
              .status(200)
              .json({
                response: true,
                message: `Successfully set ${name}`,
                content: content,
              });
        })
        .catch((err) => {
          return res
              .status(400)
              .json({
                response: false,
                message: `Error occurred while saving ${name}`,
                content: err,
              });
        });
  };
}

/**
 * Saves the config to the database
 * @param {string} name name of the config
 * @param {*} value config value
 * @param {Boolean} [validate] if true, check if the value is valid
 * @return {Promise<{successful: Boolean,message: string,content: any}>}
 */
async function saveConfig(name, value, validate=false) {
  if (validate) {
    if (!configTypes.has(name)) {
      return {
        successful: false,
        message: `${name} is not a valid config`,
        content: value,
      };
    }
    const validation = configTypes.get(name)(value);
    if (!validation.valid) {
      return {
        successful: false,
        message: validation.error,
        content: value,
      };
    }
  }
  return await Config.findOneAndUpdate(
      {name},
      {name, value},
      {
        upsert: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
        new: true,
      },
  ).then((doc) => {
    return {
      successful: true,
      message: `Successfully saved config for ${name}`,
      content: doc,
    };
  }).catch((err) => {
    return {
      successful: false,
      message: `Error while saving config for ${name}`,
      content: err,
    };
  });
};

/**
 *  Loads the config from the database
 * @param {*} name name of the config
 * @param {Boolean} validate if true, check if the value is valid
 * @return {Promise<{successful: Boolean,message: string,content: any}>}
 */
async function loadConfig(name, validate=false) {
  if (validate) {
    if (!configTypes.has(name)) {
      return {
        successful: false,
        message: `${name} is not a valid config`,
        content: value,
      };
    }
    const validation = configTypes.get(name)(value);
    if (!validation.valid) {
      return {
        successful: false,
        message: validation.error,
        content: value,
      };
    }
  }
  return await Config.findOne({name})
      .exec((err, doc) => {
        if (err) {
          return {
            successful: false,
            message: `Error while retrieving config for ${name}`,
            content: err,
          };
        };
        if (doc == undefined) {
          return {
            successful: false,
            message: `Config for ${name} does not exist`,
            content: err,
          };
        };
        if (!('custom' in config)) config.custom = {};
        config.custom[name] = doc;

        return {
          successful: true,
          message: `Successfully loaded config for ${name}`,
          content: doc,
        };
      });
};

/**
 * loads all config files
 * @return {[{successful: Boolean,message: string,content: any}]}
 */
function loadAllConfigs() {
  const result = [];
  configTypes.forEach((value, name) => {
    result.push(loadConfig(name));
  });
  return result;
}

module.exports = {
  setConfig,
  saveConfig,
  loadConfig,
  loadAllConfigs,
};
