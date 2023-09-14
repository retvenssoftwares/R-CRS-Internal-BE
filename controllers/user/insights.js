
'use strict';
const bizSdk = require('facebook-nodejs-business-sdk');
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;

const access_token = 'EAAOwe6cWMm8BO0GZAfAB7B0Sy1a6wlelihwVTwKapZAp9eiCeyOtMKDpGtybYJ9ZA8do4a3ek5m5EZAQefovbRIypG3QAPq6ncLTruyWig2u6PfndsFJgNeOvqNwHXpWNYP4zDYLWZCsXgXNNZALliza7H2kVFZBruJKjdAqK7gQUnsLYzu13Gr15lJKm2tSqdi';
const app_secret = '08a2a6927f8f96439f02ffe5ccf3d0c8';
const app_id = '1038470060847727';
const id = '319444283950806';
const api = bizSdk.FacebookAdsApi.init(access_token);
const showDebugingInfo = true; // Setting this to true shows more debugging info.
if (showDebugingInfo) {
  api.setDebug(true);
}

const logApiCallResult = (apiCallName, data) => {
  console.log(apiCallName);
  if (showDebugingInfo) {
    console.log('Data:' + JSON.stringify(data));
  }
};

let fields, params;
fields = [
];
params = {
  'name' : 'My First Campaign',
  'objective' : 'PAGE_LIKES',
  'status' : 'PAUSED',
  'special_ad_categories' : [],
};
const campaigns = (new AdAccount(id)).createCampaign(
  fields,
  params
);
logApiCallResult('campaigns api call complete.', campaigns);

// https://adsmanager.facebook.com/adsmanager/?act=319444283950806&nav_entry_point=am_local_scope_selector