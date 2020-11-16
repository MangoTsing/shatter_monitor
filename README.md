<h1 align="center">shatter_monitor</h1>

A tiny tool for Browser Error Monitor.

[release](https://github.com/MangoTsing/shatter_monitor/blob/master/build/index.min.js) Only `3.35Kb` in size.

Specific options information may be viewed in [sendType.ts](https://github.com/MangoTsing/shatter_monitor/blob/master/src/types/sendType.ts)

More features(like hooks) in development...

## Usege

```
<script>
const Shatter = new shatter.init({
    dsn: 'https://your.site.com',
    appkey: 'mangotsing',
    debug: false,
    beforeSendData: () => {
        console.log('test')
        return true
    }
});
</script>
```

If your browser support `navigator.sendBeacon` function, will use it.

Otherwise use `Image()` to send a `get` request for monitor.

## Dev

```

yarn

yarn watch


```

