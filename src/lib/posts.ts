import type { Localized } from "./projects";

export interface Post {
  slug: string;
  date: string; // ISO, used for sorting and <time>
  readingMinutes: number;
  title: Localized;
  excerpt: Localized;
  tags: string[];
  /**
   * ponytail: a tiny markdown subset (## headings, - bullets, blank-line
   * paragraphs) rendered by <PostBody>, instead of pulling in MDX and a
   * parser for a handful of posts. Move to MDX when a post needs components.
   */
  body: Localized;
}

export const posts: Post[] = [
  {
    slug: "where-an-llm-earns-its-place",
    date: "2026-06-18",
    readingMinutes: 5,
    tags: ["AI", "LLM", "Product"],
    title: {
      en: "Where an LLM earns its place — and where it doesn't",
      es: "Dónde un LLM se gana su lugar — y dónde no",
    },
    excerpt: {
      en: "Most AI features fail before a single token is generated, because the wrong problem was chosen. Here's the filter I use with clients.",
      es: "La mayoría de features de IA fracasan antes de generar un solo token, porque se eligió el problema equivocado. Este es el filtro que uso con clientes.",
    },
    body: {
      en: `Every AI consulting engagement I've taken on starts the same way: someone has decided the product needs AI, and the question I'm handed is "how", when the question that matters is "where".

## The filter

An LLM earns its place when three things are true at once.

- The task has many valid answers rather than one correct one. Summarizing, rewriting, classifying loosely, drafting. If there is exactly one right answer and a deterministic way to compute it, write the function.
- Being wrong is cheap and visible. The user sees the output and can reject it. A wrong suggestion costs a click; a wrong bank transfer costs a lawsuit.
- The input is messy in a way that resists parsing. Free text, mixed formats, human phrasing. If your input is already structured, you probably want a query, not a model.

Miss any one of the three and you are building something that will look impressive in the demo and quietly erode trust in production.

## The failure I see most

Teams reach for an LLM to avoid writing rules, then discover the rules were the easy part. What they actually needed was the data model underneath, and the model is now papering over its absence — expensively, non-deterministically, and without a way to test it.

The tell is when someone asks "how do we make it more accurate" before anyone can say what accurate means for that feature. That's not a prompting problem.

## What to do first

Write down what a correct output looks like, concretely enough that two people would grade the same output the same way. If you can't, you don't have an evaluation, and without an evaluation you don't have a way to know whether any change you make is an improvement.

That document is worth more than the prompt. The prompt is the easy part — it's the thing you'll rewrite twenty times, and each rewrite is only worth doing because the evaluation tells you whether it helped.`,
      es: `Cada trabajo de consultoría de IA que he tomado empieza igual: alguien decidió que el producto necesita IA, y la pregunta que me entregan es "cómo", cuando la pregunta que importa es "dónde".

## El filtro

Un LLM se gana su lugar cuando tres cosas son ciertas a la vez.

- La tarea tiene muchas respuestas válidas en vez de una correcta. Resumir, reescribir, clasificar de forma laxa, redactar. Si hay exactamente una respuesta correcta y una forma determinista de calcularla, escribe la función.
- Equivocarse es barato y visible. El usuario ve la salida y puede rechazarla. Una sugerencia equivocada cuesta un clic; una transferencia bancaria equivocada cuesta una demanda.
- La entrada es desordenada de una forma que resiste el parseo. Texto libre, formatos mezclados, lenguaje humano. Si tu entrada ya está estructurada, probablemente quieres una query, no un modelo.

Si falla cualquiera de las tres, estás construyendo algo que se verá impresionante en el demo y erosionará la confianza en producción.

## El fracaso que más veo

Los equipos recurren a un LLM para evitar escribir reglas, y luego descubren que las reglas eran la parte fácil. Lo que realmente necesitaban era el modelo de datos debajo, y ahora el modelo está tapando su ausencia — de forma cara, no determinista y sin manera de testearlo.

La señal es cuando alguien pregunta "cómo lo hacemos más preciso" antes de que alguien pueda decir qué significa preciso para esa feature. Eso no es un problema de prompting.

## Qué hacer primero

Escribe cómo se ve una salida correcta, con suficiente concreción como para que dos personas califiquen la misma salida igual. Si no puedes, no tienes una evaluación, y sin evaluación no tienes forma de saber si algún cambio que hagas es una mejora.

Ese documento vale más que el prompt. El prompt es la parte fácil — es lo que reescribirás veinte veces, y cada reescritura solo vale la pena porque la evaluación te dice si ayudó.`,
    },
  },
  {
    slug: "streaming-is-a-product-decision",
    date: "2026-05-02",
    readingMinutes: 4,
    tags: ["AI", "UX", "Next.js"],
    title: {
      en: "Streaming is a product decision, not a performance one",
      es: "El streaming es una decisión de producto, no de rendimiento",
    },
    excerpt: {
      en: "Streaming doesn't make the model faster. It changes what the user is doing while they wait — and that's the whole point.",
      es: "El streaming no hace el modelo más rápido. Cambia lo que el usuario hace mientras espera — y ese es todo el punto.",
    },
    body: {
      en: `A streamed response and a buffered one finish at the same time. The tokens arrive at the same rate either way. What changes is that with streaming the user starts reading at token one instead of token nine hundred.

That distinction matters more than it sounds, because it decides where you spend engineering effort.

## What streaming actually buys you

The user can bail early. Half the value of a streamed answer is that three sentences in, someone realizes it's going the wrong direction and stops it — which they cannot do if the first thing they see is the finished output.

It also converts an unexplained wait into visible progress. A spinner for twelve seconds and a response that types itself over twelve seconds feel like different products, and only one of them gets accused of being broken.

## What it costs

Streaming makes error handling harder in a way most implementations get wrong. Once you have flushed bytes to the client, you cannot take them back — so a failure halfway through is not a failed request you can retry, it is a half-written answer the user is already reading.

You need to decide what that looks like before you ship. Appending a plain sentence to the stream is usually better than silence, and always better than a thrown error the client renders as a blank box.

## When not to stream

If the output is structured and the UI can't render it partially, streaming buys nothing and costs complexity. A JSON payload that only becomes meaningful once complete should be a normal request — show a real loading state and skip the machinery.

The question isn't "is this slow". It's "can the user do something useful with a partial answer".`,
      es: `Una respuesta en streaming y una en buffer terminan al mismo tiempo. Los tokens llegan al mismo ritmo en ambos casos. Lo que cambia es que con streaming el usuario empieza a leer en el token uno en vez del token novecientos.

Esa distinción importa más de lo que suena, porque decide dónde inviertes esfuerzo de ingeniería.

## Qué te compra realmente el streaming

El usuario puede abandonar temprano. La mitad del valor de una respuesta en streaming es que a las tres frases alguien se da cuenta de que va en la dirección equivocada y la detiene — algo que no puede hacer si lo primero que ve es la salida terminada.

También convierte una espera inexplicada en progreso visible. Un spinner de doce segundos y una respuesta que se escribe sola durante doce segundos se sienten como productos distintos, y solo a uno de los dos lo acusan de estar roto.

## Qué cuesta

El streaming complica el manejo de errores de una forma que la mayoría de implementaciones resuelve mal. Una vez que enviaste bytes al cliente no puedes recuperarlos — así que un fallo a mitad de camino no es un request fallido que puedes reintentar, es una respuesta a medio escribir que el usuario ya está leyendo.

Tienes que decidir cómo se ve eso antes de lanzar. Agregar una frase simple al stream suele ser mejor que el silencio, y siempre mejor que un error lanzado que el cliente renderiza como una caja en blanco.

## Cuándo no hacer streaming

Si la salida es estructurada y la UI no puede renderizarla parcialmente, el streaming no compra nada y cuesta complejidad. Un payload JSON que solo cobra sentido una vez completo debería ser un request normal — muestra un estado de carga real y ahórrate la maquinaria.

La pregunta no es "¿esto es lento?". Es "¿puede el usuario hacer algo útil con una respuesta parcial?".`,
    },
  },
  {
    slug: "django-and-the-ai-backend",
    date: "2026-03-11",
    readingMinutes: 4,
    tags: ["Python", "Django", "AI"],
    title: {
      en: "Django is a better AI backend than people expect",
      es: "Django es mejor backend para IA de lo que la gente espera",
    },
    excerpt: {
      en: "The AI backend conversation defaults to whatever is newest. Most of what an LLM feature needs, Django already had in 2010.",
      es: "La conversación sobre backends para IA salta a lo más nuevo por defecto. La mayoría de lo que una feature con LLM necesita, Django ya lo tenía en 2010.",
    },
    body: {
      en: `Every AI feature I've shipped ended up needing the same unglamorous list: durable records of what was asked and answered, a job queue for anything slower than a request, per-user quotas, an admin surface so someone non-technical can look at bad outputs, and migrations for the schema that will change five times.

That list is Django's home turf. It is strange how rarely it comes up.

## What the model needs is not the hard part

Calling an LLM is an HTTP request. It is the least interesting code in the system and it will be a small file no matter which framework surrounds it.

What takes the time is everything around it: storing the conversation, associating it with a user, retrying the failures, rate limiting the abuse, and giving support staff a way to see what happened when a customer complains. A framework that hands you the ORM, the migrations, the admin, and the auth is doing more for that list than one that hands you a faster router.

## Where it does need help

Django's request/response cycle is synchronous by default, and LLM calls are slow enough that tying up a worker for twenty seconds is real. That's what the task queue is for — the request enqueues, the worker calls the model, the client polls or subscribes.

Streaming is the genuine friction point. It's workable with ASGI, but it's the part where the framework stops helping and you're wiring things yourself. If the product is streaming-first end to end, that's a legitimate reason to reach elsewhere.

## The actual criterion

Pick the backend by what the feature is mostly made of. If it's mostly model calls with a thin shell around them, use whatever is thinnest. If it's a product with users, billing, permissions, and an audit trail that happens to call a model — that's a web application, and Django has been very good at web applications for a long time.`,
      es: `Cada feature de IA que he entregado terminó necesitando la misma lista poco glamorosa: registros durables de qué se preguntó y qué se respondió, una cola de trabajos para lo que sea más lento que un request, cuotas por usuario, una superficie de administración para que alguien no técnico pueda mirar las salidas malas, y migraciones para el esquema que cambiará cinco veces.

Esa lista es el terreno natural de Django. Es raro lo poco que aparece en la conversación.

## Lo que el modelo necesita no es la parte difícil

Llamar a un LLM es un request HTTP. Es el código menos interesante del sistema y será un archivo pequeño sin importar qué framework lo rodee.

Lo que toma tiempo es todo lo demás: guardar la conversación, asociarla a un usuario, reintentar los fallos, limitar el abuso, y darle a soporte una forma de ver qué pasó cuando un cliente reclama. Un framework que te entrega el ORM, las migraciones, el admin y la autenticación está haciendo más por esa lista que uno que te entrega un router más rápido.

## Dónde sí necesita ayuda

El ciclo request/response de Django es síncrono por defecto, y las llamadas a LLM son lo bastante lentas como para que ocupar un worker veinte segundos sea un problema real. Para eso está la cola de tareas — el request encola, el worker llama al modelo, el cliente hace polling o se suscribe.

El streaming es el punto de fricción genuino. Es viable con ASGI, pero es la parte donde el framework deja de ayudarte y cableas las cosas tú. Si el producto es streaming de punta a punta, esa es una razón legítima para buscar en otro lado.

## El criterio real

Elige el backend según de qué está hecha mayormente la feature. Si es mayormente llamadas al modelo con una capa delgada alrededor, usa lo más delgado que haya. Si es un producto con usuarios, facturación, permisos y traza de auditoría que además llama a un modelo — eso es una aplicación web, y Django lleva mucho tiempo siendo muy bueno en aplicaciones web.`,
    },
  },
];

export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
