<h1 align="center">shatter_monitor</h1>

A tiny tool for Site **Error & Performance & User Behavior** Monitor.

It is a shatter monitor tool, but it can be combined to form a complete tool.

[release](https://github.com/MangoTsing/shatter_monitor/blob/master/build/index.min.js) Only `5.4Kb` in size.

Specific options information may be viewed in [index.ts file](https://github.com/MangoTsing/shatter_monitor/blob/master/src/types/index.ts)

More features(like hooks) in development...

## Next

- Add more hooks
- Typescript type for function
- Add user behavior stack
- Support Performance Monitor (a part of shatter_monitor)
- Support Behavior Monitor (a part of shatter_monitor)

## Usage

### CDN

```
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
    usage: 'all', // or ['ErrorForShatter', 'PerformanceForShatter', 'BehaviorForShatter']
    onlyImg: true,
    blockConsole: true
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
    usage: 'all', // or ['ErrorForShatter', 'PerformanceForShatter', 'BehaviorForShatter']
    onlyImg: true,
    blockConsole: true
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

