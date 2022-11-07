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
    buildable: true,
    compiler: 'tsc',
    config: 'project',
    strict: true,
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

  updateWidgetUnionType(tree, interfaceName, modelImportPath, widgetName);
  updateDynamicImport(tree, interfaceName, widgetName, directoryWidgets);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree);
  };
}

function updateWidgetUnionType(
  tree: Tree,
  interfaceName: string,
  modelImportPath: string,
  widgetName: string
) {
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
  )} | {kind: '${widgetName}'; data: ${interfaceName}; pos: Pos}${contents.slice(
    indexToInsertNewType
  )}`;

  tree.write(filePath, contents);
}

function updateDynamicImport(
  tree: Tree,
  interfaceName: string,
  widgetName: string,
  directoryWidgets: string
) {
  const sourceRoot = readProjectConfiguration(
    tree,
    'widget-assembler'
  ).sourceRoot;
  const filePath = joinPathFragments(
    sourceRoot,
    './lib/widget-banner.component.ts'
  );
  const fileEntry = tree.read(filePath);
  let contents = fileEntry.toString();

  const ast = tsquery.ast(contents);
  const node = tsquery(
    ast,
    'VariableDeclaration:has(Identifier[name=mapWidgetKindToComponent])'
  );

  if (!node || node.length === 0) {
    throw 'Error finding dynamic import map';
  }

  const indexToInsertNewType = node[0].getEnd() - 1;
  const className = names(
    `${directoryWidgets}${interfaceName}UiComponent`
  ).className;

  contents = `${contents.slice(0, indexToInsertNewType)} ${widgetName}: () =>
  import(
    './../../../${directoryWidgets}/widget-${widgetName}/ui/src/lib/${directoryWidgets}-widget-${widgetName}-ui/${directoryWidgets}-widget-${widgetName}-ui.component'
  ).then((a) => a.${className}),${contents.slice(indexToInsertNewType)}`;

  tree.write(filePath, contents);
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
