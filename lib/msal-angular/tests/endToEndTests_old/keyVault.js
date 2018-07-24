'use strict'
/// <reference path="../definitions/vsts-task-lib.d.ts" />

var KeyVault = require('azure-keyvault');
var AuthenticationContext = require('adal-node').AuthenticationContext;
var tl = require('vsts-task-lib/task');
var clientId = '03dc4dac-c105-4001-8223-ccc393056b2a';//03dc4dac-c105-4001-8223-ccc393056b2a
var clientSecret = 'OBf3e/vsIMB6UEWWraCrpya9cDDD+2NdiYg9SqJSLPg=';//OBf3e/vsIMB6UEWWraCrpya9cDDD+2NdiYg9SqJSLPg=
var vaultUri = "https://nehamsaltesinfo.vault.azure.net";

// Authenticator - retrieves the access token 
var authenticator = function (challenge, callback) {

   console.log( tl.getTaskVariable('PHANTOMJS_BIN'));
    // Create a new authentication context.
    var context = new AuthenticationContext(challenge.authorization);

    // Use the context to acquire an authentication token. 
    return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function (err, tokenResponse) {
        if (err) throw err;
        // Calculate the value to be set in the request's Authorization header and resume the call. 
        var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;

        return callback(null, authorizationValue);
    });

};

var credentials = new KeyVault.KeyVaultCredentials(authenticator);
var client = new KeyVault.KeyVaultClient(credentials);

module.exports = {


   getSecret : function(secretName, callback) {
        var secretId = vaultUri + '/secrets/' +  secretName;
        console.info('Getting secret value for for secret' + secretId);
        client.getSecret(secretId, secretName, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    }
};