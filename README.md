<h1 align="center">shatter_monitor</h1>

A tiny tool for Site Error & Performance Monitor.

It is a shatter monitor tool, but it can be combined to form a complete tool.

[release](https://github.com/MangoTsing/shatter_monitor/blob/master/build/index.min.js) Only `4.4Kb` in size.

Specific options information may be viewed in [index.ts file](https://github.com/MangoTsing/shatter_monitor/blob/master/src/types/index.ts)

More features(like hooks) in development...

## Next

- Add more hooks
- Typescript type for function
- Add user behavior stack
- Support vue 2.x & 3.x
- Support Performance Monitor (a part of shatter_monitor)

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

