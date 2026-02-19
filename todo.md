2026-02-19 16:53:51.309 [error] (node:4) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

See https://www.postgresql.org/docs/current/libpq-ssl.html for libpq SSL mode definitions.
2026-02-19 16:53:51.430 [error] Error [PrismaClientKnownRequestError]: 
Invalid `prisma.testimonial.findMany()` invocation:


The table `public.Testimonial` does not exist in the current database.
    at async o (.next/server/chunks/ssr/[root-of-the-server]__029d3e08._.js:1:6186) {
  code: 'P2021',
  meta: [Object],
  clientVersion: '7.4.0',
  digest: '133786974'
}