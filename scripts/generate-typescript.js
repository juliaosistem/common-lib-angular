import raml2obj from 'raml2obj';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertTypeToTypeScript(type) {
  switch (type) {
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return 'any[]';
    default:
      return 'any';
  }
}

// eslint-disable-next-line max-lines-per-function
function generateInterface(typeName, typeObj, globalTypes = {}) {
  //eslint-disable-next-line no-console
  console.log(`\n🔍 Generando interface: ${typeName}`);
  //eslint-disable-next-line no-console
  console.log(`📋 Propiedades encontradas:`, Object.keys(typeObj.properties || {}));
  
  let interfaces = '';
  let interfaceStr = `export interface ${typeName} {\n`;

  if (typeObj.properties) {
    const properties = Array.isArray(typeObj.properties)
      ? typeObj.properties
      : Object.entries(typeObj.properties).map(([key, value]) => ({ ...value, name: key }));

    for (const prop of properties) {
      const propName = prop.name || prop.key;
      const optional = prop.required === false ? '?' : '';
      let propType = prop.type;

      // Si el tipo viene como array, tomar el primero
      if (Array.isArray(propType) && propType.length > 0) {
        propType = propType[0];
      }

      // Caso: tipo con sintaxis array (ej: cityDTO[])
      if (typeof propType === 'string' && propType.endsWith('[]')) {
        const baseType = propType.slice(0, -2); // Remover []
        if (globalTypes[baseType]) {
          interfaceStr += `  ${propName}${optional}: ${baseType}[];\n`;
        } else {
          interfaceStr += `  ${propName}${optional}: any[];\n`;
        }

      // Caso: array con items que referencian tipos
      } else if (propType === 'array' && prop.items) {
        let arrayType = 'any';
        
        // Verificar si items es string con namespace (ej: "countryDTO.cityDTO")
        if (typeof prop.items === 'string' && prop.items.includes('.')) {
          const actualType = prop.items.split('.')[1]; // Extraer la parte después del punto
          if (globalTypes[actualType]) {
            arrayType = actualType;
            //eslint-disable-next-line no-console
            console.log(`✅ Array con namespace: ${prop.items} -> ${arrayType}`);
          } else {
            //eslint-disable-next-line no-console
            console.log(`❌ Array namespace no encontrado: ${actualType}`);
          }
        }
        // Verificar si items tiene originalType (caso cityDTO[])
        else if (prop.items.originalType && globalTypes[prop.items.originalType]) {
          arrayType = prop.items.originalType;
          //eslint-disable-next-line no-console
          console.log(`✅ Array con originalType: ${arrayType}`);
        }
        // Verificar si items tiene name que coincida con un tipo global
        else if (prop.items.name && globalTypes[prop.items.name]) {
          arrayType = prop.items.name;
          //eslint-disable-next-line no-console
          console.log(`✅ Array con name: ${arrayType}`);
        }
        // Verificar si items es string directo
        else if (typeof prop.items === 'string' && globalTypes[prop.items]) {
          arrayType = prop.items;
          //eslint-disable-next-line no-console
          console.log(`✅ Array con string directo: ${arrayType}`);
        }
        // Verificar si items es include de archivo
        else if (typeof prop.items === 'string' && prop.items.includes('/')) {
          arrayType = path.basename(prop.items, '.raml');
          //eslint-disable-next-line no-console
          console.log(`✅ Array desde archivo: ${arrayType}`);
        }
        // Buscar en las propiedades del items para detectar el tipo
        else if (prop.items.properties) {
          const itemKeys = Object.keys(prop.items.properties).sort();
          for (const [globalTypeName, globalTypeObj] of Object.entries(globalTypes)) {
            if (globalTypeObj.properties) {
              const globalKeys = Object.keys(globalTypeObj.properties).sort();
              if (JSON.stringify(itemKeys) === JSON.stringify(globalKeys)) {
                arrayType = globalTypeName;
                //eslint-disable-next-line no-console
                console.log(`✅ Array detectado por propiedades: ${arrayType}`);
                break;
              }
            }
          }
        }
        
        interfaceStr += `  ${propName}${optional}: ${arrayType}[];\n`;

      // Caso: objeto inline - verificar si existe como tipo global
      } else if (propType === 'object' && prop.properties) {
        
        // Intentar encontrar un tipo global que coincida
        let matchedGlobalType = null;
        
        // Buscar por nombre de propiedad directo
        if (globalTypes[propName]) {
          matchedGlobalType = propName;
        }
        // Buscar por nombre con sufijo DTO
        else if (globalTypes[`${propName}DTO`]) {
          matchedGlobalType = `${propName}DTO`;
        }
        // Buscar comparando propiedades
        else {
          const propKeys = Object.keys(prop.properties).sort();
          for (const [globalTypeName, globalTypeObj] of Object.entries(globalTypes)) {
            if (globalTypeObj.properties) {
              const globalKeys = Object.keys(globalTypeObj.properties).sort();
              if (JSON.stringify(propKeys) === JSON.stringify(globalKeys)) {
                matchedGlobalType = globalTypeName;
                break;
              }
            }
          }
        }
        
        if (matchedGlobalType) {
          interfaceStr += `  ${propName}${optional}: ${matchedGlobalType};\n`;
        } else {
          const nestedInterfaceName =
            `${typeName}${propName.charAt(0).toUpperCase()}${propName.slice(1)}`;
          interfaces += generateInterface(nestedInterfaceName, prop, globalTypes);
          interfaceStr += `  ${propName}${optional}: ${nestedInterfaceName};\n`;
        }

      // Caso: referencia con namespace (types.nombreTipo)
      } else if (propType && typeof propType === 'string' && propType.includes('.')) {
        const actualType = propType.split('.')[1];
        if (globalTypes[actualType]) {
          interfaceStr += `  ${propName}${optional}: ${actualType};\n`;
        } else {
          interfaceStr += `  ${propName}${optional}: any;\n`;
        }

      // Caso: tipo declarado globalmente
      } else if (globalTypes[propType]) {
        interfaceStr += `  ${propName}${optional}: ${propType};\n`;

      // Caso: !include
      } else if (propType && typeof propType === 'string' && propType.includes('/')) {
        const fileBase = path.basename(propType, '.raml');
        interfaceStr += `  ${propName}${optional}: ${fileBase};\n`;

      // Caso: primitivo
      } else {
        const tsType = convertTypeToTypeScript(propType);
        interfaceStr += `  ${propName}${optional}: ${tsType};\n`;
      }
    }
  }

  interfaceStr += '}\n\n';
  return interfaces + interfaceStr;
}


