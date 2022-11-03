import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  installPackagesTask,
  names,
  offsetFromRoot,
  Tree,
  logger,
  readProjectConfiguration,
  joinPathFragments,
} from '@nrwl/devkit';
import { ToolingWidgetScaffolderGeneratorSchema } from './schema';
import { libraryGenerator as tsLibraryGenerator } from '@nrwl/js';
import { libraryGenerator } from '@nrwl/angular/generators';
import { tsquery } from '@phenomnomnominal/tsquery';

interface NormalizedSchema extends ToolingWidgetScaffolderGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

// function normalizeOptions(
//   tree: Tree,
//   options: ToolingWidgetScaffolderGeneratorSchema
// ): NormalizedSchema {
//   const name = names(options.name).fileName;
//   const projectDirectory = options.directory
//     ? `${names(options.directory).fileName}/${name}`
//     : name;
//   const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
//   const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
//   const parsedTags = options.tags
//     ? options.tags.split(',').map((s) => s.trim())
//     : [];

//   return {
//     ...options,
//     projectName,
//     projectRoot,
//     projectDirectory,
//     parsedTags,
//   };
// }

// function addFiles(tree: Tree, options: NormalizedSchema) {
//   const templateOptions = {
//     ...options,
//     ...names(options.name),
//     offsetFromRoot: offsetFromRoot(options.projectRoot),
//     template: '',
//   };
//   generateFiles(
//     tree,
//     path.join(__dirname, 'files'),
//     options.projectRoot,
//     templateOptions
//   );
// }

function buildImportPath(
  npmScope: string,
  widgetName: string,
  libType: 'ui' | 'model' | 'form'
) {
  return `@${npmScope}/widget-${widgetName}-${libType}`;
}

function buildNameLib(
  directoryWidgets: string,
  widgetName: string,
  libType: 'ui' | 'model' | 'form'
) {
  return `${directoryWidgets}-widget-${widgetName}-${libType}`;
}

export default async function (
  tree: Tree,
  options: ToolingWidgetScaffolderGeneratorSchema
) {
  // const normalizedOptions = normalizeOptions(tree, options);
  // addProjectConfiguration(tree, normalizedOptions.projectName, {
  //   root: normalizedOptions.projectRoot,
  //   projectType: 'library',
  //   sourceRoot: `${normalizedOptions.projectRoot}/src`,
  //   targets: {
  //     build: {
  //       executor: '@test-widgets/widget-scaffolder:build',
  //     },
  //   },
  //   tags: normalizedOptions.parsedTags,
  // });
  // addFiles(tree, normalizedOptions);

  const npmScope = getWorkspaceLayout(tree).npmScope;

  const widgetName = names(options.widgetName).fileName;
  const directoryWidgets = 'widgets';
  const name = 'model';
  const directory = `${directoryWidgets}/widget-${widgetName}`;
  const modelNameLib = buildNameLib(directoryWidgets, widgetName, name);
  const modelImportPath = buildImportPath(npmScope, widgetName, 'model');
  const interfaceName = `Widget${names(widgetName).className}`;

  await tsLibraryGenerator(tree, {
    name,
    directory,
    importPath: modelImportPath,
  });

  const modelLibRoot = readProjectConfiguration(tree, modelNameLib).root;

  logger.info('libRoot: ' + modelLibRoot);

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files/model'),
    modelLibRoot,
    {
      nameLib: modelNameLib,
      interfaceName,
      template: '',
    }
  );

  // Delete useless spec file
  const pathSpecFile = joinPathFragments(
    modelLibRoot,
    './src/lib',
    `${modelNameLib}.spec.ts`
  );
  tree.delete(pathSpecFile);

  await generateAngularLibrary(
    tree,
    directory,
    npmScope,
    directoryWidgets,
    widgetName,
    interfaceName,
    modelImportPath,
    'ui'
  );

  await generateAngularLibrary(
    tree,
    directory,
    npmScope,
    directoryWidgets,
    widgetName,
    interfaceName,
    modelImportPath,
    'form'
  );

  // Add to Widget union type
  const sourceRoot = readProjectConfiguration(tree, 'shared-utils').sourceRoot;
  const filePath = joinPathFragments(sourceRoot, './lib/utils.ts');
  const fileEntry = tree.read(filePath);
  let contents = fileEntry.toString();
  contents = `
  import type { ${interfaceName} } from '${modelImportPath}';
  ${contents}
  `;

  const ast = tsquery.ast(contents);
  const nodeTypeAliasDeclaration = tsquery(
    ast,
    'TypeAliasDeclaration:has(TypeAliasDeclaration > Identifier[name=Widget])'
  );

  if (!nodeTypeAliasDeclaration || nodeTypeAliasDeclaration.length === 0) {
    throw 'ERROR finding Widget discriminated union type';
  }

  const indexToInsertNewType = nodeTypeAliasDeclaration[0].getEnd() - 1;

  contents = `${contents.slice(
    0,
    indexToInsertNewType
  )} | {kind: '${widgetName}'; data: ${interfaceName}}${contents.slice(
    indexToInsertNewType
  )}`;

  tree.write(filePath, contents);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

async function generateAngularLibrary(
  tree: Tree,
  directory: string,
  npmScope: string,
  directoryWidgets: string,
  widgetName: string,
  interfaceName: string,
  modelImportPath: string,
  libType: 'ui' | 'form'
) {
  await libraryGenerator(tree, {
    name: libType,
    style: 'scss',
    directory,
    buildable: true,
    changeDetection: 'OnPush',
    importPath: buildImportPath(npmScope, widgetName, libType),
    standalone: true,
  });

  const nameLib = buildNameLib(directoryWidgets, widgetName, libType);
  const className = names(`${nameLib}-component`).className;
  const formPropertyName = names(`widget-${widgetName}-form`).propertyName;
  const libRoot = readProjectConfiguration(tree, nameLib).root;

  generateFiles(
    tree,
    joinPathFragments(__dirname, `./files/${libType}`),
    libRoot,
    {
      interfaceName,
      importPath: modelImportPath,
      nameLib: nameLib,
      npmScope,
      className,
      formPropertyName,
      template: '',
    }
  );
}
