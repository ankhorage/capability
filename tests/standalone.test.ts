import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'bun:test';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));

test('installs the packed package into a fresh consumer and imports its public API', async () => {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'capability-consumer-'));
  const packageDirectory = join(temporaryDirectory, 'package');
  const consumerDirectory = join(temporaryDirectory, 'consumer');

  try {
    await run(['bun', 'pm', 'pack', '--destination', packageDirectory, '--quiet'], repositoryRoot);
    const [tarball] = await readdir(packageDirectory);
    if (tarball === undefined) throw new Error('Expected the packed package tarball.');
    await mkdir(consumerDirectory, { recursive: true });
    await writeFile(
      join(consumerDirectory, 'package.json'),
      JSON.stringify({ name: 'capability-consumer', private: true, type: 'module' }),
    );
    await run(['bun', 'add', `file:${join(packageDirectory, tarball)}`], consumerDirectory);
    const result = await run(
      [
        'bun',
        '--eval',
        "import { isCapabilityCatalog } from '@ankhorage/capability'; if (!isCapabilityCatalog([])) process.exit(1);",
      ],
      consumerDirectory,
    );

    expect(result.exitCode).toBe(0);
    const installedCapability = JSON.parse(
      await readFile(
        join(consumerDirectory, 'node_modules/@ankhorage/capability/package.json'),
        'utf8',
      ),
    ) as { dependencies: Record<string, string> };
    const resolvedContracts = JSON.parse(
      await readFile(
        join(consumerDirectory, 'node_modules/@ankhorage/contracts/package.json'),
        'utf8',
      ),
    ) as { version: string };
    expect(installedCapability.dependencies['@ankhorage/contracts']).toBe('^26.0.0');
    expect(resolvedContracts.version.split('.')[0]).toBe('26');
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
});

/*** Run one command in an isolated fresh-consumer directory. */
async function run(command: string[], cwd: string): Promise<{ readonly exitCode: number }> {
  const process = Bun.spawn(command, { cwd, stderr: 'pipe', stdout: 'pipe' });
  const exitCode = await process.exited;
  if (exitCode !== 0) {
    throw new Error(await new Response(process.stderr).text());
  }
  return { exitCode };
}
