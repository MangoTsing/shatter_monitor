# shatter_monitor

A tiny tool for Browser Monitor.

Specific options information may be viewed in `./src/types/sendType.ts`

## Usege

```
<script>
const Shatter = new shatter.init({
    dsn: 'https://your.site.com',
    appkey: 'mangotsing',
    debug: false
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

