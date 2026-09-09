import { Component } from '@angular/core';
import { Terminal, PrimegModule } from 'lib-common-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terminal-doc-page',
  standalone: true,
  imports: [PrimegModule, Terminal, CommonModule],
  templateUrl: './terminal-doc-page.component.html',
  styleUrl: './terminal-doc-page.component.scss'
})
export class TerminalDocPageComponent {
  // ✅ Componente Terminal
  Terminal = Terminal;

  // ✅ Ejemplos de código para Terminal
  typescriptExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  template: \`<p>Hello World</p>\`
})
export class ExampleComponent {}`;

  htmlExample = `<div class="container">
  <h1>Título Principal</h1>
  <p>Este es un párrafo de ejemplo.</p>
  <button>Click me</button>
</div>`;

  jsonExample = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "roles": ["admin", "user"],
  "isActive": true
}`;

  bashExample = `# Instalar dependencias
npm install

# Compilar el proyecto
npm run build

# Iniciar servidor de desarrollo
npm start

# Ejecutar pruebas
npm test`;

  cssExample = `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}`;

  // ✅ Uso básico
  basicUsageCode = `import { Terminal } from 'lib-common-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Terminal],
  template: \`
    <lib-terminal [code]="myCode" language="typescript"></lib-terminal>
  \`
})
export class MyComponent {
  myCode = \`
console.log('Hello from Terminal!');
const x = 42;
  \`;
}`;

  // ✅ Configuración avanzada
  advancedConfigCode = `<!-- Terminal con diferentes lenguajes -->
<lib-terminal 
  [code]="typescriptCode" 
  language="typescript">
</lib-terminal>

<lib-terminal 
  [code]="htmlCode" 
  language="html">
</lib-terminal>

<lib-terminal 
  [code]="jsonCode" 
  language="json">
</lib-terminal>

<lib-terminal 
  [code]="bashCode" 
  language="bash">
</lib-terminal>

<lib-terminal 
  [code]="cssCode" 
  language="css">
</lib-terminal>`;

  // Documentación de Inputs
  inputsDocs = [
    {
      name: 'code',
      type: 'string',
      description: 'El código a mostrar en la terminal. Acepta cualquier texto.'
    },
    {
      name: 'language',
      type: 'string',
      description: 'Lenguaje de programación para sintaxis resaltada: typescript, javascript, html, css, json, bash, python, etc.'
    }
  ];

  // Documentación de Características
  featuresDocs = [
    {
      name: 'Copiar Código',
      description: 'Botón integrado para copiar todo el código al portapapeles con un solo clic.'
    },
    {
      name: 'Resaltado de Sintaxis',
      description: 'Soporta múltiples lenguajes con colores y estilos específicos.'
    },
    {
      name: 'Scroll Horizontal',
      description: 'Permite desplazarse horizontalmente si el código es muy largo.'
    },
    {
      name: 'Responsive',
      description: 'Se adapta a diferentes tamaños de pantalla.'
    },
    {
      name: 'Tema Integrado',
      description: 'Sigue el tema general de la aplicación (claro/oscuro).'
    }
  ];

  // Lenguajes soportados
  languagesSupported = [
    { lang: 'typescript', alias: 'ts' },
    { lang: 'javascript', alias: 'js' },
    { lang: 'html', alias: 'htm' },
    { lang: 'css', alias: '' },
    { lang: 'json', alias: '' },
    { lang: 'bash', alias: 'shell' },
    { lang: 'python', alias: 'py' },
    { lang: 'java', alias: '' },
    { lang: 'sql', alias: '' },
    { lang: 'xml', alias: '' }
  ];
}
