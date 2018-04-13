
    /**
     * Generated by graphql-ruby-client
     *
    */

    /**
     * Map local operation names to persisted keys on the server
     * @return {Object}
     * @private
    */
    var _aliases = {
  "LoadRoomInfo": "27c21596c430de9f4d7262542f9329b6",
  "LoadViewer": "f8c949845d70f2e693601b6ea49d26e3",
  "MessageAdded": "fd7700f7d9639eb062cd1ef660d18689",
  "PickScreenname": "da8f2e27cd765c4b59cc549b9609977c",
  "PostChatMessage": "ba9ce6fcc37da21fdb0c97a416f1cf9e"
}

    /**
     * The client who synced these operations with the server
     * @return {String}
     * @private
    */
    var _client = "js-frontend"

    var OperationStoreClient = {
      /**
       * Build a string for `params[:operationId]`
       * @param {String} operationName
       * @return {String} stored operation ID
      */
      getOperationId: function(operationName) {
        return _client + "/" + OperationStoreClient.getPersistedQueryAlias(operationName)
      },

      /**
       * Fetch a persisted alias from a local operation name
       * @param {String} operationName
       * @return {String} persisted alias
      */
      getPersistedQueryAlias: function(operationName) {
        var persistedAlias = _aliases[operationName]
        if (!persistedAlias) {
          throw new Error("Failed to find persisted alias for operation name: " + operationName)
        } else {
          return persistedAlias
        }
      },

      /**
       * Satisfy the Apollo Link API.
       * This link checks for an operation name, and if it's present,
       * sets the HTTP context to _not_ include the query,
       * and instead, include `extensions.operationId`.
       * (This is inspired by apollo-link-persisted-queries.)
      */
      apolloLink: function(operation, forward) {
        if (operation.operationName) {
          const operationId = OperationStoreClient.getOperationId(operation.operationName)
          operation.setContext({
            http: {
              includeQuery: false,
              includeExtensions: true,
            }
          })
          operation.extensions.operationId = operationId
        }
        return forward(operation)
      },
      /**
       * Satisfy the Apollo middleware API.
       * Replace the query with an operationId
      */
      apolloMiddleware: {
        applyBatchMiddleware: function(options, next) {
          options.requests.forEach(function(req) {
            // Fetch the persisted alias for this operation
            req.operationId = OperationStoreClient.getOperationId(req.operationName)
            // Remove the now-unused query string
            delete req.query
            return req
          })
          // Continue the request
          next()
        },

        applyMiddleware: function(options, next) {
          var req = options.request
          // Fetch the persisted alias for this operation
          req.operationId = OperationStoreClient.getOperationId(req.operationName)
          // Remove the now-unused query string
          delete req.query
          // Continue the request
          next()
        }
      }
    }

    module.exports = OperationStoreClient
    