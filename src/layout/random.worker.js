self.addEventListener('message', function (e) {
    let data = e.data.nodes;
    for (let i = 0, n = data.length; i < n; i++) {
        let o = data[i];
        o.x = Math.random();
        o.y = Math.random();
    }
    self.postMessage({nodes: data});
}, false);