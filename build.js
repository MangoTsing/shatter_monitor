import { rollup } from 'rollup'
import config from './rollup.config.js'

config.forEach(async item => {
    await build(item)
})

async function build(option) {
    try {
        const bundle = await rollup(option)
        await bundle.generate(option.output)
        await bundle.write(option.output)
        console.log('\x1B[32m', 'build ok!')
        console.log('\x1B[32m', `input: ${option.input}\noutput: ${option.output.file}`)
        console.log('\n')
    } catch (e) {
        console.log('\x1B[31m', `Error File: input: ${option.input}\noutput: ${option.output.file}`)
        console.log(e, '\n')
    }
}