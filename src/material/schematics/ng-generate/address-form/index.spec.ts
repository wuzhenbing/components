import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {createTestApp, getFileContent} from '@angular/cdk/schematics/testing';
import {Schema} from './schema';

describe('Material address-form schematic', () => {
  let runner: SchematicTestRunner;

  const baseOptions: Schema = {
    name: 'foo',
    project: 'material',
  };

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', require.resolve('../../collection.json'));
  });

  it('should create address-form files and add them to module', async () => {
    const tree = runner.runSchematic('address-form', baseOptions, await createTestApp(runner));
    const files = tree.files;

    expect(files).toContain('/projects/material/src/app/foo/foo.component.css');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.html');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    expect(files).toContain('/projects/material/src/app/foo/foo.component.ts');

    const moduleContent = getFileContent(tree, '/projects/material/src/app/app.module.ts');
    expect(moduleContent).toMatch(/import.*Foo.*from '.\/foo\/foo.component'/);
    expect(moduleContent).toMatch(/declarations:\s*\[[^\]]+?,\r?\n\s+FooComponent\r?\n/m);
  });

  it('should add address-form imports to module', async () => {
    const tree = runner.runSchematic('address-form', baseOptions, await createTestApp(runner));
    const moduleContent = getFileContent(tree, '/projects/material/src/app/app.module.ts');

    expect(moduleContent).toContain('MatInputModule');
    expect(moduleContent).toContain('MatButtonModule');
    expect(moduleContent).toContain('MatSelectModule');
    expect(moduleContent).toContain('MatRadioModule');
    expect(moduleContent).toContain('ReactiveFormsModule');
  });

  it('should throw if no name has been specified', async () => {
    const appTree = await createTestApp(runner);
    expect(() => {
      runner.runSchematic('address-form', {project: 'material'}, appTree);
    }).toThrowError(/required property 'name'/);
  });

  describe('style option', () => {
    it('should respect the option value', async () => {
      const tree = runner.runSchematic(
          'address-form', {style: 'scss', ...baseOptions}, await createTestApp(runner));

      expect(tree.files).toContain('/projects/material/src/app/foo/foo.component.scss');
    });

    it('should fall back to the @schematics/angular:component option value', async () => {
      const tree = runner.runSchematic(
          'address-form', baseOptions, await createTestApp(runner, {style: 'less'}));

      expect(tree.files).toContain('/projects/material/src/app/foo/foo.component.less');
    });
  });

  describe('inlineStyle option', () => {
    it('should respect the option value', async () => {
      const tree = runner.runSchematic(
          'address-form', {inlineStyle: true, ...baseOptions}, await createTestApp(runner));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.css');
    });

    it('should fall back to the @schematics/angular:component option value', async () => {
      const tree = runner.runSchematic(
          'address-form', baseOptions, await createTestApp(runner, {inlineStyle: true}));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.css');
    });
  });

  describe('inlineTemplate option', () => {
    it('should respect the option value', async () => {
      const tree = runner.runSchematic(
          'address-form', {inlineTemplate: true, ...baseOptions}, await createTestApp(runner));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.html');
    });

    it('should fall back to the @schematics/angular:component option value', async () => {
      const tree = runner.runSchematic(
          'address-form', baseOptions, await createTestApp(runner, {inlineTemplate: true}));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.html');
    });
  });

  describe('skipTests option', () => {
    it('should respect the option value', async () => {
      const tree = runner.runSchematic(
          'address-form', {skipTests: true, ...baseOptions}, await createTestApp(runner));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    });

    it('should fall back to the @schematics/angular:component option value', async () => {
      const tree = runner.runSchematic(
          'address-form', baseOptions, await createTestApp(runner, {skipTests: true}));

      expect(tree.files).not.toContain('/projects/material/src/app/foo/foo.component.spec.ts');
    });
  });
});
