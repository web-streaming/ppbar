const semver = require('semver')
const fs = require('fs')
const path = require('path')
const { prompt } = require('enquirer')
const execa = require('execa');
const pkg = require('../package.json')

const info = console.log

async function main() {
  info(`\ncurrent version v${pkg.version}\n`)

  const { inc } = await prompt({
    type: 'select',
    name: 'inc',
    message: 'Select release type',
    choices: ['patch', 'minor', 'major']
  })

  semver.inc(pkg.version, inc)

  const version = semver.inc(pkg.version, inc)
  if (!semver.valid(version)) {
    console.error(`v${version} is not valid`)
    return
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${version}. Confirm?`
  })

  if (!yes) return

  info('\nRunning lint...')
  run('yarn', ['lint'])

  if (pkg.scripts.test) {
    info('\nRunning tests...')
    run('yarn', ['test'])
  }

  info('\nUpdating version...')
  pkg.version = version
  fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(pkg, null, 2))

  info('\nBuilding all packages...')
  run('yarn', ['build:demo'])
  run('yarn', ['build'])

  info('\nPublishing packages...')
  run('npm', ['publish'], { cwd: path.resolve(__dirname, '..') })

  info('\nPushing to GitHub...')
  run('git', ['add', '-A'])
  run('git', ['commit', '-m', `release: v${version}`])
  run('git', ['tag', `v${version}`])
  run('git', ['push', 'origin', `refs/tags/v${version}`])
  run('git', ['push'])

  info('\nRelease success\n')
}

function run(file, args, opts) {
  return execa.sync(file, args, { stdio: 'inherit', ...opts }).stdout
}

main()