function createPackageJson(outputDir) {
  const packageJson = {
    name: '@juliaosistem/core-dtos',
    version: '1.0.0',
    description: 'DTOs generados automáticamente desde RAML',
    main: 'index.ts',
    types: 'index.ts',
    private: true
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
}


// eslint-disable-next-line max-lines-per-function
async function generateDTOs() {
  const ramlFile = path.join(__dirname, '../lib-core-dtos/api.raml');
  const outputFile = path.join(__dirname, '../node_modules/@juliaosistem/core-dtos/index.ts');
  
  const ramlObj = await raml2obj.parse(ramlFile);
  
  let output = '// Tipos TypeScript generados automáticamente desde RAML\n';
  output += '// ⚠️  NO MODIFICAR MANUALMENTE - Se sobrescribe en cada generación\n';
  output += '// Paquete virtual: import {} from "@juliaosistem/core-dtos"\n\n';

  // Primero generar todos los tipos globales
  const globalTypes = {};
  if (ramlObj.types) {
    for (const [typeName, typeObj] of Object.entries(ramlObj.types)) {
      globalTypes[typeName] = typeObj;
    }
  }
  
  // Luego generar las interfaces
  if (ramlObj.types) {
    for (const [typeName, typeObj] of Object.entries(ramlObj.types)) {
      output += generateInterface(typeName, typeObj, globalTypes);
    }
  }
  
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, output);
  createPackageJson(outputDir);
  
  return outputFile;
}

generateDTOs()
 // eslint-disable-next-line no-console
  .then(file => console.log(`✅ DTOs generados en: ${file}`))
  // eslint-disable-next-line no-console
  .catch(error => console.error('❌ Error:', error.message));

