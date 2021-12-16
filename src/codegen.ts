import { Types } from '@graphql-codegen/plugin-helpers'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as yaml from 'yaml'

function makeDefaultCodegenConfig(): Types.Config {
  return {
    schema: this.graphqlFilePaths,
    generates: {
      [process.cwd() + '/src/generated/graphql.ts']: {
        plugins: ['typescript'],
        config: {
          skipTypename: true,
          enumPrefix: false,
          declarationKind: 'interface',
          namingConvention: {
            typeNames: 'pascal-case#pascalCase',
            enumValues: 'upper-case#upperCase',
          }
        }
      },
    },
  }
}

export function getCodegenConfig(
  cwd: string,
  codegenConfigFileLocation: string = 'codegen.yml',
  logger?: { log: (str: string) => void }
): Types.Config {

  const configFilePath = path.join(cwd, codegenConfigFileLocation)

  if (fs.existsSync(configFilePath)) {
    const file = fs.readFileSync(configFilePath)
    const parsed = yaml.parseDocument(file.toString())

    if (logger) {
      logger.log(`Using local codegen.yml - ${codegenConfigFileLocation}`)
    }

    return parsed.toJSON()
  }

  return makeDefaultCodegenConfig()
}