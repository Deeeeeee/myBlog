requirejs.config({
    baseUrl: '/js',
    urlArgs: "version=" + new Date().getTime(),
    paths: {
        common: 'vendor/common',
        jquery: 'vendor/jquery.min'
    },
    shim: {

    }
});

