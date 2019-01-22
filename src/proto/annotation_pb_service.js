// package: 
// file: src/proto/annotation.proto

var src_proto_annotation_pb = require("../../src/proto/annotation_pb");
var grpc = require("grpc-web-client").grpc;

var Annotate = (function () {
  function Annotate() {}
  Annotate.serviceName = "Annotate";
  return Annotate;
}());

Annotate.Annotate = {
  methodName: "Annotate",
  service: Annotate,
  requestStream: false,
  responseStream: true,
  requestType: src_proto_annotation_pb.AnnotationRequest,
  responseType: src_proto_annotation_pb.AnnotationResponse
};

exports.Annotate = Annotate;

function AnnotateClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AnnotateClient.prototype.annotate = function annotate(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(Annotate.Annotate, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.end.forEach(function (handler) {
        handler();
      });
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.AnnotateClient = AnnotateClient;

