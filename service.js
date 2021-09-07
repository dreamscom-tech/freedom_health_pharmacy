var Service = require("node-windows").Service;

// Create a new service object
var svc = new Service({
  name: "Testing",
  description: "WEb server",
  script: "E:\\freedom_health_pharmacy\\index.js",
  nodeOptions: ["--harmony", "--max_old_space_size=4096"],
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on("install", function () {
  svc.start();
});

svc.install();
