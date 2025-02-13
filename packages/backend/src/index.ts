import { cors } from 'hono/cors'
import { Hono } from 'hono';
import { Session, User } from 'better-auth';
import { setAuth } from '../auth';

// type Env = {
//     DB: D1Database
// }

type Variables = {
    user: User | null,
    session: Session | null
}

const app = new Hono<{
    Variables: Variables,
    // Bindings: Env
}>()

// Configure CORS
app.use('/*', cors({
    origin: ['http://localhost:3000', 'https://kelastech.com'], // Configure this to match your Next.js domain in production
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true
}))

app.use("*", async (c, next) => {
    const auth = setAuth();
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
})

app.on(["POST", "GET"], "/api/auth/**", async (c) => {
    // dynamic import auth
    const auth = setAuth();
    return await auth.handler(c.req.raw);
});

app.get('/', (c) => {
    return c.json({
        message: `Hello from hono`
    })
})

export default app