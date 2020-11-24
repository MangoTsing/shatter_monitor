<h1 align="center">shatter_monitor</h1>

A tiny tool for Browser Error Monitor.

[release](https://github.com/MangoTsing/shatter_monitor/blob/master/build/index.min.js) Only `4.4Kb` in size.

Specific options information may be viewed in [index.ts file](https://github.com/MangoTsing/shatter_monitor/blob/master/src/types/index.ts)

More features(like hooks) in development...

## Usage

```
<script>
const Shatter = new shatter.init({
    dsn: 'https://your.site.com',
    appkey: 'mangotsing',
    debug: false,
    beforeSendData: () => {
        console.log('test')
        return true
    },
    onlyImg: true,
    blockConsole: true
});
</script>
```

If your browser support `navigator.sendBeacon` function, will use it.

Otherwise use `Image()` to send a `get` request for monitor.

## Dev

```

yarn

yarn watch

cd examples && http-server // 8080

// new terminal

cd examples && http-server // 8081

```

