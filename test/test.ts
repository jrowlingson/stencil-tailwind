import getCodeFromBundle from '../test/helpers/test-helpers'
import tailwind from '..'
import test from 'ava'
import { readFileSync } from 'fs'
import { rollup } from 'rollup'

test('inline class: literal', async t => {
  const bundle = await rollup({
    input: 'test/fixtures/components/inline-class/literal.input.tsx',
    plugins: [ tailwind() ]
  })
  const actual = await getCodeFromBundle(bundle)
  const expected = readFileSync('test/fixtures/components/inline-class/literal.output.js', 'utf-8');
  t.is(actual, expected)
})

test('inline class: conditional expression', async t => {
  const bundle = await rollup({
    input: 'test/fixtures/components/inline-class/cond-expression.input.tsx',
    plugins: [ tailwind() ]
  })
  const actual = await getCodeFromBundle(bundle)
  const expected = readFileSync('test/fixtures/components/inline-class/cond-expression.output.js', 'utf-8');
  t.is(actual, expected)
})

test('style decorator', async t => {
  const bundle = await rollup({
    input: 'test/fixtures/components/decorator/input.tsx',
    plugins: [ tailwind() ]
  })
  const actual = await getCodeFromBundle(bundle)
  const expected = readFileSync('test/fixtures/components/decorator/output.js', 'utf-8');
  t.is(actual, expected)
})

test('sass: @apply (scss)', async t => {
  const bundle = await rollup({
    input: 'test/fixtures/components/styles/apply.input.scss',
    plugins: [ tailwind() ]
  })
  const actual = await getCodeFromBundle(bundle)
  const expected = readFileSync('test/fixtures/components/styles/apply.output.js', 'utf-8');
  t.is(actual, expected)
})

test('sass: @apply (css)', async t => {
  const bundle = await rollup({
    input: 'test/fixtures/components/styles/apply.input.css',
    plugins: [ tailwind() ]
  })
  const actual = await getCodeFromBundle(bundle)
  const expected = readFileSync('test/fixtures/components/styles/apply.output.js', 'utf-8');
  t.is(actual, expected)
})
