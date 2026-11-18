const dns = require("dns");
const r = new dns.promises.Resolver();
r.setServers(["8.8.8.8", "1.1.1.1"]);
const orig = dns.lookup;
dns.lookup = function (host, opts, cb) {
  if (typeof opts === "function") { cb = opts; opts = {}; }
  if (typeof opts === "number") opts = { family: opts };
  if (host === "localhost" || /^[\d.]+$/.test(host) || host.includes(":")) {
    return orig.call(dns, host, opts, cb);
  }
  r.resolve4(host)
    .then((a) => (opts.all ? cb(null, a.map((address) => ({ address, family: 4 }))) : cb(null, a[0], 4)))
    .catch(() => orig.call(dns, host, opts, cb));
};
