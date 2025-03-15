# Lib-Common-angular

Esta libreria se usa para todos los proyectos frontales de aqui se usan los componentes 
 version 19.0.6.

## Paso 1

**## npm install** 
agregara las depencias localmente 

## paso 2 

ir ala carpeta principal del proyecto ejecutar 
y ejecutar
esto para probar componetes dentro de la misma libreria
 **## ng build   lib-common-angular --watch**  

en caso de probar cambios en un proyecto que esta importando esta libreria ejecutar.

 si solo se quiere probar la libreria con el mismo proyecto interno  no ejecutar los siguientes comandos e ir hasta el paso 3 
 **## ng build   lib-common-angular**  

 y despues  
**## npm  link  lib-common-angular** 
 una vez ejecutado esto 
 puedes ejecutar 
para que construya los cambios en tiempo real y el proyecto que lo importa los tome
 **## ng build   lib-common-angular --watch** 



en el proyecto que usara la libreria ejecutar 
**## npm   link  lib-common-angular** 

## paso 3

este paso aplica si quieres correr la libreria en el mismo proyecto que tiene la libreria para probar componetes 

**## ng serve  lib-common-angular-demo**

esto levantara la aplicacion donde podras probar tus componentes creados en la libreria
