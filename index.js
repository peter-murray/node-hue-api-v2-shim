// Disable all deprecation warnings as these are outside of the user's control here.
process.env['NODE_HUE_API_SUPPRESS_DEPRICATION_WARNINGS'] = true;

const oldApi = require('./lib/shim');

module.exports = {
  api: oldApi.api,
  HueApi: oldApi.api,
  BridgeApi: oldApi.api,

  lightState: oldApi.lightState,

  scheduledEvent: oldApi.scheduledEvent,

  scene: oldApi.scene,

  upnpSearch: oldApi.upnpSearch,
  nupnpSearch: oldApi.nupnpSearch,

  locateBridges: oldApi.locateBridges,
  searchForBridges: oldApi.searchForBridges,
};