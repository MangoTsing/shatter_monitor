<h1 align="center">
    <img src="https://p0.ssl.qhimg.com/t01f02e9ee1a463b5bf.png"/>
</h1>

A tiny tool for Site **Error & Performance & User Behavior** Monitor.

It is a shatter monitor tool, but it can be combined to form a complete tool.

There is [release @1.0.11](https://cdn.jsdelivr.net/npm/shatter_monitor@1.0.11/build/index.min.js).

Specific options information may be viewed in [index.ts file](https://github.com/MangoTsing/shatter_monitor/blob/master/src/types/index.ts)

More features(like hooks) in development...

## Next

- Perfect Beacon method
- Merge Many Same Errors happened in a moment
- Add more hooks
- Support Performance Monitor (a part of shatter_monitor)
- Support Behavior Monitor (a part of shatter_monitor)

## Usage

### CDN

```
<script src="https://cdn.jsdelivr.net/npm/shatter_monitor@1.0.9/build/index.min.js"></script>
<script>
const { ShatterInit } = shatter
const Shatter = new ShatterInit({
    dsn: 'https://your.site.com',
    appkey: 'mangotsing',
    debug: false,
    beforeSendData: () => {
        console.log('test')
        return true
    },
    usage: 'all', // or ['ErrorForShatter', 'PerformanceForShatter', 'BehaviorForShatter']
    onlyImg: true,
    blockConsole: true
});
</script>
```

### Vue

In the Vue Project, In addition to the original function, the `$report` method is also mounted on `this`

You can use it for your **async** methods Error Report, like this:

`this.$report(params: SendType)`

Suggest `Vue Project` use `blockConsole: true`, otherwise `vue warn` will cause repeated errors.

```
//terminal
npm install --save shatter_monitor

// main.js
import { ShatterErrorVue } from 'shatter_monitor'

// vue 2.x

Vue.use(ShatterErrorVue, {
    dsn: 'https://your.site.com',
    appkey: 'mangotsing',
    debug: false,
    beforeSendData: () => {
        console.log('test')
        return true
    },
    blockConsole: true
    onlyImg: true,
    blockTry: true
})

// or vue-next

const app = createApp()

app.use(ShatterErrorVue, {
    dsn: 'https://your.site.com',
    appkey: 'mangotsing',
    debug: false,
    beforeSendData: () => {
        console.log('test')
        return true
    },
    onlyImg: true,
    blockTry: true
})

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

