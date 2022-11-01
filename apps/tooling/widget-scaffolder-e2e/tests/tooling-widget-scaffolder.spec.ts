import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('tooling-widget-scaffolder e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject(
      '@test-widgets/widget-scaffolder',
      'dist/libs/tooling/widget-scaffolder'
    );
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create tooling-widget-scaffolder', async () => {
    const project = uniq('tooling-widget-scaffolder');
    await runNxCommandAsync(
      `generate @test-widgets/widget-scaffolder:tooling-widget-scaffolder ${project}`
    );
    const result = await runNxCommandAsync(`build ${project}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('tooling-widget-scaffolder');
      await runNxCommandAsync(
        `generate @test-widgets/widget-scaffolder:tooling-widget-scaffolder ${project} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${project}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('tooling-widget-scaffolder');
      ensureNxProject(
        '@test-widgets/widget-scaffolder',
        'dist/libs/tooling/widget-scaffolder'
      );
      await runNxCommandAsync(
        `generate @test-widgets/widget-scaffolder:tooling-widget-scaffolder ${projectName} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${projectName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
