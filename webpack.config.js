module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: "/\.vert$/", loader: "raw"},
            {test: "/\.frag$/", loader: "raw"}
        ]
    }
};