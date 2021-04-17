Querida Meli, 

Qué placer corregir trabajos como este. O debería decir, mejor: qué placer es ver un trabajo como este, sabiendo que lo hizo alguien que hace menos de un año no sabía nada de programación web. Qué placer recorrer la web y ver como todo funciona. Qué placer ver la calidad del código y ser capaz de entender en todo momento qué querías que ocurriera y comprobar que lograste no solo hacerlo, sino describirlo con código de manera clara. Corregir este trabajo, para serte honesta, no es un placer: no tengo nada de valor para decirte, así que no me queda otra que comentarte detalles, hacerte sugerencias nimias o plantearte algún desafío. Me da vergüenza admitir la cantidad de tiempo perdido analizando tu código y la web tratando de encontrar alguna falla, algo que rompa, algo que tenga un efecto inesperado. En fin: es el precio a pagar a cambio de ver códigos como este y ser testigo de tu crecimiento como desarrolladora. 

Pasemos a tu trabajo. 

Tu HTML es impecable, prolijo, usas bien las etiquetas semanticas. Perfecto el agregado de form, que no estaba en el modelo original y que mejora el funcionamiento y la accesibilidad. Perfecto BEM para los nombres de clases y lo prolijo que se ve todo gracias a eso tanto en el SASS como en el JS. Con respecto al SASS, usaste bien variables, mixins, manejaste muy bien todo desde el lado de la arquitectura. Te recomendaría, eso sí, que distingas entre lo que es componentes (tarjetas, una seccion en especifico, formulario) y layout (header, footer, contenedor de las distintas secciones). 
Tambien que aproveches lo que te da BEM para que tu sass sea mas claro aun. Consideremos un codigo como este:

```scss
.character-card {
    display: flex;
    flex-direction: column;
    width: calc(100% / 6 - 2 * 10px);
    margin: 0 10px 40px;
    cursor: pointer;
    .character-card__image-container{
        border-bottom: 4px solid $secondary-background-color;
        overflow: hidden;
    }
```

La gracia de repetir el nombre del contenedor es que, ademas de claridad, nos permite usar & para que el codigo sea aun mas claro:

```scss
.character-card {
    display: flex;
    flex-direction: column;
    width: calc(100% / 6 - 2 * 10px);
    margin: 0 10px 40px;
    cursor: pointer;
    &__image-container{
        border-bottom: 4px solid $secondary-background-color;
        overflow: hidden;
    }
```

Tu scss podria estar un poco mas prolijo: te recomiendo usar un formatter como Prettier para dejarlo lo mas impecable posible antes de una entrega. 

Tu proyecto en Github tiene una descripcion mas que perfecta, amigable y clara. Infinidad de commits, todos con nombres adecuados, y muchas branches que muestran que fuiste trabajando de manera ordenada. 

Con respecto al proyecto en si, hay muy poquitas cosas a mejorar. Te las menciono aunque me sienta hincha, solo porque quiero que este proyecto este publicado, y quiero que cause la mejor impresion posible:

- En celulares muy pequeños (360px para abajo), las tarjetas de personajes se ven algo amuchadas y no se ven bien los nombres: quiza poner dos o tres maximo sea mejor.  
- En modo oscuro, el texto del input sigue en color negro y es muy dificil ver lo que se esta buscando. Tampoco me parece muy lindo como quedan las tarjetas de personajes. 
- Desafio super extra, pero muy bienvenido: cuando estoy en celulares y me voy muy hacia abajo en la busqueda de un comic, al hacer click en ese comic termino "abajo" en lugar de volver hacia arriba para ver el titulo y la informacion principal. Eso es porque el navegador recuerda en que parte del scroll estoy, y no lo vuelve hacia arriba. Si queres averiguar como controlar el scroll en JS, seria un buen desafio lograr que tenga un comportamiento mas amigable. 

Las funcionalidades extra eran desafiantes, y me sorprende muy para bien lo bien implementadas que estan. El spinner, el modo oscuro, el select para cada pagina... pocas veces ocurre que somos capaces de encarar las funcionalidades avanzadas y dejarlas a la perfeccion. 

Meli, estas mas que lista para mayores desafíos, para preocuparte por cuestiones mayores a "hacer que algo funcione". Hice este TP, corregí muchos de estos TPs, estuve viendo tus commits: sé que no es casualidad que todo funcione de manera fluida y correcta, sé que no es casualidad la calidad del código. Acá hay mucho talento pero especialmente muchas ganas de dar lo mejor, de ir un poquito más allá de lo que se te pide. Esa siempre ha sido tu marca a lo largo de este curso, y también va a ser tu mejor aliada en la carrera como dev que comenzarás, si es tu deseo, tan pronto como alguien note tu talento. 


  ✅ Respeta la consigna
  ✅ Respeta el diseño dado
  ✅ Respeta el funcionamiento
  ✅ Responsive funciona correctamente

  ✅ HTML semántico
  ✅ Código bien indentado
  ✅ Buenos nombres de clases
  ✅ Buenos nombres de funciones y variables
  ✅ Uso de variables (SASS)

  ✅ Buena estructura y separación de archivos (SASS)
  ✅ Correcto uso de estilos anidados (SASS)
  ✅ Nombres de branchs adecuados

  ✅ Componentización de estilos (SASS)
  ✅ Funciones pequeñas
  ✅ Lógica clara y simple
  ✅ Separación clara de manejo de datos y visualización

  ✅ Reutilización de lógica / funciones
  ✅ Commits con mensajes adecuados

Nota final: **10**
